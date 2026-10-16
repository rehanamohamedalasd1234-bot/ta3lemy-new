// ═══════════════════════════════════════════════════════
// extras.js — الجزء 1
// Offline + النقاط + تسجيل دخول آمن
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  
  // ═══ 1. Offline ═══
  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().enablePersistence({synchronizeTabs:true})
        .then(function(){ console.log('✅ Offline enabled'); })
        .catch(function(e){ console.log('⚠️ Persistence:', e.code); });
    }
  } catch(e){ console.log('Offline error:', e); }
  
  window.addEventListener('online', function(){
    if(typeof showToast === 'function') showToast('✅ رجع الاتصال');
  });
  window.addEventListener('offline', function(){
    if(typeof showToast === 'function') showToast('📴 وضع Offline');
  });
  
  // ═══ 2. Device ID ═══
  window.getDeviceId = function(){
    var did = localStorage.getItem('hafez_device_id');
    if (!did) {
      did = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('hafez_device_id', did);
    }
    return did;
  };
  
  // ═══ 3. Hash Password ═══
  window.hashPassword = async function(pwd, salt){
    try {
      if (window.crypto && window.crypto.subtle) {
        var enc = new TextEncoder();
        var data = enc.encode(salt + '|' + pwd + '|hafez_secure');
        var buf = await crypto.subtle.digest('SHA-256', data);
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
      }
    } catch(e){}
    var s = salt + '|' + pwd + '|hafez_secure';
    var h1 = 5381, h2 = 52711;
    for (var i = 0; i < s.length; i++) {
      h1 = ((h1 * 33) ^ s.charCodeAt(i)) >>> 0;
      h2 = ((h2 * 31) ^ s.charCodeAt(i)) >>> 0;
    }
    return 'f_' + h1.toString(16) + h2.toString(16);
  };
  
  // ═══ 4. Salt + Recovery ═══
  window.generateSalt = function(){
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };
  window.generateRecoveryCode = function(){
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // ═══ 5. Log Login ═══
  window.logLogin = async function(username, role, success, reason){
    try {
      await firebase.firestore().collection('login_logs').add({
        username: username, role: role, success: success,
        reason: reason || '',
        device: window.getDeviceId(),
        timestamp: new Date().toISOString()
      });
    } catch(e){}
  };
  
  // ═══ 6. Recovery Code Modal ═══
  window.showRecoveryCode = function(code, username){
    var m = document.createElement('div');
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:400px;width:100%;padding:28px;text-align:center;font-family:inherit;">' +
      '<div style="font-size:60px;margin-bottom:12px;">🔐</div>' +
      '<div style="font-size:20px;font-weight:bold;color:#2E7D32;margin-bottom:8px;">كود الاستعادة</div>' +
      '<div style="font-size:13px;color:#666;margin-bottom:20px;">احفظ الكود ده في مكان آمن</div>' +
      '<div style="background:#FFF8E1;padding:20px;border-radius:14px;margin-bottom:16px;">' +
      '<div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#F9A825;direction:ltr;">' + code + '</div>' +
      '</div>' +
      '<div style="font-size:13px;color:#666;margin-bottom:20px;">الحساب: <b>' + username + '</b></div>' +
      '<button id="copyRecBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">📋 نسخ ومتابعة</button>' +
      '</div>';
    document.body.appendChild(m);
    document.getElementById('copyRecBtn').onclick = function(){
      try {
        var ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if(typeof showToast === 'function') showToast('📋 تم النسخ');
      } catch(e){}
      m.remove();
    };
  };
  
  // ═══ 7. Login Override ═══
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(typeof window.login !== 'function') return;
      var origLogin = window.login;
      
      window.login = async function(){
        var unameEl = document.getElementById('usernameInput');
        var pwdEl = document.getElementById('passwordInput');
        var ownerCodeEl = document.getElementById('ownerCodeInput');
        
        var uname = unameEl ? unameEl.value.trim() : '';
        var pwd = pwdEl ? pwdEl.value : '';
        var ownerCode = ownerCodeEl ? ownerCodeEl.value : '';
        
        if (!uname || uname.length < 3) {
          if(typeof showToast === 'function') showToast('⚠️ اسم المستخدم 3 أحرف على الأقل');
          return;
        }
        if (pwd.length < 4) {
          if(typeof showToast === 'function') showToast('⚠️ كلمة المرور 4 أحرف على الأقل');
          return;
        }
        
        // Offline
        if (!navigator.onLine) {
          var saved = localStorage.getItem('lastUser');
          if (saved) {
            try {
              var su = JSON.parse(saved);
              window.currentUser = {name: uname, uid: su.uid, points: su.points || 0};
              window.currentRole = su.role || 'student';
              if(typeof showToast === 'function') showToast('📴 دخول offline');
              if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 400);
              return;
            } catch(e){}
          }
          if(typeof showToast === 'function') showToast('⚠️ محتاج نت أول مرة');
          return;
        }
        
        // Owner
        if (window.currentRole === 'owner') {
          if (ownerCode !== '135790') {
            await window.logLogin(uname, 'owner', false, 'owner code wrong');
            if(typeof showToast === 'function') showToast('🔐 كود المالك خطأ');
            return;
          }
          try {
            await origLogin.apply(this, arguments);
            await window.logLogin(uname, 'owner', true, '');
            if(window.currentUser) {
              localStorage.setItem('lastUser', JSON.stringify({
                name: window.currentUser.name,
                uid: window.currentUser.uid,
                role: 'owner',
                points: window.currentUser.points || 0
              }));
            }
          } catch(e){ console.error(e); }
          return;
        }
        
        // Student/Teacher
        try {
          var fs = firebase.firestore();
          var snap = await fs.collection('users').where('name', '==', uname).limit(1).get();
          
          // مستخدم جديد
          if (snap.empty) {
            var newSalt = window.generateSalt();
            var newHash = await window.hashPassword(pwd, newSalt);
            var recCode = window.generateRecoveryCode();
            var dev = window.getDeviceId();
            var uid = 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
            
            await fs.collection('users').doc(uid).set({
              name: uname,
              role: window.currentRole,
              salt: newSalt,
              passHash: newHash,
              recoveryCode: recCode,
              trustedDevices: [dev],
              points: 0,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            });
            
            window.currentUser = {name: uname, uid: uid, points: 0};
            localStorage.setItem('lastUser', JSON.stringify({
              name: uname, uid: uid, role: window.currentRole, points: 0
            }));
            
            await window.logLogin(uname, window.currentRole, true, 'new account');
            window.showRecoveryCode(recCode, uname);
            
            setTimeout(function(){
              if(typeof showToast === 'function') showToast('✅ تم إنشاء الحساب');
              if(typeof showScreen === 'function') showScreen('homeScreen');
            }, 2000);
            return;
          }
          
          // مستخدم موجود
          var userDoc = snap.docs[0];
          var user = userDoc.data();
          var uid2 = userDoc.id;
          var computed = await window.hashPassword(pwd, user.salt || '');
          
          if (computed !== user.passHash) {
            await window.logLogin(uname, window.currentRole, false, 'wrong password');
            if(typeof showToast === 'function') showToast('❌ كلمة المرور خطأ');
            return;
          }
          
          var dev2 = window.getDeviceId();
          var trusted = user.trustedDevices || [];
          
          if (trusted.indexOf(dev2) === -1) {
            var code = prompt('🔐 جهاز جديد!\n\nأدخل كود الاستعادة (6 أرقام):');
            if (code !== user.recoveryCode) {
              await window.logLogin(uname, window.currentRole, false, 'device not trusted');
              if(typeof showToast === 'function') showToast('❌ كود الاستعادة خطأ');
              return;
            }
            trusted.push(dev2);
            await fs.collection('users').doc(uid2).update({trustedDevices: trusted});
            if(typeof showToast === 'function') showToast('✅ تم تسجيل الجهاز');
          }
          
          window.currentUser = {name: uname, uid: uid2, points: user.points || 0};
          localStorage.setItem('lastUser', JSON.stringify({
            name: uname, uid: uid2, role: user.role || window.currentRole, points: user.points || 0
          }));
          
          await fs.collection('users').doc(uid2).update({lastLogin: new Date().toISOString()});
          await window.logLogin(uname, window.currentRole, true, '');
          
          if(typeof showToast === 'function') showToast('✅ تم تسجيل الدخول');
          if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 600);
          
        } catch(e){
          console.error('login:', e);
          if(typeof showToast === 'function') showToast('❌ خطأ في الاتصال');
        }
      };
      
      console.log('✅ Login override loaded');
    }, 2000);
  });
  
  // ═══ 8. النقاط ═══
  window.BADGES = [
    {id:'new',name:'مبتدئ',icon:'🌱',pts:0},
    {id:'reader',name:'قارئ',icon:'📖',pts:100},
    {id:'student',name:'طالب نشيط',icon:'📚',pts:300},
    {id:'scholar',name:'عالم',icon:'🎓',pts:600},
    {id:'expert',name:'خبير',icon:'⭐',pts:1000},
    {id:'master',name:'محترف',icon:'🏅',pts:2000},
    {id:'legend',name:'أسطورة',icon:'👑',pts:5000}
  ];
  
  window.getCurrentBadge = function(pts){
    var arr = window.BADGES.slice().reverse();
    for(var i=0;i<arr.length;i++) if(pts>=arr[i].pts) return arr[i];
    return window.BADGES[0];
  };
  
  window.addPoints = async function(amt){
    if(!window.currentUser) return;
    try {
      var ref = firebase.firestore().collection('users').doc(window.currentUser.uid);
      var doc = await ref.get();
      var oldPts = doc.exists ? (doc.data().points||0) : 0;
      var newPts = oldPts + amt;
      await ref.update({points: newPts});
      window.currentUser.points = newPts;
      var pe = document.getElementById('profilePoints');
      if(pe) pe.textContent = '⭐ ' + newPts + ' نقطة';
    } catch(e){}
  };
  
  window.showMyPoints = function(){
    if(!window.currentUser) return;
    var pts = window.currentUser.points || 0;
    var b = window.getCurrentBadge(pts);
    alert('⭐ نقاطك: ' + pts + '\n' + b.icon + ' شارتك: ' + b.name);
  };
  
  window.trackLessonView = async function(id){
    if(!window.currentUser) return;
    var k = 'v_' + window.currentUser.uid + '_' + id;
    if(localStorage.getItem(k)) return;
    localStorage.setItem(k, '1');
    await window.addPoints(10);
  };
  
 // ═══════════════════════════════════════════════════════
