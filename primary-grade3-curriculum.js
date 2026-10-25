/* محتوى الصف الثالث الابتدائي - التعليم العام */
(function () {
  'use strict';
  var SOURCE = 'https://edu2-egypt.com/grade-3';
  var MINISTRY = 'https://ellibrary.moe.gov.eg/Books/Books-Primary';
  var subjects = {
    'اللغة العربية': ['أقرأ وأستنتج', 'النحو في جمل مفيدة', 'المفردات والتعبير', 'أكتب رسالة قصيرة'],
    'الخط العربي': ['خط النسخ والحروف', 'وصل الحروف والكلمات', 'كتابة جمل منسقة', 'تطبيقات الخط'],
    'الرياضيات': ['الأعداد والقيمة المكانية', 'الجمع والطرح متعدد الخطوات', 'الضرب والقسمة', 'الكسور والقياس'],
    'اللغة الإنجليزية': ['People and Places', 'Daily Routines', 'Animals and Nature', 'Stories and Information'],
    'اكتشف': ['المجتمع المصري', 'الموارد والطاقة', 'الكائنات الحية', 'المواطنة والبيئة'],
    'التربية الدينية': ['القرآن والقيم', 'العبادات والآداب', 'الصدق والمسؤولية', 'الرحمة والتعاون'],
    'القيم واحترام الآخر': ['الهوية والانتماء', 'التواصل الآمن', 'العمل الجماعي', 'العدل وتقبل الاختلاف']
  };
  var notes = {
    'اللغة العربية': 'يقرأ الطالب نصًا مناسبًا، يستنتج الفكرة والمعنى من السياق، يراجع قاعدة لغوية بسيطة، ثم يكتب فقرة مترابطة.',
    'الخط العربي': 'يتدرب الطالب على اتجاهات الحروف وتناسبها على السطر، ثم ينسخ كلمات وجملًا مع مراعاة المسافات والوضوح.',
    'الرياضيات': 'نمثل المسألة، نحدد العملية، ننفذ الخطوات بترتيب، ثم نتحقق بالتقدير أو العملية العكسية.',
    'اللغة الإنجليزية': 'Read and understand short texts, use grammar patterns in context, and write clear sentences about familiar topics.',
    'اكتشف': 'نبحث في سؤال من الحياة، نجمع ملاحظة أو دليلًا، ثم نفسر النتيجة ونقترح دورًا إيجابيًا للطالب.',
    'التربية الدينية': 'نفهم المعنى ونربطه بالخلق والعمل؛ فالمعرفة تظهر في الصدق والأمانة والرحمة واحترام الآخرين.',
    'القيم واحترام الآخر': 'نميز بين الرأي والحقيقة، نتحاور بأمان، ونختار حلًا عادلًا يراعي حقوق الفرد والمجموعة.'
  };
  var prompts = {
    'اللغة العربية': 'اكتب فقرة من ثلاث جمل تستخدم فيها مفردتين من الدرس، ثم راجع علامات الترقيم.',
    'الخط العربي': 'انسخ الجملة في كراستك ثلاث مرات، وحافظ على السطر والمسافات، ثم اختر أوضح نسخة.',
    'الرياضيات': 'أنشئ مسألة واقعية، اكتب خطوات الحل، وتحقق من الإجابة بالعملية العكسية.',
    'اللغة الإنجليزية': 'Write three sentences about the topic and underline the new vocabulary.',
    'اكتشف': 'ما الملاحظة أو الدليل الذي يدعم إجابتك؟ وما الحل الذي يحافظ على الموارد؟',
    'التربية الدينية': 'اذكر موقفًا تطبق فيه القيمة، ووضح أثرها على نفسك وعلى الآخرين.',
    'القيم واحترام الآخر': 'اقترح حلًا يحترم الرأي المختلف، ثم اشرح لماذا هو عادل وآمن.'
  };
  var reviews = {
    'اللغة العربية': 'راجع الفكرة الأساسية والمفردات والقواعد والكتابة، ثم اقرأ فقرتك بصوت واضح.',
    'الخط العربي': 'راجع أشكال الحروف واتصالها، واكتب سطرًا منظمًا مع مراعاة السطر والمسافات.',
    'الرياضيات': 'راجع القيمة المكانية والعمليات والكسور والقياس، واستخدم التقدير للتحقق.',
    'اللغة الإنجليزية': 'Review the vocabulary, grammar, reading, and writing tasks. Read your paragraph aloud.',
    'اكتشف': 'اربط المجتمع والموارد والكائنات والبيئة في خريطة مفاهيم واحدة.',
    'التربية الدينية': 'راجع المعاني والآداب والقيم، واكتب مثالًا واقعيًا لكل قيمة.',
    'القيم واحترام الآخر': 'راجع الانتماء والحوار والتعاون والعدل، واختر التصرف الأفضل في مواقف مختلفة.'
  };
  var all = [];
  function add(obj) { all.push(Object.assign({ grade: 'الثالث', stage: 'primary', sourceUrl: SOURCE, created_at: '2026-01-01T00:00:00.000Z' }, obj)); }
  Object.keys(subjects).forEach(function (subject) {
    [1, 2].forEach(function (term) {
      subjects[subject].forEach(function (unit, i) {
        add({ id: 'g3-' + term + '-' + i + '-lesson-' + subject, title: unit, content: 'شرح مبسط: ' + notes[subject] + '\n\nهدف التعلم: أن يطبق الطالب فكرة "' + unit + '" في مثال جديد، وأن يشرح خطواته بوضوح.\n\nنشاط: اقرأ المثال أو لاحظ الموقف، ناقشه، ثم أنشئ تطبيقًا جديدًا من حياتك.\n\nتحدي: ما الدليل الذي يؤكد أن تطبيقك صحيح؟', subject: subject, term: term, type: 'lessons', order: i + 1 });
        add({ id: 'g3-' + term + '-' + i + '-exercise-' + subject, title: 'تدريب تطبيقي: ' + unit, content: 'نفذ في كراستك:\n1) لخص الفكرة في سطرين.\n2) حل أو نفذ المثال.\n3) اشرح طريقة تفكيرك.\n\nسؤال التفكير: ' + prompts[subject], question: prompts[subject], answer: 'تقبل الإجابة التي توضح الفكرة وتطبقها في موقف صحيح.', subject: subject, term: term, type: 'exercises', order: i + 1 });
      });
      add({ id: 'g3-' + term + '-review-' + subject, title: 'مراجعة شاملة - ' + subject, content: reviews[subject] + '\n\nخطة المراجعة: اقرأ الملخص، نفذ تدريبًا، اشرح فكرة لشخص آخر، ثم سجل نقطة تحتاج إلى مزيد من التدريب.', question: 'ما أهم ثلاث مهارات أتقنتها هذا الترم؟', answer: 'إجابة مفتوحة مرتبطة بموضوعات الترم.', subject: subject, term: term, type: 'reviews', order: 90 });
      add({ id: 'g3-' + term + '-exam-' + subject, title: 'اختبار تمهيدي - ' + subject, content: 'الزمن المقترح: 25 دقيقة\n\nالسؤال الأول: افهم الموقف وحدد الفكرة.\nالسؤال الثاني: طبّق المهارة في مثال جديد.\nالسؤال الثالث: اشرح سبب إجابتك بخطوات مرتبة.', question: 'أي مهارة تحتاج إلى تدريب إضافي؟ اكتب خطة قصيرة للمراجعة.', answer: 'إجابة تأملية يراجعها المعلم أو ولي الأمر.', subject: subject, term: term, type: 'exams', order: 100 });
    });
  });
  add({ id: 'g3-sources', title: 'مصادر منهج الصف الثالث الابتدائي', content: 'مكتبة وزارة التربية والتعليم:\n' + MINISTRY + '\n\nفهرس كتب الصف الثالث وأدلة المعلم:\n' + SOURCE, subject: 'اكتشف', term: 1, type: 'lessons', order: 0 });
  function seed() {
    var old = []; try { old = JSON.parse(localStorage.getItem('offline_lessons') || '[]'); } catch (e) { old = []; }
    var ids = {}; old.forEach(function (x) { if (x && x.id) ids[x.id] = true; });
    localStorage.setItem('offline_lessons', JSON.stringify(old.concat(all.filter(function (x) { return !ids[x.id]; }))));
  }
  function addReviewChip() {
    if (String(window.currentStage || '') !== 'primary' || String(window.currentGrade || '') !== 'الثالث') return;
    var list = document.getElementById('termsList'); if (!list || list.querySelector('[data-grade3-reviews]')) return;
    Array.prototype.forEach.call(list.querySelectorAll('.term-card'), function (card, i) {
      var chip = document.createElement('div'); chip.className = 'section-chip'; chip.setAttribute('data-grade3-reviews', '1'); chip.textContent = '🔁 مراجعات';
      chip.onclick = function () { window.openContent('reviews', i + 1, i === 0 ? 'الترم الأول' : 'الترم الثاني'); };
      var holder = card.querySelector('.term-sections'); if (holder) holder.appendChild(chip);
    });
  }
  var oldRender = window.renderTerms;
  window.renderTerms = function () { if (typeof oldRender === 'function') oldRender(); addReviewChip(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { seed(); addReviewChip(); }); else { seed(); addReviewChip(); }
  window.GRADE3_CURRICULUM_SOURCES = { ministryLibrary: MINISTRY, index: SOURCE };
})();
