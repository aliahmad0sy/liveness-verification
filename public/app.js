import { FaceLandmarker, FilesetResolver } from
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';

// Apps Script Web Apps accept ~50 MB POST bodies. Base64 encoding bloats
// binary by ~33%, so we cap raw video at 25 MB ⇒ ~33 MB on the wire.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
// Hard cap on recording duration. 45s × 4 Mbps = 22.5 MB, fits comfortably.
const MAX_RECORDING_MS = 45_000;

// Where to POST the recorded video. Read from <meta name="liveness-api">
// (set to your Google Apps Script Web App URL — the /exec link). The ?api=
// query string overrides it for per-environment routing.
function resolveApiUrl() {
  const fromQuery = new URLSearchParams(location.search).get('api');
  if (fromQuery) return fromQuery.replace(/\/$/, '');
  const meta = document.querySelector('meta[name="liveness-api"]');
  return (meta?.content || '').trim().replace(/\/$/, '');
}
const API_URL = resolveApiUrl();

// ---------- Embed mode -----------------------------------------------------
// Auto-detect: if we're inside an iframe OR ?embed=1 is set, run as a widget.
// In embed mode we suppress the top-level redirect and notify the parent
// page via postMessage instead.
const IS_EMBED =
  window.self !== window.top ||
  new URLSearchParams(location.search).has('embed');

function postToParent(type, data = {}) {
  if (!IS_EMBED) return;
  try {
    // '*' is fine because we don't send anything sensitive. The parent should
    // still verify event.origin on its side before trusting messages.
    window.parent.postMessage({ source: 'liveness-check', type, ...data }, '*');
  } catch { /* ignore */ }
}

// Tell the parent the iframe is ready as soon as the script loads.
postToParent('ready');

// ---------- DOM ------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const steps = {
  consent: $('step-consent'),
  capture: $('step-capture'),
  upload:  $('step-upload'),
  success: $('step-success'),
  error:   $('step-error'),
};
const consentCb  = $('consent-checkbox');
const startBtn   = $('start-btn');
const retryBtn   = $('retry-btn');
const cam        = $('cam');
const overlay    = $('overlay');
const promptEl   = $('prompt');
const statusEl   = $('status');
const errorEl    = $('error-message');
const progressEl = $('upload-progress');
const dotsEl     = $('progress-dots');
const counterEl  = $('step-counter');

function show(step) {
  for (const k of Object.keys(steps)) steps[k].classList.toggle('hidden', k !== step);
}

// ---------- Consent gate ---------------------------------------------------
consentCb.addEventListener('change', () => { startBtn.disabled = !consentCb.checked; });
startBtn.addEventListener('click', () => {
  postToParent('started');
  begin().catch(fail);
});
retryBtn.addEventListener('click', () => location.reload());

// ---------- Gesture state machine -----------------------------------------
// The full pool of gestures. We randomize order each session so the sequence
// is not predictable — defeats pre-recorded video replays.
const GESTURE_POOL = [
  { id: 'blink',     label: 'ارمش بعينيك' },
  { id: 'smile',     label: 'ابتسم' },
  { id: 'right',     label: 'أدر رأسك إلى اليمين' },
  { id: 'left',      label: 'أدر رأسك إلى اليسار' },
  { id: 'mouthOpen', label: 'افتح فمك' },
  { id: 'browsUp',   label: 'ارفع حاجبيك' },
];

const AR_DIGITS = new Intl.NumberFormat('ar-EG');
const ar = (n) => AR_DIGITS.format(n);

// How many gestures to run this session. Pick a subset of the pool.
const GESTURE_COUNT = 4;

let STEPS = [];
let stepIndex = 0;
let stream = null;
let recorder = null;
let recordedChunks = [];
let landmarker = null;
let rafId = null;
let baselineYaw = null;
let recordingDeadline = null;

// Calibration / thresholds. Tuned conservatively to avoid false positives.
const BLINK_EAR_THRESHOLD = 0.21;   // eye aspect ratio below this = closed
const BLINK_HOLD_FRAMES   = 2;       // frames closed before counting
const SMILE_THRESHOLD     = 0.45;    // mouthSmile blendshape
const YAW_THRESHOLD_DEG   = 18;      // degrees from baseline

