// مراجعة أعمال المعلمين — الاعتماد ينشر العمل داخل المنهج، والمالك يستطيع إزالة المنشور.
(function () {
  'use strict';
  var activeTab = 'pending';

  function db() { return firebase.firestore(); }
  function toast(message) { if (window.showToast) window.showToast(message); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function safeUrl(value) { var url = String(value || ''); return /^https?:\/\//i.test(url) ? esc(url) : ''; }
  function label(type) {
    return ({ lesson: 'درس / شرح', explanation: 'شرح', exercise: 'تدريب', exam: 'امتحان', review: 'مراجعة', image: 'صورة تعليمية', video: 'فيديو' })[type] || 'عمل تعليمي';
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
    return '👨‍🏫 ' + esc(item.teacherName || 'معلم') + '<br>📚 ' + esc(item.stage || '—') + ' • الصف ' + esc(item.grade || '—') + ' • ' + esc(item.subject || '—') + ' • الترم ' + esc(item.term || '—');
  }
  function renderPendingCard(doc) {
    var item = doc.data() || {};
    var image = safeUrl(item.image_url || item.imageUrl);
    var video = safeUrl(item.video_url || item.videoUrl);
    var html = '<article style="background:#fff;border-radius:14px;padding:14px;margin:0 0 12px;border-right:5px solid #E59A18;box-shadow:0 2px 8px rgba(0,0,0,.06)">';
    html += '<div style="font-size:12px;color:#8a6500;font-weight:700">⏳ بانتظار قرار المالك • ' + esc(label(item.type)) + '</div><h3 style="margin:7px 0;color:#252525">' + esc(item.title || 'بدون عنوان') + '</h3>';
    html += '<div style="font-size:12px;line-height:1.9;color:#555">' + details(item) + '</div>';
    if (item.content) html += '<div style="margin:10px 0;padding:10px;background:#F7F9F7;border-radius:8px;white-space:pre-wrap;line-height:1.8">' + esc(item.content) + '</div>';
    if (image) html += '<img src="' + image + '" alt="معاينة الصورة" style="display:block;width:100%;max-height:280px;object-fit:contain;margin:8px 0;border-radius:10px">';
    if (video) html += '<video controls playsinline src="' + video + '" style="display:block;width:100%;max-height:280px;margin:8px 0;border-radius:10px"></video>';
    html += '<div style="display:flex;gap:8px;margin-top:12px"><button onclick="approveTeacherUpload(\'' + esc(doc.id) + '\')" style="flex:1;background:#2E7D32;color:#fff;border:0;padding:11px 7px;border-radius:9px;font-weight:bold">✅ موافقة ونشر في شرح الأستاذ</button><button onclick="rejectTeacherUpload(\'' + esc(doc.id) + '\')" style="background:#C62828;color:#fff;border:0;padding:11px 12px;border-radius:9px;font-weight:bold">❌ رفض</button></div></article>';
    return html;
  }
  function renderApprovedCard(doc) {
    var item = doc.data() || {};
    var lessonId = item.lessonId || ('teacher_' + doc.id);
    var location = 'الرئيسية ← أيقونة شرح الأستاذ ← ' + (item.teacherName || 'المعلم') + ' ← ' + (item.stage || 'المرحلة') + ' ← الصف ' + (item.grade || '—') + ' ← ' + (item.subject || '—') + ' ← الترم ' + (item.term || '—');
    return '<article style="background:#fff;border-radius:14px;padding:14px;margin:0 0 12px;border-right:5px solid #2E7D32;box-shadow:0 2px 8px rgba(0,0,0,.06)"><div style="font-size:12px;color:#2E7D32;font-weight:700">✅ منشور للطلاب • ' + esc(label(item.type)) + '</div><h3 style="margin:7px 0">' + esc(item.title || 'بدون عنوان') + '</h3><div style="font-size:12px;line-height:1.9;color:#555">' + details(item) + '</div><div style="margin-top:8px;padding:9px;border-radius:8px;background:#E8F5E9;font-size:12px;line-height:1.8;color:#245b35">مكان ظهوره: ' + esc(location) + '</div><button onclick="removeTeacherPublication(\'' + esc(doc.id) + '\',\'' + esc(lessonId) + '\')" style="margin-top:11px;width:100%;background:#C62828;color:#fff;border:0;padding:11px;border-radius:9px;font-weight:bold">🗑 إزالة العمل من أيقونة شرح الأستاذ</button></article>';
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
        subject: item.subject || '', grade: item.grade || '', stage: item.stage || '',
        term: Number(item.term) || 1, type: 'teacher_explanation',
        teacherContentType: item.type || 'lesson', teacherName: item.teacherName || '',
        teacherId: item.teacherId || item.authUid || '', image_url: item.image_url || item.imageUrl || null,
        video_url: item.video_url || item.videoUrl || null,
        created_at: item.createdAt || new Date().toISOString(), approved_at: new Date().toISOString(), sourceUploadId: id
      }, { merge: true });
      batch.update(uploadRef, { status: 'approved', lessonId: lessonRef.id, approvedAt: new Date().toISOString(), approvedBy: window.currentUser && window.currentUser.uid || '' });
      await batch.commit();
      toast('✅ نُشر العمل في شرح الأستاذ ضمن المرحلة والصف والمادة المحددة');
      window.loadOwnerApprovals('pending');
    } catch (error) { console.error(error); toast('تعذر النشر؛ تحقق من قواعد Firestore وصلاحيات المالك'); }
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
