/* Live TV directory. Restricted broadcasters open their official destinations; only permitted streams use the in-app player. */
(function () {
  'use strict';

  var config = window.SUPABASE_CHAT_CONFIG || {};
  var publicClient = null;
  var channels = [];
  var activeHls = null;
  var activeChannel = null;
  var verifiedOwnerSession = null;
  var managerOpen = false;
  var selectedCategory = 'all';
  var categories = {
    all: 'الكل',
    sports: 'رياضة',
    education: 'تعليم',
    custom: 'محطاتي الخاصة'
  };
  var fallbackChannels = [
    {
      id: 'on-sport-official-live',
      name: 'ON Sport — رياضة مصرية رسمية',
      category: 'sports',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UCo2TvjBHS1BtyIkeGGTMe6w',
      description: 'القناة الرسمية لـ ON Sport. يظهر البث المباشر داخل المنصة عند وجود مباراة أو برنامج حي؛ وفي غير ذلك ستجد أحدث المحتوى الرياضي الرسمي.'
    },
    {
      id: 'ontime-sports-official-live',
      name: 'ONTime Sports — البث الرسمي',
      category: 'sports',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UCKDpgAqxLXCt9tJwWaZS8CQ',
      description: 'مصدر رياضي رسمي على YouTube. توفر البث يتغير حسب جدول البرامج وحقوق كل مباراة.'
    },
    {
      id: 'fifa-plus-official-live',
      name: 'FIFA+ — مباريات مجانية',
      category: 'sports',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UCc-wT5WN6__3k8It-_HM_lA',
      description: 'قناة FIFA+ الرسمية التي تقدم مباريات وبثًا مجانيًا في دول وبطولات محددة حسب حقوق العرض.'
    },
    {
      id: 'moe-madrasetna-official',
      name: 'قناة مدرستنا الرسمية',
      category: 'education',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UCnxju7_Ug6VbC6en6tBL6Aw',
      description: 'قناة تعليمية تابعة لوزارة التربية والتعليم؛ تعرض مواد دراسية للمرحلتين الابتدائية والإعدادية.'
    },
    {
      id: 'moe-edu-stream',
      name: 'قناة وزارة التعليم التعليمية',
      category: 'education',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UCGgeDgjIJ3GXZcLUnExAybw',
      description: 'قناة التسجيلات التعليمية المرتبطة ببوابة البث الرسمية لوزارة التربية والتعليم.'
    },
    {
      id: 'moe-live-lessons',
      name: 'منصة البث المباشر للحصص — الوزارة',
      category: 'education',
      behavior: 'external',
      watch_url: 'https://stream.moe.gov.eg/',
      description: 'مواعيد وجلسات افتراضية رسمية حسب الصف الدراسي؛ تتطلب اتصالًا بالإنترنت.'
    },
    {
      id: 'nasa-official-live',
      name: 'NASA الرسمي — علوم وفضاء',
      category: 'education',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UC9SM7V7J1pAhPabOUST01fw',
      description: 'بث رسمي من NASA عن الفضاء ومحطة الفضاء الدولية؛ قد لا يتوفر بث حي طوال الوقت.'
    },
    {
      id: 'natgeo-kids-official-live',
      name: 'Nat Geo Kids — أطفال وعلوم',
      category: 'education',
      behavior: 'youtube',
      watch_url: 'https://www.youtube.com/channel/UCXVCgDuD_QCkI7gTKU7-tpg',
      description: 'قناة National Geographic Kids الرسمية: علوم وحيوانات وتجارب ومحتوى مناسب للأطفال.'
    },
    {
      id: 'monterey-aquarium-live-cams',
      name: 'أكواريوم مونتيري — كائنات بحرية مباشرة',
      category: 'education',
      behavior: 'external',
      watch_url: 'https://www.montereybayaquarium.org/cams-videos/live-cams',
      description: 'كاميرات مباشرة رسمية لقناديل البحر وثعالب البحر وأسماك القرش والغابة البحرية.'
    },
    {
      id: 'san-diego-zoo-live-cams',
      name: 'حديقة سان دييغو — حيوانات مباشرة',
      category: 'education',
      behavior: 'external',
      watch_url: 'https://zoo.sandiegozoo.org/live-cameras',
      description: 'كاميرات رسمية للحيوانات مثل البطاريق والباندا والنمور والزرافات.'
    }
  ];

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
      #tvChannelsScreen .tv-console{background:#111827;border-radius:24px;padding:10px;box-shadow:0 14px 35px rgba(15,23,42,.25);margin-bottom:14px}
      #tvChannelsScreen .tv-live-stage{position:relative;display:grid;place-items:center;min-height:210px;aspect-ratio:16/9;overflow:hidden;border-radius:17px;background:radial-gradient(circle at 50% 35%,#164e63,#020617 70%);color:#fff;text-align:center}
      #tvChannelsScreen .tv-live-stage video,#tvChannelsScreen .tv-live-stage iframe{width:100%;height:100%;border:0;object-fit:contain;background:#000}
      #tvChannelsScreen .tv-stage-placeholder{padding:25px;color:#d1fae5}.tv-stage-placeholder strong{display:block;font-size:25px;margin:8px 0}.tv-stage-placeholder span{font-size:12px;color:#b6c8d0}
      #tvChannelsScreen .tv-live-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fff;padding:10px 5px 2px;font-size:13px}.tv-live-dot{width:9px;height:9px;background:#ef4444;border-radius:50%;display:inline-block;margin-left:5px;box-shadow:0 0 0 4px rgba(239,68,68,.18)}
      #tvChannelsScreen .tv-channel-strip{display:flex;gap:10px;overflow-x:auto;padding:5px 2px 12px;scroll-snap-type:x proximity}
      #tvChannelsScreen .tv-channel-strip::-webkit-scrollbar{height:5px}#tvChannelsScreen .tv-channel-strip::-webkit-scrollbar-thumb{background:#80cbc4;border-radius:8px}
      #tvChannelsScreen .tv-channel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
      #tvChannelsScreen .tv-channel-card{position:relative;overflow:hidden;min-width:165px;flex:0 0 165px;border:1px solid #dce9e7;border-radius:16px;background:linear-gradient(145deg,#fff 0%,#fbfefd 100%);box-shadow:0 7px 22px rgba(0,77,64,.08);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;scroll-snap-align:start}
      #tvChannelsScreen .tv-channel-card:before{content:"";position:absolute;inset:0 0 auto;height:4px;background:linear-gradient(90deg,#00796b,#4db6ac)}
      #tvChannelsScreen .tv-channel-card[data-category="sports"]:before{background:linear-gradient(90deg,#d84343,#ffb74d)}
      #tvChannelsScreen .tv-channel-card[data-category="education"]:before{background:linear-gradient(90deg,#3949ab,#26a69a)}
      #tvChannelsScreen .tv-channel-card[data-category="custom"]:before{background:linear-gradient(90deg,#00897b,#80cbc4)}
      #tvChannelsScreen .tv-channel-card:hover{transform:translateY(-3px);border-color:#80cbc4;box-shadow:0 12px 28px rgba(0,77,64,.14)}
      #tvChannelsScreen .tv-card-open{display:block;width:100%;padding:13px 12px 12px;border:0;background:transparent;color:inherit;text-align:right;font:inherit;cursor:pointer}
      #tvChannelsScreen .tv-card-open:focus-visible{outline:3px solid #26a69a;outline-offset:-4px;border-radius:20px}
      #tvChannelsScreen .tv-card-head{display:block;min-height:115px}.tv-channel-info{margin-top:9px}
      #tvChannelsScreen .tv-logo-box{position:relative;display:grid;place-items:center;width:100%;height:82px;overflow:hidden;border:1px solid #edf2f1;border-radius:13px;background:#fff;box-shadow:0 4px 12px rgba(38,50,56,.08)}
      #tvChannelsScreen .tv-logo-box img{display:block;width:100%;height:100%;padding:5px;box-sizing:border-box;object-fit:contain;background:#fff}
      #tvChannelsScreen .tv-logo-fallback{display:none;position:absolute;inset:0;place-items:center;background:linear-gradient(145deg,#e0f2f1,#b2dfdb);color:#00695c;font-size:29px}
      #tvChannelsScreen .tv-brand-bein{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(145deg,#58258b,#32145b);color:#fff;font-family:Arial,sans-serif;font-weight:800;letter-spacing:-1px}
      #tvChannelsScreen .tv-brand-bein strong{font-size:25px;line-height:1}
      #tvChannelsScreen .tv-brand-bein small{margin-top:4px;font-size:9px;letter-spacing:3px}
      #tvChannelsScreen .tv-channel-info{min-width:0}
      #tvChannelsScreen .tv-category-pill{display:inline-flex;align-items:center;gap:5px;margin-bottom:6px;padding:4px 9px;border-radius:99px;background:#eef7f5;color:#28766d;font-size:10px;font-weight:800}
      #tvChannelsScreen .tv-channel-name{margin:0;color:#203a37;font-size:16px;font-weight:800;line-height:1.45;overflow-wrap:anywhere}
      #tvChannelsScreen .tv-channel-desc{margin:8px 0 0;color:#61716f;font-size:11px;line-height:1.65;min-height:36px}
      #tvChannelsScreen .tv-card-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:15px;padding-top:11px;border-top:1px solid #edf2f1}
      #tvChannelsScreen .tv-card-cta{display:inline-flex;align-items:center;gap:7px;color:#00796b;font-size:12px;font-weight:800}
      #tvChannelsScreen .tv-card-cta-icon{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#e0f2f1;font-size:12px}
      #tvChannelsScreen .tv-card-source{color:#879592;font-size:10px;font-weight:700}
      #tvChannelsScreen .tv-card-admin{display:flex;justify-content:flex-end;padding:0 15px 13px}
      #tvChannelsScreen .tv-card-delete{border:1px solid #ffdde0;border-radius:9px;padding:6px 9px;background:#fff8f8;color:#b71c1c;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
      @media(max-width:520px){#tvChannelsScreen .tv-live-stage{min-height:190px}.tv-channel-card{min-width:150px!important;flex-basis:150px!important}}
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
          مشاهدة القنوات التعليمية الرسمية تتم داخل شاشة التلفزيون؛ تحقق المالك مطلوب فقط لإضافة أو حذف محطة خاصة، ولا نعيد بث القنوات المحمية.
        </div>
        <button id="tvAddChannelCta" type="button" onclick="toggleTvManage()" style="width:100%;border:0;border-radius:14px;padding:13px 15px;margin-bottom:12px;background:linear-gradient(135deg,#00796B,#26A69A);color:#fff;font:inherit;font-weight:800;box-shadow:0 5px 16px rgba(0,121,107,.18);">➕ إضافة قناة إلى محطتي الخاصة</button>
        <div style="background:#FFF8E1;color:#6D4C41;border-radius:12px;padding:10px 12px;margin-bottom:12px;font-size:12px;line-height:1.8;">اضغط على شعار القناة لتشغيلها داخل شاشة التلفزيون. إذا منع المصدر التضمين ستظهر رسالة داخل الشاشة بدل إخراجك من المنصة.</div>
        <div id="tvOwnerPanel" style="display:none;"></div>
        <section class="tv-console" aria-label="مشغل التلفزيون">
          <div id="tvLiveStage" class="tv-live-stage"><div class="tv-stage-placeholder">📺<strong>شاشة التلفزيون</strong><span>اختر قناة من الشريط بالأسفل لبدء المشاهدة</span></div></div>
          <div class="tv-live-bar"><span><span class="tv-live-dot"></span><b id="tvNowTitle">لا توجد قناة مختارة</b></span><span id="tvNowStatus">جاهز</span></div>
        </section>
        <div id="tvCategoryFilters" style="display:flex;gap:7px;overflow:auto;padding:2px 1px 10px;margin-bottom:4px;"></div>
        <div id="tvChannelStatus" role="status" style="padding:12px;color:#607D8B;text-align:center;">جاري تحميل القنوات…</div>
        <div id="tvChannelList" class="tv-channel-strip" aria-label="شريط القنوات"></div>
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

  function youtubeEmbedUrl(value) {
    var url;
    try { url = new URL(String(value || '')); } catch (_) { return ''; }
    var id = safeYoutubeId(value);
    if (id) return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    var match = url.pathname.match(/^\/channel\/(UC[A-Za-z0-9_-]{20,})/i);
    if (match) return 'https://www.youtube-nocookie.com/embed/live_stream?channel=' + encodeURIComponent(match[1]) + '&autoplay=1';
    if (url.hostname.toLowerCase().replace(/^www\./, '') === 'youtube.com' && /^\/@[^/]+\/live/i.test(url.pathname)) return url.href;
    return '';
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
        playInTvStage(item);
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
      var remoteChannels = Array.isArray(result.data) ? result.data : [];
      var remoteUrls = remoteChannels.map(function (channel) { return String(channel.watch_url || ''); });
      var localFallbacks = fallbackChannels.filter(function (channel) { return remoteUrls.indexOf(String(channel.watch_url || '')) === -1; });
      channels = localFallbacks.concat(remoteChannels);
      verifiedOwnerSession = null;
      if (ownerRole() && window.HafezOwnerAuth) {
        try { verifiedOwnerSession = await window.HafezOwnerAuth.getVerifiedSession(); } catch (_) {}
      }
      renderOwnerPanel();
      renderChannels();
    } catch (error) {
      console.error('[tv-channels] load failed', error && error.message || 'unknown error');
      channels = fallbackChannels.slice();
      if (status) status.textContent = 'تعذر تحميل القنوات الآن. تحققي من الإنترنت ثم أعيدي المحاولة.';
      renderChannels();
    }
  }

  function ownerPanelMarkup() {
    if (!ownerRole()) return '';
    if (!verifiedOwnerSession) {
      return '<section style="background:#E8F5E9;border:1px solid #C8E6C9;border-radius:15px;padding:14px;margin-bottom:12px;">' +
        '<div style="font-weight:800;color:#1B5E20;margin-bottom:6px;">🔐 إدارة القنوات — تحقق المالك</div>' +
        '<div style="font-size:12px;color:#455A64;line-height:1.8;margin-bottom:10px;">تحقق المالك مطلوب فقط لإضافة أو حذف محطتك الخاصة. القنوات الرسمية الجاهزة متاحة للمشاهدة دون هذا الإجراء، وصفة الحساب الظاهرة في التطبيق وحدها لا تمنح صلاحية الإدارة.</div>' +
        '<button type="button" id="tvOwnerLoginBtn" style="border:0;border-radius:10px;padding:10px 14px;background:#2E7D32;color:#fff;font:inherit;font-weight:700;">📧 إرسال رابط التحقق</button>' +
        '<div id="tvOwnerAuthStatus" role="status" style="font-size:12px;line-height:1.7;margin-top:8px;"></div></section>';
    }
    return '<section style="background:#E8F5E9;border:1px solid #C8E6C9;border-radius:15px;padding:14px;margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;"><div style="font-weight:800;color:#1B5E20;">✅ تم التحقق من بريد المالك</div><button type="button" id="tvOwnerLogoutBtn" style="border:1px solid #A5D6A7;border-radius:9px;padding:7px 10px;background:#fff;color:#1B5E20;font:inherit;font-size:12px;">تسجيل خروج الإدارة</button></div>' +
      '<form id="tvChannelForm" style="display:grid;gap:8px;margin-top:12px;">' +
          '<label style="font-size:12px;font-weight:700;color:#455A64;">اسم القناة أو المحطة<input name="name" required maxlength="100" autocomplete="off" placeholder="مثال: محطتي التعليمية" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"></label>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
          '<label style="font-size:12px;font-weight:700;color:#455A64;">التصنيف<select name="category" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"><option value="custom">محطة خاصة</option><option value="sports">رياضة</option><option value="education">تعليم</option></select></label>' +
          '<label style="font-size:12px;font-weight:700;color:#455A64;">طريقة العرض<select name="behavior" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"><option value="video">فيديو مرفوع من الجهاز (الأسهل)</option><option value="youtube">فيديو YouTube مسموح تضمينه</option><option value="hls">بث HLS أملكه أو أملك إذنًا به</option><option value="external">رابط رسمي خارجي</option></select></label>' +
        '</div>' +
        '<label style="font-size:12px;font-weight:700;color:#455A64;">فيديو القناة من الهاتف (الطريقة الأسهل)<input name="video_file" type="file" accept="video/mp4,video/webm,video/quicktime,video/ogg" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:9px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;"><small style="display:block;margin-top:4px;color:#607D8B;line-height:1.7;">اختر «فيديو مرفوع من الجهاز» ثم اختر ملف الفيديو. سيعمل داخل شاشة التلفزيون دون كتابة رابط.</small></label>' +
          '<label style="font-size:12px;font-weight:700;color:#455A64;">رابط HTTPS (اختياري عند رفع فيديو من الجهاز)<input name="watch_url" type="url" maxlength="2048" placeholder="يُملأ تلقائيًا عند رفع فيديو" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #CFD8DC;border-radius:9px;font:inherit;direction:ltr;text-align:left;"></label>' +
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
    var videoFile = form.querySelector('[name="video_file"]') && form.querySelector('[name="video_file"]').files[0];
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
    if (input.behavior === 'video' && videoFile) {
      if (!/^video\/(mp4|webm|quicktime|ogg)$/i.test(String(videoFile.type || '')) || videoFile.size > 50 * 1024 * 1024) {
        if (status) { status.textContent = 'اختاري فيديو MP4 أو WebM أو MOV أو OGG لا يتجاوز 50 ميجابايت.'; status.style.color = '#B71C1C'; }
        return;
      }
      if (status) { status.textContent = 'جاري رفع فيديو القناة…'; status.style.color = '#455A64'; }
      try {
        if (typeof window.uploadFile !== 'function') throw new Error('خدمة رفع الملفات غير جاهزة');
        input.watch_url = await window.uploadFile(videoFile, 'tv-channels/videos');
      } catch (error) {
        if (status) { status.textContent = error.message || 'تعذر رفع فيديو القناة.'; status.style.color = '#B71C1C'; }
        return;
      }
    }
    if (!input.name || !safeHttps(input.watch_url) || input.logo_url && !safeHttps(input.logo_url)) {
      if (status) { status.textContent = 'اكتبي اسم القناة واختاري فيديو أو أدخلي رابط HTTPS صالحًا.'; status.style.color = '#B71C1C'; }
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

  function playInTvStage(channel) {
    var stage = document.getElementById('tvLiveStage');
    var title = document.getElementById('tvNowTitle');
    var status = document.getElementById('tvNowStatus');
    var url = safeHttps(channel && channel.watch_url);
    if (!stage || !url) { notify('مصدر القناة غير متاح حاليًا.'); return; }
    if (activeHls) { try { activeHls.destroy(); } catch (_) {} activeHls = null; }
    activeChannel = channel;
    stage.innerHTML = '';
    if (title) title.textContent = channel.name || 'القناة';
    if (status) status.textContent = 'جاري التحميل…';
    if (channel.behavior === 'youtube') {
      var embedUrl = youtubeEmbedUrl(url);
      if (!embedUrl) {
        if (status) status.textContent = 'رابط YouTube غير قابل للتضمين';
        stage.innerHTML = '<div class="tv-stage-placeholder">⚠️<strong>لا يمكن تضمين هذه القناة</strong><span>استخدمي رابط قناة أو بث يسمح بالتضمين.</span></div>';
        return;
      }
      var frame = document.createElement('iframe');
      frame.src = embedUrl;
      frame.title = String(channel.name || 'مشغل القناة');
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      stage.appendChild(frame);
      if (status) status.textContent = 'يعمل داخل المنصة';
      return;
    }
    if (channel.behavior === 'external') {
      var externalFrame = document.createElement('iframe');
      externalFrame.src = url;
      externalFrame.title = String(channel.name || 'القناة');
      externalFrame.allow = 'autoplay; fullscreen; picture-in-picture';
      externalFrame.referrerPolicy = 'strict-origin-when-cross-origin';
      externalFrame.style.cssText = 'width:100%;height:100%;border:0;background:#000;';
      stage.appendChild(externalFrame);
      if (status) status.textContent = 'داخل شاشة المنصة';
      return;
    }
    var video = document.createElement('video');
    video.controls = true; video.playsInline = true; video.autoplay = true; video.muted = true; video.preload = 'metadata';
    stage.appendChild(video);
    video.addEventListener('playing', function () { if (status) status.textContent = 'مباشر'; });
    video.addEventListener('error', function () { if (status) status.textContent = 'تعذر تشغيل هذا المصدر'; });
    if (channel.behavior === 'video' || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(function () { if (status) status.textContent = 'اضغط تشغيل'; });
      return;
    }
    loadHlsJs().then(function (Hls) {
      if (!Hls || !Hls.isSupported()) throw new Error('HLS unsupported');
      activeHls = new Hls();
      activeHls.loadSource(url);
      activeHls.attachMedia(video);
      activeHls.on(Hls.Events.MANIFEST_PARSED, function () { video.play().catch(function () {}); });
    }).catch(function () {
      if (status) status.textContent = 'هذا البث لا يسمح بالتشغيل داخل الصفحة';
      stage.innerHTML = '<div class="tv-stage-placeholder">⚠️<strong>تعذر تشغيل القناة داخل الشاشة</strong><span>المصدر منع التضمين أو لا يدعم التشغيل المباشر.</span></div>';
    });
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
    loadChannels().then(function () {
      var first = channels.find(function (channel) { return ['youtube', 'hls', 'video'].indexOf(String(channel.behavior || 'external')) !== -1; });
      if (first) playInTvStage(first);
    });
  };

  window.addEventListener('ta3lemy-owner-auth-changed', function () {
    if (document.getElementById('tvChannelsScreen')) loadChannels();
  });
})();
