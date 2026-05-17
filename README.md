# Liveness Check — Vercel Deployment

A single-page identity-verification flow (consent + on-device gesture detection + video capture) deployable as a Vercel project. Video is uploaded directly from the browser to **Vercel Blob**.

## Architecture

```
Browser  ──(1)──▶  /api/upload          (Vercel Function)
   │                  ↓ issues a short-lived signed token
   │  ◀─(2)─── token
   │
   ├──(3)─── PUT video bytes ──▶  Vercel Blob (storage)
   │
   ◀──(4)─── upload-completed callback ──▶ /api/upload
```

The browser never streams the video through the function (Vercel's per-request body limit is 4.5 MB). Instead it uploads directly to Blob, which keeps quality intact end-to-end.

## Deployment

### 1. Push the repo to GitHub / GitLab

```sh
git init && git add . && git commit -m "init"
git remote add origin git@github.com:you/liveness.git && git push -u origin main
```

### 2. Import into Vercel

1. Vercel dashboard → **Add New → Project** → import the repo.
2. Framework preset: **Other**. Build / output settings: leave default (Vercel detects the static `public/` and `api/` folders automatically).
3. Click **Deploy**.

### 3. Connect a Blob store

1. In your new project → **Storage** tab → **Create Database** → **Blob**.
2. Choose a name (e.g. `liveness-videos`) and create.
3. Vercel auto-injects `BLOB_READ_WRITE_TOKEN` into the project's env. No code change needed.
4. Redeploy (Deployments → ⋯ → Redeploy) so the function picks up the env.

### 4. (Recommended) Set `ALLOWED_ORIGINS`

Project → **Settings → Environment Variables** → add:

| Name | Value |
|---|---|
| `ALLOWED_ORIGINS` | `https://yoursite.com,https://www.yoursite.com` |

This restricts which sites can trigger uploads.

That's it — the verification page is live at `https://<your-project>.vercel.app`.

## Using it from your existing site

In any page on `yoursite.com`:

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
      // msg.file  → blob pathname  (use as ID)
      // msg.url   → blob public URL
      console.log('verified', msg);
    }
    if (msg.type === 'resize') iframe.style.height = (msg.height + 4) + 'px';
  });
</script>
```

The full message protocol is documented in [public/host.html](public/host.html).

## Custom domain

In Vercel: Project → **Domains** → add e.g. `verify.yoursite.com`. Then update the `<iframe src>` and the `e.origin` check above to use that host.

## Local development

```sh
npm install
cp .env.local.example .env.local
# get BLOB_READ_WRITE_TOKEN from Vercel dashboard → Storage → Blob → .env.local tab
npx vercel link        # link this folder to the Vercel project
npx vercel env pull    # pulls envs into .env.local automatically (alternative to step above)
npm run dev            # runs `vercel dev` → http://localhost:3000
```

`vercel dev` runs the API functions and serves `public/` exactly as in production. Uploads go to the real Blob store (linked via the token).

## Security checklist before production

| | |
|---|---|
| **HTTPS** | ✅ automatic on Vercel. Required by `getUserMedia`. |
| **`ALLOWED_ORIGINS`** | Set to your real origins. Empty = allow all. |
| **Origin check in parent** | Verify `event.origin` against the iframe's URL before trusting `success` messages — see snippet above. |
| **Tighten `postToParent` target** | In [public/app.js](public/app.js), replace `'*'` with your parent site's origin. |
| **Authorize uploads** | The `onBeforeGenerateToken` hook in [api/upload.js](api/upload.js) is currently open. Add session/JWT validation here — throw to deny. |
| **Blob privacy** | Files are `access: 'public'` with un-guessable random suffixes. URLs are not listed, but anyone with the URL can read. Don't leak the URL to untrusted parties. For stricter privacy, swap to S3/R2 with signed URLs. |
| **Persist references** | The current `onUploadCompleted` only logs. Store the blob URL in your DB if you need to look the video up later. |

## File map

| | |
|---|---|
| `api/upload.js` | Vercel Function — issues Blob upload tokens, receives completion callbacks. |
| `public/index.html` | The verification UI (Arabic, RTL). |
| `public/app.js` | Gesture detection (MediaPipe) + capture (MediaRecorder) + client upload (@vercel/blob/client). Embed mode auto-detected. |
| `public/styles.css` | Dark theme. |
| `public/host.html` | Demo of how a parent page embeds the iframe and listens for messages. |
| `vercel.json` | `Permissions-Policy: camera=(self)`, clean URLs. |
