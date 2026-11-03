/* Ta3lemy social news feed.
 * Posts remain pending until a server-side RPC validates the existing owner admin key.
 * Supabase anonymous Auth sessions are scoped per Ta3lemy UID; see the security note in the release.
 */
(function () {
  'use strict';

  var config = window.SUPABASE_CHAT_CONFIG || {};
  var client = null;
  var clientScope = '';
  var authUser = null;
  var moderationKey = '';
  var adminStatus = 'pending';
  var adminPosts = [];
  var maxImageBytes = 10 * 1024 * 1024;
  var maxVideoBytes = 25 * 1024 * 1024;
  var maxTextLength = 3000;
  var maxCommentLength = 1000;
  var reactionOptions = [
    { key: 'like', emoji: '👍', label: 'إعجاب' },
    { key: 'love', emoji: '❤️', label: 'أحببته' },
    { key: 'laugh', emoji: '😂', label: 'مضحك' },
    { key: 'wow', emoji: '😮', label: 'مدهش' },
    { key: 'clap', emoji: '👏', label: 'أحسنت' }
  ];

  function appUser() { return window.currentUser || null; }
  function appUid() {
    var user = appUser();
    return user && user.uid ? String(user.uid) : '';
  }
  function role() {
    var user = appUser() || {};
    var value = String(window.currentRole || user.role || 'student').toLowerCase();
    if (value === 'guardian' || value === 'parent/guardian') return 'parent';
    return ['student', 'parent', 'teacher', 'owner'].indexOf(value) >= 0 ? value : 'student';
  }
  function roleLabel(value) {
    return value === 'teacher' ? 'معلم' : value === 'parent' ? 'ولي أمر' : value === 'owner' ? 'المالك' : 'طالب';
  }
  function displayName() {
    var user = appUser() || {};
    return String(user.displayName || user.display_name || user.name || 'عضو').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'عضو';
  }
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
    });
  }
  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.log(message);
  }
  function dateLabel(value) {
    if (!value) return 'الآن';
    var date = new Date(value);
    return isNaN(date.getTime()) ? 'الآن' : date.toLocaleString('ar-EG');
  }
  function safeCloudinaryUrl(value, kind) {
    try {
      var url = new URL(String(value || ''));
      if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'res.cloudinary.com') return '';
      var path = url.pathname.toLowerCase();
      if (kind === 'image' && path.indexOf('/image/upload/') === -1) return '';
      if (kind === 'video' && path.indexOf('/video/upload/') === -1) return '';
      return url.href;
    } catch (_) { return ''; }
  }
  function ensureClient() {
    var sdk = window.supabase;
    var uid = appUid();
    if (!sdk || typeof sdk.createClient !== 'function' || !config.url || !config.publishableKey) {
      throw new Error('خدمة أخبار فيسبوك لم تُحمّل؛ افتحي المنصة مع الإنترنت ثم أعيدي المحاولة.');
    }
    if (!uid) throw new Error('سجّلي الدخول إلى المنصة أولًا.');
    var nextScope = 'ta3lemy-social-news-' + encodeURIComponent(uid);
    if (!client || clientScope !== nextScope) {
      client = sdk.createClient(config.url, config.publishableKey, {
        auth: {
          storageKey: nextScope,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      clientScope = nextScope;
      authUser = null;
      moderationKey = '';
      adminPosts = [];
    }
    return client;
  }
  async function ensureIdentity() {
    var supa = ensureClient();
    var result = await supa.auth.getSession();
    if (result.error) throw result.error;
    var session = result.data && result.data.session;
    authUser = session && session.user || null;
    if (!authUser) {
      var signed = await supa.auth.signInAnonymously();
      if (signed.error) throw signed.error;
      authUser = signed.data && signed.data.user || null;
    }
    if (!authUser || !authUser.id) throw new Error('تعذر إنشاء جلسة آمنة للموجز.');
    return authUser;
  }
  function ensureNewsScreen() {
    var screen = document.getElementById('newsScreen');
    if (!screen) {
      screen = document.createElement('div');
      screen.id = 'newsScreen';
      screen.className = 'screen';
      screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#1565C0,#42A5F5);"><button class="icon-btn" onclick="goBack()" aria-label="رجوع">→</button><div class="logo"><span>📰 أخبار فيسبوك</span></div><button class="icon-btn" id="addNewsBtn" onclick="openAddNews()" aria-label="منشور جديد">＋</button></div><div class="content" id="newsContent"></div>';
      document.body.appendChild(screen);
    }
    var title = screen.querySelector('.logo span');
    if (title) title.textContent = '📰 أخبار فيسبوك';
    var addButton = document.getElementById('addNewsBtn');
    if (addButton) {
      addButton.style.display = 'flex';
      addButton.setAttribute('aria-label', 'إنشاء منشور جديد');
      addButton.title = 'إنشاء منشور جديد';
      addButton.onclick = window.openAddNews;
    }
    return screen;
  }
  function ensureComposerScreen() {
    var screen = document.getElementById('socialComposeScreen');
    if (screen) return screen;
    screen = document.createElement('div');
    screen.id = 'socialComposeScreen';
    screen.className = 'screen';
    screen.innerHTML = `
      <div class="top-bar" style="background:linear-gradient(135deg,#1565C0,#42A5F5);">
        <button class="icon-btn" onclick="goBack()" aria-label="رجوع">→</button>
        <div class="logo"><span>✍️ منشور جديد</span></div><div style="width:42px;"></div>
      </div>
      <div class="content" style="padding:16px;max-width:760px;margin:0 auto;">
        <div style="background:#fff;border-radius:18px;padding:18px;box-shadow:0 4px 18px rgba(0,0,0,.07);">
          <div style="font-weight:700;color:#263238;margin-bottom:12px;">النشر باسم <span id="socialComposeAuthor"></span></div>
          <label for="socialPostText" style="display:block;font-weight:700;margin:10px 0 6px;">ماذا تريد أن تشارك؟</label>
          <textarea id="socialPostText" class="form-input" rows="6" maxlength="3000" placeholder="اكتب منشورًا مفيدًا ولطيفًا..." style="width:100%;box-sizing:border-box;resize:vertical;"></textarea>
          <div style="font-size:12px;color:#607D8B;text-align:left;margin-top:4px;"><span id="socialPostCount">0</span> / 3000</div>
          <label for="socialPostImage" style="display:block;font-weight:700;margin:16px 0 6px;">📷 صورة (اختياري، حتى 10 ميغابايت)</label>
          <input id="socialPostImage" class="form-input" type="file" accept="image/*" style="width:100%;box-sizing:border-box;padding:10px;">
          <label for="socialPostVideo" style="display:block;font-weight:700;margin:14px 0 6px;">🎥 فيديو (اختياري، حتى 25 ميغابايت)</label>
          <input id="socialPostVideo" class="form-input" type="file" accept="video/mp4,video/webm,video/quicktime" style="width:100%;box-sizing:border-box;padding:10px;">
          <div style="background:#FFF8E1;color:#795548;padding:11px;border-radius:12px;font-size:13px;line-height:1.7;margin:14px 0;">🔎 لن يظهر المنشور للآخرين إلا بعد موافقة المالك. لا ترفع صورًا شخصية أو أرقام هواتف أو معلومات خاصة.</div>
          <button id="socialPublishBtn" class="btn-primary" type="button" style="width:100%;background:linear-gradient(135deg,#1565C0,#42A5F5);" onclick="publishNews()">📤 إرسال للمراجعة</button>
        </div>
      </div>`;
    document.body.appendChild(screen);
    var text = document.getElementById('socialPostText');
    if (text) text.addEventListener('input', function () {
      var counter = document.getElementById('socialPostCount');
      if (counter) counter.textContent = String(text.value.length);
    });
    return screen;
  }
  function updateEntryLabels() {
    var button = document.getElementById('newsBtn');
    if (button) button.innerHTML = '<div style="font-size:28px;">📰</div><div style="margin-top:8px;font-size:15px;">أخبار فيسبوك</div>';
    var addButton = document.getElementById('addNewsBtn');
    if (addButton) {
      addButton.style.display = 'flex';
      addButton.onclick = window.openAddNews;
    }
  }
  function ownerPanelMarkup() {
    return `
      <section style="background:#EAF3FF;border:1px solid #C7DDF8;border-radius:16px;padding:14px;margin-bottom:16px;">
        <div style="font-weight:800;color:#174A7C;font-size:16px;margin-bottom:6px;">🛡️ مراجعة المنشورات — للمالك</div>
        <div style="font-size:12px;color:#455A64;line-height:1.7;margin-bottom:9px;">أدخلي مفتاح إدارة الاقتراحات والشكاوى نفسه. لا نُظهر أي منشور قبل اعتماده من الخادم.</div>
        <input id="socialAdminKey" type="password" maxlength="200" autocomplete="off" placeholder="مفتاح الإدارة" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #B0BEC5;border-radius:10px;margin-bottom:8px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" data-social-admin-status="pending" style="border:0;border-radius:9px;padding:9px 12px;background:#1565C0;color:white;font-weight:700;">طلبات جديدة</button>
          <button type="button" data-social-admin-status="approved" style="border:0;border-radius:9px;padding:9px 12px;background:#fff;color:#1565C0;font-weight:700;">المنشورات المنشورة</button>
          <button type="button" id="socialStatsBtn" style="border:0;border-radius:9px;padding:9px 12px;background:#E8F5E9;color:#2E7D32;font-weight:700;">📊 إحصائيات الموجز</button>
        </div>
        <div id="socialAdminQueue" style="margin-top:12px;"></div>
        <div id="socialAdminStats" style="margin-top:12px;"></div>
      </section>`;
  }
  function renderAdminStats(data) {
    var container = document.getElementById('socialAdminStats');
    if (!container) return;
    var cards = [
      ['منشورات منشورة', data.approved_posts],
      ['بانتظار المراجعة', data.pending_posts],
      ['التعليقات', data.total_comments],
      ['الردود', data.total_replies],
      ['التفاعلات', data.total_reactions]
    ];
    var html = '<div style="background:#fff;border:1px solid #DCE7F2;border-radius:12px;padding:12px;"><div style="font-weight:800;color:#174A7C;margin-bottom:9px;">ملخص الموجز</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;">';
    cards.forEach(function (item) {
      html += '<div style="background:#F5F8FB;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:18px;font-weight:800;color:#1565C0;">' + Number(item[1] || 0) + '</div><div style="font-size:11px;color:#607D8B;">' + escapeHtml(item[0]) + '</div></div>';
    });
    html += '</div><div style="font-weight:800;color:#174A7C;margin:13px 0 6px;">الأكثر تفاعلًا (التفاعلات + التعليقات والردود)</div>';
    var top = Array.isArray(data.top_posts) ? data.top_posts : [];
    if (!top.length) html += '<div style="font-size:12px;color:#78909C;">لا توجد منشورات منشورة بعد.</div>';
    else {
      html += '<ol style="margin:0;padding-right:22px;">';
      top.forEach(function (post) {
        var excerpt = String(post.preview || 'منشور وسائط').slice(0, 120);
        html += '<li style="padding:6px 0;color:#455A64;font-size:12px;"><button type="button" data-social-jump-post="' + escapeHtml(post.id) + '" style="border:0;background:transparent;color:#1565C0;font-family:inherit;text-align:right;cursor:pointer;">' + escapeHtml(excerpt) + '</button><div>⭐ ' + Number(post.engagement || 0) + ' تفاعل · ' + Number(post.reaction_count || 0) + ' رمز · ' + Number(post.comment_count || 0) + ' تعليق/رد</div></li>';
      });
      html += '</ol>';
    }
    container.innerHTML = html + '</div>';
    container.querySelectorAll('[data-social-jump-post]').forEach(function (button) {
      button.addEventListener('click', function () {
        var post = document.getElementById('socialPost-' + button.getAttribute('data-social-jump-post'));
        if (post && post.scrollIntoView) post.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else toast('المنشور غير ظاهر في الصفحة الحالية؛ حدّثي الموجز لعرضه.');
      });
    });
  }
  function renderMedia(post) {
    var image = safeCloudinaryUrl(post.image_url, 'image');
    var video = safeCloudinaryUrl(post.video_url, 'video');
    var html = '';
    if (image) html += '<img loading="lazy" alt="صورة مرفقة" src="' + escapeHtml(image) + '" style="display:block;width:100%;max-height:520px;object-fit:contain;background:#F3F6F8;border-radius:12px;margin-top:12px;">';
    if (video) html += '<video controls preload="metadata" src="' + escapeHtml(video) + '" style="display:block;width:100%;max-height:520px;background:#111;border-radius:12px;margin-top:12px;"></video>';
    return html;
  }
  function renderComment(comment, postId, repliesByComment, isReply) {
    var commentId = escapeHtml(comment.id);
    var replyMarkup = '';
    if (!isReply) {
      var replies = repliesByComment[comment.id] || [];
      replyMarkup = '<div style="margin:5px 0 0 14px;border-right:2px solid #D8E7F5;padding-right:10px;">' +
        replies.map(function (reply) { return renderComment(reply, postId, repliesByComment, true); }).join('') +
        '<button type="button" data-social-reply="' + commentId + '" style="border:0;background:transparent;color:#1976D2;font-family:inherit;font-weight:700;padding:6px 0;cursor:pointer;">↩ رد</button>' +
        '<div id="socialReplyForm-' + commentId + '" style="display:none;gap:6px;margin:4px 0 8px;"><input type="text" id="socialReplyInput-' + commentId + '" maxlength="1000" placeholder="اكتب ردًا..." style="flex:1;min-width:0;padding:9px;border:1px solid #DCE3E9;border-radius:9px;font-family:inherit;"><button type="button" data-social-send-reply="' + commentId + '" style="background:#1976D2;color:#fff;border:0;padding:8px 12px;border-radius:9px;font-weight:700;">إرسال</button></div>' +
        '</div>';
    }
    return '<div style="background:' + (isReply ? '#F8FAFC' : '#F5F7FA') + ';border-radius:10px;padding:9px 11px;margin:7px 0;display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">' +
      '<div style="min-width:0;flex:1;overflow-wrap:anywhere;"><b style="color:#1565C0;font-size:12px;">' + escapeHtml(comment.author_name || 'عضو') + '</b><div style="font-size:13px;line-height:1.6;margin-top:3px;white-space:pre-wrap;">' + escapeHtml(comment.content) + '</div>' +
      (role() === 'owner' && moderationKey ? '<button type="button" data-social-delete-comment="' + commentId + '" title="حذف التعليق" style="background:none;border:0;color:#C62828;cursor:pointer;padding:5px 0;">حذف</button>' : '') + replyMarkup + '</div>' +
      '</div>';
  }
  function renderPost(post, comments, isPending, reactionSummary, repliesByComment) {
    var postId = escapeHtml(post.id);
    var caption = post.content ? '<div style="line-height:1.75;color:#263238;white-space:pre-wrap;overflow-wrap:anywhere;margin-top:10px;">' + escapeHtml(post.content) + '</div>' : '';
    var commentHtml = (comments || []).map(function (comment) { return renderComment(comment, postId, repliesByComment || {}, false); }).join('');
    var reactionHtml = '';
    if (!isPending) {
      var counts = reactionSummary && reactionSummary.counts || {};
      var mine = reactionSummary && reactionSummary.mine || '';
      reactionHtml = '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:12px;" aria-label="التفاعلات">' + reactionOptions.map(function (item) {
        var active = mine === item.key;
        return '<button type="button" data-social-reaction-post="' + postId + '" data-social-reaction="' + item.key + '" aria-label="' + item.label + '" aria-pressed="' + (active ? 'true' : 'false') + '" title="' + item.label + '" style="border:1px solid ' + (active ? '#1976D2' : '#DCE3E9') + ';border-radius:20px;padding:6px 10px;background:' + (active ? '#E3F2FD' : '#fff') + ';color:#29445A;font-weight:700;cursor:pointer;">' + item.emoji + ' <span>' + Number(counts[item.key] || 0) + '</span></button>';
      }).join('') + '</div>';
    }
    return '<article id="socialPost-' + postId + '" style="background:#fff;border-radius:17px;padding:16px;margin-bottom:15px;box-shadow:0 3px 14px rgba(25,70,110,.08);">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">' +
        '<div><b style="color:#174A7C;">👤 ' + escapeHtml(post.author_name || 'عضو') + '</b></div>' +
        '<time style="font-size:11px;color:#90A4AE;white-space:nowrap;">' + escapeHtml(dateLabel(post.created_at)) + '</time>' +
      '</div>' + caption + renderMedia(post) + reactionHtml +
      (isPending ? '<div style="margin-top:12px;padding:8px 10px;background:#FFF8E1;color:#795548;border-radius:9px;font-size:12px;">⏳ منشورك قيد مراجعة المالك ولن يظهر للآخرين بعد.</div>' : '') +
      '<section style="border-top:1px solid #EEF1F4;margin-top:13px;padding-top:10px;">' +
        '<div style="font-weight:700;color:#607D8B;font-size:13px;margin-bottom:5px;">💬 التعليقات</div>' +
        '<div id="commentsList-' + postId + '">' + (commentHtml || '<div style="font-size:12px;color:#90A4AE;padding:5px 0;">لا توجد تعليقات بعد</div>') + '</div>' +
        (isPending ? '' : '<div style="display:flex;gap:6px;align-items:center;margin-top:8px;"><input type="text" id="commentInput-' + postId + '" maxlength="1000" placeholder="اكتب تعليقًا..." style="flex:1;min-width:0;padding:10px;border:1px solid #DCE3E9;border-radius:10px;font-family:inherit;" aria-label="تعليق"><button type="button" data-social-comment="' + postId + '" style="background:#1976D2;color:#fff;border:0;padding:10px 14px;border-radius:10px;font-weight:700;">إرسال</button></div>') +
      '</section></article>';
  }
  function pendingSummary(post) {
    return '<div style="background:#fff;border:1px solid #FFE0B2;border-radius:12px;padding:10px;margin-top:8px;">' +
      '<div style="font-size:12px;color:#795548;">⏳ أُرسل ' + escapeHtml(dateLabel(post.created_at)) + ' — بانتظار موافقة المالك</div>' +
      (post.content ? '<div style="margin-top:5px;white-space:pre-wrap;overflow-wrap:anywhere;">' + escapeHtml(post.content.slice(0,220)) + (post.content.length > 220 ? '…' : '') + '</div>' : '') + renderMedia(post) +
      '</div>';
  }
  function renderNotifications(items) {
    var notifications = items || [];
    var unread = notifications.filter(function (item) { return !item.is_read; }).length;
    var html = '<section style="background:#F1F8FF;border:1px solid #D7E8F8;border-radius:15px;padding:12px;margin-bottom:14px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="font-weight:800;color:#174A7C;">🔔 إشعاراتك' + (unread ? ' <span style="background:#E53935;color:white;border-radius:12px;padding:2px 8px;font-size:11px;">' + unread + ' جديدة</span>' : '') + '</div>' +
      (unread ? '<button type="button" data-social-mark-notifications style="border:0;background:#fff;color:#1565C0;border-radius:8px;padding:7px 9px;font-weight:700;">تعليم الكل كمقروء</button>' : '') + '</div>';
    if (!notifications.length) {
      html += '<div style="font-size:12px;color:#607D8B;margin-top:8px;">لا توجد إشعارات جديدة.</div>';
    } else {
      notifications.forEach(function (item) {
        html += '<div style="background:' + (item.is_read ? '#fff' : '#EAF3FF') + ';border-radius:10px;padding:9px 10px;margin-top:8px;font-size:13px;line-height:1.55;"><span>' + escapeHtml(item.message || 'لديك إشعار جديد.') + '</span><div style="font-size:11px;color:#78909C;margin-top:3px;">' + escapeHtml(dateLabel(item.created_at)) + '</div></div>';
      });
    }
    return html + '</section>';
  }
  async function fetchFeed() {
    var supa = ensureClient();
    await ensureIdentity();
    var postsResult = await supa.from('social_posts')
      .select('id,author_id,author_name,author_role,content,image_url,video_url,status,created_at,updated_at,approved_at')
      .eq('status', 'approved').order('created_at', { ascending: false }).limit(50);
    if (postsResult.error) throw postsResult.error;
    var posts = postsResult.data || [];
    var comments = [];
    var reactions = [];
    var ownPending = [];
    var ownPendingError = null;
    var notificationResult = await supa.from('social_notifications')
      .select('id,post_id,kind,message,is_read,created_at')
      .eq('recipient_id', authUser.id).order('created_at', { ascending: false }).limit(20);
    if (notificationResult.error) throw notificationResult.error;
    if (authUser && authUser.id) {
      var pendingResult = await supa.from('social_posts')
        .select('id,author_name,author_role,content,image_url,video_url,status,created_at')
        .eq('author_id', authUser.id).eq('status', 'pending')
        .order('created_at', { ascending: false }).limit(20);
      if (pendingResult.error) ownPendingError = pendingResult.error;
      else ownPending = pendingResult.data || [];
    }
    if (posts.length) {
      var commentResult = await supa.from('social_comments')
        .select('id,post_id,parent_comment_id,author_name,author_role,content,created_at')
        .in('post_id', posts.map(function (post) { return post.id; }))
        .order('created_at', { ascending: true }).limit(300);
      if (commentResult.error) throw commentResult.error;
      comments = commentResult.data || [];
      var reactionResult = await supa.rpc('social_reaction_summary', {
        p_post_ids: posts.map(function (post) { return post.id; })
      });
      if (reactionResult.error) throw reactionResult.error;
      reactions = Array.isArray(reactionResult.data) ? reactionResult.data : [];
    }
    return { posts: posts, comments: comments, reactions: reactions, notifications: notificationResult.data || [], ownPending: ownPending, ownPendingError: ownPendingError };
  }
  async function refreshNews() {
    var c = document.getElementById('newsContent');
    if (!c) return;
    c.innerHTML = '<div style="text-align:center;padding:28px;color:#78909C;">⏳ جاري تحديث الموجز...</div>';
    try {
      renderFeed(await fetchFeed());
    } catch (error) {
      console.error('[social-news] refresh failed', error);
      c.innerHTML = '<div style="background:#fff;padding:18px;border-radius:14px;color:#B71C1C;line-height:1.8;">تعذر تحميل أخبار فيسبوك. تأكدي من الاتصال بالإنترنت ثم اضغطي تحديث.<br><small>' + escapeHtml(error && error.message || '') + '</small></div>';
    }
  }
  function renderFeed(data) {
    var c = document.getElementById('newsContent');
    if (!c) return;
    var commentsByPost = {};
    var repliesByComment = {};
    var reactionsByPost = {};
    (data.comments || []).forEach(function (comment) {
      if (comment.parent_comment_id) {
        if (!repliesByComment[comment.parent_comment_id]) repliesByComment[comment.parent_comment_id] = [];
        repliesByComment[comment.parent_comment_id].push(comment);
      } else {
        if (!commentsByPost[comment.post_id]) commentsByPost[comment.post_id] = [];
        commentsByPost[comment.post_id].push(comment);
      }
    });
    (data.reactions || []).forEach(function (item) { reactionsByPost[item.post_id] = item; });
    var html = '<div style="max-width:820px;margin:0 auto;padding:4px 0 28px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;"><div style="font-weight:800;color:#174A7C;font-size:18px;">أخبار مجتمع تعليمي</div><button type="button" id="socialRefreshBtn" style="border:0;background:#EAF3FF;color:#1565C0;padding:8px 11px;border-radius:10px;font-weight:700;">تحديث</button></div>';
    if (role() === 'owner') html += ownerPanelMarkup();
    html += renderNotifications(data.notifications);
    if (data.ownPending && data.ownPending.length) {
      html += '<section style="background:#FFF9E8;border-radius:15px;padding:13px;margin-bottom:16px;"><div style="font-weight:800;color:#795548;">منشوراتك قيد المراجعة (' + data.ownPending.length + ')</div>';
      data.ownPending.forEach(function (post) { html += pendingSummary(post); });
      html += '</section>';
    }
    if (data.ownPendingError) {
      html += '<div style="background:#FFF8E1;color:#795548;border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;">تعذر تحميل حالة منشوراتك قيد المراجعة؛ اضغطي تحديث للمحاولة مرة أخرى.</div>';
    }
    if (!data.posts.length) {
      html += '<div style="background:#fff;text-align:center;border-radius:16px;padding:28px 16px;color:#607D8B;box-shadow:0 3px 12px rgba(0,0,0,.05);"><div style="font-size:34px;">📰</div><p style="margin:8px 0 4px;font-weight:700;">لا توجد منشورات منشورة بعد</p><p style="font-size:13px;margin:0;">كوني أول من يشارك شيئًا مفيدًا؛ سيظهر المنشور بعد موافقة المالك.</p></div>';
    } else {
      data.posts.forEach(function (post) { html += renderPost(post, commentsByPost[post.id] || [], false, reactionsByPost[post.id], repliesByComment); });
    }
    html += '</div>';
    c.innerHTML = html;
    var refresh = document.getElementById('socialRefreshBtn');
    if (refresh) refresh.onclick = refreshNews;
    c.querySelectorAll('[data-social-comment]').forEach(function (button) {
      button.addEventListener('click', function () { window.addComment(button.getAttribute('data-social-comment')); });
    });
    c.querySelectorAll('[data-social-reply]').forEach(function (button) {
      button.addEventListener('click', function () {
        var form = document.getElementById('socialReplyForm-' + button.getAttribute('data-social-reply'));
        if (form) { form.style.display = form.style.display === 'flex' ? 'none' : 'flex'; }
      });
    });
    c.querySelectorAll('[data-social-send-reply]').forEach(function (button) {
      button.addEventListener('click', function () {
        var container = button.closest('[id^="commentsList-"]');
        var postId = container ? container.id.substring('commentsList-'.length) : '';
        window.addSocialReply(postId, button.getAttribute('data-social-send-reply'));
      });
    });
    c.querySelectorAll('[data-social-mark-notifications]').forEach(function (button) {
      button.addEventListener('click', window.markSocialNotificationsRead);
    });
    c.querySelectorAll('[data-social-reaction-post]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.toggleSocialReaction(button.getAttribute('data-social-reaction-post'), button.getAttribute('data-social-reaction'));
      });
    });
    c.querySelectorAll('[data-social-delete-comment]').forEach(function (button) {
      button.addEventListener('click', function () {
        var item = button.getAttribute('data-social-delete-comment');
        var parent = button.closest('[id^="commentsList-"]');
        var postId = parent ? parent.id.substring('commentsList-'.length) : '';
        window.deleteComment(postId, item);
      });
    });
    c.querySelectorAll('[data-social-admin-status]').forEach(function (button) {
      button.addEventListener('click', function () { loadAdminPosts(button.getAttribute('data-social-admin-status')); });
    });
    var statsButton = document.getElementById('socialStatsBtn');
    if (statsButton) statsButton.addEventListener('click', loadAdminStats);
    if (role() === 'owner' && moderationKey) loadAdminPosts(adminStatus, false);
  }
  window.openNews = async function () {
    if (!appUid()) { toast('سجّلي الدخول إلى المنصة أولًا.'); return; }
    ensureNewsScreen();
    ensureComposerScreen();
    if (window.screenHistory) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('newsScreen');
    var c = document.getElementById('newsContent');
    if (c) c.innerHTML = '<div style="text-align:center;padding:28px;color:#78909C;">⏳ جاري تحميل الموجز...</div>';
    await refreshNews();
  };
  window.openAddNews = function () {
    if (!appUid()) { toast('سجّلي الدخول إلى المنصة أولًا.'); return; }
    ensureComposerScreen();
    if (window.screenHistory) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('socialComposeScreen');
    var author = document.getElementById('socialComposeAuthor');
    if (author) author.textContent = displayName() + ' · ' + roleLabel(role());
  };
  window.publishNews = async function () {
    var textEl = document.getElementById('socialPostText');
    var imageEl = document.getElementById('socialPostImage');
    var videoEl = document.getElementById('socialPostVideo');
    var button = document.getElementById('socialPublishBtn');
    var content = String(textEl && textEl.value || '').trim();
    var image = imageEl && imageEl.files && imageEl.files[0];
    var video = videoEl && videoEl.files && videoEl.files[0];
    if (content.length > maxTextLength) { toast('النص أطول من الحد المسموح.'); return; }
    if (!content && !image && !video) { toast('اكتبي نصًا أو أرفقي صورة أو فيديو.'); return; }
    if (image && (!String(image.type || '').toLowerCase().startsWith('image/') || image.size > maxImageBytes)) {
      toast('اختاري صورة صالحة لا يتجاوز حجمها 10 ميغابايت.'); return;
    }
    if (video && (!/^video\/(mp4|webm|quicktime)$/i.test(String(video.type || '')) || video.size > maxVideoBytes)) {
      toast('اختاري فيديو MP4 أو WebM أو MOV لا يتجاوز حجمه 25 ميغابايت.'); return;
    }
    if (!window.uploadFile) { toast('خدمة رفع الوسائط غير جاهزة؛ حدّثي الصفحة.'); return; }
    if (button) { button.disabled = true; button.textContent = '⏳ جاري الإرسال للمراجعة...'; }
    try {
      await ensureIdentity();
      var imageUrl = image ? await window.uploadFile(image, 'social-news/images') : null;
      var videoUrl = video ? await window.uploadFile(video, 'social-news/videos') : null;
      if (image && !imageUrl) throw new Error('Image upload failed.');
      if (video && !videoUrl) throw new Error('Video upload failed.');
      if (imageUrl && !safeCloudinaryUrl(imageUrl, 'image')) throw new Error('تعذر التحقق من رابط الصورة المرفوعة.');
      if (videoUrl && !safeCloudinaryUrl(videoUrl, 'video')) throw new Error('تعذر التحقق من رابط الفيديو المرفوع.');
      var supa = ensureClient();
      var result = await supa.from('social_posts').insert({
        author_id: authUser.id,
        app_user_id: appUid(),
        author_name: displayName(),
        author_role: role(),
        content: content,
        image_url: imageUrl,
        video_url: videoUrl
      });
      if (result.error) throw result.error;
      if (textEl) textEl.value = '';
      if (imageEl) imageEl.value = '';
      if (videoEl) videoEl.value = '';
      var counter = document.getElementById('socialPostCount');
      if (counter) counter.textContent = '0';
      toast('✅ وصل المنشور للمالك للمراجعة؛ سيظهر بعد الموافقة.');
      if (typeof window.goBack === 'function') window.goBack();
      else if (typeof window.showScreen === 'function') window.showScreen('newsScreen');
      await refreshNews();
    } catch (error) {
      console.error('[social-news] publish failed', error);
      toast('❌ تعذر إرسال المنشور. تأكدي من الاتصال وحجم الملفات ثم حاولي مرة أخرى.');
    } finally {
      if (button) { button.disabled = false; button.textContent = '📤 إرسال للمراجعة'; }
    }
  };
  window.addComment = async function (postId) {
    var input = document.getElementById('commentInput-' + postId);
    var content = String(input && input.value || '').trim();
    if (!content || content.length > maxCommentLength) { toast('اكتبي تعليقًا من 1 إلى 1000 حرف.'); return; }
    try {
      await ensureIdentity();
      var result = await ensureClient().from('social_comments').insert({
        post_id: postId,
        author_id: authUser.id,
        app_user_id: appUid(),
        author_name: displayName(),
        author_role: role(),
        content: content
      });
      if (result.error) throw result.error;
      toast('✅ تم إضافة التعليق.');
      await refreshNews();
    } catch (error) {
      console.error('[social-news] comment failed', error);
      toast('❌ تعذر إضافة التعليق؛ قد يكون المنشور غير متاح أو يحتاج تحديثًا.');
    }
  };
  window.addSocialReply = async function (postId, parentCommentId) {
    var input = document.getElementById('socialReplyInput-' + parentCommentId);
    var content = String(input && input.value || '').trim();
    if (!content || content.length > maxCommentLength) { toast('اكتب ردًا من 1 إلى 1000 حرف.'); return; }
    try {
      await ensureIdentity();
      var result = await ensureClient().from('social_comments').insert({
        post_id: postId,
        parent_comment_id: parentCommentId,
        author_id: authUser.id,
        app_user_id: appUid(),
        author_name: displayName(),
        author_role: role(),
        content: content
      });
      if (result.error) throw result.error;
      toast('✅ تم إضافة الرد.');
      await refreshNews();
    } catch (error) {
      console.error('[social-news] reply failed', error);
      toast('تعذر إضافة الرد؛ تأكد من أن التعليق على منشور معتمد.');
    }
  };
  window.markSocialNotificationsRead = async function () {
    try {
      await ensureIdentity();
      var result = await ensureClient().from('social_notifications')
        .update({ is_read: true }).eq('recipient_id', authUser.id).eq('is_read', false);
      if (result.error) throw result.error;
      await refreshNews();
    } catch (error) {
      console.error('[social-news] notification update failed', error);
      toast('تعذر تحديث الإشعارات؛ حاولي مرة أخرى.');
    }
  };
  window.toggleSocialReaction = async function (postId, reaction) {
    if (!postId || !reactionOptions.some(function (item) { return item.key === reaction; })) {
      toast('اختاري تفاعلًا صالحًا.');
      return;
    }
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-social-reaction-post]')).filter(function (button) {
      return button.getAttribute('data-social-reaction-post') === postId;
    });
    buttons.forEach(function (button) { button.disabled = true; });
    try {
      await ensureIdentity();
      var result = await ensureClient().rpc('social_toggle_reaction', {
        p_post_id: postId,
        p_reaction: reaction
      });
      if (result.error) throw result.error;
      await refreshNews();
    } catch (error) {
      console.error('[social-news] reaction failed', error);
      buttons.forEach(function (button) { button.disabled = false; });
      toast('تعذر تسجيل التفاعل؛ تأكدي من الاتصال ثم حاولي مرة أخرى.');
    }
  };
  window.loadComments = async function () { return refreshNews(); };
  async function loadAdminPosts(status, useInput) {
    if (role() !== 'owner') { toast('هذه القائمة للمالك فقط.'); return; }
    var input = document.getElementById('socialAdminKey');
    var key = useInput === false ? moderationKey : String(input && input.value || moderationKey).trim();
    if (!key) { toast('أدخلي مفتاح إدارة الاقتراحات والشكاوى.'); if (input) input.focus(); return; }
    try {
      await ensureIdentity();
      var result = await ensureClient().rpc('social_admin_list', { p_admin_key: key, p_status: status || 'pending' });
      if (result.error) throw result.error;
      moderationKey = key;
      adminStatus = status || 'pending';
      adminPosts = Array.isArray(result.data) ? result.data : [];
      renderAdminQueue();
      if (input) input.value = '';
      if (useInput !== false) await refreshNews();
    } catch (error) {
      console.error('[social-news] admin list failed', error);
      moderationKey = '';
      if (input) input.value = '';
      toast('تعذر التحقق من مفتاح الإدارة أو تحميل المنشورات. استخدمي مفتاح قسم الاقتراحات والشكاوى نفسه.');
    }
  }
  async function loadAdminStats() {
    if (role() !== 'owner') { toast('الإحصائيات للمالك فقط.'); return; }
    var input = document.getElementById('socialAdminKey');
    var key = String(input && input.value || moderationKey).trim();
    if (!key) { toast('أدخلي مفتاح إدارة الاقتراحات والشكاوى أولًا.'); if (input) input.focus(); return; }
    try {
      await ensureIdentity();
      var result = await ensureClient().rpc('social_admin_stats', { p_admin_key: key });
      if (result.error) throw result.error;
      moderationKey = key;
      if (input) input.value = '';
      renderAdminStats(result.data || {});
    } catch (error) {
      console.error('[social-news] stats failed', error);
      if (input) input.value = '';
      toast('تعذر تحميل الإحصائيات. تحققي من مفتاح المالك والاتصال.');
    }
  }
  function renderAdminQueue() {
    var queue = document.getElementById('socialAdminQueue');
    if (!queue) return;
    if (!adminPosts.length) {
      queue.innerHTML = '<div style="background:#fff;border-radius:10px;padding:12px;color:#607D8B;font-size:13px;">لا توجد منشورات في هذه القائمة.</div>';
      return;
    }
    queue.innerHTML = adminPosts.map(function (post) {
      var actions = '<button type="button" data-social-edit-post="' + escapeHtml(post.id) + '" style="border:0;border-radius:8px;padding:8px 10px;background:#E3F2FD;color:#1565C0;font-weight:700;">تعديل النص</button>';
      if (post.status === 'pending') {
        actions += '<button type="button" data-social-approve-post="' + escapeHtml(post.id) + '" style="border:0;border-radius:8px;padding:8px 10px;background:#2E7D32;color:white;font-weight:700;">موافقة ونشر</button>';
      }
      actions += '<button type="button" data-social-delete-post="' + escapeHtml(post.id) + '" style="border:0;border-radius:8px;padding:8px 10px;background:#FFEBEE;color:#C62828;font-weight:700;">حذف</button>';
      return '<article style="background:#fff;border-radius:12px;padding:12px;margin-top:10px;border:1px solid #DCE7F2;">' +
        '<div style="font-size:12px;color:#546E7A;margin-bottom:6px;">' + escapeHtml(post.author_name || 'عضو') + ' · الدور المعلن: ' + escapeHtml(roleLabel(post.author_role)) + ' · ' + escapeHtml(dateLabel(post.created_at)) + '</div>' +
        (post.content ? '<div style="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.65;">' + escapeHtml(post.content) + '</div>' : '') + renderMedia(post) +
        '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;">' + actions + '</div></article>';
    }).join('');
    queue.querySelectorAll('[data-social-edit-post]').forEach(function (button) {
      button.onclick = function () { editPost(button.getAttribute('data-social-edit-post')); };
    });
    queue.querySelectorAll('[data-social-approve-post]').forEach(function (button) {
      button.onclick = function () { decidePost(button.getAttribute('data-social-approve-post'), 'approve'); };
    });
    queue.querySelectorAll('[data-social-reject-post]').forEach(function (button) {
      button.onclick = function () { decidePost(button.getAttribute('data-social-reject-post'), 'reject'); };
    });
    queue.querySelectorAll('[data-social-delete-post]').forEach(function (button) {
      button.onclick = function () { decidePost(button.getAttribute('data-social-delete-post'), 'delete'); };
    });
  }
  async function editPost(postId) {
    var post = adminPosts.find(function (item) { return String(item.id) === String(postId); });
    if (!post || !moderationKey) return;
    var text = window.prompt('عدّلي نص المنشور. اتركيه فارغًا إذا كان يحتوي على صورة أو فيديو:', post.content || '');
    if (text === null) return;
    if (text.length > maxTextLength) { toast('النص أطول من 3000 حرف.'); return; }
    try {
      var result = await ensureClient().rpc('social_admin_edit', {
        p_admin_key: moderationKey, p_post_id: postId, p_content: text
      });
      if (result.error) throw result.error;
      toast('✅ تم تعديل المنشور.');
      await refreshNews();
    } catch (error) {
      console.error('[social-news] edit failed', error);
      toast('تعذر تعديل المنشور.');
    }
  }
  async function decidePost(postId, action) {
    if (!moderationKey) { toast('أدخلي مفتاح إدارة المالك أولًا.'); return; }
    var prompts = { approve: 'نشر هذا المنشور بعد مراجعته؟', reject: 'رفض المنشور؟ لن يظهر للآخرين.', delete: 'حذف المنشور وتعليقاته نهائيًا؟' };
    if (!window.confirm(prompts[action] || 'متابعة الإجراء؟')) return;
    try {
      var result = await ensureClient().rpc('social_admin_decide', {
        p_admin_key: moderationKey, p_post_id: postId, p_action: action
      });
      if (result.error) throw result.error;
      toast(action === 'approve' ? '✅ تم اعتماد المنشور ونشره.' : action === 'reject' ? 'تم رفض المنشور.' : 'تم حذف المنشور.');
      await refreshNews();
    } catch (error) {
      console.error('[social-news] moderation failed', error);
      toast('تعذر تنفيذ الإجراء؛ أعيدي تحميل القائمة وحاولي مرة أخرى.');
    }
  }
  window.deleteNews = function (postId) { return decidePost(postId, 'delete'); };
  window.deleteComment = async function (postId, commentId) {
    if (role() !== 'owner' || !moderationKey) { toast('افتحي قائمة مراجعة المالك أولًا.'); return; }
    if (!window.confirm('حذف هذا التعليق؟')) return;
    try {
      var result = await ensureClient().rpc('social_admin_delete_comment', {
        p_admin_key: moderationKey, p_comment_id: commentId
      });
      if (result.error) throw result.error;
      toast('تم حذف التعليق.');
      await refreshNews();
    } catch (error) {
      console.error('[social-news] comment delete failed', error);
      toast('تعذر حذف التعليق.');
    }
  };
  function clearOwnerKeyOnLogout() {
    var previousLogout = window.logout;
    if (typeof previousLogout !== 'function' || previousLogout.__socialNewsWrapped) return;
    var wrapped = function () {
      moderationKey = '';
      adminPosts = [];
      var input = document.getElementById('socialAdminKey');
      if (input) input.value = '';
      return previousLogout.apply(this, arguments);
    };
    wrapped.__socialNewsWrapped = true;
    window.logout = wrapped;
  }

  ensureNewsScreen();
  ensureComposerScreen();
  updateEntryLabels();
  clearOwnerKeyOnLogout();
  window.addEventListener('load', function () { setTimeout(updateEntryLabels, 900); });
  console.log('✅ Facebook-style social news feed loaded');
})();
