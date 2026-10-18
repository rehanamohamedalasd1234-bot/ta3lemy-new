// ═══════════════════════════════════════════════════════
// extras-v2.js — النسخة النهائية الموحدة
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';

  // 1. لوحة إبداع (تشتغل على أي جهاز)
  window.openDrawing = function(){
    if(window.screenHistory) window.screenHistory.push(window.currentScreen);
    if(typeof showScreen === 'function') showScreen('drawingScreen');
    
    setTimeout(function(){
      var canvas = document.getElementById('fullDrawingCanvas');
      if(!canvas) return;
      
      // ضبط المساحة
      var container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      var ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000000'; // اللون الافتراضي
      ctx.lineWidth = 5;
      
      // متغيرات الرسم
      var isDrawing = false;
      var lastX = 0, lastY = 0;
      
      // دالة تحديد الإحداثيات بدقة
      function getCoords(e) {
        var rect = canvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      }
      
      // بدء الرسم
      function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        var pos = getCoords(e);
        lastX = pos.x;
        lastY = pos.y;
      }
      
      // الرسم
      function draw(e) {
        e.preventDefault();
        if (!isDrawing) return;
        var pos = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
      }
      
      // إيقاف الرسم
      function stopDraw(e) {
        if(isDrawing) {
          isDrawing = false;
          if(typeof window.saveHistoryState === 'function') window.saveHistoryState();
        }
      }
      
      // ربط الأحداث
      canvas.onmousedown = startDraw;
      canvas.onmousemove = draw;
      canvas.onmouseup = stopDraw;
      canvas.onmouseout = stopDraw;
      
      canvas.ontouchstart = startDraw;
      canvas.ontouchmove = draw;
      canvas.ontouchend = stopDraw;
      
      // إضافة زرار الإرسال
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

  // 2. إرسال الرسمة للمالك
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

  // 3. مراجعة الإبداعات للمالك
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

  console.log('✅ extras-v2 (Final) loaded');
})();
