# إعداد «إبداع» وGemini ورفع الرسومات

المصدر المنشور حاليًا يعمل على GitHub Pages. واجهة الرسم والمسودات المحلية تعمل في المتصفح، أما تحويل الرسم ومراجعة المالك والمعرض والإرسال فتحتاج إلى إعداد ونشر وظائف Firebase من حساب مالك المشروع. لم يُنشر شيء من هذا الفرع.

## متطلبات Firebase

من Firebase Console للمشروع `ta3lemt-hafez`:

1. فعّل Firebase Authentication، ومزوّد **Anonymous** للطلاب، ومزوّد **Email/Password** لحساب المالك. أنشئ أو استخدم حسابًا مخصصًا للمالك واحفظ UID الخاص به. أضف النطاق `rehanamohamedalasd1234-bot.github.io` إلى Authorized domains.
2. سجّل تطبيق الويب في Firebase App Check باستخدام reCAPTCHA v3، وأكمل إعداد الموقع في Firebase Console، مع السماح بالنطاق `rehanamohamedalasd1234-bot.github.io`. ضع **Site key العام فقط** في `appCheckSiteKey` داخل `creativity-config.js`. لا تضع سر reCAPTCHA أو مفتاح Gemini في ملفات الموقع.
3. راجع قواعد Firestore الفعلية. ادمج مقتطف `firestore.creativity.rules.txt` مع القواعد القائمة، وأزل أي قاعدة `allow` أوسع تتيح للعميل الوصول إلى مجموعات الإبداع. لا تنشر المقتطف منفردًا مكان قواعد المنصة.

## رفع Cloudinary

أنشئ Upload Preset منفصلًا باسم `creativity_upload` في Cloudinary، بدل إعادة استخدام preset عام للمنصة. اجعله **unsigned** حتى يستطيع المتصفح رفع ملف الطالب، لكن قيّده إلى الصور فقط، وصيغ PNG/JPG/JPEG/WEBP، وحجم أقصى 5 MB، ومجلد `creativity` مع منع الاستبدال. بعد إنشائه، ضع اسمه في `cloudinaryUploadPreset` في `creativity-config.js`، واترك `cloudinaryCloudName` مطابقًا لحساب المنصة.

اسم الـpreset وCloud name إعدادان عامان وليسا أسرارًا. لكن أي unsigned preset قابل للاستدعاء من متصفحات عامة؛ لذلك لا تتركه عامًا بلا قيود. الوظيفة الخادمية تتحقق أيضًا من أن رابط الصورة HTTPS ومن حساب Cloudinary ومجلد `creativity` وامتداد صورة مسموح. فحص الحجم في الواجهة، وحد Cloudinary preset، مطلوبان معًا. إذا احتجت حماية أقوى من إساءة استخدام الرفع، يلزم الانتقال إلى رفع موقّع عبر backend مع تخزين `CLOUDINARY_API_SECRET` في Secret Manager؛ هذا غير مفعّل في هذه النسخة.

## الأسرار والنشر

بعد تثبيت Firebase CLI وتسجيل الدخول من جهاز مالك المشروع، ومن جذر المستودع:

```sh
firebase login
firebase use ta3lemt-hafez
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set CREATIVITY_OWNER_UID
firebase deploy --only functions
```

أدخل مفتاح Gemini API في طلب الطرفية الأول، وUID حساب المالك في الثاني. لا تكتب أيًا منهما في الشيفرة أو المحادثة أو Git. لا تنشر وظائف الإنتاج قبل مراجعة أذونات المشروع وحدود الاستخدام والتكلفة. يتطلب تشغيل Cloud Functions/Secret Manager تهيئة فوترة مناسبة لمشروع Google Cloud.

بعد إعداد App Check وCloudinary preset والأسرار ونشر Functions، أعد تحميل الموقع. تحمي App Check استدعاءات الوظائف، ويُسمح بثلاث محاولات تحويل يوميًا لكل هوية Firebase و12 إرسالًا يوميًا. لا يظهر العمل في المعرض إلا بعد اعتماد المالك، ويمكنه إلغاء نشره لاحقًا.

## بيانات اعتماد وتكاليف

مفتاح Gemini محفوظ عبر Firebase Secret Manager ولا يصل إلى المتصفح. قد تترتب رسوم على Cloud Functions وGemini وCloudinary؛ راجع حدود الاستخدام في حساباتك قبل التفعيل. إعدادات Firebase الفعلية وقواعد المنصة يجب مراجعتها من حساب المالك قبل النشر.
