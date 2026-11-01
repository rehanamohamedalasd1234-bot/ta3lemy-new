// ═══════════════════════════════════════════════════════
// drawing-new.js - نظام الرسم (نسخة محسّنة للموبايل + ذكاء اصطناعي)
// ═══════════════════════════════════════════════════════

// ⚙️ بعد ما تنشر Cloudflare Worker حط رابطه هنا (مثال: https://ai.xxxx.workers.dev)
var DRAWING_AI_URL = '';

var c, ctx, drawing = false;
var currentColor = '#000000';
var currentSize = 5;
var isEraser = false;

var _dwUndo = [], _dwRedo = [], _dwMax = 12;
var _dwDpr = 1, _dwLast = null, _dwPointer = null, _dwBound = false;

function _dwIsMobile() { return window.innerWidth <= 768; }

// ─── تنسيق الموبايل (يُحقن مرة واحدة) ───
function _dwInjectCSS() {
  if (document.getElementById('dwStyle')) return;
  var s = document.createElement('style');
  s.id = 'dwStyle';
  s.textContent =
    '#fullDrawingCanvas{display:block;width:100%;touch-action:none;-webkit-user-select:none;user-select:none;background:#fff}' +
    '@media (max-width:768px){' +
    '#drawingScreen button{min-width:0!important;min-height:0!important;padding:4px 7px!important;font-size:15px!important;line-height:1.2!important;flex:0 0 auto}' +
    '#drawingScreen input[type=color]{width:30px!important;height:30px!important;padding:0!important}' +
    '#drawingScreen{padding-top:0!important}' +
    '}' +
    '#dwAiBtn{position:fixed;left:10px;bottom:70px;z-index:9998;width:40px;height:40px;border-radius:50%;border:none;background:#2E7D32;color:#fff;font-size:20px;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer}' +
    '#dwAiMenu{position:fixed;left:10px;bottom:116px;z-index:9998;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.25);padding:6px;display:none;direction:rtl}' +
    '#dwAiMenu button{display:block;width:100%;border:none;background:none;padding:10px 14px;font-size:14px;text-align:right;cursor:pointer;color:#222}' +
    '#dwAiModal{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;padding:16px}' +
    '#dwAiModal .box{background:#fff;color:#222;border-radius:14px;padding:16px;max-width:420px;width:100%;max-height:80vh;overflow:auto;direction:rtl;line-height:1.8;font-size:15px}' +
    '#dwAiModal .x{margin-top:12px;border:none;background:#2E7D32;color:#fff;padding:8px 18px;border-radius:8px;cursor:pointer}';
  document.head.appendChild(s);
}

// ─── تصغير أزرار الأدوات على الموبايل (أيقونة فقط) ───
function _dwCompactButtons() {
  var scr = document.getElementById('drawingScreen');
  if (!scr || !_dwIsMobile()) return;
  var btns = scr.querySelectorAll('button');
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    if (b.id === 'dwAiBtn' || b.closest('#dwAiMenu') || b.closest('#dwAiModal')) continue;
    if (b.dataset.dwOrig) continue;
    var t = (b.textContent || '').trim();
    var parts = t.split(/\s+/);
    if (parts.length > 1 && !/[\u0600-\u06FF]/.test(parts[0])) {
      b.dataset.dwOrig = t;
      b.title = t;
      b.textContent = parts[0];
    }
  }
}

// ─── ضبط حجم اللوحة لتملأ الشاشة، مع الحفاظ على الرسم ───
function _dwFit(keep) {
  if (!c) return;
  var snap = null, oldW = 0, oldH = 0;
  if (keep && ctx && c.width > 0) {
    snap = document.createElement('canvas');
    snap.width = c.width; snap.height = c.height;
    snap.getContext('2d').drawImage(c, 0, 0);
    oldW = c.width / _dwDpr; oldH = c.height / _dwDpr;
  }

  // المساحة المتاحة = من أعلى اللوحة لحد آخر الشاشة، ناقص العناصر اللي تحتها
  c.style.height = '';
  var top = c.getBoundingClientRect().top;
  var reserve = 0, sib = c.nextElementSibling;
  while (sib) { reserve += sib.offsetHeight || 0; sib = sib.nextElementSibling; }
  var h = Math.max(260, Math.floor(window.innerHeight - top - reserve - 6));
  c.style.height = h + 'px';

  var rect = c.getBoundingClientRect();
  _dwDpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.round(rect.width * _dwDpr);
  c.height = Math.round(rect.height * _dwDpr);
  ctx = c.getContext('2d');
  ctx.setTransform(_dwDpr, 0, 0, _dwDpr, 0, 0);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (snap) ctx.drawImage(snap, 0, 0, oldW, oldH);
}

