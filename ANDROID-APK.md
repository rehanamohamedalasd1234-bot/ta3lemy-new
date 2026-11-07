# تطبيق Android لمنصة حافظ

تمت إضافة Capacitor لتغليف نسخة الويب الحالية داخل تطبيق Android حقيقي.

## معلومات التطبيق

- الاسم: منصة حافظ التعليمية
- المعرّف: `com.ta3lemy.hafez`
- رقم الإصدار: يزداد تلقائيًا مع كل بناء منشور.
- نوع النسخة المنشورة: `Release` موقعة بمفتاح ثابت، وقابلة للتثبيت فوق النسخة السابقة.

## البناء المحلي

```bash
npm ci
npm run cap:copy
cd android
./gradlew assembleDebug
```

ينتج الملف في:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## البناء التلقائي

ملف `.github/workflows/build-android.yml` يبني APK Release موقّعًا عند كل تحديث مناسب على `main`، أو يدويًا من تبويب **Actions** ثم **Build Android APK → Run workflow**. بعد انتهاء البناء، يتم تنزيل النسخة من قسم **Artifacts** أو من رابط الإصدار الثابت:

```text
https://github.com/rehanamohamedalasd1234-bot/ta3lemy-new/releases/download/latest/ta3lemy-hafez.apk
```

الرابط نفسه لا يتغير؛ عند نشر تحديث جديد يستبدل GitHub الملف الموجود في إصدار `latest`. يجب تثبيت النسخة الجديدة فوق النسخة السابقة، وليس حذف التطبيق، لأن النسخ الجديدة موقعة بالمفتاح نفسه.

## ملاحظات

هذا الإصدار يستخدم Capacitor ويشغل ملفات الموقع المضمنة محليًا داخل التطبيق. Firebase وSupabase والخدمات الخارجية تحتاج اتصال إنترنت، بينما محتوى وضع عدم الاتصال يعمل حسب الملفات التي يحفظها المستخدم على الجهاز.

ملاحظة: مفتاح التوقيع الحالي مخصص لتوزيع APK المباشر عبر رابط المنصة. إذا تقرر نشر التطبيق على Google Play، يجب نقل التوقيع إلى Google Play App Signing وعدم تغيير المعرّف `com.ta3lemy.hafez`.
