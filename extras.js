// ═══════════════════════════════════════════════════════
// extras.js — الملف الشامل (Offline + نقاط + تحميل + دردشة)
// ═══════════════════════════════════════════════════════

// ═══ 1. تفعيل Offline Persistence ═══
(function(){
  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().enablePersistence({synchronizeTabs:true})
        .then(function(){console.log('✅ Offline enabled');})
        .catch(function(e){console.log('⚠️ Persistence:', e.code);});
    }
    window.addEventListener('online', function(){
      if(typeof showToast === 'function') showToast('✅ رجع الاتصال');
    });
    window.addEventListener('offline', function(){
      if(typeof showToast === 'function') showToast('📴 وضع Offline');
    });
  } catch(e){ console.log('Offline error:', e); }
})();

// ═══ 2. نظام النقاط والشارات ═══
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

// ═══ 3. القرآن — تحميل وقراءة ═══
window.downloadQuranText = async function(){
  if(!navigator.onLine){ if(typeof showToast === 'function') showToast('⚠️ محتاج نت'); return; }
  if(localStorage.getItem('offline_quran_full')){ 
    if(typeof showToast === 'function') showToast('✅ محمّل من قبل'); 
    return; 
  }
  if(typeof showToast === 'function') showToast('⏳ جاري تحميل القرآن...');
  try {
    var r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    var j = await r.json();
    if(!j.data || !j.data.surahs){ 
      if(typeof showToast === 'function') showToast('❌ فشل'); 
      return; 
    }
    var quran = {};
    j.data.surahs.forEach(function(s){
      quran[s.number] = { 
        name: s.name, 
        ayahs: s.ayahs.map(function(a){ return {num: a.numberInSurah, text: a.text}; }) 
      };
    });
    localStorage.setItem('offline_quran_full', JSON.stringify(quran));
    if(typeof showToast === 'function') showToast('✅ تم تحميل ' + j.data.surahs.length + ' سورة');
  } catch(e){
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل: ' + e.message);
  }
};

window.getOfflineSurah = function(num){
  try {
    var s = localStorage.getItem('offline_quran_full');
    if(!s) return null;
    var quran = JSON.parse(s);
    return quran[num] || null;
  } catch(e){ return null; }
};

// ═══ 4. تحميل المنصة كاملة ═══
window.getOfflineLessons = function(){
  try {
    var s = localStorage.getItem('offline_lessons');
    return s ? JSON.parse(s) : null;
  } catch(e){ return null; }
};

window.getOfflineStation = function(){
  try {
    var s = localStorage.getItem('offline_station');
    return s ? JSON.parse(s) : null;
  } catch(e){ return null; }
};

window.downloadAllOffline = async function(){
  if(!navigator.onLine){ 
    if(typeof showToast === 'function') showToast('⚠️ محتاج نت'); 
    return; 
  }
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

// ═══ 5. زرار التحميل في الرئيسية ═══
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

// ═══ 6. تسجيل دخول Offline ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var checkInterval = setInterval(function(){
      if(window.currentUser && window.currentUser.uid){
        try {
          localStorage.setItem('lastUser', JSON.stringify({
            name: window.currentUser.name,
            uid: window.currentUser.uid,
            role: window.currentRole || 'student',
            points: window.currentUser.points || 0
          }));
          clearInterval(checkInterval);
        } catch(e){}
      }
    }, 500);
  }, 1000);
});

// ═══ 7. Override دالة login (offline support) ═══
(function(){
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if(tries > 60){ clearInterval(timer); return; }
    if(typeof window.login !== 'function') return;
    clearInterval(timer);
    
    var orig = window.login;
    window.login = async function(){
      if(!navigator.onLine){
        var saved = localStorage.getItem('lastUser');
        if(saved){
          try {
            var su = JSON.parse(saved);
            var uEl = document.getElementById('usernameInput');
            var typedName = uEl ? uEl.value.trim() : su.name;
            window.currentUser = {
              name: typedName || su.name,
              uid: su.uid,
              points: su.points || 0
            };
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
      }
    };
    console.log('✅ login overridden');
  }, 200);
})();

