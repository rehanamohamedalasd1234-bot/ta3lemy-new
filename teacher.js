/* بوابة المعلم والدرجات — تستخدم Firebase Auth ووظائفًا خادمية للتحقق من الصلاحيات. */
(function () {
  'use strict';

  var REGION = (window.CREATIVITY_CONFIG && window.CREATIVITY_CONFIG.functionsRegion) || 'us-central1';
  var IMAGE_MAX_BYTES = 10 * 1024 * 1024;
  var VIDEO_MAX_BYTES = 50 * 1024 * 1024;
  var dashboardId = 'teacherDashboardScreen';

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.info('[بوابة المعلم] ' + message);
  }

  function esc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function callFn(name, data) {
    if (!window.firebase || !firebase.functions) return Promise.reject(new Error('خدمات Firebase غير محمّلة.'));
    try {
      return firebase.functions(REGION).httpsCallable(name)(data || {}).then(function (result) {
        return result && result.data ? result.data : {};
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function errorText(error) {
    var code = error && error.code ? String(error.code) : '';
    if (!navigator.onLine) return 'هذه الخطوة تحتاج إلى اتصال بالإنترنت.';
    if (code.indexOf('unauthenticated') >= 0) return 'بيانات الدخول غير صحيحة أو انتهت الجلسة.';
    if (code.indexOf('permission-denied') >= 0) return 'الحساب غير معتمد لهذه العملية.';
    if (code.indexOf('failed-precondition') >= 0 || code.indexOf('app-check') >= 0) {
      return error.message || 'لم يكتمل إعداد حماية Firebase. راجع دليل الإعداد.';
    }
    if (code.indexOf('already-exists') >= 0) return error.message || 'هذا الحساب مسجل بالفعل.';
    if (code.indexOf('functions/not-found') >= 0 || code.indexOf('not-found') >= 0) return 'خدمة بوابة المعلم لم تُنشر بعد.';
    return error && error.message ? error.message : 'حدث خطأ. حاول مرة أخرى.';
  }

  function showScreen(id) {
    if (typeof window.showScreen === 'function') window.showScreen(id);
  }

  function addScreen(id, title, content, color) {
    if (document.getElementById(id)) return document.getElementById(id);
    var screen = document.createElement('div');
    screen.id = id;
    screen.className = 'screen';
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,' + color + ',#00695C);">' +
      '<button class="icon-btn" type="button" data-back>→</button><div class="logo"><span>' + title + '</span></div>' +
      '<button class="icon-btn" type="button" data-refresh aria-label="تحديث">↻</button></div>' +
      '<div class="content" id="' + id + 'Content">' + content + '</div>';
    document.body.appendChild(screen);
    var back = screen.querySelector('[data-back]');
    var refresh = screen.querySelector('[data-refresh]');
    if (back) back.addEventListener('click', function () { if (typeof window.goBack === 'function') window.goBack(); });
    if (refresh) refresh.addEventListener('click', function () { if (typeof screen.refresh === 'function') screen.refresh(); });
    return screen;
  }

  function ensureScreens() {
    var dashboard = addScreen(dashboardId, '🎛️ لوحة المعلم', '<div id="teacherDashboardContent"></div>', '#00695C');
    dashboard.refresh = window.loadTeacherDashboard;
    var content = addScreen('teacherContentScreen', '📤 رفع محتوى تعليمي',
      '<div class="teacher-card"><p>سيصل المحتوى إلى المالك للمراجعة قبل نشره للطلاب.</p>' +
      '<div class="form-group"><label class="form-label">نوع المحتوى</label><select class="form-input" id="tpType"><option value="lesson">شرح درس</option><option value="exercise">تدريب</option><option value="exam">امتحان</option><option value="video">فيديو تعليمي</option></select></div>' +
      '<div class="form-group"><label class="form-label">المرحلة</label><select class="form-input" id="tpStage"><option value="primary">ابتدائي</option><option value="prep">إعدادي</option><option value="sec">ثانوي</option></select></div>' +
      '<div class="form-group"><label class="form-label">الصف</label><select class="form-input" id="tpGrade"></select><small>القائمة تطابق أسماء الصفوف الظاهرة للطلاب.</small></div>' +
      '<div class="form-group"><label class="form-label">المادة (اكتب الاسم كما يظهر للطالب)</label><input class="form-input" id="tpSubject" maxlength="80" placeholder="مثال: تاريخ أو اللغة العربية"></div>' +
      '<div class="form-group"><label class="form-label">الترم</label><select class="form-input" id="tpTerm"><option value="1">الترم الأول</option><option value="2">الترم الثاني</option></select></div>' +
      '<div class="form-group"><label class="form-label">عنوان المحتوى</label><input class="form-input" id="tpTitle" maxlength="120" placeholder="اكتب عنوانًا واضحًا"></div>' +
      '<div class="form-group"><label class="form-label">الشرح أو الأسئلة</label><textarea class="form-input" id="tpBody" rows="6" maxlength="15000" placeholder="اكتب الشرح أو التدريبات أو أسئلة الامتحان"></textarea></div>' +
      '<div class="form-group"><label class="form-label">صورة (اختياري، حتى 10 MB)</label><input class="form-input" id="tpImage" type="file" accept="image/png,image/jpeg,image/webp"></div>' +
      '<div class="form-group"><label class="form-label">فيديو (اختياري، حتى 50 MB)</label><input class="form-input" id="tpVideo" type="file" accept="video/mp4,video/webm,video/quicktime"></div>' +
      '<button class="btn-primary" id="tpSubmit" type="button">إرسال للمراجعة</button><p id="tpStatus" role="status"></p></div>', '#1976D2');
    content.refresh = window.openTeacherContentForm;
    var stageSelect = document.getElementById('tpStage');
    if (stageSelect && !stageSelect._teacherGradeHooked) {
      stageSelect.addEventListener('change', updateGradeOptions);
      stageSelect._teacherGradeHooked = true;
    }
    updateGradeOptions();
    var grades = addScreen('teacherGradesScreen', '⭐ تقييم الطلاب',
      '<div id="teacherGradesContent"></div>', '#00897B');
    grades.refresh = window.loadTeacherGrades;
    var owner = addScreen('ownerTeachersScreen', '👑 إدارة المعلمين والمحتوى',
      '<div id="ownerTeachersContent"></div>', '#B71C1C');
    owner.refresh = window.loadOwnerTeacherCenter;
    var contentSubmit = document.getElementById('tpSubmit');
    if (contentSubmit) contentSubmit.addEventListener('click', submitTeacherContent);
  }

  function updateGradeOptions() {
    var stage = document.getElementById('tpStage');
    var grade = document.getElementById('tpGrade');
    if (!stage || !grade) return;
    var names = stage.value.indexOf('primary') >= 0
      ? ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس']
      : ['الأول', 'الثاني', 'الثالث'];
    grade.innerHTML = names.map(function (name) {
      return '<option value="' + esc(name) + '">' + esc(name) + '</option>';
    }).join('');
  }

  function pushScreen(id) {
    try { if (window.screenHistory) window.screenHistory.push(window.currentScreen); } catch (_) {}
    showScreen(id);
  }

  function setCurrentUser(data, role, email) {
    window.currentUser = {
      uid: data.uid,
      name: data.name || email || (role === 'owner' ? 'مالك المنصة' : 'طالب'),
      email: email || '',
      role: role,
      points: Number(data.points) || 0,
      photo_url: data.photo_url || ''
    };
    window.currentRole = role;
    try {
      localStorage.setItem('lastUser', JSON.stringify({
        uid: data.uid, name: window.currentUser.name, role: role, points: window.currentUser.points
      }));
    } catch (_) {}
    updateLoginControls();
    refreshTools();
  }

  function auth() {
    if (!window.firebase || !firebase.auth) throw new Error('تسجيل الدخول الآمن غير متاح في هذه النسخة.');
    return firebase.auth();
  }

  window.securePortalLogin = async function (role, identifier, password) {
    if (!navigator.onLine) { toast('تسجيل المعلم والمالك يحتاج إلى الإنترنت.'); return; }
    identifier = String(identifier || '').trim();
    password = String(password || '');
    if (!identifier || password.length < 6) {
      toast(role === 'teacher' ? 'اكتب اسم المعلم وكلمة المرور.' : 'اكتب البريد الإلكتروني وكلمة المرور بشكل صحيح.');
      return;
    }
    try {
      var email;
      if (role === 'teacher') {
        if (identifier.length < 3 || identifier.length > 40 || /\s/.test(identifier)) {
          toast('اسم دخول المعلم من 3 إلى 40 حرفًا أو رقمًا ومن دون مسافات.');
          return;
        }
        var loginName = await callFn('teacherResolveLoginName', { username: identifier });
        email = loginName.email;
      } else {
        email = identifier.toLowerCase();
        if (email.indexOf('@') < 1) { toast('اكتب البريد الإلكتروني وكلمة المرور بشكل صحيح.'); return; }
      }
      var credential = await auth().signInWithEmailAndPassword(email, password);
      var result = await callFn('portalResolveAccess', {});
      if (result.role !== role) {
        await auth().signOut();
        toast(role === 'owner' ? 'هذا الحساب ليس حساب مالك المنصة.' : 'هذا الحساب ليس حساب معلم معتمد.');
        return;
      }
      if (role === 'teacher' && result.status !== 'active') {
        await auth().signOut();
        toast(result.status === 'rejected' ? 'تم رفض طلب المعلم. تواصل مع المالك.' : 'طلبك في انتظار موافقة المالك.');
        return;
      }
      setCurrentUser({ uid: credential.user.uid, name: result.name || credential.user.displayName || email }, role, email);
      toast('تم تسجيل الدخول بأمان.');
      showScreen('homeScreen');
    } catch (error) {
      console.error('بوابة المعلم: تعذر تسجيل الدخول', error && error.code);
      if (role === 'teacher' && window.firebase && firebase.auth && auth().currentUser) {
        try { await auth().signOut(); } catch (_) {}
      }
      if (role === 'teacher' && error && /^auth\/(user-not-found|wrong-password|invalid-credential|invalid-login-credentials|invalid-email)$/.test(error.code)) {
        toast('اسم المعلم أو كلمة المرور غير صحيحة.');
      } else {
        toast(errorText(error));
      }
    }
  };

  window.openTeacherDashboard = async function () {
    if (window.currentRole !== 'teacher') { toast('لوحة المعلم للمعلم المعتمد فقط.'); return; }
    ensureScreens();
    pushScreen(dashboardId);
    await window.loadTeacherDashboard();
  };

  window.openTeacherControl = window.openTeacherDashboard;
  window.openTeacherUpload = function () {
    if (window.currentRole !== 'teacher') { toast('رفع المحتوى للمعلم المعتمد فقط.'); return; }
    ensureScreens();
    pushScreen('teacherContentScreen');
  };
  window.openTeacherContentForm = window.openTeacherUpload;

  window.loadTeacherDashboard = async function () {
    var content = document.getElementById('teacherDashboardContent');
    if (!content) return;
    content.innerHTML = '<p style="text-align:center;padding:20px">جارٍ تحميل لوحة المعلم...</p>';
    try {
      var results = await Promise.all([callFn('teacherListMyContent', {}), callFn('teacherListMyGrades', {})]);
      var uploads = results[0].items || [];
      var grades = results[1].items || [];
      var html = '<div class="teacher-grid"><button class="btn-primary" id="teacherAddContent">📤 إضافة درس أو تدريب أو امتحان أو فيديو</button>' +
        '<button class="btn-primary" id="teacherGradeStudents">⭐ تقييم طالب</button></div>' +
        '<div class="teacher-stats"><b>' + uploads.length + '</b> محتوى في سجلّك <span> • </span><b>' + grades.length + '</b> تقييم محفوظ</div>' +
        '<h3>محتواك وحالة المراجعة</h3>';
      if (!uploads.length) html += '<p class="teacher-empty">لم ترسل محتوى بعد.</p>';
      uploads.forEach(function (item) {
        var status = item.status === 'approved' ? 'منشور' : item.status === 'rejected' ? 'مرفوض' : 'ينتظر موافقة المالك';
        html += '<article class="teacher-item"><b>' + esc(typeName(item.type)) + ' — ' + esc(item.title) + '</b>' +
          '<div>' + esc(item.subject) + ' • ' + esc(item.grade) + ' • ' + esc(item.stage) + ' • ' + esc(status) + '</div></article>';
      });
      content.innerHTML = html;
      document.getElementById('teacherAddContent').addEventListener('click', window.openTeacherUpload);
      document.getElementById('teacherGradeStudents').addEventListener('click', window.openTeacherGrades);
    } catch (error) {
      content.innerHTML = '<p class="teacher-error">' + esc(errorText(error)) + '</p>';
    }
  };

  function typeName(type) {
    return type === 'exercise' ? 'تدريب' : type === 'exam' ? 'امتحان' : type === 'video' ? 'فيديو' : 'درس';
  }

  async function uploadSignedFile(file, resourceType) {
    var max = resourceType === 'image' ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
    if (!file || file.size > max) throw new Error(resourceType === 'image' ? 'حجم الصورة أكبر من 10 MB.' : 'حجم الفيديو أكبر من 50 MB.');
    if (resourceType === 'image' && !/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error('صيغة الصورة يجب أن تكون PNG أو JPG أو WEBP.');
    if (resourceType === 'video' && !/^video\/(mp4|webm|quicktime)$/.test(file.type)) throw new Error('صيغة الفيديو يجب أن تكون MP4 أو WEBM أو MOV.');
    var signed = await callFn('teacherCreateUploadSignature', { resourceType: resourceType });
    var form = new FormData();
    form.append('file', file);
    form.append('api_key', signed.apiKey);
    form.append('timestamp', String(signed.timestamp));
    form.append('folder', signed.folder);
    form.append('signature', signed.signature);
    var response = await fetch(signed.uploadUrl, { method: 'POST', body: form });
    var body = await response.json();
    if (!response.ok || !body.secure_url) throw new Error('تعذر رفع الملف إلى Cloudinary.');
    return body.secure_url;
  }

  async function submitTeacherContent() {
    var button = document.getElementById('tpSubmit');
    var status = document.getElementById('tpStatus');
    var imageFile = document.getElementById('tpImage').files[0];
    var videoFile = document.getElementById('tpVideo').files[0];
    if (imageFile && videoFile) { status.textContent = 'ارفع صورة أو فيديو واحدًا في الطلب؛ يمكنك إرسال ملف آخر بطلب مستقل.'; return; }
    var data = {
      type: document.getElementById('tpType').value,
      stage: document.getElementById('tpStage').value,
      grade: document.getElementById('tpGrade').value.trim(),
      subject: document.getElementById('tpSubject').value.trim(),
      term: Number(document.getElementById('tpTerm').value),
      title: document.getElementById('tpTitle').value.trim(),
      content: document.getElementById('tpBody').value.trim(),
      imageUrl: '',
      videoUrl: ''
    };
    if (!data.grade || !data.subject || !data.title || (!data.content && !imageFile && !videoFile)) {
      status.textContent = 'أكمل الصف والمادة والعنوان، وأضف شرحًا أو ملفًا.';
      return;
    }
    button.disabled = true;
    status.textContent = 'جارٍ رفع الملف وحفظ الطلب...';
    try {
      if (imageFile) data.imageUrl = await uploadSignedFile(imageFile, 'image');
      if (videoFile) data.videoUrl = await uploadSignedFile(videoFile, 'video');
      await callFn('teacherSubmitContent', data);
      status.textContent = 'تم إرسال المحتوى للمراجعة. سيظهر للطلاب بعد موافقة المالك.';
      document.getElementById('tpTitle').value = '';
      document.getElementById('tpBody').value = '';
      document.getElementById('tpImage').value = '';
      document.getElementById('tpVideo').value = '';
      toast('تم إرسال المحتوى للمراجعة.');
    } catch (error) {
      status.textContent = errorText(error);
      console.error('رفع محتوى المعلم تعذر', error && error.code);
    }
    button.disabled = false;
  }

  window.submitTeacherUpload = submitTeacherContent;
  window.openTeacherGrades = async function () {
    if (window.currentRole !== 'teacher') { toast('التقييم للمعلم المعتمد فقط.'); return; }
    ensureScreens();
    pushScreen('teacherGradesScreen');
    await window.loadTeacherGrades();
  };

  window.loadTeacherGrades = async function () {
    var container = document.getElementById('teacherGradesContent');
    if (!container) return;
    container.innerHTML = '<p>جارٍ تحميل الطلاب...</p>';
    try {
      var result = await callFn('teacherListStudents', {});
      var students = result.items || [];
      var options = '<option value="">اختر الطالب</option>';
      students.forEach(function (student) {
        options += '<option value="' + esc(student.id) + '">' + esc(student.name) + (student.grade ? ' — ' + esc(student.grade) : '') + '</option>';
      });
      container.innerHTML = '<div class="teacher-card"><h3>تسجيل تقييم جديد</h3>' +
        '<div class="form-group"><label class="form-label">الطالب</label><select class="form-input" id="gradeStudent">' + options + '</select></div>' +
        '<div class="form-group"><label class="form-label">المادة</label><input class="form-input" id="gradeSubject" maxlength="80"></div>' +
        '<div class="form-group"><label class="form-label">عنوان التقييم</label><input class="form-input" id="gradeTitle" maxlength="120" placeholder="مثال: اختبار الدرس الأول"></div>' +
        '<div class="form-group"><label class="form-label">الدرجة من 100</label><input class="form-input" id="gradeScore" type="number" min="0" max="100" step="0.5"></div>' +
        '<div class="form-group"><label class="form-label">ملاحظات للطالب</label><textarea class="form-input" id="gradeFeedback" rows="3" maxlength="1200"></textarea></div>' +
        '<p class="teacher-note">التقدير يحسب تلقائيًا: 90 ممتاز، 80 جيد جدًا، 65 جيد، 50 مقبول، وأقل من ذلك يحتاج متابعة.</p>' +
        '<button class="btn-primary" id="gradeSave">حفظ التقييم</button><p id="gradeStatus" role="status"></p></div>' +
        '<h3>آخر التقييمات</h3><div id="teacherGradeHistory"></div>';
      document.getElementById('gradeSave').addEventListener('click', saveTeacherGrade);
      await renderTeacherGradeHistory();
    } catch (error) {
      container.innerHTML = '<p class="teacher-error">' + esc(errorText(error)) + '</p>';
    }
  };

  async function saveTeacherGrade() {
    var button = document.getElementById('gradeSave');
    var status = document.getElementById('gradeStatus');
    var data = {
      studentId: document.getElementById('gradeStudent').value,
      subject: document.getElementById('gradeSubject').value.trim(),
      title: document.getElementById('gradeTitle').value.trim(),
      score: Number(document.getElementById('gradeScore').value),
      feedback: document.getElementById('gradeFeedback').value.trim()
    };
    if (!data.studentId || !data.subject || !data.title || isNaN(data.score) || data.score < 0 || data.score > 100) {
      status.textContent = 'اختر الطالب واكتب المادة والتقييم والدرجة من 0 إلى 100.';
      return;
    }
    button.disabled = true;
    try {
      var result = await callFn('teacherSaveGrade', data);
      status.textContent = 'تم حفظ التقييم: ' + result.rating + ' (' + result.score + '/100).';
      document.getElementById('gradeTitle').value = '';
      document.getElementById('gradeScore').value = '';
      document.getElementById('gradeFeedback').value = '';
      await renderTeacherGradeHistory();
      toast('تم حفظ تقييم الطالب.');
    } catch (error) {
      status.textContent = errorText(error);
    }
    button.disabled = false;
  }

  async function renderTeacherGradeHistory() {
    var box = document.getElementById('teacherGradeHistory');
    if (!box) return;
    var result = await callFn('teacherListMyGrades', {});
    var items = result.items || [];
    if (!items.length) { box.innerHTML = '<p class="teacher-empty">لا توجد تقييمات حتى الآن.</p>'; return; }
    box.innerHTML = items.map(function (item) {
      return '<article class="teacher-item"><b>' + esc(item.studentName) + ' — ' + esc(item.assessmentTitle) + '</b>' +
        '<div>' + esc(item.subject) + ' • ' + esc(item.score) + '/100 • ' + esc(item.rating) + '</div>' +
        (item.feedback ? '<p>' + esc(item.feedback) + '</p>' : '') + '</article>';
    }).join('');
  }

  window.openOwnerTeacherCenter = async function () {
    if (window.currentRole !== 'owner') { toast('إدارة المعلمين للمالك فقط.'); return; }
    ensureScreens();
    pushScreen('ownerTeachersScreen');
    await window.loadOwnerTeacherCenter();
  };

  window.loadOwnerTeacherCenter = async function () {
    var box = document.getElementById('ownerTeachersContent');
    if (!box) return;
    box.innerHTML = '<p>جارٍ تحميل الطلبات...</p>';
    try {
      var results = await Promise.all([
        callFn('ownerListTeacherApplications', {}),
        callFn('ownerListTeacherContent', {}),
        callFn('ownerListTeacherAccounts', {})
      ]);
      var applications = results[0].items || [];
      var content = results[1].items || [];
      var teachers = results[2].items || [];
      var teacherOptions = '<option value="">إنشاء حساب دخول جديد لمعلم</option>';
      teachers.forEach(function (teacher) {
        teacherOptions += '<option value="' + esc(teacher.uid) + '" data-name="' + esc(teacher.name) + '" data-username="' + esc(teacher.username) + '" data-subject="' + esc(teacher.subject) + '">' +
          esc(teacher.name || teacher.username || teacher.uid) + ' — ' + esc(teacher.status || 'غير محدد') + '</option>';
      });
      var html = '<h3>بيانات دخول المعلمين</h3>' +
        '<p class="teacher-empty">لا يوجد تسجيل ذاتي أو رسائل SMS. أنشئ حسابًا جديدًا للمعلم أو اختر حسابًا قائمًا لتعيين/تغيير اسم الدخول وكلمة المرور.</p>' +
        '<form id="ownerTeacherCredentialsForm" class="teacher-card">' +
        '<div class="form-group"><label class="form-label" for="otTarget">الحساب</label><select class="form-input" id="otTarget">' + teacherOptions + '</select></div>' +
        '<div class="form-group"><label class="form-label" for="otName">اسم المعلم</label><input class="form-input" id="otName" maxlength="80" required></div>' +
        '<div class="form-group"><label class="form-label" for="otUsername">اسم الدخول (3–40 حرفًا/رقمًا، بلا مسافات)</label><input class="form-input" id="otUsername" maxlength="40" autocomplete="off" required></div>' +
        '<div class="form-group"><label class="form-label" for="otPassword">كلمة المرور الجديدة (8 أحرف على الأقل)</label><input class="form-input" id="otPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password" required></div>' +
        '<div class="form-group"><label class="form-label" for="otSubject">المادة</label><input class="form-input" id="otSubject" maxlength="80" required></div>' +
        '<p id="otStatus" role="status"></p><button class="btn-primary" id="otSubmit" type="submit">حفظ بيانات الدخول</button></form>' +
        '<h3>طلبات حسابات المعلمين</h3>';
      if (!applications.length) html += '<p class="teacher-empty">لا توجد طلبات معلقة.</p>';
      applications.forEach(function (item) {
        html += '<article class="teacher-item"><b>' + esc(item.name) + '</b><div>' +
          (item.username ? 'اسم الدخول: ' + esc(item.username) : esc(item.email)) + ' • ' + esc(item.subject) + '</div>' +
          '<div>' + esc(item.phone) + '</div><div class="teacher-actions">' +
          '<button type="button" data-app="' + esc(item.uid) + '" data-action="approve">موافقة</button>' +
          '<button type="button" data-app="' + esc(item.uid) + '" data-action="reject">رفض</button></div></article>';
      });
      html += '<h3>محتوى في انتظار المراجعة</h3>';
      if (!content.length) html += '<p class="teacher-empty">لا يوجد محتوى معلق.</p>';
      content.forEach(function (item) {
        html += '<article class="teacher-item"><b>' + esc(typeName(item.type)) + ' — ' + esc(item.title) + '</b>' +
          '<div>' + esc(item.teacherName) + ' • ' + esc(item.subject) + ' • ' + esc(item.grade) + '</div>' +
          '<p>' + esc(item.content) + '</p>' +
          (item.imageUrl ? '<a href="' + esc(item.imageUrl) + '" target="_blank" rel="noopener">معاينة الصورة</a>' : '') +
          (item.videoUrl ? '<a href="' + esc(item.videoUrl) + '" target="_blank" rel="noopener">معاينة الفيديو</a>' : '') +
          '<div class="teacher-actions"><button type="button" data-content="' + esc(item.id) + '" data-action="approve">نشر</button>' +
          '<button type="button" data-content="' + esc(item.id) + '" data-action="reject">رفض</button></div></article>';
      });
      box.innerHTML = html;
      box.onclick = handleOwnerAction;
      var target = document.getElementById('otTarget');
      if (target) target.addEventListener('change', fillOwnerTeacherCredentials);
      var credentialsForm = document.getElementById('ownerTeacherCredentialsForm');
      if (credentialsForm) credentialsForm.addEventListener('submit', submitOwnerTeacherCredentials);
    } catch (error) {
      box.innerHTML = '<p class="teacher-error">' + esc(errorText(error)) + '</p>';
    }
  };

  function fillOwnerTeacherCredentials() {
    var target = document.getElementById('otTarget');
    var option = target && target.options[target.selectedIndex];
    if (!option) return;
    document.getElementById('otName').value = option.getAttribute('data-name') || '';
    document.getElementById('otUsername').value = option.getAttribute('data-username') || '';
    document.getElementById('otSubject').value = option.getAttribute('data-subject') || '';
    document.getElementById('otPassword').value = '';
  }

  async function submitOwnerTeacherCredentials(event) {
    event.preventDefault();
    var target = document.getElementById('otTarget');
    var uid = target ? target.value : '';
    var data = {
      uid: uid,
      name: document.getElementById('otName').value.trim(),
      username: document.getElementById('otUsername').value.trim(),
      password: document.getElementById('otPassword').value,
      subject: document.getElementById('otSubject').value.trim()
    };
    var status = document.getElementById('otStatus');
    var button = document.getElementById('otSubmit');
    if (data.name.length < 2 || data.username.length < 3 || data.password.length < 8 || (!uid && data.subject.length < 2)) {
      status.textContent = 'أكمل بيانات المعلم، واستخدم كلمة مرور من 8 أحرف على الأقل.';
      return;
    }
    button.disabled = true;
    status.textContent = 'جارٍ حفظ بيانات الدخول...';
    try {
      var result = uid
        ? await callFn('ownerSetTeacherCredentials', data)
        : await callFn('ownerCreateTeacherAccount', data);
      status.textContent = uid
        ? 'تم تحديث اسم الدخول وكلمة المرور للمعلم: ' + result.username
        : 'تم إنشاء الحساب. سيظل معلقًا حتى توافق عليه من قائمة الطلبات.';
      toast(uid ? 'تم حفظ بيانات دخول المعلم.' : 'تم إنشاء الحساب بانتظار موافقتك.');
      document.getElementById('otPassword').value = '';
      await window.loadOwnerTeacherCenter();
    } catch (error) {
      status.textContent = errorText(error);
      button.disabled = false;
    }
  }

  async function handleOwnerAction(event) {
    var target = event.target;
    if (!target || !target.getAttribute) return;
    var appId = target.getAttribute('data-app');
    var contentId = target.getAttribute('data-content');
    if (!appId && !contentId) return;
    var action = target.getAttribute('data-action');
    target.disabled = true;
    try {
      if (appId) await callFn('ownerReviewTeacherApplication', { uid: appId, action: action });
      if (contentId) await callFn('ownerReviewTeacherContent', { id: contentId, action: action });
      toast(appId ? (action === 'approve' ? 'تم اعتماد المعلم.' : 'تم رفض الطلب.') : (action === 'approve' ? 'تم نشر المحتوى.' : 'تم رفض المحتوى.'));
      await window.loadOwnerTeacherCenter();
    } catch (error) {
      target.disabled = false;
      toast(errorText(error));
    }
  }

  window.openAdminApprovals = window.openOwnerTeacherCenter;
  window.openAdminContent = window.openOwnerTeacherCenter;
  window.deleteAdminContent = function () { toast('الحذف المباشر متوقف؛ استخدم مراجعة المحتوى الخادمية.'); };

  function showBroadcastDeferred() {
    toast('قسم البث مؤجل مؤقتًا إلى أن نجهز خدمة بث آمنة بموافقة المالك.');
  }
  window.openTeacherBroadcast = showBroadcastDeferred;
  window.openBroadcast = showBroadcastDeferred;
  window.startApprovedLive = showBroadcastDeferred;
  window.submitTeacherRequest = showBroadcastDeferred;
  window.openBroadcastRequests = showBroadcastDeferred;
  window.endTeacherBroadcast = showBroadcastDeferred;

  function updateLoginControls() {
    var input = document.getElementById('usernameInput');
    var code = document.getElementById('ownerCodeGroup');
    var role = window.currentRole || 'student';
    if (input) {
      if (role === 'teacher') {
        input.type = 'text';
        input.placeholder = 'اسم دخول المعلم';
        input.autocomplete = 'username';
      } else if (role === 'owner') {
        input.type = 'email';
        input.placeholder = 'البريد الإلكتروني';
        input.autocomplete = 'email';
      } else {
        input.type = 'text';
        input.placeholder = 'اسم المستخدم';
        input.autocomplete = 'username';
      }
    }
    if (code) code.style.display = 'none';
    var applyButton = document.getElementById('teacherApplyButton');
    if (applyButton) applyButton.remove();
  }

  function installLoginControls() {
    var originalSelectRole = window.selectRole;
    if (typeof originalSelectRole === 'function' && !originalSelectRole._teacherWrapped) {
      var wrapped = function (button, role) {
        originalSelectRole.apply(this, arguments);
        window.currentRole = role;
        updateLoginControls();
      };
      wrapped._teacherWrapped = true;
      window.selectRole = wrapped;
    }
    updateLoginControls();
  }

  function addTool(id, label, handler) {
    var grid = document.querySelector('#homeScreen .tools-grid');
    if (!grid || document.getElementById(id)) return;
    var button = document.createElement('button');
    button.id = id;
    button.type = 'button';
    button.className = 'tool-btn';
    button.innerHTML = '<div class="tool-icon" style="background:#00695C15;color:#00695C;font-size:22px">' + esc(label.charAt(0)) + '</div><div class="tool-label">' + esc(label) + '</div>';
    button.addEventListener('click', handler);
    grid.appendChild(button);
  }

  function refreshTools() {
    ['teacherControlBtn', 'uploadBtn', 'teacherDashBtn', 'adminContentBtn', 'adminApprovalsBtn', 'teacherPortalBtn', 'teacherUploadPortalBtn', 'teacherGradePortalBtn', 'ownerTeacherCenterBtn'].forEach(function (id) {
      var old = document.getElementById(id);
      if (old && id !== 'teacherPortalBtn' && id !== 'teacherUploadPortalBtn' && id !== 'teacherGradePortalBtn' && id !== 'studentGradesBtn' && id !== 'ownerTeacherCenterBtn') old.remove();
    });
    if (window.currentRole === 'teacher') {
      addTool('teacherPortalBtn', 'لوحة المعلم', window.openTeacherDashboard);
      addTool('teacherUploadPortalBtn', 'رفع محتوى', window.openTeacherUpload);
      addTool('teacherGradePortalBtn', 'تقييم الطلاب', window.openTeacherGrades);
    } else if (window.currentRole === 'owner') {
      addTool('ownerTeacherCenterBtn', 'إدارة المعلمين', window.openOwnerTeacherCenter);
      var admin = document.querySelector('#adminScreen .content');
      if (admin && !document.getElementById('ownerTeacherMenu')) {
        var menu = document.createElement('div');
        menu.id = 'ownerTeacherMenu';
        menu.className = 'menu-item';
        menu.innerHTML = '<span style="font-size:24px">👑</span><span style="flex:1;font-weight:700">طلبات المعلمين ومحتواهم</span><span style="font-size:22px">‹</span>';
        menu.addEventListener('click', window.openOwnerTeacherCenter);
        admin.insertBefore(menu, admin.firstChild);
      }
    }
  }

  window.logout = async function () {
    if (!confirm('تسجيل خروج؟')) return;
    try { if (window.firebase && firebase.auth && firebase.auth().currentUser) await firebase.auth().signOut(); } catch (_) {}
    window.currentUser = null;
    window.currentRole = 'student';
    window.screenHistory = [];
    var username = document.getElementById('usernameInput');
    var password = document.getElementById('passwordInput');
    if (username) username.value = '';
    if (password) password.value = '';
    updateLoginControls();
    refreshTools();
    showScreen('loginScreen');
    toast('تم تسجيل الخروج.');
  };

  async function restoreSession(user) {
    if (!user || user.isAnonymous) return;
    try {
      var result = await callFn('portalResolveAccess', {});
      if (result.role === 'teacher' && result.status !== 'active') {
        await auth().signOut();
        return;
      }
      setCurrentUser({ uid: user.uid, name: result.name || user.displayName || user.email }, result.role, user.email || '');
      if (window.currentScreen === 'loginScreen' || window.currentScreen === 'splashScreen') showScreen('homeScreen');
    } catch (_) {}
  }

  function typeInitialStyles() {
    if (document.getElementById('teacherPortalStyles')) return;
    var style = document.createElement('style');
    style.id = 'teacherPortalStyles';
    style.textContent = '.teacher-card{background:#fff;border-radius:14px;padding:16px;margin:10px 0;box-shadow:0 2px 8px rgba(0,0,0,.06)}.teacher-card p{line-height:1.7}.teacher-grid{display:grid;grid-template-columns:1fr;gap:10px}.teacher-stats{padding:14px;margin:12px 0;background:#E8F5E9;border-radius:12px}.teacher-item{background:#fff;border-radius:12px;padding:14px;margin:10px 0;border-right:4px solid #00897B;box-shadow:0 2px 7px rgba(0,0,0,.05);line-height:1.7}.teacher-item a{display:inline-block;margin:6px;color:#1565C0}.teacher-actions{display:flex;gap:8px;margin-top:10px}.teacher-actions button{flex:1;border:0;border-radius:8px;padding:10px;background:#2E7D32;color:#fff;font-weight:bold}.teacher-actions button[data-action="reject"]{background:#C62828}.teacher-empty,.teacher-note{padding:12px;background:#F5F5F5;border-radius:10px;color:#666;line-height:1.6}.teacher-error{padding:12px;background:#FFEBEE;color:#B71C1C;border-radius:10px;line-height:1.6}.teacher-card .form-group{margin:12px 0}.teacher-card textarea{width:100%;box-sizing:border-box}@media(min-width:700px){.teacher-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}';
    document.head.appendChild(style);
  }

  function initialize() {
    ensureScreens();
    installLoginControls();
    typeInitialStyles();
    refreshTools();
    window.setTimeout(refreshTools, 8500);
    if (window.firebase && firebase.auth) {
      firebase.auth().onAuthStateChanged(function (user) { restoreSession(user); });
    }
  }

  window.addEventListener('load', initialize);
})();
