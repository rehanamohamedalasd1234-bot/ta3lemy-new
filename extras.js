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
// ═══ حذف ملف من محطتي الإذاعية ═══
window.deleteMyStationAudio = async function(id){
  if(!window.currentUser) return;
  if(window.currentRole !== 'owner' && window.currentRole !== 'teacher'){
    if(typeof showToast === 'function') showToast('⚠️ مسموح للمالك فقط');
    return;
  }
  if(!confirm('حذف الملف من محطتك؟')) return;
  try {
    await firebase.firestore().collection('station').doc(id).delete();
    if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    if(typeof openRadio === 'function') openRadio();
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل الحذف');
  }
};

// ═══ إضافة زر الحذف في قائمة محطتي ═══
window.addEventListener('load', function(){
  setInterval(function(){
    var radioScreen = document.getElementById('radioScreen');
    if(!radioScreen || !radioScreen.classList.contains('active')) return;
    if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
    
    var myList = document.getElementById('myStationList');
    if(!myList) return;
    
    var items = myList.querySelectorAll('.content-item');
    items.forEach(function(item){
      if(item.querySelector('.deleteStationBtn')) return;
      var onclickAttr = item.getAttribute('onclick') || '';
      var match = onclickAttr.match(/'([^']+)'/);
      if(!match) return;
      var docId = match[1];
      
      var btn = document.createElement('button');
      btn.className = 'deleteStationBtn';
      btn.innerHTML = '🗑️';
      btn.style.cssText = 'background:#E53935;color:#fff;border:none;border-radius:50%;width:32px;height:32px;font-size:14px;cursor:pointer;margin-left:8px;flex-shrink:0;';
      btn.onclick = function(e){
        e.stopPropagation();
        window.deleteMyStationAudio(docId);
      };
      item.appendChild(btn);
    });
  }, 2000);
});

console.log('✅ Station delete loaded');
// ═══ جدول الضرب التفاعلي للأطفال ═══
window.openMultiplication = function(){
  var m = document.createElement('div');
  m.id = 'multModal';
  m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#FFE0B2,#FFCC80);z-index:9999;overflow-y:auto;padding:16px;font-family:inherit;';
  
  var html = '<div style="max-width:500px;margin:0 auto;">';
  html += '<div style="text-align:center;margin-bottom:20px;">';
  html += '<div style="font-size:50px;">🔢</div>';
  html += '<div style="font-size:24px;font-weight:bold;color:#E65100;margin-top:8px;">جدول الضرب</div>';
  html += '<div style="font-size:14px;color:#BF360C;margin-top:4px;">اضغط على أي رقم لتسمعه</div>';
  html += '</div>';
  
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">';
  var colors = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2','#F8B195','#C06C84'];
  for(var i = 1; i <= 10; i++){
    html += '<button onclick="showTable(' + i + ')" style="padding:24px 8px;background:' + colors[i-1] + ';color:#fff;border:none;border-radius:20px;font-family:inherit;font-size:28px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15);">×' + i + '</button>';
  }
  html += '</div>';
  
  html += '<div id="multResult" style="background:#fff;border-radius:20px;padding:20px;min-height:100px;box-shadow:0 4px 12px rgba(0,0,0,.1);"></div>';
  
  html += '<button onclick="document.getElementById(\'multModal\').remove()" style="width:100%;margin-top:20px;padding:14px;background:#E65100;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>';
  html += '</div>';
  m.innerHTML = html;
  document.body.appendChild(m);
};

