/* المرحلة الأولى من المنهج التفصيلي للصف الأول: خريطة وحدات فعلية + شرح وتطبيقات أصلية */
(function () {
  'use strict';
  var SOURCE = 'https://edu2-egypt.com/books-grade1';
  var all = [];
  function add(x) { all.push(Object.assign({ grade: 'الأول', stage: 'primary', sourceUrl: SOURCE, created_at: '2026-10-25T00:00:00.000Z' }, x)); }
  function lesson(subject, term, unit, title, skill, order) {
    add({ id: 'g1d-' + term + '-' + order + '-lesson-' + subject, title: unit + ' — ' + title, subject: subject, term: term, type: 'lessons', order: order, content: 'شرح الدرس: ' + skill + '\n\nخطوات التعلم: نلاحظ المثال، نكرر الفكرة بصوت واضح، ثم نطبقها على موقف جديد من حياتنا.\n\nنشاط تفاعلي: المس الحرف أو العدد أو الصورة المرتبطة بالدرس، وناقش ما تراه مع ولي أمرك.\n\nمفردات الدرس: ' + title + '.\n\nتحقق من فهمك: اشرح الفكرة في جملة قصيرة أو ارسم مثالًا عليها.' });
    add({ id: 'g1d-' + term + '-' + order + '-exercise-' + subject, title: 'تدريب — ' + unit + ' — ' + title, subject: subject, term: term, type: 'exercises', order: order, question: 'طبق مهارة "' + title + '" في مثال من البيت أو المدرسة، ثم اشرح كيف عرفت أن إجابتك صحيحة.', answer: 'تقبل الإجابة التي تطبق المهارة بوضوح، ويمكن للطالب استخدام الرسم أو الكلام أو الكتابة حسب طبيعة الدرس.', content: 'تدريب متدرج:\n1) تعرف على المثال.\n2) أكمل أو صل أو رتب.\n3) أنشئ مثالًا من عندك.\n4) راجع إجابتك.' });
  }
  function review(subject, term, unit, order) { add({ id: 'g1d-' + term + '-' + order + '-review-' + subject, title: 'مراجعة وحدة — ' + unit, subject: subject, term: term, type: 'reviews', order: order, content: 'ملخص المراجعة: أعد قراءة دروس الوحدة، رتب الصور أو الكلمات، ثم اشرح المهارة الأساسية لشخص آخر.\n\nتقييم ذاتي: أستطيع أن أتعرف الفكرة، وأطبقها، وأشرح سبب اختياري.', question: 'ارسم أو اكتب أهم فكرة في الوحدة.', answer: 'إجابة مفتوحة مرتبطة بموضوعات الوحدة.' }); }
  function exam(subject, term, label, order) { add({ id: 'g1d-' + term + '-' + order + '-exam-' + subject, title: 'اختبار وحدة — ' + label, subject: subject, term: term, type: 'exams', order: order, content: 'اختبار قصير للوحدة: سؤال تعرف، سؤال تطبيق، وسؤال تفكير. الزمن المقترح 10 دقائق.\n\nبعد الحل: يشرح الطالب إجابة واحدة بصوت واضح ويحدد مهارة يريد التدريب عليها.', question: 'اختر الإجابة أو الرسم الذي يوضح المهارة، ثم اشرح اختيارك.', answer: 'تراجع الإجابة وفق المهارة المستهدفة، وتقبل الإجابة الشفهية أو المصورة للطالب المبتدئ.' }); }

  var arabic1 = [
    ['عالمي الصغير','حرف الألف','التعرف على شكل الألف وصوته في أول الكلمة ووسطها وآخرها'],['عالمي الصغير','حرف الميم','تمييز الميم ونطقها وقراءة كلمات قصيرة بها'],['عالمي الصغير','حرف الباء','ربط صوت الباء بصور وكلمات مألوفة'],['عالمي الصغير','حرف الحاء','التمييز بين الحاء والأصوات القريبة'],['عالمي الصغير','حرف الراء والتاء','تكوين مقاطع وكلمات بسيطة'],['عالمي الصغير','حرف السين والجيم','قراءة مقاطع مع تغيير الحركة'],['عالمي الصغير','حرف النون واللام','كتابة الحرف على السطر واستخدامه في كلمة'],['عالمي الصغير','قصة النملة','الاستماع وإعادة سرد أحداث القصة'],
    ['عالمي الكبير','حرف الدال والزاي','تمييز الحرفين في كلمات وصور'],['عالمي الكبير','حرف القاف والطاء','قراءة كلمات تبدأ بالصوت المستهدف'],['عالمي الكبير','حرف الشين والذال','التحدث بجملة قصيرة عن الصورة'],['عالمي الكبير','حرف العين والواو','تكوين كلمة من مقاطع معروفة'],['عالمي الكبير','حرف الغين والصاد','التمييز السمعي والكتابي'],['عالمي الكبير','حرف الضاد والكاف','التدرب على كتابة الحرف باتجاه صحيح'],['عالمي الكبير','قصة فرح تحب الحيوانات','استخراج قيمة الرحمة من القصة']
  ];
  var arabic2 = [
    ['الطبيعة','المد بالياء','قراءة كلمات بها ياء مد وإطالة الصوت'],['الطبيعة','المد بالألف والواو','تمييز نوع المد في كلمات وصور'],['الطبيعة','أنا ونحن','استخدام الضمائر في جمل قصيرة'],['الطبيعة','قصة المغامر سالم','ترتيب الأحداث والتعبير عن المشاعر'],['الإنسان','التاء المربوطة','التعرف عليها وكتابتها في آخر الكلمة'],['الإنسان','المذكر والمؤنث','تصنيف الكلمات واستخدام هذا وهذه'],['الإنسان','الياء الملكية','التعبير عن الملكية بجملة بسيطة'],['الإنسان','قصة الورق','استنتاج قيمة المحافظة على الموارد']
  ];
  [arabic1, arabic2].forEach(function (arr, ti) { arr.forEach(function (x, i) { lesson('اللغة العربية', ti + 1, x[0], x[1], x[2], i + 1); }); review('اللغة العربية', ti + 1, ti ? 'الطبيعة والإنسان' : 'عالمي الصغير وعالمي الكبير', 80); exam('اللغة العربية', ti + 1, ti ? 'الطبيعة والإنسان' : 'الحروف والقصص', 90); });

  var eng1 = ['Hello','This is me','My school bag','It’s my birthday','With my family','Let’s play music','At home','At the Pyramids','At the beach'];
  eng1.forEach(function (u, i) { ['Vocabulary and listening','Speaking and phonics','Play time and writing'].forEach(function (skill, j) { lesson('اللغة الإنجليزية', 1, 'Unit ' + (i + 1) + ': ' + u, skill, 'Listen, point, repeat, and use the new word in a short sentence.', i * 3 + j + 1); }); });
  var eng2 = ['My body and feelings','My day','Food and health','My home','Animals around us','Stories and play'];
  eng2.forEach(function (u, i) { ['Vocabulary and sounds','Listen and speak','Read and write'].forEach(function (skill, j) { lesson('اللغة الإنجليزية', 2, 'Unit ' + (i + 1) + ': ' + u, skill, 'Use the target words in a short supported sentence.', i * 3 + j + 1); }); });
  [1,2].forEach(function (t) { review('اللغة الإنجليزية', t, 'الوحدات الأساسية', 80); exam('اللغة الإنجليزية', t, 'Vocabulary, listening and speaking', 90); });

  var discover1 = ['All About Me','Family Tree','Who Are We?','Our Community','Our Environment','Moving Around Our Environment','Growing Food in the World Around Us','Celebrating the World Around Us'];
  var discover2 = ['How Are Products Made?','How We Do Business','Buying, Selling and Saving','Telling Stories','Communicating with Numbers','Communicating Through Art'];
  [discover1, discover2].forEach(function (arr, ti) { arr.forEach(function (u, i) { ['ألاحظ وأسمي','أسأل وأجرب','أطبق وأشارك'].forEach(function (skill, j) { lesson('اكتشف', ti + 1, u, skill, 'نتعلم من الملاحظة والسؤال والتجربة، ثم نربط النتيجة بحياة الطفل.', i * 3 + j + 1); }); }); review('اكتشف', ti + 1, 'محاور اكتشف', 80); exam('اكتشف', ti + 1, 'المفاهيم والأنشطة', 90); });

  var math1 = ['الأعداد حتى 10','المقارنة والترتيب','الجمع بالصور','الأشكال والأنماط','الأعداد حتى 20'];
  var math2 = ['الطرح بالصور','الجمع والطرح حتى 20','القياس والوقت','المجسمات','البيانات والتمثيل'];
  [math1, math2].forEach(function (arr, ti) { arr.forEach(function (u, i) { ['أمثل بالصور والأشياء','أستخدم العدد أو الرمز','أحل مسألة من الحياة'].forEach(function (skill, j) { lesson('الرياضيات', ti + 1, u, skill, 'نبدأ بالمحسوس، ثم ننتقل إلى الرمز، ونراجع معقولية الإجابة.', i * 3 + j + 1); }); }); review('الرياضيات', ti + 1, 'الأعداد والعمليات والقياس', 80); exam('الرياضيات', ti + 1, 'تطبيقات الأعداد والعمليات', 90); });

  var religion = ['الله خالقي','النظافة والطهارة','الصدق والأمانة','بر الوالدين','الصلاة والدعاء','الرحمة والتعاون','آداب التعامل','الشكر والمسؤولية'];
  var values = ['أتعرف نفسي','أحترم أسرتي','أشارك زملائي','أحافظ على ممتلكاتي','أقبل الاختلاف','أحل المشكلة بهدوء','أحافظ على بيئتي','أكون مسؤولًا'];
  [religion, values].forEach(function (arr) { var subject = arr === religion ? 'التربية الدينية' : 'القيم واحترام الآخر'; [1,2].forEach(function (t) { arr.slice((t-1)*4,t*4).forEach(function (u,i) { ['أفهم الفكرة','أمثلها في موقف','أراجع سلوكي'].forEach(function (skill,j) { lesson(subject,t,u,skill,'نحول الفكرة إلى سلوك يومي محترم وآمن.',i*3+j+1); }); }); review(subject,t,'القيم والسلوك',80); exam(subject,t,'مواقف تطبيقية',90); }); });

  all.push({ id: 'g1d-sources', title: 'خريطة مصادر الصف الأول الرسمية', content: 'كتب وزارة التربية والتعليم وفهرس الكتب:\n' + SOURCE + '\n\nالمكتبة الإلكترونية لوزارة التربية والتعليم:\nhttps://ellibrary.moe.gov.eg/Books/Books-Primary', subject: 'اكتشف', grade: 'الأول', stage: 'primary', term: 1, type: 'lessons', order: 0, sourceUrl: SOURCE, created_at: '2026-10-25T00:00:00.000Z' });
  function seed() { var old = []; try { old = JSON.parse(localStorage.getItem('offline_lessons') || '[]'); } catch (e) {} var ids = {}; old.forEach(function (x) { if (x && x.id) ids[x.id] = true; }); localStorage.setItem('offline_lessons', JSON.stringify(old.concat(all.filter(function (x) { return !ids[x.id]; })))); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', seed); else seed();
})();
