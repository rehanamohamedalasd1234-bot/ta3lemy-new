// إحصاءات المنصة — تظهر للمالك فقط وتعرض الحسابات المسجلة ونشاطها التقريبي.
(function () {
  'use strict';

  function db() { return window.firebase && firebase.firestore ? firebase.firestore() : null; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function number(value) { return Number(value || 0).toLocaleString('ar-EG'); }
  function dateValue(item, keys) {
    for (var i = 0; i < keys.length; i += 1) {
      if (item && item[keys[i]]) {
        var value = item[keys[i]];
        if (value && typeof value.toDate === 'function') value = value.toDate().toISOString();
        var time = Date.parse(value);
        if (!isNaN(time)) return time;
      }
    }
    return 0;
  }
  function card(icon, value, label, color) {
    return '<div style="background:#fff;border-radius:16px;padding:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);border-top:4px solid ' + color + '"><div style="font-size:26px">' + icon + '</div><div style="font-size:25px;font-weight:800;color:' + color + ';margin:4px 0">' + number(value) + '</div><div style="font-size:12px;color:#68756d">' + label + '</div></div>';
  }
  function ensureScreen() {
    var screen = document.getElementById('platformStatsScreen');
    if (screen) return screen;
    screen = document.createElement('div');
    screen.id = 'platformStatsScreen';
    screen.className = 'screen';
    screen.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#1565C0,#1976D2)"><button class="icon-btn" id="platformStatsBack">→</button><div class="logo"><span>📊 إحصاءات المنصة</span></div><button class="icon-btn" id="platformStatsRefresh">🔄</button></div><div class="content" id="platformStatsContent"></div>';
    document.body.appendChild(screen);
    document.getElementById('platformStatsBack').onclick = function () { if (window.goBack) window.goBack(); };
    document.getElementById('platformStatsRefresh').onclick = function () { window.loadPlatformStats(); };
    return screen;
  }
  function insertButton() {
    if (window.currentRole !== 'owner') return;
    var admin = document.getElementById('adminScreen');
    var content = admin && admin.querySelector('.content');
    if (!content || document.getElementById('platformStatsButton')) return;
    var button = document.createElement('div');
    button.id = 'platformStatsButton';
    button.className = 'menu-item';
    button.innerHTML = '<span style="font-size:26px">📈</span><span style="flex:1;font-weight:700;color:#1565C0">إحصاءات تفصيلية وعدد المستخدمين</span><span style="color:#999;font-size:24px">‹</span>';
    button.onclick = window.openPlatformStats;
    var heading = content.querySelector('.section-title');
    if (heading && heading.nextElementSibling) content.insertBefore(button, heading.nextElementSibling);
    else content.appendChild(button);
  }
  window.openPlatformStats = async function () {
    if (window.currentRole !== 'owner') { if (window.showToast) window.showToast('مسموح للمالك فقط'); return; }
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    ensureScreen();
    if (window.showScreen) window.showScreen('platformStatsScreen');
    window.loadPlatformStats();
  };
  window.loadPlatformStats = async function () {
    if (window.currentRole !== 'owner') return;
    var content = document.getElementById('platformStatsContent');
    if (!content) return;
    content.innerHTML = '<div style="text-align:center;padding:32px;color:#68756d">⏳ جاري حساب الإحصاءات...</div>';
    var store = db();
    if (!store) { content.innerHTML = '<div class="empty-state">تعذر الاتصال بقاعدة البيانات.</div>'; return; }
    try {
      var result = await Promise.all([
        store.collection('users').get(),
        store.collection('lessons').get(),
        store.collection('teacher_uploads').get().catch(function () { return { docs: [], size: 0 }; }),
        store.collection('broadcasts').get().catch(function () { return { docs: [], size: 0 }; })
      ]);
      var users = result[0].docs.map(function (doc) { return doc.data() || {}; });
      var now = Date.now();
      var day = 24 * 60 * 60 * 1000;
      var students = 0, teachers = 0, parents = 0, owners = 0, other = 0, active7 = 0, newToday = 0;
      users.forEach(function (user) {
        var role = String(user.role || 'student').toLowerCase();
        if (role === 'teacher') teachers += 1;
        else if (role === 'parent') parents += 1;
        else if (role === 'owner') owners += 1;
        else if (role === 'student') students += 1;
        else other += 1;
        var lastLogin = dateValue(user, ['lastLogin', 'last_login', 'updatedAt']);
        var created = dateValue(user, ['createdAt', 'created_at']);
        if (lastLogin && now - lastLogin <= 7 * day) active7 += 1;
        if (created && new Date(created).toDateString() === new Date(now).toDateString()) newToday += 1;
      });
      var uploadDocs = result[2].docs || [];
      var pending = 0, approved = 0;
      uploadDocs.forEach(function (doc) { var status = (doc.data() || {}).status; if (status === 'pending') pending += 1; if (status === 'approved') approved += 1; });
      var live = 0;
      (result[3].docs || []).forEach(function (doc) { if ((doc.data() || {}).status === 'live') live += 1; });
      var updated = new Date().toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
      content.innerHTML = '<div style="background:linear-gradient(135deg,#1565C0,#1976D2);color:#fff;border-radius:18px;padding:18px;margin-bottom:14px;line-height:1.8"><div style="font-size:20px;font-weight:800">لوحة متابعة نمو المنصة</div><div style="font-size:12px;opacity:.9">حسابات مسجلة وليست عدد الزوار المجهولين • آخر تحديث: ' + esc(updated) + '</div></div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:16px">' +
        card('👥', users.length, 'إجمالي الحسابات المسجلة', '#1565C0') + card('🟢', active7, 'نشط خلال آخر 7 أيام', '#2E7D32') +
        card('🆕', newToday, 'حسابات جديدة اليوم', '#EF6C00') + card('📚', result[1].size || 0, 'الدروس المنشورة', '#6A1B9A') + '</div>' +
        '<section style="background:#fff;border-radius:16px;padding:15px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)"><h3 style="margin:0 0 12px;color:#263238">توزيع المستخدمين</h3><div style="display:grid;gap:9px;font-size:14px;line-height:1.7">' +
        '<div>🎓 الطلاب <b style="float:left;color:#1565C0">' + number(students) + '</b></div><div>👨‍🏫 المعلمون <b style="float:left;color:#2E7D32">' + number(teachers) + '</b></div><div>👪 أولياء الأمور <b style="float:left;color:#EF6C00">' + number(parents) + '</b></div><div>👑 المالك <b style="float:left;color:#8E24AA">' + number(owners) + '</b></div>' + (other ? '<div>👤 أدوار أخرى <b style="float:left;color:#607D8B">' + number(other) + '</b></div>' : '') + '</div></section>' +
        '<section style="background:#fff;border-radius:16px;padding:15px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)"><h3 style="margin:0 0 12px;color:#263238">مؤشرات المحتوى والتفاعل</h3><div style="display:grid;gap:9px;font-size:14px;line-height:1.7"><div>📤 أعمال المعلمين المرفوعة <b style="float:left">' + number(uploadDocs.length) + '</b></div><div>⏳ قيد المراجعة <b style="float:left;color:#EF6C00">' + number(pending) + '</b></div><div>✅ أعمال معتمدة <b style="float:left;color:#2E7D32">' + number(approved) + '</b></div><div>🔴 غرف بث مباشرة الآن <b style="float:left;color:#C62828">' + number(live) + '</b></div></div></section>' +
        '<div style="background:#E3F2FD;color:#1A4E70;border-radius:12px;padding:12px;font-size:12px;line-height:1.8">💡 فكرة التطوير التالية: إضافة رسم بياني أسبوعي لعدد التسجيلات والدخول وحل الاختبارات، مع حفظ أحداث مختصرة في مجموعة analytics_events دون تخزين بيانات شخصية.</div>';
    } catch (error) {
      console.error('Platform stats failed', error);
      content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>تعذر تحميل الإحصاءات.</p><p style="font-size:12px">تحقق من اتصال Firestore وصلاحيات المالك ثم اضغط تحديث.</p></div>';
    }
  };
  window.addEventListener('load', function () { insertButton(); setInterval(insertButton, 2000); });
})();
