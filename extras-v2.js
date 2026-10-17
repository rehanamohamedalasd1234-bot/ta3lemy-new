// ═══════════════════════════════════════════════════════
// extras-v2.js — التطويرات الكبيرة (لوحة إبداع + المعلمين)
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  console.log('🚀 Loading extras-v2...');

  // ═══════════════════════════════════════════════════════
  // 1. 🎨 لوحة الرسم "إبداع" الموسعة + إرسال للمالك
  // ═══════════════════════════════════════════════════════
  
  window.openDrawing = function(){
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('drawingScreen');
    
    setTimeout(function(){
      var canvas = document.getElementById('fullDrawingCanvas');
      if(!canvas) return;
      
      // تكبير اللوحة
      var container = canvas.parentElement;
      container.style.height = 'calc(100vh - 140px)'; // مساحة أكبر
      
      // إعادة تهيئة الأبعاد
      var r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      
      // إضافة زرار "إرسال للمالك" لو مش موجود
      var toolbar = canvas.parentElement.previousElementSibling;
      if(toolbar && !document.getElementById('sendToOwnerBtn')){
        var sendBtn = document.createElement('button');
        sendBtn.id = 'sendToOwnerBtn';
        sendBtn.innerHTML = '📤 إرسال للمالك';
        sendBtn.style.cssText = 'background:#F9A825;color:#fff;border:none;padding:8px 12px;border-radius:10px;font-family:inherit;font-weight:bold;font-size:13px;cursor:pointer;flex-shrink:0;';
        sendBtn.onclick = function(){
          window.sendDrawingToOwner(canvas);
        };
        toolbar.appendChild(sendBtn);
      }
    }, 500);
  };

  // إرسال الرسمة للمالك
  window.sendDrawingToOwner = async function(canvas){
    if(!window.currentUser){
      if(typeof showToast === 'function') showToast('⚠️ سجل دخول الأول');
      return;
    }
    
    if(typeof showToast === 'function') showToast('⏳ جاري إرسال إبداعك...');
    
    try {
      // تحويل الرسمة لصورة
      var dataUrl = canvas.toDataURL('image/png');
      
      // رفع الصورة على Cloudinary
      var blob = await (await fetch(dataUrl)).blob();
      var file = new File([blob], 'drawing.png', {type: 'image/png'});
      
      var url = await window.uploadFile(file, 'drawings');
      if(!url) throw new Error('فشل الرفع');
      
      // حفظ الطلب في Firestore
      await firebase.firestore().collection('drawing_requests').add({
        studentId: window.currentUser.uid,
        studentName: window.currentUser.name,
        imageUrl: url,
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString()
      });
      
      if(typeof showToast === 'function') showToast('✅ تم الإرسال! في انتظار موافقة المالك');
      
    } catch(e){
      console.error(e);
      if(typeof showToast === 'function') showToast('❌ فشل الإرسال');
    }
  };

  // شاشة المالك لمراجعة الرسومات
  window.openDrawingReviews = async function(){
    if(window.currentRole !== 'owner'){
      if(typeof showToast === 'function') showToast('⚠️ مسموح للمالك فقط');
      return;
    }
    
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    
    var screen = document.getElementById('drawingReviewsScreen');
    if(!screen){
      screen = document.createElement('div');
      screen.id = 'drawingReviewsScreen';
      screen.className = 'screen';
      screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#F9A825,#FBC02D);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>🎨 مراجعة الإبداعات</span></div><div style="width:42px;"></div></div><div class="content" id="drawingReviewsContent"></div>';
      document.body.appendChild(screen);
    }
    
    if(typeof showScreen === 'function') showScreen('drawingReviewsScreen');
    window.loadDrawingReviews();
  };

  window.loadDrawingReviews = async function(){
    var c = document.getElementById('drawingReviewsContent');
    c.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳ جاري التحميل...</p>';
    
    try {
      var snap = await firebase.firestore().collection('drawing_requests')
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc').get();
        
      if(snap.empty){
        c.innerHTML = '<div class="empty-state"><p>لا توجد رسومات في انتظار المراجعة</p></div>';
        return;
      }
      
      var html = '';
      snap.forEach(function(doc){
        var d = doc.data();
        html += '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);">';
        html += '<div style="font-weight:bold;margin-bottom:8px;">👤 ' + d.studentName + '</div>';
        html += '<img src="' + d.imageUrl + '" style="width:100%;border-radius:10px;margin-bottom:10px;">';
        html += '<div style="display:flex;gap:8px;">';
        html += '<button onclick="approveDrawing(\'' + doc.id + '\',\'' + d.imageUrl + '\')" style="flex:1;background:#2E7D32;color:#fff;border:none;padding:10px;border-radius:10px;font-weight:bold;cursor:pointer;">✅ موافقة ونشر</button>';
        html += '<button onclick="rejectDrawing(\'' + doc.id + '\')" style="flex:1;background:#E53935;color:#fff;border:none;padding:10px;border-radius:10px;font-weight:bold;cursor:pointer;">❌ رفض</button>';
        html += '</div></div>';
      });
      c.innerHTML = html;
    } catch(e){ console.error(e); }
  };

  window.approveDrawing = async function(id, imageUrl){
    try {
      await firebase.firestore().collection('drawing_requests').doc(id).update({status: 'approved'});
      // نشر الرسمة كمنشور في الأخبار
      await firebase.firestore().collection('posts').add({
        title: '🎨 إبداع طالب',
        content: 'تم تكريم إبداع جديد من طلابنا المتميزين!',
        image_url: imageUrl,
        author_id: window.currentUser.uid,
        author_name: 'إدارة المنصة',
        created_at: new Date().toISOString()
      });
      if(typeof showToast === 'function') showToast('✅ تمت الموافقة والنشر');
      window.loadDrawingReviews();
    } catch(e){ console.error(e); }
  };

  window.rejectDrawing = async function(id){
    try {
      await firebase.firestore().collection('drawing_requests').doc(id).update({status: 'rejected'});
      if(typeof showToast === 'function') showToast('🗑️ تم الرفض');
      window.loadDrawingReviews();
    } catch(e){ console.error(e); }
  };

  // ═══════════════════════════════════════════════════════
  // 2. 📚 نظام المعلمين (تسجيل + رفع تدريبات)
  // ═══════════════════════════════════════════════════════

  // شاشة رفع المحتوى للمعلم
  window.openTeacherUpload = function(){
    if(window.currentRole !== 'teacher' && window.currentRole !== 'owner'){
      if(typeof showToast === 'function') showToast('⚠️ مسموح للمعلمين فقط');
      return;
    }
    
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    
    var screen = document.getElementById('teacherUploadScreen');
    if(!screen){
      screen = document.createElement('div');
      screen.id = 'teacherUploadScreen';
      screen.className = 'screen';
      screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#00897B,#26A69A);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>📤 رفع محتوى</span></div><div style="width:42px;"></div></div><div class="content">' +
        '<div class="form-group"><label class="form-label">عنوان المحتوى</label><input type="text" class="form-input" id="tTitle"></div>' +
        '<div class="form-group"><label class="form-label">المرحلة</label><select class="form-input" id="tStage"><option value="primary">ابتدائي</option><option value="prep">إعدادي</option><option value="sec">ثانوي</option></select></div>' +
        '<div class="form-group"><label class="form-label">الصف</label><select class="form-input" id="tGrade"><option value="الأول">الأول</option><option value="الثاني">الثاني</option><option value="الثالث">الثالث</option></select></div>' +
        '<div class="form-group"><label class="form-label">المادة</label><input type="text" class="form-input" id="tSubject" placeholder="مثال: رياضيات"></div>' +
        '<div class="form-group"><label class="form-label">الترم</label><select class="form-input" id="tTerm"><option value="1">الترم الأول</option><option value="2">الترم الثاني</option></select></div>' +
        '<div class="form-group"><label class="form-label">نوع المحتوى</label><select class="form-input" id="tType"><option value="exercises">تدريبات</option><option value="exams">امتحانات</option><option value="lessons">شرح</option></select></div>' +
        '<div class="form-group"><label class="form-label">📝 المحتوى (نص)</label><textarea class="form-input" id="tContent" rows="4"></textarea></div>' +
        '<div class="form-group"><label class="form-label">📷 صورة/فيديو (اختياري)</label><input type="file" class="form-input" id="tFile" accept="image/*,video/*" style="padding:10px;"></div>' +
        '<button class="btn-primary" id="tSubmitBtn" onclick="submitTeacherContent()" style="background:linear-gradient(135deg,#00897B,#26A69A);">📤 إرسال للمراجعة</button>' +
        '</div>';
      document.body.appendChild(screen);
    }
    
    if(typeof showScreen === 'function') showScreen('teacherUploadScreen');
  };

  window.submitTeacherContent = async function(){
    var title = document.getElementById('tTitle').value.trim();
    var stage = document.getElementById('tStage').value;
    var grade = document.getElementById('tGrade').value;
    var subject = document.getElementById('tSubject').value.trim();
    var term = document.getElementById('tTerm').value;
    var type = document.getElementById('tType').value;
    var content = document.getElementById('tContent').value.trim();
    var file = document.getElementById('tFile').files[0];
    var btn = document.getElementById('tSubmitBtn');
    
    if(!title || !subject){
      if(typeof showToast === 'function') showToast('⚠️ أكمل البيانات');
      return;
    }
    
    if(btn){ btn.disabled = true; btn.textContent = '⏳ جاري الرفع...'; }
    
    try {
      var fileUrl = null;
      if(file) fileUrl = await window.uploadFile(file, 'teacher_content');
      
      await firebase.firestore().collection('teacher_content').add({
        title: title,
        stage: stage,
        grade: grade,
        subject: subject,
        term: parseInt(term),
        type: type,
        content: content,
        fileUrl: fileUrl,
        teacherId: window.currentUser.uid,
        teacherName: window.currentUser.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      if(typeof showToast === 'function') showToast('✅ تم الإرسال! في انتظار موافقة الإدارة');
      
      if(btn){ btn.disabled = false; btn.textContent = '📤 إرسال للمراجعة'; }
      document.getElementById('tTitle').value = '';
      document.getElementById('tContent').value = '';
      if(document.getElementById('tFile')) document.getElementById('tFile').value = '';
      
    } catch(e){
      console.error(e);
      if(btn){ btn.disabled = false; btn.textContent = '📤 إرسال للمراجعة'; }
      if(typeof showToast === 'function') showToast('❌ فشل الرفع');
    }
  };

})();
