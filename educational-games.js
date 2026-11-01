// educational-games.js - الألعاب التعليمية التفاعلية لمنصة الأستاذ حافظ
(function() {
  'use strict';

  // Sound effect generator using Web Audio API (offline, zero-asset)
  var audioCtx = null;
  function playSound(type) {
    try {
      if (!audioCtx) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'horn') {
        // Bus beep beep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        setTimeout(function() {
          try {
            if (!audioCtx) return;
            var o2 = audioCtx.createOscillator();
            var g2 = audioCtx.createGain();
            o2.type = 'triangle';
            o2.connect(g2);
            g2.connect(audioCtx.destination);
            var now2 = audioCtx.currentTime;
            o2.frequency.setValueAtTime(440, now2);
            g2.gain.setValueAtTime(0.25, now2);
            g2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.18);
            o2.start(now2);
            o2.stop(now2 + 0.18);
          } catch(e) {}
        }, 130);
      } else if (type === 'win') {
        // Arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach(function(freq, index) {
          var o = audioCtx.createOscillator();
          var g = audioCtx.createGain();
          o.connect(g);
          g.connect(audioCtx.destination);
          o.frequency.setValueAtTime(freq, now + (index * 0.1));
          g.gain.setValueAtTime(0.25, now + (index * 0.1));
          g.gain.exponentialRampToValueAtTime(0.01, now + (index * 0.1) + 0.25);
          o.start(now + (index * 0.1));
          o.stop(now + (index * 0.1) + 0.25);
        });
      }
    } catch(e) {
      console.warn('Audio sound error:', e);
    }
  }

  function awardPoints(pts) {
    if (window.currentUser) {
      window.currentUser.points = (window.currentUser.points || 0) + pts;
      try {
        var el = document.getElementById('userPoints');
        if (el) el.textContent = window.currentUser.points + ' ⭐️';
        if (typeof window.saveUserData === 'function') window.saveUserData();
      } catch(e) {}
    }
  }

  // ==========================================
  // --- 1. Speed Math Game ---
  // ==========================================
  var mathTimer = null;
  var mathScore = 0;
  var mathStreak = 0;
  var mathTimeLeft = 30;
  var currentQuestion = null;

  function generateMathQuestion(level) {
    var ops = ['+', '-'];
    if (level >= 2) ops.push('×');
    var op = ops[Math.floor(Math.random() * ops.length)];
    var a, b, ans;

    if (op === '+') {
      var max = level === 1 ? 20 : (level === 2 ? 50 : 100);
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * max) + 1;
      ans = a + b;
    } else if (op === '-') {
      var maxMinus = level === 1 ? 20 : (level === 2 ? 50 : 100);
      a = Math.floor(Math.random() * maxMinus) + 1;
      b = Math.floor(Math.random() * a) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
    }

    var options = [ans];
    while (options.length < 4) {
      var offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      var fake = ans + offset;
      if (fake >= 0 && options.indexOf(fake) === -1) {
        options.push(fake);
      }
    }
    options.sort(function() { return 0.5 - Math.random(); });

    return {
      text: a + ' ' + (op === '×' ? '×' : op) + ' ' + b + ' = ؟',
      ans: ans,
      options: options
    };
  }

  function startMathGame(level) {
    level = level || 1;
    mathScore = 0;
    mathStreak = 0;
    mathTimeLeft = 30;
    var container = document.getElementById('gamesContent');
    if (!container) return;

    renderMathGameUI(container, level);
    nextMathQuestion(container, level);

    clearInterval(mathTimer);
    mathTimer = setInterval(function() {
      mathTimeLeft--;
      var timerEl = document.getElementById('mathTimer');
      if (timerEl) timerEl.textContent = mathTimeLeft + ' ث';
      if (mathTimeLeft <= 0) {
        clearInterval(mathTimer);
        endMathGame(container, level);
      }
    }, 1000);
  }

  function renderMathGameUI(container, level) {
    container.innerHTML =
      '<div style="background:#fff;border-radius:18px;padding:20px;box-shadow:0 4px 15px rgba(0,0,0,0.08);text-align:center;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;font-size:15px;font-weight:bold;color:#2E7D32;">' +
          '<div style="background:#E8F5E9;padding:6px 12px;border-radius:12px;">⏳ الوقت: <span id="mathTimer">30 ث</span></div>' +
          '<div style="background:#FFF9C4;color:#F57F17;padding:6px 12px;border-radius:12px;">🔥 المتتالي: <span id="mathStreak">0</span></div>' +
          '<div style="background:#E3F2FD;color:#1565C0;padding:6px 12px;border-radius:12px;">⭐️ النقاط: <span id="mathScore">0</span></div>' +
        '</div>' +
        '<div id="mathCard" style="background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff;border-radius:16px;padding:28px 15px;font-size:32px;font-weight:bold;margin-bottom:20px;letter-spacing:1px;box-shadow:0 6px 16px rgba(46,125,50,0.3);">' +
          '...' +
        '</div>' +
        '<div id="mathOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
        '</div>' +
        '<div style="margin-top:20px;">' +
          '<button id="btnExitMath" style="background:#ECEFF1;color:#546E7A;border:none;padding:8px 20px;border-radius:12px;font-size:14px;font-weight:bold;cursor:pointer;">إلغاء والعودة للقائمة</button>' +
        '</div>' +
      '</div>';

    document.getElementById('btnExitMath').onclick = function() {
      clearInterval(mathTimer);
      openEducationalGames();
    };
  }

  function nextMathQuestion(container, level) {
    currentQuestion = generateMathQuestion(level);
    var card = document.getElementById('mathCard');
    var optsContainer = document.getElementById('mathOptions');
    if (!card || !optsContainer) return;

    card.textContent = currentQuestion.text;
    optsContainer.innerHTML = '';

    currentQuestion.options.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.textContent = opt;
      btn.style.cssText = 'background:#fff;border:2px solid #C8E6C9;color:#2E7D32;font-size:24px;font-weight:bold;padding:16px 10px;border-radius:14px;cursor:pointer;transition:all 0.15s;box-shadow:0 2px 6px rgba(0,0,0,0.05);';
      btn.onmouseover = function() { btn.style.borderColor = '#4CAF50'; btn.style.background = '#F1F8E9'; };
      btn.onmouseout = function() { btn.style.borderColor = '#C8E6C9'; btn.style.background = '#fff'; };
      btn.onclick = function() {
        handleMathAnswer(opt, btn, container, level);
      };
      optsContainer.appendChild(btn);
    });
  }

  function handleMathAnswer(selected, btn, container, level) {
    var isCorrect = selected === currentQuestion.ans;
    var allBtns = container.querySelectorAll('#mathOptions button');
    allBtns.forEach(function(b) { b.disabled = true; });

    if (isCorrect) {
      playSound('correct');
      btn.style.background = '#4CAF50';
      btn.style.color = '#fff';
      btn.style.borderColor = '#2E7D32';
      mathScore += 10 + (mathStreak * 2);
      mathStreak++;
      awardPoints(5);
    } else {
      playSound('wrong');
      btn.style.background = '#F44336';
      btn.style.color = '#fff';
      btn.style.borderColor = '#D32F2F';
      mathStreak = 0;
      allBtns.forEach(function(b) {
        if (Number(b.textContent) === currentQuestion.ans) {
          b.style.background = '#81C784';
          b.style.color = '#fff';
        }
      });
    }

    var scoreEl = document.getElementById('mathScore');
    var streakEl = document.getElementById('mathStreak');
    if (scoreEl) scoreEl.textContent = mathScore;
    if (streakEl) streakEl.textContent = mathStreak;

    setTimeout(function() {
      if (mathTimeLeft > 0) {
        nextMathQuestion(container, level);
      }
    }, 450);
  }

  function endMathGame(container, level) {
    playSound('win');
    var best = Number(localStorage.getItem('math_best_score_' + level) || 0);
    var isNewBest = mathScore > best;
    if (isNewBest) {
      localStorage.setItem('math_best_score_' + level, mathScore);
      best = mathScore;
    }

    container.innerHTML =
      '<div style="background:#fff;border-radius:20px;padding:30px 20px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,0.1);">' +
        '<div style="font-size:55px;margin-bottom:10px;">🏆</div>' +
        '<h2 style="color:#2E7D32;margin-bottom:8px;">انتهى الوقت يا بطل!</h2>' +
        '<p style="color:#666;font-size:15px;margin-bottom:20px;">لقد قمت بعمل رائع في تحدي الحساب الذكي.</p>' +
        '<div style="display:flex;justify-content:center;gap:20px;margin-bottom:25px;">' +
          '<div style="background:#E8F5E9;padding:12px 24px;border-radius:14px;border:2px solid #A5D6A7;">' +
            '<div style="font-size:13px;color:#2E7D32;">نقاط هذه الجولة</div>' +
            '<div style="font-size:26px;font-weight:bold;color:#1B5E20;">' + mathScore + '</div>' +
          '</div>' +
          '<div style="background:#FFF8E1;padding:12px 24px;border-radius:14px;border:2px solid #FFE082;">' +
            '<div style="font-size:13px;color:#F57F17;">أعلى رقم قياسي</div>' +
            '<div style="font-size:26px;font-weight:bold;color:#E65100;">' + best + (isNewBest ? ' 🔥 جديد' : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">' +
          '<button id="btnPlayAgain" style="background:#2E7D32;color:#fff;border:none;padding:14px;border-radius:14px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 4px 10px rgba(46,125,50,0.3);">🔄 العب مرة أخرى</button>' +
          '<button id="btnBackMenu" style="background:#ECEFF1;color:#37474F;border:none;padding:12px;border-radius:14px;font-size:15px;font-weight:bold;cursor:pointer;">🏠 قائمة الألعاب</button>' +
        '</div>' +
      '</div>';

    document.getElementById('btnPlayAgain').onclick = function() {
      startMathGame(level);
    };
    document.getElementById('btnBackMenu').onclick = function() {
      openEducationalGames();
    };
  }

  // ==========================================
  // --- 2. Memory Match Cards Game ---
  // ==========================================
  function startMemoryGame() {
    var container = document.getElementById('gamesContent');
    if (!container) return;

    var pairs = [
      { id: 1, text: '4 + 4' }, { id: 1, text: '8' },
      { id: 2, text: '5 × 3' }, { id: 2, text: '15' },
      { id: 3, text: '20 - 2' }, { id: 3, text: '18' },
      { id: 4, text: '7 + 6' }, { id: 4, text: '13' },
      { id: 5, text: '9 × 2' }, { id: 5, text: '18' },
      { id: 6, text: '10 + 10' }, { id: 6, text: '20' }
    ];
    var cards = pairs.sort(function() { return 0.5 - Math.random(); });

    container.innerHTML =
      '<div style="background:#fff;border-radius:18px;padding:20px;box-shadow:0 4px 15px rgba(0,0,0,0.08);text-align:center;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;font-weight:bold;color:#1565C0;">' +
          '<div style="background:#E3F2FD;padding:6px 12px;border-radius:12px;">🧠 لعبة مطابقة البطاقات</div>' +
          '<div style="background:#FFF3E0;color:#E65100;padding:6px 12px;border-radius:12px;">محاولات: <span id="memMoves">0</span></div>' +
        '</div>' +
        '<div id="memGrid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:20px;">' +
        '</div>' +
        '<button id="btnExitMem" style="background:#ECEFF1;color:#546E7A;border:none;padding:8px 20px;border-radius:12px;font-size:14px;font-weight:bold;cursor:pointer;">عودة للألعاب</button>' +
      '</div>';

    var grid = document.getElementById('memGrid');
    var flipped = [];
    var matchedCount = 0;
    var moves = 0;

    cards.forEach(function(c) {
      var cardEl = document.createElement('div');
      cardEl.className = 'mem-card';
      cardEl.style.cssText = 'height:85px;background:linear-gradient(135deg,#1976D2,#42A5F5);color:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;cursor:pointer;transition:transform 0.2s;box-shadow:0 3px 8px rgba(0,0,0,0.1);user-select:none;';
      cardEl.innerHTML = '<span style="font-size:24px;">❓</span>';

      cardEl.onclick = function() {
        if (flipped.length >= 2 || cardEl.dataset.matched === 'true' || cardEl.dataset.flipped === 'true') return;
        playSound('click');
        cardEl.style.background = '#FFF';
        cardEl.style.color = '#1976D2';
        cardEl.style.border = '2px solid #1976D2';
        cardEl.innerHTML = c.text;
        cardEl.dataset.flipped = 'true';
        flipped.push({ el: cardEl, data: c });

        if (flipped.length === 2) {
          moves++;
          document.getElementById('memMoves').textContent = moves;
          if (flipped[0].data.id === flipped[1].data.id && flipped[0].el !== flipped[1].el) {
            playSound('correct');
            flipped[0].el.dataset.matched = 'true';
            flipped[1].el.dataset.matched = 'true';
            flipped[0].el.style.background = '#E8F5E9';
            flipped[0].el.style.borderColor = '#4CAF50';
            flipped[0].el.style.color = '#2E7D32';
            flipped[1].el.style.background = '#E8F5E9';
            flipped[1].el.style.borderColor = '#4CAF50';
            flipped[1].el.style.color = '#2E7D32';
            matchedCount += 2;
            awardPoints(10);
            flipped = [];
            if (matchedCount === cards.length) {
              setTimeout(function() {
                playSound('win');
                container.innerHTML =
                  '<div style="background:#fff;border-radius:20px;padding:30px 20px;text-align:center;">' +
                    '<div style="font-size:55px;margin-bottom:10px;">🎉</div>' +
                    '<h2 style="color:#1565C0;">رائع جداً! أنهيت اللعبة!</h2>' +
                    '<p style="color:#555;">عدد المحاولات: ' + moves + '</p>' +
                    '<button id="btnPlayMemAgain" style="background:#1976D2;color:#fff;border:none;padding:12px 24px;border-radius:12px;font-weight:bold;cursor:pointer;margin:10px 5px;">🔄 العب مجدداً</button>' +
                    '<button id="btnBackGames" style="background:#ECEFF1;color:#333;border:none;padding:12px 24px;border-radius:12px;font-weight:bold;cursor:pointer;margin:10px 5px;">قائمة الألعاب</button>' +
                  '</div>';
                document.getElementById('btnPlayMemAgain').onclick = startMemoryGame;
                document.getElementById('btnBackGames').onclick = openEducationalGames;
              }, 500);
            }
          } else {
            playSound('wrong');
            setTimeout(function() {
              flipped.forEach(function(f) {
                f.el.style.background = 'linear-gradient(135deg,#1976D2,#42A5F5)';
                f.el.style.color = '#fff';
                f.el.style.border = 'none';
                f.el.innerHTML = '<span style="font-size:24px;">❓</span>';
                delete f.el.dataset.flipped;
              });
              flipped = [];
            }, 800);
          }
        }
      };
      grid.appendChild(cardEl);
    });

    document.getElementById('btnExitMem').onclick = openEducationalGames;
  }

  // =========================================================================
  // --- 3. أتوبيس المعرفة المدرسي (School Bus: KG1 -> 3rd Secondary) ---
  // =========================================================================
  var BUS_STATIONS = [
    {
      id: 'kg1',
      name: 'روضة أطفال 1 (KG1)',
      stage: 'مرحلة رياض الأطفال',
      bgGrad: 'linear-gradient(135deg, #FF6B6B, #FFA07A)',
      icon: '🐣',
      questions: [
        { q: 'ما هو الحرف الأول في كلمة "أَسَد"؟', options: ['أ', 'ب', 'ت', 'ج'], answer: 0, hint: 'يبدأ بهمزة جميلة!' },
        { q: 'كم عدد التفاحات هنا: 🍎 🍎؟', options: ['1', '2', '3', '4'], answer: 1, hint: 'اثنتان فقط!' },
        { q: 'ما هو لون الموز الناضج؟', options: ['أحمر', 'أصفر', 'أزرق', 'أسود'], answer: 1, hint: 'لونه مشرق كالشمس!' }
      ]
    },
    {
      id: 'kg2',
      name: 'روضة أطفال 2 (KG2)',
      stage: 'مرحلة رياض الأطفال',
      bgGrad: 'linear-gradient(135deg, #FF8E53, #FFB88C)',
      icon: '🐥',
      questions: [
        { q: 'ما هو ناتج: 2 + 1 = ؟', options: ['2', '3', '4', '5'], answer: 1, hint: 'اجمع تفاحتين مع تفاحة' },
        { q: 'حيوان أليف يقول "مواء":', options: ['الكلب', 'القطة', 'الحصان', 'الفيل'], answer: 1, hint: 'يحب اللبن واللعب بالصوف' },
        { q: 'حرف الباء يكتب بنقطة:', options: ['واحدة تحته', 'واحدة فوقه', 'نقطتان فوقه', 'بدون نقاط'], answer: 0, hint: 'نقطة واحدة بالأسفل' }
      ]
    },
    {
      id: 'primary1',
      name: 'الأول الابتدائي',
      stage: 'المرحلة الابتدائية',
      bgGrad: 'linear-gradient(135deg, #FFD166, #FFE699)',
      icon: '🎒',
      questions: [
        { q: 'أي من الكلمات التالية تحتوي على "مد بالألف"؟', options: ['بَاب', 'قَلَم', 'كُرَة', 'سَمَك'], answer: 0, hint: 'بـ...ـاب تمد فيها صوت الفتحة' },
        { q: 'ناتج جمع: 5 + 4 = ؟', options: ['8', '9', '10', '7'], answer: 1, hint: 'خمسة وأربعة يساوي تسعة' },
        { q: 'نستخدم حاسة البصر بواسطة:', options: ['الأنف', 'العين', 'الأذن', 'اللسان'], answer: 1, hint: 'نرى بها كل جميل حولنا' }
      ]
    },
    {
      id: 'primary2',
      name: 'الثاني الابتدائي',
      stage: 'المرحلة الابتدائية',
      bgGrad: 'linear-gradient(135deg, #06D6A0, #70E4C8)',
      icon: '✏️',
      questions: [
        { q: 'ما هو ناتج: 12 + 15 = ؟', options: ['25', '27', '28', '29'], answer: 1, hint: 'اجمع الآحاد (2+5) ثم العشرات (1+1)' },
        { q: 'كلمة "الشَّمْس" اللام فيها هي لام:', options: ['شمسية لا تُنطق', 'قمرية تُنطق', 'ساكنة ظاهرة', 'أصلية'], answer: 0, hint: 'تُكتب ولا تُنطق والحرف بعدها مشدد' },
        { q: 'حيوان يعيش في الماء ويتنفس بالخياشيم:', options: ['الأسد', 'السمكة', 'الصقر', 'الجمل'], answer: 1, hint: 'تسبح بزعانفها في البحار والأنهار' }
      ]
    },
    {
      id: 'primary3',
      name: 'الثالث الابتدائي',
      stage: 'المرحلة الابتدائية',
      bgGrad: 'linear-gradient(135deg, #118AB2, #48CAE4)',
      icon: '📐',
      questions: [
        { q: 'ما هو ناتج عملية الضرب: 4 × 6 = ؟', options: ['20', '24', '28', '32'], answer: 1, hint: 'أربعة مكررة ست مرات' },
        { q: 'أي مما يلي يُعد من مصادر الطاقة المتجددة الطبيعية؟', options: ['الشمس', 'الفحم', 'البترول', 'الغاز الطبيعي'], answer: 0, hint: 'نجمنا اللامع المتجدد دائماً' },
        { q: 'الجملة الاسمية تبدأ بـ:', options: ['فعل', 'اسم', 'حرف', 'ضمير غائب فقط'], answer: 1, hint: 'تبدأ باسم ويسمى المبتدأ' }
      ]
    },
    {
      id: 'primary4',
      name: 'الرابع الابتدائي',
      stage: 'المرحلة الابتدائية',
      bgGrad: 'linear-gradient(135deg, #073B4C, #1E6091)',
      icon: '🌍',
      questions: [
        { q: 'المحيط المحيط بالشكل المستطيل الذي طوله 6 سم وعرضه 4 سم هو:', options: ['10 سم', '20 سم', '24 سم²', '18 سم'], answer: 1, hint: '(الطول + العرض) × 2 = (6 + 4) × 2' },
        { q: 'تكيف الخفافيش للنوم مقلوبة والنشاط ليلاً يُعد تكيفاً:', options: ['تركيبياً', 'سلوكياً', 'مناخياً', 'مؤقتاً'], answer: 1, hint: 'سلوك تتبعه الحيوانات للتأقلم مع بيئتها' },
        { q: 'تقع جمهورية مصر العربية في الركن الشمالي الشرقي لقارة:', options: ['آسيا', 'أفريقيا', 'أوروبا', 'أمريكا الجنوبية'], answer: 1, hint: 'قارتنا السمراء الحبيبة' }
      ]
    },
    {
      id: 'primary5',
      name: 'الخامس الابتدائي',
      stage: 'المرحلة الابتدائية',
      bgGrad: 'linear-gradient(135deg, #7209B7, #B5179E)',
      icon: '🔬',
      questions: [
        { q: 'الكسر المكافئ للكسر 1/2 هو:', options: ['2/3', '4/8', '3/5', '1/4'], answer: 1, hint: 'اضرب البسط والمقام في 4' },
        { q: 'عضو الجهاز الدوري الذي يضخ الدم لجميع أجزاء الجسم هو:', options: ['المعدة', 'القلب', 'الرئة', 'الكبد'], answer: 1, hint: 'عضلة حيوية تنبض في الصدر باستمرار' },
        { q: 'الملك مينا (نعرمر) وحّد قطري مصر عام:', options: ['3200 ق.م', '2500 ق.م', '1200 م', '300 ق.م'], answer: 0, hint: 'عام 3200 قبل الميلاد' }
      ]
    },
    {
      id: 'primary6',
      name: 'السادس الابتدائي',
      stage: 'المرحلة الابتدائية',
      bgGrad: 'linear-gradient(135deg, #4361EE, #4CC9F0)',
      icon: '🔭',
      questions: [
        { q: 'وحدة بناء الكائن الحي الأساسية هي:', options: ['الذرة', 'الخلية', 'النسيج', 'العضو'], answer: 1, hint: 'الوحدة البنائية والوظيفية لجميع المخلوقات' },
        { q: 'إذا كانت النسبة بين عمر أحمد وعمر محمد هي 2 : 3 وكان عمر أحمد 10 سنوات، فعمر محمد هو:', options: ['12 سنة', '15 سنة', '18 سنة', '20 سنة'], answer: 1, hint: '10 ÷ 2 = 5، إذن 5 × 3 = 15' },
        { q: 'تنصب "الأسماء الخمسة" (أبوك، أخوك، حمو، فو، ذو) وعلامة نصبها هي:', options: ['الفتحة', 'الألف', 'الياء', 'الواو'], answer: 1, hint: 'تُرفع بالواو وتنصب بالألف وتجر بالياء' }
      ]
    },
    {
      id: 'prep1',
      name: 'الأول الإعدادي',
      stage: 'المرحلة الإعدادية',
      bgGrad: 'linear-gradient(135deg, #2A9D8F, #264653)',
      icon: '🧭',
      questions: [
        { q: 'مجموع قياسات الزوايا الداخلية لأي مثلث يساوي:', options: ['90°', '180°', '360°', '270°'], answer: 1, hint: 'نصف زوايا الشكل الرباعي = 180 درجة' },
        { q: 'تتحول الطاقة الميكانيكية إلى طاقة كهربية في جهاز:', options: ['المروحة', 'الدينامو (المولد)', 'المصباح', 'المدفأة'], answer: 1, hint: 'المولد الكهربي يحول حركة الدوران لكهرباء' },
        { q: 'الهمزة في كلمة "انتصار" هي همزة:', options: ['قطع لأنها اسم', 'وصل لأنها مصدر خماسي', 'قطع لأنها فعل ماض', 'متطرفة'], answer: 1, hint: 'مصدر الفعل الخماسي (انتصر) همزته وصل' }
      ]
    },
    {
      id: 'prep2',
      name: 'الثاني الإعدادي',
      stage: 'المرحلة الإعدادية',
      bgGrad: 'linear-gradient(135deg, #E76F51, #F4A261)',
      icon: '⚡',
      questions: [
        { q: 'العنصر الذي عدده الذري 11 وتوزيعه الإلكتروني (2, 8, 1) هو:', options: ['الصوديوم (Na)', 'الكلور (Cl)', 'النيون (Ne)', 'المغنيسيوم (Mg)'], answer: 0, hint: 'فلز نشط جداً رمزه Na' },
        { q: 'في المثلث القائم الزاوية، مربع طول الوتر يساوي:', options: ['مجموع مربعي طولي ضلعي القائمة', 'ضعف طول الضلع المجاور', 'حاصل ضرب الضلعين', 'الفرق بين مربعي الضلعين'], answer: 0, hint: 'نظرية فيثاغورس الشهيرة' },
        { q: 'أكبر هضاب الوطن العربي مساحة هي:', options: ['هضبة نجد', 'هضبة أفريقيا الشمالية (الصحراء الكبرى)', 'هضبة الشطوط', 'هضبة حضرموت'], answer: 1, hint: 'تمتد عبر شمال أفريقيا من البحر الأحمر للمحيط الأطلسي' }
      ]
    },
    {
      id: 'prep3',
      name: 'الثالث الإعدادي (الشهادة)',
      stage: 'المرحلة الإعدادية',
      bgGrad: 'linear-gradient(135deg, #8338EC, #3A86FF)',
      icon: '📜',
      questions: [
        { q: 'حاصل ضرب السرعة في الزمن (ع × ز) يعطي:', options: ['العجلة', 'المسافة (ف)', 'القوة', 'الشغل'], answer: 1, hint: 'المسافة = السرعة × الزمن' },
        { q: 'الصورة المتكونة لجسم يوضع عند مركز تكور مرآة مقعرة تكون:', options: ['حقيقية مقلوبة مساوية للجسم', 'تقديرية معتدلة مكبرة', 'حقيقية مصغرة جداً', 'حقيقية مقلوبة مكبرة'], answer: 0, hint: 'تقع عند م وتكون مقلوبة ومساوية تماماً' },
        { q: 'في أسلوب المدح: "نعمَ الخلقُ الصدقُ"، المخصوص بالمدح هو:', options: ['نعم', 'الخلق', 'الصدق', 'ضمير مستتر'], answer: 2, hint: 'الاسم الممدوح الذي يعرب مبتدأ مؤخر' }
      ]
    },
    {
      id: 'sec1',
      name: 'الأول الثانوي',
      stage: 'المرحلة الثانوية',
      bgGrad: 'linear-gradient(135deg, #D90429, #EF233C)',
      icon: '🧪',
      questions: [
        { q: 'صيغة أبعاد كمية التحرك (Linear Momentum = m × v) هي:', options: ['M L T⁻¹', 'M L² T⁻²', 'M L T⁻²', 'M L⁻¹ T'], answer: 0, hint: 'كتلة (M) × سرعة (L T⁻¹)' },
        { q: 'عدد جزيئات مول واحد من أي مادة يساوي عدد أفوجادرو وقيمته:', options: ['3 × 10⁸', '6.02 × 10²³', '9.8 × 10²', '1.6 × 10⁻¹⁹'], answer: 1, hint: '6.02 في 10 أس 23 جزيء أو ذرة' },
        { q: 'العضية المسؤولة عن إنتاج الطاقة (ATP) في الخلية وتعرف ببيت الطاقة:', options: ['الريبوسومات', 'الميتوكوندريا', 'جهاز جولجي', 'الليسوسومات'], answer: 1, hint: 'تجري بها دورة كريبس وأكسدة الجلوكوز' }
      ]
    },
    {
      id: 'sec2',
      name: 'الثاني الثانوي',
      stage: 'المرحلة الثانوية',
      bgGrad: 'linear-gradient(135deg, #5A189A, #7B2CBF)',
      icon: '⚛️',
      questions: [
        { q: 'النسبة بين جيب زاوية السقوط إلى جيب زاوية الانكسار لوسطين تعبر عن:', options: ['معامل الانكسار النسبي (قانون سنل)', 'سرعة الضوء المطلقة', 'معامل المرونة', 'الضغط الهيدروستاتيكي'], answer: 0, hint: 'sin Φ / sin θ = n₁₂' },
        { q: 'تفاعل البناء الضوئي الضوئي يتم في:', options: ['الجرانا في البلاستيدة الخضراء', 'الستروما', 'الميتوكوندريا', 'السيتوبلازم'], answer: 0, hint: 'أقراص الجرانا حيث يوجد الكلوروفيل النشط' },
        { q: 'مبدأ البناء التصاعدي ينص على أن الإلكترونات تملأ:', options: ['مستويات الطاقة الفرعية الأقل طاقة أولاً', 'الأعلى طاقة أولاً', 'فرادى أولاً ثم تزدوج', 'المستوى الرئيسي الأخير أولاً'], answer: 0, hint: 'تملأ تحت المستويات ذات الطاقة الأقل (مثل 1s ثم 2s)' }
      ]
    },
    {
      id: 'sec3',
      name: 'الثالث الثانوي (المحطة الختامية 🎓)',
      stage: 'المرحلة الثانوية العامة',
      bgGrad: 'linear-gradient(135deg, #FFB703, #FB8500)',
      icon: '🏆',
      questions: [
        { q: 'في الدائرة الكهربية، إذا زادت مقاومة موصل للأضعاف مع ثبوت فرق الجهد، فإن شدة التيار:', options: ['تتضاعف', 'تقل إلى النصف', 'تظل ثابتة', 'تزداد أربعة أضعاف'], answer: 1, hint: 'قانون أوم: I = V / R (تناسب عكسي)' },
        { q: 'العنصر الانتقالي الذي يمتلك أعلى حالة تأكسد (+7) في السلسلة الانتقالية الأولى هو:', options: ['الحديد Fe', 'المنجنيز Mn', 'الكروم Cr', 'التيتانيوم Ti'], answer: 1, hint: 'توزيعه [Ar] 4s² 3d⁵ ويفقد جميع الإلكترونات' },
        { q: 'تكامل الدالة: ∫ e^(2x) dx يساوي:', options: ['2 e^(2x) + c', '(1/2) e^(2x) + c', 'e^(2x) + c', '(1/4) e^(2x) + c'], answer: 1, hint: 'مشتقة الأس 2 فنقسم على المعامل 1/2' }
      ]
    }
  ];

  var currentBusStationIndex = 0;
  var currentBusQuestionIndex = 0;
  var busTotalStars = 0;

  function startBusGame(resumeStation) {
    if (typeof resumeStation === 'number' && resumeStation >= 0 && resumeStation < BUS_STATIONS.length) {
      currentBusStationIndex = resumeStation;
    } else {
      var saved = localStorage.getItem('bus_game_saved_station');
      currentBusStationIndex = saved !== null ? parseInt(saved, 10) : 0;
      if (isNaN(currentBusStationIndex) || currentBusStationIndex >= BUS_STATIONS.length) {
        currentBusStationIndex = 0;
      }
    }
    currentBusQuestionIndex = 0;
    playSound('horn');

    var container = document.getElementById('gamesContent');
    if (!container) return;

    renderBusGameLayout(container);
    loadBusStation(currentBusStationIndex, container);
  }

  function renderBusGameLayout(container) {
    container.innerHTML =
      '<div id="busGameWrapper" style="font-family:inherit;direction:rtl;max-width:700px;margin:0 auto;position:relative;">' +
        // Top HUD Header
        '<div style="background:#fff;border-radius:18px;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 15px rgba(0,0,0,0.06);margin-bottom:14px;border:2px solid #FFE082;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="font-size:24px;">🚌</span>' +
            '<div>' +
              '<div style="font-size:11px;color:#888;">المغامرة التعليمية</div>' +
              '<div style="font-size:14px;font-weight:bold;color:#F57F17;" id="busStationBadge">محطة 1 / 14</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<button id="btnHonk" title="زمور الأتوبيس" style="background:#FFF8E1;border:1px solid #FFD54F;padding:6px 10px;border-radius:10px;cursor:pointer;font-size:16px;">📯 بيب بيب</button>' +
            '<button id="btnExitBus" style="background:#ECEFF1;color:#546E7A;border:none;padding:6px 12px;border-radius:10px;font-size:13px;font-weight:bold;cursor:pointer;">خروج ✕</button>' +
          '</div>' +
        '</div>' +

        // Visual Road & Stations map track
        '<div style="background:linear-gradient(180deg,#64B5F6 0%,#90CAF9 60%,#4CAF50 60%,#388E3C 100%);border-radius:18px;padding:15px;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.12);margin-bottom:16px;">' +
          // Cloud deco
          '<div style="position:absolute;top:8px;left:20px;font-size:20px;opacity:0.8;">☁️</div>' +
          '<div style="position:absolute;top:15px;right:40px;font-size:24px;opacity:0.9;">☀️</div>' +
          // Road Strip
          '<div style="background:#37474F;height:34px;border-radius:8px;margin-top:28px;position:relative;display:flex;align-items:center;box-shadow:inset 0 2px 4px rgba(0,0,0,0.4);border-top:2px solid #FFEB3B;border-bottom:2px solid #FFEB3B;">' +
            '<div style="position:absolute;left:0;right:0;top:50%;height:2px;border-top:2px dashed #FFF;opacity:0.75;"></div>' +
            // Moving Bus
            '<div id="animatedBus" style="position:absolute;right:10px;transition:right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);font-size:26px;filter:drop-shadow(0 3px 4px rgba(0,0,0,0.4));user-select:none;">' +
              '🚌' +
            '</div>' +
          '</div>' +
          // Progress Dots bar
          '<div id="busStationsTrack" style="display:flex;justify-content:space-between;margin-top:10px;padding:0 4px;"></div>' +
        '</div>' +

        // Station Info & Challenge Card
        '<div id="busStationArea"></div>' +
      '</div>';

    document.getElementById('btnHonk').onclick = function() {
      playSound('horn');
      var bus = document.getElementById('animatedBus');
      if (bus) {
        bus.style.transform = 'scale(1.2) translateY(-4px)';
        setTimeout(function() { bus.style.transform = 'scale(1) translateY(0)'; }, 200);
      }
    };

    document.getElementById('btnExitBus').onclick = function() {
      openEducationalGames();
    };
  }

  function renderStationDots(activeIdx) {
    var track = document.getElementById('busStationsTrack');
    if (!track) return;
    track.innerHTML = '';

    BUS_STATIONS.forEach(function(st, idx) {
      var dot = document.createElement('div');
      dot.title = st.name;
      var isPassed = idx < activeIdx;
      var isCurrent = idx === activeIdx;

      dot.style.cssText = 'width:12px;height:12px;border-radius:50%;border:2px solid #fff;transition:all 0.3s;cursor:pointer;position:relative;' +
        (isCurrent ? 'background:#FFEB3B;transform:scale(1.4);box-shadow:0 0 8px #FFEB3B;' : (isPassed ? 'background:#4CAF50;' : 'background:rgba(255,255,255,0.4);'));

      dot.onclick = function() {
        if (idx <= activeIdx || confirm('هل تود الانتقال إلى محطة: ' + st.name + '؟')) {
          currentBusStationIndex = idx;
          currentBusQuestionIndex = 0;
          loadBusStation(idx, document.getElementById('gamesContent'));
        }
      };
      track.appendChild(dot);
    });

    // Update bus position on road
    var bus = document.getElementById('animatedBus');
    if (bus) {
      var total = BUS_STATIONS.length - 1;
      var pct = (activeIdx / total) * 88;
      bus.style.right = (5 + pct) + '%';
    }

    var badge = document.getElementById('busStationBadge');
    if (badge) {
      badge.textContent = 'محطة ' + (activeIdx + 1) + ' من ' + BUS_STATIONS.length;
    }
  }

  function loadBusStation(stationIdx, container) {
    var station = BUS_STATIONS[stationIdx];
    if (!station) return;

    localStorage.setItem('bus_game_saved_station', stationIdx);
    renderStationDots(stationIdx);

    var area = document.getElementById('busStationArea');
    if (!area) return;

    var qObj = station.questions[currentBusQuestionIndex];
    if (!qObj) {
      // Station completed!
      finishStation(stationIdx, container);
      return;
    }

    area.innerHTML =
      '<div style="background:#fff;border-radius:20px;box-shadow:0 8px 24px rgba(0,0,0,0.08);overflow:hidden;border:2px solid #ECEFF1;animation:busFadeIn 0.3s ease;">' +
        // Station Header banner
        '<div style="background:' + station.bgGrad + ';color:#fff;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<span style="background:rgba(0,0,0,0.18);padding:3px 10px;border-radius:12px;font-size:12px;display:inline-block;margin-bottom:4px;">' + station.stage + '</span>' +
            '<h2 style="margin:0;font-size:20px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.2);">' + station.icon + ' ' + station.name + '</h2>' +
          '</div>' +
          '<div style="text-align:left;background:rgba(255,255,255,0.22);backdrop-filter:blur(4px);padding:8px 14px;border-radius:14px;font-weight:bold;font-size:13px;">' +
            'سؤال ' + (currentBusQuestionIndex + 1) + ' / ' + station.questions.length +
          '</div>' +
        '</div>' +

        // Question card body
        '<div style="padding:22px 20px;">' +
          '<div style="font-size:18px;font-weight:bold;color:#263238;line-height:1.6;margin-bottom:18px;text-align:center;padding:15px;background:#F8F9FA;border-radius:14px;border-right:5px solid #FFB703;">' +
            '❓ ' + qObj.q +
          '</div>' +

          // Hint toggle
          (qObj.hint ?
            '<div style="margin-bottom:16px;text-align:center;">' +
              '<button id="btnBusHint" style="background:none;border:none;color:#F57F17;font-size:13px;cursor:pointer;font-weight:bold;padding:4px 10px;border-radius:8px;background:#FFF9C4;">💡 تلميح الأستاذ حافظ</button>' +
              '<div id="busHintBox" style="display:none;margin-top:6px;font-size:13px;color:#795548;background:#FFFDE7;padding:8px;border-radius:8px;border:1px dashed #FFE082;">' + qObj.hint + '</div>' +
            '</div>' : '') +

          // Answers grid
          '<div id="busOptionsGrid" style="display:grid;grid-template-columns:1fr;gap:10px;"></div>' +

          // Feedback toast
          '<div id="busFeedback" style="min-height:28px;margin-top:14px;text-align:center;font-weight:bold;font-size:15px;"></div>' +
        '</div>' +
      '</div>';

    var hintBtn = document.getElementById('btnBusHint');
    if (hintBtn) {
      hintBtn.onclick = function() {
        var box = document.getElementById('busHintBox');
        if (box) {
          box.style.display = box.style.display === 'none' ? 'block' : 'none';
        }
      };
    }

    var optsGrid = document.getElementById('busOptionsGrid');
    qObj.options.forEach(function(optText, optIdx) {
      var optBtn = document.createElement('button');
      optBtn.style.cssText = 'background:#fff;border:2px solid #E0E0E0;border-radius:14px;padding:14px 16px;font-size:16px;font-weight:bold;color:#37474F;cursor:pointer;text-align:right;display:flex;align-items:center;gap:12px;transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.03);';

      var badgeLetters = ['أ', 'ب', 'ج', 'د'];
      optBtn.innerHTML = '<span style="width:28px;height:28px;border-radius:50%;background:#ECEFF1;color:#546E7A;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;flex-shrink:0;">' + (badgeLetters[optIdx] || optIdx + 1) + '</span>' +
                         '<span style="flex:1;">' + optText + '</span>';

      optBtn.onmouseover = function() {
        if (!optBtn.disabled) {
          optBtn.style.borderColor = '#FFB703';
          optBtn.style.background = '#FFFDE7';
        }
      };
      optBtn.onmouseout = function() {
        if (!optBtn.disabled) {
          optBtn.style.borderColor = '#E0E0E0';
          optBtn.style.background = '#fff';
        }
      };

      optBtn.onclick = function() {
        handleBusAnswer(optIdx, qObj, stationIdx, container);
      };

      optsGrid.appendChild(optBtn);
    });
  }

  function handleBusAnswer(selectedIdx, qObj, stationIdx, container) {
    var isCorrect = selectedIdx === qObj.answer;
    var allBtns = document.querySelectorAll('#busOptionsGrid button');
    allBtns.forEach(function(b) { b.disabled = true; });

    var feedback = document.getElementById('busFeedback');

    if (isCorrect) {
      playSound('correct');
      allBtns[selectedIdx].style.background = '#E8F5E9';
      allBtns[selectedIdx].style.borderColor = '#4CAF50';
      allBtns[selectedIdx].style.color = '#1B5E20';
      allBtns[selectedIdx].querySelector('span').style.background = '#4CAF50';
      allBtns[selectedIdx].querySelector('span').style.color = '#fff';

      feedback.innerHTML = '<span style="color:#2E7D32;">🌟 إجابة صحيحة وعبقرية! استعد للمحطة التالية...</span>';
      busTotalStars += 5;
      awardPoints(5);

      setTimeout(function() {
        currentBusQuestionIndex++;
        loadBusStation(stationIdx, container);
      }, 1200);
    } else {
      playSound('wrong');
      allBtns[selectedIdx].style.background = '#FFEBEE';
      allBtns[selectedIdx].style.borderColor = '#EF5350';
      allBtns[selectedIdx].style.color = '#C62828';
      allBtns[selectedIdx].querySelector('span').style.background = '#EF5350';
      allBtns[selectedIdx].querySelector('span').style.color = '#fff';

      // Highlight correct one
      if (allBtns[qObj.answer]) {
        allBtns[qObj.answer].style.background = '#E8F5E9';
        allBtns[qObj.answer].style.borderColor = '#4CAF50';
        allBtns[qObj.answer].style.color = '#1B5E20';
      }

      feedback.innerHTML = '<span style="color:#C62828;">حاول مرة ثانية يا بطل، سنعيد السؤال لتثبيت المعلومة!</span>';

      setTimeout(function() {
        loadBusStation(stationIdx, container);
      }, 1600);
    }
  }

  function finishStation(stationIdx, container) {
    playSound('horn');
    playSound('win');

    var station = BUS_STATIONS[stationIdx];
    var isLastStation = stationIdx >= BUS_STATIONS.length - 1;

    var area = document.getElementById('busStationArea');
    if (!area) return;

    if (isLastStation) {
      // Grand Graduation Celebration!
      awardPoints(50);
      area.innerHTML =
        '<div style="background:#fff;border-radius:24px;padding:32px 20px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.12);border:3px solid #FFD54F;">' +
          '<div style="font-size:64px;margin-bottom:8px;animation:bounce 1s infinite;">🎓🎉</div>' +
          '<h1 style="color:#D84315;margin:0 0 10px 0;font-size:26px;">مبروك التخرج والتفوق يا بطل!</h1>' +
          '<p style="color:#5D4037;font-size:16px;line-height:1.7;margin-bottom:20px;">' +
            'لقد قطعت رحلة العلم كاملة بأتوبيس المعرفة من <b>روضة الأطفال (KG1)</b> وصولاً إلى <b>الثانوية العامة (3 ثانوي)</b> بنجاح باهر واكتسبت أوسمة الشرف!' +
          '</p>' +
          '<div style="background:linear-gradient(135deg,#FFF9C4,#FFE082);padding:16px;border-radius:16px;margin-bottom:24px;border:2px dashed #FFA000;">' +
            '<div style="font-size:14px;color:#F57F17;font-weight:bold;">وسام سفير المعرفة الذهبي ⭐️</div>' +
            '<div style="font-size:24px;font-weight:bold;color:#E65100;margin-top:4px;">14 محطة دراسية مكتملة</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:10px;max-width:300px;margin:0 auto;">' +
            '<button id="btnRestartBus" style="background:#2E7D32;color:#fff;border:none;padding:14px;border-radius:14px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(46,125,50,0.3);">🔄 جولة جديدة من KG1</button>' +
            '<button id="btnBackToGames" style="background:#ECEFF1;color:#37474F;border:none;padding:12px;border-radius:14px;font-size:15px;font-weight:bold;cursor:pointer;">🏠 قائمة الألعاب</button>' +
          '</div>' +
        '</div>';

      document.getElementById('btnRestartBus').onclick = function() {
        startBusGame(0);
      };
      document.getElementById('btnBackToGames').onclick = function() {
        openEducationalGames();
      };
    } else {
      var nextSt = BUS_STATIONS[stationIdx + 1];
      area.innerHTML =
        '<div style="background:#fff;border-radius:22px;padding:28px 20px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,0.08);border:2px solid #81C784;">' +
          '<div style="font-size:50px;margin-bottom:8px;">🚦🚌✨</div>' +
          '<h2 style="color:#2E7D32;margin:0 0 8px 0;font-size:22px;">تم اجتياز فصل ' + station.name + '!</h2>' +
          '<p style="color:#555;font-size:15px;margin-bottom:20px;">الأتوبيس يستعد للانطلاق إلى المحطة القادمة: <b style="color:#1565C0;">' + nextSt.name + '</b></p>' +
          '<button id="btnNextStation" style="background:linear-gradient(135deg,#FF9800,#F57F17);color:#fff;border:none;padding:15px 36px;border-radius:16px;font-size:17px;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(245,127,23,0.35);transition:transform 0.15s;">' +
            '🚀 انطلق إلى المحطة التالية (' + nextSt.name + ')' +
          '</button>' +
        '</div>';

      document.getElementById('btnNextStation').onclick = function() {
        currentBusStationIndex = stationIdx + 1;
        currentBusQuestionIndex = 0;
        loadBusStation(currentBusStationIndex, container);
      };
    }
  }

  // ==========================================
  // --- Main Hub Screen ---
  // ==========================================
  function renderGamesHub() {
    var screenEl = document.getElementById('gamesScreen');
    if (!screenEl) return;

    var container = document.getElementById('gamesContent');
    if (!container) return;

    container.innerHTML =
      '<div style="text-align:center;background:linear-gradient(135deg,#FFF3E0,#FFE0B2);border-radius:20px;padding:22px 16px;margin-bottom:20px;box-shadow:0 4px 12px rgba(245,124,0,0.1);">' +
        '<div style="font-size:44px;margin-bottom:6px;">🎮✨</div>' +
        '<h2 style="color:#E65100;margin:0 0 6px 0;font-size:22px;">واحة الألعاب والذكاء</h2>' +
        '<p style="color:#795548;margin:0;font-size:14px;line-height:1.6;">العب، تدرّب، خض رحلة أتوبيس المعرفة واكسب نجوم التكريم في كل تحدي!</p>' +
      '</div>' +

      '<div style="display:flex;flex-direction:column;gap:15px;">' +

        // Card 1: School Bus Adventure (Featured Star Game)
        '<div style="background:linear-gradient(135deg,#FFFDE7 0%,#FFF8E1 100%);border-radius:20px;padding:20px;box-shadow:0 4px 16px rgba(255,179,0,0.22);border:2px solid #FFD54F;display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden;" id="cardBusGame">' +
          '<div style="position:absolute;top:10px;left:10px;background:#E65100;color:#fff;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.15);">✨ لعبة مميزة جديدة</div>' +
          '<div style="display:flex;align-items:center;gap:14px;">' +
            '<div style="width:60px;height:60px;background:#FFE082;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:34px;box-shadow:0 4px 10px rgba(255,160,0,0.2);">🚌</div>' +
            '<div style="flex:1;">' +
              '<h3 style="margin:0 0 4px 0;color:#E65100;font-size:18px;font-weight:bold;">أتوبيس المعرفة المدرسي</h3>' +
              '<p style="margin:0;color:#6D4C41;font-size:13px;line-height:1.5;">رحلة مشوقة يقف الأتوبيس عند كل صف دراسي (من KG1 حتى 3 ثانوي) بأسئلة منهجية مبهرة!</p>' +
            '</div>' +
          '</div>' +
          '<button id="btnStartBus" style="background:linear-gradient(135deg,#FF9800,#F57F17);color:#fff;border:none;padding:12px 18px;border-radius:14px;font-weight:bold;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 12px rgba(245,127,23,0.3);">' +
            '<span>🚀 اركب الأتوبيس وابدأ الرحلة</span>' +
          '</button>' +
        '</div>' +

        // Card 2: Math challenge
        '<div style="background:#fff;border-radius:18px;padding:18px;box-shadow:0 3px 12px rgba(0,0,0,0.06);border:2px solid #C8E6C9;display:flex;flex-direction:column;gap:12px;">' +
          '<div style="display:flex;align-items:center;gap:14px;">' +
            '<div style="width:52px;height:52px;background:#E8F5E9;color:#2E7D32;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;">⚡️</div>' +
            '<div style="flex:1;">' +
              '<h3 style="margin:0 0 4px 0;color:#1B5E20;font-size:17px;">تحدي سرعة الحساب والذكاء</h3>' +
              '<p style="margin:0;color:#666;font-size:13px;">حل أكبر عدد ممكن من المسائل خلال 30 ثانية!</p>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;margin-top:4px;">' +
            '<button id="btnMathLvl1" style="flex:1;background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;padding:10px 6px;border-radius:12px;font-weight:bold;cursor:pointer;font-size:13px;">🌱 مبتدئ</button>' +
            '<button id="btnMathLvl2" style="flex:1;background:#C8E6C9;color:#1B5E20;border:1px solid #81C784;padding:10px 6px;border-radius:12px;font-weight:bold;cursor:pointer;font-size:13px;">🔥 بطل</button>' +
            '<button id="btnMathLvl3" style="flex:1;background:#81C784;color:#053b0c;border:1px solid #4CAF50;padding:10px 6px;border-radius:12px;font-weight:bold;cursor:pointer;font-size:13px;">👑 عبقري</button>' +
          '</div>' +
        '</div>' +

        // Card 3: Memory Game
        '<div style="background:#fff;border-radius:18px;padding:18px;box-shadow:0 3px 12px rgba(0,0,0,0.06);border:2px solid #BBDEFB;display:flex;align-items:center;gap:14px;cursor:pointer;" id="btnStartMemory">' +
          '<div style="width:52px;height:52px;background:#E3F2FD;color:#1565C0;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;">🧠</div>' +
          '<div style="flex:1;">' +
            '<h3 style="margin:0 0 4px 0;color:#0D47A1;font-size:17px;">لعبة الذاكرة والمطابقة</h3>' +
            '<p style="margin:0;color:#666;font-size:13px;">طابق البطاقات والمسائل بنواتجها الصحيحة بأقل حركات.</p>' +
          '</div>' +
          '<div style="color:#1565C0;font-size:24px;font-weight:bold;">‹</div>' +
        '</div>' +

      '</div>';

    document.getElementById('btnStartBus').onclick = function() { startBusGame(); };
    document.getElementById('btnMathLvl1').onclick = function() { startMathGame(1); };
    document.getElementById('btnMathLvl2').onclick = function() { startMathGame(2); };
    document.getElementById('btnMathLvl3').onclick = function() { startMathGame(3); };
    document.getElementById('btnStartMemory').onclick = function() { startMemoryGame(); };
  }

  function openEducationalGames() {
    if (window.screenHistory) {
      window.screenHistory.push(window.currentScreen || 'homeScreen');
    }
    if (typeof window.showScreen === 'function') {
      window.showScreen('gamesScreen');
    }
    renderGamesHub();
  }

  window.openEducationalGames = openEducationalGames;
  window.startMathGame = startMathGame;
  window.startMemoryGame = startMemoryGame;
  window.startBusGame = startBusGame;
})();