// الجزء 2: الدردشة + الصور + الصوت + الفيديو + الحذف
// ═══════════════════════════════════════════════════════

// ═══ إرسال صورة ═══
window.sendImageMessage = async function(input){
  if(!input || !input.files || !input.files[0]) return;
  if(!window.currentUser || !window.currentChatId) return;
  var file = input.files[0];
  if(file.size > 5 * 1024 * 1024){
    if(typeof showToast === 'function') showToast('⚠️ الصورة كبيرة (أقصى 5 MB)');
    input.value = '';
    return;
  }
  if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
  try {
    var url = await window.uploadFile(file, 'chat/images');
    if(!url){ input.value = ''; return; }
    var fs = firebase.firestore();
    var msg = {
      senderId: window.currentUser.uid,
      senderName: window.currentUser.name,
      text: '',
      type: 'image',
      mediaUrl: url,
      createdAt: new Date().toISOString()
    };
    if(window.currentChatId === 'public_chat'){
      await fs.collection('public_chat').add(msg);
    } else {
      await fs.collection('messages').doc(window.currentChatId).collection('msgs').add(msg);
      await fs.collection('messages').doc(window.currentChatId).update({
        text: '🖼️ صورة',
        updatedAt: new Date().toISOString()
      });
    }
    if(typeof showToast === 'function') showToast('✅ تم الإرسال');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
  input.value = '';
};

// ═══ إرسال صوت ═══
window.sendVoiceMessage = async function(input){
  if(!input || !input.files || !input.files[0]) return;
  if(!window.currentUser || !window.currentChatId) return;
  var file = input.files[0];
  if(file.size > 5 * 1024 * 1024){
    if(typeof showToast === 'function') showToast('⚠️ التسجيل كبير');
    input.value = '';
    return;
  }
  if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
  try {
    var url = await window.uploadFile(file, 'chat/voices');
    if(!url){ input.value = ''; return; }
    var fs = firebase.firestore();
    var msg = {
      senderId: window.currentUser.uid,
      senderName: window.currentUser.name,
      text: '',
      type: 'voice',
      mediaUrl: url,
      createdAt: new Date().toISOString()
    };
    if(window.currentChatId === 'public_chat'){
      await fs.collection('public_chat').add(msg);
    } else {
      await fs.collection('messages').doc(window.currentChatId).collection('msgs').add(msg);
      await fs.collection('messages').doc(window.currentChatId).update({
        text: '🎤 رسالة صوتية',
        updatedAt: new Date().toISOString()
      });
    }
    if(typeof showToast === 'function') showToast('✅ تم الإرسال');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
  input.value = '';
};

// ═══ إرسال فيديو ═══
window.sendVideoMessage = async function(input){
  if(!input || !input.files || !input.files[0]) return;
  if(!window.currentUser || !window.currentChatId) return;
  var file = input.files[0];
  if(file.size > 20 * 1024 * 1024){
    if(typeof showToast === 'function') showToast('⚠️ الفيديو كبير (أقصى 20 MB)');
    input.value = '';
    return;
  }
  if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
  try {
    var url = await window.uploadFile(file, 'chat/videos');
    if(!url){ input.value = ''; return; }
    var fs = firebase.firestore();
    var msg = {
      senderId: window.currentUser.uid,
      senderName: window.currentUser.name,
      text: '',
      type: 'video',
      mediaUrl: url,
      createdAt: new Date().toISOString()
    };
    if(window.currentChatId === 'public_chat'){
      await fs.collection('public_chat').add(msg);
    } else {
      await fs.collection('messages').doc(window.currentChatId).collection('msgs').add(msg);
      await fs.collection('messages').doc(window.currentChatId).update({
        text: '🎥 فيديو',
        updatedAt: new Date().toISOString()
      });
    }
    if(typeof showToast === 'function') showToast('✅ تم الإرسال');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
  input.value = '';
};

// ═══ حذف رسالة في الجماعية ═══
window.deletePublicMsgById = async function(msgId){
  if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
  if(!confirm('حذف الرسالة؟')) return;
  try {
    await firebase.firestore().collection('public_chat').doc(msgId).delete();
    if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    if(typeof window.openPublicChat === 'function') window.openPublicChat();
  } catch(e){ console.error(e); }
};

// ═══ حذف رسالة في الفردية ═══
window.deletePrivateMsgById = async function(msgId){
  if(!window.currentChatId || window.currentChatId === 'public_chat') return;
  if(!confirm('حذف الرسالة؟')) return;
  try {
    await firebase.firestore().collection('messages').doc(window.currentChatId).collection('msgs').doc(msgId).delete();
    if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    if(typeof window.openChat === 'function') window.openChat(window.currentChatId, window.currentChatWith.id, window.currentChatWith.name);
  } catch(e){ console.error(e); }
};

// ═══ Override openPublicChat (مع الوسائط + الحذف) ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    if(typeof window.openPublicChat !== 'function') return;
    
    window.openPublicChat = function(){
      if(!window.currentUser){ if(typeof showToast === 'function') showToast('⚠️ سجل دخول'); return; }
      window.currentChatId = 'public_chat';
      window.currentChatWith = {id: 'public', name: 'الدردشة الجماعية'};
      var title = document.getElementById('chatTitle');
      if(title) title.textContent = '👥 الدردشة الجماعية';
      var c = document.getElementById('chatMessages');
      if(c) c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
      if(window.screenHistory) window.screenHistory.push(window.currentScreen);
      if(typeof showScreen === 'function') showScreen('chatScreen');
      
      if(window.chatUnsubscribe){ try{ window.chatUnsubscribe(); }catch(e){} }
      window.chatUnsubscribe = firebase.firestore()
        .collection('public_chat').orderBy('createdAt','asc').limit(100)
        .onSnapshot(function(snap){
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
            var canDel = !mine && (window.currentRole === 'owner' || window.currentRole === 'teacher');
            html += '<div class="chat-bubble ' + (mine ? 'mine' : 'other') + '" style="position:relative;">';
            if(canDel){
              html += '<button onclick="deletePublicMsgById(\'' + doc.id + '\')" style="position:absolute;top:5px;left:5px;background:#E53935;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;z-index:10;">✕</button>';
            }
            html += '<div style="font-size:11px;font-weight:bold;color:' + (mine ? '#A5D6A7' : '#2E7D32') + ';margin-bottom:4px;">' + (mine ? 'أنا' : (m.senderName||'مستخدم')) + '</div>';
            if(m.type === 'image'){
              html += '<img src="' + m.mediaUrl + '" style="max-width:220px;border-radius:10px;cursor:pointer;" onclick="window.open(this.src)">';
            } else if(m.type === 'voice'){
              html += '<audio controls src="' + m.mediaUrl + '" style="max-width:240px;"></audio>';
            } else if(m.type === 'video'){
              html += '<video controls src="' + m.mediaUrl + '" style="max-width:240px;border-radius:10px;"></video>';
            } else {
              html += '<div style="font-size:14px;line-height:1.6;word-wrap:break-word;">' + m.text + '</div>';
            }
            html += '<span class="chat-bubble-time">' + new Date(m.createdAt).toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}) + '</span></div>';
          });
          c2.innerHTML = html;
          c2.scrollTop = c2.scrollHeight;
        });
    };
    
    console.log('✅ Chat override loaded');
  }, 2500);
});

