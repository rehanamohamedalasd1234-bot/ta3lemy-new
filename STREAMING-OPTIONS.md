# قرار مزود البث — LiveKit

**اختيار المستخدم (20 أكتوبر 2026):** LiveKit Cloud، مع اشتراط تشغيل أكثر من غرفة في الوقت نفسه. يتكون التنفيذ من سجل مستقل في Firestore واسم غرفة LiveKit مستقل لكل غرفة؛ لا يمنع بدء غرفة بدء غرفة أخرى. تعرض لوحة المالك كل الغرف وتتيح مراقبة غرفة مختارة أو إيقاف غرفة واحدة أو جميع الغرف المباشرة.

## حدود السعة

وفق صفحة LiveKit الرسمية، تتضمن خطة Build المجانية حدًا إجماليًا قدره 100 مشارك متصل عبر جميع الغرف، و5,000 دقيقة WebRTC شهريًا؛ السعة ليست 100 لكل غرفة. يحجز التنفيذ اتصالًا واحدًا لمراقبة المالك، فيكون حد اتصالات المعلمين والطلاب مجتمعةً 99 كحد أقصى على الخطة المجانية. حد أقصى لكل غرفة ومدة البث يضبطهما المالك عند الموافقة. يجب مراجعة لوحة حساب LiveKit قبل الاستخدام ومراقبة أي تغيير في الخطة أو الحصص.

## حدود الواجهة والأجهزة

كل تبويب للمعلم أو المالك يتصل بغرفة واحدة في الوقت نفسه؛ تشغيل عدة غرف بالتوازي يكون عبر معلمين/جلسات مستقلة، ويمكن للمالك التبديل إلى الغرفة التي يريد مراقبتها. ملف LiveKit Web SDK مضمن محليًا ومحوّل نحويًا لاستهداف Chrome 51 لتقليل مشكلات تحليل JavaScript في WebView أندرويد 7 القديم، لكن هذا لا يضيف WebRTC APIs المفقودة ولا يثبت التوافق. يجب إجراء اختبار فعلي على Android 7 وWindows 7 قبل إعلان دعمهما.

## الأمان والنشر

مفتاح LiveKit والسر محفوظان فقط في Firebase Secret Manager، والرموز قصيرة العمر تصدرها Cloud Functions بعد تحقق الدور والموافقة. لا تُدمج الأسرار في ملفات JavaScript أو Git. تفاصيل التهيئة والنشر في [`LIVE-BROADCAST-SETUP.md`](LIVE-BROADCAST-SETUP.md).

## مصادر رسمية

- [LiveKit Server SDK for JavaScript](https://docs.livekit.io/reference/server-sdk-js/)
- [LiveKit: رموز الدخول والصلاحيات](https://docs.livekit.io/frontends/authentication/tokens/)
- [LiveKit: إدارة الغرف والمشاركين](https://docs.livekit.io/reference/other/roomservice-api/)
- [LiveKit: الحصص وحدود التزامن](https://docs.livekit.io/deploy/admin/quotas-and-limits/)
- [LiveKit: الأسعار](https://livekit.com/pricing.md)
- [Firebase: Scheduled Functions](https://firebase.google.com/docs/functions/schedule-functions)