let blinkClosedFrames = 0;
let blinkDetected = false;
let smileHoldFrames = 0;
let yawHoldFrames = 0;
let mouthOpenHoldFrames = 0;
let browsUpHoldFrames = 0;

const HOLD_FRAMES = 4;      // require gesture to persist this many frames
const MOUTH_OPEN_THRESHOLD = 0.35;
const BROWS_UP_THRESHOLD = 0.40;

function buildDots() {
  dotsEl.innerHTML = '';
  for (let i = 0; i < STEPS.length; i++) {
    const d = document.createElement('span');
    d.className = 'dot';
    dotsEl.appendChild(d);
  }
}

function setActiveStep() {
  const dots = dotsEl.querySelectorAll('.dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === stepIndex);
    d.classList.toggle('done', i < stepIndex);
  });
  if (stepIndex < STEPS.length) {
    counterEl.textContent = `الخطوة ${ar(stepIndex + 1)} من ${ar(STEPS.length)}`;
    promptEl.textContent = STEPS[stepIndex].label;
    resetDetectorState();
  } else {
    counterEl.textContent = 'اكتمل';
    promptEl.textContent = 'ممتاز — جارٍ الإنهاء…';
  }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Per-step transient state — reset when the active step changes so a gesture
// detected during a previous step doesn't satisfy the next one.
function resetDetectorState() {
  blinkClosedFrames = 0;
  blinkDetected = false;
  smileHoldFrames = 0;
  yawHoldFrames = 0;
  mouthOpenHoldFrames = 0;
  browsUpHoldFrames = 0;
}

// ---------- Main flow ------------------------------------------------------
async function begin() {
  show('capture');
  statusEl.textContent = 'جارٍ طلب الإذن للكاميرا…';

  // 1. Camera — full HD-class capture; the Cloudflare Worker accepts up to
  // 100 MB so we don't need to shrink anything.
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      audio: false,
    });
  } catch (e) {
    throw new Error('تم رفض الوصول إلى الكاميرا. يُرجى السماح بالوصول والمحاولة مرة أخرى.');
  }
  cam.srcObject = stream;
  await cam.play();

  // 2. Recorder — 4 Mbps preserves clear facial detail for review.
  const mime = pickMime();
  if (!mime) throw new Error('متصفحك لا يدعم تسجيل الفيديو.');
  recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  recorder.ondataavailable = (e) => { if (e.data.size) recordedChunks.push(e.data); };
  // No timeslice — iOS Safari and some Android builds drop chunks when one is set.
  recorder.start();

  // Hard stop so we never produce a clip that exceeds Telegram's 50 MB ceiling.
  recordingDeadline = setTimeout(() => {
    if (stepIndex < STEPS.length) {
      fail(new Error('استغرقت العملية وقتاً طويلاً. حاول مجدداً في إضاءة أفضل.'));
    }
  }, MAX_RECORDING_MS);

  // 3. Face detector
  statusEl.textContent = 'جارٍ تحميل أداة التعرف على الوجه…';
  const fileset = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
  );
  landmarker = await FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true,
  });

  statusEl.textContent = 'ابقَ ثابتاً قليلاً لإجراء المعايرة…';
  await calibrate();

  // Pick a randomized subset of gestures for this session.
  STEPS = shuffle(GESTURE_POOL).slice(0, GESTURE_COUNT);
  stepIndex = 0;
  buildDots();
  setActiveStep();
  statusEl.textContent = 'اتبع التعليمات الظاهرة أعلاه.';
  loop();
}

function pickMime() {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
}

// Establish a neutral-head baseline yaw so "right" / "left" are relative to it.
async function calibrate() {
  const samples = [];
  const start = performance.now();
  while (performance.now() - start < 1200) {
    const r = landmarker.detectForVideo(cam, performance.now());
    const yaw = extractYaw(r);
    if (yaw !== null) samples.push(yaw);
    await new Promise((r) => requestAnimationFrame(r));
  }
  if (samples.length < 5) throw new Error('تعذّر اكتشاف وجهك. تأكّد من جودة الإضاءة وأن وجهك في وسط الكاميرا.');
  samples.sort((a, b) => a - b);
  baselineYaw = samples[Math.floor(samples.length / 2)]; // median
}

