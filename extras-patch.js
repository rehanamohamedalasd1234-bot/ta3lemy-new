// ═══════════════════════════════════════════════════════
// إصلاح تسجيل دخول الطلاب (الطريقة البسيطة)
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  setTimeout(function() {
    var origLogin = window.login;
    
    window.login = async function() {
      var u = document.getElementById('usernameInput').value.trim();
      var p = document.getElementById('passwordInput').value;
      
      if (!u || u.length < 3) {
        if(typeof showToast === 'function') showToast('⚠️ أدخل اسم مستخدم');
        return;
      }
      if (p.length < 4) {
        if(typeof showToast === 'function') showToast('⚠️ كلمة المرور قصيرة');
        return;
      }

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

      // لو طالب أو معلم -> دخول سريع ومباشر
      if(typeof showToast === 'function') showToast('⏳ جاري تسجيل الدخول...');
      try {
        var fs = firebase.firestore();
        var snap = await fs.collection('users').where('name', '==', u).limit(1).get();
        
        if (snap.empty) {
          // إنشاء حساب جديد فوراً للطالب
          window.currentUser = { name: u, uid: 'user_' + Date.now(), points: 0 };
          await fs.collection('users').doc(window.currentUser.uid).set({
            name: u,
            role: window.currentRole,
            points: 0,
            createdAt: new Date().toISOString()
          });
          if(typeof showToast === 'function') showToast('✅ تم إنشاء الحساب');
        } else {
          // الحساب موجود -> دخول مباشر
          var doc = snap.docs[0];
          window.currentUser = { name: u, uid: doc.id, points: doc.data().points || 0 };
          if(typeof showToast === 'function') showToast('✅ أهلاً بك مجدداً');
        }
        
        localStorage.setItem('lastUser', JSON.stringify(window.currentUser));
        if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 500);
        
      } catch (e) {
        console.error(e);
        if(typeof showToast === 'function') showToast('❌ خطأ في الاتصال');
      }
    };
    
    console.log('✅ Login Fixed (Simple Mode)');
  }, 2000);
});
