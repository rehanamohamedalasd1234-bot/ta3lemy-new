// تسجيل دخول المعلم بالايميل والباسورد (بدون SMS)
window.addEventListener('load', function() {
  setTimeout(function() {
    var origLogin = window.login;
    
    window.login = async function() {
      var email = document.getElementById('usernameInput').value.trim();
      var password = document.getElementById('passwordInput').value;
      
      // لو الحساب مالك
      if (window.currentRole === 'owner') {
        var c = document.getElementById('ownerCodeInput');
        if (c && c.value !== '135790') {
          if(typeof showToast === 'function') showToast('🔐 كود المالك خطأ');
          return;
        }
        if (origLogin) return origLogin();
        return;
      }

      // لو الحساب معلم
      if (window.currentRole === 'teacher') {
        if(typeof showToast === 'function') showToast('⏳ جاري تسجيل الدخول...');
        try {
          var auth = firebase.auth();
          var userCredential = await auth.signInWithEmailAndPassword(email, password);
          var user = userCredential.user;
          
          // التحقق من تفعيل الحساب في Firestore
          var doc = await firebase.firestore().collection('teacher_accounts').doc(user.uid).get();
          
          if (!doc.exists || doc.data().status !== 'approved') {
            if(typeof showToast === 'function') showToast('⚠️ حسابك لم يتم تفعيله بعد');
            await auth.signOut();
            return;
          }

          window.currentUser = { name: doc.data().name, uid: user.uid, points: 0 };
          localStorage.setItem('lastUser', JSON.stringify(window.currentUser));
          
          if(typeof showToast === 'function') showToast('✅ أهلاً بك يا معلم');
          if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 500);
          
        } catch (error) {
          console.error(error);
          if(typeof showToast === 'function') showToast('❌ فشل الدخول: ' + error.message);
        }
        return;
      }

      // لو طالب (نكمل بالطريقة القديمة)
      if (origLogin) return origLogin();
    };
    
    console.log('✅ Teacher Auth (Email) Loaded');
  }, 3000);
});