window.showTable = function(num){
  var c = document.getElementById('multResult');
  if(!c) return;
  var html = '<div style="text-align:center;font-size:22px;font-weight:bold;color:#E65100;margin-bottom:16px;">جدول الـ ' + num + '</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
  for(var i = 1; i <= 10; i++){
    var result = num * i;
    html += '<div onclick="speakText(\'' + num + ' في ' + i + ' يساوي ' + result + '\')" style="background:linear-gradient(135deg,#FFF3E0,#FFE0B2);padding:14px;border-radius:14px;text-align:center;cursor:pointer;border:2px solid #FFB74D;">';
    html += '<div style="font-size:18px;font-weight:bold;color:#E65100;">' + num + ' × ' + i + '</div>';
    html += '<div style="font-size:24px;font-weight:bold;color:#BF360C;margin-top:4px;">= ' + result + '</div>';
    html += '</div>';
  }
  html += '</div>';
  c.innerHTML = html;
  
  // نطق أول نتيجة
  if('speechSynthesis' in window){
    var utterance = new SpeechSynthesisUtterance('جدول الـ ' + num);
    utterance.lang = 'ar-EG';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

window.speakText = function(text){
  if(!('speechSynthesis' in window)){
    if(typeof showToast === 'function') showToast('⚠️ الصوت غير مدعوم');
    return;
  }
  window.speechSynthesis.cancel();
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-EG';
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};

// ═══ زرار في الرئيسية ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('multBtn')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'multBtn';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#FF6B6B,#FF8E53);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">🔢</div><div style="margin-top:8px;font-size:15px;">جدول الضرب للأطفال</div><div style="font-size:12px;opacity:.9;margin-top:4px;">تفاعلي + ألوان + صوت</div>';
    btn.onclick = function(){ window.openMultiplication(); };
    content.insertBefore(btn, content.firstChild);
  }, 4500);
});

console.log('✅ Multiplication Table loaded');
// ═══════════════════════════════════════════════════════
// 🎯 محرك التدريبات التفاعلية الذكي
// يدعم: اختيار متعدد، صح/خطأ، إجابة قصيرة، مطابقة، ترتيب
// ═══════════════════════════════════════════════════════

