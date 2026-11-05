/* اختبارات ومسابقات تفاعلية لمنصة الأستاذ حافظ التعليمية */
(function () {
  'use strict';

  var sets = [
    { id: 'arabic', title: 'اللغة العربية', icon: '✍️', color: '#1565c0', questions: [
      { q: 'ما نوع كلمة «يكتب»؟', a: ['اسم', 'فعل مضارع', 'حرف', 'فعل ماضٍ'], c: 1, e: 'يكتب فعل مضارع يدل على حدث يقع في الزمن الحاضر أو المستقبل.' },
      { q: 'ما جمع كلمة «كتاب»؟', a: ['كاتبون', 'مكتبات', 'كتب', 'كتابات'], c: 2, e: 'جمع كتاب هو كُتُب، وهو جمع تكسير.' },
      { q: 'أي الكلمات الآتية تبدأ بهمزة قطع؟', a: ['استخرج', 'المدرسة', 'أحمد', 'ابن'], c: 2, e: 'أحمد يبدأ بهمزة قطع، وتُنطق في بدء الكلام ووصله.' },
      { q: 'ما مضاد كلمة «الشجاعة»؟', a: ['الكرم', 'الجبن', 'الصبر', 'الوفاء'], c: 1, e: 'مضاد الشجاعة هو الجبن.' },
      { q: 'أي الجمل الآتية جملة اسمية؟', a: ['يقرأ الطالب', 'عاد المسافر', 'العلم نافع', 'اكتب الدرس'], c: 2, e: 'العلم نافع: بدأت باسم، فهي جملة اسمية.' }
    ]},
    { id: 'math', title: 'الرياضيات', icon: '➗', color: '#6a1b9a', questions: [
      { q: 'ما ناتج 7 × 8؟', a: ['54', '56', '64', '48'], c: 1, e: '٧ × ٨ = ٥٦.' },
      { q: 'ما ربع العدد 36؟', a: ['6', '8', '9', '12'], c: 2, e: '٣٦ ÷ ٤ = ٩.' },
      { q: 'كم ضلعًا للمثلث؟', a: ['2', '3', '4', '5'], c: 1, e: 'للمثلث ثلاثة أضلاع وثلاث زوايا.' },
      { q: 'ما ناتج 125 + 75؟', a: ['190', '195', '200', '210'], c: 2, e: '١٢٥ + ٧٥ = ٢٠٠.' },
      { q: 'أي الأعداد الآتية عدد زوجي؟', a: ['13', '21', '32', '45'], c: 2, e: '٣٢ يقبل القسمة على ٢ دون باقٍ، لذا فهو زوجي.' }
    ]},
    { id: 'science', title: 'العلوم', icon: '🔬', color: '#00897b', questions: [
      { q: 'ما الغاز الذي تحتاجه النباتات في عملية البناء الضوئي؟', a: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الهيدروجين'], c: 2, e: 'تمتص النباتات ثاني أكسيد الكربون وتستخدمه مع الماء والضوء في البناء الضوئي.' },
      { q: 'ما العضو الذي يضخ الدم في جسم الإنسان؟', a: ['الرئة', 'القلب', 'الكبد', 'المعدة'], c: 1, e: 'القلب يضخ الدم عبر الأوعية الدموية إلى أجزاء الجسم.' },
      { q: 'في أي حالة يكون الماء عند درجة حرارة الغرفة غالبًا؟', a: ['صلبة', 'سائلة', 'غازية', 'بلازما'], c: 1, e: 'يكون الماء عادةً سائلًا في درجة حرارة الغرفة.' },
      { q: 'أي الكواكب أقرب إلى الشمس؟', a: ['الأرض', 'المريخ', 'عطارد', 'المشتري'], c: 2, e: 'عطارد هو أقرب كواكب المجموعة الشمسية إلى الشمس.' },
      { q: 'ما مصدر الطاقة الأساسي لمعظم الحياة على الأرض؟', a: ['القمر', 'الشمس', 'الرياح', 'الجبال'], c: 1, e: 'توفر الشمس الضوء والحرارة والطاقة اللازمة لعمليات حيوية كثيرة.' }
    ]},
    { id: 'islamic', title: 'الثقافة الإسلامية', icon: '🕌', color: '#2e7d32', questions: [
      { q: 'كم عدد أركان الإسلام؟', a: ['أربعة', 'خمسة', 'ستة', 'سبعة'], c: 1, e: 'أركان الإسلام خمسة كما في حديث ابن عمر رضي الله عنهما.' },
      { q: 'ما الشهر الذي يصومه المسلمون؟', a: ['شعبان', 'شوال', 'رمضان', 'محرم'], c: 2, e: 'فرض الله صيام شهر رمضان على المسلمين.' },
      { q: 'ما قبلة المسلمين في الصلاة؟', a: ['المسجد النبوي', 'الكعبة المشرفة', 'المسجد الأقصى', 'جبل عرفات'], c: 1, e: 'يتجه المسلمون في صلاتهم إلى الكعبة المشرفة بمكة.' },
      { q: 'كم عدد الصلوات المفروضة في اليوم والليلة؟', a: ['ثلاث', 'أربع', 'خمس', 'ست'], c: 2, e: 'الصلوات المفروضة خمس في اليوم والليلة.' },
      { q: 'ما أول سورة في ترتيب المصحف؟', a: ['البقرة', 'الفاتحة', 'الإخلاص', 'العلق'], c: 1, e: 'سورة الفاتحة هي أول سورة في ترتيب المصحف.' }
    ]},
    { id: 'general', title: 'معلومات عامة', icon: '🌍', color: '#ef6c00', questions: [
      { q: 'ما عاصمة جمهورية مصر العربية؟', a: ['الإسكندرية', 'القاهرة', 'الأقصر', 'أسوان'], c: 1, e: 'القاهرة هي عاصمة جمهورية مصر العربية.' },
      { q: 'كم عدد أيام السنة الميلادية العادية؟', a: ['360', '364', '365', '366'], c: 2, e: 'السنة الميلادية العادية ٣٦٥ يومًا، والكبيسة ٣٦٦ يومًا.' },
      { q: 'ما أكبر محيط على كوكب الأرض؟', a: ['الأطلسي', 'الهندي', 'المتجمد الشمالي', 'الهادئ'], c: 3, e: 'المحيط الهادئ هو أكبر محيطات الأرض.' },
      { q: 'ما اللغة الرسمية في البرازيل؟', a: ['الإسبانية', 'البرتغالية', 'الفرنسية', 'الإنجليزية'], c: 1, e: 'اللغة الرسمية في البرازيل هي البرتغالية.' },
      { q: 'ما وحدة قياس درجة الحرارة الشائعة في مصر؟', a: ['المتر', 'اللتر', 'الدرجة المئوية', 'الكيلوجرام'], c: 2, e: 'تُقاس درجة الحرارة عادةً بالدرجة المئوية.' }
    ]}
  ];

  var timerId = null;
  var state = null;
  var style = `
    #quizCenterScreen{direction:rtl}.quiz-welcome{background:linear-gradient(135deg,#123f33,#22865b);color:#fff;border-radius:20px;padding:22px;margin-bottom:16px}
    .quiz-welcome h2{margin:0 0 8px;font-size:21px}.quiz-welcome p{margin:0;line-height:1.8;opacity:.94;font-size:14px}
    .quiz-best{margin-top:12px;font-weight:700;color:#e2f1bd}.quiz-set-card{border:0;width:100%;display:flex;align-items:center;gap:14px;text-align:right;background:#fff;border-radius:16px;padding:15px;margin:10px 0;box-shadow:0 3px 12px rgba(0,0,0,.08);font:inherit;cursor:pointer;border-right:5px solid var(--quiz-color)}
    .quiz-set-icon{width:48px;height:48px;flex:0 0 48px;border-radius:14px;display:grid;place-items:center;background:#f3f6f4;font-size:25px}.quiz-set-title{font-weight:800;color:#26352b}.quiz-set-sub{font-size:12px;color:#6c7b70;margin-top:4px}.quiz-set-arrow{margin-right:auto;color:#7c8c80;font-size:24px}
    .quiz-challenge{width:100%;border:0;border-radius:16px;padding:17px;background:linear-gradient(135deg,#ef6c00,#f9a825);color:#fff;text-align:right;font:inherit;cursor:pointer;display:flex;align-items:center;gap:13px;margin:16px 0 8px}.quiz-challenge strong{display:block;font-size:16px}.quiz-challenge small{display:block;margin-top:4px;opacity:.95}
    .quiz-progress-wrap{background:#e6ece7;height:9px;border-radius:20px;overflow:hidden;margin:12px 0}.quiz-progress-fill{height:100%;background:linear-gradient(90deg,#1b8c59,#a3ca54);transition:width .25s}.quiz-meta{display:flex;justify-content:space-between;color:#617267;font-weight:700;font-size:13px}.quiz-timer{font-weight:800;color:#c62828}.quiz-question-card{background:#fff;border-radius:18px;padding:20px;margin:14px 0;box-shadow:0 4px 16px rgba(0,0,0,.08)}.quiz-question-card h3{font-size:20px;line-height:1.7;margin:10px 0 18px;color:#203629}
    .quiz-option{display:block;width:100%;text-align:right;border:1px solid #dce5dd;border-radius:13px;padding:13px 15px;margin:9px 0;background:#fff;color:#25372a;font:inherit;font-weight:700;cursor:pointer}.quiz-option:hover{border-color:#438e56;background:#f5fbf5}.quiz-option:disabled{cursor:default}.quiz-option.is-correct{background:#e7f5e9;border-color:#43a047;color:#1b5e20}.quiz-option.is-wrong{background:#ffebee;border-color:#e53935;color:#b71c1c}.quiz-feedback{border-radius:12px;padding:12px;margin-top:13px;line-height:1.7;font-size:14px}.quiz-feedback.good{background:#e8f5e9;color:#1b5e20}.quiz-feedback.bad{background:#fff3e0;color:#8d4b00}.quiz-next{width:100%;margin-top:14px}.quiz-result{text-align:center;background:#fff;border-radius:20px;padding:24px 18px;box-shadow:0 4px 18px rgba(0,0,0,.08)}.quiz-result-score{font-size:50px;font-weight:900;color:#26734d}.quiz-result h2{margin:8px}.quiz-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.quiz-actions button{flex:1;min-width:145px}
    `;
  function addStyles() {
    if (document.getElementById('quizCompetitionStyles')) return;
    var el = document.createElement('style'); el.id = 'quizCompetitionStyles'; el.textContent = style; document.head.appendChild(el);
  }
  function addScreen() {
    if (document.getElementById('quizCenterScreen')) return;
    var screen = document.createElement('div'); screen.id = 'quizCenterScreen'; screen.className = 'screen';
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#155e45,#43a047)"><button class="icon-btn" onclick="quizGoBack()">→</button><div class="logo"><span>🧠 الاختبارات والمسابقات</span></div><div style="width:42px"></div></div><div class="content" id="quizCenterContent"></div>';
    document.body.appendChild(screen);
  }
  function install() {
    addStyles(); addScreen();
    var home = document.querySelector('#homeScreen .content');
    if (home && !document.getElementById('quizHomeCard')) {
      var section = document.createElement('div'); section.id = 'quizHomeCard';
      section.innerHTML = '<div class="section-title">🧠 اختبر معلوماتك</div><button class="quiz-challenge" onclick="openQuizCenter()"><span style="font-size:34px">🏆</span><span style="flex:1"><strong>الاختبارات والمسابقات</strong><small>أسئلة تفاعلية في مواد متنوعة وتحدي سرعة</small></span><span style="font-size:24px">‹</span></button>';
      var edu = Array.from(home.querySelectorAll('.section-title')).find(function (x) { return x.textContent.indexOf('التعليم العام') >= 0; });
      if (edu && edu.nextElementSibling) edu.nextElementSibling.after(section); else home.appendChild(section);
    }
    renderHome();
  }
  function safeGetBest() { try { return JSON.parse(localStorage.getItem('ta3lemy_quiz_best_v1') || '{}'); } catch (_) { return {}; } }
  function safeSaveBest(data) { try { localStorage.setItem('ta3lemy_quiz_best_v1', JSON.stringify(data)); } catch (_) {} }
  function renderHome() {
    var box = document.getElementById('quizCenterContent'); if (!box) return;
    var best = safeGetBest();
    box.innerHTML = '<div class="quiz-welcome"><h2>تعلّم، أجب، وتحدَّ نفسك!</h2><p>اختر مادة للتدريب، أو ابدأ تحدي السرعة بأسئلة متنوعة. لكل إجابة تفسير يساعدك على التعلم.</p><div class="quiz-best">🏅 أفضل نتيجة محفوظة على هذا الجهاز: ' + Number(best.best || 0) + ' نقطة</div></div><button class="quiz-challenge" onclick="startQuiz(\'challenge\',true)"><span style="font-size:32px">⏱️</span><span style="flex:1"><strong>ابدأ تحدي السرعة</strong><small>10 أسئلة متنوعة • 15 ثانية لكل سؤال</small></span><span>‹</span></button><div class="section-title">اختر مادة للاختبار</div>' + sets.map(function (set) {
      return '<button class="quiz-set-card" style="--quiz-color:' + set.color + '" onclick="startQuiz(\'' + set.id + '\',false)"><span class="quiz-set-icon">' + set.icon + '</span><span><span class="quiz-set-title">' + set.title + '</span><span class="quiz-set-sub">5 أسئلة • تدريب دون مؤقت</span></span><span class="quiz-set-arrow">‹</span></button>';
    }).join('') + '<p style="font-size:12px;color:#68776d;line-height:1.7;text-align:center">الأسئلة تأسيسية ومتنوعة، والنتائج تُحفظ على هذا الجهاز فقط.</p>';
  }
  window.openQuizCenter = function () {
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('quizCenterScreen');
    renderHome();
  };
  window.quizGoBack = function () {
    clearInterval(timerId); timerId = null; state = null;
    if (typeof window.goBack === 'function') window.goBack(); else if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
  };
  window.startQuiz = function (setId, challenge) {
    var selected = challenge ? null : sets.find(function (s) { return s.id === setId; });
    var questions = selected ? selected.questions.slice() : sets.reduce(function (all, s) { return all.concat(s.questions); }, []);
    questions.sort(function () { return Math.random() - .5; });
    if (challenge) questions = questions.slice(0, 10); else questions = questions.slice(0, 5);
    state = { title: selected ? selected.title : 'تحدي السرعة', questions: questions, index: 0, score: 0, timed: !!challenge, seconds: 15, locked: false };
    renderQuestion();
  };
  function renderQuestion() {
    if (!state) return renderHome();
    clearInterval(timerId); timerId = null;
    var box = document.getElementById('quizCenterContent'), q = state.questions[state.index];
    if (!q) return finishQuiz();
    var options = q.a.map(function (label, i) { return { label: label, correct: i === q.c }; });
    options.sort(function () { return Math.random() - .5; }); state.currentOptions = options; state.locked = false; state.seconds = 15;
    var pct = Math.round((state.index / state.questions.length) * 100);
    box.innerHTML = '<div class="quiz-meta"><span>' + state.title + '</span><span>النقاط: ' + state.score + '</span></div><div class="quiz-progress-wrap"><div class="quiz-progress-fill" style="width:' + pct + '%"></div></div><div class="quiz-meta"><span>السؤال ' + (state.index + 1) + ' من ' + state.questions.length + '</span>' + (state.timed ? '<span class="quiz-timer" id="quizTimer">⏱ 15</span>' : '<span>اختر الإجابة الصحيحة</span>') + '</div><section class="quiz-question-card"><h3>' + q.q + '</h3><div id="quizOptions">' + options.map(function (o, i) { return '<button class="quiz-option" onclick="answerQuiz(' + i + ')">' + o.label + '</button>'; }).join('') + '</div><div id="quizFeedback"></div><button id="quizNextButton" class="btn-primary quiz-next" style="display:none" onclick="nextQuizQuestion()">السؤال التالي ‹</button><button class="btn-primary quiz-next" style="background:#607d8b" onclick="quizGoBack()">إنهاء الاختبار والعودة</button></section>';
    if (state.timed) timerId = setInterval(function () { state.seconds -= 1; var el = document.getElementById('quizTimer'); if (el) el.textContent = '⏱ ' + Math.max(0, state.seconds); if (state.seconds <= 0) window.answerQuiz(-1); }, 1000);
  }
  window.answerQuiz = function (index) {
    if (!state || state.locked) return; state.locked = true; clearInterval(timerId); timerId = null;
    var q = state.questions[state.index], options = state.currentOptions, correctIndex = options.findIndex(function (o) { return o.correct; }), buttons = document.querySelectorAll('#quizOptions .quiz-option'), correct = index === correctIndex;
    if (correct) state.score += state.timed ? Math.max(5, state.seconds * 2) : 10;
    buttons.forEach(function (button, i) { button.disabled = true; if (i === correctIndex) button.classList.add('is-correct'); else if (i === index) button.classList.add('is-wrong'); });
    var fb = document.getElementById('quizFeedback'); if (fb) fb.innerHTML = '<div class="quiz-feedback ' + (correct ? 'good' : 'bad') + '">' + (correct ? '✅ إجابة صحيحة! ' : (index < 0 ? '⏱ انتهى الوقت. ' : '❌ ليست هذه الإجابة الصحيحة. ')) + q.e + '</div>';
    var next = document.getElementById('quizNextButton'); if (next) { next.style.display = 'block'; next.textContent = state.index === state.questions.length - 1 ? 'عرض النتيجة 🏆' : 'السؤال التالي ‹'; }
  };
  window.nextQuizQuestion = function () { if (!state || !state.locked) return; state.index += 1; renderQuestion(); };
  function finishQuiz() {
    clearInterval(timerId); timerId = null;
    var best = safeGetBest(), before = Number(best.best || 0); best.best = Math.max(before, state.score); best.last = state.score; best.plays = Number(best.plays || 0) + 1; safeSaveBest(best);
    var percent = Math.round((state.score / (state.questions.length * (state.timed ? 30 : 10))) * 100);
    document.getElementById('quizCenterContent').innerHTML = '<div class="quiz-result"><div style="font-size:46px">' + (percent >= 80 ? '🏆' : percent >= 50 ? '🌟' : '📚') + '</div><h2>انتهى الاختبار!</h2><p>' + state.title + '</p><div class="quiz-result-score">' + state.score + '</div><div>نقطة · نسبة تقريبية ' + Math.min(100, percent) + '%</div><p style="line-height:1.8">' + (state.score > before ? '🎉 حققت أفضل نتيجة جديدة!' : 'واصل التدريب لتحسّن نتيجتك في المرة القادمة.') + '</p><p style="font-size:12px;color:#748178">تم حفظ أفضل نتيجة على هذا الجهاز.</p><div class="quiz-actions"><button class="btn-primary" onclick="startQuiz(\'' + (sets.find(function (s) { return s.title === state.title; }) || {}).id + '\',' + (state.timed ? 'true' : 'false') + ')">إعادة المحاولة</button><button class="btn-primary" style="background:#607d8b" onclick="openQuizCenter()">اختيار اختبار آخر</button></div></div>';
    state = null; renderHomeBestOnly();
  }
  function renderHomeBestOnly() { var el = document.querySelector('#quizCenterContent .quiz-best'); if (el) el.textContent = '🏅 أفضل نتيجة محفوظة على هذا الجهاز: ' + Number(safeGetBest().best || 0) + ' نقطة'; }
  window.addEventListener('load', install);
  if (document.readyState === 'complete' || document.readyState === 'interactive') install();
})();
