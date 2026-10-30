/* منصة الدردشة: دليل أصدقاء بطلب قبول، صورة شخصية، دردشة جماعية/خاصة، مرفقات ومكالمات 1:1، الإصدار 1.0.10.
 * ملاحظة أمنية: لابد من قواعد Firestore/Storage تعتمد Firebase Auth؛ فحواجز الواجهة وحدها لا تحمي البيانات.
 */
(function () {
  'use strict';
  var db = firebase.firestore();
  var state = { mode: 'group', chatId: '', friend: null, messageUnsub: null, inboxUnsub: null, call: null, peer: null, localStream: null, remoteStream: null, callUnsub: null, candidateUnsub: null, profileAvatarLoadedFor: '', ownerClaimUid: '', ownerClaimValid: false, ownerClaimLoading: false, seenCalls: {}, candidateSeen: {}, candidateQueue: [], missedTimer: null, incomingCallId: '', mediaUrls: [] };
  var MAX_MEDIA_BYTES = 25 * 1024 * 1024;
  function me() { return window.currentUser || null; }
  function myId() {
    try {
      var authUser = firebase.auth && firebase.auth().currentUser;
      if (window.CHAT_USE_AUTH_UID === true && authUser && authUser.uid) return String(authUser.uid);
    } catch (_) {}
    var user = me(); return user && user.uid ? String(user.uid) : '';
  }
  async function ensureChatAuth() {
    var auth = firebase.auth();
    var appUid = me() && me().uid ? String(me().uid) : '';
    var boundAppUid = '';
    try { boundAppUid = localStorage.getItem('ta3lemyChatBoundAppUid') || ''; } catch (_) {}
    if (auth.currentUser && auth.currentUser.isAnonymous && appUid && boundAppUid && boundAppUid !== appUid) {
      await auth.signOut();
    }
    if (!auth.currentUser) await auth.signInAnonymously();
    if (appUid) {
      try { localStorage.setItem('ta3lemyChatBoundAppUid', appUid); } catch (_) {}
    }
    return auth.currentUser;
  }
  function hasAuthIdentity() { try { var authUser = firebase.auth && firebase.auth().currentUser; return !!(authUser && authUser.uid === myId()); } catch (_) { return false; } }
  function hasFirebaseSession() { try { return !!(firebase.auth && firebase.auth().currentUser); } catch (_) { return false; } }
  function hasSecureIdentity() { return window.CHAT_PRIVATE_ENABLED === true && hasAuthIdentity(); }
  async function hasOwnerAuth() {
    try {
      var authUser = firebase.auth && firebase.auth().currentUser;
      if (window.currentRole !== 'owner' || !authUser || authUser.uid !== myId()) return false;
      if (state.ownerClaimUid === authUser.uid) return state.ownerClaimValid;
      if (state.ownerClaimLoading) return false;
      state.ownerClaimLoading = true; state.ownerClaimUid = authUser.uid;
      var token = await authUser.getIdTokenResult();
      state.ownerClaimValid = !!(token && token.claims && (token.claims.role === 'owner' || token.claims.owner === true));
      return state.ownerClaimValid;
    } catch (_) { state.ownerClaimValid = false; return false; }
    finally { state.ownerClaimLoading = false; }
  }
  function requireSecureIdentity() { if (!hasAuthIdentity()) { toast('الخاص يتطلب ربط الحساب بمصادقة Firebase أولًا.'); return false; } if (window.CHAT_PRIVATE_ENABLED !== true) { toast('الخاص متوقف مؤقتًا حتى تُنشر وتُراجع قواعد Firestore وStorage.'); return false; } return true; }
  function toast(text) { if (window.showToast) window.showToast(text); else console.log(text); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function safeUrl(v) { return /^https:\/\//i.test(String(v || '')) ? String(v) : ''; }
  function roleLabel(role) { return role === 'teacher' ? 'معلم' : role === 'owner' ? 'المالك' : 'طالب'; }
  function timestamp() { return new Date().toISOString(); }
  function sortIds(a, b) { return [String(a), String(b)].sort(); }
  // The original app used sorted UIDs joined by '_'; keep it canonical so old message documents stay attached.
  function friendshipId(a, b) { return sortIds(a, b).map(encodeURIComponent).join('_'); }
  function alternatePairId(a, b) { return sortIds(a, b).map(encodeURIComponent).join('__'); }
  async function findPairDocument(collectionName, a, b) {
    var ids = [friendshipId(a, b), alternatePairId(a, b)];
    for (var i = 0; i < ids.length; i++) {
      var ref = db.collection(collectionName).doc(ids[i]);
      var snap = await ref.get().catch(function () { return null; });
      if (!snap || !snap.exists) continue;
      var data = snap.data() || {}; var participants = (data.participants || []).map(String);
      if (participants.indexOf(String(a)) >= 0 && participants.indexOf(String(b)) >= 0) return { id: snap.id, ref: ref, data: data };
    }
    return null;
  }
  function goScreen(id) { if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function isGroup() { return state.chatId === 'public_chat'; }
  function chatMessagesRef() { return isGroup() ? db.collection('public_chat') : db.collection('messages').doc(state.chatId).collection('msgs'); }

  function injectStyle() {
    if (document.getElementById('chatSystemStyle')) return;
    var style = document.createElement('style'); style.id = 'chatSystemStyle';
    style.textContent = '.chatx-tabs{display:flex;gap:8px;overflow:auto;padding:4px 0 12px}.chatx-tab{border:0;border-radius:20px;background:#edf3ee;color:#31563a;padding:9px 13px;font:inherit;font-size:12px;font-weight:700;white-space:nowrap}.chatx-tab.active{background:#2E7D32;color:#fff}.chatx-row{display:flex;align-items:center;gap:11px;background:#fff;border-radius:13px;padding:11px;margin:0 0 9px;border:1px solid #edf0ed}.chatx-avatar{width:46px;height:46px;flex:0 0 46px;border-radius:50%;object-fit:cover;background:#e8f5e9;display:flex;align-items:center;justify-content:center;color:#2E7D32;font-size:23px}.chatx-row-info{flex:1;min-width:0}.chatx-small{font-size:12px;color:#758078;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chatx-btn{border:0;border-radius:9px;padding:9px 12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.chatx-green{background:#2E7D32;color:white}.chatx-blue{background:#1976D2;color:white}.chatx-red{background:#C62828;color:white}.chatx-grey{background:#ecefec;color:#334438}.chatx-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.chatx-file{display:none}.chatx-chat-actions{display:flex;gap:5px}.chatx-chat-actions button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:50%;width:36px;height:36px;font-size:17px}.chatx-composer-extra{display:flex;gap:6px;align-items:center}.chatx-composer-extra button{border:0;background:transparent;font-size:22px;padding:5px}.chatx-emoji-pop{position:fixed;z-index:9999;bottom:80px;left:12px;right:12px;background:#fff;border-radius:14px;padding:10px;box-shadow:0 5px 25px #0003;display:grid;grid-template-columns:repeat(8,1fr);gap:4px}.chatx-emoji-pop button{border:0;background:#f5f7f5;border-radius:8px;font-size:21px;padding:7px}.chatx-msg-media{display:block;max-width:min(75vw,360px);max-height:300px;border-radius:10px;margin-top:6px}.chatx-call-screen{position:fixed;inset:0;z-index:100001;background:#14251a;color:white;display:flex;flex-direction:column;padding:14px;box-sizing:border-box}.chatx-call-stage{position:relative;flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:18px;background:#20382a}.chatx-remote-video{width:100%;height:100%;object-fit:cover}.chatx-local-video{position:absolute;right:12px;top:12px;width:110px;height:150px;object-fit:cover;border:2px solid white;border-radius:12px;background:#334}.chatx-call-controls{display:flex;justify-content:center;gap:14px;padding:16px}.chatx-call-controls button{border:0;border-radius:50%;width:56px;height:56px;font-size:22px}.chatx-incoming{position:fixed;z-index:100002;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;padding:20px}.chatx-incoming-card{width:100%;max-width:360px;background:#fff;border-radius:20px;padding:22px;text-align:center;color:#233}.chatx-incoming-card img{width:82px;height:82px;border-radius:50%;object-fit:cover;margin:4px auto 10px}.chatx-profile-edit{margin-top:10px}.chatx-recording{color:#C62828;font-weight:bold}';
    document.head.appendChild(style);
  }
  async function ensureMyPublicProfile() {
    var user = me(); if (!user || !user.uid || !hasAuthIdentity()) return null;
    var ref = db.collection('public_profiles').doc(myId());
    try {
      var profile = await ref.get();
      var old = profile.exists ? profile.data() : {};
      var stage = old.stage || ''; var grade = old.grade || '';
      try { var userDoc = await db.collection('users').doc(String(user.uid)).get(); if (userDoc.exists) { var data = userDoc.data(); stage = data.stage || stage; grade = data.grade || grade; } } catch (_) {}
      var dataOut = { displayName: user.name || old.displayName || 'مستخدم', role: window.currentRole || old.role || 'student', avatarURL: old.avatarURL || user.avatarURL || '', stage: stage, grade: grade, visible: true, updatedAt: timestamp() };
      await ref.set(dataOut, { merge: true });
      user.avatarURL = dataOut.avatarURL;
      return dataOut;
    } catch (error) { console.warn('Public profile sync failed', error); return null; }
  }

  function ensureHomeUI() {
    var screen = document.getElementById('messagesScreen'); if (!screen) return null;
    var content = screen.querySelector('.content'); if (!content) return null;
    if (!document.getElementById('chatSystemHome')) {
      content.innerHTML = '<div class="chatx-tabs"><button class="chatx-tab active" data-chat-tab="chats">💬 محادثاتي</button><button class="chatx-tab" data-chat-tab="friends">👥 الأصدقاء</button><button class="chatx-tab" data-chat-tab="requests">📩 الطلبات</button><button class="chatx-tab" data-chat-tab="calls">📞 المكالمات</button></div><div id="chatSecurityNote" style="display:none;background:#FFF3E0;color:#7A4A00;border-radius:10px;padding:10px;margin-bottom:12px;font-size:12px;line-height:1.7">الخاص وطلبات الصداقة والمكالمات والصورة الشخصية تتطلب ربط هذا الحساب بمصادقة Firebase الآمنة. الدردشة الجماعية متاحة الآن.</div><button class="btn-primary" id="chatGroupOpen" style="margin:0 0 14px;background:linear-gradient(135deg,#1976D2,#42A5F5)">👥 افتح الدردشة الجماعية</button><div id="chatSystemHome"><div class="empty-state">جارٍ التحميل...</div></div>';
      content.querySelectorAll('[data-chat-tab]').forEach(function (button) { button.onclick = function () { content.querySelectorAll('[data-chat-tab]').forEach(function (x) { x.classList.remove('active'); }); button.classList.add('active'); renderHomeTab(button.getAttribute('data-chat-tab')); }; });
      document.getElementById('chatGroupOpen').onclick = window.openPublicChat;
    }
    return content;
  }
  async function renderHomeTab(tab) {
    state.homeTab = tab;
    var box = document.getElementById('chatSystemHome'); if (!box) return;
    box.innerHTML = '<div class="empty-state">⏳ جاري التحميل...</div>';
    if (!hasSecureIdentity()) { box.innerHTML = '<div class="empty-state">المحادثات الخاصة ستُفعّل بعد ربط الدخول الآمن ونشر قواعد الحماية.</div>'; return; }
    if (tab === 'friends') return window.openFriendsDirectory(box);
    if (tab === 'requests') return window.openFriendRequests(box);
    if (tab === 'calls') return window.openCallHistory(box);
    try {
      var snap = await db.collection('messages').where('participants', 'array-contains', myId()).get();
      var conversations = [];
      snap.forEach(function (doc) {
        var data = doc.data();
        var other = (data.participants || []).filter(function (id) { return id !== myId(); })[0];
        if (!other) return;
        conversations.push({ id: doc.id, otherId: other, name: data.participantNames && data.participantNames[other] || other, text: data.text || '', updatedAt: data.updatedAt || data.createdAt || '' });
      });
      conversations.sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
      box.innerHTML = '<button class="chatx-btn chatx-blue" onclick="openFriendsDirectory()">➕ ابحث عن صديق وابدأ محادثة</button><div style="height:12px"></div>' + (conversations.length ? '' : '<div class="empty-state"><div class="empty-state-icon">💬</div><p>لا توجد محادثات خاصة بعد</p><p style="font-size:12px">ابدأ بطلب صداقة من القائمة</p></div>');
      conversations.forEach(function (chat) {
        var row = document.createElement('div'); row.className = 'chatx-row';
        var img = document.createElement('div'); img.className = 'chatx-avatar'; img.textContent = '👤';
        var info = document.createElement('div'); info.className = 'chatx-row-info'; info.innerHTML = '<b>' + esc(chat.name) + '</b><div class="chatx-small">' + esc(chat.text || 'ابدأ المحادثة') + '</div>';
        var open = document.createElement('button'); open.className = 'chatx-btn chatx-green'; open.textContent = 'فتح'; open.onclick = function () { window.openChat(chat.id, chat.otherId, chat.name); };
        row.appendChild(img); row.appendChild(info); row.appendChild(open); box.appendChild(row);
      });
    } catch (error) { console.error(error); box.innerHTML = '<div class="empty-state">تعذر تحميل المحادثات. راجع إعدادات Firestore.</div>'; }
  }
  window.openMessages = async function () {
    if (!me()) return toast('سجّل الدخول أولًا');
    try { await ensureChatAuth(); } catch (error) { console.error('Anonymous chat auth failed:', error); return toast('تعذر تهيئة دخول الدردشة. فعّلي Anonymous في Firebase Authentication.'); }
    injectStyle(); ensureHomeUI();
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (window.showScreen) window.showScreen('messagesScreen');
    await ensureMyPublicProfile();
    listenForIncomingCalls();
    var securityNote = document.getElementById('chatSecurityNote'); if (securityNote) { securityNote.textContent = !hasAuthIdentity() ? 'الخاص وطلبات الصداقة والمكالمات تحتاج ربط الحساب بمصادقة Firebase الآمنة. يمكن فتح المجموعة، لكن إرسال الرسائل والمرفقات يتطلب تسجيل Firebase.' : 'تم توثيق الحساب؛ يظل الخاص متوقفًا حتى نشر ومراجعة قواعد Firestore وStorage.'; securityNote.style.display = hasSecureIdentity() ? 'none' : 'block'; }
    if (!state.homeTab) state.homeTab = 'chats';
    renderHomeTab(state.homeTab);
    listenForIncomingCalls();
  };

  function makeScreen(id, title) {
    var existing = document.getElementById(id); if (existing) return existing;
    var node = document.createElement('div'); node.id = id; node.className = 'screen';
    node.innerHTML = '<div class="top-bar"><button class="icon-btn" data-back>→</button><div class="logo"><span>' + esc(title) + '</span></div><div style="width:42px"></div></div><div class="content" id="' + id + 'Content"></div>';
    node.querySelector('[data-back]').onclick = function () { if (window.goBack) window.goBack(); };
    document.body.appendChild(node); return node;
  }
  function listRow(profile, actions) {
    var row = document.createElement('div'); row.className = 'chatx-row';
    var avatar = document.createElement('img'); avatar.className = 'chatx-avatar'; avatar.src = safeUrl(profile.avatarURL) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.displayName || 'User') + '&background=2E7D32&color=fff&size=96'; avatar.alt = 'صورة ' + (profile.displayName || 'المستخدم');
    var info = document.createElement('div'); info.className = 'chatx-row-info';
    var label = roleLabel(profile.role);
    var classLabel = [profile.stage, profile.grade].filter(Boolean).join(' • ');
    info.innerHTML = '<b>' + esc(profile.displayName || 'مستخدم') + '</b><div class="chatx-small">' + esc(label + (classLabel ? ' • ' + classLabel : '')) + '</div>';
    row.appendChild(avatar); row.appendChild(info);
    if (actions) row.appendChild(actions);
    return row;
  }
  async function getMyFriends() {
    var snap = await db.collection('friendships').where('participants', 'array-contains', myId()).get();
    var result = [];
    for (var i = 0; i < snap.docs.length; i++) {
      var item = snap.docs[i].data();
      var otherId = (item.participants || []).filter(function (id) { return id !== myId(); })[0];
      if (!otherId) continue;
      var profile = await db.collection('public_profiles').doc(String(otherId)).get().catch(function () { return null; });
      var p = profile && profile.exists ? profile.data() : {};
      result.push({ id: otherId, displayName: p.displayName || item.names && item.names[otherId] || 'عضو', role: p.role || 'student', avatarURL: p.avatarURL || '' });
    }
    return result;
  }
  window.openFriendsDirectory = async function (targetBox) {
    var container;
    if (targetBox) container = targetBox;
    else { makeScreen('chatFriendsScreen', '👥 الأصدقاء'); goScreen('chatFriendsScreen'); container = document.getElementById('chatFriendsScreenContent'); }
    if (!container) return;
    if (!requireSecureIdentity()) { container.innerHTML = '<div class="empty-state">دليل الأصدقاء يتاح بعد تفعيل الأمان الخادمي.</div>'; return; }
    container.innerHTML = '<div class="chatx-tabs"><input id="chatFriendSearch" class="form-input" placeholder="ابحث باسم العضو" style="flex:1"><button class="chatx-btn chatx-blue" id="chatFriendSearchBtn">بحث</button></div><div id="chatFriendResults"><div class="empty-state">اكتب اسمًا للبحث في دليل الأعضاء</div></div><div class="section-title">👥 أصدقائي</div><div id="chatFriendList">⏳</div>';
    document.getElementById('chatFriendSearchBtn').onclick = function () { searchProfiles(document.getElementById('chatFriendSearch').value, document.getElementById('chatFriendResults')); };
    document.getElementById('chatFriendSearch').onkeydown = function (e) { if (e.key === 'Enter') searchProfiles(e.target.value, document.getElementById('chatFriendResults')); };
    try {
      var friends = await getMyFriends(); var list = document.getElementById('chatFriendList'); list.innerHTML = '';
      if (!friends.length) list.innerHTML = '<div class="empty-state">لم تضف أصدقاء بعد؛ ابحث عن اسم واطلب إضافته.</div>';
      friends.forEach(function (friend) {
        var btn = document.createElement('button'); btn.className = 'chatx-btn chatx-green'; btn.textContent = 'مراسلة';
        btn.onclick = function () { openPrivateWithFriend(friend); };
        list.appendChild(listRow(friend, btn));
      });
    } catch (error) { console.error(error); var list2 = document.getElementById('chatFriendList'); if (list2) list2.textContent = 'تعذر تحميل الأصدقاء'; }
  };
  async function searchProfiles(query, target) {
    if (!target) return;
    var needle = String(query || '').trim().toLowerCase();
    if (needle.length < 2) { target.innerHTML = '<div class="empty-state">اكتب حرفين على الأقل للبحث.</div>'; return; }
    target.innerHTML = '<div class="empty-state">⏳ جارٍ البحث...</div>';
    try {
      var snap = await db.collection('public_profiles').where('visible', '==', true).limit(300).get();
      var profiles = [];
      snap.forEach(function (doc) { var p = doc.data(); if (doc.id !== myId() && String(p.displayName || '').toLowerCase().indexOf(needle) >= 0) profiles.push(Object.assign({ id: doc.id }, p)); });
      var friends = await getMyFriends(); var friendIds = friends.map(function (f) { return String(f.id); });
      var outgoing = await db.collection('friend_requests').where('fromId', '==', myId()).get(); var sentIds = [];
      outgoing.forEach(function (doc) { var r = doc.data(); if (r.status === 'pending') sentIds.push(String(r.toId)); });
      target.innerHTML = '';
      if (!profiles.length) target.innerHTML = '<div class="empty-state">لم نجد الاسم في الدليل بعد. اطلب من زميلك فتح «الدردشة» لتسجيل ملفه.</div>';
      profiles.forEach(function (profile) {
        var button = document.createElement('button');
        if (friendIds.indexOf(String(profile.id)) >= 0) { button.className = 'chatx-btn chatx-green'; button.textContent = 'مراسلة'; button.onclick = function () { openPrivateWithFriend(profile); }; }
        else if (sentIds.indexOf(String(profile.id)) >= 0) { button.className = 'chatx-btn chatx-grey'; button.textContent = 'الطلب مُرسل'; button.disabled = true; }
        else { button.className = 'chatx-btn chatx-blue'; button.textContent = '➕ طلب صداقة'; button.onclick = function () { sendFriendRequest(profile); }; }
        target.appendChild(listRow(profile, button));
      });
    } catch (error) { console.error(error); target.innerHTML = '<div class="empty-state">تعذر البحث في دليل الأعضاء. قد تحتاج قواعد Firestore.</div>'; }
  }
  async function sendFriendRequest(target) {
    if (!requireSecureIdentity()) return;
    if (!myId() || String(target.id) === myId()) return;
    try {
      var existing = await db.collection('friend_requests').where('fromId', '==', myId()).get();
      var duplicate = false; existing.forEach(function (doc) { var d = doc.data(); if (d.toId === target.id && d.status === 'pending') duplicate = true; });
      if (duplicate) return toast('طلب الصداقة مُرسل بالفعل');
      await db.collection('friend_requests').add({ fromId: myId(), fromName: me().name || 'عضو', fromAvatar: me().avatarURL || '', fromRole: window.currentRole || 'student', toId: target.id, toName: target.displayName || '', status: 'pending', createdAt: timestamp() });
      toast('تم إرسال طلب الصداقة');
      if (document.getElementById('chatFriendSearchBtn')) searchProfiles(document.getElementById('chatFriendSearch').value, document.getElementById('chatFriendResults'));
    } catch (error) { console.error(error); toast('تعذر إرسال الطلب'); }
  }
  window.openFriendRequests = async function (targetBox) {
    var box;
    if (targetBox) box = targetBox;
    else { makeScreen('chatRequestsScreen', '📩 طلبات الصداقة'); goScreen('chatRequestsScreen'); box = document.getElementById('chatRequestsScreenContent'); }
    if (!box) return;
    if (!requireSecureIdentity()) { box.innerHTML = '<div class="empty-state">طلبات الصداقة تتاح بعد تفعيل الأمان الخادمي.</div>'; return; }
    box.innerHTML = '<div class="empty-state">⏳ جارٍ تحميل الطلبات...</div>';
    try {
      var snap = await db.collection('friend_requests').where('toId', '==', myId()).get();
      var reqs = snap.docs.filter(function (doc) { return doc.data().status === 'pending'; }); box.innerHTML = '';
      if (!reqs.length) { box.innerHTML = '<div class="empty-state">لا توجد طلبات صداقة معلقة.</div>'; return; }
      reqs.forEach(function (doc) {
        var data = doc.data(); var profile = { id: data.fromId, displayName: data.fromName, avatarURL: data.fromAvatar, role: data.fromRole };
        var actions = document.createElement('div'); actions.className = 'chatx-actions';
        var accept = document.createElement('button'); accept.className = 'chatx-btn chatx-green'; accept.textContent = 'قبول'; accept.onclick = function () { acceptFriendRequest(doc.id, data); };
        var reject = document.createElement('button'); reject.className = 'chatx-btn chatx-red'; reject.textContent = 'رفض'; reject.onclick = function () { rejectFriendRequest(doc.id); };
        actions.appendChild(accept); actions.appendChild(reject); box.appendChild(listRow(profile, actions));
      });
    } catch (error) { console.error(error); box.innerHTML = '<div class="empty-state">تعذر تحميل الطلبات.</div>'; }
  };
  async function acceptFriendRequest(requestId, request) {
    if (!requireSecureIdentity()) return;
    try {
      var ids = sortIds(myId(), request.fromId); var names = {}; names[myId()] = me().name || 'عضو'; names[request.fromId] = request.fromName || 'عضو';
      var previousFriendship = await findPairDocument('friendships', ids[0], ids[1]);
      var friendshipRef = previousFriendship ? previousFriendship.ref : db.collection('friendships').doc(friendshipId(ids[0], ids[1]));
      var batch = db.batch();
      batch.update(db.collection('friend_requests').doc(requestId), { status: 'accepted', acceptedAt: timestamp() });
      batch.set(friendshipRef, { participants: ids, names: names, requestId: requestId, createdAt: timestamp() }, { merge: true });
      await batch.commit();
      toast('تمت إضافة الصديق'); window.openFriendRequests();
    } catch (error) { console.error(error); toast('تعذر قبول الطلب'); }
  }
  async function rejectFriendRequest(id) { if (!requireSecureIdentity()) return; try { await db.collection('friend_requests').doc(id).update({ status: 'rejected', rejectedAt: timestamp() }); toast('تم رفض الطلب'); window.openFriendRequests(); } catch (error) { console.error(error); toast('تعذر رفض الطلب'); } }
  async function isFriend(otherId) {
    if (!hasSecureIdentity()) return false;
    try { return !!(await findPairDocument('friendships', myId(), otherId)); } catch (_) { return false; }
  }
  async function openPrivateWithFriend(profile) {
    if (!requireSecureIdentity()) return;
    if (!(await isFriend(profile.id))) return toast('المحادثة الخاصة متاحة بعد قبول طلب الصداقة');
    var ids = sortIds(myId(), profile.id); var existingChat = await findPairDocument('messages', ids[0], ids[1]);
    var id = existingChat ? existingChat.id : friendshipId(ids[0], ids[1]);
    var ref = existingChat ? existingChat.ref : db.collection('messages').doc(id);
    if (!existingChat) {
      var names = {}; names[myId()] = me().name || 'عضو'; names[profile.id] = profile.displayName || 'عضو';
      await ref.set({ participants: ids, participantNames: names, text: '', createdAt: timestamp(), updatedAt: timestamp() });
    }
    window.openChat(id, profile.id, profile.displayName || 'صديق');
  }
  window.openNewMessage = function () { window.openFriendsDirectory(); };
  window.openChat = async function (chatId, withId, withName) {
    if (!me()) return toast('سجّل الدخول أولًا');
    if (!requireSecureIdentity()) return;
    if (!(await isFriend(withId))) return toast('المحادثة الخاصة للأصدقاء بعد قبول الطلب فقط');
    state.mode = 'private'; state.chatId = chatId; state.friend = { id: withId, displayName: withName || 'صديق' };
    showChatScreen();
  };
  window.openPublicChat = function () { if (!me()) return toast('سجّل الدخول أولًا'); state.mode = 'group'; state.chatId = 'public_chat'; state.friend = null; showChatScreen(); };
  function showChatScreen() {
    injectStyle();
    var screen = document.getElementById('chatScreen'); if (!screen) return toast('شاشة المحادثة غير موجودة');
    var title = document.getElementById('chatTitle'); if (title) title.textContent = isGroup() ? '👥 الدردشة الجماعية' : (state.friend.displayName || 'محادثة خاصة');
    var top = screen.querySelector('.top-bar'); var right = top && top.lastElementChild;
    if (right && !document.getElementById('chatCallActions')) {
      right.innerHTML = '<div class="chatx-chat-actions" id="chatCallActions"><button title="مكالمة صوتية" onclick="startChatCall(\'audio\')">📞</button><button title="مكالمة فيديو" onclick="startChatCall(\'video\')">📹</button></div>';
    }
    var callActions = document.getElementById('chatCallActions'); if (callActions) callActions.style.display = isGroup() ? 'none' : 'flex';
    attachComposer();
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (window.showScreen) window.showScreen('chatScreen');
    if (state.messageUnsub) { try { state.messageUnsub(); } catch (_) {} state.messageUnsub = null; }
    var messageBox = document.getElementById('chatMessages'); if (messageBox) messageBox.innerHTML = '<div class="empty-state">⏳ جارٍ تحميل الرسائل...</div>';
    state.messageUnsub = chatMessagesRef().orderBy('createdAt', 'asc').limit(150).onSnapshot(function (snap) { renderMessages(snap); }, function (error) { console.error(error); if (messageBox) messageBox.innerHTML = '<div class="empty-state">تعذر تحميل الرسائل.</div>'; });
  }
  function attachComposer() {
    var inputBox = document.getElementById('chatInput'); var bar = inputBox && inputBox.parentElement; if (!bar) return;
    var emoji = bar.querySelector('button'); if (emoji) emoji.onclick = window.insertEmoji;
    // المرفقات متاحة في الدردشة الجماعية والخاصة، مع حماية Firebase Storage للخاص.
    if (document.getElementById('chatMediaInput')) return;
    var file = document.createElement('input'); file.type = 'file'; file.id = 'chatMediaInput'; file.className = 'chatx-file'; file.accept = 'image/*,video/*,audio/*';
    file.onchange = function () { if (file.files && file.files[0]) sendChatMedia(file.files[0]); file.value = ''; };
    var attach = document.createElement('button'); attach.type = 'button'; attach.id = 'chatAttachButton'; attach.textContent = '📎'; attach.title = 'إرسال صورة أو فيديو أو صوت'; attach.onclick = function () { file.click(); };
    var record = document.createElement('button'); record.type = 'button'; record.id = 'chatRecordButton'; record.textContent = '🎙️'; record.title = 'تسجيل رسالة صوتية'; record.onclick = toggleVoiceRecording;
    bar.insertBefore(file, bar.firstChild); bar.insertBefore(attach, bar.firstChild); bar.insertBefore(record, bar.firstChild);
  }
  function renderMessages(snapshot) {
    var box = document.getElementById('chatMessages'); if (!box) return;
    state.mediaUrls.forEach(function (url) { try { URL.revokeObjectURL(url); } catch (_) {} }); state.mediaUrls = [];
    if (snapshot.empty) { box.innerHTML = '<p style="text-align:center;color:#999;padding:20px">لا توجد رسائل — ابدأ المحادثة</p>'; return; }
    var html = '';
    snapshot.forEach(function (doc) {
      var m = doc.data(); var mine = m.senderId === myId(); var kind = m.kind || 'text';
      var senderAvatar = safeUrl(mine ? me().avatarURL : m.senderAvatar);
      html += '<div class="chat-bubble ' + (mine ? 'mine' : 'other') + '" style="position:relative;max-width:90%"><div style="font-size:11px;font-weight:bold;margin-bottom:4px;display:flex;align-items:center;gap:6px">' + (senderAvatar ? '<img src="' + esc(senderAvatar) + '" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover">' : '') + esc(mine ? 'أنا' : m.senderName || state.friend && state.friend.displayName || 'عضو') + '</div>';
      if (!mine) html += '<button title="إبلاغ عن الرسالة" onclick="reportChatMessage(\'' + esc(doc.id) + '\')" style="float:left;border:0;background:transparent;color:#B71C1C">⚑</button>';
      if (!mine && isGroup() && window.currentRole === 'owner') html += '<button title="حذف الرسالة" onclick="deletePublicMsg(\'' + esc(doc.id) + '\')" style="float:left;border:0;background:transparent;color:#C62828">🗑</button>';
      if (m.text) html += '<div style="font-size:14px;line-height:1.7;white-space:pre-wrap;word-break:break-word">' + esc(m.text) + '</div>';
      if (kind === 'image' && m.storagePath) html += '<img class="chatx-msg-media" data-storage="' + esc(m.storagePath) + '" data-mime="' + esc(m.mime || '') + '" alt="صورة خاصة" style="visibility:hidden">';
      else if (kind === 'video' && m.storagePath) html += '<video class="chatx-msg-media" data-storage="' + esc(m.storagePath) + '" data-mime="' + esc(m.mime || '') + '" controls playsinline></video>';
      else if (kind === 'audio' && m.storagePath) html += '<audio data-storage="' + esc(m.storagePath) + '" data-mime="' + esc(m.mime || '') + '" controls style="max-width:260px"></audio>';
      else if (kind === 'image' && safeUrl(m.mediaURL)) html += '<img class="chatx-msg-media" src="' + esc(safeUrl(m.mediaURL)) + '" alt="صورة">';
      else if (kind === 'video' && safeUrl(m.mediaURL)) html += '<video class="chatx-msg-media" src="' + esc(safeUrl(m.mediaURL)) + '" controls playsinline></video>';
      else if (kind === 'audio' && safeUrl(m.mediaURL)) html += '<audio src="' + esc(safeUrl(m.mediaURL)) + '" controls style="max-width:260px"></audio>';
      else if (kind !== 'text' && kind !== 'image' && kind !== 'video' && kind !== 'audio') html += '<span>📎 مرفق</span>';
      html += '<span class="chat-bubble-time">' + esc(new Date(m.createdAt || Date.now()).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })) + '</span></div>';
    });
    box.innerHTML = html;
    box.querySelectorAll('[data-storage]').forEach(function (element) { loadPrivateMedia(element); });
    box.scrollTop = box.scrollHeight;
  }
  async function loadPrivateMedia(element) {
    try {
      if (!firebase.storage || !firebase.auth || !firebase.auth().currentUser) throw new Error('سجّل دخول Firebase');
      var path = element.getAttribute('data-storage');
      var bytes = await firebase.storage().ref(path).getBytes(MAX_MEDIA_BYTES);
      var type = path.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp|mp4|webm|mp3|m4a|ogg)$/);
      var mime = element.getAttribute('data-mime') || (type && ({ png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', m4a: 'audio/mp4', ogg: 'audio/ogg' })[type[1]]) || 'application/octet-stream';
      var url = URL.createObjectURL(new Blob([bytes], { type: mime })); state.mediaUrls.push(url); element.src = url; element.style.visibility = 'visible';
    } catch (error) { console.warn('Private attachment unavailable', error); element.insertAdjacentHTML('afterend', '<small style="color:#C62828">المرفق الخاص يحتاج Firebase Storage وقواعد تسجيل دخول.</small>'); }
  }
  window.sendMessage = async function () {
    var input = document.getElementById('chatInput'); var text = input && input.value.trim(); if (!text || !state.chatId || !me()) return;
    if (!isGroup() && !requireSecureIdentity()) return;
    if (isGroup() && !hasFirebaseSession()) return toast('جلسة Firebase لم تجهز بعد؛ انتظر لحظات ثم أعد المحاولة.');
    try {
      var message = { senderId: myId(), senderName: me().name || 'عضو', senderAvatar: me().avatarURL || '', text: text, kind: 'text', createdAt: timestamp() };
      await chatMessagesRef().add(message);
      if (!isGroup()) await db.collection('messages').doc(state.chatId).update({ text: text, updatedAt: timestamp() });
      input.value = '';
    } catch (error) { console.error(error); toast('تعذر إرسال الرسالة. تحقق من صلاحيات Firestore.'); }
  };
  async function sendChatMedia(file) {
    if (!file || !state.chatId) return;
    if (!hasFirebaseSession()) return toast('جلسة Firebase لم تجهز بعد؛ انتظر لحظات ثم أعد المحاولة.');
    if (file.size > MAX_MEDIA_BYTES) return toast('الحد الأقصى للمرفق 25 ميجابايت');
    var kind = file.type.indexOf('image/') === 0 ? 'image' : file.type.indexOf('video/') === 0 ? 'video' : file.type.indexOf('audio/') === 0 ? 'audio' : '';
    if (!kind) return toast('الأنواع المتاحة: صورة أو فيديو أو ملف صوتي');
    try {
      var message = { senderId: myId(), senderName: me().name || 'عضو', senderAvatar: me().avatarURL || '', text: '', kind: kind, mime: file.type, fileName: file.name || 'media', createdAt: timestamp() };
      if (isGroup()) {
        if (typeof window.uploadFile !== 'function') throw new Error('رفع الملفات غير مهيأ');
        toast('⏳ جارٍ رفع المرفق للمجموعة...');
        message.mediaURL = await window.uploadFile(file, 'chat_media');
        if (!message.mediaURL) throw new Error('فشل رفع الملف');
      } else {
        if (!firebase.storage || !firebase.auth || !firebase.auth().currentUser) throw new Error('الوسائط الخاصة تحتاج تفعيل Firebase Authentication وStorage للطلاب أولًا. لم أرفع الملف إلى رابط عام.');
        var safeName = String(file.name || 'media').replace(/[^a-zA-Z0-9._-]/g, '_');
        var path = 'chat_media_private/' + encodeURIComponent(state.chatId) + '/' + myId() + '_' + Date.now() + '_' + safeName;
        toast('⏳ جارٍ رفع مرفق خاص...');
        await firebase.storage().ref(path).put(file, { contentType: file.type });
        message.storagePath = path;
      }
      await chatMessagesRef().add(message);
      if (!isGroup()) await db.collection('messages').doc(state.chatId).update({ text: kind === 'image' ? '🖼️ صورة' : kind === 'video' ? '🎥 فيديو' : '🎙️ رسالة صوتية', updatedAt: timestamp() });
      toast('تم إرسال المرفق');
    } catch (error) { console.error(error); toast(error.message || 'تعذر رفع المرفق'); }
  }
  var recorder = null; var recordingStream = null; var recordingParts = [];
  async function toggleVoiceRecording() {
    var button = document.getElementById('chatRecordButton');
    if (recorder && recorder.state === 'recording') { recorder.stop(); if (button) button.textContent = '🎙️'; return; }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) throw new Error('التسجيل الصوتي غير مدعوم في هذا المتصفح أو إصدار WebView');
      recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true }); recordingParts = [];
      recorder = new MediaRecorder(recordingStream);
      recorder.ondataavailable = function (event) { if (event.data && event.data.size) recordingParts.push(event.data); };
      recorder.onstop = function () { var blob = new Blob(recordingParts, { type: recorder.mimeType || 'audio/webm' }); var file = new File([blob], 'voice-' + Date.now() + '.webm', { type: blob.type }); sendChatMedia(file); if (recordingStream) recordingStream.getTracks().forEach(function (track) { track.stop(); }); recordingStream = null; };
      recorder.start(); if (button) button.textContent = '⏹️'; toast('جارٍ التسجيل؛ اضغط مرة أخرى للإرسال');
    } catch (error) { console.error(error); toast(error.message || 'لم نتمكن من استخدام الميكروفون'); }
  }
  window.insertEmoji = function () {
    var old = document.getElementById('chatEmojiPicker'); if (old) { old.remove(); return; }
    var panel = document.createElement('div'); panel.id = 'chatEmojiPicker'; panel.className = 'chatx-emoji-pop';
    ['😀','😃','😄','😁','😅','😂','🙂','😉','😊','😍','🥰','😘','😎','🤩','🤗','🤔','😴','😭','😡','👍','👎','👏','🙏','❤️','💚','💙','💛','🎉','✨','🔥','🌟','📚','✏️','✅','❌','🤝','💪','🤲','🌹','⚽','🧸'].forEach(function (emoji) {
      var b = document.createElement('button'); b.textContent = emoji; b.onclick = function () { var input = document.getElementById('chatInput'); if (input) { input.value += emoji; input.focus(); } panel.remove(); }; panel.appendChild(b);
    });
    document.body.appendChild(panel);
  };

  function attachProfileEditor() {
    var profile = document.getElementById('profileScreen'); var content = profile && profile.querySelector('.content'); if (!content) return;
    if (document.getElementById('profilePhotoButton')) { refreshProfileAvatar(); return; }
    var card = content.firstElementChild; if (!card) return;
    var avatar = card.firstElementChild;
    if (avatar) { avatar.innerHTML = '<img id="myProfileAvatar" src="https://ui-avatars.com/api/?name=User&background=2E7D32&color=fff&size=200" alt="صورتي" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'; }
    var button = document.createElement('button'); button.id = 'profilePhotoButton'; button.className = 'chatx-btn chatx-blue chatx-profile-edit'; button.textContent = '📷 إضافة أو تغيير صورتي';
    var input = document.createElement('input'); input.type = 'file'; input.id = 'profilePhotoInput'; input.accept = 'image/*'; input.className = 'chatx-file';
    input.onchange = function () { if (input.files && input.files[0]) uploadProfilePhoto(input.files[0]); input.value = ''; };
    button.onclick = function () { if (requireSecureIdentity()) input.click(); }; card.appendChild(button); card.appendChild(input); refreshProfileAvatar();
  }
  async function refreshProfileAvatar() {
    var img = document.getElementById('myProfileAvatar'); if (!img || !myId() || state.profileAvatarLoadedFor === myId()) return;
    state.profileAvatarLoadedFor = myId();
    try { var doc = await db.collection('public_profiles').doc(myId()).get(); if (doc.exists && doc.data().avatarURL) img.src = safeUrl(doc.data().avatarURL) || img.src; } catch (_) {}
  }
  async function uploadProfilePhoto(file) {
    if (!requireSecureIdentity()) return;
    if (!file.type || file.type.indexOf('image/') !== 0 || file.size > 8 * 1024 * 1024) return toast('اختر صورة لا تتجاوز 8 ميجابايت');
    try {
      toast('⏳ جارٍ رفع الصورة...'); var url = await window.uploadFile(file, 'profile_photos'); if (!url) throw new Error('فشل الرفع');
      await db.collection('public_profiles').doc(myId()).set({ displayName: me().name || 'مستخدم', role: window.currentRole || 'student', avatarURL: url, visible: true, updatedAt: timestamp() }, { merge: true });
      me().avatarURL = url; var image = document.getElementById('myProfileAvatar'); if (image) image.src = url;
      toast('تم تحديث صورتك الشخصية');
    } catch (error) { console.error(error); toast('تعذر حفظ الصورة؛ تحقق من الاتصال والصلاحيات'); }
  }

  window.reportChatMessage = async function (messageId) {
    if (!hasAuthIdentity()) return toast('الإبلاغ يتطلب حسابًا موثقًا.');
    var reason = window.prompt('سبب الإبلاغ (إساءة، محتوى غير مناسب، أو غير ذلك):');
    if (!reason || !reason.trim()) return;
    try {
      await db.collection('chat_reports').add({ reporterId: myId(), reporterName: me().name || 'عضو', messageId: messageId, chatId: state.chatId, channel: isGroup() ? 'group' : 'private', reason: reason.trim().slice(0, 300), status: 'pending', createdAt: timestamp() });
      toast('تم إرسال البلاغ للمالك');
    } catch (error) { console.error(error); toast('تعذر إرسال البلاغ'); }
  };

  function listenForIncomingCalls() {
    if (!hasSecureIdentity() || !myId() || state.inboxUnsub) return;
    state.inboxUnsub = db.collection('calls').where('toId', '==', myId()).onSnapshot(function (snap) {
      snap.docChanges().forEach(function (change) {
        var call = change.doc.data();
        var age = Date.now() - Date.parse(call.createdAt || 0);
        if (call.status === 'ringing' && age >= 0 && age < 60000 && !state.seenCalls[change.doc.id]) { state.seenCalls[change.doc.id] = true; showIncomingCall(change.doc.id, call); }
        if (call.status === 'ended' || call.status === 'rejected' || call.status === 'missed' || call.status === 'busy') { var incoming = document.getElementById('incomingChatCall'); if (incoming && state.incomingCallId === change.doc.id) incoming.remove(); }
      });
    }, function (error) { console.warn('Incoming call listener unavailable', error); });
  }
  function showIncomingCall(callId, call) {
    if (state.call && state.call.id) return db.collection('calls').doc(callId).update({ status: 'busy', endedAt: timestamp() }).catch(function () {});
    if (document.getElementById('incomingChatCall')) return;
    state.incomingCallId = callId;
    if (navigator.vibrate) navigator.vibrate([250, 200, 250]);
    var modal = document.createElement('div'); modal.id = 'incomingChatCall'; modal.className = 'chatx-incoming';
    var avatar = safeUrl(call.callerAvatar) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(call.callerName || 'Caller') + '&background=2E7D32&color=fff&size=160';
    modal.innerHTML = '<div class="chatx-incoming-card"><img src="' + esc(avatar) + '" alt=""><h2>' + esc(call.callerName || 'عضو') + '</h2><p>مكالمة ' + (call.callType === 'video' ? 'فيديو' : 'صوتية') + ' واردة</p><div class="chatx-actions" style="justify-content:center"><button class="chatx-btn chatx-green" id="acceptChatCall">✅ قبول</button><button class="chatx-btn chatx-red" id="rejectChatCall">❌ رفض</button></div></div>';
    document.body.appendChild(modal);
    document.getElementById('acceptChatCall').onclick = function () { modal.remove(); acceptIncomingCall(callId); };
    document.getElementById('rejectChatCall').onclick = function () { modal.remove(); rejectIncomingCall(callId); };
  }
  async function ensureFriendForCall(calleeId) { if (!(await isFriend(calleeId))) throw new Error('المكالمات الخاصة متاحة للأصدقاء بعد قبول الطلب فقط'); }
  function rtcConfig() {
    var config = window.CHAT_RTC_CONFIG || {};
    if (Array.isArray(config.iceServers) && config.iceServers.length) return config;
    return { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  }
  function createPeer(callId) {
    var pc = new RTCPeerConnection(rtcConfig()); state.peer = pc;
    pc.onicecandidate = function (event) {
      if (event.candidate) db.collection('calls').doc(callId).collection('candidates').add({ fromId: myId(), candidate: event.candidate.toJSON(), createdAt: timestamp() }).catch(function (error) { console.warn(error); });
    };
    pc.ontrack = function (event) {
      state.remoteStream = event.streams && event.streams[0] || new MediaStream([event.track]);
      var video = document.getElementById('callRemoteVideo'); var audio = document.getElementById('callRemoteAudio');
      if (state.call && state.call.type === 'video') { if (video) { video.srcObject = state.remoteStream; video.play().catch(function () {}); } if (audio) audio.srcObject = null; }
      else if (audio) { audio.srcObject = state.remoteStream; audio.play().catch(function () {}); }
    };
    pc.onconnectionstatechange = function () {
      if (pc.connectionState === 'failed') toast('تعذر الاتصال؛ قد تحتاج خدمة TURN للشبكة الحالية');
      if (pc.connectionState === 'disconnected') setTimeout(function () { if (state.peer === pc && pc.connectionState === 'disconnected') endCall(false); }, 8000);
    };
    listenForCandidates(callId);
    return pc;
  }
  function listenForCandidates(callId) {
    state.candidateSeen = {}; state.candidateQueue = [];
    if (state.candidateUnsub) { try { state.candidateUnsub(); } catch (_) {} }
    state.candidateUnsub = db.collection('calls').doc(callId).collection('candidates').onSnapshot(function (snap) {
      snap.docChanges().forEach(function (change) {
        var data = change.doc.data(); if (data.fromId === myId() || state.candidateSeen[change.doc.id]) return;
        state.candidateSeen[change.doc.id] = true;
        var candidate = new RTCIceCandidate(data.candidate);
        if (state.peer && state.peer.remoteDescription) state.peer.addIceCandidate(candidate).catch(function (error) { console.warn(error); });
        else state.candidateQueue.push(candidate);
      });
    }, function (error) { console.warn('Candidate listener failed', error); });
  }
  async function drainCandidates() {
    if (!state.peer || !state.peer.remoteDescription) return;
    var pending = state.candidateQueue.splice(0);
    for (var i = 0; i < pending.length; i++) { try { await state.peer.addIceCandidate(pending[i]); } catch (error) { console.warn(error); } }
  }
  function showCallUI(callType, name) {
    injectStyle();
    var old = document.getElementById('activeChatCall'); if (old) old.remove();
    var call = document.createElement('div'); call.id = 'activeChatCall'; call.className = 'chatx-call-screen';
    call.innerHTML = '<div style="text-align:center;padding:8px"><b>' + esc(name || 'مكالمة خاصة') + '</b><div id="callStatusText" style="font-size:13px;opacity:.85;margin-top:6px">جارٍ الاتصال...</div></div><div class="chatx-call-stage"><video id="callRemoteVideo" class="chatx-remote-video" autoplay playsinline></video><audio id="callRemoteAudio" autoplay></audio><video id="callLocalVideo" class="chatx-local-video" autoplay playsinline muted></video><div id="callAudioAvatar" style="position:absolute;font-size:64px;display:none">📞</div></div><div class="chatx-call-controls"><button id="callMuteBtn" style="background:#456">🎙️</button><button id="callCameraBtn" style="background:#456">📹</button><button id="callEndBtn" style="background:#C62828">📵</button></div>';
    document.body.appendChild(call);
    var camera = document.getElementById('callCameraBtn'); camera.style.display = callType === 'video' ? '' : 'none';
    if (callType === 'audio') { document.getElementById('callRemoteVideo').style.display = 'none'; document.getElementById('callLocalVideo').style.display = 'none'; document.getElementById('callAudioAvatar').style.display = 'block'; }
    document.getElementById('callEndBtn').onclick = function () { endCall(true); };
    document.getElementById('callMuteBtn').onclick = toggleCallMute;
    camera.onclick = toggleCallCamera;
  }
  function setLocalStream(stream) {
    state.localStream = stream;
    var video = document.getElementById('callLocalVideo'); if (video) { video.srcObject = stream; video.play().catch(function () {}); }
  }
  function attachCallDocListener(callId, role) {
    if (state.callUnsub) { try { state.callUnsub(); } catch (_) {} }
    state.callUnsub = db.collection('calls').doc(callId).onSnapshot(async function (doc) {
      if (!doc.exists || !state.call || state.call.id !== callId) return;
      var data = doc.data();
      var status = document.getElementById('callStatusText');
      if (status) status.textContent = data.status === 'active' ? 'متصل' : data.status === 'ringing' ? 'جارٍ الرنين...' : 'جارٍ الاتصال...';
      if (role === 'caller' && data.answer && state.peer && !state.peer.remoteDescription) {
        try { await state.peer.setRemoteDescription(new RTCSessionDescription(data.answer)); await drainCandidates(); } catch (error) { console.error(error); }
      }
      if (['rejected', 'missed', 'busy', 'ended'].indexOf(data.status) >= 0 && state.call && !state.call.localEnding) {
        toast(data.status === 'rejected' ? 'تم رفض المكالمة' : data.status === 'missed' ? 'لم يتم الرد على المكالمة' : data.status === 'busy' ? 'الطرف الآخر مشغول' : 'انتهت المكالمة');
        endCall(false);
      }
    });
  }
  window.startChatCall = async function (type) {
    if (!requireSecureIdentity()) return;
    if (isGroup() || !state.friend) return toast('المكالمات الصوتية/الفيديو للأصدقاء في المحادثة الخاصة فقط');
    try {
      await ensureFriendForCall(state.friend.id);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('المتصفح لا يدعم الكاميرا والميكروفون؛ قد يحتاج APK إلى صلاحيات وإعادة بناء.');
      if (state.call) throw new Error('لديك مكالمة نشطة');
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });
      var ref = db.collection('calls').doc(); var callId = ref.id;
      state.call = { id: callId, role: 'caller', type: type, friend: state.friend, localEnding: false };
      showCallUI(type, state.friend.displayName); setLocalStream(stream);
      var pc = createPeer(callId); stream.getTracks().forEach(function (track) { pc.addTrack(track, stream); });
      await ref.set({ fromId: myId(), toId: state.friend.id, toName: state.friend.displayName || 'صديق', participants: sortIds(myId(), state.friend.id), callerName: me().name || 'عضو', callerAvatar: me().avatarURL || '', callType: type, status: 'ringing', createdAt: timestamp() });
      var offer = await pc.createOffer(); await pc.setLocalDescription(offer);
      await ref.update({ offer: { type: offer.type, sdp: offer.sdp } });
      attachCallDocListener(callId, 'caller');
      state.missedTimer = setTimeout(async function () { var doc = await ref.get().catch(function () { return null; }); if (doc && doc.exists && doc.data().status === 'ringing') await ref.update({ status: 'missed', endedAt: timestamp() }).catch(function () {}); }, 45000);
      toast('اتصال...');
    } catch (error) { console.error(error); toast(error.message || 'تعذر بدء المكالمة'); if (state.localStream) endCall(true); }
  };
  async function acceptIncomingCall(callId) {
    if (!requireSecureIdentity()) return;
    try {
      var ref = db.collection('calls').doc(callId); var doc = await ref.get();
      if (!doc.exists || doc.data().status !== 'ringing' || doc.data().toId !== myId()) throw new Error('انتهت المكالمة أو لم تعد متاحة');
      var call = doc.data(); await ensureFriendForCall(call.fromId);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('المتصفح لا يدعم الكاميرا والميكروفون.');
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: call.callType === 'video' });
      state.call = { id: callId, role: 'callee', type: call.callType, friend: { id: call.fromId, displayName: call.callerName }, localEnding: false };
      showCallUI(call.callType, call.callerName); setLocalStream(stream);
      var pc = createPeer(callId); stream.getTracks().forEach(function (track) { pc.addTrack(track, stream); });
      await pc.setRemoteDescription(new RTCSessionDescription(call.offer));
      var answer = await pc.createAnswer(); await pc.setLocalDescription(answer);
      await ref.update({ answer: { type: answer.type, sdp: answer.sdp }, status: 'active', acceptedAt: timestamp() });
      await drainCandidates(); attachCallDocListener(callId, 'callee');
    } catch (error) { console.error(error); toast(error.message || 'تعذر قبول المكالمة'); }
  }
  async function rejectIncomingCall(id) { try { await db.collection('calls').doc(id).update({ status: 'rejected', endedAt: timestamp(), rejectedBy: myId() }); } catch (error) { console.warn(error); } }
  async function endCall(updateServer) {
    var active = state.call; if (!active) { var screen = document.getElementById('activeChatCall'); if (screen) screen.remove(); return; }
    active.localEnding = true;
    if (updateServer) await db.collection('calls').doc(active.id).update({ status: 'ended', endedAt: timestamp(), endedBy: myId() }).catch(function () {});
    if (state.callUnsub) { try { state.callUnsub(); } catch (_) {} state.callUnsub = null; }
    if (state.candidateUnsub) { try { state.candidateUnsub(); } catch (_) {} state.candidateUnsub = null; }
    if (state.missedTimer) clearTimeout(state.missedTimer); state.missedTimer = null;
    if (state.peer) { try { state.peer.close(); } catch (_) {} state.peer = null; }
    if (state.localStream) state.localStream.getTracks().forEach(function (track) { track.stop(); });
    if (state.remoteStream) state.remoteStream.getTracks().forEach(function (track) { track.stop(); });
    state.localStream = null; state.remoteStream = null; state.call = null;
    var callScreen = document.getElementById('activeChatCall'); if (callScreen) callScreen.remove();
  }
  function toggleCallMute() { if (!state.localStream) return; var tracks = state.localStream.getAudioTracks(); tracks.forEach(function (track) { track.enabled = !track.enabled; }); var button = document.getElementById('callMuteBtn'); if (button) button.textContent = tracks.some(function (t) { return t.enabled; }) ? '🎙️' : '🔇'; }
  function toggleCallCamera() { if (!state.localStream) return; var tracks = state.localStream.getVideoTracks(); tracks.forEach(function (track) { track.enabled = !track.enabled; }); var button = document.getElementById('callCameraBtn'); if (button) button.textContent = tracks.some(function (t) { return t.enabled; }) ? '📹' : '🚫'; }
  window.openCallHistory = async function (targetBox) {
    var box;
    if (targetBox) box = targetBox;
    else { makeScreen('chatCallsScreen', '📞 المكالمات'); goScreen('chatCallsScreen'); box = document.getElementById('chatCallsScreenContent'); }
    if (!requireSecureIdentity()) { box.innerHTML = '<div class="empty-state">سجل المكالمات يتاح بعد تفعيل الأمان الخادمي.</div>'; return; }
    box.innerHTML = '<div class="empty-state">⏳ جارٍ تحميل سجل المكالمات...</div>';
    try {
      var snap = await db.collection('calls').where('participants', 'array-contains', myId()).get();
      var calls = snap.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); }).sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); }).slice(0, 50);
      box.innerHTML = '';
      if (!calls.length) { box.innerHTML = '<div class="empty-state">لا توجد مكالمات بعد.</div>'; return; }
      calls.forEach(function (call) {
        var otherName = call.fromId === myId() ? call.toName || 'صديق' : call.callerName || 'صديق';
        var statusLabel = ({ringing:'يرن',active:'تم الاتصال',rejected:'مرفوضة',missed:'فائتة',ended:'منتهية',busy:'مشغول'})[call.status] || call.status || 'مكالمة';
        var row = document.createElement('div'); row.className = 'chatx-row';
        row.innerHTML = '<div class="chatx-avatar">' + (call.callType === 'video' ? '📹' : '📞') + '</div><div class="chatx-row-info"><b>' + esc(otherName) + '</b><div class="chatx-small">' + esc(statusLabel) + ' • ' + esc(call.createdAt || '') + '</div></div>';
        box.appendChild(row);
      });
    } catch (error) { console.error(error); box.innerHTML = '<div class="empty-state">تعذر تحميل سجل المكالمات.</div>'; }
  };
  window.endChatCall = endCall;
  function ensureChatReportEntry() {
    if (window.currentRole !== 'owner' || document.getElementById('chatReportsEntry')) return;
    hasOwnerAuth().then(function (valid) {
      if (!valid || document.getElementById('chatReportsEntry')) return;
      var admin = document.getElementById('adminScreen'); var content = admin && admin.querySelector('.content');
      if (!content) return;
      var entry = document.createElement('div'); entry.id = 'chatReportsEntry'; entry.className = 'menu-item';
      entry.innerHTML = '<span style="font-size:25px">⚑</span><span style="flex:1;font-weight:700;color:#B71C1C">بلاغات الدردشة</span><span style="color:#999;font-size:24px">‹</span>';
      entry.onclick = window.openChatReports; content.insertBefore(entry, content.firstChild);
    });
  }
  window.openChatReports = async function () {
    if (!(await hasOwnerAuth())) return toast('مراجعة البلاغات تحتاج جلسة مالك موثقة من Firebase.');
    injectStyle(); makeScreen('chatReportsScreen', '⚑ بلاغات الدردشة'); goScreen('chatReportsScreen');
    var box = document.getElementById('chatReportsScreenContent'); box.innerHTML = '<div class="empty-state">⏳ جاري تحميل البلاغات...</div>';
    try {
      var snap = await db.collection('chat_reports').where('status', '==', 'pending').get();
      box.innerHTML = '';
      if (snap.empty) { box.innerHTML = '<div class="empty-state">لا توجد بلاغات معلقة.</div>'; return; }
      for (var i = 0; i < snap.docs.length; i++) {
        var doc = snap.docs[i]; var report = doc.data(); var message = null;
        try { var ref = report.channel === 'group' ? db.collection('public_chat').doc(report.messageId) : db.collection('messages').doc(report.chatId).collection('msgs').doc(report.messageId); var msgDoc = await ref.get(); if (msgDoc.exists) message = msgDoc.data(); } catch (_) {}
        var card = document.createElement('div'); card.className = 'chatx-row'; card.style.alignItems = 'flex-start'; card.style.flexDirection = 'column';
        card.innerHTML = '<b>' + esc(report.reporterName || 'مستخدم') + ' أبلغ عن رسالة (' + (report.channel === 'group' ? 'جماعية' : 'خاصة') + ')</b><div class="chatx-small">السبب: ' + esc(report.reason || 'غير محدد') + '</div><div style="padding:9px;background:#f5f7f5;border-radius:8px;width:100%;box-sizing:border-box;margin-top:7px">' + esc(message && message.text || (message && message.kind ? 'مرفق ' + message.kind : 'تعذر تحميل الرسالة')) + '</div>';
        var actions = document.createElement('div'); actions.className = 'chatx-actions';
        var reviewed = document.createElement('button'); reviewed.className = 'chatx-btn chatx-grey'; reviewed.textContent = 'تمت المراجعة'; reviewed.onclick = function (id) { return function () { window.reviewChatReport(id, false); }; }(doc.id);
        var remove = document.createElement('button'); remove.className = 'chatx-btn chatx-red'; remove.textContent = 'حذف الرسالة والبلاغ'; remove.onclick = function (id) { return function () { window.reviewChatReport(id, true); }; }(doc.id);
        actions.appendChild(reviewed); actions.appendChild(remove); card.appendChild(actions); box.appendChild(card);
      }
    } catch (error) { console.error(error); box.innerHTML = '<div class="empty-state">تعذر تحميل البلاغات.</div>'; }
  };
  window.reviewChatReport = async function (reportId, deleteMessage) {
    if (!(await hasOwnerAuth())) return toast('هذه العملية تحتاج جلسة مالك موثقة من Firebase.');
    try {
      var ref = db.collection('chat_reports').doc(reportId); var doc = await ref.get(); if (!doc.exists) return;
      var report = doc.data();
      if (deleteMessage) {
        var messageRef = report.channel === 'group' ? db.collection('public_chat').doc(report.messageId) : db.collection('messages').doc(report.chatId).collection('msgs').doc(report.messageId);
        await messageRef.delete();
      }
      await ref.update({ status: deleteMessage ? 'removed' : 'reviewed', reviewedAt: timestamp(), reviewedBy: myId() });
      toast(deleteMessage ? 'تم حذف الرسالة وإغلاق البلاغ' : 'تم تسجيل مراجعة البلاغ'); window.openChatReports();
    } catch (error) { console.error(error); toast('تعذر تحديث البلاغ؛ تحقق من صلاحيات Firestore'); }
  };

  window.addEventListener('load', function () {
    injectStyle(); attachProfileEditor();
    setInterval(function () { attachProfileEditor(); ensureChatReportEntry(); }, 4000);
    if (window.currentUser) ensureMyPublicProfile();
  });
  var priorLogout = window.logout;
  window.logout = async function () {
    if (state.messageUnsub) { try { state.messageUnsub(); } catch (_) {} state.messageUnsub = null; }
    if (state.inboxUnsub) { try { state.inboxUnsub(); } catch (_) {} state.inboxUnsub = null; }
    if (state.call) await endCall(true);
    if (typeof priorLogout === 'function') await priorLogout.apply(this, arguments);
    try {
      var authUser = firebase.auth && firebase.auth().currentUser;
      if (authUser && !authUser.isAnonymous) await firebase.auth().signOut();
    } catch (error) { console.warn(error); }
  };
})();
