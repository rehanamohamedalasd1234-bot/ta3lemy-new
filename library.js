(function () {
  'use strict';

  var CONFIG = window.HAFEZ_LIBRARY_CONFIG || {};
  var API = String(CONFIG.apiUrl || '').replace(/\/$/, '');
  var CATALOG_CACHE_KEY = 'ta3lemy_library_catalog_v1';
  var LIBRARY_DB_NAME = 'ta3lemy-library-offline-v1';
  var LIBRARY_DB_STORE = 'catalogs';
  var DEFAULT_FOLDERS = ['مراجع دراسية', 'لغة وأدب', 'علوم ورياضيات', 'تاريخ وجغرافيا', 'دين وثقافة', 'تكنولوجيا', 'صحة وحياة', 'تنمية ومهارات', 'أطفال وقصص', 'متنوعات'];
  var publicCatalog = { version: 1, folders: DEFAULT_FOLDERS.slice(), books: [] };
  var adminCatalog = null;
  var adminToken = '';
  var editingBookId = '';
  var editingFileUrl = '';
  var activeFolder = '';
  var searchTerm = '';

  function makeId() {
    try { if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID(); } catch (_) {}
    return 'book-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else window.alert(message);
  }

  function pushAndShow(id) {
    if (typeof window.showScreen !== 'function') return;
    try {
      if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    } catch (_) {}
    window.showScreen(id);
  }

  function goBack() {
    if (typeof window.goBack === 'function') window.goBack();
    else if (typeof window.showScreen === 'function') window.showScreen('homeScreen');
  }

  function makeScreen(id, title) {
    if (document.getElementById(id)) return document.getElementById(id);
    var screen = document.createElement('div');
    screen.className = 'screen library-screen';
    screen.id = id;
    screen.innerHTML = '<div class="top-bar"><button class="icon-btn" type="button" data-library-back aria-label="رجوع">→</button><div class="logo"><span>' + title + '</span></div><div class="library-header-actions" data-library-header-actions></div></div><div class="content library-content" data-library-content></div>';
    document.body.appendChild(screen);
    screen.querySelector('[data-library-back]').addEventListener('click', goBack);
    return screen;
  }

  function ensureOwnerSignOutButton(adminScreen) {
    var headerActions = adminScreen && adminScreen.querySelector('[data-library-header-actions]');
    if (!headerActions || document.getElementById('libraryOwnerSignOut')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'libraryOwnerSignOut';
    button.className = 'library-chip';
    button.textContent = 'خروج المالك';
    button.hidden = true;
    button.addEventListener('click', signOutOwner);
    headerActions.appendChild(button);
  }

  function ensureScreens() {
    if (document.getElementById('libraryScreen') && document.getElementById('libraryReaderScreen') && document.getElementById('libraryAdminScreen')) {
      ensureOwnerSignOutButton(document.getElementById('libraryAdminScreen'));
      return { library: document.getElementById('libraryScreen'), reader: document.getElementById('libraryReaderScreen'), admin: document.getElementById('libraryAdminScreen') };
    }
    var library = makeScreen('libraryScreen', '📚 المكتبة');
    library.querySelector('[data-library-content]').innerHTML = '<div id="libraryStatus" class="library-message" role="status"></div><div class="library-toolbar"><input id="librarySearch" class="library-search" type="search" placeholder="ابحث باسم الكتاب أو المؤلف" aria-label="ابحث في المكتبة"></div><div id="libraryFilters" class="library-filters" aria-label="مجلدات المكتبة"></div><div id="libraryBooks" class="library-books"></div>';

    var reader = makeScreen('libraryReaderScreen', '📖 قراءة الكتاب');
    reader.querySelector('[data-library-content]').innerHTML = '<div id="libraryReaderInfo" class="library-reader-info"></div><div id="libraryReaderActions" class="library-reader-actions"></div><div id="libraryReaderBody"></div>';

    var admin = makeScreen('libraryAdminScreen', '🛡️ إدارة المكتبة');
    ensureOwnerSignOutButton(admin);
    admin.querySelector('[data-library-content]').innerHTML = '<div class="library-admin-banner">إدارة الكتب والمجلدات خاصة بالمالك. يُسمح بالنشر فقط للكتب التي تملك المنصة حق نشرها أو تحمل ترخيصًا مناسبًا. أزرار النسخ والطباعة والتحكم في الإتاحة ليست حماية DRM؛ قد تسمح أدوات قارئ PDF بنسخ الملف أو طباعته.</div><div id="libraryAuthPanel" class="library-auth-panel"><h3>التحقق من حساب المالك</h3><p class="library-small-note">تُحمى الإضافة والتعديل بجلسة بريد المالك الموثّقة، إضافةً إلى التحقق من الخادم. هذا مستقل عن قواعد Firestore ولا يفتحها.</p><div id="libraryAuthStatus" class="library-message" role="status">جارٍ التحقق من الجلسة…</div><button id="libraryRequestLink" class="library-primary" type="button">إرسال رابط تحقق للمالك</button></div><div id="libraryAdminPanel" class="library-admin-panel" hidden><h3>إضافة كتاب أو تعديله</h3><form id="libraryBookForm"><div class="library-form-grid"><label class="library-field">عنوان الكتاب<input id="libTitle" name="title" maxlength="160" required></label><label class="library-field">اسم المؤلف<input id="libAuthor" name="author" maxlength="120" required></label><label class="library-field">المجلد أو المجال<input id="libFolder" name="folder" list="libraryFolderChoices" maxlength="80" required><datalist id="libraryFolderChoices"></datalist></label><label class="library-field">نوع المحتوى<select id="libFormat" name="format"><option value="pdf">ملف PDF</option><option value="text">نص كتاب</option></select></label><label class="library-field full" id="libFileField">ملف PDF (بحد أقصى 10 ميجابايت)<input id="libFile" name="file" type="file" accept="application/pdf,.pdf"></label><label class="library-field full" id="libTextField" hidden>نص الكتاب<textarea id="libText" name="textContent" maxlength="350000" placeholder="أدخل نصًا تملك حق نشره"></textarea></label><label class="library-field full">نبذة قصيرة<textarea id="libDescription" name="description" maxlength="1200"></textarea></label><label class="library-field">بيان الترخيص أو حق النشر<input id="libLicense" name="license" maxlength="160" placeholder="تأليف المنصة / ملك عام / رخصة مفتوحة / إذن نشر" required></label><label class="library-field">تفاصيل مصدر الحق أو الترخيص<input id="libRightsNote" name="rightsNote" maxlength="800" placeholder="اختياري: مصدر الإذن أو رابط الترخيص"></label><label class="library-field">حالة الكتاب<select id="libStatus" name="status"><option value="published">منشور للطلاب</option><option value="draft">مسودة للمالك فقط</option></select></label></div><div class="library-checks"><label class="library-check"><input id="libAllowCopy" type="checkbox" checked><span>إظهار خيار النسخ (مع مراعاة أدوات قارئ PDF)</span></label><label class="library-check"><input id="libAllowDownload" type="checkbox" checked><span>السماح بخيار التحميل</span></label><label class="library-check"><input id="libAllowPrint" type="checkbox" checked><span>إظهار خيار الطباعة</span></label><label class="library-check"><input id="libRightsConfirmed" type="checkbox"><span>أؤكد امتلاك حق النشر أو وجود ترخيص يسمح بإتاحة هذا الكتاب</span></label></div><div class="library-admin-actions"><button class="library-primary" type="submit" id="libSaveBook">حفظ الكتاب</button><button class="library-secondary" type="button" id="libCancelEdit" hidden>إلغاء التعديل</button></div></form></div><div id="libraryFoldersPanel" class="library-admin-panel" hidden><h3>مجلدات الكتب</h3><form id="libraryFolderForm" class="library-toolbar"><input id="libNewFolder" class="library-search" maxlength="80" placeholder="اسم المجلد الجديد" required><button class="library-secondary" type="submit">إضافة مجلد</button></form><div id="libraryAdminFolders"></div></div><div id="libraryAdminBooksPanel" class="library-admin-panel" hidden><h3>الكتب الحالية</h3><div id="libraryAdminBooks"></div></div>';

    var format = document.getElementById('libFormat');
    format.addEventListener('change', updateFormatFields);
    document.getElementById('libraryBookForm').addEventListener('submit', saveBookForm);
    document.getElementById('libCancelEdit').addEventListener('click', resetBookForm);
    document.getElementById('libraryFolderForm').addEventListener('submit', addFolderForm);
    document.getElementById('libraryRequestLink').addEventListener('click', requestOwnerLink);

    var search = document.getElementById('librarySearch');
    search.addEventListener('input', function () { searchTerm = search.value.trim().toLocaleLowerCase(); renderPublicCatalog(); });
    return { library: library, reader: reader, admin: admin };
  }

  function addHomeAndAdminButtons() {
    var grids = document.querySelectorAll('#homeScreen .tools-grid');
    if (grids.length) {
      var grid = grids[grids.length - 1];
      if (!document.getElementById('libraryHomeButton')) {
        var tile = document.createElement('button');
        tile.type = 'button';
        tile.id = 'libraryHomeButton';
        tile.className = 'tool-btn';
        tile.setAttribute('aria-label', 'فتح المكتبة');
        tile.innerHTML = '<span class="tool-icon" style="background:#E8F5E9;color:#2E7D32;">📚</span><span class="tool-label">المكتبة</span>';
        tile.addEventListener('click', openLibrary);
        grid.insertBefore(tile, grid.firstChild);
      }
    }
    var adminContent = document.querySelector('#adminScreen .content');
    if (adminContent && !document.getElementById('ownerLibraryManageButton')) {
      var entry = document.createElement('div');
      entry.id = 'ownerLibraryManageButton';
      entry.className = 'menu-item';
      entry.setAttribute('role', 'button');
      entry.setAttribute('tabindex', '0');
      entry.innerHTML = '<span style="font-size:26px;">📚</span><span style="flex:1;font-weight:700;">إدارة المكتبة والكتب</span><span style="color:#999;font-size:24px;">‹</span>';
      entry.addEventListener('click', openLibraryAdmin);
      entry.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLibraryAdmin(); } });
      var sectionTitle = Array.from(adminContent.children).find(function (node) { return node.classList && node.classList.contains('section-title') && node.textContent.indexOf('التحكم') >= 0; });
      if (sectionTitle && sectionTitle.nextSibling) adminContent.insertBefore(entry, sectionTitle.nextSibling);
      else adminContent.appendChild(entry);
    }
  }

  function setStatus(id, message, isError) {
    var node = document.getElementById(id);
    if (!node) return;
    node.textContent = message || '';
    node.className = 'library-message' + (isError ? ' error' : '');
    node.hidden = !message;
  }

  function withTimeout(promise, milliseconds) {
    return Promise.race([promise, new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error('انتهت مهلة التخزين المحلي')); }, milliseconds);
    })]);
  }

  function openLibraryDb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error('IndexedDB unavailable')); return; }
      var request = window.indexedDB.open(LIBRARY_DB_NAME, 1);
      request.onupgradeneeded = function () {
        var database = request.result;
        if (!database.objectStoreNames.contains(LIBRARY_DB_STORE)) database.createObjectStore(LIBRARY_DB_STORE, { keyPath: 'id' });
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('IndexedDB open failed')); };
      request.onblocked = function () { reject(new Error('IndexedDB upgrade blocked')); };
    });
  }

  async function readCachedCatalog() {
    try {
      var database = await withTimeout(openLibraryDb(), 1500);
      var saved = await withTimeout(new Promise(function (resolve, reject) {
        var transaction = database.transaction(LIBRARY_DB_STORE, 'readonly');
        var request = transaction.objectStore(LIBRARY_DB_STORE).get('public');
        request.onsuccess = function () { resolve(request.result && request.result.catalog || null); };
        request.onerror = function () { reject(request.error || new Error('IndexedDB read failed')); };
      }), 1500);
      database.close();
      if (saved && Array.isArray(saved.books)) return saved;
    } catch (_) {}
    try {
      var localSaved = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY) || 'null');
      if (localSaved && Array.isArray(localSaved.books)) return localSaved;
    } catch (_) {}
    return null;
  }

  async function cacheCatalog(catalog) {
    try {
      var database = await withTimeout(openLibraryDb(), 1500);
      await withTimeout(new Promise(function (resolve, reject) {
        var transaction = database.transaction(LIBRARY_DB_STORE, 'readwrite');
        transaction.objectStore(LIBRARY_DB_STORE).put({ id: 'public', catalog: catalog });
        transaction.oncomplete = resolve;
        transaction.onerror = function () { reject(transaction.error || new Error('IndexedDB write failed')); };
        transaction.onabort = function () { reject(transaction.error || new Error('IndexedDB write aborted')); };
      }), 1500);
      database.close();
      return;
    } catch (_) {}
    try {
      var serialized = JSON.stringify(catalog);
      if (serialized.length < 3500000) localStorage.setItem(CATALOG_CACHE_KEY, serialized);
    } catch (_) {}
  }

  async function apiRequest(path, options) {
    if (!API) throw new Error('لم يتم إعداد خدمة المكتبة بعد');
    var response = await fetch(API + path, options || { method: 'GET', cache: 'no-store' });
    var payload = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(payload.error || 'تعذر الاتصال بخدمة المكتبة');
    return payload;
  }

  async function loadPublicCatalog() {
    if (!navigator.onLine) {
      var offlineCatalog = await readCachedCatalog();
      if (offlineCatalog) return offlineCatalog;
      throw new Error('لا يوجد اتصال، ولم تُحمّل المكتبة على هذا الجهاز من قبل.');
    }
    var catalog = await apiRequest('/catalog', { method: 'GET', cache: 'no-store' });
    publicCatalog = catalog;
    await cacheCatalog(catalog);
    return catalog;
  }

  function makeButton(label, className, onClick) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className || 'library-secondary';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function clearElement(element) {
    while (element && element.firstChild) element.removeChild(element.firstChild);
  }

  function appendElements(parent, elements) {
    elements.forEach(function (element) { parent.appendChild(element); });
  }

  function renderPublicCatalog() {
    var filterBox = document.getElementById('libraryFilters');
    var list = document.getElementById('libraryBooks');
    if (!filterBox || !list) return;
    var folders = Array.from(new Set((publicCatalog.folders || []).concat((publicCatalog.books || []).map(function (book) { return book.folder; })).filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    clearElement(filterBox);
    var allButton = makeButton('كل الكتب', 'library-filter' + (!activeFolder ? ' active' : ''), function () { activeFolder = ''; renderPublicCatalog(); });
    filterBox.appendChild(allButton);
    folders.forEach(function (folder) {
      var button = makeButton(folder, 'library-filter' + (activeFolder === folder ? ' active' : ''), function () { activeFolder = folder; renderPublicCatalog(); });
      filterBox.appendChild(button);
    });

    var books = (publicCatalog.books || []).filter(function (book) {
      var matchesFolder = !activeFolder || book.folder === activeFolder;
      var haystack = [book.title, book.author, book.folder, book.description].join(' ').toLocaleLowerCase();
      return matchesFolder && (!searchTerm || haystack.indexOf(searchTerm) >= 0);
    });
    clearElement(list);
    if (!books.length) {
      var empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = (publicCatalog.books || []).length ? 'لا توجد نتائج مطابقة. جرّب مجلدًا أو كلمة بحث أخرى.' : 'المكتبة جاهزة للمحتوى. سيظهر هنا ما يضيفه المالك من كتب ومراجع مرخّصة.';
      list.appendChild(empty);
      return;
    }
    books.forEach(function (book) {
      var card = document.createElement('article');
      card.className = 'library-card';
      var icon = document.createElement('div'); icon.className = 'library-card-icon'; icon.textContent = book.format === 'text' ? '📄' : '📕';
      var title = document.createElement('h3'); title.textContent = book.title || 'كتاب';
      var author = document.createElement('p'); author.textContent = 'المؤلف: ' + (book.author || 'غير محدد');
      var description = document.createElement('p'); description.textContent = book.description || 'اضغط لفتح الكتاب وقراءته.';
      var meta = document.createElement('div'); meta.className = 'library-card-meta'; meta.textContent = (book.folder || 'متنوعات') + ' • ' + (book.format === 'text' ? 'نص' : 'PDF');
      var open = makeButton('فتح الكتاب', 'library-primary', function () { openReader(book); });
      appendElements(card, [icon, title, author, description, meta, open]);
      list.appendChild(card);
    });
  }

  async function openLibrary() {
    ensureScreens();
    activeFolder = '';
    searchTerm = '';
    document.getElementById('librarySearch').value = '';
    pushAndShow('libraryScreen');
    setStatus('libraryStatus', 'جارٍ تحميل فهرس الكتب…', false);
    document.getElementById('libraryBooks').innerHTML = '<div class="library-loading">جارٍ تجهيز الكتب…</div>';
    try {
      publicCatalog = await loadPublicCatalog();
      setStatus('libraryStatus', navigator.onLine ? 'الكتب المنشورة للطلاب. تُحفظ بيانات الفهرس النصي على هذا الجهاز بعد فتحه.' : 'أنت دون اتصال؛ تعرض المكتبة بيانات سبق تحميلها على هذا الجهاز.', false);
      renderPublicCatalog();
    } catch (error) {
      var cached = await readCachedCatalog();
      if (cached) {
        publicCatalog = cached;
        setStatus('libraryStatus', 'تعذر تحديث المكتبة عبر الإنترنت؛ تُعرض آخر نسخة محفوظة على الجهاز.', true);
        renderPublicCatalog();
      } else {
        setStatus('libraryStatus', error.message || 'تعذر تحميل المكتبة.', true);
        clearElement(document.getElementById('libraryBooks'));
      }
    }
  }

  function openReader(book) {
    var info = document.getElementById('libraryReaderInfo');
    var actions = document.getElementById('libraryReaderActions');
    var body = document.getElementById('libraryReaderBody');
    clearElement(info);
    var title = document.createElement('h2'); title.textContent = book.title || 'قراءة الكتاب';
    var author = document.createElement('div'); author.textContent = 'المؤلف: ' + (book.author || 'غير محدد');
    var rights = document.createElement('div'); rights.className = 'library-small-note'; rights.textContent = 'الحقوق: ' + (book.license || 'غير محدد');
    appendElements(info, [title, author, rights]);
    clearElement(actions);
    clearElement(body);

    if (book.allowCopy) actions.appendChild(makeButton('نسخ النص', 'library-secondary', function () { copyBookText(book); }));
    if (book.allowDownload) actions.appendChild(makeButton(book.format === 'pdf' ? 'تحميل وحفظ للقراءة دون نت' : 'تنزيل النص', 'library-primary', function () { downloadBook(book); }));
    if (book.allowPrint) actions.appendChild(makeButton('طباعة', 'library-secondary', function () { printBook(book); }));

    if (book.format === 'text') {
      var text = document.createElement('article');
      text.className = 'library-reader-text';
      text.textContent = book.textContent || 'لم يتوفر نص لهذا الكتاب.';
      body.appendChild(text);
    } else if (book.fileUrl) {
      var frame = document.createElement('iframe');
      frame.className = 'library-reader-frame';
      frame.title = 'قارئ PDF: ' + (book.title || 'كتاب');
      frame.referrerPolicy = 'no-referrer';
      frame.loading = 'lazy';
      frame.src = book.fileUrl;
      body.appendChild(frame);
      var note = document.createElement('p');
      note.className = 'library-small-note';
      note.textContent = 'إذا لم يظهر الملف داخل الصفحة، استخدم زر التحميل لفتحه في عارض PDF.';
      body.appendChild(note);
    }
    pushAndShow('libraryReaderScreen');
  }

  async function copyBookText(book) {
    if (book.format !== 'text') {
      toast('يمكن نسخ نص PDF من أدوات التحديد داخل عارض الملف إذا كان الملف يسمح بذلك.');
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(book.textContent || '');
      else {
        var area = document.createElement('textarea'); area.value = book.textContent || ''; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
      }
      toast('تم نسخ النص.');
    } catch (_) { toast('تعذر النسخ تلقائيًا؛ حدّد النص واضغط نسخ.'); }
  }

  async function downloadBook(book) {
    if (book.format === 'text') {
      var blob = new Blob([book.textContent || ''], { type: 'text/plain;charset=utf-8' });
      triggerDownload(blob, safeFilename(book.title) + '.txt');
      return;
    }
    try {
      var response = await fetch(book.fileUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('download failed');
      var copyForCache = response.clone();
      triggerDownload(await response.blob(), safeFilename(book.title) + '.pdf');
      try {
        var mediaCache = await caches.open('ta3lemy-media-v1');
        await mediaCache.put(book.fileUrl, copyForCache);
        toast('تم تنزيل الكتاب وحفظه للقراءة دون اتصال على هذا الجهاز.');
      } catch (_) {
        toast('تم تنزيل الكتاب. تعذر حفظ نسخة داخل التطبيق للعمل دون اتصال.');
      }
    } catch (_) {
      window.open(book.fileUrl, '_blank', 'noopener');
      toast('فتحنا ملف الكتاب؛ استخدم خيار التنزيل في عارض PDF.');
    }
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a'); link.href = url; link.download = filename; link.rel = 'noopener';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  }

  function safeFilename(value) { return String(value || 'كتاب').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').slice(0, 90) || 'كتاب'; }

  function printBook(book) {
    if (book.format !== 'text') {
      window.open(book.fileUrl, '_blank', 'noopener');
      toast('استخدم خيار الطباعة من عارض PDF الذي فتحناه.');
      return;
    }
    var popup = window.open('', '_blank');
    if (!popup) { toast('اسمح بفتح نافذة الطباعة ثم أعد المحاولة.'); return; }
    popup.document.open();
    popup.document.write('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>' + escapeHtml(book.title || 'كتاب') + '</title><style>body{font-family:Arial,sans-serif;direction:rtl;white-space:pre-wrap;line-height:2;margin:24px}</style><h1>' + escapeHtml(book.title || 'كتاب') + '</h1><p>' + escapeHtml(book.author || '') + '</p><article>' + escapeHtml(book.textContent || '') + '</article></html>');
    popup.document.close();
    popup.onload = function () { popup.focus(); popup.print(); };
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  async function verifiedOwnerSession() {
    if (!window.HafezOwnerAuth || typeof window.HafezOwnerAuth.getVerifiedSession !== 'function') return null;
    return await window.HafezOwnerAuth.getVerifiedSession();
  }

  function showAdminPanels(visible) {
    ['libraryAdminPanel', 'libraryFoldersPanel', 'libraryAdminBooksPanel'].forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.hidden = !visible;
    });
  }

  async function openLibraryAdmin() {
    if (String(window.currentRole || '').toLowerCase() !== 'owner') {
      toast('إدارة المكتبة متاحة لحساب المالك فقط.');
      return;
    }
    ensureScreens();
    if (window.currentScreen !== 'libraryAdminScreen') pushAndShow('libraryAdminScreen');
    else if (typeof window.showScreen === 'function') window.showScreen('libraryAdminScreen');
    adminToken = '';
    adminCatalog = null;
    showAdminPanels(false);
    document.getElementById('libraryOwnerSignOut').hidden = true;
    var panel = document.getElementById('libraryAuthPanel');
    panel.hidden = false;
    setStatus('libraryAuthStatus', 'جارٍ التحقق من جلسة المالك…', false);
    try {
      var session = await verifiedOwnerSession();
      if (!session) {
        setStatus('libraryAuthStatus', 'لإدارة الكتب يلزم فتح جلسة تحقق بريد المالك. إذا فتحت الرابط من قبل، ارجع إلى المنصة ثم أعد فتح إدارة المكتبة.', true);
        return;
      }
      adminToken = session.access_token;
      var result = await apiRequest('/catalog?all=1', { method: 'GET', cache: 'no-store', headers: { Authorization: 'Bearer ' + adminToken } });
      adminCatalog = result;
      panel.hidden = true;
      showAdminPanels(true);
      renderAdmin();
      document.getElementById('libraryOwnerSignOut').hidden = false;
      setStatus('libraryAuthStatus', '', false);
    } catch (error) {
      document.getElementById('libraryOwnerSignOut').hidden = true;
      setStatus('libraryAuthStatus', error.message || 'تعذر التحقق؛ تأكد من الاتصال ثم أعد المحاولة.', true);
    }
  }

  async function requestOwnerLink() {
    if (!window.HafezOwnerAuth || typeof window.HafezOwnerAuth.requestMagicLink !== 'function') {
      setStatus('libraryAuthStatus', 'خدمة تحقق المالك غير متاحة في هذه النسخة.', true);
      return;
    }
    await window.HafezOwnerAuth.requestMagicLink('libraryAuthStatus');
  }

  async function signOutOwner() {
    var button = document.getElementById('libraryOwnerSignOut');
    if (!window.HafezOwnerAuth || typeof window.HafezOwnerAuth.signOut !== 'function') {
      setStatus('libraryAuthStatus', 'تعذر إنهاء جلسة المالك في هذه النسخة.', true);
      return;
    }
    button.disabled = true;
    try {
      await window.HafezOwnerAuth.signOut();
      adminToken = '';
      adminCatalog = null;
      button.hidden = true;
      showAdminPanels(false);
      document.getElementById('libraryAuthPanel').hidden = false;
      setStatus('libraryAuthStatus', 'تم إنهاء جلسة المالك على هذا الجهاز.', false);
      toast('تم تسجيل خروج المالك.');
    } catch (error) {
      setStatus('libraryAuthStatus', error.message || 'تعذر إنهاء جلسة المالك.', true);
    } finally {
      button.disabled = false;
    }
  }

  function updateFormatFields() {
    var textMode = document.getElementById('libFormat').value === 'text';
    document.getElementById('libFileField').hidden = textMode;
    document.getElementById('libTextField').hidden = !textMode;
  }

  function renderAdmin() {
    if (!adminCatalog) return;
    var datalist = document.getElementById('libraryFolderChoices');
    clearElement(datalist);
    (adminCatalog.folders || []).forEach(function (folder) {
      var option = document.createElement('option'); option.value = folder; datalist.appendChild(option);
    });
    renderAdminFolders();
    renderAdminBooks();
  }

  async function saveAdminCatalog(nextCatalog, successText) {
    if (!adminToken) throw new Error('انتهت جلسة المالك؛ أعد التحقق.');
    var result = await apiRequest('/catalog', {
      method: 'PUT',
      cache: 'no-store',
      headers: { Authorization: 'Bearer ' + adminToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(nextCatalog),
    });
    adminCatalog = result.catalog;
    await cacheCatalog({ version: adminCatalog.version, folders: adminCatalog.folders, books: adminCatalog.books.filter(function (book) { return book.status === 'published'; }) });
    renderAdmin();
    toast(successText || 'تم حفظ التعديل.');
  }

  async function saveBookForm(event) {
    event.preventDefault();
    if (!adminCatalog) return;
    var saveButton = document.getElementById('libSaveBook');
    saveButton.disabled = true;
    var oldLabel = saveButton.textContent;
    saveButton.textContent = 'جارٍ الحفظ…';
    try {
      var title = document.getElementById('libTitle').value.trim();
      var author = document.getElementById('libAuthor').value.trim();
      var folder = document.getElementById('libFolder').value.trim() || 'متنوعات';
      var format = document.getElementById('libFormat').value;
      var license = document.getElementById('libLicense').value.trim();
      var rightsNote = document.getElementById('libRightsNote').value.trim();
      var rightsConfirmed = document.getElementById('libRightsConfirmed').checked;
      var fileUrl = editingFileUrl;
      var textContent = '';
      if (!title || !author || !license) throw new Error('أكمل العنوان واسم المؤلف وبيان الحقوق.');
      if (!rightsConfirmed) throw new Error('أكد أولًا أن لديك حق النشر أو ترخيصًا مناسبًا.');
      if (format === 'pdf') {
        var file = document.getElementById('libFile').files[0];
        if (file) {
          if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name || '')) throw new Error('اختر ملف PDF فقط.');
          if (file.size > 10 * 1024 * 1024) throw new Error('الحد الأقصى لملف PDF هو 10 ميجابايت.');
          if (typeof window.uploadFile !== 'function') throw new Error('خدمة رفع الملفات غير متاحة.');
          fileUrl = await window.uploadFile(file, 'library/books');
          if (!fileUrl) throw new Error('لم يكتمل رفع PDF؛ لم يُحفظ سجل الكتاب.');
        }
        if (!fileUrl) throw new Error('اختر ملف PDF لرفعه.');
      } else {
        textContent = document.getElementById('libText').value;
        if (!textContent.trim()) throw new Error('اكتب نص الكتاب أو اختر PDF.');
        fileUrl = '';
      }
      var previous = (adminCatalog.books || []).find(function (book) { return book.id === editingBookId; });
      var book = {
        id: previous ? previous.id : makeId(),
        title: title,
        author: author,
        folder: folder,
        description: document.getElementById('libDescription').value.trim(),
        license: license,
        rightsNote: rightsNote,
        rightsConfirmed: true,
        format: format,
        fileUrl: fileUrl,
        textContent: textContent,
        allowCopy: document.getElementById('libAllowCopy').checked,
        allowDownload: document.getElementById('libAllowDownload').checked,
        allowPrint: document.getElementById('libAllowPrint').checked,
        status: document.getElementById('libStatus').value,
        createdAt: previous ? previous.createdAt : new Date().toISOString(),
      };
      var folders = Array.from(new Set((adminCatalog.folders || []).concat([folder])));
      var books = (adminCatalog.books || []).filter(function (item) { return item.id !== book.id; }).concat([book]);
      await saveAdminCatalog({ version: 1, folders: folders, books: books }, previous ? 'تم تحديث الكتاب.' : 'تمت إضافة الكتاب.');
      resetBookForm();
    } catch (error) {
      setStatus('libraryAuthStatus', error.message || 'تعذر حفظ الكتاب.', true);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = oldLabel;
    }
  }

  function resetBookForm() {
    var form = document.getElementById('libraryBookForm');
    if (!form) return;
    form.reset();
    editingBookId = '';
    editingFileUrl = '';
    document.getElementById('libStatus').value = 'published';
    document.getElementById('libAllowCopy').checked = true;
    document.getElementById('libAllowDownload').checked = true;
    document.getElementById('libAllowPrint').checked = true;
    document.getElementById('libCancelEdit').hidden = true;
    document.getElementById('libSaveBook').textContent = 'حفظ الكتاب';
    updateFormatFields();
    setStatus('libraryAuthStatus', '', false);
  }

  function editBook(id) {
    var book = (adminCatalog.books || []).find(function (item) { return item.id === id; });
    if (!book) return;
    editingBookId = book.id;
    editingFileUrl = book.fileUrl || '';
    document.getElementById('libTitle').value = book.title || '';
    document.getElementById('libAuthor').value = book.author || '';
    document.getElementById('libFolder').value = book.folder || '';
    document.getElementById('libFormat').value = book.format || 'pdf';
    document.getElementById('libDescription').value = book.description || '';
    document.getElementById('libLicense').value = book.license || '';
    document.getElementById('libRightsNote').value = book.rightsNote || '';
    document.getElementById('libText').value = book.textContent || '';
    document.getElementById('libStatus').value = book.status || 'published';
    document.getElementById('libAllowCopy').checked = book.allowCopy === true;
    document.getElementById('libAllowDownload').checked = book.allowDownload === true;
    document.getElementById('libAllowPrint').checked = book.allowPrint === true;
    document.getElementById('libRightsConfirmed').checked = book.rightsConfirmed === true;
    document.getElementById('libCancelEdit').hidden = false;
    document.getElementById('libSaveBook').textContent = 'حفظ التعديل';
    updateFormatFields();
    document.getElementById('libraryAdminScreen').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderAdminBooks() {
    var list = document.getElementById('libraryAdminBooks');
    clearElement(list);
    var books = adminCatalog.books || [];
    if (!books.length) {
      var empty = document.createElement('div'); empty.className = 'library-empty'; empty.textContent = 'لا توجد كتب بعد. أضف كتابًا أو مرجعًا من النموذج أعلاه.'; list.appendChild(empty); return;
    }
    books.slice().sort(function (a, b) { return String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')); }).forEach(function (book) {
      var row = document.createElement('div'); row.className = 'library-admin-book';
      var title = document.createElement('div'); title.className = 'library-admin-book-title'; title.textContent = book.title || 'كتاب';
      var meta = document.createElement('div'); meta.className = 'library-admin-book-meta'; meta.textContent = (book.author || '') + ' • ' + (book.folder || '') + ' • ' + (book.status === 'draft' ? 'مسودة' : 'منشور');
      var actions = document.createElement('div'); actions.className = 'library-admin-book-actions';
      actions.appendChild(makeButton('تعديل', 'library-secondary', function () { editBook(book.id); }));
      actions.appendChild(makeButton(book.status === 'draft' ? 'نشر' : 'إخفاء', book.status === 'draft' ? 'library-primary' : 'library-secondary', function () { toggleBookStatus(book.id); }));
      actions.appendChild(makeButton('حذف من المكتبة', 'library-danger', function () { deleteBook(book.id); }));
      appendElements(row, [title, meta, actions]); list.appendChild(row);
    });
  }

  function renderAdminFolders() {
    var list = document.getElementById('libraryAdminFolders');
    clearElement(list);
    (adminCatalog.folders || []).forEach(function (folder) {
      var row = document.createElement('div'); row.className = 'library-folder-row';
      var name = document.createElement('span'); name.className = 'library-folder-name'; name.textContent = folder;
      row.appendChild(name);
      var used = (adminCatalog.books || []).some(function (book) { return book.folder === folder; });
      if (DEFAULT_FOLDERS.indexOf(folder) < 0) {
        row.appendChild(makeButton(used ? 'مستخدم' : 'حذف', used ? 'library-secondary' : 'library-danger', function () { if (!used) deleteFolder(folder); }));
      }
      list.appendChild(row);
    });
  }

  async function addFolderForm(event) {
    event.preventDefault();
    var value = document.getElementById('libNewFolder').value.trim();
    if (!value) return;
    if ((adminCatalog.folders || []).some(function (folder) { return folder.toLocaleLowerCase() === value.toLocaleLowerCase(); })) {
      setStatus('libraryAuthStatus', 'هذا المجلد موجود بالفعل.', true);
      return;
    }
    try {
      await saveAdminCatalog({ version: 1, folders: (adminCatalog.folders || []).concat([value]), books: adminCatalog.books || [] }, 'تمت إضافة المجلد.');
      document.getElementById('libraryFolderForm').reset();
    } catch (error) { setStatus('libraryAuthStatus', error.message || 'تعذر حفظ المجلد.', true); }
  }

  async function deleteFolder(folder) {
    if ((adminCatalog.books || []).some(function (book) { return book.folder === folder; })) {
      setStatus('libraryAuthStatus', 'انقل كتب هذا المجلد أولًا قبل حذفه.', true); return;
    }
    try {
      await saveAdminCatalog({ version: 1, folders: (adminCatalog.folders || []).filter(function (item) { return item !== folder; }), books: adminCatalog.books || [] }, 'تم حذف المجلد الفارغ.');
    } catch (error) { setStatus('libraryAuthStatus', error.message || 'تعذر حذف المجلد.', true); }
  }

  async function toggleBookStatus(id) {
    var books = (adminCatalog.books || []).map(function (book) {
      if (book.id !== id) return book;
      return Object.assign({}, book, { status: book.status === 'draft' ? 'published' : 'draft' });
    });
    try { await saveAdminCatalog({ version: 1, folders: adminCatalog.folders || [], books: books }, 'تم تحديث حالة النشر.'); }
    catch (error) { setStatus('libraryAuthStatus', error.message || 'تعذر تحديث حالة الكتاب.', true); }
  }

  async function deleteBook(id) {
    if (!window.confirm('هل تريد حذف هذا الكتاب من فهرس المكتبة؟ الملف الأصلي المرفوع لا يُمسح من خدمة الملفات تلقائيًا.')) return;
    try {
      await saveAdminCatalog({ version: 1, folders: adminCatalog.folders || [], books: (adminCatalog.books || []).filter(function (book) { return book.id !== id; }) }, 'تم حذف سجل الكتاب من المكتبة.');
      if (editingBookId === id) resetBookForm();
    } catch (error) { setStatus('libraryAuthStatus', error.message || 'تعذر حذف الكتاب.', true); }
  }

  function init() {
    ensureScreens();
    addHomeAndAdminButtons();
    if (window.MutationObserver) {
      var observer = new MutationObserver(addHomeAndAdminButtons);
      var home = document.getElementById('homeScreen');
      var admin = document.getElementById('adminScreen');
      if (home) observer.observe(home, { childList: true, subtree: true });
      if (admin) observer.observe(admin, { childList: true, subtree: true });
    }
    window.openLibrary = openLibrary;
    window.openLibraryAdmin = openLibraryAdmin;
    window.addEventListener('ta3lemy-owner-auth-changed', function () {
      if (window.currentScreen === 'libraryAdminScreen' && String(window.currentRole || '').toLowerCase() === 'owner') openLibraryAdmin();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
