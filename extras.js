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
// ═══ الملف الشخصي الكامل ═══
(function(){
  window.addEventListener('load', function(){
    setTimeout(function(){
      // شاشة تعديل الملف
      if(!document.getElementById('editProfileScreen')){
        var s = document.createElement('div');
        s.id = 'editProfileScreen';
        s.className = 'screen';
        s.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>✏️ تعديل الملف الشخصي</span></div><div style="width:42px;"></div></div><div class="content">' +
          '<div style="text-align:center;margin-bottom:20px;position:relative;">' +
          '<img id="editProfileImg" src="" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid #2E7D32;box-shadow:0 4px 12px rgba(0,0,0,.15);background:#fff;">' +
          '<label for="editProfileImgInput" style="position:absolute;bottom:5px;left:50%;transform:translateX(-50%) translateX(40px);background:#2E7D32;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;border:3px solid #fff;">📷</label>' +
          '<input type="file" id="editProfileImgInput" accept="image/*" style="display:none;" onchange="uploadProfilePic(this)">' +
          '</div>' +
          '<div class="form-group"><label class="form-label">الاسم</label><input type="text" class="form-input" id="editProfileName"></div>' +
          '<div class="form-group"><label class="form-label">نبذة عنك</label><textarea class="form-input" id="editProfileBio" rows="3" placeholder="اكتب نبذة قصيرة عنك..."></textarea></div>' +
          '<div class="form-group"><label class="form-label">الصف/المرحلة</label><input type="text" class="form-input" id="editProfileGrade" placeholder="مثال: الثالث الثانوي"></div>' +
          '<div class="form-group"><label class="form-label">المادة (للمعلم)</label><input type="text" class="form-input" id="editProfileSubject" placeholder="مثال: رياضيات"></div>' +
          '<button class="btn-primary" id="saveProfileBtn" onclick="saveProfile()">💾 حفظ التعديلات</button>' +
          '<button class="btn-primary" onclick="previewMyProfile()" style="margin-top:10px;background:linear-gradient(135deg,#1976D2,#0D47A1);">👁️ معاينة ملفي</button>' +
          '</div>';
        document.body.appendChild(s);
      }
      
      // شاشة معاينة الملف
      if(!document.getElementById('myProfileScreen')){
        var s2 = document.createElement('div');
        s2.id = 'myProfileScreen';
        s2.className = 'screen';
        s2.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>👤 ملفي الشخصي</span></div><div style="width:42px;"></div></div><div class="content" id="myProfileContent"></div>';
        document.body.appendChild(s2);
      }
      
      // زرار "تعديل الملف" في شاشة الحساب
      var profileScreen = document.getElementById('profileScreen');
      if(profileScreen && !document.getElementById('editProfileMenuBtn')){
        var content = profileScreen.querySelector('.content');
        if(content){
          var menuBtn = document.createElement('div');
          menuBtn.id = 'editProfileMenuBtn';
          menuBtn.className = 'menu-item';
          menuBtn.innerHTML = '<span style="font-size:26px;">✏️</span><span style="flex:1;font-weight:700;">تعديل الملف الشخصي</span><span style="color:#999;font-size:24px;">‹</span>';
          menuBtn.onclick = function(){ window.openEditProfile(); };
          content.insertBefore(menuBtn, content.firstChild);
        }
      }
    }, 3500);
  });
  
  window.openEditProfile = async function(){
    if(!window.currentUser) return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('editProfileScreen');
    
    document.getElementById('editProfileName').value = window.currentUser.name || '';
    document.getElementById('editProfileImg').src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(window.currentUser.name || 'مستخدم') + '&background=2E7D32&color=fff&size=200';
    
    try {
      var doc = await firebase.firestore().collection('users').doc(window.currentUser.uid).get();
      if(doc.exists){
        var u = doc.data();
        if(u.photo_url) document.getElementById('editProfileImg').src = u.photo_url;
        if(u.bio) document.getElementById('editProfileBio').value = u.bio;
        if(u.grade) document.getElementById('editProfileGrade').value = u.grade;
        if(u.subject) document.getElementById('editProfileSubject').value = u.subject;
      }
    } catch(e){ console.error(e); }
  };
  
  window.uploadProfilePic = async function(input){
    if(!input.files || !input.files[0] || !window.currentUser) return;
    var file = input.files[0];
    if(file.size > 2 * 1024 * 1024){
      if(typeof showToast === 'function') showToast('⚠️ الصورة كبيرة (أقصى 2 MB)');
      return;
    }
    if(typeof showToast === 'function') showToast('⏳ جاري الرفع...');
    try {
      var url = await window.uploadFile(file, 'users/avatars');
      if(url){
        document.getElementById('editProfileImg').src = url;
        await firebase.firestore().collection('users').doc(window.currentUser.uid).update({photo_url: url});
        window.currentUser.photo_url = url;
        if(typeof showToast === 'function') showToast('✅ تم تحديث الصورة');
      }
    } catch(e){ console.error(e); if(typeof showToast === 'function') showToast('❌ فشل الرفع'); }
    input.value = '';
  };
  
  window.saveProfile = async function(){
    if(!window.currentUser) return;
    var name = document.getElementById('editProfileName').value.trim();
    var bio = document.getElementById('editProfileBio').value.trim();
    var grade = document.getElementById('editProfileGrade').value.trim();
    var subject = document.getElementById('editProfileSubject').value.trim();
    if(!name){ if(typeof showToast === 'function') showToast('⚠️ أدخل الاسم'); return; }
    var btn = document.getElementById('saveProfileBtn');
    if(btn){ btn.disabled = true; btn.textContent = '⏳ جاري الحفظ...'; }
    try {
      await firebase.firestore().collection('users').doc(window.currentUser.uid).update({
        name: name, bio: bio, grade: grade, subject: subject,
        updatedAt: new Date().toISOString()
      });
      window.currentUser.name = name;
      var pn = document.getElementById('profileName');
      if(pn) pn.textContent = name;
      if(typeof showToast === 'function') showToast('✅ تم الحفظ');
      if(btn){ btn.disabled = false; btn.textContent = '💾 حفظ التعديلات'; }
    } catch(e){
      console.error(e);
      if(btn){ btn.disabled = false; btn.textContent = '💾 حفظ التعديلات'; }
      if(typeof showToast === 'function') showToast('❌ فشل');
    }
  };
  
  window.previewMyProfile = async function(){
    if(!window.currentUser) return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('myProfileScreen');
    var c = document.getElementById('myProfileContent');
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    try {
      var doc = await firebase.firestore().collection('users').doc(window.currentUser.uid).get();
      var u = doc.exists ? doc.data() : {};
      var img = u.photo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.name || 'مستخدم') + '&background=2E7D32&color=fff&size=200';
      var pts = u.points || 0;
      var badge = window.getCurrentBadge ? window.getCurrentBadge(pts) : {icon:'🌱', name:'مبتدئ'};
      var roleName = u.role === 'owner' ? 'المالك' : u.role === 'teacher' ? 'معلم' : 'طالب';
      
      var h = '<div style="text-align:center;padding:20px;">';
      h += '<img src="' + img + '" style="width:130px;height:130px;border-radius:50%;object-fit:cover;border:5px solid #2E7D32;box-shadow:0 6px 20px rgba(0,0,0,.15);">';
      h += '<div style="font-size:24px;font-weight:bold;margin-top:16px;color:#2E7D32;">' + (u.name || 'مستخدم') + '</div>';
      h += '<div style="display:inline-block;background:#E8F5E9;color:#2E7D32;padding:4px 14px;border-radius:14px;font-size:12px;font-weight:bold;margin-top:8px;">' + roleName + '</div>';
      if(u.bio) h += '<div style="margin-top:16px;font-size:14px;color:#666;line-height:1.7;">' + u.bio + '</div>';
      h += '<div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">';
      h += '<div style="background:#FFF8E1;padding:14px 20px;border-radius:14px;text-align:center;min-width:100px;"><div style="font-size:24px;">' + badge.icon + '</div><div style="font-size:12px;color:#666;margin-top:4px;">' + badge.name + '</div></div>';
      h += '<div style="background:#E8F5E9;padding:14px 20px;border-radius:14px;text-align:center;min-width:100px;"><div style="font-size:24px;">⭐</div><div style="font-size:18px;font-weight:bold;color:#2E7D32;">' + pts + '</div><div style="font-size:12px;color:#666;margin-top:4px;">نقطة</div></div>';
      h += '</div>';
      if(u.grade) h += '<div style="margin-top:20px;background:#F5F5F5;padding:12px;border-radius:12px;font-size:14px;">📚 <b>الصف:</b> ' + u.grade + '</div>';
      if(u.subject) h += '<div style="margin-top:8px;background:#F5F5F5;padding:12px;border-radius:12px;font-size:14px;">📖 <b>المادة:</b> ' + u.subject + '</div>';
      if(u.createdAt) h += '<div style="margin-top:8px;background:#F5F5F5;padding:12px;border-radius:12px;font-size:14px;">📅 <b>تاريخ الانضمام:</b> ' + new Date(u.createdAt).toLocaleDateString('ar-EG') + '</div>';
      h += '</div>';
      
      c.innerHTML = h;
    } catch(e){ console.error(e); c.innerHTML = '<p>⚠️ فشل التحميل</p>'; }
  };
  
  console.log('✅ Profile system loaded');
})();
// ═══ المفضلة والملاحظات ═══
(function(){
  window.addEventListener('load', function(){
    setTimeout(function(){
      // شاشة المفضلة
      if(!document.getElementById('favoritesScreen')){
        var s1 = document.createElement('div');
        s1.id = 'favoritesScreen';
        s1.className = 'screen';
        s1.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>⭐ المفضلة</span></div><div style="width:42px;"></div></div><div class="content"><div id="favoritesList"></div></div>';
        document.body.appendChild(s1);
      }
      // شاشة الملاحظات
      if(!document.getElementById('notesScreen')){
        var s2 = document.createElement('div');
        s2.id = 'notesScreen';
        s2.className = 'screen';
        s2.innerHTML = '<div class="top-bar"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>📝 ملاحظاتي</span></div><div style="width:42px;"></div></div><div class="content"><div class="form-group"><textarea class="form-input" id="newNoteText" rows="3" placeholder="اكتب ملاحظة جديدة..."></textarea></div><button class="btn-primary" onclick="addNote()" style="margin-bottom:16px;">➕ إضافة ملاحظة</button><div id="notesList"></div></div>';
        document.body.appendChild(s2);
      }
      
      // إضافة زرارين في شاشة الحساب
      var profileScreen = document.getElementById('profileScreen');
      if(profileScreen && !document.getElementById('favMenuBtn')){
        var content = profileScreen.querySelector('.content');
        if(content){
          var favBtn = document.createElement('div');
          favBtn.id = 'favMenuBtn';
          favBtn.className = 'menu-item';
          favBtn.innerHTML = '<span style="font-size:26px;">⭐</span><span style="flex:1;font-weight:700;">المفضلة</span><span style="color:#999;font-size:24px;">‹</span>';
          favBtn.onclick = function(){ window.openFavorites(); };
          content.insertBefore(favBtn, content.firstChild);
          
          var noteBtn = document.createElement('div');
          noteBtn.id = 'notesMenuBtn';
          noteBtn.className = 'menu-item';
          noteBtn.innerHTML = '<span style="font-size:26px;">📝</span><span style="flex:1;font-weight:700;">ملاحظاتي</span><span style="color:#999;font-size:24px;">‹</span>';
          noteBtn.onclick = function(){ window.openNotes(); };
          content.insertBefore(noteBtn, favBtn.nextSibling);
        }
      }
      
      // إضافة زرار "أضف للمفضلة" في شاشة عرض الدرس
      var viewerScreen = document.getElementById('viewerScreen');
      if(viewerScreen && !document.getElementById('viewerFavBtn')){
        var topBar = viewerScreen.querySelector('.top-bar');
        if(topBar){
          var favIcon = document.createElement('button');
          favIcon.id = 'viewerFavBtn';
          favIcon.className = 'icon-btn';
          favIcon.innerHTML = '⭐';
          favIcon.title = 'أضف للمفضلة';
          favIcon.onclick = function(){ window.toggleFavorite(); };
          topBar.appendChild(favIcon);
        }
      }
      
      // إضافة زرار "أضف ملاحظة" في شاشة عرض الدرس
      var viewerBody = document.getElementById('viewerBody');
      if(viewerBody && !document.getElementById('addNoteForLessonBtn')){
        var noteBtn2 = document.createElement('button');
        noteBtn2.id = 'addNoteForLessonBtn';
        noteBtn2.style.cssText = 'margin-top:20px;padding:12px 20px;background:linear-gradient(135deg,#F9A825,#FBC02D);color:#fff;border:none;border-radius:12px;font-family:inherit;font-size:14px;font-weight:bold;cursor:pointer;width:100%;';
        noteBtn2.innerHTML = '📝 أضف ملاحظة على هذا الدرس';
        noteBtn2.onclick = window.openNotes;
        viewerBody.appendChild(noteBtn2);
      }
    }, 4000);
  });
  
  // ═══ المفضلة ═══
  window.currentLessonId = null;
  
  window.toggleFavorite = async function(){
    if(!window.currentUser) return;
    var lessonId = window.currentLessonId;
    if(!lessonId){
      // نجيب ID الدرس من عنوان الشاشة
      var title = document.getElementById('viewerTitle');
      if(title) lessonId = title.textContent;
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
    } catch(e){ console.error(e); if(typeof showToast === 'function') showToast('❌ فشل'); }
  };
  
  window.openFavorites = async function(){
    if(!window.currentUser) return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('favoritesScreen');
    var l = document.getElementById('favoritesList');
    l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    try {
      var snap = await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('favorites').orderBy('addedAt','desc').get();
      if(snap.empty){ l.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⭐</div><p>لا توجد عناصر في المفضلة</p><p style="font-size:13px;margin-top:8px;">افتح أي درس واضغط ⭐ في الأعلى</p></div>'; return; }
      var html = '';
      snap.forEach(function(doc){
        var f = doc.data();
        html += '<div class="content-item" style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<div style="flex:1;"><div class="content-item-title">' + (f.lessonTitle || f.lessonId) + '</div><div class="content-item-sub">📅 ' + new Date(f.addedAt).toLocaleDateString('ar-EG') + '</div></div>';
        html += '<button onclick="removeFavorite(\'' + doc.id + '\')" style="background:#FFEBEE;color:#E53935;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;">🗑️</button>';
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); l.innerHTML = '<p>⚠️ فشل</p>'; }
  };
  
  window.removeFavorite = async function(docId){
    if(!window.currentUser) return;
    if(!confirm('إزالة من المفضلة؟')) return;
    try {
      await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('favorites').doc(docId).delete();
      window.openFavorites();
      if(typeof showToast === 'function') showToast('🗑️ تم');
    } catch(e){ console.error(e); }
  };
  
  // ═══ الملاحظات ═══
  window.openNotes = async function(){
    if(!window.currentUser) return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('notesScreen');
    window.loadNotes();
  };
  
  window.loadNotes = async function(){
    var l = document.getElementById('notesList');
    if(!l) return;
    l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    try {
      var snap = await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('notes').orderBy('createdAt','desc').get();
      if(snap.empty){ l.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>لا توجد ملاحظات</p></div>'; return; }
      var html = '';
      snap.forEach(function(doc){
        var n = doc.data();
        html += '<div style="background:#FFF8E1;border-radius:12px;padding:14px;margin-bottom:10px;position:relative;">';
        html += '<div style="font-size:14px;line-height:1.7;white-space:pre-wrap;padding-left:30px;">' + n.text + '</div>';
        html += '<div style="font-size:11px;color:#999;margin-top:8px;">📅 ' + new Date(n.createdAt).toLocaleString('ar-EG') + '</div>';
        html += '<button onclick="deleteNote(\'' + doc.id + '\')" style="position:absolute;top:8px;left:8px;background:#E53935;color:#fff;border:none;border-radius:50%;width:24px;height:24px;font-size:12px;cursor:pointer;">✕</button>';
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); l.innerHTML = '<p>⚠️ فشل</p>'; }
  };
  
  window.addNote = async function(){
    if(!window.currentUser) return;
    var t = document.getElementById('newNoteText').value.trim();
    if(!t){ if(typeof showToast === 'function') showToast('⚠️ اكتب ملاحظة'); return; }
    try {
      await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('notes').add({
        text: t,
        createdAt: new Date().toISOString()
      });
      document.getElementById('newNoteText').value = '';
      if(typeof showToast === 'function') showToast('✅ تم الحفظ');
      window.loadNotes();
    } catch(e){ console.error(e); }
  };
  
  window.deleteNote = async function(docId){
    if(!window.currentUser) return;
    if(!confirm('حذف الملاحظة؟')) return;
    try {
      await firebase.firestore().collection('users').doc(window.currentUser.uid).collection('notes').doc(docId).delete();
      window.loadNotes();
      if(typeof showToast === 'function') showToast('🗑️ تم');
    } catch(e){ console.error(e); }
  };
  
  console.log('✅ Favorites & Notes loaded');
})();
// ═══ البث المباشر ═══
(function(){
  window.addEventListener('load', function(){
    setTimeout(function(){
      // شاشة البث الرئيسية
      if(!document.getElementById('liveScreen')){
        var s1 = document.createElement('div');
        s1.id = 'liveScreen';
        s1.className = 'screen';
        s1.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#D32F2F,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>🔴 البث المباشر</span></div><button class="icon-btn" id="addLiveBtn" onclick="openAddBroadcast()" style="display:none;">➕</button></div><div class="content"><div id="liveList"></div></div>';
        document.body.appendChild(s1);
      }
      
      // شاشة إضافة بث
      if(!document.getElementById('addLiveScreen')){
        var s2 = document.createElement('div');
        s2.id = 'addLiveScreen';
        s2.className = 'screen';
        s2.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#D32F2F,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>➕ جدولة بث</span></div><div style="width:42px;"></div></div><div class="content">' +
          '<div class="form-group"><label class="form-label">عنوان البث</label><input type="text" class="form-input" id="liveTitle" placeholder="مثال: مراجعة الوحدة الأولى"></div>' +
          '<div class="form-group"><label class="form-label">المادة</label><input type="text" class="form-input" id="liveSubject" placeholder="مثال: رياضيات"></div>' +
          '<div class="form-group"><label class="form-label">التاريخ والوقت</label><input type="datetime-local" class="form-input" id="liveDateTime"></div>' +
          '<div class="form-group"><label class="form-label">ملاحظات</label><textarea class="form-input" id="liveNotes" rows="3" placeholder="أي تفاصيل إضافية..."></textarea></div>' +
          '<button class="btn-primary" id="saveLiveBtn" onclick="saveBroadcast()" style="background:linear-gradient(135deg,#D32F2F,#E53935);">📅 جدولة البث</button>' +
          '</div>';
        document.body.appendChild(s2);
      }
      
      // شاشة تفاصيل البث
      if(!document.getElementById('liveDetailsScreen')){
        var s3 = document.createElement('div');
        s3.id = 'liveDetailsScreen';
        s3.className = 'screen';
        s3.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#D32F2F,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span id="liveDetailsTitle">البث</span></div><div style="width:42px;"></div></div><div class="content" id="liveDetailsContent"></div>';
        document.body.appendChild(s3);
      }
      
      // شاشة موافقة المالك
      if(!document.getElementById('broadcastPermScreen')){
        var s4 = document.createElement('div');
        s4.id = 'broadcastPermScreen';
        s4.className = 'screen';
        s4.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#B71C1C,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>👑 صلاحيات البث</span></div><div style="width:42px;"></div></div><div class="content"><div class="section-title">المعلمون</div><div id="broadcastPermList"></div></div>';
        document.body.appendChild(s4);
      }
      
      // زرار في الرئيسية
      var home = document.getElementById('homeScreen');
      if(home && !document.getElementById('liveBtn')){
        var content = home.querySelector('.content');
        if(content){
          var btn = document.createElement('div');
          btn.id = 'liveBtn';
          btn.style.cssText = 'margin:20px 16px;padding:18px;background:linear-gradient(135deg,#D32F2F,#E53935);color:#fff;border-radius:16px;text-align:center;cursor:pointer;box-shadow:0 4px 12px rgba(211,47,47,.3);font-weight:bold;position:relative;';
          btn.innerHTML = '<div style="font-size:28px;">🔴</div><div style="margin-top:8px;font-size:15px;">البث المباشر</div><div style="font-size:12px;opacity:.9;margin-top:4px;">حصص شرح مباشرة</div>';
          btn.onclick = function(){ window.openLive(); };
          content.insertBefore(btn, content.firstChild);
        }
      }
      
      // زرار في شاشة المالك
      var admin = document.getElementById('adminScreen');
      if(admin && !document.getElementById('permBtn')){
        var ac = admin.querySelector('.content');
        if(ac){
          var pBtn = document.createElement('div');
          pBtn.id = 'permBtn';
          pBtn.className = 'menu-item';
          pBtn.innerHTML = '<span style="font-size:26px;">🎥</span><span style="flex:1;font-weight:700;">صلاحيات البث للمعلمين</span><span style="color:#999;font-size:24px;">‹</span>';
          pBtn.onclick = function(){ window.openBroadcastPerm(); };
          ac.appendChild(pBtn);
        }
      }
    }, 4500);
  });
  
  // ═══ فتح شاشة البث ═══
  window.openLive = async function(){
    if(!window.currentUser) return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('liveScreen');
    
    var addBtn = document.getElementById('addLiveBtn');
    if(addBtn) addBtn.style.display = (window.currentRole === 'owner' || window.currentRole === 'teacher') ? 'flex' : 'none';
    
    var l = document.getElementById('liveList');
    l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    
    try {
      var fs = firebase.firestore();
      var snap = await fs.collection('broadcasts').orderBy('scheduledAt','desc').limit(30).get();
      if(snap.empty){ 
        l.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔴</div><p>لا توجد بثوث مجدولة</p>' + (window.currentRole === 'owner' || window.currentRole === 'teacher' ? '<p style="font-size:13px;margin-top:8px;">اضغط ➕ فوق لجدولة بث</p>' : '') + '</div>'; 
        return; 
      }
      var html = '';
      snap.forEach(function(doc){
        var b = doc.data();
        var dateStr = new Date(b.scheduledAt).toLocaleString('ar-EG');
        var isLive = b.status === 'live';
        var statusColor = isLive ? '#D32F2F' : (b.status === 'ended' ? '#999' : '#2E7D32');
        var statusText = isLive ? '🔴 مباشر الآن' : (b.status === 'ended' ? '⚫ انتهى' : '📅 مجدول');
        html += '<div class="content-item" onclick="openLiveDetails(\'' + doc.id + '\')" style="display:block;border-right:5px solid ' + statusColor + ';">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
        html += '<div style="font-weight:bold;color:' + statusColor + ';font-size:15px;">' + (b.title||'بث') + '</div>';
        html += '<div style="font-size:11px;color:' + statusColor + ';font-weight:bold;">' + statusText + '</div>';
        html += '</div>';
        html += '<div style="font-size:13px;color:#666;">📖 ' + (b.subject||'') + ' • 👤 ' + (b.teacherName||'') + '</div>';
        html += '<div style="font-size:12px;color:#999;margin-top:6px;">📅 ' + dateStr + '</div>';
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); l.innerHTML = '<p>⚠️ فشل</p>'; }
  };
  
  // ═══ إضافة بث جديد ═══
  window.openAddBroadcast = async function(){
    if(window.currentRole !== 'owner' && window.currentRole !== 'teacher'){
      if(typeof showToast === 'function') showToast('⚠️ غير مصرح');
      return;
    }
    if(window.currentRole === 'teacher'){
      var doc = await firebase.firestore().collection('users').doc(window.currentUser.uid).get();
      if(!doc.exists || !doc.data().canBroadcast){
        if(typeof showToast === 'function') showToast('⚠️ لم يتم الموافقة من المالك');
        return;
      }
    }
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('addLiveScreen');
  };
  
  window.saveBroadcast = async function(){
    if(!window.currentUser) return;
    var t = document.getElementById('liveTitle').value.trim();
    var s = document.getElementById('liveSubject').value.trim();
    var dt = document.getElementById('liveDateTime').value;
    var n = document.getElementById('liveNotes').value.trim();
    if(!t || !dt){ if(typeof showToast === 'function') showToast('⚠️ أدخل العنوان والوقت'); return; }
    var btn = document.getElementById('saveLiveBtn');
    if(btn){ btn.disabled = true; btn.textContent = '⏳ جاري الحفظ...'; }
    try {
      var roomId = 'hafez-' + Date.now() + '-' + Math.random().toString(36).substring(2,8);
      await firebase.firestore().collection('broadcasts').add({
        title: t,
        subject: s,
        notes: n,
        scheduledAt: new Date(dt).toISOString(),
        teacherId: window.currentUser.uid,
        teacherName: window.currentUser.name,
        status: 'scheduled',
        roomId: roomId,
        allowedStudents: [],
        pendingRequests: [],
        createdAt: new Date().toISOString()
      });
      if(typeof showToast === 'function') showToast('✅ تم الجدولة');
      if(btn){ btn.disabled = false; btn.textContent = '📅 جدولة البث'; }
      document.getElementById('liveTitle').value = '';
      document.getElementById('liveSubject').value = '';
      document.getElementById('liveNotes').value = '';
      setTimeout(function(){ window.openLive(); }, 800);
    } catch(e){
      console.error(e);
      if(btn){ btn.disabled = false; btn.textContent = '📅 جدولة البث'; }
      if(typeof showToast === 'function') showToast('❌ فشل');
    }
  };
  
  // ═══ تفاصيل البث ═══
  window.openLiveDetails = async function(id){
    window.currentLiveId = id;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('liveDetailsScreen');
    var c = document.getElementById('liveDetailsContent');
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    
    try {
      var fs = firebase.firestore();
      var doc = await fs.collection('broadcasts').doc(id).get();
      if(!doc.exists){ c.innerHTML = '<p>⚠️ البث مش موجود</p>'; return; }
      var b = doc.data();
      document.getElementById('liveDetailsTitle').textContent = b.title || 'بث';
      
      var isOwner = window.currentRole === 'owner';
      var isTeacher = b.teacherId === window.currentUser.uid;
      var canManage = isOwner || isTeacher;
      var isAllowed = (b.allowedStudents || []).indexOf(window.currentUser.uid) > -1;
      var isPending = (b.pendingRequests || []).indexOf(window.currentUser.uid) > -1;
      
      var html = '<div style="background:linear-gradient(135deg,#D32F2F,#E53935);color:#fff;padding:20px;border-radius:16px;margin-bottom:16px;">';
      html += '<div style="font-size:22px;font-weight:bold;margin-bottom:8px;">' + (b.title||'') + '</div>';
      html += '<div style="font-size:13px;opacity:.9;">📖 ' + (b.subject||'') + ' • 👤 ' + (b.teacherName||'') + '</div>';
      html += '</div>';
      
      html += '<div style="background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;">';
      html += '<div style="margin-bottom:8px;"><b>📅 الوقت:</b> ' + new Date(b.scheduledAt).toLocaleString('ar-EG') + '</div>';
      html += '<div style="margin-bottom:8px;"><b>📊 الحالة:</b> ' + (b.status === 'live' ? '🔴 مباشر' : b.status === 'ended' ? '⚫ انتهى' : '📅 مجدول') + '</div>';
      if(b.notes) html += '<div style="margin-bottom:8px;"><b>📝 ملاحظات:</b> ' + b.notes + '</div>';
      html += '</div>';
      
      // إجراءات الطالب
      if(!canManage){
        if(isAllowed){
          html += '<button class="btn-primary" onclick="joinBroadcast(\'' + b.roomId + '\')" style="background:linear-gradient(135deg,#D32F2F,#E53935);">🎥 دخول البث</button>';
        } else if(isPending){
          html += '<div style="background:#FFF8E1;padding:16px;border-radius:12px;text-align:center;color:#F9A825;font-weight:bold;">⏳ في انتظار موافقة المعلم</div>';
        } else {
          html += '<button class="btn-primary" onclick="requestJoin(\'' + id + '\')">📩 طلب الانضمام</button>';
        }
      }
      
      // إجراءات المعلم/المالك
      if(canManage){
        var liveBtn = b.status === 'scheduled' ? '🔴 ابدأ البث الآن' : (b.status === 'live' ? '🎥 دخول البث' : '⚫ البث انتهى');
        var liveBg = b.status === 'scheduled' ? '#D32F2F' : (b.status === 'live' ? '#2E7D32' : '#999');
        
        if(b.status !== 'ended'){
          html += '<button class="btn-primary" onclick="startOrJoin(\'' + id + '\',\'' + b.roomId + '\')" style="background:' + liveBg + ';">' + liveBtn + '</button>';
        }
        
        if(b.status === 'live'){
          html += '<button class="btn-primary" onclick="endBroadcast(\'' + id + '\')" style="background:#666;margin-top:10px;">⏹️ إنهاء البث</button>';
        }
        
        // قائمة الطلبات
        if(b.pendingRequests && b.pendingRequests.length > 0){
          html += '<div style="margin-top:24px;"><div class="section-title">📩 طلبات الانضمام (' + b.pendingRequests.length + ')</div><div id="requestsList"></div></div>';
        }
        
        // الطلاب المسموح لهم
        if(b.allowedStudents && b.allowedStudents.length > 0){
          html += '<div style="margin-top:24px;"><div class="section-title">✅ الطلاب المسموح لهم (' + b.allowedStudents.length + ')</div><div id="allowedList"></div></div>';
        }
      }
      
      c.innerHTML = html;
      
      // تحميل الطلبات
      if(canManage && b.pendingRequests && b.pendingRequests.length > 0){
        loadRequests(id, b.pendingRequests);
      }
      if(canManage && b.allowedStudents && b.allowedStudents.length > 0){
        loadAllowed(id, b.allowedStudents);
      }
    } catch(e){ console.error(e); c.innerHTML = '<p>⚠️ فشل</p>'; }
  };
  
  window.loadRequests = async function(bid, uids){
    var l = document.getElementById('requestsList');
    if(!l) return;
    var html = '';
    for(var i = 0; i < uids.length; i++){
      try {
        var doc = await firebase.firestore().collection('users').doc(uids[i]).get();
        var u = doc.exists ? doc.data() : {name: 'مستخدم'};
        html += '<div style="background:#FFF8E1;padding:12px;border-radius:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">';
        html += '<div>👤 ' + u.name + '</div>';
        html += '<div style="display:flex;gap:6px;"><button onclick="approveJoin(\'' + bid + '\',\'' + uids[i] + '\')" style="background:#2E7D32;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:bold;cursor:pointer;">✅ موافقة</button>';
        html += '<button onclick="rejectJoin(\'' + bid + '\',\'' + uids[i] + '\')" style="background:#E53935;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:bold;cursor:pointer;">❌ رفض</button></div>';
        html += '</div>';
      } catch(e){}
    }
    l.innerHTML = html;
  };
  
  window.loadAllowed = async function(bid, uids){
    var l = document.getElementById('allowedList');
    if(!l) return;
    var html = '';
    for(var i = 0; i < uids.length; i++){
      try {
        var doc = await firebase.firestore().collection('users').doc(uids[i]).get();
        var u = doc.exists ? doc.data() : {name: 'مستخدم'};
        html += '<div style="background:#E8F5E9;padding:12px;border-radius:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">';
        html += '<div>👤 ' + u.name + '</div>';
        html += '<button onclick="removeAllowed(\'' + bid + '\',\'' + uids[i] + '\')" style="background:#E53935;color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:12px;cursor:pointer;">✕</button>';
        html += '</div>';
      } catch(e){}
    }
    l.innerHTML = html;
  };
  
  window.requestJoin = async function(bid){
    if(!window.currentUser) return;
    try {
      var fs = firebase.firestore();
      var ref = fs.collection('broadcasts').doc(bid);
      var doc = await ref.get();
      var b = doc.data();
      var pending = b.pendingRequests || [];
      if(pending.indexOf(window.currentUser.uid) === -1){
        pending.push(window.currentUser.uid);
        await ref.update({pendingRequests: pending});
      }
      if(typeof showToast === 'function') showToast('📩 تم إرسال الطلب');
      window.openLiveDetails(bid);
    } catch(e){ console.error(e); if(typeof showToast === 'function') showToast('❌ فشل'); }
  };
  
  window.approveJoin = async function(bid, uid){
    try {
      var fs = firebase.firestore();
      var ref = fs.collection('broadcasts').doc(bid);
      var doc = await ref.get();
      var b = doc.data();
      var pending = (b.pendingRequests || []).filter(function(x){ return x !== uid; });
      var allowed = b.allowedStudents || [];
      if(allowed.indexOf(uid) === -1) allowed.push(uid);
      await ref.update({pendingRequests: pending, allowedStudents: allowed});
      if(typeof showToast === 'function') showToast('✅ تمت الموافقة');
      window.openLiveDetails(bid);
    } catch(e){ console.error(e); }
  };
  
  window.rejectJoin = async function(bid, uid){
    try {
      var fs = firebase.firestore();
      var ref = fs.collection('broadcasts').doc(bid);
      var doc = await ref.get();
      var b = doc.data();
      var pending = (b.pendingRequests || []).filter(function(x){ return x !== uid; });
      await ref.update({pendingRequests: pending});
      if(typeof showToast === 'function') showToast('❌ تم الرفض');
      window.openLiveDetails(bid);
    } catch(e){ console.error(e); }
  };
  
  window.removeAllowed = async function(bid, uid){
    if(!confirm('إزالة الطالب؟')) return;
    try {
      var fs = firebase.firestore();
      var ref = fs.collection('broadcasts').doc(bid);
      var doc = await ref.get();
      var b = doc.data();
      var allowed = (b.allowedStudents || []).filter(function(x){ return x !== uid; });
      await ref.update({allowedStudents: allowed});
      window.openLiveDetails(bid);
    } catch(e){ console.error(e); }
  };
  
  window.startOrJoin = async function(bid, roomId){
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({status: 'live'});
      window.openJitsi(roomId);
    } catch(e){ console.error(e); }
  };
  
  window.joinBroadcast = function(roomId){
    window.openJitsi(roomId);
  };
  
  window.openJitsi = function(roomId){
    var url = 'https://meet.jit.si/' + roomId;
    window.open(url, '_blank');
    if(typeof showToast === 'function') showToast('🎥 جاري فتح البث...');
  };
  
  window.endBroadcast = async function(bid){
    if(!confirm('إنهاء البث للجميع؟')) return;
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({status: 'ended'});
      if(typeof showToast === 'function') showToast('⏹️ تم إنهاء البث');
      window.openLiveDetails(bid);
    } catch(e){ console.error(e); }
  };
  
  // ═══ صلاحيات البث (للمالك) ═══
  window.openBroadcastPerm = async function(){
    if(window.currentRole !== 'owner') return;
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('broadcastPermScreen');
    var l = document.getElementById('broadcastPermList');
    l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳</p>';
    try {
      var snap = await firebase.firestore().collection('users').where('role','==','teacher').get();
      if(snap.empty){ l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">لا يوجد معلمون</p>'; return; }
      var html = '';
      snap.forEach(function(doc){
        var u = doc.data();
        var can = u.canBroadcast === true;
        html += '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">';
        html += '<div><div style="font-weight:bold;">👤 ' + (u.name||'معلم') + '</div><div style="font-size:12px;color:' + (can?'#2E7D32':'#999') + ';">' + (can?'✅ مصرح له':'❌ غير مصرح') + '</div></div>';
        html += '<button onclick="toggleBroadcastPerm(\'' + doc.id + '\',' + (can?'false':'true') + ')" style="background:' + (can?'#E53935':'#2E7D32') + ';color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:bold;cursor:pointer;">' + (can?'إلغاء':'موافقة') + '</button>';
        html += '</div>';
      });
      l.innerHTML = html;
    } catch(e){ console.error(e); l.innerHTML = '<p>⚠️ فشل</p>'; }
  };
  
  window.toggleBroadcastPerm = async function(uid, val){
    try {
      await firebase.firestore().collection('users').doc(uid).update({canBroadcast: val});
      if(typeof showToast === 'function') showToast('✅ تم التحديث');
      window.openBroadcastPerm();
    } catch(e){ console.error(e); }
  };
  
  console.log('✅ Live Broadcast system loaded');
})();
// ═══ مركز مراقبة البث (للمالك فقط) ═══
(function(){
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(!document.getElementById('liveMonitorScreen')){
        var s = document.createElement('div');
        s.id = 'liveMonitorScreen';
        s.className = 'screen';
        s.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#B71C1C,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>👁️ مراقبة البث</span></div><button class="icon-btn" onclick="loadLiveMonitor()">🔄</button></div><div class="content"><div id="monitorStats" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;"></div><div id="liveMonitorList"></div></div>';
        document.body.appendChild(s);
      }
      var admin = document.getElementById('adminScreen');
      if(admin && !document.getElementById('monitorBtn')){
        var ac = admin.querySelector('.content');
        if(ac){
          var mBtn = document.createElement('div');
          mBtn.id = 'monitorBtn';
          mBtn.className = 'menu-item';
          mBtn.innerHTML = '<span style="font-size:26px;">👁️</span><span style="flex:1;font-weight:700;color:#E53935;">مراقبة البث المباشر</span><span style="color:#999;font-size:24px;">‹</span>';
          mBtn.onclick = function(){ window.openLiveMonitor(); };
          ac.insertBefore(mBtn, ac.firstChild);
        }
      }
    }, 5000);
  });

  window.openLiveMonitor = async function(){
    if(window.currentRole !== 'owner'){ if(typeof showToast === 'function') showToast('⚠️ للمالك فقط'); return; }
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('liveMonitorScreen');
    window.loadLiveMonitor();
    if(window.monitorInterval) clearInterval(window.monitorInterval);
    window.monitorInterval = setInterval(function(){
      var scr = document.getElementById('liveMonitorScreen');
      if(scr && scr.classList.contains('active')){ window.loadLiveMonitor(); }
      else { clearInterval(window.monitorInterval); }
    }, 15000);
  };

  window.loadLiveMonitor = async function(){
    if(window.currentRole !== 'owner') return;
    var l = document.getElementById('liveMonitorList');
    var statsEl = document.getElementById('monitorStats');
    if(!l) return;
    l.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحديث...</p>';
    try {
      var fs = firebase.firestore();
      var snap = await fs.collection('broadcasts').orderBy('scheduledAt','desc').limit(50).get();
      var liveRooms = [], scheduled = [], ended = [];
      snap.forEach(function(doc){
        var b = doc.data(); b._id = doc.id;
        if(b.status === 'live') liveRooms.push(b);
        else if(b.status === 'scheduled') scheduled.push(b);
        else ended.push(b);
      });
      var totalStudents = 0;
      liveRooms.forEach(function(b){ totalStudents += (b.allowedStudents||[]).length; });
      statsEl.innerHTML =
        '<div style="background:#fff;border-radius:14px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);"><div style="font-size:24px;font-weight:bold;color:#D32F2F;">' + liveRooms.length + '</div><div style="font-size:11px;color:#999;">🔴 بث نشط</div></div>' +
        '<div style="background:#fff;border-radius:14px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);"><div style="font-size:24px;font-weight:bold;color:#F9A825;">' + scheduled.length + '</div><div style="font-size:11px;color:#999;">📅 مجدول</div></div>' +
        '<div style="background:#fff;border-radius:14px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);"><div style="font-size:24px;font-weight:bold;color:#2E7D32;">' + totalStudents + '</div><div style="font-size:11px;color:#999;">👥 طالب</div></div>';
      var html = '';
      if(liveRooms.length > 0){
        html += '<div class="section-title" style="color:#D32F2F;">🔴 بثوث نشطة الآن (' + liveRooms.length + ')</div>';
        liveRooms.forEach(function(b){ html += renderRoomCard(b, true); });
      }
      if(scheduled.length > 0){
        html += '<div class="section-title" style="margin-top:24px;">📅 بثوث مجدولة (' + scheduled.length + ')</div>';
        scheduled.forEach(function(b){ html += renderRoomCard(b, false); });
      }
      if(ended.length > 0){
        html += '<div class="section-title" style="margin-top:24px;">⚫ بثوث منتهية (آخر ' + Math.min(5, ended.length) + ')</div>';
        ended.slice(0, 5).forEach(function(b){ html += renderRoomCard(b, false); });
      }
      if(html === '') html = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>لا توجد بثوث</p></div>';
      l.innerHTML = html;
    } catch(e){ console.error(e); l.innerHTML = '<p style="text-align:center;color:#E53935;padding:20px;">⚠️ فشل التحميل</p>'; }
  };

  function renderRoomCard(b, isLive){
    var dateStr = new Date(b.scheduledAt).toLocaleString('ar-EG');
    var statusColor = isLive ? '#D32F2F' : (b.status === 'ended' ? '#999' : '#F9A825');
    var statusText = isLive ? '🔴 مباشر' : (b.status === 'ended' ? '⚫ منتهي' : '📅 مجدول');
    var studentsCount = (b.allowedStudents||[]).length;
    var pendingCount = (b.pendingRequests||[]).length;
    var h = '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-right:5px solid ' + statusColor + ';">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">';
    h += '<div style="flex:1;"><div style="font-weight:bold;font-size:15px;color:#212121;margin-bottom:4px;">' + (b.title||'بث') + '</div>';
    h += '<div style="font-size:12px;color:#666;">📖 ' + (b.subject||'') + '</div></div>';
    h += '<div style="font-size:11px;font-weight:bold;color:' + statusColor + ';background:' + statusColor + '15;padding:4px 10px;border-radius:10px;">' + statusText + '</div>';
    h += '</div>';
    h += '<div style="background:#F5F5F5;border-radius:10px;padding:10px;margin-bottom:10px;font-size:12px;line-height:1.8;">';
    h += '<div>👨‍🏫 <b>المعلم:</b> ' + (b.teacherName||'') + '</div>';
    h += '<div>📅 <b>الوقت:</b> ' + dateStr + '</div>';
    h += '<div>👥 <b>الطلاب:</b> ' + studentsCount + (pendingCount > 0 ? ' • 📩 <b>' + pendingCount + ' طلب</b>' : '') + '</div>';
    if(b.notes) h += '<div>📝 <b>ملاحظة:</b> ' + b.notes + '</div>';
    h += '</div>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
    h += '<button onclick="monitorRoom(\'' + b.roomId + '\')" style="flex:1;background:linear-gradient(135deg,#1976D2,#0D47A1);color:#fff;border:none;padding:10px;border-radius:10px;font-weight:bold;cursor:pointer;font-family:inherit;font-size:13px;min-width:100px;">👁️ دخول للمراقبة</button>';
    if(isLive){
      h += '<button onclick="forceStopBroadcast(\'' + b._id + '\')" style="flex:1;background:#E53935;color:#fff;border:none;padding:10px;border-radius:10px;font-weight:bold;cursor:pointer;font-family:inherit;font-size:13px;min-width:100px;">🛑 إيقاف فوري</button>';
    }
    h += '</div></div>';
    return h;
  }

  window.monitorRoom = function(roomId){
    if(window.currentRole !== 'owner') return;
    if(!roomId){ if(typeof showToast === 'function') showToast('⚠️ الغرفة غير متاحة'); return; }
    if(confirm('دخول غرفة المراقبة؟\n\n(هتدخل كمراقب صامت)')){
      var url = 'https://meet.jit.si/' + roomId + '#config.startWithAudioMuted=true&config.startWithVideoMuted=true';
      window.open(url, '_blank');
      if(typeof showToast === 'function') showToast('👁️ جاري الدخول...');
    }
  };

  window.forceStopBroadcast = async function(bid){
    if(window.currentRole !== 'owner') return;
    if(!confirm('⚠️ إيقاف البث فوراً؟\n\nالطلاب والمعلم هيتطردوا.')) return;
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({
        status: 'ended', endedBy: 'owner', endedAt: new Date().toISOString()
      });
      if(typeof showToast === 'function') showToast('🛑 تم الإيقاف');
      window.loadLiveMonitor();
    } catch(e){ console.error(e); if(typeof showToast === 'function') showToast('❌ فشل'); }
  };

  window.stopAllBroadcasts = async function(){
    if(window.currentRole !== 'owner') return;
    if(!confirm('⚠️ إيقاف جميع البثوث النشطة؟')) return;
    try {
      var fs = firebase.firestore();
      var snap = await fs.collection('broadcasts').where('status','==','live').get();
      var batch = fs.batch();
      snap.forEach(function(doc){
        batch.update(doc.ref, {status: 'ended', endedBy: 'owner', endedAt: new Date().toISOString()});
      });
      await batch.commit();
      if(typeof showToast === 'function') showToast('🛑 تم إيقاف ' + snap.size + ' بث');
      window.loadLiveMonitor();
    } catch(e){ console.error(e); }
  };

  console.log('✅ Live Monitor system loaded');
})();
// ═══════════════════════════════════════════════════════
// 🛡️ نظام الأمان المتقدم
// ═══════════════════════════════════════════════════════
(function(){
  
  // ═══ 1. تشفير كلمة المرور ═══
  window.hashPassword = async function(pwd, salt){
    try {
      if (window.crypto && window.crypto.subtle) {
        var enc = new TextEncoder();
        var data = enc.encode(salt + '|' + pwd + '|hafez_secure_2026');
        var buf = await crypto.subtle.digest('SHA-256', data);
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
      }
    } catch(e){}
    // fallback للمتصفحات القديمة
    var s = salt + '|' + pwd + '|hafez_secure_2026';
    var h1 = 5381, h2 = 52711;
    for (var i = 0; i < s.length; i++) {
      h1 = ((h1 * 33) ^ s.charCodeAt(i)) >>> 0;
      h2 = ((h2 * 31) ^ s.charCodeAt(i)) >>> 0;
    }
    return 'f_' + h1.toString(16) + h2.toString(16);
  };
  
  // ═══ 2. Device Fingerprint ═══
  window.getDeviceId = function(){
    var did = localStorage.getItem('hafez_device_id');
    if (!did) {
      var ua = navigator.userAgent;
      var screen_ = (screen.width || 0) + 'x' + (screen.height || 0);
      var lang = navigator.language || '';
      var rand = Math.random().toString(36).substring(2, 8);
      did = 'dev_' + btoa(ua.substring(0,50) + screen_ + lang).substring(0,20) + '_' + rand;
      localStorage.setItem('hafez_device_id', did);
    }
    return did;
  };
  
  // ═══ 3. Salt عشوائي ═══
  window.generateSalt = function(){
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };
  
  // ═══ 4. كود استعادة (6 أرقام) ═══
  window.generateRecoveryCode = function(){
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // ═══ 5. سجل دخول ═══
  window.logLogin = async function(username, role, success, reason){
    try {
      await firebase.firestore().collection('login_logs').add({
        username: username,
        role: role,
        success: success,
        reason: reason || '',
        device: window.getDeviceId(),
        userAgent: navigator.userAgent.substring(0, 100),
        timestamp: new Date().toISOString()
      });
    } catch(e){}
  };
  
  // ═══ 6. عرض كود الاستعادة ═══
  window.showRecoveryCode = function(code, username){
    var m = document.createElement('div');
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = '<div style="background:#fff;border-radius:22px;max-width:400px;width:100%;padding:28px;text-align:center;">' +
      '<div style="font-size:60px;margin-bottom:12px;">🔐</div>' +
      '<div style="font-size:20px;font-weight:bold;color:#2E7D32;margin-bottom:8px;">كود الاستعادة</div>' +
      '<div style="font-size:13px;color:#666;margin-bottom:20px;">احفظ الكود ده في مكان آمن<br>هتحتاجه لو نسيت كلمة المرور</div>' +
      '<div style="background:#FFF8E1;padding:20px;border-radius:14px;margin-bottom:16px;">' +
      '<div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#F9A825;">' + code + '</div>' +
      '</div>' +
      '<div style="font-size:13px;color:#666;margin-bottom:20px;">الحساب: <b>' + username + '</b></div>' +
      '<button onclick="window.copyRecoveryCode(\'' + code + '\'); this.parentElement.parentElement.remove();" style="width:100%;padding:14px;background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">📋 نسخ الكود والمتابعة</button>' +
      '</div>';
    document.body.appendChild(m);
  };
  
  window.copyRecoveryCode = function(code){
    try {
      var ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if(typeof showToast === 'function') showToast('📋 تم نسخ الكود');
    } catch(e){
      if(typeof showToast === 'function') showToast('⚠️ احفظ الكود يدوياً');
    }
  };
  
  // ═══ 7. Override دالة login ═══
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
        
        // ─── التحقق الأساسي ───
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
          // تشغيل دالة المالك الأصلية
          try {
            await origLogin.apply(this, arguments);
            await window.logLogin(uname, 'owner', true, '');
          } catch(e){ console.error(e); }
          return;
        }
        
        // ─── البحث عن المستخدم ───
        try {
          var fs = firebase.firestore();
          var snap = await fs.collection('users').where('name', '==', uname).limit(1).get();
          
          // ═══ حالة 1: المستخدم مش موجود → إنشاء حساب ═══
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
          
          // ═══ حالة 2: المستخدم موجود → تحقق من كلمة المرور ═══
          var userDoc = snap.docs[0];
          var user = userDoc.data();
          var uid2 = userDoc.id;
          var computed = await window.hashPassword(pwd, user.salt || '');
          
          if (computed !== user.passHash) {
            await window.logLogin(uname, window.currentRole, false, 'wrong password');
            if(typeof showToast === 'function') showToast('❌ كلمة المرور خطأ');
            return;
          }
          
          // تحقق من الجهاز
          var dev2 = window.getDeviceId();
          var trusted = user.trustedDevices || [];
          
          if (trusted.indexOf(dev2) === -1) {
            // جهاز جديد — يطلب كود الاستعادة
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
          
          // نجح الدخول
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
      
      console.log('✅ Secure login loaded');
    }, 2500);
  });
  
  // ═══ 8. عرض سجل الدخول للمالك ═══
  window.viewLoginLogs = async function(){
    if (window.currentRole !== 'owner') return;
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
    m.innerHTML = '<div style="background:#FFFEF7;border-radius:22px;max-width:520px;margin:40px auto;padding:20px;position:relative;">' +
      '<button onclick="this.parentElement.parentElement.remove()" style="position:sticky;top:10px;float:left;background:#E53935;color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer;z-index:10;">✕</button>' + h + '</div>';
    document.body.appendChild(m);
  };
  
  console.log('✅ Security system loaded');
})();
console.log('✅ extras.js loaded');
