// ═══════════════════════════════════════════════════════
// 👑 owner-approvals.js — لوحة موافقات المالك
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  // إضافة زرار الموافقات في لوحة المالك
  setInterval(function(){
    var admin = document.getElementById('adminScreen');
    if(admin && !document.getElementById('ownerApprovalsBtn')){
      var ac = admin.querySelector('.content');
      if(ac){
        var mBtn = document.createElement('div');
        mBtn.id = 'ownerApprovalsBtn';
        mBtn.className = 'menu-item';
        mBtn.innerHTML = '<span style="font-size:26px;">👑</span><span style="flex:1;font-weight:700;color:#E53935;">طلبات المعلمين</span><span style="color:#999;font-size:24px;">‹</span>';
        mBtn.onclick = function(){ window.openOwnerApprovals(); };
        ac.insertBefore(mBtn, ac.firstChild);
      }
    }
  }, 3000);
});

window.openOwnerApprovals = function() {
  if(window.currentRole !== 'owner') {
    if(typeof showToast === 'function') showToast('⚠️ مسموح للمالك فقط');
    return;
  }
  
  if(window.screenHistory) window.screenHistory.push(window.currentScreen);
  
  var screen = document.getElementById('ownerApprovalsScreen');
  if(!screen) {
    screen = document.createElement('div');
    screen.id = 'ownerApprovalsScreen';
    screen.className = 'screen';
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#B71C1C,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>👑 موافقات المعلمين</span></div><div style="width:42px;"></div></div><div class="content" id="ownerApprovalsContent"></div>';
    document.body.appendChild(screen);
  }
  
  if(typeof showScreen === 'function') showScreen('ownerApprovalsScreen');
  window.loadOwnerApprovals();
};

window.loadOwnerApprovals = async function() {
  var c = document.getElementById('ownerApprovalsContent');
  c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
  
  try {
    var snap = await firebase.firestore().collection('teacher_uploads').where('status', '==', 'pending').get();
    
    if(snap.empty) {
      c.innerHTML = '<div class="empty-state"><p>لا توجد طلبات معلقة حالياً</p></div>';
      return;
    }
    
    var html = '';
    snap.forEach(function(doc) {
      var d = doc.data();
      var typeLabel = d.type === 'lesson' ? '📄 درس' : d.type === 'exercise' ? '✏️ تدريب' : d.type === 'exam' ? '📝 امتحان' : '🎥 فيديو';
      
      html += '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-right:5px solid #E53935;">';
      html += '<div style="font-weight:bold;color:#E53935;margin-bottom:4px;">' + typeLabel + '</div>';
      html += '<div style="font-weight:bold;margin-bottom:6px;">' + d.title + '</div>';
      html += '<div style="font-size:12px;color:#666;margin-bottom:4px;">👤 المعلم: ' + d.teacherName + '</div>';
      html += '<div style="font-size:12px;color:#666;margin-bottom:10px;">📚 ' + d.subject + ' • ' + d.grade + '</div>';
      html += '<div style="display:flex;gap:8px;">';
      html += '<button onclick="window.approveTeacherUpload(\'' + doc.id + '\')" style="flex:1;background:#2E7D32;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:bold;cursor:pointer;">✅ نشر</button>';
      html += '<button onclick="window.rejectTeacherUpload(\'' + doc.id + '\')" style="flex:1;background:#E53935;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:bold;cursor:pointer;">❌ رفض</button>';
      html += '</div></div>';
    });
    c.innerHTML = html;
  } catch(e) { console.error(e); c.innerHTML = '<p style="color:red;">حدث خطأ</p>'; }
};

window.approveTeacherUpload = async function(id) {
  try {
    var doc = await firebase.firestore().collection('teacher_uploads').doc(id).get();
    var d = doc.data();
    
    // نقل المحتوى لجدول الدروس الأساسي
    await firebase.firestore().collection('lessons').add({
      title: d.title,
      content: d.content,
      subject: d.subject,
      grade: d.grade,
      stage: d.stage,
      term: d.term,
      type: d.type,
      image_url: d.imageUrl || null,
      video_url: d.videoUrl || null,
      created_at: new Date().toISOString()
    });
    
    // تحديث حالة الطلب
    await firebase.firestore().collection('teacher_uploads').doc(id).update({ status: 'approved' });
    
    if(typeof showToast === 'function') showToast('✅ تم النشر بنجاح');
    window.loadOwnerApprovals();
  } catch(e) { console.error(e); if(typeof showToast === 'function') showToast('❌ فشل النشر'); }
};

window.rejectTeacherUpload = async function(id) {
  try {
    await firebase.firestore().collection('teacher_uploads').doc(id).update({ status: 'rejected' });
    if(typeof showToast === 'function') showToast('🗑️ تم الرفض');
    window.loadOwnerApprovals();
  } catch(e) { console.error(e); }
};
