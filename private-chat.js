// Private one-to-one chat UI. Private data is read and written only through callable Functions.
(function () {
  'use strict';

  var REGION = 'us-central1';
  var privateConversationId = '';
  var privateChatPollTimer = null;
  var legacySendMessage = window.sendMessage;
  var legacySendMediaMessage = window.sendMediaMessage;
  var legacyOpenPublicChat = window.openPublicChat;

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
  }

  function callable(name, payload) {
    if (!window.firebase || !firebase.functions) {
      return Promise.reject(new Error('Firebase Functions غير متاح.'));
    }
    return firebase.functions(REGION).httpsCallable(name)(payload || {}).then(function (result) {
      return result && result.data ? result.data : {};
    });
  }

  function signedIn() {
    var localUser = window.currentUser;
    var authUser = window.firebase && firebase.auth ? firebase.auth().currentUser : null;
    if (!localUser || !localUser.uid || !authUser || authUser.uid !== localUser.uid) {
      toast('للدردشة الخاصة سجّل الدخول بحسابك مع اتصال بالإنترنت.');
      return false;
    }
    return true;
  }

  function formatTime(value) {
    var date = new Date(Number(value) || Date.now());
    if (isNaN(date.getTime())) date = new Date();
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  }

  function stopPrivatePolling() {
    if (privateChatPollTimer) {
      clearInterval(privateChatPollTimer);
      privateChatPollTimer = null;
    }
  }

  function stopLegacyListener() {
    try {
      if (typeof chatUnsubscribe !== 'undefined' && chatUnsubscribe) {
        chatUnsubscribe();
        chatUnsubscribe = null;
      }
    } catch (_) {}
    try {
      if (window.chatUnsubscribe) {
        window.chatUnsubscribe();
        window.chatUnsubscribe = null;
      }
    } catch (_) {}
  }

  function showChatScreen() {
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('chatScreen');
  }

  function renderMessages(items) {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = '';
    if (!items || !items.length) {
      var empty = document.createElement('p');
      empty.style.cssText = 'text-align:center;color:#999;padding:20px;';
      empty.textContent = 'لا توجد رسائل بعد — ابدأ المحادثة';
      container.appendChild(empty);
      return;
    }
    var myUid = window.currentUser && window.currentUser.uid;
    items.forEach(function (item) {
      var mine = item.senderId === myUid;
      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + (mine ? 'mine' : 'other');
      bubble.style.cssText = 'position:relative;margin-bottom:8px;white-space:pre-wrap;';
      var body = document.createElement('div');
      body.style.cssText = 'font-size:14px;line-height:1.7;overflow-wrap:anywhere;';
      body.textContent = item.text || '';
      var time = document.createElement('span');
      time.className = 'chat-bubble-time';
      time.textContent = formatTime(item.createdAt);
      bubble.appendChild(body);
      bubble.appendChild(time);
      container.appendChild(bubble);
    });
    container.scrollTop = container.scrollHeight;
  }

  function loadPrivateMessages(silent) {
    if (!privateConversationId || !signedIn()) return Promise.resolve();
    return callable('privateChatListMessages', { conversationId: privateConversationId }).then(function (data) {
      if (window.currentChatId !== 'private:' + privateConversationId) return;
      renderMessages(data.items || []);
    }).catch(function (error) {
      if (!silent) toast(error && error.message ? error.message : 'تعذر تحميل الرسائل الخاصة.');
    });
  }

  function startPrivatePolling() {
    stopPrivatePolling();
    privateChatPollTimer = setInterval(function () {
      var screen = document.getElementById('chatScreen');
      if (!screen || !screen.classList.contains('active') || !privateConversationId) {
        stopPrivatePolling();
        return;
      }
      loadPrivateMessages(true);
    }, 6000);
  }

  function openPrivateConversation(conversationId, name, otherId) {
    privateConversationId = conversationId;
    window.currentChatId = 'private:' + conversationId;
    window.currentChatWith = { id: otherId || '', name: name || 'محادثة خاصة' };
    stopLegacyListener();
    var title = document.getElementById('chatTitle');
    if (title) title.textContent = '🔒 ' + (name || 'محادثة خاصة');
    var container = document.getElementById('chatMessages');
    if (container) container.textContent = '⏳ جاري تحميل المحادثة الخاصة...';
    var input = document.getElementById('chatInput');
    if (input) input.value = '';
    showChatScreen();
    loadPrivateMessages(false).then(startPrivatePolling);
  }

  window.activatePrivateChatSession = async function (uid, password) {
    if (!uid || !password || !window.firebase || !firebase.auth) return false;
    try {
      var response = await callable('privateChatAuthenticateLegacy', { uid: String(uid), password: String(password) });
      if (!response.token) throw new Error('لم يصدر خادم المنصة جلسة دردشة.');
      var credential = await firebase.auth().signInWithCustomToken(response.token);
      if (!credential.user || credential.user.uid !== String(uid)) throw new Error('هوية الحساب لا تطابق ملف المنصة.');
      return true;
    } catch (error) {
      console.warn('Private chat session unavailable:', error && error.code ? error.code : 'unknown');
      return false;
    }
  };

  window.openMessages = async function () {
    stopPrivatePolling();
    stopLegacyListener();
    privateConversationId = '';
    if (!window.currentUser) { toast('⚠️ سجّل الدخول أولًا'); return; }
    if (!signedIn()) return;
    var list = document.getElementById('messagesList');
    if (!list) return;
    list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل محادثاتك الخاصة...</p></div>';
    if (typeof window.screenHistory !== 'undefined') screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('messagesScreen');
    try {
      var data = await callable('privateChatListConversations', {});
      list.innerHTML = '';
      var items = data.items || [];
      if (!items.length) {
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = '<div class="empty-state-icon">🔒</div><p>لا توجد محادثات خاصة بعد</p><p style="font-size:13px;margin-top:8px;">اضغط «محادثة جديدة» لبدء محادثة آمنة</p>';
        list.appendChild(empty);
        return;
      }
      items.forEach(function (item) {
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'content-item';
        row.style.cssText = 'width:100%;text-align:right;border:0;font:inherit;cursor:pointer;';
        var icon = document.createElement('div');
        icon.className = 'content-item-icon';
        icon.style.cssText = 'background:#E8F5E9;color:#2E7D32;font-size:24px;';
        icon.textContent = '🔒';
        var info = document.createElement('div');
        info.className = 'content-item-info';
        var title = document.createElement('div');
        title.className = 'content-item-title';
        title.textContent = item.withName || 'مستخدم';
        var preview = document.createElement('div');
        preview.className = 'content-item-sub';
        preview.textContent = item.lastMessage || 'ابدأ المحادثة';
        info.appendChild(title);
        info.appendChild(preview);
        var arrow = document.createElement('div');
        arrow.className = 'content-item-arrow';
        arrow.textContent = '‹';
        row.appendChild(icon);
        row.appendChild(info);
        row.appendChild(arrow);
        row.addEventListener('click', function () {
          openPrivateConversation(item.id, item.withName, item.withId);
        });
        list.appendChild(row);
      });
    } catch (error) {
      list.innerHTML = '<div class="empty-state"><p>تعذر تحميل المحادثات الخاصة.</p><p style="font-size:12px;">تأكد من اتصال الإنترنت وتفعيل خدمات المنصة.</p></div>';
    }
  };

  window.openNewMessage = async function () {
    if (!window.currentUser) { toast('⚠️ سجّل الدخول أولًا'); return; }
    if (!signedIn()) return;
    var name = window.prompt('اكتب الاسم المسجل في المنصة للشخص الذي تريد محادثته:');
    if (!name || name.trim().length < 2) return;
    try {
      var found = await callable('privateChatFindContacts', { name: name.trim() });
      var contacts = found.items || [];
      if (!contacts.length) { toast('لم أجد حسابًا متاحًا بهذا الاسم.'); return; }
      var target = contacts[0];
      if (contacts.length > 1) {
        var choices = contacts.map(function (item, index) {
          return (index + 1) + ') ' + item.name + ' — ' + (item.role === 'teacher' ? 'معلم' : item.role === 'owner' ? 'المالك' : 'طالب');
        }).join('\n');
        var selected = window.prompt('وجدت أكثر من حساب بهذا الاسم. اكتب رقم الشخص المطلوب:\n' + choices, '1');
        var position = Number(selected) - 1;
        if (!isFinite(position) || position < 0 || position >= contacts.length) return;
        target = contacts[position];
      }
      var opened = await callable('privateChatOpen', { targetUid: target.uid });
      openPrivateConversation(opened.id, opened.target && opened.target.name ? opened.target.name : target.name, target.uid);
    } catch (error) {
      toast(error && error.message ? error.message : 'تعذر بدء المحادثة الخاصة.');
    }
  };

  window.openChat = function (conversationId, otherId, otherName) {
    openPrivateConversation(conversationId, otherName, otherId);
  };

  window.openPublicChat = function () {
    stopPrivatePolling();
    privateConversationId = '';
    if (typeof legacyOpenPublicChat === 'function') legacyOpenPublicChat();
    window.currentChatId = 'public_chat';
    window.currentChatWith = { id: 'public', name: 'الدردشة الجماعية' };
  };

  window.sendMessage = function () {
    if (!privateConversationId) {
      if (window.currentChatId === 'public_chat' && typeof legacySendMessage === 'function') return legacySendMessage();
      toast('افتح محادثة أولًا.');
      return;
    }
    var input = document.getElementById('chatInput');
    var text = input ? input.value.trim() : '';
    if (!text) return;
    if (!signedIn()) return;
    if (input) input.disabled = true;
    callable('privateChatSendMessage', { conversationId: privateConversationId, text: text }).then(function () {
      if (input) { input.value = ''; input.disabled = false; }
      return loadPrivateMessages(true);
    }).catch(function (error) {
      if (input) input.disabled = false;
      toast(error && error.message ? error.message : 'تعذر إرسال الرسالة الخاصة.');
    });
  };

  window.sendMediaMessage = function (file, type) {
    if (privateConversationId) {
      toast('الرسائل الخاصة النصية متاحة الآن. أوقفت الصور والملفات مؤقتًا حتى تظل روابطها خاصة فعلًا.');
      return Promise.resolve(false);
    }
    if (typeof legacySendMediaMessage === 'function') return legacySendMediaMessage(file, type);
    return Promise.resolve(false);
  };

  window.addEventListener('beforeunload', stopPrivatePolling);
})();
