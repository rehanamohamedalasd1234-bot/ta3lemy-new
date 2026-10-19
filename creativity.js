/* واجهة قسم «إبداع» — تبقى أدوات الرسم والمسودات المحلية متاحة دون اتصال. */
(function () {
  'use strict';

  var COLORS = ['#111827', '#E53935', '#FB8C00', '#FDD835', '#43A047', '#00897B', '#1E88E5', '#3949AB', '#8E24AA', '#D81B60', '#6D4C41', '#90A4AE'];
  var state = {
    canvas: null,
    context: null,
    drawing: false,
    color: '#111827',
    size: 5,
    eraser: false,
    initialized: false,
    history: [],
    historyIndex: -1,
    enhancedDataUrl: null,
    enhancedMimeType: 'image/png',
    selectedVersion: 'original',
    restoreRequested: false,
    canvasEdited: false,
    restoringDraft: false
  };

  function notify(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.info('[إبداع]', message);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, className, onClick, title) {
    var node = el('button', 'creativity-action ' + (className || ''), text);
    node.type = 'button';
    if (title) node.title = title;
    node.addEventListener('click', onClick);
    return node;
  }

  function screenPush() {
    try { if (typeof screenHistory !== 'undefined') screenHistory.push(currentScreen); } catch (_) {}
  }

  function show(screenId) {
    if (typeof window.showScreen === 'function') window.showScreen(screenId);
  }

  function serviceReady() {
    var config = window.CREATIVITY_CONFIG || {};
    return !!(config.appCheckSiteKey && window.CREATIVITY_APP_CHECK_READY && window.firebase && firebase.functions);
  }

  function friendlyError(error) {
    var code = error && error.code ? String(error.code) : '';
    if (!navigator.onLine) return 'هذه العملية تحتاج إلى اتصال بالإنترنت.';
    if (code.indexOf('unauthenticated') >= 0 || code.indexOf('operation-not-allowed') >= 0) return 'تعذر تسجيل الدخول الآمن. يحتاج المالك إلى تفعيل تسجيل الدخول المجهول في Firebase.';
    if (code.indexOf('permission-denied') >= 0) return 'ليس لديك صلاحية لهذه العملية.';
    if (code.indexOf('resource-exhausted') >= 0) return error.message || 'وصلت إلى الحد اليومي.';
    if (code.indexOf('not-found') >= 0 || code.indexOf('unavailable') >= 0 || code.indexOf('functions/not-found') >= 0) return 'خدمة إبداع لم تُجهّز أو تُنشر بعد. أبلغ مالك المنصة.';
    if (code.indexOf('app-check') >= 0 || code.indexOf('failed-precondition') >= 0) return 'حماية App Check لم تكتمل بعد. أبلغ مالك المنصة لإعداد Firebase.';
    return (error && error.message) || 'حدث خطأ غير متوقع. حاول مرة أخرى.';
  }

  async function ensureAnonymousAuth() {
    if (!window.firebase || !firebase.auth) throw new Error('خدمة تسجيل الدخول غير متاحة.');
    if (firebase.auth().currentUser) return firebase.auth().currentUser;
    var result = await firebase.auth().signInAnonymously();
    return result.user;
  }

  async function callFunction(name, data, needsStudentAuth) {
    if (!serviceReady()) throw new Error('خدمات إبداع لم تُفعّل بعد. يلزم ضبط مفتاح App Check ونشر Firebase Functions من حساب المالك.');
    if (!navigator.onLine) throw new Error('هذه العملية تحتاج إلى اتصال بالإنترنت.');
    if (needsStudentAuth) await ensureAnonymousAuth();
    var config = window.CREATIVITY_CONFIG || {};
    var functions = firebase.functions(config.functionsRegion || 'us-central1');
    var callable = functions.httpsCallable(name);
    var result = await callable(data || {});
    return result.data || {};
  }

  function idbOpen() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error('IndexedDB غير متاح'));
      var request = indexedDB.open('ta3lemy-creativity', 1);
      request.onupgradeneeded = function () {
        if (!request.result.objectStoreNames.contains('drafts')) request.result.createObjectStore('drafts');
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('تعذر فتح التخزين المحلي')); };
    });
  }

  function idbPut(key, value) {
    return idbOpen().then(function (database) {
      return new Promise(function (resolve, reject) {
        var transaction = database.transaction('drafts', 'readwrite');
        transaction.objectStore('drafts').put(value, key);
        transaction.oncomplete = function () { database.close(); resolve(); };
        transaction.onerror = function () { database.close(); reject(transaction.error || new Error('تعذر حفظ المسودة')); };
      });
    });
  }

  function idbGet(key) {
    return idbOpen().then(function (database) {
      return new Promise(function (resolve, reject) {
        var transaction = database.transaction('drafts', 'readonly');
        var request = transaction.objectStore('drafts').get(key);
        request.onsuccess = function () { resolve(request.result || null); };
        request.onerror = function () { reject(request.error || new Error('تعذر قراءة المسودة')); };
        transaction.oncomplete = function () { database.close(); };
      });
    });
  }

  function canvasBlob(type, quality) {
    return new Promise(function (resolve, reject) {
      if (!state.canvas) return reject(new Error('لوحة الرسم غير جاهزة'));
      if (state.canvas.toBlob) {
        state.canvas.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error('تعذر تجهيز الصورة'));
        }, type || 'image/png', quality);
      } else {
        try { resolve(dataUrlToBlob(state.canvas.toDataURL(type || 'image/png', quality))); }
        catch (error) { reject(error); }
      }
    });
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(',');
    var mime = (parts[0].match(/data:([^;]+)/) || [])[1] || 'image/png';
    var binary = atob(parts[1] || '');
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result).split(',')[1] || ''); };
      reader.onerror = function () { reject(reader.error || new Error('تعذر قراءة الصورة')); };
      reader.readAsDataURL(blob);
    });
  }

  function setStatus(text) {
    var node = document.getElementById('creativityStatus');
    if (node) node.textContent = text || '';
  }

  function saveHistory() {
    if (!state.canvas) return;
    var snapshot;
    try { snapshot = state.canvas.toDataURL('image/png'); } catch (_) { return; }
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(snapshot);
    if (state.history.length > 12) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateUndoButtons();
  }

  function updateUndoButtons() {
    var undo = document.getElementById('creativityUndo');
    var redo = document.getElementById('creativityRedo');
    if (undo) undo.disabled = state.historyIndex <= 0;
    if (redo) redo.disabled = state.historyIndex < 0 || state.historyIndex >= state.history.length - 1;
  }

  function restoreSnapshot(dataUrl) {
    if (!state.canvas || !state.context) return;
    var image = new Image();
    image.onload = function () {
      var rect = state.canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      state.context.setTransform(ratio, 0, 0, ratio, 0, 0);
      state.context.fillStyle = '#FFFFFF';
      state.context.fillRect(0, 0, rect.width, rect.height);
      state.context.drawImage(image, 0, 0, rect.width, rect.height);
    };
    image.src = dataUrl;
  }

  function undo() {
    if (state.restoringDraft || state.historyIndex <= 0) return;
    state.historyIndex -= 1;
    restoreSnapshot(state.history[state.historyIndex]);
    state.canvasEdited = true;
    updateUndoButtons();
    clearEnhancedVersion();
  }

  function redo() {
    if (state.restoringDraft || state.historyIndex >= state.history.length - 1) return;
    state.historyIndex += 1;
    restoreSnapshot(state.history[state.historyIndex]);
    state.canvasEdited = true;
    updateUndoButtons();
    clearEnhancedVersion();
  }

  function clearEnhancedVersion() {
    state.enhancedDataUrl = null;
    state.selectedVersion = 'original';
  }

  function position(event) {
    var rect = state.canvas.getBoundingClientRect();
    var source = event.touches && event.touches.length ? event.touches[0] : event;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  }

  function startStroke(event) {
    if (state.restoringDraft || !state.canvas || !state.context) return;
    if (event.cancelable) event.preventDefault();
    state.drawing = true;
    state.canvasEdited = true;
    var p = position(event);
    state.context.beginPath();
    state.context.moveTo(p.x, p.y);
    state.context.strokeStyle = state.eraser ? '#FFFFFF' : state.color;
    state.context.lineWidth = state.eraser ? state.size * 4 : state.size;
    state.context.lineCap = 'round';
    state.context.lineJoin = 'round';
    if (event.pointerId !== undefined && state.canvas.setPointerCapture) {
      try { state.canvas.setPointerCapture(event.pointerId); } catch (_) {}
    }
  }

  function drawStroke(event) {
    if (!state.drawing || !state.context) return;
    if (event.cancelable) event.preventDefault();
    var p = position(event);
    state.context.lineTo(p.x, p.y);
    state.context.stroke();
  }

  function stopStroke(event) {
    if (!state.drawing) return;
    if (event && event.cancelable) event.preventDefault();
    state.drawing = false;
    state.context.closePath();
    saveHistory();
    clearEnhancedVersion();
    setStatus('تم تحديث الرسم. احفظ المسودة قبل مغادرة الشاشة.');
  }

  function bindCanvasEvents() {
    if (!state.canvas || state.canvas.dataset.creativityBound === '1') return;
    state.canvas.dataset.creativityBound = '1';
    if (window.PointerEvent) {
      state.canvas.addEventListener('pointerdown', startStroke);
      state.canvas.addEventListener('pointermove', drawStroke);
      state.canvas.addEventListener('pointerup', stopStroke);
      state.canvas.addEventListener('pointercancel', stopStroke);
      state.canvas.addEventListener('lostpointercapture', stopStroke);
    } else {
      state.canvas.addEventListener('mousedown', startStroke);
      state.canvas.addEventListener('mousemove', drawStroke);
      state.canvas.addEventListener('mouseup', stopStroke);
      state.canvas.addEventListener('mouseleave', stopStroke);
      state.canvas.addEventListener('touchstart', startStroke, { passive: false });
      state.canvas.addEventListener('touchmove', drawStroke, { passive: false });
      state.canvas.addEventListener('touchend', stopStroke, { passive: false });
      state.canvas.addEventListener('touchcancel', stopStroke, { passive: false });
    }
  }

  function fitCanvas(preserve) {
    if (!state.canvas) return;
    var rect = state.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var old = null;
    if (preserve && state.canvas.width && state.canvas.height) {
      try { old = state.canvas.toDataURL('image/png'); } catch (_) {}
    }
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    state.canvas.width = Math.max(1, Math.round(rect.width * ratio));
    state.canvas.height = Math.max(1, Math.round(rect.height * ratio));
    state.context = state.canvas.getContext('2d');
    state.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    state.context.fillStyle = '#FFFFFF';
    state.context.fillRect(0, 0, rect.width, rect.height);
    state.context.lineCap = 'round';
    state.context.lineJoin = 'round';
    if (old) restoreSnapshot(old);
    else if (!state.initialized) saveHistory();
    state.initialized = true;
    bindCanvasEvents();
  }

  function setDrawingControlsDisabled(disabled) {
    document.querySelectorAll('#drawingScreen .creativity-toolbar button, #drawingScreen .creativity-palette input, #creativityConsent').forEach(function (control) {
      control.disabled = disabled;
    });
  }

  function drawRestoredImage(image, titleText) {
    if (state.canvasEdited || state.restoringDraft !== true) return false;
    var rect = state.canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    state.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    state.context.fillStyle = '#FFFFFF';
    state.context.fillRect(0, 0, rect.width, rect.height);
    state.context.drawImage(image, 0, 0, rect.width, rect.height);
    state.history = [];
    state.historyIndex = -1;
    saveHistory();
    var title = document.getElementById('creativityTitle');
    if (title && titleText) title.value = titleText;
    setStatus('استعدنا آخر مسودة محفوظة على هذا الجهاز.');
    return true;
  }

  async function restoreDraft() {
    if (state.restoreRequested || state.canvasEdited || state.restoringDraft || !state.canvas) return;
    state.restoreRequested = true;
    state.restoringDraft = true;
    var priorPointerEvents = state.canvas.style.pointerEvents;
    state.canvas.style.pointerEvents = 'none';
    setDrawingControlsDisabled(true);
    setStatus('جارٍ استعادة المسودة المحفوظة…');
    var restored = false;
    try {
      var saved = await idbGet('latest');
      if (saved && saved.blob) {
        var url = URL.createObjectURL(saved.blob);
        try {
          restored = await new Promise(function (resolve) {
            var image = new Image();
            image.onload = function () {
              try { resolve(drawRestoredImage(image, saved.title)); }
              catch (_) { resolve(false); }
            };
            image.onerror = function () { resolve(false); };
            image.src = url;
          });
        } finally {
          URL.revokeObjectURL(url);
        }
      }
    } catch (_) {
      restored = false;
    }
    if (!restored) {
      try {
        var fallback = localStorage.getItem('ta3lemy-creativity-draft');
        if (fallback) {
          restored = await new Promise(function (resolve) {
            var image = new Image();
            image.onload = function () {
              try { resolve(drawRestoredImage(image, '')); }
              catch (_) { resolve(false); }
            };
            image.onerror = function () { resolve(false); };
            image.src = fallback;
          });
        }
      } catch (_) {
        restored = false;
      }
    }
    state.restoreRequested = restored;
    if (restored) state.canvasEdited = false;
    state.restoringDraft = false;
    state.canvas.style.pointerEvents = priorPointerEvents;
    setDrawingControlsDisabled(false);
    updateUndoButtons();
    if (!restored) setStatus(navigator.onLine ? 'ارسم بحرية؛ يمكنك حفظ المسودة على هذا الجهاز.' : 'أنت دون اتصال؛ الرسم والحفظ المحلي متاحان.');
  }
  async function saveDraft() {
    if (state.restoringDraft || !state.canvas) return;
    var title = document.getElementById('creativityTitle');
    try {
      var blob = await canvasBlob('image/png');
      await idbPut('latest', { blob: blob, title: title ? title.value.trim().slice(0, 100) : '', savedAt: Date.now() });
      state.restoreRequested = true;
      state.canvasEdited = false;
      setStatus('حُفظت المسودة على هذا الجهاز، ويمكن فتحها دون إنترنت.');
      notify('تم حفظ المسودة على الجهاز.');
    } catch (error) {
      try {
        localStorage.setItem('ta3lemy-creativity-draft', state.canvas.toDataURL('image/png'));
        state.restoreRequested = true;
        state.canvasEdited = false;
        setStatus('حُفظت المسودة محليًا.');
        notify('تم حفظ المسودة محليًا.');
      } catch (_) {
        notify('تعذر الحفظ المحلي؛ مساحة الجهاز قد تكون ممتلئة.');
      }
    }
  }

  function buildUI() {
    var screen = document.getElementById('drawingScreen');
    if (!screen || screen.dataset.creativityBuilt === '1') return;
    screen.dataset.creativityBuilt = '1';
    var content = screen.querySelector('.content');
    var canvas = screen.querySelector('#fullDrawingCanvas');
    if (!content || !canvas) return;
    state.canvas = canvas;
    canvas.removeAttribute('width');
    canvas.removeAttribute('height');

    var topbar = screen.querySelector('.top-bar');
    var oldRight = topbar && topbar.lastElementChild;
    if (topbar && oldRight) {
      oldRight.replaceChildren();
      var galleryTopButton = el('button', 'icon-btn', '🖼️');
      galleryTopButton.type = 'button';
      galleryTopButton.title = 'معرض إبداع';
      galleryTopButton.setAttribute('aria-label', 'افتح معرض إبداع');
      galleryTopButton.addEventListener('click', openGallery);
      oldRight.appendChild(galleryTopButton);
    }

    var toolbar = el('div', 'creativity-toolbar');
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'أدوات الرسم');
    var undoBtn = button('↶ تراجع', '', undo, 'تراجع عن آخر خطوة');
    undoBtn.id = 'creativityUndo';
    var redoBtn = button('↷ إعادة', '', redo, 'إعادة الخطوة');
    redoBtn.id = 'creativityRedo';
    var eraserBtn = button('🧽 ممحاة', '', function () {
      state.eraser = !state.eraser;
      eraserBtn.setAttribute('aria-pressed', String(state.eraser));
      eraserBtn.textContent = state.eraser ? '✏️ قلم' : '🧽 ممحاة';
    });
    eraserBtn.setAttribute('aria-pressed', 'false');
    var saveBtn = button('💾 حفظ', '', saveDraft);
    var downloadBtn = button('⬇️ تنزيل', '', downloadArtwork);
    var shareBtn = button('مشاركة', '', shareArtwork);
    var printBtn = button('طباعة', '', printArtwork);
    var clearBtn = button('مسح', '', clearCanvas);
    clearBtn.style.background = '#ffebee';
    clearBtn.style.color = '#c62828';
    var aiBtn = button('✨ تحسين الرسم بالذكاء الاصطناعي', 'creativity-action-ai', enhanceArtwork);
    aiBtn.id = 'creativityAiButton';
    var sendBtn = button('📤 إرسال للمالك', 'creativity-action-send', submitArtwork);
    sendBtn.id = 'sendToOwnerBtn';
    toolbar.append(undoBtn, redoBtn, eraserBtn, saveBtn, downloadBtn, shareBtn, printBtn, clearBtn, aiBtn, sendBtn);

    var palette = el('div', 'creativity-palette');
    palette.setAttribute('aria-label', 'اختيار اللون وحجم الفرشاة');
    COLORS.forEach(function (color, index) {
      var swatch = el('button', 'creativity-color-swatch');
      swatch.type = 'button';
      swatch.style.backgroundColor = color;
      swatch.setAttribute('aria-label', 'لون ' + (index + 1));
      swatch.setAttribute('aria-pressed', String(color === state.color));
      swatch.addEventListener('click', function () { selectColor(color, swatch); });
      palette.appendChild(swatch);
    });
    var picker = document.createElement('input');
    picker.type = 'color';
    picker.className = 'creativity-custom-color';
    picker.value = state.color;
    picker.title = 'اختيار لون مخصص';
    picker.setAttribute('aria-label', 'اختيار لون مخصص');
    picker.addEventListener('input', function () { selectColor(picker.value, null); });
    palette.appendChild(picker);
    var sizeLabel = el('label', 'creativity-size-control', 'حجم القلم');
    var size = document.createElement('input');
    size.type = 'range';
    size.min = '1';
    size.max = '30';
    size.value = String(state.size);
    size.setAttribute('aria-label', 'حجم الفرشاة');
    size.addEventListener('input', function () { state.size = Number(size.value); });
    sizeLabel.appendChild(size);
    palette.appendChild(sizeLabel);
    var title = document.createElement('input');
    title.type = 'text';
    title.id = 'creativityTitle';
    title.className = 'creativity-title-input';
    title.maxLength = 100;
    title.placeholder = 'عنوان الرسمة (اختياري)';
    title.setAttribute('aria-label', 'عنوان الرسمة');
    title.addEventListener('input', function () { state.canvasEdited = true; });
    palette.appendChild(title);

    var canvasFrame = el('div', 'creativity-canvas-frame');
    canvasFrame.appendChild(canvas);
    var consent = el('label', 'creativity-consent');
    var consentBox = document.createElement('input');
    consentBox.type = 'checkbox';
    consentBox.id = 'creativityConsent';
    consent.append(consentBox, document.createTextNode('أوافق على إرسال الرسم للمراجعة، وقد يظهر في المعرض العام بعد موافقة المالك.'));
    var status = el('div', 'creativity-status');
    status.id = 'creativityStatus';
    status.setAttribute('aria-live', 'polite');
    content.replaceChildren(toolbar, palette, canvasFrame, consent, status);
    updateUndoButtons();
  }

  function selectColor(color, selectedNode) {
    state.color = color;
    state.eraser = false;
    document.querySelectorAll('.creativity-color-swatch').forEach(function (node) {
      node.setAttribute('aria-pressed', String(node === selectedNode || node.style.backgroundColor === color));
    });
    var eraser = document.querySelector('#drawingScreen .creativity-toolbar button[aria-pressed="true"]');
    if (eraser && eraser.textContent.indexOf('قلم') >= 0) {
      eraser.textContent = '🧽 ممحاة';
      eraser.setAttribute('aria-pressed', 'false');
    }
  }

  function openDrawing() {
    buildUI();
    screenPush();
    show('drawingScreen');
    window.setTimeout(function () {
      fitCanvas(state.initialized);
      setStatus(navigator.onLine ? 'ارسم بحرية؛ يمكنك حفظ المسودة على هذا الجهاز.' : 'أنت دون اتصال؛ الرسم والحفظ المحلي متاحان.');
      restoreDraft();
    }, 80);
  }

  function clearCanvas() {
    if (state.restoringDraft || !state.canvas || !state.context) return;
    if (!window.confirm('هل تريد مسح الرسمة الحالية؟')) return;
    state.canvasEdited = true;
    var rect = state.canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    state.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    state.context.fillStyle = '#FFFFFF';
    state.context.fillRect(0, 0, rect.width, rect.height);
    state.history = [];
    state.historyIndex = -1;
    saveHistory();
    clearEnhancedVersion();
    setStatus('أصبحت اللوحة فارغة.');
  }

  async function downloadArtwork() {
    try {
      var blob = await canvasBlob('image/png');
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'إبداعي.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      notify('بدأ تنزيل الرسم.');
    } catch (_) { notify('تعذر تنزيل الرسم.'); }
  }

  async function shareArtwork() {
    try {
      var blob = await canvasBlob('image/png');
      var file = new File([blob], 'ibdaai.png', { type: 'image/png' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ title: 'إبداعي', text: 'رسم من قسم إبداع', files: [file] });
      } else {
        await downloadArtwork();
      }
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      await downloadArtwork();
    }
  }

  async function printArtwork() {
    try {
      var dataUrl = state.canvas.toDataURL('image/png');
      var popup = window.open('', '_blank');
      if (!popup) return downloadArtwork();
      popup.document.open();
      popup.document.write('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>إبداعي</title><style>body{margin:0;padding:12px;text-align:center;font-family:Arial,sans-serif}img{max-width:100%;max-height:90vh}</style><img src="' + dataUrl + '" alt="الرسم"><script>window.onload=function(){window.print()}<\/script></html>');
      popup.document.close();
    } catch (_) { notify('تعذرت الطباعة في هذا الجهاز.'); }
  }

  function showCompare(originalDataUrl, enhancedDataUrl) {
    var backdrop = el('div', 'creativity-modal-backdrop');
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    var modal = el('div', 'creativity-modal');
    var heading = el('h2', '', 'اختر النسخة التي تريد إرسالها');
    var note = el('p', '', 'الرسم الأصلي محفوظ كما هو. اختر النسخة الفنية المحسّنة أو ارجع إلى الأصل.');
    var compare = el('div', 'creativity-compare');
    function figure(caption, src) {
      var fig = document.createElement('figure');
      var img = document.createElement('img');
      img.src = src;
      img.alt = caption;
      var cap = el('figcaption', '', caption);
      fig.append(img, cap);
      return fig;
    }
    compare.append(figure('الرسم الأصلي', originalDataUrl), figure('النسخة الفنية المحسّنة', enhancedDataUrl));
    var actions = el('div', 'creativity-toolbar');
    actions.style.marginTop = '12px';
    actions.append(
      button('استخدام الرسم الأصلي', '', function () { state.selectedVersion = 'original'; backdrop.remove(); setStatus('سيُرسل الرسم الأصلي.'); }),
      button('استخدام النسخة المحسّنة', 'creativity-action-primary', function () { state.selectedVersion = 'enhanced'; backdrop.remove(); setStatus('ستُرسل النسخة الفنية المحسّنة.'); }),
      button('إغلاق', '', function () { backdrop.remove(); })
    );
    modal.append(heading, note, compare, actions);
    backdrop.appendChild(modal);
    backdrop.addEventListener('click', function (event) { if (event.target === backdrop) backdrop.remove(); });
    document.body.appendChild(backdrop);
  }

  async function enhanceArtwork() {
    if (state.restoringDraft || !state.canvas) return;
    var aiButton = document.getElementById('creativityAiButton');
    if (aiButton) { aiButton.disabled = true; aiButton.textContent = '⏳ جارٍ تحسين الرسم...'; }
    setStatus('يُرسل الرسم إلى خدمة Gemini الآمنة لتحسينه.');
    try {
      var inputBlob = await canvasBlob('image/jpeg', 0.86);
      var config = window.CREATIVITY_CONFIG || {};
      if (inputBlob.size > (config.maxImageBytes || 1200000)) throw new Error('حجم الرسم أكبر من الحد المسموح؛ بسّط الرسم ثم حاول مرة أخرى.');
      var originalDataUrl = state.canvas.toDataURL('image/png');
      var result = await callFunction('creativityEnhance', {
        imageBase64: await blobToBase64(inputBlob),
        mimeType: 'image/jpeg'
      }, true);
      if (!result.imageBase64) throw new Error('لم تصل صورة محسنة من الخدمة.');
      state.enhancedMimeType = result.mimeType || 'image/png';
      state.enhancedDataUrl = 'data:' + state.enhancedMimeType + ';base64,' + result.imageBase64;
      state.selectedVersion = 'original';
      showCompare(originalDataUrl, state.enhancedDataUrl);
      setStatus('اكتمل التحسين؛ اختر النسخة المناسبة للإرسال.');
    } catch (error) {
      console.error('Creativity AI error:', error);
      var message = friendlyError(error);
      setStatus(message);
      notify(message);
    } finally {
      if (aiButton) { aiButton.disabled = false; aiButton.textContent = '✨ تحسين الرسم بالذكاء الاصطناعي'; }
    }
  }

  async function selectedArtworkBlob() {
    if (state.selectedVersion === 'enhanced' && state.enhancedDataUrl) return dataUrlToBlob(state.enhancedDataUrl);
    return canvasBlob('image/png');
  }

  function validCloudinaryImageUrl(value) {
    try {
      var config = window.CREATIVITY_CONFIG || {};
      var url = new URL(value);
      var prefix = '/' + config.cloudinaryCloudName + '/image/upload/';
      return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' &&
        url.pathname.startsWith(prefix) && /\/creativity\/[^/]+\.(?:png|jpe?g|webp)$/i.test(url.pathname) &&
        !url.search && !url.hash;
    } catch (_) { return false; }
  }

  async function uploadCreativityArtwork(file) {
    var config = window.CREATIVITY_CONFIG || {};
    var endpoint = 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(config.cloudinaryCloudName) + '/image/upload';
    var form = new FormData();
    form.append('file', file);
    form.append('upload_preset', config.cloudinaryUploadPreset);
    form.append('folder', 'creativity');
    var response = await fetch(endpoint, { method: 'POST', body: form });
    var result = await response.json().catch(function () { return {}; });
    if (!response.ok || !validCloudinaryImageUrl(result.secure_url)) {
      throw new Error('تعذر رفع الرسم إلى مساحة إبداع.');
    }
    return result.secure_url;
  }

  async function submitArtwork() {
    if (state.restoringDraft) return;
    var consent = document.getElementById('creativityConsent');
    if (!consent || !consent.checked) {
      notify('يرجى الموافقة على إرسال الرسم للمراجعة أولًا.');
      return;
    }
    if (!navigator.onLine) {
      notify('الإرسال يحتاج إلى الإنترنت؛ احفظ المسودة وأرسلها عند عودة الاتصال.');
      return;
    }
    if (!window.currentUser) {
      notify('سجّل الدخول إلى المنصة قبل إرسال الرسم.');
      return;
    }
    var config = window.CREATIVITY_CONFIG || {};
    if (!serviceReady()) {
      notify('الإرسال ينتظر إعداد App Check ونشر وظائف Firebase من حساب المالك.');
      return;
    }
    if (!config.cloudinaryUploadPreset || !config.cloudinaryCloudName) {
      notify('رفع إبداع ينتظر إعداد مساحة Cloudinary الخاصة بالرسومات.');
      return;
    }
    var sendButton = document.getElementById('sendToOwnerBtn');
    if (sendButton) { sendButton.disabled = true; sendButton.textContent = '⏳ جارٍ الإرسال...'; }
    setStatus('يُجهّز الرسم ويرسله للمراجعة الخاصة لدى المالك.');
    try {
      await ensureAnonymousAuth();
      var blob = await selectedArtworkBlob();
      if (!String(blob.type || '').startsWith('image/') || blob.size > 5 * 1024 * 1024) throw new Error('يجب أن تكون الصورة أقل من 5 ميجابايت.');
      var file = new File([blob], 'creativity-artwork.png', { type: blob.type || 'image/png' });
      if (typeof window.uploadFile !== 'function') throw new Error('رفع الصور غير متاح حاليًا.');
      var imageUrl = await uploadCreativityArtwork(file);
      if (!imageUrl) throw new Error('تعذر رفع صورة الرسم.');
      var titleInput = document.getElementById('creativityTitle');
      var result = await callFunction('creativitySubmit', {
        title: titleInput ? titleInput.value.trim().slice(0, 100) : '',
        imageUrl: imageUrl,
        studentName: String(window.currentUser.name || '').slice(0, 80),
        consent: true
      }, true);
      setStatus('تم إرسال الرسم للمراجعة. لن يظهر في المعرض إلا بعد موافقة المالك.');
      notify('وصل إبداعك للمالك للمراجعة.');
      if (result.status === 'pending') consent.checked = false;
    } catch (error) {
      console.error('Creativity submit error:', error);
      var message = friendlyError(error);
      setStatus(message);
      notify(message);
    } finally {
      if (sendButton) { sendButton.disabled = false; sendButton.textContent = '📤 إرسال للمالك'; }
    }
  }

  function createPage(id, title, icon, extraClass) {
    var old = document.getElementById(id);
    if (old) return old;
    var screen = el('div', 'screen ' + (extraClass || ''));
    screen.id = id;
    var topbar = el('div', 'top-bar');
    var back = el('button', 'icon-btn', '→');
    back.type = 'button';
    back.setAttribute('aria-label', 'رجوع');
    back.addEventListener('click', function () { if (typeof window.goBack === 'function') window.goBack(); });
    var logo = el('div', 'logo', icon + ' ' + title);
    var spacer = el('div');
    spacer.style.width = '42px';
    topbar.append(back, logo, spacer);
    var content = el('div', 'content');
    screen.append(topbar, content);
    document.body.appendChild(screen);
    return screen;
  }

  function openGallery() {
    screenPush();
    var screen = createPage('creativityGalleryScreen', 'معرض إبداع', '🖼️', 'creativity-gallery');
    show('creativityGalleryScreen');
    loadGallery(screen.querySelector('.content'));
  }

  async function loadGallery(container) {
    container.replaceChildren(el('p', '', 'جارٍ تحميل الأعمال المعتمدة…'));
    if (!serviceReady()) {
      container.replaceChildren(el('p', '', 'المعرض العام ينتظر إعداد App Check ونشر وظائف Firebase من حساب المالك.'));
      return;
    }
    try {
      var result = await callFunction('creativityListGallery', {}, false);
      var items = result.items || [];
      container.replaceChildren();
      if (!items.length) {
        container.appendChild(el('div', 'empty-state', 'لا توجد أعمال منشورة حتى الآن.'));
        return;
      }
      var grid = el('div', 'creativity-gallery-grid');
      items.forEach(function (item) {
        var card = el('article', 'creativity-gallery-card');
        var image = document.createElement('img');
        image.src = item.imageUrl;
        image.loading = 'lazy';
        image.alt = item.title || 'عمل إبداعي';
        var heading = el('h3', '', item.title || 'إبداع طالب');
        card.append(image, heading);
        grid.appendChild(card);
      });
      container.appendChild(grid);
    } catch (error) {
      console.error('Creativity gallery error:', error);
      container.replaceChildren(el('p', '', friendlyError(error)));
    }
  }

  function showOwnerSignIn(container) {
    container.replaceChildren();
    container.appendChild(el('p', '', 'ادخل بحساب المالك المسجل في Firebase لمراجعة الأعمال. هذه الصلاحية لا تعتمد على دور الصفحة وحده.'));
    var form = el('form', 'creativity-owner-form');
    var email = document.createElement('input');
    email.type = 'email';
    email.required = true;
    email.autocomplete = 'username';
    email.placeholder = 'البريد الإلكتروني للمالك';
    var password = document.createElement('input');
    password.type = 'password';
    password.required = true;
    password.autocomplete = 'current-password';
    password.placeholder = 'كلمة مرور Firebase';
    var submit = button('دخول المالك', 'creativity-action-primary', function () {}, 'تسجيل دخول آمن');
    submit.type = 'submit';
    form.append(email, password, submit);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      submit.disabled = true;
      submit.textContent = 'جارٍ التحقق…';
      try {
        await firebase.auth().signInWithEmailAndPassword(email.value.trim(), password.value);
        await loadOwnerReview(container);
      } catch (error) {
        console.error('Owner sign-in error:', error);
        container.appendChild(el('p', '', friendlyError(error)));
        notify(friendlyError(error));
      } finally {
        submit.disabled = false;
        submit.textContent = 'دخول المالك';
      }
    });
    container.appendChild(form);
  }

  function ownerCard(item, mode, content) {
    var card = el('article', 'creativity-owner-card');
    var heading = el('h3', '', item.title || 'إبداع طالب');
    var date = item.createdAt ? new Date(item.createdAt).toLocaleString('ar-EG') : '';
    var meta = el('p', '', (item.studentName ? 'الطالب: ' + item.studentName + ' — ' : '') + date);
    var image = document.createElement('img');
    image.src = item.imageUrl;
    image.loading = 'lazy';
    image.alt = item.title || 'عمل طالب';
    card.append(heading, meta, image);
    if (mode === 'pending') {
      var approve = button('✅ موافقة ونشر', 'creativity-action-primary', function () { reviewItem(item.id, 'approve', content); });
      var reject = button('رفض', '', function () { reviewItem(item.id, 'reject', content); });
      card.append(approve, reject);
    } else {
      card.appendChild(button('إلغاء النشر', '', function () { reviewItem(item.id, 'unpublish', content); }));
    }
    return card;
  }

  async function loadOwnerReview(container) {
    container.replaceChildren(el('p', '', 'جارٍ التحقق من صلاحيات المالك…'));
    try {
      var result = await callFunction('creativityListPending', {}, true);
      var pending = result.items || [];
      var publishedResult = await callFunction('creativityListOwnerGallery', {}, true);
      var published = publishedResult.items || [];
      container.replaceChildren();
      var header = el('div', 'creativity-toolbar');
      header.append(
        button('تحديث القائمة', '', function () { loadOwnerReview(container); }),
        button('تسجيل الخروج', '', async function () { await firebase.auth().signOut(); showOwnerSignIn(container); })
      );
      container.appendChild(header);
      container.appendChild(el('h2', '', 'طلبات تنتظر المراجعة (' + pending.length + ')'));
      if (!pending.length) container.appendChild(el('p', '', 'لا توجد رسومات تنتظر المراجعة.'));
      pending.forEach(function (item) { container.appendChild(ownerCard(item, 'pending', container)); });
      container.appendChild(el('h2', '', 'الأعمال المنشورة (' + published.length + ')'));
      if (!published.length) container.appendChild(el('p', '', 'لا توجد أعمال منشورة.'));
      published.forEach(function (item) { container.appendChild(ownerCard(item, 'published', container)); });
    } catch (error) {
      console.error('Owner review error:', error);
      var message = friendlyError(error);
      container.replaceChildren(el('p', '', message));
      if (error && (String(error.code || '').indexOf('permission-denied') >= 0 || String(error.code || '').indexOf('unauthenticated') >= 0)) {
        var logout = button('العودة إلى تسجيل الدخول', '', async function () { try { await firebase.auth().signOut(); } catch (_) {} showOwnerSignIn(container); });
        container.appendChild(logout);
      }
    }
  }

  async function reviewItem(id, action, container) {
    try {
      await callFunction('creativityReview', { id: id, action: action }, true);
      notify(action === 'approve' ? 'تم اعتماد العمل ونشره.' : action === 'reject' ? 'تم رفض الرسم.' : 'تم إلغاء النشر.');
      await loadOwnerReview(container);
    } catch (error) {
      console.error('Creativity review error:', error);
      notify(friendlyError(error));
    }
  }

  function openDrawingReviews() {
    screenPush();
    var screen = createPage('drawingReviewsScreen', 'مراجعة إبداعات الطلاب', '🎨', 'creativity-owner');
    show('drawingReviewsScreen');
    var container = screen.querySelector('.content');
    var authUser = window.firebase && firebase.auth ? firebase.auth().currentUser : null;
    if (authUser && !authUser.isAnonymous) loadOwnerReview(container);
    else showOwnerSignIn(container);
  }

  function installHomeEntry() {
    var home = document.getElementById('homeScreen');
    if (!home || home.querySelector('#creativityHomeEntry')) return;
    var content = home.querySelector('.content');
    if (!content) return;
    var entry = el('button', 'creativity-entry-card');
    entry.id = 'creativityHomeEntry';
    entry.type = 'button';
    entry.setAttribute('aria-label', 'افتح قسم إبداع للرسم');
    var icon = el('span', 'creativity-entry-icon', '🎨');
    var copy = el('span', 'creativity-entry-copy');
    copy.append(el('strong', '', 'إبداع'), el('span', '', 'ارسم، حسّن عملك، وشاركه بعد المراجعة'));
    entry.append(icon, copy);
    entry.addEventListener('click', openDrawing);
    var search = content.querySelector('.search-box');
    if (search && search.nextSibling) content.insertBefore(entry, search.nextSibling);
    else content.insertBefore(entry, content.firstChild);
  }

  function installOwnerEntry() {
    var admin = document.getElementById('adminScreen');
    if (!admin || admin.querySelector('#adminCreativityBtn')) return;
    var content = admin.querySelector('.content');
    if (!content) return;
    var entry = el('button', 'creativity-entry-card');
    entry.id = 'adminCreativityBtn';
    entry.type = 'button';
    var icon = el('span', 'creativity-entry-icon', '🖼️');
    var copy = el('span', 'creativity-entry-copy');
    copy.append(el('strong', '', 'مراجعة إبداعات الطلاب'), el('span', '', 'طلبات الإرسال والمعرض المنشور'));
    entry.append(icon, copy);
    entry.addEventListener('click', openDrawingReviews);
    content.insertBefore(entry, content.firstChild);
  }

  function init() {
    buildUI();
    installHomeEntry();
    installOwnerEntry();
    window.openDrawing = openDrawing;
    window.openCreativityGallery = openGallery;
    window.openDrawingReviews = openDrawingReviews;
    window.sendDrawingToOwner = function () { submitArtwork(); };
    window.drawingUndo = undo;
    window.drawingRedo = redo;
    window.drawingClearAll = clearCanvas;
    window.drawingSave = saveDraft;
    window.drawingSetColor = function (color) { selectColor(color, null); };
    window.drawingSetSize = function (size) { state.size = Number(size) || 5; };
    window.drawingSetEraser = function () { state.eraser = !state.eraser; };
    window.initFullCanvas = function () { fitCanvas(state.initialized); };
    window.addEventListener('resize', function () {
      if (document.getElementById('drawingScreen') && document.getElementById('drawingScreen').classList.contains('active')) {
        window.setTimeout(function () { fitCanvas(true); }, 100);
      }
    });
    window.addEventListener('online', function () { setStatus('عاد الاتصال بالإنترنت. يمكنك الإرسال أو استخدام AI بعد إعداد المالك للخدمة.'); });
  }

  init();
})();