function _dwSaveState() {
  if (!c) return;
  try {
    var copy = document.createElement('canvas');
    copy.width = c.width; copy.height = c.height;
    copy.getContext('2d').drawImage(c, 0, 0);
    _dwUndo.push(copy);
    if (_dwUndo.length > _dwMax) _dwUndo.shift();
    _dwRedo = [];
  } catch (e) { console.error(e); }
}

function _dwRestore(src) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(src, 0, 0);
  ctx.restore();
}

function _dwBind() {
  if (_dwBound) return;
  _dwBound = true;

  function getPos(e) {
    var r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  c.addEventListener('pointerdown', function (e) {
    if (_dwPointer !== null) return; // إصبع واحد فقط
    e.preventDefault();
    _dwPointer = e.pointerId;
    try { c.setPointerCapture(e.pointerId); } catch (x) {}
    _dwSaveState();
    drawing = true;
    var p = getPos(e);
    _dwLast = p;
    ctx.fillStyle = isEraser ? '#FFFFFF' : currentColor;
    var w = isEraser ? currentSize * 3 : currentSize;
    ctx.beginPath();
    ctx.arc(p.x, p.y, w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });

  c.addEventListener('pointermove', function (e) {
    if (!drawing || e.pointerId !== _dwPointer) return;
    e.preventDefault();
    var p = getPos(e);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineWidth = isEraser ? currentSize * 3 : currentSize;
    var mx = (_dwLast.x + p.x) / 2, my = (_dwLast.y + p.y) / 2;
    ctx.quadraticCurveTo(_dwLast.x, _dwLast.y, mx, my);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx, my);
    _dwLast = p;
  });

  function stop(e) {
    if (e && e.pointerId !== _dwPointer) return;
    drawing = false;
    _dwPointer = null;
    _dwLast = null;
  }
  c.addEventListener('pointerup', stop);
  c.addEventListener('pointercancel', stop);

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var scr = document.getElementById('drawingScreen');
      if (c && scr && scr.offsetParent !== null) _dwFit(true);
    }, 200);
  });
}

// ═══ فتح شاشة الرسم ═══
window.openDrawing = function () {
  if (window.screenHistory) window.screenHistory.push(window.currentScreen);
  if (typeof showScreen === 'function') showScreen('drawingScreen');

  setTimeout(function () {
    c = document.getElementById('fullDrawingCanvas');
    if (!c) return;
    _dwInjectCSS();
    _dwCompactButtons();
    _dwUndo = []; _dwRedo = [];
    _dwFit(false);
    _dwBind();
    _dwSetupAI();
    // إعادة الضبط بعد استقرار الأزرار المصغّرة
    setTimeout(function () { _dwFit(true); }, 150);
  }, 100);
};

// ═══ أدوات الرسم ═══
window.drawingSetColor = function (color) { currentColor = color; isEraser = false; };
window.drawingSetEraser = function () { isEraser = true; };
window.drawingSetSize = function (size) { currentSize = size; };

window.drawingUndo = function () {
  if (!c || !_dwUndo.length) return;
  var cur = document.createElement('canvas');
  cur.width = c.width; cur.height = c.height;
  cur.getContext('2d').drawImage(c, 0, 0);
  _dwRedo.push(cur);
  _dwRestore(_dwUndo.pop());
};

window.drawingRedo = function () {
  if (!c || !_dwRedo.length) return;
  var cur = document.createElement('canvas');
  cur.width = c.width; cur.height = c.height;
  cur.getContext('2d').drawImage(c, 0, 0);
  _dwUndo.push(cur);
  _dwRestore(_dwRedo.pop());
};

window.drawingClearAll = function () {
  if (!c || !ctx) return;
  if (confirm('مسح كل الرسم؟')) {
    _dwSaveState();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.restore();
  }
};

