// ═══════════════════════════════════════════════════════
// 📖 azhar-quran-content.js — محتوى القرآن (الأزهر)
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  setTimeout(async function() {
    try {
      var fs = firebase.firestore();
      
      // عشان نتأكد إننا مش بنكرر المحتوى كل مرة نفتح فيها المنصة
      var check = await fs.collection('lessons').where('title', '==', 'تفسير سورة الفاتحة').get();
      if (!check.empty) {
        console.log('محتوى القرآن موجود بالفعل');
        return;
      }

      // إضافة الدرس
      await fs.collection('lessons').add({
        title: 'تفسير سورة الفاتحة',
        content: 'سورة الفاتحة هي أعظم سور القرآن الكريم، وتسمى أم الكتاب. نتعلم في هذا الدرس تفسير الآيات: (بسم الله الرحمن الرحيم). أي أبتدئ قراءتي مستعيناً باسم الله، والرحمن الرحيم صفتان لله تدلان على سعة رحمته.',
        subject: 'القرآن الكريم والتفسير',
        stage: 'azhar_sec',
        grade: 'الأول الثانوي',
        term: 1,
        type: 'lessons',
        image_url: null,
        video_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', 
        created_at: new Date().toISOString()
      });

      // إضافة التدريب
      await fs.collection('lessons').add({
        title: 'تدريب: فضل سورة الفاتحة',
        content: 'اختر الإجابة الصحيحة: سورة الفاتحة تقرأ في...',
        question: 'سورة الفاتحة تقرأ في الصلاة في:',
        answer: 'كل ركعة',
        subject: 'القرآن الكريم والتفسير',
        stage: 'azhar_sec',
        grade: 'الأول الثانوي',
        term: 1,
        type: 'exercises',
        created_at: new Date().toISOString()
      });

      // إضافة الامتحان
      await fs.collection('lessons').add({
        title: 'امتحان: سورة الفاتحة',
        content: 'اذكر معنى الاستعاذة، وما هو تفسير قوله تعالى (اهدنا الصراط المستقيم)؟',
        question: 'ما هو تفسير (اهدنا الصراط المستقيم)؟',
        answer: 'أي دلنا ووفقنا للطريق الصحيح وهو الإسلام.',
        subject: 'القرآن الكريم والتفسير',
        stage: 'azhar_sec',
        grade: 'الأول الثانوي',
        term: 1,
        type: 'exams',
        created_at: new Date().toISOString()
      });

      console.log('✅ تم إضافة محتوى القرآن للأزهر بنجاح');
    } catch(e) {
      console.error('خطأ في إضافة المحتوى:', e);
    }
  }, 3000);
});
