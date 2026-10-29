/*
 * قسم «إبداع» لمنصة الأستاذ حافظ التعليمية.
 * الرسم والحفظ المحلي، مزامنة الأعمال الخاصة لحساب الطالب، إرسال للمراجعة،
 * نشر المعتمدين في معرض عام، ومعاينة حركة محلية. لا يحتوي مفاتيح API.
 */
(function () {
  'use strict';

  var MAX_FIRESTORE_IMAGE_BYTES = 650 * 1024;
  var LOCAL_DB_NAME = 'hafez-creativity-v1';
  var LOCAL_STORE = 'artworks';
  var HISTORY_LIMIT = 20;
  var canvas = null;
  var context = null;
  var isDrawing = false;
  var currentColor = '#202124';
  var brushSize = 5;
  var erasing = false;
  var history = [];
  var historyIndex = -1;
  var currentArtworkId = null;
  var autosaveTimer = null;
  var localDbPromise = null;

  var PALETTE = [
    '#111111', '#5D4037', '#795548', '#9E9E9E', '#FFFFFF',
    '#B71C1C', '#E53935', '#F06292', '#8E24AA', '#5E35B1',
    '#1E88E5', '#039BE5', '#00ACC1', '#00897B', '#43A047',
    '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00',
    '#F4511E', '#FFCCBC', '#B2DFDB', '#BBDEFB', '#E1BEE7'
  ];

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else console.log(message);
  }

  function getUser() {
    return window.currentUser || null;
  }

  function getUid() {
    var user = getUser();
    return user && user.uid ? String(user.uid) : 'guest';
  }

  function getFirestore() {
    try {
      if (window.firebase && typeof window.firebase.firestore === 'function') {
        return window.firebase.firestore();
      }
    } catch (e) {
      console.warn('Firestore is not ready', e);
    }
    return null;
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function enterScreen(id) {
    if (window.screenHistory && window.currentScreen) {
      window.screenHistory.push(window.currentScreen);
    }
    if (typeof window.showScreen === 'function') window.showScreen(id);
  }

  function openLocalDb() {
    if (localDbPromise) return localDbPromise;
    localDbPromise = new Promise(function (resolve, reject) {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
      var request = window.indexedDB.open(LOCAL_DB_NAME, 1);
      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains(LOCAL_STORE)) {
          var store = db.createObjectStore(LOCAL_STORE, { keyPath: 'key' });
          store.createIndex('uid', 'uid', { unique: false });
        }
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('IndexedDB open failed')); };
    });
    return localDbPromise;
  }

  async function localPut(record) {
    var item = Object.assign({}, record, { key: record.uid + ':' + record.id });
    try {
      var db = await openLocalDb();
      await new Promise(function (resolve, reject) {
        var tx = db.transaction(LOCAL_STORE, 'readwrite');
        tx.objectStore(LOCAL_STORE).put(item);
        tx.oncomplete = resolve;
        tx.onerror = function () { reject(tx.error || new Error('Local save failed')); };
      });
      return true;
    } catch (e) {
      try {
        localStorage.setItem('creative:' + item.key, JSON.stringify(item));
        return true;
      } catch (storageError) {
        console.warn('Local artwork save failed', storageError);
        return false;
      }
    }
  }

  async function localDelete(uid, id) {
    try {
      var db = await openLocalDb();
      await new Promise(function (resolve, reject) {
        var tx = db.transaction(LOCAL_STORE, 'readwrite');
        tx.objectStore(LOCAL_STORE).delete(uid + ':' + id);
        tx.oncomplete = resolve;
        tx.onerror = function () { reject(tx.error); };
      });
    } catch (e) {}
    try { localStorage.removeItem('creative:' + uid + ':' + id); } catch (e) {}
  }

  async function localGet(uid, id) {
    try {
      var db = await openLocalDb();
      var found = await new Promise(function (resolve, reject) {
        var tx = db.transaction(LOCAL_STORE, 'readonly');
        var req = tx.objectStore(LOCAL_STORE).get(uid + ':' + id);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
      if (found) return found;
    } catch (e) {}
    try {
      var raw = localStorage.getItem('creative:' + uid + ':' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  async function localList(uid) {
    var items = [];
    try {
      var db = await openLocalDb();
      items = await new Promise(function (resolve, reject) {
        var tx = db.transaction(LOCAL_STORE, 'readonly');
        var req = tx.objectStore(LOCAL_STORE).index('uid').getAll(uid);
        req.onsuccess = function () { resolve(req.result || []); };
        req.onerror = function () { reject(req.error); };
      });
    } catch (e) {}
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf('creative:' + uid + ':') === 0) {
          var item = JSON.parse(localStorage.getItem(key));
          if (item) items.push(item);
        }
      }
    } catch (e) {}
    var byId = {};
    items.forEach(function (item) { if (item && item.id) byId[item.id] = item; });
    return Object.keys(byId).map(function (id) { return byId[id]; });
  }

  function compactCanvasData(source) {
    return new Promise(function (resolve, reject) {
      try {
        var maxSide = 1000;
        var scale = Math.min(1, maxSide / Math.max(source.width, source.height));
        var target = document.createElement('canvas');
        var quality = 0.82;
        var attempt = 0;
        function encode() {
          target.width = Math.max(1, Math.round(source.width * scale));
          target.height = Math.max(1, Math.round(source.height * scale));
          var c = target.getContext('2d');
          c.fillStyle = '#FFFFFF';
          c.fillRect(0, 0, target.width, target.height);
          c.drawImage(source, 0, 0, target.width, target.height);
          var data = target.toDataURL('image/jpeg', quality);
          var estimatedBytes = Math.floor((data.length - data.indexOf(',') - 1) * 0.75);
          if (estimatedBytes <= MAX_FIRESTORE_IMAGE_BYTES) return resolve(data);
          attempt++;
          if (attempt >= 6) return reject(new Error('الرسم كبير جدًا للحفظ السحابي'));
          scale *= 0.82;
          quality = Math.max(0.48, quality - 0.06);
          encode();
        }
        encode();
      } catch (e) { reject(e); }
    });
  }

  function loadImage(dataUrl) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () { resolve(image); };
      image.onerror = function () { reject(new Error('تعذر تحميل الصورة')); };
      image.src = dataUrl;
    });
  }

  function fitCanvas() {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context = canvas.getContext('2d', { willReadFrequently: false });
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, rect.width, rect.height);
    if (oldWidth && oldHeight && history.length) {
      var last = history[historyIndex];
      if (last) drawDataToCanvas(last).catch(function () {});
    }
    updateToolStates();
  }

  async function drawDataToCanvas(dataUrl) {
    if (!canvas || !context) return;
    var image = await loadImage(dataUrl);
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, rect.width, rect.height);
    context.drawImage(image, 0, 0, rect.width, rect.height);
  }

  function snapshot() {
    if (!canvas) return;
    try {
      var state = canvas.toDataURL('image/png');
      history = history.slice(0, historyIndex + 1);
      history.push(state);
      if (history.length > HISTORY_LIMIT) history.shift();
      historyIndex = history.length - 1;
      window.drawingHistory = history;
      window.historyIndex = historyIndex;
      updateToolStates();
      scheduleDraftSave();
    } catch (e) { console.warn('Could not snapshot artwork', e); }
  }

  function updateToolStates() {
    var undo = document.getElementById('creativeUndoBtn');
    var redo = document.getElementById('creativeRedoBtn');
    if (undo) undo.disabled = historyIndex <= 0;
    if (redo) redo.disabled = historyIndex >= history.length - 1;
    var eraser = document.getElementById('creativeEraserBtn');
    if (eraser) eraser.classList.toggle('active', erasing);
  }

  function scheduleDraftSave() {
    clearTimeout(autosaveTimer);
    var uid = getUid();
    autosaveTimer = setTimeout(async function () {
      if (!canvas) return;
      try {
        var dataUrl = await compactCanvasData(canvas);
        await localPut({
          uid: uid, id: '__draft__', title: '', description: '', dataUrl: dataUrl,
          isDraft: true, updatedAt: nowIso(), storage: 'device'
        });
      } catch (e) { console.warn('Draft autosave failed', e); }
    }, 900);
  }

  async function restoreDraft() {
    var uid = getUid();
    var draft = await localGet(uid, '__draft__');
    if (!draft && uid !== 'guest') {
      // استيراد نسخة قديمة مرة واحدة فقط، ثم فصلها عن المفتاح المشترك القديم.
      try {
        var legacy = localStorage.getItem('ta3lemy_drawing');
        if (legacy) {
          draft = { dataUrl: legacy, title: '', description: '', id: '__draft__', uid: uid };
          await localPut(Object.assign({}, draft, { isDraft: true, storage: 'device' }));
          localStorage.removeItem('ta3lemy_drawing');
        }
      } catch (e) {}
    }
    if (draft && draft.dataUrl && canvas) {
      try {
        await drawDataToCanvas(draft.dataUrl);
        history = [];
        historyIndex = -1;
        snapshot();
      } catch (e) { console.warn('Could not restore draft', e); }
    } else {
      history = [];
      historyIndex = -1;
      snapshot();
    }
  }

  function setColor(color) {
    currentColor = color || '#202124';
    erasing = false;
    window.currentColor = currentColor;
    window.isEraser = false;
    updateToolStates();
  }

  function setBrushSize(size) {
    brushSize = Math.max(1, Math.min(40, Number(size) || 5));
    window.currentSize = brushSize;
    var readout = document.getElementById('creativeBrushValue');
    if (readout) readout.textContent = brushSize + ' px';
  }

  function undo() {
    if (historyIndex <= 0) return toast('لا توجد خطوة للتراجع عنها');
    historyIndex--;
    window.drawingHistory = history;
    window.historyIndex = historyIndex;
    drawDataToCanvas(history[historyIndex]).then(updateToolStates);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return toast('لا توجد خطوة للإعادة');
    historyIndex++;
    window.drawingHistory = history;
    window.historyIndex = historyIndex;
    drawDataToCanvas(history[historyIndex]).then(updateToolStates);
  }

  function clearAll() {
    if (!canvas || !context) return;
    if (!window.confirm('هل تريد مسح اللوحة الحالية؟')) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, rect.width, rect.height);
    currentArtworkId = null;
    var title = document.getElementById('creativeTitleInput');
    var description = document.getElementById('creativeDescriptionInput');
    if (title) title.value = '';
    if (description) description.value = '';
    history = [];
    historyIndex = -1;
    snapshot();
    toast('تم مسح اللوحة');
  }

  function ensureStyles() {
    if (document.getElementById('creativeStyles')) return;
    var style = document.createElement('style');
    style.id = 'creativeStyles';
    style.textContent = [
      '#drawingScreen .creative-meta{display:flex;gap:7px;padding:8px;background:#f7fbf7;border-bottom:1px solid #e5eee5;align-items:center;}',
      '#drawingScreen .creative-meta input{min-width:0;flex:1;padding:9px 10px;border:1px solid #d8e3d8;border-radius:10px;font:inherit;font-size:13px;background:#fff;}',
      '#drawingScreen .creative-tools{display:flex;align-items:center;gap:8px;padding:7px 10px;background:#fbfdfb;border-bottom:1px solid #e5eee5;}',
      '#drawingScreen .creative-tools label{font-size:12px;color:#555;white-space:nowrap;}',
      '#drawingScreen .creative-tools input[type=range]{flex:1;min-width:70px;accent-color:#2e7d32;}',
      '#drawingScreen .creative-tools input[type=color]{width:42px;height:36px;border:0;padding:0;background:transparent;}',
      '#drawingScreen .creative-action{border:0;border-radius:9px;padding:8px 10px;font:inherit;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;}',
      '#drawingScreen .creative-action:disabled{opacity:.45;cursor:not-allowed;}',
      '#drawingScreen .creative-action.active{outline:3px solid #ffb300;}',
      '#drawingScreen .creative-palette{display:flex;align-items:center;gap:5px;padding:6px 8px;overflow-x:auto;background:#fff;border-bottom:1px solid #e5eee5;}',
      '#drawingScreen .creative-swatch{width:28px;height:28px;flex:0 0 28px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #cbd5cb;cursor:pointer;}',
      '#drawingScreen .creative-main-toolbar{display:flex;flex-wrap:wrap;align-items:stretch;gap:6px;padding:7px 8px;overflow:visible!important;width:100%;min-width:0;box-sizing:border-box;}',
      '#drawingScreen .creative-main-toolbar>.creative-action{box-sizing:border-box;flex:1 1 88px;min-width:0;margin:0!important;text-align:center;white-space:normal;line-height:1.2;}',
      '#drawingScreen .creative-extra-toolbar{display:flex;flex-wrap:wrap;align-items:stretch;gap:6px;padding:6px 8px;overflow:visible!important;width:100%;min-width:0;box-sizing:border-box;}',
      '#drawingScreen .creative-extra-toolbar>.creative-action{box-sizing:border-box;flex:1 1 100px;min-width:84px;margin:0!important;text-align:center;white-space:normal;line-height:1.2;}',
      '.creative-screen .content{padding:14px;}',
      '.creative-card{background:#fff;border:1px solid #e6eee6;border-radius:15px;padding:11px;margin:0 0 12px;box-shadow:0 3px 10px rgba(0,0,0,.05);}',
      '.creative-card img{display:block;width:100%;max-height:280px;object-fit:contain;background:#f8f8f8;border-radius:10px;cursor:pointer;}',
      '.creative-card-title{font-size:16px;font-weight:700;margin:8px 0 4px;color:#263238;}',
      '.creative-card-meta{font-size:12px;color:#777;margin:3px 0 8px;}',
      '.creative-card-actions{display:flex;gap:8px;margin-top:9px;}',
      '.creative-empty{text-align:center;color:#777;padding:28px 12px;background:#fff;border-radius:14px;}',
      '.creative-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:100000;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;padding:18px;}',
      '.creative-modal-panel{width:100%;max-width:620px;max-height:90vh;overflow:auto;background:#fff;border-radius:18px;padding:14px;}',
      '.creative-motion{animation:creativeFloat 2.4s ease-in-out infinite alternate;transform-origin:center;}',
      '@keyframes creativeFloat{from{transform:translateY(4px) rotate(-1deg) scale(.98)}to{transform:translateY(-8px) rotate(1deg) scale(1.02)}}',
      '@media(max-width:600px){#drawingScreen .content{min-height:0;min-width:0;width:100%;box-sizing:border-box;overflow:hidden;}#drawingScreen .creative-meta{gap:6px;padding:6px 8px;}#drawingScreen .creative-meta input{font-size:12px;padding:8px;}#drawingScreen .creative-main-toolbar{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));width:100%;min-width:0;box-sizing:border-box;gap:4px;padding:4px 6px!important;overflow:visible!important;}#drawingScreen .creative-main-toolbar>button{box-sizing:border-box;display:flex;width:100%;max-width:none;min-width:0;min-height:34px;align-items:center;justify-content:center;margin:0!important;padding:4px 2px!important;font-size:9px!important;line-height:1.15;text-align:center;white-space:normal!important;border-radius:7px;}#drawingScreen .creative-extra-toolbar{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));width:100%;min-width:0;box-sizing:border-box;gap:3px;padding:4px 5px;overflow:visible!important;}#drawingScreen .creative-extra-toolbar>.creative-action{box-sizing:border-box;display:flex;width:100%;max-width:none;min-width:0;min-height:34px;align-items:center;justify-content:center;margin:0!important;padding:3px 1px!important;font-size:8px!important;line-height:1.1;white-space:normal!important;border-radius:7px;}#drawingScreen .creative-tools:not(.creative-main-toolbar):not(.creative-extra-toolbar){gap:4px;padding:4px 6px;}#drawingScreen .creative-tools input[type=range]{min-width:0;flex:1 1 90px;}#drawingScreen .creative-tools label{font-size:10px;}#drawingScreen .creative-palette{gap:4px;padding:4px 6px;}#drawingScreen .creative-palette .creative-swatch{width:22px;height:22px;flex:0 0 22px;}#drawingScreen .creative-palette input[type=color]{width:34px;height:30px;}#homeScreen .tools-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;}#homeScreen .tool-btn{min-width:0;min-height:70px;padding:6px 2px;}#homeScreen .tool-icon{width:34px;height:34px;font-size:18px;margin-bottom:4px;}#homeScreen .tool-label{min-height:2.2em;display:flex;align-items:center;justify-content:center;text-align:center;font-size:10px;line-height:1.2;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function makeButton(id, label, bg, color, handler) {
    var button = document.getElementById(id);
    if (!button) {
      button = document.createElement('button');
      button.id = id;
      button.type = 'button';
      button.className = 'creative-action';
      button.textContent = label;
      button.style.background = bg;
      button.style.color = color;
      button.addEventListener('click', handler);
    } else {
      button.onclick = handler;
    }
    return button;
  }

  function ensureDrawingControls() {
    var screen = document.getElementById('drawingScreen');
    var content = screen && screen.querySelector('.content');
    canvas = document.getElementById('fullDrawingCanvas');
    if (!content || !canvas) return;
    ensureStyles();

    var meta = document.getElementById('creativeMetaRow');
    if (!meta) {
      meta = document.createElement('div');
      meta.id = 'creativeMetaRow';
      meta.className = 'creative-meta';
      var title = document.createElement('input');
      title.id = 'creativeTitleInput';
      title.type = 'text';
      title.maxLength = 70;
      title.placeholder = 'اسم لوحتك';
      title.setAttribute('aria-label', 'اسم اللوحة');
      var description = document.createElement('input');
      description.id = 'creativeDescriptionInput';
      description.type = 'text';
      description.maxLength = 180;
      description.placeholder = 'وصف قصير (اختياري)';
      description.setAttribute('aria-label', 'وصف اللوحة');
      meta.appendChild(title);
      meta.appendChild(description);
      content.insertBefore(meta, content.firstChild);
    }

    var mainToolbar = meta.nextElementSibling;
    if (mainToolbar) {
      mainToolbar.classList.add('creative-main-toolbar');
      var undoBtn = mainToolbar.querySelector('#creativeUndoBtn') || mainToolbar.querySelector('[onclick*="drawingUndo"]');
      if (!undoBtn) {
        undoBtn = makeButton('creativeUndoBtn', '↶ تراجع', '#E3F2FD', '#1976D2', undo);
        mainToolbar.insertBefore(undoBtn, mainToolbar.firstChild);
      } else {
        undoBtn.id = 'creativeUndoBtn';
        undoBtn.classList.add('creative-action');
        undoBtn.onclick = undo;
      }
      var redoBtn = mainToolbar.querySelector('#creativeRedoBtn') || mainToolbar.querySelector('[onclick*="drawingRedo"]');
      if (!redoBtn) {
        redoBtn = makeButton('creativeRedoBtn', '↷ إعادة', '#E3F2FD', '#1976D2', redo);
        mainToolbar.insertBefore(redoBtn, undoBtn.nextSibling);
      } else {
        redoBtn.id = 'creativeRedoBtn';
        redoBtn.classList.add('creative-action');
        redoBtn.onclick = redo;
      }
      var galleryBtn = mainToolbar.querySelector('#creativeGalleryBtn');
      if (!galleryBtn) {
        galleryBtn = makeButton('creativeGalleryBtn', '🖼️ المعرض', '#F3E5F5', '#7B1FA2', function () { window.openCreativeGallery(); });
        mainToolbar.appendChild(galleryBtn);
      } else galleryBtn.onclick = function () { window.openCreativeGallery(); };
      var worksBtn = mainToolbar.querySelector('#creativeWorksBtn');
      if (!worksBtn) {
        worksBtn = makeButton('creativeWorksBtn', '📁 أعمالي', '#E8F5E9', '#2E7D32', function () { window.openMyCreations(); });
        mainToolbar.appendChild(worksBtn);
      } else worksBtn.onclick = function () { window.openMyCreations(); };
    }

    var palette = meta.nextElementSibling && meta.nextElementSibling.nextElementSibling;
    if (palette && !document.getElementById('creativePalette')) {
      var swatches = document.createElement('div');
      swatches.id = 'creativePalette';
      swatches.className = 'creative-palette';
      PALETTE.forEach(function (color) {
        var swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'creative-swatch';
        swatch.style.background = color;
        swatch.title = color;
        swatch.setAttribute('aria-label', 'اختيار اللون ' + color);
        swatch.addEventListener('click', function () { setColor(color); });
        swatches.appendChild(swatch);
      });
      var pickerLabel = document.createElement('label');
      pickerLabel.textContent = 'لون كامل';
      var picker = document.createElement('input');
      picker.type = 'color';
      picker.value = '#202124';
      picker.setAttribute('aria-label', 'اختيار أي لون');
      picker.addEventListener('input', function () { setColor(picker.value); });
      pickerLabel.appendChild(picker);
      swatches.appendChild(pickerLabel);
      palette.parentNode.replaceChild(swatches, palette);
    }

    var toolRow = document.getElementById('creativeBrushRow');
    if (!toolRow) {
      toolRow = document.createElement('div');
      toolRow.id = 'creativeBrushRow';
      toolRow.className = 'creative-tools';
      var eraser = document.createElement('button');
      eraser.type = 'button';
      eraser.id = 'creativeEraserBtn';
      eraser.className = 'creative-action';
      eraser.textContent = '🧽 ممحاة';
      eraser.style.background = '#FFF3E0';
      eraser.style.color = '#E65100';
      eraser.setAttribute('aria-label', 'الممحاة');
      eraser.onclick = function () { erasing = !erasing; window.isEraser = erasing; updateToolStates(); };

      var focusBtn = document.createElement('button');
      focusBtn.type = 'button';
      focusBtn.id = 'creativeFocusBtn';
      focusBtn.className = 'creative-action';
      focusBtn.textContent = '🔍 شاشة كاملة';
      focusBtn.style.background = '#E8EAF6';
      focusBtn.style.color = '#283593';
      focusBtn.setAttribute('aria-label', 'شاشة كاملة للرسم');
      focusBtn.onclick = function () {
        var ds = document.getElementById('drawingScreen');
        if (ds) {
          ds.classList.toggle('focus-mode');
          if (ds.classList.contains('focus-mode')) {
            toast('تم تفعيل وضع الشاشة الكاملة للرسم. انقر هنا مرة أخرى للخروج');
          }
        }
      };

      var label = document.createElement('label');
      label.textContent = 'حجم القلم';
      var slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '1';
      slider.max = '40';
      slider.value = '5';
      slider.setAttribute('aria-label', 'حجم القلم');

      var brushDot = document.createElement('div');
      brushDot.id = 'creativeBrushDotPreview';
      brushDot.style.cssText = 'width:5px;height:5px;border-radius:50%;background:' + currentColor + ';display:inline-block;margin:0 4px;vertical-align:middle;transition:all 0.1s ease;';

      slider.oninput = function () {
        setBrushSize(slider.value);
        if (brushDot) {
          var s = Math.min(Math.max(slider.value, 3), 26);
          brushDot.style.width = s + 'px';
          brushDot.style.height = s + 'px';
          brushDot.style.background = erasing ? '#FF9800' : currentColor;
        }
      };

      var value = document.createElement('span');
      value.id = 'creativeBrushValue';
      value.textContent = '5 px';
      value.style.cssText = 'font-size:12px;color:#555;min-width:32px;';

      toolRow.appendChild(eraser);
      toolRow.appendChild(focusBtn);
      toolRow.appendChild(label);
      toolRow.appendChild(brushDot);
      toolRow.appendChild(slider);
      toolRow.appendChild(value);
      if (swatches && swatches.parentNode) swatches.after(toolRow);
      else content.insertBefore(toolRow, canvas.parentElement);
    }

    var sendBtn = document.getElementById('sendToOwnerBtn');
    if (sendBtn) {
      sendBtn.textContent = '📤 إرسال للمراجعة';
      sendBtn.onclick = function () { window.sendDrawingToOwner(canvas); };
    }
    var existingUndo = mainToolbar && mainToolbar.querySelector('button[onclick*="drawingUndo"]');
    var existingRedo = mainToolbar && mainToolbar.querySelector('button[onclick*="drawingRedo"]');
    if (existingUndo && existingUndo.id !== 'creativeUndoBtn') existingUndo.remove();
    if (existingRedo && existingRedo.id !== 'creativeRedoBtn') existingRedo.remove();
    var clearBtn = mainToolbar && mainToolbar.querySelector('button[onclick*="drawingClearAll"]');
    if (clearBtn) clearBtn.onclick = clearAll;
    var saveBtn = mainToolbar && mainToolbar.querySelector('button[onclick*="drawingSave"]');
    if (saveBtn) saveBtn.onclick = function () { window.drawingSave(); };
    updateToolStates();
  }

  function initCanvas(skipDraftRestore) {
    ensureDrawingControls();
    canvas = document.getElementById('fullDrawingCanvas');
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context = canvas.getContext('2d');
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, rect.width, rect.height);
    window.fullCanvas = canvas;
    window.fullCtx = context;
    window.currentColor = currentColor;
    window.currentSize = brushSize;
    window.isEraser = false;

    canvas.onpointerdown = function (event) {
      if (event.button != null && event.button !== 0) return;
      event.preventDefault();
      if (canvas.setPointerCapture) {
        try { canvas.setPointerCapture(event.pointerId); } catch (e) {}
      }
      isDrawing = true;
      var box = canvas.getBoundingClientRect();
      context.beginPath();
      context.moveTo(event.clientX - box.left, event.clientY - box.top);
      context.strokeStyle = erasing ? '#FFFFFF' : currentColor;
      context.lineWidth = erasing ? Math.max(10, brushSize * 3) : brushSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = context.strokeStyle;
      context.arc(event.clientX - box.left, event.clientY - box.top, context.lineWidth / 2, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(event.clientX - box.left, event.clientY - box.top);
    };
    canvas.onpointermove = function (event) {
      if (!isDrawing) return;
      event.preventDefault();
      var box = canvas.getBoundingClientRect();
      context.strokeStyle = erasing ? '#FFFFFF' : currentColor;
      context.lineWidth = erasing ? Math.max(10, brushSize * 3) : brushSize;
      context.lineTo(event.clientX - box.left, event.clientY - box.top);
      context.stroke();
    };
    function endStroke() {
      if (!isDrawing) return;
      isDrawing = false;
      context.closePath();
      snapshot();
    }
    canvas.onpointerup = endStroke;
    canvas.onpointercancel = endStroke;
    canvas.onpointerleave = endStroke;
    if (!('PointerEvent' in window)) {
      canvas.onmousedown = function (e) {
        canvas.onpointerdown({ clientX: e.clientX, clientY: e.clientY, pointerId: 1, button: 0, preventDefault: function () { e.preventDefault(); } });
      };
      canvas.onmousemove = function (e) { canvas.onpointermove(e); };
      canvas.onmouseup = endStroke;
      canvas.ontouchstart = function (e) {
        var t = e.touches[0];
        canvas.onpointerdown({ clientX: t.clientX, clientY: t.clientY, preventDefault: function () { e.preventDefault(); }, pointerId: 1, button: 0 });
      };
      canvas.ontouchmove = function (e) {
        var t = e.touches[0];
        canvas.onpointermove({ clientX: t.clientX, clientY: t.clientY, preventDefault: function () { e.preventDefault(); } });
      };
      canvas.ontouchend = endStroke;
    }
    history = [];
    historyIndex = -1;
    window.drawingHistory = history;
    window.historyIndex = historyIndex;
    if (!skipDraftRestore) {
      canvas.style.pointerEvents = 'none';
      restoreDraft().then(function () { if (canvas) canvas.style.pointerEvents = ''; });
    }
    updateToolStates();
  }

  async function makeArtworkRecord() {
    if (!canvas) throw new Error('لوحة الرسم غير جاهزة');
    var titleInput = document.getElementById('creativeTitleInput');
    var descriptionInput = document.getElementById('creativeDescriptionInput');
    var title = titleInput ? titleInput.value.trim() : '';
    if (!title) {
      title = window.prompt('اكتب اسمًا للوحة الفنية:') || '';
      if (titleInput && title) titleInput.value = title;
    }
    if (!title) throw new Error('اكتب اسم اللوحة أولاً');
    var dataUrl = await compactCanvasData(canvas);
    var uid = getUid();
    var id = currentArtworkId || ('art_' + Date.now().toString(36));
    var existing = currentArtworkId ? await localGet(uid, currentArtworkId) : null;
    return {
      id: id,
      uid: uid,
      studentId: uid,
      studentName: (getUser() && getUser().name) || 'طالب',
      title: title,
      description: descriptionInput ? descriptionInput.value.trim() : '',
      dataUrl: dataUrl,
      status: (existing && existing.status === 'pending') ? 'pending' : 'private',
      createdAt: (existing && existing.createdAt) || nowIso(),
      updatedAt: nowIso(),
      isDraft: false
    };
  }

  async function saveArtwork(options) {
    options = options || {};
    var record;
    try { record = await makeArtworkRecord(); }
    catch (e) { if (!options.quiet) toast('⚠️ ' + e.message); return null; }
    currentArtworkId = record.id;
    var localSaved = await localPut(Object.assign({}, record, { storage: 'device' }));
    var cloudSaved = false;
    if (record.uid !== 'guest') {
      var fs = getFirestore();
      if (fs) {
        try {
          await fs.collection('users').doc(record.uid).collection('creativeWorks').doc(record.id).set(record, { merge: true });
          cloudSaved = true;
        } catch (e) {
          console.warn('Private artwork sync failed', e);
        }
      }
    }
    await localDelete(record.uid, '__draft__');
    if (!options.quiet) {
      if (cloudSaved) toast('💾 تم حفظ اللوحة في أعمالك ومزامنتها مع حسابك');
      else if (localSaved) toast('💾 حُفظت على هذا الجهاز فقط؛ تعذرت المزامنة مع الحساب');
      else toast('❌ تعذر حفظ اللوحة');
    }
    record.cloudSaved = cloudSaved;
    return record;
  }

  async function sendDrawing(canvasArg) {
    if (!getUser() || getUid() === 'guest') {
      toast('سجّل الدخول أولًا حتى يرتبط العمل بحسابك');
      return;
    }
    var fs = getFirestore();
    if (!fs) return toast('لا يوجد اتصال بقاعدة البيانات الآن');
    var button = document.getElementById('sendToOwnerBtn');
    if (button) { button.disabled = true; button.textContent = '⏳ جارٍ الإرسال...'; }
    try {
      if (canvasArg && canvasArg !== canvas) canvas = canvasArg;
      var record = await saveArtwork({ quiet: true });
      if (!record) return;
      var ref = await fs.collection('drawing_requests').add({
        studentId: record.uid,
        studentName: record.studentName,
        artworkId: record.id,
        title: record.title,
        description: record.description,
        imageDataUrl: record.dataUrl,
        status: 'pending',
        createdAt: nowIso()
      });
      record.status = 'pending';
      record.requestId = ref.id;
      await localPut(Object.assign({}, record, { storage: record.cloudSaved ? 'account' : 'device' }));
      if (record.cloudSaved) {
        try {
          await fs.collection('users').doc(record.uid).collection('creativeWorks').doc(record.id).set({ status: 'pending', requestId: ref.id, updatedAt: nowIso() }, { merge: true });
        } catch (e) {}
      }
      toast('✅ وصل عملك للمالك للمراجعة قبل النشر');
    } catch (e) {
      console.error('Send creative work failed', e);
      toast('❌ تعذر الإرسال. تحقق من الاتصال وصلاحيات قاعدة البيانات');
    } finally {
      if (button) { button.disabled = false; button.textContent = '📤 إرسال للمراجعة'; }
    }
  }

  async function loadMyArtworks() {
    var uid = getUid();
    var localItems = await localList(uid);
    var itemsById = {};
    localItems.forEach(function (item) { if (item && !item.isDraft) itemsById[item.id] = item; });
    if (uid !== 'guest') {
      var fs = getFirestore();
      if (fs) {
        try {
          var snap = await fs.collection('users').doc(uid).collection('creativeWorks').orderBy('updatedAt', 'desc').limit(50).get();
          snap.forEach(function (doc) {
            var item = Object.assign({}, doc.data(), { id: doc.id, uid: uid, cloudSaved: true });
            itemsById[doc.id] = Object.assign({}, itemsById[doc.id] || {}, item);
          });
        } catch (e) { console.warn('Could not load cloud artworks', e); }
      }
    }
    return Object.keys(itemsById).map(function (id) { return itemsById[id]; })
      .sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
  }

  function statusLabel(status) {
    return ({ private: 'خاص بك', pending: '⏳ قيد مراجعة المالك', approved: '✅ معتمد للنشر', published: '🖼️ منشور للجميع', rejected: 'لم يُعتمد' })[status] || 'خاص بك';
  }

  function createCard(item, options) {
    options = options || {};
    var card = document.createElement('article');
    card.className = 'creative-card';
    var img = document.createElement('img');
    img.src = item.imageDataUrl || item.dataUrl || '';
    img.alt = item.title || 'رسمة طالب';
    img.loading = 'lazy';
    img.onclick = function () { showPreview(item.imageDataUrl || item.dataUrl, item.title, false); };
    var title = document.createElement('div');
    title.className = 'creative-card-title';
    title.textContent = item.title || 'لوحة بدون عنوان';
    var meta = document.createElement('div');
    meta.className = 'creative-card-meta';
    meta.textContent = (options.showStudent ? '👤 ' + (item.studentName || 'طالب') + ' · ' : '') + statusLabel(item.status) + ' · ' + new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleDateString('ar-EG');
    card.appendChild(img);
    card.appendChild(title);
    if (item.description) {
      var desc = document.createElement('div');
      desc.className = 'creative-card-meta';
      desc.textContent = item.description;
      card.appendChild(desc);
    }
    card.appendChild(meta);
    if (options.showReview) {
      var actions = document.createElement('div');
      actions.className = 'creative-card-actions';
      var approve = document.createElement('button');
      approve.className = 'creative-action';
      approve.textContent = '✅ موافقة ونشر';
      approve.style.cssText = 'flex:1;background:#2E7D32;color:#fff;';
      approve.onclick = function () { window.approveCreativeWork(item.id); };
      var reject = document.createElement('button');
      reject.className = 'creative-action';
      reject.textContent = 'رفض';
      reject.style.cssText = 'flex:1;background:#FFEBEE;color:#C62828;';
      reject.onclick = function () { window.rejectCreativeWork(item.id); };
      actions.appendChild(approve);
      actions.appendChild(reject);
      card.appendChild(actions);
    } else if (options.showLoad) {
      var actions2 = document.createElement('div');
      actions2.className = 'creative-card-actions';
      var load = document.createElement('button');
      load.className = 'creative-action';
      load.textContent = '✏️ فتح وتعديل';
      load.style.cssText = 'flex:1;background:#E8F5E9;color:#2E7D32;';
      load.onclick = function () { window.loadCreativeWork(item.id); };
      actions2.appendChild(load);
      if (item.status === 'private' || item.status === 'rejected') {
        var submit = document.createElement('button');
        submit.className = 'creative-action';
        submit.textContent = '📤 إرسال للمراجعة';
        submit.style.cssText = 'flex:1;background:#FFF3E0;color:#E65100;';
        submit.onclick = function () { window.loadCreativeWork(item.id).then(function () { window.sendDrawingToOwner(canvas); }); };
        actions2.appendChild(submit);
      }
      card.appendChild(actions2);
    }
    return card;
  }

  function ensureListScreen(id, title) {
    var screen = document.getElementById(id);
    if (!screen) {
      screen = document.createElement('div');
      screen.id = id;
      screen.className = 'screen creative-screen';
      var top = document.createElement('div');
      top.className = 'top-bar';
      top.style.background = 'linear-gradient(135deg,#1B5E20,#43A047)';
      var back = document.createElement('button');
      back.className = 'icon-btn';
      back.textContent = '→';
      back.onclick = function () { if (typeof window.goBack === 'function') window.goBack(); };
      var logo = document.createElement('div');
      logo.className = 'logo';
      var span = document.createElement('span');
      span.textContent = title;
      logo.appendChild(span);
      top.appendChild(back);
      top.appendChild(logo);
      var body = document.createElement('div');
      body.className = 'content';
      body.id = id + 'Content';
      screen.appendChild(top);
      screen.appendChild(body);
      document.body.appendChild(screen);
    }
    return screen;
  }

  function showPreview(dataUrl, title, motion) {
    if (!dataUrl) return;
    var overlay = document.createElement('div');
    overlay.className = 'creative-modal';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    var panel = document.createElement('div');
    panel.className = 'creative-modal-panel';
    var heading = document.createElement('h3');
    heading.textContent = title || 'إبداع طالب';
    var img = document.createElement('img');
    img.src = dataUrl;
    img.alt = title || 'إبداع طالب';
    img.style.cssText = 'display:block;width:100%;max-height:70vh;object-fit:contain;background:#fafafa;border-radius:12px;';
    if (motion) img.classList.add('creative-motion');
    var close = document.createElement('button');
    close.className = 'creative-action';
    close.textContent = 'إغلاق';
    close.style.cssText = 'width:100%;margin-top:12px;background:#2E7D32;color:white;';
    close.onclick = function () { overlay.remove(); };
    panel.appendChild(heading);
    panel.appendChild(img);
    panel.appendChild(close);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  }

  async function openMyCreations() {
    ensureStyles();
    ensureListScreen('creativeMyScreen', '📁 أعمالي الإبداعية');
    enterScreen('creativeMyScreen');
    var body = document.getElementById('creativeMyScreenContent');
    body.innerHTML = '<div class="creative-empty">⏳ جاري تحميل أعمالك...</div>';
    var items = await loadMyArtworks();
    while (body.firstChild) body.removeChild(body.firstChild);
    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'creative-empty';
      empty.textContent = getUid() === 'guest' ? 'لم تحفظ لوحات على هذا الجهاز بعد. احفظ لوحة لتظهر هنا.' : 'لم تحفظ لوحات بعد. ارسم لوحتك واضغط «حفظ» لتظهر هنا.';
      body.appendChild(empty);
      return;
    }
    items.forEach(function (item) { body.appendChild(createCard(item, { showLoad: true })); });
  }

  async function openCreativeGallery() {
    ensureStyles();
    ensureListScreen('creativeGalleryScreen', '🖼️ معرض الإبداع');
    enterScreen('creativeGalleryScreen');
    var body = document.getElementById('creativeGalleryScreenContent');
    body.innerHTML = '<div class="creative-empty">⏳ جاري تحميل الأعمال المعتمدة...</div>';
    var fs = getFirestore();
    if (!fs) {
      body.innerHTML = '<div class="creative-empty">تعذر الاتصال بالمعرض الآن. حاول عند توفر الإنترنت.</div>';
      return;
    }
    try {
      var snap = await fs.collection('creative_gallery').where('status', '==', 'published').limit(60).get();
      var items = [];
      snap.forEach(function (doc) { items.push(Object.assign({ id: doc.id }, doc.data())); });
      items.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      while (body.firstChild) body.removeChild(body.firstChild);
      if (!items.length) {
        var empty = document.createElement('div');
        empty.className = 'creative-empty';
        empty.textContent = 'المعرض في بدايته؛ ستظهر هنا الأعمال بعد موافقة المالك.';
        body.appendChild(empty);
        return;
      }
      items.forEach(function (item) { body.appendChild(createCard(item, { showStudent: true })); });
    } catch (e) {
      console.error('Gallery load failed', e);
      body.innerHTML = '<div class="creative-empty">تعذر تحميل المعرض. قد تحتاج قاعدة البيانات إلى السماح بقراءة الأعمال المنشورة.</div>';
    }
  }

  async function loadCreativeWork(id) {
    var uid = getUid();
    var item = await localGet(uid, id);
    var fs = uid === 'guest' ? null : getFirestore();
    if (fs) {
      try {
        var doc = await fs.collection('users').doc(uid).collection('creativeWorks').doc(id).get();
        if (doc.exists) item = Object.assign({}, item || {}, doc.data(), { id: id, uid: uid });
      } catch (e) { console.warn('Could not load cloud artwork', e); }
    }
    if (!item || !item.dataUrl) return toast('لم أجد هذه اللوحة محفوظة');
    if (item.status === 'pending') return toast('هذه اللوحة قيد المراجعة؛ انتظر قرار المالك قبل تعديلها');
    if (typeof window.showScreen === 'function') {
      if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
      window.showScreen('drawingScreen');
    }
    return new Promise(function (resolve) {
      setTimeout(async function () {
        try {
          ensureDrawingControls();
          canvas = document.getElementById('fullDrawingCanvas');
          if (!canvas) return resolve(null);
          canvas.style.pointerEvents = 'none';
          initCanvas(true);
          currentArtworkId = id;
          var title = document.getElementById('creativeTitleInput');
          var description = document.getElementById('creativeDescriptionInput');
          if (title) title.value = item.title || '';
          if (description) description.value = item.description || '';
          await drawDataToCanvas(item.dataUrl);
          history = [];
          historyIndex = -1;
          snapshot();
          canvas.style.pointerEvents = '';
          toast('تم فتح اللوحة للتعديل');
          resolve(item);
        } catch (e) {
          if (canvas) canvas.style.pointerEvents = '';
          console.error('Could not open artwork', e);
          toast('تعذر فتح اللوحة');
          resolve(null);
        }
      }, 180);
    });
  }

  function openDrawing() {
    currentArtworkId = null;
    if (window.screenHistory && window.currentScreen) window.screenHistory.push(window.currentScreen);
    if (typeof window.showScreen === 'function') window.showScreen('drawingScreen');
    setTimeout(function () {
      initCanvas();
      var title = document.getElementById('creativeTitleInput');
      var description = document.getElementById('creativeDescriptionInput');
      if (title) title.value = '';
      if (description) description.value = '';
    }, 180);
  }

  async function loadReviews() {
    var body = document.getElementById('creativeReviewScreenContent');
    if (!body) return;
    body.innerHTML = '<div class="creative-empty">⏳ جاري تحميل الطلبات...</div>';
    var fs = getFirestore();
    try {
      if (!fs) throw new Error('Firestore is not ready');
      var snap = await fs.collection('drawing_requests').where('status', '==', 'pending').limit(100).get();
      var requests = [];
      snap.forEach(function (doc) { requests.push(Object.assign({ id: doc.id }, doc.data())); });
      requests.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
      while (body.firstChild) body.removeChild(body.firstChild);
      if (!requests.length) {
        var empty = document.createElement('div');
        empty.className = 'creative-empty';
        empty.textContent = 'لا توجد أعمال تنتظر المراجعة.';
        body.appendChild(empty);
        return;
      }
      requests.forEach(function (request) { body.appendChild(createCard(request, { showStudent: true, showReview: true })); });
    } catch (e) {
      console.error('Review queue failed', e);
      body.innerHTML = '<div class="creative-empty">تعذر تحميل طلبات الرسم. تحقق من صلاحيات Firestore.</div>';
    }
  }

  async function openCreativeReviews() {
    if (window.currentRole !== 'owner') return toast('هذه الصفحة للمالك فقط');
    ensureStyles();
    ensureListScreen('creativeReviewScreen', '👑 مراجعة الإبداعات');
    enterScreen('creativeReviewScreen');
    await loadReviews();
  }

  async function approveWork(id) {
    if (window.currentRole !== 'owner') return toast('هذه العملية للمالك فقط');
    var fs = getFirestore();
    if (!fs) return toast('لا يوجد اتصال بقاعدة البيانات');
    try {
      var ref = fs.collection('drawing_requests').doc(id);
      var doc = await ref.get();
      if (!doc.exists) throw new Error('طلب الرسم غير موجود');
      var request = doc.data();
      var galleryRef = fs.collection('creative_gallery').doc('drawing_' + id);
      await galleryRef.set({
        title: request.title || 'إبداع طالب',
        description: request.description || '',
        studentId: request.studentId || '',
        studentName: request.studentName || 'طالب',
        imageDataUrl: request.imageDataUrl,
        status: 'published',
        createdAt: nowIso(),
        approvedAt: nowIso(),
        requestId: id
      });
      await ref.update({ status: 'approved', galleryId: galleryRef.id, reviewedAt: nowIso() });
      if (request.studentId && request.artworkId) {
        try {
          await fs.collection('users').doc(request.studentId).collection('creativeWorks').doc(request.artworkId).set({ status: 'approved', galleryId: galleryRef.id, updatedAt: nowIso() }, { merge: true });
        } catch (e) {}
      }
      toast('✅ تمت الموافقة وظهر العمل في معرض الإبداع');
      await loadReviews();
    } catch (e) {
      console.error('Approve artwork failed', e);
      toast('❌ لم تنجح الموافقة والنشر. تحقق من صلاحيات Firestore');
    }
  }

  async function rejectWork(id) {
    if (window.currentRole !== 'owner') return toast('هذه العملية للمالك فقط');
    if (!window.confirm('رفض هذا العمل وعدم نشره؟')) return;
    var fs = getFirestore();
    try {
      var ref = fs.collection('drawing_requests').doc(id);
      var doc = await ref.get();
      if (!doc.exists) return toast('طلب الرسم غير موجود');
      var request = doc.data();
      await ref.update({ status: 'rejected', reviewedAt: nowIso() });
      if (request.studentId && request.artworkId) {
        try {
          await fs.collection('users').doc(request.studentId).collection('creativeWorks').doc(request.artworkId).set({ status: 'rejected', updatedAt: nowIso() }, { merge: true });
        } catch (e) {}
      }
      toast('تم تسجيل قرار المراجعة');
      await loadReviews();
    } catch (e) {
      console.error('Reject artwork failed', e);
      toast('❌ تعذر تسجيل قرار المراجعة');
    }
  }

  function ensureOwnerReviewEntry() {
    if (window.currentRole !== 'owner') return;
    var admin = document.getElementById('adminScreen');
    var content = admin && admin.querySelector('.content');
    if (!content || document.getElementById('adminCreativeReviewsBtn')) return;
    var button = document.createElement('div');
    button.id = 'adminCreativeReviewsBtn';
    button.className = 'menu-item';
    button.innerHTML = '<span style="font-size:26px">🎨</span><span style="flex:1;font-weight:700;color:#2E7D32">مراجعة إبداعات الطلاب</span><span style="color:#999;font-size:24px">‹</span>';
    button.onclick = openCreativeReviews;
    content.insertBefore(button, content.firstChild);
  }

  function ensureHomeGalleryShortcut() {
    var home = document.getElementById('homeScreen');
    var grid = home && home.querySelector('.tools-grid');
    if (!grid) return;
    var oldDrawing = home.querySelector('[onclick*="openDrawing"]');
    var oldLabel = oldDrawing && oldDrawing.querySelector('.tool-label');
    if (oldLabel) oldLabel.textContent = 'إبداع';
    if (document.getElementById('homeCreativeGalleryBtn')) return;
    var item = document.createElement('button');
    item.type = 'button';
    item.id = 'homeCreativeGalleryBtn';
    item.className = 'tool-btn';
    item.style.cssText = 'border:0;cursor:pointer;font-family:inherit;';
    item.innerHTML = '<div class="tool-icon" style="background:#F3E5F5;color:#7B1FA2">🖼️</div><div class="tool-label">معرض الإبداع</div>';
    item.onclick = openCreativeGallery;
    grid.appendChild(item);
  }

  function downloadCurrent() {
    if (!canvas) return;
    canvas.toBlob(function (blob) {
      if (!blob) return toast('تعذر تجهيز الصورة');
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'ibdaa-' + Date.now() + '.png';
      link.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('تم تنزيل اللوحة');
    }, 'image/png');
  }

  async function shareCurrent() {
    if (!canvas) return;
    try {
      var blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/png'); });
      if (!blob) throw new Error('تعذر تجهيز الصورة');
      var file = new File([blob], 'ibdaa.png', { type: 'image/png' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: 'لوحتي من منصة الأستاذ حافظ' });
      } else downloadCurrent();
    } catch (e) { if (e.name !== 'AbortError') toast('تعذرت المشاركة على هذا الجهاز'); }
  }

  function showAISetup(action) {
    if (action === 'enhance' || action === 'improve') {
      if (typeof window.enhanceArtwork === 'function') {
        window.enhanceArtwork();
      } else {
        toast('⏳ جاري تحميل أداة تحسين AI...');
      }
    } else {
      var message = 'تحريك الرسمة بالذكاء الاصطناعي يتطلب خدمة فيديو منفصلة. تم تفعيل ميزة تحسين الرسمة بالذكاء الاصطناعي (✨ تحسين AI) بنجاح!';
      showPreviewNotice('تحريك بالذكاء الاصطناعي', message);
    }
  }

  function showPreviewNotice(titleText, messageText) {
    var overlay = document.createElement('div');
    overlay.className = 'creative-modal';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    var panel = document.createElement('div');
    panel.className = 'creative-modal-panel';
    var title = document.createElement('h3');
    title.textContent = titleText;
    var message = document.createElement('p');
    message.textContent = messageText;
    message.style.cssText = 'line-height:1.8;color:#455a64;';
    var close = document.createElement('button');
    close.className = 'creative-action';
    close.textContent = 'حسنًا';
    close.style.cssText = 'width:100%;background:#2E7D32;color:white;';
    close.onclick = function () { overlay.remove(); };
    panel.appendChild(title);
    panel.appendChild(message);
    panel.appendChild(close);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  }

  function addExtraActions() {
    var screen = document.getElementById('drawingScreen');
    var content = screen && screen.querySelector('.content');
    if (!content) return;
    var toolbar = document.getElementById('creativeActionToolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.id = 'creativeActionToolbar';
      toolbar.className = 'creative-tools creative-extra-toolbar';
      toolbar.style.overflowX = 'visible';
      var actions = [
        ['creativeDownloadBtn', '⬇️ تنزيل', '#E3F2FD', '#1565C0', downloadCurrent],
        ['creativeShareBtn', 'مشاركة', '#E0F2F1', '#00695C', shareCurrent],
        ['creativeAnimatePreviewBtn', '🎞️ معاينة حركة', '#FFF8E1', '#F57F17', function () { if (canvas) showPreview(canvas.toDataURL('image/png'), (document.getElementById('creativeTitleInput') || {}).value || 'إبداع', true); }],
        ['creativeAIImproveBtn', '✨ تحسين AI', '#EDE7F6', '#4527A0', function () { showAISetup('enhance'); }],
        ['creativeAIAnimateBtn', '🎥 تحريك AI', '#EDE7F6', '#4527A0', function () { showAISetup('animate'); }]
      ];
      actions.forEach(function (entry) { toolbar.appendChild(makeButton(entry[0], entry[1], entry[2], entry[3], entry[4])); });
      var canvasHolder = canvas && canvas.parentElement;
      if (canvasHolder && canvasHolder.parentNode) canvasHolder.parentNode.insertBefore(toolbar, canvasHolder);
      else content.appendChild(toolbar);
    }
  }

  window.openDrawing = openDrawing;
  window.initFullCanvas = initCanvas;
  window.drawingSetColor = setColor;
  window.drawingSetEraser = function () { erasing = !erasing; window.isEraser = erasing; updateToolStates(); };
  window.drawingSetSize = setBrushSize;
  window.drawingUndo = undo;
  window.drawingRedo = redo;
  window.drawingClearAll = clearAll;
  window.drawingSave = async function () {
    var record = await saveArtwork();
    if (record) { currentArtworkId = record.id; }
  };
  window.drawingShare = shareCurrent;
  window.sendDrawingToOwner = sendDrawing;
  window.openMyCreations = openMyCreations;
  window.openCreativeGallery = openCreativeGallery;
  window.loadCreativeWork = loadCreativeWork;
  window.openCreativeReviews = openCreativeReviews;
  window.loadCreativeReviews = loadReviews;
  window.approveCreativeWork = approveWork;
  window.rejectCreativeWork = rejectWork;
  window.runCreativeAI = showAISetup;

  document.addEventListener('DOMContentLoaded', function () {
    ensureStyles();
    var drawingShortcutLabel = document.querySelector('#homeScreen .tools-grid .tool-btn[onclick*="openDrawing"] .tool-label');
    if (drawingShortcutLabel) drawingShortcutLabel.textContent = 'إبداع';
    ensureDrawingControls();
    addExtraActions();
    ensureHomeGalleryShortcut();
    setInterval(function () {
      ensureDrawingControls();
      addExtraActions();
      ensureHomeGalleryShortcut();
      ensureOwnerReviewEntry();
    }, 1800);
  });

  window.addEventListener('load', function () {
    ensureDrawingControls();
    addExtraActions();
    setTimeout(ensureHomeGalleryShortcut, 5200);
    ensureOwnerReviewEntry();
  });
})();

/* ===== الملاحظات الإضافية لقسم إبداع ===== */