// ═══ 8. Override openContent (offline reading) ═══
(function(){
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if(tries > 60){ clearInterval(timer); return; }
    if(typeof window.openContent !== 'function') return;
    clearInterval(timer);
    
    var orig = window.openContent;
    window.openContent = async function(type, num, name){
      var offline = window.getOfflineLessons();
      
      if(offline && !navigator.onLine){
        try {
          var filtered = offline.filter(function(l){
            return l.subject === window.currentSubject &&
                   l.term === num &&
                   l.type === type &&
                   l.grade === window.currentGrade;
          });
          
          if(filtered.length > 0){
            var titles = {lessons:'📄 الدروس', exercises:'✏️ تدريبات', exams:'📝 امتحانات', videos:'🎥 فيديوهات'};
            document.getElementById('contentTitle').textContent = titles[type] || 'المحتوى';
            document.getElementById('contentHeaderTitle').textContent = (window.currentSubject||'') + ' - ' + name;
            document.getElementById('contentHeaderSub').textContent = titles[type] + ' (offline)';
            
            var l = document.getElementById('contentList');
            var sorted = filtered.sort(function(a,b){ return (a.order||99) - (b.order||99); });
            var html = '';
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

// ═══ 9. إرسال صور في الدردشة ═══
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
    
    var msg = {
      senderId: window.currentUser.uid,
      senderName: window.currentUser.name,
      text: '',
      type: 'image',
      mediaUrl: url,
      createdAt: new Date().toISOString()
    };
    
    var fs = firebase.firestore();
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

// ═══ 10. إرسال صوت ═══
window.sendVoiceMessage = async function(input){
  if(!input || !input.files || !input.files[0]) return;
  if(!window.currentUser || !window.currentChatId) return;
  
  var file = input.files[0];
  if(file.size > 5 * 1024 * 1024){
    if(typeof showToast === 'function') showToast('⚠️ التسجيل كبير (أقصى 5 MB)');
    input.value = '';
    return;
  }
  
  if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
  
  try {
    var url = await window.uploadFile(file, 'chat/voices');
    if(!url){ input.value = ''; return; }
    
    var msg = {
      senderId: window.currentUser.uid,
      senderName: window.currentUser.name,
      text: '',
      type: 'voice',
      mediaUrl: url,
      createdAt: new Date().toISOString()
    };
    
    var fs = firebase.firestore();
    if(window.currentChatId === 'public_chat'){
      await fs.collection('public_chat').add(msg);
    } else {
      await fs.collection('messages').doc(window.currentChatId).collection('msgs').add(msg);
      await fs.collection('messages').doc(window.currentChatId).update({
        text: '🎤 تسجيل صوتي',
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

// ═══ 11. إرسال فيديو ═══
window.sendVideoMessage = async function(input){
  if(!input || !input.files || !input.files[0]) return;
  if(!window.currentUser || !window.currentChatId) return;
  
  var file = input.files[0];
  if(file.size > 20 * 1024 * 1024){
    if(typeof showToast === 'function') showToast('⚠️ الفيديو كبير (أقصى 20 MB)');
    input.value = '';
    return;
  }
  
  if(typeof showToast === 'function') showToast('⏳ جاري رفع الفيديو...');
  
  try {
    var url = await window.uploadFile(file, 'chat/videos');
    if(!url){ input.value = ''; return; }
    
    var msg = {
      senderId: window.currentUser.uid,
      senderName: window.currentUser.name,
      text: '',
      type: 'video',
      mediaUrl: url,
      createdAt: new Date().toISOString()
    };
    
    var fs = firebase.firestore();
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

// ═══ 12. حذف رسالة في الجماعية ═══
window.deletePublicMsgById = async function(msgId){
  if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
  if(!confirm('حذف الرسالة؟')) return;
  try {
    await firebase.firestore().collection('public_chat').doc(msgId).delete();
    if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    if(typeof window.openPublicChat === 'function') window.openPublicChat();
  } catch(e){ console.error(e); }
};

// ═══ 13. حذف رسالة في الفردية ═══
window.deletePrivateMsgById = async function(msgId){
  if(!window.currentChatId || window.currentChatId === 'public_chat') return;
  if(!confirm('حذف الرسالة؟')) return;
  try {
    await firebase.firestore().collection('messages').doc(window.currentChatId).collection('msgs').doc(msgId).delete();
    if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    if(typeof window.openChat === 'function') window.openChat(window.currentChatId, window.currentChatWith.id, window.currentChatWith.name);
  } catch(e){ console.error(e); }
};

// ═══ 14. Override openPublicChat + openChat (زر الحذف + الوسائط) ═══
(function(){
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if(tries > 60){ clearInterval(timer); return; }
    if(typeof window.openPublicChat !== 'function') return;
    clearInterval(timer);
    
    var origPublic = window.openPublicChat;
    var origPrivate = window.openChat;
    
    // override openPublicChat
    window.openPublicChat = function(){
      if(!window.currentUser){ if(typeof showToast === 'function') showToast('⚠️ سجل دخول'); return; }
      window.currentChatId = 'public_chat';
      window.currentChatWith = { id: 'public', name: 'الدردشة الجماعية' };
      var title = document.getElementById('chatTitle');
      if(title) title.textContent = '👥 الدردشة الجماعية';
      var c = document.getElementById('chatMessages');
      if(c) c.innerHTML = '<p style="text-align:center;color:#999;">⏳ جاري التحميل...</p>';
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
            html += '<div style="font-size:11px;font-weight:bold;color:' + (mine ? '#A5D6A7' : '#2E7D32') + ';margin-bottom:4px;">' + (mine ? 'أنا' : m.senderName) + '</div>';
            
            if(m.type === 'image'){
              html += '<img src="' + m.mediaUrl + '" style="max-width:220px;border-radius:10px;" onclick="window.open(this.src)">';
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
    
    // override openChat (الفردية)
    if(typeof origPrivate === 'function'){
      window.openChat = function(chatId, withId, withName){
        window.currentChatId = chatId;
        window.currentChatWith = { id: withId, name: withName };
        var title = document.getElementById('chatTitle');
        if(title) title.textContent = withName;
        var c = document.getElementById('chatMessages');
        if(c) c.innerHTML = '<p style="text-align:center;color:#999;">⏳</p>';
        if(window.screenHistory) window.screenHistory.push(window.currentScreen);
        if(typeof showScreen === 'function') showScreen('chatScreen');
        
        if(window.chatUnsubscribe){ try{ window.chatUnsubscribe(); }catch(e){} }
        window.chatUnsubscribe = firebase.firestore()
          .collection('messages').doc(chatId).collection('msgs').orderBy('createdAt','asc')
          .onSnapshot(function(snap){
            var c2 = document.getElementById('chatMessages');
            if(!c2) return;
            if(snap.empty){
              c2.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">لا توجد رسائل — ابدأ المحادثة</p>';
              return;
            }
            var html = '';
            snap.forEach(function(doc){
              var m = doc.data();
              var mine = m.senderId === window.currentUser.uid;
              var canDel = !mine && (window.currentRole === 'owner' || window.currentRole === 'teacher');
              html += '<div class="chat-bubble ' + (mine ? 'mine' : 'other') + '" style="position:relative;">';
              if(canDel){
                html += '<button onclick="deletePrivateMsgById(\'' + doc.id + '\')" style="position:absolute;top:5px;left:5px;background:#E53935;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;z-index:10;">✕</button>';
              }
              if(m.type === 'image'){
                html += '<img src="' + m.mediaUrl + '" style="max-width:220px;border-radius:10px;" onclick="window.open(this.src)">';
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
    }
    
    console.log('✅ chat overridden');
  }, 200);
})();

// ═══ 15. إضافة أزرار الوسائط في شريط الدردشة ═══
window.addEventListener('load', function(){
  setInterval(function(){
    var chatScreen = document.getElementById('chatScreen');
    if(!chatScreen) return;
    var inputBar = chatScreen.querySelector('.chat-input-bar');
    if(!inputBar || inputBar.querySelector('#mediaBar')) return;
    
    var bar = document.createElement('div');
    bar.id = 'mediaBar';
    bar.style.cssText = 'display:flex;gap:4px;margin-right:8px;';
    bar.innerHTML = 
      '<label style="cursor:pointer;font-size:20px;padding:8px;background:#F0F0F0;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;"><span>🖼️</span><input type="file" accept="image/*" style="display:none;" onchange="window.sendImageMessage(this)"></label>' +
      '<label style="cursor:pointer;font-size:20px;padding:8px;background:#F0F0F0;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;"><span>🎤</span><input type="file" accept="audio/*" style="display:none;" onchange="window.sendVoiceMessage(this)"></label>' +
      '<label style="cursor:pointer;font-size:20px;padding:8px;background:#F0F0F0;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;"><span>🎥</span><input type="file" accept="video/*" style="display:none;" onchange="window.sendVideoMessage(this)"></label>';
    
    inputBar.insertBefore(bar, inputBar.firstChild);
  }, 2000);
});
// ═══ صفحة مميزات المنصة ═══
window.addEventListener('load', function(){
  setTimeout(function(){
    var home = document.getElementById('homeScreen');
    if(!home || document.getElementById('featuresBtn')) return;
    var content = home.querySelector('.content');
    if(!content) return;
    var btn = document.createElement('div');
    btn.id = 'featuresBtn';
    btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#7B1FA2,#9C27B0);color:#fff;border-radius:16px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(123,31,162,.3);font-weight:bold;';
    btn.innerHTML = '<div style="font-size:28px;">🌟</div><div style="margin-top:8px;font-size:15px;">كل مميزات المنصة</div><div style="font-size:12px;opacity:.9;margin-top:4px;">اضغط للاستكشاف</div>';
    btn.onclick = window.showFeatures;
    content.insertBefore(btn, content.firstChild.nextSibling);
  }, 2500);
});

window.showFeatures = function(){
  var features = [
    {icon:'📚', title:'المناهج الشاملة', desc:'تعليم عام (ابتدائي - إعدادي - ثانوي) + الأزهر الشريف + البكالوريا الجديدة'},
    {icon:'🎓', title:'نظام البكالوريا', desc:'4 مسارات (طب، هندسة، أعمال، آداب) + 600 درجة + مواد متقدمة'},
    {icon:'📖', title:'القرآن الكريم', desc:'114 سورة كاملة + 6 شيوخ (العفاسي، عبد الباسط، الحصري، المنشاوي، السديس، المعيقلي) + تفسير ميسر'},
    {icon:'🎯', title:'دروس ومحتوى', desc:'شرح مبسط + شرح متقدم + أمثلة محلولة خطوة بخطوة'},
    {icon:'✏️', title:'تدريبات وامتحانات', desc:'أسئلة متنوعة + امتحانات بنماذج إجابة + تصحيح'},
    {icon:'💬', title:'الدردشة الذكية', desc:'دردشة جماعية + فردية + إرسال صور + رسائل صوتية + فيديوهات'},
    {icon:'🏆', title:'نظام النقاط والشارات', desc:'نقاط لكل درس + 7 شارات (مبتدئ → أسطورة) + لوحة شرف'},
    {icon:'📥', title:'العمل بدون إنترنت', desc:'حمّل المنصة كاملة مرة واحدة + اشتغل offline + مزامنة تلقائية لما النت يرجع'},
    {icon:'🎨', title:'أدوات الرسم', desc:'لوحة رسم كاملة + ألوان + أحجام + حفظ + مشاركة'},
    {icon:'🧮', title:'آلة حاسبة علمية', desc:'حاسبة متقدمة (sin, cos, tan, log, ln, √, x², !, π)'},
    {icon:'📻', title:'الراديو الإسلامي', desc:'5 إذاعات مباشرة + محطتك الخاصة'},
    {icon:'🌙', title:'وضع ليلي', desc:'تصميم مريح للعين + تبديل سريع بين الوضعين'},
    {icon:'👨‍🏫', title:'لوحة المالك', desc:'إدارة كاملة للمنصة + إضافة دروس + إعلانات + نسخ احتياطي'},
    {icon:'🌐', title:'متعدد الأجهزة', desc:'يشتغل على الموبايل + التابلت + الكمبيوتر + PWA + APK'}
  ];
  
  var h = '<div style="padding:20px;">';
  h += '<div style="text-align:center;margin-bottom:24px;">';
  h += '<div style="font-size:64px;">🌟</div>';
  h += '<div style="font-size:22px;font-weight:bold;color:#7B1FA2;margin-top:8px;">مميزات منصة الأستاذ حافظ</div>';
  h += '<div style="font-size:13px;color:#999;margin-top:6px;">كل اللي تحتاجه في مكان واحد</div>';
  h += '</div>';
  
  features.forEach(function(f){
    h += '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start;box-shadow:0 2px 8px rgba(0,0,0,.06);">';
    h += '<div style="font-size:32px;flex-shrink:0;">' + f.icon + '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-weight:bold;color:#2E7D32;margin-bottom:4px;font-size:15px;">' + f.title + '</div>';
    h += '<div style="font-size:13px;color:#666;line-height:1.6;">' + f.desc + '</div>';
    h += '</div></div>';
  });
  
  h += '<div style="text-align:center;margin-top:24px;padding:16px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border-radius:14px;">';
  h += '<div style="font-size:16px;font-weight:bold;">منصة الأستاذ حافظ التعليمية</div>';
  h += '<div style="font-size:12px;opacity:.9;margin-top:6px;">للتعليم العام • الأزهر • البكالوريا</div>';
  h += '</div></div>';
  
  var m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;';
  m.innerHTML = '<div style="background:#FFFEF7;border-radius:22px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;position:relative;">' +
    '<button onclick="this.parentElement.parentElement.remove()" style="position:sticky;top:12px;float:left;margin:12px;background:#E53935;color:#fff;border:none;border-radius:50%;width:38px;height:38px;font-size:20px;cursor:pointer;z-index:10;">✕</button>' +
    h +
    '</div>';
  document.body.appendChild(m);
};
// ═══ زرار "حمّل كتطبيق" (PWA) ═══
(function(){
  var deferredPrompt = null;
  
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    console.log('✅ PWA install prompt available');
  });
  
  window.addEventListener('load', function(){
    setTimeout(function(){
      var home = document.getElementById('homeScreen');
      if(!home || document.getElementById('installAppBtn')) return;
      var content = home.querySelector('.content');
      if(!content) return;
      
      var btn = document.createElement('div');
      btn.id = 'installAppBtn';
      btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#00897B,#00695C);color:#fff;border-radius:16px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,137,123,.3);font-weight:bold;';
      btn.innerHTML = '<div style="font-size:28px;">📱</div><div style="margin-top:8px;font-size:15px;">حمّل المنصة كتطبيق</div><div style="font-size:12px;opacity:.9;margin-top:4px;">يعمل بدون إنترنت</div>';
      
      btn.onclick = async function(){
        if(deferredPrompt){
          deferredPrompt.prompt();
          var result = await deferredPrompt.userChoice;
          if(result.outcome === 'accepted'){
            if(typeof showToast === 'function') showToast('✅ تم تثبيت التطبيق');
          } else {
            if(typeof showToast === 'function') showToast('❌ تم إلغاء التثبيت');
          }
          deferredPrompt = null;
        } else {
          // لو المتصفح مش بيدعم التلقائي — نعرض تعليمات
          var ua = navigator.userAgent.toLowerCase();
          var msg = '';
          if(ua.indexOf('android') > -1 && ua.indexOf('chrome') > -1){
            msg = '📱 على Chrome:\n\n1. اضغط النقاط الثلاثة (⋮)\n2. اختار "إضافة إلى الشاشة الرئيسية"\n3. اضغط "إضافة"\n\n✅ هيتثبت كتطبيق!';
          } else if(ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1){
            msg = '📱 على Safari:\n\n1. اضغط زر المشاركة (⬆️)\n2. اختار "إضافة إلى الشاشة الرئيسية"\n3. اضغط "إضافة"\n\n✅ هيتثبت كتطبيق!';
          } else {
            msg = '📱 لتثبيت التطبيق:\n\n• Chrome: القائمة (⋮) → "تثبيت المنصة"\n• Edge: القائمة (...) → "تطبيقات" → "تثبيت هذا الموقع كتطبيق"\n\n✅ هيتثبت كتطبيق مستقل!';
          }
          alert(msg);
        }
      };
      
      // حط الزرار بعد زرار التحميل
      var downloadBtn = document.getElementById('offlineBtn');
      if(downloadBtn && downloadBtn.nextSibling){
        content.insertBefore(btn, downloadBtn.nextSibling);
      } else {
        content.appendChild(btn);
      }
    }, 3000);
  });
})();
// ═══ قسم الأخبار والمقالات ═══
(function(){
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(!document.getElementById('postsScreen')){
        var s1 = document.createElement('div');
        s1.id = 'postsScreen';
        s1.className = 'screen';
        s1.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>📰 الأخبار والمقالات</span></div><button class="icon-btn" id="addPostBtn" onclick="openAddPost()" style="display:none;">➕</button></div><div class="content"><div id="postsList"></div></div>';
        document.body.appendChild(s1);
      }
      if(!document.getElementById('postDetailsScreen')){
        var s2 = document.createElement('div');
        s2.id = 'postDetailsScreen';
        s2.className = 'screen';
        s2.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span id="postTitle">المقال</span></div><div style="width:42px;"></div></div><div class="content" id="postContent" style="padding-bottom:100px;"></div><div class="chat-input-bar" style="display:flex;gap:6px;padding:8px;background:#fff;"><input type="text" id="commentInput" placeholder="اكتب تعليقك..." style="flex:1;padding:12px 16px;background:#f1f1f1;border:none;border-radius:25px;font-family:inherit;font-size:15px;outline:none;"><button onclick="sendComment()" style="background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;width:46px;height:46px;border-radius:50%;font-size:20px;cursor:pointer;">📤</button></div>';
        document.body.appendChild(s2);
      }
      if(!document.getElementById('addPostScreen')){
        var s3 = document.createElement('div');
        s3.id = 'addPostScreen';
        s3.className = 'screen';
        s3.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>➕ نشر جديد</span></div><div style="width:42px;"></div></div><div class="content"><div class="form-group"><label class="form-label">العنوان</label><input type="text" class="form-input" id="newPostTitle"></div><div class="form-group"><label class="form-label">المحتوى</label><textarea class="form-input" id="newPostContent" rows="8"></textarea></div><div class="form-group"><label class="form-label">📷 صورة (اختياري)</label><input type="file" class="form-input" id="newPostImage" accept="image/*" style="padding:10px;"></div><div class="form-group"><label class="form-label">🎥 فيديو (اختياري)</label><input type="file" class="form-input" id="newPostVideo" accept="video/*" style="padding:10px;"></div><button class="btn-primary" id="publishPostBtn" onclick="publishPost()">📤 نشر</button></div>';
        document.body.appendChild(s3);
      }
      var home = document.getElementById('homeScreen');
      if(home && !document.getElementById('postsBtn')){
        var content = home.querySelector('.content');
        if(content){
          var btn = document.createElement('div');
          btn.id = 'postsBtn';
          btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#C2185B,#E91E63);color:#fff;border-radius:16px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(194,24,91,.3);font-weight:bold;';
          btn.innerHTML = '<div style="font-size:28px;">📰</div><div style="margin-top:8px;font-size:15px;">الأخبار والمقالات</div><div style="font-size:12px;opacity:.9;margin-top:4px;">اقرأ وشارك</div>';
          btn.onclick = function(){ window.openPosts(); };
          content.insertBefore(btn, content.firstChild);
        }
      }
    }, 3500);
  });

  window.openPosts = async function(){
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('postsScreen');
    var addBtn = document.getElementById('addPostBtn');
    if(addBtn) addBtn.style.display = (window.currentRole === 'owner' || window.currentRole === 'teacher') ? 'flex' : 'none';
    var l = document.getElementById('postsList');
    l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
    try {
      var snap = await firebase.firestore().collection('posts').orderBy('created_at','desc').limit(50).get();
      if(snap.empty){ l.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📰</div><p>لا توجد منشورات بعد</p></div>'; return; }
      var html = '';
      snap.forEach(function(doc){
        var p = doc.data();
        var preview = (p.content||'').substring(0,100) + '...';
        html += '<div class="content-item" onclick="openPostDetails(\'' + doc.id + '\')" style="display:block;">';
        if(p.image_url) html += '<img src="' + p.image_url + '" style="width:100%;height:150px;object-fit:cover;border-radius:10px;margin-bottom:10px;">';
        html += '<div style="font-weight:bold;color:#C2185B;margin-bottom:6px;">' + (p.title||'بدون عنوان') + '</div>';
        html += '<div style="font-size:13px;color:#666;line-height:1.6;">' + preview + '</div>';
        html += '<div style="font-size:11px;color:#999;margin-top:8px;">👤 ' + (p.author_name||'المالك') + ' • 📅 ' + new Date(p.created_at).toLocaleDateString('ar-EG') + '</div>';
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); l.innerHTML = '<div class="empty-state">⚠️ فشل التحميل</div>'; }
  };

  window.openPostDetails = async function(postId){
    window.currentPostId = postId;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('postDetailsScreen');
    var c = document.getElementById('postContent');
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    try {
      var doc = await firebase.firestore().collection('posts').doc(postId).get();
      if(!doc.exists){ c.innerHTML = '<p>⚠️ المنشور مش موجود</p>'; return; }
      var p = doc.data();
      document.getElementById('postTitle').textContent = p.title || 'المقال';
      var html = '<div class="lesson-body">';
      html += '<h2 style="color:#C2185B;margin-bottom:12px;">' + (p.title||'') + '</h2>';
      html += '<div style="font-size:12px;color:#999;margin-bottom:16px;">👤 ' + (p.author_name||'') + ' • 📅 ' + new Date(p.created_at).toLocaleDateString('ar-EG') + '</div>';
      if(p.image_url) html += '<img src="' + p.image_url + '" style="width:100%;border-radius:12px;margin-bottom:16px;">';
      html += '<div style="line-height:2;white-space:pre-wrap;font-size:15px;">' + (p.content||'') + '</div>';
      if(p.video_url) html += '<video controls src="' + p.video_url + '" style="width:100%;border-radius:12px;margin-top:16px;"></video>';
      if(window.currentRole === 'owner') html += '<button onclick="deletePost(\'' + postId + '\')" style="margin-top:16px;padding:10px 16px;background:#FFEBEE;color:#E53935;border:none;border-radius:10px;font-weight:bold;cursor:pointer;">🗑️ حذف المنشور</button>';
      html += '</div>';
      html += '<div style="margin-top:24px;"><div style="font-weight:bold;color:#C2185B;margin-bottom:12px;">💬 التعليقات</div><div id="commentsList"></div></div>';
      c.innerHTML = html;
      loadComments(postId);
    } catch(e){ console.error(e); c.innerHTML = '<p>⚠️ فشل</p>'; }
  };

  window.loadComments = async function(postId){
    var l = document.getElementById('commentsList');
    if(!l) return;
    try {
      var snap = await firebase.firestore().collection('posts').doc(postId).collection('comments').orderBy('created_at','asc').get();
      if(snap.empty){ l.innerHTML = '<p style="text-align:center;color:#999;padding:12px;">لا توجد تعليقات — كن أول من يعلق</p>'; return; }
      var html = '';
      snap.forEach(function(doc){
        var m = doc.data();
        var mine = m.senderId === window.currentUser.uid;
        var canDel = window.currentRole === 'owner';
        html += '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 2px 6px rgba(0,0,0,.05);">';
        html += '<div style="font-weight:bold;color:#2E7D32;font-size:13px;margin-bottom:6px;">' + (mine?'أنا':m.senderName||'مستخدم');
        if(canDel) html += ' <button onclick="deleteComment(\'' + postId + '\',\'' + doc.id + '\')" style="float:left;background:#E53935;color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:10px;cursor:pointer;">✕</button>';
        html += '</div>';
        html += '<div style="font-size:14px;line-height:1.6;word-wrap:break-word;">' + m.text + '</div>';
        html += '<div style="font-size:10px;color:#999;margin-top:6px;">' + new Date(m.created_at).toLocaleString('ar-EG') + '</div>';
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); }
  };

  window.sendComment = async function(){
    var inp = document.getElementById('commentInput');
    if(!inp || !inp.value.trim() || !window.currentPostId || !window.currentUser) return;
    try {
      await firebase.firestore().collection('posts').doc(window.currentPostId).collection('comments').add({
        senderId: window.currentUser.uid,
        senderName: window.currentUser.name,
        text: inp.value.trim(),
        created_at: new Date().toISOString()
      });
      inp.value = '';
      window.loadComments(window.currentPostId);
      if(typeof showToast === 'function') showToast('✅ تم التعليق');
    } catch(e){ console.error(e); if(typeof showToast === 'function') showToast('❌ فشل'); }
  };

  window.deleteComment = async function(postId, commentId){
    if(window.currentRole !== 'owner') return;
    if(!confirm('حذف التعليق؟')) return;
    try {
      await firebase.firestore().collection('posts').doc(postId).collection('comments').doc(commentId).delete();
      window.loadComments(postId);
      if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
    } catch(e){ console.error(e); }
  };

  window.openAddPost = function(){
    if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('addPostScreen');
  };

  window.publishPost = async function(){
    var t = document.getElementById('newPostTitle').value.trim();
    var c = document.getElementById('newPostContent').value.trim();
    var img = document.getElementById('newPostImage').files[0];
    var vid = document.getElementById('newPostVideo').files[0];
    var btn = document.getElementById('publishPostBtn');
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
      document.getElementById('newPostTitle').value = '';
      document.getElementById('newPostContent').value = '';
      if(btn){ btn.disabled = false; btn.textContent = '📤 نشر'; }
      setTimeout(function(){ window.openPosts(); }, 800);
    } catch(e){
      console.error(e);
      if(btn){ btn.disabled = false; btn.textContent = '📤 نشر'; }
      if(typeof showToast === 'function') showToast('❌ فشل');
    }
  };

  window.deletePost = async function(postId){
    if(window.currentRole !== 'owner') return;
    if(!confirm('حذف المنشور وكل تعليقاته؟')) return;
    try {
      var fs = firebase.firestore();
      var cmt = await fs.collection('posts').doc(postId).collection('comments').get();
      var batch = fs.batch();
      cmt.forEach(function(d){ batch.delete(d.ref); });
      await batch.commit();
      await fs.collection('posts').doc(postId).delete();
      if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
      window.openPosts();
    } catch(e){ console.error(e); }
  };
})();
console.log('✅ extras.js loaded');
