// extras.js — Offline + نقاط + تحميل

(function(){
  try {
    firebase.firestore().enablePersistence({synchronizeTabs:true})
      .then(function(){console.log('✅ Offline enabled');})
      .catch(function(e){console.log('⚠️ Persistence:', e.code);});
    window.addEventListener('online', function(){
      if(typeof showToast === 'function') showToast('✅ رجع الاتصال');
    });
    window.addEventListener('offline', function(){
      if(typeof showToast === 'function') showToast('📴 وضع Offline');
    });
  } catch(e){ console.log('Offline error:', e); }
})();

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
  m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">' + h + '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;margin-top:16px;">حسناً</button></div>';
  document.body.appendChild(m);
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

window.downloadQuranText = async function(){
  if(!navigator.onLine){ if(typeof showToast === 'function') showToast('⚠️ محتاج نت'); return; }
  if(localStorage.getItem('offline_quran_full')){ if(typeof showToast === 'function') showToast('✅ محمّل من قبل'); return; }
  if(typeof showToast === 'function') showToast('⏳ جاري تحميل القرآن...');
  try {
    var r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    var j = await r.json();
    if(!j.data || !j.data.surahs){ if(typeof showToast === 'function') showToast('❌ فشل'); return; }
    var quran = {};
    j.data.surahs.forEach(function(s){
      quran[s.number] = { name: s.name, ayahs: s.ayahs.map(function(a){ return {num: a.numberInSurah, text: a.text}; }) };
    });
    localStorage.setItem('offline_quran_full', JSON.stringify(quran));
    if(typeof showToast === 'function') showToast('✅ تم تحميل ' + j.data.surahs.length + ' سورة');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل: ' + e.message);
  }
};

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

    var ss = await fs.collection('station').orderBy('created_at', 'desc').get();
    var station = [];
    ss.forEach(function(d){ station.push(Object.assign({id: d.id}, d.data())); });
    localStorage.setItem('offline_station', JSON.stringify(station));
    if(typeof showToast === 'function') showToast('✅ محطتي: ' + station.length);

    if(!localStorage.getItem('offline_quran_list')){
      var r = await fetch('https://api.alquran.cloud/v1/surah');
      var j = await r.json();
      localStorage.setItem('offline_quran_list', JSON.stringify(j.data));
    }
    if(typeof showToast === 'function') showToast('✅ فهرس القرآن');

    await window.downloadQuranText();
    if(typeof showToast === 'function') showToast('🎉 تم التحميل الكامل!');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل: ' + e.message);
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
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border-radius:16px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(25,118,210,.3);font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">📥</div><div style="margin-top:8px;font-size:15px;">تحميل المنصة للعمل بدون نت</div><div style="font-size:12px;opacity:.9;margin-top:4px;">(يحتاج نت — مرة واحدة)</div>';
    btn.onclick = function(){ window.downloadAllOffline(); };
    content.insertBefore(btn, content.firstChild);
  }, 2500);
});

(function(){
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if(tries > 60 || typeof window.login === 'function'){
      clearInterval(timer);
      if(typeof window.login !== 'function') return;
      var orig = window.login;
      window.login = async function(){
        if(!navigator.onLine){
          var saved = localStorage.getItem('lastUser');
          if(saved){
            try {
              var su = JSON.parse(saved);
              window.currentUser = {name: su.name, uid: su.uid, points: su.points || 0};
              window.currentRole = su.role || 'student';
              if(typeof showToast === 'function') showToast('📴 دخول offline');
              if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 400);
              return;
            } catch(e){}
          }
          if(typeof showToast === 'function') showToast('⚠️ محتاج نت أول مرة');
          return;
        }
        try {
          await orig.apply(this, arguments);
          if(window.currentUser){
            localStorage.setItem('lastUser', JSON.stringify({
              name: window.currentUser.name,
              uid: window.currentUser.uid,
              role: window.currentRole,
              points: window.currentUser.points || 0
            }));
          }
        } catch(e){
          console.error('login:', e);
          var saved2 = localStorage.getItem('lastUser');
          if(saved2){
            try {
              var su2 = JSON.parse(saved2);
              window.currentUser = {name: su2.name, uid: su2.uid, points: su2.points || 0};
              window.currentRole = su2.role || 'student';
              if(typeof showToast === 'function') showToast('📴 دخول offline');
              if(typeof showScreen === 'function') setTimeout(function(){ showScreen('homeScreen'); }, 400);
              return;
            } catch(err){}
          }
          if(typeof showToast === 'function') showToast('❌ فشل الدخول');
        }
      };
      console.log('✅ login overridden');
    }
  }, 200);
})();

console.log('✅ extras.js loaded');