window.renderExercise = function(exercise, container){
  if(!exercise || !container) return;
  
  var type = exercise.exercise_type || 'short';
  var title = exercise.title || '';
  var explanation = exercise.explanation || '';
  
  var h = '<div style="background:#fff;border-radius:18px;padding:20px;margin-bottom:16px;box-shadow:0 4px 16px rgba(0,0,0,.08);">';
  h += '<div style="font-size:16px;font-weight:bold;color:#2E7D32;margin-bottom:16px;line-height:1.7;">📝 ' + title + '</div>';
  
  // اختيار من متعدد
  if(type === 'mcq'){
    var options = exercise.options || [];
    h += '<div id="mcqOptions" style="display:grid;gap:10px;">';
    options.forEach(function(opt, idx){
      h += '<button onclick="checkMCQ(this,' + idx + ',' + (exercise.correct||0) + ')" data-idx="' + idx + '" style="padding:14px 16px;background:#F5F5F5;color:#212121;border:2px solid #E0E0E0;border-radius:14px;font-family:inherit;font-size:15px;font-weight:bold;text-align:right;cursor:pointer;transition:all .2s;">' + String.fromCharCode(1571 + idx) + '. ' + opt + '</button>';
    });
    h += '</div>';
  }
  // صح / خطأ
  else if(type === 'tf'){
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    h += '<button onclick="checkTF(this,true,' + (exercise.correct?true:false) + ')" style="padding:20px;background:#E8F5E9;color:#2E7D32;border:2px solid #A5D6A7;border-radius:14px;font-family:inherit;font-size:18px;font-weight:bold;cursor:pointer;">✅ صح</button>';
    h += '<button onclick="checkTF(this,false,' + (exercise.correct?true:false) + ')" style="padding:20px;background:#FFEBEE;color:#E53935;border:2px solid #FFCDD2;border-radius:14px;font-family:inherit;font-size:18px;font-weight:bold;cursor:pointer;">❌ خطأ</button>';
    h += '</div>';
  }
  // إجابة قصيرة
  else if(type === 'short'){
    h += '<div style="display:flex;gap:8px;flex-direction:column;">';
    h += '<input type="text" id="shortAnswer" placeholder="اكتب إجابتك هنا..." style="padding:14px 16px;background:#F5F5F5;border:2px solid #E0E0E0;border-radius:14px;font-family:inherit;font-size:15px;outline:none;">';
    h += '<button onclick="checkShort(' + JSON.stringify(JSON.stringify(exercise.correct||'')) + ')" style="padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:15px;font-weight:bold;cursor:pointer;">✓ تحقق من الإجابة</button>';
    h += '</div>';
  }
  // مطابقة
  else if(type === 'match'){
    var pairs = exercise.pairs || [];
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    h += '<div>';
    pairs.forEach(function(p, i){
      h += '<div onclick="selectMatch(this,\'left\',' + i + ')" data-side="left" data-idx="' + i + '" style="padding:12px;background:#E3F2FD;border:2px solid #90CAF9;border-radius:12px;margin-bottom:8px;font-weight:bold;text-align:center;cursor:pointer;">' + p.left + '</div>';
    });
    h += '</div>';
    h += '<div>';
    var shuffled = pairs.map(function(p, i){ return {text: p.right, idx: i}; });
    shuffled.sort(function(){ return Math.random() - 0.5; });
    shuffled.forEach(function(s){
      h += '<div onclick="selectMatch(this,\'right\',' + s.idx + ')" data-side="right" data-idx="' + s.idx + '" style="padding:12px;background:#FFF3E0;border:2px solid #FFB74D;border-radius:12px;margin-bottom:8px;font-weight:bold;text-align:center;cursor:pointer;">' + s.text + '</div>';
    });
    h += '</div>';
    h += '</div>';
    h += '<div id="matchResult" style="text-align:center;margin-top:12px;font-weight:bold;"></div>';
  }
  // ترتيب
  else if(type === 'order'){
    var items = (exercise.items || []).slice();
    var correct = (exercise.correct_order || []).slice();
    items.sort(function(){ return Math.random() - 0.5; });
    h += '<div id="orderList" style="display:flex;flex-direction:column;gap:8px;">';
    items.forEach(function(item){
      h += '<div draggable="true" onclick="moveOrder(this)" style="padding:14px;background:#F3E5F5;border:2px solid #CE93D8;border-radius:12px;font-weight:bold;text-align:center;cursor:pointer;">' + item + '</div>';
    });
    h += '</div>';
    h += '<button onclick="checkOrder(' + JSON.stringify(JSON.stringify(correct)) + ')" style="width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#7B1FA2,#9C27B0);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:15px;font-weight:bold;cursor:pointer;">✓ تحقق من الترتيب</button>';
    h += '<div id="orderResult" style="text-align:center;margin-top:12px;font-weight:bold;"></div>';
  }
  
  h += '<div id="exerciseFeedback" style="margin-top:16px;"></div>';
  h += '</div>';
  
  container.innerHTML += h;
};

// ═══ التحقق من MCQ ═══
window.checkMCQ = function(btn, selected, correct){
  var parent = btn.parentElement;
  var buttons = parent.querySelectorAll('button');
  buttons.forEach(function(b){ b.style.pointerEvents = 'none'; });
  
  if(selected === correct){
    btn.style.background = '#E8F5E9';
    btn.style.borderColor = '#2E7D32';
    btn.style.color = '#2E7D32';
    if(typeof showToast === 'function') showToast('✅ إجابة صحيحة!');
    if(typeof window.addPoints === 'function') window.addPoints(5);
  } else {
    btn.style.background = '#FFEBEE';
    btn.style.borderColor = '#E53935';
    btn.style.color = '#E53935';
    buttons[correct].style.background = '#E8F5E9';
    buttons[correct].style.borderColor = '#2E7D32';
    buttons[correct].style.color = '#2E7D32';
    if(typeof showToast === 'function') showToast('❌ حاول مرة أخرى');
  }
};

