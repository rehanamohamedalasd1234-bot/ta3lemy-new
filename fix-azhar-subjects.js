// ═══════════════════════════════════════════════════════
// 📚 fix-azhar-subjects.js — تصحيح مواد الأزهر
// ═══════════════════════════════════════════════════════

window.addEventListener('load', function() {
  setTimeout(function() {
    // تصحيح المواد للمرحلة الثانوية الأزهرية
    if (window.azharSubjects) {
      window.azharSubjects = [
        { id: 'quran_t', name: 'القرآن الكريم والتفسير', icon: '📖' },
        { id: 'hadith', name: 'الحديث الشريف', icon: '📜' },
        { id: 'fiqh', name: 'الفقه', icon: '⚖️' },
        { id: 'aqeeda', name: 'أصول الدين (العقيدة)', icon: '🕌' },
        { id: 'seera', name: 'السيرة النبوية', icon: '🌟' },
        { id: 'nahw', name: 'النحو والصرف', icon: '📝' },
        { id: 'balagha', name: 'البلاغة والأدب', icon: '📚' },
        { id: 'arabic', name: 'اللغة العربية', icon: '📖' },
        { id: 'english', name: 'اللغة الإنجليزية', icon: '🇬🇧' },
        { id: 'history', name: 'التاريخ', icon: '📜' },
        { id: 'geo', name: 'الجغرافيا', icon: '🗺️' },
        { id: 'statistics', name: 'الإحصاء', icon: '📊' },
        { id: 'math', name: 'الرياضيات', icon: '🔢' },
        { id: 'science', name: 'العلوم', icon: '🔬' }
      ];
      
      // تحديث واجهة المستخدم لو كانت معروضة حالياً
      var azharList = document.getElementById('azharList');
      if (azharList && window.currentStage && window.currentStage.includes('azhar')) {
        // إعادة رسم القائمة لو كنا في مرحلة اختيار المواد
        if (window.currentGrade) {
          window.openAzharGrade(window.currentGrade);
        }
      }
      console.log('✅ تم تصحيح مواد الأزهر');
    }
  }, 2000);
});
