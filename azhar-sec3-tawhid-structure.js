/* منهج التوحيد — الصف الثالث الثانوي الأزهري — 2026/2027 */
(function () {
  'use strict';
  var oldOpenSubject = window.openAzharSubject;
  var SOURCE = 'https://mtrl.azhar.gov.eg/education/books-2026/sec/3/%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%20-%20%D8%A7%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A.pdf';
  var dataPromise;
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function go(id) { if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function load() { if (!dataPromise) dataPromise = fetch('./azhar-sec3-tawhid-content.json').then(function (r) { if (!r.ok) throw Error('تعذر تحميل التوحيد'); return r.json(); }); return dataPromise; }
  function openBook() {
    window.currentSubject = 'التوحيد';
    var list = document.getElementById('termsList');
    if (document.getElementById('termsTitle')) document.getElementById('termsTitle').textContent = 'التوحيد';
    if (document.getElementById('termsHeader')) document.getElementById('termsHeader').textContent = 'التوحيد — الصف الثالث الثانوي الأزهري';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #C9A227"><b>تيسير شرح جوهرة التوحيد — المقرر الكامل</b><p style="line-height:2;margin-bottom:6px">السمعيات، وما يتصل بها من الملائكة والجن والموت والروح والبرزخ والبعث والحساب واليوم الآخر، ثم الآثار المترتبة على الإيمان وأحكام الإمامة والأمر بالمعروف.</p><p style="font-size:13px;margin-bottom:0">المحتوى منظم وفق قائمة الموضوعات الرسمية لكتاب الأزهر.</p></div><div class="term-card" style="border-right-color:#C9A227"><div class="term-header"><div class="term-icon">🕌</div><div class="term-title" style="color:#8A6B00">المقرر الكامل 2026/2027</div><div class="term-count">23 موضوعًا</div></div><div class="term-sections"><button class="section-chip" data-tawhid-open="lessons">📄 الدروس</button><button class="section-chip" data-tawhid-open="exercises">✏️ التدريبات</button><button class="section-chip" data-tawhid-open="exams">📝 الامتحانات</button><button class="section-chip" data-tawhid-open="reviews">🔁 المراجعة</button></div></div><div class="lesson-body" style="margin-top:14px;font-size:13px"><b>المصدر الرسمي:</b> <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب التوحيد</a></div>';
    list.querySelectorAll('[data-tawhid-open]').forEach(function (b) { b.onclick = function () { openList(b.getAttribute('data-tawhid-open')); }; });
    go('termsScreen');
  }
  function openList(type) {
    var list = document.getElementById('contentList');
    if (document.getElementById('contentTitle')) document.getElementById('contentTitle').textContent = type === 'lessons' ? '📄 دروس التوحيد' : type === 'exercises' ? '✏️ تدريبات التوحيد' : type === 'exams' ? '📝 امتحانات التوحيد' : '🔁 مراجعة التوحيد';
    if (document.getElementById('contentHeaderTitle')) document.getElementById('contentHeaderTitle').textContent = 'التوحيد — الثالث الثانوي الأزهري';
    if (document.getElementById('contentHeaderSub')) document.getElementById('contentHeaderSub').textContent = 'المقرر الكامل 2026/2027';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';
    go('contentScreen');
    load().then(function (d) {
      var rows = d.records.filter(function (x) { return x.type === type; }).sort(function (a, b) { return a.order - b.order; });
      if (!rows.length) { list.innerHTML = '<div class="empty-state">لا يوجد محتوى لهذا القسم.</div>'; return; }
      list.innerHTML = rows.map(function (x, i) { return '<button class="content-item" data-tawhid-item="' + i + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + (x.type === 'exams' ? '📝' : x.type === 'exercises' ? '✏️' : x.type === 'reviews' ? '🔁' : '🕌') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(x.title) + '</div><div class="content-item-sub">' + esc(x.unit) + ' • صفحة ' + esc(x.page) + '</div></div><div class="content-item-arrow">‹</div></button>'; }).join('');
      list.querySelectorAll('[data-tawhid-item]').forEach(function (b) { b.onclick = function () { view(rows[Number(b.getAttribute('data-tawhid-item'))]); }; });
    }).catch(function () { if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل منهج التوحيد. حاول مرة أخرى.</div>'; });
  }
  function view(x) {
    var list = document.getElementById('contentList');
    if (document.getElementById('contentTitle')) document.getElementById('contentTitle').textContent = x.title;
    var objectives = x.objectives && x.objectives.length ? '<h3>أهداف الدرس</h3><ul>' + x.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' : '';
    var questions = x.questions && x.questions.length ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>أسئلة تدريبية</b><ol>' + x.questions.map(function (q) { return '<li style="margin:8px 0">' + esc(q) + '</li>'; }).join('') + '</ol>' + (x.answers ? '<details><summary>إظهار نموذج الإجابة</summary><ol>' + x.answers.map(function (a) { return '<li style="margin:8px 0">' + esc(a) + '</li>'; }).join('') + '</ol></details>' : '') + '</div>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #C9A227"><div style="font-size:12px;color:#8A6B00;font-weight:bold">' + esc(x.unit) + ' • صفحة ' + esc(x.page) + '</div><h2>' + esc(x.title) + '</h2><p style="white-space:pre-line;line-height:2">' + esc(x.content) + '</p>' + objectives + (x.example ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>مثال وتطبيق</b><p>' + esc(x.example) + '</p></div>' : '') + (x.activity ? '<div style="background:#E3F2FD;border-radius:14px;padding:14px;margin-top:14px"><b>نشاط تطبيقي</b><p>' + esc(x.activity) + '</p></div>' : '') + (x.question ? '<div style="background:#F3E5F5;border-radius:14px;padding:14px;margin-top:14px"><b>سؤال سريع</b><p>' + esc(x.question) + '</p><details><summary>إظهار الإجابة</summary><p>' + esc(x.answer || '') + '</p></details></div>' : '') + questions + '<p style="font-size:12px;color:#777;margin-top:16px">المصدر: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب التوحيد الرسمي</a></p></article>';
  }
  window.openAzharSubject = function (id, name) { if (window.currentStage === 'azhar_sec' && window.currentGrade === 'الثالث الثانوي' && (id === 'tawhid' || name === 'التوحيد')) { openBook(); return; } return oldOpenSubject.apply(this, arguments); };
})();
