/* Ta3lemy feedback portal.
 * Student tickets are private through Supabase Auth + RLS. Owner replies require a
 * server-verified admin key; no admin credential is embedded in this public file.
 */
(function () {
  'use strict';

  var config = window.SUPABASE_CHAT_CONFIG || {};
  var client = null;
  var clientScope = '';
  var clientStorageKey = '';
  var adminKey = '';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
    });
  }

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else alert(message);
  }

  function appUser() { return window.currentUser || null; }

  function requireAppUser() {
    var user = appUser();
    if (!user || !user.uid) {
      toast('سجّلي الدخول أولًا لاستخدام الاقتراحات والشكاوى.');
      return null;
    }
    return user;
  }

  function clientForCurrentUser() {
    var sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function' || !config.url || !config.publishableKey) {
      throw new Error('تعذر تحميل خدمة الرسائل. افتحي المنصة مع اتصال بالإنترنت ثم حاولي مرة أخرى.');
    }
    var user = appUser();
    var scope = user && user.uid ? String(user.uid) : 'guest';
    if (client && clientScope !== scope) resetFeedbackSession();
    if (!client) {
      clientStorageKey = 'ta3lemy-feedback-session-' + encodeURIComponent(scope);
      client = sdk.createClient(config.url, config.publishableKey, {
        auth: {
          storageKey: clientStorageKey,
          storage: window.sessionStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      clientScope = scope;
    }
    return client;
  }

  function resetFeedbackSession() {
    var oldStorageKey = clientStorageKey;
    client = null;
    clientScope = '';
    clientStorageKey = '';
    adminKey = '';
    if (oldStorageKey && window.sessionStorage) {
      try { window.sessionStorage.removeItem(oldStorageKey); } catch (_) {}
    }
    var keyInput = document.getElementById('feedbackAdminKey');
    if (keyInput) keyInput.value = '';
    var inbox = document.getElementById('feedbackAdminInbox');
    if (inbox) inbox.innerHTML = '';
  }

  async function ensureIdentity(client) {
    var current = await client.auth.getSession();
    if (current.error) throw current.error;
    var session = current.data && current.data.session;
    if (session && session.user) return session.user;
    var signed = await client.auth.signInAnonymously();
    if (signed.error) throw signed.error;
    if (!signed.data || !signed.data.user) throw new Error('تعذر بدء جلسة آمنة للمتابعة.');
    return signed.data.user;
  }

  function formatCode(code) {
    return String(code || '').replace(/[^a-f0-9]/gi, '').toLowerCase().match(/.{1,4}/g)?.join('-') || '';
  }

  function dateLabel(value) {
    if (!value) return '—';
    var date = new Date(value);
    return isNaN(date.getTime()) ? '—' : date.toLocaleString('ar-EG');
  }

  function ensureScreen() {
    var existing = document.getElementById('feedbackScreen');
    if (existing) return existing;
    var screen = document.createElement('div');
    screen.id = 'feedbackScreen';
    screen.className = 'screen';
    screen.innerHTML = `
      <div class="top-bar" style="background:linear-gradient(135deg,#00695C,#26A69A);">
        <button class="icon-btn" onclick="goBack()" aria-label="رجوع">→</button>
        <div class="logo"><span>💡 الاقتراحات والشكاوى</span></div>
        <div style="width:42px;"></div>
      </div>
      <div class="content" style="padding-bottom:32px;">
        <div class="content-header" style="background:linear-gradient(135deg,#00695C,#26A69A);">
          <div class="content-header-title">رأيك يساعدنا نطوّر المنصة</div>
          <div class="content-header-sub">أرسلي اقتراحًا أو شكوى، وتابعي رد الإدارة من هنا</div>
        </div>
        <div class="feedback-privacy">🔒 رسالتك لا تظهر للمستخدمين الآخرين. لا تكتبي كلمة المرور أو رقم الهاتف أو بيانات شخصية في الرسالة.</div>
        <section class="feedback-card">
          <h3>إرسال رسالة جديدة</h3>
          <label for="feedbackCategory">نوع الرسالة</label>
          <select id="feedbackCategory" class="form-input">
            <option value="suggestion">اقتراح</option>
            <option value="complaint">شكوى</option>
          </select>
          <label for="feedbackSubject">عنوان مختصر</label>
          <input id="feedbackSubject" class="form-input" type="text" maxlength="120" placeholder="مثال: اقتراح لتطوير قسم المناهج">
          <label for="feedbackMessage">التفاصيل</label>
          <textarea id="feedbackMessage" class="form-input" rows="5" maxlength="3000" placeholder="اكتبي التفاصيل بوضوح (10 أحرف على الأقل)"></textarea>
          <div class="feedback-counter"><span id="feedbackMessageCount">0</span> / 3000</div>
          <div class="feedback-trap" aria-hidden="true"><label for="feedbackWebsite">اتركي هذا الحقل فارغًا</label><input id="feedbackWebsite" type="text" tabindex="-1" autocomplete="off"></div>
          <button id="feedbackSubmitBtn" class="btn-primary" onclick="window.submitFeedbackTicket()">إرسال للمالك</button>
          <div id="feedbackSubmitResult" aria-live="polite"></div>
        </section>
        <section class="feedback-card">
          <div class="feedback-section-heading"><h3>طلباتي وردود الإدارة</h3><button class="feedback-light-btn" onclick="window.loadMyFeedbackTickets()">تحديث</button></div>
          <p class="feedback-muted">تظهر الطلبات في علامة التبويب الحالية. احفظي رمز المتابعة لفتح الطلب بعد تسجيل الخروج أو من جهاز آخر.</p>
          <div id="feedbackMyTickets"><div class="feedback-muted">سجّلي الدخول لتحميل طلباتك.</div></div>
          <div class="feedback-lookup">
            <label for="feedbackLookupCode">فتح طلب برمز المتابعة</label>
            <div class="feedback-code-row"><input id="feedbackLookupCode" class="form-input" type="text" maxlength="40" placeholder="الصقي رمز المتابعة" dir="ltr"><button class="feedback-light-btn" onclick="window.lookupFeedbackTicket()">عرض</button></div>
            <div id="feedbackLookupResult" aria-live="polite"></div>
          </div>
        </section>
        <section id="feedbackOwnerSection" class="feedback-card" style="display:none;">
          <h3>📥 صندوق ردود الإدارة</h3>
          <p class="feedback-muted">هذا الصندوق يتطلب مفتاح الإدارة الخاص. لا تشاركيه مع الطلاب.</p>
          <label for="feedbackAdminKey">مفتاح إدارة الاقتراحات والشكاوى</label>
          <input id="feedbackAdminKey" class="form-input" type="password" maxlength="100" autocomplete="off" placeholder="أدخلي مفتاح الإدارة">
          <button class="feedback-light-btn" onclick="window.openFeedbackAdminInbox()">فتح صندوق الردود</button>
          <div id="feedbackAdminInbox" aria-live="polite"></div>
        </section>
      </div>`;
    document.body.appendChild(screen);
    var message = document.getElementById('feedbackMessage');
    if (message) message.addEventListener('input', function () {
      var counter = document.getElementById('feedbackMessageCount');
      if (counter) counter.textContent = String(message.value.length);
    });
    return screen;
  }

  function styleScreen() {
    if (document.getElementById('feedbackStyles')) return;
    var style = document.createElement('style');
    style.id = 'feedbackStyles';
    style.textContent = `
      #feedbackScreen .feedback-card{background:#fff;border:1px solid #e4eee8;border-radius:16px;padding:16px;margin:14px 0;box-shadow:0 4px 15px rgba(25,70,45,.07)}
      #feedbackScreen .feedback-card h3{margin:0 0 14px;color:#176b57;font-size:17px}
      #feedbackScreen .feedback-card label{display:block;margin:12px 0 6px;font-weight:700;color:#374151;font-size:14px}
      #feedbackScreen .feedback-privacy{background:#e8f5e9;color:#205b38;border-radius:12px;padding:12px;font-size:13px;line-height:1.7;margin:12px 0}
      #feedbackScreen .feedback-muted{color:#697386;font-size:13px;line-height:1.7;margin:8px 0}
      #feedbackScreen .feedback-counter{text-align:left;color:#87909c;font-size:12px;margin-top:-5px}
      #feedbackScreen .feedback-light-btn{border:0;border-radius:10px;background:#e6f4ef;color:#176b57;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer}
      #feedbackScreen .feedback-section-heading{display:flex;align-items:center;justify-content:space-between;gap:10px}
      #feedbackScreen .feedback-ticket{border:1px solid #e6ece9;border-right:4px solid #26a69a;border-radius:12px;padding:12px;margin:10px 0;background:#fbfdfc}
      #feedbackScreen .feedback-ticket h4{margin:0 0 6px;color:#203b34}
      #feedbackScreen .feedback-ticket p{white-space:pre-wrap;line-height:1.7;margin:8px 0;overflow-wrap:anywhere}
      #feedbackScreen .feedback-badge{display:inline-block;border-radius:20px;padding:4px 9px;font-size:12px;background:#fff4d6;color:#835b00}
      #feedbackScreen .feedback-badge.replied{background:#e5f5eb;color:#21613a}
      #feedbackScreen .feedback-reply{background:#edf7f1;border-radius:10px;padding:10px;margin-top:10px;color:#24593a;white-space:pre-wrap;line-height:1.7}
      #feedbackScreen .feedback-lookup{border-top:1px solid #edf0ef;margin-top:14px;padding-top:10px}
      #feedbackScreen .feedback-code-row{display:flex;gap:8px;align-items:center}
      #feedbackScreen .feedback-code-row input{min-width:0;flex:1}
      #feedbackScreen .feedback-code{display:inline-block;direction:ltr;font-family:monospace;letter-spacing:.05em;background:#f3f5f7;padding:8px 10px;border-radius:8px;overflow-wrap:anywhere}
      #feedbackScreen .feedback-code-result{background:#f1f8f3;border-radius:10px;padding:12px;margin-top:12px;line-height:1.8}
      #feedbackScreen .feedback-trap{position:absolute;right:-10000px;width:1px;height:1px;overflow:hidden}
      #feedbackScreen .feedback-admin-item{background:#fff;border:1px solid #e6ece9;border-radius:12px;padding:12px;margin:12px 0}
      #feedbackScreen .feedback-admin-item textarea{min-height:90px}
      @media(max-width:480px){#feedbackScreen .feedback-card{padding:13px}#feedbackScreen .feedback-code-row{align-items:stretch}#feedbackScreen .feedback-code-row button{padding-inline:10px}}
    `;
    document.head.appendChild(style);
  }

  window.openFeedbackCenter = function () {
    if (!requireAppUser()) return;
    var screen = ensureScreen();
    styleScreen();
    var ownerArea = document.getElementById('feedbackOwnerSection');
    if (ownerArea) ownerArea.style.display = window.currentRole === 'owner' ? 'block' : 'none';
    if (window.screenHistory) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen(screen.id);
    window.loadMyFeedbackTickets();
  };

  window.submitFeedbackTicket = async function () {
    var appAccount = requireAppUser();
    if (!appAccount) return;
    if (!navigator.onLine) return toast('إرسال ومتابعة الرسائل يحتاجان إلى اتصال بالإنترنت.');
    var category = document.getElementById('feedbackCategory').value;
    var subject = String(document.getElementById('feedbackSubject').value || '').trim();
    var message = String(document.getElementById('feedbackMessage').value || '').trim();
    var trap = String(document.getElementById('feedbackWebsite').value || '').trim();
    if (trap) return;
    if (subject.length < 3 || subject.length > 120) return toast('اكتبي عنوانًا من 3 إلى 120 حرفًا.');
    if (message.length < 10 || message.length > 3000) return toast('اكتبي تفاصيل من 10 إلى 3000 حرف.');
    if (category !== 'suggestion' && category !== 'complaint') return toast('اختاري نوع الرسالة.');
    var button = document.getElementById('feedbackSubmitBtn');
    var output = document.getElementById('feedbackSubmitResult');
    if (button) button.disabled = true;
    if (output) output.innerHTML = '<p class="feedback-muted">جارٍ إرسال رسالتك بأمان…</p>';
    try {
      var client = clientForCurrentUser();
      await ensureIdentity(client);
      var result = await client.rpc('feedback_submit', {
        p_category: category,
        p_subject: subject,
        p_message: message,
        p_honeypot: trap
      });
      if (result.error) throw result.error;
      var code = result.data && result.data.followup_code;
      if (!/^[a-f0-9]{32}$/i.test(String(code || ''))) throw new Error('No follow-up code returned');
      if (output) output.innerHTML = '<div class="feedback-code-result"><b>وصلت رسالتك للإدارة.</b><br>رمز المتابعة الخاص بهذا الطلب — احتفظي به ولا تشاركيه:<br><span class="feedback-code" id="feedbackNewCode">' + escapeHtml(formatCode(code)) + '</span> <button class="feedback-light-btn" onclick="window.copyFeedbackCode(\'' + code + '\')">نسخ الرمز</button></div>';
      var subjectInput = document.getElementById('feedbackSubject'); if (subjectInput) subjectInput.value = '';
      var messageInput = document.getElementById('feedbackMessage'); if (messageInput) messageInput.value = '';
      var counter = document.getElementById('feedbackMessageCount'); if (counter) counter.textContent = '0';
      toast('تم إرسال رسالتك بنجاح.');
      window.loadMyFeedbackTickets();
    } catch (error) {
      console.error('[feedback] submit failed', error);
      if (output) output.innerHTML = '<p class="feedback-muted">تعذر الإرسال الآن. تأكدي من الاتصال ثم حاولي مرة أخرى.</p>';
      toast('تعذر إرسال الرسالة. تحققي من الاتصال وحاولي مرة أخرى.');
    } finally {
      if (button) button.disabled = false;
    }
  };

  function ticketCard(ticket) {
    var categoryLabel = ticket.category === 'complaint' ? 'شكوى' : 'اقتراح';
    var replied = !!ticket.admin_reply || ticket.status === 'replied' || ticket.status === 'closed';
    var statusLabel = ticket.status === 'closed' ? 'مغلقة' : (replied ? 'تم الرد' : 'بانتظار الرد');
    return '<article class="feedback-ticket"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><h4>' + escapeHtml(categoryLabel + ': ' + ticket.subject) + '</h4><span class="feedback-badge' + (replied ? ' replied' : '') + '">' + escapeHtml(statusLabel) + '</span></div><small class="feedback-muted">' + escapeHtml(dateLabel(ticket.created_at)) + '</small><p>' + escapeHtml(ticket.message) + '</p>' + (ticket.admin_reply ? '<div class="feedback-reply"><b>رد الإدارة:</b><br>' + escapeHtml(ticket.admin_reply) + (ticket.replied_at ? '<br><small>' + escapeHtml(dateLabel(ticket.replied_at)) + '</small>' : '') + '</div>' : '') + '</article>';
  }

  window.loadMyFeedbackTickets = async function () {
    var target = document.getElementById('feedbackMyTickets');
    if (!target) return;
    var appAccount = requireAppUser();
    if (!appAccount) return;
    target.innerHTML = '<p class="feedback-muted">جارٍ تحميل طلباتك…</p>';
    try {
      var client = clientForCurrentUser();
      await ensureIdentity(client);
      var result = await client.from('feedback_tickets')
        .select('id,category,subject,message,status,admin_reply,created_at,replied_at')
        .order('created_at', { ascending: false }).limit(100);
      if (result.error) throw result.error;
      if (!result.data || !result.data.length) {
        target.innerHTML = '<p class="feedback-muted">لا توجد رسائل سابقة. يمكنك إرسال أول اقتراح أو شكوى من النموذج أعلاه.</p>';
        return;
      }
      target.innerHTML = result.data.map(ticketCard).join('');
    } catch (error) {
      console.error('[feedback] list failed', error);
      target.innerHTML = '<p class="feedback-muted">تعذر تحميل الطلبات. حدّثي الصفحة وحاولي مرة أخرى.</p>';
    }
  };

  window.copyFeedbackCode = async function (code) {
    var value = String(code || '').replace(/[^a-f0-9]/gi, '').toLowerCase();
    try {
      await navigator.clipboard.writeText(value);
      toast('تم نسخ رمز المتابعة. احتفظي به في مكان آمن.');
    } catch (_) {
      var field = document.createElement('textarea');
      field.value = value; field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.appendChild(field); field.select();
      try { document.execCommand('copy'); toast('تم نسخ رمز المتابعة.'); }
      catch (error) { toast('انسخي الرمز يدويًا واحتفظي به.'); }
      field.remove();
    }
  };

  window.lookupFeedbackTicket = async function () {
    var input = document.getElementById('feedbackLookupCode');
    var target = document.getElementById('feedbackLookupResult');
    var code = String(input && input.value || '').replace(/[^a-f0-9]/gi, '').toLowerCase();
    if (!target) return;
    if (!/^[a-f0-9]{32}$/.test(code)) return toast('رمز المتابعة غير مكتمل. أدخلي الرمز المكوّن من 32 خانة.');
    target.innerHTML = '<p class="feedback-muted">جارٍ البحث عن الطلب…</p>';
    try {
      var client = clientForCurrentUser();
      await ensureIdentity(client);
      var result = await client.rpc('feedback_find_by_code', { p_code: code });
      if (result.error) throw result.error;
      if (!result.data || !result.data.id) {
        target.innerHTML = '<p class="feedback-muted">لم نعثر على طلب بهذا الرمز. تأكدي من كتابته كما ظهر بعد الإرسال.</p>';
        return;
      }
      target.innerHTML = ticketCard(result.data);
    } catch (error) {
      console.error('[feedback] lookup failed', error);
      target.innerHTML = '<p class="feedback-muted">تعذر البحث الآن. تحققي من الاتصال وحاولي مرة أخرى.</p>';
    }
  };

  window.openFeedbackAdminInbox = async function () {
    if (window.currentRole !== 'owner') return toast('صندوق الردود للمالك فقط.');
    var input = document.getElementById('feedbackAdminKey');
    var key = String(input && input.value || adminKey).trim();
    var target = document.getElementById('feedbackAdminInbox');
    if (!key) return toast('أدخلي مفتاح إدارة الاقتراحات والشكاوى.');
    if (!target) return;
    target.innerHTML = '<p class="feedback-muted">جارٍ التحقق وتحميل الرسائل…</p>';
    try {
      var client = clientForCurrentUser();
      await ensureIdentity(client);
      var result = await client.rpc('feedback_admin_list', { p_admin_key: key });
      if (result.error) throw result.error;
      adminKey = key;
      target.innerHTML = renderAdminTickets(result.data || []);
      toast('تم فتح صندوق الردود.');
    } catch (error) {
      console.error('[feedback] admin authentication failed', error);
      target.innerHTML = '<p class="feedback-muted">تعذر فتح الصندوق. تأكدي من مفتاح الإدارة ثم أعيدي المحاولة.</p>';
    }
  };

  function renderAdminTickets(tickets) {
    if (!tickets.length) return '<p class="feedback-muted">لا توجد اقتراحات أو شكاوى حتى الآن.</p>';
    return tickets.map(function (ticket) {
      var categoryLabel = ticket.category === 'complaint' ? 'شكوى' : 'اقتراح';
      var replied = !!ticket.admin_reply || ticket.status === 'replied' || ticket.status === 'closed';
      return '<article class="feedback-admin-item"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>' + escapeHtml(categoryLabel + ': ' + ticket.subject) + '</b><span class="feedback-badge' + (replied ? ' replied' : '') + '">' + (replied ? 'تم الرد' : 'جديد') + '</span></div><small class="feedback-muted">' + escapeHtml(dateLabel(ticket.created_at)) + '</small><p style="white-space:pre-wrap;line-height:1.7;overflow-wrap:anywhere">' + escapeHtml(ticket.message) + '</p>' + (ticket.admin_reply ? '<div class="feedback-reply"><b>الرد الحالي:</b><br>' + escapeHtml(ticket.admin_reply) + '</div>' : '') + '<label for="feedbackReply_' + escapeHtml(ticket.id) + '">اكتبي الرد</label><textarea id="feedbackReply_' + escapeHtml(ticket.id) + '" class="form-input" maxlength="4000" placeholder="سيظهر ردك لصاحب الطلب فقط">' + escapeHtml(ticket.admin_reply || '') + '</textarea><button class="feedback-light-btn" onclick="window.replyToFeedbackTicket(\'' + escapeHtml(ticket.id) + '\')">حفظ الرد</button></article>';
    }).join('');
  }

  window.replyToFeedbackTicket = async function (ticketId) {
    if (window.currentRole !== 'owner') return toast('الرد متاح للمالك فقط.');
    if (!adminKey) return toast('أعيدي فتح صندوق الردود بمفتاح الإدارة.');
    var input = document.getElementById('feedbackReply_' + ticketId);
    var reply = String(input && input.value || '').trim();
    if (reply.length < 2 || reply.length > 4000) return toast('اكتبي ردًا من حرفين إلى 4000 حرف.');
    try {
      var client = clientForCurrentUser();
      await ensureIdentity(client);
      var result = await client.rpc('feedback_admin_reply', {
        p_admin_key: adminKey,
        p_ticket_id: ticketId,
        p_reply: reply
      });
      if (result.error) throw result.error;
      toast('تم حفظ الرد وسيظهر لصاحب الرسالة فقط.');
      window.openFeedbackAdminInbox();
    } catch (error) {
      console.error('[feedback] reply failed', error);
      toast('تعذر حفظ الرد. أعيدي فتح صندوق الإدارة وحاولي مرة أخرى.');
    }
  };

  function addHomeEntry() {
    var tools = document.querySelector('#homeScreen .tools-grid');
    if (tools && !document.getElementById('feedbackHomeEntry')) {
      var entry = document.createElement('button');
      entry.type = 'button'; entry.id = 'feedbackHomeEntry'; entry.className = 'tool-btn';
      entry.style.cssText = 'border:0;background:transparent;font-family:inherit;cursor:pointer';
      entry.innerHTML = '<span class="tool-icon" style="background:#E0F2F1;color:#00796B;">💡</span><span class="tool-label">اقتراحات وشكاوى</span>';
      entry.onclick = window.openFeedbackCenter;
      tools.appendChild(entry);
    }
  }

  var previousLogout = window.logout;
  if (typeof previousLogout === 'function') {
    window.logout = function () {
      var before = appUser();
      var previousResult = previousLogout.apply(this, arguments);
      var after = appUser();
      if (!after || !before || after.uid !== before.uid) {
        resetFeedbackSession();
        var keyInput = document.getElementById('feedbackAdminKey');
        if (keyInput) keyInput.value = '';
        var inbox = document.getElementById('feedbackAdminInbox');
        if (inbox) inbox.innerHTML = '';
      }
      return previousResult;
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addHomeEntry);
  else addHomeEntry();
  window.addEventListener('load', addHomeEntry);
})();
