/* دخول المعلم عبر Cloudflare Worker، مع رمز Firebase مخصص بدور المعلم فقط. */
(function () {
  'use strict';

  var originalSelectRole = window.selectRole;
  var originalLogin = window.login;

  function byId(id) { return document.getElementById(id); }
  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else alert(message);
  }
  function setVisible(id, visible) {
    var element = byId(id);
    if (element) element.style.display = visible ? 'block' : 'none';
  }

  function updateLoginMode() {
    var teacherMode = window.currentRole === 'teacher';
    var username = byId('usernameInput');
    var password = byId('passwordInput');
    var button = document.querySelector('#loginScreen .btn-primary');

    if (username) {
      username.parentElement.style.display = '';
      username.placeholder = teacherMode ? '👨‍🏫 اسم مستخدم المعلم' : '👤 اسم المستخدم';
      username.autocomplete = 'username';
    }
    if (password) {
      password.parentElement.style.display = '';
      password.placeholder = '🔒 كلمة المرور';
      password.autocomplete = 'current-password';
    }
    if (button) button.textContent = teacherMode ? '🔐 دخول المعلم' : 'تسجيل الدخول';
    setVisible('ownerCodeGroup', window.currentRole === 'owner');
  }

  window.login = async function () {
    if (window.currentRole === 'teacher') {
      var username = byId('usernameInput');
      var password = byId('passwordInput');
      if (!username || !password || !String(username.value || '').trim() || !password.value) {
        toast('اكتب اسم المستخدم وكلمة المرور.');
        return;
      }
      if (typeof window.loginTeacherWithBackend !== 'function') {
        toast('مسار دخول المعلم الآمن غير جاهز؛ حدّث الصفحة.');
        return;
      }
      return window.loginTeacherWithBackend(username.value, password.value);
    }
    if (typeof originalLogin === 'function') return originalLogin.apply(this, arguments);
  };

  window.selectRole = function (button, role) {
    if (typeof originalSelectRole === 'function') originalSelectRole.apply(this, arguments);
    else window.currentRole = role;
    updateLoginMode();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateLoginMode);
  else updateLoginMode();
  window.addEventListener('load', function () { setTimeout(updateLoginMode, 0); });
})();
