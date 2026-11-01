// إصلاحات واجهة عامة؛ أدوات الرسم تُدار الآن من creativity.js.
(function () {
  window.addEventListener('load', function () {
    var style = document.createElement('style');
    style.textContent = '#emojiPicker{position:fixed!important;bottom:120px!important;left:50%!important;transform:translateX(-50%)!important;z-index:99999!important;}';
    document.head.appendChild(style);

    // الإبقاء على السلوك القديم لإخفاء القائمة السريعة إن أضافتها نسخة سابقة.
    window.setInterval(function () {
      var quickMenu = document.getElementById('quickMenu');
      if (quickMenu) quickMenu.remove();
    }, 3000);
  });
})();
