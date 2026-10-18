// ═══════════════════════════════════════════════════════
// extras-patch.js — إصلاحات سريعة (المرحلة 1)
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  console.log('🔧 Loading extras-patch...');

// ═══════════════════════════════════════════════════════
// 🎨 لوحة إبداع - النسخة النهائية (مضمونة 100%)
// ═══════════════════════════════════════════════════════

(function(){
  // 1. إنشاء الشاشة
  if(!document.getElementById('proDrawScreen')){
    var s = document.createElement('div');
    s.id = 'proDrawScreen';
    s.className = 'screen';
    s.style.cssText = 'display:none; flex-direction:column; height:100vh; background:#f5f5f5;';
    s.innerHTML = '<div class="top-bar" style="background:linear-gradient(135deg,#FF6B6B,#FF8E53);"><button class="icon-btn" onclick="goBack()">→</button><div class="logo"><span>✨ إبداع</span></div><div style="width:42px;"></div></div>' +
      '<div style="padding:10px; background:#fff; display:flex; gap:8px; overflow-x:auto; align-items:center;">' +
      '<input type="color" id="drwColor" value="#000000" style="width:40px; height:40px; border:none; border-radius:8px;">' +
      '<button onclick="window.undoDrw()" style="padding:8px; border-radius:8px; border:1px solid #ddd;">↶ تراجع</button>' +
      '<button onclick="window.clearDrw()" style="padding:8px; border-radius:8px; border:1px solid #ddd; color:#E53935;">🗑️ مسح</button>' +
      '<button onclick="window.saveDrw()" style="padding:8px; border-radius:8px; border:1px solid #ddd; color:#2E7D32;">💾 حفظ</button>' +
      '<button onclick="window.sendDrw()" style="padding:8px; border-radius:8px; border:1px solid #ddd; background:#1976D2; color:#fff;">📤 إرسال</button>' +
      '<input type="range" id="drwSize" min="1" max="20" value="5" style="width:80px;">' +
      '</div>' +
      '<div id="drwWrap" style="flex:1; position:relative; background:#fff; overflow:hidden;">' +
      '<canvas id="drwCanvas" style="width:100%; height:100%; touch-action:none; cursor:crosshair;"></canvas>' +
      '</div>';
    document.body.appendChild(s);
  }

  // 2. إعدادات الفرشاة
  var canvas, ctx, isDrawing = false, lastX = 0, lastY = 0;
  var history = [], currentStep = -1;

  function initCanvas() {
    canvas = document.getElementById('drwCanvas');
    if(!canvas) return;
    
    // ضبط الأبعاد بناءً على حجم الشاشة الفعلي
    var wrap = document.getElementById('drwWrap');
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    
    ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;

    // دالة بتجيب مكان الماوس أو الصباع بدقة
    function getCoords(e) {
      var rect = canvas.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    // بداية الرسم
    function start(e) {
      e.preventDefault();
      isDrawing = true;
      var coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;
    }

    // الرسم الفعلي
    function move(e) {
      e.preventDefault();
      if (!isDrawing) return;
      var coords = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      lastX = coords.x;
      lastY = coords.y;
    }

    // نهاية الرسم
    function end(e) {
      if (isDrawing) {
        isDrawing = false;
        saveState();
      }
    }

    // ربط الأحداث (ماوس + لمس)
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseout', end);
    
    canvas.addEventListener('touchstart', start, {passive: false});
    canvas.addEventListener('touchmove', move, {passive: false});
    canvas.addEventListener('touchend', end);

    // تغيير اللون والحجم
    document.getElementById('drwColor').addEventListener('input', function(e){ ctx.strokeStyle = e.target.value; });
    document.getElementById('drwSize').addEventListener('input', function(e){ ctx.lineWidth = e.target.value; });

    saveState();
  }

  // 3. دوال التحكم
  window.undoDrw = function() { if(currentStep > 0) { currentStep--; loadState(); } };
  window.clearDrw = function() { if(confirm('مسح الرسم؟')) { ctx.clearRect(0,0,canvas.width,canvas.height); saveState(); } };
  window.saveDrw = function() { var a = document.createElement('a'); a.download = 'ابداع.png'; a.href = canvas.toDataURL(); a.click(); };
  
  window.sendDrw = async function() {
    if(!window.currentUser) return alert('سجل دخول');
    if(!confirm('إرسال الرسمة للمالك؟')) return;
    try {
      await firebase.firestore().collection('student_drawings').add({
        studentId: window.currentUser.uid, studentName: window.currentUser.name,
        image: canvas.toDataURL('image/png'), createdAt: new Date().toISOString()
      });
      if(typeof showToast === 'function') showToast('✅ تم الإرسال');
    } catch(e) { console.error(e); }
  };

  function saveState() {
    if(!canvas) return;
    history = history.slice(0, currentStep + 1);
    history.push(canvas.toDataURL());
    currentStep = history.length - 1;
  }

  function loadState() {
    if(history[currentStep]) {
      var img = new Image();
      img.onload = function() { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img, 0, 0); };
      img.src = history[currentStep];
    }
  }

  // 4. الفتح
  window.openProDrawing = function() {
    if(typeof showScreen === 'function') showScreen('proDrawScreen');
    setTimeout(initCanvas, 200); // استنى شوية عشان الشاشة تظهر
  };

  console.log('✅ Pro Drawing (V2) Loaded');
})();
  // ═══ 2. تغيير "الرسائل" → "الدردشة" ═══
  function renameMessagesToChat(){
    document.querySelectorAll('.nav-item').forEach(function(nav){
      var onclick = nav.getAttribute('onclick') || '';
      var label = nav.querySelector('span:last-child');
      if(onclick.indexOf('openMessages') > -1 && label && label.textContent === 'رسائل'){
        label.textContent = 'الدردشة';
      }
    });
    var msgTitle = document.querySelector('#messagesScreen .logo span');
    if(msgTitle && msgTitle.textContent.indexOf('الرسائل') > -1){
      msgTitle.textContent = '💬 الدردشة';
    }
    document.querySelectorAll('.tool-btn').forEach(function(btn){
      var onclick = btn.getAttribute('onclick') || '';
      var label = btn.querySelector('.tool-label');
      if(onclick.indexOf('openMessages') > -1 && label && label.textContent === 'رسائل'){
        label.textContent = 'الدردشة';
      }
    });
  }

  // ═══ 3. إزالة أزرار البث المكررة ═══
  function removeDuplicateBroadcastButtons(){
    var oldIds = ['newsBtn', 'pomoBtn', 'multBtn', 'broadcastBtn', 'exerciseBtn', 'quickMenu', 'offlineBtn', 'installAppBtn'];
    oldIds.forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.style.display = 'none';
    });

    var toolsGrid = document.querySelector('#homeScreen .tools-grid');
    if(!toolsGrid) return;
    var liveButtons = [];
    toolsGrid.querySelectorAll('.tool-btn').forEach(function(btn){
      var label = btn.querySelector('.tool-label');
      if(label && label.textContent === 'البث'){
        liveButtons.push(btn);
      }
    });
    liveButtons.slice(1).forEach(function(btn){ btn.remove(); });
  }

  // ═══ 4. إصلاح الإيموشن ═══
  function fixEmojiSystem(){
    document.querySelectorAll('.emoji-btn, #newChatEmojiBtn').forEach(function(el){ el.remove(); });

    window.showEmojiPicker = function(inputId){
      var emojis = ['😊','😂','❤️','👍','🔥','✨','🎉','😍','🙏','😎','😢','😡','👏','💯','🌟','🥰','🤔','👌','💪','🎓','📚','✅','❌','⭐','🎯','🏆','📖','🕌','🌙','☀️','💡','🎨','⚽','🍎','🌹','🎁'];
      var old = document.getElementById('emojiPicker');
      if(old) old.remove();

      var picker = document.createElement('div');
      picker.id = 'emojiPicker';
      picker.style.cssText = 'position:fixed;background:#fff;border-radius:14px;padding:10px;box-shadow:0 4px 20px rgba(0,0,0,.25);display:grid;grid-template-columns:repeat(6,1fr);gap:6px;z-index:99999;max-width:280px;max-height:220px;overflow-y:auto;';

      var inp = document.getElementById(inputId);
      if(!inp) return;
      var rect = inp.getBoundingClientRect();
      picker.style.top = Math.max(10, rect.top - 240) + 'px';
      picker.style.left = Math.max(10, rect.left) + 'px';

      emojis.forEach(function(emo){
        var b = document.createElement('button');
        b.textContent = emo;
        b.style.cssText = 'font-size:24px;background:none;border:none;cursor:pointer;padding:4px;border-radius:8px;';
        b.onclick = function(){
          inp.value += emo;
          inp.focus();
          picker.remove();
        };
        picker.appendChild(b);
      });

      document.body.appendChild(picker);

      setTimeout(function(){
        document.addEventListener('click', function close(e){
          if(!picker.contains(e.target) && e.target !== inp){
            picker.remove();
            document.removeEventListener('click', close);
          }
        });
      }, 100);
    };

    function addChatEmojiButton(){
      var inputBar = document.querySelector('#chatScreen .chat-input-bar');
      if(!inputBar) return;
      if(inputBar.querySelector('#emojiBtnChat')) return;
      var chatInput = document.getElementById('chatInput');
      if(!chatInput) return;

      var btn = document.createElement('button');
      btn.id = 'emojiBtnChat';
      btn.innerHTML = '😊';
      btn.type = 'button';
      btn.style.cssText = 'background:#f0f0f0;border:none;width:40px;height:40px;border-radius:50%;font-size:20px;cursor:pointer;flex-shrink:0;';
      btn.onclick = function(e){ e.preventDefault(); e.stopPropagation(); window.showEmojiPicker('chatInput'); };
      inputBar.insertBefore(btn, chatInput);
    }

    function addNewsEmojiButtons(){
      document.querySelectorAll('[id^="commentInput-"]').forEach(function(inp){
        if(inp.parentElement.querySelector('.emoji-btn')) return;
        var btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.innerHTML = '😊';
        btn.type = 'button';
        btn.style.cssText = 'background:#F0F0F0;border:none;width:40px;height:40px;border-radius:50%;font-size:20px;cursor:pointer;flex-shrink:0;';
        btn.onclick = function(e){ e.preventDefault(); e.stopPropagation(); window.showEmojiPicker(inp.id); };
        inp.parentElement.insertBefore(btn, inp.nextSibling);
      });
    }

    setInterval(addChatEmojiButton, 3000);
    setInterval(addNewsEmojiButtons, 3000);

    window.insertEmoji = function(){
      window.showEmojiPicker('chatInput');
    };
  }

  // ═══ 5. تفعيل البحث ═══
  function fixSearch(){
    window.globalSearch = async function(q){
      if(!q || q.length < 2) return;
      var l = document.getElementById('contentList');
      if(!l) return;

      try {
        var fs = firebase.firestore();
        var snap = await fs.collection('lessons').get();
        var results = [];
        snap.forEach(function(doc){
          var d = doc.data();
          var text = ((d.title||'') + ' ' + (d.content||'') + ' ' + (d.subject||'')).toLowerCase();
          if(text.indexOf(q.toLowerCase()) > -1){
            results.push({id: doc.id, data: d});
          }
        });

        if(results.length === 0){
          if(typeof showToast === 'function') showToast('🔍 لا نتائج لـ: ' + q);
          return;
        }

        if(window.screenHistory) window.screenHistory.push(window.currentScreen);
        if(typeof showScreen === 'function') showScreen('contentScreen');

        var title = document.getElementById('contentTitle');
        if(title) title.textContent = '🔍 نتائج البحث';
        var ht = document.getElementById('contentHeaderTitle');
        if(ht) ht.textContent = 'بحث: ' + q;
        var hs = document.getElementById('contentHeaderSub');
        if(hs) hs.textContent = results.length + ' نتيجة';

        l.innerHTML = results.map(function(r){
          return '<div class="content-item" onclick="viewContent(\'' + r.id + '\')">' +
            '<div class="content-item-icon">📄</div>' +
            '<div class="content-item-info">' +
            '<div class="content-item-title">' + (r.data.title || 'بدون عنوان') + '</div>' +
            '<div class="content-item-sub">' + (r.data.subject || '') + ' • ' + (r.data.grade || '') + '</div>' +
            '</div><div class="content-item-arrow">‹</div></div>';
        }).join('');
      } catch(e){ console.error(e); }
    };
  }

  // ═══ 6. زرار تعديل المنشورات ═══
  function addEditButtonToNews(){
    if(window._newsOverridden) return;
    window._newsOverridden = true;

    var origOpenNews = window.openNews;

    window.openNews = async function(){
      if(typeof origOpenNews !== 'function') return;
      await origOpenNews();
      setTimeout(function(){
        if(window.currentRole !== 'owner' && window.currentRole !== 'teacher') return;
        document.querySelectorAll('[onclick^="deleteNews"]').forEach(function(delBtn){
          var match = delBtn.getAttribute('onclick').match(/deleteNews\('([^']+)'\)/);
          if(!match) return;
          var postId = match[1];
          if(delBtn.parentElement.querySelector('.editNewsBtn')) return;
          var editBtn = document.createElement('button');
          editBtn.className = 'editNewsBtn';
          editBtn.innerHTML = '✏️ تعديل';
          editBtn.style.cssText = 'background:#E3F2FD;color:#1976D2;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;margin-left:6px;';
          editBtn.onclick = function(e){ e.stopPropagation(); window.editNewsPost(postId); };
          delBtn.parentElement.insertBefore(editBtn, delBtn);
        });
      }, 500);
    };

    window.editNewsPost = async function(postId){
      try {
        var doc = await firebase.firestore().collection('posts').doc(postId).get();
        if(!doc.exists) return;
        var p = doc.data();

        var newTitle = prompt('العنوان الجديد:', p.title || '');
        if(newTitle === null) return;
        var newContent = prompt('المحتوى الجديد:', p.content || '');
        if(newContent === null) return;

        await firebase.firestore().collection('posts').doc(postId).update({
          title: newTitle.trim(),
          content: newContent.trim(),
          updated_at: new Date().toISOString()
        });
        if(typeof showToast === 'function') showToast('✅ تم التعديل');
        window.openNews();
      } catch(e){ console.error(e); if(typeof showToast === 'function') showToast('❌ فشل التعديل'); }
    };
  }

  // ═══ 7. القرآن أوف لاين ═══
  function fixQuranOffline(){
    if(window._quranOfflineFixed) return;
    window._quranOfflineFixed = true;

    var origOpenSurah = window.openSurah;

    window.openSurah = async function(num){
      if(!navigator.onLine){
        var stored = localStorage.getItem('offline_quran_full');
        if(stored){
          try {
            var quran = JSON.parse(stored);
            var surah = quran[num];
            if(surah){
              var c = document.getElementById('surahContent');
              document.getElementById('surahTitle').textContent = surah.name;
              var html = '<div style="text-align:center;background:linear-gradient(135deg,#00695C,#26A69A);color:#fff;padding:20px;border-radius:16px;margin-bottom:16px;">' +
                '<div style="font-size:24px;font-weight:bold;">' + surah.name + '</div>' +
                '<div style="font-size:13px;opacity:.9;margin-top:6px;">' + surah.ayahs.length + ' آية (أوف لاين)</div></div>';
              surah.ayahs.forEach(function(a){
                html += '<div class="ayah-card"><span class="ayah-num">' + a.num + '</span>' + a.text + '</div>';
              });
              c.innerHTML = html;
              if(window.screenHistory) window.screenHistory.push(window.currentScreen);
              if(typeof showScreen === 'function') showScreen('surahScreen');
              return;
            }
          } catch(e){ console.error(e); }
        }
        if(typeof showToast === 'function') showToast('📴 محتاج تحميل القرآن أوف لاين أولاً');
        return;
      }
      return origOpenSurah.apply(this, arguments);
    };
  }

  // ═══ تشغيل كل الإصلاحات ═══
  function runAll(){
    renameDrawingToIbdaa();
    renameMessagesToChat();
    removeDuplicateBroadcastButtons();
    fixEmojiSystem();
    fixSearch();
    addEditButtonToNews();
    fixQuranOffline();
  }

  window.addEventListener('load', function(){
    setTimeout(runAll, 3500);
    setTimeout(runAll, 6000);
    setTimeout(runAll, 9000);
  });

  setInterval(function(){
    renameDrawingToIbdaa();
    renameMessagesToChat();
    removeDuplicateBroadcastButtons();
  }, 5000);

  console.log('✅ extras-patch.js loaded');
})();
// إصلاح سريع لتسجيل الدخول
window.addEventListener('load', function(){
  setTimeout(function(){
    var oldLogin = window.login;
    window.login = async function() {
      var u = document.getElementById('usernameInput');
      var p = document.getElementById('passwordInput');
      var c = document.getElementById('ownerCodeInput');
      
      if (window.currentRole === 'owner') {
        if (c && c.value !== '135790') {
          if(typeof showToast === 'function') showToast('🔐 كود المالك خطأ');
          return;
        }
        window.currentUser = { name: u.value || 'المالك', uid: 'owner_1', points: 9999 };
        localStorage.setItem('lastUser', JSON.stringify(window.currentUser));
        if(typeof showToast === 'function') showToast('✅ أهلاً بك يا مالك');
        if(typeof showScreen === 'function') showScreen('homeScreen');
        return;
      }
      
      if (oldLogin) oldLogin();
    };
  }, 1000);
});
// ═══════════════════════════════════════════════════════
// 🔒 إصلاح تسجيل دخول المالك + الإيموشن
// ═══════════════════════════════════════════════════════

