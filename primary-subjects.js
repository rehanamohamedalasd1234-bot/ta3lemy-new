/* قائمة مواد التعليم العام للمرحلة الابتدائية */
(function () {
  var originalOpenGrade = window.openGrade;
  var early = [
    { id: 'arabic', name: 'اللغة العربية', icon: '📖', color: '#C2185B' },
    { id: 'math', name: 'الرياضيات', icon: '🔢', color: '#1976D2' },
    { id: 'english', name: 'اللغة الإنجليزية', icon: '🇬🇧', color: '#00897B' },
    { id: 'discover', name: 'اكتشف', icon: '🌍', color: '#F57C00' },
    { id: 'religion', name: 'التربية الدينية', icon: '🕌', color: '#6A1B9A' },
    { id: 'values', name: 'القيم واحترام الآخر', icon: '🤝', color: '#2E7D32' }
  ];
  var upper = [
    { id: 'arabic', name: 'اللغة العربية', icon: '📖', color: '#C2185B' },
    { id: 'math', name: 'الرياضيات', icon: '🔢', color: '#1976D2' },
    { id: 'english', name: 'اللغة الإنجليزية', icon: '🇬🇧', color: '#00897B' },
    { id: 'science', name: 'العلوم', icon: '🔬', color: '#388E3C' },
    { id: 'social', name: 'الدراسات الاجتماعية', icon: '🌍', color: '#00838F' },
    { id: 'ict', name: 'تكنولوجيا المعلومات والاتصالات', icon: '💻', color: '#455A64' },
    { id: 'career', name: 'المهارات المهنية', icon: '🛠️', color: '#F57C00' },
    { id: 'religion', name: 'التربية الدينية', icon: '🕌', color: '#6A1B9A' },
    { id: 'values', name: 'القيم واحترام الآخر', icon: '🤝', color: '#2E7D32' },
    { id: 'calligraphy', name: 'الخط العربي', icon: '✍️', color: '#795548' }
  ];
  window.openGrade = function (id, name) {
    if (id !== 'primary') return typeof originalOpenGrade === 'function' ? originalOpenGrade(id, name) : null;
    window.currentStage = 'primary'; window.currentGrade = name;
    var list = document.getElementById('subjectsList');
    var title = document.getElementById('subjectsTitle');
    var subjects = ['الرابع','الخامس','السادس'].indexOf(name) >= 0 ? upper : early;
    if (title) title.textContent = 'الصف ' + name;
    if (list) list.innerHTML = subjects.map(function (s) { return '<div class="subject-card" onclick="openSubject(\'' + s.id + '\',\'' + s.name + '\')"><div class="subject-icon" style="background:' + s.color + '20;color:' + s.color + ';">' + s.icon + '</div><div class="subject-name">' + s.name + '</div></div>'; }).join('');
    if (window.screenHistory && typeof window.showScreen === 'function') { window.screenHistory.push(window.currentScreen); window.showScreen('subjectsScreen'); }
  };
})();
