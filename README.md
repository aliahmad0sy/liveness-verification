# Liveness Check — Vercel + Cloudflare Worker → Telegram

A single-page identity-verification flow (consent + on-device gesture detection
+ video capture). The verification UI is served from Vercel; the recorded
video is uploaded — at full quality — to a tiny Cloudflare Worker that
forwards it to your Telegram chat via Bot API.

## Why two providers?

Vercel serverless functions cap request bodies at **4.5 MB**, which forces
either a heavily compressed clip or an external storage hop. Cloudflare
Workers accept up to **100 MB on the free plan**, so we keep the recording
at 1280×720 @ 4 Mbps and stream it straight through.

```
Browser  ──(1)──▶  Cloudflare Worker
   │  (raw video bytes, up to ~30 MB)        │
   │                                          │ multipart sendVideo
   │                                          ▼
   │                                  Telegram Bot API
   │                                          │
   │                                          ▼
   │                                  Your private chat  📥
   ◀──(2)──  { ok: true }
```

Vercel just hosts the static page (`public/`) — no functions, no storage.

## Setup

### 1. Create a Telegram bot

1. Open Telegram, message `@BotFather`, send `/newbot`, follow the prompts.
2. Copy the bot token (e.g. `123456789:AAH...`).
3. Start a chat with your new bot (search its username, press Start).
4. Get your numeric chat id — easiest way: message `@userinfobot` and copy the
   `Id` it replies with. (For a private channel, forward a message from the
   channel to `@RawDataBot` and look for `forward_from_chat.id`.)

### 2. Deploy the Cloudflare Worker

```sh
cd worker
npm install
npx wrangler login                       # browser sign-in to Cloudflare
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler deploy
```

Copy the URL `wrangler deploy` prints — looks like
`https://liveness-telegram-bridge.<your-subdomain>.workers.dev`.

### 3. Tell the page where the Worker lives

In `public/index.html`, set the meta tag:

```html
<meta name="liveness-api" content="https://liveness-telegram-bridge.<your-subdomain>.workers.dev/">
```

### 4. Deploy the page to Vercel

```sh
git add . && git commit -m "configure worker URL"
git push                                # triggers Vercel deploy
```

Or use the Vercel dashboard — **Add New → Project** → import the repo. No
environment variables needed on Vercel.

### 5. (Recommended) Lock the Worker to your domain

After Vercel gives you a URL, edit `worker/wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGIN = "https://your-project.vercel.app"
```

Then `cd worker && npx wrangler deploy` again. The Worker will reject CORS
preflights from any other origin.

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

The full message protocol is in [public/host.html](public/host.html).

## Local development

Static page (Vercel):

```sh
npm install
npm run dev                      # http://localhost:3000
```

Worker (Cloudflare):

```sh
cd worker
npm install
npx wrangler dev                 # http://localhost:8787
```

While developing locally, point the meta tag at `http://localhost:8787` and
the page at `http://localhost:3000` will hit your local Worker.

## Limits & trade-offs

| | |
|---|---|
| **Capture quality** | 1280×720 @ 4 Mbps. No compression hop — Telegram receives exactly what the camera produced. |
| **Max recording duration** | 60 s. After that the session fails with a clear message. At 4 Mbps that's ~30 MB, well under Telegram's 50 MB cap. |
| **Max upload size** | 45 MB (client-side check). Telegram Bot API caps `sendVideo` at 50 MB. |
| **Worker request size** | 100 MB on Cloudflare free plan, 500 MB on paid. |
| **Failover** | If Telegram rejects `sendVideo` (rare; usually container-related), the Worker retries with `sendDocument` so the bytes still reach you. |
| **No retention** | Bytes pass through the Worker and are not stored. Telegram is the only persistent copy. |

## Security checklist before production

| | |
|---|---|
| **HTTPS** | ✅ automatic on Vercel and Workers. Required by `getUserMedia`. |
| **`ALLOWED_ORIGIN`** | Set in `worker/wrangler.toml` to your real origin. Empty = allow all. |
| **Origin check in parent** | Verify `event.origin` against the iframe's URL before trusting `success` messages — see snippet above. |
| **Tighten `postToParent` target** | In [public/app.js](public/app.js), replace `'*'` with your parent site's origin. |
| **Bot token secrecy** | Treat `TELEGRAM_BOT_TOKEN` like a password — never commit it. The Worker stores it as a secret, not in code. |
| **Authorize requests** | The Worker currently accepts any POST from an allowed origin. Add session/JWT validation before forwarding if the page is public. |

## File map

| | |
|---|---|
| `public/index.html` | The verification UI (Arabic, RTL). Holds the `<meta name="liveness-api">` Worker URL. |
| `public/app.js` | Gesture detection (MediaPipe) + capture (MediaRecorder) + upload via XHR. Embed mode auto-detected. |
| `public/styles.css` | Dark theme. |
| `public/host.html` | Demo of how a parent page embeds the iframe and listens for messages. |
| `worker/src/index.js` | The Cloudflare Worker — receives the video and forwards it to Telegram. |
| `worker/wrangler.toml` | Worker config (name, vars). |
| `worker/README.md` | Worker-specific deployment notes. |
| `vercel.json` | `Permissions-Policy: camera=(self)`, clean URLs. |
