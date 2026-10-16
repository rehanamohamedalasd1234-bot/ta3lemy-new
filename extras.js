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
  
  console.log('✅ extras.js loaded');
  
})();
