/* دورة طلب واعتماد شهادات التقدير ومعرضها داخل منصة الأستاذ حافظ. */
(function () {
  'use strict';

  var ownerSignature = '';
  var ownerCanvasReady = false;
  var approvedRecords = [];
  var currentCertificate = null;

  function role() { return window.currentRole || ''; }
  function user() { return window.currentUser || null; }
  function db() { try { return window.firebase && firebase.firestore ? firebase.firestore() : null; } catch (_) { return null; } }
  function toast(message) { if (typeof window.showToast === 'function') window.showToast(message); else console.log(message); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function enter(id) {
    if (!user()) { toast('⚠️ سجّل الدخول أولًا.'); return false; }
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen(id);
    return true;
  }
  function addStyles() {
    if (document.getElementById('certificateWorkflowStyles')) return;
    var style = document.createElement('style'); style.id = 'certificateWorkflowStyles';
    style.textContent = '#certificatesScreen,#certificatesGalleryScreen{direction:rtl}.cw-note{padding:12px;border-radius:12px;background:#f3f8f3;color:#36553c;line-height:1.8;font-size:13px;margin:10px 0}.cw-card{background:#fff;border-radius:15px;padding:14px;margin:11px 0;border-right:4px solid #b99a45;box-shadow:0 3px 12px rgba(0,0,0,.07)}.cw-title{font-weight:800;color:#27392d;font-size:16px}.cw-meta{font-size:12px;color:#68776d;line-height:1.8;margin-top:6px}.cw-reason{white-space:pre-wrap;line-height:1.8;margin:10px 0;color:#39483c}.cw-actions{display:flex;gap:8px;margin-top:12px}.cw-actions button{flex:1}.cw-status{display:inline-block;padding:4px 9px;border-radius:999px;background:#fff3cd;color:#795b10;font-size:11px;font-weight:700}.cw-status.approved{background:#e5f4e8;color:#236132}.cw-status.rejected{background:#ffebee;color:#a32121}.cw-sign-canvas{box-sizing:border-box;display:block;width:100%;height:100px;background:#fff;border:1px dashed #9cae9f;border-radius:12px;touch-action:none}.cw-certificate-paper{background:#fffdf5;border:8px double #c49d3c;outline:1px solid #c49d3c;outline-offset:-15px;padding:32px 24px;text-align:center;color:#24402e;min-height:370px;display:flex;flex-direction:column;justify-content:space-between}.cw-cert-title{font-size:30px;font-weight:900;color:#9a7418}.cw-cert-name{font-size:26px;font-weight:900;margin:16px 0;color:#22623a}.cw-cert-reason{font-size:17px;line-height:1.9;margin:12px 0}.cw-cert-signature{max-width:170px;height:52px;object-fit:contain;display:block;margin:4px auto}.cw-cert-small{font-size:12px;color:#657368}.cw-gallery-card{background:#fff;border-radius:16px;padding:14px;margin:12px 0;box-shadow:0 3px 12px rgba(0,0,0,.08);border-top:3px solid #c49d3c}.cw-empty{text-align:center;color:#78847b;padding:24px 12px;background:#f7f9f7;border-radius:12px;line-height:1.8}@media print{body *{visibility:hidden!important}#certificatesScreen,#certificatesScreen *{visibility:visible!important}#certificatePreview{position:fixed!important;inset:0!important;background:white!important;padding:10mm!important}#certificatePreview button{display:none!important}.cw-certificate-paper{min-height:250mm;break-inside:avoid}}';
    document.head.appendChild(style);
  }
  function ensureScreen(id, title, contentId) {
    var screen = document.getElementById(id);
    if (!screen) { screen = document.createElement('div'); screen.id = id; screen.className = 'screen'; document.body.appendChild(screen); }
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#8a6a18,#d7b44a)"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>' + title + '</span></div><div style="width:42px"></div></div><div class="content" id="' + contentId + '"></div>';
    return screen;
  }
  function ensureScreens() {
    ensureScreen('certificatesScreen', '🏅 شهادات التقدير', 'certificateWorkflowContent');
    ensureScreen('certificatesGalleryScreen', '🏅 معرض شهادات التقدير', 'certificatesGalleryContent');
  }
  function addSignatureCanvas() {
    var canvas = document.getElementById('cwOwnerSignature');
    if (!canvas || canvas.dataset.ready === '1') return;
    canvas.dataset.ready = '1'; ownerCanvasReady = true;
    var ctx = canvas.getContext('2d'); var drawing = false;
    function resize() {
      var r = canvas.getBoundingClientRect(); var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width) return;
      var old = ownerSignature;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.strokeStyle = '#193f28'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (old) { var img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0, r.width, r.height); }; img.src = old; }
    }
    resize(); window.addEventListener('resize', resize);
    function point(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    canvas.addEventListener('pointerdown', function (e) { drawing = true; canvas.setPointerCapture(e.pointerId); var p = point(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
    canvas.addEventListener('pointermove', function (e) { if (!drawing) return; var p = point(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (name) { canvas.addEventListener(name, function () { if (!drawing) return; drawing = false; ownerSignature = canvas.toDataURL('image/png'); }); });
  }
  function clearSignature() {
    var canvas = document.getElementById('cwOwnerSignature'); if (!canvas) return;
    var ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); ownerSignature = '';
  }
  function setHeaderMessage(node, text) { if (node) node.textContent = text; }
  function certificateScreenMarkup() {
    var who = user(); var owner = role() === 'owner'; var teacher = role() === 'teacher';
    var html = '<div class="content-header" style="background:linear-gradient(135deg,#a07813,#d7b44a)"><div class="content-header-title">شهادات التقدير</div><div class="content-header-sub">المالك يعتمد كل شهادة ويوقّعها قبل نشرها.</div></div>';
    html += '<div class="cw-note">🔒 الشهادة لا تظهر في المعرض ولا تصل إلى حساب الطالب إلا بعد اعتماد المالك وإضافة توقيعه.</div>';
    if (owner) {
      html += '<section class="cw-card"><div class="cw-title">✍️ توقيع المالك للاعتماد</div><label class="form-label" for="cwOwnerName" style="display:block;margin-top:10px">اسم المالك على الشهادة</label><input id="cwOwnerName" class="form-input" maxlength="80" placeholder="اسم المالك" style="margin-top:6px"><div style="margin:12px 0 6px;font-weight:700">وقّع بخط يدك قبل الموافقة على الطلبات أو إصدار شهادة</div><canvas id="cwOwnerSignature" class="cw-sign-canvas" aria-label="توقيع المالك"></canvas><button class="btn-primary" style="background:#68786d;margin-top:8px" onclick="clearCertificateOwnerSignature()">مسح التوقيع</button></section>';
      html += '<div class="section-title">⏳ طلبات المعلمين بانتظار موافقتك</div><div id="cwOwnerRequests"><div class="cw-empty">جارٍ تحميل الطلبات...</div></div>';
      html += '<details class="cw-card"><summary class="cw-title" style="cursor:pointer">➕ إصدار شهادة مباشرة من المالك</summary><label class="form-label" for="cwDirectRecipient" style="display:block;margin-top:12px">الطالب أو المعلم</label><select id="cwDirectRecipient" class="form-input"><option value="">جارٍ تحميل المستخدمين...</option></select><label class="form-label" for="cwDirectReason" style="display:block;margin-top:10px">سبب التكريم</label><textarea id="cwDirectReason" class="form-input" rows="3" maxlength="350" placeholder="التفوق، النشاط، المبادرة..."></textarea><button class="btn-primary" style="margin-top:10px;background:#a07813" onclick="issueDirectCertificate()">إنشاء شهادة معتمدة وموقعة</button></details>';
    } else if (teacher) {
      html += '<section class="cw-card"><div class="cw-title">📨 ترشيح طالب لشهادة تقدير</div><div class="cw-meta">تُسجَّل الشهادة باسمك كمعلم مُرشِّح. لا تُعتمد ولا تُرسل للطالب قبل مراجعة المالك وتوقيعه.</div><label class="form-label" for="cwStudentSelect" style="display:block;margin-top:12px">اختر الطالب</label><select id="cwStudentSelect" class="form-input"><option value="">جارٍ تحميل قائمة الطلاب...</option></select><label class="form-label" for="cwReason" style="display:block;margin-top:10px">سبب الترشيح</label><textarea id="cwReason" class="form-input" rows="3" maxlength="350" placeholder="مثال: التفوق، النشاط، التعاون أو المبادرة"></textarea><button class="btn-primary" style="margin-top:10px;background:#a07813" onclick="submitCertificateRequest()">إرسال الترشيح للمالك</button><div id="cwTeacherMessage" class="cw-meta" aria-live="polite"></div></section><div class="section-title">📋 ترشيحاتي وحالتها</div><div id="cwTeacherRequests"><div class="cw-empty">جارٍ تحميل الترشيحات...</div></div>';
    } else {
      html += '<div class="cw-note">هذه الشهادات مخصّصة لحسابك، وتظهر هنا بعد أن يعتمدها المالك.</div>';
    }
    html += '<div class="section-title">🎖️ شهادات التقدير المرتبطة بهذا الحساب</div><div id="cwPersonalCertificates"><div class="cw-empty">جارٍ تحميل الشهادات...</div></div><div id="certificatePreview" style="display:none;margin:16px 0"><div id="certificatePaper" class="cw-certificate-paper"></div><button class="btn-primary" onclick="printApprovedCertificate()" style="margin-top:12px">🖨️ طباعة / حفظ PDF</button></div>';
    return html;
  }
  function statusBadge(status) {
    if (status === 'approved') return '<span class="cw-status approved">✅ معتمد وموقّع</span>';
    if (status === 'rejected') return '<span class="cw-status rejected">❌ لم يُعتمد</span>';
    return '<span class="cw-status">⏳ بانتظار موافقة المالك</span>';
  }
  function makeRequestCard(record, id, ownerView) {
    var card = document.createElement('article'); card.className = 'cw-card';
    var title = document.createElement('div'); title.className = 'cw-title'; title.textContent = '🏅 ترشيح ' + (record.studentName || 'طالب'); card.appendChild(title);
    var meta = document.createElement('div'); meta.className = 'cw-meta'; meta.textContent = 'المعلم المُرشِّح: ' + (record.teacherName || 'معلم') + ' • ' + new Date(record.createdAt || Date.now()).toLocaleDateString('ar-EG'); card.appendChild(meta);
    var reason = document.createElement('div'); reason.className = 'cw-reason'; reason.textContent = 'سبب الترشيح: ' + (record.reason || '—'); card.appendChild(reason);
    if (ownerView) {
      var hint = document.createElement('div'); hint.className = 'cw-meta'; hint.textContent = 'وقّع في المربع أعلاه، ثم اختر اعتمادًا وتوقيعًا. سيصل الإصدار المعتمد إلى حساب الطالب ومعرض الشهادات.'; card.appendChild(hint);
      var actions = document.createElement('div'); actions.className = 'cw-actions';
      var approve = document.createElement('button'); approve.className = 'btn-primary'; approve.style.background = '#267443'; approve.textContent = 'اعتماد وتوقيع'; approve.addEventListener('click', function () { approveCertificateRequest(id); }); actions.appendChild(approve);
      var reject = document.createElement('button'); reject.className = 'btn-primary'; reject.style.background = '#b23b35'; reject.textContent = 'رفض الترشيح'; reject.addEventListener('click', function () { rejectCertificateRequest(id); }); actions.appendChild(reject);
      card.appendChild(actions);
    } else {
      var status = document.createElement('div'); status.innerHTML = statusBadge(record.status); card.appendChild(status);
      if (record.status === 'rejected' && record.reviewNote) { var note = document.createElement('div'); note.className = 'cw-meta'; note.textContent = 'ملاحظة المالك: ' + record.reviewNote; card.appendChild(note); }
    }
    return card;
  }
  function makeCertificateCard(record, id, label) {
    var card = document.createElement('article'); card.className = label === 'gallery' ? 'cw-gallery-card' : 'cw-card';
    var title = document.createElement('div'); title.className = 'cw-title'; title.textContent = '🏅 ' + (record.recipientName || 'طالب') + ' — شهادة تقدير'; card.appendChild(title);
    var meta = document.createElement('div'); meta.className = 'cw-meta'; meta.textContent = (record.teacherName ? 'ترشيح المعلم ' + record.teacherName + ' • ' : '') + 'اعتماد المالك ' + (record.ownerName || '') + ' • ' + new Date(record.approvedAt || record.createdAt || Date.now()).toLocaleDateString('ar-EG'); card.appendChild(meta);
    var reason = document.createElement('div'); reason.className = 'cw-reason'; reason.textContent = 'تقديرًا لـ ' + (record.reason || 'التميز'); card.appendChild(reason);
    var button = document.createElement('button'); button.className = 'btn-primary'; button.style.background = '#a07813'; button.textContent = 'عرض الشهادة'; button.addEventListener('click', function () { viewApprovedCertificate(id, label); }); card.appendChild(button);
    return card;
  }
  function putList(containerId, records, render, emptyText) {
    var box = document.getElementById(containerId); if (!box) return;
    box.innerHTML = '';
    if (!records.length) { var empty = document.createElement('div'); empty.className = 'cw-empty'; empty.textContent = emptyText; box.appendChild(empty); return; }
    records.forEach(function (record) { box.appendChild(render(record)); });
  }
  async function loadRecipients(selectId, includeTeachers) {
    var select = document.getElementById(selectId); if (!select) return;
    select.innerHTML = '<option value="">جارٍ تحميل قائمة الطلاب...</option>';
    try {
      var store = db(); if (!store) throw new Error('Firestore unavailable');
      var roles = includeTeachers ? ['student', 'teacher'] : ['student'];
      var snapshots = await Promise.all(roles.map(function (accountRole) { return store.collection('users').where('role', '==', accountRole).limit(300).get(); }));
      var students = []; snapshots.forEach(function (snap, index) { var accountRole = roles[index]; snap.forEach(function (doc) { var item = doc.data() || {}; students.push({ id: doc.id, name: String(item.displayName || item.name || (accountRole === 'teacher' ? 'معلم' : 'طالب')), role: accountRole }); }); });
      students.sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
      select.innerHTML = '<option value="">اختر ' + (includeTeachers ? 'الطالب أو المعلم' : 'الطالب') + '...</option>';
      students.forEach(function (student) { var option = document.createElement('option'); option.value = student.id; option.textContent = student.name + ' — ' + (student.role === 'teacher' ? 'معلم' : 'طالب'); option.dataset.studentName = student.name; option.dataset.recipientRole = student.role; select.appendChild(option); });
      if (!students.length) select.innerHTML = '<option value="">لا يوجد مستخدمون مناسبون حاليًا</option>';
    } catch (error) { console.error('Certificate student list failed', error); select.innerHTML = '<option value="">تعذر تحميل الطلاب — تحقق من اتصال Firebase</option>'; }
  }
  async function loadOwnerQueue() {
    var box = document.getElementById('cwOwnerRequests'); if (!box) return;
    box.innerHTML = '<div class="cw-empty">جارٍ تحميل الطلبات...</div>';
    try {
      var snap = await db().collection('certificate_requests').where('status', '==', 'pending').limit(100).get();
      var rows = []; snap.forEach(function (doc) { rows.push({ id: doc.id, data: doc.data() || {} }); });
      rows.sort(function (a, b) { return String(b.data.createdAt || '').localeCompare(String(a.data.createdAt || '')); });
      box.innerHTML = '';
      if (!rows.length) { box.innerHTML = '<div class="cw-empty">لا توجد ترشيحات بانتظار الموافقة.</div>'; return; }
      rows.forEach(function (row) { box.appendChild(makeRequestCard(row.data, row.id, true)); });
    } catch (error) { console.error('Owner certificate requests failed', error); box.innerHTML = '<div class="cw-empty">تعذر تحميل الترشيحات. تحقق من صلاحيات Firestore للمجموعة certificate_requests.</div>'; }
  }
  async function loadTeacherRequests() {
    var box = document.getElementById('cwTeacherRequests'); if (!box || !user()) return;
    box.innerHTML = '<div class="cw-empty">جارٍ تحميل الترشيحات...</div>';
    try {
      var snap = await db().collection('certificate_requests').where('teacherId', '==', String(user().uid)).limit(100).get();
      var rows = []; snap.forEach(function (doc) { rows.push({ id: doc.id, data: doc.data() || {} }); });
      rows.sort(function (a, b) { return String(b.data.createdAt || '').localeCompare(String(a.data.createdAt || '')); });
      box.innerHTML = '';
      if (!rows.length) { box.innerHTML = '<div class="cw-empty">لم ترسل ترشيحات بعد.</div>'; return; }
      rows.forEach(function (row) { box.appendChild(makeRequestCard(row.data, row.id, false)); });
    } catch (error) { console.error('Teacher certificate requests failed', error); box.innerHTML = '<div class="cw-empty">تعذر تحميل ترشيحاتك. تحقق من اتصال Firebase.</div>'; }
  }
  async function loadPersonalCertificates() {
    var box = document.getElementById('cwPersonalCertificates'); if (!box || !user()) return;
    box.innerHTML = '<div class="cw-empty">جارٍ تحميل الشهادات...</div>';
    try {
      var snap = await db().collection('certificates').where('recipientId', '==', String(user().uid)).limit(100).get();
      var rows = []; snap.forEach(function (doc) { var data = doc.data() || {}; if (!data.status || data.status === 'approved') rows.push({ id: doc.id, data: data }); });
      rows.sort(function (a, b) { return String(b.data.approvedAt || b.data.createdAt || '').localeCompare(String(a.data.approvedAt || a.data.createdAt || '')); });
      approvedRecords = rows.map(function (row) { return Object.assign({ id: row.id }, row.data); });
      box.innerHTML = '';
      if (!rows.length) { box.innerHTML = '<div class="cw-empty">ستظهر هنا شهادة التقدير بعد اعتمادها وتوقيعها من المالك.</div>'; return; }
      rows.forEach(function (row) { box.appendChild(makeCertificateCard(row.data, row.id, 'personal')); });
    } catch (error) { console.error('Personal certificate load failed', error); box.innerHTML = '<div class="cw-empty">تعذر تحميل الشهادات من حسابك. تحقق من صلاحيات Firestore.</div>'; }
  }
  function ownerName() { var input = document.getElementById('cwOwnerName'); return input && input.value.trim() || (user() && user().name) || ''; }
  function setupScreen() {
    addStyles(); ensureScreens();
    var content = document.getElementById('certificateWorkflowContent');
    if (!content) return;
    content.innerHTML = certificateScreenMarkup();
    var ownName = document.getElementById('cwOwnerName'); if (ownName && user()) ownName.value = String(user().name || '');
    var profileMenu = document.getElementById('certificateToolMenu');
    if (profileMenu) { var label = profileMenu.querySelector('span:nth-child(2)'); if (label) label.textContent = 'شهادات التقدير الخاصة بي'; }
    if (role() === 'owner') {
      addSignatureCanvas(); loadRecipients('cwDirectRecipient', true); loadOwnerQueue();
    } else if (role() === 'teacher') {
      loadRecipients('cwStudentSelect', false); loadTeacherRequests();
    }
    loadPersonalCertificates();
  }
  window.openCertificates = function () { if (!enter('certificatesScreen')) return; setupScreen(); };
  window.clearCertificateOwnerSignature = clearSignature;
  window.submitCertificateRequest = async function () {
    if (!user() || role() !== 'teacher') return toast('إرسال الترشيحات متاح لحساب المعلم فقط.');
    var select = document.getElementById('cwStudentSelect'); var option = select && select.options[select.selectedIndex];
    var reasonEl = document.getElementById('cwReason'); var reason = reasonEl ? reasonEl.value.trim() : '';
    if (!select || !select.value || !option) return toast('اختر الطالب المرشّح أولًا.');
    if (reason.length < 4) return toast('اكتب سببًا واضحًا للترشيح.');
    var button = document.querySelector('#certificateWorkflowContent button[onclick="submitCertificateRequest()"]'); if (button) button.disabled = true;
    try {
      var request = { studentId: String(select.value), studentName: String(option.dataset.studentName || option.textContent), studentRole: 'student', teacherId: String(user().uid), teacherName: String(user().name || user().displayName || 'معلم'), reason: reason.slice(0, 350), status: 'pending', createdAt: new Date().toISOString() };
      await db().collection('certificate_requests').add(request);
      reasonEl.value = ''; toast('✅ أُرسل الترشيح إلى المالك للمراجعة. ستظهر الشهادة للطالب بعد اعتمادها وتوقيعها.'); await loadTeacherRequests();
    } catch (error) { console.error('Certificate request submission failed', error); toast('تعذر إرسال الترشيح. تحقق من اتصال Firebase وصلاحيات قاعدة البيانات.'); }
    finally { if (button) button.disabled = false; }
  };
  window.approveCertificateRequest = async function (requestId) {
    if (!user() || role() !== 'owner') return toast('اعتماد الشهادات متاح للمالك فقط.');
    if (!ownerSignature) return toast('وقّع في المربع أعلاه قبل اعتماد الشهادة.');
    var signer = ownerName(); if (!signer) return toast('أدخل اسم المالك الموقّع.');
    if (!window.confirm('اعتماد شهادة هذا الطالب وإضافة توقيعك ونشرها في المعرض وإرسالها إلى حسابه؟')) return;
    try {
      var store = db(); var reqRef = store.collection('certificate_requests').doc(String(requestId));
      var approvedAt = new Date().toISOString(); var certificateId = 'request_' + String(requestId);
      var cert = null;
      await store.runTransaction(async function (tx) {
        var snap = await tx.get(reqRef);
        if (!snap.exists) throw new Error('طلب الشهادة غير موجود');
        var req = snap.data() || {}; if (req.status !== 'pending') throw new Error('هذا الطلب لم يعد بانتظار الموافقة.');
        if (!req.studentId || !req.teacherId) throw new Error('بيانات الطالب أو المعلم ناقصة.');
        cert = { requestId: String(requestId), recipientId: String(req.studentId), recipientName: String(req.studentName || 'طالب'), recipientRole: 'student', teacherId: String(req.teacherId), teacherName: String(req.teacherName || 'معلم'), reason: String(req.reason || ''), ownerId: String(user().uid), ownerName: signer, signatureData: ownerSignature, status: 'approved', createdAt: approvedAt, approvedAt: approvedAt };
        var galleryRecord = { certificateId: certificateId, recipientName: cert.recipientName, recipientRole: cert.recipientRole, teacherName: cert.teacherName, reason: cert.reason, ownerName: signer, signatureData: ownerSignature, status: 'published', createdAt: approvedAt, approvedAt: approvedAt };
        tx.set(store.collection('certificates').doc(certificateId), cert);
        tx.set(store.collection('certificate_gallery').doc(certificateId), galleryRecord);
        tx.update(reqRef, { status: 'approved', approvedAt: approvedAt, approvedBy: String(user().uid), certificateId: certificateId, ownerName: signer });
      });
      toast('✅ اعتُمدت الشهادة ووقّعتها، وأصبحت في حساب الطالب ومعرض الشهادات.');
      loadOwnerQueue();
    } catch (error) { console.error('Certificate approval failed', error); toast(error.message || 'تعذر اعتماد الشهادة. تحقق من صلاحيات Firestore للمجموعات certificate_requests وcertificates وcertificate_gallery.'); }
  };
  window.rejectCertificateRequest = async function (requestId) {
    if (!user() || role() !== 'owner') return toast('رفض الترشيحات متاح للمالك فقط.');
    if (!window.confirm('رفض هذا الترشيح؟ لن تظهر شهادة للطالب.')) return;
    try {
      var reqRef = db().collection('certificate_requests').doc(String(requestId));
      await db().runTransaction(async function (tx) {
        var snap = await tx.get(reqRef);
        if (!snap.exists || (snap.data() || {}).status !== 'pending') throw new Error('الطلب غير موجود أو تمت مراجعته بالفعل.');
        tx.update(reqRef, { status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: String(user().uid) });
      });
      toast('تم تسجيل رفض الترشيح.'); loadOwnerQueue();
    } catch (error) { console.error('Certificate rejection failed', error); toast(error.message || 'تعذر تسجيل الرفض. تحقق من صلاحيات Firestore.'); }
  };
  window.issueDirectCertificate = async function () {
    if (!user() || role() !== 'owner') return toast('إصدار شهادة مباشرة متاح للمالك فقط.');
    if (!ownerSignature) return toast('وقّع في المربع أعلاه قبل إصدار الشهادة.');
    var signer = ownerName(); var select = document.getElementById('cwDirectRecipient'); var option = select && select.options[select.selectedIndex]; var reasonEl = document.getElementById('cwDirectReason'); var reason = reasonEl ? reasonEl.value.trim() : '';
    if (!select || !select.value || !option) return toast('اختر الطالب أو المعلم.'); if (reason.length < 4) return toast('اكتب سبب التكريم.'); if (!signer) return toast('أدخل اسم المالك الموقّع.');
    try {
      var store = db(); var certRef = store.collection('certificates').doc(); var approvedAt = new Date().toISOString();
      var cert = { recipientId: String(select.value), recipientName: String(option.dataset.studentName || option.textContent.split(' — ')[0]), recipientRole: String(option.dataset.recipientRole || 'student'), teacherId: '', teacherName: '', reason: reason.slice(0, 350), ownerId: String(user().uid), ownerName: signer, signatureData: ownerSignature, status: 'approved', createdAt: approvedAt, approvedAt: approvedAt };
      var galleryRecord = { certificateId: certRef.id, recipientName: cert.recipientName, recipientRole: cert.recipientRole, teacherName: '', reason: cert.reason, ownerName: signer, signatureData: ownerSignature, status: 'published', createdAt: approvedAt, approvedAt: approvedAt };
      var batch = store.batch(); batch.set(certRef, cert); batch.set(store.collection('certificate_gallery').doc(certRef.id), galleryRecord); await batch.commit(); reasonEl.value = ''; toast('✅ أُصدرت شهادة معتمدة وموقعة.'); await loadPersonalCertificates();
    } catch (error) { console.error('Direct certificate issuance failed', error); toast('تعذر إصدار الشهادة. تحقق من صلاحيات Firestore.'); }
  };
  function signatureSrc(value) { return /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(String(value || '')) ? String(value) : ''; }
  function formatDate(value) { var d = new Date(value || Date.now()); return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('ar-EG'); }
  function certificateMarkup(record) {
    var signature = signatureSrc(record.signatureData); var teacherLine = record.teacherName ? '<div style="text-align:center"><div class="cw-cert-small">توقيع المعلم المُرشِّح</div><div style="font-weight:800">' + esc(record.teacherName) + '</div></div>' : '<div class="cw-cert-small">منصة الأستاذ حافظ التعليمية</div>';
    return '<div><div style="font-size:44px;color:#c49d3c">✦</div><div class="cw-cert-title">شهادة تقدير</div><div class="cw-cert-small" style="margin-top:8px">منصة الأستاذ حافظ التعليمية</div></div><div><div style="font-size:16px">تُمنح هذه الشهادة إلى</div><div class="cw-cert-name">' + esc(record.recipientName || 'الطالب') + '</div><div class="cw-cert-small">' + (record.recipientRole === 'teacher' ? 'المعلم/ة المتميز/ة' : 'الطالب/ة المتميز/ة') + '</div><div class="cw-cert-reason">تقديرًا لـ ' + esc(record.reason || 'التميز والنشاط') + '</div></div><div style="display:flex;align-items:end;justify-content:space-between;gap:10px;flex-wrap:wrap"><div class="cw-cert-small">' + formatDate(record.approvedAt || record.createdAt) + '</div>' + teacherLine + '<div style="text-align:center"><div class="cw-cert-small">اعتماد وتوقيع المالك</div>' + (signature ? '<img class="cw-cert-signature" src="' + signature + '" alt="توقيع المالك">' : '') + '<div style="font-weight:800;border-top:1px solid #aaa;padding:6px 16px 0">' + esc(record.ownerName || 'المالك') + '</div></div></div>';
  }
  window.viewApprovedCertificate = function (id, source) {
    var record = approvedRecords.find(function (item) { return String(item.id) === String(id); });
    if (!record && source === 'gallery') record = window.__certificateGalleryRecords && window.__certificateGalleryRecords.find(function (item) { return String(item.id) === String(id); });
    if (!record && role() === 'owner') return toast('تعذر العثور على الشهادة. أعد تحميل القائمة.');
    if (!record) return toast('لا يمكن عرض هذه الشهادة من هذا الحساب.');
    if (source === 'gallery') { if (!enter('certificatesScreen')) return; setupScreen(); }
    currentCertificate = record;
    var preview = document.getElementById('certificatePreview'); var paper = document.getElementById('certificatePaper');
    if (!preview || !paper) { setupScreen(); preview = document.getElementById('certificatePreview'); paper = document.getElementById('certificatePaper'); }
    paper.innerHTML = certificateMarkup(record); preview.style.display = 'block'; preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.printApprovedCertificate = function () { if (!currentCertificate) return toast('اختر شهادة أولًا.'); window.print(); };
  window.openCertificateGallery = async function () {
    if (!enter('certificatesGalleryScreen')) return;
    var box = document.getElementById('certificatesGalleryContent'); box.innerHTML = '<div class="cw-empty">جارٍ تحميل الشهادات المعتمدة...</div>';
    try {
      var snap = await db().collection('certificate_gallery').where('status', '==', 'published').limit(100).get();
      var rows = []; snap.forEach(function (doc) { rows.push(Object.assign({ id: doc.id }, doc.data() || {})); });
      rows.sort(function (a, b) { return String(b.approvedAt || b.createdAt || '').localeCompare(String(a.approvedAt || a.createdAt || '')); });
      window.__certificateGalleryRecords = rows; approvedRecords = rows;
      box.innerHTML = '<div class="cw-note">يعرض هذا المعرض الشهادات التي اعتمدها المالك ووقّعها فقط.</div>';
      if (!rows.length) { box.innerHTML += '<div class="cw-empty">لم تُنشر شهادات بعد؛ ستظهر هنا بعد موافقة المالك وتوقيعه.</div>'; return; }
      rows.forEach(function (record) { box.appendChild(makeCertificateCard(record, record.id, 'gallery')); });
    } catch (error) { console.error('Certificate gallery failed', error); box.innerHTML = '<div class="cw-empty">تعذر تحميل المعرض. تحقق من صلاحيات قراءة الأعمال المنشورة في certificate_gallery داخل Firestore.</div>'; }
  };
  function addGalleryShortcut() {
    var grid = document.querySelector('#homeScreen .tools-grid'); if (!grid || document.getElementById('homeCertificateGalleryBtn')) return;
    var item = document.createElement('button'); item.type = 'button'; item.id = 'homeCertificateGalleryBtn'; item.className = 'tool-btn'; item.style.cssText = 'border:0;cursor:pointer;font-family:inherit';
    item.innerHTML = '<div class="tool-icon" style="background:#FFF8E1;color:#9A7418">🏅</div><div class="tool-label">معرض الشهادات</div>';
    item.addEventListener('click', window.openCertificateGallery); grid.appendChild(item);
  }
  function install() {
    addStyles(); ensureScreens(); addGalleryShortcut();
    if (!document.getElementById('homeCertificateGalleryBtn')) setTimeout(addGalleryShortcut, 250);
    var profile = document.getElementById('certificateToolMenu'); if (profile) { var label = profile.querySelector('span:nth-child(2)'); if (label) label.textContent = 'شهادات التقدير الخاصة بي'; }
  }
  window.addEventListener('load', install, { once: true });
  if (document.readyState === 'interactive' || document.readyState === 'complete') setTimeout(install, 0);
})();
