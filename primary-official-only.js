/* منهج اللغة العربية - الصف الأول الابتدائي - الترم الأول
 * كتالوج تعليمي تفاعلي مبني على الكتاب المرفق من المستخدم.
 * النصوص داخل المنصة شروحات وتدريبات أصلية مختصرة، مع رابط كتاب الطالب الرسمي.
 */
(function () {
  'use strict';
  var SOURCE = 'https://ellibrary.moe.gov.eg/Books/Books-Primary';
  var BOOK = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026/Primary/Primary1/Term1/StudentBook/Arabic_prim1_T1.pdf';
  var LETTERS = [
    ['الياء','ي','يد، يَمَام، ياسمين'], ['الألف','أ','أرنب، أسد، أذن'], ['الباء','ب','باب، بطة، بطة'],
    ['الميم','م','ماما، موز، مدرسة'], ['الحاء','ح','حوت، حصان، حديقة'], ['الجيم','ج','جمل، جزر، جبل'],
    ['الدال','د','دب، دار، دجاجة'], ['الخاء','خ','خبز، خوخ، خروف'], ['التاء','ت','تفاح، تاج، تمر'],
    ['العين','ع','عين، عنب، عصفور'], ['الشين','ش','شمس، شجرة، شباك'], ['الواو','و','وردة، ولد، وجه'],
    ['الهاء','هـ','هلال، هدية، هرم'], ['الذال','ذ','ذهب، ذرة، ذيل'], ['الظاء','ظ','ظبي، ظرف، ظل'],
    ['اللام','ل','ليمون، لعبة، لسان'], ['السين','س','سمكة، ساعة، سيارة'], ['النون','ن','نمر، نجمة، نحلة'],
    ['الراء','ر','رمان، ريشة، رجل'], ['الفاء','ف','فيل، فراشة، فم'], ['الزاي','ز','زهرة، زرافة، زيتون'],
    ['الطاء','ط','طائرة، طبل، طماطم'], ['الصاد','ص','صقر، صندوق، صابون'], ['الضاد','ض','ضفدع، ضرس، ضفيرة'],
    ['الثاء','ث','ثعلب، ثوب، ثمر'], ['الغين','غ','غزال، غيمة، غابة'], ['الكاف','ك','كتاب، كرة، كرسي'],
    ['القاف','ق','قلم، قمر، قطة']
  ];
  var units = [
    { title: 'الوحدة الأولى: أنا وأسرتي', icon: '👨‍👩‍👧‍👦', color: '#7B1FA2', intro: 'أتعرف نفسي وأسرتي، وأعبّر عن الحب والتعاون والانتماء.', items: [
      ['قصة الاستماع: أميرة وأسرتها السعيدة','استماع','أستمع إلى قصة عن طفلة تحب أسرتها، أحدد الشخصيات، وأرتب الأحداث، وأستخرج قيمة المحبة والتعاون.'],
      ['نشيد: أسرتي','نشيد','أفهم معنى النشيد وأتحدث عن شخص يساعدني في أسرتي، ثم أعبّر عن امتناني بجملة من عندي.'],
      ['حرف الياء','حرف'],['حرف الألف','حرف'],['حرف الباء','حرف'],['حرف الميم','حرف'],['حرف الحاء','حرف'],['حرف الجيم','حرف'],['حرف الدال','حرف'],['حرف الخاء','حرف'],['حرف التاء','حرف'],
      ['القارئ الصغير: أحب أسرتي','قراءة','أقرأ كلمات وجملًا قصيرة من الحروف التي تعلمتها، وأصل القراءة بمواقف الحب والمساعدة داخل الأسرة.'],
      ['تقييم الوحدة الأولى','تقييم']
    ]},
    { title: 'الوحدة الثانية: حيواناتي', icon: '🐾', color: '#00897B', intro: 'أكتشف عالم الحيوانات، وأتعلم الرفق بها ووصف ما أراه.', items: [
      ['قصة الاستماع: عالم الحيوان','استماع','أستمع إلى قصة عن الحيوانات، أميز أصواتها وصفاتها، وأتحدث عن طريقة العناية بها والرفق بها.'],
      ['نشيد: لوحتي الجديدة','نشيد','أتعرف الفكرة العامة للنشيد، وأصف لوحة أو منظرًا جميلًا بجمل بسيطة من لغتي.'],
      ['حرف العين','حرف'],['حرف الشين','حرف'],['حرف الواو','حرف'],['حرف الهاء','حرف'],['حرف الذال','حرف'],['حرف الظاء','حرف'],
      ['القارئ الصغير: ماذا تأكل؟','قراءة','أقرأ كلمات قصيرة عن الطعام والحيوانات، وأصل الصورة بالكلمة، وأجيب عن أسئلة فهم بسيطة.'],
      ['تقييم الوحدة الثانية','تقييم']
    ]},
    { title: 'الوحدة الثالثة: أجزاء جسمي', icon: '🧒', color: '#EF6C00', intro: 'أتعرف أجزاء جسمي ووظائفها، وأتعلم العناية بنظافتي وصحتي.', items: [
      ['تمهيد: أتعرف أجزاء جسمي','تمهيد','أشير إلى أجزاء جسمي وأسميها، وأربط كل جزء بوظيفته، وأتحدث عن النظافة والعادات الصحية.'],
      ['حرف اللام','حرف'],['حرف السين','حرف'],['حرف النون','حرف'],['حرف الراء','حرف'],['حرف الفاء','حرف'],
      ['القارئ الصغير: هذه مدرستي','قراءة','أقرأ كلمات قصيرة عن المدرسة والجسم والحركة، وأتتبع الجملة من اليمين إلى اليسار.'],
      ['تقييم الوحدة الثالثة','تقييم']
    ]},
    { title: 'الوحدة الرابعة: مدرستي', icon: '🏫', color: '#1565C0', intro: 'أتعرف مدرستي وأدوار من يعملون فيها، وأتعلم النظام والاحترام.', items: [
      ['قصة الاستماع: يوم في المدرسة','استماع','أستمع إلى أحداث يوم دراسي، أحدد المكان والشخصيات، وأرتب الأحداث، وأستخلص قيمة النظام والتعاون.'],
      ['نشيد: أحب مدرستي','نشيد','أعبّر عن حبي للمدرسة، وأذكر سلوكًا يحافظ على نظافتها واحترام معلمي وزملائي.'],
      ['حرف الزاي','حرف'],['حرف الطاء','حرف'],['حرف الصاد','حرف'],['حرف الضاد','حرف'],['حرف الثاء','حرف'],['حرف الغين','حرف'],['حرف الكاف','حرف'],['حرف القاف','حرف'],
      ['تقييم الوحدة الرابعة','تقييم'],
      ['القراءة مع الأسرة: السلحفاة الحكيمة','قراءة','أقرأ القصة مع أسرتي، أتعرف الشخصيات، أرتب الأحداث، وأذكر كيف يساعد التفكير الهادئ على حل المشكلة.']
    ]}
  ];
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }
  function speak(text) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'ar-EG'; u.rate = .82; window.speechSynthesis.speak(u); }
  function go(id) { if (window.screenHistory) window.screenHistory.push(window.currentScreen); if (typeof window.showScreen === 'function') window.showScreen(id); }
  function setList(el, html) { if (el) el.innerHTML = html; }
  function iconFor(kind) { return ({'حرف':'🔤','استماع':'🎧','نشيد':'🎵','قراءة':'📚','تقييم':'📝','تمهيد':'✍️'})[kind] || '📘'; }
  function letterData(title) { var name = title.replace('حرف ', ''); for (var i = 0; i < LETTERS.length; i++) if (LETTERS[i][0] === name) return LETTERS[i]; return [name, '', '']; }
  var byKey = {};
  units.forEach(function (unit, ui) { unit.items.forEach(function (item, ii) { byKey['ar-' + ui + '-' + ii] = { unit: unit, title: item[0], kind: item[1], note: item[2] || '' }; }); });

  function subjects() {
    var list = document.getElementById('subjectsList'), title = document.getElementById('subjectsTitle');
    if (title) title.textContent = 'الصف الأول الابتدائي — المواد';
    var subjects = [['arabic','📖','اللغة العربية','الترم الأول • منهج الكتاب المرفق',true],['math','🔢','الرياضيات','الفصلان الدراسيان',true],['english','🔤','اللغة الإنجليزية','كتاب الوزارة الرسمي',false],['discover','🌍','اكتشف','كتاب الوزارة الرسمي',false],['religion','🕌','التربية الدينية','كتاب الوزارة الرسمي',false],['values','🤝','القيم واحترام الآخر','كتاب الوزارة الرسمي',false]];
    var html = '<div style="background:linear-gradient(135deg,#E8F5E9,#E3F2FD);border-radius:22px;padding:20px;margin-bottom:16px;text-align:center;box-shadow:0 5px 18px #1565c015"><div style="font-size:50px">🎒📚</div><h2 style="color:#1565C0;margin:8px 0">مواد الصف الأول الابتدائي</h2><p style="line-height:1.9;margin:0;color:#455A64">اختر المادة، ثم ابدأ رحلة التعلم بالشرح والتدريب والتقييم.</p></div><div class="subjects-grid">';
    html += subjects.map(function (x) { return '<button class="subject-card" data-primary-subject="' + esc(x[2]) + '" style="border:2px solid ' + (x[4] ? '#1565C0' : '#ddd') + ';background:#fff;padding:16px;' + (x[4] ? '' : 'opacity:.78') + '"><div class="subject-icon" style="background:' + (x[4] ? '#E3F2FD' : '#F5F5F5') + ';color:' + (x[4] ? '#1565C0' : '#777') + '">' + x[1] + '</div><div class="subject-name">' + x[2] + '<br><small>' + x[3] + '</small></div></button>'; }).join('') + '</div><div style="margin-top:16px;text-align:center"><a href="' + SOURCE + '" target="_blank" rel="noopener" style="color:#1565C0;font-weight:bold">📚 فتح كتب الوزارة الرسمية</a></div>';
    setList(list, html);
    document.querySelectorAll('[data-primary-subject]').forEach(function (button) { button.onclick = function () { var name = button.getAttribute('data-primary-subject'); window.currentSubject = name; if (name === 'اللغة العربية') openArabic(); else if (name === 'الرياضيات' && window.openGrade1Math) window.openGrade1Math(); else showNotice(name); }; });
  }
  function showNotice(name) { var t = document.getElementById('termsTitle'), h = document.getElementById('termsHeader'), l = document.getElementById('termsList'); if (t) t.textContent = name; if (h) h.textContent = 'الصف الأول — ' + name; if (l) l.innerHTML = '<div class="lesson-body"><h2>' + esc(name) + '</h2><p>هذه المادة موضوعة داخل مسار الصف الأول. المحتوى التفاعلي الكامل لها سيضاف في تحديث مستقل.</p><a class="btn-primary" href="' + SOURCE + '" target="_blank">فتح كتب الوزارة</a></div>'; go('termsScreen'); }
  function openArabic() {
    var t = document.getElementById('termsTitle'), h = document.getElementById('termsHeader'), list = document.getElementById('termsList');
    if (t) t.textContent = 'اللغة العربية'; if (h) h.textContent = 'الصف الأول الابتدائي — اللغة العربية • الترم الأول';
    var html = '<div style="background:linear-gradient(135deg,#E0F7FA,#FFF8E1);border-radius:22px;padding:20px;margin-bottom:18px;box-shadow:0 5px 18px #00695c15"><div style="display:flex;align-items:center;gap:14px"><div style="font-size:50px">📖</div><div><h2 style="margin:0;color:#00695C">لغتي العربية</h2><p style="margin:5px 0;line-height:1.8">رحلة الحروف والكلمات والقصص — شرح مبسط، أنشطة، تدريب صوتي، وتقييم بعد كل وحدة.</p></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><span class="section-chip">📚 ' + units.length + ' وحدات</span><span class="section-chip">🔤 ' + LETTERS.length + ' حرفًا</span><span class="section-chip">📝 تقييمات ختامية</span></div></div>';
    units.forEach(function (unit, ui) {
      html += '<section style="margin:20px 0"><div style="background:' + unit.color + ';color:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 4px 12px #0002"><h3 style="margin:0 0 5px">' + unit.icon + ' ' + unit.title + '</h3><div style="font-size:13px;opacity:.95">' + unit.intro + '</div></div><div style="margin-top:10px">';
      unit.items.forEach(function (item, ii) { var key = 'ar-' + ui + '-' + ii; html += '<button class="menu-item" data-ar-item="' + key + '" style="width:100%;text-align:right;border:0"><span style="font-size:24px">' + iconFor(item[1]) + '</span><span style="flex:1"><b>' + esc(item[0]) + '</b><small style="display:block;color:#78909C;margin-top:4px">' + (item[1] === 'حرف' ? 'شرح الحرف • كلمات • نطق • كتابة • تدريب' : item[1] === 'تقييم' ? 'اختبار قصير ومراجعة الوحدة' : item[1] === 'استماع' ? 'استمع • افهم • تحدث' : item[1] === 'نشيد' ? 'فهم المعنى والتعبير' : 'قراءة وفهم وتطبيق') + '</small></span><span style="color:#78909C;font-size:24px">‹</span></button>'; });
      html += '</div></section>';
    });
    html += '<div style="margin-top:18px;padding:15px;background:#F3E5F5;border-radius:16px;line-height:1.9;font-size:13px"><b>📌 الكتاب المرفق:</b> تم تنظيم المحتوى وفق تسلسل كتاب اللغة العربية للصف الأول الابتدائي — الترم الأول. <a href="' + BOOK + '" target="_blank" rel="noopener">فتح كتاب الطالب PDF</a></div>';
    setList(list, html); document.querySelectorAll('[data-ar-item]').forEach(function (b) { b.onclick = function () { renderItem(b.getAttribute('data-ar-item')); }; }); go('termsScreen');
  }
  function practiceFor(data) {
    if (data.kind === 'حرف') { var d = letterData(data.title); return '<ol><li>انطق صوت الحرف بوضوح: <b>' + esc(d[1]) + '</b>.</li><li>استمع إلى الكلمات: ' + esc(d[2]) + '، وحدد مكان الحرف.</li><li>اختر كلمة من بيئتك تبدأ بالحرف.</li><li>اكتب الحرف في الهواء ثم على السطر.</li></ol><button class="section-chip" id="speakBtn">🔊 اسمع الحرف والكلمات</button>'; }
    if (data.kind === 'تقييم') return '<ol><li>اذكر فكرة تعلمتها من الوحدة.</li><li>اقرأ كلمتين من حروف الوحدة.</li><li>رتب حدثين من قصة الاستماع.</li><li>اختر السلوك الصحيح في موقف من الوحدة.</li></ol><div style="background:#E8F5E9;padding:12px;border-radius:12px"><b>⭐ تقييم ذاتي:</b> أضع نجمة أمام ما أستطيع فعله: أستمع ☐ أقرأ ☐ أكتب ☐ أتحدث ☐</div>';
    return '<ol><li>ماذا فهمت من ' + esc(data.title) + '؟</li><li>اذكر كلمة جديدة تعلمتها.</li><li>ارسم أو مثّل الفكرة مع أحد أفراد أسرتك.</li><li>كوّن جملة قصيرة من كلمات الدرس.</li></ol>';
  }
  function renderItem(key) {
    var data = byKey[key]; if (!data) return; var title = document.getElementById('contentTitle'), head = document.getElementById('contentHeaderTitle'), sub = document.getElementById('contentHeaderSub'), list = document.getElementById('contentList');
    if (title) title.textContent = data.title; if (head) head.textContent = data.unit.title; if (sub) sub.textContent = 'الصف الأول الابتدائي • اللغة العربية • الترم الأول';
    var d = data.kind === 'حرف' ? letterData(data.title) : null;
    var body = '<article class="lesson-body" style="direction:rtl"><div style="background:linear-gradient(135deg,#E8F5E9,#E3F2FD);padding:18px;border-radius:18px;text-align:center;margin-bottom:16px"><div style="font-size:' + (d ? '76px' : '48px') + ';font-weight:800;color:#1565C0">' + (d ? esc(d[1]) : iconFor(data.kind)) + '</div><h2 style="margin:6px 0;color:#1565C0">' + esc(data.title) + '</h2><div style="color:#607D8B">' + esc(data.unit.title) + '</div></div><h3>🎯 أتعلم</h3><p style="line-height:2">' + esc(data.note || 'أتعلم الفكرة الجديدة بطريقة سهلة، ثم أطبقها في نشاط قصير.') + '</p>';
    if (d) body += '<div style="background:#FFF8E1;border-radius:14px;padding:14px;line-height:2"><b>كلمات الحرف:</b> ' + esc(d[2]) + '<br><b>ألاحظ:</b> أسمع صوت الحرف، وأتعرف شكله، وأتدرب على كتابته في أول الكلمة ووسطها وآخرها حسب الكلمة.</div><button class="section-chip" id="speakBtn" style="margin-top:12px">🔊 تشغيل النطق</button>';
    body += '<h3>✏️ أتدرب</h3>' + practiceFor(data) + '<h3>🧠 سؤال التفكير</h3><p>كيف أستخدم ما تعلمته في البيت أو المدرسة؟</p><textarea class="student-answer" rows="3" placeholder="اكتب أو أخبر ولي أمرك بإجابتك"></textarea><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn-primary" id="doneBtn">✅ أنهيت النشاط</button><a class="section-chip" href="' + BOOK + '" target="_blank">📖 صفحة الكتاب</a></div></article>';
    setList(list, body); document.getElementById('doneBtn').onclick = function () { if (window.showToast) window.showToast('🌟 أحسنت! تم تسجيل إنجازك لهذا النشاط.'); }; var speakButton = document.getElementById('speakBtn'); if (speakButton) speakButton.onclick = function () { speak(data.title + '. ' + (d ? d[2] : data.note)); }; go('contentScreen');
  }
  var oldOpenGrade = window.openGrade;
  window.openGrade = function (id, name) { if (id === 'primary' && name === 'الأول') { window.currentStage = 'primary'; window.currentGrade = 'الأول'; subjects(); go('subjectsScreen'); return; } return oldOpenGrade.apply(this, arguments); };
  var oldOpenSubject = window.openSubject;
  window.openSubject = function (id, name) { if (window.currentStage === 'primary' && window.currentGrade === 'الأول' && (name === 'اللغة العربية' || name === 'العربية')) { openArabic(); return; } return oldOpenSubject.apply(this, arguments); };
  window.openPrimaryArabicCurriculum = openArabic;
  window.PRIMARY_GRADE1_ARABIC = { units: units.length, letters: LETTERS.length, items: Object.keys(byKey).length, source: BOOK };
})();
