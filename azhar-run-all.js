// ═══════════════════════════════════════════════════════
// 🚀 azhar-run-all.js — تشغيل كل المحتوى مرة واحدة
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  setTimeout(function() {
    // قائمة بكل الملفات اللي إحنا عملناها
    var contentFiles = [
      './azhar-fiqh-content.js',
      './azhar-fiqh-lessons.js',
      './azhar-hadith-content.js',
      './azhar-aqeeda-content.js',
      './azhar-seera-content.js',
      './azhar-nahw-content.js',
      './azhar-quran-content.js',
      './azhar-exercises-exams.js'
    ];

    // تشغيل كل ملف فيهم
    contentFiles.forEach(function(file) {
      var s = document.createElement('script');
      s.src = file;
      document.body.appendChild(s);
      console.log('تم تحميل: ' + file);
    });
  }, 3000);
});
