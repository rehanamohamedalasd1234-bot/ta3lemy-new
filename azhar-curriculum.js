/*
 * كتالوج مواد الأزهر — مصدر موحّد لشاشة الطالب ونموذج رفع المعلم.
 * القوائم تمثل الهيكل الذي حدده المالك؛ تُراجع تفاصيل كل معهد/منطقة عند الحاجة.
 */
(function (window) {
  'use strict';

  var MADHHABS = ['المذهب الشافعي', 'المذهب الحنفي', 'المذهب المالكي', 'المذهب الحنبلي'];
  var PRIMARY_GRADES = ['الأول الابتدائي', 'الثاني الابتدائي', 'الثالث الابتدائي', 'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي'];
  var PREP_GRADES = ['الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي'];
  var SECONDARY_GRADES = ['الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'];

  function course(id, subject, name, branches, grades, detail, subgroup) {
    return {
      id: id,
      subject: subject,
      name: name,
      branches: branches || [],
      grades: grades || [],
      detail: detail || '',
      subgroup: subgroup || ''
    };
  }

  var stages = {
    azhar_primary: {
      name: 'المرحلة الابتدائية الأزهرية',
      grades: PRIMARY_GRADES,
      groups: [
        {
          name: 'المواد الشرعية',
          courses: [
            course('ap-quran', 'القرآن الكريم', 'القرآن الكريم', ['الحفظ', 'التجويد'], null, 'حفظًا وتجويدًا'),
            course('ap-islamic-fiqh', 'التربية الإسلامية / الفقه', 'التربية الإسلامية / الفقه المبسط', ['التربية الإسلامية', 'الفقه المبسط — الشافعي', 'الفقه المبسط — الحنفي', 'الفقه المبسط — المالكي', 'الفقه المبسط — الحنبلي'], null, 'مبسط حسب المذهب أو الخطة المعتمدة')
          ]
        },
        {
          name: 'مواد اللغة العربية',
          courses: [
            course('ap-arabic', 'اللغة العربية', 'اللغة العربية الأساسية', ['القراءة', 'النصوص', 'المطالعة'], null, 'قراءة • نصوص • مطالعة'),
            course('ap-handwriting-spelling', 'الخط العربي والإملاء', 'الخط العربي والإملاء', ['الخط العربي', 'الإملاء'], null, 'الخط • الإملاء')
          ]
        }
      ]
    },
    azhar_prep: {
      name: 'المرحلة الإعدادية الأزهرية',
      grades: PREP_GRADES,
      groups: [
        {
          name: 'المواد الشرعية',
          courses: [
            course('prep-quran', 'القرآن الكريم وتجويده', 'القرآن الكريم وتجويده', ['القرآن الكريم', 'التجويد'], null, 'قرآن كريم • تجويد'),
            course('prep-tafsir', 'التفسير', 'أصول الدين — التفسير', [], null, 'فرع من أصول الدين', 'أصول الدين'),
            course('prep-hadith', 'الحديث الشريف', 'أصول الدين — الحديث', [], null, 'فرع من أصول الدين', 'أصول الدين'),
            course('prep-tawheed', 'أصول الدين (العقيدة)', 'أصول الدين — التوحيد', [], null, 'فرع من أصول الدين', 'أصول الدين'),
            course('prep-seerah', 'السيرة النبوية', 'أصول الدين — السيرة النبوية', [], null, 'فرع من أصول الدين', 'أصول الدين'),
            course('prep-fiqh', 'الفقه', 'الفقه', MADHHABS, null, 'اختر المذهب المعتمد')
          ]
        },
        {
          name: 'مواد اللغة العربية',
          courses: [
            course('prep-nahw-sarf', 'النحو والصرف', 'النحو والصرف', ['النحو', 'الصرف'], null, 'النحو • الصرف'),
            course('prep-reading-texts-literature', 'المطالعة والنصوص والأدب', 'المطالعة والنصوص والأدب', ['المطالعة', 'النصوص', 'الأدب'], null, 'المطالعة • النصوص • الأدب'),
            course('prep-insha-handwriting-spelling', 'الإنشاء والخط والإملاء', 'الإنشاء والخط والإملاء', ['الإنشاء', 'الخط', 'الإملاء'], null, 'الإنشاء • الخط • الإملاء')
          ]
        }
      ]
    },
    azhar_sec: {
      name: 'المرحلة الثانوية الأزهرية',
      grades: SECONDARY_GRADES,
      groups: [
        {
          name: 'المواد الشرعية',
          courses: [
            course('sec-quran', 'القرآن الكريم والتفسير', 'القرآن الكريم', ['القرآن الكريم'], null, 'القرآن الكريم'),
            course('sec-tafsir', 'القرآن الكريم والتفسير', 'التفسير وعلومه', ['التفسير وعلومه'], null, 'التفسير وعلومه'),
            course('sec-hadith', 'الحديث الشريف', 'الحديث وعلومه', ['الحديث وعلومه'], null, 'الحديث وعلومه'),
            course('sec-tawheed', 'أصول الدين (العقيدة)', 'التوحيد (العقيدة)', [], null, 'العقيدة والتوحيد'),
            course('sec-fiqh', 'الفقه', 'الفقه', MADHHABS, null, 'اختر المذهب المعتمد'),
            course('sec-inheritance', 'الميراث', 'الميراث', [], ['الثاني الثانوي', 'الثالث الثانوي'], 'يظهر في الصفوف المتقدمة حسب الخطة الدراسية')
          ]
        },
        {
          name: 'مواد اللغة العربية',
          courses: [
            course('sec-nahw', 'النحو والصرف', 'النحو', ['النحو'], null, 'النحو'),
            course('sec-sarf', 'النحو والصرف', 'الصرف', ['الصرف'], null, 'الصرف'),
            course('sec-balagha', 'البلاغة', 'البلاغة', [], null, 'البلاغة'),
            course('sec-literature-texts-reading', 'الأدب والنصوص والمطالعة', 'الأدب والنصوص والمطالعة', [], null, 'الأدب • النصوص • المطالعة'),
            course('sec-insha', 'الإنشاء', 'الإنشاء', [], null, 'الإنشاء'),
            course('sec-arud-qafiya', 'العروض والقافية', 'العروض والقافية', [], ['الثاني الثانوي'], 'يظهر في الصف الثاني الثانوي وفق الخطة الدراسية')
          ]
        }
      ]
    }
  };

  function getStage(stageId) {
    return stages[stageId] || null;
  }

  function isAzharStage(stageId) {
    return Object.prototype.hasOwnProperty.call(stages, stageId);
  }

  function getCourses(stageId, grade, groupName) {
    var stage = getStage(stageId);
    var result = [];
    if (!stage) return result;
    stage.groups.forEach(function (group) {
      if (groupName && group.name !== groupName) return;
      group.courses.forEach(function (item) {
        if (item.grades.length && item.grades.indexOf(grade) < 0) return;
        result.push({
          id: item.id,
          subject: item.subject,
          name: item.name,
          branches: item.branches.slice(),
          grades: item.grades.slice(),
          detail: item.detail,
          subgroup: item.subgroup,
          group: group.name
        });
      });
    });
    return result;
  }

  function getCourse(stageId, courseId) {
    var stage = getStage(stageId);
    if (!stage) return null;
    for (var i = 0; i < stage.groups.length; i++) {
      for (var j = 0; j < stage.groups[i].courses.length; j++) {
        var item = stage.groups[i].courses[j];
        if (item.id === courseId) {
          return {
            id: item.id,
            subject: item.subject,
            name: item.name,
            branches: item.branches.slice(),
            grades: item.grades.slice(),
            detail: item.detail,
            subgroup: item.subgroup,
            group: stage.groups[i].name
          };
        }
      }
    }
    return null;
  }

  window.AZHAR_CURRICULUM = {
    stages: stages,
    madhhabs: MADHHABS.slice(),
    isAzharStage: isAzharStage,
    getStage: getStage,
    getCourses: getCourses,
    getCourse: getCourse
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
    });
  }

  function installStyle() {
    if (document.getElementById('azharCurriculumStyle')) return;
    var style = document.createElement('style');
    style.id = 'azharCurriculumStyle';
    style.textContent = '.azhar-curriculum-group{margin:0 0 18px}.azhar-curriculum-group-title{margin:15px 0 8px;padding:9px 12px;border-right:4px solid #C9A227;background:#FFF8E1;border-radius:8px;color:#66510A;font-size:15px;font-weight:700}.azhar-curriculum-subject{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 9px;padding:14px;border:1px solid #eee6c8;border-right:5px solid #C9A227;border-radius:13px;background:#fff;text-align:right;font:inherit;cursor:pointer}.azhar-curriculum-subject-icon{font-size:27px}.azhar-curriculum-subject-copy{flex:1}.azhar-curriculum-subject-name{font-weight:700;color:#333}.azhar-curriculum-subject-detail{margin-top:4px;color:#777;font-size:12px;line-height:1.6}.azhar-curriculum-subject-arrow{color:#C9A227;font-size:22px}';
    document.head.appendChild(style);
  }

  var icons = {
    'المواد الشرعية': '🕌',
    'مواد اللغة العربية': '📖'
  };

  window.openAzharGrade = function (gradeName) {
    var stageId = typeof currentStage !== 'undefined' ? currentStage : '';
    var stage = getStage(stageId);
    var list = document.getElementById('azharList');
    if (!stage || !list) return;
    currentGrade = gradeName;
    window.currentAzharSubjectGroup = '';
    window.currentAzharSubjectBranch = '';
    window.currentAzharCourseLabel = '';
    installStyle();
    var html = '<div class="azhar-curriculum-intro">' + escapeHtml(stage.name) + ' • ' + escapeHtml(gradeName) + '</div>';
    stage.groups.forEach(function (group) {
      var courses = getCourses(stageId, gradeName, group.name);
      if (!courses.length) return;
      html += '<section class="azhar-curriculum-group"><h3 class="azhar-curriculum-group-title">' + escapeHtml(group.name) + '</h3>';
      courses.forEach(function (item) {
        var detail = item.detail || (item.branches.length ? item.branches.join(' • ') : 'منهج المرحلة الأزهرية');
        html += '<button type="button" class="azhar-curriculum-subject" data-azhar-course="' + escapeHtml(item.id) + '"><span class="azhar-curriculum-subject-icon">' + icons[group.name] + '</span><span class="azhar-curriculum-subject-copy"><span class="azhar-curriculum-subject-name">' + escapeHtml(item.name) + '</span><span class="azhar-curriculum-subject-detail">' + escapeHtml(detail) + '</span></span><span class="azhar-curriculum-subject-arrow">‹</span></button>';
      });
      html += '</section>';
    });
    list.innerHTML = html;
    var buttons = list.querySelectorAll('[data-azhar-course]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var item = getCourse(stageId, this.getAttribute('data-azhar-course'));
        if (item) window.openAzharSubject(item.id, item.name, item.group);
      });
    }
    if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined') screenHistory.push(currentScreen);
    if (window.showScreen) window.showScreen('azharScreen');
  };

  window.openAzharSubject = function (courseId, name, groupName) {
    var stageId = typeof currentStage !== 'undefined' ? currentStage : '';
    var item = getCourse(stageId, courseId);
    if (!item) {
      currentSubject = name || courseId || '';
      window.currentAzharSubjectGroup = groupName || '';
      window.currentAzharSubjectBranch = '';
      window.currentAzharCourseLabel = name || currentSubject;
    } else {
      currentSubject = item.subject;
      window.currentAzharSubjectGroup = item.group;
      window.currentAzharSubjectBranch = '';
      window.currentAzharCourseLabel = item.name;
    }
    var title = document.getElementById('termsTitle');
    var header = document.getElementById('termsHeader');
    if (title) title.textContent = window.currentAzharCourseLabel;
    if (header) header.textContent = window.currentAzharCourseLabel + ' - ' + (typeof currentGrade !== 'undefined' ? currentGrade : '');
    if (window.renderTerms) window.renderTerms();
    if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined') screenHistory.push(currentScreen);
    if (window.showScreen) window.showScreen('termsScreen');
  };
})(window);