window.drawingSave = function () {
  if (!c) return;
  var link = document.createElement('a');
  link.download = 'my-drawing.png';
  link.href = c.toDataURL();
  link.click();
};

// ═══ إرسال للمالك (كما هو) ═══
window.sendDrawingToOwner = async function (canvas) {
  if (!window.currentUser) {
    if (typeof showToast === 'function') showToast('⚠️ سجل دخول الأول');
    return;
  }
  if (typeof showToast === 'function') showToast('⏳ جاري الإرسال...');
  try {
    var dataUrl = canvas.toDataURL('image/png');
    var blob = await (await fetch(dataUrl)).blob();
    var file = new File([blob], 'drawing.png', { type: 'image/png' });
    var url = await window.uploadFile(file, 'drawings');
    if (!url) throw new Error('فشل الرفع');
    await firebase.firestore().collection('drawing_requests').add({
      studentId: window.currentUser.uid,
      studentName: window.currentUser.name,
      imageUrl: url,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    if (typeof showToast === 'function') showToast('✅ تم الإرسال!');
  } catch (e) {
    console.error(e);
    if (typeof showToast === 'function') showToast('❌ فشل الإرسال');
  }
};

// ═══════════════════════════════════════════════════════
// ✨ الذكاء الاصطناعي (عن طريق Cloudflare Worker)
// ═══════════════════════════════════════════════════════
function _dwSetupAI() {
  var scr = document.getElementById('drawingScreen');
  if (!scr || document.getElementById('dwAiBtn')) return;

  var btn = document.createElement('button');
  btn.id = 'dwAiBtn'; btn.textContent = '✨'; btn.title = 'مساعد الرسم';

  var menu = document.createElement('div');
  menu.id = 'dwAiMenu';
  menu.innerHTML =
    '<button data-a="ideas">💡 اقترح فكرة رسم</button>' +
    '<button data-a="steps">📝 علّمني أرسم...</button>' +
    '<button data-a="feedback">🔍 رأيك في رسمتي</button>';

  var modal = document.createElement('div');
  modal.id = 'dwAiModal';
  modal.innerHTML = '<div class="box"><div id="dwAiText"></div><button class="x">إغلاق</button></div>';

  scr.appendChild(btn); scr.appendChild(menu); scr.appendChild(modal);

  btn.onclick = function () { menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; };
  modal.querySelector('.x').onclick = function () { modal.style.display = 'none'; };
  menu.onclick = function (e) {
    var a = e.target.getAttribute && e.target.getAttribute('data-a');
    if (!a) return;
    menu.style.display = 'none';
    window.drawingAI(a);
  };
}

function _dwShow(text) {
  var m = document.getElementById('dwAiModal');
  var t = document.getElementById('dwAiText');
  if (!m || !t) return;
  t.textContent = text;
  m.style.display = 'flex';
}

function _dwSmallImage() {
  var max = 768, sc = Math.min(1, max / Math.max(c.width, c.height));
  var tmp = document.createElement('canvas');
  tmp.width = Math.round(c.width * sc); tmp.height = Math.round(c.height * sc);
  tmp.getContext('2d').drawImage(c, 0, 0, tmp.width, tmp.height);
  return tmp.toDataURL('image/jpeg', 0.7).split(',')[1];
}

window.drawingAI = async function (type) {
  if (!DRAWING_AI_URL) {
    _dwShow('خدمة الذكاء الاصطناعي لسه ما اتفعلتش. (لازم يتحط رابط الـ Worker في أول ملف drawing-new.js)');
    return;
  }
  var payload = { type: type };
  if (type === 'steps') {
    var what = prompt('عايز تتعلم ترسم إيه؟ (مثلاً: قطة، شجرة، بيت)');
    if (!what) return;
    payload.topic = what;
  }
  if (type === 'feedback') payload.image = _dwSmallImage();

  _dwShow('⏳ استنى لحظة...');
  try {
    var res = await fetch(DRAWING_AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    _dwShow(data.text || 'مفيش رد، جرّب تاني.');
  } catch (e) {
    console.error(e);
    _dwShow('❌ حصلت مشكلة في الاتصال، جرّب تاني بعد شوية.');
  }
};
