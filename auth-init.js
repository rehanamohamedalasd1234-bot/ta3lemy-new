// تهيئة Firebase Auth مرة واحدة، مع إتاحة انتظارها قبل تسجيل الطالب.
(function () {
  var resolveAuthReady;
  window.firebaseAuthReady = new Promise(function (resolve) { resolveAuthReady = resolve; });
  window.firebaseAnonymousSignInPromise = Promise.resolve(null);
  var initialized = false;

  function initAuth() {
    if (initialized) return;
    initialized = true;
    if (!window.firebase || !firebase.auth) {
      resolveAuthReady(null);
      return;
    }

    var auth = firebase.auth();
    var firstStateSeen = false;
    var anonymousPromise = null;
    auth.onAuthStateChanged(function (user) {
      if (!user && !anonymousPromise) {
        anonymousPromise = auth.signInAnonymously().then(function (credential) {
          return credential && credential.user || null;
        }).catch(function (error) {
          console.log('Anonymous Auth unavailable:', error && error.code || 'auth-error');
          return null;
        });
        window.firebaseAnonymousSignInPromise = anonymousPromise;
      }
      if (!firstStateSeen) {
        firstStateSeen = true;
        resolveAuthReady(user || null);
      }
    }, function (error) {
      console.log('Auth state error:', error && error.code || 'auth-error');
      if (!firstStateSeen) {
        firstStateSeen = true;
        resolveAuthReady(null);
      }
    });
  }

  if (document.readyState === 'complete') initAuth();
  else window.addEventListener('load', initAuth, { once: true });
})();
