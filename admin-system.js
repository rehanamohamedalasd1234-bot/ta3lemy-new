// ═══════════════════════════════════════════════════════
// admin-system.js — نظام الصلاحيات والتحكم (للمعلمين والمالك)
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  console.log('👑 Loading admin-system...');

  // ═══════════════════════════════════════════════════════
  // 1. واجهة المالك لمراجعة طلبات المعلمين
  // ═══════════════════════════════════════════════════════
  window.openAdminApprovals = async function(){
    if(window.currentRole !== 'owner'){
      if(typeof showToast === 'function') showToast('⚠️ مسموح للمالك فقط');
      return;
    }
    
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    
    var screen = document.getElementById('adminApprovalsScreen');
    if(!screen){
      screen = document.createElement('div');
      screen.id = 'adminApprovalsScreen';
      screen.className = 'screen';
      screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#B71C1C,#E53935);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>👑 لوحة الموافقات</span></div><div style="width:42px;"></div></div><div class="content"><div id="adminApprovalsContent"></div></div>';
      document.body.appendChild(screen);
    }
    
    if(typeof showScreen === 'function') showScreen('adminApprovalsScreen');
    window.loadAdminApprovals();
  };

  window.loadAdminApprovals = async function(){
    var c = document.getElementById('adminApprovalsContent');
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري تحميل الطلبات...</p>';
    
    try {
      var fs = firebase.firestore();
      
      // 1. طلبات تسجيل المعلمين
      var teachersSnap = await fs.collection('users').where('role', '==', 'teacher').where('status', '==', 'pending').get();
      // 2. طلبات المحتوى
      var contentSnap = await fs.collection('teacher_content').where('status', '==', 'pending').get();
      
      var html = '';
      
      if(!teachersSnap.empty){
        html += '<h3 style="color:#E53935;margin:16px 0;">👨‍🏫 طلبات تسجيل معلمين</h3>';
        teachersSnap.forEach(function(doc){
          var t = doc.data();
          html += '<div style="background:#fff;padding:14px;border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">';
          html += '<div><b>' + t.name + '</b><br><small>' + (t.phone || 'لا يوجد رقم') + '</small></div>';
          html += '<button onclick="approveTeacher(\'' + doc.id + '\')" style="background:#2E7D32;color:#fff;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;">✅ موافقة</button>';
          html += '</div>';
        });
      }
      
      if(!contentSnap.empty){
        html += '<h3 style="color:#E53935;margin:16px 0;">📚 محتوى في انتظار المراجعة</h3>';
        contentSnap.forEach(function(doc){
          var cnt = doc.data();
          html += '<div style="background:#fff;padding:14px;border-radius:12px;margin-bottom:10px;">';
          html += '<b>' + cnt.title + '</b> <span style="font-size:12px;color:#666;">(بواسطة: ' + cnt.teacherName + ')</span>';
          html += '<div style="display:flex;gap:8px;margin-top:8px;">';
          html += '<button onclick="approveContent(\'' + doc.id + '\')" style="background:#2E7D32;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;">✅ موافقة ونشر</button>';
          html += '<button onclick="rejectContent(\'' + doc.id + '\')" style="background:#E53935;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;">❌ رفض</button>';
          html += '</div></div>';
        });
      }
      
      if(html === '') html = '<p style="text-align:center;color:#999;">لا توجد طلبات حالياً</p>';
      c.innerHTML = html;
      
    } catch(e){ console.error(e); c.innerHTML = '<p style="color:red;">حدث خطأ في تحميل الطلبات</p>'; }
  };

  window.approveTeacher = async function(uid){
    try {
      await firebase.firestore().collection('users').doc(uid).update({status: 'active'});
      if(typeof showToast === 'function') showToast('✅ تم تفعيل حساب المعلم');
      window.loadAdminApprovals();
    } catch(e){ console.error(e); }
  };

  window.approveContent = async function(id){
    try {
      var doc = await firebase.firestore().collection('teacher_content').doc(id).get();
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
        image_url: d.fileUrl && d.fileUrl.includes('image') ? d.fileUrl : null,
        video_url: d.fileUrl && d.fileUrl.includes('video') ? d.fileUrl : null,
        created_at: new Date().toISOString()
      });
      
      // تحديث حالة الطلب
      await firebase.firestore().collection('teacher_content').doc(id).update({status: 'approved'});
      if(typeof showToast === 'function') showToast('✅ تم النشر بنجاح');
      window.loadAdminApprovals();
    } catch(e){ console.error(e); }
  };

  window.rejectContent = async function(id){
    try {
      await firebase.firestore().collection('teacher_content').doc(id).update({status: 'rejected'});
      if(typeof showToast === 'function') showToast('🗑️ تم الرفض');
      window.loadAdminApprovals();
    } catch(e){ console.error(e); }
  };


  // ═══════════════════════════════════════════════════════
  // 2. إضافة زرار لوحة الموافقات في شاشة المالك
  // ═══════════════════════════════════════════════════════
  window.addEventListener('load', function(){
    setTimeout(function(){
      var admin = document.getElementById('adminScreen');
      if(admin && !document.getElementById('adminApprovalsBtn')){
        var ac = admin.querySelector('.content');
        if(ac){
          var mBtn = document.createElement('div');
          mBtn.id = 'adminApprovalsBtn';
          mBtn.className = 'menu-item';
          mBtn.innerHTML = '<span style="font-size:26px;">👑</span><span style="flex:1;font-weight:700;color:#E53935;">طلبات المعلمين والمحتوى</span><span style="color:#999;font-size:24px;">‹</span>';
          mBtn.onclick = function(){ window.openAdminApprovals(); };
          ac.insertBefore(mBtn, ac.firstChild);
        }
      }
    }, 6000);
  });

})();
