/* تفاعل الصف الأول: نطق، لمس، حروف، أرقام، ورسومات تعليمية */
(function () {
  'use strict';
  var arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];
  var numbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢', '١٣', '١٤', '١٥', '١٦', '١٧', '١٨', '١٩', '٢٠'];
  function speak(text, lang) {
    if (!text || !window.speechSynthesis) { if (typeof window.showToast === 'function') window.showToast('النطق غير متاح في هذا المتصفح'); return; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text)); u.lang = lang || (/^[A-Za-z]/.test(text) ? 'en-US' : 'ar-EG'); u.rate = 0.82; u.pitch = 1;
    window.speechSynthesis.speak(u);
  }
  window.speakLearningText = speak;
  function css() {
    if (document.getElementById('primaryTouchStyles')) return;
    var st = document.createElement('style'); st.id = 'primaryTouchStyles';
    st.textContent = '.touch-toolbar{display:flex;flex-wrap:wrap;gap:8px;background:#FFF8E1;border-radius:16px;padding:12px;margin-bottom:16px}.touch-btn{border:0;border-radius:12px;padding:10px 13px;background:#1976D2;color:#fff;font-family:inherit;font-weight:700;cursor:pointer}.touch-btn.alt{background:#43A047}.touch-btn.warn{background:#F57C00}.touch-grid{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px}.touch-card{min-width:42px;min-height:42px;border:2px solid #BBDEFB;background:#E3F2FD;color:#0D47A1;border-radius:12px;font-size:22px;font-weight:800;cursor:pointer;font-family:inherit}.touch-card:active{transform:scale(.91);background:#BBDEFB}.touch-title{font-weight:800;color:#1565C0;margin:12px 0 6px}.touch-draw{background:#F5F5F5;border:2px dashed #90CAF9;border-radius:16px;padding:10px;margin-top:18px}.touch-draw canvas{width:100%;height:180px;background:#fff;border-radius:12px;touch-action:none;display:block}.touch-image{cursor:pointer;transition:transform .2s;outline:3px solid transparent}.touch-image:active{transform:scale(1.03);outline-color:#FFB300}.touch-hint{font-size:12px;color:#757575;margin-top:5px}'; document.head.appendChild(st);
  }
  function addDrawPad(root) {
    var wrap = document.createElement('div'); wrap.className = 'touch-draw';
    wrap.innerHTML = '<div class="touch-title">🎨 ارسم وطبّق</div><div class="touch-hint">استخدم إصبعك لرسم الحرف أو العدد أو الفكرة التي تعلمتها.</div><canvas aria-label="مساحة رسم تفاعلية"></canvas><button class="touch-btn warn" type="button" style="margin-top:8px">مسح الرسم</button>';
    root.appendChild(wrap);
    var canvas = wrap.querySelector('canvas'), ctx = canvas.getContext('2d'), drawing = false;
    function resize() { var r = canvas.getBoundingClientRect(), d = window.devicePixelRatio || 1; canvas.width = r.width * d; canvas.height = r.height * d; ctx.scale(d, d); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#1565C0'; }
    setTimeout(resize, 0);
    function point(e) { var r = canvas.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    function start(e) { drawing = true; var p = point(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
    function move(e) { if (!drawing) return; var p = point(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); }
    function stop() { drawing = false; }
    canvas.addEventListener('pointerdown', start); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', stop); canvas.addEventListener('pointerleave', stop);
    wrap.querySelector('button').onclick = function () { ctx.clearRect(0, 0, canvas.width, canvas.height); };
  }
  function addLearningControls() {
    if (String(window.currentStage || '') !== 'primary' || ['الأول', 'الثاني', 'الثالث'].indexOf(String(window.currentGrade || '')) < 0) return;
    css(); var root = document.getElementById('viewerBody'); if (!root || root.querySelector('[data-touch-learning]')) return;
    var title = document.getElementById('viewerTitle') ? document.getElementById('viewerTitle').textContent : '';
    var text = root.innerText || title;
    var bar = document.createElement('div'); bar.className = 'touch-toolbar'; bar.setAttribute('data-touch-learning', '1');
    bar.innerHTML = '<button class="touch-btn" type="button">🔊 استمع للشرح</button><button class="touch-btn alt" type="button">🔤 حروف تفاعلية</button><button class="touch-btn alt" type="button">🔢 أرقام تفاعلية</button><button class="touch-btn warn" type="button">🎨 ارسم</button>';
    root.insertBefore(bar, root.firstChild);
    bar.children[0].onclick = function () { speak(text.substring(0, 1200), 'ar-EG'); };
    bar.children[1].onclick = function () { showCards('الحروف', arabicLetters, 'ar-EG'); };
    bar.children[2].onclick = function () { showCards('الأرقام', numbers, 'ar-EG'); };
    bar.children[3].onclick = function () { addDrawPad(root); bar.children[3].disabled = true; };
    Array.prototype.forEach.call(root.querySelectorAll('img'), function (img) { img.classList.add('touch-image'); img.setAttribute('role', 'button'); img.setAttribute('tabindex', '0'); var label = img.alt || (document.getElementById('viewerTitle') ? document.getElementById('viewerTitle').textContent : 'صورة تعليمية'); img.addEventListener('click', function () { speak(label, 'ar-EG'); }); img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') speak(label, 'ar-EG'); }); });
  }
  function showCards(label, items, lang) {
    var root = document.getElementById('viewerBody'); if (!root) return;
    var old = root.querySelector('[data-touch-cards]'); if (old) old.remove();
    var box = document.createElement('div'); box.setAttribute('data-touch-cards', '1'); box.innerHTML = '<div class="touch-title">' + label + ' — اضغط للسماع</div><div class="touch-grid"></div>';
    var grid = box.querySelector('.touch-grid'); items.forEach(function (item) { var b = document.createElement('button'); b.className = 'touch-card'; b.type = 'button'; b.textContent = item; b.setAttribute('aria-label', 'نطق ' + item); b.onclick = function () { speak(item, lang); }; grid.appendChild(b); });
    root.insertBefore(box, root.children[1] || null);
  }
  var originalView = window.viewContent;
  window.viewContent = async function () { var r = await originalView.apply(this, arguments); setTimeout(addLearningControls, 80); return r; };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', css); else css();
})();
