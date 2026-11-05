/* الفقه الشافعي — الصف الثالث الثانوي الأزهري — 2026/2027 */
(function () {
  'use strict';
  var oldOpenSubject = window.openAzharSubject;
  var SOURCE = 'https://mtrl.azhar.gov.eg/education/books-2026/sec/3/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%B4%D8%A7%D9%81%D8%B9%D9%8A%20-%20%D8%A7%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%AB%D8%A7%D9%84%D8%AB%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A.pdf';
  var dataPromise = null;
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function go(id) { if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function loadData() { if (!dataPromise) dataPromise = fetch('./azhar-sec3-fiqh-shafii-content.json').then(function (r) { if (!r.ok) throw Error('تعذر تحميل منهج الفقه الشافعي'); return r.json(); }); return dataPromise; }
  function openBook() {
    window.currentSubject = 'الفقه الشافعي';
    var list = document.getElementById('termsList'), title = document.getElementById('termsTitle'), header = document.getElementById('termsHeader');
    if (title) title.textContent = 'الفقه الشافعي';
    if (header) header.textContent = 'الفقه الشافعي — الصف الثالث الثانوي الأزهري';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #1565C0"><h2>⚖️ الفقه الشافعي</h2><p style="line-height:2">المقرر الكامل من كتاب «المختار من الإقناع»، منظم إلى شرح مبسط، تدريبات، مراجعة، ونماذج امتحانات استرشادية.</p><p style="font-size:13px">١٢ وحدة شرح • تدريبات شاملة • نماذج ٢٠٢٤ و٢٠٢٥/٢٠٢٦.</p></div><div class="term-card" style="border-right-color:#1565C0"><div class="term-header"><div class="term-icon">⚖️</div><div class="term-title" style="color:#0D47A1">المقرر الكامل 2026/2027</div><div class="term-count">١٢ وحدة</div></div><div class="term-sections"><button class="section-chip" data-fs-open="lessons">📄 الشرح</button><button class="section-chip" data-fs-open="exercises">✏️ التدريبات</button><button class="section-chip" data-fs-open="reviews">🔁 المراجعة</button><button class="section-chip" data-fs-open="exams">📝 الامتحانات</button></div></div><div class="lesson-body" style="margin-top:14px;font-size:13px"><b>الكتاب الرسمي:</b> <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب الفقه الشافعي PDF</a></div>';
    list.querySelectorAll('[data-fs-open]').forEach(function (b) { b.onclick = function () { openContent(b.getAttribute('data-fs-open')); }; });
    go('termsScreen');
  }
  function openContent(type) {
    var list = document.getElementById('contentList'), title = document.getElementById('contentTitle'), head = document.getElementById('contentHeaderTitle'), sub = document.getElementById('contentHeaderSub');
    var labels = { lessons: '📄 شرح الفقه الشافعي', exercises: '✏️ تدريبات الفقه الشافعي', reviews: '🔁 مراجعة الفقه الشافعي', exams: '📝 امتحانات الفقه الشافعي' };
    if (title) title.textContent = labels[type] || 'محتوى الفقه الشافعي';
    if (head) head.textContent = 'الفقه الشافعي — الثالث الثانوي الأزهري';
    if (sub) sub.textContent = 'المقرر الكامل 2026/2027';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (x) { return x.type === type; }).sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      list.innerHTML = rows.map(function (x, i) { return '<button class="content-item" data-fs-item="' + i + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + (type === 'exams' ? '📝' : type === 'exercises' ? '✏️' : type === 'reviews' ? '🔁' : '📘') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(x.title) + '</div><div class="content-item-sub">' + esc(x.unit) + ' • ' + esc(x.page) + '</div></div><div class="content-item-arrow">‹</div></button>'; }).join('');
      list.querySelectorAll('[data-fs-item]').forEach(function (b) { b.onclick = function () { viewContent(rows[Number(b.getAttribute('data-fs-item'))]); }; });
    }).catch(function () { if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل منهج الفقه الشافعي. حاول مرة أخرى.</div>'; });
  }
  function viewContent(x) {
    var list = document.getElementById('contentList'), title = document.getElementById('contentTitle');
    if (title) title.textContent = x.title;
    var objectives = x.objectives && x.objectives.length ? '<h3>🎯 أهداف التعلم</h3><ul>' + x.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' : '';
    var questions = x.questions && x.questions.length ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>أسئلة تدريبية</b><ol>' + x.questions.map(function (q) { return '<li style="margin:8px 0">' + esc(q) + '</li>'; }).join('') + '</ol>' + (x.answers ? '<details><summary>نموذج إجابة إرشادي</summary><ol>' + x.answers.map(function (a) { return '<li style="margin:8px 0">' + esc(a) + '</li>'; }).join('') + '</ol></details>' : '') + '</div>' : '';
    var source = x.sourceUrl ? '<p style="font-size:12px;color:#777;margin-top:16px">المصدر الخارجي: <a href="' + esc(x.sourceUrl) + '" target="_blank" rel="noopener">' + esc(x.sourceTitle || 'فتح المصدر') + '</a></p>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #1565C0"><div style="font-size:12px;color:#0D47A1;font-weight:bold">' + esc(x.unit) + ' • ' + esc(x.page) + '</div><h2>' + esc(x.title) + '</h2><p style="white-space:pre-line;line-height:2">' + esc(x.content) + '</p>' + objectives + (x.example ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>مثال توضيحي</b><p style="line-height:2">' + esc(x.example) + '</p></div>' : '') + (x.question ? '<div style="background:#E3F2FD;border-radius:14px;padding:14px;margin-top:14px"><b>سؤال سريع</b><p>' + esc(x.question) + '</p><details><summary>إظهار الإجابة</summary><p style="line-height:2">' + esc(x.answer || '') + '</p></details></div>' : '') + questions + source + '<p style="font-size:12px;color:#777;margin-top:16px">المصدر الأساسي: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب الفقه الشافعي الرسمي</a></p></article>';
  }
  window.openAzharSubject = function (id, name) { if (window.currentStage === 'azhar_sec' && window.currentGrade === 'الثالث الثانوي' && (id === 'fiqh_shafii' || name === 'الفقه الشافعي')) { openBook(); return; } return oldOpenSubject.apply(this, arguments); };
})();
