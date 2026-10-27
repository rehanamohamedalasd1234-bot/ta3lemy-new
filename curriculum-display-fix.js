/*
 * Curriculum display repair for Ta3lemy.
 * Read-only: this file only reads Firestore and local offline cache.
 * It never writes, edits, or seeds curriculum records.
 */
(function () {
  'use strict';

  if (window.__ta3lemyCurriculumDisplayFix) return;
  window.__ta3lemyCurriculumDisplayFix = true;

  var gradeCache = new Map();
  var originalRenderTerms = window.renderTerms;

  function normalize(value) {
    return String(value == null ? '' : value)
      .trim()
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[\s\u200f\u200e_\-ـ.,،؛:()]/g, '');
  }

  var subjectGroups = [
    ['arabic', 'اللغة العربية', 'العربية', 'عربي'],
    ['english', 'اللغة الأجنبية الأولى', 'اللغة الإنجليزية', 'الانجليزية', 'إنجليزي', 'انجليزي'],
    ['math', 'الرياضيات', 'رياضيات'],
    ['history', 'التاريخ', 'تاريخ'],
    ['physics', 'الفيزياء', 'فيزياء'],
    ['chemistry', 'الكيمياء', 'كيمياء'],
    ['biology', 'الأحياء', 'احياء'],
    ['philosophy', 'الفلسفة والمنطق', 'فلسفة ومنطق'],
    ['religion', 'التربية الدينية', 'تربية دينية', 'تربية ديني'],
    ['social', 'الدراسات الاجتماعية', 'دراسات اجتماعية', 'دراسات'],
    ['science', 'العلوم', 'علوم'],
    ['integrated-science', 'العلوم المتكاملة', 'علوم متكاملة'],
    ['azhar-quran-tafsir', 'القرآن والتفسير', 'القرآن الكريم والتفسير'],
    ['azhar-hadith', 'الحديث الشريف', 'حديث شريف'],
    ['azhar-fiqh', 'الفقه', 'فقه'],
    ['azhar-aqeeda', 'العقيدة', 'أصول الدين (العقيدة)'],
    ['azhar-nahw', 'النحو', 'النحو والصرف'],
    ['geography', 'الجغرافيا', 'جغرافيا'],
    ['economics', 'الاقتصاد', 'اقتصاد'],
    ['accounting', 'المحاسبة', 'محاسبة'],
    ['psychology', 'علم النفس', 'نفس'],
    ['german', 'اللغة الألمانية', 'اللغة الالمانية'],
    ['french', 'اللغة الفرنسية', 'فرنسي', 'فرنسية']
  ];
  var subjectLookup = Object.create(null);
  subjectGroups.forEach(function (group) {
    group.forEach(function (alias) { subjectLookup[normalize(alias)] = group[0]; });
  });

  function subjectKey(value) {
    var key = normalize(value);
    return subjectLookup[key] || key;
  }

  function getGrade() {
    return String(typeof currentGrade !== 'undefined' ? currentGrade : window.currentGrade || '');
  }

  function getStage() {
    return String(typeof currentStage !== 'undefined' ? currentStage : window.currentStage || '');
  }

  function getSubject() {
    return String(typeof currentSubject !== 'undefined' ? currentSubject : window.currentSubject || '');
  }

  function trackKey(value) {
    var key = normalize(value);
    var aliases = {
      medical: 'medical', engineering: 'engineering', business: 'business', arts: 'arts',
      'طبي': 'medical', 'الطبي': 'medical', 'هندسي': 'engineering', 'الهندسي': 'engineering',
      'اعمال': 'business', 'الاعمال': 'business', 'ادبي': 'arts', 'الادبي': 'arts'
    };
    return aliases[key] || key;
  }

  function offlineRecords(grade) {
    try {
      var all = JSON.parse(localStorage.getItem('offline_lessons') || '[]');
      return Array.isArray(all) ? all.filter(function (item) {
        return String(item.grade == null ? '' : item.grade) === grade;
      }) : [];
    } catch (error) {
      return [];
    }
  }

  async function recordsForGrade() {
    var grade = getGrade();
    if (!grade) return [];
    if (gradeCache.has(grade)) return gradeCache.get(grade);

    var task = (async function () {
      var cached = offlineRecords(grade);
      if (!navigator.onLine) return cached;

      try {
        // Query by the single grade field, then filter the small result set locally.
        // This avoids exact subject-name mismatches and additional composite indexes.
        var snapshot = await db.collection('lessons').where('grade', '==', grade).get();
        var byId = new Map();
        snapshot.docs.forEach(function (doc) {
          var data = doc.data() || {};
          byId.set(String(doc.id), Object.assign({ id: doc.id }, data));
        });
        cached.forEach(function (item, index) {
          var id = item && item.id != null ? String(item.id) : 'offline-' + grade + '-' + index;
          if (!byId.has(id)) byId.set(id, Object.assign({ id: id }, item));
        });
        return Array.from(byId.values());
      } catch (error) {
        console.warn('تعذر جلب عدادات المنهج؛ ستُستخدم النسخة المحفوظة إن وجدت.', error);
        if (cached.length) return cached;
        throw error;
      }
    })();

    gradeCache.set(grade, task);
    try {
      return await task;
    } catch (error) {
      gradeCache.delete(grade);
      throw error;
    }
  }

  function matchesSelection(item, term) {
    if (String(item.grade == null ? '' : item.grade) !== getGrade()) return false;
    if (getStage() && String(item.stage == null ? '' : item.stage) !== getStage()) return false;
    if (getStage() === 'bakkalorya' && typeof currentBakkaloryaTrack !== 'undefined' && currentBakkaloryaTrack) {
      var itemTrack = item.track || item.trackId || item.stream;
      if (itemTrack && trackKey(itemTrack) !== trackKey(currentBakkaloryaTrack)) return false;
    }
    if (Number(item.term) !== Number(term)) return false;
    return subjectKey(item.subject) === subjectKey(getSubject());
  }

  function videoUrl(item) {
    return String(item.video_url || item.videoUrl || '').trim();
  }

  function countForTerm(items, term) {
    var selected = items.filter(function (item) { return matchesSelection(item, term); });
    return {
      lessons: selected.filter(function (item) { return item.type === 'lessons'; }).length,
      exercises: selected.filter(function (item) { return item.type === 'exercises'; }).length,
      exams: selected.filter(function (item) { return item.type === 'exams'; }).length,
      reviews: selected.filter(function (item) { return item.type === 'reviews'; }).length,
      videos: selected.filter(function (item) { return item.type === 'videos' || (item.type === 'lessons' && videoUrl(item)); }).length
    };
  }

  function labelContentChip(chip, label, count) {
    chip.textContent = label + ' (' + count + ')';
    chip.setAttribute('aria-label', label + ': ' + count);
    chip.removeAttribute('aria-disabled');
    chip.style.opacity = '';
    chip.style.cursor = '';
    chip.title = count === 0
      ? 'لا توجد سجلات Firestore لهذا القسم حاليًا؛ افتحيه للتحقق من أي محتوى تعليمي مضاف داخل التطبيق.'
      : '';
  }

  async function updateTermBadges() {
    var cards = Array.from(document.querySelectorAll('#termsList .term-card'));
    if (!cards.length) return;

    cards.forEach(function (card) {
      var badge = card.querySelector('.term-count');
      if (badge) {
        badge.textContent = 'جارٍ فحص المحتوى…';
        badge.style.whiteSpace = 'normal';
        badge.style.fontSize = '12px';
      }
    });

    var records;
    try {
      records = await recordsForGrade();
    } catch (error) {
      cards.forEach(function (card) {
        var badge = card.querySelector('.term-count');
        if (badge) badge.textContent = 'تعذر التحقق';
        card.querySelectorAll('.section-chip').forEach(function (chip) {
          chip.title = 'تعذر التحقق من المحتوى الآن؛ حاولي عند اتصال الإنترنت';
        });
      });
      return;
    }

    cards.forEach(function (card, index) {
      var term = index + 1;
      var counts = countForTerm(records, term);
      var total = counts.lessons + counts.exercises + counts.exams;
      var badge = card.querySelector('.term-count');
      if (badge) {
        badge.textContent = 'المسجل: ' + total;
        badge.title = 'عدد سجلات Firestore فقط — الدروس: ' + counts.lessons + '، التدريبات: ' + counts.exercises + '، الامتحانات: ' + counts.exams + '، الفيديوهات: ' + counts.videos + '. قد يظهر محتوى محلي إضافي عند فتح القسم.';
      }
      var chips = Array.from(card.querySelectorAll('.section-chip'));
      var entries = [
        ['📄 الدروس', counts.lessons],
        ['✏️ تدريبات', counts.exercises],
        ['📝 امتحانات', counts.exams],
        ['🔁 مراجعات', counts.reviews],
        ['🎥 فيديوهات', counts.videos]
      ];
      chips.forEach(function (chip, chipIndex) {
        var entry = entries[chipIndex];
        if (!entry) return;
        if (entry[0] === '🎥 فيديوهات' && getStage() === 'prep') {
          chip.textContent = entry[0] + ' (' + entry[1] + ') • مصدر رسمي';
          chip.removeAttribute('aria-disabled');
          chip.style.opacity = '';
          chip.style.cursor = '';
          chip.title = 'يفتح الفيديوهات المحفوظة ورابط دروس الوزارة الرسمية';
          return;
        }
        labelContentChip(chip, entry[0], entry[1]);
      });
    });

    if (getStage() === 'bakkalorya') {
      var list = document.getElementById('termsList');
      if (list && !list.querySelector('.curriculum-track-warning')) {
        var note = document.createElement('div');
        note.className = 'curriculum-track-warning';
        note.setAttribute('role', 'note');
        note.style.cssText = 'margin:8px 0 14px;padding:12px 14px;border-radius:12px;background:#fff4df;color:#704800;line-height:1.8;font-size:14px;';
        note.textContent = typeof currentBakkaloryaTrack !== 'undefined' && currentBakkaloryaTrack
          ? 'تنبيه: سجلات البكالوريا الموجودة حاليًا لا تحتوي على حقل للسنة الدراسية أو المسار. تظهر حسب الصف والمادة فقط، ولا يمكن تأكيد توافقها مع مسارك.'
          : 'تنبيه: سجلات البكالوريا الموجودة حاليًا لا تحتوي على حقل للسنة الدراسية. تحققي من توافق المحتوى مع خريطة 2026/2027 قبل الاعتماد عليه.';
        list.insertBefore(note, list.firstChild);
      }
    }
  }

  if (typeof originalRenderTerms === 'function') {
    window.renderTerms = function () {
      originalRenderTerms.apply(this, arguments);
      updateTermBadges();
    };
  }

  window.openContent = async function (type, num, name) {
    window.currentTerm = num;
    window.currentSection = type;
    var titles = { lessons: '📄 الدروس', exercises: '✏️ تدريبات', exams: '📝 امتحانات', reviews: '🔁 مراجعات', videos: '🎥 فيديوهات' };
    var title = titles[type] || 'المحتوى';
    var titleNode = document.getElementById('contentTitle');
    var headNode = document.getElementById('contentHeaderTitle');
    var subNode = document.getElementById('contentHeaderSub');
    var list = document.getElementById('contentList');
    if (!list) return;
    if (titleNode) titleNode.textContent = title;
    if (headNode) headNode.textContent = (getSubject() || '') + ' - ' + (name || '');
    if (subNode) subNode.textContent = title;
    if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('contentScreen');
    list.innerHTML = '<div class="empty-state"><p>⏳ جاري تحميل المحتوى المسجل…</p></div>';

    try {
      var items = (await recordsForGrade()).filter(function (item) {
        if (!matchesSelection(item, num)) return false;
        if (type === 'videos') return item.type === 'videos' || (item.type === 'lessons' && videoUrl(item));
        return item.type === type;
      });
      items.sort(function (a, b) { return Number(a.order || 99) - Number(b.order || 99); });
      list.replaceChildren();

      if (getStage() === 'bakkalorya') {
        var warning = document.createElement('div');
        warning.className = 'curriculum-track-warning';
        warning.setAttribute('role', 'note');
        warning.style.cssText = 'margin:8px 0 14px;padding:12px 14px;border-radius:12px;background:#fff4df;color:#704800;line-height:1.8;font-size:14px;';
        warning.textContent = 'تنبيه: سجل هذا المحتوى لا يتضمن سنة دراسية' + (typeof currentBakkaloryaTrack !== 'undefined' && currentBakkaloryaTrack ? ' أو مسارًا' : '') + '؛ تحققي من توافقه مع منهجك قبل الاعتماد عليه.';
        list.appendChild(warning);
      }

      if (!items.length) {
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        var icon = document.createElement('div');
        icon.className = 'empty-state-icon';
        icon.textContent = '📭';
        var message = document.createElement('p');
        message.textContent = 'لا يوجد محتوى مسجل لهذا القسم والفصل حتى الآن.';
        empty.append(icon, message);
        list.appendChild(empty);
        return;
      }

      items.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'content-item';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        var icon = document.createElement('div');
        icon.className = 'content-item-icon';
        icon.textContent = type === 'videos' ? '🎥' : '📄';
        var info = document.createElement('div');
        info.className = 'content-item-info';
        var titleText = document.createElement('div');
        titleText.className = 'content-item-title';
        titleText.textContent = item.title || 'بدون عنوان';
        var summary = document.createElement('div');
        summary.className = 'content-item-sub';
        summary.textContent = item.content ? String(item.content).slice(0, 80) + '…' : '';
        var arrow = document.createElement('div');
        arrow.className = 'content-item-arrow';
        arrow.textContent = '‹';
        info.append(titleText, summary);
        row.append(icon, info, arrow);
        var open = function () { if (typeof window.viewContent === 'function') window.viewContent(String(item.id)); };
        row.addEventListener('click', open);
        row.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
        });
        list.appendChild(row);
      });
    } catch (error) {
      console.error('Curriculum display error:', error);
      list.innerHTML = '<div class="empty-state"><p>⚠️ تعذر تحميل المحتوى الآن. تحققي من اتصال الإنترنت أو إعدادات قراءة Firestore.</p></div>';
    }
  };

  window.Ta3lemyCurriculumFix = {
    normalizeSubject: subjectKey,
    countForTerm: countForTerm
  };

  console.info('Ta3lemy curriculum display repair loaded (read-only).');
})();
