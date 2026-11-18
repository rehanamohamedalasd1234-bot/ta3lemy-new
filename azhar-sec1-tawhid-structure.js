/* التوحيد — الصف الأول الثانوي الأزهري — كتاب 2026/2027 */
(function () {
  'use strict';
  var oldOpenSubject = window.openAzharSubject;
  var SOURCE = 'https://mtrl.azhar.gov.eg/education/books-2026/sec/1/%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%20-%20%D8%A7%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%A3%D9%88%D9%84%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A.pdf';
  var dataPromise = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function go(id) {
    if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen);
    if (window.showScreen) window.showScreen(id);
  }
  function matchesCourse(id, name) {
    return window.currentStage === 'azhar_sec' &&
      window.currentGrade === 'الأول الثانوي' &&
      (id === 'sec-tawheed' || id === 'sec-tawhid' || id === 'tawhid' || String(name || '').indexOf('التوحيد') !== -1);
  }
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch('./azhar-sec1-tawhid-content.json').then(function (response) {
        if (!response.ok) throw new Error('تعذر تحميل منهج التوحيد للصف الأول');
        return response.json();
      });
    }
    return dataPromise;
  }
  function openBook() {
    window.currentAzharCourseId = 'sec-tawheed';
    window.currentSubject = 'التوحيد';
    var list = document.getElementById('termsList');
    var title = document.getElementById('termsTitle');
    var header = document.getElementById('termsHeader');
    if (title) title.textContent = 'التوحيد';
    if (header) header.textContent = 'التوحيد — الصف الأول الثانوي الأزهري';
    if (!list) return;
    list.innerHTML =
      '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #13795B">' +
        '<h2>🕌 التوحيد — الصف الأول الثانوي</h2>' +
        '<p style="line-height:2">محتوى تعليمي منظم لموضوعات كتاب الأزهر الرسمي للعام 2026/2027، مع ٣٦ درسًا و٧ تدريبات و٣ مراجعات واختبارين تدريبيين.</p>' +
        '<p style="font-size:13px;line-height:1.9"><b>نطاق المصدر:</b> موضوعات الكتاب المطبوعة ص 10–138؛ ونموذج استرشادي في آخر الكتاب.</p>' +
        '<p style="font-size:13px;line-height:1.9;color:#7A4B00"><b>تنبيه توثيق:</b> التوزيع على الفصلين لم يثبت في المصادر؛ لذلك يعرض هذا القسم محتوى الكتاب ولا ينسبه إلى فصل محدد. الاختبارات الرقمية من إعداد المنصة وليست رسمية.</p>' +
      '</div>' +
      '<div class="term-card" style="border-right-color:#13795B">' +
        '<div class="term-header"><div class="term-icon">🕌</div><div class="term-title" style="color:#0D6349">موضوعات الكتاب 2026/2027</div><div class="term-count">٣٦ درسًا</div></div>' +
        '<div class="term-sections"><button class="section-chip" data-az1t-open="lessons">📄 الدروس</button><button class="section-chip" data-az1t-open="exercises">✏️ التدريبات</button><button class="section-chip" data-az1t-open="reviews">🔁 المراجعة</button><button class="section-chip" data-az1t-open="exams">📝 الاختبارات</button></div>' +
      '</div>' +
      '<div class="lesson-body" style="margin-top:14px;font-size:13px;line-height:1.9"><b>المصدر الرسمي:</b> <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب التوحيد للصف الأول الثانوي PDF</a><br>الشروح والأسئلة من إعداد المنصة بالاستناد إلى الكتاب، وليست نقلًا حرفيًا أو امتحانًا رسميًا.</div>';
    list.querySelectorAll('[data-az1t-open]').forEach(function (button) {
      button.onclick = function () { openContent(button.getAttribute('data-az1t-open')); };
    });
    go('termsScreen');
  }
  function openContent(type) {
    var list = document.getElementById('contentList');
    var title = document.getElementById('contentTitle');
    var head = document.getElementById('contentHeaderTitle');
    var sub = document.getElementById('contentHeaderSub');
    var labels = { lessons: '📄 دروس التوحيد — الأول الثانوي', exercises: '✏️ تدريبات التوحيد — الأول الثانوي', reviews: '🔁 مراجعة التوحيد — الأول الثانوي', exams: '📝 اختبارات التوحيد — الأول الثانوي' };
    if (title) title.textContent = labels[type] || 'محتوى التوحيد';
    if (head) head.textContent = 'التوحيد — الصف الأول الثانوي الأزهري';
    if (sub) sub.textContent = 'كتاب 2026/2027 • التوزيع الفصلي غير موثق';
    if (list) list.innerHTML = '<div class="empty-state"><p>جارٍ تحميل المحتوى المحلي...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (item) { return item.type === type; }).sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      if (!list) return;
      if (!rows.length) { list.innerHTML = '<div class="empty-state">لا توجد عناصر في هذا القسم حاليًا.</div>'; return; }
      list.innerHTML = rows.map(function (item, index) {
        var icon = type === 'exams' ? '📝' : type === 'exercises' ? '✏️' : type === 'reviews' ? '🔁' : '🕌';
        return '<button class="content-item" data-az1t-item="' + index + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + icon + '</div><div class="content-item-info"><div class="content-item-title">' + esc(item.title) + '</div><div class="content-item-sub">' + esc(item.unit) + ' • ' + esc(item.page) + '</div></div><div class="content-item-arrow">‹</div></button>';
      }).join('');
      list.querySelectorAll('[data-az1t-item]').forEach(function (button) {
        button.onclick = function () { viewContent(rows[Number(button.getAttribute('data-az1t-item'))]); };
      });
    }).catch(function () {
      if (list) list.innerHTML = '<div class="empty-state">تعذر تحميل المحتوى المحلي. أعد فتح القسم بعد تحديث الصفحة.</div>';
    });
  }
  function viewContent(item) {
    var list = document.getElementById('contentList');
    var title = document.getElementById('contentTitle');
    if (!list) return;
    if (title) title.textContent = item.title;
    var objectives = item.objectives && item.objectives.length
      ? '<h3>🎯 أهداف التعلم</h3><ul>' + item.objectives.map(function (value) { return '<li>' + esc(value) + '</li>'; }).join('') + '</ul>' : '';
    var questions = item.questions && item.questions.length
      ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>أسئلة تدريبية</b><ol>' + item.questions.map(function (value) { return '<li style="margin:8px 0;line-height:1.9">' + esc(value) + '</li>'; }).join('') + '</ol>' +
        '<details><summary>إظهار نموذج الإجابة الإرشادي</summary><ol>' + item.answers.map(function (value) { return '<li style="margin:8px 0;line-height:1.9">' + esc(value) + '</li>'; }).join('') + '</ol></details></div>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #13795B"><div style="font-size:12px;color:#0D6349;font-weight:bold">' + esc(item.unit) + ' • ' + esc(item.page) + '</div><h2>' + esc(item.title) + '</h2><p style="white-space:pre-line;line-height:2">' + esc(item.content) + '</p>' + objectives +
      (item.example ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>مثال توضيحي</b><p style="line-height:2">' + esc(item.example) + '</p></div>' : '') +
      (item.question ? '<div style="background:#E3F2FD;border-radius:14px;padding:14px;margin-top:14px"><b>سؤال سريع</b><p style="line-height:2">' + esc(item.question) + '</p><details><summary>إظهار الإجابة</summary><p style="line-height:2">' + esc(item.answer || '') + '</p></details></div>' : '') + questions +
      '<p style="font-size:12px;color:#777;margin-top:16px">المصدر الأساسي: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب التوحيد الرسمي للصف الأول</a></p></article>';
  }
  window.openAzharSubject = function (id, name) {
    if (matchesCourse(id, name)) { openBook(); return; }
    if (typeof oldOpenSubject === 'function') return oldOpenSubject.apply(this, arguments);
  };
})();
