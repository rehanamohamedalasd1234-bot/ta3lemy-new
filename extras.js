// ═══════════════════════════════════════════════════════
// extras.js — الجزء 1 من 4
// Offline + النقاط + الشارات + تسجيل دخول آمن
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  
  // ═══ 1. تفعيل Offline Persistence ═══
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
  
  // ═══ 2. تشفير كلمة المرور ═══
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
  
  // ═══ 3. Device ID ═══
  window.getDeviceId = function(){
    var did = localStorage.getItem('hafez_device_id');
    if (!did) {
      var rand = Math.random().toString(36).substring(2, 10);
      did = 'dev_' + Date.now().toString(36) + '_' + rand;
      localStorage.setItem('hafez_device_id', did);
    }
    return did;
  };
  
  // ═══ 4. Salt + Recovery Code ═══
  window.generateSalt = function(){
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };
  window.generateRecoveryCode = function(){
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // ═══ 5. سجل الدخول ═══
  window.logLogin = async function(username, role, success, reason){
    try {
      await firebase.firestore().collection('login_logs').add({
        username: username,
        role: role,
        success: success,
        reason: reason || '',
        device: window.getDeviceId(),
        timestamp: new Date().toISOString()
      });
    } catch(e){}
  };
  
  // ═══ 6. عرض كود الاستعادة ═══
  window.showRecoveryCode = function(code, username){
    var m = document.createElement('div');
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:400px;width:100%;padding:28px;text-align:center;font-family:inherit;">' +
      '<div style="font-size:60px;margin-bottom:12px;">🔐</div>' +
      '<div style="font-size:20px;font-weight:bold;color:#2E7D32;margin-bottom:8px;">كود الاستعادة</div>' +
      '<div style="font-size:13px;color:#666;margin-bottom:20px;">احفظ الكود ده في مكان آمن<br>هتحتاجه لو نسيت كلمة المرور</div>' +
      '<div style="background:#FFF8E1;padding:20px;border-radius:14px;margin-bottom:16px;">' +
      '<div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#F9A825;direction:ltr;">' + code + '</div>' +
      '</div>' +
      '<div style="font-size:13px;color:#666;margin-bottom:20px;">الحساب: <b>' + username + '</b></div>' +
      '<button id="copyRecBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">📋 نسخ الكود والمتابعة</button>' +
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
        if(typeof showToast === 'function') showToast('📋 تم نسخ الكود');
      } catch(e){}
      m.remove();
    };
  };
  
  // ═══ 7. نظام النقاط والشارات ═══
  window.BADGES = [
    {id:'new',     name:'مبتدئ',     icon:'🌱', pts:0,    desc:'انضم للمنصة'},
    {id:'reader',  name:'قارئ',      icon:'📖', pts:100,  desc:'قرأ 10 دروس'},
    {id:'student', name:'طالب نشيط', icon:'📚', pts:300,  desc:'قرأ 30 درس'},
    {id:'scholar', name:'عالم',      icon:'🎓', pts:600,  desc:'قرأ 60 درس'},
    {id:'expert',  name:'خبير',      icon:'⭐', pts:1000, desc:'قرأ 100 درس'},
    {id:'master',  name:'محترف',     icon:'🏅', pts:2000, desc:'قرأ 200 درس'},
    {id:'legend',  name:'أسطورة',    icon:'👑', pts:5000, desc:'قرأ 500 درس'}
  ];
  
  window.getCurrentBadge = function(pts){
    var arr = window.BADGES.slice().reverse();
    for(var i = 0; i < arr.length; i++){
      if(pts >= arr[i].pts) return arr[i];
    }
    return window.BADGES[0];
  };
  
  window.addPoints = async function(amt, reason){
    if(!window.currentUser) return;
    try {
      var fs = firebase.firestore();
      var ref = fs.collection('users').doc(window.currentUser.uid);
      var doc = await ref.get();
      var oldPts = doc.exists ? (doc.data().points || 0) : 0;
      var newPts = oldPts + amt;
      await ref.update({points: newPts, lastPoints: new Date().toISOString()});
      window.currentUser.points = newPts;
      var oldB = window.BADGES.slice().reverse().find(function(b){ return oldPts >= b.pts; });
      var newB = window.BADGES.slice().reverse().find(function(b){ return newPts >= b.pts; });
      if(newB && (!oldB || newB.id !== oldB.id)){
        if(typeof showToast === 'function') showToast(newB.icon + ' مبروك! شارة "' + newB.name + '"');
      }
      var pe = document.getElementById('profilePoints');
      if(pe) pe.textContent = '⭐ ' + newPts + ' نقطة';
    } catch(e){ console.error('addPoints:', e); }
  };
  
  window.showMyPoints = function(){
    if(!window.currentUser) return;
    var pts = window.currentUser.points || 0;
    var badge = window.getCurrentBadge(pts);
    var next = null;
    for(var i = 0; i < window.BADGES.length; i++){
      if(window.BADGES[i].pts > pts){ next = window.BADGES[i]; break; }
    }
    var h = '<div style="text-align:center;padding:20px;">';
    h += '<div style="font-size:72px;">' + badge.icon + '</div>';
    h += '<div style="font-size:22px;font-weight:bold;color:#2E7D32;margin:12px 0;">' + badge.name + '</div>';
    h += '<div style="font-size:32px;color:#F9A825;font-weight:bold;">⭐ ' + pts + ' نقطة</div>';
    if(next){
      var pct = Math.min(100, (pts / next.pts) * 100);
      h += '<div style="margin-top:20px;text-align:right;">';
      h += '<div style="font-size:13px;color:#666;margin-bottom:6px;">الشارة التالية: ' + next.icon + ' ' + next.name + '</div>';
      h += '<div style="background:#E0E0E0;border-radius:10px;height:14px;overflow:hidden;"><div style="background:linear-gradient(90deg,#2E7D32,#4CAF50);height:100%;width:' + pct + '%;"></div></div>';
      h += '<div style="font-size:12px;color:#999;margin-top:4px;text-align:left;">' + pts + ' / ' + next.pts + '</div></div>';
    }
    h += '<div style="margin-top:24px;text-align:right;"><div style="font-weight:bold;color:#2E7D32;margin-bottom:12px;">🏆 جميع الشارات:</div>';
    window.BADGES.forEach(function(b){
      var ok = pts >= b.pts;
      h += '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:' + (ok ? '#E8F5E9' : '#F5F5F5') + ';border-radius:12px;margin-bottom:8px;opacity:' + (ok ? '1' : '0.5') + ';">';
      h += '<div style="font-size:28px;">' + b.icon + '</div>';
      h += '<div style="flex:1;"><div style="font-weight:bold;color:' + (ok ? '#2E7D32' : '#666') + ';">' + b.name + (ok ? ' ✅' : '') + '</div>';
      h += '<div style="font-size:11px;color:#999;">' + b.desc + ' — ' + b.pts + ' نقطة</div></div></div>';
    });
    h += '</div></div>';
    var m = document.createElement('div');
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
    m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;font-family:inherit;">' + h + '<button id="closePtsBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;margin-top:16px;">حسناً</button></div>';
    document.body.appendChild(m);
    document.getElementById('closePtsBtn').onclick = function(){ m.remove(); };
  };
  
  window.trackLessonView = async function(id){
    if(!window.currentUser) return;
    var key = 'viewed_' + window.currentUser.uid + '_' + id;
    if(localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    await window.addPoints(10, 'view');
  };
  
  window.trackDailyLogin = async function(){
    if(!window.currentUser) return;
    var today = new Date().toISOString().split('T')[0];
    var key = 'login_' + window.currentUser.uid + '_' + today;
    if(localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    await window.addPoints(5, 'daily');
  };
  
  // ═══ 8. تسجيل دخول آمن (Override) ═══
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
        
        // ─── لو مفيش نت ───
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
        
        // ─── المالك ───
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
              if(typeof trackDailyLogin === 'function') window.trackDailyLogin();
            }
          } catch(e){ console.error(e); }
          return;
        }
        
        // ─── طالب / معلم ───
        try {
          var fs = firebase.firestore();
          var snap = await fs.collection('users').where('name', '==', uname).limit(1).get();
          
          // ═══ مستخدم جديد ═══
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
            if(typeof trackDailyLogin === 'function') window.trackDailyLogin();
            
            setTimeout(function(){
              if(typeof showToast === 'function') showToast('✅ تم إنشاء الحساب');
              if(typeof showScreen === 'function') showScreen('homeScreen');
            }, 2000);
            return;
          }
          
          // ═══ مستخدم موجود ═══
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
          if(typeof trackDailyLogin === 'function') window.trackDailyLogin();
          
          if(typeof showToast === 'function') showToast('✅ تم تسجيل الدخول');
          if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 600);
          
        } catch(e){
          console.error('login:', e);
          if(typeof showToast === 'function') showToast('❌ خطأ في الاتصال');
        }
      };
      
      console.log('✅ Secure login loaded');
    }, 2500);
  });
  
  // ═══ 9. سجل الدخول للمالك ═══
  window.viewLoginLogs = async function(){
    if (window.currentRole !== 'owner') return;
    try {
      var logs = await firebase.firestore().collection('login_logs').orderBy('timestamp','desc').limit(50).get();
      var h = '<div style="padding:16px;">';
      h += '<h2 style="color:#2E7D32;margin-bottom:12px;">📜 آخر 50 محاولة دخول</h2>';
      logs.forEach(function(doc){
        var l = doc.data();
        var color = l.success ? '#2E7D32' : '#E53935';
        var icon = l.success ? '✅' : '❌';
        h += '<div style="background:#fff;border-radius:10px;padding:10px;margin-bottom:8px;border-right:4px solid ' + color + ';">';
        h += '<div>' + icon + ' <b>' + l.username + '</b> (' + l.role + ')</div>';
        h += '<div style="font-size:11px;color:#666;">' + new Date(l.timestamp).toLocaleString('ar-EG') + '</div>';
        if(l.reason) h += '<div style="font-size:11px;color:#E53935;">سبب: ' + l.reason + '</div>';
        h += '</div>';
      });
      h += '</div>';
      var m = document.createElement('div');
      m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;overflow-y:auto;';
      m.innerHTML = '<div style="background:#FFFEF7;border-radius:22px;max-width:520px;margin:40px auto;padding:20px;position:relative;font-family:inherit;">' +
        '<button id="closeLogsBtn" style="position:sticky;top:10px;float:left;background:#E53935;color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer;z-index:10;">✕</button>' + h + '</div>';
      document.body.appendChild(m);
      document.getElementById('closeLogsBtn').onclick = function(){ m.remove(); };
    } catch(e){ console.error(e); }
  };
  
  console.log('✅ Part 1 loaded (Offline + Points + Secure Login)');
  
})();
