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

  // State management
  var currentGame = null;
  var mathTimer = null;
  var mathScore = 0;
  var mathStreak = 0;
  var mathTimeLeft = 30;
  var currentQuestion = null;

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

  // --- 1. Speed Math Game ---
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
    // Shuffle options
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

  // --- 2. Memory Match Cards Game ---
  var memoryPairs = [
    { id: 1, val: '5 + 5', pair: '10' },
    { id: 2, val: '3 × 4', pair: '12' },
    { id: 3, val: '20 - 6', pair: '14' },
    { id: 4, val: '9 + 7', pair: '16' },
    { id: 5, val: '25 ÷ 5', pair: '5' },
    { id: 6, val: '8 × 2', pair: '16' }
  ];

  function startMemoryGame() {
    var container = document.getElementById('gamesContent');
    if (!container) return;

    var cards = [];
    var pairs = [
      { id: 1, text: '4 + 4' }, { id: 1, text: '8' },
      { id: 2, text: '5 × 3' }, { id: 2, text: '15' },
      { id: 3, text: '20 - 2' }, { id: 3, text: '18' },
      { id: 4, text: '7 + 6' }, { id: 4, text: '13' },
      { id: 5, text: '9 × 2' }, { id: 5, text: '18' },
      { id: 6, text: '10 + 10' }, { id: 6, text: '20' }
    ];
    cards = pairs.sort(function() { return 0.5 - Math.random(); });

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

    cards.forEach(function(c, idx) {
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

  // --- Main Hub Screen ---
  function renderGamesHub() {
    var screenEl = document.getElementById('gamesScreen');
    if (!screenEl) return;

    var container = document.getElementById('gamesContent');
    if (!container) return;

    container.innerHTML =
      '<div style="text-align:center;background:linear-gradient(135deg,#FFF3E0,#FFE0B2);border-radius:20px;padding:22px 16px;margin-bottom:20px;box-shadow:0 4px 12px rgba(245,124,0,0.1);">' +
        '<div style="font-size:44px;margin-bottom:6px;">🎮✨</div>' +
        '<h2 style="color:#E65100;margin:0 0 6px 0;font-size:22px;">واحة الألعاب والذكاء</h2>' +
        '<p style="color:#795548;margin:0;font-size:14px;line-height:1.6;">العب، تمرّن، نافس أصدقاءك واكسب نجوم التكريم في كل تحدي!</p>' +
      '</div>' +

      '<div style="display:flex;flex-direction:column;gap:15px;">' +
        // Card 1: Math challenge
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

        // Card 2: Memory Game
        '<div style="background:#fff;border-radius:18px;padding:18px;box-shadow:0 3px 12px rgba(0,0,0,0.06);border:2px solid #BBDEFB;display:flex;align-items:center;gap:14px;cursor:pointer;" id="btnStartMemory">' +
          '<div style="width:52px;height:52px;background:#E3F2FD;color:#1565C0;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;">🧠</div>' +
          '<div style="flex:1;">' +
            '<h3 style="margin:0 0 4px 0;color:#0D47A1;font-size:17px;">لعبة الذاكرة والمطابقة</h3>' +
            '<p style="margin:0;color:#666;font-size:13px;">طابق البطاقات والمسائل بنواتجها الصحيحة بأقل حركات.</p>' +
          '</div>' +
          '<div style="color:#1565C0;font-size:24px;font-weight:bold;">‹</div>' +
        '</div>' +
      '</div>';

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
})();
