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

        // لا تمنح اختيار الدور من الواجهة صلاحية معلم أو مالك.
        if (window.currentRole === 'teacher' || window.currentRole === 'owner') {
          if (typeof window.securePortalLogin !== 'function') {
            if (typeof showToast === 'function') showToast('تعذر تحميل تسجيل الدخول الآمن. حدّث الصفحة.');
            return;
          }
          return window.securePortalLogin(window.currentRole, uname, pwd);
        }
        
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
              window.currentRole = 'student';
              if(typeof showToast === 'function') showToast('📴 دخول offline');
              if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 400);
              return;
            } catch(e){}
          }
          if(typeof showToast === 'function') showToast('⚠️ محتاج نت أول مرة');
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
            if (window.currentRole === 'student' && typeof window.activatePrivateChatSession === 'function') {
              await window.activatePrivateChatSession(uid, pwd);
            }
            
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
          if (user.role === 'student' && typeof window.activatePrivateChatSession === 'function') {
            await window.activatePrivateChatSession(uid2, pwd);
          }
          
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
window.openBroadcast = function(){
  if(typeof showToast === 'function') showToast('البث المباشر مؤجل مؤقتًا إلى أن نجهز صلاحيات وموافقة المالك.');
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
  }, 4000);
});

console.log('✅ News + Pomodoro + deferred broadcast button loaded');
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
// ═══════════════════════════════════════════════════════
// 📚 عربي الصف الأول الابتدائي — محتوى تفاعلي
// ═══════════════════════════════════════════════════════

(function(){
  if(!window.speakText){
    window.speakText = function(text){
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-EG';
      u.rate = 0.8;
      u.pitch = 1.2;
      window.speechSynthesis.speak(u);
    };
  }
  
  // ═══ شاشة عرض الحرف ═══
  window.showArabicLetter = function(letter, word, emoji){
    var m = document.createElement('div');
    m.id = 'letterModal';
    m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#FFF9C4,#FFE082);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = 
      '<div style="background:#fff;border-radius:30px;padding:32px 24px;text-align:center;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);">' +
      '<div style="font-size:120px;line-height:1.2;color:#E65100;font-weight:bold;margin-bottom:12px;" onclick="speakText(\'' + letter + '\')">' + letter + '</div>' +
      '<div style="font-size:80px;margin:20px 0;" onclick="speakText(\'' + word + '\')">' + emoji + '</div>' +
      '<div style="font-size:36px;color:#2E7D32;font-weight:bold;margin-bottom:24px;" onclick="speakText(\'' + word + '\')">' + word + '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;">' +
      '<button onclick="speakText(\'' + letter + '\')" style="padding:14px 24px;background:linear-gradient(135deg,#FF6B6B,#FF8E53);color:#fff;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">🔊 اسمع الحرف</button>' +
      '<button onclick="speakText(\'' + word + '\')" style="padding:14px 24px;background:linear-gradient(135deg,#4ECDC4,#26A69A);color:#fff;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">🔊 اسمع الكلمة</button>' +
      '</div>' +
      '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:20px;padding:14px;background:#757575;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>' +
      '</div>';
    document.body.appendChild(m);
    window.speakText(letter);
  };
  
  // ═══ محتوى الحروف ═══
  window.ARABIC_LETTERS = [
    {letter:'أ', word:'أسد', emoji:'🦁'},
    {letter:'ب', word:'بطة', emoji:'🦆'},
    {letter:'ت', word:'تفاح', emoji:'🍎'},
    {letter:'ث', word:'ثعلب', emoji:'🦊'},
    {letter:'ج', word:'جمل', emoji:'🐪'},
    {letter:'ح', word:'حصان', emoji:'🐴'},
    {letter:'خ', word:'خروف', emoji:'🐑'},
    {letter:'د', word:'دجاجة', emoji:'🐔'},
    {letter:'ذ', word:'ذئب', emoji:'🐺'},
    {letter:'ر', word:'رمان', emoji:'🍎'},
    {letter:'ز', word:'زرافة', emoji:'🦒'},
    {letter:'س', word:'سمكة', emoji:'🐟'},
    {letter:'ش', word:'شمس', emoji:'☀️'},
    {letter:'ص', word:'صقر', emoji:'🦅'},
    {letter:'ض', word:'ضفدع', emoji:'🐸'},
    {letter:'ط', word:'طائرة', emoji:'✈️'},
    {letter:'ظ', word:'ظرف', emoji:'📩'},
    {letter:'ع', word:'عصفور', emoji:'🐦'},
    {letter:'غ', word:'غزال', emoji:'🦌'},
    {letter:'ف', word:'فيل', emoji:'🐘'},
    {letter:'ق', word:'قطة', emoji:'🐱'},
    {letter:'ك', word:'كتاب', emoji:'📖'},
    {letter:'ل', word:'ليمون', emoji:'🍋'},
    {letter:'م', word:'موز', emoji:'🍌'},
    {letter:'ن', word:'نجمة', emoji:'⭐'},
    {letter:'ه', word:'هدهد', emoji:'🐦'},
    {letter:'و', word:'وردة', emoji:'🌹'},
    {letter:'ي', word:'يد', emoji:'✋'}
  ];
  
  // ═══ الأرقام ═══
  window.ARABIC_NUMBERS = [
    {num:'١', word:'واحد', emoji:'1️⃣'},
    {num:'٢', word:'اثنان', emoji:'2️⃣'},
    {num:'٣', word:'ثلاثة', emoji:'3️⃣'},
    {num:'٤', word:'أربعة', emoji:'4️⃣'},
    {num:'٥', word:'خمسة', emoji:'5️⃣'},
    {num:'٦', word:'ستة', emoji:'6️⃣'},
    {num:'٧', word:'سبعة', emoji:'7️⃣'},
    {num:'٨', word:'ثمانية', emoji:'8️⃣'},
    {num:'٩', word:'تسعة', emoji:'9️⃣'},
    {num:'١٠', word:'عشرة', emoji:'🔟'}
  ];
  
  // ═══ شاشة عرض الرقم ═══
  window.showArabicNumber = function(num, word, emoji){
    var m = document.createElement('div');
    m.id = 'numberModal';
    m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#B3E5FC,#81D4FA);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = 
      '<div style="background:#fff;border-radius:30px;padding:32px 24px;text-align:center;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);">' +
      '<div style="font-size:120px;line-height:1.2;color:#0D47A1;font-weight:bold;margin-bottom:12px;" onclick="speakText(\'' + word + '\')">' + num + '</div>' +
      '<div style="font-size:80px;margin:20px 0;" onclick="speakText(\'' + word + '\')">' + emoji + '</div>' +
      '<div style="font-size:36px;color:#0D47A1;font-weight:bold;margin-bottom:24px;">' + word + '</div>' +
      '<button onclick="speakText(\'' + word + '\')" style="width:100%;padding:14px;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border:none;border-radius:50px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">🔊 اسمع الرقم</button>' +
      '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:12px;padding:14px;background:#757575;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>' +
      '</div>';
    document.body.appendChild(m);
    window.speakText(word);
  };
  
  console.log('✅ Arabic content loaded');
})();
// ═══════════════════════════════════════════════════════
// 🎨 واجهة الدروس التفاعلية - الصف الأول
// ═══════════════════════════════════════════════════════

