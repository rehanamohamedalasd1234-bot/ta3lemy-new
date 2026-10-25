/*
 * محتوى الصف الأول الابتدائي - التعليم العام
 *
 * هذا الملف يضيف محتوى أصليًا مبسطًا ومنظمًا قابلًا للتوسع، ولا يستبدل
 * الكتب الرسمية. روابط المصادر الرسمية/التوثيقية موجودة في sourceUrl.
 */
(function () {
  'use strict';

  var SOURCE_PAGE = 'https://edu2-egypt.com/books-grade1';
  var MINISTRY_LIBRARY = 'https://ellibrary.moe.gov.eg/Books/Books-Primary';
  var ENGLISH_T2_SOURCE = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026/Primary/Primary1/Term2/StudentBook/English_Prim1_Tr2.pdf';

  var subjects = {
    'اللغة العربية': {
      icon: '📖',
      terms: {
        1: ['الاستماع والتحدث', 'الحروف وأصواتها', 'المدود والتنوين', 'كلمات وجمل قصيرة'],
        2: ['قراءة كلمات مألوفة', 'اللام الشمسية والقمرية', 'الجملة الاسمية البسيطة', 'التعبير الشفهي والكتابي']
      }
    },
    'الرياضيات': {
      icon: '🔢',
      terms: {
        1: ['الأعداد حتى 10', 'المقارنة والترتيب', 'الجمع بالصور', 'الأشكال والأنماط'],
        2: ['الأعداد حتى 20', 'الطرح بالصور', 'القياس والوقت', 'المجسمات والبيانات']
      }
    },
    'اللغة الإنجليزية': {
      icon: '🔤',
      terms: {
        1: ['Greetings and Introductions', 'My Family', 'Colors and Numbers', 'My School'],
        2: ['Days and Meals', 'Feelings', 'My House', 'Animals and Nature']
      }
    },
    'اكتشف': {
      icon: '🌍',
      terms: {
        1: ['أنا وأسرتي', 'جسمي وصحتي', 'بيتي ومدرستي', 'عالمي من حولي'],
        2: ['الماء والهواء', 'النباتات والحيوانات', 'البيئة والنظافة', 'السلامة والمسؤولية']
      }
    },
    'التربية الدينية': {
      icon: '🕌',
      terms: {
        1: ['الله خالقي', 'النظافة والطهارة', 'الصدق والأمانة', 'بر الوالدين'],
        2: ['الصلاة والدعاء', 'الرحمة والتعاون', 'آداب التعامل', 'مراجعة القيم والسلوك']
      }
    },
    'القيم واحترام الآخر': {
      icon: '🤝',
      terms: {
        1: ['أتعرف نفسي', 'أحترم أسرتي', 'أشارك زملائي', 'أحافظ على ممتلكاتي'],
        2: ['أقبل الاختلاف', 'أحل المشكلة بهدوء', 'أحافظ على بيئتي', 'أكون مسؤولًا']
      }
    }
  };

  var lessonNotes = {
    'اللغة العربية': 'نتدرّب على النطق الصحيح، ثم نقرأ كلمات قصيرة ونستخدمها في جملة مفيدة. يكرر الطالب الكلمة بصوت واضح، ويشير إلى الحرف أو الحركة المطلوبة، ثم يكتبها في كراسته.',
    'الرياضيات': 'نستخدم الأشياء والصور قبل الرموز. يعدّ الطالب عناصر حقيقية، يقارن بينها، ثم يعبّر عن النتيجة بالعدد أو علامة المقارنة المناسبة.',
    'اللغة الإنجليزية': 'Listen, repeat, point, and use the word in a short sentence. The learner practices the target sound, recognizes the word, and communicates with a partner.',
    'اكتشف': 'نتعلم من الملاحظة والسؤال والتجربة. يصف الطالب ما يراه، يربطه بحياته اليومية، ثم يقترح سلوكًا يحافظ به على نفسه وبيئته.',
    'التربية الدينية': 'نتعلم قيمة عملية ونحوّلها إلى سلوك يومي: نقول الصدق، نحافظ على النظافة، نرحم الآخرين، ونشكر الله على نعمه.',
    'القيم واحترام الآخر': 'القيمة لا تحفظ فقط؛ بل نمارسها في موقف. نفكر في شعور الآخرين، نختار سلوكًا محترمًا، ونراجع أثر اختيارنا على المجموعة.'
  };

  var questionTemplates = {
    'اللغة العربية': 'اذكر كلمة جديدة تعلمتها، ثم استخدمها في جملة قصيرة.',
    'الرياضيات': 'ارسم موقفًا من حياتك اليومية يوضح الفكرة، ثم اكتب العدد أو العملية المناسبة.',
    'اللغة الإنجليزية': 'Say one sentence using the new word, then draw what it means.',
    'اكتشف': 'ماذا لاحظت؟ اذكر سببًا واحدًا، واقترح سلوكًا صحيحًا.',
    'التربية الدينية': 'ما السلوك الصحيح في هذا الموقف؟ ولماذا؟',
    'القيم واحترام الآخر': 'كيف تتصرف باحترام في هذا الموقف؟ اذكر خطوة عملية واحدة.'
  };

  var reviewPrompts = {
    'اللغة العربية': 'راجع الحروف والكلمات والجمل، واقرأ بصوت واضح ثم اكتب ثلاث كلمات من ذاكرتك.',
    'الرياضيات': 'راجع العد والمقارنة والعمليات بالصور، ثم حل ثلاثة أمثلة من الحياة اليومية.',
    'اللغة الإنجليزية': 'Review the words, sounds, and sentences. Point, say, write, and use each word in context.',
    'اكتشف': 'راجع المفاهيم من خلال خريطة ذهنية: الإنسان، المكان، الكائنات، والبيئة.',
    'التربية الدينية': 'راجع القيم التي تعلمتها، واكتب مثالًا على تطبيق كل قيمة في البيت أو المدرسة.',
    'القيم واحترام الآخر': 'راجع مواقف الاحترام والتعاون والمسؤولية، واختر أفضل تصرف في كل موقف.'
  };

  function lesson(subject, term, unit, index) {
    var title = unit;
    var body = 'شرح مبسط: ' + lessonNotes[subject] + '\n\nهدف التعلم: أن يشرح الطالب فكرة "' + unit + '" بكلماته، ويمارسها في نشاط قصير.\n\nنشاط تفاعلي: اعرض مثالًا من البيت أو المدرسة، تحدث عنه مع ولي أمرك أو زميلك، ثم ارسمه أو اكتبه.\n\nتحدي صغير: حاول أن تذكر مثالًا جديدًا لا يوجد في الشرح.';
    return {
      id: 'g1-' + term + '-' + index + '-lesson',
      title: title,
      content: body,
      subject: subject,
      grade: 'الأول',
      stage: 'primary',
      term: term,
      type: 'lessons',
      order: index,
      sourceUrl: SOURCE_PAGE,
      created_at: '2026-01-01T00:00:00.000Z'
    };
  }

  function exercise(subject, term, unit, index) {
    return {
      id: 'g1-' + term + '-' + index + '-exercise',
      title: 'تدريب: ' + unit,
      content: 'أكمل التدريب في كراستك:\n1) اشرح الفكرة بكلمة أو رسم.\n2) طبّقها على مثال من حياتك.\n3) راجع إجابتك مع شخص بالغ.\n\nسؤال التفكير: ' + questionTemplates[subject],
      question: questionTemplates[subject],
      answer: 'إجابة مفتوحة؛ تقبل الإجابة الصحيحة التي توضح الفكرة وتستخدمها في موقف مناسب.',
      subject: subject,
      grade: 'الأول',
      stage: 'primary',
      term: term,
      type: 'exercises',
      order: index,
      sourceUrl: SOURCE_PAGE,
      created_at: '2026-01-01T00:00:00.000Z'
    };
  }

  function review(subject, term, index) {
    return {
      id: 'g1-' + term + '-' + index + '-review',
      title: 'مراجعة شاملة قبل الاختبار - ' + subject,
      content: reviewPrompts[subject] + '\n\nخطة المراجعة: اقرأ الملخص، نفذ النشاط، أجب عن سؤال التدريب، ثم اشرح الفكرة لشخص آخر.',
      question: 'اكتب أو ارسم أهم ثلاث أفكار تعلمتها في هذا الترم.',
      answer: 'تختلف الإجابة حسب الطالب، ويشترط أن ترتبط بموضوعات الترم.',
      subject: subject,
      grade: 'الأول',
      stage: 'primary',
      term: term,
      type: 'reviews',
      order: 90,
      sourceUrl: SOURCE_PAGE,
      created_at: '2026-01-01T00:00:00.000Z'
    };
  }

  function exam(subject, term, index) {
    return {
      id: 'g1-' + term + '-' + index + '-exam',
      title: 'اختبار قصير شامل - ' + subject,
      content: 'الزمن المقترح: 15 دقيقة\n\nالسؤال الأول: اختر أو ارسم الإجابة الصحيحة للفكرة التي درستها.\nالسؤال الثاني: طبّق الفكرة في موقف جديد.\nالسؤال الثالث: اشرح إجابتك بكلمة أو جملة قصيرة.\n\nبعد الحل: راجع عملك وحدد سؤالًا تريد فهمه أكثر.',
      question: 'ما الفكرة التي احتجت إلى مراجعتها؟ وكيف ستتدرب عليها؟',
      answer: 'إجابة تأملية شخصية؛ يراجع المعلم أو ولي الأمر صحة التطبيق.',
      subject: subject,
      grade: 'الأول',
      stage: 'primary',
      term: term,
      type: 'exams',
      order: 100,
      sourceUrl: SOURCE_PAGE,
      created_at: '2026-01-01T00:00:00.000Z'
    };
  }

  var all = [];
  Object.keys(subjects).forEach(function (subject) {
    [1, 2].forEach(function (term) {
      subjects[subject].terms[term].forEach(function (unit, i) {
        all.push(lesson(subject, term, unit, i + 1));
        all.push(exercise(subject, term, unit, i + 1));
      });
      all.push(review(subject, term, 90));
      all.push(exam(subject, term, 100));
    });
  });

  // روابط المصادر المتاحة للطالب/المعلم، دون نسخ محتوى الكتب داخل التطبيق.
  all.push({
    id: 'g1-sources', title: 'مصادر المنهج الرسمية للصف الأول',
    content: 'المكتبة الإلكترونية لوزارة التربية والتعليم:\n' + MINISTRY_LIBRARY + '\n\nفهرس كتب الصف الأول وأدلة المعلم:\n' + SOURCE_PAGE + '\n\nكتاب اللغة الإنجليزية الرسمي - الفصل الدراسي الثاني:\n' + ENGLISH_T2_SOURCE,
    subject: 'اللغة الإنجليزية', grade: 'الأول', stage: 'primary', term: 2,
    type: 'lessons', order: 0, sourceUrl: SOURCE_PAGE, created_at: '2026-01-01T00:00:00.000Z'
  });

  function seed() {
    var old = [];
    try { old = JSON.parse(localStorage.getItem('offline_lessons') || '[]'); } catch (e) { old = []; }
    var existing = {};
    old.forEach(function (item) { if (item && item.id) existing[item.id] = true; });
    var merged = old.concat(all.filter(function (item) { return !existing[item.id]; }));
    localStorage.setItem('offline_lessons', JSON.stringify(merged));
    window.primaryGrade1ContentReady = true;
  }

  function enhanceTerms() {
    var original = window.renderTerms;
    window.renderTerms = function () {
      if (typeof original === 'function') original();
      var list = document.getElementById('termsList');
      if (!list || list.querySelector('[data-reviews-chip]')) return;
      Array.prototype.forEach.call(list.querySelectorAll('.term-card'), function (card, i) {
        var term = i + 1;
        var chips = card.querySelector('.term-sections');
        if (!chips) return;
        var button = document.createElement('div');
        button.className = 'section-chip';
        button.setAttribute('data-reviews-chip', '1');
        button.textContent = '🔁 مراجعات';
        button.onclick = function () { window.openContent('reviews', term, term === 1 ? 'الترم الأول' : 'الترم الثاني'); };
        chips.appendChild(button);
      });
    };

    var originalOpen = window.openContent;
    window.openContent = async function (type, num, name) {
      if (type === 'reviews') {
        window.currentTerm = num;
        window.currentSection = type;
        var title = document.getElementById('contentTitle');
        var head = document.getElementById('contentHeaderTitle');
        var sub = document.getElementById('contentHeaderSub');
        if (title) title.textContent = '🔁 مراجعات';
        if (head) head.textContent = (window.currentSubject || '') + ' - ' + name;
        if (sub) sub.textContent = 'مراجعات شاملة';
        var list = document.getElementById('contentList');
        if (list) {
          var items = all.filter(function (x) { return x.type === 'reviews' && x.subject === window.currentSubject && x.term === num && x.grade === window.currentGrade; });
          list.innerHTML = items.map(function (it) { return '<div class="content-item" onclick="viewContent(\'' + it.id + '\')"><div class="content-item-icon">🔁</div><div class="content-item-info"><div class="content-item-title">' + it.title + '</div><div class="content-item-sub">مراجعة منظمة قبل الاختبار</div></div><div class="content-item-arrow">‹</div></div>'; }).join('') || '<div class="empty-state">لا توجد مراجعات بعد</div>';
        }
        if (window.screenHistory && typeof window.showScreen === 'function') { window.screenHistory.push(window.currentScreen); window.showScreen('contentScreen'); }
        return;
      }
      return original.apply(this, arguments);
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { seed(); enhanceTerms(); });
  else { seed(); enhanceTerms(); }
  window.GRADE1_CURRICULUM_SOURCES = { ministryLibrary: MINISTRY_LIBRARY, index: SOURCE_PAGE, englishTerm2: ENGLISH_T2_SOURCE };
})();
