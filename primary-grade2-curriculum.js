/* محتوى الصف الثاني الابتدائي - التعليم العام */
(function () {
  'use strict';
  var SOURCE = 'https://edu2-egypt.com/grade-2';
  var MINISTRY = 'https://ellibrary.moe.gov.eg/Books/Books-Primary';
  var subjects = {
    'اللغة العربية': ['أقرأ وأفهم', 'الاسم والفعل والحرف', 'المفرد والمثنى والجمع', 'أكتب فقرة قصيرة'],
    'الرياضيات': ['الأعداد حتى 100', 'الجمع والطرح', 'الضرب كمجموعات', 'الهندسة والقياس'],
    'اللغة الإنجليزية': ['My Day', 'My Community', 'Food and Healthy Habits', 'Stories and Descriptions'],
    'اكتشف': ['المجتمع من حولي', 'المادة والطاقة', 'النبات والحيوان', 'البيئة والموارد'],
    'التربية الدينية': ['الإيمان والشكر', 'العبادات والنظافة', 'الصدق والأمانة', 'الرحمة وصلة الرحم'],
    'القيم واحترام الآخر': ['التعاون في الفريق', 'المسؤولية', 'حل المشكلات', 'احترام التنوع']
  };
  var notes = {
    'اللغة العربية': 'يقرأ الطالب نصًا قصيرًا قراءة واعية، يحدد الفكرة الأساسية، ويميز نوع الكلمة، ثم يستخدم المفردات في جملة أو فقرة من إنشائه.',
    'الرياضيات': 'ننتقل من التمثيل بالأشياء والصور إلى استخدام الأعداد والرموز. يشرح الطالب طريقة الحل، ويقدر معقولية إجابته قبل اعتمادها.',
    'اللغة الإنجليزية': 'Read, listen, speak, and write. The learner uses familiar vocabulary in short sentences, notices patterns, and communicates about everyday life.',
    'اكتشف': 'نلاحظ الظاهرة، نطرح سؤالًا، نجمع دليلًا بسيطًا، ثم نربط النتيجة بحياة الطالب وبدوره في المجتمع والبيئة.',
    'التربية الدينية': 'نربط المعرفة بالسلوك اليومي؛ نفهم المعنى، نذكر مثالًا، ثم نطبق القيمة في البيت والمدرسة.',
    'القيم واحترام الآخر': 'نفكر في المشكلة من أكثر من وجهة نظر، نختار حلًا آمنًا وعادلًا، ونتابع أثره على الفريق والمكان.'
  };
  var questions = {
    'اللغة العربية': 'اكتب جملة من إنشائك تستخدم فيها كلمة جديدة من الدرس، ثم ضع خطًا تحت الفعل.',
    'الرياضيات': 'كوّن مسألة من الحياة اليومية، اكتب العملية المناسبة، ثم تحقق من الحل بطريقة أخرى.',
    'اللغة الإنجليزية': 'Write two short sentences about the topic, then read them aloud to a partner.',
    'اكتشف': 'ما الدليل الذي لاحظته؟ ماذا تتوقع أن يحدث إذا تغير أحد العوامل؟',
    'التربية الدينية': 'اذكر موقفًا تطبق فيه القيمة، واشرح كيف يستفيد منه الآخرون.',
    'القيم واحترام الآخر': 'ما الحل الأكثر احترامًا وعدلًا؟ اذكر خطوة أولى لتنفيذه.'
  };
  var reviews = {
    'اللغة العربية': 'راجع القراءة والفكرة الأساسية وأنواع الكلمات والمفردات، ثم اكتب فقرة قصيرة من ثلاث جمل.',
    'الرياضيات': 'راجع القيمة المكانية والعمليات والقياس والأشكال، وتأكد من ترتيب خطوات الحل.',
    'اللغة الإنجليزية': 'Review the vocabulary and sentence patterns. Read, complete, and write a short description.',
    'اكتشف': 'ارسم خريطة تربط الإنسان والمجتمع والمادة والكائنات والبيئة.',
    'التربية الدينية': 'راجع المعاني والقيم، ثم اكتب تطبيقًا عمليًا لكل قيمة في حياتك.',
    'القيم واحترام الآخر': 'راجع التعاون والمسؤولية والحوار، واختر حلًا مناسبًا لكل موقف.'
  };
  var all = [];
  function add(obj) { all.push(Object.assign({ grade: 'الثاني', stage: 'primary', sourceUrl: SOURCE, created_at: '2026-01-01T00:00:00.000Z' }, obj)); }
  Object.keys(subjects).forEach(function (subject) {
    [1, 2].forEach(function (term) {
      subjects[subject].forEach(function (unit, i) {
        var body = 'شرح مبسط: ' + notes[subject] + '\n\nهدف التعلم: أن يشرح الطالب فكرة "' + unit + '"، ويربطها بموقف من حياته.\n\nنشاط: اقرأ المثال، ناقشه مع زميل أو ولي أمر، ثم أنشئ مثالًا جديدًا من عندك.\n\nتحدي: اشرح كيف عرفت أن إجابتك أو توقعك صحيح.';
        add({ id: 'g2-' + term + '-' + i + '-lesson-' + subject, title: unit, content: body, subject: subject, term: term, type: 'lessons', order: i + 1 });
        add({ id: 'g2-' + term + '-' + i + '-exercise-' + subject, title: 'تدريب تطبيقي: ' + unit, content: 'نفذ في كراستك:\n1) لخص الفكرة في سطرين.\n2) حل مثالًا من عندك.\n3) قارن إجابتك بالخطوات.\n\nسؤال التفكير: ' + questions[subject], question: questions[subject], answer: 'تقبل الإجابة التي توضح الفكرة وتستخدمها في موقف مناسب.', subject: subject, term: term, type: 'exercises', order: i + 1 });
      });
      add({ id: 'g2-' + term + '-review-' + subject, title: 'مراجعة شاملة - ' + subject, content: reviews[subject] + '\n\nخطة المراجعة: اقرأ الملخص، حل تدريبًا، اشرح فكرة لزميل، ثم سجل السؤال الذي ما زلت تحتاج إلى مراجعته.', question: 'ما أهم ثلاث أفكار تعلمتها هذا الترم؟', answer: 'إجابة مفتوحة مرتبطة بموضوعات الترم.', subject: subject, term: term, type: 'reviews', order: 90 });
      add({ id: 'g2-' + term + '-exam-' + subject, title: 'اختبار تمهيدي - ' + subject, content: 'الزمن المقترح: 20 دقيقة\n\nالسؤال الأول: اقرأ أو لاحظ الموقف وحدد الفكرة الصحيحة.\nالسؤال الثاني: طبّق الفكرة في مثال جديد.\nالسؤال الثالث: اشرح سبب اختيارك في جملة قصيرة.', question: 'أي سؤال كان أسهل؟ وأي سؤال يحتاج إلى تدريب إضافي؟', answer: 'إجابة تأملية شخصية يراجعها المعلم أو ولي الأمر.', subject: subject, term: term, type: 'exams', order: 100 });
    });
  });
  add({ id: 'g2-sources', title: 'مصادر منهج الصف الثاني الابتدائي', content: 'مكتبة وزارة التربية والتعليم:\n' + MINISTRY + '\n\nفهرس كتب الصف الثاني وأدلة المعلم:\n' + SOURCE, subject: 'اكتشف', term: 1, type: 'lessons', order: 0 });
  function seed() {
    var old = []; try { old = JSON.parse(localStorage.getItem('offline_lessons') || '[]'); } catch (e) { old = []; }
    var ids = {}; old.forEach(function (x) { if (x && x.id) ids[x.id] = true; });
    localStorage.setItem('offline_lessons', JSON.stringify(old.concat(all.filter(function (x) { return !ids[x.id]; }))));
  }
  function addReviewChip() {
    if (String(window.currentStage || '') !== 'primary' || String(window.currentGrade || '') !== 'الثاني') return;
    var list = document.getElementById('termsList'); if (!list || list.querySelector('[data-grade2-reviews]')) return;
    Array.prototype.forEach.call(list.querySelectorAll('.term-card'), function (card, i) {
      var chip = document.createElement('div'); chip.className = 'section-chip'; chip.setAttribute('data-grade2-reviews', '1'); chip.textContent = '🔁 مراجعات';
      chip.onclick = function () { window.openContent('reviews', i + 1, i === 0 ? 'الترم الأول' : 'الترم الثاني'); };
      var holder = card.querySelector('.term-sections'); if (holder) holder.appendChild(chip);
    });
  }
  var oldRender = window.renderTerms;
  window.renderTerms = function () { if (typeof oldRender === 'function') oldRender(); addReviewChip(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { seed(); addReviewChip(); }); else { seed(); addReviewChip(); }
  window.GRADE2_CURRICULUM_SOURCES = { ministryLibrary: MINISTRY, index: SOURCE };
})();