(function(){
  
  if(!window.speakText){
    window.speakText = function(text){
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-EG';
      u.rate = 0.8;
      u.pitch = 1.2;
      window.speechSynthesis.speak(u);
    };
  }
  
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(typeof window.openContent !== 'function') return;
      var origOpenContent = window.openContent;
      
      window.openContent = async function(type, num, name){
        if(window.currentSubject === 'اللغة العربية' && 
           window.currentGrade === 'الأول' && 
           type === 'lessons'){
          
          if(window.screenHistory) window.screenHistory.push(window.currentScreen);
          if(typeof showScreen === 'function') showScreen('contentScreen');
          
          var title = document.getElementById('contentTitle');
          if(title) title.textContent = '📚 دروس اللغة العربية';
          var ht = document.getElementById('contentHeaderTitle');
          if(ht) ht.textContent = 'الصف الأول الابتدائي';
          var hs = document.getElementById('contentHeaderSub');
          if(hs) hs.textContent = 'اضغط على أي درس للتفاعل';
          
          var l = document.getElementById('contentList');
          l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
          
          try {
            var fs = firebase.firestore();
            var snap = await fs.collection('lessons')
              .where('subject','==','اللغة العربية')
              .where('stage','==','primary')
              .where('grade','==','الأول')
              .where('type','==','lessons')
              .orderBy('order','asc')
              .get();
            
            var html = '';
            snap.forEach(function(doc){
              var d = doc.data();
              var icon = d.interactive_type === 'family' ? '👨‍👩‍👧‍👦' : 
                         d.interactive_type === 'letters' ? '🔤' : 
                         d.interactive_type === 'numbers' ? '🔢' : '📄';
              var color = d.interactive_type === 'family' ? '#FF6B6B' : 
                          d.interactive_type === 'letters' ? '#4ECDC4' : 
                          d.interactive_type === 'numbers' ? '#45B7D1' : '#999';
              html += '<div onclick="openInteractiveLesson(\'' + doc.id + '\')" style="background:#fff;border-radius:16px;padding:18px;margin-bottom:12px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.08);border-right:6px solid ' + color + ';display:flex;align-items:center;gap:14px;">';
              html += '<div style="width:56px;height:56px;border-radius:16px;background:' + color + '20;display:flex;align-items:center;justify-content:center;font-size:32px;">' + icon + '</div>';
              html += '<div style="flex:1;"><div style="font-weight:bold;font-size:16px;color:#212121;">' + d.title + '</div>';
              html += '<div style="font-size:12px;color:#999;margin-top:4px;">' + (d.content||'') + '</div></div>';
              html += '<div style="font-size:24px;color:#999;">‹</div>';
              html += '</div>';
            });
            l.innerHTML = html || '<p style="text-align:center;color:#999;">لا توجد دروس</p>';
            return;
          } catch(e){
            console.error(e);
            return origOpenContent.apply(this, arguments);
          }
        }
        return origOpenContent.apply(this, arguments);
      };
      
      console.log('✅ Lesson list override loaded');
    }, 3000);
  });
  
  window.openInteractiveLesson = async function(id){
    try {
      var doc = await firebase.firestore().collection('lessons').doc(id).get();
      if(!doc.exists) return;
      var d = doc.data();
      
      if(d.interactive_type === 'family') renderFamily(d);
      else if(d.interactive_type === 'letters') renderLetters(d);
      else if(d.interactive_type === 'numbers') renderNumbers(d);
    } catch(e){ console.error(e); }
  };
  
  window.renderFamily = function(d){
    var m = document.createElement('div');
    m.id = 'familyModal';
    m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#FFF9C4,#FFE082);z-index:9999;overflow-y:auto;padding:20px;font-family:inherit;';
    var h = '<div style="max-width:500px;margin:0 auto;">';
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:50px;">👨‍👩‍👧‍👦</div>';
    h += '<div style="font-size:24px;font-weight:bold;color:#E65100;margin-top:8px;">' + d.title + '</div>';
    h += '<div style="font-size:14px;color:#BF360C;margin-top:4px;">اضغط على أي فرد لسماعه</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">';
    var colors = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#BB8FCE'];
    d.family.forEach(function(f, i){
      h += '<div onclick="speakText(\'' + f.word + '\')" style="background:' + colors[i % colors.length] + ';color:#fff;border-radius:20px;padding:24px 12px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15);">';
      h += '<div style="font-size:60px;">' + f.emoji + '</div>';
      h += '<div style="font-size:22px;font-weight:bold;margin-top:8px;">' + f.word + '</div>';
      h += '</div>';
    });
    h += '</div>';
    h += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:24px;padding:14px;background:#E65100;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>';
    h += '</div>';
    m.innerHTML = h;
    document.body.appendChild(m);
  };
  
  window.renderLetters = function(d){
    var m = document.createElement('div');
    m.id = 'lettersModal';
    m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#E1F5FE,#B3E5FC);z-index:9999;overflow-y:auto;padding:16px;font-family:inherit;';
    var h = '<div style="max-width:600px;margin:0 auto;">';
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:50px;">🔤</div>';
    h += '<div style="font-size:24px;font-weight:bold;color:#0D47A1;margin-top:8px;">الحروف العربية</div>';
    h += '<div style="font-size:14px;color:#1565C0;margin-top:4px;">اضغط على الحرف لسماعه، وعلى الصورة لسماع الكلمة</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">';
    var colors = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2'];
    d.letters.forEach(function(lt, i){
      h += '<div style="background:#fff;border-radius:16px;padding:10px 4px;text-align:center;box-shadow:0 3px 8px rgba(0,0,0,.1);border:2px solid ' + colors[i % colors.length] + ';">';
      h += '<div onclick="speakText(\'' + lt.letter + '\')" style="font-size:38px;font-weight:bold;color:#E65100;cursor:pointer;line-height:1.1;">' + lt.letter + '</div>';
      h += '<div onclick="speakText(\'' + lt.word + '\')" style="font-size:28px;cursor:pointer;margin:4px 0;">' + lt.emoji + '</div>';
      h += '<div onclick="speakText(\'' + lt.word + '\')" style="font-size:11px;font-weight:bold;color:#2E7D32;cursor:pointer;">' + lt.word + '</div>';
      h += '</div>';
    });
    h += '</div>';
    h += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:24px;padding:14px;background:#0D47A1;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>';
    h += '</div>';
    m.innerHTML = h;
    document.body.appendChild(m);
  };
  
  window.renderNumbers = function(d){
    var m = document.createElement('div');
    m.id = 'numbersModal';
    m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#C8E6C9,#A5D6A7);z-index:9999;overflow-y:auto;padding:20px;font-family:inherit;';
    var h = '<div style="max-width:500px;margin:0 auto;">';
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:50px;">🔢</div>';
    h += '<div style="font-size:24px;font-weight:bold;color:#1B5E20;margin-top:8px;">الأرقام</div>';
    h += '<div style="font-size:14px;color:#2E7D32;margin-top:4px;">اضغط على أي رقم لسماعه</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">';
    var colors = ['#1976D2','#00897B','#F57C00','#C2185B','#7B1FA2','#D32F2F','#388E3C','#0097A7','#5D4037','#455A64'];
    d.numbers.forEach(function(nm, i){
      h += '<div onclick="speakText(\'' + nm.word + '\')" style="background:' + colors[i % colors.length] + ';color:#fff;border-radius:20px;padding:20px 8px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15);">';
      h += '<div style="font-size:48px;font-weight:bold;">' + nm.num + '</div>';
      h += '<div style="font-size:24px;margin-top:4px;">' + nm.emoji + '</div>';
      h += '<div style="font-size:14px;font-weight:bold;margin-top:4px;">' + nm.word + '</div>';
      h += '</div>';
    });
    h += '</div>';
    h += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:24px;padding:14px;background:#1B5E20;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق</button>';
    h += '</div>';
    m.innerHTML = h;
    document.body.appendChild(m);
  };
  
  console.log('✅ Interactive lessons UI loaded');
})();
// ═══════════════════════════════════════════════════════
// 🎨 تنسيق الصفحة الرئيسية (شبكة أدوات موحدة واحترافية)
// ═══════════════════════════════════════════════════════

