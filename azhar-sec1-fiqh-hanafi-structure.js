/* الفقه الحنفي — الصف الأول الثانوي الأزهري — محتوى الكتاب المحلي */
(function () {
  'use strict';
  var previousOpenSubject = window.openAzharSubject;
  var SOURCE = 'https://mtrl.azhar.gov.eg/education/books-2026/sec/1/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%AD%D9%86%D9%81%D9%8A%20-%D8%A7%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%A7%D9%88%D9%84%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A.pdf';
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

  function matchesCourse(id, name, groupName, branch) {
    var isHanafi = branch === 'المذهب الحنفي' ||
      window.currentAzharCourseBranch === 'المذهب الحنفي' ||
      window.currentAzharSubjectBranch === 'المذهب الحنفي' ||
      String(name || '').indexOf('الحنفي') !== -1;
    return window.currentStage === 'azhar_sec' &&
      window.currentGrade === 'الأول الثانوي' &&
      isHanafi &&
      (id === 'sec-fiqh' || id === 'fiqh_hanafi' || String(name || '').indexOf('الفقه') !== -1);
  }

  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch('./azhar-sec1-fiqh-hanafi-content.json').then(function (response) {
        if (!response.ok) throw new Error('تعذر تحميل محتوى الفقه الحنفي للأول الثانوي');
        return response.json();
      });
    }
    return dataPromise;
  }

  function openBook() {
    window.currentAzharCourseId = 'sec-fiqh';
    window.currentSubject = 'الفقه الحنفي';
    var list = document.getElementById('termsList');
    var title = document.getElementById('termsTitle');
    var header = document.getElementById('termsHeader');
    if (title) title.textContent = 'الفقه الحنفي';
    if (header) header.textContent = 'الفقه الحنفي — الأول الثانوي الأزهري';
    if (!list) return;

    list.innerHTML =
      '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #795548">' +
        '<h2>⚖️ الفقه الحنفي — الصف الأول الثانوي</h2>' +
        '<p style="line-height:2">تغطية تعليمية منظمة لموضوعات كتاب «المختار من الاختيار فقه حنفي» من الطهارة والصلاة إلى الزكاة والصيام والحج والأضحية، مع شرح وتدريبات ومراجعات واختبارات محلية.</p>' +
        '<p style="font-size:13px;line-height:1.9"><b>نطاق المحتوى:</b> دروس الكتاب المطبوعة 11–343، إضافة إلى مراجعات واختبارات تدريبية من إعداد المنصة.</p>' +
        '<p style="font-size:13px;line-height:1.9;color:#7A4B00"><b>تنبيه توثيق:</b> لم يثبت توزيع رسمي يحدد ما يدرّس في كل فصل؛ لذلك يعرض هذا القسم موضوعات الكتاب ولا يسميها فصلًا أول أو ثانيًا.</p>' +
      '</div>' +
      '<div class="term-card" style="border-right-color:#795548">' +
        '<div class="term-header"><div class="term-icon">⚖️</div><div class="term-title" style="color:#5D4037">موضوعات الكتاب 2026/2027</div><div class="term-count">٤٢ درسًا</div></div>' +
        '<div class="term-sections"><button class="section-chip" data-az1h-open="lessons">📄 الدروس</button><button class="section-chip" data-az1h-open="exercises">✏️ التدريبات</button><button class="section-chip" data-az1h-open="reviews">🔁 المراجعة</button><button class="section-chip" data-az1h-open="exams">📝 الاختبارات</button></div>' +
      '</div>' +
      '<div class="lesson-body" style="margin-top:14px;font-size:13px;line-height:1.9"><b>المصدر الرسمي:</b> <a href="' + SOURCE + '" target="_blank" rel="noopener">فتح كتاب الفقه الحنفي للصف الأول الثانوي PDF</a><br>الشرح والأسئلة من إعداد المنصة بالاستناد إلى الكتاب، وليست نقلًا حرفيًا أو امتحانًا رسميًا.</div>';

    list.querySelectorAll('[data-az1h-open]').forEach(function (button) {
      button.onclick = function () { openContent(button.getAttribute('data-az1h-open')); };
    });
    go('termsScreen');
  }

  function openContent(type) {
    var list = document.getElementById('contentList');
    var title = document.getElementById('contentTitle');
    var head = document.getElementById('contentHeaderTitle');
    var sub = document.getElementById('contentHeaderSub');
    var labels = {
      lessons: '📄 دروس الفقه الحنفي — الأول الثانوي',
      exercises: '✏️ تدريبات الفقه الحنفي — الأول الثانوي',
      reviews: '🔁 مراجعات الفقه الحنفي — الأول الثانوي',
      exams: '📝 اختبارات الفقه الحنفي — الأول الثانوي'
    };
    if (title) title.textContent = labels[type] || 'محتوى الفقه الحنفي';
    if (head) head.textContent = 'الفقه الحنفي — الأول الثانوي الأزهري';
    if (sub) sub.textContent = 'موضوعات الكتاب 2026/2027 • التوزيع الفصلي غير موثق';
    if (list) list.innerHTML = '<div class="empty-state"><p>جارٍ تحميل المحتوى المحلي...</p></div>';
    go('contentScreen');

    loadData().then(function (data) {
      var rows = data.records.filter(function (item) { return item.type === type; })
        .sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      if (!list) return;
      if (!rows.length) {
        list.innerHTML = '<div class="empty-state">لا توجد عناصر في هذا القسم حاليًا.</div>';
        return;
      }
      list.innerHTML = rows.map(function (item, index) {
        var icon = type === 'exams' ? '📝' : type === 'exercises' ? '✏️' : type === 'reviews' ? '🔁' : '⚖️';
        return '<button class="content-item" data-az1h-item="' + index + '" style="width:100%;text-align:right;border:0"><div class="content-item-icon">' + icon + '</div><div class="content-item-info"><div class="content-item-title">' + esc(item.title) + '</div><div class="content-item-sub">' + esc(item.unit) + ' • ' + esc(item.page) + '</div></div><div class="content-item-arrow">‹</div></button>';
      }).join('');
      list.querySelectorAll('[data-az1h-item]').forEach(function (button) {
        button.onclick = function () { viewContent(rows[Number(button.getAttribute('data-az1h-item'))]); };
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
      ? '<h3>🎯 أهداف التعلم</h3><ul>' + item.objectives.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '';
    var questions = item.questions && item.questions.length
      ? '<div style="background:#FFF8E1;border-radius:14px;padding:14px;margin-top:14px"><b>أسئلة تدريبية</b><ol>' + item.questions.map(function (x) { return '<li style="margin:8px 0;line-height:1.9">' + esc(x) + '</li>'; }).join('') + '</ol>' +
        '<details><summary>إظهار نموذج الإجابة الإرشادي</summary><ol>' + (item.answers || []).map(function (x) { return '<li style="margin:8px 0;line-height:1.9">' + esc(x) + '</li>'; }).join('') + '</ol></details></div>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #795548"><div style="font-size:12px;color:#5D4037;font-weight:bold">' + esc(item.unit) + ' • ' + esc(item.page) + '</div><h2>' + esc(item.title) + '</h2><p style="white-space:pre-line;line-height:2">' + esc(item.content) + '</p>' + objectives +
      (item.example ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>مثال توضيحي</b><p style="line-height:2">' + esc(item.example) + '</p></div>' : '') +
      (item.question ? '<div style="background:#E3F2FD;border-radius:14px;padding:14px;margin-top:14px"><b>سؤال سريع</b><p style="line-height:2">' + esc(item.question) + '</p><details><summary>إظهار الإجابة</summary><p style="line-height:2">' + esc(item.answer || '') + '</p></details></div>' : '') + questions +
      '<p style="font-size:12px;color:#777;margin-top:16px">المصدر الأساسي: <a href="' + SOURCE + '" target="_blank" rel="noopener">كتاب الفقه الحنفي الرسمي للصف الأول</a></p></article>';
  }

  window.openAzharSubject = function (id, name, groupName, branch) {
    if (matchesCourse(id, name, groupName, branch)) {
      openBook();
      return;
    }
    if (typeof previousOpenSubject === 'function') return previousOpenSubject.apply(this, arguments);
  };
})();
