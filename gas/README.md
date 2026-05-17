# Telegram bridge — Google Apps Script

A web-app endpoint deployed on Google Apps Script. Receives a base64-encoded
verification video from the browser and forwards it to a Telegram chat via
Bot API. Designed for users who already host other endpoints on Apps Script
and prefer to keep everything in one place.

## Why base64?

Apps Script Web Apps don't accept raw binary POST bodies and don't handle CORS
preflight cleanly. We base64-encode the video on the client and send a JSON
string with `Content-Type: text/plain` — a "simple" CORS request, so the
browser skips the preflight that Apps Script would mishandle.

The trade-off: base64 inflates payload by ~33%, so we cap the recording at
~25 MB binary (≈33 MB on the wire) to stay under Apps Script's POST limits.

## Deploy

1. Open https://script.google.com → **New project**.
2. Replace the default `Code.gs` content with [`Code.gs`](Code.gs) from this
   folder.
3. Click the **gear icon (Project Settings)** in the left sidebar.
4. Scroll to **Script Properties** → **Add script property**:

   | Property | Value |
   |---|---|
   | `TELEGRAM_BOT_TOKEN` | the token from `@BotFather` |
   | `TELEGRAM_CHAT_ID` | your numeric chat id (from `@userinfobot`) |

5. Click **Save script properties**.
6. Top right → **Deploy** → **New deployment**.
7. Click the gear next to "Select type" → **Web app**.
8. Settings:

   | Field | Value |
   |---|---|
   | Description | `liveness-telegram-bridge` (or anything) |
   | Execute as | **Me (your@email)** |
   | Who has access | **Anyone** |

9. Click **Deploy**. The first time, Google will ask for permission to call
   external services (Telegram). Approve it.
10. Copy the **Web app URL** it shows (`https://script.google.com/macros/s/.../exec`).
11. Paste that URL into `public/index.html`:

    ```html
    <meta name="liveness-api" content="https://script.google.com/macros/s/.../exec" />
    ```

## Updating the script

After editing `Code.gs`, you must redeploy for changes to take effect:

- **Deploy → Manage deployments** → pencil icon next to the existing
  deployment → set **Version: New version** → **Deploy**.

The Web app URL stays the same across versions; no need to touch
`index.html` again.

## Local testing

There's no local emulator for Apps Script. Test by deploying and POSTing
to the `/exec` URL from your browser. The script's `console.log` /
`Logger.log` output is visible under **Executions** in the editor.

## Quotas (free tier)

| | |
|---|---|
| URL Fetch calls / day | 20,000 |
| Total runtime / day | 90 min |
| Single execution | 6 min |
| POST body | ~50 MB (undocumented; tested) |

These are generous for moderate verification volumes. Workspace accounts
get higher limits.
