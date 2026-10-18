window.addEventListener('load', function() {
  // تأخير بسيط عشان نتأكد إن الصفحة حملت
  setTimeout(function() {
    // تحميل ملف teacher.js
    var t = document.createElement('script');
    t.src = './teacher.js';
    document.body.appendChild(t);

    // تحميل ملف owner-approvals.js
    var o = document.createElement('script');
    o.src = './owner-approvals.js';
    document.body.appendChild(o);
  }, 1500);
});
