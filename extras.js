// ═══ extras.js — Part 1: Offline + Security ═══
(function(){
  'use strict';
  
  // ═══ 1. Offline Persistence ═══
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
  
  window.generateSalt = function(){
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };
  
  window.generateRecoveryCode = function(){
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // ═══ 4. Login Log ═══
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
  
  // ═══ 5. Recovery Code Modal ═══
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
  
  console.log('✅ Part 1-A loaded');
  
})();
