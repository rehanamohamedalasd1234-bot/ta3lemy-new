// ═══════════════════════════════════════════════════════
// extras-patch.js — النسخة النظيفة (إصلاحات فقط)
// ═══════════════════════════════════════════════════════

(function(){
  console.log('🔧 Loading extras-patch...');

  window.addEventListener('load', function(){
    
    // 1. إصلاح ألوان الرسم
    setInterval(function(){
      var canvas = document.getElementById('fullDrawingCanvas') || document.getElementById('drwCanvas');
      if(!canvas) return;
      var ctx = canvas.getContext('2d');
      
      // ربط أزرار الألوان
      var colorBtns = document.querySelectorAll('button[onclick*="drawingSetColor"], button[style*="background-color"], input[type="color"]');
      colorBtns.forEach(function(btn){
        btn.onclick = function(){
          if(this.value) ctx.strokeStyle = this.value;
          else if(this.style.backgroundColor) ctx.strokeStyle = this.style.backgroundColor;
        };
      });
    }, 2000);

    // 2. إصلاح الإيموشن في الأخبار
    var style = document.createElement('style');
    style.textContent = 
      '#emojiPicker { position: fixed !important; bottom: 120px !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 99999 !important; }';
    document.head.appendChild(style);

    // 3. إخفاء القائمة السريعة
    setInterval(function(){
      var q = document.getElementById('quickMenu');
      if(q) q.remove();
    }, 3000);

    console.log('✅ extras-patch.js loaded successfully');
  });
})();