// ═══ إضافة أزرار الوسائط في شريط الدردشة ═══
window.addEventListener('load', function(){
  setInterval(function(){
    var chatScreen = document.getElementById('chatScreen');
    if(!chatScreen || !chatScreen.classList.contains('active')) return;
    var inputBar = chatScreen.querySelector('.chat-input-bar');
    if(!inputBar || inputBar.querySelector('#mediaBar')) return;
    
    var bar = document.createElement('div');
    bar.id = 'mediaBar';
    bar.style.cssText = 'display:flex;gap:4px;margin-right:8px;';
    bar.innerHTML = 
      '<label style="cursor:pointer;font-size:20px;padding:6px;background:#F0F0F0;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;"><span>🖼️</span><input type="file" accept="image/*" style="display:none;" onchange="window.sendImageMessage(this)"></label>' +
      '<label style="cursor:pointer;font-size:20px;padding:6px;background:#F0F0F0;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;"><span>🎤</span><input type="file" accept="audio/*" style="display:none;" onchange="window.sendVoiceMessage(this)"></label>' +
      '<label style="cursor:pointer;font-size:20px;padding:6px;background:#F0F0F0;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;"><span>🎥</span><input type="file" accept="video/*" style="display:none;" onchange="window.sendVideoMessage(this)"></label>';
    
    inputBar.insertBefore(bar, inputBar.firstChild);
  }, 2000);
});