(function(){
  // 1. قفل دخول المالك
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(typeof window.login !== 'function') return;
      var origLogin = window.login;
      
      window.login = async function(){
        var ownerCodeEl = document.getElementById('ownerCodeInput');
        var ownerCode = ownerCodeEl ? ownerCodeEl.value : '';
        
        // لو إحنا في وضع المالك
        if(window.currentRole === 'owner') {
          // كود المالك ثابت ومحمي
          if(ownerCode !== '135790') {
            if(typeof showToast === 'function') showToast('🔐 كود المالك خطأ!');
            return;
          }
        }
        
        // نكمل الدالة الأصلية
        return origLogin.apply(this, arguments);
      };
      console.log('✅ Admin Login Secured');
    }, 2000);
  });

  // 2. إصلاح مكان الإيموشن في الأخبار
  window.addEventListener('load', function(){
    // تغيير ستايل قائمة الإيموشن عشان تظهر جوه الصفحة مش فوق
    var style = document.createElement('style');
    style.textContent = 
      '#emojiPicker { position: fixed !important; top: auto !important; bottom: 120px !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 99999 !important; }' +
      '#emojiPicker::before { content: ""; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #fff; }';
    document.head.appendChild(style);
    console.log('✅ Emoji Fixed');
  });
})();
// ═══════════════════════════════════════════════════════
// 🎨 إصلاح ألوان الرسم + 🔊 نطق جدول الضرب بالعربي
// ═══════════════════════════════════════════════════════

