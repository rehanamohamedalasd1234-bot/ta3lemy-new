// تهيئة جلسة Firebase المجهولة لاستخدام الدردشة.
// لا نعيد تسجيل الدخول تلقائيًا بعد تسجيل الخروج حتى لا تتنافس جلسات anonymous.
window.addEventListener('load', function () {
  if (!window.firebase || typeof firebase.auth !== 'function') return;
  var auth = firebase.auth();
  if (!auth.currentUser) {
    auth.signInAnonymously().catch(function (error) {
      console.error('تعذر تهيئة مصادقة الدردشة:', error);
    });
  }
});
