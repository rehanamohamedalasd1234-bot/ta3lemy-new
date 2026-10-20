// مراجعة أعمال المعلمين — لا ينشر أي عمل إلا بعد موافقة المالك.
(function () {
  'use strict';
  function db() { return firebase.firestore(); }
  function toast(message) { if (window.showToast) window.showToast(message); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function label(type) {
    return ({ lesson: 'درس / شرح', explanation: 'شرح', exercise: 'تدريب', exam: 'امتحان', review: 'مراجعة', image: 'صورة تعليمية', video: 'فيديو' })[type] || 'عمل تعليمي';
  }
  function ensureScreen() {
    var screen = document.getElementById('ownerApprovalsScreen');
    if (screen) return screen;
    screen = document.createElement('div');
    screen.id = 'ownerApprovalsScreen';
    screen.className = 'screen';
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#B71C1C,#E53935)"><button class="icon-btn" id="ownerApprovalsBack">→</button><div class="logo"><span>👑 موافقات أعمال المعلمين</span></div><button class="icon-btn" id="ownerApprovalsRefresh">🔄</button></div><div class="content" id="ownerApprovalsContent"></div>';
    document.body.appendChild(screen);
    screen.querySelector('#ownerApprovalsBack').onclick = function () { if (window.goBack) window.goBack(); };
    screen.querySelector('#ownerApprovalsRefresh').onclick = window.loadOwnerApprovals;
    return screen;
  }
  window.openOwnerApprovals = function () {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    ensureScreen();
    if (window.showScreen) window.showScreen('ownerApprovalsScreen');
    window.loadOwnerApprovals();
  };
  window.loadOwnerApprovals = async function () {
    if (window.currentRole !== 'owner') return;
    var content = document.getElementById('ownerApprovalsContent');
    if (!content) return;
    content.innerHTML = '<div style="text-align:center;padding:22px;color:#777">⏳ جاري تحميل الأعمال المعلقة...</div>';
    try {
      var snapshot = await db().collection('teacher_uploads').where('status', '==', 'pending').get();
      if (snapshot.empty) { content.innerHTML = '<div class="empty-state"><p>لا توجد أعمال تنتظر المراجعة.</p></div>'; return; }
      var html = '';
      snapshot.forEach(function (doc) {
        var item = doc.data();
        html += '<article style="background:#fff;border-radius:14px;padding:14px;margin:0 0 12px;border-right:5px solid #E53935;box-shadow:0 2px 8px rgba(0,0,0,.06)">';
        html += '<div style="font-weight:bold;color:#B71C1C">' + esc(label(item.type)) + '</div>';
        html += '<h3 style="margin:7px 0">' + esc(item.title || 'بدون عنوان') + '</h3>';
        html += '<div style="font-size:12px;line-height:1.9;color:#555">👨‍🏫 ' + esc(item.teacherName || 'معلم') + '<br>📚 ' + esc(item.stage) + ' • ' + esc(item.grade) + ' • ' + esc(item.subject) + ' • الترم ' + esc(item.term || '—') + '</div>';
        if (item.content) html += '<div style="margin:10px 0;padding:10px;background:#F7F9F7;border-radius:8px;white-space:pre-wrap;line-height:1.8">' + esc(item.content) + '</div>';
        var image = item.image_url || item.imageUrl;
        var video = item.video_url || item.videoUrl;
        if (image) html += '<img src="' + esc(image) + '" alt="معاينة الصورة" style="display:block;width:100%;max-height:280px;object-fit:contain;margin:8px 0;border-radius:10px">';
        if (video) html += '<video controls playsinline src="' + esc(video) + '" style="display:block;width:100%;max-height:280px;margin:8px 0;border-radius:10px"></video>';
        html += '<div style="display:flex;gap:8px;margin-top:12px"><button onclick="approveTeacherUpload(\'' + esc(doc.id) + '\')" style="flex:1;background:#2E7D32;color:#fff;border:0;padding:10px;border-radius:9px;font-weight:bold">✅ موافقة ونشر</button><button onclick="rejectTeacherUpload(\'' + esc(doc.id) + '\')" style="flex:1;background:#C62828;color:#fff;border:0;padding:10px;border-radius:9px;font-weight:bold">❌ رفض</button></div></article>';
      });
      content.innerHTML = html;
    } catch (error) { console.error(error); content.innerHTML = '<div class="empty-state">تعذر تحميل طلبات المعلمين؛ تحقق من Firestore.</div>'; }
  };
  window.approveTeacherUpload = async function (id) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    var store = db();
    var uploadRef = store.collection('teacher_uploads').doc(id);
    try {
      var uploadDoc = await uploadRef.get();
      if (!uploadDoc.exists) throw new Error('العمل غير موجود');
      var item = uploadDoc.data();
      if (item.status === 'approved') return toast('هذا العمل معتمد بالفعل');
      if (item.status !== 'pending') return toast('هذا العمل لم يعد في قائمة المراجعة');
      var lessonRef = store.collection('lessons').doc('teacher_' + id);
      await lessonRef.set({
        title: item.title || 'شرح الأستاذ', content: item.content || '',
        subject: item.subject || '', grade: item.grade || '', stage: item.stage || '',
        term: Number(item.term) || 1, type: 'teacher_explanation',
        teacherContentType: item.type || 'lesson', teacherName: item.teacherName || '',
        teacherId: item.teacherId || '', image_url: item.image_url || item.imageUrl || null,
        video_url: item.video_url || item.videoUrl || null,
        created_at: item.createdAt || new Date().toISOString(),
        approved_at: new Date().toISOString(), sourceUploadId: id
      }, { merge: true });
      await uploadRef.update({ status: 'approved', lessonId: lessonRef.id, approvedAt: new Date().toISOString(), approvedBy: window.currentUser && window.currentUser.uid || '' });
      toast('✅ نُشر العمل في قسم شرح الأستاذ');
      window.loadOwnerApprovals();
    } catch (error) { console.error(error); toast('❌ تعذر النشر؛ تحقق من قواعد Firestore'); }
  };
  window.rejectTeacherUpload = async function (id) {
    if (window.currentRole !== 'owner') return toast('مسموح للمالك فقط');
    if (!window.confirm('رفض هذا العمل وعدم نشره؟')) return;
    try {
      await db().collection('teacher_uploads').doc(id).update({ status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: window.currentUser && window.currentUser.uid || '' });
      toast('تم رفض العمل');
      window.loadOwnerApprovals();
    } catch (error) { console.error(error); toast('تعذر تسجيل الرفض'); }
  };
  function insertOwnerEntry() {
    var admin = document.getElementById('adminScreen');
    var content = admin && admin.querySelector('.content');
    if (!content || document.getElementById('ownerApprovalsBtn')) return;
    var button = document.createElement('div');
    button.id = 'ownerApprovalsBtn'; button.className = 'menu-item';
    button.innerHTML = '<span style="font-size:26px">👑</span><span style="flex:1;font-weight:700;color:#B71C1C">مراجعة أعمال المعلمين</span><span style="color:#999;font-size:24px">‹</span>';
    button.onclick = window.openOwnerApprovals;
    content.insertBefore(button, content.firstChild);
  }
  window.addEventListener('load', function () { setInterval(insertOwnerEntry, 2000); });
})();
