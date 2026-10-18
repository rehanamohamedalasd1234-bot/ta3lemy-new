// ═══════════════════════════════════════════════════════
// 📚 azhar-all-content.js — باقي المواد الشرعية للأزهر
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  setTimeout(async function() {
    try {
      var fs = firebase.firestore();
      
      // التأكد من عدم التكرار
      var check = await fs.collection('lessons').where('title', '==', 'الحديث الشريف - الدرس الأول').get();
      if (!check.empty) return;

      var contentData = [
        // ═══ الحديث الشريف ═══
        { title: 'الحديث الشريف - الدرس الأول', content: 'الحديث النبوي هو ما أضيف إلى النبي ﷺ من قول أو فعل أو تقرير أو صفة. قال ﷺ: (إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى).', subject: 'الحديث الشريف', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'lessons' },
        { title: 'تدريب: الحديث الشريف', content: 'اختر الإجابة الصحيحة:', question: 'ما هو تعريف الحديث النبوي؟', answer: 'ما أضيف إلى النبي من قول أو فعل أو تقرير.', subject: 'الحديث الشريف', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exercises' },
        
        // ═══ الفقه ═══
        { title: 'الفقه - الطهارة', content: 'الطهارة هي رفع الحدث وإزالة النجس. وتنقسم إلى: طهارة كبرى (الغسل) وطهارة صغرى (الوضوء).', subject: 'الفقه', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'lessons' },
        { title: 'امتحان الفقه', content: 'ما هي شروط صحة الوضوء؟', question: 'اذكر شروط صحة الوضوء.', answer: 'الإسلام، العقل، النية، الماء الطهور.', subject: 'الفقه', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exams' },

        // ═══ العقيدة ═══
        { title: 'العقيدة - الإيمان بالله', content: 'الإيمان بالله هو التصديق الجازم بوجود الله تعالى، ووحدانيته في الربوبية والألوهية والأسماء والصفات.', subject: 'أصول الدين (العقيدة)', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'lessons' },
        { title: 'تدريب: العقيدة', content: 'أكمل:', question: 'ما هو تعريف الإيمان بالله؟', answer: 'التصديق الجازم بوجود الله ووحدانيته.', subject: 'أصول الدين (العقيدة)', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'exercises' },

        // ═══ السيرة النبوية ═══
        { title: 'السيرة - مولده ﷺ', content: 'ولد النبي محمد ﷺ في مكة المكرمة عام الفيل، يوم الاثنين 12 ربيع الأول، بعد وفاة أبيه عبد الله.', subject: 'السيرة النبوية', stage: 'azhar_sec', grade: 'الأول الثانوي', term: 1, type: 'lessons' }
      ];

      // إضافة كل المحتوى لقاعدة البيانات
      for (var i = 0; i < contentData.length; i++) {
        var item = contentData[i];
        item.created_at = new Date().toISOString();
        await fs.collection('lessons').add(item);
      }

      console.log('✅ تم إضافة باقي المواد الشرعية بنجاح');
    } catch(e) {
      console.error('خطأ في إضافة المحتوى:', e);
    }
  }, 4000);
});
