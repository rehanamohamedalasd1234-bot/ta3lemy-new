// ═══════════════════════════════════════════════════════
// 💬 ملف الدردشة الاحترافي (نصوص + وسائط + إشعارات)
// ═══════════════════════════════════════════════════════

(function(){
  console.log('💬 Chat System Loading...');

  // ═══ 1. إرسال رسالة نصية ═══
  window.sendMessage = async function(){
    var inp = document.getElementById('chatInput');
    if(!inp) return;
    var txt = inp.value.trim();
    if(!txt || !window.currentChatId || !window.currentUser) return;
    if(window.currentChatId !== 'public_chat'){
      if(typeof showToast === 'function') showToast('استخدم صندوق الرسائل لتبادل الرسائل الخاصة بأمان.');
      return;
    }
    
    try {
      var fs = firebase.firestore();
      var msgData = {
        senderId: window.currentUser.uid,
        senderName: window.currentUser.name,
        text: txt,
        type: 'text',
        createdAt: new Date().toISOString()
      };
      
      if(window.currentChatId === 'public_chat'){
        await fs.collection('public_chat').add(msgData);
      } else {
        await fs.collection('messages').doc(window.currentChatId).collection('msgs').add(msgData);
        await fs.collection('messages').doc(window.currentChatId).update({
          text: txt,
          updatedAt: new Date().toISOString()
        });
      }
      inp.value = '';
    } catch(e){ 
      console.error(e); 
      if(typeof showToast === 'function') showToast('❌ فشل الإرسال'); 
    }
  };

  // ═══ 2. إرسال صورة/فيديو/صوت ═══
  window.sendMediaMessage = async function(file, type){
    if(!file || !window.currentChatId || !window.currentUser) return;
    if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
    
    try {
      var folder = type === 'image' ? 'chat/images' : type === 'video' ? 'chat/videos' : 'chat/voices';
      var url = await window.uploadFile(file, folder);
      if(!url) throw new Error('فشل الرفع');
      
      var fs = firebase.firestore();
      var msgData = {
        senderId: window.currentUser.uid,
        senderName: window.currentUser.name,
        text: type === 'image' ? '🖼️ صورة' : type === 'video' ? '🎥 فيديو' : '🎤 رسالة صوتية',
        type: type,
        mediaUrl: url,
        createdAt: new Date().toISOString()
      };
      
      if(window.currentChatId === 'public_chat'){
        await fs.collection('public_chat').add(msgData);
      } else {
        await fs.collection('messages').doc(window.currentChatId).collection('msgs').add(msgData);
        await fs.collection('messages').doc(window.currentChatId).update({
          text: msgData.text,
          updatedAt: new Date().toISOString()
        });
      }
      if(typeof showToast === 'function') showToast('✅ تم الإرسال');
    } catch(e){ 
      console.error(e); 
      if(typeof showToast === 'function') showToast('❌ فشل الرفع'); 
    }
  };

  // ═══ 3. حذف رسالة ═══
  window.deleteMsg = async function(msgId){
    if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
    if(window.currentChatId !== 'public_chat') return;
    if(!confirm('حذف الرسالة؟')) return;
    try {
      var fs = firebase.firestore();
      if(window.currentChatId === 'public_chat'){
        await fs.collection('public_chat').doc(msgId).delete();
      } else {
        await fs.collection('messages').doc(window.currentChatId).collection('msgs').doc(msgId).delete();
      }
    } catch(e){ console.error(e); }
  };

  // ═══ 4. فتح محادثة عامة أو خاصة ═══
  window.openChatRoom = function(chatId, withId, withName){
    window.currentChatId = chatId;
    window.currentChatWith = { id: withId, name: withName };
    
    var title = document.getElementById('chatTitle');
    if(title) title.textContent = withName;
    
    var c = document.getElementById('chatMessages');
    if(c) c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
    
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('chatScreen');
    
    if(window.chatUnsubscribe){ try{ window.chatUnsubscribe(); }catch(e){} }
    
    var fs = firebase.firestore();
    var collection = chatId === 'public_chat' ? fs.collection('public_chat') : fs.collection('messages').doc(chatId).collection('msgs');
    
    window.chatUnsubscribe = collection.orderBy('createdAt', 'asc').limit(100).onSnapshot(function(snap){
      var c2 = document.getElementById('chatMessages');
      if(!c2) return;
      if(snap.empty){
        c2.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">لا توجد رسائل — كن أول من يكتب</p>';
        return;
      }
      
      var html = '';
      snap.forEach(function(doc){
        var m = doc.data();
        var mine = m.senderId === window.currentUser.uid;
        
        html += '<div class="chat-bubble ' + (mine ? 'mine' : 'other') + '" style="position:relative; margin-bottom:8px;">';
        
        // إظهار اسم المرسل لو مش أنا
        if(!mine) {
          html += '<div style="font-size:11px;font-weight:bold;color:#2E7D32;margin-bottom:4px;">' + (m.senderName || 'مستخدم') + '</div>';
        }
        
        // المحتوى
        if(m.type === 'image'){
          html += '<img src="' + m.mediaUrl + '" style="max-width:220px; border-radius:10px; cursor:pointer;" onclick="window.open(this.src)">';
        } else if(m.type === 'video'){
          html += '<video controls src="' + m.mediaUrl + '" style="max-width:240px; border-radius:10px;"></video>';
        } else if(m.type === 'voice'){
          html += '<audio controls src="' + m.mediaUrl + '" style="max-width:240px;"></audio>';
        } else {
          html += '<div style="font-size:14px; line-height:1.6; word-wrap:break-word;">' + m.text + '</div>';
        }
        
        html += '<span class="chat-bubble-time">' + new Date(m.createdAt).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}) + '</span>';
        
        // زرار الحذف للمالك/المعلم
        if((window.currentRole === 'owner' || window.currentRole === 'teacher') && !mine){
          html += '<button onclick="deleteMsg(\'' + doc.id + '\')" style="position:absolute; top:5px; left:5px; background:#E53935; color:#fff; border:none; border-radius:50%; width:22px; height:22px; font-size:12px; cursor:pointer;">✕</button>';
        }
        
        html += '</div>';
      });
      c2.innerHTML = html;
      c2.scrollTop = c2.scrollHeight;
    });
  };

  // ═══ 5. إضافة أزرار الوسائط في شريط الدردشة ═══
  window.addEventListener('load', function(){
    setInterval(function(){
      var chatScreen = document.getElementById('chatScreen');
      if(!chatScreen || !chatScreen.classList.contains('active')) return;
      
      var inputBar = chatScreen.querySelector('.chat-input-bar');
      if(!inputBar || document.getElementById('mediaBar')) return;
      
      // إضافة الأزرار
      var mediaBar = document.createElement('div');
      mediaBar.id = 'mediaBar';
      mediaBar.style.cssText = 'display:flex; gap:4px; align-items:center;';
      
      mediaBar.innerHTML = 
        '<label style="cursor:pointer;background:#F0F0F0;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;"><span>🖼️</span><input type="file" accept="image/*" style="display:none;" onchange="window.sendMediaMessage(this.files[0], \'image\')"></label>' +
        '<label style="cursor:pointer;background:#F0F0F0;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;"><span>🎥</span><input type="file" accept="video/*" style="display:none;" onchange="window.sendMediaMessage(this.files[0], \'video\')"></label>' +
        '<label style="cursor:pointer;background:#F0F0F0;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;"><span>🎤</span><input type="file" accept="audio/*" style="display:none;" onchange="window.sendMediaMessage(this.files[0], \'voice\')"></label>';
      
      inputBar.insertBefore(mediaBar, inputBar.firstChild);
    }, 2000);
  });

  console.log('✅ Pro Chat System Loaded');
})();
    if(window.currentChatId !== 'public_chat'){
      if(typeof showToast === 'function') showToast('الوسائط غير مفعلة في المحادثة الخاصة حفاظًا على الخصوصية.');
      return;
    }
    if(chatId !== 'public_chat'){
      if(typeof showToast === 'function') showToast('المحادثات الخاصة تُفتح من صندوق الرسائل الآمن.');
      return;
    }
