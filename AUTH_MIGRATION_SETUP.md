# ربط حسابات الطلاب بـ Firebase Auth عبر Cloudflare Worker

## الهدف

تُحفظ حسابات الطلاب الحالية في `users/{uid}`، ويُستخدم UID القديم في الرسائل والبيانات. لذلك يمنح Worker الطالب Firebase Custom Token بالـUID نفسه بعد التحقق من كلمة المرور، من دون فتح مجموعة `users` للمتصفح أو الحاجة إلى نشر Firebase Functions المدفوعة.

## الملفات والإعداد الحالي

- `cloudflare-worker/index.mjs`: خدمة الدخول على Cloudflare. يقرأ حساب الخدمة من Secret باسم `FIREBASE_SERVICE_ACCOUNT_JSON`، ويتعامل مع Firestore/Firebase Auth بصلاحيات الخادم.
- `extras.js`: يحسب PBKDF2 في المتصفح ويرسل إثبات HMAC بدل كلمة المرور كنص؛ ثم يسجّل الدخول بـCustom Token.
- `firestore.rules`: قواعد محدودة للملفات العامة، مع بقاء بقية البيانات مغلقة للمتصفح.
- `functions/index.js`: مسار Firebase Functions القديم ما زال محفوظًا في المستودع، لكنه **ليس مطلوبًا لهذا التنفيذ** ولا تنشره لهذا المسار.
- `chat-config.js`: يظل `STUDENT_AUTH_WORKER_URL` فارغًا و`STUDENT_CUSTOM_AUTH_ENABLED=false` إلى أن يُنشر Worker ويجتاز اختبار `/health`. لا تدمج النسخة النشطة قبل إدخال الرابط وتشغيل العلم.
- `PROFILE_PHOTOS_ENABLED` و`CHAT_PRIVATE_ENABLED` يظلان `false` إلى أن تُنشر القواعد المناسبة ويُختبر كل مسار على حدة.

## الترتيب الآمن للتفعيل

1. أنشئ Worker باسم `ta3lemy-auth` من مجلد `cloudflare-worker`.
2. أضف Secret باسم `FIREBASE_SERVICE_ACCOUNT_JSON` والصق JSON الكامل داخل خانة السر فقط. لا تضعه في المستودع أو الموقع أو المحادثة.
3. اترك `FIREBASE_PROJECT_ID=ta3lemt-hafez` و`APP_ORIGIN=https://rehanamohamedalasd1234-bot.github.io` كما هما.
4. في Google Cloud Console ← Firestore ← Time-to-live، أنشئ سياسة للحقل `ttlExpiresAt` لكل مجموعة: `auth_challenges` و`auth_rate_limits` و`auth_registration_limits` و`login_logs`.
5. انشر Worker واختبر `GET /health` حتى يعيد `{"ok":true,"service":"student-auth"}`.
6. بعد نجاح الاختبار، ضَع عنوان Worker المنشور في `STUDENT_AUTH_WORKER_URL` واجعل `STUDENT_CUSTOM_AUTH_ENABLED=true`، ثم انشر الموقع.
7. اختبر حسابًا قديمًا وحسابًا جديدًا، ثم فعّل رفع الصور بعد نشر قواعد `firestore.rules`. لا تفعّل الدردشة الخاصة أو المكالمات بهذه الخطوة؛ لها قواعد مستقلة.

انتهاء صلاحية التحدي يُرفض من Worker بعد دقيقتين حتى لو لم ينفذ TTL الحذف بعد. توثيق Firebase يذكر أن TTL يحذف عادةً خلال 24 ساعة وأن عمليات الحذف تُحسب ضمن عمليات حذف Firestore؛ راقب الحصة المجانية للمشروع.

## حدود الأمان

قواعد المتصفح لا تمنح قراءة أو كتابة لمجموعات الحسابات أو كلمات المرور أو الحدود الداخلية. لا تستخدم قاعدة عامة مثل `allow read, write: if true`. صلاحيات الحساب الخدمي لا تعوّض قواعد Firestore الخاصة بالمتصفح؛ كلاهما منفصل.