function loop() {
  rafId = requestAnimationFrame(loop);
  if (cam.readyState < 2) return;
  const res = landmarker.detectForVideo(cam, performance.now());
  if (!res || !res.faceBlendshapes?.length) return;

  const cur = STEPS[stepIndex];
  if (!cur) return;

  switch (cur.id) {
    case 'blink':     if (detectBlink(res))            advance(); break;
    case 'smile':     if (detectHold(detectSmile(res),     'smile'))     advance(); break;
    case 'right':     if (detectHold(detectYaw(res, +1),   'yaw'))       advance(); break;
    case 'left':      if (detectHold(detectYaw(res, -1),   'yaw'))       advance(); break;
    case 'mouthOpen': if (detectHold(detectMouthOpen(res), 'mouthOpen')) advance(); break;
    case 'browsUp':   if (detectHold(detectBrowsUp(res),   'browsUp'))   advance(); break;
  }
}

// Require a gesture to be true for HOLD_FRAMES consecutive frames before
// counting it. Prevents flicker false-positives.
function detectHold(condition, kind) {
  const counterName = `${kind}HoldFrames`;
  const refs = {
    smile: () => smileHoldFrames,
    yaw: () => yawHoldFrames,
    mouthOpen: () => mouthOpenHoldFrames,
    browsUp: () => browsUpHoldFrames,
  };
  const set = (v) => {
    if (kind === 'smile') smileHoldFrames = v;
    else if (kind === 'yaw') yawHoldFrames = v;
    else if (kind === 'mouthOpen') mouthOpenHoldFrames = v;
    else if (kind === 'browsUp') browsUpHoldFrames = v;
  };
  set(condition ? refs[kind]() + 1 : 0);
  return refs[kind]() >= HOLD_FRAMES;
}

function advance() {
  stepIndex++;
  postToParent('progress', { step: stepIndex, total: STEPS.length });
  setActiveStep();
  if (stepIndex >= STEPS.length) finish();
}

// ---------- Detectors ------------------------------------------------------
function blendshape(res, name) {
  const list = res.faceBlendshapes?.[0]?.categories || [];
  return list.find((c) => c.categoryName === name)?.score ?? 0;
}

function detectBlink(res) {
  const l = blendshape(res, 'eyeBlinkLeft');
  const r = blendshape(res, 'eyeBlinkRight');
  const closed = (l + r) / 2 > 0.45;
  if (closed) {
    blinkClosedFrames++;
  } else {
    if (blinkClosedFrames >= BLINK_HOLD_FRAMES) blinkDetected = true;
    blinkClosedFrames = 0;
  }
  return blinkDetected;
}

function detectSmile(res) {
  const l = blendshape(res, 'mouthSmileLeft');
  const r = blendshape(res, 'mouthSmileRight');
  return (l + r) / 2 > SMILE_THRESHOLD;
}

function extractYaw(res) {
  const m = res.facialTransformationMatrixes?.[0]?.data;
  if (!m) return null;
  // 4x4 column-major rotation matrix. Yaw = atan2(-m20, m22) → m[2], m[10]
  // Then convert to degrees.
  const yawRad = Math.atan2(-m[2], m[10]);
  return yawRad * (180 / Math.PI);
}

function detectYaw(res, direction) {
  const yaw = extractYaw(res);
  if (yaw === null || baselineYaw === null) return false;
  const delta = yaw - baselineYaw;
  // Note: video is mirrored visually but raw yaw is camera-frame.
  // Turning your head physically right rotates around vertical → negative yaw in camera frame.
  // We flip the sign so direction=+1 means "user's right".
  const userDelta = -delta;
  return direction > 0 ? userDelta > YAW_THRESHOLD_DEG : userDelta < -YAW_THRESHOLD_DEG;
}

function detectMouthOpen(res) {
  return blendshape(res, 'jawOpen') > MOUTH_OPEN_THRESHOLD;
}

function detectBrowsUp(res) {
  const l = blendshape(res, 'browInnerUp');
  const r = blendshape(res, 'browOuterUpLeft') + blendshape(res, 'browOuterUpRight');
  return l > BROWS_UP_THRESHOLD || (r / 2) > BROWS_UP_THRESHOLD;
}

