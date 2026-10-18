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
      
      var r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      
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

  window.sendDrawingToOwner = async function(canvas){
    if(!window.currentUser){
      if(typeof showToast === 'function') showToast('⚠️ سجل دخول الأول');
      return;
    }
    
    if(typeof showToast === 'function') showToast('⏳ جاري إرسال إبداعك...');
    
    try {
      var dataUrl = canvas.toDataURL('image/png');
      var blob = await (await fetch(dataUrl)).blob();
      var file = new File([blob], 'drawing.png', {type: 'image/png'});
      
      var url = await window.uploadFile(file, 'drawings');
      if(!url) throw new Error('فشل الرفع');
      
      await firebase.firestore().collection('drawing_requests').add({
        studentId: window.currentUser.uid,
        studentName: window.currentUser.name,
        imageUrl: url,
        status: 'pending', 
        createdAt: new Date().toISOString()
      });
      
      if(typeof showToast === 'function') showToast('✅ تم الإرسال! في انتظار موافقة المالك');
      
    } catch(e){
      console.error(e);
      if(typeof showToast === 'function') showToast('❌ فشل الإرسال');
    }
  };

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

  // إضافة زرار مراجعة الإبداعات في لوحة المالك
  window.addEventListener('load', function(){
    setTimeout(function(){
      var admin = document.getElementById('adminScreen');
      if(admin && !document.getElementById('adminDrawingsBtn')){
        var ac = admin.querySelector('.content');
        if(ac){
          var mBtn = document.createElement('div');
          mBtn.id = 'adminDrawingsBtn';
          mBtn.className = 'menu-item';
          mBtn.innerHTML = '<span style="font-size:26px;">🎨</span><span style="flex:1;font-weight:700;color:#F9A825;">مراجعة إبداعات الطلاب</span><span style="color:#999;font-size:24px;">‹</span>';
          mBtn.onclick = function(){ window.openDrawingReviews(); };
          ac.insertBefore(mBtn, ac.firstChild);
        }
      }
    }, 5000);
  });

  // ═══════════════════════════════════════════════════════
  // 2. 📚 نظام المعلمين (تسجيل + رفع تدريبات)
  // ═══════════════════════════════════════════════════════

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

  // إضافة زرار رفع المحتوى للمعلمين في الرئيسية
  window.addEventListener('load', function(){
    setTimeout(function(){
      var toolsGrid = document.querySelector('#homeScreen .tools-grid');
      if(toolsGrid && !document.getElementById('teacherUploadBtn') && (window.currentRole === 'teacher' || window.currentRole === 'owner')){
        var btn = document.createElement('div');
        btn.id = 'teacherUploadBtn';
        btn.className = 'tool-btn';
        btn.innerHTML = '<div class="tool-icon" style="background:#00897B15;color:#00897B;font-size:22px;">📤</div><div class="tool-label">رفع محتوى</div>';
        btn.onclick = function(){ window.openTeacherUpload(); };
        toolsGrid.appendChild(btn);
      }
    }, 6000);
  });

})();
// ═══════════════════════════════════════════════════════
// 🛠️ إصلاح الفرشاة (اللمس والمساحة) للوحة الرسم القديمة
// ═══════════════════════════════════════════════════════

(function(){
  window.addEventListener('load', function(){
    setTimeout(function(){
      var canvas = document.getElementById('fullDrawingCanvas');
      if(!canvas) return;

      // 1. إصلاح المساحة عشان تاخد حجم الشاشة كامل (ومش بتتحرك)
      var container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      var ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      var isDrawing = false;
      var lastX = 0, lastY = 0;

      // 2. دالة دقيقة عشان تجيب مكان الصباع أو الماوس
      function getCoordinates(e) {
        var rect = canvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      }

      // 3. بدء الرسم
      function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        var pos = getCoordinates(e);
        lastX = pos.x;
        lastY = pos.y;
      }

      // 4. الرسم الفعلي
      function draw(e) {
        e.preventDefault();
        if (!isDrawing) return;
        var pos = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
      }

      // 5. إيقاف الرسم
      function stopDraw(e) {
        if(isDrawing) {
          isDrawing = false;
          if(typeof window.saveHistoryState === 'function') window.saveHistoryState();
        }
      }

      // 6. ربط الأحداث (اللمس والماوس)
      // عشان نلغي أي أحداث قديمة متعارضة، بنستخدم "on" بدل addEventListener
      canvas.onmousedown = startDraw;
      canvas.onmousemove = draw;
      canvas.onmouseup = stopDraw;
      canvas.onmouseout = stopDraw;

      canvas.ontouchstart = startDraw;
      canvas.ontouchmove = draw;
      canvas.ontouchend = stopDraw;

      console.log('✅ Brush Fixed with Touch Support');
    }, 1500);
  });
})();
