/* المرحلة الأولى من المنهج التفصيلي للصف الثاني الابتدائي */
(function () {
  'use strict';
  var SOURCE = 'https://edu2-egypt.com/grade-2';
  var all = [];
  function add(x) { all.push(Object.assign({ grade: 'الثاني', stage: 'primary', sourceUrl: SOURCE, created_at: '2026-10-25T00:00:00.000Z' }, x)); }
  function visual(subject, title) {
    var icon = subject === 'الرياضيات' ? '🔢' : subject === 'اللغة الإنجليزية' ? '🔤' : subject === 'اكتشف' ? '🌍' : subject === 'التربية الدينية' ? '🕌' : subject === 'القيم واحترام الآخر' ? '🤝' : '📖';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="420" viewBox="0 0 900 420"><rect width="900" height="420" rx="36" fill="#E3F2FD"/><circle cx="140" cy="210" r="92" fill="#BBDEFB"/><text x="140" y="240" text-anchor="middle" font-size="92">' + icon + '</text><text x="500" y="190" text-anchor="middle" font-family="Arial" font-size="34" fill="#0D47A1">الصف الثاني الابتدائي</text><text x="500" y="245" text-anchor="middle" font-family="Arial" font-size="26" fill="#1565C0">' + title + '</text></svg>');
  }
  function lesson(subject, term, unit, title, explanation, order) {
    add({ id: 'g2d-' + term + '-' + order + '-lesson-' + subject, title: unit + ' — ' + title, subject: subject, term: term, type: 'lessons', order: order, image_url: visual(subject, title), content: 'شرح الدرس: ' + explanation + '\n\nطريقة التعلم: نقرأ المثال أو نلاحظ الصورة، نحدد المهارة المطلوبة، ثم ننفذها خطوة خطوة.\n\nنشاط تفاعلي: المس العنصر التعليمي، انطق الكلمة أو العدد، ثم ارسم تطبيقًا جديدًا.\n\nتحقق من الفهم: اشرح كيف وصلت إلى إجابتك، وليس الإجابة فقط.' });
    add({ id: 'g2d-' + term + '-' + order + '-exercise-' + subject, title: 'تدريب متدرج — ' + unit + ' — ' + title, subject: subject, term: term, type: 'exercises', order: order, content: 'تدريب 1: تعرف على المثال.\nتدريب 2: أكمل أو رتب أو صل.\nتدريب 3: طبّق المهارة في موقف جديد.\nتدريب 4: اشرح طريقة الحل لشخص آخر.', question: 'أنشئ مثالًا جديدًا للمهارة، ثم وضح خطواتك.', answer: 'تقبل الإجابة التي توضح المهارة وتطبقها في موقف صحيح.' });
  }
  function review(s,t,label,o){add({id:'g2d-'+t+'-'+o+'-review-'+s,title:'مراجعة شاملة — '+label,subject:s,term:t,type:'reviews',order:o,content:'مراجعة منظمة: استرجع المفاهيم، نفذ تدريبًا قصيرًا، ثم اشرح فكرة رئيسية بصوتك.\n\nبطاقة التقييم: أتعرف المهارة، أطبقها، أتحقق من الحل، وأطلب المساعدة عند الحاجة.',question:'ما المهارة التي أتقنتها؟ وما المهارة التي تحتاج إلى تدريب؟',answer:'إجابة تأملية مرتبطة بموضوعات الوحدة.'});}
  function exam(s,t,label,o){add({id:'g2d-'+t+'-'+o+'-exam-'+s,title:'اختبار شامل — '+label,subject:s,term:t,type:'exams',order:o,content:'اختبار قصير متدرج: سؤال معرفة، سؤال تطبيق، سؤال تفكير، ثم سؤال مراجعة ذاتية. الزمن المقترح 15 دقيقة.\n\nيناقش الطالب إجابة واحدة بعد انتهاء الاختبار.',question:'حل السؤال ثم اشرح سبب اختيارك.',answer:'تراجع الإجابة حسب المهارة، وتقبل الإجابة المكتوبة أو الشفهية أو المصورة.'});}
  var map = {
    'اكتشف': {
      1:['A Day in My Life','Taking Care of Me','When I Grow Up','What Is in the Night Sky?','Helping My Habitat','Monumental Designs'],
      2:['النيل الذي أعرفه','المدن المصرية','الحياة على ضفاف النيل','التواصل في مجتمعنا','التعبير عن الثقافات','أدوات التواصل']
    },
    'اللغة الإنجليزية': {
      1:['Unit 1: Meet my family','Unit 2: My body','Unit 3: Off to school','Unit 4: Time to play sports','Unit 5: My day','Unit 6: Healthy lunches'],
      2:['My community','My home and neighborhood','Healthy choices','Animals and habitats','Stories and information','Projects and communication']
    },
    'اللغة العربية': {
      1:['أسرتي ومجتمعي','القراءة والفهم','الاسم والفعل والحرف','المفرد والجمع','المدود والتنوين','التعبير عن يومي'],
      2:['الطبيعة من حولي','قصص وقيم','الجملة الاسمية والفعلية','المذكر والمؤنث','علامات الترقيم','كتابة فقرة قصيرة']
    },
    'الرياضيات': {
      1:['الأعداد والقيمة المكانية','المقارنة والترتيب','الجمع حتى 100','الطرح حتى 100','الأشكال والأنماط','القياس والبيانات'],
      2:['الضرب كمجموعات متساوية','القسمة بالتوزيع','الكسور البسيطة','الوقت والنقود','الطول والكتلة والسعة','حل المسائل متعددة الخطوات']
    },
    'التربية الدينية': {
      1:['الله والنعم','النظافة والطهارة','الصدق والأمانة','الصلاة والدعاء'],
      2:['الرحمة والتعاون','بر الوالدين وصلة الرحم','آداب التعامل','المسؤولية والشكر']
    },
    'القيم واحترام الآخر': {
      1:['أنا عضو في أسرتي','أتعلم مع فريقي','أحافظ على أدواتي','أحترم دوري ودور غيري'],
      2:['أحل المشكلة بالحوار','أقبل الاختلاف','أحمي بيئتي ومجتمعي','أستخدم التقنية بأمان']
    }
  };
  var explanations = {
    'اكتشف':'نلاحظ الظاهرة ونطرح سؤالًا ونستخدم دليلًا بسيطًا، ثم نربط التعلم بحياة الطالب ودوره في مجتمعه.',
    'اللغة الإنجليزية':'We learn the words and sentence pattern, listen carefully, speak with a partner, then read and write a short response.',
    'اللغة العربية':'نقرأ النص أو المثال، نحدد المعنى، نطبق القاعدة، ثم نستخدم الكلمة أو الجملة في موقف جديد.',
    'الرياضيات':'نمثل المسألة بالأشياء أو الرسم، نختار العملية، ننفذ الخطوات، ثم نتحقق من معقولية الإجابة.',
    'التربية الدينية':'نفهم المعنى ونربطه بسلوك يومي يظهر في الصدق والنظافة والرحمة وتحمل المسؤولية.',
    'القيم واحترام الآخر':'نستمع إلى الموقف، نحدد المشاعر والحقوق، نختار حلًا آمنًا وعادلًا، ثم نراجع أثره.'
  };
  Object.keys(map).forEach(function (subject) { [1,2].forEach(function (term) { map[subject][term].forEach(function (unit,i) { ['أتعرف الفكرة والمفردات','أطبق المهارة بالنشاط','أشرح وأنتج مثالًا'].forEach(function (title,j) { lesson(subject,term,unit,title,explanations[subject],i*3+j+1); }); }); review(subject,term,'وحدات الترم',80); exam(subject,term,'المهارات والمفاهيم',90); }); });
  all.push({id:'g2d-sources',title:'خريطة مصادر الصف الثاني الرسمية',content:'فهرس كتب الصف الثاني وأدلة المعلم:\n'+SOURCE+'\n\nالمكتبة الإلكترونية لوزارة التربية والتعليم:\nhttps://ellibrary.moe.gov.eg/Books/Books-Primary',subject:'اكتشف',grade:'الثاني',stage:'primary',term:1,type:'lessons',order:0,sourceUrl:SOURCE,created_at:'2026-10-25T00:00:00.000Z'});
  function seed(){var old=[];try{old=JSON.parse(localStorage.getItem('offline_lessons')||'[]')}catch(e){}var ids={};old.forEach(function(x){if(x&&x.id)ids[x.id]=true});localStorage.setItem('offline_lessons',JSON.stringify(old.concat(all.filter(function(x){return !ids[x.id]}))))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',seed);else seed();
})();