(function(){
  // 1. إضافة التنسيقات (CSS)
  var style = document.createElement('style');
  style.textContent = 
    // ترتيب الصفحة
    '#homeScreen .content { display: flex; flex-direction: column; gap: 16px; padding: 16px; padding-bottom: 100px; }' +
    
    // الإعلانات والبحث في الأول
    '#mainAd { order: -2; margin: 0 !important; border-radius: 16px; }' +
    '#homeScreen .search-box { order: -1; margin: 0 !important; }' +
    
    // إخفاء الأزرار القديمة الكبيرة (اللي كنا ضفناها قبل كده)
    '#newsBtn, #pomoBtn, #multBtn, #broadcastBtn, #exerciseBtn, #installAppBtn, #offlineBtn, #quickMenu { display: none !important; }' +
    
    // تصميم شبكة الأدوات السريعة (الأزرار هتبقى صغيرة ومربعة)
    '.tools-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important; margin-top: 10px; margin-bottom: 10px; }' +
    
    // تصميم الزرار الواحد
    '.tool-btn { padding: 12px 4px !important; border-radius: 14px !important; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.06); border: 2px solid transparent; transition: all 0.2s; }' +
    '.tool-btn:active { transform: scale(0.95); border-color: #2E7D32; }' +
    
    // الأيقونة
    '.tool-icon { width: 42px !important; height: 42px !important; font-size: 22px !important; margin-bottom: 6px !important; border-radius: 12px; display: flex; align-items: center; justify-content: center; }' +
    
    // النص تحت الأيقونة
    '.tool-label { font-size: 11px !important; font-weight: bold; color: #424242; }';
  document.head.appendChild(style);

  // 2. دمج الأزرار الجديدة جوه "الأدوات السريعة"
  window.addEventListener('load', function(){
    setTimeout(function(){
      var toolsGrid = document.querySelector('#homeScreen .tools-grid');
      if(!toolsGrid || document.getElementById('extraToolsAdded')) return;
      
      // الأزرار اللي عايزين ننقلها
      var extraButtons = [
        {id: 'newsBtn', icon: '📰', label: 'الأخبار', bg: '#C2185B', action: function(){ window.openNews(); }},
        {id: 'pomoBtn', icon: '⏱️', label: 'المؤقت', bg: '#1976D2', action: function(){ window.openPomodoro(); }},
        {id: 'multBtn', icon: '🔢', label: 'الضرب', bg: '#FF6B6B', action: function(){ window.openMultiplication(); }},
        {id: 'exerciseBtn', icon: '🎯', label: 'التدريبات', bg: '#00897B', action: function(){ window.openExercises(); }},
        {id: 'quickMenu', icon: '⚡', label: 'قائمة', bg: '#F9A825', action: function(){ 
            var choice = prompt('⚡ اختر:\n\n1. مؤقت الدراسة\n2. الأخبار والمقالات\n3. نقاطي\n4. المفضلة\n5. ملاحظاتي\n6. تسجيل الخروج');
            if(choice === '1') window.openPomodoro();
            else if(choice === '2') window.openNews();
            else if(choice === '3') window.showMyPoints();
            else if(choice === '4') window.openFavorites();
            else if(choice === '5') window.openNotes();
            else if(choice === '6' && typeof logout === 'function') logout();
        }}
      ];

      // إضافة الأزرار للشبكة
      extraButtons.forEach(function(btnInfo){
        var newBtn = document.createElement('div');
        newBtn.className = 'tool-btn';
        newBtn.innerHTML = '<div class="tool-icon" style="background:' + btnInfo.bg + '15;color:' + btnInfo.bg + ';">' + btnInfo.icon + '</div><div class="tool-label">' + btnInfo.label + '</div>';
        newBtn.onclick = btnInfo.action;
        toolsGrid.appendChild(newBtn);
      });
      
      // علامة إننا ضفنا الأزرار
      var marker = document.createElement('div');
      marker.id = 'extraToolsAdded';
      marker.style.display = 'none';
      document.body.appendChild(marker);
      
      console.log('✅ Homepage unified grid loaded');
    }, 4000);
  });
})();
// ═══ تحديث إجباري للتطبيق عشان يقرأ الكود الجديد ═══
(function(){
  var currentVersion = '1.0.2'; // غير الرقم ده كل مرة تعدل
  var savedVersion = localStorage.getItem('app_version');
  if(savedVersion !== currentVersion){
    localStorage.setItem('app_version', currentVersion);
    if('caches' in window){
      caches.keys().then(function(names){
        for(var i = 0; i < names.length; i++){ caches.delete(names[i]); }
      });
    }
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistrations().then(function(regs){
        for(var i = 0; i < regs.length; i++){ regs[i].unregister(); }
      });
    }
    setTimeout(function(){ location.reload(true); }, 500);
  }
})();
// ═══════════════════════════════════════════════════════
// 🧹 تنظيف وإصلاح الواجهة
// ═══════════════════════════════════════════════════════