// ═══ التحقق من صح/خطأ ═══
window.checkTF = function(btn, answer, correct){
  var parent = btn.parentElement;
  var buttons = parent.querySelectorAll('button');
  buttons.forEach(function(b){ b.style.pointerEvents = 'none'; });
  
  if(answer === correct){
    btn.style.background = '#C8E6C9';
    if(typeof showToast === 'function') showToast('✅ إجابة صحيحة!');
    if(typeof window.addPoints === 'function') window.addPoints(5);
  } else {
    btn.style.background = '#FFCDD2';
    buttons[correct ? 0 : 1].style.background = '#C8E6C9';
    if(typeof showToast === 'function') showToast('❌ إجابة خاطئة');
  }
};

// ═══ التحقق من إجابة قصيرة ═══
window.checkShort = function(correct){
  var inp = document.getElementById('shortAnswer');
  if(!inp) return;
  var answer = inp.value.trim().toLowerCase();
  var expected = correct.toLowerCase().trim();
  
  var feedback = document.getElementById('exerciseFeedback');
  if(answer === expected){
    inp.style.borderColor = '#2E7D32';
    inp.style.background = '#E8F5E9';
    feedback.innerHTML = '<div style="text-align:center;color:#2E7D32;font-weight:bold;font-size:16px;">✅ إجابة صحيحة!</div>';
    if(typeof showToast === 'function') showToast('✅ أحسنت!');
    if(typeof window.addPoints === 'function') window.addPoints(5);
  } else {
    inp.style.borderColor = '#E53935';
    inp.style.background = '#FFEBEE';
    feedback.innerHTML = '<div style="text-align:center;color:#E53935;font-weight:bold;font-size:16px;">❌ الإجابة الصحيحة: ' + correct + '</div>';
    if(typeof showToast === 'function') showToast('❌ حاول مرة أخرى');
  }
};

// ═══ المطابقة ═══
window._matchSelected = {left: null, right: null};
window._matchPairs = {};
window.selectMatch = function(el, side, idx){
  if(el.style.background === 'rgb(200, 230, 201)') return;
  
  var all = document.querySelectorAll('[data-side="' + side + '"]');
  all.forEach(function(x){ x.style.transform = 'scale(1)'; x.style.boxShadow = 'none'; });
  el.style.transform = 'scale(1.05)';
  el.style.boxShadow = '0 4px 12px rgba(0,0,0,.2)';
  
  window._matchSelected[side] = {el: el, idx: idx};
  
  if(window._matchSelected.left && window._matchSelected.right){
    var left = window._matchSelected.left;
    var right = window._matchSelected.right;
    
    if(left.idx === right.idx){
      left.el.style.background = '#C8E6C9';
      right.el.style.background = '#C8E6C9';
      left.el.style.transform = 'scale(1)';
      right.el.style.transform = 'scale(1)';
      if(typeof showToast === 'function') showToast('✅ مطابقة صحيحة');
      if(typeof window.addPoints === 'function') window.addPoints(3);
    } else {
      left.el.style.background = '#FFCDD2';
      right.el.style.background = '#FFCDD2';
      setTimeout(function(){
        left.el.style.background = '#E3F2FD';
        right.el.style.background = '#FFF3E0';
        left.el.style.transform = 'scale(1)';
        right.el.style.transform = 'scale(1)';
      }, 700);
      if(typeof showToast === 'function') showToast('❌ حاول مرة أخرى');
    }
    
    window._matchSelected = {left: null, right: null};
  }
};

// ═══ الترتيب ═══
window.moveOrder = function(el){
  var parent = el.parentElement;
  var next = el.nextElementSibling;
  if(next) parent.insertBefore(next, el);
  else {
    var first = parent.firstElementChild;
    parent.insertBefore(el, first);
  }
};

