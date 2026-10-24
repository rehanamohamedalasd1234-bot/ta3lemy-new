// Original interactive learning content for Grade 8 Mathematics, Term 1 (Egypt 2026/2027).
// Lesson scope follows the Ministry student-book contents page; explanations and assessments are original.
(function () {
  'use strict';

  var NOTICE = 'هذا شرح وتدريب أصليان متوافقان مع فهرس كتاب الوزارة للرياضيات، الصف الثاني الإعدادي، الترم الأول 2026/2027، وليسا نقلاً حرفياً من الكتاب.';

  function mc(q, options, answer, why, id) {
    return { id: id || '', q: q, options: options, answer: answer, why: why };
  }
  function wr(q, answerText, points, rubric, id) {
    return { id: id || '', q: q, answerText: answerText, answerModel: answerText, points: points, rubric: rubric };
  }

  var units = [
    {
      id: 'real-numbers', title: 'الوحدة الأولى: الأعداد والعمليات عليها', lessons: [
        { id: 'real-number-system', title: '1. الأعداد الحقيقية', explain: ['الأعداد الحقيقية تضم الأعداد النسبية وغير النسبية. يمكن تمثيل كل عدد حقيقي بنقطة على خط الأعداد.', 'العدد النسبي يمكن كتابته في صورة كسر a/b حيث b لا يساوي صفراً؛ ومنه الأعداد الصحيحة والكسور والعشريات المنتهية أو الدورية. العدد غير النسبي لا يكتب بهذه الصورة، وتمثيله العشري غير منتهٍ وغير دوري.', 'الجذر التربيعي لعدد موجب يكون غير نسبي إذا لم يكن العدد مربعاً كاملاً؛ فـ √2 غير نسبي، بينما √9=3 نسبي.'], example: '√49=7 عدد نسبي، أما √5 فعدد غير نسبي؛ وكلاهما عدد حقيقي.', key: 'كل عدد نسبي أو غير نسبي عدد حقيقي. افحص إن كان الجذر لمربع كامل، وهل التمثيل العشري منتهٍ أو دوري.', questions: [mc('أي الأعداد الآتية غير نسبي؟',['−3/4','0.125','√7','2.5'],2,'√7 ليس جذراً لمربع كامل، لذلك لا يكتب في صورة كسر نسبي.','g8-rn-l1-q1'), mc('أي عبارة صحيحة عن العدد −8؟',['عدد غير حقيقي','عدد صحيح ونسبي وحقيقي','عدد غير نسبي','عدد طبيعي'],1,'−8 عدد صحيح، ويمكن كتابته −8/1، لذا فهو نسبي وحقيقي.','g8-rn-l1-q2')] },
        { id: 'intervals', title: '2. الفترات والعمليات عليها', explain: ['الفترة طريقة مختصرة لتمثيل مجموعة من الأعداد الحقيقية بين حدين. القوسان المربعان يعنيان أن الطرف داخل الفترة، والقوسان المستديران يعنيان أنه غير داخلها.', 'الفترة [a,b] تضم a وb، أما (a,b) فلا تضم أياً منهما. نستخدم ∪ للاتحاد و∩ للتقاطع، مع الانتباه إلى الأطراف المفتوحة والمغلقة.', 'على خط الأعداد تمثل الفترة قطعة بين الحدين؛ دائرة مصمتة للطرف المغلق ودائرة فارغة للطرف المفتوح.'], example: 'تقاطع [1,5) مع (3,7] هو (3,5)، لأن الأعداد المشتركة أكبر من 3 وأقل من 5.', key: 'القوس المربع يشمل الطرف، والمستدير يستبعده. التقاطع هو الجزء المشترك والاتحاد يضم عناصر الفترتين.', questions: [mc('ما تقاطع [1,5) و(3,7]؟',['[1,3)','(3,5)','[3,5]','(5,7]'],1,'الأعداد المشتركة أكبر من 3 وأقل من 5؛ فالطرف 3 مفتوح و5 غير موجود في الفترة الأولى.','g8-rn-l2-q1'), mc('أي فترة تمثل −2≤x<4؟',['(−2,4)','[−2,4]','[−2,4)','(−2,4]'],2,'العدد −2 مشمول، أما 4 فمستبعد.','g8-rn-l2-q2')] },
        { id: 'real-operations', title: '3. العمليات على الأعداد الحقيقية', explain: ['تجرى عمليات الجمع والطرح والضرب والقسمة على الأعداد الحقيقية وفق خواصها، مع مراعاة ترتيب العمليات. لا تجوز القسمة على صفر.', 'الجمع والضرب تبديليان وتجميعيان، أما الطرح والقسمة فليسا كذلك. التوزيع يربط الضرب بالجمع: a(b+c)=ab+ac.', 'يمكن تقدير الناتج أو استخدام خواص الأعداد لتبسيط الحساب، ثم التحقق من الإشارة والحجم التقريبي.'], example: '−3(2−5)+4=−3(−3)+4=9+4=13.', key: 'احسب الأقواس أولاً، ثم الأسس، فالضرب والقسمة، فالجمع والطرح. لا تقسم على صفر.', questions: [mc('احسب −3(2−5)+4.',['−13','5','13','−5'],2,'داخل القوس −3؛ ثم −3×−3+4=9+4=13.','g8-rn-l3-q1'), mc('أي خاصية تمثلها 5(2+7)=5×2+5×7؟',['الإبدال','التوزيع','التجميع','المحايد الجمعي'],1,'ضُرب العامل 5 في كل حد داخل القوس؛ هذه خاصية التوزيع.','g8-rn-l3-q2')] },
        { id: 'radical-laws', title: '4. قوانين الجذور التربيعية والتكعيبية', explain: ['لـ a,b غير سالبين: √a×√b=√(ab)، و√a÷√b=√(a/b) عندما b>0. ويمكن إخراج المربع الكامل من الجذر: √(a²b)=a√b إذا كان a≥0.', 'تتشابه قوانين الجذر التكعيبي مع الضرب والقسمة، وتصح للأعداد الحقيقية: ∛a×∛b=∛(ab). الجذر التكعيبي يحافظ على إشارة العدد.', 'لا يجوز جمع الجذور غير المتشابهة: √2+√3 لا يساوي √5. نبسط كل جذر أولاً ثم نجمع الحدود المتشابهة فقط.'], example: '√72=√(36×2)=6√2، و∛(−64)=−4 لأن (−4)³=−64.', key: 'بسّط بإخراج مربع كامل أو مكعب كامل، واستخدم قانون الضرب أو القسمة عند انطباقه. لا تجمع جذوراً غير متشابهة.', questions: [mc('بسّط √72.',['6√2','3√8','12√2','36√2'],0,'72=36×2؛ إذن √72=6√2.','g8-rn-l4-q1'), mc('ما قيمة ∛(−125)؟',['−25','−5','5','25'],1,'(−5)³=−125.','g8-rn-l4-q2')] },
        { id: 'exponent-laws', title: '5. قوانين الأسس في الأعداد الحقيقية', explain: ['عند ضرب قوتين لهما الأساس نفسه نجمع الأسس: aᵐ×aⁿ=aᵐ⁺ⁿ. وعند القسمة نطرح الأسس بشرط ألا يكون الأساس صفراً.', 'قوة القوة تعني ضرب الأسين: (aᵐ)ⁿ=aᵐⁿ، كما أن (ab)ⁿ=aⁿbⁿ. وللأس الموجب a⁻ⁿ=1/aⁿ عندما a≠0، وa⁰=1 عندما a≠0.', 'الأس السالب لا يجعل قيمة القوة سالبة؛ بل يدل على المقلوب. رتّب الأقواس قبل تطبيق القوانين.'], example: '2³×2⁴=2⁷=128، و3⁻²=1/3²=1/9.', key: 'الضرب: نجمع الأسس؛ القسمة: نطرحها؛ قوة القوة: نضرب الأسس؛ والأس السالب يعني مقلوب القوة.', questions: [mc('بسّط x⁴×x³ حيث x≠0.',['x','x⁷','x¹²','2x⁷'],1,'عند ضرب قوتين لهما الأساس نفسه نجمع الأسين: 4+3=7.','g8-rn-l5-q1'), mc('ما قيمة 2⁻³؟',['−8','−1/8','1/8','8'],2,'2⁻³=1/2³=1/8.','g8-rn-l5-q2')] }
      ],
      exercises: [mc('أي عدد غير نسبي؟',['√16','−2/3','√11','0.4'],2,'11 ليس مربعاً كاملاً.','g8-rn-ex1-q1'),mc('ما اتحاد [−1,2] و(2,5)؟',['[−1,5)','(−1,5]','[−1,2]','(2,5)'],0,'العدد 2 موجود في الفترة الأولى؛ الاتحاد يمتد من −1 مشمولاً إلى 5 غير مشمول.','g8-rn-ex1-q2'),mc('احسب 4−2(3−7).',['−4','4','12','16'],2,'4−2(−4)=4+8=12.','g8-rn-ex1-q3'),mc('بسّط √50.',['5√2','25√2','10√5','2√5'],0,'√50=√(25×2)=5√2.','g8-rn-ex1-q4'),mc('بسّط y⁶÷y² حيث y≠0.',['y³','y⁴','y⁸','y¹²'],1,'نطرح الأسس: 6−2=4.','g8-rn-ex1-q5')],
      writtenExercises: [wr('بسّط √48+√12، واكتب خطوات إخراج المربعات الكاملة.','√48=4√3، و√12=2√3؛ إذن √48+√12=6√3.',2,[{criterion:'تبسيط الجذرين إلى 4√3 و2√3.',points:1},{criterion:'جمع الحدود المتشابهة والحصول على 6√3.',points:1}],'g8-rn-ex1-w1')]
    },
    {
      id: 'algebra', title: 'الوحدة الثانية: الجبر', lessons: [
        { id: 'gcf-factor', title: '6. التحليل بإخراج العامل المشترك الأكبر', explain: ['تحليل المقدار بإخراج العامل المشترك الأكبر هو كتابة المقدار حاصل ضرب عامل مشترك في مقدار آخر.', 'أوجد أكبر عدد أو حد جبري يقسم جميع الحدود، ثم اقسم كل حد عليه. افحص الحل بإعادة الضرب.', 'إذا كان العامل المشترك سالباً، يمكن إخراجه لتسهيل جعل الحد الأول داخل القوس موجباً.'], example: '6x²+9x=3x(2x+3)، والتحقق بالتوزيع يعيد المقدار الأصلي.', key: 'أوجد القاسم العددي المشترك وأقل أس لكل متغير، أخرجه ثم تحقق بالتوزيع.', questions: [mc('حلل 12x²−8x تحليلاً كاملاً.',['4x(3x−2)','2x(6x−8)','4(3x²−2x)','8x(3x−1)'],0,'العامل المشترك الأكبر 4x، والناتج 4x(3x−2).','g8-alg-l6-q1'), mc('ما العامل المشترك الأكبر في 15a³b و10a²b²؟',['5ab','5a²b','10a²b','5a³b²'],1,'القاسم العددي 5، وأقل أس لـa هو 2 ولـb هو 1.','g8-alg-l6-q2')] },
        { id: 'trinomial-factor', title: '7. تحليل ثلاثية الحدود', explain: ['لتحليل x²+bx+c نبحث عن عددين حاصل ضربهما c ومجموعهما b، ثم نكتب المقدار في صورة حاصل ضرب قوسين.', 'إذا كان معامل x² يساوي 1، فإن (x+m)(x+n)=x²+(m+n)x+mn. تحقّق بإعادة الضرب.', 'قد لا توجد أعداد صحيحة تحقق الشرط؛ عندها لا يتحلل المقدار على الأعداد الصحيحة بهذه الطريقة.'], example: 'x²+7x+12=(x+3)(x+4)، لأن 3×4=12 و3+4=7.', key: 'ابحث عن عددين حاصل ضربهما الحد الثابت ومجموعهما معامل x، ثم تحقق بالتوزيع.', questions: [mc('حلل x²+9x+20.',['(x+2)(x+10)','(x+4)(x+5)','(x−4)(x−5)','(x+1)(x+20)'],1,'4×5=20 و4+5=9.','g8-alg-l7-q1'), mc('حلل x²−x−12.',['(x−4)(x+3)','(x+4)(x−3)','(x−6)(x+2)','(x−12)(x+1)'],0,'−4×3=−12 ومجموعهما −1.','g8-alg-l7-q2')] },
        { id: 'special-factor', title: '8. تحليل الحالات الخاصة', explain: ['فرق المربعين: a²−b²=(a−b)(a+b). والمقدار a²+2ab+b² مربع كامل يساوي (a+b)²، أما a²−2ab+b²=(a−b)².', 'تعرّف على الحالة من الحدين أو الثلاثة حدود، وتأكد أن الحدود مربعات كاملة وأن الحد الأوسط يساوي ضعفي حاصل ضرب الجذرين.', 'افحص التحليل بالتوزيع؛ فجمع مربعين مثل a²+b² لا يتحلل بهذه القاعدة على الأعداد الحقيقية.'], example: '9x²−25=(3x−5)(3x+5)، فهو فرق مربعين.', key: 'فرق مربعين يتحلل إلى الفرق في المجموع. ثلاثية المربع الكامل لها حد أوسط يساوي ±ضعفي حاصل ضرب الجذرين.', questions: [mc('حلل 4x²−49.',['(2x−7)²','(2x−7)(2x+7)','(4x−7)(x+7)','(2x−49)(2x+1)'],1,'4x²−49=(2x)²−7²؛ فرق مربعين.','g8-alg-l8-q1'), mc('اكتب x²+10x+25 في صورة تحليل.',['(x+5)²','(x−5)²','(x+25)²','(x+2)(x+8)'],0,'الحدان x² و25 مربعان، والحد الأوسط 10x=2×x×5.','g8-alg-l8-q2')] },
        { id: 'grouping-factor', title: '9. التحليل بالتقسيم', explain: ['نستخدم التحليل بالتقسيم عندما يمكن تقسيم حدود المقدار إلى مجموعات، واستخراج عامل مشترك من كل مجموعة.', 'بعد إخراج العوامل، يجب أن يظهر المقدار نفسه بين القوسين؛ حينها نخرج ذلك المقدار عاملاً مشتركاً.', 'جرّب ترتيب الحدود أو تقسيمها بطريقة أخرى إذا لم يظهر عامل ثنائي مشترك. ثم تحقق بإعادة الضرب.'], example: 'ax+ay+bx+by=a(x+y)+b(x+y)=(a+b)(x+y).', key: 'قسّم الحدود إلى مجموعات، أخرج عاملاً من كل مجموعة، ثم أخرج المقدار المشترك بين القوسين.', questions: [mc('حلل بالتقسيم ax+ay+3x+3y.',['(a+3)(x+y)','(a+x)(3+y)','(a+3)(x−y)','(a−3)(x+y)'],0,'a(x+y)+3(x+y)=(a+3)(x+y).','g8-alg-l9-q1'), mc('حلل x²+2x+3x+6 بالتقسيم.',['(x+2)(x+3)','(x−2)(x−3)','(x+1)(x+6)','(x+2)(x−3)'],0,'x(x+2)+3(x+2)=(x+3)(x+2).','g8-alg-l9-q2')] }
      ],
      exercises: [mc('حلل 18x+24.',['6(3x+4)','3(6x+4)','6(3x+24)','18(x+24)'],0,'العامل المشترك الأكبر 6.','g8-alg-ex2-q1'),mc('حلل x²+8x+15.',['(x+3)(x+5)','(x+1)(x+15)','(x−3)(x−5)','(x+2)(x+6)'],0,'3×5=15 ومجموعهما 8.','g8-alg-ex2-q2'),mc('حلل 25y²−1.',['(5y−1)²','(5y−1)(5y+1)','(25y−1)(y+1)','(5y+1)²'],1,'فرق مربعين.','g8-alg-ex2-q3'),mc('حلل 2x+2y+ax+ay.',['(a+2)(x+y)','(a+x)(2+y)','(a−2)(x+y)','(a+2)(x−y)'],0,'2(x+y)+a(x+y)=(a+2)(x+y).','g8-alg-ex2-q4')],
      writtenExercises: [wr('حلل x²+5x−24، ثم تحقق بضرب العاملين.','نبحث عن عددين حاصل ضربهما −24 ومجموعهما 5؛ هما 8 و−3. إذن x²+5x−24=(x+8)(x−3). وبالضرب نحصل على x²+5x−24.',3,[{criterion:'اختيار العددين 8 و−3 مع تحقق حاصل الضرب والمجموع.',points:1},{criterion:'كتابة التحليل الصحيح (x+8)(x−3).',points:1},{criterion:'التحقق بإعادة الضرب.',points:1}],'g8-alg-ex2-w1')]
    },
    {
      id: 'geometry', title: 'الوحدة الثالثة: الهندسة', lessons: [
        { id: 'congruence', title: '10. التطابق', explain: ['الشكلان المتطابقان لهما الشكل والحجم نفسيهما؛ تقابل الأضلاع المتناظرة المتساوية والزوايا المتناظرة المتساوية.', 'تثبت مطابقة مثلثين بإحدى الحالات: ضلع-ضلع-ضلع، ضلع-زاوية محصورة-ضلع، أو زاوية-ضلع-زاوية. لا تكفي مساواة ثلاث زوايا وحدها لإثبات التطابق.', 'بعد إثبات تطابق المثلثين، تكون العناصر المتناظرة متساوية. احرص على كتابة الرؤوس بالترتيب الذي يحدد التناظر.'], example: 'إذا كان AB=DE وAC=DF و∠A=∠D، فالزاوية محصورة بين الضلعين المتساويين؛ إذن المثلثان متطابقان بحالة ضلع-زاوية-ضلع.', key: 'حدّد التناظر ثم تحقق من تساوي عناصر كافية لإحدى حالات التطابق الثلاث.', questions: [mc('أي مجموعة معطيات تكفي لحالة ضلع-زاوية-ضلع؟',['ثلاثة أضلاع متناظرة','ضلعان والزاوية المحصورة بينهما','زاويتان وضلع غير محصور','ثلاث زوايا فقط'],1,'حالة ضلع-زاوية-ضلع تتطلب تساوي ضلعين والزاوية المحصورة بينهما.','g8-geo-l10-q1'), mc('إذا تطابق مثلثان، فإن الأضلاع المتناظرة:',['متوازية دائماً','متساوية','متعامدة','مختلفة'],1,'التطابق يضمن تساوي الأضلاع والزوايا المتناظرة.','g8-geo-l10-q2')] },
        { id: 'pythagorean', title: '11. نظرية فيثاغورس وعكسها', explain: ['في المثلث القائم، مربع طول الوتر يساوي مجموع مربعي طولي الضلعين القائمين: c²=a²+b²، حيث c هو الوتر المقابل للزاوية القائمة.', 'لإيجاد ضلع مجهول عوّض بالأطوال ثم خذ الجذر التربيعي الموجب للطول. لا تطبق النظرية على مثلث غير قائم.', 'عكس النظرية: إذا كان مربع أكبر ضلع يساوي مجموع مربعي الضلعين الآخرين، فالمثلث قائم والضلع الأكبر وتره.'], example: 'ضلعان قائمان طولهما 6 و8؛ الوتر =√(36+64)=√100=10.', key: 'حدد الوتر أولاً. في المثلث القائم c²=a²+b²؛ والعكس يختبر إذا كانت الأطوال تصنع مثلثاً قائماً.', questions: [mc('مثلث قائم ضلعاه القائمان 5 و12. طول الوتر؟',['13','17','√119','7'],0,'الوتر²=5²+12²=169؛ إذن الوتر 13.','g8-geo-l11-q1'), mc('الأطوال 6، 8، 10 تصنع مثلثاً:',['قائماً لأن 6²+8²=10²','قائماً لأن 6+8=10','متساوي الساقين','لا تصنع مثلثاً'],0,'36+64=100؛ وهذا يحقق عكس نظرية فيثاغورس.','g8-geo-l11-q2')] },
        { id: 'parallel-applications', title: '12. تطبيقات التوازي', explain: ['إذا قطع قاطع مستقيمين متوازيين، فالزوايا المتناظرة والمتبادلة داخلياً متساوية، والداخليتان على جهة واحدة من القاطع متكاملتان.', 'يمكن استخدام هذه العلاقات لإيجاد زوايا مجهولة أو لإثبات توازي مستقيمين بعكس النظريات المناسبة.', 'في المسائل المركبة، اكتب العلاقة المبررة لكل خطوة، ولا تعتمد على مظهر الرسم وحده.'], example: 'إذا كانت زاوية داخلية على جهة واحدة 118°، فالزاوية الداخلية الأخرى على الجهة نفسها =180°−118°=62°.', key: 'المتناظرتان والمتبادلتان داخلياً متساويتان؛ والداخليتان على جهة واحدة مجموعهما 180°.', questions: [mc('مستقيمان متوازيان قطعهما قاطع. إذا كانت زاوية داخلية 68°، فالداخلية المتبادلة معها:',['22°','68°','112°','180°'],1,'الزاويتان المتبادلتان داخلياً متساويتان.','g8-geo-l12-q1'), mc('زاويتان داخليتان على جهة واحدة من القاطع إحداهما 123°. الأخرى:',['57°','67°','123°','237°'],0,'مجموعهما 180°؛ 180−123=57°.','g8-geo-l12-q2')] },
        { id: 'triangle-medians', title: '13. متوسطات المثلث', explain: ['متوسط المثلث قطعة مستقيمة تصل رأساً بمنتصف الضلع المقابل؛ لذلك يقسم ذلك الضلع إلى جزأين متساويين.', 'تتقاطع المتوسطات الثلاثة في نقطة واحدة تسمى مركز الثقل. يقسم مركز الثقل كل متوسط بنسبة 2:1 من جهة الرأس.', 'إذا كان طول المتوسط معروفاً، فالمسافة من الرأس إلى مركز الثقل تساوي ثلثي المتوسط، والمسافة من المركز إلى منتصف الضلع تساوي ثلثه.'], example: 'إذا كان طول المتوسط 12 سم، فالمسافة من الرأس إلى مركز الثقل 8 سم، ومن المركز إلى منتصف الضلع 4 سم.', key: 'المتوسط يصل الرأس بمنتصف الضلع المقابل؛ ومركز الثقل يقسمه بنسبة 2:1 من جهة الرأس.', questions: [mc('متوسط طوله 15 سم. بعد مركز الثقل عن الرأس يساوي:',['5 سم','7.5 سم','10 سم','12 سم'],2,'مركز الثقل يبعد ثلثي المتوسط عن الرأس: 2/3×15=10 سم.','g8-geo-l13-q1'), mc('إذا كان AM متوسطاً في المثلث ABC، فإن:',['BM=MC','AB=AC','AM عمودي على BC دائماً','M منتصف AB'],0,'المتوسط ينصف الضلع المقابل، لذا BM=MC.','g8-geo-l13-q2')] },
        { id: 'isosceles-triangle', title: '14. المثلث المتساوي الساقين', explain: ['المثلث المتساوي الساقين له ساقان متساويتان. الزاويتان المقابلتان لهما، وهما زاويتا القاعدة، متساويتان.', 'عكس ذلك صحيح: إذا تساوت زاويتان في مثلث، تساوى الضلعان المقابلان لهما.', 'مجموع زوايا المثلث 180°. إذا عرفت زاوية الرأس، اطرحها من 180° ثم اقسم الباقي بالتساوي بين زاويتي القاعدة.'], example: 'زاوية الرأس 40°؛ مجموع زاويتي القاعدة 140°، فتكون كل منهما 70°.', key: 'الساقان المتساويان تقابلهما زاويتا قاعدة متساويتان، ومجموع زوايا المثلث 180°.', questions: [mc('زاوية رأس مثلث متساوي الساقين 36°. قياس كل زاوية قاعدة:',['36°','72°','144°','108°'],1,'مجموع زاويتي القاعدة 144°؛ كل منهما 72°.','g8-geo-l14-q1'), mc('في مثلث تساوت زاويتان، فإن الضلعين المقابلين لهما:',['متعامدان','متساويان','متوازيان','مختلفان بالضرورة'],1,'عكس نظرية المثلث المتساوي الساقين.','g8-geo-l14-q2')] },
        { id: 'polygon-angles', title: '15. الزوايا الداخلة والخارجة للمضلعات', explain: ['مجموع الزوايا الداخلية لمضلع عدد أضلاعه n هو (n−2)×180°. وإذا كان المضلع منتظماً فقيمة كل زاوية داخلية هي المجموع مقسوماً على n.', 'الزاوية الخارجية والداخلية المتجاورتان على خط مستقيم مجموعهما 180°. مجموع زاوية خارجية واحدة عند كل رأس لأي مضلع محدب يساوي 360°.', 'تحقق أن عدد الزوايا المستخدمة يساوي عدد الأضلاع، وأن الزاوية الداخلية والخارجية المتجاورتين متكاملتان.'], example: 'مجموع زوايا الخماسي الداخلية=(5−2)×180=540°. وفي الخماسي المنتظم قياس كل منها 108°.', key: 'مجموع الداخلي=(n−2)×180°؛ مجموع الخارجي للمضلع المحدب=360°؛ والمتجاورتان مجموعهما 180°.', questions: [mc('مجموع زوايا مضلع سداسي يساوي:',['540°','720°','900°','1080°'],1,'(6−2)×180°=720°.','g8-geo-l15-q1'), mc('قياس الزاوية الخارجية لمضلع منتظم تساعي:',['30°','40°','45°','140°'],1,'مجموع الخارجيات 360°؛ 360÷9=40°.','g8-geo-l15-q2')] }
      ],
      exercises: [mc('مثلث قائم وتره 13 وأحد ضلعيه القائمين 5؛ الضلع الآخر:',['8','12','18','√194'],1,'الضلع الآخر²=169−25=144؛ طوله 12.','g8-geo-ex3-q1'),mc('مثلث زاوية رأسه 50° ومتساوي الساقين؛ زاوية القاعدة:',['50°','65°','75°','130°'],1,'(180−50)÷2=65°.','g8-geo-ex3-q2'),mc('مجموع الزوايا الداخلية لسباعي:',['720°','900°','1080°','1260°'],1,'(7−2)×180=900°.','g8-geo-ex3-q3'),mc('متوسط طوله 18 سم. المسافة من مركز الثقل إلى منتصف الضلع:',['6 سم','9 سم','12 سم','15 سم'],0,'ثلث المتوسط=6 سم.','g8-geo-ex3-q4'),mc('أي معطى يثبت توازي مستقيمين وفق عكس نظرية الزوايا المتبادلة الداخلية؟',['تساوي زاويتين متبادلتين داخلياً','تساوي ضلعين','مجموع زاويتين 90°','وجود زاوية قائمة واحدة'],0,'تساوي الزاويتين المتبادلتين داخلياً يدل على التوازي.','g8-geo-ex3-q5'),mc('مثلثان أضلاعهما المتناظرة الثلاثة متساوية؛ فهما متطابقان بحالة:',['ض ز ض','ز ض ز','ض ض ض','ز ز ز'],2,'تساوي الأضلاع الثلاثة يحقق ض-ض-ض.','g8-geo-ex3-q6')],
      writtenExercises: [wr('مثلث قائم وتره 17 سم وأحد ضلعيه القائمين 8 سم. أوجد الضلع الآخر، وبيّن كيف تتحقق من الإجابة.','ليكن الضلع الآخر x. من فيثاغورس: x²+8²=17²؛ x²=289−64=225؛ إذن x=15 سم. التحقق: 8²+15²=64+225=289=17².',3,[{criterion:'كتابة علاقة فيثاغورس الصحيحة.',points:1},{criterion:'إيجاد طول الضلع 15 سم.',points:1},{criterion:'التحقق بالتعويض.',points:1}],'g8-geo-ex3-w1')]
    },
    {
      id: 'statistics', title: 'الوحدة الرابعة: الإحصاء', lessons: [
        { id: 'cumulative-frequency', title: '16. الجدول التكراري المتجمع الصاعد وتمثيله بيانياً', explain: ['التكرار المتجمع الصاعد عند فئة يساوي مجموع تكرارات هذه الفئة وكل الفئات السابقة لها. لذا لا ينقص التكرار المتجمع كلما انتقلنا إلى فئة أعلى.', 'للتمثيل البياني نضع حدود الفئات على المحور الأفقي والتكرار المتجمع على المحور الرأسي، ثم نمثل النقاط المناسبة ونصلها بالترتيب لتكوين المنحنى المتجمع.', 'يجب أن يساوي آخر تكرار متجمع إجمالي عدد البيانات. يقرأ المنحنى لتقدير عدد القيم الأقل من حد معين أو الواقعة حتى فئة معينة.'], example: 'التكرارات 3، 5، 2 تعطي تكرارات متجمعة صاعدة 3، 8، 10؛ والعدد الكلي 10.', key: 'اجمع التكرارات تدريجياً؛ آخر مجموع يساوي عدد البيانات، وارسم نقاط الحدود مقابل التكرار المتجمع.', questions: [mc('التكرارات 4، 3، 5. التكرار المتجمع الصاعد للفئة الثالثة:',['5','7','8','12'],3,'4+3+5=12.','g8-stat-l16-q1'), mc('أي عبارة تتحقق في آخر قيمة للتكرار المتجمع؟',['تساوي صفر دائماً','تساوي إجمالي التكرارات','تساوي أكبر فئة فقط','أقل من كل التكرارات'],1,'آخر مجموع تراكمي يضم جميع التكرارات.','g8-stat-l16-q2')] },
        { id: 'grouped-central-tendency', title: '17. مقاييس النزعة المركزية للجدول التكراري ذي المجموعات', explain: ['لإيجاد الوسط الحسابي للبيانات المجمعة نستخدم مركز كل فئة ممثلاً لقيمها، ثم نحسب مجموع (مركز الفئة×تكرارها) ونقسم على مجموع التكرارات.', 'الفئة المنوالية هي الفئة ذات أكبر تكرار. ولتقدير الوسيط نحدد رتبة نصف البيانات التراكمية، ثم نعين الفئة التي يقع فيها ذلك الموضع؛ وفي هذا المستوى تكفي قراءة الفئة الوسيطية من الجدول.', 'هذه المقاييس تقديرية للبيانات المجمعة؛ فالوسط يستخدم مراكز الفئات ولا القيم المفردة الأصلية. اكتب وحدة القياس إن وجدت.'], example: 'فئتان مركزاهما 5 و15 وتكراراهما 2 و3؛ الوسط التقديري=(5×2+15×3)÷5=11.', key: 'الوسط التقديري=مجموع (مركز الفئة×تكرارها)÷مجموع التكرارات؛ المنوال فئة أكبر تكرار، والوسيط يحدد بالتكرار المتجمع.', questions: [mc('مركز الفئة 10≤x<20 هو:',['10','15','20','30'],1,'مركز الفئة=(10+20)÷2=15.','g8-stat-l17-q1'), mc('فئتان مركزاهما 5 و15 وتكراراهما 2 و3. الوسط التقديري:',['9','10','11','12'],2,'(5×2+15×3)÷(2+3)=55÷5=11.','g8-stat-l17-q2')] }
      ],
      exercises: [mc('التكرارات 2، 6، 4؛ التكرار المتجمع عند الفئة الثانية:',['2','4','8','12'],2,'2+6=8.','g8-stat-ex4-q1'),mc('مركز الفئة 20≤x<30 هو:',['20','25','30','50'],1,'(20+30)÷2=25.','g8-stat-ex4-q2'),mc('لأي فئة تكون منوالية؟',['الأقل تكراراً','الأكبر تكراراً','الأوسع دائماً','الأولى دائماً'],1,'الفئة المنوالية صاحبة أكبر تكرار.','g8-stat-ex4-q3'),mc('فئتان مركزيهما 2 و6 وتكراراهما 1 و3. الوسط التقديري:',['4','5','6','8'],1,'(2×1+6×3)÷4=20÷4=5.','g8-stat-ex4-q4')],
      writtenExercises: [wr('لفئات جدول مراكزها 5، 15، 25 وتكراراتها 2، 4، 2، احسب الوسط الحسابي التقديري، وحدد الفئة المنوالية.','مجموع التكرارات=2+4+2=8. مجموع حاصل ضرب المركز في التكرار=5×2+15×4+25×2=120. الوسط التقديري=120÷8=15. أكبر تكرار 4، لذا الفئة ذات المركز 15 هي الفئة المنوالية.',3,[{criterion:'حساب مجموع التكرارات ومجموع (المركز×التكرار) صحيحاً.',points:1},{criterion:'إيجاد الوسط التقديري 15.',points:1},{criterion:'تحديد فئة المركز 15 بوصفها المنوالية.',points:1}],'g8-stat-ex4-w1')]
    }
  ];

  var exams = [
    { id:'unit-test-real-numbers', title:'اختبار الوحدة الأولى: الأعداد والعمليات عليها', note:'اختبار تدريبي أصلي يغطي دروس الوحدة الخمسة؛ الاختيار من متعدد يصحح فور اختيار الإجابة.', questions:[mc('√11 عدد:',['نسبي','غير نسبي','صحيح','طبيعي'],1,'11 ليس مربعاً كاملاً، فجذره غير نسبي.','g8-exam-u1-1'),mc('تقاطع [0,4] و(2,6) هو:',['[0,6)','(2,4]','[2,4]','(4,6)'],1,'القيم المشتركة أكبر من 2 ولا تتجاوز 4.','g8-exam-u1-2'),mc('احسب 2(5−8)+10.',['−6','4','6','16'],1,'2×(−3)+10=4.','g8-exam-u1-3'),mc('بسّط √27.',['3√3','9√3','3√9','√9'],0,'√27=√(9×3)=3√3.','g8-exam-u1-4'),mc('بسّط a⁵×a².',['a³','a⁷','a¹⁰','2a⁷'],1,'نجمع الأسين عند الضرب.','g8-exam-u1-5'),wr('بسّط 2√12−√27، موضحاً خطواتك.','2√12−√27=2×2√3−3√3=4√3−3√3=√3.',2,[{criterion:'تبسيط الجذرين إلى 4√3 و3√3.',points:1},{criterion:'إتمام الطرح إلى √3.',points:1}],'g8-exam-u1-w1')] },
    { id:'unit-test-algebra', title:'اختبار الوحدة الثانية: الجبر', note:'اختبار تدريبي أصلي يغطي دروس التحليل الأربعة.', questions:[mc('حلل 14x²+21x.',['7x(2x+3)','7(2x²+3x)','14x(x+21)','3x(14x+7)'],0,'العامل المشترك الأكبر 7x.','g8-exam-u2-1'),mc('حلل x²+11x+24.',['(x+3)(x+8)','(x+4)(x+6)','(x−3)(x−8)','(x+1)(x+24)'],0,'3×8=24 ومجموعهما 11.','g8-exam-u2-2'),mc('حلل 16a²−9.',['(4a−3)(4a+3)','(4a−3)²','(16a−3)(a+3)','(4a+9)(4a−1)'],0,'فرق مربعين.','g8-exam-u2-3'),mc('حلل x²+4x+3x+12 بالتقسيم.',['(x+4)(x+3)','(x−4)(x+3)','(x+1)(x+12)','(x+4)(x−3)'],0,'x(x+4)+3(x+4)=(x+3)(x+4).','g8-exam-u2-4'),wr('حلل 2x²+10x، ثم حلل x²−16، واذكر اسم كل طريقة.','2x²+10x=2x(x+5) بإخراج العامل المشترك الأكبر. وx²−16=(x−4)(x+4) باستخدام فرق مربعين.',3,[{criterion:'تحليل 2x²+10x إلى 2x(x+5).',points:1},{criterion:'تحليل x²−16 إلى (x−4)(x+4).',points:1},{criterion:'تسمية العامل المشترك وفرق المربعين.',points:1}],'g8-exam-u2-w1')] },
    { id:'unit-test-geometry', title:'اختبار الوحدة الثالثة: الهندسة', note:'اختبار تدريبي أصلي يغطي دروس الهندسة الستة.', questions:[mc('ما الحالة التي تثبت تطابق مثلثين إذا تساوى ضلعان والزاوية المحصورة؟',['ض ض ض','ض ز ض','ز ز ز','ز ز'],1,'هذه حالة ضلع-زاوية-ضلع.','g8-exam-u3-1'),mc('وتر مثلث قائم ضلعا قائمته 9 و12 يساوي:',['15','21','√63','3'],0,'√(81+144)=√225=15.','g8-exam-u3-2'),mc('زاوية متناظرة لزاوية 71° بين متوازيين تساوي:',['19°','71°','109°','180°'],1,'الزوايا المتناظرة متساوية.','g8-exam-u3-3'),mc('متوسط طوله 21 سم؛ بعد مركز الثقل عن الرأس:',['7','10.5','14','18'],2,'ثلثا المتوسط=14 سم.','g8-exam-u3-4'),mc('زاوية رأس مثلث متساوي الساقين 44°؛ زاوية القاعدة:',['44°','68°','88°','136°'],1,'(180−44)÷2=68°.','g8-exam-u3-5'),mc('مجموع زوايا المثمن الداخلية:',['900°','1080°','1260°','1440°'],1,'(8−2)×180=1080°.','g8-exam-u3-6'),wr('مضلع منتظم عدد أضلاعه 10. احسب مجموع زواياه الداخلية وقياس زاويته الخارجية الواحدة.','مجموع الزوايا الداخلية=(10−2)×180=1440°. قياس الخارجية الواحدة للمضلع المنتظم=360÷10=36°.',3,[{criterion:'استخدام صيغة مجموع الزوايا الداخلية.',points:1},{criterion:'الحصول على 1440°.',points:1},{criterion:'حساب الزاوية الخارجية 36°.',points:1}],'g8-exam-u3-w1')] },
    { id:'unit-test-statistics', title:'اختبار الوحدة الرابعة: الإحصاء', note:'اختبار تدريبي أصلي يغطي الدرسين الإحصائيين.', questions:[mc('التكرارات 3، 2، 6؛ المتجمع الصاعد للفئة الثالثة:',['6','8','9','11'],3,'3+2+6=11.','g8-exam-u4-1'),mc('فئتان مركزاهما 10 و20 وتكراراهما 1 و3؛ الوسط التقديري:',['15','17.5','18','20'],1,'(10×1+20×3)÷4=70÷4=17.5.','g8-exam-u4-2'),wr('التكرارات للفئات المتتابعة هي 2، 5، 3. اكتب التكرارات المتجمعة الصاعدة، وحدد إجمالي البيانات.','التكرارات المتجمعة الصاعدة: 2، 7، 10. إجمالي البيانات 10 وهو آخر تكرار متجمع.',2,[{criterion:'كتابة القيم المتجمعة 2، 7، 10.',points:1},{criterion:'تحديد الإجمالي 10.',points:1}],'g8-exam-u4-w1')] },
    { id:'comprehensive-grade8-term1', title:'الامتحان الشامل: منهج الترم الأول كاملاً', note:'امتحان تدريبي أصلي من 17 سؤالاً، سؤال واحد على الأقل لكل درس من الدروس السبعة عشر، بمزيج من الاختيار والمسائل المفتوحة.', questions:[
      mc('أي عدد غير نسبي؟',['√25','0.75','√13','−4'],2,'13 ليس مربعاً كاملاً.','g8-comp-l1'),mc('الفترة التي تمثل 1<x≤6 هي:',['[1,6]','(1,6]','[1,6)','(1,6)'],1,'1 مستبعد و6 مشمول.','g8-comp-l2'),mc('احسب 5−2(1−4).',['−1','3','11','13'],2,'5−2(−3)=11.','g8-comp-l3'),wr('بسّط √75+∛(−27).','√75=5√3، و∛(−27)=−3؛ إذن الناتج 5√3−3.',2,[{criterion:'تبسيط √75 إلى 5√3.',points:1},{criterion:'إيجاد الجذر التكعيبي والجمع إلى 5√3−3.',points:1}],'g8-comp-l4'),mc('بسّط m⁸÷m³ حيث m≠0.',['m⁵','m¹¹','m²⁴','m³'],0,'نطرح الأسس: 8−3=5.','g8-comp-l5'),mc('حلل 15x²−20x.',['5x(3x−4)','5(3x²−4x)','15x(x−20)','4x(15x−5)'],0,'العامل المشترك 5x.','g8-comp-l6'),mc('حلل x²+7x+10.',['(x+2)(x+5)','(x+1)(x+10)','(x−2)(x−5)','(x+3)(x+4)'],0,'2×5=10 ومجموعهما 7.','g8-comp-l7'),mc('حلل x²−36.',['(x−6)(x+6)','(x−6)²','(x−18)(x+2)','(x+36)(x−1)'],0,'فرق مربعين.','g8-comp-l8'),wr('حلل x²+3x+2x+6 بالتقسيم، ثم تحقق بإعادة الضرب.','x(x+3)+2(x+3)=(x+2)(x+3). وبإعادة الضرب x²+5x+6، وهو المقدار المعطى بعد جمع الحدين الأوسطين.',2,[{criterion:'التقسيم وإخراج العامل المشترك لإظهار (x+3).',points:1},{criterion:'الناتج الصحيح والتحقق بالتوزيع.',points:1}],'g8-comp-l9'),mc('مثلثان لهما ضلعان متساويان والزاوية المحصورة متساوية؛ التطابق حسب:',['ض ز ض','ز ز ز','ض ض فقط','ز ز'],0,'هذه حالة ضلع-زاوية-ضلع.','g8-comp-l10'),mc('مثلث قائم وتره 10 وأحد ضلعيه القائمين 6؛ الضلع الآخر:',['4','6','8','16'],2,'√(100−36)=8.','g8-comp-l11'),mc('بين مستقيمين متوازيين، الزاويتان الداخليتان على جهة واحدة مجموعهما:',['90°','180°','270°','360°'],1,'هما متكاملتان.','g8-comp-l12'),mc('متوسط مثلث طوله 12 سم؛ بعد مركز الثقل عن منتصف الضلع:',['4','6','8','10'],0,'ثلث المتوسط=4 سم.','g8-comp-l13'),mc('زاوية رأس مثلث متساوي الساقين 80°؛ كل زاوية قاعدة:',['40°','50°','80°','100°'],1,'(180−80)÷2=50°.','g8-comp-l14'),mc('مجموع الزوايا الداخلية لمضلع خماسي:',['360°','540°','720°','900°'],1,'(5−2)×180=540°.','g8-comp-l15'),mc('التكرارات 4، 3، 2؛ التكرار المتجمع للفئة الثالثة:',['2','7','9','12'],2,'4+3+2=9.','g8-comp-l16'),wr('مراكز ثلاث فئات هي 10، 20، 30 وتكراراتها 1، 2، 1. احسب الوسط التقديري وحدد الفئة المنوالية.','مجموع التكرارات=4. مجموع (المركز×التكرار)=10+40+30=80؛ الوسط التقديري=80÷4=20. أكبر تكرار هو 2، لذا الفئة ذات المركز 20 هي المنوالية.',3,[{criterion:'حساب مجموع التكرارات ومجموع (المركز×التكرار).',points:1},{criterion:'إيجاد الوسط التقديري 20.',points:1},{criterion:'تحديد فئة المركز 20 بوصفها الفئة المنوالية.',points:1}],'g8-comp-l17')
    ] }
  ];

  function normalize(value) {
    return String(value || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim();
  }
  function isTarget(type) {
    var stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
    var grade = normalize(typeof currentGrade === 'undefined' ? '' : currentGrade);
    var subject = normalize(typeof currentSubject === 'undefined' ? '' : currentSubject);
    var term = typeof currentTerm === 'undefined' ? 1 : Number(currentTerm);
    return stage === 'prep' && /^(?:الصف\s*)?الثاني(?:\s|$)/.test(grade) && /رياض/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
  }
  function text(tag, value, className) {
    var element = document.createElement(tag);
    element.textContent = value == null ? '' : String(value);
    if (className) element.className = className;
    return element;
  }
  function noticeBox() {
    var notice = text('div', 'تنبيه المنهج: ' + NOTICE);
    notice.setAttribute('dir', 'rtl');
    notice.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.8;color:#594300;font-size:13px;';
    return notice;
  }
  function card(title, description, id, icon) {
    var link = document.createElement('a');
    link.href = '#'; link.className = 'content-item'; link.setAttribute('role', 'button'); link.setAttribute('aria-label', title);
    link.addEventListener('click', function (event) { event.preventDefault(); window.openMathStudyItem(id); });
    var iconBox = text('div', icon, 'content-item-icon');
    var info = document.createElement('div'); info.className = 'content-item-info';
    info.appendChild(text('div', title, 'content-item-title')); info.appendChild(text('div', description, 'content-item-sub'));
    link.appendChild(iconBox); link.appendChild(info); link.appendChild(text('div', '‹', 'content-item-arrow'));
    return link;
  }

  var ESSAY_SCORE_STORAGE_KEY = 'ta3lemy-math-g8-t1-essay-scores-v1';
  function readEssayScores() {
    try { var raw = window.localStorage.getItem(ESSAY_SCORE_STORAGE_KEY); var scores = raw ? JSON.parse(raw) : {}; return scores && typeof scores === 'object' && !Array.isArray(scores) ? scores : {}; }
    catch (error) { return {}; }
  }
  function saveEssayScore(key, record) {
    try { var scores = readEssayScores(); scores[key] = record; window.localStorage.setItem(ESSAY_SCORE_STORAGE_KEY, JSON.stringify(scores)); return true; }
    catch (error) { return false; }
  }
  function rubricText(rubric) {
    if (Array.isArray(rubric)) return rubric.map(function (item) { return item.points + ' درجة: ' + item.criterion; }).join('؛ ');
    return String(rubric || '');
  }
  function countEssayQuestions() {
    var count = units.reduce(function (sum, unit) { return sum + (unit.writtenExercises || []).length; }, 0);
    return count + exams.reduce(function (sum, exam) { return sum + exam.questions.filter(function (q) { return !Array.isArray(q.options); }).length; }, 0);
  }
  function questionsBox(questions, prefix, itemTitle) {
    var wrap = document.createElement('div');
    var writtenCount = questions.filter(function (q) { return !Array.isArray(q.options); }).length;
    var storedScores = readEssayScores();
    questions.forEach(function (question, index) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var title = text('div', (index + 1) + '. ' + question.q); title.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;'; block.appendChild(title);
      if (Array.isArray(question.options)) {
        var choices = document.createElement('div');
        var result = text('div', ''); result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.7;';
        question.options.forEach(function (choice, choiceIndex) {
          var label = document.createElement('label'); label.style.cssText = 'display:flex;gap:8px;align-items:flex-start;padding:7px 3px;line-height:1.7;cursor:pointer;';
          var input = document.createElement('input'); input.type = 'radio'; input.name = prefix + '-' + index; input.value = String(choiceIndex); input.style.marginTop = '6px';
          input.addEventListener('change', function () {
            var correct = Number(input.value) === question.answer;
            result.style.display = 'block'; result.style.background = correct ? '#E8F5E9' : '#FFF3E0';
            result.textContent = (correct ? 'إجابة صحيحة. ' : 'إجابة غير صحيحة. ') + question.why;
          });
          label.appendChild(input); label.appendChild(text('span', choice)); choices.appendChild(label);
        });
        block.appendChild(choices); block.appendChild(result); block._mathQuestion = question; block._mathResult = result;
      } else {
        var maxPoints = Number(question.points) || 0;
        var kindLabel = text('div', 'مسألة مفتوحة • الدرجة الكلية: ' + maxPoints);
        kindLabel.style.cssText = 'display:inline-block;background:#FFF3E0;color:#8A4B08;border-radius:16px;padding:4px 10px;margin:2px 0 8px;font-size:13px;font-weight:700;'; block.appendChild(kindLabel);
        var answerLabel = text('label', 'اكتب إجابتك وخطوات الحل:'); answerLabel.style.cssText = 'display:block;font-weight:700;margin:10px 0 6px;'; block.appendChild(answerLabel);
        var response = document.createElement('textarea'); response.rows = 4; response.maxLength = 3000; response.placeholder = 'اكتب الإجابة هنا...'; response.setAttribute('aria-label', 'إجابة السؤال المفتوح');
        response.style.cssText = 'display:block;width:100%;min-height:100px;padding:10px;border:1px solid #bdbdbd;border-radius:10px;font:inherit;line-height:1.8;resize:vertical;'; block.appendChild(response);
        var details = document.createElement('details'); details.style.cssText = 'margin-top:10px;background:#F5F9F5;border-radius:9px;padding:9px 12px;line-height:1.8;';
        details.appendChild(text('summary', 'عرض الإجابة النموذجية وتوزيع الدرجات (' + maxPoints + ' درجات)'));
        details.appendChild(text('div', 'الإجابة النموذجية: ' + (question.answerModel || question.answerText || '')));
        details.appendChild(text('div', 'توزيع الدرجات: ' + rubricText(question.rubric))); block.appendChild(details);
        var scoreKey = String(prefix || 'content') + '::' + (question.id || index); var savedRecord = storedScores[scoreKey];
        var scorePanel = document.createElement('div'); scorePanel.style.cssText = 'margin-top:12px;padding:11px;background:#F3F6FA;border-radius:10px;';
        var scoreLabel = text('label', 'درجتك بعد المراجعة الذاتية (من 0 إلى ' + maxPoints + '):'); scoreLabel.style.cssText = 'display:block;font-weight:700;margin-bottom:6px;';
        var scoreInput = document.createElement('input'); scoreInput.type = 'number'; scoreInput.min = '0'; scoreInput.max = String(maxPoints); scoreInput.step = '1'; scoreInput.value = savedRecord ? String(savedRecord.score) : ''; scoreInput.placeholder = 'أدخل درجتك'; scoreInput.setAttribute('aria-label', 'درجتك بعد المراجعة من صفر إلى ' + maxPoints); scoreInput.style.cssText = 'width:120px;max-width:100%;padding:9px;border:1px solid #bdbdbd;border-radius:8px;font:inherit;';
        var saveButton = document.createElement('button'); saveButton.type = 'button'; saveButton.textContent = 'حفظ درجتي'; saveButton.style.cssText = 'margin:6px 8px;padding:9px 13px;background:#1565C0;color:white;border:0;border-radius:8px;font:inherit;font-weight:700;cursor:pointer;';
        var scoreStatus = text('div', savedRecord ? 'الدرجة المحفوظة حالياً: ' + savedRecord.score + ' من ' + maxPoints : ''); scoreStatus.style.cssText = 'margin-top:6px;font-size:13px;line-height:1.7;';
        saveButton.addEventListener('click', function () {
          var rawScore = String(scoreInput.value || '').trim(); var enteredScore = Number(rawScore);
          if (!rawScore || !Number.isInteger(enteredScore) || enteredScore < 0 || enteredScore > maxPoints) { scoreStatus.style.color = '#B71C1C'; scoreStatus.textContent = 'أدخل درجة صحيحة من 0 إلى ' + maxPoints + '.'; return; }
          var record = { sourceId: prefix, itemTitle: itemTitle || prefix, question: question.q, score: enteredScore, points: maxPoints, updatedAt: new Date().toISOString() };
          if (!saveEssayScore(scoreKey, record)) { scoreStatus.style.color = '#B71C1C'; scoreStatus.textContent = 'تعذر حفظ الدرجة على هذا الجهاز. تحقق من إعدادات التخزين ثم حاول مجدداً.'; return; }
          storedScores[scoreKey] = record; scoreStatus.style.color = '#2E7D32'; scoreStatus.textContent = 'تم حفظ درجتك: ' + enteredScore + ' من ' + maxPoints + ' على هذا الجهاز.';
        });
        scorePanel.appendChild(scoreLabel); scorePanel.appendChild(scoreInput); scorePanel.appendChild(saveButton); scorePanel.appendChild(scoreStatus); block.appendChild(scorePanel); block._mathWrittenQuestion = true;
      }
      wrap.appendChild(block);
    });
    var check = document.createElement('button'); check.type = 'button'; check.textContent = writtenCount ? 'مراجعة الاختيار من متعدد والإجابات المفتوحة' : 'تحقق من الإجابات';
    check.style.cssText = 'background:#2E7D32;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    check.addEventListener('click', function () {
      var score = 0; var total = 0;
      Array.prototype.forEach.call(wrap.children, function (block) {
        var question = block._mathQuestion; if (!question) return; total += 1;
        var selected = block.querySelector('input[type="radio"]:checked'); var correct = !!selected && Number(selected.value) === question.answer;
        if (correct) score += 1; block._mathResult.style.display = 'block'; block._mathResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        block._mathResult.textContent = (correct ? 'إجابة صحيحة. ' : 'ليست الإجابة الصحيحة. ') + question.why;
      });
      var scoreBox = wrap.querySelector('.math-score'); if (scoreBox) scoreBox.textContent = 'نتيجتك في الاختيار من متعدد: ' + score + ' من ' + total + (writtenCount ? ' • راجع الإجابة النموذجية ومعايير ' + writtenCount + ' مسائل مفتوحة.' : '');
    });
    wrap.insertBefore(check, wrap.firstChild); var scoreBox = text('div', '', 'math-score'); scoreBox.style.cssText = 'font-weight:700;color:#2E7D32;margin:6px 0 12px;'; wrap.insertBefore(scoreBox, check.nextSibling);
    return wrap;
  }
  function findItem(id) {
    for (var i = 0; i < units.length; i += 1) {
      var unit = units[i];
      for (var j = 0; j < unit.lessons.length; j += 1) if (unit.lessons[j].id === id) return { kind: 'lesson', unit: unit, item: unit.lessons[j] };
      if (unit.id === id) return { kind: 'exercise', unit: unit, item: unit };
    }
    for (var k = 0; k < exams.length; k += 1) if (exams[k].id === id) return { kind: 'exam', item: exams[k] };
    return null;
  }
  function openEssayScoreTracker() {
    var body = document.getElementById('viewerBody'); var title = document.getElementById('viewerTitle'); if (!body || !title) return;
    body.textContent = ''; body.setAttribute('dir', 'rtl'); title.textContent = 'متابعة درجات المراجعة الذاتية للأسئلة المفتوحة'; body.appendChild(noticeBox());
    var scores = readEssayScores(); var entries = Object.keys(scores).map(function (key) { return scores[key]; }).filter(function (record) { return record && typeof record === 'object' && isFinite(Number(record.score)) && isFinite(Number(record.points)); });
    var earned = entries.reduce(function (sum, record) { return sum + Number(record.score); }, 0); var possible = entries.reduce(function (sum, record) { return sum + Number(record.points); }, 0); var percentage = possible ? Math.round(earned / possible * 100) : 0;
    var summary = document.createElement('section'); summary.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:14px;margin:12px 0;line-height:1.9;'; summary.appendChild(text('h3', 'ملخص تقدمك في التقييم الذاتي'));
    summary.appendChild(text('p', 'مجموع الدرجات المحفوظة: ' + earned + ' من ' + possible + ' درجة (' + percentage + '%).')); summary.appendChild(text('p', 'عدد الأسئلة التي سجلت لها درجة: ' + entries.length + ' من ' + countEssayQuestions() + ' سؤالاً مفتوحاً.'));
    summary.appendChild(text('p', 'تُحفظ الدرجات على هذا الجهاز فقط، ولا تُرسل إجاباتك المكتوبة إلى الخادم.')); body.appendChild(summary);
    if (!entries.length) body.appendChild(text('p', 'لم تسجل درجات بعد. افتح تدريبات الوحدات أو أحد الاختبارات، وقيّم إجابتك بعد مراجعة النموذج ثم اضغط «حفظ درجتي».'));
    else {
      entries.sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
      entries.forEach(function (record) {
        var row = document.createElement('section'); row.style.cssText = 'border:1px solid #e4e9e4;border-radius:11px;padding:12px;margin:10px 0;background:#fff;line-height:1.8;';
        row.appendChild(text('h4', record.itemTitle || 'تقييم مفتوح')); row.appendChild(text('p', record.question || '')); row.appendChild(text('strong', 'تقييمك: ' + record.score + ' من ' + record.points));
        if (record.updatedAt) row.appendChild(text('div', new Date(record.updatedAt).toLocaleString('ar-EG')));
        if (record.sourceId) { var button = document.createElement('button'); button.type = 'button'; button.textContent = 'فتح التدريب أو الاختبار لتعديل الدرجة'; button.style.cssText = 'margin-top:8px;padding:8px 12px;background:#1565C0;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer;'; button.addEventListener('click', function () { openItem(record.sourceId); }); row.appendChild(button); }
        body.appendChild(row);
      });
    }
    if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined' && typeof showScreen === 'function') { screenHistory.push(currentScreen); showScreen('viewerScreen'); }
  }
  function openItem(id) {
    if (id === 'essay-score-tracker') { openEssayScoreTracker(); return; }
    var found = findItem(id); if (!found) return;
    var body = document.getElementById('viewerBody'); var title = document.getElementById('viewerTitle'); if (!body || !title) return;
    body.textContent = ''; body.setAttribute('dir', 'rtl'); title.textContent = found.item.title; body.appendChild(noticeBox());
    if (found.kind === 'lesson') {
      body.appendChild(text('h2', found.unit.title, 'math-unit-title'));
      found.item.explain.forEach(function (paragraph) { var p = text('p', paragraph); p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;'; body.appendChild(p); });
      var example = document.createElement('div'); example.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;'; example.appendChild(text('strong', 'مثال محلول: ')); example.appendChild(text('span', found.item.example)); body.appendChild(example);
      var summary = document.createElement('div'); summary.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;'; summary.appendChild(text('strong', 'مفتاح الدرس: ')); summary.appendChild(text('span', found.item.key)); body.appendChild(summary);
      body.appendChild(text('h3', 'تدريب فوري', 'math-section-title')); body.appendChild(questionsBox(found.item.questions, found.item.id, found.item.title));
    } else {
      body.appendChild(text('p', found.kind === 'exam' ? found.item.note : 'تدريبات متنوعة على دروس الوحدة، مع تصحيح فوري للاختيار ونماذج ومعايير للمسائل المفتوحة.', 'math-exam-note'));
      if (found.kind === 'exercise') body.appendChild(text('h3', found.unit.title, 'math-section-title'));
      var questionSet = found.kind === 'exercise' ? found.item.exercises.concat(found.item.writtenExercises || []) : found.item.questions;
      body.appendChild(questionsBox(questionSet, found.item.id, found.item.title));
    }
    if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined' && typeof showScreen === 'function') { screenHistory.push(currentScreen); showScreen('viewerScreen'); }
  }
  function appendContent(type) {
    var list = document.getElementById('contentList'); if (!list) return;
    for (var index = list.children.length - 1; index >= 0; index -= 1) if (String(list.children[index].className || '').split(/\s+/).indexOf('empty-state') >= 0) list.removeChild(list.children[index]);
    var root = document.createElement('div'); root.className = 'math-original-content'; root.setAttribute('dir', 'rtl'); root.appendChild(noticeBox());
    if (type === 'exercises' || type === 'exams') root.appendChild(card('متابعة درجات المراجعة الذاتية', 'اعرض سجل درجات المسائل المفتوحة المحفوظة على هذا الجهاز.', 'essay-score-tracker', '📊'));
    if (type === 'lessons') units.forEach(function (unit) { root.appendChild(text('h3', unit.title, 'math-unit-heading')); unit.lessons.forEach(function (lesson) { root.appendChild(card(lesson.title, lesson.explain[0], lesson.id, '📘')); }); });
    else if (type === 'exercises') units.forEach(function (unit) { root.appendChild(card('تدريبات ' + unit.title, unit.exercises.length + ' أسئلة اختيار من متعدد و' + unit.writtenExercises.length + ' مسائل مفتوحة مع نموذج إجابة', unit.id, '✏️')); });
    else if (type === 'exams') exams.forEach(function (exam) { root.appendChild(card(exam.title, exam.note, exam.id, '📝')); });
    list.appendChild(root);
  }
  window.openMathStudyItem = openItem;
  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent === 'function' && !originalOpenContent.__mathGrade8ContentWrapped) {
    var wrapped = async function (type, termNumber, termName) { var result = await originalOpenContent.apply(this, arguments); if (isTarget(type)) appendContent(type); return result; };
    wrapped.__mathGrade8ContentWrapped = true; window.openContent = wrapped;
  }
})();
