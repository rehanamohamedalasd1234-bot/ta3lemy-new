/* منهج رياض الأطفال KG1 — اللغة العربية — الترم الأول 2026/2027
 * مصدر المنهج: كتاب وزارة التربية والتعليم الرسمي المرفق في بيانات JSON.
 * المسار: رياض الأطفال > KG1 > اللغة العربية > الترم الأول.
 */
(function () {
  'use strict';
  var oldOpenGrade = window.openGrade;
  var oldOpenSubject = window.openSubject;
  var SOURCE = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/KG/KG1/Term1/StudentBook/Arabic_langugae_kg1_t1.pdf';
  var dataPromise = null;
  var STAGE_ID = 'kindergarten_languages';
  var subject = { id: 'kg_arabic', name: 'عربي', icon: '🔤', color: '#C2185B' };

  function isKG1() { return window.currentStage === STAGE_ID && window.currentGrade === 'KG1'; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function go(id) { if (window.screenHistory) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function loadData() {
    if (!dataPromise) dataPromise = fetch('./kg1-arabic-2026-2027-t1.json').then(function (r) { if (!r.ok) throw Error('تعذر تحميل منهج KG1'); return r.json(); });
    return dataPromise;
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text || ''); u.lang = 'ar-EG'; u.rate = 0.82; window.speechSynthesis.speak(u);
  }
  function subjectsScreen() {
    var list = document.getElementById('subjectsList');
    var title = document.getElementById('subjectsTitle');
    if (title) title.textContent = 'KG1 — المواد';
    if (!list) return;
    list.innerHTML = '<div style="grid-column:1/-1;background:linear-gradient(135deg,#FFF3E0,#FCE4EC);border-radius:20px;padding:20px;text-align:center;margin-bottom:4px"><div style="font-size:48px">🌈📚</div><h2 style="color:#AD1457;margin:8px 0">المستوى الأول رياض الأطفال</h2><p style="line-height:1.9;margin:0">منهج اللغة العربية الرسمي 2026/2027<br>استمع، المس، تحدث، وتتبع الحروف بطريقة ممتعة.</p></div><button class="subject-card" data-kg1-subject="arabic" style="border:2px solid #C2185B;background:#fff"><div class="subject-icon" style="background:#FCE4EC;color:#C2185B">📖</div><div class="subject-name">اللغة العربية<br><small>الترم الأول • 3 وحدات</small></div></button><div style="grid-column:1/-1;text-align:center;margin-top:10px"><a href="' + SOURCE + '" target="_blank" rel="noopener" style="color:#AD1457;font-weight:bold">📘 فتح كتاب الوزارة الرسمي</a></div>';
    var button = list.querySelector('[data-kg1-subject]');
    if (button) button.onclick = function () { openSubjectKG(); };
  }
  function openSubjectKG() {
    window.currentSubject = subject.name;
    var title = document.getElementById('termsTitle'); var header = document.getElementById('termsHeader'); var list = document.getElementById('termsList');
    if (title) title.textContent = subject.name;
    if (header) header.textContent = 'KG1 — اللغة العربية — 2026/2027';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #C2185B"><b>منهج رسمي تفاعلي لرياض الأطفال</b><p style="line-height:1.9;margin-bottom:0">ثلاث وحدات تبدأ بالتهيئة، ثم أنا وأسرتي، ثم الطبيعة من حولي. اضغط على الدروس للاستماع إلى الشرح، واستخدم أنشطة اللمس والرسم.</p></div><div class="term-card"><div class="term-header"><div class="term-icon">📘</div><div class="term-title">الترم الأول 2026/2027</div><div class="term-count">3 وحدات</div></div><div class="term-sections"><button class="section-chip" data-kg1-open="lessons">📄 الدروس</button><button class="section-chip" data-kg1-open="activities">🎲 الأنشطة</button><button class="section-chip" data-kg1-open="reviews">🔁 المراجعات</button><button class="section-chip" data-kg1-open="letters">🔤 الحروف</button><button class="section-chip" data-kg1-open="exercises">✏️ التدريبات</button></div></div><div class="lesson-body" style="margin-top:14px;font-size:13px"><b>المصدر:</b> كتاب اللغة العربية رياض الأطفال المستوى الأول، الفصل الدراسي الأول 2026/2027، صفحات 4–94.</div>';
    list.querySelectorAll('[data-kg1-open]').forEach(function (b) { b.onclick = function () { openContentKG(b.getAttribute('data-kg1-open')); }; });
    go('termsScreen');
  }
  function openContentKG(type) {
    var list = document.getElementById('contentList'); var title = document.getElementById('contentTitle'); var head = document.getElementById('contentHeaderTitle'); var sub = document.getElementById('contentHeaderSub');
    var map = { lessons: '📄 الدروس والقصص', activities: '🎲 الأنشطة والأغاني', reviews: '🔁 المراجعات', letters: '🔤 ركن الحروف', exercises: '✏️ تدريبات تفاعلية' };
    if (title) title.textContent = map[type] || 'محتوى KG1';
    if (head) head.textContent = 'اللغة العربية — KG1';
    if (sub) sub.textContent = 'الترم الأول 2026/2027 — مصدر رسمي';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (x) {
        if (type === 'letters') return !!x.letter;
        if (type === 'activities') return x.type === 'activities';
        if (type === 'reviews') return x.type === 'reviews';
        if (type === 'exercises') return x.type === 'lessons' || x.type === 'activities';
        return x.type === 'lessons';
      });
      rows.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      if (!rows.length) { list.innerHTML = '<div class="empty-state">لا يوجد محتوى لهذا القسم.</div>'; return; }
      list.innerHTML = rows.map(function (x, i) { return '<button class="content-item" data-kg1-item="' + i + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + (x.letter ? '🔤' : x.type === 'reviews' ? '🔁' : x.type === 'activities' ? '🎲' : '📘') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(x.title) + '</div><div class="content-item-sub">' + esc(x.unit) + ' • صفحة ' + esc(x.page) + '</div></div><div class="content-item-arrow">‹</div></button>'; }).join('');
      list.querySelectorAll('[data-kg1-item]').forEach(function (b) { b.onclick = function () { viewKG(rows[Number(b.getAttribute('data-kg1-item'))]); }; });
    }).catch(function () { if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل منهج KG1. تحقق من الاتصال ثم أعد المحاولة.</div>'; });
  }
  function viewKG(x) {
    var list = document.getElementById('contentList'); var title = document.getElementById('contentTitle');
    if (title) title.textContent = x.title;
    var objective = x.objectives && x.objectives.length ? '<h3>أهداف التعلم</h3><ul>' + x.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #C2185B"><div style="font-size:12px;color:#AD1457;font-weight:bold">' + esc(x.unit) + ' • صفحة ' + esc(x.page) + '</div><h2>' + esc(x.title) + '</h2>' + (x.letter ? '<button id="kgLetter" style="display:block;margin:12px auto;font-size:72px;font-weight:bold;color:#C2185B;background:#FCE4EC;border:0;border-radius:24px;padding:8px 34px;cursor:pointer">' + esc(x.letter) + '</button>' : '') + '<p style="white-space:pre-line;line-height:2">' + esc(x.content) + '</p>' + objective + (x.activity ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>🎲 نشاط تفاعلي</b><p>' + esc(x.activity) + '</p></div>' : '') + (x.question ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>❓ سؤال سريع</b><p>' + esc(x.question) + '</p><details><summary>إظهار الإجابة</summary><p>' + esc(x.answer || '') + '</p></details></div>' : '') + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="section-chip" id="kgSpeak">🔊 استمع للشرح</button><button class="section-chip" id="kgDraw">✏️ ارسم وتدرب</button></div><p style="font-size:12px;color:#777;margin-top:14px">المصدر الرسمي: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب الوزارة</a></p></article>';
    var text = (x.title || '') + '. ' + (x.speak || x.content || '');
    var speakBtn = document.getElementById('kgSpeak'); if (speakBtn) speakBtn.onclick = function () { speak(text); };
    var letter = document.getElementById('kgLetter'); if (letter) letter.onclick = function () { speak((x.letter || '') + '. ' + (x.speak || '')); };
    var draw = document.getElementById('kgDraw'); if (draw) draw.onclick = function () { if (window.openDrawing) window.openDrawing(); else speak('افتح لوحة الرسم وتدرب على كتابة الحرف'); };
  }
  window.openGrade = function (id, name) { return oldOpenGrade.apply(this, arguments); };
  window.openSubject = function (id, name) { if (isKG1() && (id === 'kg_arabic' || name === 'عربي')) { openSubjectKG(); return; } return oldOpenSubject.apply(this, arguments); };
})();
