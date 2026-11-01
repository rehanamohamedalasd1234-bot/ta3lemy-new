/*
 * Kindergarten Languages: a lightweight, mobile-first learning area that reuses
 * the existing lesson, teacher-approval, and broadcast flows.
 * Student tracing reports stay on the current device until secure Firestore
 * rules for child progress have been reviewed and configured.
 */
(function () {
  'use strict';

  var STAGE_ID = 'kindergarten_languages';
  var STAGE_NAME = 'رياض الأطفال لغات';
  var SUBJECTS = [
    { id: 'kg_arabic', name: 'عربي', icon: '🔤', color: '#C2185B' },
    { id: 'kg_english', name: 'English', icon: '🔠', color: '#303F9F' },
    { id: 'kg_maths', name: 'Maths', icon: '🔢', color: '#1976D2' }
  ];
  var GRADES = ['KG1', 'KG2'];
  var PROGRESS_KEY = 'ta3lemy-kindergarten-progress-v1';

  function readGlobal(name) {
    try { return eval(name); } catch (error) { return window[name]; }
  }
  function writeGlobal(name, value) {
    try { eval(name + ' = value'); } catch (error) { window[name] = value; }
  }
  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.log(message);
  }
  function activeStage() { return readGlobal('currentStage') || ''; }
  function activeGrade() { return readGlobal('currentGrade') || ''; }
  function activeSubject() { return readGlobal('currentSubject') || ''; }
  function activeTerm() { return Number(readGlobal('currentTerm')) || 1; }
  function escapeText(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function safeHttpsUrl(value) {
    try {
      var parsed = new URL(String(value || ''), window.location.href);
      return parsed.protocol === 'https:' ? parsed.href : '';
    } catch (error) { return ''; }
  }
  function addStage() {
    try {
      if (typeof stagesData === 'undefined') return;
      stagesData[STAGE_ID] = { name: STAGE_NAME, icon: '🧸', grades: GRADES.slice() };
    } catch (error) { console.warn('Kindergarten stage registration failed', error); }
  }
  function pushHistory() {
    var history = readGlobal('screenHistory');
    var current = readGlobal('currentScreen');
    if (Array.isArray(history) && current) history.push(current);
  }
  function showScreen(id) {
    if (typeof window.showScreen === 'function') window.showScreen(id);
  }
  function ensureStyle() {
    if (document.getElementById('kindergartenLanguagesStyle')) return;
    var style = document.createElement('style');
    style.id = 'kindergartenLanguagesStyle';
    style.textContent = '.kg-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:0 0 14px}.kg-tool{min-height:58px;padding:11px 8px;border:0;border-radius:13px;background:#E8F5E9;color:#245b35;font:700 14px/1.5 inherit;cursor:pointer;touch-action:manipulation}.kg-tool.kg-primary{background:#00695C;color:#fff}.kg-screen-content{padding:14px;overflow:auto}.kg-note{padding:11px 12px;border-radius:11px;background:#FFF8E1;color:#6D4C00;font-size:12px;line-height:1.8;margin:0 0 12px}.kg-work-card{background:#fff;border:1px solid #e5ece5;border-radius:14px;padding:13px;margin:0 0 12px;box-shadow:0 2px 7px rgba(0,0,0,.05)}.kg-work-title{font-size:16px;font-weight:700;color:#245b35;margin:0 0 6px}.kg-work-meta{font-size:12px;color:#68756d;line-height:1.8;margin-bottom:8px}.kg-work-text{white-space:pre-wrap;line-height:1.9;margin:8px 0}.kg-media{display:block;width:100%;max-width:100%;margin:9px 0;border-radius:10px}.kg-select{width:100%;padding:11px;border:1px solid #c9d6cb;border-radius:10px;background:#fff;font:inherit;margin:0 0 10px}.kg-canvas-wrap{background:#fff;border:2px solid #c8ddd0;border-radius:15px;overflow:hidden;touch-action:none}.kg-canvas{display:block;width:100%;height:260px;touch-action:none}.kg-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.kg-action{flex:1;min-width:110px;border:0;border-radius:10px;padding:11px 9px;background:#E0F2F1;color:#00695C;font:700 13px inherit;cursor:pointer;touch-action:manipulation}.kg-action.kg-green{background:#2E7D32;color:#fff}.kg-progress-row{padding:10px 2px;border-bottom:1px solid #edf1ed;line-height:1.7;font-size:13px}.kg-empty{padding:18px;text-align:center;background:#fff;border-radius:12px;color:#68756d;line-height:1.8}@media(max-width:360px){.kg-tools{grid-template-columns:1fr}.kg-canvas{height:230px}}';
    document.head.appendChild(style);
  }
  function makeScreen(id, title) {
    var node = document.getElementById(id);
    if (!node) {
      node = document.createElement('section');
      node.id = id;
      node.className = 'screen';
      var bar = document.createElement('div');
      bar.className = 'top-bar';
      bar.style.background = 'linear-gradient(135deg,#00695C,#26A69A)';
      var back = document.createElement('button');
      back.className = 'icon-btn'; back.type = 'button'; back.textContent = '→';
      back.setAttribute('aria-label', 'رجوع');
      back.onclick = function () { if (typeof window.goBack === 'function') window.goBack(); };
      var logo = document.createElement('div'); logo.className = 'logo';
      var label = document.createElement('span'); label.textContent = title; logo.appendChild(label);
      var spacer = document.createElement('div'); spacer.style.width = '42px';
      bar.appendChild(back); bar.appendChild(logo); bar.appendChild(spacer);
      var content = document.createElement('div'); content.className = 'content kg-screen-content'; content.id = id + 'Content';
      node.appendChild(bar); node.appendChild(content); document.body.appendChild(node);
    }
    return node;
  }
  function button(label, handler, primary) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'kg-tool' + (primary ? ' kg-primary' : '');
    b.style.fontFamily = 'inherit'; b.style.fontSize = '14px'; b.style.fontWeight = '700';
    b.textContent = label; b.onclick = handler;
    return b;
  }
  function addKindergartenTools() {
    if (activeStage() !== STAGE_ID) return;
    var list = document.getElementById('termsList');
    if (!list || document.getElementById('kindergartenTools')) return;
    ensureStyle();
    var tools = document.createElement('div'); tools.id = 'kindergartenTools'; tools.className = 'kg-tools';
    tools.appendChild(button('👩‍🏫 دروس المعلم', window.openKindergartenTeacherWorks, true));
    tools.appendChild(button('✍️ تدريب اللمس والكتابة', window.openKindergartenPractice, false));
    tools.appendChild(button('🔊 اسمع وتدرّب', window.openKindergartenPractice, false));
    tools.appendChild(button('📊 تقرير التدريب', window.openKindergartenReport, false));
    tools.appendChild(button('🔴 بث المعلم', openStageBroadcast, false));
    list.insertBefore(tools, list.firstChild);
  }

  window.openKindergartenTeacherWorks = async function () {
    ensureStyle();
    var node = makeScreen('kindergartenTeacherWorksScreen', '👩‍🏫 دروس المعلم');
    pushHistory(); showScreen(node.id);
    var body = document.getElementById('kindergartenTeacherWorksScreenContent');
    body.innerHTML = '<div class="kg-empty">⏳ جاري تحميل الأعمال المعتمدة...</div>';
    var db = window.firebase && typeof window.firebase.firestore === 'function' ? window.firebase.firestore() : null;
    if (!db) { body.innerHTML = '<div class="kg-empty">خدمة المحتوى غير متاحة الآن.</div>'; return; }
    try {
      var snapshot = await db.collection('lessons')
        .where('stage', '==', STAGE_ID).get();
      var docs = snapshot.docs.filter(function (doc) {
        var item = doc.data() || {};
        return item.grade === String(activeGrade()) && item.subject === String(activeSubject()) && item.type === 'teacher_explanation';
      }).sort(function (a, b) {
        var ad = a.data() || {}; var bd = b.data() || {};
        return String(bd.created_at || '').localeCompare(String(ad.created_at || ''));
      });
      if (!docs.length) { body.innerHTML = '<div class="kg-empty">لم ينشر المعلم محتوى معتمدًا لهذه المادة والصف بعد. ستظهر الدروس والفيديوهات هنا بعد مراجعتها واعتمادها.</div>'; return; }
      body.textContent = '';
      var note = document.createElement('div'); note.className = 'kg-note';
      note.textContent = 'المحتوى هنا من أعمال المعلم المعتمدة فقط • ' + String(activeSubject()) + ' • ' + String(activeGrade());
      body.appendChild(note);
      docs.forEach(function (doc) {
        var item = doc.data() || {};
        var card = document.createElement('article'); card.className = 'kg-work-card';
        var heading = document.createElement('h3'); heading.className = 'kg-work-title'; heading.textContent = item.title || 'درس تعليمي'; card.appendChild(heading);
        var meta = document.createElement('div'); meta.className = 'kg-work-meta'; meta.textContent = (item.teacherName ? '👨‍🏫 ' + item.teacherName + ' • ' : '') + (item.teacherContentType || 'درس') + ' • الترم ' + (Number(item.term) || 1); card.appendChild(meta);
        if (item.content) { var text = document.createElement('div'); text.className = 'kg-work-text'; text.textContent = item.content; card.appendChild(text); }
        var imageUrl = safeHttpsUrl(item.image_url || item.imageUrl);
        if (imageUrl) { var image = document.createElement('img'); image.className = 'kg-media'; image.src = imageUrl; image.alt = item.title || 'صورة تعليمية'; image.loading = 'lazy'; card.appendChild(image); }
        var videoUrl = safeHttpsUrl(item.video_url || item.videoUrl);
        if (videoUrl) {
          if (/^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/.test(videoUrl) || /^https:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/.test(videoUrl)) {
            var videoId = videoUrl.indexOf('youtu.be/') >= 0 ? videoUrl.split('youtu.be/')[1].split(/[?&]/)[0] : new URL(videoUrl).searchParams.get('v');
            var frame = document.createElement('iframe'); frame.className = 'kg-media'; frame.src = 'https://www.youtube.com/embed/' + videoId; frame.title = item.title || 'فيديو تعليمي'; frame.loading = 'lazy'; frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin'; frame.style.height = '220px'; frame.style.border = '0'; card.appendChild(frame);
          } else { var video = document.createElement('video'); video.className = 'kg-media'; video.controls = true; video.playsInline = true; video.preload = 'metadata'; video.src = videoUrl; card.appendChild(video); }
        }
        var audioUrl = safeHttpsUrl(item.audio_url || item.audioUrl);
        if (audioUrl) { var audio = document.createElement('audio'); audio.className = 'kg-media'; audio.controls = true; audio.preload = 'metadata'; audio.src = audioUrl; audio.setAttribute('aria-label', 'استمع إلى ' + (item.title || 'المادة')); card.appendChild(audio); }
        body.appendChild(card);
      });
    } catch (error) {
      console.error('Kindergarten teacher lessons failed', error);
      body.innerHTML = '<div class="kg-empty">تعذر تحميل الدروس الآن. قد تحتاج قاعدة Firestore إلى فهرس للاستعلام أو صلاحية قراءة المحتوى المعتمد.</div>';
    }
  };

  function promptList(subject) {
    if (subject === 'عربي') return ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ر', 'س', 'ص', 'ع', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];
    if (subject === 'English') return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'];
  }
  function progressStorageKey() {
    var user = window.currentUser || {};
    var suffix = String(user.uid || user.id || 'local').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80) || 'local';
    return PROGRESS_KEY + ':' + suffix;
  }
  function readProgress() {
    try {
      var value = JSON.parse(localStorage.getItem(progressStorageKey()) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) { return []; }
  }
  function saveProgress(record) {
    var list = readProgress(); list.push(record);
    try { localStorage.setItem(progressStorageKey(), JSON.stringify(list.slice(-500))); return true; }
    catch (error) { return false; }
  }
  window.openKindergartenPractice = function () {
    ensureStyle();
    var node = makeScreen('kindergartenPracticeScreen', '✍️ تدريب اللمس والكتابة');
    pushHistory(); showScreen(node.id);
    var body = document.getElementById('kindergartenPracticeScreenContent');
    body.textContent = '';
    var note = document.createElement('div'); note.className = 'kg-note';
    note.textContent = 'المس الشاشة وارسم فوق الحرف أو الرقم الخافت. يمكنك الاستماع للنطق ثم مسح المحاولة وإعادتها.';
    body.appendChild(note);
    var choices = promptList(String(activeSubject()));
    var select = document.createElement('select'); select.className = 'kg-select'; select.setAttribute('aria-label', 'اختر حرفًا أو رقمًا');
    choices.forEach(function (value) { var option = document.createElement('option'); option.value = value; option.textContent = value; select.appendChild(option); });
    body.appendChild(select);
    var canvasWrap = document.createElement('div'); canvasWrap.className = 'kg-canvas-wrap';
    var canvas = document.createElement('canvas'); canvas.className = 'kg-canvas'; canvas.setAttribute('aria-label', 'مساحة تدريب الكتابة باللمس'); canvasWrap.appendChild(canvas); body.appendChild(canvasWrap);
    var status = document.createElement('div'); status.style.cssText = 'min-height:24px;color:#245b35;font-size:13px;line-height:1.7;margin-top:6px'; body.appendChild(status);
    var actions = document.createElement('div'); actions.className = 'kg-actions';
    var listen = document.createElement('button'); listen.type = 'button'; listen.className = 'kg-action'; listen.textContent = '🔊 اسمع النطق';
    var clear = document.createElement('button'); clear.type = 'button'; clear.className = 'kg-action'; clear.textContent = '🧽 امسح';
    var done = document.createElement('button'); done.type = 'button'; done.className = 'kg-action kg-green'; done.textContent = '✅ حفظ التدريب';
    [listen, clear, done].forEach(function (action) { action.style.fontFamily = 'inherit'; action.style.fontSize = '13px'; action.style.fontWeight = '700'; });
    actions.appendChild(listen); actions.appendChild(clear); actions.appendChild(done); body.appendChild(actions);
    var context = canvas.getContext('2d'); var drawing = false; var strokes = 0; var last = null; var pixelRatio = 1;
    function drawGuide() {
      var width = canvas.clientWidth || 320; var height = 260;
      pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.save(); context.globalAlpha = 0.25; context.fillStyle = '#7D9280';
      context.font = (String(activeSubject()) === 'عربي' ? '170px serif' : '160px Arial, sans-serif');
      context.textAlign = 'center'; context.textBaseline = 'middle';
      try { context.direction = String(activeSubject()) === 'عربي' ? 'rtl' : 'ltr'; } catch (error) {}
      context.fillText(select.value, width / 2, height / 2 + 4); context.restore();
      context.lineWidth = 8; context.lineCap = 'round'; context.lineJoin = 'round'; context.strokeStyle = '#00897B';
    }
    function coords(event) { var rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
    canvas.addEventListener('pointerdown', function (event) { event.preventDefault(); drawing = true; strokes += 1; last = coords(event); try { canvas.setPointerCapture(event.pointerId); } catch (error) {} context.beginPath(); context.arc(last.x, last.y, 4, 0, Math.PI * 2); context.fillStyle = '#00897B'; context.fill(); });
    canvas.addEventListener('pointermove', function (event) { if (!drawing) return; event.preventDefault(); var point = coords(event); context.beginPath(); context.moveTo(last.x, last.y); context.lineTo(point.x, point.y); context.stroke(); last = point; });
    function stopDrawing() { drawing = false; last = null; }
    canvas.addEventListener('pointerup', stopDrawing); canvas.addEventListener('pointercancel', stopDrawing); canvas.addEventListener('lostpointercapture', stopDrawing);
    select.addEventListener('change', function () { strokes = 0; status.textContent = ''; drawGuide(); });
    clear.onclick = function () { strokes = 0; status.textContent = ''; drawGuide(); };
    listen.onclick = function () {
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) { status.textContent = 'خاصية النطق غير متاحة في هذا الجهاز. استمع إلى تسجيل المعلم من «دروس المعلم».'; return; }
      window.speechSynthesis.cancel();
      var phrase = String(activeSubject()) === 'Maths' ? 'number ' + select.value : select.value;
      var utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = String(activeSubject()) === 'English' ? 'en-US' : 'ar-EG';
      utterance.rate = 0.75; window.speechSynthesis.speak(utterance);
    };
    done.onclick = function () {
      if (!strokes) { status.textContent = 'جرّب رسم الحرف أو الرقم أولًا، ثم احفظ التدريب.'; return; }
      var record = { date: new Date().toISOString(), stage: STAGE_ID, grade: String(activeGrade()), subject: String(activeSubject()), prompt: select.value, activity: 'touch-writing', completed: true };
      var saved = saveProgress(record);
      status.textContent = saved ? 'أُضيف التدريب إلى تقريرك على هذا الجهاز.' : 'تعذر حفظ التقرير على هذا الجهاز؛ المساحة قد تكون ممتلئة.';
    };
    drawGuide();
  };

  window.openKindergartenReport = function () {
    ensureStyle();
    var node = makeScreen('kindergartenReportScreen', '📊 تقرير التدريب');
    pushHistory(); showScreen(node.id);
    var body = document.getElementById('kindergartenReportScreenContent');
    body.textContent = '';
    var note = document.createElement('div'); note.className = 'kg-note';
    note.textContent = 'هذا ملخص محفوظ على هذا الجهاز فقط، ولا يُرسل اسم الطفل أو درجاته إلى قاعدة البيانات. للمزامنة مع المعلم يلزم إعداد قواعد Firestore آمنة أولًا.';
    body.appendChild(note);
    var records = readProgress().filter(function (item) { return item && item.stage === STAGE_ID; });
    var summary = document.createElement('div'); summary.className = 'kg-work-card';
    var bySubject = Object.create(null); records.forEach(function (item) { bySubject[item.subject || 'غير محدد'] = (bySubject[item.subject || 'غير محدد'] || 0) + 1; });
    summary.textContent = 'إجمالي التدريبات المكتملة: ' + records.length + ' • ' + SUBJECTS.map(function (subject) { return subject.name + ': ' + (bySubject[subject.name] || 0); }).join(' • ');
    body.appendChild(summary);
    if (!records.length) { var empty = document.createElement('div'); empty.className = 'kg-empty'; empty.textContent = 'لم تُحفظ تدريبات بعد. ابدأ من «تدريب اللمس والكتابة». تقارير الصوت والفيديو لا تُسجل استماع الطفل تلقائيًا.'; body.appendChild(empty); return; }
    records.slice().reverse().slice(0, 50).forEach(function (item) {
      var row = document.createElement('div'); row.className = 'kg-progress-row';
      row.textContent = (item.subject || '') + ' • ' + (item.grade || '') + ' • تدرب على ' + (item.prompt || '') + ' • ' + new Date(item.date).toLocaleString('ar-EG');
      body.appendChild(row);
    });
    var clear = document.createElement('button'); clear.type = 'button'; clear.className = 'kg-action'; clear.style.width = '100%'; clear.textContent = 'مسح التقرير من هذا الجهاز';
    clear.style.fontFamily = 'inherit'; clear.style.fontSize = '13px'; clear.style.fontWeight = '700';
    clear.onclick = function () { if (!window.confirm('مسح سجل التدريب المحفوظ على هذا الجهاز؟')) return; try { localStorage.removeItem(progressStorageKey()); } catch (error) {} window.openKindergartenReport(); };
    body.appendChild(clear);
  };

  function openStageBroadcast() {
    if (typeof window.openBroadcast !== 'function') { toast('أدوات البث لم تجهز بعد'); return; }
    var result = window.openBroadcast();
    if (window.currentRole === 'teacher') setTimeout(function () {
      var stage = document.getElementById('liveStage'); var grade = document.getElementById('liveGrade'); var subject = document.getElementById('liveSubject');
      if (stage) stage.value = STAGE_ID;
      if (grade) grade.value = String(activeGrade());
      if (subject) subject.value = String(activeSubject());
    }, 50);
    return result;
  }
  function addBroadcastStageOption() {
    var stage = document.getElementById('liveStage');
    if (!stage) return;
    if (!Array.prototype.some.call(stage.options, function (option) { return option.value === STAGE_ID; })) {
      var option = document.createElement('option'); option.value = STAGE_ID; option.textContent = STAGE_NAME; stage.appendChild(option);
    }
    var access = document.getElementById('liveAccessMode');
    var subject = document.getElementById('liveSubject');
    function updateMode() {
      var isKindergarten = stage.value === STAGE_ID;
      var warning = document.getElementById('kindergartenBroadcastWarning');
      if (access) {
        Array.prototype.forEach.call(access.options, function (option) {
          if (option.value === 'open') option.hidden = isKindergarten;
        });
        if (isKindergarten) access.value = 'approval';
      }
      if (subject) subject.placeholder = isKindergarten ? 'عربي أو English أو Maths' : 'رياضيات';
      if (isKindergarten && !warning) {
        var form = document.getElementById('teacherLiveRequestForm');
        if (form) {
          var note = document.createElement('div'); note.id = 'kindergartenBroadcastWarning'; note.className = 'kg-note';
          note.textContent = 'لرياض الأطفال، دخول الطلاب يكون بطلب وموافقة المعلم فقط. تنبيه: الغرفة الخارجية على meet.jit.si ليست محمية تقنيًا بحساب الطفل أو قائمة الحضور إذا انتشر رابطها.';
          var submit = document.getElementById('liveRequestSubmit');
          form.insertBefore(note, submit || null);
        }
      } else if (!isKindergarten && warning) warning.remove();
    }
    if (stage.getAttribute('data-kg-broadcast-bound') !== '1') {
      stage.setAttribute('data-kg-broadcast-bound', '1'); stage.addEventListener('change', updateMode);
    }
    updateMode();
  }
  function enforceKindergartenBroadcastApproval() {
    var original = window.submitTeacherLiveRequest;
    if (typeof original !== 'function' || original.__kindergartenGuard) return;
    var guarded = function () {
      var stage = document.getElementById('liveStage');
      if (stage && stage.value === STAGE_ID) {
        var grade = document.getElementById('liveGrade');
        var subject = document.getElementById('liveSubject');
        var access = document.getElementById('liveAccessMode');
        if (!grade || GRADES.indexOf(grade.value.trim()) < 0 || !subject || SUBJECTS.map(function (item) { return item.name; }).indexOf(subject.value.trim()) < 0) {
          toast('اختر KG1 أو KG2 ومادة عربي أو English أو Maths للبث'); return;
        }
        if (access) access.value = 'approval';
      }
      return original.apply(this, arguments);
    };
    guarded.__kindergartenGuard = true; window.submitTeacherLiveRequest = guarded;
  }

  function installStageSubjectView() {
    var original = window.openGrade;
    if (typeof original !== 'function' || original.__kindergartenWrapped) return;
    var wrapped = function (stageId, gradeName) {
      if (stageId !== STAGE_ID) return original.apply(this, arguments);
      writeGlobal('currentStage', STAGE_ID); writeGlobal('currentGrade', gradeName);
      var title = document.getElementById('subjectsTitle');
      var list = document.getElementById('subjectsList');
      if (!title || !list) return;
      title.textContent = 'رياض الأطفال لغات • ' + gradeName;
      list.textContent = '';
      SUBJECTS.forEach(function (subject) {
        var card = document.createElement('div'); card.className = 'subject-card'; card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'فتح مادة ' + subject.name); card.style.fontFamily = 'inherit';
        var icon = document.createElement('span'); icon.className = 'subject-icon'; icon.style.background = subject.color + '20'; icon.style.color = subject.color; icon.textContent = subject.icon;
        var name = document.createElement('span'); name.className = 'subject-name'; name.textContent = subject.name;
        card.appendChild(icon); card.appendChild(name);
        card.onclick = function () { if (typeof window.openSubject === 'function') window.openSubject(subject.id, subject.name); };
        card.onkeydown = function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } };
        list.appendChild(card);
      });
      pushHistory(); showScreen('subjectsScreen');
    };
    wrapped.__kindergartenWrapped = true; window.openGrade = wrapped;
  }
  function installTermsTools() {
    var original = window.renderTerms;
    if (typeof original !== 'function' || original.__kindergartenWrapped) return;
    var wrapped = function () {
      var result = original.apply(this, arguments);
      if (activeStage() === STAGE_ID) setTimeout(addKindergartenTools, 0);
      return result;
    };
    wrapped.__kindergartenWrapped = true; window.renderTerms = wrapped;
  }

  addStage(); ensureStyle(); installStageSubjectView(); installTermsTools(); addBroadcastStageOption(); enforceKindergartenBroadcastApproval();
  window.addEventListener('load', function () {
    addStage(); installStageSubjectView(); installTermsTools(); addBroadcastStageOption(); enforceKindergartenBroadcastApproval();
  });
})();