// ---------- Finish & upload -----------------------------------------------
async function finish() {
  cancelAnimationFrame(rafId);
  if (recordingDeadline) { clearTimeout(recordingDeadline); recordingDeadline = null; }
  promptEl.textContent = 'تم — جارٍ حفظ التسجيل…';
  // Let the buffer flush.
  await new Promise((r) => setTimeout(r, 400));

  await new Promise((resolve) => {
    recorder.onstop = resolve;
    recorder.stop();
  });

  // Stop camera now — we have what we need.
  stream.getTracks().forEach((t) => t.stop());

  const blob = new Blob(recordedChunks, { type: recorder.mimeType });

  if (blob.size > MAX_UPLOAD_BYTES) {
    const mb = (blob.size / 1024 / 1024).toFixed(1);
    fail(new Error(`حجم الفيديو ${mb} ميجابايت أكبر من الحد المسموح. حاول مجدداً في إضاءة أفضل.`));
    return;
  }

  show('upload');
  postToParent('uploading');
  try {
    const result = await uploadToTelegram(blob, recorder.mimeType);
    show('success');
    postToParent('success', { file: result.file });
  } catch (e) {
    fail(e);
  }
}

async function uploadToTelegram(blob, mime) {
  if (!API_URL) {
    throw new Error(
      'لم يُضبط عنوان الخادم. أضف رابط Google Apps Script إلى وسم <meta name="liveness-api"> في index.html.',
    );
  }
  const contentType = mime.split(';')[0];

  // Apps Script Web Apps don't respond to CORS preflight (OPTIONS) requests
  // with proper headers, so any request that triggers a preflight fails.
  // The non-obvious trigger we hit was xhr.upload.onprogress: per the Fetch
  // spec, registering ANY upload event listener demotes the request from
  // "simple" to "non-simple" and forces a preflight, even with the
  // safelisted multipart/form-data Content-Type.
  //
  // fetch() has no upload event hooks, so it stays a simple request and
  // GAS accepts it. The trade-off is no upload progress; we run the
  // <progress> bar in indeterminate mode instead.
  promptEl.textContent = 'جارٍ تجهيز الفيديو…';
  const base64 = await blobToBase64(blob);

  const formData = new FormData();
  formData.append('mime', contentType);
  formData.append('ua', navigator.userAgent.slice(0, 140));
  formData.append('video', base64);

  promptEl.textContent = 'جارٍ الإرسال…';
  // Removing the `value` attribute switches <progress> to indeterminate
  // (a moving stripe) instead of a stuck zero-filled bar.
  progressEl.removeAttribute('value');

  let res;
  try {
    res = await fetch(API_URL, { method: 'POST', body: formData });
  } catch (err) {
    throw new Error(
      `تعذّر الاتصال بالخادم: ${err.message || 'فشل شبكة'}. تأكّد من نشر السكربت بصلاحية "Anyone".`,
    );
  }

  let data = {};
  try { data = await res.json(); } catch {}
  // Apps Script always returns HTTP 200; the real outcome is in data.ok.
  if (data.ok) return { file: data.file };
  throw new Error(data.error || `فشل الإرسال (HTTP ${res.status}).`);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة الفيديو.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      // strip "data:video/webm;base64," prefix to get raw base64
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}

function fail(err) {
  console.error(err);
  if (stream) stream.getTracks().forEach((t) => t.stop());
  if (rafId) cancelAnimationFrame(rafId);
  if (recordingDeadline) { clearTimeout(recordingDeadline); recordingDeadline = null; }
  if (recorder && recorder.state !== 'inactive') {
    try { recorder.stop(); } catch {}
  }
  errorEl.textContent = err.message || String(err);
  show('error');
  postToParent('error', { message: err.message || String(err) });
}

// ---------- Auto-resize the iframe ----------------------------------------
// Report content height to the parent so the iframe can size itself.
if (IS_EMBED) {
  const send = () => postToParent('resize', { height: document.body.scrollHeight });
  new ResizeObserver(send).observe(document.body);
  send();
}
