// إصلاح دخول المعلم (بدون رسايل SMS)
window.addEventListener('load', function() {
  setTimeout(function() {
    // تعديل زرار المعلم عشان يفتح الشاشة العادية بدل شاشة الـ SMS
    var origSelectRole = window.selectRole;
    window.selectRole = function(btn, role) {
      if (origSelectRole) origSelectRole(btn, role);
      
      // لو اختار معلم، هنخليه يظهر شاشة الدخول العادية (الاسم والباسورد)
      if (role === 'teacher') {
        var phoneGroup = document.getElementById('phoneGroup');
        if (phoneGroup) phoneGroup.style.display = 'none'; // إخفاء خانة الموبايل
        
        var ownerCodeGroup = document.getElementById('ownerCodeGroup');
        if (ownerCodeGroup) ownerCodeGroup.style.display = 'none';
      }
    };
    
    console.log('✅ Teacher Login Fixed (No SMS)');
  }, 3000);
});
