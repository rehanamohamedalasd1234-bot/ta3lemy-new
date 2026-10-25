/* الاختبارات الإلكترونية التفاعلية - الصف الثاني الابتدائي */
(function () {
  'use strict';
  var subjects = ['اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'اكتشف', 'التربية الدينية', 'القيم واحترام الآخر'];
  var exams = {};
  function q(text, choices, answer, explanation) { return { text: text, choices: choices, answer: answer, explanation: explanation }; }
  function build(subject, term) {
    var key = subject + '-' + term;
    if (subject === 'اللغة العربية') exams[key] = [
      q('أي جملة اسمية تبدأ باسم؟', ['السماء صافية.', 'يقرأ التلميذ.', 'اكتب الدرس.'], 0, 'الجملة الاسمية تبدأ باسم: السماء.'),
      q('اختر جمع كلمة "كتاب".', ['كاتب', 'كتب', 'مكتبة'], 1, 'جمع كتاب هو كتب.'),
      q('أي كلمة بها تاء مربوطة؟', ['مدرسة', 'بيت', 'نهر'], 0, 'مدرسة تنتهي بتاء مربوطة.'),
      q('ما عكس كلمة "كبير"؟', ['طويل', 'صغير', 'قريب'], 1, 'عكس كبير هو صغير.'),
      q('اختر الفعل في الجملة: "ذهب علي إلى المدرسة".', ['علي', 'المدرسة', 'ذهب'], 2, 'ذهب فعل يدل على حدث.'),
    ];
    else if (subject === 'الرياضيات') exams[key] = [
      q('ما ناتج 7 + 5؟', ['10', '12', '13'], 1, '7 + 5 = 12.'),
      q('ما ناتج 14 - 6؟', ['8', '9', '10'], 0, '14 - 6 = 8.'),
      q('أي عدد زوجي؟', ['7', '9', '12'], 2, '12 يقبل القسمة على 2.'),
      q('كم ضلعًا للمستطيل؟', ['3', '4', '5'], 1, 'للمستطيل أربعة أضلاع.'),
      q('إذا كانت الساعة 3:00، فأين يشير عقرب الساعات؟', ['إلى 3', 'إلى 6', 'إلى 12'], 0, 'عند الساعة الثالثة يشير عقرب الساعات إلى 3.'),
    ];
    else if (subject === 'اللغة الإنجليزية') exams[key] = [
      q('Choose the correct plural: one cat, two ____.', ['cat', 'cats', 'cates'], 1, 'The plural of cat is cats.'),
      q('Complete: She ____ a book.', ['have', 'has', 'are'], 1, 'With she, we use has.'),
      q('Which word is a place?', ['school', 'happy', 'seven'], 0, 'School is a place.'),
      q('Choose the opposite of hot.', ['cold', 'long', 'fast'], 0, 'The opposite of hot is cold.'),
      q('Choose the correct sentence.', ['I like apples.', 'I likes apples.', 'I liking apples.'], 0, 'With I, use the base verb like.'),
    ];
    else if (subject === 'اكتشف') exams[key] = [
      q('ما مصدر الضوء الطبيعي؟', ['الشمس', 'الطاولة', 'الكتاب'], 0, 'الشمس مصدر طبيعي للضوء.'),
      q('أي مادة تتغير حالتها عند التسخين؟', ['الثلج', 'الحجر دائمًا', 'الخشب دائمًا'], 0, 'الثلج يذوب عند التسخين.'),
      q('لماذا نرتدي الملابس المناسبة للطقس؟', ['للحفاظ على أجسامنا', 'لإهدار الماء', 'لإزعاج الآخرين'], 0, 'الملابس المناسبة تساعد على حماية الجسم.'),
      q('أي مصدر ماء صالح للشرب بعد تنقيته؟', ['ماء النهر', 'الزيت', 'الرمل'], 0, 'يمكن تنقية ماء النهر.'),
      q('ما فائدة إعادة الاستخدام؟', ['تقليل المخلفات', 'زيادة القمامة', 'إهدار الأشياء'], 0, 'إعادة الاستخدام تقلل المخلفات.'),
    ];
    else if (subject === 'التربية الدينية') exams[key] = [
      q('ما أثر الأمانة؟', ['الثقة', 'الخوف', 'الفوضى'], 0, 'الأمانة تبني الثقة.'),
      q('ماذا نفعل عند سماع النداء للصلاة؟', ['نستعد بأدب', 'نصرخ', 'نترك المكان متسخًا'], 0, 'نستعد للصلاة بأدب ونظافة.'),
      q('كيف نشكر الله على النعم؟', ['نستخدمها في الخير', 'نهدرها', 'نؤذي بها الآخرين'], 0, 'شكر النعمة يكون بحسن استخدامها.'),
      q('ماذا يعني العفو؟', ['ترك الانتقام عند القدرة', 'زيادة الخصام', 'إيذاء الصديق'], 0, 'العفو خلق كريم.'),
      q('ما التصرف الصحيح مع الجار؟', ['الإحسان إليه', 'إزعاجه', 'إهماله دائمًا'], 0, 'نحسن إلى الجار ونحترمه.'),
    ];
    else exams[key] = [
      q('كيف نبدأ العمل الجماعي؟', ['نوزع الأدوار', 'نترك شخصًا يعمل وحده', 'نتشاجر'], 0, 'توزيع الأدوار يجعل العمل منظمًا.'),
      q('ما معنى تقبل الاختلاف؟', ['احترام الآخرين رغم اختلافهم', 'السخرية منهم', 'منعهم من الكلام'], 0, 'نحترم الناس ونستمع إلى آرائهم.'),
      q('ماذا تفعل إذا كسرت شيئًا بالخطأ؟', ['أخبر المسؤول وأعتذر', 'أخفي الأمر', 'ألقي اللوم على غيري'], 0, 'المسؤولية تعني الاعتراف بالخطأ وإصلاحه.'),
      q('أي سلوك يحافظ على حق الآخرين؟', ['أنتظر دوري', 'آخذ كل شيء', 'أدفع زميلي'], 0, 'انتظار الدور احترام للحقوق.'),
      q('كيف نحل خلافًا صغيرًا؟', ['الحوار والاتفاق', 'الصراخ', 'الضرب'], 0, 'الحوار يساعد على حل الخلافات.'),
    ];
    if (term === 2) exams[key][4] = q(subject === 'اللغة الإنجليزية' ? 'Choose the correct question.' : 'ما أفضل طريقة للتأكد من فهم الدرس؟', subject === 'اللغة الإنجليزية' ? ['What is your name?', 'Name your is what?', 'Is what name you?'] : ['أشرح الفكرة وأحل تدريبًا', 'أترك الدرس', 'أحفظ دون فهم'], 0, 'الاختيار الأول هو السلوك أو الجملة الصحيحة.');
  }
  subjects.forEach(function (s) { build(s, 1); build(s, 2); });
  function key(s, t) { return s + '-' + t; }
  function style() {
    if (document.getElementById('interactiveExamStyles')) return;
    var s = document.createElement('style'); s.id = 'interactiveExamStyles';
    s.textContent = '.iexam-card{background:#fff;border-radius:18px;padding:18px;margin-bottom:12px;box-shadow:var(--shadow);border-right:5px solid #8E24AA;cursor:pointer}.iexam-title{font-size:16px;font-weight:700;margin-bottom:5px}.iexam-meta{font-size:12px;color:#777}.iexam-progress{height:9px;background:#F3E5F5;border-radius:10px;overflow:hidden;margin:12px 0 18px}.iexam-progress>span{display:block;height:100%;background:linear-gradient(90deg,#8E24AA,#BA68C8);transition:width .25s}.iexam-question{background:#fff;border-radius:18px;padding:20px;box-shadow:var(--shadow);line-height:1.9}.iexam-choice{width:100%;padding:13px 14px;border:2px solid #E0E0E0;background:#fff;border-radius:13px;font-family:inherit;text-align:right;margin-top:10px;cursor:pointer;font-size:14px}.iexam-choice.selected{border-color:#8E24AA;background:#F3E5F5}.iexam-choice.correct{border-color:#2E7D32;background:#E8F5E9}.iexam-choice.wrong{border-color:#C62828;background:#FFEBEE}.iexam-result{background:linear-gradient(135deg,#F3E5F5,#FCE4EC);border-radius:18px;padding:22px;text-align:center;box-shadow:var(--shadow)}.iexam-score{font-size:42px;font-weight:800;color:#8E24AA}.iexam-actions{display:flex;gap:10px;margin-top:16px}.iexam-actions button{flex:1;padding:13px;border:0;border-radius:12px;font-family:inherit;font-weight:700;cursor:pointer}.iexam-primary{background:#8E24AA;color:#fff}.iexam-secondary{background:#F3E5F5;color:#4A148C}';
    document.head.appendChild(s);
  }
  function addChip() {
    if (String(window.currentStage || '') !== 'primary' || String(window.currentGrade || '') !== 'الثاني') return;
    var list = document.getElementById('termsList'); if (!list || list.querySelector('[data-grade2-exams]')) return;
    Array.prototype.forEach.call(list.querySelectorAll('.term-card'), function (card, i) {
      var term = i + 1, chips = card.querySelector('.term-sections'); if (!chips) return;
      var b = document.createElement('div'); b.className = 'section-chip'; b.setAttribute('data-grade2-exams', '1'); b.textContent = '🎯 اختبار تفاعلي';
      b.onclick = function () { window.openGrade2ExamList(term, term === 1 ? 'الترم الأول' : 'الترم الثاني'); }; chips.appendChild(b);
    });
  }
  var oldRender = window.renderTerms;
  window.renderTerms = function () { if (typeof oldRender === 'function') oldRender(); addChip(); };
  window.openGrade2ExamList = function (term, name) {
    style(); var list = document.getElementById('contentList');
    if (document.getElementById('contentTitle')) document.getElementById('contentTitle').textContent = '🎯 الاختبارات التفاعلية';
    if (document.getElementById('contentHeaderTitle')) document.getElementById('contentHeaderTitle').textContent = (window.currentSubject || '') + ' - ' + name;
    if (document.getElementById('contentHeaderSub')) document.getElementById('contentHeaderSub').textContent = 'اختبار الصف الثاني التفاعلي';
    if (list) list.innerHTML = '<div class="iexam-card" onclick="startGrade2Exam(' + term + ',\'' + name + '\')"><div class="iexam-title">اختبار ' + (window.currentSubject || '') + ' التفاعلي</div><div class="iexam-meta">5 أسئلة • تصحيح فوري • نتيجة وإعادة محاولة</div></div>';
    if (window.screenHistory && typeof window.showScreen === 'function') { window.screenHistory.push(window.currentScreen); window.showScreen('contentScreen'); }
  };
  window.startGrade2Exam = function (term, termName) {
    style(); var questions = exams[key(window.currentSubject || '', term)] || [], index = 0, answers = [];
    if (document.getElementById('viewerTitle')) document.getElementById('viewerTitle').textContent = '🎯 اختبار الصف الثاني - ' + (window.currentSubject || '');
    function render() {
      var item = questions[index], body = document.getElementById('viewerBody');
      var h = '<div class="iexam-progress"><span style="width:' + Math.round(index / questions.length * 100) + '%"></span></div><div style="font-size:12px;color:#777;margin-bottom:10px;">السؤال ' + (index + 1) + ' من ' + questions.length + '</div><div class="iexam-question"><div style="font-size:18px;font-weight:700;margin-bottom:8px;">' + item.text + '</div>';
      item.choices.forEach(function (c, i) { h += '<button class="iexam-choice" data-choice="' + i + '">' + c + '</button>'; });
      h += '<div id="iexamFeedback" style="margin-top:12px;font-size:13px;line-height:1.8"></div><div class="iexam-actions"><button class="iexam-primary" id="iexamNext" disabled>' + (index === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي') + '</button><button class="iexam-secondary" id="iexamExit">خروج</button></div></div>';
      if (body) body.innerHTML = h;
      document.querySelectorAll('.iexam-choice').forEach(function (btn) { btn.onclick = function () { var selected = Number(btn.getAttribute('data-choice')); document.querySelectorAll('.iexam-choice').forEach(function (b) { b.disabled = true; }); btn.classList.add(selected === item.answer ? 'correct' : 'wrong'); if (selected !== item.answer) document.querySelector('[data-choice="' + item.answer + '"]').classList.add('correct'); answers[index] = selected; document.getElementById('iexamFeedback').innerHTML = (selected === item.answer ? '<span style="color:#2E7D32;font-weight:700">✅ إجابة صحيحة</span>' : '<span style="color:#C62828;font-weight:700">❌ حاول مرة أخرى في السؤال التالي</span>') + '<br>' + item.explanation; document.getElementById('iexamNext').disabled = false; }; });
      document.getElementById('iexamNext').onclick = function () { if (index === questions.length - 1) finish(); else { index++; render(); } };
      document.getElementById('iexamExit').onclick = function () { if (typeof window.goBack === 'function') window.goBack(); };
    }
    function finish() { var score = answers.reduce(function (sum, a, i) { return sum + (a === questions[i].answer ? 1 : 0); }, 0), pct = Math.round(score / questions.length * 100), body = document.getElementById('viewerBody'); if (body) body.innerHTML = '<div class="iexam-result"><div style="font-size:20px;font-weight:700">أحسنت! أنهيت الاختبار</div><div class="iexam-score">' + score + '/' + questions.length + '</div><div style="font-size:16px;margin-top:6px">النسبة: ' + pct + '%</div><div style="margin-top:14px;line-height:1.8">' + (pct >= 80 ? 'ممتاز، استمر في التدريب!' : 'راجع الدرس ثم أعد المحاولة.') + '</div><div class="iexam-actions"><button class="iexam-primary" onclick="startGrade2Exam(' + term + ',\'' + termName + '\')">إعادة الاختبار</button><button class="iexam-secondary" onclick="openGrade2ExamList(' + term + ',\'' + termName + '\')">العودة للاختبارات</button></div></div>'; }
    if (window.screenHistory && typeof window.showScreen === 'function') { window.screenHistory.push(window.currentScreen); window.showScreen('viewerScreen'); } render();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addChip); else addChip();
})();
