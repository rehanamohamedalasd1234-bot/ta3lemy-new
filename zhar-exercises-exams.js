// ═══════════════════════════════════════════════════════
// 🎯 azhar-exercises-exams.js — التدريبات والامتحانات
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  setTimeout(async function() {
    try {
      var fs = firebase.firestore();
      
      // التأكد من عدم التكرار
      var check = await fs.collection('lessons').where('title', '==', 'تدريبات الفقه').get();
      if (!check.empty) return;

      var contentData = [
        // ═══ تدريبات الفقه ═══
        {
          title: 'تدريبات الفقه',
          content: 'اختبر معلوماتك في مادة الفقه (الطهارة والصلاة).',
          question: 'ما هو حكم قراءة الفاتحة في الصلاة؟',
          answer: 'فرض (ركن) لا تصح الصلاة بدونها.',
          subject: 'الفقه', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exercises'
        },
        {
          title: 'امتحان الفقه',
          content: 'امتحان شامل على أبواب الطهارة والصلاة.',
          question: 'اذكر أربعة من شروط صحة الصلاة، وثلاثة من نواقض الوضوء.',
          answer: 'شروط الصلاة: الطهارة، ستر العورة، استقبال القبلة، دخول الوقت. نواقض الوضوء: البول، الريح، النوم العميق.',
          subject: 'الفقه', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exams'
        },

        // ═══ تدريبات الحديث ═══
        {
          title: 'تدريبات الحديث الشريف',
          content: 'اختبر فهمك لأحاديث الترم الأول.',
          question: 'أكمل الحديث: "إنما الأعمال بـ..."',
          answer: 'النيات.',
          subject: 'الحديث الشريف', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exercises'
        },
        {
          title: 'امتحان الحديث الشريف',
          content: 'امتحان شامل على أحاديث النية وحلاوة الإيمان.',
          question: 'اذكر ثلاثاً من فوائد حديث "حلاوة الإيمان".',
          answer: '1. الإيمان له حلاوة يذوقها المؤمنون. 2. وجوب تقديم محبة الله ورسوله. 3. الحب في الله من علامات كمال الإيمان.',
          subject: 'الحديث الشريف', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exams'
        },

        // ═══ تدريبات العقيدة ═══
        {
          title: 'تدريبات العقيدة',
          content: 'اختبر معلوماتك في أصول الدين.',
          question: 'ما هو دليل الفطرة على وجود الله؟',
          answer: 'فطرة الإنسان السليمة تشهد بوجود خالق لهذا الكون.',
          subject: 'أصول الدين (العقيدة)', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exercises'
        },

        // ═══ تدريبات النحو ═══
        {
          title: 'تدريبات النحو',
          content: 'تدريبات على المبتدأ والخبر وكان وأخواتها.',
          question: 'أعرب: "كان الجوُّ جميلاً".',
          answer: 'كان: فعل ماض ناقص. الجوُّ: اسم كان مرفوع. جميلاً: خبر كان منصوب.',
          subject: 'النحو والصرف', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exercises'
        }
      ];

      for (var i = 0; i < contentData.length; i++) {
        var item = contentData[i];
        item.created_at = new Date().toISOString();
        await fs.collection('lessons').add(item);
      }

      console.log('✅ تم إضافة التدريبات والامتحانات بنجاح!');
    } catch(e) {
      console.error('خطأ:', e);
    }
  }, 4000);
});
