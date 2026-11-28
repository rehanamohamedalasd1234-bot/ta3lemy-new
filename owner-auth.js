/* Owner-only Supabase password session, isolated from anonymous chat sessions. */
(function () {
  'use strict';

  var OWNER_EMAIL = 'hafezzaza98@gmail.com';
  var STORAGE_KEY = 'ta3lemy-owner-auth-v1';
  var client = null;
  var dialog = null;
  var pendingLogin = null;
  var pendingResolve = null;
  var activeStatusId = '';

  function getClient() {
    var cfg = window.SUPABASE_CHAT_CONFIG || {};
    var sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function' || !cfg.url || !cfg.publishableKey) {
      throw new Error('تعذر تحميل خدمة تسجيل الدخول. افتحي المنصة مع الإنترنت ثم أعيدي المحاولة.');
    }
    if (!client) {
      client = sdk.createClient(cfg.url, cfg.publishableKey, {
        auth: {
          storageKey: STORAGE_KEY,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      client.auth.onAuthStateChange(function () {
        try { window.dispatchEvent(new CustomEvent('ta3lemy-owner-auth-changed')); } catch (_) {}
      });
    }
    return client;
  }

  function setStatus(elementId, text, isError) {
    var element = elementId ? document.getElementById(elementId) : null;
    if (element) {
      element.textContent = text;
      element.style.color = isError ? '#B71C1C' : '#1B5E20';
    } else if (typeof window.showToast === 'function') {
      window.showToast(text);
    }
  }

  function friendlyError(error) {
    var message = String(error && error.message || '').toLowerCase();
    if (message.indexOf('invalid login credentials') >= 0 || message.indexOf('invalid_credentials') >= 0 || (message.indexOf('password') >= 0 && message.indexOf('invalid') >= 0)) {
      return 'كلمة المرور غير صحيحة. إذا لم تُضبط كلمة مرور لحساب المالك من قبل، يجب إعدادها مرة واحدة في Supabase.';
    }
    if (message.indexOf('email not confirmed') >= 0 || message.indexOf('not confirmed') >= 0) {
      return 'حساب المالك غير مفعّل في خدمة المصادقة. يلزم تفعيله مرة واحدة من إعدادات Supabase.';
    }
    if (message.indexOf('fetch') >= 0 || message.indexOf('network') >= 0 || message.indexOf('failed to fetch') >= 0) {
      return 'تعذر الاتصال بخدمة الدخول. تحققي من الإنترنت ثم أعيدي المحاولة.';
    }
    return 'تعذر تسجيل الدخول. تأكدي من كلمة المرور واتصال الإنترنت ثم حاولي مرة أخرى.';
  }

  async function getVerifiedSession() {
    var supa = getClient();
    var result = await supa.auth.getSession();
    if (result.error) throw result.error;
    var session = result.data && result.data.session;
    if (!session || !session.access_token) return null;
    var checked = await supa.auth.getUser(session.access_token);
    if (checked.error || !checked.data || !checked.data.user) return null;
    var user = checked.data.user;
    if (user.is_anonymous === true || String(user.email || '').trim().toLowerCase() !== OWNER_EMAIL || !user.email_confirmed_at) return null;
    return Object.assign({}, session, { user: user });
  }

  function ensureDialog() {
    if (dialog && document.body.contains(dialog.overlay)) return dialog;

    var overlay = document.createElement('div');
    overlay.id = 'hafezOwnerPasswordDialog';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'hafezOwnerPasswordTitle');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.58);box-sizing:border-box;';

    var box = document.createElement('section');
    box.style.cssText = 'width:min(100%,420px);box-sizing:border-box;background:#fff;border-radius:18px;padding:20px;box-shadow:0 18px 55px rgba(0,0,0,.25);font-family:inherit;direction:rtl;';

    var title = document.createElement('h2');
    title.id = 'hafezOwnerPasswordTitle';
    title.textContent = 'دخول إدارة المنصة';
    title.style.cssText = 'margin:0 0 9px;color:#17352d;font-size:20px;';

    var description = document.createElement('p');
    description.textContent = 'أدخلي كلمة مرور الإدارة للمتابعة. لن نرسل بريدًا أو رابط تحقق.';
    description.style.cssText = 'margin:0 0 14px;color:#526b57;font-size:14px;line-height:1.8;';

    var input = document.createElement('input');
    input.type = 'password';
    input.autocomplete = 'current-password';
    input.name = 'owner-management-password';
    input.placeholder = 'كلمة مرور الإدارة';
    input.setAttribute('aria-label', 'كلمة مرور الإدارة');
    input.style.cssText = 'display:block;width:100%;box-sizing:border-box;padding:13px;border:1px solid #b8c9bf;border-radius:10px;font:inherit;font-size:16px;direction:rtl;margin-bottom:12px;';

    var buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex;gap:9px;';

    var submit = document.createElement('button');
    submit.type = 'button';
    submit.textContent = 'دخول';
    submit.style.cssText = 'flex:1;border:0;border-radius:10px;padding:12px;background:#2E7D32;color:#fff;font:inherit;font-weight:700;cursor:pointer;';

    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'إلغاء';
    cancel.style.cssText = 'border:1px solid #cbd5e1;border-radius:10px;padding:12px;background:#fff;color:#334155;font:inherit;cursor:pointer;';

    var status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.style.cssText = 'min-height:20px;margin-top:10px;font-size:12px;line-height:1.7;';

    buttons.appendChild(submit);
    buttons.appendChild(cancel);
    box.appendChild(title);
    box.appendChild(description);
    box.appendChild(input);
    box.appendChild(buttons);
    box.appendChild(status);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    dialog = { overlay: overlay, input: input, submit: submit, cancel: cancel, status: status, busy: false };
    submit.addEventListener('click', submitPassword);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') { event.preventDefault(); submitPassword(); }
      if (event.key === 'Escape') { event.preventDefault(); closeDialog(false); }
    });
    cancel.addEventListener('click', function () { closeDialog(false); });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay && !dialog.busy) closeDialog(false);
    });
    return dialog;
  }

  function closeDialog(success) {
    if (dialog) {
      dialog.overlay.style.display = 'none';
      dialog.input.value = '';
      dialog.status.textContent = '';
      dialog.submit.disabled = false;
      dialog.busy = false;
    }
    var resolve = pendingResolve;
    pendingResolve = null;
    pendingLogin = null;
    if (resolve) resolve(!!success);
  }

  async function submitPassword() {
    if (!dialog || dialog.busy) return;
    var password = dialog.input.value;
    if (!password) {
      dialog.status.textContent = 'اكتبي كلمة مرور الإدارة أولًا.';
      dialog.status.style.color = '#B71C1C';
      dialog.input.focus();
      return;
    }

    dialog.busy = true;
    dialog.submit.disabled = true;
    dialog.status.textContent = 'جارٍ التحقق من صلاحية المالك…';
    dialog.status.style.color = '#455A64';
    setStatus(activeStatusId, 'جارٍ التحقق من كلمة مرور الإدارة…', false);

    try {
      var result = await getClient().auth.signInWithPassword({ email: OWNER_EMAIL, password: password });
      if (result.error) throw result.error;
      var session = await getVerifiedSession();
      if (!session) {
        try { await getClient().auth.signOut({ scope: 'local' }); } catch (_) {}
        throw new Error('OWNER_ACCOUNT_NOT_AUTHORIZED');
      }
      setStatus(activeStatusId, 'تم تسجيل الدخول للإدارة بنجاح.', false);
      closeDialog(true);
    } catch (error) {
      console.error('[owner-auth] password login failed', error && error.message || 'unknown error');
      var message = friendlyError(error);
      dialog.status.textContent = message;
      dialog.status.style.color = '#B71C1C';
      setStatus(activeStatusId, message, true);
      dialog.input.value = '';
      dialog.input.focus();
      dialog.busy = false;
      dialog.submit.disabled = false;
    }
  }

  async function requestPasswordLogin(statusElementId) {
    activeStatusId = statusElementId || '';
    try {
      var existing = await getVerifiedSession();
      if (existing) {
        setStatus(activeStatusId, 'جلسة إدارة المالك مفعّلة بالفعل على هذا الجهاز.', false);
        return true;
      }
    } catch (error) {
      console.warn('[owner-auth] existing session check failed', error && error.message || 'unknown error');
    }
    if (pendingLogin) return pendingLogin;
    var ui = ensureDialog();
    ui.input.value = '';
    ui.status.textContent = '';
    ui.overlay.style.display = 'flex';
    pendingLogin = new Promise(function (resolve) { pendingResolve = resolve; });
    window.setTimeout(function () { ui.input.focus(); }, 0);
    return pendingLogin;
  }

  async function signOut() {
    var supa = getClient();
    var result = await supa.auth.signOut({ scope: 'local' });
    if (result.error) throw result.error;
    return true;
  }

  window.HafezOwnerAuth = {
    ownerEmail: OWNER_EMAIL,
    getVerifiedSession: getVerifiedSession,
    requestPasswordLogin: requestPasswordLogin,
    signOut: signOut
  };
})();