(function(){
  // 1. ستايل لإخفاء الحاجات الغلط
  var style = document.createElement('style');
  style.textContent = 
    // إخفاء النسخ الاحتياطي من كل مكان
    '.menu-item[onclick*="backupLessons"], [onclick*="backupLessons"] { display: none !important; }' +
    // إخفاء القائمة السريعة
    '#quickMenu { display: none !important; }' +
    // إخفاء زر التدريبات التفاعلية من الرئيسية (هنخليه في مكانه المناسب بعدين)
    '#exerciseBtn { display: none !important; }' +
    // إخفاء الأزرار القديمة اللي عملناها عشان منكررهاش
    '#newsBtn, #pomoBtn, #multBtn, #broadcastBtn { display: none !important; }';
  document.head.appendChild(style);

  // 2. التأكد من مسح زر القائمة السريعة لو موجود
  var qm = document.getElementById('quickMenu');
  if(qm) qm.remove();

  // 3. تعديل القائمة السريعة القديمة في الـ DOM
  var quickMenuDiv = document.getElementById('quickMenu');
  if (quickMenuDiv) quickMenuDiv.style.display = 'none';

  // 4. إخفاء النسخ الاحتياطي باستخدام JavaScript كمان
  var backupBtns = document.querySelectorAll('[onclick*="backupLessons"]');
  backupBtns.forEach(function(btn){ btn.style.display = 'none'; });

  console.log('✅ UI Cleanup loaded');
})();
// ═══════════════════════════════════════════════════════
// 📰 صفحة الأخبار والمقالات المتكاملة + 🔴 البث المباشر
// ═══════════════════════════════════════════════════════