window.checkOrder = function(correct){
  var list = document.getElementById('orderList');
  if(!list) return;
  var items = Array.from(list.children).map(function(x){ return x.textContent; });
  var isCorrect = JSON.stringify(items) === JSON.stringify(correct);
  
  var result = document.getElementById('orderResult');
  if(isCorrect){
    result.innerHTML = '<span style="color:#2E7D32;font-size:16px;">✅ ترتيب صحيح!</span>';
    if(typeof showToast === 'function') showToast('🎉 ممتاز!');
    if(typeof window.addPoints === 'function') window.addPoints(10);
  } else {
    result.innerHTML = '<span style="color:#E53935;font-size:16px;">❌ ترتيب خاطئ، حاول مرة أخرى</span>';
  }
};

console.log('✅ Exercise engine loaded');
// ═══════════════════════════════════════════════════════
// قسم التدريبات التفاعلية
// ═══════════════════════════════════════════════════════

// ═══ شاشة التدريبات ═══
window.openExercises = async function(){
  if(!window.currentUser) return;
  if(window.screenHistory) window.screenHistory.push(window.currentScreen);
  
  // شاشة جديدة إن لم تكن موجودة
  if(!document.getElementById('exercisesScreen')){
    var s = document.createElement('div');
    s.id = 'exercisesScreen';
    s.className = 'screen';
    s.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#00897B,#26A69A);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>🎯 التدريبات التفاعلية</span></div><button class="icon-btn" id="addExerciseBtn" onclick="openAddExercise()" style="display:none;">➕</button></div><div class="content"><div id="exercisesList"></div></div>';
    document.body.appendChild(s);
  }
  
  if(typeof showScreen === 'function') showScreen('exercisesScreen');
  
  var addBtn = document.getElementById('addExerciseBtn');
  if(addBtn) addBtn.style.display = (window.currentRole === 'owner' || window.currentRole === 'teacher') ? 'flex' : 'none';
  
  var l = document.getElementById('exercisesList');
  l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
  
  try {
    var fs = firebase.firestore();
    var snap = await fs.collection('exercises').orderBy('created_at','desc').limit(50).get();
    if(snap.empty){
      l.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎯</div><p>لا توجد تدريبات بعد</p>' + (window.currentRole === 'owner' || window.currentRole === 'teacher' ? '<p style="font-size:13px;margin-top:8px;">اضغط ➕ فوق لإضافة تدريب</p>' : '') + '</div>';
      return;
    }
    var html = '';
    snap.forEach(function(doc){
      var ex = doc.data();
      var typeLabel = {mcq:'اختيار متعدد', tf:'صح/خطأ', short:'إجابة قصيرة', match:'مطابقة', order:'ترتيب'}[ex.exercise_type] || 'سؤال';
      var typeColor = {mcq:'#1976D2', tf:'#F9A825', short:'#2E7D32', match:'#7B1FA2', order:'#E53935'}[ex.exercise_type] || '#666';
      html += '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-right:5px solid ' + typeColor + ';">';
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">';
      html += '<div style="flex:1;font-weight:bold;font-size:15px;">' + (ex.title||'سؤال') + '</div>';
      html += '<div style="font-size:11px;font-weight:bold;color:' + typeColor + ';background:' + typeColor + '15;padding:4px 10px;border-radius:10px;margin-right:8px;">' + typeLabel + '</div>';
      html += '</div>';
      html += '<div style="font-size:12px;color:#999;margin-bottom:10px;">📚 ' + (ex.subject||'عام') + '</div>';
      html += '<button onclick="viewExercise(\'' + doc.id + '\')" style="background:linear-gradient(135deg,#00897B,#26A69A);color:#fff;border:none;padding:10px 16px;border-radius:10px;font-family:inherit;font-weight:bold;cursor:pointer;">✏️ حل التمرين</button>';
      if(window.currentRole === 'owner'){
        html += ' <button onclick="deleteExercise(\'' + doc.id + '\')" style="background:#FFEBEE;color:#E53935;border:none;padding:10px 12px;border-radius:10px;font-weight:bold;cursor:pointer;margin-right:6px;">🗑️</button>';
      }
      html += '</div>';
    });
    l.innerHTML = html;
  } catch(e){ console.error(e); l.innerHTML = '<p style="text-align:center;color:#E53935;">⚠️ فشل التحميل</p>'; }
};

