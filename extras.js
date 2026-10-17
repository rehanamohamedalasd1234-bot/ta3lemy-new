// ═══════════════════════════════════════════════════════
// extras.js — النسخة الأساسية (بدون البث)
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  
  // 1. Offline
  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().enablePersistence({synchronizeTabs:true})
        .then(function(){ console.log('✅ Offline enabled'); })
        .catch(function(e){ console.log('⚠️ Persistence:', e.code); });
    }
  } catch(e){}
  
  // 2. Login Secure
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
    return 'fallback_hash';
  };
  
  window.getDeviceId = function(){
    var did = localStorage.getItem('hafez_device_id');
    if (!did) {
      did = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('hafez_device_id', did);
    }
    return did;
  };

  window.generateSalt = function(){ return Math.random().toString(36).substring(2, 15); };
  window.generateRecoveryCode = function(){ return Math.floor(100000 + Math.random() * 900000).toString(); };
  
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
        
        if (!uname || uname.length < 3) { if(typeof showToast === 'function') showToast('⚠️ اسم المستخدم 3 أحرف'); return; }
        if (pwd.length < 4) { if(typeof showToast === 'function') showToast('⚠️ كلمة المرور 4 أحرف'); return; }
        
        // لو مفيش نت
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
        
        // المالك
        if (window.currentRole === 'owner') {
          if (ownerCode !== '135790') { if(typeof showToast === 'function') showToast('🔐 كود المالك خطأ'); return; }
          try { await origLogin.apply(this, arguments); } catch(e){}
          return;
        }
        
        // طالب ومعلم
        try {
          var fs = firebase.firestore();
          var snap = await fs.collection('users').where('name', '==', uname).limit(1).get();
          
          if (snap.empty) {
            var newSalt = window.generateSalt();
            var newHash = await window.hashPassword(pwd, newSalt);
            var recCode = window.generateRecoveryCode();
            var dev = window.getDeviceId();
            var uid = 'u_' + Date.now().toString(36);
            
            await fs.collection('users').doc(uid).set({
              name: uname, role: window.currentRole, salt: newSalt, passHash: newHash, recoveryCode: recCode, trustedDevices: [dev], points: 0, createdAt: new Date().toISOString()
            });
            
            window.currentUser = {name: uname, uid: uid, points: 0};
            localStorage.setItem('lastUser', JSON.stringify({name: uname, uid: uid, role: window.currentRole, points: 0}));
            if(typeof showToast === 'function') showToast('✅ تم إنشاء الحساب');
            if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 1000);
            return;
          }
          
          var userDoc = snap.docs[0];
          var user = userDoc.data();
          var uid2 = userDoc.id;
          var computed = await window.hashPassword(pwd, user.salt || '');
          
          if (computed !== user.passHash) { if(typeof showToast === 'function') showToast('❌ كلمة المرور خطأ'); return; }
          
          window.currentUser = {name: uname, uid: uid2, points: user.points || 0};
          localStorage.setItem('lastUser', JSON.stringify({name: uname, uid: uid2, role: user.role || window.currentRole, points: user.points || 0}));
          if(typeof showToast === 'function') showToast('✅ تم تسجيل الدخول');
          if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 600);
        } catch(e){ console.error(e); }
      };
    }, 2000);
  });

  // 3. النقاط
  window.BADGES = [{id:'new',name:'مبتدئ',icon:'🌱',pts:0},{id:'reader',name:'قارئ',icon:'📖',pts:100},{id:'student',name:'طالب نشيط',icon:'📚',pts:300},{id:'expert',name:'خبير',icon:'⭐',pts:1000}];
  window.getCurrentBadge = function(pts){ for(var i=window.BADGES.length-1; i>=0; i--){ if(pts>=window.BADGES[i].pts) return window.BADGES[i]; } return window.BADGES[0]; };
  window.addPoints = async function(amt){ if(!window.currentUser) return; try { var ref = firebase.firestore().collection('users').doc(window.currentUser.uid); var doc = await ref.get(); var newPts = (doc.data().points||0) + amt; await ref.update({points: newPts}); window.currentUser.points = newPts; } catch(e){} };

  console.log('✅ extras.js loaded successfully');
})();
