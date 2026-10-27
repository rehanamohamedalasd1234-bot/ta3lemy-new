/* وضع عدم الاتصال — يضاف في نهاية extras.js بعد بقية أكواد الدخول. */
(function () {
  'use strict';
  var KEY = 'ta3lemy_offline_auth_v1';
  var LEGACY_PASSWORD_KEY = 'hafez_remembered_student_login_v1';

  function notify(text) { if (typeof window.showToast === 'function') window.showToast(text); else console.log(text); }
  function normalize(value) { return String(value || '').trim().toLowerCase(); }
  function hex(bytes) { return Array.from(new Uint8Array(bytes)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join(''); }
  function randomSalt() { var bytes = new Uint8Array(16); crypto.getRandomValues(bytes); return hex(bytes); }
  function readRecords() { try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (_) { return []; } }
  function saveRecords(a) { localStorage.setItem(KEY, JSON.stringify(a)); }
  function accountData(u, role) { return { uid: String(u.uid), name: String(u.name || u.email || 'مستخدم'), displayName: String(u.displayName || u.name || u.email || 'مستخدم'), email: String(u.email || ''), role: role, points: Number(u.points || 0), photo_url: String(u.photo_url || u.photoURL || '') }; }
  async function verifier(role, username, password, ownerCode, salt) {
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) throw new Error('هذا المتصفح لا يدعم تسجيل الدخول دون اتصال.');
    var material = role + '\u0000' + normalize(username) + '\u0000' + String(password || '') + '\u0000' + String(ownerCode || '');
    var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(material), 'PBKDF2', false, ['deriveBits']);
    var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
    return hex(bits);
  }
  function getInputs() {
    var name = document.getElementById('usernameInput'), password = document.getElementById('passwordInput'), code = document.getElementById('ownerCodeInput');
    return { username: name ? name.value.trim() : '', password: password ? password.value : '', ownerCode: code ? code.value : '', role: String(window.currentRole || 'student') };
  }
  async function saveOfflineCredential(form) {
    var current = window.currentUser;
    if (!current || !current.uid || String(window.currentRole || '') !== form.role) return;
    var salt = randomSalt();
    var record = { role: form.role, username: normalize(form.username), salt: salt, verifier: await verifier(form.role, form.username, form.password, form.ownerCode, salt), account: accountData(current, form.role), savedAt: Date.now() };
    var all = readRecords().filter(function (r) { return !(r.role === record.role && r.username === record.username); });
    all.push(record);
    saveRecords(all.slice(-8));
  }
  async function offlineLogin(form) {
    if (!form.username || !form.password) return notify('أدخل اسم الحساب وكلمة المرور اللذين استخدمتهما على هذا الجهاز من قبل.');
    var record = readRecords().find(function (r) { return r.role === form.role && r.username === normalize(form.username); });
    if (!record) return notify('هذا الحساب لم يُجهّز للعمل دون إنترنت على هذا الجهاز. سجّلي الدخول به مرة واحدة أثناء الاتصال أولًا.');
    try {
      var check = await verifier(form.role, form.username, form.password, form.ownerCode, record.salt);
      if (check !== record.verifier) return notify('بيانات الدخول غير مطابقة للحساب المحفوظ على هذا الجهاز.');
      window.currentUser = Object.assign({}, record.account);
      window.currentRole = record.role;
      window.TA3LEMY_OFFLINE_MODE = true;
      try { localStorage.setItem('lastUser', JSON.stringify(record.account)); } catch (_) {}
      showOfflineBanner();
      if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
      notify('تم الدخول بوضع عدم الاتصال. المتاح هو المحتوى المحفوظ فقط؛ الدردشة والبث المباشر يحتاجان إنترنت.');
      hideCloudControls();
    } catch (error) { console.error(error); notify(error.message || 'تعذر التحقق محليًا.'); }
  }
  function showOfflineBanner() {
    var badge = document.getElementById('offlineModeBanner');
    if (!badge) { badge = document.createElement('div'); badge.id = 'offlineModeBanner'; badge.style.cssText = 'position:fixed;top:8px;left:8px;right:8px;z-index:99999;padding:9px 12px;border-radius:12px;background:#5D4037;color:white;text-align:center;font:700 12px sans-serif;box-shadow:0 2px 8px #0003'; document.body.appendChild(badge); }
    badge.textContent = navigator.onLine ? 'جلسة محلية — اتصلي بالإنترنت ثم سجّلي الدخول لمزامنة الحساب' : 'وضع عدم الاتصال — المتاح هو المحتوى المحمّل فقط';
  }
  function hideCloudControls() {
    if (document.body) document.body.classList.add('ta3lemy-offline-session');
    if (!document.getElementById('ta3lemyOfflineCloudStyle')) {
      var style = document.createElement('style'); style.id = 'ta3lemyOfflineCloudStyle';
      style.textContent = 'body.ta3lemy-offline-session #adminMenu,body.ta3lemy-offline-session #teacherHubEntry,body.ta3lemy-offline-session #teacherReqBtn,body.ta3lemy-offline-session #teacherControlBtn,body.ta3lemy-offline-session #uploadBtn,body.ta3lemy-offline-session #teacherDashBtn,body.ta3lemy-offline-session #adminApprovalsBtn,body.ta3lemy-offline-session #adminContentBtn{display:none!important}';
      document.head.appendChild(style);
    }
    ['adminMenu', 'teacherHubEntry', 'teacherReqBtn', 'teacherControlBtn', 'uploadBtn', 'teacherDashBtn'].forEach(function (id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; });
  }
  function updateDownloadButton() {
    var button = document.getElementById('offlineBtnInGrid');
    if (button) { button.style.display = navigator.onLine ? '' : 'none'; button.title = navigator.onLine ? 'نزّلي المحتوى على هذا الجهاز قبل انقطاع الإنترنت' : 'اتصلي بالإنترنت لبدء التنزيل'; }
  }
  function blockNetworkOnlyScreens() {
    ['openMessages', 'openPublicChat'].forEach(function (name) {
      var original = window[name];
      if (typeof original !== 'function' || original.__offlineGuard) return;
      var wrapped = function () { if (!navigator.onLine) { notify('الدردشة تحتاج اتصالًا بالإنترنت.'); return; } return original.apply(this, arguments); };
      wrapped.__offlineGuard = true; window[name] = wrapped;
    });
  }
  function guardLogout() {
    var original = window.logout;
    if (typeof original !== 'function' || original.__offlineGuard) return;
    var wrapped = function () {
      var result = original.apply(this, arguments);
      if (!window.currentUser) {
        window.TA3LEMY_OFFLINE_MODE = false;
        if (document.body) document.body.classList.remove('ta3lemy-offline-session');
        var badge = document.getElementById('offlineModeBanner'); if (badge) badge.remove();
      }
      return result;
    };
    wrapped.__offlineGuard = true; window.logout = wrapped;
  }
  function installLogin() {
    if (typeof window.login !== 'function' || window.login.__offlineLoginWrapper) return false;
    var original = window.login;
    window.login = async function () {
      var form = getInputs();
      if (!navigator.onLine) return offlineLogin(form);
      var beforeUser = window.currentUser;
      try { var result = await original.apply(this, arguments); } catch (error) { console.error(error); }
      var current = window.currentUser;
      if (current && current.uid && current !== beforeUser && String(window.currentRole || '') === form.role) {
        window.TA3LEMY_OFFLINE_MODE = false;
        try { await saveOfflineCredential(form); } catch (error) { console.warn('Offline login setup failed', error); notify('تم الدخول، لكن تعذّر تجهيز هذا الحساب للعمل دون إنترنت على هذا الجهاز.'); }
        var badge = document.getElementById('offlineModeBanner'); if (badge) badge.remove();
      }
      return result;
    };
    window.login.__offlineLoginWrapper = true;
    return true;
  }
  // امسحي فورًا أي كلمة مرور قديمة محفوظة كنص واضح، قبل أن تعمل واجهة التذكّر القديمة.
  try { localStorage.removeItem(LEGACY_PASSWORD_KEY); } catch (_) {}
  window.saveRememberedStudentLogin = function () {};
  window.restoreRememberedStudentLogin = function () {};
  function install() {
    if (document.getElementById('rememberStudentLoginWrap')) document.getElementById('rememberStudentLoginWrap').style.display = 'none';
    // لا نحتفظ بكلمة المرور كنص واضح؛ يستخدم النظام بدلًا منها بصمة محلية مشتقة.
    window.saveRememberedStudentLogin = function () {};
    window.restoreRememberedStudentLogin = function () {};
    installLogin(); updateDownloadButton(); blockNetworkOnlyScreens(); guardLogout();
    var attempts = 0;
    var timer = setInterval(function () { attempts++; if (installLogin() || attempts > 20) clearInterval(timer); updateDownloadButton(); blockNetworkOnlyScreens(); guardLogout(); }, 500);
    window.addEventListener('online', function () { updateDownloadButton(); if (window.currentUser && window.TA3LEMY_OFFLINE_MODE) showOfflineBanner(); });
    window.addEventListener('offline', function () { updateDownloadButton(); if (window.currentUser) showOfflineBanner(); });
  }
  install();
})();
