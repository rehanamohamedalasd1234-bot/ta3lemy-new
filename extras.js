// ═══════════════════════════════════════════════════════
// extras.js — إضافات المنصة (Offline + نقاط + تحميل)
// ═══════════════════════════════════════════════════════

// ═══ 1. تفعيل Offline ═══
(function(){
  try {
    if (typeof db !== 'undefined' && db) {
      db.enablePersistence({synchronizeTabs:true})
        .then(function(){console.log('✅ Offline enabled');})
        .catch(function(e){console.log('⚠️ Persistence:',e.code);});
    }
    window.addEventListener('online',function(){
      if(typeof showToast==='function') showToast('✅ رجع الاتصال');
    });
    window.addEventListener('offline',function(){
      if(typeof showToast==='function') showToast('📴 وضع Offline');
    });
  } catch(e){console.log('Offline error:',e);}
})();

// ═══ 2. نظام النقاط والشارات ═══
window.BADGES = [
  {id:'new',name:'مبتدئ',icon:'🌱',pts:0,desc:'انضم للمنصة'},
  {id:'reader',name:'قارئ',icon:'📖',pts:100,desc:'قرأ 10 دروس'},
  {id:'student',name:'طالب نشيط',icon:'📚',pts:300,desc:'قرأ 30 درس'},
  {id:'scholar',name:'عالم',icon:'🎓',pts:600,desc:'قرأ 60 درس'},
  {id:'expert',name:'خبير',icon:'⭐',pts:1000,desc:'قرأ 100 درس'},
  {id:'master',name:'محترف',icon:'🏅',pts:2000,desc:'قرأ 200 درس'},
  {id:'legend',name:'أسطورة',icon:'👑',pts:5000,desc:'قرأ 500 درس'}
];

window.addPoints = async function(amt,reason){
  if(!window.currentUser) return;
  try {
    const ref = window.db.collection('users').doc(window.currentUser.uid);
    const doc = await ref.get();
    const oldPts = doc.exists ? (doc.data().points||0) : 0;
    const newPts = oldPts + amt;
    await ref.update({points:newPts,lastPoints:new Date().toISOString()});
    window.currentUser.points = newPts;
    const oldB = [...window.BADGES].reverse().find(b=>oldPts>=b.pts);
    const newB = [...window.BADGES].reverse().find(b=>newPts>=b.pts);
    if(newB && (!oldB || newB.id !== oldB.id)){
      if(typeof showToast==='function') showToast(newB.icon+' مبروك! شارة "'+newB.name+'"');
    }
    const pe = document.getElementById('profilePoints');
    if(pe) pe.textContent = '⭐ '+newPts+' نقطة';
  } catch(e){console.error('addPoints:',e);}
};

window.getCurrentBadge = function(pts){
  return [...window.BADGES].reverse().find(b=>pts>=b.pts) || window.BADGES[0];
};

window.showMyPoints = function(){
  if(!window.currentUser) return;
  const pts = window.currentUser.points || 0;
  const badge = window.getCurrentBadge(pts);
  const next = window.BADGES.find(b=>b.pts>pts);
  let h = '<div style="text-align:center;padding:20px;">';
  h += '<div style="font-size:72px;">'+badge.icon+'</div>';
  h += '<div style="font-size:22px;font-weight:bold;color:#2E7D32;margin:12px 0;">'+badge.name+'</div>';
  h += '<div style="font-size:32px;color:#F9A825;font-weight:bold;">⭐ '+pts+' نقطة</div>';
  if(next){
    const pct = Math.min(100,(pts/next.pts)*100);
    h += '<div style="margin-top:20px;text-align:right;">';
    h += '<div style="font-size:13px;color:#666;margin-bottom:6px;">الشارة التالية: '+next.icon+' '+next.name+'</div>';
    h += '<div style="background:#E0E0E0;border-radius:10px;height:14px;overflow:hidden;"><div style="background:linear-gradient(90deg,#2E7D32,#4CAF50);height:100%;width:'+pct+'%;"></div></div>';
    h += '<div style="font-size:12px;color:#999;margin-top:4px;text-align:left;">'+pts+' / '+next.pts+'</div></div>';
  }
  h += '<div style="margin-top:24px;text-align:right;"><div style="font-weight:bold;color:#2E7D32;margin-bottom:12px;">🏆 جميع الشارات:</div>';
  window.BADGES.forEach(b=>{
    const ok = pts>=b.pts;
    h += '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:'+(ok?'#E8F5E9':'#F5F5F5')+';border-radius:12px;margin-bottom:8px;opacity:'+(ok?'1':'0.5')+';">';
    h += '<div style="font-size:28px;">'+b.icon+'</div>';
    h += '<div style="flex:1;"><div style="font-weight:bold;color:'+(ok?'#2E7D32':'#666')+';">'+b.name+(ok?' ✅':'')+'</div>';
    h += '<div style="font-size:11px;color:#999;">'+b.desc+' — '+b.pts+' نقطة</div></div></div>';
  });
  h += '</div></div>';
  const m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
  m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">'+h+'<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;margin-top:16px;">حسناً</button></div>';
  document.body.appendChild(m);
};

