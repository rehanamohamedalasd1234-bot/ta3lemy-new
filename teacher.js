// ═══════════════════════════════════════════════════════
// 👨‍🏫 teacher.js — ملف المعلم (لوحة التحكم + البث)
// ═══════════════════════════════════════════════════════

(function(){
  console.log('👨‍🏫 Teacher System Loading...');

  // ═══════════════════════════════════════════════════════
  // 1. إنشاء شاشة لوحة تحكم المعلم
  // ═══════════════════════════════════════════════════════
  if(!document.getElementById('teacherDashboardScreen')){
    var s = document.createElement('div');
    s.id = 'teacherDashboardScreen';
    s.className = 'screen';
    s.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#00695C,#00897B);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>🎛️ لوحة تحكم المعلم</span></div><button class="icon-btn" onclick="loadTeacherDashboard()">🔄</button></div><div class="content" id="teacherDashboardContent"></div>';
    document.body.appendChild(s);
  }

  // ═══════════════════════════════════════════════════════
  // 2. فتح لوحة التحكم
  // ═══════════════════════════════════════════════════════
  window.openTeacherDashboard = function(){
    if(window.currentRole !== 'teacher' && window.currentRole !== 'owner'){
      if(typeof showToast === 'function') showToast('⚠️ للمعلمين فقط');
      return;
    }
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('teacherDashboardScreen');
    window.loadTeacherDashboard();
  };

  // ═══════════════════════════════════════════════════════
  // 3. تحميل بيانات لوحة التحكم
  // ═══════════════════════════════════════════════════════
  window.loadTeacherDashboard = async function(){
    var c = document.getElementById('teacherDashboardContent');
    if(!c) return;
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
    
    try {
      var fs = firebase.firestore();
      var uid = window.currentUser.uid;
      
      // جلب كل بيانات المعلم
      var [uploadsSnap, broadcastsSnap] = await Promise.all([
        fs.collection('teacher_uploads').where('teacherId', '==', uid).get(),
        fs.collection('broadcasts').where('teacherId', '==', uid).orderBy('createdAt', 'desc').limit(10).get()
      ]);
      
      var html = '';
      
      // ═══ الإحصائيات ═══
      html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">';
      html += '<div style="background:#fff;border-radius:12px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);">';
      html += '<div style="font-size:24px;font-weight:bold;color:#1976D2;">' + uploadsSnap.size + '</div>';
      html += '<div style="font-size:11px;color:#999;">📤 محتوى مرفوع</div>';
      html += '</div>';
      html += '<div style="background:#fff;border-radius:12px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);">';
      html += '<div style="font-size:24px;font-weight:bold;color:#D32F2F;">' + broadcastsSnap.size + '</div>';
      html += '<div style="font-size:11px;color:#999;">🔴 بثوث</div>';
      html += '</div>';
      html += '<div style="background:#fff;border-radius:12px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);">';
      html += '<div style="font-size:24px;font-weight:bold;color:#2E7D32;">' + (window.currentUser.points || 0) + '</div>';
      html += '<div style="font-size:11px;color:#999;">⭐ نقاط</div>';
      html += '</div>';
      html += '</div>';
      
      // ═══ إدارة البثوث ═══
      html += '<div style="margin-bottom:24px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
      html += '<h3 style="color:#D32F2F;margin:0;">🔴 بثوثك النشطة</h3>';
      html += '<button onclick="window.openTeacherBroadcast()" style="background:#D32F2F;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:bold;cursor:pointer;font-family:inherit;font-size:13px;">➕ ابدأ بث</button>';
      html += '</div>';
      
      var liveBroadcasts = [];
      broadcastsSnap.forEach(function(doc){
        var b = doc.data();
        if(b.status === 'live') liveBroadcasts.push({ id: doc.id, data: b });
      });
      
      if(liveBroadcasts.length === 0){
        html += '<div style="background:#F5F5F5;border-radius:12px;padding:16px;text-align:center;color:#999;font-size:13px;">لا يوجد بث شغال حالياً</div>';
      } else {
        liveBroadcasts.forEach(function(b){
          html += '<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-right:4px solid #D32F2F;">';
          html += '<div style="font-weight:bold;margin-bottom:6px;">' + b.data.title + '</div>';
          html += '<div style="font-size:12px;color:#666;margin-bottom:10px;">📖 ' + b.data.subject + ' • 👥 ' + (b.data.allowedStudents || []).length + ' طالب</div>';
          html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
          html += '<button onclick="window.openJitsiRoom(\'' + b.data.roomId + '\')" style="background:#1976D2;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;">🎥 دخول</button>';
          html += '<button onclick="window.openBroadcastRequests(\'' + b.id + '\')" style="background:#F9A825;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;">📩 الطلبات</button>';
          html += '<button onclick="window.endTeacherBroadcast(\'' + b.id + '\')" style="background:#666;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;">⏹️ إنهاء</button>';
          html += '</div></div>';
        });
      }
      html += '</div>';
      
      // ═══ إدارة المحتوى المرفوع ═══
      html += '<div>';
      html += '<h3 style="color:#1976D2;margin-bottom:12px;">📤 محتواك المرفوع</h3>';
      
      if(uploadsSnap.empty){
        html += '<div style="background:#F5F5F5;border-radius:12px;padding:16px;text-align:center;color:#999;font-size:13px;">لم تقم برفع أي محتوى بعد</div>';
      } else {
        uploadsSnap.forEach(function(doc){
          var u = doc.data();
          var typeLabel = u.type === 'lesson' ? '📄 درس' : u.type === 'exercise' ? '✏️ تدريب' : u.type === 'exam' ? '📝 امتحان' : '🎥 فيديو';
          html += '<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-right:4px solid #1976D2;">';
          html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">';
          html += '<b style="color:#1976D2;">' + typeLabel + '</b>';
          html += '<span style="font-size:11px;color:#999;">' + new Date(u.createdAt).toLocaleDateString('ar-EG') + '</span>';
          html += '</div>';
          html += '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">' + u.title + '</div>';
          html += '<div style="font-size:11px;color:#666;margin-bottom:8px;">📚 ' + u.subject + ' • ' + u.grade + '</div>';
          html += '<button onclick="window.deleteTeacherUpload(\'' + doc.id + '\')" style="background:#E53935;color:#fff;border:none;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">🗑️ حذف</button>';
          html += '</div>';
        });
      }
      html += '</div>';
      
      c.innerHTML = html;
    } catch(e){
      console.error(e);
      c.innerHTML = '<p style="text-align:center;color:#E53935;">⚠️ فشل التحميل</p>';
    }
  };

  // ═══════════════════════════════════════════════════════
  // 4. فتح غرفة Jitsi
  // ═══════════════════════════════════════════════════════
  window.openJitsiRoom = function(roomId){
    if(!roomId) return;
    var url = 'https://meet.jit.si/' + roomId + '#userInfo.displayName=%22' + encodeURIComponent(window.currentUser.name) + '%22';
    window.open(url, '_blank');
  };

  // ═══════════════════════════════════════════════════════
  // 5. بدء بث جديد
  // ═══════════════════════════════════════════════════════
  window.openTeacherBroadcast = function(){
    if(window.currentRole !== 'teacher' && window.currentRole !== 'owner'){
      if(typeof showToast === 'function') showToast('⚠️ للمعلمين فقط');
      return;
    }
    
    var title = prompt('📝 عنوان البث:');
    if(!title) return;
    var subject = prompt('📚 المادة:') || 'عام';
    
    var roomId = 'hafez-room-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    
    firebase.firestore().collection('broadcasts').add({
      title: title,
      subject: subject,
      teacherId: window.currentUser.uid,
      teacherName: window.currentUser.name,
      roomId: roomId,
      status: 'live',
      allowedStudents: [],
      pendingRequests: [],
      createdAt: new Date().toISOString()
    }).then(function(){
      window.openJitsiRoom(roomId);
      if(typeof showToast === 'function') showToast('🔴 تم فتح الغرفة');
      if(document.getElementById('teacherDashboardScreen').classList.contains('active')){
        setTimeout(window.loadTeacherDashboard, 1000);
      }
    }).catch(function(e){
      console.error(e);
      if(typeof showToast === 'function') showToast('❌ فشل');
    });
  };

  // ═══════════════════════════════════════════════════════
  // 6. عرض طلبات الانضمام وإدارتها
  // ═══════════════════════════════════════════════════════
  window.openBroadcastRequests = async function(broadcastId){
    try {
      var doc = await firebase.firestore().collection('broadcasts').doc(broadcastId).get();
      var b = doc.data();
      var pending = b.pendingRequests || [];
      var allowed = b.allowedStudents || [];
      
      var m = document.createElement('div');
      m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;overflow-y:auto;padding:20px;';
      m.innerHTML = '<div style="background:#fff;border-radius:16px;padding:20px;max-width:500px;margin:20px auto;">' +
        '<h3 style="margin-bottom:16px;color:#2E7D32;">📩 طلبات الانضمام (' + pending.length + ')</h3>' +
        '<div id="requestsListContent" style="margin-bottom:20px;"><p>جاري التحميل...</p></div>' +
        '<h3 style="margin-bottom:16px;color:#1976D2;">✅ الطلاب المسموح لهم (' + allowed.length + ')</h3>' +
        '<div id="allowedListContent" style="margin-bottom:20px;"><p>جاري التحميل...</p></div>' +
        '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:12px;background:#666;color:#fff;border:none;border-radius:10px;font-family:inherit;font-weight:bold;cursor:pointer;">✕ إغلاق</button>' +
        '</div>';
      document.body.appendChild(m);
      
      window.loadPendingRequests(broadcastId, pending);
      window.loadAllowedStudents(broadcastId, allowed);
    } catch(e){ console.error(e); }
  };

  window.loadPendingRequests = async function(bid, uids){
    var c = document.getElementById('requestsListContent');
    if(uids.length === 0){
      c.innerHTML = '<p style="color:#999;font-size:13px;">لا توجد طلبات</p>';
      return;
    }
    var html = '';
    for(var i = 0; i < uids.length; i++){
      var doc = await firebase.firestore().collection('users').doc(uids[i]).get();
      var u = doc.exists ? doc.data() : {name: 'مستخدم'};
      html += '<div style="background:#FFF8E1;padding:10px;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">';
      html += '<span style="font-size:13px;">👤 ' + u.name + '</span>';
      html += '<div style="display:flex;gap:6px;">';
      html += '<button onclick="window.approveStudent(\'' + bid + '\',\'' + uids[i] + '\')" style="background:#2E7D32;color:#fff;border:none;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">✅ قبول</button>';
      html += '<button onclick="window.rejectStudent(\'' + bid + '\',\'' + uids[i] + '\')" style="background:#E53935;color:#fff;border:none;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">❌ رفض</button>';
      html += '</div></div>';
    }
    c.innerHTML = html;
  };

  window.loadAllowedStudents = async function(bid, uids){
    var c = document.getElementById('allowedListContent');
    if(uids.length === 0){
      c.innerHTML = '<p style="color:#999;font-size:13px;">لا يوجد طلاب</p>';
      return;
    }
    var html = '';
    for(var i = 0; i < uids.length; i++){
      var doc = await firebase.firestore().collection('users').doc(uids[i]).get();
      var u = doc.exists ? doc.data() : {name: 'مستخدم'};
      html += '<div style="background:#E8F5E9;padding:10px;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">';
      html += '<span style="font-size:13px;">👤 ' + u.name + '</span>';
      html += '<button onclick="window.removeAllowedStudent(\'' + bid + '\',\'' + uids[i] + '\')" style="background:#E53935;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;">✕</button>';
      html += '</div>';
    }
    c.innerHTML = html;
  };

  window.approveStudent = async function(bid, uid){
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({
        pendingRequests: firebase.firestore.FieldValue.arrayRemove(uid),
        allowedStudents: firebase.firestore.FieldValue.arrayUnion(uid)
      });
      if(typeof showToast === 'function') showToast('✅ تمت الموافقة');
      window.openBroadcastRequests(bid);
    } catch(e){ console.error(e); }
  };

  window.rejectStudent = async function(bid, uid){
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({
        pendingRequests: firebase.firestore.FieldValue.arrayRemove(uid)
      });
      if(typeof showToast === 'function') showToast('❌ تم الرفض');
      window.openBroadcastRequests(bid);
    } catch(e){ console.error(e); }
  };

  window.removeAllowedStudent = async function(bid, uid){
    if(!confirm('إزالة الطالب من البث؟')) return;
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({
        allowedStudents: firebase.firestore.FieldValue.arrayRemove(uid)
      });
      window.openBroadcastRequests(bid);
    } catch(e){ console.error(e); }
  };

  // ═══════════════════════════════════════════════════════
  // 7. إنهاء بث
  // ═══════════════════════════════════════════════════════
  window.endTeacherBroadcast = async function(bid){
    if(!confirm('إنهاء البث للجميع؟')) return;
    try {
      await firebase.firestore().collection('broadcasts').doc(bid).update({status: 'ended'});
      if(typeof showToast === 'function') showToast('⏹️ تم الإنهاء');
      window.loadTeacherDashboard();
    } catch(e){ console.error(e); }
  };

  // ═══════════════════════════════════════════════════════
  // 8. حذف محتوى مرفوع
  // ═══════════════════════════════════════════════════════
  window.deleteTeacherUpload = async function(id){
    if(!confirm('حذف هذا المحتوى؟')) return;
    try {
      await firebase.firestore().collection('teacher_uploads').doc(id).delete();
      if(typeof showToast === 'function') showToast('🗑️ تم الحذف');
      window.loadTeacherDashboard();
    } catch(e){ console.error(e); }
  };

  // ═══════════════════════════════════════════════════════
  // 9. إضافة أزرار المعلم في الرئيسية
  // ═══════════════════════════════════════════════════════
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(window.currentRole !== 'teacher' && window.currentRole !== 'owner') return;
      
      var toolsGrid = document.querySelector('#homeScreen .tools-grid');
      if(toolsGrid && !document.getElementById('teacherDashBtn')){
        var btn = document.createElement('div');
        btn.id = 'teacherDashBtn';
        btn.className = 'tool-btn';
        btn.innerHTML = '<div class="tool-icon" style="background:#00695C15;color:#00695C;font-size:22px;">🎛️</div><div class="tool-label">لوحة المعلم</div>';
        btn.onclick = function(){ window.openTeacherDashboard(); };
        toolsGrid.insertBefore(btn, toolsGrid.firstChild);
      }
    }, 6000);
  });

  console.log('✅ Teacher Dashboard Loaded');
})();
// إضافة زرار لوحة المعلم في الشاشة الرئيسية
window.addEventListener('load', function(){
  setInterval(function(){
    if(window.currentRole === 'teacher' || window.currentRole === 'owner'){
      var toolsGrid = document.querySelector('#homeScreen .tools-grid');
      if(toolsGrid && !document.getElementById('teacherDashBtn')){
        var btn = document.createElement('div');
        btn.id = 'teacherDashBtn';
        btn.className = 'tool-btn';
        btn.innerHTML = '<div class="tool-icon" style="background:#00695C15;color:#00695C;font-size:22px;">🎛️</div><div class="tool-label">لوحة المعلم</div>';
        btn.onclick = function(){ 
            if (typeof window.openTeacherDashboard === 'function') {
                window.openTeacherDashboard(); 
            } else {
                if(typeof showToast === 'function') showToast('⚠️ ملف teacher.js مش متحمل');
            }
        };
        toolsGrid.insertBefore(btn, toolsGrid.firstChild);
      }
    }
  }, 3000);
});
