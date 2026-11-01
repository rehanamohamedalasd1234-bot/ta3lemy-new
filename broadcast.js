/* غرف البث المباشر — كل الصلاحيات والرموز تُتحقق خادميًا عبر Firebase Functions. */
(function () {
  'use strict';

  var REGION = (window.CREATIVITY_CONFIG && window.CREATIVITY_CONFIG.functionsRegion) || 'us-central1';
  var SCREEN_ID = 'broadcastScreen';
  var state = {
    root: null,
    content: null,
    room: null,
    roomId: '',
    role: '',
    endsAt: 0,
    timer: null,
    refreshTimer: null,
    leaseTimer: null,
    busy: false
  };

  function esc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.info('[البث]', message);
  }

  function errorText(error) {
    var code = error && error.code ? String(error.code) : '';
    if (!navigator.onLine) return 'البث يحتاج إلى اتصال ثابت بالإنترنت.';
    if (code.indexOf('unauthenticated') >= 0) return 'انتهت جلسة الدخول؛ سجّل الدخول ثم حاول مرة أخرى.';
    if (code.indexOf('permission-denied') >= 0) return 'لا يملك هذا الحساب صلاحية هذه الخطوة.';
    if (code.indexOf('resource-exhausted') >= 0) return error.message || 'وصلت المنصة إلى الحد الحالي للمشاركين.';
    if (code.indexOf('failed-precondition') >= 0) return error.message || 'الغرفة غير جاهزة أو انتهت مدتها.';
    if (code.indexOf('functions/not-found') >= 0 || code.indexOf('not-found') >= 0) return 'خدمة غرف البث لم تُنشر أو تُجهّز بعد.';
    if (code.indexOf('app-check') >= 0) return 'حماية Firebase App Check غير جاهزة. راجع دليل إعداد البث.';
    return error && error.message ? error.message : 'تعذر إكمال العملية. حاول مرة أخرى.';
  }

  function addStyles() {
    if (document.getElementById('broadcastStyles')) return;
    var style = document.createElement('style');
    style.id = 'broadcastStyles';
    style.textContent = '.bc-wrap{max-width:1100px;margin:0 auto}.bc-card{background:#fff;border-radius:14px;padding:16px;margin:12px 0;box-shadow:0 2px 8px rgba(0,0,0,.08);line-height:1.65}.bc-note{background:#E3F2FD;color:#0D47A1;border-right:4px solid #1976D2;padding:12px;border-radius:10px;margin:10px 0}.bc-warning{background:#FFF8E1;color:#795548;border-right:4px solid #FFB300;padding:12px;border-radius:10px;margin:10px 0}.bc-status{display:inline-block;padding:4px 10px;border-radius:999px;background:#ECEFF1;color:#37474F;font-size:13px;font-weight:700}.bc-status-live{background:#FFEBEE;color:#B71C1C}.bc-status-approved{background:#E8F5E9;color:#1B5E20}.bc-status-requested{background:#FFF8E1;color:#8D6E00}.bc-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.bc-btn{border:0;border-radius:9px;padding:10px 14px;font-weight:700;cursor:pointer;background:#00695C;color:#fff}.bc-btn:disabled{opacity:.55;cursor:wait}.bc-btn-secondary{background:#546E7A}.bc-btn-danger{background:#C62828}.bc-btn-approve{background:#2E7D32}.bc-btn-reject{background:#C62828}.bc-form-grid{display:grid;grid-template-columns:1fr;gap:10px}.bc-field label{display:block;font-weight:700;margin-bottom:5px}.bc-field input,.bc-field select{box-sizing:border-box;width:100%;padding:10px;border:1px solid #cfd8dc;border-radius:8px;font:inherit;background:#fff}.bc-room-grid{display:grid;grid-template-columns:1fr;gap:10px}.bc-room-card{border:1px solid #e0e0e0;border-right:4px solid #00897B}.bc-room-meta{color:#666;font-size:14px}.bc-empty{padding:18px;text-align:center;color:#666;background:#f5f5f5;border-radius:12px;line-height:1.7}.bc-requests{margin-top:10px}.bc-request{background:#F5F5F5;border-radius:10px;padding:10px;margin:8px 0;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.bc-live-layout{display:grid;grid-template-columns:1fr;gap:12px}.bc-video-grid{display:grid;grid-template-columns:1fr;gap:10px;min-height:180px}.bc-video-tile{position:relative;background:#101820;color:#fff;border-radius:12px;overflow:hidden;min-height:140px;display:flex;align-items:center;justify-content:center}.bc-video-tile video{width:100%;max-height:60vh;object-fit:contain;background:#101820}.bc-video-label{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.7);color:#fff;border-radius:8px;padding:4px 8px;font-size:13px}.bc-video-tile audio{position:absolute;width:1px;height:1px;opacity:.01}.bc-countdown{font-weight:700;color:#B71C1C}.bc-small{font-size:13px;color:#666}@media(min-width:760px){.bc-form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.bc-room-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.bc-live-layout{grid-template-columns:minmax(0,2fr) minmax(280px,1fr)}.bc-video-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}';
    document.head.appendChild(style);
  }

  function ensureScreen() {
    if (state.root && document.body.contains(state.root)) return state.root;
    var screen = document.getElementById(SCREEN_ID);
    if (!screen) {
      screen = document.createElement('div');
      screen.id = SCREEN_ID;
      screen.className = 'screen';
      screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#00695C,#004D40)"><button class="icon-btn" type="button" data-bc-back aria-label="رجوع">→</button><div class="logo"><span>غرف البث المباشر</span></div><button class="icon-btn" type="button" data-bc-refresh aria-label="تحديث">↻</button></div><div class="content"><div id="broadcastContent"></div></div>';
      document.body.appendChild(screen);
    }
    state.root = screen;
    state.content = screen.querySelector('#broadcastContent');
    var back = screen.querySelector('[data-bc-back]');
    var refresh = screen.querySelector('[data-bc-refresh]');
    if (back && !back._bcBound) {
      back._bcBound = true;
      back.addEventListener('click', leaveScreen);
    }
    if (refresh && !refresh._bcBound) {
      refresh._bcBound = true;
      refresh.addEventListener('click', function () { window.openBroadcast(); });
    }
    if (state.content && !state.content._bcBound) {
      state.content._bcBound = true;
      state.content.addEventListener('click', handleClick);
      state.content.addEventListener('submit', handleSubmit);
    }
    return screen;
  }

  function addHomeTile() {
    var grid = document.querySelector('#homeScreen .tools-grid');
    if (!grid || document.getElementById('broadcastRoomsBtn')) return;
    var button = document.createElement('button');
    button.id = 'broadcastRoomsBtn';
    button.type = 'button';
    button.className = 'tool-btn';
    button.innerHTML = '<div class="tool-icon" style="background:#E0F2F1;color:#00695C;font-size:22px">بث</div><div class="tool-label">غرف البث</div>';
    button.addEventListener('click', window.openBroadcast);
    grid.appendChild(button);
  }

  function startTileWatch() {
    addHomeTile();
    var home = document.getElementById('homeScreen');
    if (home && window.MutationObserver && !home._bcObserver) {
      home._bcObserver = new MutationObserver(function () { addHomeTile(); });
      home._bcObserver.observe(home, { childList: true, subtree: true });
    }
    window.setTimeout(addHomeTile, 1000);
    window.setTimeout(addHomeTile, 5000);
  }

  function showModule() {
    ensureScreen();
    if (window.screenHistory && window.currentScreen && window.currentScreen !== SCREEN_ID) {
      window.screenHistory.push(window.currentScreen);
    }
    if (typeof window.showScreen === 'function') window.showScreen(SCREEN_ID);
  }

  function clearTimers() {
    if (state.timer) window.clearInterval(state.timer);
    if (state.refreshTimer) window.clearInterval(state.refreshTimer);
    if (state.leaseTimer) window.clearInterval(state.leaseTimer);
    state.timer = null;
    state.refreshTimer = null;
    state.leaseTimer = null;
  }

  function disconnectRoom() {
    var roomId = state.roomId;
    var role = state.role;
    var activeRoom = state.room;
    clearTimers();
    state.room = null;
    if (activeRoom) {
      try { activeRoom.disconnect(); } catch (_) {}
    }
    if (roomId && role) callFunction('releaseBroadcastConnection', { roomId: roomId, role: role }, role === 'student').catch(function () {});
    state.roomId = '';
    state.role = '';
    state.endsAt = 0;
  }

  function leaveScreen() {
    if (state.room && !window.confirm('الخروج سيقطع اتصال هذا الجهاز بالغرفة. هل تريد المتابعة؟')) return;
    disconnectRoom();
    clearTimers();
    if (typeof window.goBack === 'function') window.goBack();
    else if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
  }

  async function ensureStudentAuth() {
    if (!window.firebase || !firebase.auth) throw new Error('تسجيل الدخول الآمن غير متاح.');
    if (firebase.auth().currentUser) {
      if (firebase.auth().currentUser.isAnonymous) return firebase.auth().currentUser;
      throw new Error('جلسة Firebase الحالية ليست جلسة طالب؛ سجّل الخروج من حساب المعلم/المالك ثم أعد المحاولة.');
    }
    var result = await firebase.auth().signInAnonymously();
    return result.user;
  }

  async function callFunction(name, data, studentAuth) {
    if (!window.firebase || !firebase.functions) throw new Error('خدمات Firebase غير محمّلة.');
    if (!navigator.onLine) throw new Error('الغرف المباشرة تحتاج إلى اتصال بالإنترنت.');
    if (!window.CREATIVITY_APP_CHECK_READY) {
      throw new Error('يلزم إعداد App Check وتفعيل الدخول المجهول في Firebase قبل استخدام البث.');
    }
    if (studentAuth) await ensureStudentAuth();
    var functions = firebase.functions(REGION);
    var result = await functions.httpsCallable(name)(data || {});
    return result && result.data ? result.data : {};
  }

  function statusLabel(status) {
    var labels = {
      requested: 'في انتظار موافقة المالك',
      approved: 'موافق عليها — تنتظر بدء المعلم',
      starting: 'يجري تجهيز الغرفة',
      live: 'مباشرة الآن',
      rejected: 'مرفوضة',
      ended: 'انتهت'
    };
    return labels[status] || 'حالة غير معروفة';
  }

  function statusClass(status) {
    if (status === 'live') return 'bc-status bc-status-live';
    if (status === 'approved') return 'bc-status bc-status-approved';
    if (status === 'requested') return 'bc-status bc-status-requested';
    return 'bc-status';
  }

  function timeText(ms) {
    if (!ms) return '—';
    try { return new Date(ms).toLocaleString('ar-EG'); } catch (_) { return '—'; }
  }

  function escapeError(error) {
    return '<div class="bc-card" style="color:#B71C1C">' + esc(errorText(error)) + '</div>';
  }

  function loading(text) {
    state.content.innerHTML = '<div class="bc-empty">' + esc(text || 'جاري التحميل…') + '</div>';
  }

  function empty(text) {
    return '<div class="bc-empty">' + esc(text) + '</div>';
  }

  function roomCard(item, role) {
    var html = '<article class="bc-card bc-room-card" data-room-card="' + esc(item.id) + '">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap"><strong>' + esc(item.title) + '</strong><span class="' + statusClass(item.status) + '">' + esc(statusLabel(item.status)) + '</span></div>';
    html += '<div class="bc-room-meta">المادة: ' + esc(item.subject) + ' · المعلم: ' + esc(item.teacherName || '—') + '</div>';
    html += '<div class="bc-room-meta">المدة: ' + esc(item.durationMinutes) + ' دقيقة · السعة: ' + esc(item.maxParticipants) + ' إجمالي المشاركين · البداية: ' + esc(timeText(item.startedAt || item.requestedAt)) + '</div>';
    if (item.status === 'live' && item.endsAt) html += '<div class="bc-countdown" data-countdown="' + esc(item.endsAt) + '">تنتهي في: ' + esc(timeText(item.endsAt)) + '</div>';

    if (role === 'teacher') {
      if (item.status === 'requested') html += '<div class="bc-note">أُرسل الطلب إلى المالك. لا يمكن بدء البث قبل موافقته.</div>';
      if (item.status === 'approved') html += '<div class="bc-actions"><button class="bc-btn" type="button" data-bc-action="teacher-start" data-room-id="' + esc(item.id) + '">بدء البث الآن</button><button class="bc-btn bc-btn-danger" type="button" data-bc-action="teacher-end" data-room-id="' + esc(item.id) + '">إلغاء الغرفة</button></div>';
      if (item.status === 'live') {
        html += '<div class="bc-actions"><button class="bc-btn" type="button" data-bc-action="teacher-join" data-room-id="' + esc(item.id) + '">فتح البث والتحكم</button><button class="bc-btn bc-btn-danger" type="button" data-bc-action="teacher-end" data-room-id="' + esc(item.id) + '">إنهاء البث</button></div>';
        html += '<div class="bc-requests" data-requests-room="' + esc(item.id) + '"><div class="bc-small">جاري تحميل طلبات الدخول…</div></div>';
      }
    }

    if (role === 'owner') {
      if (item.status === 'requested') {
        html += '<div class="bc-form-grid" style="margin-top:10px"><div class="bc-field"><label>المدة التي يوافق عليها المالك</label><select data-owner-duration="' + esc(item.id) + '"><option value="30">30 دقيقة</option><option value="60" selected>60 دقيقة</option><option value="90">90 دقيقة</option><option value="120">120 دقيقة</option><option value="180">180 دقيقة</option></select></div><div class="bc-field"><label>الحد الأقصى للغرفة</label><select data-owner-capacity="' + esc(item.id) + '"><option value="20">20 مشاركًا</option><option value="30" selected>30 مشاركًا</option><option value="50">50 مشاركًا</option><option value="100">100 مشارك</option></select></div></div>';
        html += '<div class="bc-actions"><button class="bc-btn bc-btn-approve" type="button" data-bc-action="owner-approve" data-room-id="' + esc(item.id) + '">موافقة على فتح الغرفة</button><button class="bc-btn bc-btn-reject" type="button" data-bc-action="owner-reject" data-room-id="' + esc(item.id) + '">رفض</button></div>';
      } else if (item.status === 'live') {
        var names = (item.connectedParticipants || []).map(function (person) { return esc(person.name); }).join('، ');
        html += '<div class="bc-note">المشاركون الآن: ' + esc(item.participantCount || 0) + (names ? ' — ' + names : '') + '</div>';
        html += '<div class="bc-actions"><button class="bc-btn" type="button" data-bc-action="owner-monitor" data-room-id="' + esc(item.id) + '">مراقبة هذه الغرفة</button><button class="bc-btn bc-btn-danger" type="button" data-bc-action="owner-stop" data-room-id="' + esc(item.id) + '">إيقاف هذه الغرفة</button></div>';
      } else if (item.status === 'approved') {
        html += '<div class="bc-note">اعتمدها المالك؛ تنتظر أن يبدأ المعلم. يمكن إلغاء الإذن من هنا.</div><div class="bc-actions"><button class="bc-btn bc-btn-danger" type="button" data-bc-action="owner-stop" data-room-id="' + esc(item.id) + '">إلغاء الغرفة</button></div>';
      } else if (item.status === 'starting') {
        html += '<div class="bc-note">بدأ تجهيز اتصال LiveKit. حدّث القائمة بعد لحظات إذا لم تتغير الحالة.</div><div class="bc-actions"><button class="bc-btn bc-btn-danger" type="button" data-bc-action="owner-stop" data-room-id="' + esc(item.id) + '">إلغاء التجهيز</button></div>';
      }
    }

    if (role === 'student' && item.status === 'live') {
      html += '<div class="bc-actions"><button class="bc-btn" type="button" data-bc-action="student-request" data-room-id="' + esc(item.id) + '">طلب الدخول إلى الغرفة</button></div>';
    }
    html += '</article>';
    return html;
  }

  async function renderStudentLobby() {
    loading('جاري البحث عن غرف مباشرة…');
    try {
      var result = await callFunction('studentListLiveBroadcastRooms', {}, true);
      if (window.currentRole !== 'student') return;
      var items = result.items || [];
      var html = '<div class="bc-wrap"><div class="bc-card"><h3>الغرف المباشرة</h3><p>اختر غرفة ثم أرسل طلب دخول. لن يدخل الطالب قبل موافقة المعلم، وتنتهي الغرفة تلقائيًا عند الموعد الذي حدده المالك.</p></div>';
      html += items.length ? '<div class="bc-room-grid">' + items.map(function (item) { return roomCard(item, 'student'); }).join('') + '</div>' : empty('لا توجد غرف مباشرة متاحة الآن.');
      state.content.innerHTML = html + '</div>';
    } catch (error) { state.content.innerHTML = escapeError(error); }
  }

  function roomRequestForm() {
    return '<div class="bc-card"><h3>طلب فتح غرفة بث</h3><p>كل طلب غرفة مستقل. يجب أن يوافق المالك قبل أن تستطيع بدء البث.</p>' +
      '<form id="bcRoomRequestForm" data-bc-form="room-request"><div class="bc-form-grid">' +
      '<div class="bc-field"><label for="bcTitle">عنوان الحصة</label><input id="bcTitle" maxlength="100" required placeholder="مثال: مراجعة الدرس الأول"></div>' +
      '<div class="bc-field"><label for="bcSubject">المادة</label><input id="bcSubject" maxlength="80" required placeholder="مثال: التاريخ"></div>' +
      '<div class="bc-field"><label for="bcDuration">المدة المطلوبة</label><select id="bcDuration"><option value="30">30 دقيقة</option><option value="60" selected>60 دقيقة</option><option value="90">90 دقيقة</option><option value="120">120 دقيقة</option><option value="180">180 دقيقة</option></select></div>' +
      '<div class="bc-field"><label for="bcCapacity">السعة المطلوبة</label><select id="bcCapacity"><option value="20">20 مشاركًا</option><option value="30" selected>30 مشاركًا</option><option value="50">50 مشاركًا</option><option value="100">100 مشارك</option></select></div>' +
      '</div><div class="bc-actions"><button class="bc-btn" type="submit">إرسال طلب الغرفة للمالك</button></div></form>' +
      '<div class="bc-warning">الخطة المجانية لـ LiveKit تسمح حتى 100 مشارك متصل إجمالًا عبر كل الغرف المتزامنة، وليس 100 لكل غرفة. السعة الفعلية تعتمد على حساب LiveKit.</div></div>';
  }

  async function renderTeacherDashboard() {
    clearTimers();
    loading('جاري تحميل غرفك…');
    try {
      var result = await callFunction('teacherListBroadcastRooms', {});
      if (window.currentRole !== 'teacher') return;
      var items = result.items || [];
      var html = '<div class="bc-wrap">' + roomRequestForm();
      html += '<div class="bc-card"><h3>غرفك وطلباتها</h3><p>يمكن تشغيل عدة غرف بالتزامن عند وجود أكثر من معلم؛ سيبقى كل معلم مسؤولًا عن غرفة حسابه.</p>';
      html += items.length ? '<div class="bc-room-grid">' + items.map(function (item) { return roomCard(item, 'teacher'); }).join('') + '</div>' : empty('لم تطلب فتح غرف بث بعد.');
      html += '</div></div>';
      state.content.innerHTML = html;
      var active = items.filter(function (item) { return item.status === 'live'; });
      if (active.length) {
        state.refreshTimer = window.setInterval(function () {
          if (window.currentScreen !== SCREEN_ID || window.currentRole !== 'teacher') return;
          var panels = state.content.querySelectorAll('[data-requests-room]');
          for (var i = 0; i < panels.length; i++) refreshJoinRequests(panels[i].getAttribute('data-requests-room'), panels[i]);
        }, 6000);
        for (var j = 0; j < active.length; j++) {
          var panel = state.content.querySelector('[data-requests-room="' + active[j].id + '"]');
          if (panel) refreshJoinRequests(active[j].id, panel);
        }
      }
    } catch (error) { state.content.innerHTML = escapeError(error); }
  }

  function durationOptions(selected) {
    var values = [30, 60, 90, 120, 180];
    return values.map(function (value) { return '<option value="' + value + '"' + (Number(selected) === value ? ' selected' : '') + '>' + value + ' دقيقة</option>'; }).join('');
  }

  function capacityOptions(selected) {
    var values = [20, 30, 50, 100];
    return values.map(function (value) { return '<option value="' + value + '"' + (Number(selected) === value ? ' selected' : '') + '>' + value + ' مشارك</option>'; }).join('');
  }

  async function renderOwnerDashboard() {
    clearTimers();
    loading('جاري تحميل الغرف وحالة المشاركين…');
    try {
      var result = await callFunction('ownerListBroadcastRooms', {});
      if (window.currentRole !== 'owner') return;
      var items = result.items || [];
      var activeCount = Number(result.activeRoomCount) || 0;
      var totalCount = Number(result.totalConnectedParticipants) || 0;
      var html = '<div class="bc-wrap"><div class="bc-card"><h3>إدارة غرف البث</h3><p>تظهر كل الغرف هنا حتى عند عملها بالتوازي. تستطيع مراقبة غرفة واحدة، إيقاف غرفة محددة، أو إنهاء جميع الغرف.</p>' +
        '<div class="bc-note">الغرف النشطة: ' + activeCount + ' · إجمالي المتصلين الآن: ' + totalCount + ' من حد الخطة المجانية المعلن ' + esc(result.planParticipantLimit || 100) + ' عبر جميع الغرف.</div>' +
        '<div class="bc-actions"><button class="bc-btn bc-btn-danger" type="button" data-bc-action="owner-stop-all"' + (activeCount ? '' : ' disabled') + '>إيقاف كل الغرف المباشرة</button><button class="bc-btn bc-btn-secondary" type="button" data-bc-action="owner-refresh">تحديث القائمة</button></div></div>';
      var pending = items.filter(function (item) { return item.status === 'requested'; });
      var active = items.filter(function (item) { return item.status === 'live' || item.status === 'starting'; });
      var approved = items.filter(function (item) { return item.status === 'approved'; });
      var history = items.filter(function (item) { return item.status === 'ended' || item.status === 'rejected'; }).slice(0, 12);
      html += '<div class="bc-card"><h3>طلبات فتح الغرف (' + pending.length + ')</h3>';
      html += pending.length ? '<div class="bc-room-grid">' + pending.map(function (item) { return roomCard(item, 'owner'); }).join('') + '</div>' : empty('لا توجد طلبات جديدة من المعلمين.');
      html += '</div><div class="bc-card"><h3>الغرف المعتمدة أو الجارية (' + (active.length + approved.length) + ')</h3>';
      var activeItems = active.concat(approved);
      html += activeItems.length ? '<div class="bc-room-grid">' + activeItems.map(function (item) { return roomCard(item, 'owner'); }).join('') + '</div>' : empty('لا توجد غرف معتمدة أو جارية.');
      html += '</div><div class="bc-card"><h3>آخر الغرف المنتهية أو المرفوضة</h3>';
      html += history.length ? '<div class="bc-room-grid">' + history.map(function (item) { return roomCard(item, 'owner'); }).join('') + '</div>' : empty('لا يوجد سجل سابق.');
      html += '</div></div>';
      state.content.innerHTML = html;
      if (active.length) {
        state.refreshTimer = window.setInterval(function () {
          if (window.currentScreen === SCREEN_ID && window.currentRole === 'owner' && !state.room) renderOwnerDashboard();
        }, 12000);
      }
    } catch (error) { state.content.innerHTML = escapeError(error); }
  }

  async function refreshJoinRequests(roomId, panel) {
    if (!panel || !document.body.contains(panel)) return;
    try {
      var result = await callFunction('teacherListBroadcastJoinRequests', { roomId: roomId });
      var items = result.items || [];
      if (!items.length) {
        panel.innerHTML = '<div class="bc-small">لا توجد طلبات دخول معلقة.</div>';
        return;
      }
      panel.innerHTML = '<strong>طلبات دخول الطلاب (' + items.length + ')</strong>' + items.map(function (item) {
        return '<div class="bc-request"><span>' + esc(item.studentName || 'طالب') + '</span><div class="bc-actions" style="margin:0"><button class="bc-btn bc-btn-approve" type="button" data-bc-action="teacher-review-join" data-room-id="' + esc(roomId) + '" data-request-id="' + esc(item.requestId) + '" data-decision="approve">قبول</button><button class="bc-btn bc-btn-reject" type="button" data-bc-action="teacher-review-join" data-room-id="' + esc(roomId) + '" data-request-id="' + esc(item.requestId) + '" data-decision="reject">رفض</button></div></div>';
      }).join('');
    } catch (error) {
      panel.innerHTML = '<div class="bc-small" style="color:#B71C1C">' + esc(errorText(error)) + '</div>';
    }
  }

  async function requestStudentEntry(roomId) {
    var current = window.currentUser || {};
    var displayName = current.name || current.displayName || current.username || 'طالب';
    var response = await callFunction('studentRequestBroadcastEntry', { roomId: roomId, studentName: displayName }, true);
    state.roomId = roomId;
    state.role = 'student';
    state.endsAt = 0;
    state.content.innerHTML = '<div class="bc-card"><h3>طلب دخول الغرفة</h3><p id="bcJoinStatus">' + (response.status === 'approved' ? 'تم قبول طلبك، جاري الاتصال…' : 'أُرسل طلبك إلى المعلم. انتظر موافقته؛ ستتصل الغرفة تلقائيًا بعد القبول.') + '</p><div class="bc-actions"><button class="bc-btn bc-btn-secondary" type="button" data-bc-action="student-cancel">إلغاء والعودة</button></div></div>';
    if (response.status === 'approved') {
      var access = await callFunction('studentGetBroadcastAccess', { roomId: roomId }, true);
      if (access.status === 'approved') return connectRoom('student', access);
    }
    startStudentPolling(roomId);
  }

  function startStudentPolling(roomId) {
    if (state.timer) window.clearInterval(state.timer);
    var elapsed = 0;
    state.timer = window.setInterval(async function () {
      if (window.currentScreen !== SCREEN_ID || state.role !== 'student' || state.roomId !== roomId || state.room) return;
      elapsed += 4;
      if (elapsed >= 600) {
        window.clearInterval(state.timer);
        state.timer = null;
        var status = document.getElementById('bcJoinStatus');
        if (status) status.textContent = 'لم يصل رد خلال عشر دقائق. أعد فتح قائمة الغرف أو تواصل مع المعلم.';
        return;
      }
      try {
        var access = await callFunction('studentGetBroadcastAccess', { roomId: roomId }, true);
        var statusEl = document.getElementById('bcJoinStatus');
        if (access.status === 'approved') {
          window.clearInterval(state.timer);
          state.timer = null;
          await connectRoom('student', access);
        } else if (access.status === 'rejected' || access.status === 'ended') {
          window.clearInterval(state.timer);
          state.timer = null;
          if (statusEl) statusEl.textContent = access.status === 'rejected' ? 'رفض المعلم طلب الدخول.' : 'انتهى البث قبل قبول الطلب.';
        } else if (statusEl) {
          statusEl.textContent = 'طلبك ما زال في انتظار موافقة المعلم…';
        }
      } catch (error) {
        var statusNode = document.getElementById('bcJoinStatus');
        if (statusNode) statusNode.textContent = errorText(error);
      }
    }, 4000);
  }

  function addVideoTile(identity, name, track, local) {
    var grid = document.getElementById('bcVideoGrid');
    if (!grid || !track) return;
    var tileId = 'bc-tile-' + String(identity).replace(/[^A-Za-z0-9_-]/g, '_');
    var tile = document.getElementById(tileId);
    if (!tile) {
      tile = document.createElement('div');
      tile.className = 'bc-video-tile';
      tile.id = tileId;
      grid.appendChild(tile);
    }
    var media = track.attach();
    if (track.kind === 'video') {
      media.autoplay = true;
      media.playsInline = true;
      media.muted = !!local;
      media.style.width = '100%';
      media.style.maxHeight = '60vh';
      tile.appendChild(media);
    } else {
      media.autoplay = true;
      media.muted = !!local;
      tile.appendChild(media);
    }
    if (!tile.querySelector('.bc-video-label')) {
      var label = document.createElement('span');
      label.className = 'bc-video-label';
      label.textContent = (local ? 'أنت: ' : '') + (name || 'مشارك');
      tile.appendChild(label);
    }
  }

  function removeVideoTrack(track) {
    if (!track) return;
    try {
      var elements = track.detach();
      if (elements && elements.forEach) elements.forEach(function (element) { if (element.parentNode) element.parentNode.removeChild(element); });
    } catch (_) {}
  }

  function renderLiveRoom(role, roomId, info) {
    state.roomId = roomId;
    state.role = role;
    state.endsAt = Number(info.endsAt) || 0;
    var title = info.title || (role === 'owner' ? 'مراقبة الغرفة' : 'الغرفة المباشرة');
    var details = '<div class="bc-card"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><strong>' + esc(title) + '</strong><span class="bc-status bc-status-live">مباشرة الآن</span></div>' +
      '<div class="bc-room-meta">' + esc(info.subject || '') + (info.teacherName ? ' · ' + esc(info.teacherName) : '') + '</div><div id="bcClock" class="bc-countdown"></div>' +
      '<div class="bc-actions">';
    if (role === 'teacher') details += '<button class="bc-btn bc-btn-secondary" type="button" data-bc-action="toggle-camera">تشغيل/إيقاف الكاميرا</button><button class="bc-btn bc-btn-secondary" type="button" data-bc-action="toggle-mic">تشغيل/إيقاف الميكروفون</button><button class="bc-btn bc-btn-danger" type="button" data-bc-action="teacher-end" data-room-id="' + esc(roomId) + '">إنهاء الغرفة</button>';
    if (role === 'owner') details += '<button class="bc-btn bc-btn-danger" type="button" data-bc-action="owner-stop" data-room-id="' + esc(roomId) + '">إيقاف هذه الغرفة</button>';
    if (role === 'student') details += '<button class="bc-btn bc-btn-secondary" type="button" data-bc-action="student-leave">مغادرة الغرفة</button>';
    details += '</div></div>';
    details += '<div class="bc-live-layout"><div class="bc-card"><div id="bcVideoGrid" class="bc-video-grid"><div class="bc-empty">جاري الاتصال بالبث…</div></div></div><aside class="bc-card" id="bcLiveSidePanel">' + (role === 'teacher' ? '<h3>طلبات دخول الطلاب</h3><div class="bc-requests" data-requests-room="' + esc(roomId) + '"></div>' : role === 'owner' ? '<h3>مراقبة المالك</h3><p>يمكنك إنهاء هذه الغرفة الآن أو الرجوع إلى قائمة جميع الغرف.</p>' : '<h3>البث المباشر</h3><p>أنت داخل الغرفة كمشاهد.</p>') + '</aside></div>';
    state.content.innerHTML = '<div class="bc-wrap">' + details + '</div>';
    updateClock();
    state.timer = window.setInterval(updateClock, 1000);
    if (role === 'teacher') {
      var panel = state.content.querySelector('[data-requests-room]');
      refreshJoinRequests(roomId, panel);
      state.refreshTimer = window.setInterval(function () {
        if (window.currentScreen === SCREEN_ID && state.role === 'teacher') refreshJoinRequests(roomId, panel);
      }, 5000);
    }
  }

  function updateClock() {
    var node = document.getElementById('bcClock');
    if (!node || !state.endsAt) return;
    var remaining = Math.max(0, Math.floor((state.endsAt - Date.now()) / 1000));
    var minutes = Math.floor(remaining / 60);
    var seconds = remaining % 60;
    node.textContent = remaining ? 'الوقت المتبقي وفق مؤقت الخادم: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds : 'انتهى الوقت المحدد؛ يجري إنهاء الغرفة خادميًا.';
  }

  async function connectRoom(role, info) {
    clearTimers();
    var sdk = window.LivekitClient || window.LiveKitClient;
    if (!sdk || !sdk.Room || !sdk.RoomEvent) {
      state.content.innerHTML = '<div class="bc-card" style="color:#B71C1C">تعذر تحميل مكتبة LiveKit المحلية. أعد تحميل التطبيق وتحقق من وجود ملف vendor/livekit-client.umd.js.</div>';
      return;
    }
    if (!info || !info.url || !info.token) {
      state.content.innerHTML = '<div class="bc-card" style="color:#B71C1C">لم يصل رمز اتصال صالح من الخادم.</div>';
      return;
    }
    var roomId = info.roomId || state.roomId;
    renderLiveRoom(role, roomId, info);
    var room = new sdk.Room({ adaptiveStream: true, dynacast: true });
    state.room = room;
    room.on(sdk.RoomEvent.TrackSubscribed, function (track, publication, participant) {
      addVideoTile(participant.identity, participant.name || participant.identity, track, false);
    });
    room.on(sdk.RoomEvent.TrackUnsubscribed, function (track) { removeVideoTrack(track); });
    room.on(sdk.RoomEvent.LocalTrackPublished, function (publication) {
      if (publication && publication.track) addVideoTile(room.localParticipant.identity, 'أنت', publication.track, true);
    });
    room.on(sdk.RoomEvent.Disconnected, function () {
      if (state.room === room) {
        clearTimers();
        state.room = null;
        callFunction('releaseBroadcastConnection', { roomId: roomId, role: role }, role === 'student').catch(function () {});
        toast('انقطع اتصالك بالغرفة. حدّث الصفحة أو أعد الدخول إذا بقيت مباشرة.');
      }
    });
    try {
      await room.connect(info.url, info.token);
      state.leaseTimer = window.setInterval(function () {
        callFunction('heartbeatBroadcastConnection', { roomId: roomId, role: role }, role === 'student').catch(function (error) {
          if (error && (String(error.code || '').indexOf('permission-denied') >= 0 || String(error.code || '').indexOf('failed-precondition') >= 0)) {
            toast(errorText(error));
          }
        });
      }, 60000);
      if (role === 'teacher') {
        try { await room.localParticipant.setCameraEnabled(true); } catch (_) { toast('اسمح للتطبيق باستخدام الكاميرا لعرض صورة المعلم.'); }
        try { await room.localParticipant.setMicrophoneEnabled(true); } catch (_) { toast('اسمح للتطبيق باستخدام الميكروفون لنقل صوت المعلم.'); }
      }
      var empty = state.content.querySelector('.bc-video-grid .bc-empty');
      if (empty && role !== 'teacher') empty.textContent = 'تم الاتصال. انتظر ظهور صوت أو صورة البث.';
      if (role === 'teacher') toast('بدأ البث. يمكنك مراجعة طلبات الطلاب من اللوحة الجانبية.');
      if (role === 'owner') toast('أنت تراقب الغرفة.');
      if (role === 'student') toast('تم دخولك إلى الغرفة.');
    } catch (error) {
      try { room.disconnect(); } catch (_) {}
      callFunction('releaseBroadcastConnection', { roomId: roomId, role: role }, role === 'student').catch(function () {});
      clearTimers();
      state.room = null;
      state.content.innerHTML = escapeError(error);
    }
  }

  async function startTeacherRoom(roomId) {
    if (state.busy) return;
    state.busy = true;
    try {
      var info = await callFunction('teacherStartBroadcastRoom', { roomId: roomId });
      info.roomId = roomId;
      var roomResult = await callFunction('teacherListBroadcastRooms', {});
      var item = (roomResult.items || []).filter(function (row) { return row.id === roomId; })[0] || {};
      info.title = item.title;
      info.subject = item.subject;
      info.teacherName = item.teacherName;
      await connectRoom('teacher', info);
    } catch (error) { state.content.innerHTML = escapeError(error); }
    finally { state.busy = false; }
  }

  async function joinTeacherRoom(roomId) {
    if (state.busy) return;
    state.busy = true;
    try {
      var info = await callFunction('teacherGetBroadcastToken', { roomId: roomId });
      info.roomId = roomId;
      var result = await callFunction('teacherListBroadcastRooms', {});
      var item = (result.items || []).filter(function (row) { return row.id === roomId; })[0] || {};
      info.title = item.title;
      info.subject = item.subject;
      info.teacherName = item.teacherName;
      await connectRoom('teacher', info);
    } catch (error) { state.content.innerHTML = escapeError(error); }
    finally { state.busy = false; }
  }

  async function monitorRoom(roomId) {
    if (state.busy) return;
    state.busy = true;
    try {
      var info = await callFunction('ownerGetBroadcastMonitorToken', { roomId: roomId });
      info.roomId = roomId;
      var result = await callFunction('ownerListBroadcastRooms', {});
      var item = (result.items || []).filter(function (row) { return row.id === roomId; })[0] || {};
      info.title = item.title;
      info.subject = item.subject;
      info.teacherName = item.teacherName;
      await connectRoom('owner', info);
    } catch (error) { state.content.innerHTML = escapeError(error); }
    finally { state.busy = false; }
  }

  async function stopRoom(roomId, action) {
    if (!window.confirm('هل تريد إيقاف هذه الغرفة الآن وفصل جميع الموجودين؟')) return;
    try {
      var name = action === 'teacher-end' ? 'teacherEndBroadcastRoom' : 'ownerStopBroadcastRoom';
      await callFunction(name, { roomId: roomId });
      if (state.room && state.roomId === roomId) disconnectRoom();
      toast('تم إنهاء الغرفة وفصل المشاركين.');
      await window.openBroadcast();
    } catch (error) { toast(errorText(error)); }
  }

  async function stopAllRooms() {
    if (!window.confirm('سيؤدي ذلك إلى إيقاف الغرف المباشرة أو الجاري تجهيزها فقط؛ ستبقى الطلبات والموافقات المعلقة كما هي. هل تؤكد؟')) return;
    try {
      var result = await callFunction('ownerStopAllBroadcastRooms', {});
      if (state.room) disconnectRoom();
      toast(result.failed ? 'تم إيقاف ' + result.ended + ' غرفة، وتعذر إيقاف ' + result.failed + ' غرف.' : 'تم إيقاف كل الغرف.');
      await renderOwnerDashboard();
    } catch (error) { toast(errorText(error)); }
  }

  async function reviewOwnerRoom(roomId, action, card) {
    try {
      var duration = card.querySelector('[data-owner-duration]');
      var capacity = card.querySelector('[data-owner-capacity]');
      await callFunction('ownerReviewBroadcastRoom', {
        roomId: roomId,
        action: action,
        durationMinutes: duration ? Number(duration.value) : 60,
        maxParticipants: capacity ? Number(capacity.value) : 30
      });
      toast(action === 'approve' ? 'تمت الموافقة على طلب الغرفة. يجب على المعلم بدءها.' : 'تم رفض طلب الغرفة.');
      await renderOwnerDashboard();
    } catch (error) { toast(errorText(error)); }
  }

  async function createTeacherRoom(form) {
    var title = form.querySelector('#bcTitle').value.trim();
    var subject = form.querySelector('#bcSubject').value.trim();
    var duration = Number(form.querySelector('#bcDuration').value);
    var capacity = Number(form.querySelector('#bcCapacity').value);
    try {
      await callFunction('teacherRequestBroadcastRoom', { title: title, subject: subject, durationMinutes: duration, maxParticipants: capacity });
      toast('أُرسل طلب فتح الغرفة للمالك.');
      await renderTeacherDashboard();
    } catch (error) { toast(errorText(error)); }
  }

  async function reviewStudent(roomId, requestId, action) {
    try {
      await callFunction('teacherReviewBroadcastJoinRequest', { roomId: roomId, requestId: requestId, action: action });
      toast(action === 'approve' ? 'تم قبول الطالب.' : 'تم رفض طلب الدخول.');
      var panels = state.content.querySelectorAll('[data-requests-room="' + roomId + '"]');
      for (var i = 0; i < panels.length; i++) refreshJoinRequests(roomId, panels[i]);
    } catch (error) { toast(errorText(error)); }
  }

  async function toggleCamera() {
    if (!state.room || state.role !== 'teacher') return;
    var enabled = !state.room.localParticipant.isCameraEnabled;
    try { await state.room.localParticipant.setCameraEnabled(enabled); }
    catch (_) { toast('تعذر تغيير حالة الكاميرا. تحقق من صلاحيات الجهاز.'); }
  }

  async function toggleMicrophone() {
    if (!state.room || state.role !== 'teacher') return;
    var enabled = !state.room.localParticipant.isMicrophoneEnabled;
    try { await state.room.localParticipant.setMicrophoneEnabled(enabled); }
    catch (_) { toast('تعذر تغيير حالة الميكروفون. تحقق من صلاحيات الجهاز.'); }
  }

  function findAction(target) {
    while (target && target !== state.content) {
      if (target.getAttribute && target.getAttribute('data-bc-action')) return target;
      target = target.parentNode;
    }
    return null;
  }

  async function handleClick(event) {
    var button = findAction(event.target);
    if (!button) return;
    var action = button.getAttribute('data-bc-action');
    var roomId = button.getAttribute('data-room-id') || '';
    var requestId = button.getAttribute('data-request-id') || '';
    button.disabled = true;
    try {
      if (action === 'student-request') await requestStudentEntry(roomId);
      else if (action === 'teacher-start') await startTeacherRoom(roomId);
      else if (action === 'teacher-join') await joinTeacherRoom(roomId);
      else if (action === 'teacher-end' || action === 'owner-stop') await stopRoom(roomId, action);
      else if (action === 'owner-stop-all') await stopAllRooms();
      else if (action === 'owner-approve' || action === 'owner-reject') {
        var card = button.closest ? button.closest('[data-room-card]') : button.parentNode.parentNode;
        await reviewOwnerRoom(roomId, action === 'owner-approve' ? 'approve' : 'reject', card);
      } else if (action === 'owner-monitor') await monitorRoom(roomId);
      else if (action === 'owner-refresh') await renderOwnerDashboard();
      else if (action === 'teacher-review-join') await reviewStudent(roomId, requestId, button.getAttribute('data-decision'));
      else if (action === 'toggle-camera') await toggleCamera();
      else if (action === 'toggle-mic') await toggleMicrophone();
      else if (action === 'student-cancel' || action === 'student-leave') {
        disconnectRoom();
        await window.openBroadcast();
      }
    } catch (error) { toast(errorText(error)); }
    finally { if (document.body.contains(button)) button.disabled = false; }
  }

  function handleSubmit(event) {
    var form = event.target;
    if (!form || form.getAttribute('data-bc-form') !== 'room-request') return;
    event.preventDefault();
    createTeacherRoom(form);
  }

  async function openBroadcast() {
    if (state.room) {
      showModule();
      return;
    }
    clearTimers();
    showModule();
    var role = window.currentRole || 'student';
    if (role === 'owner') return renderOwnerDashboard();
    if (role === 'teacher') return renderTeacherDashboard();
    return renderStudentLobby();
  }

  function initialize() {
    addStyles();
    ensureScreen();
    startTileWatch();
    window.openBroadcast = openBroadcast;
    window.openTeacherBroadcast = openBroadcast;
    window.startApprovedLive = openBroadcast;
    window.submitTeacherRequest = openBroadcast;
    window.openBroadcastRequests = openBroadcast;
    window.endTeacherBroadcast = function () {
      if (state.role === 'teacher' && state.roomId) return stopRoom(state.roomId, 'teacher-end');
      return openBroadcast();
    };
  }

  window.openBroadcast = openBroadcast;
  window.addEventListener('load', initialize);
})();
