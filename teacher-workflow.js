/*
 * Teacher workflow: verified teacher upload requests, owner approval, live room requests,
 * per-teacher admission lists, student join requests and owner broadcast controls.
 * UI checks improve flow only; Firestore rules and an authenticated Jitsi deployment are
 * required for enforceable security (see teacher-security-setup.md).
 */
(function () {
  'use strict';
  var db = window.firebase && window.firebase.firestore ? window.firebase.firestore() : null;
  var liveRefreshTimer = null;
  var teacherDirectoryState = null;

  function toast(message) { if (window.showToast) window.showToast(message); else console.log(message); }
  function uid() { return window.currentUser && window.currentUser.uid ? String(window.currentUser.uid) : ''; }
  function isTeacher() { return window.currentRole === 'teacher' && !!uid(); }
  function isOwner() { return window.currentRole === 'owner' && !!uid(); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function attr(value) { return esc(value).replace(/`/g, '&#96;'); }
  function now() { return new Date().toISOString(); }
  function screenBack() { if (typeof window.goBack === 'function') window.goBack(); }
  function enterScreen(id) {
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen(id);
  }
  function newRoomId() {
    var bytes = new Uint8Array(14);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return 'hafez-' + Array.prototype.map.call(bytes, function (n) { return ('0' + n.toString(16)).slice(-2); }).join('');
  }
  function openRoom(roomId) {
    if (!roomId) return toast('رابط الغرفة غير متاح');
    var name = (window.currentUser && window.currentUser.name) || 'مشارك';
    window.open('https://meet.jit.si/' + encodeURIComponent(roomId) + '#userInfo.displayName=%22' + encodeURIComponent(name) + '%22', '_blank');
  }
  function screen(id, title, color) {
    var node = document.getElementById(id);
    if (!node) {
      node = document.createElement('div');
      node.id = id;
      node.className = 'screen';
      node.innerHTML = '<div class="top-bar" style="background:' + color + '"><button class="icon-btn" data-back="1">→</button><div class="logo"><span>' + title + '</span></div><div style="width:42px"></div></div><div class="content" id="' + id + 'Content"></div>';
      node.querySelector('[data-back]').onclick = screenBack;
      document.body.appendChild(node);
    }
    return node;
  }
  function styleOnce() {
    if (document.getElementById('teacherWorkflowStyle')) return;
    var style = document.createElement('style');
    style.id = 'teacherWorkflowStyle';
    style.textContent = '.tw-card{background:#fff;border:1px solid #e5ece5;border-radius:14px;padding:14px;margin:0 0 12px;box-shadow:0 2px 8px rgba(0,0,0,.05)}.tw-title{font-size:16px;font-weight:700;color:#245b35;margin-bottom:6px}.tw-meta{font-size:12px;color:#68756d;line-height:1.8;margin:5px 0}.tw-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.tw-btn{border:0;border-radius:9px;padding:10px 12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.tw-empty{text-align:center;background:#fff;color:#778078;padding:25px 12px;border-radius:14px;line-height:1.8}.tw-form label{display:block;font-size:13px;font-weight:700;margin:0 0 5px}.tw-form .form-group{margin-bottom:12px}.tw-form .form-input{font-family:inherit}.tw-section{font-size:18px;font-weight:700;margin:18px 0 10px;color:#24653a}.tw-chip{display:inline-block;border-radius:20px;background:#f1f5f2;color:#49634f;padding:3px 9px;font-size:11px;margin:2px 3px 2px 0}';
    document.head.appendChild(style);
  }
  function addCardButton(container, label, color, handler) {
    var button = document.createElement('button');
    button.className = 'tw-btn';
    button.style.background = color;
    button.style.color = '#fff';
    button.textContent = label;
    button.onclick = handler;
    container.appendChild(button);
  }

  function teacherWorkKind(item) {
    return ({ lesson: 'درس / شرح', explanation: 'شرح', exercise: 'تدريب', exam: 'امتحان', review: 'مراجعة', image: 'صورة تعليمية', video: 'فيديو', audio: 'تسجيل صوتي' })[item.teacherContentType || item.type] || 'عمل تعليمي';
  }
  function teacherWorkCard(doc) {
    var item = doc.data() || {};
    var content = typeof item.content === 'string' ? item.content : '';
    var summary = content ? esc(content.substring(0, 70)) + (content.length > 70 ? '…' : '') : (item.pdf_url ? '📕 ملف PDF' : item.video_url ? '🎥 فيديو' : item.audio_url ? '🔊 صوت للاستماع' : item.image_url ? '🖼️ صورة' : 'افتح العمل للمشاهدة');
    return '<div class="content-item" onclick="viewContent(\'' + attr(doc.id) + '\')"><div class="content-item-icon">📚</div><div class="content-item-info"><div class="content-item-title">' + esc(item.title || 'بدون عنوان') + '</div><div class="content-item-sub">📌 ' + esc(teacherWorkKind(item)) + (summary ? ' • ' + summary : '') + '</div></div><div class="content-item-arrow">‹</div></div>';
  }
  function regularContentCard(doc, type) {
    var item = doc.data() || {};
    var teacher = item.teacherName ? ' • 👨‍🏫 ' + esc(item.teacherName) : '';
    var kinds = { lesson: 'درس / شرح', explanation: 'شرح', exercise: 'تدريب', exam: 'امتحان', review: 'مراجعة', image: 'صورة تعليمية', video: 'فيديو', audio: 'تسجيل صوتي' };
    var workKind = type === 'teacher_explanation' && item.teacherContentType ? kinds[item.teacherContentType] || 'عمل تعليمي' : '';
    var content = typeof item.content === 'string' ? item.content : '';
    var contentSummary = content ? esc(content.substring(0, 70)) + (content.length > 70 ? '…' : '') : (item.pdf_url ? '📕 ملف PDF' : item.video_url ? '🎥 فيديو' : item.audio_url ? '🔊 صوت للاستماع' : item.image_url ? '🖼️ صورة' : '');
    var summary = (workKind ? '📌 ' + workKind + (contentSummary ? ' • ' : '') : '') + contentSummary;
    return '<div class="content-item" onclick="viewContent(\'' + attr(doc.id) + '\')"><div class="content-item-icon">📄</div><div class="content-item-info"><div class="content-item-title">' + esc(item.title || 'بدون عنوان') + '</div><div class="content-item-sub">' + summary + teacher + '</div></div><div class="content-item-arrow">‹</div></div>';
  }
  function teacherStageName(stage) {
    return ({ primary: 'الابتدائية', prep: 'الإعدادية', sec: 'الثانوية', bakkalorya: 'البكالوريا', kindergarten_languages: 'رياض الأطفال لغات' })[stage] || stage || 'مرحلة غير محددة';
  }
  function teacherTermName(term) { return Number(term) === 2 ? 'الترم الثاني' : 'الترم الأول'; }
  function renderTeacherDirectory(docs) {
    var list = document.getElementById('teacherDirectoryScreenContent');
    if (!list) return;
    var groupsById = Object.create(null);
    var groups = [];
    docs.forEach(function (doc) {
      var item = doc.data() || {};
      var identity = String(item.teacherId || item.authUid || item.teacherName || 'teacher_unknown');
      if (!groupsById[identity]) {
        groupsById[identity] = { name: item.teacherName || 'المعلم', docs: [] };
        groups.push(groupsById[identity]);
      }
      groupsById[identity].docs.push(doc);
    });
    groups.sort(function (a, b) { return a.name.localeCompare(b.name); });
    teacherDirectoryState = { docs: docs.slice(), groups: groups };
    if (!groups.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>لا توجد أعمال معتمدة من المعلمين حتى الآن.</p><p style="font-size:12px;color:#777">ستظهر هنا أيقونة كل معلم بعد موافقة المالك على أعماله.</p></div>';
      return;
    }
    var html = '<div style="background:#E8F5E9;color:#245b35;padding:12px 14px;border-radius:12px;margin-bottom:12px;line-height:1.8;font-size:13px">👨‍🏫 اختر المعلم الذي تريده؛ ستجد داخل صفحته أعماله مرتبة حسب المرحلة والصف والمادة والترم.</div>';
    groups.forEach(function (group, index) {
      var scopes = [];
      group.docs.forEach(function (doc) {
        var item = doc.data() || {};
        var scope = teacherStageName(item.stage) + ' • الصف ' + (item.grade || '—') + ' • ' + (item.subject || '—');
        if (scopes.indexOf(scope) < 0) scopes.push(scope);
      });
      var summary = scopes.slice(0, 2).join(' | ') + (scopes.length > 2 ? ' | +' + (scopes.length - 2) : '');
      html += '<button type="button" onclick="openTeacherWorkGroup(' + index + ')" style="width:100%;display:flex;align-items:center;gap:12px;text-align:right;background:#fff;border:1px solid #e5ece5;border-radius:16px;padding:14px;margin:0 0 10px;box-shadow:0 2px 8px rgba(0,0,0,.05);font-family:inherit;cursor:pointer"><span style="width:54px;height:54px;flex:0 0 54px;border-radius:16px;background:#E0F2F1;color:#00695C;display:flex;align-items:center;justify-content:center;font-size:30px">👨‍🏫</span><span style="flex:1"><span style="display:block;font-weight:700;color:#245b35;font-size:15px">الأستاذ ' + esc(group.name) + '</span><span style="display:block;margin-top:4px;font-size:12px;color:#68756d">' + group.docs.length + ' عمل معتمد</span><span style="display:block;margin-top:4px;font-size:11px;color:#68756d">' + esc(summary) + '</span></span><span style="font-size:24px;color:#999">‹</span></button>';
    });
    list.innerHTML = html;
  }
  window.openTeacherDirectory = async function () {
    styleOnce();
    screen('teacherDirectoryScreen', '👨‍🏫 شرح الأستاذ', 'linear-gradient(135deg,#00695C,#26A69A)');
    enterScreen('teacherDirectoryScreen');
    await window.loadTeacherDirectory();
  };
  window.loadTeacherDirectory = async function () {
    var list = document.getElementById('teacherDirectoryScreenContent');
    if (!list) return;
    list.innerHTML = '<div class="tw-empty">⏳ جاري تحميل قائمة المعلمين...</div>';
    try {
      var snapshot = await db.collection('lessons').where('type', '==', 'teacher_explanation').get();
      var docs = snapshot.docs ? snapshot.docs.slice() : [];
      if (!docs.length) {
        try {
          var saved = JSON.parse(localStorage.getItem('offline_lessons') || '[]');
          docs = saved.filter(function (item) { return item && item.type === 'teacher_explanation'; }).map(function (item) { return { id: String(item.id), data: function () { return item; } }; });
        } catch (cacheError) { console.warn('Offline teacher content unavailable', cacheError); }
      }
      docs.sort(function (a, b) { var ad = a.data() || {}; var bd = b.data() || {}; return String(bd.created_at || bd.createdAt || '').localeCompare(String(ad.created_at || ad.createdAt || '')); });
      renderTeacherDirectory(docs);
    } catch (error) {
      console.error('Teacher directory query failed', error);
      var savedDocs = [];
      try {
        var cached = JSON.parse(localStorage.getItem('offline_lessons') || '[]');
        savedDocs = cached.filter(function (item) { return item && item.type === 'teacher_explanation'; }).map(function (item) { return { id: String(item.id), data: function () { return item; } }; });
      } catch (cacheError) { console.warn(cacheError); }
      if (savedDocs.length) renderTeacherDirectory(savedDocs);
      else list.innerHTML = '<div class="tw-empty">تعذر تحميل قائمة المعلمين. تحقق من الاتصال، أو افتحها بعد الاتصال بالإنترنت أول مرة.</div>';
    }
  };
  window.openTeacherWorkGroup = function (index) {
    if (!teacherDirectoryState) return;
    var group = teacherDirectoryState.groups[Number(index)];
    var list = document.getElementById('teacherDirectoryScreenContent');
    if (!group || !list) return;
    var scopesByKey = Object.create(null);
    var scopes = [];
    group.docs.forEach(function (doc) {
      var item = doc.data() || {};
      var key = [item.stage || '', item.grade || '', item.subject || '', item.term || 1].join('|');
      if (!scopesByKey[key]) {
        scopesByKey[key] = { title: teacherStageName(item.stage) + ' • الصف ' + (item.grade || '—') + ' • ' + (item.subject || '—') + ' • ' + teacherTermName(item.term), docs: [] };
        scopes.push(scopesByKey[key]);
      }
      scopesByKey[key].docs.push(doc);
    });
    var html = '<button type="button" onclick="returnToTeacherDirectory()" style="width:100%;padding:11px;margin-bottom:12px;border:0;border-radius:10px;background:#E8F5E9;color:#245b35;font:inherit;font-weight:700;text-align:right">↩ العودة إلى قائمة المعلمين</button><div style="padding:13px 14px;background:#E0F2F1;border-radius:12px;margin-bottom:12px;color:#00695C;font-weight:700">أعمال الأستاذ ' + esc(group.name) + '</div>';
    scopes.forEach(function (scope) {
      html += '<section style="background:#fff;border-radius:13px;padding:12px;margin-bottom:12px;border:1px solid #e5ece5"><h3 style="font-size:14px;color:#245b35;margin:0 0 10px">' + esc(scope.title) + '</h3>' + scope.docs.map(teacherWorkCard).join('') + '</section>';
    });
    list.innerHTML = html;
  };
  window.returnToTeacherDirectory = function () {
    if (teacherDirectoryState) renderTeacherDirectory(teacherDirectoryState.docs);
  };

  // Replace the exercise tile with the teacher's approved work feed.
  window.renderTerms = function () {
    var list = document.getElementById('termsList');
    if (!list) return;
    var terms = [{ num: 1, name: 'الترم الأول', icon: '📘' }, { num: 2, name: 'الترم الثاني', icon: '📙' }];
    list.innerHTML = terms.map(function (term) {
      return '<div class="term-card ' + (term.num === 2 ? 'term-2' : '') + '"><div class="term-header"><div class="term-icon">' + term.icon + '</div><div class="term-title">' + term.name + '</div><div class="term-count">منهج كامل</div></div><div class="term-sections"><div class="section-chip" onclick="openContent(\'lessons\',' + term.num + ',\'' + term.name + '\')">📄 الدروس</div><div class="section-chip" onclick="openContent(\'exams\',' + term.num + ',\'' + term.name + '\')">📝 امتحانات</div><div class="section-chip" onclick="openContent(\'videos\',' + term.num + ',\'' + term.name + '\')">🎥 فيديوهات</div></div></div>';
    }).join('');
  };
  window.openContent = async function (type, termNumber, termName) {
    if (type === 'teacher_explanation') { await window.openTeacherDirectory(); return; }
    currentTerm = termNumber;
    currentSection = type;
    var titles = { lessons: '📄 الدروس', teacher_explanation: '👨‍🏫 شرح الأستاذ', exercises: '✏️ تدريبات', exams: '📝 امتحانات', videos: '🎥 فيديوهات' };
    var title = titles[type] || 'المحتوى';
    var titleNode = document.getElementById('contentTitle');
    var header = document.getElementById('contentHeaderTitle');
    var subtitle = document.getElementById('contentHeaderSub');
    var list = document.getElementById('contentList');
    if (titleNode) titleNode.textContent = title;
    if (header) header.textContent = (currentSubject || '') + ' - ' + (termName || '');
    if (subtitle) subtitle.textContent = title;
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('contentScreen');
    if (!list) return;
    list.innerHTML = '<div class="empty-state">⏳ جاري التحميل...</div>';
    try {
      var query = db.collection('lessons').where('subject', '==', currentSubject).where('term', '==', termNumber).where('type', '==', type).where('grade', '==', currentGrade);
      if (currentStage) query = query.where('stage', '==', currentStage);
      var snapshot = await query.get();
      if (snapshot.empty) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>' + (type === 'teacher_explanation' ? 'لا توجد شروحات منشورة من المعلمين بعد' : 'لا يوجد محتوى بعد') + '</p></div>';
        return;
      }
      var docs = snapshot.docs.slice().sort(function (a, b) { return (a.data().order || 99) - (b.data().order || 99); });
      list.innerHTML = docs.map(function (doc) { return regularContentCard(doc, type); }).join('');
    } catch (error) {
      console.error('Teacher content query failed', error);
      list.innerHTML = '<div class="empty-state">تعذر تحميل المحتوى. تحقق من اتصال قاعدة البيانات.</div>';
    }
  };

  function selectFieldFromExisting(id) {
    var field = document.getElementById(id);
    if (!field || field.tagName === 'SELECT') return field;
    var select = document.createElement('select');
    select.id = field.id;
    select.className = field.className || 'form-input';
    select.setAttribute('aria-label', id === 'upGrade' ? 'الصف الدراسي' : 'المادة الدراسية');
    if (field.parentNode) field.parentNode.replaceChild(select, field);
    return select;
  }
  function setUploadSelectOptions(select, values, placeholder, previousValue) {
    select.innerHTML = '';
    var first = document.createElement('option'); first.value = ''; first.textContent = placeholder; select.appendChild(first);
    values.forEach(function (value) { var option = document.createElement('option'); option.value = value; option.textContent = value; select.appendChild(option); });
    if (values.indexOf(previousValue) >= 0) select.value = previousValue;
  }
  function ensureUploadCurriculumSelectors() {
    var stage = document.getElementById('upStage');
    var grade = selectFieldFromExisting('upGrade');
    var subject = selectFieldFromExisting('upSubject');
    if (!stage || !grade || !subject) return;
    if (!Array.prototype.some.call(stage.options, function (option) { return option.value === 'kindergarten_languages'; })) {
      var kindergartenOption = document.createElement('option');
      kindergartenOption.value = 'kindergarten_languages';
      kindergartenOption.textContent = 'رياض الأطفال لغات';
      stage.appendChild(kindergartenOption);
    }
    var gradeNames = function (stageId) {
      if (typeof stagesData !== 'undefined' && stagesData[stageId] && stagesData[stageId].grades) return stagesData[stageId].grades.slice();
      if (stageId === 'bakkalorya') return ['الأول', 'الثاني', 'الثالث'];
      return [];
    };
    var subjectNames = function (stageId) {
      if (stageId === 'kindergarten_languages') return ['عربي', 'English', 'Maths'];
      if (stageId === 'bakkalorya') return ['اللغة العربية', 'اللغة الأجنبية الأولى', 'التاريخ', 'الرياضيات', 'العلوم المتكاملة', 'الفلسفة والمنطق', 'التربية الدينية', 'البرمجة والذكاء الاصطناعي', 'الأحياء', 'الكيمياء', 'الفيزياء', 'الاقتصاد', 'المحاسبة', 'الجغرافيا', 'علم النفس', 'الإحصاء'];
      if (typeof generalSubjects !== 'undefined' && generalSubjects.length) return generalSubjects.map(function (item) { return item.name; });
      return ['اللغة العربية', 'رياضيات', 'علوم', 'فيزياء', 'كيمياء', 'أحياء', 'إنجليزي', 'دراسات', 'تاريخ', 'جغرافيا', 'فلسفة ومنطق', 'تربية دينية', 'حاسب آلي', 'فنية'];
    };
    function populate(force) {
      var stageId = stage.value;
      if (force || grade.getAttribute('data-curriculum-stage') !== stageId) {
        var previousGrade = grade.value;
        setUploadSelectOptions(grade, gradeNames(stageId), 'اختر الصف من المنهج', previousGrade);
        grade.setAttribute('data-curriculum-stage', stageId);
      }
      if (force || subject.getAttribute('data-curriculum-stage') !== stageId) {
        var previousSubject = subject.value;
        setUploadSelectOptions(subject, subjectNames(stageId), 'اختر المادة من المنهج', previousSubject);
        subject.setAttribute('data-curriculum-stage', stageId);
      }
    }
    if (stage.getAttribute('data-curriculum-bound') !== '1') {
      stage.setAttribute('data-curriculum-bound', '1');
      stage.addEventListener('change', function () { populate(true); });
    }
    populate(false);
  }
  function ensureUploadForm() {
    var type = document.getElementById('upType');
    if (!type) return;
    var wanted = [
      ['lesson', 'درس / شرح'], ['explanation', 'شرح'], ['exercise', 'تدريب'],
      ['exam', 'امتحان'], ['review', 'مراجعة'], ['image', 'صورة تعليمية'], ['video', 'فيديو'], ['audio', 'تسجيل صوتي']
    ];
    if (type.getAttribute('data-teacher-options-ready') !== '1') {
      type.innerHTML = wanted.map(function (option) { return '<option value="' + option[0] + '">' + option[1] + '</option>'; }).join('');
      type.setAttribute('data-teacher-options-ready', '1');
    }
    if (!document.getElementById('upTeacherName')) {
      var content = document.getElementById('teacherUploadScreen').querySelector('.content');
      var group = document.createElement('div');
      group.className = 'form-group';
      group.innerHTML = '<label class="form-label" for="upTeacherName">اسم الأستاذ كما سيظهر للطلاب</label><input id="upTeacherName" class="form-input" maxlength="60" type="text" placeholder="اسم المعلم">';
      content.insertBefore(group, content.firstChild);
      var termGroup = document.createElement('div');
      termGroup.className = 'form-group';
      termGroup.innerHTML = '<label class="form-label" for="upTerm">الفصل الدراسي</label><select id="upTerm" class="form-input"><option value="1">الترم الأول</option><option value="2">الترم الثاني</option></select>';
      var stage = document.getElementById('upStage');
      if (stage && stage.parentElement) stage.parentElement.after(termGroup);
      var hint = document.createElement('p');
      hint.style.cssText = 'font-size:12px;color:#617568;line-height:1.8;margin:-4px 0 12px;';
      hint.textContent = 'مكان الرفع: لوحة المعلم ← رفع درس أو تدريب أو امتحان أو مراجعة. اختر المرحلة والصف والمادة والترم من القوائم المطابقة للمنهج. ينتظر العمل موافقة المالك، ثم يظهر للطلاب في الرئيسية ← أيقونة شرح الأستاذ ← بطاقة المعلم، وتكون أعماله مرتبة حسب المرحلة والصف والمادة والترم.';
      var button = document.getElementById('upSubmitBtn');
      if (button) button.parentNode.insertBefore(hint, button);
    }
    var name = document.getElementById('upTeacherName');
    if (name && window.currentUser && name.getAttribute('data-prefilled') !== '1') {
      name.value = window.currentUser.name || '';
      name.setAttribute('data-prefilled', '1');
    }
    if (!document.getElementById('upAudio')) {
      var audioGroup = document.createElement('div');
      audioGroup.className = 'form-group';
      audioGroup.innerHTML = '<label class="form-label" for="upAudio">🔊 تسجيل صوتي للاستماع (اختياري)</label><input id="upAudio" class="form-input" type="file" accept="audio/*" style="padding:10px;">';
      var submitButton = document.getElementById('upSubmitBtn');
      if (submitButton && submitButton.parentNode) submitButton.parentNode.insertBefore(audioGroup, submitButton);
    }
    if (!document.getElementById('upPdf')) {
      var pdfGroup = document.createElement('div');
      pdfGroup.className = 'form-group';
      pdfGroup.innerHTML = '<label class="form-label" for="upPdf">📕 ملف PDF تعليمي (اختياري)</label><input id="upPdf" class="form-input" type="file" accept=".pdf,application/pdf" style="padding:10px;"><small style="display:block;margin-top:5px;color:#68756d;line-height:1.7">اختر ملف PDF لا يزيد حجمه على 10 ميجابايت. سيظهر للطلاب بعد موافقة المالك.</small>';
      var submitButton = document.getElementById('upSubmitBtn');
      if (submitButton && submitButton.parentNode) submitButton.parentNode.insertBefore(pdfGroup, submitButton);
    }
    ensureUploadCurriculumSelectors();
  }

  window.submitTeacherUpload = async function () {
    if (!isTeacher()) return toast('يلزم الدخول بحساب معلم معتمد');
    var field = function (id) { var element = document.getElementById(id); return element ? element.value.trim() : ''; };
    var workType = field('upType');
    var stage = field('upStage');
    var grade = field('upGrade');
    var subject = field('upSubject');
    var title = field('upTitle');
    var content = field('upContent');
    var teacherName = field('upTeacherName') || (window.currentUser.name || '');
    var term = Number(field('upTerm') || 1);
    var imageInput = document.getElementById('upImage');
    var videoInput = document.getElementById('upVideo');
    var audioInput = document.getElementById('upAudio');
    var pdfInput = document.getElementById('upPdf');
    var imageFile = imageInput && imageInput.files && imageInput.files[0];
    var videoFile = videoInput && videoInput.files && videoInput.files[0];
    var audioFile = audioInput && audioInput.files && audioInput.files[0];
    var pdfFile = pdfInput && pdfInput.files && pdfInput.files[0];
    var button = document.getElementById('upSubmitBtn');
    if (!teacherName || teacherName.length < 3 || !stage || !grade || !subject || !title) return toast('أكمل اسم الأستاذ والمرحلة والصف والمادة والعنوان');
    if (!content && !imageFile && !videoFile && !audioFile && !pdfFile) return toast('أضف شرحًا أو صورة أو فيديو أو تسجيلًا صوتيًا أو ملف PDF واحدًا على الأقل');
    if (stage === 'kindergarten_languages' && (['KG1', 'KG2'].indexOf(grade) < 0 || ['عربي', 'English', 'Maths'].indexOf(subject) < 0)) return toast('اختر KG1 أو KG2 ومادة عربي أو English أو Maths');
    if (audioFile && audioFile.size > 25 * 1024 * 1024) return toast('حجم التسجيل الصوتي يجب ألا يتجاوز 25 ميجابايت');
    if (pdfFile && !/\.pdf$/i.test(pdfFile.name || '')) return toast('اختر ملفًا بامتداد PDF');
    if (pdfFile && pdfFile.size > 10 * 1024 * 1024) return toast('حجم ملف PDF يجب ألا يتجاوز 10 ميجابايت على الخطة المجانية');
    if (button) { button.disabled = true; button.textContent = '⏳ جارٍ رفع العمل للمراجعة...'; }
    try {
      var imageUrl = null;
      var videoUrl = null;
      var audioUrl = null;
      var pdfUrl = null;
      if (imageFile) {
        imageUrl = await window.uploadFile(imageFile, 'teacher_content');
        if (!imageUrl) throw new Error('فشل رفع الصورة');
      }
      if (videoFile) {
        videoUrl = await window.uploadFile(videoFile, 'teacher_content');
        if (!videoUrl) throw new Error('فشل رفع الفيديو');
      }
      if (audioFile) {
        audioUrl = await window.uploadFile(audioFile, 'teacher_content');
        if (!audioUrl) throw new Error('فشل رفع التسجيل الصوتي');
      }
      if (pdfFile) {
        pdfUrl = await window.uploadFile(pdfFile, 'teacher_content');
        if (!pdfUrl) throw new Error('فشل رفع ملف PDF. تحقق من إعدادات Cloudinary أو اتصال الإنترنت');
      }
      await db.collection('teacher_uploads').add({
        teacherId: uid(), teacherName: teacherName, type: workType, stage: stage, grade: grade,
        subject: subject, term: term, title: title, content: content,
        image_url: imageUrl, video_url: videoUrl, audio_url: audioUrl, pdf_url: pdfUrl,
        pdf_name: pdfFile ? pdfFile.name : '', pdf_size: pdfFile ? pdfFile.size : 0,
        status: 'pending', createdAt: now(),
        authUid: uid()
      });
      toast('تم إرسال العمل للمالك، وسيظهر للطلاب بعد الموافقة');
      ['upTitle', 'upContent'].forEach(function (id) { var element = document.getElementById(id); if (element) element.value = ''; });
      if (imageInput) imageInput.value = '';
      if (videoInput) videoInput.value = '';
      if (audioInput) audioInput.value = '';
      if (pdfInput) pdfInput.value = '';
      if (button) { button.disabled = false; button.textContent = '📤 إرسال العمل للمراجعة'; }
      screenBack();
    } catch (error) {
      console.error('Teacher upload failed', error);
      toast('تعذر رفع العمل: ' + (error.message || 'تحقق من الإنترنت'));
      if (button) { button.disabled = false; button.textContent = '📤 إرسال العمل للمراجعة'; }
    }
  };

  // Structured broadcast request; no teacher can create a live room directly.
  function ensureBroadcastRequestScreen() {
    if (document.getElementById('teacherLiveRequestScreen')) return;
    screen('teacherLiveRequestScreen', '📡 طلب فتح بث', 'linear-gradient(135deg,#B71C1C,#E53935)');
    var body = document.getElementById('teacherLiveRequestScreenContent');
    body.innerHTML = '<form id="teacherLiveRequestForm" class="tw-form" onsubmit="return false"><div class="form-group"><label>عنوان الحصة</label><input class="form-input" id="liveTitle" maxlength="100" placeholder="مثال: مراجعة الكسور"></div><div class="form-group"><label>المادة</label><input class="form-input" id="liveSubject" maxlength="60" placeholder="رياضيات"></div><div class="form-group"><label>المرحلة والصف</label><div style="display:flex;gap:8px"><select class="form-input" id="liveStage"><option value="primary">ابتدائي</option><option value="prep">إعدادي</option><option value="sec">ثانوي</option><option value="bakkalorya">بكالوريا</option></select><input class="form-input" id="liveGrade" maxlength="40" placeholder="الصف"></div></div><div class="form-group"><label>مدة البث (دقيقة)</label><input class="form-input" id="liveDuration" type="number" min="10" max="240" value="60"></div><div class="form-group"><label>آلية دخول الطلاب بعد موافقتك</label><select class="form-input" id="liveAccessMode"><option value="approval">المعلم يوافق على كل طالب</option><option value="open">دخول مفتوح (مع حد اختياري)</option></select></div><div class="form-group"><label>الحد الأقصى للطلاب (0 = بلا حد)</label><input class="form-input" id="liveCapacity" type="number" min="0" max="1000" value="0"></div><div style="font-size:12px;line-height:1.8;color:#607D8B;margin-bottom:12px">طلبك يصل للمالك. لن تُفتح الغرفة حتى يوافق عليه المالك ثم تبدأه من لوحة المعلم.</div><button id="liveRequestSubmit" class="btn-primary" onclick="window.submitTeacherLiveRequest()">📤 إرسال طلب البث للمالك</button></form>';
  }
  window.submitTeacherLiveRequest = async function () {
    if (!isTeacher()) return toast('يلزم حساب معلم معتمد');
    var title = document.getElementById('liveTitle').value.trim();
    var subject = document.getElementById('liveSubject').value.trim();
    var grade = document.getElementById('liveGrade').value.trim();
    var stage = document.getElementById('liveStage').value;
    var duration = Math.max(10, Math.min(240, Number(document.getElementById('liveDuration').value) || 60));
    var accessMode = document.getElementById('liveAccessMode').value === 'open' ? 'open' : 'approval';
    var capacity = Math.max(0, Math.min(1000, Number(document.getElementById('liveCapacity').value) || 0));
    if (!title || !subject || !grade) return toast('أكمل عنوان الحصة والمادة والصف');
    var button = document.getElementById('liveRequestSubmit');
    if (button) { button.disabled = true; button.textContent = '⏳ جارٍ الإرسال...'; }
    try {
      await db.collection('teacher_requests').add({
        teacherId: uid(), teacherName: window.currentUser.name, type: 'live',
        title: title, subject: subject, stage: stage, grade: grade,
        durationMinutes: duration, accessMode: accessMode, maxStudents: capacity,
        details: title + ' — ' + subject + ' — ' + grade,
        status: 'pending', createdAt: now()
      });
      toast('وصل طلب البث للمالك للموافقة');
      if (button) { button.disabled = false; button.textContent = '📤 إرسال طلب البث للمالك'; }
      screenBack();
      if (window.openTeacherControl) setTimeout(window.loadTeacherControl, 300);
    } catch (error) {
      console.error(error);
      toast('تعذر إرسال طلب البث');
      if (button) { button.disabled = false; button.textContent = '📤 إرسال طلب البث للمالك'; }
    }
  };

  function openTeacherRequestForm() {
    if (!isTeacher()) return toast('دخول المعلم المعتمد مطلوب');
    ensureBroadcastRequestScreen();
    enterScreen('teacherLiveRequestScreen');
  }
  window.openBroadcast = async function () {
    if (isTeacher()) return openTeacherRequestForm();
    if (isOwner()) return window.openOwnerBroadcasts();
    return window.openStudentBroadcasts();
  };
  window.openTeacherBroadcast = openTeacherRequestForm;

  window.openTeacherControl = function () {
    if (!isTeacher()) return toast('دخول المعلم المعتمد مطلوب');
    styleOnce();
    screen('teacherWorkflowScreen', '🎛️ لوحة المعلم', 'linear-gradient(135deg,#00695C,#00897B)');
    enterScreen('teacherWorkflowScreen');
    window.loadTeacherControl();
  };
  window.loadTeacherControl = async function () {
    if (!isTeacher()) return;
    styleOnce();
    var body = document.getElementById('teacherWorkflowScreenContent');
    if (!body) return;
    body.innerHTML = '<div class="tw-empty">⏳ جاري تحميل لوحة المعلم...</div>';
    try {
      var results = await Promise.all([
        db.collection('teacher_requests').where('teacherId', '==', uid()).get(),
        db.collection('broadcasts').where('teacherId', '==', uid()).get(),
        db.collection('teacher_uploads').where('teacherId', '==', uid()).get()
      ]);
      var requests = [];
      var broadcasts = [];
      var uploads = [];
      results[0].forEach(function (doc) { requests.push(Object.assign({ id: doc.id }, doc.data())); });
      results[1].forEach(function (doc) { broadcasts.push(Object.assign({ id: doc.id }, doc.data())); });
      results[2].forEach(function (doc) { uploads.push(Object.assign({ id: doc.id }, doc.data())); });
      requests.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      broadcasts.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      var html = '<div class="tw-actions"><button class="tw-btn" style="background:#1976D2;color:#fff" onclick="openTeacherUpload()">📤 رفع درس أو تدريب أو امتحان أو مراجعة</button><button class="tw-btn" style="background:#D32F2F;color:#fff" onclick="openBroadcast()">🔴 طلب بث جديد</button></div>';
      html += '<div class="tw-section">🔴 بثوثي</div>';
      var live = broadcasts.filter(function (b) { return b.status === 'live' && (!b.endAt || Date.parse(b.endAt) > Date.now()); });
      if (!live.length) html += '<div class="tw-empty">لا يوجد بث نشط الآن.</div>';
      live.forEach(function (b) {
        html += '<div class="tw-card"><div class="tw-title">' + esc(b.title) + '</div><div class="tw-meta">' + esc(b.subject) + ' • نهاية متوقعة: ' + esc(b.endAt || 'غير محددة') + '<br>دخول الطلاب: ' + (b.accessMode === 'open' ? 'مفتوح' : 'بموافقة المعلم') + ' • ' + (b.allowedStudents || []).length + (b.maxStudents ? '/' + b.maxStudents : '') + ' طالب</div><div class="tw-actions"><button class="tw-btn" style="background:#1976D2;color:#fff" onclick="openRoomFromPanel(\'' + attr(b.roomId) + '\')">🎥 دخول الغرفة</button><button class="tw-btn" style="background:#F9A825;color:#fff" onclick="openBroadcastRequests(\'' + attr(b.id) + '\')">👥 طلبات الطلاب (' + (b.pendingRequests || []).length + ')</button><button class="tw-btn" style="background:#616161;color:#fff" onclick="endTeacherBroadcast(\'' + attr(b.id) + '\')">⏹ إنهاء البث</button></div></div>';
      });
      html += '<div class="tw-section">📋 طلبات فتح البث</div>';
      var liveRequests = requests.filter(function (r) { return r.type === 'live'; });
      if (!liveRequests.length) html += '<div class="tw-empty">لم ترسل طلب بث بعد.</div>';
      liveRequests.forEach(function (r) {
        var status = r.status === 'approved' ? '✅ وافق المالك — يمكنك بدء الغرفة' : r.status === 'rejected' ? '❌ مرفوض' : r.status === 'activated' ? '🎥 تم إنشاء البث' : '⏳ ينتظر موافقة المالك';
        html += '<div class="tw-card"><div class="tw-title">' + esc(r.title || r.details) + '</div><div class="tw-meta">' + esc(r.subject) + ' • ' + esc(r.grade) + ' • ' + Number(r.durationMinutes || 60) + ' دقيقة<br>' + status + '</div>';
        if (r.status === 'approved') html += '<button class="tw-btn" style="background:#D32F2F;color:#fff" onclick="startApprovedLive(\'' + attr(r.id) + '\')">🎥 بدء البث بعد موافقة المالك</button>';
        html += '</div>';
      });
      html += '<div class="tw-section">📤 أعمالي المرفوعة</div>';
      if (!uploads.length) html += '<div class="tw-empty">لم ترفع محتوى بعد.</div>';
      uploads.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); }).forEach(function (item) {
        var status = item.status === 'approved' ? '✅ معتمد — يظهر في أيقونة شرح الأستاذ المستقلة' : item.status === 'rejected' ? '❌ مرفوض' : '⏳ عند المالك للمراجعة';
        html += '<div class="tw-card"><div class="tw-title">' + esc(item.title) + '</div><div class="tw-meta">' + esc(item.subject) + ' • ' + esc(item.grade) + ' • ' + status + '</div></div>';
      });
      body.innerHTML = html;
    } catch (error) {
      console.error('Teacher dashboard failed', error);
      body.innerHTML = '<div class="tw-empty">تعذر تحميل البيانات. قد تحتاج قواعد Firestore إلى إعداد صحيح.</div>';
    }
  };
  window.openRoomFromPanel = openRoom;
  window.openJitsiRoom = openRoom;
  window.startApprovedLive = async function (requestId) {
    if (!isTeacher()) return toast('هذه العملية للمعلم المعتمد فقط');
    try {
      var requestRef = db.collection('teacher_requests').doc(requestId);
      var requestDoc = await requestRef.get();
      if (!requestDoc.exists) throw new Error('لم أجد طلب البث');
      var request = requestDoc.data();
      if (request.teacherId !== uid() || request.type !== 'live' || request.status !== 'approved') throw new Error('لا يمكن بدء هذا البث قبل موافقة المالك على نفس الطلب');
      if (request.broadcastId) throw new Error('تم بدء هذا الطلب بالفعل');
      var roomId = newRoomId();
      var createdAt = new Date();
      var endAt = new Date(createdAt.getTime() + Math.max(10, Math.min(240, Number(request.durationMinutes) || 60)) * 60000);
      var broadcastRef = db.collection('broadcasts').doc();
      await broadcastRef.set({
        title: request.title || request.details || 'بث مباشر', subject: request.subject || '',
        stage: request.stage || '', grade: request.grade || '', teacherId: uid(),
        teacherName: window.currentUser.name, roomId: roomId, requestId: requestId,
        ownerApproved: true, status: 'live', accessMode: request.accessMode === 'open' ? 'open' : 'approval',
        maxStudents: Math.max(0, Number(request.maxStudents) || 0), allowedStudents: [], pendingRequests: [],
        createdAt: createdAt.toISOString(), endAt: endAt.toISOString()
      });
      await requestRef.update({ status: 'activated', broadcastId: broadcastRef.id, startedAt: createdAt.toISOString() });
      toast('تم فتح غرفة البث بعد موافقة المالك');
      openRoom(roomId);
      window.loadTeacherControl();
    } catch (error) {
      console.error('Start approved live failed', error);
      toast(error.message || 'تعذر فتح البث');
    }
  };
  window.endTeacherBroadcast = async function (broadcastId) {
    if (!isTeacher()) return toast('يلزم حساب معلم معتمد');
    if (!window.confirm('إنهاء البث داخل المنصة؟')) return;
    try {
      var ref = db.collection('broadcasts').doc(broadcastId);
      var doc = await ref.get();
      if (!doc.exists || doc.data().teacherId !== uid()) return toast('هذا البث ليس تابعًا لحسابك');
      await ref.update({ status: 'ended', endedAt: now(), endedBy: 'teacher' });
      toast('تم إنهاء البث في المنصة');
      window.loadTeacherControl();
    } catch (error) { console.error(error); toast('تعذر إنهاء البث'); }
  };

  // Owner panel: approve live requests and monitor/manage multiple active rooms.
  function ensureOwnerPanelEntry() {
    if (!isOwner()) return;
    var admin = document.getElementById('adminScreen');
    var content = admin && admin.querySelector('.content');
    if (!content) return;
    if (!document.getElementById('ownerBroadcastsEntry')) {
      var item = document.createElement('div');
      item.id = 'ownerBroadcastsEntry'; item.className = 'menu-item';
      item.innerHTML = '<span style="font-size:26px">📡</span><span style="flex:1;font-weight:700;color:#C62828">طلبات البث ومراقبة الغرف</span><span style="color:#999;font-size:24px">‹</span>';
      item.onclick = function () { window.openOwnerBroadcasts(); };
      content.insertBefore(item, content.firstChild);
    }
    if (!document.getElementById('ownerTeacherAccessEntry')) {
      var access = document.createElement('div');
      access.id = 'ownerTeacherAccessEntry'; access.className = 'menu-item';
      access.innerHTML = '<span style="font-size:26px">📱</span><span style="flex:1;font-weight:700;color:#00695C">طلبات تفعيل حسابات المعلمين</span><span style="color:#999;font-size:24px">‹</span>';
      access.onclick = function () { window.openTeacherAccessRequests(); };
      content.insertBefore(access, content.firstChild);
    }
  }
  window.openOwnerBroadcasts = async function () {
    if (!isOwner()) return toast('هذه الصفحة للمالك فقط');
    styleOnce(); screen('ownerBroadcastsScreen', '👑 إدارة البثوث', 'linear-gradient(135deg,#B71C1C,#E53935)');
    enterScreen('ownerBroadcastsScreen');
    await window.loadOwnerBroadcasts();
  };
  window.loadOwnerBroadcasts = async function () {
    if (!isOwner()) return;
    var body = document.getElementById('ownerBroadcastsScreenContent');
    if (!body) return;
    body.innerHTML = '<div class="tw-empty">⏳ جاري تحميل الطلبات والغرف...</div>';
    try {
      var all = await Promise.all([
        db.collection('teacher_requests').where('status', '==', 'pending').get(),
        db.collection('broadcasts').get()
      ]);
      var requests = []; var broadcasts = [];
      all[0].forEach(function (doc) { var request = doc.data(); if (request.type === 'live') requests.push(Object.assign({ id: doc.id }, request)); });
      all[1].forEach(function (doc) { broadcasts.push(Object.assign({ id: doc.id }, doc.data())); });
      requests.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      broadcasts.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      var html = '<div class="tw-section">⏳ طلبات فتح البث (' + requests.length + ')</div>';
      if (!requests.length) html += '<div class="tw-empty">لا توجد طلبات بث تنتظر موافقتك.</div>';
      requests.forEach(function (r) {
        html += '<div class="tw-card"><div class="tw-title">' + esc(r.title || r.details) + '</div><div class="tw-meta">👨‍🏫 ' + esc(r.teacherName) + '<br>' + esc(r.subject) + ' • ' + esc(r.stage) + ' • ' + esc(r.grade) + '<br>المدة: ' + Number(r.durationMinutes || 60) + ' دقيقة • الدخول: ' + (r.accessMode === 'open' ? 'مفتوح' : 'بموافقة المعلم') + ' • السعة: ' + (Number(r.maxStudents) || 'بلا حد') + '</div><div class="tw-actions"><button class="tw-btn" style="background:#2E7D32;color:#fff" onclick="approveLiveRequest(\'' + attr(r.id) + '\')">✅ موافقة</button><button class="tw-btn" style="background:#C62828;color:#fff" onclick="rejectLiveRequest(\'' + attr(r.id) + '\')">❌ رفض</button></div></div>';
      });
      var live = broadcasts.filter(function (b) { return b.status === 'live'; });
      html += '<div class="tw-section">🔴 الغرف المفتوحة (' + live.length + ')</div>';
      if (!live.length) html += '<div class="tw-empty">لا توجد غرف بث نشطة.</div>';
      live.forEach(function (b) {
        html += '<div class="tw-card"><div class="tw-title">' + esc(b.title) + '</div><div class="tw-meta">👨‍🏫 ' + esc(b.teacherName) + ' • ' + esc(b.subject) + '<br>الطلاب: ' + (b.allowedStudents || []).length + (b.maxStudents ? '/' + b.maxStudents : ' (مفتوح)') + '<br>نهاية المدة: ' + esc(b.endAt || 'غير محددة') + '</div><div class="tw-actions"><button class="tw-btn" style="background:#1976D2;color:#fff" onclick="openRoomFromPanel(\'' + attr(b.roomId) + '\')">👁️ مشاهدة الغرفة</button><button class="tw-btn" style="background:#C62828;color:#fff" onclick="ownerStopBroadcast(\'' + attr(b.id) + '\')">⏹ إيقاف</button><button class="tw-btn" style="background:#616161;color:#fff" onclick="ownerDeleteBroadcast(\'' + attr(b.id) + '\')">🗑 حذف السجل</button></div></div>';
      });
      body.innerHTML = html;
    } catch (error) {
      console.error('Owner broadcast panel failed', error);
      body.innerHTML = '<div class="tw-empty">تعذر تحميل غرف البث. تحقق من صلاحيات Firestore.</div>';
    }
  };
  window.approveLiveRequest = async function (id) {
    if (!isOwner()) return toast('هذه العملية للمالك فقط');
    try { await db.collection('teacher_requests').doc(id).update({ status: 'approved', approvedAt: now(), approvedBy: uid() }); toast('تمت الموافقة؛ يستطيع المعلم الآن بدء الغرفة'); await window.loadOwnerBroadcasts(); }
    catch (error) { console.error(error); toast('تعذرت الموافقة'); }
  };
  window.rejectLiveRequest = async function (id) {
    if (!isOwner()) return toast('هذه العملية للمالك فقط');
    if (!window.confirm('رفض طلب فتح البث؟')) return;
    try { await db.collection('teacher_requests').doc(id).update({ status: 'rejected', reviewedAt: now(), reviewedBy: uid() }); toast('تم رفض الطلب'); await window.loadOwnerBroadcasts(); }
    catch (error) { console.error(error); toast('تعذر تسجيل الرفض'); }
  };
  window.ownerStopBroadcast = async function (id) {
    if (!isOwner()) return toast('هذه العملية للمالك فقط');
    if (!window.confirm('إيقاف البث داخل المنصة الآن؟')) return;
    try { await db.collection('broadcasts').doc(id).update({ status: 'ended', endedAt: now(), endedBy: 'owner' }); toast('تم إيقاف البث في المنصة'); await window.loadOwnerBroadcasts(); }
    catch (error) { console.error(error); toast('تعذر إيقاف البث'); }
  };
  window.ownerDeleteBroadcast = async function (id) {
    if (!isOwner()) return toast('هذه العملية للمالك فقط');
    if (!window.confirm('حذف سجل البث نهائيًا؟')) return;
    try { await db.collection('broadcasts').doc(id).delete(); toast('تم حذف سجل البث'); await window.loadOwnerBroadcasts(); }
    catch (error) { console.error(error); toast('تعذر حذف سجل البث'); }
  };

  // Students request admission; teachers approve individual students. Open mode is an explicit teacher choice.
  window.openStudentBroadcasts = async function () {
    if (!window.currentUser || window.currentRole !== 'student') return toast('سجّل الدخول كطالب لعرض البث');
    styleOnce(); screen('studentBroadcastsScreen', '🔴 البثوث المتاحة', 'linear-gradient(135deg,#D32F2F,#E53935)');
    enterScreen('studentBroadcastsScreen');
    await window.loadStudentBroadcasts();
  };
  window.loadStudentBroadcasts = async function () {
    var body = document.getElementById('studentBroadcastsScreenContent');
    if (!body) return;
    body.innerHTML = '<div class="tw-empty">⏳ جاري البحث عن بث مباشر...</div>';
    try {
      var snap = await db.collection('broadcasts').where('status', '==', 'live').get();
      var list = [];
      snap.forEach(function (doc) {
        var item = Object.assign({ id: doc.id }, doc.data());
        var isCurrentKindergartenClass = typeof currentStage === 'undefined' || currentStage !== 'kindergarten_languages' || (item.stage === 'kindergarten_languages' && item.grade === currentGrade);
        if ((!item.endAt || Date.parse(item.endAt) > Date.now()) && isCurrentKindergartenClass) list.push(item);
      });
      list.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      if (!list.length) { body.innerHTML = '<div class="tw-empty">لا يوجد بث متاح الآن.</div>'; return; }
      body.innerHTML = '';
      list.forEach(function (b) {
        var card = document.createElement('div'); card.className = 'tw-card';
        var title = document.createElement('div'); title.className = 'tw-title'; title.textContent = b.title || 'بث مباشر';
        var meta = document.createElement('div'); meta.className = 'tw-meta';
        meta.textContent = '👨‍🏫 ' + (b.teacherName || 'المعلم') + ' • ' + (b.subject || '') + ' • ' + (b.grade || '') + ' — الحضور ' + (b.allowedStudents || []).length + (b.maxStudents ? '/' + b.maxStudents : '');
        card.appendChild(title); card.appendChild(meta);
        var uidNow = uid();
        var allowed = (b.allowedStudents || []).indexOf(uidNow) >= 0;
        var pending = (b.pendingRequests || []).indexOf(uidNow) >= 0;
        var actions = document.createElement('div'); actions.className = 'tw-actions';
        var button = document.createElement('button'); button.className = 'tw-btn'; button.style.background = allowed || b.accessMode === 'open' ? '#2E7D32' : '#1976D2'; button.style.color = '#fff';
        if (allowed) { button.textContent = '✅ دخول البث'; button.onclick = function () { window.joinTeacherBroadcast(b.id); }; }
        else if (pending) { button.textContent = '⏳ طلبك عند المعلم'; button.disabled = true; }
        else { button.textContent = b.accessMode === 'open' ? '🎥 انضمام مفتوح' : '📩 طلب الانضمام'; button.onclick = function () { window.joinTeacherBroadcast(b.id); }; }
        actions.appendChild(button); card.appendChild(actions); body.appendChild(card);
      });
    } catch (error) { console.error(error); body.innerHTML = '<div class="tw-empty">تعذر تحميل البثوث.</div>'; }
  };
  window.joinTeacherBroadcast = async function (broadcastId) {
    if (window.currentRole !== 'student' || !uid()) return toast('سجّل الدخول كطالب أولًا');
    try {
      var ref = db.collection('broadcasts').doc(broadcastId);
      var result = await db.runTransaction(async function (transaction) {
        var doc = await transaction.get(ref);
        if (!doc.exists) throw new Error('البث غير موجود');
        var b = doc.data();
        if (b.status !== 'live' || (b.endAt && Date.parse(b.endAt) <= Date.now())) throw new Error('انتهى هذا البث');
        var allowed = Array.isArray(b.allowedStudents) ? b.allowedStudents.slice() : [];
        var pending = Array.isArray(b.pendingRequests) ? b.pendingRequests.slice() : [];
        if (allowed.indexOf(uid()) >= 0) return { allowed: true, roomId: b.roomId };
        if (pending.indexOf(uid()) >= 0) return { pending: true };
        var cap = Number(b.maxStudents) || 0;
        if (cap > 0 && allowed.length + pending.length >= cap) throw new Error('اكتمل العدد المسموح به لهذا البث');
        if (b.accessMode === 'open') {
          allowed.push(uid());
          transaction.update(ref, { allowedStudents: allowed });
          return { allowed: true, roomId: b.roomId };
        }
        pending.push(uid());
        transaction.update(ref, { pendingRequests: pending });
        return { pending: true };
      });
      if (result.allowed) { toast('تم قبول دخولك'); openRoom(result.roomId); }
      else toast('أرسلنا طلبك للمعلم؛ ادخل مجددًا بعد الموافقة');
      await window.loadStudentBroadcasts();
    } catch (error) { console.error(error); toast(error.message || 'تعذر طلب الانضمام'); }
  };
  window.openBroadcastRequests = async function (broadcastId) {
    if (!isTeacher()) return toast('هذه العملية للمعلم فقط');
    var doc = await db.collection('broadcasts').doc(broadcastId).get();
    if (!doc.exists || doc.data().teacherId !== uid()) return toast('ليس لديك صلاحية إدارة هذه الغرفة');
    var data = doc.data();
    var pending = data.pendingRequests || [];
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.75);overflow:auto;padding:18px';
    var panel = document.createElement('div');
    panel.style.cssText = 'max-width:520px;margin:20px auto;background:#fff;border-radius:16px;padding:16px';
    var heading = document.createElement('h3'); heading.textContent = 'طلبات دخول الطلاب (' + pending.length + ')'; panel.appendChild(heading);
    if (!pending.length) { var empty = document.createElement('p'); empty.textContent = 'لا توجد طلبات معلقة'; panel.appendChild(empty); }
    for (var i = 0; i < pending.length; i++) {
      var studentId = pending[i];
      var userDoc = await db.collection('users').doc(studentId).get().catch(function () { return null; });
      var name = userDoc && userDoc.exists ? (userDoc.data().name || 'طالب') : 'طالب';
      var row = document.createElement('div'); row.className = 'tw-card';
      var label = document.createElement('span'); label.textContent = name + ' · ' + studentId;
      row.appendChild(label);
      var accept = document.createElement('button'); accept.className = 'tw-btn'; accept.style.cssText = 'background:#2E7D32;color:#fff;margin:6px'; accept.textContent = 'قبول'; accept.onclick = function (bid, sid) { return function () { window.approveBroadcastStudent(bid, sid).then(function () { box.remove(); window.openBroadcastRequests(bid); }); }; }(broadcastId, studentId);
      var reject = document.createElement('button'); reject.className = 'tw-btn'; reject.style.cssText = 'background:#C62828;color:#fff;margin:6px'; reject.textContent = 'رفض'; reject.onclick = function (bid, sid) { return function () { window.rejectBroadcastStudent(bid, sid).then(function () { box.remove(); window.openBroadcastRequests(bid); }); }; }(broadcastId, studentId);
      row.appendChild(accept); row.appendChild(reject); panel.appendChild(row);
    }
    var close = document.createElement('button'); close.className = 'tw-btn'; close.style.cssText = 'width:100%;background:#616161;color:#fff'; close.textContent = 'إغلاق'; close.onclick = function () { box.remove(); };
    panel.appendChild(close); box.appendChild(panel); document.body.appendChild(box);
  };
  window.approveBroadcastStudent = async function (broadcastId, studentId) {
    if (!isTeacher()) return toast('هذه العملية للمعلم فقط');
    try {
      var ref = db.collection('broadcasts').doc(broadcastId);
      await db.runTransaction(async function (transaction) {
        var doc = await transaction.get(ref);
        if (!doc.exists) throw new Error('الغرفة غير موجودة');
        var b = doc.data();
        if (b.teacherId !== uid() || b.status !== 'live') throw new Error('لا تملك صلاحية إدارة هذه الغرفة');
        var allowed = Array.isArray(b.allowedStudents) ? b.allowedStudents.slice() : [];
        var pending = Array.isArray(b.pendingRequests) ? b.pendingRequests.slice() : [];
        if (pending.indexOf(studentId) < 0) throw new Error('طلب الطالب لم يعد معلقًا');
        var cap = Number(b.maxStudents) || 0;
        if (cap > 0 && allowed.length >= cap) throw new Error('وصل البث إلى الحد الأقصى للطلاب');
        transaction.update(ref, { pendingRequests: pending.filter(function (id) { return id !== studentId; }), allowedStudents: allowed.indexOf(studentId) >= 0 ? allowed : allowed.concat([studentId]) });
      });
      toast('تم قبول الطالب');
    } catch (error) { console.error(error); toast(error.message || 'تعذر قبول الطالب'); }
  };
  window.rejectBroadcastStudent = async function (broadcastId, studentId) {
    if (!isTeacher()) return toast('هذه العملية للمعلم فقط');
    try {
      var ref = db.collection('broadcasts').doc(broadcastId);
      var doc = await ref.get();
      if (!doc.exists || doc.data().teacherId !== uid()) throw new Error('ليس لديك صلاحية لهذه الغرفة');
      var pending = (doc.data().pendingRequests || []).filter(function (id) { return id !== studentId; });
      await ref.update({ pendingRequests: pending });
      toast('تم رفض الطلب');
    } catch (error) { console.error(error); toast('تعذر رفض الطلب'); }
  };
  window.approveStudent = window.approveBroadcastStudent;
  window.rejectStudent = window.rejectBroadcastStudent;
  window.removeAllowedStudent = async function (broadcastId, studentId) {
    if (!isTeacher() && !isOwner()) return toast('ليس لديك صلاحية');
    try {
      var ref = db.collection('broadcasts').doc(broadcastId);
      var doc = await ref.get();
      if (!doc.exists || (!isOwner() && doc.data().teacherId !== uid())) return toast('ليس لديك صلاحية');
      await ref.update({ allowedStudents: (doc.data().allowedStudents || []).filter(function (id) { return id !== studentId; }) });
      toast('تمت إزالة الطالب');
    } catch (error) { console.error(error); toast('تعذر إزالة الطالب'); }
  };

  // Teacher activation applications are listed for the owner, but activation remains an Admin SDK/console action.
  window.openTeacherAccessRequests = async function () {
    if (!isOwner()) return toast('هذه الصفحة للمالك فقط');
    styleOnce(); screen('teacherAccessRequestsScreen', '📱 تفعيل حسابات المعلمين', 'linear-gradient(135deg,#00695C,#00897B)');
    enterScreen('teacherAccessRequestsScreen');
    var body = document.getElementById('teacherAccessRequestsScreenContent');
    body.innerHTML = '<div class="tw-empty">⏳ جاري تحميل الطلبات...</div>';
    try {
      var snap = await db.collection('teacher_access_requests').where('status', '==', 'pending').get();
      var items = []; snap.forEach(function (doc) { items.push(Object.assign({ id: doc.id }, doc.data())); });
      if (!items.length) { body.innerHTML = '<div class="tw-empty">لا توجد طلبات تفعيل معلقة.</div>'; return; }
      body.innerHTML = '<div class="tw-empty">لأمان الحساب، لا نعتمد المعلم بكتابة دور من واجهة المتصفح. بعد التحقق من صاحب الرقم، أنشئ/حدّث teacher_accounts/{UID} من Firebase Console أو خادم Admin SDK بالحالة approved. هذا يمنع الطالب من منح نفسه صلاحية.</div>';
      items.forEach(function (item) {
        var card = document.createElement('div'); card.className = 'tw-card';
        var title = document.createElement('div'); title.className = 'tw-title'; title.textContent = item.displayName || 'طلب معلم'; card.appendChild(title);
        var meta = document.createElement('div'); meta.className = 'tw-meta'; meta.textContent = 'الهاتف: ' + (item.phoneNumber || '') + ' • Auth UID: ' + (item.uid || item.id); card.appendChild(meta);
        var copy = document.createElement('button'); copy.className = 'tw-btn'; copy.style.cssText = 'background:#1976D2;color:#fff'; copy.textContent = 'نسخ UID'; copy.onclick = function () { if (navigator.clipboard) navigator.clipboard.writeText(item.uid || item.id).then(function () { toast('تم نسخ UID'); }); else window.prompt('انسخ UID', item.uid || item.id); }; card.appendChild(copy); body.appendChild(card);
      });
    } catch (error) { console.error(error); body.innerHTML = '<div class="tw-empty">تعذر قراءة الطلبات. راجع قواعد Firestore.</div>'; }
  };

  window.ensureTeacherDirectoryEntry = function () {
    var grid = document.querySelector('#homeScreen .tools-grid');
    if (!grid || document.getElementById('teacherDirectoryEntry')) return;
    var entry = document.createElement('button');
    entry.type = 'button'; entry.id = 'teacherDirectoryEntry'; entry.className = 'tool-btn';
    entry.style.fontFamily = 'inherit';
    entry.innerHTML = '<div class="tool-icon" style="background:#E0F2F1;color:#00695C">👨‍🏫</div><div class="tool-label">شرح الأستاذ</div>';
    entry.onclick = function () { window.openTeacherDirectory(); };
    grid.insertBefore(entry, grid.firstChild);
  };
  window.ensureTeacherEntry = function () {
    if (!isTeacher()) return;
    var grid = document.querySelector('#homeScreen .tools-grid');
    if (!grid) return;
    ['teacherReqBtn', 'teacherControlBtn', 'uploadBtn', 'teacherDashBtn'].forEach(function (id) { var old = document.getElementById(id); if (old) old.remove(); });
    if (!document.getElementById('teacherHubEntry')) {
      var entry = document.createElement('button'); entry.type = 'button'; entry.id = 'teacherHubEntry'; entry.className = 'tool-btn';
      entry.innerHTML = '<div class="tool-icon" style="background:#E0F2F1;color:#00695C">🎛️</div><div class="tool-label">لوحة المعلم</div>';
      entry.onclick = function () { window.openTeacherControl(); }; grid.insertBefore(entry, grid.firstChild);
    }
  };
  function ensureOwnerEntries() { ensureOwnerPanelEntry(); }
  function repairUploadScreen() { if (document.getElementById('teacherUploadScreen')) ensureUploadForm(); }
  function initialize() {
    styleOnce(); ensureBroadcastRequestScreen(); repairUploadScreen();
    window.ensureTeacherDirectoryEntry(); window.ensureTeacherEntry(); ensureOwnerEntries();
    if (liveRefreshTimer) clearInterval(liveRefreshTimer);
    liveRefreshTimer = setInterval(function () { repairUploadScreen(); window.ensureTeacherDirectoryEntry(); window.ensureTeacherEntry(); ensureOwnerEntries(); }, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
  window.addEventListener('load', initialize);
})();
