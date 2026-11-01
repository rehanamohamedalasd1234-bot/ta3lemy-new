/* الصف الخامس الابتدائي — طبقة ربط المواد بالمسار الموحد
   تعتمد على primary-grades456-detailed-content.json ولا تستبدل مسارات الصف الأول أو الإعدادي. */
(function(){'use strict';
  var oldOpenGrade=window.openGrade, oldOpenSubject=window.openSubject;
  var SOURCE='https://ellibrary.moe.gov.eg/Books/Books-Primary';
  var subjects=[
    {id:'arabic',name:'اللغة العربية',icon:'📖',color:'#C2185B'},
    {id:'math',name:'الرياضيات',icon:'🔢',color:'#1976D2'},
    {id:'english',name:'اللغة الإنجليزية',icon:'🇬🇧',color:'#303F9F'},
    {id:'science',name:'العلوم',icon:'🔬',color:'#388E3C'},
    {id:'social',name:'الدراسات الاجتماعية',icon:'🌍',color:'#00838F'},
    {id:'religion',name:'التربية الدينية',icon:'🕌',color:'#2E7D32'},
    {id:'values',name:'القيم واحترام الآخر',icon:'🤝',color:'#F57C00'},
    {id:'vocational',name:'المهارات المهنية',icon:'🛠️',color:'#6D4C41'},
    {id:'ict',name:'تكنولوجيا المعلومات والاتصالات',icon:'💻',color:'#455A64'},
    {id:'calligraphy',name:'الخط العربي',icon:'✍️',color:'#8E24AA'}
  ];
  var dataPromise=null;
  function isGrade5(){return window.currentStage==='primary'&&window.currentGrade==='الخامس';}
  function screen(id){if(window.screenHistory)window.screenHistory.push(window.currentScreen);if(window.showScreen)window.showScreen(id);}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function loadData(){if(!dataPromise)dataPromise=fetch('./primary-grades456-detailed-content.json').then(function(r){if(!r.ok)throw Error('تعذر تحميل بيانات الصف الخامس');return r.json()});return dataPromise}
  function subjectsScreen(){
    var l=document.getElementById('subjectsList'),t=document.getElementById('subjectsTitle');
    if(t)t.textContent='الصف الخامس الابتدائي — المواد';
    var html='<div style="background:linear-gradient(135deg,#E3F2FD,#E8F5E9);border-radius:20px;padding:18px;margin-bottom:14px;text-align:center"><div style="font-size:42px">🎒📚</div><h2 style="color:#1565C0;margin:8px 0">مواد الصف الخامس الابتدائي</h2><p style="line-height:1.8;margin:0">اختر المادة ثم الترم، وبعدها افتح الدروس أو التدريبات أو الامتحانات أو المراجعات.</p></div><div class="subjects-grid">';
    html+=subjects.map(function(s){return '<button class="subject-card" data-g5-subject="'+esc(s.name)+'" style="border:2px solid '+s.color+';background:#fff;padding:14px"><div class="subject-icon" style="background:'+s.color+'20;color:'+s.color+'">'+s.icon+'</div><div class="subject-name">'+s.name+'<br><small>محتوى الترمين والتقييمات</small></div></button>'}).join('');
    html+='</div><div style="margin-top:14px;text-align:center"><a href="'+SOURCE+'" target="_blank" rel="noopener" style="color:#1565C0;font-weight:bold">فتح كتب الوزارة الرسمية</a></div>';
    if(l)l.innerHTML=html;
    document.querySelectorAll('[data-g5-subject]').forEach(function(b){b.onclick=function(){openSubject2(b.dataset.g5Subject)}});
  }
  function openSubject2(name){window.currentSubject=name;var t=document.getElementById('termsTitle'),h=document.getElementById('termsHeader'),l=document.getElementById('termsList');if(t)t.textContent=name;if(h)h.textContent='الصف الخامس — '+name;var terms=[1,2];l.innerHTML='<div class="lesson-body" style="margin-bottom:14px"><p>المحتوى التعليمي للصف الخامس — '+name+' — مرتب داخل الترمين والأقسام الأساسية.</p></div>'+terms.map(function(n){return '<div class="term-card '+(n===2?'term-2':'')+'"><div class="term-header"><div class="term-icon">'+(n===1?'📘':'📙')+'</div><div class="term-title">الترم '+(n===1?'الأول':'الثاني')+'</div><div class="term-count">محتوى متاح</div></div><div class="term-sections"><button class="section-chip" data-g5-open="lessons" data-g5-term="'+n+'">📄 الدروس</button><button class="section-chip" data-g5-open="exercises" data-g5-term="'+n+'">✏️ التدريبات</button><button class="section-chip" data-g5-open="exams" data-g5-term="'+n+'">📝 الامتحانات</button><button class="section-chip" data-g5-open="reviews" data-g5-term="'+n+'">🔁 المراجعات</button><button class="section-chip" data-g5-open="videos" data-g5-term="'+n+'">🎥 الفيديوهات</button></div></div>'}).join('');
    document.querySelectorAll('[data-g5-open]').forEach(function(b){b.onclick=function(){openContent2(b.dataset.g5Open,Number(b.dataset.g5Term))}});screen('termsScreen');
  }
  function openContent2(type,term){var l=document.getElementById('contentList'),title=document.getElementById('contentTitle'),head=document.getElementById('contentHeaderTitle'),sub=document.getElementById('contentHeaderSub');var labels={lessons:'📄 الدروس',exercises:'✏️ التدريبات',exams:'📝 الامتحانات',reviews:'🔁 المراجعات',videos:'🎥 الفيديوهات'};if(title)title.textContent=labels[type];if(head)head.textContent=window.currentSubject+' — الترم '+(term===1?'الأول':'الثاني');if(sub)sub.textContent='الصف الخامس الابتدائي';if(l)l.innerHTML='<div class="empty-state"><p>⏳ جاري تحميل المحتوى...</p></div>';screen('contentScreen');loadData().then(function(all){var rows=all.filter(function(x){return x.grade==='الخامس'&&x.subject===window.currentSubject&&Number(x.term)===term&&(x.type===type||(type==='reviews'&&x.type==='exams'));});if(!rows.length){l.innerHTML='<div class="empty-state"><div class="empty-state-icon">📭</div><p>لا يوجد محتوى محفوظ لهذا القسم بعد.</p></div>';return}rows.sort(function(a,b){return (a.order||99)-(b.order||99)});l.innerHTML=rows.map(function(x,i){return '<button class="content-item" data-g5-item="'+i+'" style="width:100%;text-align:right;border:0"><div class="content-item-icon">'+(type==='exams'?'📝':type==='exercises'?'✏️':'📘')+'</div><div class="content-item-info"><div class="content-item-title">'+esc(x.title)+'</div><div class="content-item-sub">'+esc((x.content||'').slice(0,90))+'</div></div><div class="content-item-arrow">‹</div></button>'}).join('');document.querySelectorAll('[data-g5-item]').forEach(function(b){b.onclick=function(){view2(rows[Number(b.dataset.g5Item)])}})}).catch(function(){l.innerHTML='<div class="empty-state"><p>⚠️ تعذر تحميل بيانات الصف الخامس. تحقق من الاتصال ثم أعد المحاولة.</p></div>'})}
  function view2(x){var l=document.getElementById('contentList'),title=document.getElementById('contentTitle');if(title)title.textContent=x.title;l.innerHTML='<article class="lesson-body"><h2>'+esc(x.title)+'</h2>'+(x.image_url?'<img src="'+x.image_url+'" alt="صورة تعليمية" style="width:100%;border-radius:12px">':'')+'<div style="white-space:pre-line;line-height:2">'+esc(x.content||'')+'</div>'+(x.question?'<h3>سؤال التحقق</h3><p>'+esc(x.question)+'</p>':'')+(x.answer?'<details><summary>إظهار الإجابة النموذجية</summary><p>'+esc(x.answer)+'</p></details>':'')+'<button class="section-chip" id="g5Speak">🔊 استمع إلى الشرح</button>'+(x.sourceUrl?'<p><a href="'+x.sourceUrl+'" target="_blank">المصدر التعليمي</a></p>':'')+'</article>';var b=document.getElementById('g5Speak');if(b)b.onclick=function(){if('speechSynthesis' in window){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance((x.title||'')+'. '+(x.content||''));u.lang='ar-EG';speechSynthesis.speak(u)}}}
  window.openGrade=function(id,name){if(id==='primary'&&name==='الخامس'){window.currentStage='primary';window.currentGrade='الخامس';subjectsScreen();screen('subjectsScreen');return}return oldOpenGrade.apply(this,arguments)};
  window.openSubject=function(id,name){if(isGrade5())return openSubject2(name||id);return oldOpenSubject.apply(this,arguments)};
})();
