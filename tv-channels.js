/* Live TV directory. Restricted broadcasters open their official destinations; only permitted streams use the in-app player. */
(function () {
  'use strict';

  var config = window.SUPABASE_CHAT_CONFIG || {};
  var publicClient = null;
  var channels = [];
  var verifiedOwnerSession = null;
  var managerOpen = false;
  var selectedCategory = 'all';
  var categories = {
    all: 'الكل',
    sports: 'رياضة',
    education: 'تعليم',
    custom: 'محطاتي الخاصة'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function ownerRole() {
    var value = '';
    try { value = typeof currentRole !== 'undefined' ? currentRole : ''; } catch (_) {}
    value = String(value || window.currentRole || (window.currentUser && window.currentUser.role) || '').toLowerCase();
    return value === 'owner';
  }

  function notify(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.log('[tv-channels]', message);
  }

  function safeHttps(value) {
    try {
      var url = new URL(String(value || '').trim());
      if (url.protocol !== 'https:' || url.username || url.password || url.href.length > 2048) return '';
      return url.href;
    } catch (_) { return ''; }
  }

  function getPublicClient() {
    var sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function' || !config.url || !config.publishableKey) {
      throw new Error('تعذر تحميل خدمة القنوات. افتحي المنصة مع الإنترنت ثم أعيدي المحاولة.');
    }
    if (!publicClient) {
      publicClient = sdk.createClient(config.url, config.publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
    }
    return publicClient;
  }

  function ensureScreen() {
    var screen = document.getElementById('tvChannelsScreen');
    if (screen) return screen;
    screen = document.createElement('div');
    screen.id = 'tvChannelsScreen';
    screen.className = 'screen';
    var styles = document.createElement('style');
    styles.id = 'tvChannelStyles';
    styles.textContent = `
      #tvChannelsScreen .tv-channel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
      #tvChannelsScreen .tv-channel-card{position:relative;overflow:hidden;border:1px solid #dce9e7;border-radius:20px;background:linear-gradient(145deg,#fff 0%,#fbfefd 100%);box-shadow:0 7px 22px rgba(0,77,64,.08);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
      #tvChannelsScreen .tv-channel-card:before{content:"";position:absolute;inset:0 0 auto;height:4px;background:linear-gradient(90deg,#00796b,#4db6ac)}
      #tvChannelsScreen .tv-channel-card[data-category="sports"]:before{background:linear-gradient(90deg,#d84343,#ffb74d)}
      #tvChannelsScreen .tv-channel-card[data-category="education"]:before{background:linear-gradient(90deg,#3949ab,#26a69a)}
      #tvChannelsScreen .tv-channel-card[data-category="custom"]:before{background:linear-gradient(90deg,#00897b,#80cbc4)}
      #tvChannelsScreen .tv-channel-card:hover{transform:translateY(-3px);border-color:#80cbc4;box-shadow:0 12px 28px rgba(0,77,64,.14)}
      #tvChannelsScreen .tv-card-open{display:block;width:100%;padding:17px 16px 14px;border:0;background:transparent;color:inherit;text-align:right;font:inherit;cursor:pointer}
      #tvChannelsScreen .tv-card-open:focus-visible{outline:3px solid #26a69a;outline-offset:-4px;border-radius:20px}
      #tvChannelsScreen .tv-card-head{display:flex;align-items:center;gap:13px;min-height:76px}
      #tvChannelsScreen .tv-logo-box{position:relative;display:grid;place-items:center;flex:0 0 76px;width:76px;height:76px;overflow:hidden;border:1px solid #edf2f1;border-radius:19px;background:#fff;box-shadow:0 4px 12px rgba(38,50,56,.08)}
      #tvChannelsScreen .tv-logo-box img{display:block;width:100%;height:100%;padding:5px;box-sizing:border-box;object-fit:contain;background:#fff}
      #tvChannelsScreen .tv-logo-fallback{display:none;position:absolute;inset:0;place-items:center;background:linear-gradient(145deg,#e0f2f1,#b2dfdb);color:#00695c;font-size:29px}
      #tvChannelsScreen .tv-brand-bein{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(145deg,#58258b,#32145b);color:#fff;font-family:Arial,sans-serif;font-weight:800;letter-spacing:-1px}
      #tvChannelsScreen .tv-brand-bein strong{font-size:25px;line-height:1}
      #tvChannelsScreen .tv-brand-bein small{margin-top:4px;font-size:9px;letter-spacing:3px}
      #tvChannelsScreen .tv-channel-info{min-width:0;flex:1}
      #tvChannelsScreen .tv-category-pill{display:inline-flex;align-items:center;gap:5px;margin-bottom:6px;padding:4px 9px;border-radius:99px;background:#eef7f5;color:#28766d;font-size:10px;font-weight:800}
      #tvChannelsScreen .tv-channel-name{margin:0;color:#203a37;font-size:16px;font-weight:800;line-height:1.45;overflow-wrap:anywhere}
      #tvChannelsScreen .tv-channel-desc{margin:13px 0 0;color:#61716f;font-size:12px;line-height:1.75}
      #tvChannelsScreen .tv-card-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:15px;padding-top:11px;border-top:1px solid #edf2f1}
      #tvChannelsScreen .tv-card-cta{display:inline-flex;align-items:center;gap:7px;color:#00796b;font-size:12px;font-weight:800}
      #tvChannelsScreen .tv-card-cta-icon{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#e0f2f1;font-size:12px}
      #tvChannelsScreen .tv-card-source{color:#879592;font-size:10px;font-weight:700}
      #tvChannelsScreen .tv-card-admin{display:flex;justify-content:flex-end;padding:0 15px 13px}
      #tvChannelsScreen .tv-card-delete{border:1px solid #ffdde0;border-radius:9px;padding:6px 9px;background:#fff8f8;color:#b71c1c;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
      @media(max-width:520px){#tvChannelsScreen .tv-channel-grid{grid-template-columns:1fr;gap:11px}#tvChannelsScreen .tv-card-open{padding:14px}#tvChannelsScreen .tv-logo-box{flex-basis:68px;width:68px;height:68px}}
      @media(prefers-reduced-motion:reduce){#tvChannelsScreen .tv-channel-card{transition:none}}
    `;
    screen.innerHTML = `
      <div class="top-bar" style="background:linear-gradient(135deg,#00695C,#26A69A);">
        <button class="icon-btn" onclick="goBack()" aria-label="رجوع">→</button>
        <div class="logo"><span>📺 قنوات مباشرة</span></div>
        <button class="icon-btn" id="tvManageToggle" type="button" onclick="toggleTvManage()" aria-label="إدارة القنوات" title="إدارة القنوات" style="display:none;">⚙️</button>
      </div>
      <div class="content" style="padding:14px;max-width:900px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#e7f5f2,#f4fbf9);border:1px solid #cce6e1;border-radius:16px;padding:13px 15px;margin-bottom:14px;color:#24524D;font-size:13px;line-height:1.8;">
          اختر بطاقة القناة لبدء المشاهدة أو فتح مصدرها الرسمي. المشاهدة داخل المنصة متاحة للمصادر المسموح بتضمينها.
        </div>
        <div id="tvOwnerPanel" style="display:none;"></div>
        <div id="tvCategoryFilters" style="display:flex;gap:7px;overflow:auto;padding:2px 1px 10px;margin-bottom:4px;"></div>
        <div id="tvChannelStatus" role="status" style="padding:12px;color:#607D8B;text-align:center;">جاري تحميل القنوات…</div>
        <div id="tvChannelList" class="tv-channel-grid"></div>
      </div>`;
    screen.appendChild(styles);
    document.body.appendChild(screen);
    renderFilters();
    return screen;
  }

  function renderFilters() {
    var host = document.getElementById('tvCategoryFilters');
    if (!host) return;
    host.innerHTML = Object.keys(categories).map(function (key) {
      var active = selectedCategory === key;
      return '<button type="button" data-tv-filter="' + esc(key) + '" style="white-space:nowrap;border:1px solid ' + (active ? '#00796B' : '#CFD8DC') + ';border-radius:20px;padding:8px 13px;background:' + (active ? '#00796B' : '#fff') + ';color:' + (active ? '#fff' : '#455A64') + ';font:inherit;font-size:12px;font-weight:700;">' + esc(categories[key]) + '</button>';
    }).join('');
    host.querySelectorAll('[data-tv-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedCategory = button.getAttribute('data-tv-filter') || 'all';
        renderFilters();
        renderChannels();
      });
    });
  }

  function categoryIcon(category) {
    return category === 'sports' ? '🏆' : category === 'education' ? '🎓' : '📡';
  }

  function defaultLogo(channel) {
    var name = String(channel.name || '').toLowerCase();
    if (name.indexOf('on time') !== -1 || name.indexOf('on sport') !== -1 || name.indexOf('أون') !== -1) return './assets/tv-channels/onsport.webp';
    if (name.indexOf('al ahly') !== -1 || name.indexOf('الأهلي') !== -1) return './assets/tv-channels/alahly-tv.webp';
    if (name.indexOf('madrasetna') !== -1 || name.indexOf('مدرستنا') !== -1) return './assets/tv-channels/madrasetna.webp';
    return '';
  }

  function logoMarkup(channel) {
    var customLogo = safeHttps(channel.logo_url);
    var src = customLogo || defaultLogo(channel);
    var name = String(channel.name || '').toLowerCase();
    if (src) {
      return '<div class="tv-logo-box"><img data-tv-logo src="' + esc(src) + '" alt="شعار ' + esc(channel.name) + '" loading="lazy" decoding="async"><span class="tv-logo-fallback" aria-hidden="true">' + categoryIcon(channel.category) + '</span></div>';
    }
    if (name.indexOf('bein') !== -1 || name.indexOf('بي إن') !== -1 || name.indexOf('بين سبورت') !== -1) {
      return '<div class="tv-logo-box" aria-label="beIN SPORTS"><span class="tv-brand-bein"><strong>beIN</strong><small>SPORTS</small></span></div>';
    }
    return '<div class="tv-logo-box" aria-hidden="true"><span class="tv-logo-fallback" style="display:grid;position:static;">' + categoryIcon(channel.category) + '</span></div>';
  }

  function safeYoutubeId(value) {
    try {
      var url = new URL(String(value || ''));
      var host = url.hostname.toLowerCase().replace(/^www\./, '');
      if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'youtu.be') return '';
      var id = host === 'youtu.be' ? url.pathname.split('/').filter(Boolean)[0] : url.searchParams.get('v');
      if (!id) {
        var match = url.pathname.match(/^\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{11})(?:\/|$)/);
        id = match && match[1];
      }
      return /^[A-Za-z0-9_-]{11}$/.test(String(id || '')) ? String(id) : '';
    } catch (_) { return ''; }
  }

  function channelActionMarkup(channel) {
    var behavior = String(channel.behavior || 'external');
    var url = safeHttps(channel.watch_url);
    if (!url) return '<span class="tv-card-cta" style="color:#B71C1C;">المصدر غير متاح</span>';
    if (behavior === 'youtube' || behavior === 'hls' || behavior === 'video') {
      return '<span class="tv-card-cta"><span class="tv-card-cta-icon">▶</span>مشاهدة داخل المنصة</span><span class="tv-card-source">مشغّل داخلي</span>';
    }
    return '<span class="tv-card-cta"><span class="tv-card-cta-icon">↗</span>فتح القناة</span><span class="tv-card-source">المصدر الرسمي</span>';
  }

  function renderChannels() {
    var host = document.getElementById('tvChannelList');
    var status = document.getElementById('tvChannelStatus');
    if (!host || !status) return;
    var shown = channels.filter(function (channel) {
      return channel.is_active !== false && (selectedCategory === 'all' || channel.category === selectedCategory);
    });
    if (!shown.length) {
      host.innerHTML = '';
      status.textContent = channels.length ? 'لا توجد قنوات في هذا التصنيف.' : 'لا توجد قنوات متاحة الآن.';
      return;
    }
    status.textContent = 'اضغط على شعار القناة أو بطاقتها لفتحها.';
    host.innerHTML = shown.map(function (channel) {
      var logo = logoMarkup(channel);
      var canDelete = ownerRole() && !!verifiedOwnerSession;
      return '<article class="tv-channel-card" data-category="' + esc(channel.category || '') + '">' +
        '<button class="tv-card-open" type="button" data-tv-open="' + esc(channel.id) + '" aria-label="فتح ' + esc(channel.name) + '">' +
          '<div class="tv-card-head">' + logo + '<div class="tv-channel-info"><span class="tv-category-pill">' + categoryIcon(channel.category) + ' ' + esc(categories[channel.category] || 'قناة') + '</span><h3 class="tv-channel-name">' + esc(channel.name) + '</h3></div></div>' +
          (channel.description ? '<p class="tv-channel-desc">' + esc(channel.description) + '</p>' : '') +
          '<div class="tv-card-footer">' + channelActionMarkup(channel) + '</div>' +
        '</button>' +
        (canDelete ? '<div class="tv-card-admin"><button class="tv-card-delete" type="button" data-tv-delete="' + esc(channel.id) + '">حذف القناة</button></div>' : '') +
        '</article>';
    }).join('');
    host.querySelectorAll('[data-tv-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        var item = channels.find(function (channel) { return String(channel.id) === String(button.getAttribute('data-tv-open')); });
        if (!item) return;
        if (['youtube', 'hls', 'video'].indexOf(String(item.behavior || 'external')) !== -1) {
          openPlayer(item);
          return;
        }
        var url = safeHttps(item.watch_url);
        if (!url) { notify('مصدر القناة غير متاح حاليًا.'); return; }
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });
    host.querySelectorAll('[data-tv-logo]').forEach(function (image) {
      image.addEventListener('error', function () {
        image.hidden = true;
        var fallback = image.parentElement && image.parentElement.querySelector('.tv-logo-fallback');
        if (fallback) fallback.style.display = 'grid';
      });
    });
    host.querySelectorAll('[data-tv-delete]').forEach(function (button) {
      button.addEventListener('click', function () {
        var item = channels.find(function (channel) { return String(channel.id) === String(button.getAttribute('data-tv-delete')); });
        if (item) deleteChannel(item);
      });
    });
  }

  async function loadChannels() {
    var status = document.getElementById('tvChannelStatus');
    if (status) status.textContent = 'جاري تحميل القنوات…';
    try {
      var result = await getPublicClient().from('tv_channels')
        .select('id,name,category,behavior,watch_url,logo_url,description,sort_order,is_active')
        .eq('is_active', true).order('sort_order', { ascending: true }).order('name', { ascending: true }).limit(100);
      if (result.error) throw result.error;
      channels = Array.isArray(result.data) ? result.data : [];
      verifiedOwnerSession = null;
      if (ownerRole() && window.HafezOwnerAuth) {
        try { verifiedOwnerSession = await window.HafezOwnerAuth.getVerifiedSession(); } catch (_) {}
      }
      renderOwnerPanel();
      renderChannels();
    } catch (error) {
      console.error('[tv-channels] load failed', error && error.message || 'unknown error');
      channels = [];
      if (status) status.textContent = 'تعذر تحميل القنوات الآن. تحققي من الإنترنت ثم أعيدي المحاولة.';
      renderChannels();
    }
  }

  function ownerPanelMarkup() {
    if (!ownerRole()) return '';
    if (!verifiedOwnerSession) {
      return '<section style="background:#E8F5E9;border:1px solid #C8E6C9;border-radius:15px;padding:14px;margin-bottom:12px;">' +
        '<div style="font-weight:800;color:#1B5E20;margin-bottom:6px;">🔐 إدارة القنوات — تحقق المالك</div>' +
        '<div style="font-size:12px;color:#455A64;line-height:1.8;margin-bottom:10px;">سيُرسل رابط دخول إلى بريد المالك المعتمد. بعد فتحه، عودي إلى المنصة على الجهاز نفسه. لن تمنح صفة الحساب الظاهرة في التطبيق صلاحيات إدارة بمفردها.</div>' +
        '<button type="button" id="tvOwnerLoginBtn" style="border:0;border-radius:10px;padding:10px 14px;background:#2E7D32;color:#fff;font:inherit;font-weight:700;">📧 إرسال رابط التحقق</button>' +
        '<div id="tvOwnerAuthStatus" role="status" style="font-size:12px;line-height:1.7;margin-top:8px;"></div></section>';
    }
    return '<section style="background:#E8F5E9;border:1px solid #C8E6C9;border-radius:15px;padding:14px;margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;"><div style="font-weight:800;color:#1B5E20;">✅ تم التحقق من بريد المالك</div><button type="button" id="tvOwnerLogoutBtn" style="border:1px solid #A5D6A7;border-radius:9px;padding:7px 10px;background:#fff;color:#1B5E20;font:inherit;font-size:12px;">تسجيل خروج الإدارة</button></div>' +
      '<form id="tvChannelForm" style="display:grid;gap:8px;margin-top:12px;">' +
        '<label style="font-size:12px;font-weight:700;color:#455A64;">اسم القناة أو المحطة<input name="name" required maxlength="100" autocomplete="off" placeholder="مثال: محطتي التعليمية" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"></label>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
          '<label style="font-size:12px;font-weight:700;color:#455A64;">التصنيف<select name="category" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"><option value="custom">محطة خاصة</option><option value="sports">رياضة</option><option value="education">تعليم</option></select></label>' +
          '<label style="font-size:12px;font-weight:700;color:#455A64;">طريقة العرض<select name="behavior" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"><option value="external">رابط رسمي خارجي</option><option value="youtube">فيديو YouTube مسموح تضمينه</option><option value="hls">بث HLS أملكه أو أملك إذنًا به</option><option value="video">ملف MP4/WEBM أملكه</option></select></label>' +
        '</div>' +
        '<label style="font-size:12px;font-weight:700;color:#455A64;">رابط HTTPS<input name="watch_url" type="url" required maxlength="2048" placeholder="https://..." style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;direction:ltr;text-align:left;"></label>' +
        '<label style="font-size:12px;font-weight:700;color:#455A64;">رابط شعار اختياري<input name="logo_url" type="url" maxlength="2048" placeholder="https://..." style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;direction:ltr;text-align:left;"></label>' +
        '<label style="font-size:12px;font-weight:700;color:#455A64;">وصف مختصر<textarea name="description" maxlength="240" rows="2" placeholder="مثال: بث محاضرات قناتك الخاصة" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;resize:vertical;"></textarea></label>' +
        '<div style="background:#FFF8E1;color:#6D4C41;border-radius:9px;padding:9px;font-size:11px;line-height:1.8;">أضيفي فقط بثًا تملكينه أو لديك إذن صريح لاستخدامه. قنوات beIN وON Time ومدرستنا تفتح من مصادرها الرسمية؛ لا نعيد بثها أو نتجاوز الاشتراك أو قيود التضمين.</div>' +
        '<button type="submit" style="border:0;border-radius:10px;padding:11px;background:#2E7D32;color:#fff;font:inherit;font-weight:800;">＋ إضافة قناة / محطة</button>' +
        '<div id="tvChannelFormStatus" role="status" style="font-size:12px;line-height:1.7;"></div>' +
      '</form></section>';
  }

  function renderOwnerPanel() {
    var panel = document.getElementById('tvOwnerPanel');
    var toggle = document.getElementById('tvManageToggle');
    if (!panel || !toggle) return;
    if (!ownerRole()) {
      panel.style.display = 'none';
      toggle.style.display = 'none';
      return;
    }
    toggle.style.display = 'flex';
    toggle.setAttribute('aria-expanded', managerOpen ? 'true' : 'false');
    panel.style.display = managerOpen ? 'block' : 'none';
    panel.innerHTML = managerOpen ? ownerPanelMarkup() : '';
    var loginButton = document.getElementById('tvOwnerLoginBtn');
    if (loginButton) loginButton.addEventListener('click', function () {
      if (window.HafezOwnerAuth) window.HafezOwnerAuth.requestMagicLink('tvOwnerAuthStatus');
    });
    var logoutButton = document.getElementById('tvOwnerLogoutBtn');
    if (logoutButton) logoutButton.addEventListener('click', async function () {
      try {
        await window.HafezOwnerAuth.signOut();
        verifiedOwnerSession = null;
        renderOwnerPanel();
        renderChannels();
        notify('تم تسجيل خروج الإدارة.');
      } catch (_) { notify('تعذر تسجيل الخروج الآن.'); }
    });
    var form = document.getElementById('tvChannelForm');
    if (form) form.addEventListener('submit', addChannel);
  }

  async function ownerSession() {
    if (!ownerRole() || !window.HafezOwnerAuth) return null;
    verifiedOwnerSession = await window.HafezOwnerAuth.getVerifiedSession();
    if (!verifiedOwnerSession) throw new Error('أرسلي رابط التحقق إلى بريد المالك وافتحيه أولًا.');
    return verifiedOwnerSession;
  }

  async function adminRequest(payload) {
    var session = await ownerSession();
    var base = String(config.url || '').replace(/\/$/, '');
    var response = await fetch(base + '/functions/v1/tv-channel-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.publishableKey,
        'Authorization': 'Bearer ' + session.access_token
      },
      body: JSON.stringify(payload)
    });
    var body;
    try { body = await response.json(); } catch (_) { body = {}; }
    if (!response.ok || !body.ok) throw new Error(body.error || 'تعذر تنفيذ العملية.');
    return body.data;
  }

  async function addChannel(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var data = new FormData(form);
    var status = document.getElementById('tvChannelFormStatus');
    var input = {
      action: 'add',
      name: String(data.get('name') || '').trim(),
      category: String(data.get('category') || 'custom'),
      behavior: String(data.get('behavior') || 'external'),
      watch_url: String(data.get('watch_url') || '').trim(),
      logo_url: String(data.get('logo_url') || '').trim(),
      description: String(data.get('description') || '').trim()
    };
    if (!input.name || !safeHttps(input.watch_url) || input.logo_url && !safeHttps(input.logo_url)) {
      if (status) { status.textContent = 'أدخلي اسمًا ورابط HTTPS صالحًا؛ ورابط الشعار اختياري ويجب أن يكون HTTPS.'; status.style.color = '#B71C1C'; }
      return;
    }
    if (status) { status.textContent = 'جاري إضافة المحطة…'; status.style.color = '#455A64'; }
    try {
      await adminRequest(input);
      form.reset();
      if (status) { status.textContent = 'تمت الإضافة بنجاح.'; status.style.color = '#1B5E20'; }
      await loadChannels();
    } catch (error) {
      if (status) { status.textContent = error.message || 'تعذرت الإضافة.'; status.style.color = '#B71C1C'; }
    }
  }

  async function deleteChannel(channel) {
    if (!window.confirm('حذف «' + String(channel.name || 'القناة') + '» من قائمة القنوات؟')) return;
    try {
      await adminRequest({ action: 'delete', id: String(channel.id) });
      notify('تم حذف القناة.');
      await loadChannels();
    } catch (error) {
      notify(error.message || 'تعذر حذف القناة.');
    }
  }

  function loadHlsJs() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (window.__ta3lemyHlsLoading) return window.__ta3lemyHlsLoading;
    window.__ta3lemyHlsLoading = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
      script.onload = function () { resolve(window.Hls || null); };
      script.onerror = function () { reject(new Error('HLS player download failed')); };
      document.head.appendChild(script);
    });
    return window.__ta3lemyHlsLoading;
  }

  function openPlayer(channel) {
    var overlay = document.createElement('div');
    overlay.id = 'tvPlayerOverlay';
    overlay.dir = 'rtl';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;padding:12px;font-family:Cairo,Arial,sans-serif;';
    var panel = document.createElement('section');
    panel.style.cssText = 'width:min(920px,100%);background:#101820;color:#fff;border-radius:16px;padding:12px;box-sizing:border-box;';
    var heading = document.createElement('div');
    heading.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;';
    var title = document.createElement('strong');
    title.textContent = channel.name || 'مشاهدة القناة';
    var close = document.createElement('button');
    close.type = 'button'; close.textContent = 'إغلاق';
    close.style.cssText = 'border:0;border-radius:9px;padding:8px 12px;background:#fff;color:#263238;font:inherit;font-weight:700;';
    close.onclick = function () { overlay.remove(); };
    heading.appendChild(title); heading.appendChild(close);
    panel.appendChild(heading);
    var frame = document.createElement('div');
    frame.style.cssText = 'width:100%;aspect-ratio:16/9;background:#000;border-radius:10px;overflow:hidden;display:grid;place-items:center;';
    panel.appendChild(frame);
    overlay.appendChild(panel);
    overlay.addEventListener('click', function (event) { if (event.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    var url = safeHttps(channel.watch_url);
    if (!url) { frame.textContent = 'الرابط غير صالح.'; return; }

    if (channel.behavior === 'youtube') {
      var videoId = safeYoutubeId(url);
      if (!videoId) { frame.textContent = 'اختاري رابط فيديو YouTube قابلًا للتضمين.'; return; }
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
      iframe.title = String(channel.name || 'YouTube player');
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'border:0;width:100%;height:100%;';
      frame.appendChild(iframe);
      return;
    }

    var video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.style.cssText = 'width:100%;height:100%;background:#000;';
    frame.appendChild(video);
    if (channel.behavior === 'video') {
      video.src = url;
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }
    loadHlsJs().then(function (Hls) {
      if (!Hls || !Hls.isSupported()) throw new Error('HLS unsupported');
      var hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      overlay.addEventListener('remove', function () { try { hls.destroy(); } catch (_) {} });
      close.addEventListener('click', function () { try { hls.destroy(); } catch (_) {} });
    }).catch(function () {
      var note = document.createElement('div');
      note.textContent = 'لم يعمل هذا البث داخل المشغّل. تأكدي أن رابط HLS يسمح بالتشغيل وأنه يخصك أو لديك إذن باستخدامه.';
      note.style.cssText = 'position:absolute;inset:auto 20px 20px;color:#fff;background:#263238;padding:10px;border-radius:8px;text-align:center;font-size:12px;';
      panel.appendChild(note);
    });
  }

  window.toggleTvManage = function () {
    if (!ownerRole()) { notify('إدارة القنوات للمالك فقط.'); return; }
    managerOpen = !managerOpen;
    renderOwnerPanel();
  };

  window.openTvChannels = function () {
    ensureScreen();
    try {
      if (typeof currentScreen !== 'undefined' && currentScreen !== 'tvChannelsScreen' && typeof screenHistory !== 'undefined' && Array.isArray(screenHistory)) {
        screenHistory.push(currentScreen);
      }
    } catch (_) {}
    if (typeof window.showScreen === 'function') window.showScreen('tvChannelsScreen');
    else {
      document.querySelectorAll('.screen').forEach(function (screen) { screen.classList.remove('active'); });
      document.getElementById('tvChannelsScreen').classList.add('active');
    }
    renderOwnerPanel();
    loadChannels();
  };

  window.addEventListener('ta3lemy-owner-auth-changed', function () {
    if (document.getElementById('tvChannelsScreen')) loadChannels();
  });
})();
