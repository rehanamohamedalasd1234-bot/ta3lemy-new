// ═══════════════════════════════════════════════════════
// drawing-new.js - نظام الرسم الجديد (مضمون 100%)
// ═══════════════════════════════════════════════════════

var c, ctx, drawing = false;
var currentColor = '#000000';
var currentSize = 5;
var isEraser = false;

window.openDrawing = function() {
  if(window.screenHistory) window.screenHistory.push(window.currentScreen);
  if(typeof showScreen === 'function') showScreen('drawingScreen');
  
  setTimeout(function() {
    c = document.getElementById('fullDrawingCanvas');
    if(!c) return;
    
    // ضبط أبعاد الكانفاس
    var rect = c.getBoundingClientRect();
    c.width = rect.width;
    c.height = rect.height;
    
    ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
    
    // إعدادات الفرشة
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // مسح أي أحداث قديمة
    c.onmousedown = null;
    c.onmousemove = null;
    c.onmouseup = null;
    c.ontouchstart = null;
    c.ontouchmove = null;
    c.ontouchend = null;
    
    // دالة تحديد مكان الماوس أو الصباع
    function getPos(e) {
      var r = c.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (cx - r.left) * (c.width / r.width),
        y: (cy - r.top) * (c.height / r.height)
      };
    }
    
    // أحداث الرسم
    function start(e) {
      e.preventDefault();
      drawing = true;
      var p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    
    function draw(e) {
      e.preventDefault();
      if(!drawing) return;
      var p = getPos(e);
      ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
      ctx.lineWidth = isEraser ? (currentSize * 3) : currentSize;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    
    function stop() {
      if(drawing) {
        drawing = false;
      }
    }
    
    // ربط الأحداث
    c.addEventListener('mousedown', start);
    c.addEventListener('mousemove', draw);
    c.addEventListener('mouseup', stop);
    c.addEventListener('mouseleave', stop);
    c.addEventListener('touchstart', start, {passive: false});
    c.addEventListener('touchmove', draw, {passive: false});
    c.addEventListener('touchend', stop);
    
  }, 100);
};

// دوال الألوان
window.drawingSetColor = function(color) {
  currentColor = color;
  isEraser = false;
};

window.drawingSetEraser = function() {
  isEraser = true;
};

window.drawingSetSize = function(size) {
  currentSize = size;
};

window.drawingClearAll = function() {
  if(!c || !ctx) return;
  if(confirm('مسح كل الرسم؟')) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
  }
};

window.drawingSave = function() {
  if(!c) return;
  var link = document.createElement('a');
  link.download = 'my-drawing.png';
  link.href = c.toDataURL();
  link.click();
};

// دالة إرسال للمالك (بنفس الطريقة السابقة)
window.sendDrawingToOwner = async function(canvas) {
  if(!window.currentUser) {
    if(typeof showToast === 'function') showToast('⚠️ سجل دخول الأول');
    return;
  }
  
  if(typeof showToast === 'function') showToast('⏳ جاري الإرسال...');
  
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
    
    if(typeof showToast === 'function') showToast('✅ تم الإرسال!');
    
  } catch(e) {
    console.error(e);
    if(typeof showToast === 'function') showToast('❌ فشل الإرسال');
  }
};
