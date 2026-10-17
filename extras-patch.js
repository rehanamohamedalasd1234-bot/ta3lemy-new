// ═══════════════════════════════════════════════════════
// extras-patch.js — إصلاحات سريعة (المرحلة 1)
// ═══════════════════════════════════════════════════════

(function(){
  'use strict';
  console.log('🔧 Loading extras-patch...');

  // ═══ 1. تغيير اسم "الرسم" → "إبداع" ═══
  function renameDrawingToIbdaa(){
    document.querySelectorAll('.tool-btn').forEach(function(btn){
      var onclick = btn.getAttribute('onclick') || '';
      var label = btn.querySelector('.tool-label');
      if((onclick.indexOf('openDrawing') > -1) && label && label.textContent === 'رسم'){
        label.textContent = 'إبداع';
        var icon = btn.querySelector('.tool-icon');
        if(icon) icon.textContent = '🎨';
      }
    });
    var drawingTitle = document.querySelector('#drawingScreen .logo span');
    if(drawingTitle && drawingTitle.textContent.indexOf('الرسم') > -1){
      drawingTitle.textContent = '🎨 إبداع';
    }
  }

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
