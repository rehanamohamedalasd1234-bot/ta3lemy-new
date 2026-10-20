// واجهة توافق للمعلم — كل فتح بث جديد يمر الآن من طلب موافقة المالك.
(function () {
  'use strict';
  window.openTeacherDashboard = function () {
    if (window.currentRole !== 'teacher' && window.currentRole !== 'owner') {
      if (window.showToast) window.showToast('هذه الصفحة للمعلمين فقط');
      return;
    }
    if (typeof window.openTeacherControl === 'function') return window.openTeacherControl();
    if (typeof window.openTeacherHub === 'function') return window.openTeacherHub();
  };
  window.openTeacherBroadcast = function () {
    if (typeof window.openBroadcast === 'function') return window.openBroadcast();
    if (window.showToast) window.showToast('انتظر تحميل أدوات البث');
  };
  window.openJitsiRoom = function (roomId) {
    if (!roomId) return;
    var name = (window.currentUser && window.currentUser.name) || 'مشارك';
    window.open('https://meet.jit.si/' + encodeURIComponent(roomId) + '#userInfo.displayName=%22' + encodeURIComponent(name) + '%22', '_blank');
  };
})();