// ═══ عرض تمرين واحد ═══
window.viewExercise = async function(id){
  try {
    var doc = await firebase.firestore().collection('exercises').doc(id).get();
    if(!doc.exists) return;
    var ex = doc.data();
    ex.id = id;
    
    var m = document.createElement('div');
    m.id = 'exerciseViewModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;overflow-y:auto;padding:20px;';
    m.innerHTML = '<div style="max-width:600px;margin:20px auto;">';
    m.innerHTML += '<div id="exerciseContainer"></div>';
    m.innerHTML += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:16px;padding:14px;background:#424242;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>';
    m.innerHTML += '</div>';
    document.body.appendChild(m);
    
    window.renderExercise(ex, document.getElementById('exerciseContainer'));
  } catch(e){ console.error(e); }
};

// ═══ إضافة تمرين جديد ═══
window.openAddExercise = function(){
  if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
  
  var m = document.createElement('div');
  m.id = 'addExerciseModal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;overflow-y:auto;padding:20px;';
  m.innerHTML = 
    '<div style="max-width:600px;margin:20px auto;background:#fff;border-radius:20px;padding:24px;font-family:inherit;">' +
    '<div style="font-size:20px;font-weight:bold;color:#00897B;margin-bottom:16px;">➕ إضافة تمرين</div>' +
    
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">نوع التمرين:</label>' +
    '<select id="exType" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;" onchange="toggleExerciseFields()">' +
    '<option value="mcq">اختيار من متعدد</option>' +
    '<option value="tf">صح / خطأ</option>' +
    '<option value="short">إجابة قصيرة</option>' +
    '<option value="match">مطابقة</option>' +
    '<option value="order">ترتيب</option>' +
    '</select>' +
    
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">السؤال:</label>' +
    '<textarea id="exTitle" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;min-height:60px;"></textarea>' +
    
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">المادة:</label>' +
    '<input id="exSubject" placeholder="مثال: رياضيات" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;">' +
    
    '<div id="mcqFields">' +
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">الاختيارات (كل واحد في سطر، الأول هو الصحيح):</label>' +
    '<textarea id="exOptions" placeholder="اختيار 1&#10;اختيار 2&#10;اختيار 3&#10;اختيار 4" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;min-height:100px;"></textarea>' +
    '</div>' +
    
    '<div id="tfFields" style="display:none;">' +
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">الإجابة الصحيحة:</label>' +
    '<select id="exTF" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;">' +
    '<option value="true">✅ صح</option><option value="false">❌ خطأ</option>' +
    '</select></div>' +
    
    '<div id="shortFields" style="display:none;">' +
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">الإجابة الصحيحة:</label>' +
    '<input id="exShort" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;">' +
    '</div>' +
    
    '<div id="matchFields" style="display:none;">' +
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">الأزواج (سطر لكل زوج، بصيغة: يسار = يمين):</label>' +
    '<textarea id="exPairs" placeholder="مصر = القاهرة&#10;السعودية = الرياض&#10;الكويت = الكويت" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;min-height:100px;"></textarea>' +
    '</div>' +
    
    '<div id="orderFields" style="display:none;">' +
    '<label style="display:block;font-weight:bold;margin-bottom:6px;">العناصر بالترتيب الصحيح (كل واحد في سطر):</label>' +
    '<textarea id="exOrder" placeholder="العنصر الأول&#10;العنصر الثاني&#10;العنصر الثالث" style="width:100%;padding:12px;border:2px solid #E0E0E0;border-radius:12px;font-family:inherit;font-size:14px;margin-bottom:12px;min-height:100px;"></textarea>' +
    '</div>' +
    
    '<button onclick="saveExercise()" style="width:100%;padding:14px;background:linear-gradient(135deg,#00897B,#26A69A);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;margin-top:8px;">💾 حفظ التمرين</button>' +
    '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:14px;background:#F5F5F5;color:#424242;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;margin-top:8px;">✕ إلغاء</button>' +
    '</div>';
  document.body.appendChild(m);
};

