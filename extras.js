// ═══ extras.js — Complete Safe Version ═══
(function(){
  'use strict';
  
  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().enablePersistence({synchronizeTabs:true})
        .then(function(){ console.log('✅ Offline'); })
        .catch(function(e){ console.log('⚠️', e.code); });
    }
  } catch(e){}
  
  window.addEventListener('online', function(){
    if(typeof showToast === 'function') showToast('✅ رجع الاتصال');
  });
  window.addEventListener('offline', function(){
    if(typeof showToast === 'function') showToast('📴 Offline');
  });
  
  // ═══ النقاط ═══
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
