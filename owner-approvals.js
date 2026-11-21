// مراجعة أعمال المعلمين — الاعتماد ينشر العمل داخل المنهج، والمالك يستطيع إزالة المنشور.
(function () {
  'use strict';
  var activeTab = 'pending';

  function db() { return firebase.firestore(); }
  function toast(message) { if (window.showToast) window.showToast(message); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function safeUrl(value) { var url = String(value || ''); return /^https?:\/\//i.test(url) ? esc(url) : ''; }
  function imageListCandidate(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try { var parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed; } catch (_) {}
    }
    return [];
  }
  function rawImageUrls(item) {
    item = item || {};
    var candidates = [item.image_urls, item.image_urls_json, item.imageUrls, item.images];
    var best = [];
    candidates.forEach(function (candidate) {
      var list = imageListCandidate(candidate);
      if (list.length > best.length) best = list;
    });
    if (!best.length && (item.image_url || item.imageUrl)) best = [item.image_url || item.imageUrl];
    var seen = {};
    return best.map(function (value) { return String(value || '').trim(); }).filter(function (value) {
      if (!/^https?:\/\//i.test(value) || seen[value]) return false;
      seen[value] = true;
      return true;
    });
  }
  function imageUrls(item) { return rawImageUrls(item).map(safeUrl).filter(Boolean); }
  function label(type) {
    return ({ lesson: 'درس / شرح', explanation: 'شرح', exercise: 'تدريب', exam: 'امتحان', review: 'مراجعة', image: 'صورة تعليمية', video: 'فيديو', audio: 'تسجيل صوتي' })[type] || 'عمل تعليمي';
  }
  function stageLabel(stage) {
    return ({ primary: 'الابتدائية', prep: 'الإعدادية', sec: 'الثانوية', bakkalorya: 'البكالوريا', kindergarten_languages: 'رياض الأطفال لغات', azhar_primary: 'الابتدائية الأزهرية', azhar_prep: 'الإعدادية الأزهرية', azhar_sec: 'الثانوية الأزهرية' })[stage] || stage || '—';
  }
  function ensureScreen() {
    var screen = document.getElementById('ownerApprovalsScreen');
    if (screen) return screen;
    screen = document.createElement('div');
    screen.id = 'ownerApprovalsScreen';
    screen.className = 'screen';
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#B71C1C,#E53935)"><button class="icon-btn" id="ownerApprovalsBack">→</button><div class="logo"><span>👑 موافقات ومحتوى المعلمين</span></div><button class="icon-btn" id="ownerApprovalsRefresh">🔄</button></div><div class="content" id="ownerApprovalsContent"></div>';
    document.body.appendChild(screen);
    screen.querySelector('#ownerApprovalsBack').onclick = function () { if (window.goBack) window.goBack(); };
    screen.querySelector('#ownerApprovalsRefresh').onclick = function () { window.loadOwnerApprovals(); };
    return screen;
  }
  function tabsHtml(tab, count) {
    var pendingStyle = tab === 'pending' ? 'background:#2E7D32;color:#fff' : 'background:#eef3ef;color:#34513b';
    var approvedStyle = tab === 'approved' ? 'background:#2E7D32;color:#fff' : 'background:#eef3ef;color:#34513b';
    return '<div style="display:flex;gap:8px;margin:0 0 14px"><button onclick="loadOwnerApprovals(\'pending\')" style="flex:1;border:0;border-radius:10px;padding:11px 6px;font:inherit;font-weight:700;' + pendingStyle + '">⏳ بانتظار الموافقة</button><button onclick="loadOwnerApprovals(\'approved\')" style="flex:1;border:0;border-radius:10px;padding:11px 6px;font:inherit;font-weight:700;' + approvedStyle + '">📚 المنشور للطلاب</button></div><div style="font-size:12px;color:#68756d;margin:0 0 12px">' + (tab === 'pending' ? 'اعتمد العمل لينتقل إلى شرح الأستاذ، أو ارفضه.' : 'الأعمال هنا منشورة داخل المنهج ويمكنك إزالتها من العرض للطلاب.') + (typeof count === 'number' ? ' • العدد: ' + count : '') + '</div>';
  }
  function details(item) {
    var curriculum = [];
    if (item.curriculumGroup) curriculum.push(item.curriculumGroup);
    if (item.curriculumSubgroup && item.curriculumSubgroup !== item.curriculumGroup) curriculum.push(item.curriculumSubgroup);
    if (item.branch) curriculum.push(item.branch);
    return '👨‍🏫 ' + esc(item.teacherName || 'معلم') + '<br>📚 ' + esc(stageLabel(item.stage)) + ' • الصف ' + esc(item.grade || '—') + ' • ' + esc(item.subjectLabel || item.subject || '—') + (curriculum.length ? ' • ' + esc(curriculum.join(' • ')) : '') + ' • الترم ' + esc(item.term || '—');
  }
  function renderPendingCard(doc) {
    var item = doc.data() || {};
    var images = imageUrls(item);
    var video = safeUrl(item.video_url || item.videoUrl);
    var audio = safeUrl(item.audio_url || item.audioUrl);
    var pdf = safeUrl(item.pdf_url || item.pdfUrl);
    var html = '<article style="background:#fff;border-radius:14px;padding:14px;margin:0 0 12px;border-right:5px solid #E59A18;box-shadow:0 2px 8px rgba(0,0,0,.06)">';
    html += '<div style="font-size:12px;color:#8a6500;font-weight:700">⏳ بانتظار قرار المالك • ' + esc(label(item.type)) + '</div><h3 style="margin:7px 0;color:#252525">' + esc(item.title || 'بدون عنوان') + '</h3>';
    html += '<div style="font-size:12px;line-height:1.9;color:#555">' + details(item) + '</div>';
    if (item.content) html += '<div style="margin:10px 0;padding:10px;background:#F7F9F7;border-radius:8px;white-space:pre-wrap;line-height:1.8">' + esc(item.content) + '</div>';
    if (images.length) html += '<div style="display:grid;gap:8px;margin:8px 0">' + images.map(function (image, index) { return '<img src="' + image + '" alt="صفحة ' + (index + 1) + '" style="display:block;width:100%;max-height:420px;object-fit:contain;border-radius:10px;border:1px solid #e5ece5">'; }).join('') + '</div>';
    if (video) html += '<video controls playsinline src="' + video + '" style="display:block;width:100%;max-height:280px;margin:8px 0;border-radius:10px"></video>';
    if (audio) html += '<audio controls preload="metadata" src="' + audio + '" style="display:block;width:100%;margin:8px 0"></audio>';
    if (pdf) html += '<a href="' + pdf + '" target="_blank" rel="noopener noreferrer" style="display:block;margin:10px 0;padding:12px;border-radius:10px;background:#FFF3E0;color:#8A3B12;text-decoration:none;font-weight:700">📕 فتح ملف PDF: ' + esc(item.pdf_name || item.pdfName || 'ملف تعليمي') + '</a>';
    html += '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button onclick="approveTeacherUpload(\'' + esc(doc.id) + '\')" style="flex:1;background:#2E7D32;color:#fff;border:0;padding:11px 7px;border-radius:9px;font-weight:bold">✅ موافقة ونشر في شرح الأستاذ</button><button onclick="editTeacherUpload(\'' + esc(doc.id) + '\')" style="background:#1976D2;color:#fff;border:0;padding:11px 12px;border-radius:9px;font-weight:bold">✏️ تعديل</button><button onclick="deleteTeacherUpload(\'' + esc(doc.id) + '\')" style="background:#C62828;color:#fff;border:0;padding:11px 12px;border-radius:9px;font-weight:bold">🗑 حذف</button><button onclick="rejectTeacherUpload(\'' + esc(doc.id) + '\')" style="background:#FFF3E0;color:#C62828;border:0;padding:11px 12px;border-radius:9px;font-weight:bold">❌ رفض</button></div></article>';
    return html;
  }
  function renderApprovedCard(doc) {
    var item = doc.data() || {};
    var lessonId = item.lessonId || ('teacher_' + doc.id);
    var images = imageUrls(item);
    var location = 'الرئيسية ← أيقونة شرح الأستاذ ← ' + (item.teacherName || 'المعلم') + ' ← ' + stageLabel(item.stage) + ' ← الصف ' + (item.grade || '—') + ' ← ' + (item.subjectLabel || item.subject || '—') + (item.branch ? ' ← ' + item.branch : '') + ' ← الترم ' + (item.term || '—');
    var pdf = safeUrl(item.pdf_url || item.pdfUrl);
    var html = '<article style="background:#fff;border-radius:14px;padding:14px;margin:0 0 12px;border-right:5px solid #2E7D32;box-shadow:0 2px 8px rgba(0,0,0,.06)"><div style="font-size:12px;color:#2E7D32;font-weight:700">✅ منشور للطلاب • ' + esc(label(item.type)) + '</div><h3 style="margin:7px 0">' + esc(item.title || 'بدون عنوان') + '</h3><div style="font-size:12px;line-height:1.9;color:#555">' + details(item) + '</div><div style="margin-top:8px;padding:9px;border-radius:8px;background:#E8F5E9;font-size:12px;line-height:1.8;color:#245b35">مكان ظهوره: ' + esc(location) + '</div>';
    if (pdf) html += '<a href="' + pdf + '" target="_blank" rel="noopener noreferrer" style="display:block;margin-top:10px;padding:12px;border-radius:10px;background:#FFF3E0;color:#8A3B12;text-decoration:none;font-weight:700">📕 فتح ملف PDF: ' + esc(item.pdf_name || item.pdfName || 'ملف تعليمي') + '</a>';
    if (images.length > 1) html += '<div style="margin-top:10px;padding:9px;border-radius:9px;background:#E8F5E9;color:#245b35;font-size:12px;line-height:1.7">📷 محفوظ في المصدر: ' + images.length + ' صورة — إذا كان المنشور يعرض صورة واحدة اضغط «مزامنة الصور».</div>';
    html += '<div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap"><button onclick="editTeacherUpload(\'' + esc(doc.id) + '\')" style="flex:1;background:#1976D2;color:#fff;border:0;padding:11px;border-radius:9px;font-weight:bold">✏️ تعديل</button><button onclick="syncTeacherPublicationMedia(\'' + esc(doc.id) + '\',\'' + esc(lessonId) + '\')" style="flex:1;background:#1565C0;color:#fff;border:0;padding:11px;border-radius:9px;font-weight:bold">🔄 مزامنة الصور</button><button onclick="removeTeacherPublication(\'' + esc(doc.id) + '\',\'' + esc(lessonId) + '\')" style="flex:1;background:#C62828;color:#fff;border:0;padding:11px;border-radius:9px;font-weight:bold">🗑 إزالة من العرض</button><button onclick="deleteTeacherUpload(\'' + esc(doc.id) + '\')" style="background:#7B1FA2;color:#fff;border:0;padding:11px;border-radius:9px;font-weight:bold">حذف السجل</button></div></article>';
    return html;
  }

  window.openOwnerApprovals = function () {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    activeTab = 'pending';
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    ensureScreen();
    if (window.showScreen) window.showScreen('ownerApprovalsScreen');
    window.loadOwnerApprovals('pending');
  };
  window.loadOwnerApprovals = async function (tab) {
    if (window.currentRole !== 'owner') return;
    if (tab === 'pending' || tab === 'approved') activeTab = tab;
    var content = document.getElementById('ownerApprovalsContent');
    if (!content) return;
    content.innerHTML = tabsHtml(activeTab) + '<div style="text-align:center;padding:22px;color:#777">⏳ جاري تحميل الأعمال...</div>';
    try {
      var snapshot = await db().collection('teacher_uploads').where('status', '==', activeTab).get();
      if (snapshot.empty) {
        content.innerHTML = tabsHtml(activeTab, 0) + '<div class="empty-state"><div class="empty-state-icon">' + (activeTab === 'pending' ? '📭' : '📚') + '</div><p>' + (activeTab === 'pending' ? 'لا توجد أعمال تنتظر المراجعة.' : 'لا توجد أعمال منشورة من خلال هذا المسار بعد.') + '</p></div>';
        return;
      }
      var docs = snapshot.docs.slice().sort(function (a, b) {
        var ad = a.data() || {}; var bd = b.data() || {};
        return String(bd.createdAt || bd.approvedAt || '').localeCompare(String(ad.createdAt || ad.approvedAt || ''));
      });
      var html = tabsHtml(activeTab, docs.length);
      if (activeTab === 'pending') html += '<div style="background:#FFF8E1;border-radius:10px;padding:10px;margin-bottom:12px;font-size:12px;line-height:1.8">عند الضغط على «موافقة ونشر»، تظهر أيقونة المعلم في الرئيسية داخل «شرح الأستاذ»، وتُرتب أعماله حسب المرحلة ← الصف ← المادة ← الترم.</div>';
      html += docs.map(function (doc) { return activeTab === 'pending' ? renderPendingCard(doc) : renderApprovedCard(doc); }).join('');
      content.innerHTML = html;
    } catch (error) {
      console.error('Owner teacher approvals failed', error);
      content.innerHTML = tabsHtml(activeTab) + '<div class="empty-state">تعذر تحميل الأعمال. يلزم أن تسمح قواعد Firestore الآمنة للمالك بقراءة teacher_uploads، وللطلاب بقراءة الدروس المعتمدة.</div>';
    }
  };
  window.approveTeacherUpload = async function (id) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    var store = db();
    var uploadRef = store.collection('teacher_uploads').doc(id);
    try {
      var uploadDoc = await uploadRef.get();
      if (!uploadDoc.exists) throw new Error('العمل غير موجود');
      var item = uploadDoc.data() || {};
      if (item.status === 'approved') return toast('هذا العمل منشور بالفعل');
      if (item.status !== 'pending') return toast('هذا العمل لم يعد ينتظر المراجعة');
      var lessonRef = store.collection('lessons').doc('teacher_' + id);
      var batch = store.batch();
      batch.set(lessonRef, {
        title: item.title || 'شرح الأستاذ', content: item.content || '',
        subject: item.subject || '', subjectLabel: item.subjectLabel || item.subject || '',
        curriculumGroup: item.curriculumGroup || '', curriculumSubgroup: item.curriculumSubgroup || '', branch: item.branch || '',
        curriculumId: item.curriculumId || '', grade: item.grade || '', stage: item.stage || '',
        term: Number(item.term) || 1, type: 'teacher_explanation',
        teacherContentType: item.type || 'lesson', teacherName: item.teacherName || '',
        teacherId: item.teacherId || item.authUid || '', teacherPhotoUrl: item.teacherPhotoUrl || item.teacher_photo_url || null,
        image_url: rawImageUrls(item)[0] || null, image_urls: rawImageUrls(item), image_urls_json: JSON.stringify(rawImageUrls(item)), image_count: rawImageUrls(item).length,
        video_url: item.video_url || item.videoUrl || null, audio_url: item.audio_url || item.audioUrl || null,
        pdf_url: item.pdf_url || item.pdfUrl || null, pdf_name: item.pdf_name || item.pdfName || '',
        pdf_size: Number(item.pdf_size || item.pdfSize) || 0,
        created_at: item.createdAt || new Date().toISOString(), approved_at: new Date().toISOString(), sourceUploadId: id
      }, { merge: true });
      batch.update(uploadRef, { status: 'approved', lessonId: lessonRef.id, approvedAt: new Date().toISOString(), approvedBy: window.currentUser && window.currentUser.uid || '' });
      await batch.commit();
      toast('✅ نُشر العمل في شرح الأستاذ ضمن المرحلة والصف والمادة المحددة');
      window.loadOwnerApprovals('pending');
    } catch (error) { console.error(error); toast('تعذر النشر؛ تحقق من قواعد Firestore وصلاحيات المالك'); }
  };
  window.syncTeacherPublicationMedia = async function (uploadId, lessonId) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    try {
      var store = db();
      var source = await store.collection('teacher_uploads').doc(uploadId).get();
      if (!source.exists) throw new Error('المصدر غير موجود');
      var images = rawImageUrls(source.data() || {});
      if (!images.length) return toast('لا توجد صور محفوظة في العمل الأصلي');
      await store.collection('lessons').doc(lessonId || ('teacher_' + uploadId)).set({ image_url: images[0], image_urls: images, image_urls_json: JSON.stringify(images), image_count: images.length, mediaSyncedAt: new Date().toISOString() }, { merge: true });
      toast('✅ تمت مزامنة ' + images.length + ' صورة مع شرح الأستاذ');
      window.loadOwnerApprovals('approved');
    } catch (error) { console.error('Teacher publication media sync failed', error); toast('تعذر مزامنة الصور'); }
  };
  window.rejectTeacherUpload = async function (id) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    if (!window.confirm('رفض هذا العمل وعدم نشره؟')) return;
    try {
      await db().collection('teacher_uploads').doc(id).update({ status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: window.currentUser && window.currentUser.uid || '' });
      toast('تم رفض العمل');
      window.loadOwnerApprovals('pending');
    } catch (error) { console.error(error); toast('تعذر تسجيل الرفض؛ تحقق من قواعد Firestore'); }
  };
  window.editTeacherUpload = async function (id) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    try {
      var ref = db().collection('teacher_uploads').doc(id), snap = await ref.get();
      if (!snap.exists) return toast('العمل غير موجود');
      var item = snap.data() || {}, title = window.prompt('عنوان العمل:', item.title || '');
      if (title === null) return;
      var content = window.prompt('نص الشرح:', item.content || '');
      if (content === null) return;
      var patch = { title: title.trim(), content: content, updatedAt: new Date().toISOString(), updatedBy: window.currentUser && window.currentUser.uid || '' };
      await ref.update(patch);
      if (item.status === 'approved') await db().collection('lessons').doc(item.lessonId || ('teacher_' + id)).set({ title: patch.title, content: patch.content, updated_at: patch.updatedAt }, { merge: true });
      toast('✅ تم تعديل العمل والنسخة المنشورة.'); window.loadOwnerApprovals(activeTab);
    } catch (error) { console.error(error); toast('تعذر تعديل العمل.'); }
  };
  window.deleteTeacherUpload = async function (id) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    if (!window.confirm('حذف سجل العمل؟ لن تُحذف ملفات Cloudinary القديمة.')) return;
    try {
      var ref = db().collection('teacher_uploads').doc(id), snap = await ref.get(), item = snap.data() || {}, batch = db().batch();
      if (item.lessonId || item.status === 'approved') batch.delete(db().collection('lessons').doc(item.lessonId || ('teacher_' + id)));
      batch.delete(ref); await batch.commit(); toast('تم حذف السجل مع إبقاء ملفات Cloudinary.'); window.loadOwnerApprovals(activeTab);
    } catch (error) { console.error(error); toast('تعذر حذف العمل.'); }
  };
  window.removeTeacherPublication = async function (uploadId, lessonId) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    if (!window.confirm('إزالة هذا العمل من شرح الأستاذ عند الطلاب؟')) return;
    try {
      var store = db();
      var batch = store.batch();
      batch.delete(store.collection('lessons').doc(lessonId));
      batch.update(store.collection('teacher_uploads').doc(uploadId), { status: 'removed', removedAt: new Date().toISOString(), removedBy: window.currentUser && window.currentUser.uid || '' });
      await batch.commit();
      toast('تمت إزالة العمل من عرض الطلاب');
      window.loadOwnerApprovals('approved');
    } catch (error) { console.error(error); toast('تعذر حذف المنشور؛ تحقق من قواعد Firestore'); }
  };
  function insertOwnerEntry() {
    if (window.currentRole !== 'owner') return;
    var admin = document.getElementById('adminScreen');
    var content = admin && admin.querySelector('.content');
    if (content && !document.getElementById('ownerApprovalsBtn')) {
      var button = document.createElement('div');
      button.id = 'ownerApprovalsBtn'; button.className = 'menu-item';
      button.innerHTML = '<span style="font-size:26px">✅</span><span style="flex:1;font-weight:700;color:#B71C1C">موافقات ونشر أعمال المعلمين</span><span style="color:#999;font-size:24px">‹</span>';
      button.onclick = window.openOwnerApprovals;
      content.insertBefore(button, content.firstChild);
    }
    var lessonsList = document.getElementById('allLessonsList');
    if (lessonsList && !document.getElementById('teacherUploadsApprovalShortcut')) {
      var shortcut = document.createElement('button');
      shortcut.type = 'button'; shortcut.id = 'teacherUploadsApprovalShortcut';
      shortcut.textContent = '✅ مراجعة/موافقة أعمال المعلمين المعلقة';
      shortcut.style.cssText = 'width:100%;margin:0 0 14px;padding:12px;border:0;border-radius:10px;background:#E8F5E9;color:#245b35;font:inherit;font-weight:700;cursor:pointer';
      shortcut.onclick = window.openOwnerApprovals;
      lessonsList.parentNode.insertBefore(shortcut, lessonsList);
    }
  }
  window.addEventListener('load', function () { insertOwnerEntry(); setInterval(insertOwnerEntry, 2000); });
})();
