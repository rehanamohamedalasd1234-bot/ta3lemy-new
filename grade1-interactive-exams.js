/* الاختبارات الإلكترونية التفاعلية - الصف الأول الابتدائي */
(function () {
  'use strict';

  var subjects = ['اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'اكتشف', 'التربية الدينية', 'القيم واحترام الآخر'];
  var colors = ['#C2185B', '#1976D2', '#00897B', '#F57C00', '#6A1B9A', '#2E7D32'];
  var exams = {};

  function q(text, choices, answer, explanation) {
    return { text: text, choices: choices, answer: answer, explanation: explanation };
  }

  function buildExam(subject, term) {
    var key = subject + '-' + term;
    if (subject === 'اللغة العربية') {
      exams[key] = [
        q('أي كلمة تبدأ بحرف الباء؟', ['باب', 'قلم', 'شمس'], 0, 'كلمة باب تبدأ بحرف الباء.'),
        q('اختر الكلمة التي تدل على شيء واحد.', ['كتب', 'كتاب', 'أقلام'], 1, 'كتاب مفرد، أما كتب وأقلام فجمع.'),
        q('أكمل: هذا ____ جميل.', ['كتاب', 'كتب', 'يكتب'], 0, 'الجملة الصحيحة: هذا كتاب جميل.'),
        q('أي كلمة فيها مد بالألف؟', ['باب', 'بنت', 'جلس'], 0, 'في كلمة باب صوت مد بالألف.'),
        q('ما الكلمة المناسبة للصورة الذهنية: شيء نقرأه؟', ['كتاب', 'ملعقة', 'كرة'], 0, 'نقرأ الكتاب.'),
      ];
    } else if (subject === 'الرياضيات') {
      exams[key] = [
        q('ما العدد الذي يأتي بعد 5؟', ['4', '6', '7'], 1, 'بعد العدد 5 يأتي العدد 6.'),
        q('أي عدد أكبر؟', ['3', '8', '5'], 1, 'العدد 8 أكبر من 3 و5.'),
        q('لدى سلمى 2 تفاحة وأخذت تفاحة أخرى. كم تفاحة معها؟', ['2', '3', '4'], 1, '2 + 1 = 3.'),
        q('أي شكل له ثلاثة أضلاع؟', ['دائرة', 'مثلث', 'مربع'], 1, 'المثلث له ثلاثة أضلاع.'),
        q('ما العدد الذي يسبق 10؟', ['8', '9', '11'], 1, 'قبل 10 يأتي العدد 9.'),
      ];
    } else if (subject === 'اللغة الإنجليزية') {
      exams[key] = [
        q('Choose the word that starts with B.', ['ball', 'sun', 'cat'], 0, 'Ball starts with the letter B.'),
        q('How do you greet your teacher in the morning?', ['Good morning', 'Good night', 'Goodbye'], 0, 'We say Good morning in the morning.'),
        q('Choose the number after 4.', ['3', '5', '6'], 1, 'The number after 4 is 5.'),
        q('Complete: I am ____.', ['happy', 'house', 'blue'], 0, 'Happy is a feeling.'),
        q('Which word names a color?', ['red', 'school', 'book'], 0, 'Red is a color.'),
      ];
    } else if (subject === 'اكتشف') {
      exams[key] = [
        q('أي عضو نستخدمه للرؤية؟', ['العين', 'الأذن', 'اليد'], 0, 'نستخدم العين للرؤية.'),
        q('ما السلوك الصحي؟', ['غسل اليدين', 'رمي القمامة', 'عدم النوم'], 0, 'غسل اليدين يحافظ على الصحة.'),
        q('أين نتعلم؟', ['المدرسة', 'المطبخ فقط', 'السيارة'], 0, 'نتعلم في المدرسة.'),
        q('ماذا تحتاج النبتة لتنمو؟', ['الماء والضوء', 'الضوضاء', 'القمامة'], 0, 'تحتاج النبتة إلى الماء والضوء.'),
        q('أي سلوك يحافظ على البيئة؟', ['زراعة شجرة', 'كسر الزجاج', 'إهدار الماء'], 0, 'زراعة الأشجار سلوك إيجابي للبيئة.'),
      ];
    } else if (subject === 'التربية الدينية') {
      exams[key] = [
        q('ما السلوك الذي يحبه الجميع؟', ['الصدق', 'الكذب', 'إيذاء الآخرين'], 0, 'الصدق خلق حسن.'),
        q('ماذا نفعل قبل الطعام؟', ['نغسل أيدينا', 'نرمي الطعام', 'نصرخ'], 0, 'غسل اليدين من النظافة.'),
        q('كيف نعامل الوالدين؟', ['بالاحترام', 'بالإهمال', 'بالغضب دائمًا'], 0, 'نحترم الوالدين ونحسن معاملتهما.'),
        q('ماذا نفعل إذا أخطأنا؟', ['نعتذر ونصلح الخطأ', 'نلوم الآخرين', 'نخفي الخطأ دائمًا'], 0, 'الاعتذار وإصلاح الخطأ سلوك مسؤول.'),
        q('ما معنى الرحمة؟', ['مساعدة من يحتاج', 'السخرية من الناس', 'رفض التعاون'], 0, 'الرحمة تكون بمساعدة الآخرين.'),
      ];
    } else {
      exams[key] = [
        q('ماذا تفعل عندما يتحدث زميلك؟', ['أستمع إليه', 'أقاطعه', 'أضحك عليه'], 0, 'الاستماع احترام للآخر.'),
        q('كيف نستخدم أدوات المدرسة؟', ['نحافظ عليها', 'نكسرها', 'نخفيها'], 0, 'المحافظة على الأدوات مسؤولية.'),
        q('ماذا نفعل عند اختلاف الرأي؟', ['نتحدث بهدوء', 'نتشاجر', 'نصرخ'], 0, 'الحوار الهادئ يساعد على حل الخلاف.'),
        q('أي سلوك يدل على التعاون؟', ['مساعدة زميل', 'رفض المشاركة', 'إفساد العمل'], 0, 'مساعدة الزميل تعاون.'),
        q('كيف نحافظ على المكان؟', ['نضع القمامة في سلة', 'نرميها على الأرض', 'نهدر الماء'], 0, 'وضع القمامة في السلة يحافظ على المكان.'),
      ];
    }
    // نضيف سؤالًا مختلفًا للترم الثاني حتى لا تكون النتيجة نسخة مكررة.
    if (term === 2) {
      exams[key][4] = q(subject === 'اللغة الإنجليزية' ? 'Choose the correct word: This is my ____.' : 'اختر الإجابة التي تمثل سلوكًا صحيحًا في الدرس.', subject === 'اللغة الإنجليزية' ? ['house', 'run', 'sad'] : ['أحافظ على نظافة المكان', 'أهدر الماء', 'أؤذي زميلي'], 0, 'الإجابة الأولى هي الاختيار الصحيح.');
    }
  }

  subjects.forEach(function (subject) { buildExam(subject, 1); buildExam(subject, 2); });

  function examKey(subject, term) { return subject + '-' + term; }

  function injectStyle() {
    if (document.getElementById('interactiveExamStyles')) return;
    var style = document.createElement('style');
    style.id = 'interactiveExamStyles';
    style.textContent = '.iexam-card{background:#fff;border-radius:18px;padding:18px;margin-bottom:12px;box-shadow:var(--shadow);border-right:5px solid #1976D2;cursor:pointer}.iexam-card:active{transform:scale(.98)}.iexam-title{font-size:16px;font-weight:700;margin-bottom:5px}.iexam-meta{font-size:12px;color:#777}.iexam-progress{height:9px;background:#E3F2FD;border-radius:10px;overflow:hidden;margin:12px 0 18px}.iexam-progress>span{display:block;height:100%;background:linear-gradient(90deg,#1976D2,#42A5F5);transition:width .25s}.iexam-question{background:#fff;border-radius:18px;padding:20px;box-shadow:var(--shadow);line-height:1.9}.iexam-choice{width:100%;padding:13px 14px;border:2px solid #E0E0E0;background:#fff;border-radius:13px;font-family:inherit;text-align:right;margin-top:10px;cursor:pointer;font-size:14px}.iexam-choice:hover{border-color:#90CAF9}.iexam-choice.selected{border-color:#1976D2;background:#E3F2FD}.iexam-choice.correct{border-color:#2E7D32;background:#E8F5E9}.iexam-choice.wrong{border-color:#C62828;background:#FFEBEE}.iexam-result{background:linear-gradient(135deg,#E8F5E9,#F1F8E9);border-radius:18px;padding:22px;text-align:center;box-shadow:var(--shadow)}.iexam-score{font-size:42px;font-weight:800;color:#2E7D32}.iexam-actions{display:flex;gap:10px;margin-top:16px}.iexam-actions button{flex:1;padding:13px;border:0;border-radius:12px;font-family:inherit;font-weight:700;cursor:pointer}.iexam-primary{background:#1976D2;color:#fff}.iexam-secondary{background:#E3F2FD;color:#0D47A1}';
    document.head.appendChild(style);
  }

  function addExamChip() {
    if (String(window.currentStage || '') !== 'primary' || String(window.currentGrade || '') !== 'الأول') return;
    var list = document.getElementById('termsList');
    if (!list || list.querySelector('[data-interactive-exams]')) return;
    Array.prototype.forEach.call(list.querySelectorAll('.term-card'), function (card, i) {
      var term = i + 1;
      var chips = card.querySelector('.term-sections');
      if (!chips) return;
      var button = document.createElement('div');
      button.className = 'section-chip';
      button.setAttribute('data-interactive-exams', '1');
      button.textContent = '🎯 اختبار تفاعلي';
      button.onclick = function () { window.openInteractiveExamList(term, term === 1 ? 'الترم الأول' : 'الترم الثاني'); };
      chips.appendChild(button);
    });
  }

  function enhanceRenderTerms() {
    var original = window.renderTerms;
    window.renderTerms = function () {
      if (typeof original === 'function') original();
      addExamChip();
    };
  }

  window.openInteractiveExamList = function (term, termName) {
    injectStyle();
    var list = document.getElementById('contentList');
    var title = document.getElementById('contentTitle');
    var head = document.getElementById('contentHeaderTitle');
    var sub = document.getElementById('contentHeaderSub');
    if (title) title.textContent = '🎯 الاختبارات التفاعلية';
    if (head) head.textContent = (window.currentSubject || '') + ' - ' + termName;
    if (sub) sub.textContent = 'اختر اختبارًا وابدأ الحل';
    var key = examKey(window.currentSubject, term);
    var count = (exams[key] || []).length;
    if (list) {
      list.innerHTML = '<div class="iexam-card" style="border-right-color:' + (colors[subjects.indexOf(window.currentSubject)] || '#1976D2') + '" onclick="startInteractiveExam(' + term + ',\'' + String(termName).replace(/'/g, '') + '\')"><div class="iexam-title">اختبار ' + (window.currentSubject || '') + ' التفاعلي</div><div class="iexam-meta">' + count + ' أسئلة • تصحيح فوري • نتيجة نهائية</div></div>';
    }
    if (window.screenHistory && typeof window.showScreen === 'function') { window.screenHistory.push(window.currentScreen); window.showScreen('contentScreen'); }
  };

  window.startInteractiveExam = function (term, termName) {
    injectStyle();
    var subject = window.currentSubject || '';
    var questions = exams[examKey(subject, term)] || [];
    var index = 0;
    var answers = [];
    var viewerTitle = document.getElementById('viewerTitle');
    if (viewerTitle) viewerTitle.textContent = '🎯 اختبار ' + subject;
    function render() {
      var qn = questions[index];
      var pct = Math.round((index / questions.length) * 100);
      var html = '<div class="iexam-progress"><span style="width:' + pct + '%"></span></div><div style="font-size:12px;color:#777;margin-bottom:10px;">السؤال ' + (index + 1) + ' من ' + questions.length + '</div><div class="iexam-question"><div style="font-size:18px;font-weight:700;margin-bottom:8px;">' + qn.text + '</div>';
      qn.choices.forEach(function (choice, i) { html += '<button class="iexam-choice" data-choice="' + i + '">' + choice + '</button>'; });
      html += '<div id="iexamFeedback" style="margin-top:12px;font-size:13px;line-height:1.8;"></div><div class="iexam-actions"><button class="iexam-primary" id="iexamNext" disabled>' + (index === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي') + '</button><button class="iexam-secondary" id="iexamExit">خروج</button></div></div>';
      var body = document.getElementById('viewerBody');
      if (body) body.innerHTML = html;
      document.querySelectorAll('.iexam-choice').forEach(function (btn) {
        btn.onclick = function () {
          var selected = Number(btn.getAttribute('data-choice'));
          document.querySelectorAll('.iexam-choice').forEach(function (b) { b.disabled = true; });
          btn.classList.add(selected === qn.answer ? 'correct' : 'wrong');
          if (selected !== qn.answer) document.querySelector('[data-choice="' + qn.answer + '"]').classList.add('correct');
          answers[index] = selected;
          var feedback = document.getElementById('iexamFeedback');
          feedback.innerHTML = (selected === qn.answer ? '<span style="color:#2E7D32;font-weight:700">✅ إجابة صحيحة</span>' : '<span style="color:#C62828;font-weight:700">❌ ليست الإجابة الصحيحة</span>') + '<br>' + qn.explanation;
          document.getElementById('iexamNext').disabled = false;
        };
      });
      document.getElementById('iexamNext').onclick = function () { if (index === questions.length - 1) finish(); else { index++; render(); } };
      document.getElementById('iexamExit').onclick = function () { if (typeof window.goBack === 'function') window.goBack(); };
    }
    function finish() {
      var score = answers.reduce(function (sum, a, i) { return sum + (a === questions[i].answer ? 1 : 0); }, 0);
      var percent = Math.round((score / questions.length) * 100);
      var body = document.getElementById('viewerBody');
      if (body) body.innerHTML = '<div class="iexam-result"><div style="font-size:20px;font-weight:700;">أحسنت! أنهيت الاختبار</div><div class="iexam-score">' + score + '/' + questions.length + '</div><div style="font-size:16px;margin-top:6px;">النسبة: ' + percent + '%</div><div style="margin-top:14px;line-height:1.8;">' + (percent >= 80 ? 'ممتاز، واصل التقدم!' : 'راجع الدرس ثم أعد المحاولة لتثبت فهمك.') + '</div><div class="iexam-actions"><button class="iexam-primary" onclick="startInteractiveExam(' + term + ',\'' + String(termName).replace(/'/g, '') + '\')">إعادة الاختبار</button><button class="iexam-secondary" onclick="openInteractiveExamList(' + term + ',\'' + String(termName).replace(/'/g, '') + '\')">العودة للاختبارات</button></div></div>';
    }
    if (window.screenHistory && typeof window.showScreen === 'function') { window.screenHistory.push(window.currentScreen); window.showScreen('viewerScreen'); }
    render();
  };

  function init() { enhanceRenderTerms(); addExamChip(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
