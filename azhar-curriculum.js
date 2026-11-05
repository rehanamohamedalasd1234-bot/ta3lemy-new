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

  function course(id, subject, name, branches, grades, detail, subgroup, branchCourseIds) {
    return {
      id: id,
      subject: subject,
      name: name,
      branches: branches || [],
      grades: grades || [],
      detail: detail || '',
      subgroup: subgroup || '',
      branchCourseIds: branchCourseIds || {}
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
            course('sec-quran', 'القرآن الكريم والتفسير', 'القرآن الكريم', [], null, 'القرآن الكريم'),
            course('sec-tafsir', 'التفسير', 'التفسير وعلومه', [], null, 'التفسير وعلومه', 'أصول الدين'),
            course('sec-hadith', 'الحديث الشريف', 'الحديث وعلومه', [], null, 'الحديث وعلومه'),
            course('sec-tawheed', 'التوحيد', 'التوحيد (العقيدة)', [], null, 'العقيدة والتوحيد', 'أصول الدين'),
            course('sec-fiqh', 'الفقه', 'الفقه', MADHHABS, null, 'اختر المذهب المعتمد', '', {
              'المذهب الشافعي': 'fiqh_shafii',
              'المذهب المالكي': 'fiqh_maliki'
            }),
            course('sec-seera', 'السيرة النبوية', 'السيرة النبوية', [], ['الثالث الثانوي'], 'السيرة النبوية'),
            course('sec-inheritance', 'الميراث', 'الميراث', [], ['الثاني الثانوي', 'الثالث الثانوي'], 'يظهر في الصفوف المتقدمة حسب الخطة الدراسية')
          ]
        },
        {
          name: 'مواد اللغة العربية',
          courses: [
            course('sec-nahw', 'النحو', 'النحو', [], null, 'النحو'),
            course('sec-sarf', 'الصرف', 'الصرف', [], null, 'الصرف'),
            course('sec-balagha', 'البلاغة العربية', 'البلاغة', [], null, 'البلاغة'),
            course('sec-literature-texts-reading', 'الأدب والنصوص والمطالعة', 'الأدب والنصوص', [], null, 'الأدب • النصوص'),
            course('sec-insha', 'الإنشاء', 'الإنشاء', [], ['الأول الثانوي', 'الثاني الثانوي'], 'الإنشاء'),
            course('sec-reading-insha', 'المطالعة والإنشاء', 'المطالعة والإنشاء', [], ['الثالث الثانوي'], '10 موضوعات مطالعة و9 فنون إنشائية', 'المطالعة • فن الإنشاء'),
            course('sec-arud-qafiya', 'العروض والقافية', 'العروض والقافية', [], ['الثاني الثانوي'], 'يظهر في الصف الثاني الثانوي وفق الخطة الدراسية')
          ]
        },
        {
          name: 'مواد عامة',
          courses: [
            course('sec-english', 'اللغة الإنجليزية', 'اللغة الإنجليزية', [], ['الثالث الثانوي'], 'مادة عامة — الصف الثالث الثانوي'),
            course('sec-history', 'التاريخ', 'التاريخ', [], ['الثالث الثانوي'], 'مادة عامة — الصف الثالث الثانوي'),
            course('sec-geography', 'الجغرافيا', 'الجغرافيا', [], ['الثالث الثانوي'], 'مادة عامة — الصف الثالث الثانوي'),
            course('sec-math', 'الرياضيات', 'الرياضيات', [], ['الثالث الثانوي'], 'مادة عامة — الصف الثالث الثانوي')
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
          branchCourseIds: Object.assign({}, item.branchCourseIds),
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
            branchCourseIds: Object.assign({}, item.branchCourseIds),
            group: stage.groups[i].name
          };
        }
      }
    }
    for (var groupIndex = 0; groupIndex < stage.groups.length; groupIndex++) {
      for (var courseIndex = 0; courseIndex < stage.groups[groupIndex].courses.length; courseIndex++) {
        var parent = stage.groups[groupIndex].courses[courseIndex];
        var branchNames = Object.keys(parent.branchCourseIds || {});
        for (var branchIndex = 0; branchIndex < branchNames.length; branchIndex++) {
          var branchName = branchNames[branchIndex];
          if (parent.branchCourseIds[branchName] === courseId) {
            return {
              id: courseId,
              parentId: parent.id,
              subject: parent.subject,
              name: parent.name + ' — ' + branchName,
              branches: [],
              grades: parent.grades.slice(),
              detail: parent.detail,
              subgroup: parent.subgroup,
              branch: branchName,
              group: stage.groups[groupIndex].name
            };
          }
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
    getCourse: getCourse,
    installStyle: installStyle
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
    style.textContent = '.azhar-curriculum-intro{margin:0 0 12px;padding:12px 14px;border-right:5px solid #C9A227;border-radius:12px;background:#FFF8E1;color:#66510A;font-weight:700}.azhar-curriculum-group{margin:0 0 18px}.azhar-curriculum-group-title{margin:15px 0 8px;padding:9px 12px;border-right:4px solid #C9A227;background:#FFF8E1;border-radius:8px;color:#66510A;font-size:15px;font-weight:700}.azhar-curriculum-subject{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 9px;padding:14px;border:1px solid #eee6c8;border-right:5px solid #C9A227;border-radius:13px;background:#fff;text-align:right;font:inherit;cursor:pointer}.azhar-curriculum-subject-icon{font-size:27px}.azhar-curriculum-subject-copy{flex:1}.azhar-curriculum-subject-name{font-weight:700;color:#333}.azhar-curriculum-subject-detail{margin-top:4px;color:#777;font-size:12px;line-height:1.6}.azhar-curriculum-subject-arrow{color:#C9A227;font-size:22px}';
    document.head.appendChild(style);
  }

  var icons = {
    'المواد الشرعية': '🕌',
    'مواد اللغة العربية': '📖',
    'مواد عامة': '🗂️'
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
        if (item) {
          window.currentAzharCourseId = item.id;
          window.currentAzharCourseGroup = item.group;
          window.currentAzharSubjectGroup = item.group;
          window.currentAzharCourseBranch = '';
          window.openAzharSubject(item.id, item.name, item.group);
        }
      });
    }
    if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined') screenHistory.push(currentScreen);
    if (window.showScreen) window.showScreen('azharScreen');
  };

  window.openAzharSubject = function (courseId, name, groupName, branch) {
    var stageId = typeof currentStage !== 'undefined' ? currentStage : '';
    window.currentAzharCourseId = courseId || '';
    var item = getCourse(stageId, courseId);
    if (item && branch && item.branches.indexOf(branch) < 0) return;
    if (item && item.branches.length > 1 && !branch) {
      currentSubject = item.subject;
      window.currentAzharCourseGroup = item.group;
      window.currentAzharSubjectGroup = item.group;
      window.currentAzharCourseBranch = '';
      window.currentAzharSubjectBranch = '';
      window.currentAzharCourseLabel = item.name;
      installStyle();
      var choiceList = document.getElementById('termsList');
      var choiceTitle = document.getElementById('termsTitle');
      var choiceHeader = document.getElementById('termsHeader');
      if (!choiceList) return;
      if (choiceTitle) choiceTitle.textContent = 'اختر الفرع — ' + item.name;
      if (choiceHeader) choiceHeader.textContent = item.name + ' • الصف ' + (typeof currentGrade !== 'undefined' ? currentGrade : '');
      choiceList.innerHTML = '<div class="azhar-curriculum-intro">اختر الفرع أو المذهب المطابق لدراستك، وستظهر أعمال المعلم المعتمدة لهذا الاختيار.</div><section class="azhar-curriculum-group"><h3 class="azhar-curriculum-group-title">' + escapeHtml(item.name) + '</h3>' + item.branches.map(function (value) { return '<button type="button" class="azhar-curriculum-subject" data-azhar-branch="' + escapeHtml(value) + '"><span class="azhar-curriculum-subject-icon">📚</span><span class="azhar-curriculum-subject-copy"><span class="azhar-curriculum-subject-name">' + escapeHtml(value) + '</span><span class="azhar-curriculum-subject-detail">اختيار الفرع الدراسي</span></span><span class="azhar-curriculum-subject-arrow">‹</span></button>'; }).join('') + '</section>';
      var branchButtons = choiceList.querySelectorAll('[data-azhar-branch]');
      for (var branchIndex = 0; branchIndex < branchButtons.length; branchIndex++) {
        branchButtons[branchIndex].addEventListener('click', function () {
          var selectedBranch = this.getAttribute('data-azhar-branch');
          window.currentAzharCourseId = item.id;
          window.currentAzharCourseGroup = item.group;
          window.currentAzharSubjectGroup = item.group;
          window.currentAzharCourseBranch = selectedBranch;
          window.currentAzharSubjectBranch = selectedBranch;
          window.currentAzharCourseLabel = item.name + ' — ' + selectedBranch;
          var branchCourseId = item.branchCourseIds && item.branchCourseIds[selectedBranch];
          if (branchCourseId) {
            window.openAzharSubject(branchCourseId, item.name + ' — ' + selectedBranch);
          } else {
            window.openAzharSubject(item.id, item.name, item.group, selectedBranch);
          }
          currentSubject = item.subject;
          window.currentAzharCourseId = item.id;
          window.currentAzharCourseBranch = selectedBranch;
          window.currentAzharSubjectBranch = selectedBranch;
          window.currentAzharCourseLabel = item.name + ' — ' + selectedBranch;
        });
      }
      if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined') screenHistory.push(currentScreen);
      if (window.showScreen) window.showScreen('termsScreen');
      return;
    }
    if (!item) {
      currentSubject = name || courseId || '';
      window.currentAzharSubjectGroup = groupName || '';
      window.currentAzharSubjectBranch = '';
      window.currentAzharCourseBranch = '';
      window.currentAzharCourseLabel = name || currentSubject;
    } else {
      currentSubject = item.subject;
      window.currentAzharSubjectGroup = item.group;
      window.currentAzharSubjectBranch = branch || (item.branches.length === 1 ? item.branches[0] : '');
      window.currentAzharCourseBranch = window.currentAzharSubjectBranch;
      window.currentAzharCourseGroup = item.group;
      window.currentAzharCourseLabel = item.name + (window.currentAzharCourseBranch ? ' — ' + window.currentAzharCourseBranch : '');
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