(function(){
  // ═══ إنشاء شاشة الأخبار ═══
  if(!document.getElementById('newsScreen')){
    var ns = document.createElement('div');
    ns.id = 'newsScreen';
    ns.className = 'screen';
    ns.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#C2185B,#E91E63);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>📰 الأخبار والمقالات</span></div><button class="icon-btn" id="addNewsBtn" onclick="openAddNews()" style="display:none;">➕</button></div><div class="content" id="newsContent"></div>';
    document.body.appendChild(ns);
  }

  // ═══ إنشاء شاشة إضافة منشور ═══
  if(!document.getElementById('addNewsScreen')){
    var ans = document.createElement('div');
    ans.id = 'addNewsScreen';
    ans.className = 'screen';
    ans.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#C2185B,#E91E63);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>➕ منشور جديد</span></div><div style="width:42px;"></div></div><div class="content"><div class="form-group"><label class="form-label">العنوان</label><input type="text" class="form-input" id="newsTitle"></div><div class="form-group"><label class="form-label">المحتوى</label><textarea class="form-input" id="newsText" rows="6"></textarea></div><div class="form-group"><label class="form-label">📷 صورة (اختياري)</label><input type="file" class="form-input" id="newsImage" accept="image/*" style="padding:10px;"></div><div class="form-group"><label class="form-label">🎥 فيديو (اختياري)</label><input type="file" class="form-input" id="newsVideo" accept="video/*" style="padding:10px;"></div><button class="btn-primary" id="publishNewsBtn" onclick="publishNews()" style="background:linear-gradient(135deg,#C2185B,#E91E63);">📤 نشر</button></div>';
    document.body.appendChild(ans);
  }

  // ═══ فتح صفحة الأخبار ═══
  window.openNews = async function(){
    if(!window.currentUser) return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('newsScreen');
    
    var addBtn = document.getElementById('addNewsBtn');
    if(addBtn) addBtn.style.display = (window.currentRole === 'owner' || window.currentRole === 'teacher') ? 'flex' : 'none';
    
    var c = document.getElementById('newsContent');
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
    
    try {
      var fs = firebase.firestore();
      var snap = await fs.collection('posts').orderBy('created_at','desc').limit(30).get();
      if(snap.empty){ c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📰</div><p>لا توجد منشورات بعد</p></div>'; return; }
      
      var html = '';
      snap.forEach(function(doc){
        var p = doc.data();
        var isOwner = window.currentRole === 'owner';
        html += '<div style="background:#fff;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);">';
        
        // رأس المنشور
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
        html += '<div style="font-weight:bold;color:#C2185B;">👤 ' + (p.author_name || 'المالك') + '</div>';
        if(isOwner){
          html += '<button onclick="deleteNews(\'' + doc.id + '\')" style="background:#FFEBEE;color:#E53935;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;">🗑️ حذف</button>';
        }
        html += '</div>';
        
        // المحتوى
        html += '<h3 style="margin-bottom:10px;color:#212121;">' + (p.title || '') + '</h3>';
        html += '<div style="line-height:1.7;color:#424242;white-space:pre-wrap;margin-bottom:12px;">' + (p.content || '') + '</div>';
        
        // الوسائط
        if(p.image_url) html += '<img src="' + p.image_url + '" style="width:100%;border-radius:12px;margin-bottom:12px;">';
        if(p.video_url) html += '<video controls src="' + p.video_url + '" style="width:100%;border-radius:12px;margin-bottom:12px;"></video>';
        
        // التاريخ
        html += '<div style="font-size:11px;color:#999;margin-bottom:12px;">📅 ' + new Date(p.created_at).toLocaleString('ar-EG') + '</div>';
        
        // التعليقات
        html += '<div style="border-top:1px solid #eee;padding-top:12px;" id="comments-' + doc.id + '">';
        html += '<div style="font-weight:bold;font-size:13px;color:#666;margin-bottom:8px;">💬 التعليقات</div>';
        html += '<div id="commentsList-' + doc.id + '"></div>';
        html += '<div style="display:flex;gap:6px;margin-top:8px;">';
        html += '<input type="text" id="commentInput-' + doc.id + '" placeholder="اكتب تعليق..." style="flex:1;padding:10px;border:2px solid #eee;border-radius:10px;font-family:inherit;font-size:13px;outline:none;">';
        html += '<button onclick="addComment(\'' + doc.id + '\')" style="background:#1976D2;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:bold;cursor:pointer;">📤</button>';
        html += '</div></div>';
        
        html += '</div>';
        
        // تحميل التعليقات بعد ما الصفحة تترسم
        setTimeout(function(){ loadComments(doc.id); }, 100);
      });
      c.innerHTML = html;
    } catch(e){ console.error(e); c.innerHTML = '<p style="text-align:center;color:#E53935;">⚠️ فشل التحميل</p>'; }
  };

  // ═══ تحميل التعليقات ═══
  window.loadComments = async function(postId){
    try {
      var fs = firebase.firestore();
      var snap = await fs.collection('posts').doc(postId).collection('comments').orderBy('created_at','asc').get();
      var l = document.getElementById('commentsList-' + postId);
      if(!l) return;
      if(snap.empty){ l.innerHTML = '<p style="font-size:12px;color:#999;">لا توجد تعليقات</p>'; return; }
      
      var html = '';
      snap.forEach(function(doc){
        var cm = doc.data();
        html += '<div style="background:#F5F5F5;border-radius:10px;padding:8px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:flex-start;">';
        html += '<div><b style="color:#2E7D32;font-size:12px;">' + (cm.author_name || 'مستخدم') + ':</b> <span style="font-size:13px;">' + cm.text + '</span></div>';
        if(window.currentRole === 'owner'){
          html += '<button onclick="deleteComment(\'' + postId + '\',\'' + doc.id + '\')" style="background:none;border:none;color:#E53935;cursor:pointer;font-size:14px;">✕</button>';
        }
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); }
  };

  // ═══ إضافة تعليق ═══
  window.addComment = async function(postId){
    var inp = document.getElementById('commentInput-' + postId);
    if(!inp || !inp.value.trim() || !window.currentUser) return;
    try {
      await firebase.firestore().collection('posts').doc(postId).collection('comments').add({
        text: inp.value.trim(),
        author_id: window.currentUser.uid,
        author_name: window.currentUser.name,
        created_at: new Date().toISOString()
      });
      inp.value = '';
      window.loadComments(postId);
      if(typeof showToast === 'function') showToast('✅ تم التعليق');
    } catch(e){ console.error(e); }
  };

  // ═══ حذف تعليق ═══
  window.deleteComment = async function(postId, commentId){
    if(window.currentRole !== 'owner') return;
    if(!confirm('حذف التعليق؟')) return;
    try {
      await firebase.firestore().collection('posts').doc(postId).collection('comments').doc(commentId).delete();
      window.loadComments(postId);
    } catch(e){ console.error(e); }
  };

  // ═══ حذف منشور ═══
  window.deleteNews = async function(postId){
    if(window.currentRole !== 'owner') return;
    if(!confirm('حذف المنشور وكل التعليقات؟')) return;
    try {
      var fs = firebase.firestore();
      var cmts = await fs.collection('posts').doc(postId).collection('comments').get();
      var batch = fs.batch();
      cmts.forEach(function(d){ batch.delete(d.ref); });
      await batch.commit();
      await fs.collection('posts').doc(postId).delete();
      window.openNews();
      if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    } catch(e){ console.error(e); }
  };

  // ═══ فتح إضافة منشور ═══
  window.openAddNews = function(){
    if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('addNewsScreen');
  };

  // ═══ نشر منشور ═══
  window.publishNews = async function(){
    var t = document.getElementById('newsTitle').value.trim();
    var c = document.getElementById('newsText').value.trim();
    var img = document.getElementById('newsImage').files[0];
    var vid = document.getElementById('newsVideo').files[0];
    var btn = document.getElementById('publishNewsBtn');
    
    if(!t || !c){ if(typeof showToast === 'function') showToast('⚠️ أدخل العنوان والمحتوى'); return; }
    if(btn){ btn.disabled = true; btn.textContent = '⏳ جاري النشر...'; }
    
    try {
      var imgUrl = null, vidUrl = null;
      if(img) imgUrl = await window.uploadFile(img, 'posts/images');
      if(vid) vidUrl = await window.uploadFile(vid, 'posts/videos');
      
      await firebase.firestore().collection('posts').add({
        title: t, content: c,
        image_url: imgUrl, video_url: vidUrl,
        author_id: window.currentUser.uid,
        author_name: window.currentUser.name,
        created_at: new Date().toISOString()
      });
      
      if(typeof showToast === 'function') showToast('✅ تم النشر');
      document.getElementById('newsTitle').value = '';
      document.getElementById('newsText').value = '';
      if(btn){ btn.disabled = false; btn.textContent = '📤 نشر'; }
      window.openNews();
    } catch(e){
      console.error(e);
      if(btn){ btn.disabled = false; btn.textContent = '📤 نشر'; }
      if(typeof showToast === 'function') showToast('❌ فشل النشر');
    }
  };

  // ═══ إضافة الأزرار للصفحة الرئيسية ═══
  window.addEventListener('load', function(){
    setTimeout(function(){
      var home = document.getElementById('homeScreen');
      if(!home) return;
      var content = home.querySelector('.content');
      if(!content) return;
      
      // زرار الأخبار
      if(!document.getElementById('newsBtn')){
        var nb = document.createElement('div');
        nb.id = 'newsBtn';
        nb.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#C2185B,#E91E63);color:#fff;border-radius:16px;text-align:center;cursor:pointer;font-weight:bold;';
        nb.innerHTML = '<div style="font-size:28px;">📰</div><div style="margin-top:8px;font-size:15px;">الأخبار والمقالات</div>';
        nb.onclick = function(){ window.openNews(); };
        content.insertBefore(nb, content.firstChild);
      }
    }, 5000);
  });

  console.log('✅ Full News System loaded');
})();
// ═══════════════════════════════════════════════════════
// 📥 إرجاع زرار التحميل بدون نت
// ═══════════════════════════════════════════════════════

(function(){
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
      var toolsGrid = document.querySelector('#homeScreen .tools-grid');
      if(!toolsGrid || document.getElementById('offlineBtnInGrid')) return;
      
      var btn = document.createElement('div');
      btn.id = 'offlineBtnInGrid';
      btn.className = 'tool-btn';
      btn.innerHTML = '<div class="tool-icon" style="background:#1976D215;color:#1976D2;font-size:22px;">📥</div><div class="tool-label">تحميل</div>';
      btn.onclick = function(){ window.downloadAllOffline(); };
      toolsGrid.appendChild(btn);
    }, 4500);
  });

  console.log('✅ Offline Button Restored');
})();
// ═══════════════════════════════════════════════════════
// 😊 الإيموشن والإعجابات (للتعليقات والدردشة)
// ═══════════════════════════════════════════════════════

