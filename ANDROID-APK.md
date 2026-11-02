# تطبيق Android لمنصة حافظ

تمت إضافة Capacitor لتغليف نسخة الويب الحالية داخل تطبيق Android حقيقي.

## معلومات التطبيق

- الاسم: منصة حافظ التعليمية
- المعرّف: `com.ta3lemy.hafez`
- رقم الإصدار الحالي: `1.0.77`
- رقم البناء: `77`

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

ملف `.github/workflows/build-android.yml` يبني APK Debug عند كل تحديث مناسب على `main`، أو يدويًا من تبويب **Actions** ثم **Build Android APK → Run workflow**. بعد انتهاء البناء، يتم تنزيل APK من قسم **Artifacts**.

## ملاحظات

هذا الإصدار يستخدم Capacitor ويشغل ملفات الموقع المضمنة محليًا داخل التطبيق. Firebase وSupabase والخدمات الخارجية تحتاج اتصال إنترنت، بينما محتوى وضع عدم الاتصال يعمل حسب الملفات التي يحفظها المستخدم على الجهاز.

نسخة Release الموقعة للنشر على Google Play تحتاج مفتاح توقيع خاصًا لا يجب وضعه داخل المستودع. يمكن إعدادها لاحقًا باستخدام GitHub Secrets أو على جهاز المالك.
