# Liveness Check — Vercel + Telegram

A single-page identity-verification flow (consent + on-device gesture detection
+ video capture) deployable as a Vercel project. The recorded video is sent
directly to a Telegram chat via a bot — no external storage required.

## Architecture

```
Browser  ──(1)──▶  /api/telegram   (Vercel Function)
   │                  ↓ forwards multipart/form-data
   │                  ▼
   │           Telegram Bot API  (sendVideo)
   │                  ↓
   │           Your private chat  📥
```

Because Vercel's serverless body limit is 4.5 MB, the client records at 640×480
and ~700 kbps so the resulting clip stays comfortably under that ceiling. The
function in `api/telegram.js` then wraps the bytes in multipart/form-data and
calls Telegram's `sendVideo` endpoint.

## Setup

### 1. Create a Telegram bot

1. Open Telegram, message `@BotFather`, send `/newbot`, follow the prompts.
2. Copy the bot token (looks like `123456789:AAH...`).
3. Start a chat with your new bot (search its username, press Start).
4. Get your numeric chat id — easiest way: message `@userinfobot` and copy the
   `Id` it replies with. (For a private channel, forward a message from the
   channel to `@RawDataBot` and look for `forward_from_chat.id`.)

### 2. Push to GitHub and import into Vercel

```sh
git init && git add . && git commit -m "init"
git remote add origin git@github.com:you/liveness.git && git push -u origin main
```

Vercel dashboard → **Add New → Project** → import the repo. Framework preset:
**Other**. Click **Deploy**.

### 3. Set environment variables

Project → **Settings → Environment Variables**:

| Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | the token from BotFather |
| `TELEGRAM_CHAT_ID` | your numeric chat id |
| `ALLOWED_ORIGINS` | (optional) `https://yoursite.com,https://www.yoursite.com` |

Redeploy so the function picks up the env.

That's it — the verification page is live at `https://<your-project>.vercel.app`,
and every completed session lands in your Telegram chat as a video message with
caption (timestamp, size, IP, User-Agent).

## Using it from your existing site

```html
<iframe
  src="https://<your-project>.vercel.app/?embed=1"
  allow="camera"
  width="100%" height="600"
  style="border:0"
></iframe>

<script>
  const iframe = document.querySelector('iframe');
  window.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow) return;
    if (e.origin !== 'https://<your-project>.vercel.app') return;
    const msg = e.data;
    if (msg?.source !== 'liveness-check') return;

    if (msg.type === 'success') {
      // msg.file → filename that was forwarded to Telegram
      console.log('verified', msg);
    }
    if (msg.type === 'resize') iframe.style.height = (msg.height + 4) + 'px';
  });
</script>
```

## Local development

```sh
npm install
cp .env.local.example .env.local
# fill in TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
npx vercel link
npm run dev            # runs `vercel dev` → http://localhost:3000
```

## Limits & trade-offs

| | |
|---|---|
| **Max video size** | ~4.3 MB (Vercel serverless body limit minus margin). Enforced client-side; oversize uploads are rejected before they leave the browser. |
| **Max recording duration** | 30 s. After that the session fails with a clear message. |
| **Video quality** | 640×480 @ 700 kbps. Lower than the original 1280×720 @ 4 Mbps — necessary trade-off to fit within the body cap without an external store. |
| **Telegram per-video cap** | 50 MB via Bot API. Well above what we send. |
| **Failover** | If Telegram rejects `sendVideo` (rare; usually container-related), the function retries with `sendDocument` so the bytes still reach you. |
| **No retention on Vercel** | The bytes pass through the function and are not stored on Vercel. Telegram is the only persistent copy. |

## Security checklist before production

| | |
|---|---|
| **HTTPS** | ✅ automatic on Vercel. Required by `getUserMedia`. |
| **`ALLOWED_ORIGINS`** | Set to your real origins. Empty = allow all. |
| **Origin check in parent** | Verify `event.origin` against the iframe's URL before trusting `success` messages — see snippet above. |
| **Tighten `postToParent` target** | In [public/app.js](public/app.js), replace `'*'` with your parent site's origin. |
| **Bot token secrecy** | Treat `TELEGRAM_BOT_TOKEN` like a password — never commit it. Anyone with it can post to your chat. |
| **Authorize requests** | The function currently accepts any POST. Add session/JWT validation before forwarding to Telegram if the page is public. |

## File map

| | |
|---|---|
| `api/telegram.js` | Vercel Function — receives the recorded video and forwards it to Telegram. |
| `public/index.html` | The verification UI (Arabic, RTL). |
| `public/app.js` | Gesture detection (MediaPipe) + capture (MediaRecorder) + upload to `/api/telegram`. Embed mode auto-detected. |
| `public/styles.css` | Dark theme. |
| `public/host.html` | Demo of how a parent page embeds the iframe and listens for messages. |
| `vercel.json` | `Permissions-Policy: camera=(self)`, clean URLs. |
