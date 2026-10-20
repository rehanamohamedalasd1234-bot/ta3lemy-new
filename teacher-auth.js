/* تسجيل دخول مستقل للمعلم عبر Firebase Phone Auth.
 * لا يمنح الدور إلا عند وجود teacher_accounts/{Auth UID} بحالة approved/active.
 * إصدار رمز SMS يتطلب تفعيل Phone provider وتهيئة Authorized Domains في Firebase.
 */
(function () {
  'use strict';
  var confirmation = null;
  var recaptcha = null;
  var originalSelectRole = window.selectRole;
  var authBusy = false;

  function byId(id) { return document.getElementById(id); }
  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else alert(message);
  }
  function normalizePhone(raw) {
    var value = String(raw || '').trim().replace(/[\s()\-]/g, '');
    if (/^01[0125]\d{8}$/.test(value)) return '+2' + value;
    if (/^20\d{10}$/.test(value)) return '+' + value;
    if (/^\+\d{8,15}$/.test(value)) return value;
    return null;
  }
  function setVisible(id, visible) {
    var element = byId(id);
    if (element) element.style.display = visible ? '' : 'none';
  }
  function ensurePhoneUI() {
    var screen = byId('loginScreen');
    var button = screen && screen.querySelector('.btn-primary');
    if (!screen || !button || byId('teacherPhoneGroup')) return;
    var phoneGroup = document.createElement('div');
    phoneGroup.id = 'teacherPhoneGroup';
    phoneGroup.style.display = 'none';
    phoneGroup.innerHTML = '<div class="form-group"><label class="form-label" for="teacherDisplayName">اسم المعلم</label><input id="teacherDisplayName" class="form-input" type="text" maxlength="60" autocomplete="name" placeholder="الاسم كما سيظهر للطلاب"></div><div class="form-group"><label class="form-label" for="teacherPhoneNumber">رقم الهاتف الموثق</label><input id="teacherPhoneNumber" class="form-input" type="tel" inputmode="tel" autocomplete="tel" placeholder="01xxxxxxxxx أو +رمز الدولة"></div><div id="teacherOtpGroup" class="form-group" style="display:none"><label class="form-label" for="teacherOtpCode">رمز التحقق SMS</label><input id="teacherOtpCode" class="form-input" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="أدخل رمز التحقق"></div><div id="teacherAuthHelp" style="font-size:12px;line-height:1.7;color:#607D8B;margin:0 0 12px;">تسجيل المعلم برقم الهاتف يحتاج اعتماد حسابك من المالك. لا تستخدم رقم طالب.</div><div id="teacherRecaptchaContainer"></div>';
    screen.insertBefore(phoneGroup, button);
    button.id = 'loginSubmitButton';
  }
  function updateLoginMode() {
    ensurePhoneUI();
    var teacherMode = window.currentRole === 'teacher';
    setVisible('teacherPhoneGroup', teacherMode);
    var username = byId('usernameInput');
    var password = byId('passwordInput');
    if (username && username.parentElement) username.parentElement.style.display = teacherMode ? 'none' : '';
    if (password && password.parentElement) password.parentElement.style.display = teacherMode ? 'none' : '';
    var button = byId('loginSubmitButton');
    if (button) button.textContent = teacherMode ? (confirmation ? '✅ تأكيد الرمز والدخول' : '📲 إرسال رمز التحقق') : 'تسجيل الدخول';
    setVisible('ownerCodeGroup', window.currentRole === 'owner');
  }
  function getAuth() {
    if (!window.firebase || typeof window.firebase.auth !== 'function') throw new Error('Firebase Authentication SDK غير محمّل');
    return window.firebase.auth();
  }
  function getRecaptcha(auth) {
    if (recaptcha) return recaptcha;
    var container = byId('teacherRecaptchaContainer');
    if (!container) throw new Error('تعذر تجهيز التحقق الأمني');
    recaptcha = new window.firebase.auth.RecaptchaVerifier(container, { size: 'invisible' });
    return recaptcha;
  }
  function asText(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  async function sendCode(auth) {
    var phone = normalizePhone(byId('teacherPhoneNumber').value);
    var name = byId('teacherDisplayName').value.trim();
    if (!name || name.length < 3) return toast('اكتب اسم المعلم (3 أحرف على الأقل)');
    if (!phone) return toast('اكتب رقم هاتف بصيغة صحيحة، مثل 01xxxxxxxxx أو +201xxxxxxxxx');
    try {
      confirmation = await auth.signInWithPhoneNumber(phone, getRecaptcha(auth));
      window.teacherPendingPhone = phone;
      window.teacherPendingName = name;
      setVisible('teacherOtpGroup', true);
      var help = byId('teacherAuthHelp');
      if (help) help.textContent = 'أرسلنا رمزًا إلى ' + phone + '. أدخل الرمز لإكمال التحقق.';
      updateLoginMode();
      toast('تم إرسال رمز التحقق إلى هاتفك');
    } catch (error) {
      console.error('Teacher phone auth send failed', error);
      if (recaptcha) { try { recaptcha.clear(); } catch (e) {} recaptcha = null; }
      var message = error && error.code === 'auth/too-many-requests' ? 'محاولات كثيرة؛ انتظر قليلًا ثم حاول مجددًا.' : 'تعذر إرسال الرمز. تحقق من تفعيل Phone Authentication والنطاق المصرح به في Firebase.';
      toast(message);
    }
  }
  async function verifyCode(auth) {
    var code = byId('teacherOtpCode').value.trim();
    if (!confirmation || code.length < 4) return toast('أدخل رمز التحقق الذي وصلك SMS');
    try {
      var result = await confirmation.confirm(code);
      var user = result.user;
      var phone = user.phoneNumber || window.teacherPendingPhone;
      var fs = window.firebase.firestore();
      var accountDoc = await fs.collection('teacher_accounts').doc(user.uid).get();
      if (!accountDoc.exists || !['approved', 'active'].includes(String((accountDoc.data() || {}).status || '').toLowerCase())) {
        var displayName = window.teacherPendingName || (byId('teacherDisplayName') && byId('teacherDisplayName').value.trim()) || 'معلم';
        try {
          await fs.collection('teacher_access_requests').doc(user.uid).set({
            uid: user.uid,
            phoneNumber: phone,
            displayName: displayName,
            status: 'pending',
            requestedAt: new Date().toISOString()
          }, { merge: true });
        } catch (requestError) {
          console.warn('Teacher access request not saved; Firestore rules may need configuration', requestError);
        }
        try { await auth.signOut(); } catch (signOutError) { console.warn(signOutError); }
        window.currentUser = null;
        window.currentRole = 'student';
        confirmation = null;
        toast('تم التحقق من رقمك، لكن حساب المعلم ينتظر اعتماد المالك. أرسل له رمز الحساب: ' + user.uid);
        return;
      }
      var account = accountDoc.data() || {};
      if (account.phoneNumber && normalizePhone(account.phoneNumber) !== normalizePhone(phone)) {
        await auth.signOut();
        throw new Error('رقم الهاتف لا يطابق الرقم المعتمد لهذا الحساب');
      }
      window.currentUser = {
        uid: user.uid,
        name: account.name || account.displayName || window.teacherPendingName || 'المعلم',
        phoneNumber: phone,
        points: Number(account.points || 0)
      };
      window.currentRole = 'teacher';
      try {
        localStorage.setItem('lastUser', JSON.stringify({ name: window.currentUser.name, uid: user.uid, role: 'teacher', points: window.currentUser.points }));
      } catch (e) {}
      confirmation = null;
      toast('تم التحقق من رقم الهاتف والدخول بحساب المعلم');
      if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
      if (typeof window.ensureTeacherEntry === 'function') window.ensureTeacherEntry();
    } catch (error) {
      console.error('Teacher phone auth verification failed', error);
      if (error && error.message === 'رقم الهاتف لا يطابق الرقم المعتمد لهذا الحساب') toast(error.message);
      else if (error && error.code === 'permission-denied') toast('تم التحقق من الهاتف، لكن قواعد Firestore تمنع فحص اعتماد المعلم. يلزم إعداد قواعد الخادم.');
      else toast('رمز التحقق غير صحيح أو انتهت صلاحيته');
    }
  }
  window.teacherPhoneLogin = async function () {
    if (authBusy) return;
    authBusy = true;
    var button = byId('loginSubmitButton');
    if (button) button.disabled = true;
    try {
      if (!navigator.onLine) throw new Error('دخول المعلم يتطلب اتصالًا بالإنترنت للتحقق من رقم الهاتف');
      var auth = getAuth();
      if (confirmation) await verifyCode(auth);
      else await sendCode(auth);
    } catch (error) {
      console.error(error);
      toast(error.message || 'تعذر تسجيل الدخول الآمن للمعلم');
    } finally {
      authBusy = false;
      if (button) button.disabled = false;
      updateLoginMode();
    }
  };
  var previousLogin = window.login;
  window.login = function () {
    if (window.currentRole === 'teacher') return window.teacherPhoneLogin();
    if (typeof previousLogin === 'function') return previousLogin.apply(this, arguments);
  };
  window.selectRole = function (button, role) {
    if (typeof originalSelectRole === 'function') originalSelectRole(button, role);
    else window.currentRole = role;
    if (role !== 'teacher') {
      confirmation = null;
      try {
        if (window.firebase && typeof window.firebase.auth === 'function' && window.firebase.auth().currentUser) {
          window.firebase.auth().signOut().catch(function (error) { console.warn(error); });
        }
      } catch (error) { console.warn(error); }
      if (byId('teacherOtpCode')) byId('teacherOtpCode').value = '';
      if (byId('teacherOtpGroup')) byId('teacherOtpGroup').style.display = 'none';
    }
    updateLoginMode();
  };
  window.addEventListener('load', function () { setTimeout(updateLoginMode, 0); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateLoginMode);
  else updateLoginMode();
})();
