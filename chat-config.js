/* عنوان Worker عام؛ نضعه بعد النشر. لا تضع أي مفتاح سري هنا. */
window.STUDENT_AUTH_WORKER_URL = '';
/* يمكن للمعلمين استخدام عنوان Worker نفسه؛ لا تضع كلمات مرور هنا. */
window.TEACHER_AUTH_WORKER_URL = '';
/* اتركه false حتى نشر Worker ووضع رابطه؛ فعّله بعد اختبار /health. */
window.STUDENT_CUSTOM_AUTH_ENABLED = false;
/* فعّل هذا فقط بعد نشر قواعد public_profiles المحدودة. */
window.PROFILE_PHOTOS_ENABLED = false;
/* لا تفعّل الخاص قبل مراجعة قواعد Firestore وStorage؛ الصور إعداد مستقل. */
window.CHAT_PRIVATE_ENABLED = false;
window.CHAT_RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};
