// إصلاح مشكلة الرسم
window.addEventListener('load', function() {
  setTimeout(function() {
    // استبدال دالة initFullCanvas القديمة بدالة جديدة
    window.initFullCanvas = function() {
      var canvas = document.getElementById('fullDrawingCanvas');
      if (!canvas) return;
      
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      var ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      window.fullCanvas = canvas;
      window.fullCtx = ctx;
      window.isDrawing = false;
      window.currentColor = '#000000';
      window.currentSize = 5;
      window.isEraser = false;
      
      // مسح أي أحداث قديمة
      canvas.onmousedown = null;
      canvas.onmousemove = null;
      canvas.onmouseup = null;
      canvas.onmouseleave = null;
      canvas.ontouchstart = null;
      canvas.ontouchmove = null;
      canvas.ontouchend = null;
      
      function getPos(e) {
        var r = canvas.getBoundingClientRect();
        var cx = e.touches ? e.touches[0].clientX : e.clientX;
        var cy = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (cx - r.left) * (canvas.width / r.width),
          y: (cy - r.top) * (canvas.height / r.height)
        };
      }
      
      function start(e) {
        e.preventDefault();
        window.isDrawing = true;
        var p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      }
      
      function draw(e) {
        e.preventDefault();
        if (!window.isDrawing) return;
        var p = getPos(e);
        ctx.strokeStyle = window.isEraser ? '#FFFFFF' : window.currentColor;
        ctx.lineWidth = window.isEraser ? (window.currentSize * 3) : window.currentSize;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      
      function stop() {
        if (window.isDrawing) {
          window.isDrawing = false;
        }
      }
      
      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stop);
      canvas.addEventListener('mouseleave', stop);
      
      canvas.addEventListener('touchstart', start, {passive: false});
      canvas.addEventListener('touchmove', draw, {passive: false});
      canvas.addEventListener('touchend', stop);
    };
  }, 2000);
});
