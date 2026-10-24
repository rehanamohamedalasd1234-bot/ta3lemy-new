// Official Ministry of Education resources for preparatory-grade video lessons.
// Source: https://lessons.moe.gov.eg/ (grade pages g7-g9, terms t1-t2).
// The linked resources stay on the Ministry site; this file does not copy or claim to complete its content.
(function () {
  'use strict';

  var GRADE_PATHS = {
    'اول': 'g7',
    'ثاني': 'g8',
    'ثالث': 'g9'
  };
  var MINISTRY_LESSONS = 'https://lessons.moe.gov.eg/';
  var MINISTRY_BOOKS = 'https://studentbooks.moe.gov.eg/books/Books-Preparatory/';

  function normalizedArabic(value) {
    return String(value || '')
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .trim();
  }

  function currentPreparatoryGradePath() {
    var stage = '';
    var grade = '';
    try {
      stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
      grade = typeof currentGrade === 'undefined' ? '' : String(currentGrade || '');
    } catch (error) {
      return null;
    }
    if (stage !== 'prep') return null;
    var normalized = normalizedArabic(grade).replace(/^ال/, '');
    return GRADE_PATHS[normalized] || null;
  }

  function officialCard(title, description, url, icon) {
    var card = document.createElement('a');
    card.className = 'content-item';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', title + ' — يفتح في موقع وزارة التربية والتعليم');

    var iconBox = document.createElement('div');
    iconBox.className = 'content-item-icon';
    iconBox.textContent = icon;

    var info = document.createElement('div');
    info.className = 'content-item-info';

    var heading = document.createElement('div');
    heading.className = 'content-item-title';
    heading.textContent = title;

    var sub = document.createElement('div');
    sub.className = 'content-item-sub';
    sub.textContent = description;

    var arrow = document.createElement('div');
    arrow.className = 'content-item-arrow';
    arrow.textContent = '↗';

    info.appendChild(heading);
    info.appendChild(sub);
    card.appendChild(iconBox);
    card.appendChild(info);
    card.appendChild(arrow);
    return card;
  }

  function addOfficialResources(type, termNumber) {
    if (type !== 'videos') return;
    var gradePath = currentPreparatoryGradePath();
    var list = document.getElementById('contentList');
    if (!gradePath || !list) return;

    var semester = Number(termNumber) === 2 ? 't2' : 't1';
    var lessonUrl = MINISTRY_LESSONS + gradePath + '/' + semester;
    var gradeName = typeof currentGrade === 'undefined' ? '' : currentGrade;
    var resources = document.createElement('div');
    resources.className = 'official-curriculum-resources';
    resources.setAttribute('dir', 'rtl');
    resources.appendChild(officialCard(
      'فيديوهات ودروس الوزارة الرسمية',
      'اختر المادة من منصة الوزارة — الصف ' + gradeName + ' • الترم ' + (semester === 't1' ? 'الأول' : 'الثاني'),
      lessonUrl,
      '🎥'
    ));
    resources.appendChild(officialCard(
      'كتب الوزارة الرسمية للمرحلة الإعدادية',
      'افتح مكتبة الكتب الرسمية واختر الصف والمادة',
      MINISTRY_BOOKS,
      '📚'
    ));
    list.appendChild(resources);
  }

  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent !== 'function' || window.openContent.__officialResourcesWrapped) return;

  var wrappedOpenContent = async function (type, termNumber, termName) {
    var result = await originalOpenContent.apply(this, arguments);
    addOfficialResources(type, termNumber);
    return result;
  };
  wrappedOpenContent.__officialResourcesWrapped = true;
  window.openContent = wrappedOpenContent;
})();