window.trackLessonView = async function(id){
  if(!window.currentUser) return;
  const key = 'viewed_'+window.currentUser.uid+'_'+id;
  if(localStorage.getItem(key)) return;
  localStorage.setItem(key,'1');
  await window.addPoints(10,'view');
};

window.trackDailyLogin = async function(){
  if(!window.currentUser) return;
  const today = new Date().toISOString().split('T')[0];
  const key = 'login_'+window.currentUser.uid+'_'+today;
  if(localStorage.getItem(key)) return;
  localStorage.setItem(key,'1');
  await window.addPoints(5,'daily');
};

// ═══ 3. تسجيل offline-sw ═══
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./offline-sw.js')
    .then(function(){console.log('✅ offline-sw registered');})
    .catch(function(e){console.log('⚠️ offline-sw:',e);});
}

// ═══ 4. تسجيل دخول Offline ═══
(function(){
  const checkLogin = setInterval(function(){
    if (typeof window.login !== 'function') return;
    clearInterval(checkLogin);
    
    const origLogin = window.login;
    window.login = async function(){
      try {
        await origLogin.apply(this, arguments);
        if (window.currentUser) {
          localStorage.setItem('lastUser', JSON.stringify({
            name: window.currentUser.name,
            uid: window.currentUser.uid,
            role: window.currentRole,
            points: window.currentUser.points || 0
          }));
        }
      } catch(e) {
        const saved = localStorage.getItem('lastUser');
        if (saved) {
          const u = JSON.parse(saved);
          window.currentUser = {
            name: u.name,
            uid: u.uid,
            points: u.points || 0
          };
          window.currentRole = u.role || 'student';
          if (typeof showToast === 'function') showToast('📴 دخول offline');
          if (typeof showScreen === 'function') showScreen('homeScreen');
        } else {
          if (typeof showToast === 'function') showToast('⚠️ سجل دخول أول مرة بالنت');
        }
      }
    };
  }, 200);
})();

// ═══ 5. قراءة الدروس من الكاش ═══
window.getOfflineLessons = function(){
  try {
    const s = localStorage.getItem('offline_lessons');
    return s ? JSON.parse(s) : null;
  } catch(e){ return null; }
};

window.getOfflineStation = function(){
  try {
    const s = localStorage.getItem('offline_station');
    return s ? JSON.parse(s) : null;
  } catch(e){ return null; }
};

window.getOfflineSurah = function(num){
  try {
    const s = localStorage.getItem('offline_quran_full');
    if(!s) return null;
    const quran = JSON.parse(s);
    return quran[num] || null;
  } catch(e){ return null; }
};

// ═══ 6. تحميل القرآن كامل ═══
window.downloadQuranText = async function(){
  if(!navigator.onLine){ 
    if(typeof showToast==='function') showToast('⚠️ محتاج نت'); 
    return; 
  }
  if(localStorage.getItem('offline_quran_full')){
    if(typeof showToast==='function') showToast('✅ القرآن محمّل من قبل');
    return;
  }
  
  if(typeof showToast==='function') showToast('⏳ جاري تحميل القرآن...');
  try {
    const r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    const j = await r.json();
    if(!j.data || !j.data.surahs){
      if(typeof showToast==='function') showToast('❌ فشل التحميل');
      return;
    }
    
    const quran = {};
    j.data.surahs.forEach(function(s){
      quran[s.number] = {
        name: s.name,
        ayahs: s.ayahs.map(function(a){
          return {num: a.numberInSurah, text: a.text};
        })
      };
    });
    
    localStorage.setItem('offline_quran_full', JSON.stringify(quran));
    if(typeof showToast==='function') showToast('✅ تم تحميل ' + j.data.surahs.length + ' سورة');
  } catch(e){
    console.error(e);
    if(typeof showToast==='function') showToast('❌ فشل: ' + e.message);
  }
};

