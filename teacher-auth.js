// Teacher signup/login + one-click owner approval, without SMS or phone verification.
// Requires Firebase Authentication Email/Password provider to be enabled.
(function () {
  'use strict';

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else alert(message);
  }

  function role() {
    return window.currentRole || 'student';
  }

  function db() {
    return window.firebase.firestore();
  }

  function showTeacherToolsOnlyForTeacher() {
    if (role() === 'teacher') return;

    ['teacherHubEntry', 'teacherReqBtn', 'teacherControlBtn', 'uploadBtn', 'teacherDashBtn']
      .forEach(function (id) {
        var node = document.getElementById(id);
        if (node) node.remove();
      });
  }

  async function teacherLogin() {
    var emailEl = document.getElementById('usernameInput');
    var passwordEl = document.getElementById('passwordInput');
    var email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    var password = passwordEl ? passwordEl.value : '';
    var button = document.querySelector('#loginScreen .btn-primary');

    if (!email || email.indexOf('@') < 1) {
      return toast('اكتبي بريد المعلم الإلكتروني بشكل صحيح.');
    }

    if (password.length < 6) {
      return toast('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
    }

    if (!window.firebase || !firebase.auth || !firebase.firestore) {
      return toast('Firebase لم يكتمل تحميله. حدّثي الصفحة وجربي مرة أخرى.');
    }

    if (button) button.disabled = true;

    try {
      var auth = firebase.auth();
      var credential;
      var createdNow = false;

      try {
        credential = await auth.signInWithEmailAndPassword(email, password);
      } catch (signInError) {
        var signInCode = String(signInError && signInError.code || '');

        if (
          signInCode !== 'auth/user-not-found' &&
          signInCode !== 'auth/invalid-credential'
        ) {
          throw signInError;
        }

        try {
          credential = await auth.createUserWithEmailAndPassword(email, password);
          createdNow = true;
        } catch (createError) {
          if (String(createError && createError.code || '') === 'auth/email-already-in-use') {
            throw new Error('هذا البريد مسجل من قبل؛ تأكدي من كلمة المرور ثم حاولي مرة أخرى.');
          }
          throw createError;
        }
      }

      var user = credential.user;
      var accountSnap = await db()
        .collection('teacher_accounts')
        .doc(user.uid)
        .get();

      var account = accountSnap.exists ? (accountSnap.data() || {}) : {};
      var state = String(account.status || '').toLowerCase();

      if (state !== 'approved' && state !== 'active') {
        await db().collection('teacher_access_requests').doc(user.uid).set({
          uid: user.uid,
          email: email,
          displayName:
            account.name ||
            account.displayName ||
            user.displayName ||
            email.split('@')[0],
          status: 'pending',
          requestedAt: new Date().toISOString(),
          createdAccount: createdNow
        }, { merge: true });

        await auth.signOut();

        toast('تم إرسال طلب المعلم للمالك. بعد الموافقة، ادخلي بنفس البريد وكلمة المرور.');
        return;
      }

      window.currentUser = {
        uid: user.uid,
        name:
          account.name ||
          account.displayName ||
          user.displayName ||
          email.split('@')[0],
        displayName: account.displayName || account.display_name || account.name || user.displayName || email.split('@')[0],
        email: email,
        role: 'teacher',
        points: Number(account.points || 0),
        photo_url: Object.prototype.hasOwnProperty.call(account, 'photo_url')
          ? account.photo_url
          : (account.photoURL || user.photoURL || '')
      };

      window.currentRole = 'teacher';
      if (typeof window.syncPrivateChatProfile === 'function') {
        window.syncPrivateChatProfile().catch(function (error) { console.warn('تعذر مزامنة ملف المعلم مع الدردشة', error); });
      }

      try {
        localStorage.setItem('lastUser', JSON.stringify(window.currentUser));
      } catch (_) {}

      toast('أهلًا بكِ، تم دخول حساب المعلم.');

      if (typeof window.showScreen === 'function') {
        window.showScreen('homeScreen');
      }

      setTimeout(function () {
        if (typeof window.ensureTeacherEntry === 'function') {
          window.ensureTeacherEntry();
        }
      }, 300);

    } catch (error) {
      console.error('Teacher sign-in failed:', error);

      var code = String(error && error.code || '');

      if (code === 'auth/operation-not-allowed') {
        toast('فعّلي Email/Password من Firebase → Authentication → Sign-in method.');
      } else if (code === 'auth/invalid-email') {
        toast('صيغة البريد الإلكتروني غير صحيحة.');
      } else if (code === 'auth/weak-password') {
        toast('اختاري كلمة مرور من 6 أحرف أو أكثر.');
      } else if (
        code === 'permission-denied' ||
        code === 'firestore/permission-denied'
      ) {
        toast('Firestore رفض الطلب. تأكدي أن القراءة والكتابة مسموحتان مؤقتًا للمجموعتين teacher_access_requests وteacher_accounts.');
      } else {
        toast(error.message || 'تعذر تسجيل الدخول أو إرسال طلب المعلم.');
      }
    } finally {
      if (button) button.disabled = false;
      showTeacherToolsOnlyForTeacher();
    }
  }

  function installLoginHook() {
    if (window.__teacherSimpleFlowInstalled) return;

    window.__teacherSimpleFlowInstalled = true;
    var previousLogin = window.login;

    // extras.js يستدعي هذا الاسم عند اختيار دور المعلم.
    window.teacherPhoneLogin = teacherLogin;
    window.teacherEmailLogin = teacherLogin;

    window.login = function () {
      if (role() === 'teacher') return teacherLogin();

      if (typeof previousLogin === 'function') {
        return previousLogin.apply(this, arguments);
      }
    };
  }

  function textNode(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text || '';
    return el;
  }

  async function renderTeacherRequests() {
    if (role() !== 'owner') {
      return toast('هذه الصفحة للمالك فقط.');
    }

    var oldOpen = window.__previousTeacherAccessRequests;

    if (typeof oldOpen === 'function') {
      try {
        await oldOpen();
      } catch (error) {
        console.warn(error);
      }
    }

    var body = document.getElementById('teacherAccessRequestsScreenContent');

    if (!body) {
      return toast('تعذر فتح صفحة طلبات المعلمين.');
    }

    body.innerHTML = '<div class="tw-empty">⏳ جاري تحميل الطلبات...</div>';

    try {
      var snap = await db()
        .collection('teacher_access_requests')
        .where('status', '==', 'pending')
        .get();

      if (snap.empty) {
        body.innerHTML = '<div class="tw-empty">لا توجد طلبات معلمين معلقة.</div>';
        return;
      }

      body.innerHTML = '';

      snap.forEach(function (doc) {
        var item = doc.data() || {};
        var id = doc.id;
        var card = document.createElement('div');

        card.className = 'tw-card';
        card.appendChild(
          textNode('div', 'tw-title', item.displayName || 'طلب معلم')
        );
        card.appendChild(
          textNode('div', 'tw-meta', 'البريد: ' + (item.email || '—'))
        );

        var actions = document.createElement('div');
        actions.className = 'tw-actions';

        var approve = document.createElement('button');
        approve.className = 'tw-btn';
        approve.style.cssText = 'background:#2E7D32;color:#fff';
        approve.textContent = '✅ موافقة وتفعيل';

        approve.onclick = async function () {
          if (role() !== 'owner') {
            return toast('هذه الصفحة للمالك فقط.');
          }

          approve.disabled = true;

          try {
            var uid = String(item.uid || id);

            await db().collection('teacher_accounts').doc(uid).set({
              uid: uid,
              name: item.displayName || (item.email || '').split('@')[0] || 'معلم',
              email: item.email || '',
              status: 'approved',
              approvedAt: new Date().toISOString(),
              approvedBy: window.currentUser && window.currentUser.uid || ''
            }, { merge: true });

            await db().collection('teacher_access_requests').doc(id).set({
              status: 'approved',
              approvedAt: new Date().toISOString(),
              approvedBy: window.currentUser && window.currentUser.uid || ''
            }, { merge: true });

            toast('تم اعتماد حساب المعلم. أخبريه أن يسجل الدخول مرة أخرى.');
            await renderTeacherRequests();

          } catch (error) {
            console.error('Teacher approval failed:', error);
            approve.disabled = false;
            toast('تعذرت الموافقة. راجعي قواعد Firestore ثم حاولي مرة أخرى.');
          }
        };

        actions.appendChild(approve);
        card.appendChild(actions);
        body.appendChild(card);
      });

    } catch (error) {
      console.error('Loading teacher requests failed:', error);
      body.innerHTML = '<div class="tw-empty">تعذر تحميل الطلبات. راجعي اتصال Firebase وقواعد Firestore.</div>';
    }
  }

  function installOwnerApprovalHook() {
    if (window.__teacherApprovalHookInstalled) return;

    if (typeof window.openTeacherAccessRequests !== 'function') return;

    window.__previousTeacherAccessRequests = window.openTeacherAccessRequests;
    window.openTeacherAccessRequests = renderTeacherRequests;
    window.__teacherApprovalHookInstalled = true;
  }

  function cleanTeacherTools() {
    showTeacherToolsOnlyForTeacher();
    installOwnerApprovalHook();
  }

  // بعد تحميل بقية ملفات تسجيل الدخول ولوحة المعلم
  window.addEventListener('load', function () {
    setTimeout(function () {
      installLoginHook();
      installOwnerApprovalHook();
      cleanTeacherTools();
      setInterval(cleanTeacherTools, 1500);
    }, 100);
  }, { once: true });

  // إتاحة دوال التوافق لملفات الموقع الأخرى
  window.teacherPhoneLogin = teacherLogin;
  window.teacherEmailLogin = teacherLogin;
})();
