// تفعيل المصادقة للمنصة
window.addEventListener('load', function() {
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        // تسجيل دخول مجهول للطلاب عشان يفتح الدردشة
        firebase.auth().signInAnonymously().catch(function(error) {
          console.log('Auth error:', error);
        });
      }
    });
  }
});
