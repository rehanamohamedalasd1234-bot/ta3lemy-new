/* استعادة جلسة التطبيق بعد إعادة التحميل أو مغادرة المتصفح مؤقتًا. */
(function () {
  'use strict';
  var USER_KEY = 'lastUser';
  var SESSION_STATE_KEY = 'ta3lemy_session_state_v1';
  var installed = false;

  function readUser() {
    try {
      var raw = localStorage.getItem(USER_KEY);
      var user = raw ? JSON.parse(raw) : null;
      return user && user.uid && user.name ? user : null;
    } catch (_) { return null; }
  }

  function saveState() {
    var user = readUser();
    if (!user || !window.currentUser) return;
    try {
      localStorage.setItem(SESSION_STATE_KEY, JSON.stringify({
        screen: String(window.currentScreen || 'homeScreen'),
        role: String(window.currentRole || user.role || 'student'),
        savedAt: Date.now()
      }));
    } catch (_) {}
  }

  function clearState() {
    try { localStorage.removeItem(SESSION_STATE_KEY); } catch (_) {}
  }

  function install() {
    if (installed || typeof window.showScreen !== 'function') return;
    installed = true;
    var original = window.showScreen;
    if (original.__sessionRestoreWrapped) return;
    window.showScreen = function (id) {
      var result = original.apply(this, arguments);
      if (id !== 'splashScreen' && id !== 'loginScreen') saveState();
      return result;
    };
    window.showScreen.__sessionRestoreWrapped = true;
    window.addEventListener('pagehide', saveState, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') saveState();
    });
  }

  window.restoreAppSession = function () {
    install();
    var user = readUser();
    if (!user) return false;
    window.currentUser = Object.assign({}, user);
    window.currentRole = String(user.role || 'student');
    window.TA3LEMY_SESSION_RESTORED = true;
    if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
    if (typeof window.showToast === 'function') window.showToast('✅ تم الاحتفاظ بتسجيل الدخول');
    return true;
  };

  window.clearAppSessionState = function () {
    clearState();
    try { localStorage.removeItem(USER_KEY); } catch (_) {}
  };

  install();
})();
