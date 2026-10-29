// زرار درس حرف الألف للصف الأول
window.addEventListener('load', function() {
  setInterval(function() {
    // لو إحنا في صفحة المناهج واخترنا الصف الأول واللغة العربية
    var title = document.getElementById('contentTitle');
    if (title && title.textContent.includes('الدروس')) {
      var list = document.getElementById('contentList');
      if (list && !document.getElementById('alefBtn')) {
        // نضيف زرار الدرس فوق القائمة
        var btn = document.createElement('div');
        btn.id = 'alefBtn';
        btn.style.cssText = 'background:linear-gradient(135deg,#E65100,#FF9800);color:#fff;padding:18px;border-radius:16px;margin-bottom:12px;text-align:center;cursor:pointer;font-weight:bold;font-size:16px;';
        btn.innerHTML = '🔤 درس حرف الألف (جديد)';
        btn.onclick = function() {
          if (typeof window.openLessonAlef === 'function') {
            window.openLessonAlef();
          } else {
            if(typeof showToast === 'function') showToast('⚠️ الملف مش متحمل');
          }
        };
        list.insertBefore(btn, list.firstChild);
      }
    }
  }, 2000);
});
