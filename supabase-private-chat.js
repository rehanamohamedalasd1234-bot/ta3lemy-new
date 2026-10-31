/* Private chat backend for Al-Ostad Hafez Educational Platform.
 * Independent Supabase Auth identity; the private directory stores only the account display name and avatar.
 * All private data access is enforced by Supabase RLS and private Storage policies.
 */
(function () {
  'use strict';

  var config = window.SUPABASE_CHAT_CONFIG || {};
  var sdk = window.supabase;
  var client = null;
  var clientScope = '';

  var state = {
    mode: 'home', user: null, profile: null, homeTab: 'chats', conversationId: '', friend: null,
    messageChannel: null, requestsChannel: null, callsInboxChannel: null,
    call: null, peer: null, localStream: null, remoteStream: null,
    callRowChannel: null, candidateChannel: null, candidateQueue: [], pendingCandidates: [],
    missedTimer: null, disconnectTimer: null, recorder: null, recordingStream: null,
    incomingCallId: '', incomingCallTimer: null
  };
  var maxMediaBytes = 25 * 1024 * 1024;
  var legacyOpenPublicChat = window.openPublicChat;
  var legacySendMessage = window.sendMessage;
  var legacyLogout = window.logout;
  var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.log(message);
  }
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
    });
  }
  function appUser() { return window.currentUser || null; }
  function randomHandle() {
    var bytes = new Uint8Array(12);
    window.crypto.getRandomValues(bytes);
    var value = '';
    for (var i = 0; i < bytes.length; i++) value += alphabet[bytes[i] & 31];
    return value;
  }
  function randomFileToken() {
    var bytes = new Uint8Array(12);
    window.crypto.getRandomValues(bytes);
    return Array.prototype.map.call(bytes, function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
  }
  function memberLabel(value) {
    var name = value && typeof value === 'object' ? (value.display_name || value.name) : value;
    return String(name || 'مستخدم').trim() || 'مستخدم';
  }
  function avatarSource(profile) {
    var value = String(profile && profile.avatar_url || '').trim();
    return /^https:\/\//i.test(value) && value.length <= 2048 ? value : '';
  }
  function accountProfileDetails() {
    var account = appUser() || {};
    var displayName = String(account.displayName || account.display_name || account.name || '')
      .replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'عضو';
    var avatarKeys = ['photo_url', 'photoURL', 'avatar_url', 'avatarUrl'];
    var hasAvatar = false;
    var avatarValue = '';
    for (var i = 0; i < avatarKeys.length; i++) {
      if (Object.prototype.hasOwnProperty.call(account, avatarKeys[i])) {
        hasAvatar = true;
        avatarValue = account[avatarKeys[i]];
        break;
      }
    }
    var avatar = String(avatarValue || '').trim();
    if (!/^https:\/\//i.test(avatar) || avatar.length > 2048) avatar = null;
    return { display_name: displayName, avatar_url: avatar, has_avatar: hasAvatar };
  }
  async function hydrateAccountProfile() {
    var account = appUser();
    if (!account || !account.uid) return;
    var hasName = !!String(account.displayName || account.display_name || '').trim();
    var avatarKeys = ['photo_url', 'photoURL', 'avatar_url', 'avatarUrl'];
    var hasAvatar = avatarKeys.some(function (key) { return Object.prototype.hasOwnProperty.call(account, key); });
    if (hasName && hasAvatar) return;
    try {
      if (typeof db === 'undefined' || !db.collection) return;
      var role = account.role || window.currentRole;
      var collectionName = role === 'teacher' ? 'teacher_accounts' : 'users';
      var snapshot = await db.collection(collectionName).doc(String(account.uid)).get();
      if (!snapshot || !snapshot.exists) return;
      var data = snapshot.data() || {};
      if (!hasName) {
        var savedName = data.displayName || data.display_name || data.name;
        if (savedName) account.displayName = savedName;
      }
      if (!hasAvatar) {
        if (Object.prototype.hasOwnProperty.call(data, 'photo_url')) account.photo_url = data.photo_url;
        else if (Object.prototype.hasOwnProperty.call(data, 'photoURL')) account.photo_url = data.photoURL;
      }
    } catch (error) { console.warn('[private-chat] could not load the account avatar', error); }
  }
  function reportError(error, fallback) {
    console.error('[private-chat]', error);
    if (error && (error.code === '42501' || error.code === 'PGRST301')) {
      toast('تعذر الوصول الآمن إلى الدردشة. تحقق من الاتصال ثم أعد المحاولة.');
    } else {
      toast(fallback || 'حدث خطأ؛ حاول مرة أخرى بعد التأكد من الاتصال بالإنترنت.');
    }
  }
  function ensureClient() {
    if (!sdk || typeof sdk.createClient !== 'function' || !config.url || !config.publishableKey) {
      throw new Error('خدمة الدردشة لم تُحمّل. أعد فتح المنصة مع اتصال بالإنترنت.');
    }
    var currentAppUser = appUser();
    var scope = currentAppUser && currentAppUser.uid ? String(currentAppUser.uid) : 'guest';
    var nextScope = 'hafez-chat-' + encodeURIComponent(scope);
    if (client && clientScope !== nextScope) {
      var previousClient = client;
      [state.messageChannel, state.requestsChannel, state.callsInboxChannel, state.callRowChannel, state.candidateChannel].forEach(function (channel) {
        if (channel) { try { previousClient.removeChannel(channel); } catch (_) {} }
      });
      clearTimeout(state.missedTimer); clearTimeout(state.disconnectTimer); stopIncomingCallAlert();
      if (state.peer) { try { state.peer.close(); } catch (_) {} }
      if (state.localStream) state.localStream.getTracks().forEach(function (track) { track.stop(); });
      if (state.remoteStream) state.remoteStream.getTracks().forEach(function (track) { track.stop(); });
      state.messageChannel = null; state.requestsChannel = null; state.callsInboxChannel = null;
      state.callRowChannel = null; state.candidateChannel = null; state.call = null; state.peer = null;
      state.localStream = null; state.remoteStream = null; state.user = null; state.profile = null;
      state.conversationId = ''; state.friend = null; state.pendingCandidates = []; state.candidateQueue = [];
      var callUi = document.getElementById('spcActiveCall'); if (callUi) callUi.remove();
      var incomingUi = document.getElementById('spcIncomingCall'); if (incomingUi) incomingUi.remove();
    }
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
    }
    return client;
  }
  async function ensureIdentity() {
    ensureClient();
    var sessionResult = await client.auth.getSession();
    if (sessionResult.error) throw sessionResult.error;
    var user = sessionResult.data && sessionResult.data.session && sessionResult.data.session.user;
    if (!user) {
      var signIn = await client.auth.signInAnonymously();
      if (signIn.error) throw signIn.error;
      user = signIn.data && signIn.data.user;
    }
    if (!user || !user.id) throw new Error('تعذر إنشاء هوية الدردشة.');
    state.user = user;

    await hydrateAccountProfile();
    var details = accountProfileDetails();
    var existing = await client.from('chat_profiles').select('id,handle,display_name,avatar_url').eq('id', user.id).maybeSingle();
    if (existing.error) throw existing.error;
    if (existing.data) {
      var profileUpdate = { display_name: details.display_name };
      if (details.has_avatar) profileUpdate.avatar_url = details.avatar_url;
      var updated = await client.from('chat_profiles').update(profileUpdate).eq('id', user.id)
        .select('id,handle,display_name,avatar_url').single();
      if (updated.error) throw updated.error;
      state.profile = updated.data;
      return state.profile;
    }
    for (var attempt = 0; attempt < 5; attempt++) {
      var inserted = await client.from('chat_profiles')
        .insert({ id: user.id, handle: randomHandle(), display_name: details.display_name, avatar_url: details.avatar_url })
        .select('id,handle,display_name,avatar_url').single();
      if (!inserted.error && inserted.data) {
        state.profile = inserted.data;
        return state.profile;
      }
      if (inserted.error && inserted.error.code === '23505') continue;
      throw inserted.error || new Error('تعذر إنشاء ملف الحساب في الدردشة.');
    }
    throw new Error('تعذر إعداد حساب الدردشة؛ أعد المحاولة.');
  }
  function addChatStyles() {
    if (document.getElementById('supabasePrivateChatStyle')) return;
    var style = document.createElement('style');
    style.id = 'supabasePrivateChatStyle';
    style.textContent = [
      '.spc-note{background:#E8F5E9;border:1px solid #C8E6C9;color:#214C2B;padding:12px;border-radius:14px;line-height:1.8;font-size:13px;margin:8px 0 14px}',
      '.spc-code{font-weight:800;letter-spacing:2px;direction:ltr;display:inline-block;background:#fff;border:1px dashed #2E7D32;border-radius:8px;padding:4px 9px;color:#1B5E20}',
      '.spc-tabs{display:flex;gap:7px;overflow:auto;padding:3px 0 12px}',
      '.spc-tab{border:0;border-radius:20px;background:#edf3ee;color:#31563a;padding:9px 12px;font:inherit;font-size:12px;font-weight:700;white-space:nowrap}',
      '.spc-tab.active{background:#2E7D32;color:#fff}',
      '.spc-home-exit{border:0;border-radius:9px;background:#fff;color:#2E7D32;padding:8px 10px;font:inherit;font-size:12px;font-weight:800;white-space:nowrap;cursor:pointer;min-height:38px}',
      '.spc-card{background:#fff;border:1px solid #e6ece7;border-radius:14px;padding:12px;margin:0 0 9px;display:flex;align-items:center;gap:10px}',
      '.spc-avatar{width:44px;height:44px;flex:0 0 44px;border-radius:50%;background:#e8f5e9;color:#2E7D32;display:flex;align-items:center;justify-content:center;font-size:21px;overflow:hidden}.spc-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}',
      '.spc-info{flex:1;min-width:0}.spc-small{font-size:12px;color:#758078;margin-top:4px;overflow-wrap:anywhere}',
      '.spc-actions{display:flex;gap:6px;flex-wrap:wrap}.spc-btn{border:0;border-radius:9px;padding:9px 12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}',
      '.spc-green{background:#2E7D32;color:#fff}.spc-blue{background:#1976D2;color:#fff}.spc-red{background:#C62828;color:#fff}.spc-gray{background:#ecefec;color:#334438}',
      '.spc-search{display:flex;gap:8px;margin:8px 0 14px}.spc-search input{min-width:0;flex:1}',
      '.spc-chat-screen .content{padding-bottom:96px}.spc-messages{display:flex;flex-direction:column;gap:8px;padding:10px;overflow:auto;height:calc(100vh - 220px);box-sizing:border-box}',
      '.spc-bubble{max-width:88%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-break:break-word;line-height:1.7}',
      '.spc-bubble.mine{align-self:flex-end;background:#2E7D32;color:#fff}.spc-bubble.other{align-self:flex-start;background:#fff;color:#212121;border:1px solid #e6e6e6}',
      '.spc-time{font-size:10px;opacity:.7;display:block;margin-top:4px}',
      '.spc-media{display:block;max-width:min(76vw,380px);max-height:320px;border-radius:10px;margin-top:6px}',
      '.spc-composer{position:fixed;bottom:0;left:0;right:0;background:#fff;padding:9px;display:flex;align-items:center;gap:6px;z-index:150;box-shadow:0 -2px 10px #0001;box-sizing:border-box}',
      '.spc-composer input[type=text]{flex:1;min-width:0;padding:12px;border:1px solid #ddd;border-radius:20px;font:inherit}',
      '.spc-composer button{border:0;background:#2E7D32;color:#fff;min-width:42px;height:42px;border-radius:50%;font-size:18px}',
      '.spc-call-actions{display:flex;gap:5px}.spc-call-actions button{border:0;background:#ffffff30;color:#fff;border-radius:50%;width:36px;height:36px;font-size:17px}',
      '.spc-call{position:fixed;inset:0;z-index:100001;background:#14251a;color:#fff;display:flex;flex-direction:column;padding:14px;box-sizing:border-box}',
      '.spc-call-stage{position:relative;flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:18px;background:#20382a}',
      '.spc-remote-video{width:100%;height:100%;object-fit:cover}.spc-local-video{position:absolute;right:12px;top:12px;width:110px;height:150px;object-fit:cover;border:2px solid white;border-radius:12px;background:#334}',
      '.spc-call-controls{display:flex;justify-content:center;gap:14px;padding:16px}.spc-call-controls button{border:0;border-radius:50%;width:56px;height:56px;font-size:22px}',
      '.spc-incoming{position:fixed;z-index:100002;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;padding:20px}',
      '.spc-incoming-card{width:100%;max-width:360px;background:#fff;border-radius:20px;padding:22px;text-align:center;color:#233}',
      '.spc-incoming-card .spc-avatar{margin:8px auto;width:76px;height:76px;font-size:32px}'
    ].join('');
    document.head.appendChild(style);
  }
  function pushScreen(id) {
    if (window.screenHistory && window.currentScreen && window.currentScreen !== id) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen(id);
  }
  function returnToAppHome() {
    if (state.messageChannel) { stopChannel(state.messageChannel); state.messageChannel = null; }
    state.mode = 'home'; state.conversationId = ''; state.friend = null;
    if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
    if (Array.isArray(window.screenHistory)) window.screenHistory.length = 0;
  }
  function ensureHomeButton(screen) {
    if (!screen) return;
    var topBar = screen.querySelector('.top-bar');
    if (!topBar || topBar.querySelector('[data-spc-home]')) return;
    var button = document.createElement('button');
    button.type = 'button'; button.className = 'spc-home-exit';
    button.setAttribute('data-spc-home', 'true');
    button.setAttribute('aria-label', 'العودة إلى الشاشة الرئيسية');
    button.title = 'العودة إلى الشاشة الرئيسية'; button.textContent = 'الرئيسية';
    button.addEventListener('click', returnToAppHome);
    topBar.appendChild(button);
  }
  function currentHomeContent() {
    var screen = document.getElementById('messagesScreen');
    return screen && screen.querySelector('.content');
  }
  function makeHomeShell() {
    var content = currentHomeContent();
    if (!content) return null;
    ensureHomeButton(document.getElementById('messagesScreen'));
    content.innerHTML = [
      '<div id="spcIdentityNote" class="spc-note">جارٍ تجهيز هوية الدردشة…</div>',
      '<div class="spc-tabs" role="tablist">',
      '<button class="spc-tab active" data-spc-tab="chats">💬 محادثاتي</button>',
      '<button class="spc-tab" data-spc-tab="friends">👥 الأصدقاء</button>',
      '<button class="spc-tab" data-spc-tab="requests">📩 الطلبات</button>',
      '<button class="spc-tab" data-spc-tab="calls">📞 المكالمات</button></div>',
      '<button class="spc-btn spc-blue" id="spcGroupButton" style="width:100%;margin-bottom:12px">👥 افتح الدردشة الجماعية</button>',
      '<button class="spc-btn spc-gray" id="spcCallAlertButton" style="width:100%;margin-bottom:12px">🔔 تفعيل تنبيهات المكالمات</button>',
      '<div id="spcHomeContent"><div class="empty-state">جارٍ التحميل…</div></div>'
    ].join('');
    content.querySelectorAll('[data-spc-tab]').forEach(function (button) {
      button.addEventListener('click', function () { openHomeTab(button.getAttribute('data-spc-tab')); });
    });
    var groupButton = document.getElementById('spcGroupButton');
    if (groupButton) groupButton.onclick = window.openPublicChat;
    var callAlertButton = document.getElementById('spcCallAlertButton');
    if (window.HafezCallAlerts) window.HafezCallAlerts.bindButton(callAlertButton);
    return content;
  }
  function refreshIdentityNote() {
    var note = document.getElementById('spcIdentityNote');
    if (!note || !state.profile) return;
    note.textContent = 'حسابك ظاهر باسم: ' + memberLabel(state.profile) + ' — ابحث عن أصدقائك بالاسم أو اخترهم من القائمة.';
  }
  function rowCard(icon, title, subtitle, actions, photoUrl) {
    var row = document.createElement('div'); row.className = 'spc-card';
    var avatar = document.createElement('div'); avatar.className = 'spc-avatar';
    var fallback = icon || Array.from(String(title || 'مستخدم').trim())[0] || '👤';
    var imageUrl = avatarSource({ avatar_url: photoUrl });
    if (imageUrl) {
      var image = document.createElement('img'); image.src = imageUrl; image.alt = title || 'صورة الحساب';
      image.loading = 'lazy'; image.referrerPolicy = 'no-referrer';
      image.onerror = function () { image.remove(); avatar.textContent = fallback; };
      avatar.appendChild(image);
    } else avatar.textContent = fallback;
    var info = document.createElement('div'); info.className = 'spc-info';
    var name = document.createElement('b'); name.textContent = title || 'مستخدم';
    var detail = document.createElement('div'); detail.className = 'spc-small'; detail.textContent = subtitle || '';
    info.appendChild(name); info.appendChild(detail); row.appendChild(avatar); row.appendChild(info);
    if (actions) row.appendChild(actions);
    return row;
  }
  function actionButton(label, className, handler) {
    var button = document.createElement('button'); button.type = 'button'; button.className = 'spc-btn ' + (className || 'spc-green');
    button.textContent = label; button.onclick = handler; return button;
  }
  function twoActions(first, second) {
    var box = document.createElement('div'); box.className = 'spc-actions';
    box.appendChild(first); if (second) box.appendChild(second); return box;
  }
  function peerIdFromConversation(conversation) {
    return conversation.user_low === state.user.id ? conversation.user_high : conversation.user_low;
  }
  async function profilesById(ids) {
    var unique = Array.from(new Set((ids || []).filter(Boolean)));
    if (!unique.length) return {};
    var result = await client.from('chat_profiles').select('id,display_name,avatar_url').in('id', unique);
    if (result.error) throw result.error;
    var map = {};
    (result.data || []).forEach(function (profile) { map[profile.id] = profile; });
    return map;
  }
  async function openHomeTab(tab) {
    if (!client || !state.user) return;
    state.homeTab = tab || 'chats';
    document.querySelectorAll('[data-spc-tab]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-spc-tab') === state.homeTab);
    });
    var box = document.getElementById('spcHomeContent');
    if (!box) return;
    box.innerHTML = '<div class="empty-state">⏳ جارٍ التحميل…</div>';
    try {
      if (state.homeTab === 'friends') return await renderFriends(box);
      if (state.homeTab === 'requests') return await renderRequests(box);
      if (state.homeTab === 'calls') return await renderCallHistory(box);
      return await renderChats(box);
    } catch (error) { reportError(error, 'تعذر تحميل هذا القسم. تحقق من الشبكة وحاول مجددًا.'); }
  }
  async function renderChats(box) {
    var uid = state.user.id;
    var result = await client.from('chat_conversations')
      .select('id,user_low,user_high,updated_at')
      .or('user_low.eq.' + uid + ',user_high.eq.' + uid)
      .order('updated_at', { ascending: false }).limit(100);
    if (result.error) throw result.error;
    var conversations = result.data || [];
    box.innerHTML = '';
    var search = actionButton('➕ ابحث عن صديق بالاسم', 'spc-blue', function () { openHomeTab('friends'); });
    search.style.marginBottom = '10px'; box.appendChild(search);
    if (!conversations.length) {
      var empty = document.createElement('div'); empty.className = 'empty-state';
      empty.innerHTML = '<div class="empty-state-icon">💬</div><p>لا توجد محادثات بعد.</p><p style="font-size:12px">اختر صديقًا بالاسم من قسم الأصدقاء وأرسل له طلبًا.</p>';
      box.appendChild(empty); return;
    }
    var peers = await profilesById(conversations.map(peerIdFromConversation));
    conversations.forEach(function (conversation) {
      var peer = peers[peerIdFromConversation(conversation)] || {};
      var time = conversation.updated_at ? new Date(conversation.updated_at).toLocaleDateString('ar-EG') : '';
      var open = actionButton('فتح', 'spc-green', function () { window.openChat(conversation.id, peer.id, peer); });
      box.appendChild(rowCard('💬', memberLabel(peer), time ? 'آخر نشاط: ' + time : 'محادثة خاصة', open, peer.avatar_url));
    });
  }
  async function acceptedFriendRequests() {
    var uid = state.user.id;
    var result = await client.from('chat_friend_requests').select('id,sender_id,recipient_id,status,created_at')
      .eq('status', 'accepted').or('sender_id.eq.' + uid + ',recipient_id.eq.' + uid)
      .order('updated_at', { ascending: false }).limit(200);
    if (result.error) throw result.error;
    return result.data || [];
  }
  async function renderFriends(box) {
    box.innerHTML = '';
    var help = document.createElement('div'); help.className = 'spc-note';
    help.textContent = 'ابحث باسم صاحب الحساب أو اختره من القائمة. أصدقاؤك وطلباتك محفوظة؛ والحسابات القديمة تظهر بعد فتح أصحابها للمنصة مرة واحدة.';
    box.appendChild(help);
    var searchBar = document.createElement('div'); searchBar.className = 'spc-search';
    var input = document.createElement('input'); input.type = 'search'; input.className = 'form-input'; input.maxLength = 80;
    input.autocomplete = 'off'; input.placeholder = 'ابحث باسم صاحب الحساب';
    var clear = actionButton('مسح', 'spc-gray', function () { input.value = ''; updateDirectorySearch(); input.focus(); });
    searchBar.appendChild(input); searchBar.appendChild(clear); box.appendChild(searchBar);

    var friendsTitle = document.createElement('h3'); friendsTitle.textContent = 'أصدقائي'; box.appendChild(friendsTitle);
    var friendsBox = document.createElement('div'); box.appendChild(friendsBox);
    var suggestionsTitle = document.createElement('h3'); suggestionsTitle.textContent = 'اقتراحات صداقة'; suggestionsTitle.style.marginTop = '18px'; box.appendChild(suggestionsTitle);
    var suggestionsBox = document.createElement('div'); box.appendChild(suggestionsBox);
    var directoryTitle = document.createElement('h3'); directoryTitle.textContent = 'كل الحسابات'; directoryTitle.style.marginTop = '18px'; box.appendChild(directoryTitle);
    var directoryBox = document.createElement('div'); box.appendChild(directoryBox);
    var loadMoreButton = actionButton('عرض المزيد', 'spc-gray', function () { loadDirectoryPage(false); });
    loadMoreButton.style.display = 'none'; box.appendChild(loadMoreButton);

    var uid = state.user.id;
    var requestResult = await client.from('chat_friend_requests')
      .select('id,sender_id,recipient_id,status,created_at,updated_at')
      .or('sender_id.eq.' + uid + ',recipient_id.eq.' + uid)
      .order('updated_at', { ascending: false }).limit(1000);
    if (requestResult.error) throw requestResult.error;

    var directory = [];
    var directoryOffset = 0;
    var directoryQuery = '';
    var directoryHasMore = false;
    var directoryRequestToken = 0;
    var relationships = {};
    (requestResult.data || []).forEach(function (request) {
      var otherId = request.sender_id === uid ? request.recipient_id : request.sender_id;
      if (!relationships[otherId]) relationships[otherId] = request;
    });
    var friendIds = Array.from(new Set((requestResult.data || []).filter(function (request) {
      return request.status === 'accepted';
    }).map(function (request) { return request.sender_id === uid ? request.recipient_id : request.sender_id; })));
    var friendProfiles = await profilesById(friendIds);
    friendsBox.innerHTML = '';
    if (!friendIds.length) friendsBox.innerHTML = '<div class="empty-state">لا توجد صداقات بعد. اختر حسابًا من الاقتراحات أو القائمة.</div>';
    friendIds.forEach(function (id) {
      var profile = friendProfiles[id] || { id: id, display_name: 'مستخدم' };
      var message = actionButton('مراسلة', 'spc-green', function () { openConversationFor(id, profile); });
      friendsBox.appendChild(rowCard('👤', memberLabel(profile), 'صديق', message, profile.avatar_url));
    });

    function accountAction(profile) {
      var prior = relationships[profile.profile_id];
      if (prior && prior.status === 'accepted') {
        return actionButton('مراسلة', 'spc-green', function () { openConversationFor(profile.profile_id, profile); });
      }
      if (prior && prior.status === 'pending') {
        var pendingButton = actionButton(prior.sender_id === uid ? 'تم إرسال الطلب' : 'الطلبات الواردة', 'spc-gray', function () {
          openHomeTab('requests');
        });
        if (prior.sender_id === uid) pendingButton.disabled = true;
        return pendingButton;
      }
      return actionButton('إضافة صديق', 'spc-blue', function () { sendFriendRequest(profile); });
    }
    function appendAccounts(target, list, emptyText) {
      target.innerHTML = '';
      if (!list.length) { target.innerHTML = '<div class="spc-small">' + emptyText + '</div>'; return; }
      list.forEach(function (profile) {
        var relation = relationships[profile.profile_id];
        var status = relation && relation.status === 'accepted' ? 'صديق'
          : relation && relation.status === 'pending' ? (relation.sender_id === uid ? 'طلب صداقة مُرسل' : 'أرسل لك طلب صداقة')
          : 'حساب على المنصة';
        target.appendChild(rowCard('👤', memberLabel(profile), status, accountAction(profile), profile.avatar_url));
      });
    }
    function renderSuggestions() {
      var candidates = directory.filter(function (profile) { return !relationships[profile.profile_id]; });
      for (var i = candidates.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temporary = candidates[i]; candidates[i] = candidates[j]; candidates[j] = temporary;
      }
      appendAccounts(suggestionsBox, candidates.slice(0, 8), 'ستظهر اقتراحات عند توافر حسابات أخرى.');
    }
    async function loadDirectoryPage(reset) {
      if (reset) {
        directoryQuery = String(input.value || '').trim();
        directory = []; directoryOffset = 0; directoryHasMore = true;
        directoryRequestToken++;
        directoryBox.innerHTML = '<div class="spc-small">⏳ جارٍ تحميل الحسابات…</div>';
      }
      if (!directoryHasMore) return;
      var token = directoryRequestToken;
      loadMoreButton.disabled = true;
      try {
        var response = await client.rpc('chat_list_directory_page', {
          p_query: directoryQuery, p_limit: 100, p_offset: directoryOffset
        });
        if (response.error) throw response.error;
        if (token !== directoryRequestToken) return;
        var page = (response.data || []).map(function (profile) {
          return { profile_id: profile.profile_id, display_name: profile.display_name, avatar_url: profile.avatar_url };
        });
        directory = directory.concat(page);
        directoryOffset += page.length;
        directoryHasMore = page.length === 100;
        appendAccounts(directoryBox, directory, directoryQuery
          ? 'لا توجد حسابات بهذا الاسم.'
          : 'ستظهر الحسابات القديمة هنا بعد فتح أصحابها المنصة مرة واحدة.');
        loadMoreButton.style.display = directoryHasMore ? '' : 'none';
        if (!directoryQuery) renderSuggestions();
      } catch (error) {
        if (token === directoryRequestToken) {
          directoryBox.innerHTML = '<div class="spc-small">تعذر تحميل الحسابات؛ حاول مرة أخرى.</div>';
          loadMoreButton.style.display = 'none';
          reportError(error, 'تعذر تحميل الحسابات.');
        }
      } finally {
        if (token === directoryRequestToken) loadMoreButton.disabled = false;
      }
    }
    var searchTimer = null;
    function updateDirectorySearch() {
      var hasQuery = !!String(input.value || '').trim();
      suggestionsTitle.style.display = hasQuery ? 'none' : '';
      suggestionsBox.style.display = hasQuery ? 'none' : '';
      if (searchTimer) window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () { loadDirectoryPage(true); }, 250);
    }
    input.addEventListener('input', updateDirectorySearch);
    await loadDirectoryPage(true);
  }
  async function requestBetween(userA, userB) {
    var first = await client.from('chat_friend_requests').select('id,sender_id,recipient_id,status')
      .eq('sender_id', userA).eq('recipient_id', userB).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (first.error) throw first.error;
    if (first.data) return first.data;
    var second = await client.from('chat_friend_requests').select('id,sender_id,recipient_id,status')
      .eq('sender_id', userB).eq('recipient_id', userA).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (second.error) throw second.error;
    return second.data || null;
  }
  async function sendFriendRequest(profile) {
    try {
      var prior = await requestBetween(state.user.id, profile.profile_id);
      if (prior && prior.status === 'accepted') return toast('أنتما صديقان بالفعل.');
      if (prior && prior.status === 'pending') return toast('يوجد طلب صداقة معلّق بالفعل.');
      var result = await client.from('chat_friend_requests').insert({
        sender_id: state.user.id, recipient_id: profile.profile_id, status: 'pending'
      });
      if (result.error) throw result.error;
      toast('تم إرسال طلب الصداقة إلى صاحب الحساب.');
      openHomeTab('friends');
    } catch (error) { reportError(error, 'تعذر إرسال الطلب.'); }
  }
  async function renderRequests(box) {
    var uid = state.user.id;
    var result = await client.from('chat_friend_requests').select('id,sender_id,recipient_id,status,created_at')
      .or('sender_id.eq.' + uid + ',recipient_id.eq.' + uid)
      .order('created_at', { ascending: false }).limit(100);
    if (result.error) throw result.error;
    var requests = result.data || [];
    var pending = requests.filter(function (request) { return request.status === 'pending'; });
    var profiles = await profilesById(pending.map(function (request) { return request.sender_id === uid ? request.recipient_id : request.sender_id; }));
    box.innerHTML = '';
    var incomingTitle = document.createElement('h3'); incomingTitle.textContent = 'طلبات واردة'; box.appendChild(incomingTitle);
    var incoming = pending.filter(function (request) { return request.recipient_id === uid; });
    if (!incoming.length) { var none = document.createElement('div'); none.className = 'spc-small'; none.textContent = 'لا توجد طلبات واردة.'; box.appendChild(none); }
    incoming.forEach(function (request) {
      var profile = profiles[request.sender_id] || {};
      var actions = twoActions(
        actionButton('قبول', 'spc-green', function () { answerFriendRequest(request.id, 'accepted'); }),
        actionButton('رفض', 'spc-red', function () { answerFriendRequest(request.id, 'rejected'); })
      );
      box.appendChild(rowCard('📩', memberLabel(profile), 'طلب صداقة وارد', actions, profile.avatar_url));
    });
    var outgoingTitle = document.createElement('h3'); outgoingTitle.textContent = 'طلبات أرسلتها'; outgoingTitle.style.marginTop = '18px'; box.appendChild(outgoingTitle);
    var outgoing = pending.filter(function (request) { return request.sender_id === uid; });
    if (!outgoing.length) { var noneOut = document.createElement('div'); noneOut.className = 'spc-small'; noneOut.textContent = 'لا توجد طلبات معلقة أرسلتها.'; box.appendChild(noneOut); }
    outgoing.forEach(function (request) {
      var profile = profiles[request.recipient_id] || {};
      box.appendChild(rowCard('⏳', memberLabel(profile), 'بانتظار قبول طلب الصداقة', null, profile.avatar_url));
    });
  }
  async function answerFriendRequest(requestId, status) {
    try {
      var result = await client.from('chat_friend_requests').update({ status: status })
        .eq('id', requestId).eq('recipient_id', state.user.id).eq('status', 'pending');
      if (result.error) throw result.error;
      toast(status === 'accepted' ? 'تم قبول الصداقة؛ أصبحت المحادثة متاحة.' : 'تم رفض الطلب.');
      openHomeTab('requests');
    } catch (error) { reportError(error, 'تعذر تحديث طلب الصداقة.'); }
  }
  async function openConversationFor(friendId, profile) {
    try {
      var result = await client.rpc('chat_open_conversation', { p_other_user: friendId });
      if (result.error) throw result.error;
      var friendProfile = profile && typeof profile === 'object' ? profile : { display_name: String(profile || 'مستخدم') };
      await window.openChat(result.data, friendId, friendProfile);
    } catch (error) { reportError(error, 'لا يمكن فتح المحادثة قبل قبول طلب الصداقة.'); }
  }
  async function renderCallHistory(box) {
    var uid = state.user.id;
    var result = await client.from('chat_calls')
      .select('id,conversation_id,caller_id,callee_id,call_type,status,created_at')
      .or('caller_id.eq.' + uid + ',callee_id.eq.' + uid)
      .order('created_at', { ascending: false }).limit(50);
    if (result.error) throw result.error;
    var calls = result.data || [];
    box.innerHTML = '';
    if (!calls.length) { box.innerHTML = '<div class="empty-state">لا توجد مكالمات بعد.</div>'; return; }
    var peers = await profilesById(calls.map(function (call) { return call.caller_id === uid ? call.callee_id : call.caller_id; }));
    var labels = { ringing: 'يرن', active: 'تم الاتصال', rejected: 'مرفوضة', missed: 'فائتة', busy: 'مشغول', ended: 'منتهية' };
    calls.forEach(function (call) {
      var other = call.caller_id === uid ? call.callee_id : call.caller_id;
      var profile = peers[other] || {};
      var when = call.created_at ? new Date(call.created_at).toLocaleString('ar-EG') : '';
      box.appendChild(rowCard(call.call_type === 'video' ? '📹' : '📞', memberLabel(profile), (labels[call.status] || call.status) + (when ? ' • ' + when : ''), null, profile.avatar_url));
    });
  }
  function stopChannel(channel) {
    if (!channel || !client) return;
    try { client.removeChannel(channel); } catch (error) { console.warn(error); }
  }
  function listenForInbox() {
    if (!client || !state.user) return;
    if (!state.requestsChannel) {
      state.requestsChannel = client.channel('spc-requests-' + state.user.id)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_friend_requests', filter: 'recipient_id=eq.' + state.user.id }, function () {
          if (state.mode === 'home' && state.homeTab === 'requests') openHomeTab('requests');
        }).subscribe();
    }
    if (!state.callsInboxChannel) {
      var inboxUserId = state.user.id;
      state.callsInboxChannel = client.channel('spc-incoming-calls-' + state.user.id)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_calls', filter: 'callee_id=eq.' + state.user.id }, function (payload) {
          var call = payload && (payload.new || payload.old);
          if (!call) return;
          if (payload.eventType === 'INSERT' && call.status === 'ringing') showIncomingCall(call);
          if (payload.eventType === 'UPDATE' && call.status !== 'ringing') {
            stopIncomingCallAlert(call.id);
            var modal = document.getElementById('spcIncomingCall');
            if (modal && modal.dataset.callId === call.id) modal.remove();
          }
        }).subscribe(function (status) {
          if (status !== 'SUBSCRIBED') return;
          client.from('chat_calls').select('id,conversation_id,caller_id,callee_id,call_type,status,created_at')
            .eq('callee_id', inboxUserId).eq('status', 'ringing')
            .gte('created_at', new Date(Date.now() - 60000).toISOString())
            .order('created_at', { ascending: true }).limit(5)
            .then(function (result) {
              if (result.error) { console.warn('[private-chat] could not load pending calls', result.error); return; }
              (result.data || []).forEach(showIncomingCall);
            });
        });
    }
  }
  window.openMessages = async function () {
    if (!appUser()) return toast('سجّل الدخول إلى المنصة أولًا.');
    if (window.HafezCallAlerts) window.HafezCallAlerts.unlock();
    addChatStyles();
    makeHomeShell();
    state.mode = 'home';
    pushScreen('messagesScreen');
    try {
      await ensureIdentity();
      refreshIdentityNote();
      listenForInbox();
      await openHomeTab(state.homeTab || 'chats');
    } catch (error) {
      reportError(error, 'تعذر تشغيل الدردشة الآن. تأكد من الاتصال ثم أعد فتحها.');
      var box = document.getElementById('spcHomeContent');
      if (box) box.innerHTML = '<div class="empty-state">تعذر تهيئة الدردشة. أعد المحاولة عند توفر الإنترنت.</div>';
    }
  };
  window.openNewMessage = function () { return window.openFriendsDirectory(); };
  window.openFriendsDirectory = function () { state.homeTab = 'friends'; return window.openMessages(); };
  window.openFriendRequests = function () { state.homeTab = 'requests'; return window.openMessages(); };
  window.openCallHistory = function () { state.homeTab = 'calls'; return window.openMessages(); };
  window.openPublicChat = function () {
    state.mode = 'group';
    if (typeof legacyOpenPublicChat === 'function') return legacyOpenPublicChat.apply(this, arguments);
    toast('الدردشة الجماعية غير متاحة حاليًا.');
  };
  window.openChat = async function (conversationId, friendId, profile) {
    if (!conversationId || !friendId) return toast('بيانات المحادثة غير مكتملة.');
    addChatStyles();
    state.mode = 'private'; state.conversationId = conversationId;
    state.friend = profile && typeof profile === 'object'
      ? { id: friendId, display_name: memberLabel(profile), avatar_url: avatarSource(profile) }
      : { id: friendId, display_name: memberLabel(profile), avatar_url: '' };
    var screen = document.getElementById('supabasePrivateChatScreen');
    if (!screen) screen = createPrivateChatScreen();
    var title = screen.querySelector('[data-spc-title]');
    if (title) title.textContent = memberLabel(state.friend.display_name);
    if (state.messageChannel) { stopChannel(state.messageChannel); state.messageChannel = null; }
    pushScreen('supabasePrivateChatScreen');
    await loadMessages();
    state.messageChannel = client.channel('spc-messages-' + conversationId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: 'conversation_id=eq.' + conversationId }, function () { loadMessages(); })
      .subscribe();
  };
  function createPrivateChatScreen() {
    var screen = document.createElement('div'); screen.id = 'supabasePrivateChatScreen';
    screen.className = 'screen spc-chat-screen';
    screen.innerHTML = '<div class="top-bar"><button class="icon-btn" data-spc-back>→</button><div class="logo"><span data-spc-title>محادثة خاصة</span></div><div class="spc-call-actions"><button type="button" data-call-audio title="مكالمة صوتية">📞</button><button type="button" data-call-video title="مكالمة فيديو">📹</button></div></div><div class="content"><div id="spcMessages" class="spc-messages"></div></div><div class="spc-composer"><input id="spcFileInput" type="file" accept="image/*,video/mp4,video/webm,audio/*" hidden><button type="button" id="spcAttach" title="إرسال صورة أو فيديو أو صوت">📎</button><button type="button" id="spcRecord" title="تسجيل رسالة صوتية">🎙️</button><input type="text" id="spcMessageInput" maxlength="4000" placeholder="اكتب رسالة…"><button type="button" id="spcSend">➤</button></div>';
    document.body.appendChild(screen);
    screen.querySelector('[data-spc-back]').onclick = closePrivateChat;
    screen.querySelector('[data-call-audio]').onclick = function () { window.startChatCall('audio'); };
    ensureHomeButton(screen);
    screen.querySelector('[data-call-video]').onclick = function () { window.startChatCall('video'); };
    var file = document.getElementById('spcFileInput');
    document.getElementById('spcAttach').onclick = function () { file.click(); };
    file.onchange = function () { if (file.files && file.files[0]) uploadMedia(file.files[0]); file.value = ''; };
    document.getElementById('spcSend').onclick = sendPrivateMessage;
    document.getElementById('spcMessageInput').addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendPrivateMessage(); }
    });
    document.getElementById('spcRecord').onclick = toggleVoiceRecording;
    return screen;
  }
  function closePrivateChat() {
    if (state.messageChannel) { stopChannel(state.messageChannel); state.messageChannel = null; }
    state.mode = 'home'; state.conversationId = ''; state.friend = null;
    if (!Array.isArray(window.screenHistory)) window.screenHistory = [];
    var history = window.screenHistory;
    var current = window.currentScreen;
    while (history.length && history[history.length - 1] === current) history.pop();
    if (history[history.length - 1] !== 'messagesScreen') history.push('messagesScreen');
    if (typeof window.goBack === 'function') window.goBack();
    else if (typeof window.showScreen === 'function') window.showScreen('messagesScreen');
  }
  async function loadMessages() {
    if (!client || !state.conversationId) return;
    var box = document.getElementById('spcMessages');
    if (!box) return;
    var result = await client.from('chat_messages')
      .select('id,sender_id,body,kind,media_path,media_mime,created_at')
      .eq('conversation_id', state.conversationId)
      .order('created_at', { ascending: false }).limit(150);
    if (result.error) { reportError(result.error, 'تعذر تحميل الرسائل.'); return; }
    var messages = (result.data || []).reverse();
    box.innerHTML = '';
    if (!messages.length) {
      var empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'لا توجد رسائل بعد؛ ابدأ المحادثة.'; box.appendChild(empty); return;
    }
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var mine = message.sender_id === state.user.id;
      var bubble = document.createElement('div'); bubble.className = 'spc-bubble ' + (mine ? 'mine' : 'other');
      var sender = document.createElement('div'); sender.style.fontSize = '11px'; sender.style.fontWeight = 'bold';
      sender.textContent = mine ? 'أنت' : memberLabel(state.friend && state.friend.display_name);
      bubble.appendChild(sender);
      if (message.kind === 'text') {
        var body = document.createElement('div'); body.textContent = message.body || ''; bubble.appendChild(body);
      } else if (message.media_path) {
        await appendPrivateMedia(bubble, message);
      }
      var time = document.createElement('span'); time.className = 'spc-time';
      time.textContent = message.created_at ? new Date(message.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '';
      bubble.appendChild(time); box.appendChild(bubble);
    }
    box.scrollTop = box.scrollHeight;
  }
  async function appendPrivateMedia(container, message) {
    var signed = await client.storage.from('chat-private-media').createSignedUrl(message.media_path, 3600);
    if (signed.error || !signed.data || !signed.data.signedUrl) {
      var unavailable = document.createElement('div'); unavailable.textContent = 'تعذر تحميل المرفق الخاص.'; container.appendChild(unavailable); return;
    }
    var node;
    if (message.kind === 'image') {
      node = document.createElement('img'); node.alt = 'صورة خاصة';
    } else if (message.kind === 'video') {
      node = document.createElement('video'); node.controls = true; node.playsInline = true;
    } else {
      node = document.createElement('audio'); node.controls = true;
    }
    node.className = 'spc-media'; node.src = signed.data.signedUrl; container.appendChild(node);
  }
  async function sendPrivateMessage() {
    if (state.mode !== 'private' || !state.conversationId || !state.user) return;
    var input = document.getElementById('spcMessageInput');
    var body = input && input.value.trim();
    if (!body) return;
    var result = await client.from('chat_messages').insert({
      conversation_id: state.conversationId, sender_id: state.user.id, body: body, kind: 'text'
    });
    if (result.error) return reportError(result.error, 'تعذر إرسال الرسالة.');
    input.value = '';
    await loadMessages();
  }
  function normalizeMime(file) { return String(file && file.type || '').split(';')[0].trim().toLowerCase(); }
  function kindForMime(mime) {
    if (mime.indexOf('image/') === 0) return 'image';
    if (mime.indexOf('video/') === 0) return 'video';
    if (mime.indexOf('audio/') === 0) return 'audio';
    return '';
  }
  function extensionForMime(mime) {
    return ({
      'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'image/avif': 'avif',
      'video/mp4': 'mp4', 'video/webm': 'webm', 'audio/webm': 'webm', 'audio/ogg': 'ogg',
      'audio/mp4': 'm4a', 'audio/mpeg': 'mp3'
    })[mime] || '';
  }
  async function uploadMedia(fileOrBlob) {
    if (state.mode !== 'private' || !state.conversationId || !state.user) return;
    var mime = normalizeMime(fileOrBlob);
    var kind = kindForMime(mime);
    var allowed = ['image/jpeg','image/png','image/gif','image/webp','image/avif','video/mp4','video/webm','audio/webm','audio/ogg','audio/mp4','audio/mpeg'];
    if (!kind || allowed.indexOf(mime) < 0) return toast('النوع غير مدعوم؛ استخدم صورة أو MP4/WEBM أو صوتًا شائعًا.');
    if (fileOrBlob.size > maxMediaBytes) return toast('الحد الأقصى للمرفق 25 ميجابايت.');
    var extension = extensionForMime(mime);
    var path = state.conversationId + '/' + state.user.id + '/' + Date.now() + '-' + randomFileToken() + '.' + extension;
    toast('⏳ جارٍ رفع مرفق خاص…');
    var upload = await client.storage.from('chat-private-media').upload(path, fileOrBlob, {
      contentType: mime, cacheControl: '3600', upsert: false
    });
    if (upload.error) return reportError(upload.error, 'تعذر رفع المرفق الخاص.');
    var inserted = await client.from('chat_messages').insert({
      conversation_id: state.conversationId, sender_id: state.user.id, body: '', kind: kind,
      media_path: path, media_mime: mime
    });
    if (inserted.error) {
      await client.storage.from('chat-private-media').remove([path]).catch(function () {});
      return reportError(inserted.error, 'تم رفع الملف لكن تعذر إرفاقه بالرسالة.');
    }
    toast('تم إرسال المرفق الخاص.');
    await loadMessages();
  }
  async function toggleVoiceRecording() {
    var button = document.getElementById('spcRecord');
    if (state.recorder && state.recorder.state === 'recording') {
      state.recorder.stop(); if (button) button.textContent = '🎙️'; return;
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        throw new Error('التسجيل الصوتي غير مدعوم في هذا المتصفح أو إصدار APK.');
      }
      state.recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      var options = {};
      var supported = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4'].filter(function (type) {
        return window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(type);
      })[0];
      if (supported) options.mimeType = supported;
      var parts = [];
      state.recorder = new MediaRecorder(state.recordingStream, options);
      state.recorder.ondataavailable = function (event) { if (event.data && event.data.size) parts.push(event.data); };
      state.recorder.onstop = function () {
        var blobType = normalizeMime(parts[0] || { type: state.recorder && state.recorder.mimeType }) || 'audio/webm';
        var blob = new Blob(parts, { type: blobType });
        if (state.recordingStream) state.recordingStream.getTracks().forEach(function (track) { track.stop(); });
        state.recordingStream = null;
        if (blob.size) uploadMedia(blob);
      };
      state.recorder.start(); if (button) button.textContent = '⏹️'; toast('جارٍ التسجيل؛ اضغط مرة أخرى للإرسال.');
    } catch (error) {
      if (state.recordingStream) state.recordingStream.getTracks().forEach(function (track) { track.stop(); });
      state.recordingStream = null; reportError(error, error.message || 'تعذر استخدام الميكروفون.');
    }
  }
  function peerConfig() {
    var rtc = window.CHAT_RTC_CONFIG || {};
    return Array.isArray(rtc.iceServers) && rtc.iceServers.length ? rtc : { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  }
  function showCallUi(type, profile) {
    var callProfile = profile && typeof profile === 'object' ? profile : { display_name: profile };
    var previous = document.getElementById('spcActiveCall'); if (previous) previous.remove();
    var call = document.createElement('div'); call.id = 'spcActiveCall'; call.className = 'spc-call';
    call.innerHTML = '<div style="text-align:center;padding:8px"><b></b><div data-call-status style="font-size:13px;opacity:.85;margin-top:6px">جارٍ الاتصال…</div></div><div class="spc-call-stage"><video class="spc-remote-video" data-remote-video autoplay playsinline></video><audio data-remote-audio autoplay></audio><video class="spc-local-video" data-local-video autoplay playsinline muted></video><div data-audio-avatar style="position:absolute;font-size:64px;display:none">📞</div></div><div class="spc-call-controls"><button data-mute style="background:#456;color:#fff">🎙️</button><button data-camera style="background:#456;color:#fff">📹</button><button data-end style="background:#C62828;color:#fff">📵</button></div>';
    call.querySelector('b').textContent = memberLabel(callProfile);
    document.body.appendChild(call);
    var camera = call.querySelector('[data-camera]'); camera.style.display = type === 'video' ? '' : 'none';
    if (type === 'audio') {
      call.querySelector('[data-remote-video]').style.display = 'none';
      call.querySelector('[data-local-video]').style.display = 'none';
      var audioAvatar = call.querySelector('[data-audio-avatar]'); audioAvatar.style.display = 'block';
      var photo = avatarSource(callProfile);
      if (photo) {
        audioAvatar.textContent = ''; audioAvatar.style.width = '112px'; audioAvatar.style.height = '112px';
        audioAvatar.style.borderRadius = '50%'; audioAvatar.style.overflow = 'hidden'; audioAvatar.style.border = '3px solid #fff';
        var image = document.createElement('img'); image.src = photo; image.alt = memberLabel(callProfile);
        image.style.width = '100%'; image.style.height = '100%'; image.style.objectFit = 'cover';
        image.referrerPolicy = 'no-referrer'; image.onerror = function () { image.remove(); audioAvatar.textContent = '📞'; };
        audioAvatar.appendChild(image);
      }
    }
    call.querySelector('[data-end]').onclick = function () { finishCall(true); };
    call.querySelector('[data-mute]').onclick = toggleMute;
    camera.onclick = toggleCamera;
  }
  function bindLocalStream(stream) {
    state.localStream = stream;
    var video = document.querySelector('#spcActiveCall [data-local-video]');
    if (video) { video.srcObject = stream; video.play().catch(function () {}); }
  }
  async function pushCandidate(candidate) {
    if (!state.call || !state.call.id || !state.user) { state.pendingCandidates.push(candidate); return; }
    var result = await client.from('chat_call_signals').insert({ call_id: state.call.id, sender_id: state.user.id, candidate: candidate });
    if (result.error) console.warn('[private-chat] ICE signal failed', result.error);
  }
  function createPeerConnection() {
    var peer = new RTCPeerConnection(peerConfig()); state.peer = peer;
    peer.onicecandidate = function (event) { if (event.candidate) pushCandidate(event.candidate.toJSON()); };
    peer.ontrack = function (event) {
      state.remoteStream = event.streams && event.streams[0] || new MediaStream([event.track]);
      var call = document.getElementById('spcActiveCall'); if (!call) return;
      var video = call.querySelector('[data-remote-video]'); var audio = call.querySelector('[data-remote-audio]');
      if (state.call && state.call.type === 'video') { if (video) { video.srcObject = state.remoteStream; video.play().catch(function () {}); } }
      else if (audio) { audio.srcObject = state.remoteStream; audio.play().catch(function () {}); }
    };
    peer.onconnectionstatechange = function () {
      var status = document.querySelector('#spcActiveCall [data-call-status]');
      if (peer.connectionState === 'connected' && status) status.textContent = 'متصل';
      if (peer.connectionState === 'failed') toast('تعذر الاتصال بهذه الشبكة؛ قد تحتاج المكالمة إلى خادم TURN.');
      if (peer.connectionState === 'disconnected') {
        clearTimeout(state.disconnectTimer);
        state.disconnectTimer = setTimeout(function () {
          if (state.peer === peer && peer.connectionState === 'disconnected') finishCall(true);
        }, 8000);
      }
    };
    return peer;
  }
  function flushCandidates() {
    if (!state.peer || !state.peer.remoteDescription || !state.candidateQueue.length) return;
    var queued = state.candidateQueue.splice(0);
    queued.forEach(function (candidate) { state.peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(function (error) { console.warn(error); }); });
  }
  function subscribeCall(callId, role) {
    stopChannel(state.callRowChannel); stopChannel(state.candidateChannel);
    state.callRowChannel = client.channel('spc-call-row-' + callId)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_calls', filter: 'id=eq.' + callId }, async function (payload) {
        var row = payload && payload.new;
        if (!row || !state.call || state.call.id !== callId) return;
        var status = document.querySelector('#spcActiveCall [data-call-status]');
        if (status) status.textContent = row.status === 'active' ? 'متصل' : row.status === 'ringing' ? 'جارٍ الرنين…' : 'جارٍ إنهاء المكالمة…';
        if (role === 'caller' && row.answer && state.peer && !state.peer.remoteDescription) {
          try { await state.peer.setRemoteDescription(new RTCSessionDescription(row.answer)); flushCandidates(); }
          catch (error) { console.warn(error); }
        }
        if (['rejected','missed','busy','ended'].indexOf(row.status) >= 0 && state.call && !state.call.localEnding) {
          toast(row.status === 'rejected' ? 'تم رفض المكالمة.' : row.status === 'missed' ? 'لم يتم الرد.' : row.status === 'busy' ? 'الطرف الآخر مشغول.' : 'انتهت المكالمة.');
          finishCall(false);
        }
      }).subscribe();
    state.candidateQueue = [];
    state.seenCandidateIds = Object.create(null);
    function acceptRemoteCandidate(row) {
      if (!row || !state.user || row.sender_id === state.user.id || !row.candidate) return;
      var candidateId = row.id || JSON.stringify(row.candidate);
      if (state.seenCandidateIds[candidateId]) return;
      state.seenCandidateIds[candidateId] = true;
      if (state.peer && state.peer.remoteDescription) {
        state.peer.addIceCandidate(new RTCIceCandidate(row.candidate)).catch(function (error) { console.warn(error); });
      } else state.candidateQueue.push(row.candidate);
    }
    state.candidateChannel = client.channel('spc-call-ice-' + callId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_call_signals', filter: 'call_id=eq.' + callId }, function (payload) {
        acceptRemoteCandidate(payload && payload.new);
      }).subscribe(function (status) {
        if (status !== 'SUBSCRIBED') return;
        // Subscribe first, then fetch earlier candidates. This closes the timing gap when the
        // callee accepts after the caller has already written ICE rows.
        client.from('chat_call_signals').select('id,sender_id,candidate')
          .eq('call_id', callId).neq('sender_id', state.user.id)
          .order('created_at', { ascending: true }).limit(250)
          .then(function (result) {
            if (result.error) { console.warn('[private-chat] could not load earlier ICE rows', result.error); return; }
            (result.data || []).forEach(acceptRemoteCandidate);
          });
      });
  }
  window.startChatCall = async function (type) {
    if (state.mode !== 'private' || !state.friend || !state.conversationId) return toast('المكالمات متاحة داخل المحادثة الخاصة فقط.');
    if (state.call) return toast('لديك مكالمة نشطة بالفعل.');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.RTCPeerConnection) throw new Error('المتصفح أو APK لا يدعم الكاميرا والميكروفون.');
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });
      var peer = createPeerConnection(); stream.getTracks().forEach(function (track) { peer.addTrack(track, stream); });
      bindLocalStream(stream); showCallUi(type, state.friend);
      var offer = await peer.createOffer(); await peer.setLocalDescription(offer);
      var inserted = await client.from('chat_calls').insert({
        conversation_id: state.conversationId, caller_id: state.user.id, callee_id: state.friend.id,
        call_type: type === 'video' ? 'video' : 'audio', status: 'ringing', offer: peer.localDescription.toJSON()
      }).select('id,created_at').single();
      if (inserted.error) throw inserted.error;
      state.call = { id: inserted.data.id, role: 'caller', type: type, localEnding: false };
      subscribeCall(state.call.id, 'caller');
      var queued = state.pendingCandidates.splice(0); for (var i = 0; i < queued.length; i++) await pushCandidate(queued[i]);
      state.missedTimer = setTimeout(async function () {
        if (!state.call || state.call.id !== inserted.data.id) return;
        var current = await client.from('chat_calls').select('status').eq('id', inserted.data.id).maybeSingle();
        if (!current.error && current.data && current.data.status === 'ringing') {
          await client.from('chat_calls').update({ status: 'missed' }).eq('id', inserted.data.id);
        }
      }, 45000);
      toast('جارٍ الاتصال…');
    } catch (error) {
      reportError(error, error.message || 'تعذر بدء المكالمة.');
      if (state.localStream || state.peer) {
        if (!state.call) state.call = { id: null, localEnding: false };
        await finishCall(false);
      }
    }
  };
  async function showIncomingCall(row) {
    if (!row || row.status !== 'ringing' || !state.user || row.callee_id !== state.user.id) return;
    if (Date.now() - Date.parse(row.created_at || Date.now()) > 60000) return;
    if (state.call) {
      await client.from('chat_calls').update({ status: 'busy' }).eq('id', row.id).eq('callee_id', state.user.id);
      return;
    }
    var activeIncoming = document.getElementById('spcIncomingCall');
    if (activeIncoming) {
      if (activeIncoming.dataset.callId !== row.id) {
        await client.from('chat_calls').update({ status: 'busy' }).eq('id', row.id).eq('callee_id', state.user.id);
      }
      return;
    }
    var profile = await client.from('chat_profiles').select('id,display_name,avatar_url').eq('id', row.caller_id).maybeSingle();
    var callerProfile = profile.data || { display_name: 'مستخدم' };
    var callerName = memberLabel(callerProfile);
    var modal = document.createElement('div'); modal.id = 'spcIncomingCall'; modal.className = 'spc-incoming';
    modal.dataset.callId = row.id;
    modal.innerHTML = '<div class="spc-incoming-card"><div class="spc-avatar">📞</div><h2></h2><p></p><div class="spc-actions" style="justify-content:center"><button class="spc-btn spc-green" data-accept>✅ قبول</button><button class="spc-btn spc-red" data-reject>❌ رفض</button></div></div>';
    modal.querySelector('h2').textContent = callerName;
    modal.querySelector('p').textContent = row.call_type === 'video' ? 'مكالمة فيديو واردة' : 'مكالمة صوتية واردة';
    var callerAvatar = modal.querySelector('.spc-avatar');
    var callerPhoto = avatarSource(callerProfile);
    if (callerPhoto) {
      callerAvatar.textContent = '';
      var callerImage = document.createElement('img'); callerImage.src = callerPhoto; callerImage.alt = callerName;
      callerImage.referrerPolicy = 'no-referrer'; callerImage.onerror = function () { callerImage.remove(); callerAvatar.textContent = '📞'; };
      callerAvatar.appendChild(callerImage);
    }
    document.body.appendChild(modal);
    state.incomingCallId = String(row.id);
    if (window.HafezCallAlerts) window.HafezCallAlerts.start(row.id, callerName);
    if (state.incomingCallTimer) window.clearTimeout(state.incomingCallTimer);
    state.incomingCallTimer = window.setTimeout(function () {
      stopIncomingCallAlert(row.id);
      var expiredModal = document.getElementById('spcIncomingCall');
      if (expiredModal && expiredModal.dataset.callId === row.id) expiredModal.remove();
    }, 45000);
    modal.querySelector('[data-accept]').onclick = function () { stopIncomingCallAlert(row.id); modal.remove(); acceptIncomingCall(row.id); };
    modal.querySelector('[data-reject]').onclick = async function () {
      stopIncomingCallAlert(row.id);
      modal.remove();
      var update = await client.from('chat_calls').update({ status: 'rejected' }).eq('id', row.id).eq('callee_id', state.user.id);
      if (update.error) console.warn(update.error);
    };
  }
  function stopIncomingCallAlert(callId) {
    if (callId && state.incomingCallId && String(callId) !== state.incomingCallId) return;
    if (state.incomingCallTimer) window.clearTimeout(state.incomingCallTimer);
    state.incomingCallTimer = null;
    state.incomingCallId = '';
    if (window.HafezCallAlerts) window.HafezCallAlerts.stop(callId);
  }
  async function acceptIncomingCall(callId) {
    try {
      if (state.call) throw new Error('لديك مكالمة أخرى نشطة.');
      var result = await client.from('chat_calls').select('id,conversation_id,caller_id,callee_id,call_type,status,offer')
        .eq('id', callId).eq('callee_id', state.user.id).single();
      if (result.error) throw result.error;
      var row = result.data;
      if (row.status !== 'ringing') throw new Error('انتهت المكالمة أو لم تعد متاحة.');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.RTCPeerConnection) throw new Error('المتصفح لا يدعم الكاميرا والميكروفون.');
      var profile = await client.from('chat_profiles').select('id,display_name,avatar_url').eq('id', row.caller_id).maybeSingle();
      state.call = { id: row.id, role: 'callee', type: row.call_type, localEnding: false };
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: row.call_type === 'video' });
      showCallUi(row.call_type, profile.data || { display_name: 'مستخدم' }); bindLocalStream(stream);
      var peer = createPeerConnection(); stream.getTracks().forEach(function (track) { peer.addTrack(track, stream); });
      subscribeCall(row.id, 'callee');
      await peer.setRemoteDescription(new RTCSessionDescription(row.offer));
      var answer = await peer.createAnswer(); await peer.setLocalDescription(answer);
      var update = await client.from('chat_calls').update({ answer: peer.localDescription.toJSON(), status: 'active' })
        .eq('id', row.id).eq('callee_id', state.user.id);
      if (update.error) throw update.error;
      flushCandidates();
    } catch (error) { reportError(error, error.message || 'تعذر قبول المكالمة.'); await finishCall(false); }
  }
  async function finishCall(updateServer) {
    stopIncomingCallAlert();
    var active = state.call;
    if (!active) { var unused = document.getElementById('spcActiveCall'); if (unused) unused.remove(); return; }
    active.localEnding = true;
    if (updateServer && active.id) {
      var update = await client.from('chat_calls').update({ status: 'ended' }).eq('id', active.id);
      if (update.error) console.warn('[private-chat] could not mark call ended', update.error);
    }
    clearTimeout(state.missedTimer); clearTimeout(state.disconnectTimer);
    state.missedTimer = null; state.disconnectTimer = null;
    stopChannel(state.callRowChannel); stopChannel(state.candidateChannel);
    state.callRowChannel = null; state.candidateChannel = null;
    if (state.peer) { try { state.peer.close(); } catch (_) {} }
    if (state.localStream) state.localStream.getTracks().forEach(function (track) { track.stop(); });
    if (state.remoteStream) state.remoteStream.getTracks().forEach(function (track) { track.stop(); });
    state.peer = null; state.localStream = null; state.remoteStream = null; state.call = null;
    var modal = document.getElementById('spcIncomingCall'); if (modal) modal.remove();
    var screen = document.getElementById('spcActiveCall'); if (screen) screen.remove();
  }
  function toggleMute() {
    if (!state.localStream) return;
    var tracks = state.localStream.getAudioTracks(); tracks.forEach(function (track) { track.enabled = !track.enabled; });
    var button = document.querySelector('#spcActiveCall [data-mute]');
    if (button) button.textContent = tracks.some(function (track) { return track.enabled; }) ? '🎙️' : '🔇';
  }
  function toggleCamera() {
    if (!state.localStream) return;
    var tracks = state.localStream.getVideoTracks(); tracks.forEach(function (track) { track.enabled = !track.enabled; });
    var button = document.querySelector('#spcActiveCall [data-camera]');
    if (button) button.textContent = tracks.some(function (track) { return track.enabled; }) ? '📹' : '🚫';
  }
  window.endChatCall = finishCall;
  window.sendMessage = function () {
    if (state.mode === 'private') return sendPrivateMessage();
    if (typeof legacySendMessage === 'function') return legacySendMessage.apply(this, arguments);
  };
  window.syncPrivateChatProfile = function () {
    var account = appUser();
    if (!account || !account.uid) return Promise.resolve(null);
    return ensureIdentity();
  };
  function syncCurrentAccountProfile() {
    var account = appUser();
    if (!account || !account.uid || typeof window.syncPrivateChatProfile !== 'function') return;
    window.syncPrivateChatProfile().catch(function (error) {
      console.warn('[private-chat] account profile sync deferred', error);
    });
  }
  var originalPlatformLogin = window.login;
  if (typeof originalPlatformLogin === 'function') {
    window.login = function () {
      var result = originalPlatformLogin.apply(this, arguments);
      Promise.resolve(result).then(syncCurrentAccountProfile).catch(function () {});
      return result;
    };
  }
  if (appUser()) window.setTimeout(syncCurrentAccountProfile, 0);
  window.addEventListener('load', syncCurrentAccountProfile);
  var originalLogout = window.logout;
  window.logout = async function () {
    await finishCall(true);
    stopChannel(state.messageChannel); stopChannel(state.requestsChannel); stopChannel(state.callsInboxChannel);
    state.messageChannel = null; state.requestsChannel = null; state.callsInboxChannel = null;
    state.mode = 'home'; state.conversationId = ''; state.friend = null;
    if (typeof originalLogout === 'function') return originalLogout.apply(this, arguments);
    if (typeof legacyLogout === 'function') return legacyLogout.apply(this, arguments);
  };
})();