(function(){
  // 1. إصلاح الرسم والألوان
  window.addEventListener('load', function(){
    setTimeout(function(){
      var canvas = document.getElementById('fullDrawingCanvas');
      if(canvas){
        var ctx = canvas.getContext('2d');
        
        // لما الطالب يختار لون، بنغيره في الـ context
        var colorInputs = document.querySelectorAll('input[type="color"], [onclick*="#"], [onclick*="drawingSetColor"]');
        colorInputs.forEach(function(input){
          input.addEventListener('click', function(e){
            var color = this.value || this.getAttribute('data-color');
            if(color) ctx.strokeStyle = color;
          });
          input.addEventListener('change', function(e){
            if(this.value) ctx.strokeStyle = this.value;
          });
        });

        // إصلاح زراير الألوان لو كانت أزرار عادية
        var colorBtns = document.querySelectorAll('button[onclick*="drawingSetColor"], button[style*="background"]');
        colorBtns.forEach(function(btn){
          btn.addEventListener('click', function(){
            var bg = this.style.backgroundColor;
            if(bg) {
              // تحويل rgb إلى hex
              var match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
              if(match){
                var hex = "#" + ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1);
                ctx.strokeStyle = hex;
              }
            }
          });
        });
      }
    }, 2000);
  });

  // 2. إجبار النطق بالعربي في جدول الضرب
  var origSpeak = window.speakText;
  window.speakText = function(text){
    if(!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    
    // نجبر الصوت يكون عربي
    utterance.lang = 'ar-SA'; // أو ar-EG
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    // نجيب صوت عربي لو موجود
    var voices = window.speechSynthesis.getVoices();
    var arabicVoice = voices.find(function(v){ return v.lang.includes('ar'); });
    if(arabicVoice) utterance.voice = arabicVoice;
    
    window.speechSynthesis.speak(utterance);
  };
  
  console.log('✅ Drawing Colors & Arabic Audio Fixed');
})();
