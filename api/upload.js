import { handleUpload } from '@vercel/blob/client';

// Vercel Function: handles the two-step client-upload protocol for Vercel Blob.
//
// 1. Browser POSTs `{type:'blob.generate-client-token', payload:{...}}`
//    → we validate & return a short-lived signed token.
// 2. Browser uploads the file directly to Vercel Blob using that token.
// 3. Vercel calls back POSTs `{type:'blob.upload-completed', payload:{...}}`
//    → we run `onUploadCompleted` (good place to record the blob URL in a DB).

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.length === 0) {
    // No allowlist set — allow all (dev mode). Tighten in production.
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const maxBytes = Number(process.env.MAX_UPLOAD_BYTES || 100 * 1024 * 1024);

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (/* pathname, clientPayload */) => {
        // 👉 Production: validate the caller here (session cookie, JWT, etc.)
        //    Throw if not authorized — that blocks the upload.
        return {
          allowedContentTypes: [
            'video/webm',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=h264',
            'video/webm;codecs=vp8',
            'video/mp4',
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: maxBytes,
          // tokenPayload travels with the upload-completed callback.
          tokenPayload: JSON.stringify({ uploadedAt: Date.now() }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Called by Vercel after the client finishes uploading.
        // Store the blob.url somewhere persistent if you need to look it up later.
        const meta = tokenPayload ? JSON.parse(tokenPayload) : {};
        console.log('[upload-complete]', {
          pathname: blob.pathname,
          url: blob.url,
          contentType: blob.contentType,
          ...meta,
        });
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error('[upload-error]', err);
    return res.status(400).json({ error: err.message || 'upload failed' });
  }
}
