/* الفقه المالكي — الصف الثالث الثانوي الأزهري — 2026/2027 */
(function () {
  'use strict';
  var oldOpenSubject = window.openAzharSubject;
  var SOURCE = 'https://mtrl.azhar.gov.eg/education/books-2026/sec/3/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%D9%83%D9%8A%20-%20%D8%A7%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%AB%D8%A7%D9%84%D8%AB%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A.pdf';
  var dataPromise = null;
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function go(id) { if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function loadData() { if (!dataPromise) dataPromise = fetch('./azhar-sec3-fiqh-maliki-content.json').then(function (r) { if (!r.ok) throw Error('تعذر تحميل منهج الفقه المالكي'); return r.json(); }); return dataPromise; }
  function openBook() {
    window.currentSubject = 'الفقه المالكي';
    var list = document.getElementById('termsList'), title = document.getElementById('termsTitle'), header = document.getElementById('termsHeader');
    if (title) title.textContent = 'الفقه المالكي';
    if (header) header.textContent = 'الفقه المالكي — الصف الثالث الثانوي الأزهري';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #7B1FA2"><h2>⚖️ الفقه المالكي</h2><p style="line-height:2">المقرر الكامل من كتاب الأزهر الرسمي «المختار من الشرح الصغير»، منظم إلى شرح مبسط، تدريبات، مراجعة، ونماذج امتحانات استرشادية.</p><p style="font-size:13px">١٢ وحدة شرح • تدريبات شاملة • امتحان استرشادي رسمي ٢٠٢٤ • بنك أسئلة.</p></div><div class="term-card" style="border-right-color:#7B1FA2"><div class="term-header"><div class="term-icon">⚖️</div><div class="term-title" style="color:#6A1B9A">المقرر الكامل 2026/2027</div><div class="term-count">١٢ وحدة</div></div><div class="term-sections"><button class="section-chip" data-fm-open="lessons">📄 الشرح</button><button class="section-chip" data-fm-open="exercises">✏️ التدريبات</button><button class="section-chip" data-fm-open="reviews">🔁 المراجعة</button><button class="section-chip" data-fm-open="exams">📝 الامتحانات</button></div></div><div class="lesson-body" style="margin-top:14px;font-size:13px"><b>الكتاب الرسمي:</b> <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب الفقه المالكي PDF</a></div>';
    list.querySelectorAll('[data-fm-open]').forEach(function (b) { b.onclick = function () { openContent(b.getAttribute('data-fm-open')); }; });
    go('termsScreen');
  }
  function openContent(type) {
    var list = document.getElementById('contentList'), title = document.getElementById('contentTitle'), head = document.getElementById('contentHeaderTitle'), sub = document.getElementById('contentHeaderSub');
    var labels = { lessons: '📄 شرح الفقه المالكي', exercises: '✏️ تدريبات الفقه المالكي', reviews: '🔁 مراجعة الفقه المالكي', exams: '📝 امتحانات الفقه المالكي' };
    if (title) title.textContent = labels[type] || 'محتوى الفقه المالكي';
    if (head) head.textContent = 'الفقه المالكي — الثالث الثانوي الأزهري';
    if (sub) sub.textContent = 'المقرر الكامل 2026/2027';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (x) { return x.type === type; }).sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      list.innerHTML = rows.map(function (x, i) { return '<button class="content-item" data-fm-item="' + i + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + (type === 'exams' ? '📝' : type === 'exercises' ? '✏️' : type === 'reviews' ? '🔁' : '📘') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(x.title) + '</div><div class="content-item-sub">' + esc(x.unit) + ' • ' + esc(x.page) + '</div></div><div class="content-item-arrow">‹</div></button>'; }).join('');
      list.querySelectorAll('[data-fm-item]').forEach(function (b) { b.onclick = function () { viewContent(rows[Number(b.getAttribute('data-fm-item'))]); }; });
    }).catch(function () { if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل منهج الفقه المالكي. حاول مرة أخرى.</div>'; });
  }
  function viewContent(x) {
    var list = document.getElementById('contentList'), title = document.getElementById('contentTitle');
    if (title) title.textContent = x.title;
    var objectives = x.objectives && x.objectives.length ? '<h3>🎯 أهداف التعلم</h3><ul>' + x.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' : '';
    var questions = x.questions && x.questions.length ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>أسئلة تدريبية</b><ol>' + x.questions.map(function (q) { return '<li style="margin:8px 0">' + esc(q) + '</li>'; }).join('') + '</ol>' + (x.answers ? '<details><summary>نموذج إجابة إرشادي</summary><ol>' + x.answers.map(function (a) { return '<li style="margin:8px 0">' + esc(a) + '</li>'; }).join('') + '</ol></details>' : '') + '</div>' : '';
    var source = x.sourceUrl ? '<p style="font-size:12px;color:#777;margin-top:16px">المصدر الخارجي: <a href="' + esc(x.sourceUrl) + '" target="_blank" rel="noopener">' + esc(x.sourceTitle || 'فتح المصدر') + '</a></p>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #7B1FA2"><div style="font-size:12px;color:#6A1B9A;font-weight:bold">' + esc(x.unit) + ' • ' + esc(x.page) + '</div><h2>' + esc(x.title) + '</h2><p style="white-space:pre-line;line-height:2">' + esc(x.content) + '</p>' + objectives + (x.example ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>مثال توضيحي</b><p style="line-height:2">' + esc(x.example) + '</p></div>' : '') + (x.question ? '<div style="background:#E3F2FD;border-radius:14px;padding:14px;margin-top:14px"><b>سؤال سريع</b><p>' + esc(x.question) + '</p><details><summary>إظهار الإجابة</summary><p style="line-height:2">' + esc(x.answer || '') + '</p></details></div>' : '') + questions + source + '<p style="font-size:12px;color:#777;margin-top:16px">المصدر الأساسي: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب الفقه المالكي الرسمي</a></p></article>';
  }
  window.openAzharSubject = function (id, name) { if (window.currentStage === 'azhar_sec' && window.currentGrade === 'الثالث الثانوي' && (id === 'fiqh_maliki' || name === 'الفقه المالكي')) { openBook(); return; } return oldOpenSubject.apply(this, arguments); };
})();