(function(){
  
  // دالة لإظهار قائمة الإيموشن
  window.showEmojiPicker = function(inputId){
    var emojis = ['😊','😂','❤️','👍','🔥','✨','🎉','😍','🙏','😎','😢','😡','👏','💯','🌟','🥰'];
    var picker = document.getElementById('emojiPicker');
    if(picker) picker.remove();
    
    picker = document.createElement('div');
    picker.id = 'emojiPicker';
    picker.style.cssText = 'position:absolute;background:#fff;border-radius:14px;padding:8px;box-shadow:0 4px 20px rgba(0,0,0,.2);display:grid;grid-template-columns:repeat(4,1fr);gap:6px;z-index:9999;';
    
    var inp = document.getElementById(inputId);
    if(!inp) return;
    var rect = inp.getBoundingClientRect();
    picker.style.top = (rect.top - 180) + 'px';
    picker.style.left = rect.left + 'px';
    
    emojis.forEach(function(emo){
      var b = document.createElement('button');
      b.textContent = emo;
      b.style.cssText = 'font-size:22px;background:none;border:none;cursor:pointer;padding:4px;border-radius:8px;';
      b.onmouseover = function(){ b.style.background = '#f0f0f0'; };
      b.onmouseout = function(){ b.style.background = 'none'; };
      b.onclick = function(){
        inp.value += emo;
        picker.remove();
      };
      picker.appendChild(b);
    });
    
    document.body.appendChild(picker);
    
    // إغلاق عند الضغط في أي مكان تاني
    setTimeout(function(){
      document.addEventListener('click', function closePicker(e){
        if(!picker.contains(e.target) && e.target !== inp){
          picker.remove();
          document.removeEventListener('click', closePicker);
        }
      });
    }, 100);
  };

  // إضافة زرار الإيموشن لصفحة الأخبار
  window.addEventListener('load', function(){
    setInterval(function(){
      // 1. في الأخبار (التعليقات)
      var newsInputs = document.querySelectorAll('[id^="commentInput-"]');
      newsInputs.forEach(function(inp){
        if(inp.parentElement.querySelector('.emoji-btn')) return;
        var btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.innerHTML = '😊';
        btn.style.cssText = 'background:#F0F0F0;border:none;width:40px;height:40px;border-radius:50%;font-size:20px;cursor:pointer;flex-shrink:0;';
        btn.onclick = function(e){ e.stopPropagation(); window.showEmojiPicker(inp.id); };
        inp.parentElement.insertBefore(btn, inp.nextSibling);
      });

      // 2. في الدردشة (زرار الإيموشن القديم)
      var chatInput = document.getElementById('chatInput');
      if(chatInput && !document.getElementById('newChatEmojiBtn')){
        var cBtn = document.createElement('button');
        cBtn.id = 'newChatEmojiBtn';
        cBtn.innerHTML = '😊';
        cBtn.style.cssText = 'background:#F0F0F0;border:none;width:40px;height:40px;border-radius:50%;font-size:20px;cursor:pointer;flex-shrink:0;margin-left:4px;';
        cBtn.onclick = function(e){ e.stopPropagation(); window.showEmojiPicker('chatInput'); };
        chatInput.parentElement.insertBefore(cBtn, chatInput.nextSibling);
      }
    }, 2000);
  });

  console.log('✅ Emoji & Reactions System loaded');
})();
// ═══════════════════════════════════════════════════════
// 🔒 حماية رقم تليفون المعلم (يظهر للمالك فقط)
// ═══════════════════════════════════════════════════════

