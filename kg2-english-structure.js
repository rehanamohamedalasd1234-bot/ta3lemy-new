/* English KG2 — Term 1 2026/2027
 * Official source: Ministry of Education student book.
 * Integrated into Kindergarten Languages > KG2 > English.
 */
(function () {
  'use strict';
  var oldOpenSubject = window.openSubject;
  var STAGE_ID = 'kindergarten_languages';
  var SOURCE = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/KG/KG2/Term1/StudentBook/English_language_kg2_t1.pdf';
  var dataPromise = null;
  function isKG2English() { return window.currentStage === STAGE_ID && window.currentGrade === 'KG2' && window.currentSubject === 'English'; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function go(id) { if (window.screenHistory) window.screenHistory.push(window.currentScreen); if (window.showScreen) window.showScreen(id); }
  function loadData() {
    if (!dataPromise) dataPromise = fetch('./kg2-english-2026-2027-t1.json').then(function (r) { if (!r.ok) throw Error('تعذر تحميل منهج English KG2'); return r.json(); });
    return dataPromise;
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text || ''); u.lang = 'en-US'; u.rate = 0.78; window.speechSynthesis.speak(u);
  }
  function openSubjectEN() {
    window.currentSubject = 'English';
    var title = document.getElementById('termsTitle'); var header = document.getElementById('termsHeader'); var list = document.getElementById('termsList');
    if (title) title.textContent = 'English';
    if (header) header.textContent = 'KG2 — English — Term 1 2026/2027';
    if (!list) return;
    list.innerHTML = '<div class="lesson-body" style="margin-bottom:14px;border-right:5px solid #303F9F"><b>Official KG2 English — interactive curriculum</b><p style="line-height:1.9;margin-bottom:0">Little Bodies, Big Moves! • Let\'s Get Dressed! • My Week! • My Busy Day! Learn through short lessons, phonics, speaking, counting, and practice.</p><p style="font-size:13px;margin-bottom:0">منهج KG2 الرسمي للترم الأول، بشرح عربي مبسّط وتدريبات أصلية مناسبة للطفل.</p></div><div class="term-card" style="border-right-color:#303F9F"><div class="term-header"><div class="term-icon">🔠</div><div class="term-title" style="color:#303F9F">Term 1 — English</div><div class="term-count">4 Units</div></div><div class="term-sections"><button class="section-chip" data-en-open="lessons">📄 Lessons</button><button class="section-chip" data-en-open="letters">🔤 Phonics</button><button class="section-chip" data-en-open="activities">🎨 Activities</button><button class="section-chip" data-en-open="exercises">✏️ Practice</button><button class="section-chip" data-en-open="reviews">🔁 Review</button></div></div><div class="lesson-body" style="margin-top:14px;font-size:13px"><b>Source:</b> English KG2 Student Book, Term 1, 2026/2027 — <a href="' + SOURCE + '" target="_blank" rel="noopener">Open official book</a></div>';
    list.querySelectorAll('[data-en-open]').forEach(function (b) { b.onclick = function () { openContentEN(b.getAttribute('data-en-open')); }; });
    go('termsScreen');
  }
  function openContentEN(type) {
    var list = document.getElementById('contentList'); var title = document.getElementById('contentTitle'); var head = document.getElementById('contentHeaderTitle'); var sub = document.getElementById('contentHeaderSub');
    var map = { lessons: '📄 Lessons & Vocabulary', letters: '🔤 Phonics & Letters', activities: '🎨 Activities & Skills', exercises: '✏️ Interactive Practice', reviews: '🔁 Term Review' };
    if (title) title.textContent = map[type] || 'KG2 English Content';
    if (head) head.textContent = 'English — KG2';
    if (sub) sub.textContent = 'Term 1 2026/2027 — Official curriculum';
    if (list) list.innerHTML = '<div class="empty-state"><p>⏳ Loading content...</p></div>';
    go('contentScreen');
    loadData().then(function (data) {
      var rows = data.records.filter(function (x) {
        if (type === 'letters') return x.type === 'letters';
        if (type === 'activities') return x.type === 'activities';
        if (type === 'reviews') return x.type === 'reviews';
        if (type === 'exercises') return x.type === 'exercises';
        return x.type === 'lessons';
      }).sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      if (!rows.length) { if (list) list.innerHTML = '<div class="empty-state">No content in this section.</div>'; return; }
      list.innerHTML = rows.map(function (x, i) { return '<button class="content-item" data-en-item="' + i + '" style="width:100%;text-align:left;border:0"><div class="content-item-icon">' + (x.letter ? '🔤' : x.type === 'activities' ? '🎨' : x.type === 'reviews' ? '🔁' : x.type === 'exercises' ? '✏️' : '📘') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(x.title) + '</div><div class="content-item-sub">' + esc(x.unit) + ' • Page ' + esc(x.page) + '</div></div><div class="content-item-arrow">›</div></button>'; }).join('');
      list.querySelectorAll('[data-en-item]').forEach(function (b) { b.onclick = function () { viewEN(rows[Number(b.getAttribute('data-en-item'))]); }; });
    }).catch(function () { if (list) list.innerHTML = '<div class="empty-state">Unable to load English KG2 content. Please try again.</div>'; });
  }
  function viewEN(x) {
    var list = document.getElementById('contentList'); var title = document.getElementById('contentTitle');
    if (title) title.textContent = x.title;
    var vocab = x.vocabulary && x.vocabulary.length ? x.vocabulary : (x.words || []);
    var vocabHtml = vocab.length ? '<div style="background:#E8EAF6;border-radius:14px;padding:14px;margin-top:14px"><b>🗣️ Word bank</b><p style="font-size:18px;line-height:2;margin-bottom:0">' + vocab.map(function (w) { return '<button class="en-word" style="border:0;border-radius:10px;background:#fff;color:#303F9F;padding:6px 9px;margin:3px;cursor:pointer" data-word="' + esc(w) + '">' + esc(w) + '</button>'; }).join('') + '</p></div>' : '';
    var objectives = x.letter ? '<div style="font-size:58px;text-align:center;color:#303F9F;background:#E8EAF6;border-radius:20px;padding:8px;margin:12px auto;max-width:300px;font-weight:bold;cursor:pointer" id="enLetter">' + esc(x.letter) + '</div>' : '';
    list.innerHTML = '<article class="lesson-body" style="border-top:5px solid #303F9F"><div style="font-size:12px;color:#303F9F;font-weight:bold">' + esc(x.unit) + ' • Page ' + esc(x.page) + '</div><h2>' + esc(x.title) + '</h2>' + objectives + '<p style="white-space:pre-line;line-height:2">' + esc(x.content) + '</p>' + (x.arabic ? '<div style="background:#FFF8E1;border-radius:12px;padding:12px;line-height:1.9"><b>شرح وإرشاد بالعربية:</b><br>' + esc(x.arabic) + '</div>' : '') + vocabHtml + (x.activity ? '<div style="background:#E8F5E9;border-radius:14px;padding:14px;margin-top:14px"><b>🎲 Activity</b><p>' + esc(x.activity) + '</p></div>' : '') + (x.question ? '<div style="background:#F3E5F5;border-radius:14px;padding:14px;margin-top:14px"><b>❓ Quick question</b><p>' + esc(x.question) + '</p><details><summary>Show answer</summary><p>' + esc(x.answer || '') + '</p></details></div>' : '') + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="section-chip" id="enSpeak">🔊 Listen</button><button class="section-chip" id="enTrace">✏️ Touch &amp; trace</button></div><p style="font-size:12px;color:#777;margin-top:14px">Official source: <a href="' + SOURCE + '" target="_blank" rel="noopener">English KG2 Student Book</a></p></article>';
    var text = (x.speak || x.content || x.title || '');
    var speakBtn = document.getElementById('enSpeak'); if (speakBtn) speakBtn.onclick = function () { speak(text); };
    var letter = document.getElementById('enLetter'); if (letter) letter.onclick = function () { speak((x.letter || '') + '. ' + (x.speak || '')); };
    list.querySelectorAll('.en-word').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-word')); }; });
    var trace = document.getElementById('enTrace'); if (trace) trace.onclick = function () { if (typeof window.openKindergartenPractice === 'function') window.openKindergartenPractice(); else speak('Open the writing board and trace the letter.'); };
  }
  window.openSubject = function (id, name) { if (window.currentStage === STAGE_ID && window.currentGrade === 'KG2' && (id === 'kg_english' || name === 'English')) { openSubjectEN(); return; } return oldOpenSubject.apply(this, arguments); };
})();
