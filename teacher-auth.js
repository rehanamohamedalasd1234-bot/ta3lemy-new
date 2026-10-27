// تسجيل دخول المعلم بالبريد وكلمة المرور، مع إرسال طلب موافقة للمالك
// يجب إنشاء حساب المعلم أولًا في Firebase Authentication.
(function () {
  'use strict';

  function toast(message) {
    if (typeof window.showToast === 'function') {
      window.showToast(message);
    } else {
      alert(message);
    }
  }

  function currentRole() {
    return window.currentRole || 'student';
  }

  async function teacherLogin() {
    var emailEl = document.getElementById('usernameInput');
    var passwordEl = document.getElementById('passwordInput');

    var email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    var password = passwordEl ? passwordEl.value : '';

    if (!email || !email.includes('@')) {
      return toast('اكتبي البريد الإلكتروني للمعلم بشكل صحيح.');
    }

    if (!password) {
      return toast('اكتبي كلمة المرور.');
    }

    if (
      !window.firebase ||
      typeof window.firebase.auth !== 'function' ||
      typeof window.firebase.firestore !== 'function'
    ) {
      return toast('خدمات Firebase لم تجهز. أعيدي تحميل الصفحة بعد قليل.');
    }

    var button = document.querySelector('#loginScreen .btn-primary');
    if (button) button.disabled = true;

    try {
      var auth = window.firebase.auth();
      var credential = await auth.signInWithEmailAndPassword(email, password);
      var user = credential.user;
      var db = window.firebase.firestore();

      // يفحص هل حساب المعلم معتمد من قبل المالك
      var accountRef = db.collection('teacher_accounts').doc(user.uid);
      var accountSnap = await accountRef.get();

      var account = accountSnap.exists ? (accountSnap.data() || {}) : {};
      var status = String(account.status || '').toLowerCase();

      // إذا لم يكن معتمدًا، ينشئ طلبًا يظهر عند المالك
      if (status !== 'approved' && status !== 'active') {
        await db.collection('teacher_access_requests').doc(user.uid).set({
          uid: user.uid,
          email: email,
          displayName:
            account.name ||
            account.displayName ||
            user.displayName ||
            email.split('@')[0],
          phoneNumber: user.phoneNumber || '',
          status: 'pending',
          requestedAt: new Date().toISOString()
        }, { merge: true });

        await auth.signOut();

        toast('تم إرسال طلبك للمالك. بعد اعتماده، سجّلي الدخول بنفس البريد وكلمة المرور.');
        return;
      }

      // إذا كان الحساب معتمدًا، يفتح المنصة كمعلم
      window.currentUser = {
        uid: user.uid,
        name:
          account.name ||
          account.displayName ||
          user.displayName ||
          email.split('@')[0],
        email: email,
        role: 'teacher',
        points: Number(account.points || 0)
      };

      window.currentRole = 'teacher';

      try {
        localStorage.setItem('lastUser', JSON.stringify(window.currentUser));
      } catch (_) {}

      toast('تم تسجيل الدخول بحساب المعلم.');

      if (typeof window.showScreen === 'function') {
        window.showScreen('homeScreen');
      }

      if (typeof window.ensureTeacherEntry === 'function') {
        window.ensureTeacherEntry();
      }
    } catch (error) {
      console.error('Teacher sign-in/request failed:', error);

      var code = String(error && error.code || '');

      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password'
      ) {
        toast('البريد أو كلمة المرور غير صحيحين. تأكدي أولًا أن حساب المعلم موجود في Firebase Authentication → Users.');
      } else if (code === 'auth/invalid-email') {
        toast('صيغة البريد الإلكتروني غير صحيحة.');
      } else if (code === 'auth/too-many-requests') {
        toast('محاولات كثيرة. انتظري قليلًا ثم حاولي مرة أخرى.');
      } else if (
        code === 'permission-denied' ||
        code === 'firestore/permission-denied'
      ) {
        toast('Firestore رفض الطلب. راجعي قواعد Rules للمجموعتين teacher_access_requests وteacher_accounts.');
      } else if (code === 'auth/operation-not-allowed') {
        toast('فعّلي Email/Password من Firebase → Authentication → Sign-in method.');
      } else {
        toast('تعذر تسجيل الدخول أو إرسال الطلب: ' +
          (error && error.message ? error.message : 'خطأ غير معروف'));
      }
    } finally {
      if (button) button.disabled = false;
    }
  }

  function install() {
    if (window.__teacherEmailAuthInstalled) return;

    window.__teacherEmailAuthInstalled = true;
    var originalLogin = window.login;

    window.login = function () {
      if (currentRole() === 'teacher') {
        return teacherLogin();
      }

      if (typeof originalLogin === 'function') {
        return originalLogin.apply(this, arguments);
      }
    };

window.teacherEmailLogin = teacherLogin;
window.teacherPhoneLogin = teacherLogin;
  }

  // يركّب التعديل بعد تحميل تسجيل الدخول الحالي في الموقع
  if (document.readyState === 'complete') {
    setTimeout(install, 0);
  } else {
    window.addEventListener('load', function () {
      setTimeout(install, 0);
    }, { once: true });
  }
})();
