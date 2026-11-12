(function () {
  'use strict';

  var endpoint = String(window.TAA_ASK_API_URL || '').trim();
  var screenId = 'askQuestionScreen';
  var openerButton = null;
  var askHistoryEntry = false;
  var activeRequestController = null;

  function addStylesheet() {
    if (document.getElementById('askQuestionStyles')) return;
    var link = document.createElement('link');
    link.id = 'askQuestionStyles';
    link.rel = 'stylesheet';
    link.href = './ask-question.css';
    document.head.appendChild(link);
  }

  function addHomeButton() {
    var grid = document.querySelector('#homeScreen .tools-grid');
    if (!grid || document.getElementById('askQuestionHomeButton')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'askQuestionHomeButton';
    button.className = 'tool-btn ask-home-tool';
    button.setAttribute('aria-label', 'افتح اسأل تُجاب');
    button.innerHTML = '<span class="tool-icon" aria-hidden="true">✦</span><span class="tool-label">اسأل تُجاب</span>';
    button.addEventListener('click', window.openAskQuestion);
    grid.insertBefore(button, grid.firstChild);
  }

  function makeScreen() {
    if (document.getElementById(screenId)) return;
    var screen = document.createElement('section');
    screen.id = screenId;
    screen.className = 'screen ask-screen';
    screen.setAttribute('aria-labelledby', 'askQuestionTitle');
    screen.innerHTML = [
      '<div class="top-bar ask-topbar">',
      '  <button type="button" class="icon-btn" id="askQuestionBack" aria-label="رجوع">→</button>',
      '  <div class="logo"><span id="askQuestionTitle" tabindex="-1">✦ اسأل تُجاب</span></div>',
      '  <span class="ask-private-badge">خصوصية</span>',
      '</div>',
      '<div class="content ask-content">',
      '  <div class="ask-intro"><div class="ask-orb" aria-hidden="true">✦</div><div><h2>سؤالك مهم</h2><p>اسأل عن دراستك، وسأشرح لك ببساطة وبخطوات واضحة.</p></div></div>',
      '  <div class="ask-privacy-note"><strong>خصوصيتك:</strong> لا نرسل اسمك أو رقم حسابك، ولا نحفظ سؤالًا في سجل داخل المنصة. يُرسل نص سؤالك إلى خدمة الذكاء الاصطناعي لمعالجته؛ لا تكتب اسمك أو هاتفك أو بيانات شخصية.</div>',
      '  <div class="ask-offline-note" id="askQuestionOfflineNote" role="status" hidden></div>',
      '  <div class="ask-form-card">',
      '    <label class="ask-label" for="askQuestionStage">المرحلة التعليمية</label>',
      '    <select class="form-input" id="askQuestionStage">',
      '      <option value="تعليم عام">التعليم العام</option><option value="الأزهر الشريف">الأزهر الشريف</option><option value="البكالوريا المصرية">البكالوريا المصرية</option>',
      '    </select>',
      '    <div class="ask-fields-row">',
      '      <div><label class="ask-label" for="askQuestionGrade">الصف</label><select class="form-input" id="askQuestionGrade"><option>الأول الابتدائي</option><option>الثاني الابتدائي</option><option>الثالث الابتدائي</option><option>الرابع الابتدائي</option><option>الخامس الابتدائي</option><option>السادس الابتدائي</option><option>الأول الإعدادي</option><option>الثاني الإعدادي</option><option>الثالث الإعدادي</option><option>الأول الثانوي</option><option>الثاني الثانوي</option><option>الثالث الثانوي</option></select></div>',
      '      <div><label class="ask-label" for="askQuestionSubject">المادة</label><select class="form-input" id="askQuestionSubject"><option>اللغة العربية</option><option>الرياضيات</option><option>العلوم</option><option>اللغة الإنجليزية</option><option>الدراسات الاجتماعية</option><option>الفيزياء</option><option>الكيمياء</option><option>الأحياء</option><option>التاريخ</option><option>الجغرافيا</option><option>الفلسفة والمنطق</option><option>الحاسب الآلي</option><option>القرآن والتفسير</option><option>الحديث والفقه</option><option>النحو والبلاغة</option><option>مادة أخرى</option></select></div>',
      '    </div>',
      '    <label class="ask-label" for="askQuestionStyle">طريقة الشرح</label>',
      '    <select class="form-input" id="askQuestionStyle"><option value="simple">شرح مبسط</option><option value="steps">حل خطوة بخطوة</option><option value="short">إجابة مختصرة</option></select>',
      '    <label class="ask-label" for="askQuestionInput">اكتب سؤالك</label>',
      '    <textarea id="askQuestionInput" class="form-input ask-textarea" maxlength="1200" placeholder="اكتب السؤال كما هو، ويمكنك إضافة ما لم تفهمه…" autocomplete="off"></textarea>',
      '    <div class="ask-form-meta"><span>لا تكتب اسمك أو رقم هاتفك أو بياناتك الشخصية.</span><span id="askQuestionCount">0 / 1200</span></div>',
      '    <button type="button" class="btn-primary ask-submit" id="askQuestionSubmit">اسأل الآن</button>',
      '    <div class="ask-service-status" id="askQuestionServiceStatus" role="status"></div>',
      '  </div>',
      '  <div class="ask-answer-card" id="askQuestionAnswerCard" hidden aria-live="polite"><div class="ask-answer-heading"><span>الإجابة</span><button type="button" class="ask-copy" id="askQuestionCopy">نسخ الإجابة</button></div><div class="ask-answer-text" id="askQuestionAnswerText"></div><p class="ask-disclaimer">تحقّق من خطوات الحل مع كتابك أو معلّمك، فقد تخطئ أنظمة الذكاء الاصطناعي أحيانًا.</p></div>',
      '  <details class="ask-offline-help"><summary>ماذا أستطيع أن أفعل دون إنترنت؟</summary><p>الإجابة الجديدة تحتاج اتصالًا بالإنترنت. دون اتصال يمكنك الرجوع إلى الدروس والملفات التي نزّلتها مسبقًا من المنصة. لا يتم حفظ هذا السؤال تلقائيًا.</p></details>',
      '  <div class="ask-examples"><h3>للحصول على إجابة أدق</h3><p>اكتب الصف والمادة، ثم أرسل نص المسألة كاملًا. وإذا أردت حلًا مفصلًا، اختر «حل خطوة بخطوة».</p></div>',
      '</div>'
    ].join('');
    document.body.appendChild(screen);

    document.getElementById('askQuestionBack').addEventListener('click', function () {
      closeAskQuestion();
    });
    var input = document.getElementById('askQuestionInput');
    input.addEventListener('input', function () {
      document.getElementById('askQuestionCount').textContent = input.value.length + ' / 1200';
    });
    document.getElementById('askQuestionSubmit').addEventListener('click', submitQuestion);
    document.getElementById('askQuestionCopy').addEventListener('click', copyAnswer);
    input.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') submitQuestion();
    });
    updateConnectionNote();
    window.addEventListener('online', updateConnectionNote);
    window.addEventListener('offline', updateConnectionNote);
    window.addEventListener('popstate', function () {
      if (window.currentScreen !== screenId) return;
      askHistoryEntry = false;
      if (typeof window.goBack === 'function') window.goBack();
      else if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
      clearQuestionState();
      restoreOpenerFocus();
    });
  }

  function clearQuestionState() {
    if (activeRequestController) {
      try { activeRequestController.abort(); } catch (_) {}
      activeRequestController = null;
    }
    var input = document.getElementById('askQuestionInput');
    var count = document.getElementById('askQuestionCount');
    var answer = document.getElementById('askQuestionAnswerText');
    var card = document.getElementById('askQuestionAnswerCard');
    if (input) input.value = '';
    if (count) count.textContent = '0 / 1200';
    if (answer) answer.textContent = '';
    if (card) card.hidden = true;
    setStatus('', '');
  }

  function restoreOpenerFocus() {
    if (!openerButton || !openerButton.isConnected) return;
    window.requestAnimationFrame(function () { openerButton.focus(); });
  }

  function closeAskQuestion() {
    if (askHistoryEntry && window.history.state && window.history.state.askQuestion) {
      window.history.back();
      return;
    }
    if (typeof window.goBack === 'function') window.goBack();
    else if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
    clearQuestionState();
    restoreOpenerFocus();
  }

  function updateConnectionNote() {
    var note = document.getElementById('askQuestionOfflineNote');
    if (!note) return;
    if (!navigator.onLine) {
      note.hidden = false;
      note.textContent = 'أنت الآن دون اتصال. يمكنك استخدام الدروس التي نُزّلت مسبقًا، أما الإجابات الجديدة فتحتاج إنترنت.';
    } else {
      note.hidden = true;
      note.textContent = '';
    }
  }

  function setStatus(message, kind) {
    var status = document.getElementById('askQuestionServiceStatus');
    status.textContent = message || '';
    status.className = 'ask-service-status' + (kind ? ' is-' + kind : '');
  }

  function showAnswer(text) {
    var card = document.getElementById('askQuestionAnswerCard');
    var content = document.getElementById('askQuestionAnswerText');
    content.textContent = text;
    card.hidden = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submitQuestion() {
    var question = document.getElementById('askQuestionInput').value.trim();
    var button = document.getElementById('askQuestionSubmit');
    var answerCard = document.getElementById('askQuestionAnswerCard');
    answerCard.hidden = true;
    if (question.length < 3) {
      setStatus('اكتب السؤال بوضوح قبل الإرسال.', 'error');
      document.getElementById('askQuestionInput').focus();
      return;
    }
    if (!navigator.onLine) {
      setStatus('لا يمكن إنشاء إجابة جديدة دون إنترنت. افتح الدروس التي حفظتها سابقًا.', 'error');
      return;
    }
    if (!endpoint || !/^https:\/\//i.test(endpoint)) {
      setStatus('واجهة الأسئلة جاهزة، لكن خدمة الإجابة لم تُربط بعد. لن يُرسل سؤالك الآن.', 'notice');
      return;
    }

    button.disabled = true;
    button.textContent = 'جاري التفكير…';
    setStatus('أراجع سؤالك وأجهّز شرحًا مناسبًا لصفك…', 'loading');
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    activeRequestController = controller;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 35000) : null;
    try {
      var payload = {
        question: question,
        stage: document.getElementById('askQuestionStage').value,
        grade: document.getElementById('askQuestionGrade').value,
        subject: document.getElementById('askQuestionSubject').value,
        style: document.getElementById('askQuestionStyle').value
      };
      var response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
        credentials: 'omit',
        cache: 'no-store'
      });
      var data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        if (response.status === 429) throw new Error('وصلنا إلى حد الاستخدام المؤقت. انتظر قليلًا ثم أعد المحاولة.');
        if (response.status === 503) throw new Error(data.error || 'توقفت الخدمة مؤقتًا. حاول مرة أخرى لاحقًا.');
        throw new Error(data.error || 'تعذّر الحصول على إجابة الآن. أعد المحاولة لاحقًا.');
      }
      var answer = typeof data.answer === 'string' ? data.answer.trim() : '';
      if (!answer) throw new Error('لم تصل إجابة صالحة. أعد المحاولة بسؤال أوضح.');
      if (window.currentScreen !== screenId) return;
      showAnswer(answer);
      document.getElementById('askQuestionInput').value = '';
      document.getElementById('askQuestionCount').textContent = '0 / 1200';
      setStatus('تمت الإجابة. تذكّر مراجعة الحل مع كتابك أو معلّمك.', 'success');
    } catch (error) {
      if (window.currentScreen !== screenId) return;
      var message = error && error.name === 'AbortError'
        ? 'استغرق الرد وقتًا أطول من المتوقع. تحقق من الاتصال ثم أعد المحاولة.'
        : (error && error.message ? error.message : 'تعذّر الاتصال بالمساعد.');
      setStatus(message, 'error');
    } finally {
      if (timeout) clearTimeout(timeout);
      if (activeRequestController === controller) activeRequestController = null;
      button.disabled = false;
      button.textContent = 'اسأل الآن';
    }
  }

  async function copyAnswer() {
    var answer = document.getElementById('askQuestionAnswerText').textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(answer);
      else {
        var helper = document.createElement('textarea');
        helper.value = answer;
        helper.style.position = 'fixed'; helper.style.opacity = '0';
        document.body.appendChild(helper); helper.select();
        if (!document.execCommand('copy')) throw new Error('copy failed');
        helper.remove();
      }
      setStatus('نُسخت الإجابة.', 'success');
    } catch (_) {
      setStatus('تعذر النسخ على هذا الجهاز. اضغط مطولًا على الإجابة لتحديدها.', 'notice');
    }
  }

  window.openAskQuestion = function () {
    openerButton = document.getElementById('askQuestionHomeButton');
    if (Array.isArray(window.screenHistory) && window.currentScreen !== screenId) {
      window.screenHistory.push(window.currentScreen || 'homeScreen');
    }
    if (!askHistoryEntry && window.history && typeof window.history.pushState === 'function') {
      try {
        window.history.pushState({ askQuestion: true }, '', window.location.pathname + window.location.search + '#ask-question');
        askHistoryEntry = true;
      } catch (_) {}
    }
    if (typeof window.showScreen === 'function') window.showScreen(screenId);
    window.requestAnimationFrame(function () {
      var title = document.getElementById('askQuestionTitle');
      if (title) title.focus();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      addStylesheet(); makeScreen(); addHomeButton();
    }, { once: true });
  } else {
    addStylesheet(); makeScreen(); addHomeButton();
  }
})();
