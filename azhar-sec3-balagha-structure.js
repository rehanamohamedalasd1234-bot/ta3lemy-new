/* منهج البلاغة العربية — الصف الثالث الثانوي الأزهري — 2025/2026 */
(function () {
  'use strict';
  var oldOpenGrade = window.openAzharGrade;
  var oldOpenSubject = window.openAzharSubject;
  var SOURCE = 'https://mtrl.azhar.gov.eg/education/books-2026/sec/3/%D8%A8%D9%84%D8%A7%D8%BA%D8%A9%203%20%D8%AB.pdf';
  var dataPromise = null;
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function isThird() { return window.currentStage === 'azhar_sec' && window.currentGrade === 'الثالث الثانوي'; }
  function go(id) { if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function loadData() {
    if (!dataPromise) dataPromise = fetch('./azhar-sec3-balagha-content.json').then(function (r) { if (!r.ok) throw Error('تعذر تحميل منهج البلاغة'); return r.json(); });
    return dataPromise;
  }
  function renderThirdSubjects() {
    var list = document.getElementById('azharList');
    var curriculum = window.AZHAR_CURRICULUM;
    if (!list || !curriculum) return;
    if (curriculum.installStyle) curriculum.installStyle();
    var stage = curriculum.getStage('azhar_sec');
    if (!stage) return;
    var html = '<div class="azhar-curriculum-intro">المرحلة الثانوية الأزهرية • الثالث الثانوي</div>';
    stage.groups.forEach(function (group) {
      var courses = curriculum.getCourses('azhar_sec', 'الثالث الثانوي', group.name);
      if (!courses.length) return;
      html += '<section class="azhar-curriculum-group"><h3 class="azhar-curriculum-group-title">' + esc(group.name) + '</h3>';
      courses.forEach(function (course) {
        html += '<button type="button" class="azhar-curriculum-subject" data-az3-course="' + esc(course.id) + '"><span class="azhar-curriculum-subject-icon">' + (group.name === 'المواد الشرعية' ? '🕌' : group.name === 'مواد عامة' ? '🗂️' : '📖') + '</span><span class="azhar-curriculum-subject-copy"><span class="azhar-curriculum-subject-name">' + esc(course.name) + '</span><span class="azhar-curriculum-subject-detail">' + esc(course.detail || group.name) + '</span></span><span class="azhar-curriculum-subject-arrow">‹</span></button>';
      });
      html += '</section>';
    });
    html += '<button type="button" class="azhar-curriculum-subject" data-az3-mock="1"><span class="azhar-curriculum-subject-icon">📝</span><span class="azhar-curriculum-subject-copy"><span class="azhar-curriculum-subject-name">اختبارات تجريبية شاملة</span><span class="azhar-curriculum-subject-detail">نماذج تفاعلية للمواد المتاحة</span></span><span class="azhar-curriculum-subject-arrow">‹</span></button>';
    list.innerHTML = html;
    list.querySelectorAll('[data-az3-course]').forEach(function (card) {
      card.onclick = function () {
        var item = curriculum.getCourse('azhar_sec', card.getAttribute('data-az3-course'));
        if (!item) return;
        window.currentAzharCourseId = item.id;
        window.currentAzharCourseGroup = item.group;
        window.openAzharSubject(item.id, item.name, item.group);
      };
    });
    var mock = list.querySelector('[data-az3-mock]');
    if (mock) mock.onclick = function () { if (window.openAzharMockExams) window.openAzharMockExams(); };
    go('azharScreen');
  }
  function openBalagha() {
    window.currentSubject = 'البلاغة العربية';
    var list = document.getElementById('termsList'); var title = document.getElementById('termsTitle'); var header = document.getElementById('termsHeader');
    if (title) title.textContent = 'البلاغة العربية';
    if (header) header.textContent = 'البلاغة العربية — الصف الثالث الثانوي الأزهري';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #C9A227"><b>منهج البلاغة العربية — المقرر الكامل</b><p style="line-height:2;margin-bottom:6px">الوحدة الأولى: المجاز اللغوي، الوحدة الثانية: الكناية، الوحدة الثالثة: علم البديع، مع تدريبات واختبارات شاملة.</p><p style="font-size:13px;margin-bottom:0">المحتوى منظم تعليميًا وفق فهرس كتاب الأزهر الرسمي للصف الثالث الثانوي.</p></div><div class="term-card" style="border-right-color:#C9A227"><div class="term-header"><div class="term-icon">📚</div><div class="term-title" style="color:#8A6B00">المقرر الكامل 2025/2026</div><div class="term-count">3 وحدات</div></div><div class="term-sections"><button class="section-chip" data-az3-open="lessons">📄 الدروس</button><button class="section-chip" data-az3-open="exercises">✏️ التدريبات</button><button class="section-chip" data-az3-open="exams">📝 الامتحانات</button><button class="section-chip" data-az3-open="reviews">🔁 المراجعات</button></div></div><div class="lesson-body" style="margin-top:14px;font-size:13px"><b>المصدر الرسمي:</b> <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب البلاغة العربية</a></div>';
    list.querySelectorAll('[data-az3-open]').forEach(function (b) { b.onclick = function () { openContent(b.getAttribute('data-az3-open')); }; });
    go('termsScreen');
  }
  function openContent(type) {
    var list = document.getElementById('contentList'); var title = document.getElementById('contentTitle'); var head = document.getElementById('contentHeaderTitle'); var sub = document.getElementById('contentHeaderSub');
    var labels = { lessons: '📄 دروس البلاغة', exercises: '✏️ تدريبات الكتاب', exams: '📝 امتحانات البلاغة', reviews: '🔁 المراجعة الشاملة' };
    if (title) title.textContent = labels[type] || 'محتوى البلاغة';
    if (head) head.textContent = 'البلاغة العربية — الثالث الثانوي الأزهري';
    if (sub) sub.textContent = 'المقرر الكامل 2025/2026';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (x) { return x.type === type || (type === 'reviews' && x.type === 'reviews'); }).sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      if (!rows.length) { list.innerHTML = '<div class="empty-state">لا يوجد محتوى لهذا القسم.</div>'; return; }
      list.innerHTML = rows.map(function (x, i) { return '<button class="content-item" data-az3-item="' + i + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + (x.type === 'exams' ? '📝' : x.type === 'exercises' ? '✏️' : x.type === 'reviews' ? '🔁' : '📘') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(x.title) + '</div><div class="content-item-sub">' + esc(x.unit) + ' • صفحة ' + esc(x.page) + '</div></div><div class="content-item-arrow">‹</div></button>'; }).join('');
      list.querySelectorAll('[data-az3-item]').forEach(function (b) { b.onclick = function () { viewContent(rows[Number(b.getAttribute('data-az3-item'))]); }; });
    }).catch(function () { if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل منهج البلاغة. حاول مرة أخرى.</div>'; });
  }
  function viewContent(x) {
    var list = document.getElementById('contentList'); var title = document.getElementById('contentTitle');
    if (title) title.textContent = x.title;
    var objectives = x.objectives && x.objectives.length ? '<h3>أهداف الدرس</h3><ul>' + x.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' : '';
    var questions = x.questions && x.questions.length ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>أسئلة تدريبية</b><ol>' + x.questions.map(function (q) { return '<li style="margin:8px 0">' + esc(q) + '</li>'; }).join('') + '</ol>' + (x.answers ? '<details><summary>نموذج الإجابة</summary><ol>' + x.answers.map(function (a) { return '<li style="margin:8px 0">' + esc(a) + '</li>'; }).join('') + '</ol></details>' : '') + '</div>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #C9A227"><div style="font-size:12px;color:#8A6B00;font-weight:bold">' + esc(x.unit) + ' • صفحة ' + esc(x.page) + '</div><h2>' + esc(x.title) + '</h2><p style="white-space:pre-line;line-height:2">' + esc(x.content) + '</p>' + objectives + (x.example ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>مثال محلل</b><p>' + esc(x.example) + '</p></div>' : '') + (x.activity ? '<div style="background:#E3F2FD;border-radius:14px;padding:14px;margin-top:14px"><b>نشاط تطبيقي</b><p>' + esc(x.activity) + '</p></div>' : '') + (x.question ? '<div style="background:#F3E5F5;border-radius:14px;padding:14px;margin-top:14px"><b>سؤال سريع</b><p>' + esc(x.question) + '</p><details><summary>إظهار الإجابة</summary><p>' + esc(x.answer || '') + '</p></details></div>' : '') + questions + '<p style="font-size:12px;color:#777;margin-top:16px">المصدر: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب البلاغة العربية الرسمي</a></p></article>';
  }
  window.openAzharGrade = function (gradeName) { if (window.currentStage === 'azhar_sec' && gradeName === 'الثالث الثانوي') { window.currentGrade = gradeName; renderThirdSubjects(); return; } return oldOpenGrade.apply(this, arguments); };
  window.openAzharSubject = function (id, name) { if (isThird() && (id === 'sec-balagha' || id === 'balagha' || name === 'البلاغة' || name === 'البلاغة العربية')) { window.currentAzharCourseId = 'sec-balagha'; window.currentSubject = 'البلاغة العربية'; openBalagha(); return; } return oldOpenSubject.apply(this, arguments); };
})();
