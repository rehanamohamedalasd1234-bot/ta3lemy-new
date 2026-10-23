# مصادقة الطلاب عبر Cloudflare Worker

ينقل هذا الـWorker التحقق من حسابات الطلاب من Firebase Functions إلى Cloudflare، دون فتح مجموعة `users` للمتصفح أو استبدال سجلات الطلاب الحالية. لا تُرسل كلمة المرور كنص صريح: يحسب المتصفح PBKDF2 باستخدام Web Crypto، ثم يرسل إثبات HMAC مرتبطًا بتحدٍّ قصير الصلاحية. يحفظ Worker التحقق في Firestore ويصدر Firebase Custom Token بعد نجاحه. محاولات كود الاستعادة محدودة على مستوى الحساب، وحجم الطلب محدود أثناء القراءة.

## الإعداد

1. اربط مجلد `cloudflare-worker` بـWorker اسمه `ta3lemy-auth`، واجعل ملف الدخول `index.mjs`.
2. في إعدادات Worker أضف **Secret** باسم `FIREBASE_SERVICE_ACCOUNT_JSON`، والصق محتوى JSON الكامل داخل خانة السر. لا تضعه في GitHub أو كود الموقع أو رسالة دردشة.
3. اترك متغيري النص العادي `FIREBASE_PROJECT_ID=ta3lemt-hafez` و`APP_ORIGIN=https://rehanamohamedalasd1234-bot.github.io` كما هما في `wrangler.toml`.
4. في Google Cloud IAM امنح حساب الخدمة أقل الصلاحيات اللازمة لقراءة وكتابة Firestore وفحص Firebase Auth. لا توسع قواعد Firestore الخاصة بالمتصفح بدلًا من ذلك.
5. في Google Cloud Console افتح **Firestore → Time-to-live**، وأنشئ سياسات TTL بحقل `ttlExpiresAt` لمجموعات المستندات التالية: `auth_challenges` و`auth_rate_limits` و`auth_registration_limits` و`login_logs`. احذف الأكواد والسجلات المنتهية تلقائيًا بهذه السياسات. يتعامل Worker مع وقت انتهاء التحدي بنفسه ولا يقبل التحديات المنتهية حتى لو لم يحذفها TTL بعد.
6. انشر Worker واختبر `GET /health`؛ يجب أن يعيد `{"ok":true,"service":"student-auth"}`.
7. بعد النشر والاختبار، ضع عنوان Worker المنشور في `STUDENT_AUTH_WORKER_URL` داخل `chat-config.js`، ثم فعّل تسجيل الطلاب في الموقع. لا تفعّل رفع الصور قبل نشر قواعد `firestore.rules` المحدودة.

**ملاحظة حول الحصة:** وثائق Firebase تنص على أن حذف TTL يُحسب ضمن عمليات حذف Firestore، ويمكن أن يستغرق الحذف الفعلي حتى 24 ساعة. تحقق من استخدام الحصة المجانية للمشروع؛ TTL للتنظيف وليس شرطًا لقبول أو رفض تسجيل الدخول. لا حاجة إلى Firebase Functions لهذا المسار.

## الأمان والاختبار

تُحسب PBKDF2 على جهاز الطالب، بما في ذلك ترحيل الحسابات القديمة؛ لذلك لا ينفذ Worker PBKDF2 الثقيلة. ملفات كلمات المرور وطلبات التحدي وحدود المحاولات غير متاحة لقواعد المتصفح. استخدم سر الخدمة كـSecret فقط، ولا تضعه في المستودع أو في صفحة الموقع.

من مجلد `cloudflare-worker` شغّل `node test.mjs` لفحص توافق الخوارزميات وإثبات HMAC وtimestamps الخاصة بـTTL وحد الطلب. الاختبارات محلية ولا تتصل ببيانات المشروع ولا تحتاج مفتاح الخدمة.