console.log('✅ Part 2 loaded (Chat + Media)');
 // ═══════════════════════════════════════════════════════
// الجزء 3: الملف الشخصي + المفضلة + الملاحظات
// ═══════════════════════════════════════════════════════

// ═══ الملف الشخصي ═══
window.openEditProfile = async function(){
  if(!window.currentUser) return;
  if(typeof showScreen === 'function') showScreen('profileScreen');
  var name = prompt('الاسم الجديد:', window.currentUser.name);
  if(!name || name.trim().length < 3) return;
  try {
    await firebase.firestore().collection('users').doc(window.currentUser.uid).update({
      name: name.trim(),
      updatedAt: new Date().toISOString()
    });
    window.currentUser.name = name.trim();
    var pn = document.getElementById('profileName');
    if(pn) pn.textContent = name.trim();
    if(typeof showToast === 'function') showToast('✅ تم الحفظ');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};

window.uploadProfilePic = async function(input){
  if(!input.files || !input.files[0] || !window.currentUser) return;
  var file = input.files[0];
  if(file.size > 2 * 1024 * 1024){
    if(typeof showToast === 'function') showToast('⚠️ الصورة كبيرة');
    return;
  }
  if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
  try {
    var url = await window.uploadFile(file, 'users/avatars');
    if(url){
      await firebase.firestore().collection('users').doc(window.currentUser.uid).update({photo_url: url});
      window.currentUser.photo_url = url;
      if(typeof showToast === 'function') showToast('✅ تم تحديث الصورة');
    }
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
  input.value = '';
};

// ═══ المفضلة ═══
window.toggleFavorite = async function(){
  if(!window.currentUser) return;
  var lessonId = window.currentLessonId;
  if(!lessonId){
    var t = document.getElementById('viewerTitle');
    if(t) lessonId = t.textContent;
  }
  if(!lessonId){ if(typeof showToast === 'function') showToast('⚠️ افتح درس أولاً'); return; }
  try {
    var fs = firebase.firestore();
    var ref = fs.collection('users').doc(window.currentUser.uid).collection('favorites').doc(encodeURIComponent(lessonId));
    var doc = await ref.get();
    if(doc.exists){
      await ref.delete();
      if(typeof showToast === 'function') showToast('⭐ تم الإزالة من المفضلة');
    } else {
      await ref.set({
        lessonId: lessonId,
        lessonTitle: document.getElementById('viewerTitle') ? document.getElementById('viewerTitle').textContent : '',
        addedAt: new Date().toISOString()
      });
      if(typeof showToast === 'function') showToast('⭐ تم الإضافة للمفضلة');
    }
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};

window.openFavorites = async function(){
  if(!window.currentUser) return;
  try {
    var snap = await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('favorites').orderBy('addedAt','desc').get();
    if(snap.empty){ 
      if(typeof showToast === 'function') showToast('⭐ لا توجد عناصر في المفضلة');
      return; 
    }
    var list = '';
    snap.forEach(function(doc){
      var f = doc.data();
      list += '• ' + (f.lessonTitle || f.lessonId) + '\n';
    });
    alert('⭐ المفضلة:\n\n' + list);
  } catch(e){ console.error(e); }
};

// ═══ الملاحظات ═══
window.openNotes = async function(){
  if(!window.currentUser) return;
  try {
    var snap = await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('notes').orderBy('createdAt','desc').get();
    if(snap.empty){ 
      var txt = prompt('📝 لا توجد ملاحظات. اكتب ملاحظة جديدة:');
      if(txt && txt.trim()){
        await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('notes').add({
          text: txt.trim(),
          createdAt: new Date().toISOString()
        });
        if(typeof showToast === 'function') showToast('✅ تم الحفظ');
      }
      return;
    }
    var list = '';
    var ids = [];
    snap.forEach(function(doc){
      var n = doc.data();
      list += '• ' + n.text + '\n';
      ids.push(doc.id);
    });
    var txt2 = prompt('📝 ملاحظاتك:\n\n' + list + '\n\nأضف ملاحظة جديدة (أو اتركه فاضي):');
    if(txt2 && txt2.trim()){
      await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('notes').add({
        text: txt2.trim(),
        createdAt: new Date().toISOString()
      });
      if(typeof showToast === 'function') showToast('✅ تم الحفظ');
    }
  } catch(e){ console.error(e); }
};

console.log('✅ Part 3 loaded (Profile + Favorites + Notes)'); 
 // ═══ Pomodoro ═══
window.openPomodoro = function(){
  var m = document.createElement('div');
  m.id = 'pomoModal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  var timeLeft = 25 * 60;
  var running = false;
  var interval;
  m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:400px;width:100%;padding:24px;text-align:center;font-family:inherit;">' +
    '<div style="font-size:22px;font-weight:bold;color:#1976D2;margin-bottom:16px;">⏱️ مؤقت الدراسة</div>' +
    '<div id="pomoDisplay" style="font-size:64px;font-weight:bold;color:#1976D2;font-family:monospace;direction:ltr;margin:20px 0;">25:00</div>' +
    '<div style="display:flex;gap:10px;justify-content:center;">' +
    '<button id="pomoStart" style="padding:14px 30px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">▶️ ابدأ</button>' +
    '<button id="pomoClose" style="padding:14px 20px;background:#F5F5F5;color:#424242;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕</button>' +
    '</div></div>';
  document.body.appendChild(m);
  document.getElementById('pomoClose').onclick = function(){
    if(interval) clearInterval(interval);
    m.remove();
  };
  document.getElementById('pomoStart').onclick = function(){
    var btn = document.getElementById('pomoStart');
    if(running){
      clearInterval(interval);
      running = false;
      btn.textContent = '▶️ متابعة';
    } else {
      running = true;
      btn.textContent = '⏸️ إيقاف';
      interval = setInterval(function(){
        timeLeft--;
        var mm = Math.floor(timeLeft / 60);
        var ss = timeLeft % 60;
        document.getElementById('pomoDisplay').textContent = (mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
        if(timeLeft <= 0){
          clearInterval(interval);
          if(typeof window.addPoints === 'function') window.addPoints(15);
          if(typeof showToast === 'function') showToast('🎉 خلّصت! +15 نقطة');
          m.remove();
        }
      }, 1000);
    }
  };
};
console.log('✅ Pomodoro loaded');
// ═══ News (بسيط) ═══
window.openNews = async function(){
  if(!window.currentUser) return;
  try {
    var snap = await firebase.firestore().collection('posts').orderBy('created_at','desc').limit(20).get();
    var list = '';
    if(snap.empty){
      list = 'لا توجد منشورات بعد.';
    } else {
      snap.forEach(function(doc){
        var p = doc.data();
        list += '📰 ' + (p.title||'') + '\n' + (p.content||'').substring(0,80) + '...\n\n';
      });
    }
    var action = confirm('📰 الأخبار والمقالات:\n\n' + list + '\n\nهل تريد إضافة مقال جديد؟');
    if(action){
      var t = prompt('عنوان المقال:');
      var c = prompt('محتوى المقال:');
      if(t && c){
        await firebase.firestore().collection('posts').add({
          title: t, content: c,
          author_id: window.currentUser.uid,
          author_name: window.currentUser.name,
          created_at: new Date().toISOString()
        });
        if(typeof showToast === 'function') showToast('✅ تم النشر');
      }
    }
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};
console.log('✅ News loaded');  
 // ═══ Quick Menu ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('quickMenu')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'quickMenu';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#F9A825,#FBC02D);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">⚡</div><div style="margin-top:8px;font-size:15px;">قائمة سريعة</div>';
    btn.onclick = function(){
      var choice = prompt('⚡ اختر:\n\n1. مؤقت الدراسة\n2. الأخبار والمقالات\n3. نقاطي\n4. المفضلة\n5. ملاحظاتي\n6. تسجيل الخروج');
      if(choice === '1') window.openPomodoro();
      else if(choice === '2') window.openNews();
      else if(choice === '3') window.showMyPoints();
      else if(choice === '4') window.openFavorites();
      else if(choice === '5') window.openNotes();
      else if(choice === '6' && typeof logout === 'function') logout();
    };
    content.insertBefore(btn, content.firstChild);
  }, 3000);
});
console.log('✅ Quick Menu loaded');
// ═══ Quick Menu ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('quickMenu')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'quickMenu';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#F9A825,#FBC02D);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">⚡</div><div style="margin-top:8px;font-size:15px;">قائمة سريعة</div>';
    btn.onclick = function(){
      var choice = prompt('⚡ اختر:\n\n1. مؤقت الدراسة\n2. الأخبار والمقالات\n3. نقاطي\n4. المفضلة\n5. ملاحظاتي\n6. تسجيل الخروج');
      if(choice === '1') window.openPomodoro();
      else if(choice === '2') window.openNews();
      else if(choice === '3') window.showMyPoints();
      else if(choice === '4') window.openFavorites();
      else if(choice === '5') window.openNotes();
      else if(choice === '6' && typeof logout === 'function') logout();
    };
    content.insertBefore(btn, content.firstChild);
  }, 3000);
});
console.log('✅ Quick Menu loaded');
// ═══ زر التحميل للعمل بدون نت ═══
window.downloadAllOffline = async function(){
  if(!navigator.onLine){ if(typeof showToast === 'function') showToast('⚠️ محتاج نت'); return; }
  if(typeof showToast === 'function') showToast('⏳ جاري التحميل...');
  try {
    var fs = firebase.firestore();
    var ls = await fs.collection('lessons').get();
    var lessons = [];
    ls.forEach(function(d){ lessons.push(Object.assign({id: d.id}, d.data())); });
    localStorage.setItem('offline_lessons', JSON.stringify(lessons));
    if(typeof showToast === 'function') showToast('✅ الدروس: ' + lessons.length);
    
    var r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    var j = await r.json();
    var quran = {};
    j.data.surahs.forEach(function(s){
      quran[s.number] = {name: s.name, ayahs: s.ayahs.map(function(a){return {num: a.numberInSurah, text: a.text};})};
    });
    localStorage.setItem('offline_quran_full', JSON.stringify(quran));
    if(typeof showToast === 'function') showToast('✅ القرآن: ' + j.data.surahs.length + ' سورة');
    
    if(typeof showToast === 'function') showToast('🎉 تم التحميل الكامل!');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};

window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('offlineBtn')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'offlineBtn';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">📥</div><div style="margin-top:8px;font-size:15px;">تحميل المنصة بدون نت</div><div style="font-size:12px;opacity:.9;margin-top:4px;">(يحتاج نت — مرة واحدة)</div>';
    btn.onclick = function(){ window.downloadAllOffline(); };
    content.insertBefore(btn, content.firstChild);
  }, 3000);
});
console.log('✅ Offline Button loaded');
// ═══ الأخبار والمقالات ═══
window.openNews = async function(){
  if(!window.currentUser) return;
  try {
    var snap = await firebase.firestore().collection('posts').orderBy('created_at','desc').limit(20).get();
    var list = '';
    if(snap.empty){
      list = 'لا توجد منشورات بعد.';
    } else {
      snap.forEach(function(doc){
        var p = doc.data();
        list += '📰 ' + (p.title||'') + '\n' + (p.content||'').substring(0,80) + '...\n\n';
      });
    }
    var action = confirm('📰 الأخبار والمقالات:\n\n' + list + '\n\nهل تريد إضافة مقال جديد؟');
    if(action){
      var t = prompt('عنوان المقال:');
      var c = prompt('محتوى المقال:');
      if(t && c){
        await firebase.firestore().collection('posts').add({
          title: t, content: c,
          author_id: window.currentUser.uid,
          author_name: window.currentUser.name,
          created_at: new Date().toISOString()
        });
        if(typeof showToast === 'function') showToast('✅ تم النشر');
      }
    }
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};

// ═══ Pomodoro ═══
window.openPomodoro = function(){
  var m = document.createElement('div');
  m.id = 'pomoModal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  var timeLeft = 25 * 60;
  var running = false;
  var interval;
  m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:400px;width:100%;padding:24px;text-align:center;font-family:inherit;">' +
    '<div style="font-size:22px;font-weight:bold;color:#1976D2;margin-bottom:16px;">⏱️ مؤقت الدراسة</div>' +
    '<div id="pomoDisplay" style="font-size:64px;font-weight:bold;color:#1976D2;font-family:monospace;direction:ltr;margin:20px 0;">25:00</div>' +
    '<div style="display:flex;gap:10px;justify-content:center;">' +
    '<button id="pomoStart" style="padding:14px 30px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">▶️ ابدأ</button>' +
    '<button id="pomoClose" style="padding:14px 20px;background:#F5F5F5;color:#424242;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕</button>' +
    '</div></div>';
  document.body.appendChild(m);
  document.getElementById('pomoClose').onclick = function(){
    if(interval) clearInterval(interval);
    m.remove();
  };
  document.getElementById('pomoStart').onclick = function(){
    var btn = document.getElementById('pomoStart');
    if(running){
      clearInterval(interval);
      running = false;
      btn.textContent = '▶️ متابعة';
    } else {
      running = true;
      btn.textContent = '⏸️ إيقاف';
      interval = setInterval(function(){
        timeLeft--;
        var mm = Math.floor(timeLeft / 60);
        var ss = timeLeft % 60;
        document.getElementById('pomoDisplay').textContent = (mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
        if(timeLeft <= 0){
          clearInterval(interval);
          if(typeof window.addPoints === 'function') window.addPoints(15);
          if(typeof showToast === 'function') showToast('🎉 خلّصت! +15 نقطة');
          m.remove();
        }
      }, 1000);
    }
  };
};

// ═══ البث المباشر (مبسط) ═══
window.openBroadcast = async function(){
  if(!window.currentUser) return;
  var isTeacher = window.currentRole === 'teacher';
  var isOwner = window.currentRole === 'owner';
  
  if(isTeacher || isOwner){
    var action = prompt('🔴 البث المباشر:\n\n1. بدء بث جديد\n2. عرض البثوث المتاحة');
    if(action === '1'){
      var title = prompt('عنوان البث:');
      if(!title) return;
      var roomId = 'hafez-' + Date.now().toString(36);
      try {
        await firebase.firestore().collection('broadcasts').add({
          title: title,
          teacherId: window.currentUser.uid,
          teacherName: window.currentUser.name,
          roomId: roomId,
          status: 'live',
          createdAt: new Date().toISOString()
        });
        var url = 'https://meet.jit.si/' + roomId;
        window.open(url, '_blank');
        if(typeof showToast === 'function') showToast('🔴 بدأ البث');
      } catch(e){ console.error(e); }
    }
  } else {
    try {
      var snap = await firebase.firestore().collection('broadcasts').where('status','==','live').get();
      if(snap.empty){ if(typeof showToast === 'function') showToast('لا يوجد بث حالياً'); return; }
      var list = '';
      var rooms = [];
      snap.forEach(function(doc){
        var b = doc.data();
        list += '📺 ' + b.title + ' — ' + b.teacherName + '\n';
        rooms.push(b.roomId);
      });
      if(confirm('🔴 البثوث المتاحة:\n\n' + list + '\n\nهل تريد الانضمام؟')){
        window.open('https://meet.jit.si/' + rooms[0], '_blank');
      }
    } catch(e){ console.error(e); }
  }
};

// ═══ إضافة الأزرار في الرئيسية ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home) return;
    var content = home.querySelector('.content');
    if(!content) return;
    
    // زر الأخبار
    if(!document.getElementById('newsBtn')){
      var btn1 = document.createElement('div');
      btn1.id = 'newsBtn';
      btn1.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#C2185B,#E91E63);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
      btn1.innerHTML = '<div style="font-size:28px;">📰</div><div style="margin-top:8px;font-size:15px;">الأخبار والمقالات</div>';
      btn1.onclick = function(){ window.openNews(); };
      content.insertBefore(btn1, content.firstChild);
    }
    
    // زر Pomodoro
    if(!document.getElementById('pomoBtn')){
      var btn2 = document.createElement('div');
      btn2.id = 'pomoBtn';
      btn2.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
      btn2.innerHTML = '<div style="font-size:28px;">⏱️</div><div style="margin-top:8px;font-size:15px;">مؤقت الدراسة</div>';
      btn2.onclick = function(){ window.openPomodoro(); };
      content.insertBefore(btn2, content.firstChild);
    }
    
    // زر البث
    if(!document.getElementById('broadcastBtn')){
      var btn3 = document.createElement('div');
      btn3.id = 'broadcastBtn';
      btn3.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#D32F2F,#E53935);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
      btn3.innerHTML = '<div style="font-size:28px;">🔴</div><div style="margin-top:8px;font-size:15px;">البث المباشر</div>';
      btn3.onclick = function(){ window.openBroadcast(); };
      content.insertBefore(btn3, content.firstChild);
    }
  }, 4000);
});