// ═══ 7. تحميل المنصة كاملة ═══
window.downloadAllOffline = async function(){
  if(!navigator.onLine){ 
    if(typeof showToast==='function') showToast('⚠️ محتاج نت للتحميل'); 
    return; 
  }
  
  if(typeof showToast==='function') showToast('⏳ جاري التحميل...');
  
  try {
    // 1. الدروس
    const lessonsSnap = await db.collection('lessons').get();
    const lessons = [];
    lessonsSnap.forEach(d => lessons.push({id:d.id, ...d.data()}));
    localStorage.setItem('offline_lessons', JSON.stringify(lessons));
    if(typeof showToast==='function') showToast('✅ الدروس: ' + lessons.length);
    
    // 2. محطتي الإذاعية
    const stationSnap = await db.collection('station').orderBy('created_at','desc').get();
    const station = [];
    stationSnap.forEach(d => station.push({id:d.id, ...d.data()}));
    localStorage.setItem('offline_station', JSON.stringify(station));
    if(typeof showToast==='function') showToast('✅ محطتي: ' + station.length);
    
    // 3. فهرس القرآن
    if(!localStorage.getItem('offline_quran_list')){
      const r = await fetch('https://api.alquran.cloud/v1/surah');
      const j = await r.json();
      localStorage.setItem('offline_quran_list', JSON.stringify(j.data));
    }
    if(typeof showToast==='function') showToast('✅ فهرس القرآن');
    
    // 4. القرآن كامل
    await window.downloadQuranText();
    
    if(typeof showToast==='function') showToast('🎉 تم التحميل الكامل!');
  } catch(e){
    console.error(e);
    if(typeof showToast==='function') showToast('❌ فشل: ' + e.message);
  }
};

// ═══ 8. إضافة زرار التحميل في الرئيسية ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    const home = document.getElementById('homeScreen');
    if(!home || document.getElementById('offlineBtn')) return;
    const content = home.querySelector('.content');
    if(!content) return;
    const btn = document.createElement('div');
    btn.id = 'offlineBtn';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border-radius:16px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(25,118,210,.3);font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">📥</div><div style="margin-top:8px;font-size:15px;">تحميل المنصة للعمل بدون نت</div><div style="font-size:12px;opacity:.9;margin-top:4px;">(يحتاج نت — مرة واحدة بس)</div>';
    btn.onclick = async function(){
      await window.downloadAllOffline();
    };
    content.insertBefore(btn, content.firstChild);
  }, 2000);
});

// ═══ 9. Override openContent — قراءة من الكاش ═══
(function(){
  let tries = 0;
  const timer = setInterval(function(){
    tries++;
    if(tries > 40){ clearInterval(timer); return; }
    if(typeof window.openContent !== 'function') return;
    clearInterval(timer);
    
    const orig = window.openContent;
    window.openContent = async function(type, num, name){
      const offline = window.getOfflineLessons();
      
      if(offline && !navigator.onLine){
        try {
          const filtered = offline.filter(function(l){
            return l.subject === window.currentSubject &&
                   l.term === num &&
                   l.type === type &&
                   l.grade === window.currentGrade;
          });
          
          if(filtered.length > 0){
            const titles = {lessons:'📄 الدروس', exercises:'✏️ تدريبات', exams:'📝 امتحانات', videos:'🎥 فيديوهات'};
            document.getElementById('contentTitle').textContent = titles[type] || 'المحتوى';
            document.getElementById('contentHeaderTitle').textContent = (window.currentSubject||'') + ' - ' + name;
            document.getElementById('contentHeaderSub').textContent = titles[type] + ' (offline)';
            
            const l = document.getElementById('contentList');
            const sorted = filtered.sort(function(a,b){ return (a.order||99) - (b.order||99); });
            let html = '';
            sorted.forEach(function(it){
              html += '<div class="content-item" onclick="viewContent(\'' + it.id + '\')"><div class="content-item-icon">📄</div><div class="content-item-info"><div class="content-item-title">' + (it.title||'بدون عنوان') + '</div><div class="content-item-sub">' + (it.content ? it.content.substring(0,50) + '...' : '') + '</div></div><div class="content-item-arrow">‹</div></div>';
            });
            l.innerHTML = html;
            
            if(window.screenHistory) window.screenHistory.push(window.currentScreen);
            if(typeof showScreen === 'function') showScreen('contentScreen');
            return;
          }
        } catch(e){ console.error('offline openContent:', e); }
      }
      
      return orig.apply(this, arguments);
    };
    
    console.log('✅ openContent overridden');
  }, 200);
})();

console.log('✅ extras.js loaded');
