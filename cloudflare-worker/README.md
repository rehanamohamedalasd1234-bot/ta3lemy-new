# مصادقة الطلاب والمعلمين عبر Cloudflare Worker

ينقل هذا الـWorker التحقق من الحسابات إلى Cloudflare دون Firebase Functions المدفوعة. دخول الطالب الحالي يستخدم تحديًا قصير الصلاحية وإثبات HMAC. دخول المعلم يستخدم اسم مستخدم وكلمة مرور محفوظين في **Secret** داخل Cloudflare، ويصدر Firebase Custom Token بدور `teacher` فقط. لا يرسل المتصفح كلمة المرور كنص صريح، ولا تُحفظ في الموقع.

## الإعداد

1. اربط مجلد `cloudflare-worker` بـWorker اسمه `ta3lemy-auth`، واجعل ملف الدخول `index.mjs`.
2. أضف **Secret** باسم `FIREBASE_SERVICE_ACCOUNT_JSON` والصق محتوى JSON الكامل داخله. لا تضعه في GitHub أو كود الموقع أو رسالة دردشة.
3. لتسجيل دخول المعلمين، أضف **Secret** باسم `TEACHER_LOGIN_CREDENTIALS_JSON`. قيمته كائن JSON يربط كل اسم مستخدم بكلمة مرور قوية، مثل `{"teacher-name":"replace-with-a-random-password-of-16-chars-or-more"}`. استبدل المثال باسم وكلمة مرور تختارهما مباشرة في Cloudflare؛ لا ترسل كلمة المرور في الدردشة. يجب أن تكون كلمة مرور كل معلم 16 حرفًا على الأقل. يمكن وضع أكثر من حساب في الكائن نفسه.
4. اترك متغيري النص العادي `FIREBASE_PROJECT_ID=ta3lemt-hafez` و`APP_ORIGIN=https://rehanamohamedalasd1234-bot.github.io` كما هما في `wrangler.toml`.
5. في Google Cloud IAM امنح حساب الخدمة أقل الصلاحيات اللازمة لقراءة وكتابة Firestore وفحص Firebase Auth. لا توسع قواعد Firestore الخاصة بالمتصفح بدلًا من ذلك.
6. في Google Cloud Console افتح **Firestore → Time-to-live**، وأنشئ سياسات TTL بحقل `ttlExpiresAt` للمجموعات: `auth_challenges` و`teacher_auth_challenges` و`auth_rate_limits` و`auth_registration_limits` و`login_logs`. التحديات تنتهي صلاحيتها داخل Worker حتى قبل حذفها تلقائيًا.
7. انشر Worker واختبر `GET /health`؛ يجب أن يعيد `{"ok":true,"service":"ta3lemy-auth"}`.
8. ضع عنوان Worker المنشور في `TEACHER_AUTH_WORKER_URL` داخل `chat-config.js`. لا يلزم تفعيل `STUDENT_CUSTOM_AUTH_ENABLED` لتسجيل المعلم.

## حدود الصلاحيات

تسجيل الدخول يثبت هوية المعلم ويصدر رمزًا يحمل `role: teacher`؛ لا يمنح دور المالك ولا يخزن كلمة المرور في المتصفح. يظل دخول كل معلم منفصلًا بمعرّف ثابت مشتق من اسم المستخدم، ويمكن إيقافه بحذف اسمه من Secret.

**تسجيل الدخول وحده لا يفتح مجموعات Firestore.** ملف `firestore.rules` الحالي يمنع الوصول إلى بقية المجموعات افتراضيًا؛ لذلك لن تعمل عمليات الدروس أو الطلبات أو غرف البث لمجرد نجاح الدخول. يجب إعداد قواعد ضيقة لكل ميزة ومراجعتها ونشرها على حدة. لا تستخدم `allow read, write: if true` ولا تفتح قاعدة البيانات كلها.

## الأمان والاختبار

يتحقق Worker من كلمة مرور المعلم باستخدام HMAC مرتبط بتحدٍ أحادي الاستخدام صالح لدقيقتين، ويحدّ المحاولات. كلمات المرور وطلبات التحدي لا تصبح متاحة لقواعد المتصفح. غيّر كلمات المرور أو احذف مدخل المعلم من Secret عند الحاجة لإيقافه؛ وقد تبقى الجلسة التي أُصدرت بالفعل صالحة حتى ساعة.

من مجلد `cloudflare-worker` شغّل `node test.mjs` للاختبارات المحلية. لا تتصل الاختبارات ببيانات المشروع ولا تحتاج مفتاح الخدمة.