(function(){
  // دالة بتشوف لو الاسم فيه أرقام (يعني رقم تليفون)
  function maskPhoneIfNeeded(name){
    // لو مفيش اسم، نرجع "مستخدم"
    if(!name) return 'مستخدم';
    
    // لو إحنا المالك، نعرض الاسم زي ما هو (بما فيه الرقم)
    if(window.currentRole === 'owner') return name;
    
    // لو الطالب أو المعلم التاني، بنخفي الأرقام
    // بنشوف لو الاسم فيه أرقام متتالية (رقم تليفون)
    var hasNumbers = /\d{4,}/.test(name);
    
    if(hasNumbers){
      // بنستبدل الأرقام بنجوم
      return name.replace(/\d/g, '*');
    }
    
    return name;
  }

  // نراقب الصفحات اللي بتظهر فيها أسماء المعلمين ونطبق الحماية
  window.addEventListener('load', function(){
    setInterval(function(){
      // نطبق الحماية على أي عنصر فيه كلمة "المعلم" أو "المعلمين"
      var elements = document.querySelectorAll('*');
      elements.forEach(function(el){
        // بنركز على العناصر اللي فيها نص بس
        if(el.children.length === 0 && el.textContent){
          var text = el.textContent;
          // لو النص فيه رقم تليفون طويل (أكتر من 8 أرقام)
          if(/\d{8,}/.test(text) && window.currentRole !== 'owner'){
            // نخفي الأرقام
            el.textContent = text.replace(/\d{8,}/g, '*********');
          }
        }
      });
    }, 2000);
  });

  console.log('✅ Phone Protection loaded');
})();
// ═══════════════════════════════════════════════════════
// 🧹 إزالة القائمة السريعة
// ═══════════════════════════════════════════════════════

