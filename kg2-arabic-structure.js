/* منهج رياض الأطفال KG2 — اللغة العربية — الفصل الأول 2026/2027
 * المصدر: كتاب الطالب الرسمي لوزارة التربية والتعليم المصرية.
 * المحتوى ثابت محليًا في kg2-arabic-2026-2027-t1.json؛ لا يعتمد على Firebase.
 */
(function () {
  'use strict';
  var previousOpenSubject = window.openSubject;
  var SOURCE = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/KG/KG2/Term1/StudentBook/Arabic_langugae_kg2_t1.pdf';
  var dataPromise = null;
  var STAGE_ID = 'kindergarten_languages';
  var subject = { id: 'kg_arabic', name: 'عربي', icon: '🔤', color: '#C2185B' };

  function isKG2() { return window.currentStage === STAGE_ID && window.currentGrade === 'KG2'; }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function go(id) {
    if (window.screenHistory) window.screenHistory.push(window.currentScreen);
    if (window.showScreen) window.showScreen(id);
  }
  function loadData() {
    if (!dataPromise) dataPromise = fetch('./kg2-arabic-2026-2027-t1.json').then(function (response) {
      if (!response.ok) throw Error('تعذر تحميل منهج KG2');
      return response.json();
    });
    return dataPromise;
  }
  function speak(text) {
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text || '');
    utterance.lang = 'ar-EG'; utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }
  function openStageBroadcast() {
    if (typeof window.openBroadcast !== 'function') return;
    var result = window.openBroadcast();
    if (window.currentRole === 'teacher') setTimeout(function () {
      var stage = document.getElementById('liveStage');
      var grade = document.getElementById('liveGrade');
      var subjectField = document.getElementById('liveSubject');
      var access = document.getElementById('liveAccessMode');
      if (stage) { stage.value = STAGE_ID; stage.dispatchEvent(new Event('change', { bubbles: true })); }
      if (grade) grade.value = 'KG2';
      if (subjectField) subjectField.value = subject.name;
      if (access) access.value = 'approval';
    }, 50);
    return result;
  }
  function openSubjectKG2() {
    window.currentSubject = subject.name;
    var title = document.getElementById('termsTitle');
    var header = document.getElementById('termsHeader');
    var list = document.getElementById('termsList');
    if (title) title.textContent = subject.name;
    if (header) header.textContent = 'KG2 — اللغة العربية — 2026/2027';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #C2185B"><b>اللغة العربية — KG2</b><p style="line-height:1.9;margin-bottom:0">الفصل الأول كما ورد في كتاب الوزارة: غذائي، أدواتي وألعابي، وسائل المواصلات. المحتوى التعليمي والأنشطة محفوظة محليًا على المنصة.</p><p style="font-size:12px;margin-bottom:0">النطق هنا قراءة آلية من الجهاز، وليس تسجيلًا صوتيًا أصليًا من الكتاب.</p></div>' +
      '<div class="term-card"><div class="term-header"><div class="term-icon">📘</div><div class="term-title">الفصل الأول 2026/2027</div><div class="term-count">3 وحدات</div></div><div class="term-sections">' +
      '<button class="section-chip" data-kg2-open="lessons">📄 الدروس</button><button class="section-chip" data-kg2-open="activities">🎲 الأنشطة والقصص والأغاني</button><button class="section-chip" data-kg2-open="reviews">🔁 المراجعات</button><button class="section-chip" data-kg2-open="letters">🔤 الحروف</button><button class="section-chip" data-kg2-open="exercises">✏️ التدريبات</button><button class="section-chip" data-kg2-open="exams">📝 الاختبار</button></div></div>' +
      '<div class="lesson-body" style="margin-top:14px"><b>أدوات الطفل:</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="section-chip" id="kg2Teacher">👩‍🏫 دروس المعلم</button><button class="section-chip" id="kg2Practice">✍️ المس واكتب واسمع</button><button class="section-chip" id="kg2Report">📊 التقرير المحلي</button><button class="section-chip" id="kg2Broadcast">🔴 بث المعلم</button></div></div>' +
      '<div class="lesson-body" style="margin-top:14px;font-size:12px"><b>المصدر:</b> كتاب اللغة العربية KG2، الفصل الدراسي الأول، الصفحات المطبوعة 5–109. <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب الوزارة الرسمي</a><br>لا يتضمن هذا الإصدار ادعاء تغطية الفصل الثاني.</div>';
    list.querySelectorAll('[data-kg2-open]').forEach(function (button) {
      button.onclick = function () { openContentKG2(button.getAttribute('data-kg2-open')); };
    });
    var teacher = document.getElementById('kg2Teacher');
    var practice = document.getElementById('kg2Practice');
    var report = document.getElementById('kg2Report');
    var broadcast = document.getElementById('kg2Broadcast');
    if (teacher) teacher.onclick = function () { if (window.openKindergartenTeacherWorks) window.openKindergartenTeacherWorks(); };
    if (practice) practice.onclick = function () { if (window.openKindergartenPractice) window.openKindergartenPractice(); };
    if (report) report.onclick = function () { if (window.openKindergartenReport) window.openKindergartenReport(); };
    if (broadcast) broadcast.onclick = openStageBroadcast;
    go('termsScreen');
  }
  function matchesType(item, type) {
    if (type === 'letters') return !!item.letter;
    if (type === 'activities') return item.type === 'activities';
    if (type === 'reviews') return item.type === 'reviews';
    if (type === 'exercises') return item.type === 'exercises' || !!(item.exercises && item.exercises.length);
    if (type === 'exams') return item.type === 'exams';
    return item.type === 'lessons' && !item.letter;
  }
  function openContentKG2(type) {
    var list = document.getElementById('contentList');
    var title = document.getElementById('contentTitle');
    var head = document.getElementById('contentHeaderTitle');
    var sub = document.getElementById('contentHeaderSub');
    var labels = { lessons: '📄 الدروس', activities: '🎲 الأنشطة والقصص والأغاني', reviews: '🔁 المراجعات', letters: '🔤 ركن الحروف', exercises: '✏️ تدريبات تفاعلية', exams: '📝 الاختبارات' };
    if (title) title.textContent = labels[type] || 'محتوى KG2';
    if (head) head.textContent = 'اللغة العربية — KG2';
    if (sub) sub.textContent = 'الفصل الأول 2026/2027 — كتاب الوزارة';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (item) { return matchesType(item, type); });
      rows.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      if (!rows.length) { list.innerHTML = '<div class="empty-state">لا يوجد محتوى لهذا القسم.</div>'; return; }
      list.innerHTML = rows.map(function (item, index) {
        var icon = item.letter ? '🔤' : item.type === 'reviews' ? '🔁' : item.type === 'exams' ? '📝' : item.type === 'activities' ? '🎲' : '📘';
        var pageLabel = typeof item.page === 'number' ? 'صفحة ' + item.page : esc(item.page);
        return '<button class="content-item" data-kg2-item="' + index + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + icon + '</div><div class="content-item-info"><div class="content-item-title">' + esc(item.title) + '</div><div class="content-item-sub">' + esc(item.unit) + ' • ' + pageLabel + '</div></div><div class="content-item-arrow">‹</div></button>';
      }).join('');
      list.querySelectorAll('[data-kg2-item]').forEach(function (button) {
        button.onclick = function () { viewKG2(rows[Number(button.getAttribute('data-kg2-item'))]); };
      });
    }).catch(function () {
      if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل منهج KG2. تحقق من الاتصال ثم أعد المحاولة.</div>';
    });
  }
  function viewKG2(item) {
    var list = document.getElementById('contentList');
    var title = document.getElementById('contentTitle');
    if (title) title.textContent = item.title;
    var objectives = item.objectives && item.objectives.length ? '<h3>أهداف التعلم</h3><ul>' + item.objectives.map(function (value) { return '<li>' + esc(value) + '</li>'; }).join('') + '</ul>' : '';
    var vocabulary = item.vocabulary && item.vocabulary.length ? '<h3>مفردات الدرس</h3><ul>' + item.vocabulary.map(function (value) { return '<li>' + esc(value) + '</li>'; }).join('') + '</ul>' : '';
    var tasks = item.exercises && item.exercises.length ? '<h3>تدريبات مع إجاباتها</h3>' + item.exercises.map(function (exercise, index) { return '<details style="background:#F1F8E9;border-radius:10px;padding:10px;margin:8px 0"><summary>تدريب ' + (index + 1) + ': ' + esc(exercise.question) + '</summary><p>' + esc(exercise.answer) + '</p></details>'; }).join('') : '';
    var questions = item.questions && item.questions.length ? '<h3>أسئلة الاختبار</h3>' + item.questions.map(function (question, index) { return '<details style="background:#F1F8E9;border-radius:10px;padding:10px;margin:8px 0"><summary>س' + (index + 1) + ': ' + esc(question.question) + '</summary><p>' + esc(question.answer) + '</p></details>'; }).join('') : '';
    var pageLabel = typeof item.page === 'number' ? 'صفحة ' + item.page : esc(item.page);
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #C2185B"><div style="font-size:12px;color:#AD1457;font-weight:bold">' + esc(item.unit) + ' • ' + pageLabel + '</div><h2>' + esc(item.title) + '</h2>' + (item.letter ? '<button id="kg2Letter" style="display:block;margin:12px auto;font-size:72px;font-weight:bold;color:#C2185B;background:#FCE4EC;border:0;border-radius:24px;padding:8px 34px;cursor:pointer">' + esc(item.letter) + '</button>' : '') + '<p style="white-space:pre-line;line-height:2">' + esc(item.content) + '</p>' + vocabulary + objectives + (item.activity ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>🎲 نشاط</b><p>' + esc(item.activity) + '</p></div>' : '') + tasks + questions + (item.question ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>❓ تحقق سريع</b><p>' + esc(item.question) + '</p><details><summary>إظهار الإجابة</summary><p>' + esc(item.answer || '') + '</p></details></div>' : '') + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="section-chip" id="kg2Speak">🔊 استمع للنطق الآلي</button><button class="section-chip" id="kg2Draw">✏️ افتح لوحة الرسم</button></div><p style="font-size:12px;color:#777;margin-top:14px">مرجع المنهج: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب الوزارة</a>' + (item.type === 'exams' ? ' • الاختبار والأسئلة من إعداد المنصة' : '') + '</p></article>';
    var text = (item.title || '') + '. ' + (item.speak || item.content || '');
    var speakButton = document.getElementById('kg2Speak');
    if (speakButton) speakButton.onclick = function () { speak(text); };
    var letterButton = document.getElementById('kg2Letter');
    if (letterButton) letterButton.onclick = function () { speak((item.letter || '') + '. ' + (item.speak || '')); };
    var drawButton = document.getElementById('kg2Draw');
    if (drawButton) drawButton.onclick = function () { if (window.openDrawing) window.openDrawing(); else speak('افتح لوحة الرسم للتدريب'); };
  }
  window.openSubject = function (id, name) {
    if (isKG2() && (id === subject.id || name === subject.name)) { openSubjectKG2(); return; }
    return previousOpenSubject.apply(this, arguments);
  };
})();
