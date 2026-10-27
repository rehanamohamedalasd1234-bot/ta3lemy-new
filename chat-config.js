/* الطلاب يستخدمون هوية Firebase مجهولة خاصة بالدردشة؛ لا نحتاج ترحيل UID القديم. */
window.STUDENT_CUSTOM_AUTH_ENABLED = false;
/* فعّلي هذا بعد تفعيل Anonymous Authentication ونشر قواعد Firestore المرفقة. */
window.CHAT_PRIVATE_ENABLED = true;
window.CHAT_USE_AUTH_UID = true;
window.CHAT_RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};