(function(){
  // إخفاء القائمة السريعة من كل مكان
  var qm = document.getElementById('quickMenu');
  if(qm) qm.remove();
  
  // إخفاء أي عنصر بيعملها (في حالة كانت بتتنشأ تاني)
  setInterval(function(){
    var q = document.getElementById('quickMenu');
    if(q) q.remove();
  }, 3000);

  console.log('✅ Quick Menu Removed');
})();
// ═══════════════════════════════════════════════════════
// 🧹 التصفية النهائية (إزالة التكرار + مسح القائمة السريعة)
// ═══════════════════════════════════════════════════════

(function(){
  // 1. دالة لإزالة أي عنصر مكرر في شبكة الأدوات
  function removeDuplicates(selector) {
    var elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      for (var i = 1; i < elements.length; i++) {
        elements[i].remove();
      }
    }
  }

  window.addEventListener('load', function(){
    // نفضل نراقب الصفحة كل شوية عشان نضمن إن مفيش تكرار
    setInterval(function(){
      
      // --- أولاً: إخفاء وحذف القائمة السريعة نهائياً ---
      var quickMenu = document.getElementById('quickMenu');
      if (quickMenu) quickMenu.remove();
      
      var quickMenuBtn = document.querySelector('[onclick*="quickMenu"]');
      if (quickMenuBtn) quickMenuBtn.remove();

      // --- ثانياً: تصفية أزرار المعلم ---
      if (window.currentRole === 'teacher') {
        // إزالة التكرار في زر رفع المحتوى
        removeDuplicates('#uploadBtn');
        // إزالة التكرار في زر تقديم الطلب
        removeDuplicates('#teacherReqBtn');
        // إزالة التكرار في زر لوحة التحكم (لو ظهر أكتر من مرة)
        removeDuplicates('#teacherControlBtn');
      }

      // --- ثالثاً: تصفية أزرار المالك (في حال كانت ظاهرة) ---
      if (window.currentRole === 'owner') {
        // إزالة أي تكرار لأزرار الإدارة
        removeDuplicates('#adminApprovalsBtn');
        removeDuplicates('#adminContentBtn');
      }

    }, 2000); // بيتأكد كل ثانيتين
  });

  console.log('✅ Final Cleanup Loaded');
})();
console.log('✅ extras.js loaded');
  
})();
