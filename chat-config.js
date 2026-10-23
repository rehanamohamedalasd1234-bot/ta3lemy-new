/* Keep false until loginLegacyStudent has been deployed and tested. */
window.STUDENT_CUSTOM_AUTH_ENABLED = false;
/* لا تفعّل الخاص قبل نشر ومراجعة قواعد Firestore وStorage. هذا العلم ليس بديلًا عن القواعد. */
window.CHAT_PRIVATE_ENABLED = false;
window.CHAT_RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};
