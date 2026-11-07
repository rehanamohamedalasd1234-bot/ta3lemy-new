/* Owner-only Supabase email-link session, isolated from anonymous chat sessions. */
(function () {
  'use strict';

  var OWNER_EMAIL = 'rehanamohamedalasd1234@gmail.com';
  var STORAGE_KEY = 'ta3lemy-owner-auth-v1';
  var client = null;

  function getClient() {
    var cfg = window.SUPABASE_CHAT_CONFIG || {};
    var sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function' || !cfg.url || !cfg.publishableKey) {
      throw new Error('تعذر تحميل خدمة التحقق. افتحي المنصة مع الإنترنت ثم أعيدي المحاولة.');
    }
    if (!client) {
      client = sdk.createClient(cfg.url, cfg.publishableKey, {
        auth: {
          storageKey: STORAGE_KEY,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      client.auth.onAuthStateChange(function () {
        try { window.dispatchEvent(new CustomEvent('ta3lemy-owner-auth-changed')); } catch (_) {}
      });
    }
    return client;
  }

  function redirectUrl() {
    var url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    return url.toString();
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
    if (message.indexOf('redirect') >= 0 || message.indexOf('url') >= 0 && message.indexOf('allow') >= 0) {
      return 'رابط العودة للمنصة غير مفعّل في إعدادات تسجيل الدخول؛ لم يتم إرسال رسالة.';
    }
    if (message.indexOf('rate limit') >= 0 || message.indexOf('too many') >= 0) {
      return 'تم طلب رابط مؤخرًا. انتظري قليلًا قبل المحاولة مرة أخرى.';
    }
    if (message.indexOf('smtp') >= 0 || message.indexOf('email address') >= 0) {
      return 'تعذر إرسال البريد من خدمة التحقق الحالية. راجعي إعدادات البريد في Supabase.';
    }
    return 'تعذر إرسال رابط التحقق. تأكدي من الاتصال وحاولي مرة أخرى.';
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

  async function requestMagicLink(statusElementId) {
    try {
      var last = 0;
      try { last = Number(sessionStorage.getItem('ta3lemy_owner_link_requested_at') || 0); } catch (_) {}
      if (Date.now() - last < 45000) {
        setStatus(statusElementId, 'انتظري قليلًا قبل طلب رابط آخر.', true);
        return false;
      }
      var supa = getClient();
      var result = await supa.auth.signInWithOtp({
        email: OWNER_EMAIL,
        options: {
          emailRedirectTo: redirectUrl(),
          shouldCreateUser: true
        }
      });
      if (result.error) throw result.error;
      try { sessionStorage.setItem('ta3lemy_owner_link_requested_at', String(Date.now())); } catch (_) {}
      setStatus(statusElementId, 'تم طلب رابط تحقق إلى بريد المالك. افتحي الرابط على الجهاز نفسه ثم ارجعي إلى المنصة.', false);
      return true;
    } catch (error) {
      console.error('[owner-auth] email link request failed', error && error.message || 'unknown error');
      setStatus(statusElementId, friendlyError(error), true);
      return false;
    }
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
    requestMagicLink: requestMagicLink,
    signOut: signOut
  };
})();
