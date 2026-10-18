// ═══════════════════════════════════════════════════════
// 👨‍🏫 teacher.js — ملف المعلم (البث + الغرف)
// ═══════════════════════════════════════════════════════

(function(){
  console.log('👨‍🏫 Teacher System Loading...');

  // ═══ 1. إنشاء غرفة بث جديدة للمعلم ═══
  window.openTeacherBroadcast = function(){
    if(window.currentRole !== 'teacher' && window.currentRole !== 'owner'){
      if(typeof showToast === 'function') showToast('⚠️ للمعلمين فقط');
      return;
    }
    
    // نطلب من المعلم يدخل تفاصيل الغرفة
    var title = prompt('📝 عنوان البث (مثال: مراجعة الوحدة الأولى):');
    if(!title) return;
    
    var subject = prompt('📚 المادة (مثال: رياضيات):') || 'عام';
    var maxStudents = prompt('👥 الحد الأقصى للطلاب (اتركه فارغاً لعدد غير محدود):') || '1000';
    
    // نعمل غرفة فريدة لكل بث
    var roomId = 'hafez-room-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    
    // نحفظ الغرفة في Firebase
    firebase.firestore().collection('broadcasts').add({
      title: title,
      subject: subject,
      teacherId: window.currentUser.uid,
      teacherName: window.currentUser.name,
      roomId: roomId,
      maxStudents: parseInt(maxStudents),
      status: 'live',
      allowedStudents: [],
      pendingRequests: [],
      createdAt: new Date().toISOString()
    }).then(function(docRef){
      // نفتح غرفة Jitsi للمعلم
      var jitsiUrl = 'https://meet.jit.si/' + roomId + '#userInfo.displayName=%22' + encodeURIComponent(window.currentUser.name) + '%22';
      window.open(jitsiUrl, '_blank');
      if(typeof showToast === 'function') showToast('🔴 تم فتح غرفة البث، شارك الكود مع طلابك');
    }).catch(function(e){
      console.error(e);
      if(typeof showToast === 'function') showToast('❌ فشل إنشاء الغرفة');
    });
  };

  // ═══ 2. عرض طلبات الانضمام للمعلم ═══
  window.openTeacherBroadcastRequests = async function(){
    if(window.currentRole !== 'teacher' && window.currentRole !== 'owner') return;
    
    try {
      var snap = await firebase.firestore().collection('broadcasts')
        .where('teacherId', '==', window.currentUser.uid)
        .where('status', '==', 'live')
        .get();
        
      if(snap.empty){
        if(typeof showToast === 'function') showToast('لا يوجد بث شغال حالياً');
        return;
      }
      
      // نعرض قائمة الغرف النشطة
      var list = '';
      snap.forEach(function(doc){
        var b = doc.data();
        list += '📺 ' + b.title + ' (كود: ' + b.roomId + ')\n';
      });
      
      alert('بثوثك النشطة:\n\n' + list);
      
    } catch(e){ console.error(e); }
  };

  // ═══ 3. إضافة أزرار المعلم في الواجهة ═══
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(window.currentRole !== 'teacher' && window.currentRole !== 'owner') return;
      
      var toolsGrid = document.querySelector('#homeScreen .tools-grid');
      if(toolsGrid && !document.getElementById('teacherBroadcastBtn')){
        
        // زرار بدء البث
        var broadcastBtn = document.createElement('div');
        broadcastBtn.id = 'teacherBroadcastBtn';
        broadcastBtn.className = 'tool-btn';
        broadcastBtn.innerHTML = '<div class="tool-icon" style="background:#D32F2F15;color:#D32F2F;font-size:22px;">🔴</div><div class="tool-label">ابدأ بث</div>';
        broadcastBtn.onclick = function(){ window.openTeacherBroadcast(); };
        toolsGrid.appendChild(broadcastBtn);
        
        // زرار إدارة البث
        var manageBtn = document.createElement('div');
        manageBtn.id = 'teacherManageBtn';
        manageBtn.className = 'tool-btn';
        manageBtn.innerHTML = '<div class="tool-icon" style="background:#1976D215;color:#1976D2;font-size:22px;">🎛️</div><div class="tool-label">إدارة البث</div>';
        manageBtn.onclick = function(){ window.openTeacherBroadcastRequests(); };
        toolsGrid.appendChild(manageBtn);
        
        console.log('✅ Teacher buttons added');
      }
    }, 5000);
  });

  console.log('✅ Teacher System Loaded');
})();