console.log('✅ News + Pomodoro + Broadcast + Buttons loaded');
// ═══ إصلاح شريط الدردشة على الموبايل ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    // إصلاح شريط الإدخال
    var style = document.createElement('style');
    style.textContent = 
      '.chat-input-bar { display:flex !important; align-items:center !important; gap:4px !important; padding:6px !important; flex-wrap:nowrap !important; overflow-x:auto !important; }' +
      '.chat-input-bar > * { flex-shrink:0 !important; }' +
      '.chat-input-bar input[type="text"] { min-width:80px !important; flex:1 1 auto !important; }' +
      '@media (max-width:480px) {' +
      '  .chat-input-bar label { width:32px !important; height:32px !important; font-size:16px !important; padding:2px !important; }' +
      '  .chat-input-bar button { width:34px !important; height:34px !important; font-size:16px !important; padding:2px !important; }' +
      '  .chat-input-bar input[type="text"] { padding:8px 12px !important; font-size:13px !important; }' +
      '  #mediaBar { gap:2px !important; margin-right:2px !important; }' +
      '  #mediaBar label { width:30px !important; height:30px !important; font-size:14px !important; }' +
      '}';
    document.head.appendChild(style);
    console.log('✅ Chat bar fixed');
  }, 3000);
});
// ═══ زر التحميل للعمل بدون نت ═══
window.downloadAllOffline = async function(){
  if(!navigator.onLine){ if(typeof showToast === 'function') showToast('⚠️ محتاج نت'); return; }
  if(typeof showToast === 'function') showToast('⏳ جاري التحميل...');
  try {
    var fs = firebase.firestore();
    var ls = await fs.collection('lessons').get();
    var lessons = [];
    ls.forEach(function(d){ lessons.push(Object.assign({id: d.id}, d.data())); });
    localStorage.setItem('offline_lessons', JSON.stringify(lessons));
    if(typeof showToast === 'function') showToast('✅ الدروس: ' + lessons.length);
    
    var r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    var j = await r.json();
    var quran = {};
    j.data.surahs.forEach(function(s){
      quran[s.number] = {name: s.name, ayahs: s.ayahs.map(function(a){return {num: a.numberInSurah, text: a.text};})};
    });
    localStorage.setItem('offline_quran_full', JSON.stringify(quran));
    if(typeof showToast === 'function') showToast('✅ القرآن: ' + j.data.surahs.length + ' سورة');
    
    if(typeof showToast === 'function') showToast('🎉 تم التحميل الكامل!');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};

window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('offlineBtn')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'offlineBtn';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">📥</div><div style="margin-top:8px;font-size:15px;">تحميل المنصة بدون نت</div><div style="font-size:12px;opacity:.9;margin-top:4px;">(يحتاج نت — مرة واحدة)</div>';
    btn.onclick = function(){ window.downloadAllOffline(); };
    content.insertBefore(btn, content.firstChild);
  }, 3000);
});
console.log('✅ Offline Button loaded');
console.log('✅ extras.js loaded');
  
})();
