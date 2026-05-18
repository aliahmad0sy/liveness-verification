# Liveness Check — Vercel + Cloudflare Worker → Telegram

A single-page identity-verification flow (consent + on-device gesture detection
+ video capture). The verification UI is served from Vercel; the recorded
video is sent to a Cloudflare Worker that forwards it to your Telegram chat
via Bot API.

## Architecture

```
Browser  ──(1)──▶  Cloudflare Worker
   │  (raw video bytes, full quality)      │
   │                                       │ multipart sendVideo
   │                                       ▼
   │                              Telegram Bot API
   │                                       │
   │                                       ▼
   │                              Your private chat  📥
   ◀──(2)──  { ok: true, file: "..." }
```

Vercel just hosts the static page (`public/`) — no serverless functions
involved, so Vercel's 4.5 MB body cap doesn't apply.

## Why Cloudflare Worker (not Apps Script)?

We tried Google Apps Script first. The blockers were:

| Problem | Cause |
|---|---|
| `xhr.upload.onprogress` → CORS preflight | Apps Script doesn't respond to OPTIONS with CORS headers |
| FormData body → `empty body` errors | Apps Script doesn't reliably parse `multipart/form-data` on cross-origin POST |
| Base64 over text/plain → 33% payload bloat | Pushes against Apps Script's ~50 MB POST limit |

Cloudflare Workers handle all of these natively: 100 MB body cap on the free
plan, proper CORS preflight, raw binary POST, real upload progress, lower
latency.

## Setup

### 1. Create a Telegram bot

1. Telegram → message `@BotFather` → `/newbot` → follow the prompts.
2. Copy the bot token (e.g. `123456789:AAH...`).
3. Start your bot so it can DM you.
4. Get your chat id: message `@userinfobot`, copy the `Id` it replies with.
   (For a private channel: forward a message from the channel to `@RawDataBot`
   and look for `forward_from_chat.id`.)

### 2. Deploy the Worker

See [`worker/README.md`](worker/README.md) for the full step-by-step. Short
version:

```sh
cd worker
npm install
npx wrangler login                              # one-time auth
npx wrangler secret put TELEGRAM_BOT_TOKEN      # paste token
npx wrangler secret put TELEGRAM_CHAT_ID        # paste chat id
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL (e.g.
`https://liveness-telegram-bridge.<user>.workers.dev`). Copy that.

### 3. Tell the page where the Worker lives

In `public/index.html`, paste the Worker URL into the meta tag:

```html
<meta name="liveness-api" content="https://liveness-telegram-bridge.<user>.workers.dev" />
```

### 4. Push to Vercel

```sh
git add public/index.html && git commit -m "wire up worker url" && git push
```

Vercel redeploys automatically.

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
      console.log('verified', msg);   // { file: "verification-…webm" }
    }
    if (msg.type === 'resize') iframe.style.height = (msg.height + 4) + 'px';
  });
</script>
```

Full message protocol is in [`public/host.html`](public/host.html).

## Local development

```sh
npm install
npm run dev                      # http://localhost:3000

# in another tab, run the worker locally
cd worker && npx wrangler dev    # http://localhost:8787
```

Then set `<meta name="liveness-api" content="http://localhost:8787" />` (or
visit the page with `?api=http://localhost:8787`).

## Limits & trade-offs

| | |
|---|---|
| **Capture quality** | 1280×720 @ 4 Mbps |
| **Max recording duration** | 60 s. At 4 Mbps that's ~30 MB. |
| **Max upload size** | 45 MB (Telegram's 50 MB ceiling minus margin) |
| **Worker request body** | 100 MB on free plan |
| **Failover** | If Telegram rejects `sendVideo`, the Worker retries with `sendDocument`. |
| **No retention** | Bytes pass through the Worker and are not stored. Telegram is the only persistent copy. |

## Security checklist before production

| | |
|---|---|
| **HTTPS** | ✅ automatic on Vercel and Workers. Required by `getUserMedia`. |
| **Origin check in parent** | Verify `event.origin` against the iframe URL before trusting `success` messages. |
| **Tighten `postToParent` target** | In [`public/app.js`](public/app.js), replace `'*'` with your parent site's origin. |
| **Restrict CORS on the Worker** | Set `ALLOWED_ORIGIN` in `worker/wrangler.toml` (or via `wrangler secret put ALLOWED_ORIGIN`) so only your Vercel domain can POST. |
| **Bot token secrecy** | Stored as a Worker secret — never appears in client code or version control. |

## File map

| | |
|---|---|
| `public/index.html` | The verification UI (Arabic, RTL). Holds the `<meta name="liveness-api">` Worker URL. |
| `public/app.js` | Gesture detection (MediaPipe) + capture (MediaRecorder) + binary upload via XHR. Embed mode auto-detected. |
| `public/styles.css` | Light theme matching consumer-app conventions. |
| `public/host.html` | Demo of how a parent page embeds the iframe and listens for messages. |
| `worker/src/index.js` | Cloudflare Worker — receives the video and forwards it to Telegram. |
| `worker/wrangler.toml` | Worker config (name, compatibility date, optional ALLOWED_ORIGIN). |
| `worker/README.md` | Worker-specific deployment notes. |
| `vercel.json` | `Permissions-Policy: camera=(self)`, clean URLs. |