window.toggleExerciseFields = function(){
  var type = document.getElementById('exType').value;
  ['mcqFields','tfFields','shortFields','matchFields','orderFields'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  var target = type + 'Fields';
  var t = document.getElementById(target);
  if(t) t.style.display = 'block';
};

window.saveExercise = async function(){
  if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
  var type = document.getElementById('exType').value;
  var title = document.getElementById('exTitle').value.trim();
  var subject = document.getElementById('exSubject').value.trim();
  
  if(!title){ if(typeof showToast === 'function') showToast('⚠️ أدخل السؤال'); return; }
  
  var data = {
    title: title,
    subject: subject,
    exercise_type: type,
    created_at: new Date().toISOString(),
    created_by: window.currentUser.uid
  };
  
  if(type === 'mcq'){
    var opts = document.getElementById('exOptions').value.split('\n').map(function(x){return x.trim();}).filter(Boolean);
    if(opts.length < 2){ if(typeof showToast === 'function') showToast('⚠️ أدخل اختيارين على الأقل'); return; }
    data.options = opts;
    data.correct = 0;
  } else if(type === 'tf'){
    data.correct = document.getElementById('exTF').value === 'true';
  } else if(type === 'short'){
    var ans = document.getElementById('exShort').value.trim();
    if(!ans){ if(typeof showToast === 'function') showToast('⚠️ أدخل الإجابة'); return; }
    data.correct = ans;
  } else if(type === 'match'){
    var lines = document.getElementById('exPairs').value.split('\n').filter(Boolean);
    var pairs = lines.map(function(l){
      var parts = l.split('=');
      return {left: (parts[0]||'').trim(), right: (parts[1]||'').trim()};
    });
    if(pairs.length < 2){ if(typeof showToast === 'function') showToast('⚠️ أدخل زوجين على الأقل'); return; }
    data.pairs = pairs;
  } else if(type === 'order'){
    var items = document.getElementById('exOrder').value.split('\n').map(function(x){return x.trim();}).filter(Boolean);
    if(items.length < 2){ if(typeof showToast === 'function') showToast('⚠️ أدخل عنصرين على الأقل'); return; }
    data.items = items;
    data.correct_order = items;
  }
  
  try {
    await firebase.firestore().collection('exercises').add(data);
    if(typeof showToast === 'function') showToast('✅ تم حفظ التمرين');
    document.getElementById('addExerciseModal').remove();
    window.openExercises();
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل');
  }
};

window.deleteExercise = async function(id){
  if(window.currentRole !== 'owner') return;
  if(!confirm('حذف التمرين؟')) return;
  try {
    await firebase.firestore().collection('exercises').doc(id).delete();
    if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    window.openExercises();
  } catch(e){ console.error(e); }
};

// ═══ زر في الرئيسية ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('exerciseBtn')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'exerciseBtn';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#00897B,#26A69A);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">🎯</div><div style="margin-top:8px;font-size:15px;">التدريبات التفاعلية</div><div style="font-size:12px;opacity:.9;margin-top:4px;">اختيار + صح/خطأ + كتابة + ترتيب</div>';
    btn.onclick = function(){ window.openExercises(); };
    content.insertBefore(btn, content.firstChild);
  }, 5000);
});

console.log('✅ Exercises UI loaded');
console.log('✅ extras.js loaded');
  
})();
