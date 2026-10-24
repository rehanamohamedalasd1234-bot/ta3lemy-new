// Original interactive learning content for Grade 7 Mathematics, Term 1 (Egypt 2026/2027).
// Scope follows the two-unit 2026/2027 overview; the current Ministry textbook edition could not be verified.
(function () {
  'use strict';

  var NOTICE = 'محتوى تدريبي أصلي للمراجعة، مبني على وصف منهج 2026/2027 المنشور للوحدتين: النسب والتناسب والمجموعات، والتعبيرات والصيغ الرياضية والهندسة. لم تتوفر نسخة وزارة حديثة مؤكدة أثناء الإعداد؛ راجع فهرس كتابك المدرسي عند الاختلاف.';

  var units = [
    {
      id: 'ratios-sets',
      title: 'الوحدة الأولى: النسب والتناسب والمجموعات',
      lessons: [
        {
          id: 'proportion', title: '1. التناسب',
          explain: [
            'النسبة مقارنة بين كميتين من النوع نفسه باستخدام القسمة. نكتب النسبة 6 إلى 9 على صورة 6:9، ثم نبسطها بقسمة الطرفين على القاسم المشترك الأكبر، فتصبح 2:3.',
            'التناسب هو تساوي نسبتين؛ مثل 2/3 = 8/12. إذا كانت a/b = c/d، وكان b وd لا يساويان صفراً، فإن حاصل ضرب الطرفين يساوي حاصل ضرب الوسطين: a×d = b×c.',
            'لإيجاد الحد المجهول في التناسب نكتب الضرب التبادلي ثم نحل المعادلة الناتجة. نتحقق من الناتج بالتعويض في النسبتين ومقارنة قيمتيهما.',
            'تظهر النسب في وصف خلط العصير، ومقارنة المسافات، وقراءة الجداول. يجب توحيد الوحدات قبل مقارنة كميتين مختلفتي الوحدة.'
          ],
          example: 'إذا كان 3/5 = x/20، فالضرب التبادلي يعطي 5x = 60، ومنه x = 12. وبالفعل 12/20 تُبسط إلى 3/5.',
          key: 'النسبة مقارنة بالقسمة؛ التناسب مساواة بين نسبتين؛ في التناسب حاصل ضرب الطرفين يساوي حاصل ضرب الوسطين.',
          questions: [
            { q: 'ما أبسط صورة للنسبة 12:18؟', options: ['2:3', '3:2', '6:9', '12:6'], answer: 0, why: 'نقسم الحدين على 6 فنحصل على 2:3.' },
            { q: 'إذا كان 4/7 = x/21، فما قيمة x؟', options: ['8', '12', '16', '28'], answer: 1, why: '7x = 4×21 = 84، لذلك x = 12.' },
            { q: 'أي مساواة تمثل تناسباً؟', options: ['2/3 = 8/12', '2/3 = 8/9', '3/4 = 6/10', '1/5 = 3/10'], answer: 0, why: 'في الاختيار الأول حاصل الضرب التبادلي متساوٍ: 2×12 = 3×8.' }
          ]
        },
        {
          id: 'scale', title: '2. تطبيقات النسبة والتناسب: مقياس الرسم',
          explain: [
            'مقياس الرسم نسبة طول على الرسم إلى الطول الحقيقي بعد التعبير عنهما بالوحدة نفسها. فإذا كان المقياس 1:100,000 فهذا يعني أن كل سنتيمتر على الخريطة يقابل 100,000 سنتيمتر في الواقع.',
            'لإيجاد المسافة الحقيقية نضرب مسافة الرسم في مقام المقياس. ولإيجاد مسافة الرسم نقسم المسافة الحقيقية على مقام المقياس، بعد تحويل الوحدات.',
            'التحويل بين الوحدات خطوة أساسية: 100 سم = 1 م، و1000 م = 1 كم. لا نقارن سنتيمترات الرسم بكيلومترات الواقع مباشرة قبل توحيد الوحدة.',
            'يمكن استخدام مقياس الرسم في الخرائط والمخططات الهندسية وتصغير الأشياء أو تكبيرها مع الحفاظ على النسبة بين الأبعاد.'
          ],
          example: 'على خريطة مقياسها 1:200,000 كانت المسافة بين مدينتين 3 سم. المسافة الحقيقية = 3×200,000 = 600,000 سم = 6 كم.',
          key: 'مقياس الرسم = طول الرسم ÷ الطول الحقيقي بوحدتين متماثلتين. تحقّق دائماً من تحويل الناتج إلى الوحدة المطلوبة.',
          questions: [
            { q: 'مقياس 1:50,000 يعني أن 1 سم على الرسم يمثل:', options: ['50 م', '500 م', '5 كم', '50 كم'], answer: 1, why: '50,000 سم تساوي 500 م.' },
            { q: 'مسافة على خريطة مقياسها 1:100,000 تساوي 4 سم. ما المسافة الحقيقية؟', options: ['400 م', '4 كم', '40 كم', '400 كم'], answer: 1, why: '4×100,000 = 400,000 سم = 4 كم.' },
            { q: 'إذا مثّل 2 سم على رسم طولاً حقيقياً 10 م، فما مقياس الرسم بعد توحيد الوحدة؟', options: ['1:50', '1:5', '2:10', '1:500'], answer: 3, why: '10 م = 1000 سم، والنسبة 2:1000 تُبسط إلى 1:500.' }
          ]
        },
        {
          id: 'proportional-sharing', title: '3. التقسيم التناسبي',
          explain: [
            'في التقسيم التناسبي توزّع كمية كلية على أجزاء تتناسب مع أعداد معلومة. إذا قسمت كمية بنسبة 2:3:5، فعدد الأجزاء الكلي هو 2+3+5 = 10 أجزاء.',
            'قيمة الجزء الواحد تساوي الكمية الكلية مقسومة على مجموع حدود النسبة. ثم نضرب قيمة الجزء في كل حد لإيجاد نصيب كل طرف.',
            'يجب أن يكون مجموع الأنصبة مساوياً للكمية الأصلية. ويمكن التحقق أيضاً من أن نسبة الأنصبة تطابق النسبة المعطاة.',
            'تُستخدم الفكرة في توزيع الأرباح أو المبالغ أو المواد وفق اتفاق يحدد نسبة كل فرد.'
          ],
          example: 'قُسم 600 جنيه بنسبة 2:3:5. مجموع الأجزاء 10، وقيمة الجزء 60؛ الأنصبة 120 و180 و300 جنيه.',
          key: 'نصيب الطرف = الكمية الكلية × حد النسبة ÷ مجموع حدود النسبة.',
          questions: [
            { q: 'قُسم 360 بنسبة 1:2:3. ما نصيب الطرف صاحب الحد 2؟', options: ['60', '90', '120', '180'], answer: 2, why: 'مجموع الأجزاء 6؛ قيمة الجزء 60، والنصيب 2×60 = 120.' },
            { q: 'وُزعت 840 وحدة بنسبة 3:4. ما قيمة الجزء الواحد؟', options: ['100', '110', '120', '140'], answer: 2, why: 'مجموع حدود النسبة 7، و840÷7 = 120.' },
            { q: 'تقاسم اثنان 250 بنسبة 2:3. ما نصيب صاحب النسبة 3؟', options: ['100', '125', '150', '175'], answer: 2, why: 'مجموع الأجزاء 5، والجزء 50؛ النصيب 3×50 = 150.' }
          ]
        },
        {
          id: 'percentage', title: '4. تطبيقات النسبة المئوية',
          explain: [
            'النسبة المئوية نسبة مقامها 100؛ فـ 25% تعني 25 من كل 100، وتكتب 25/100 أو 0.25.',
            'لإيجاد نسبة مئوية من كمية نضرب الكمية في النسبة بعد كتابتها على صورة كسر عشري أو كسر مقامه 100. ولإيجاد النسبة التي تمثلها كمية من أخرى نقسم الجزء على الكل ثم نضرب في 100%.',
            'في التخفيض نحسب مقدار الخصم أولاً ثم نطرحه من السعر الأصلي. وفي الزيادة نحسب مقدار الزيادة ثم نضيفه إلى القيمة الأصلية.',
            'ميّز بين مقدار التغير والقيمة النهائية؛ فالخصم 20% من 500 جنيه يساوي 100 جنيه، أما السعر بعد الخصم فيساوي 400 جنيه.'
          ],
          example: 'ثمن حقيبة 800 جنيه وخُفّض 15%. الخصم = 0.15×800 = 120 جنيهاً، والسعر الجديد = 800−120 = 680 جنيهاً.',
          key: 'النسبة المئوية من كمية = الكمية × النسبة ÷ 100. السعر بعد الخصم = السعر الأصلي − الخصم.',
          questions: [
            { q: 'ما قيمة 20% من 350؟', options: ['35', '60', '70', '90'], answer: 2, why: '350×20÷100 = 70.' },
            { q: 'ثمن كتاب 200 جنيه، وعليه خصم 10%. ما ثمنه بعد الخصم؟', options: ['20', '180', '190', '220'], answer: 1, why: 'الخصم 20 جنيهاً؛ 200−20 = 180.' },
            { q: 'ما النسبة المئوية التي تمثل 18 من 60؟', options: ['18%', '30%', '40%', '60%'], answer: 1, why: '18÷60×100 = 30%.' }
          ]
        },
        {
          id: 'sets', title: '5. المجموعات وتمثيلها',
          explain: [
            'المجموعة تجمع محدد من عناصر مميزة. نستخدم الأقواس المعقوفة لكتابتها، مثل A={2,4,6}. لا يتغير معنى المجموعة بتغيير ترتيب عناصرها.',
            'العنصر إما ينتمي إلى المجموعة أو لا ينتمي إليها. نستخدم الرمز ∈ للانتماء والرمز ∉ لعدم الانتماء؛ فـ 4∈A و5∉A في المثال السابق.',
            'يمكن وصف المجموعة بسرد عناصرها أو بذكر صفة مشتركة بينها. مثال: مجموعة الأعداد الزوجية الأصغر من 8 هي {2,4,6} إذا كان المجال هو الأعداد الطبيعية الموجبة.',
            'المجموعة الخالية لا تضم أي عنصر ويرمز إليها بـ ∅. أما المجموعة الجزئية فكل عنصر فيها ينتمي أيضاً إلى المجموعة الأكبر.'
          ],
          example: 'إذا كانت B={أ، ب، ج}، فإن عدد عناصرها 3، و«ب»∈B، بينما «د»∉B.',
          key: 'المجموعة عناصر محددة غير مكررة؛ ترتيب العناصر لا يغير المجموعة؛ ∅ مجموعة بلا عناصر.',
          questions: [
            { q: 'إذا كانت A={1,3,5,7}، فأي عبارة صحيحة؟', options: ['4∈A', '5∈A', '7∉A', '1∉A'], answer: 1, why: 'العنصر 5 وارد ضمن عناصر A.' },
            { q: 'أي كتابة تمثل مجموعة الأعداد الطبيعية الزوجية الأصغر من 8؟', options: ['{1,3,5,7}', '{2,4,6}', '{0,2,4,6,8}', '{2,4,6,8}'], answer: 1, why: 'العناصر الزوجية الموجبة الأصغر من 8 هي 2 و4 و6.' },
            { q: 'ماذا تعني المجموعة الخالية؟', options: ['مجموعة فيها عنصر واحد', 'مجموعة لا تحتوي عناصر', 'مجموعة عناصرها متساوية', 'مجموعة أعداد فقط'], answer: 1, why: 'المجموعة الخالية لا تحتوي أي عنصر.' }
          ]
        },
        {
          id: 'set-operations', title: '6. العمليات على المجموعات',
          explain: [
            'اتحاد مجموعتين A∪B يضم كل العناصر التي تنتمي إلى A أو B أو إليهما معاً، مع كتابة كل عنصر مرة واحدة فقط.',
            'تقاطع مجموعتين A∩B يضم العناصر المشتركة بينهما. إذا لم يوجد عنصر مشترك فالتقاطع مجموعة خالية.',
            'الفرق A−B يضم عناصر A التي لا تنتمي إلى B. لذلك يختلف عموماً عن B−A، وقد يختلف الناتجان.',
            'يمكن استخدام مخطط فن لتمثيل المجموعات: دائرتان متداخلتان، والجزء المشترك يوضح التقاطع. يساعد الرسم على تجنب نسيان العناصر أو تكرارها.'
          ],
          example: 'إذا كان A={1,2,3} وB={3,4}، فإن A∪B={1,2,3,4}، وA∩B={3}، وA−B={1,2}.',
          key: 'الاتحاد: كل العناصر؛ التقاطع: المشتركة؛ الفرق A−B: عناصر A غير الموجودة في B.',
          questions: [
            { q: 'إذا كان A={1,2,3} وB={3,4}، فما A∩B؟', options: ['{1,2,3,4}', '{1,2}', '{3}', '{4}'], answer: 2, why: 'العنصر المشترك الوحيد بين المجموعتين هو 3.' },
            { q: 'للمجموعتين A={a,b} وB={b,c}، ما A∪B؟', options: ['{b}', '{a,b,c}', '{a,c}', '{a,b,b,c}'], answer: 1, why: 'الاتحاد يضم العناصر كلها دون تكرار.' },
            { q: 'إذا كان X={2,4,6} وY={4,6,8}، فما X−Y؟', options: ['{2}', '{4,6}', '{8}', '{2,8}'], answer: 0, why: 'العنصر الموجود في X وغير الموجود في Y هو 2.' }
          ]
        }
      ],
      exercises: [
        { q: 'حل التناسب 5/8 = x/24.', options: ['10', '12', '15', '20'], answer: 2, why: '8x = 5×24، إذن x=15.' },
        { q: 'خريطة مقياسها 1:250,000. ما المسافة الحقيقية التي تمثلها 2 سم؟', options: ['500 م', '5 كم', '50 كم', '500 كم'], answer: 1, why: '2×250,000 = 500,000 سم = 5 كم.' },
        { q: 'وُزع 480 بنسبة 1:3. ما نصيب الطرف الأكبر؟', options: ['120', '240', '360', '400'], answer: 2, why: 'مجموع الأجزاء 4، والجزء 120؛ النصيب الأكبر 3×120=360.' },
        { q: 'زاد عدد من 80 إلى 100. ما نسبة الزيادة؟', options: ['20%', '25%', '30%', '80%'], answer: 1, why: 'الزيادة 20؛ 20÷80×100 = 25%.' },
        { q: 'إذا كانت C={2,4,6,8}، فأي عنصر لا ينتمي إليها؟', options: ['2', '4', '7', '8'], answer: 2, why: 'العدد 7 غير موجود في C.' },
        { q: 'إذا كان A={1,2,4} وB={2,3,4}، فما A−B؟', options: ['{1}', '{2,4}', '{3}', '{1,3}'], answer: 0, why: 'العدد 1 وحده ينتمي إلى A ولا ينتمي إلى B.' },
        { q: 'أي نسبة تكافئ 4:10؟', options: ['2:5', '5:2', '4:5', '8:10'], answer: 0, why: 'نقسم الطرفين على 2 فنحصل على 2:5.' },
        { q: 'ما قيمة 12.5% من 80؟', options: ['8', '10', '12', '16'], answer: 1, why: '12.5% = 1/8، و80÷8 = 10.' }
      ]
    },
    {
      id: 'expressions-geometry',
      title: 'الوحدة الثانية: التعبيرات والصيغ الرياضية والهندسة',
      lessons: [
        {
          id: 'expressions', title: '7. التعبيرات الرياضية',
          explain: [
            'التعبير الرياضي يتكون من أعداد ومتغيرات وعمليات، مثل 3x+5. المتغير رمز يمثل عدداً يمكن أن تتغير قيمته، ولا يحتوي التعبير وحده على علامة مساواة.',
            'لترجمة عبارة لفظية إلى تعبير، حدد المجهول أولاً ثم عبّر عن العلاقة بدقة. «خمسة أكثر من عدد» تكتب x+5، أما «خمسة أمثال عدد» فتكتب 5x.',
            'الحدود المتشابهة لها المتغيرات نفسها والأسس نفسها. نجمع أو نطرح معاملات الحدود المتشابهة فقط؛ فـ 3x+2x=5x، لكن x وx² حدان غير متشابهين.',
            'عند التعويض بقيمة المتغير نضعها مكان الرمز ونلتزم بترتيب العمليات، مع استخدام الأقواس عند التعويض بعدد سالب.'
          ],
          example: 'إذا كان x=4، فإن قيمة 3x+2 تساوي 3×4+2=14. والتعبير «ضعف عدد ناقص 3» يكتب 2x−3.',
          key: 'التعبير لا يحتوي علامة مساواة؛ الحدود المتشابهة فقط تجمع أو تطرح؛ عوّض عن المتغير ثم احسب بترتيب العمليات.',
          questions: [
            { q: 'أي تعبير يمثل «سبعة أكثر من عدد n»؟', options: ['7n', 'n−7', 'n+7', '7−n'], answer: 2, why: 'إضافة سبعة إلى العدد تعني n+7.' },
            { q: 'بسّط 4x+3x−2.', options: ['7x−2', '5x', '7x+2', '12x−2'], answer: 0, why: 'نجمع الحدين المتشابهين 4x و3x.' },
            { q: 'إذا كان a=5، فما قيمة 2a+6؟', options: ['11', '16', '22', '56'], answer: 1, why: '2×5+6=16.' }
          ]
        },
        {
          id: 'formulas', title: '8. الصيغ الرياضية والتعويض',
          explain: [
            'الصيغة الرياضية قاعدة مختصرة تربط بين كميات، وتستخدم رموزاً لتسهيل الحساب. مثال: محيط المستطيل P=2(l+w)، حيث l الطول وw العرض.',
            'لحساب قيمة باستخدام صيغة، اكتب المعطيات، عوّض عن الرموز، ثم نفّذ العمليات بالترتيب الصحيح. احرص على وضع القيم بين أقواس إذا كانت سالبة أو تتضمن عملية.',
            'الوحدات جزء من الإجابة. محيط الشكل يقاس بوحدات الطول، والمساحة بوحدات مربعة، ولا يجوز جمع أطوال بوحدات غير موحدة قبل التحويل.',
            'الصيغة لا تعني أن كل الرموز مجهولة؛ قد تكون بعض القيم معروفة ويطلب إيجاد قيمة أخرى أو استخدام القاعدة في موقف حياتي.'
          ],
          example: 'مستطيل طوله 8 سم وعرضه 3 سم. محيطه P=2(8+3)=22 سم.',
          key: 'اقرأ معنى الرموز، عوّض بالقيم المعطاة، احسب بترتيب العمليات، واكتب الوحدة المناسبة.',
          questions: [
            { q: 'محيط مستطيل طوله 9 سم وعرضه 4 سم يساوي:', options: ['13 سم', '26 سم', '36 سم', '72 سم'], answer: 1, why: 'P=2(9+4)=26 سم.' },
            { q: 'إذا كانت d=vt، وv=5 وt=4، فما قيمة d؟', options: ['9', '20', '25', '45'], answer: 1, why: 'd=5×4=20.' },
            { q: 'أي وحدة مناسبة لقياس مساحة أرض؟', options: ['متر', 'متر مربع', 'لتر', 'كيلوجرام'], answer: 1, why: 'المساحة تقاس بوحدات مربعة مثل المتر المربع.' }
          ]
        },
        {
          id: 'angles', title: '9. المفاهيم الهندسية: الزوايا والعلاقات بينها',
          explain: [
            'الزاوية شكل يتكون من شعاعين لهما نقطة بداية مشتركة تسمى رأس الزاوية. وتقاس الزوايا بالدرجات باستخدام المنقلة.',
            'الزاوية الحادة أقل من 90°، والقائمة تساوي 90°، والمنفرجة أكبر من 90° وأقل من 180°، والمستقيمة تساوي 180°.',
            'زاويتان متتامتان مجموعهما 90°، ومتكاملتان مجموعهما 180°. والزاويتان المتقابلتان بالرأس متساويتان عندما يتقاطع مستقيمان.',
            'الزاويتان المتجاورتان تشتركان في رأس وضلع داخلي، ولا يتداخل داخلهما. وقد تكونان متكاملتين إذا كان ضلعاها غير المشتركين على استقامة واحدة.'
          ],
          example: 'زاويتان على خط مستقيم قياس إحداهما 65°. قياس الأخرى = 180°−65°=115°.',
          key: 'المتتامتان مجموعهما 90°؛ المتكاملتان مجموعهما 180°؛ والمتقابلتان بالرأس متساويتان.',
          questions: [
            { q: 'ما نوع زاوية قياسها 125°؟', options: ['حادة', 'قائمة', 'منفرجة', 'مستقيمة'], answer: 2, why: '125° أكبر من 90° وأقل من 180°.' },
            { q: 'زاويتان متتامتان، وقياس الأولى 38°. ما قياس الثانية؟', options: ['42°', '52°', '142°', '152°'], answer: 1, why: '90°−38°=52°.' },
            { q: 'زاوية قياسها 73° تقابلها بالرأس زاوية قياسها:', options: ['17°', '73°', '107°', '180°'], answer: 1, why: 'الزاويتان المتقابلتان بالرأس متساويتان.' }
          ]
        },
        {
          id: 'angle-relations', title: '10. حل مسائل على علاقات الزوايا',
          explain: [
            'اكتب العلاقة الهندسية أولاً قبل الحساب. إذا كانت زاويتان متكاملتين فمجموعهما 180°، وإذا كانتا متتامتين فمجموعهما 90°.',
            'إذا عبّر عن قياسي زاويتين بتعبيرين مثل x+20 و2x، نكوّن معادلة من العلاقة ثم نحلها. بعد إيجاد x، نعوّض به لإيجاد قياس كل زاوية.',
            'عند تقاطع مستقيمين تتساوى الزوايا المتقابلة بالرأس، وكل زاويتين متجاورتين على خط مستقيم مجموعهما 180°.',
            'تحقق من منطقية القياس: الزاوية الحادة أقل من 90°، والمنفرجة بين 90° و180°. يساعد هذا الفحص على اكتشاف أخطاء الحساب.'
          ],
          example: 'زاويتان متكاملتان قياساهما x وx+40. إذن x+(x+40)=180، فيكون x=70° والزاوية الأخرى 110°.',
          key: 'حوّل العلاقة الهندسية إلى معادلة، أوجد المجهول، ثم عوّض وتحقق من مجموع القياسين.',
          questions: [
            { q: 'زاويتان متكاملتان قياس إحداهما 112°. ما قياس الأخرى؟', options: ['58°', '68°', '78°', '112°'], answer: 1, why: '180°−112°=68°.' },
            { q: 'زاويتان متقابلتان بالرأس قياساهما 3x و75°. ما قيمة x؟', options: ['20', '25', '30', '35'], answer: 1, why: '3x=75، إذن x=25.' },
            { q: 'زاويتان متتامتان قياساهما x و2x. ما قياس الزاوية الأكبر؟', options: ['30°', '45°', '60°', '120°'], answer: 2, why: '3x=90، فـ x=30، والزاوية الأكبر 2x=60°.' }
          ]
        },
        {
          id: 'parallel-lines', title: '11. التوازي والزوايا الناتجة عنه',
          explain: [
            'المستقيمان المتوازيان في مستوى واحد لا يلتقيان مهما امتدا. يرمز إلى توازي المستقيمين AB وCD بالصيغة AB∥CD.',
            'عندما يقطع مستقيمٌ مستقيمين متوازيين تتكون أزواج من الزوايا. الزوايا المتناظرة متساوية، والزوايا المتبادلة داخلياً متساوية.',
            'الزاويتان الداخليتان الواقعتان على جهة واحدة من القاطع مجموعهما 180°. ويمكن استخدام هذه العلاقات لإيجاد قياسات زوايا مجهولة.',
            'قبل اختيار العلاقة، حدّد المستقيمين المتوازيين والقاطع وموقع كل زاوية في الرسم. لا تعتمد على شكل الرسم وحده؛ استخدم العلامات أو المعطيات المكتوبة.'
          ],
          example: 'إذا كانت زاوية متناظرة مع زاوية قياسها 68° عند قطع مستقيمين متوازيين، فإن قياسها أيضاً 68°.',
          key: 'في مستقيمين متوازيين: المتناظرة والمتبادلة داخلياً متساويتان؛ والداخلية على جهة واحدة من القاطع متكاملة.',
          questions: [
            { q: 'إذا كان مستقيمان متوازيين وقياس زاوية متناظرة 74°، فقياس الزاوية الأخرى:', options: ['16°', '74°', '106°', '180°'], answer: 1, why: 'الزوايا المتناظرة بين مستقيمين متوازيين متساوية.' },
            { q: 'زاويتان داخليتان على جهة واحدة من قاطع لمستقيمين متوازيين. مجموعهما:', options: ['90°', '120°', '180°', '360°'], answer: 2, why: 'هما زاويتان متكاملتان.' },
            { q: 'إذا كانت زاويتان متبادلتان داخلياً متساويتين، فهذا يساعد على إثبات أن المستقيمين:', options: ['متعامدان', 'متوازيان', 'متقاطعان عند زاوية قائمة دائماً', 'متطابقان'], answer: 1, why: 'تساوي الزوايا المتبادلة داخلياً يحقق عكس نظرية التوازي.' }
          ]
        },
        {
          id: 'triangles', title: '12. المثلث وخصائصه الأساسية',
          explain: [
            'المثلث مضلع له ثلاثة أضلاع وثلاث زوايا. يصنف بحسب أضلاعه إلى مختلف الأضلاع، ومتساوي الساقين، ومتساوي الأضلاع؛ وبحسب زواياه إلى حاد الزوايا أو قائم أو منفرج.',
            'مجموع قياسات الزوايا الداخلية لأي مثلث يساوي 180°. إذا عرفت قياسي زاويتين، تطرح مجموعهما من 180° لإيجاد الثالثة.',
            'في المثلث متساوي الساقين زاويتا القاعدة متساويتان. وفي المثلث متساوي الأضلاع الأضلاع متساوية، وكل زاوية داخلية قياسها 60°.',
            'ترتبط أطوال أضلاع المثلث بعضها ببعض؛ مجموع طولي أي ضلعين أكبر من طول الضلع الثالث. تستخدم هذه القاعدة للتحقق من إمكانية تكوين مثلث.'
          ],
          example: 'في مثلث زاويتاه 48° و67°، الزاوية الثالثة = 180°−(48°+67°)=65°.',
          key: 'مجموع زوايا المثلث 180°؛ زاويتا القاعدة في متساوي الساقين متساويتان؛ ومجموع طولي أي ضلعين أكبر من الثالث.',
          questions: [
            { q: 'مثلث زاويتاه 35° و85°. ما قياس الزاوية الثالثة؟', options: ['50°', '60°', '70°', '95°'], answer: 1, why: '180°−(35°+85°)=60°.' },
            { q: 'مثلث متساوي الساقين زاوية رأسه 40°. ما قياس كل زاوية من زاويتي القاعدة؟', options: ['40°', '60°', '70°', '80°'], answer: 2, why: 'مجموع زاويتي القاعدة 140°، وكل منهما 70°.' },
            { q: 'أي مجموعة أطوال يمكن أن تكوّن مثلثاً؟', options: ['2، 3، 6', '3، 4، 5', '1، 2، 3', '2، 2، 5'], answer: 1, why: '3+4>5، وكذلك مجموع أي ضلعين أكبر من الثالث.' }
          ]
        }
      ],
      exercises: [
        { q: 'أوجد قيمة x إذا كان 7/9 = x/27.', options: ['18', '21', '24', '27'], answer: 1, why: '9x=7×27=189، إذن x=21.' },
        { q: 'مقياس خريطة 1:400,000. المسافة الحقيقية التي تمثل 1.5 سم هي:', options: ['600 م', '6 كم', '60 كم', '600 كم'], answer: 1, why: '1.5×400,000 = 600,000 سم = 6 كم.' },
        { q: 'قُسم 720 بنسبة 2:4. ما نصيب الطرف الأول؟', options: ['120', '180', '240', '480'], answer: 2, why: 'مجموع الأجزاء 6 والجزء 120؛ النصيب الأول 2×120=240.' },
        { q: 'إذا كان A={1,2,3} وB={2,3,5}، فإن A∩B يساوي:', options: ['{1,5}', '{2,3}', '{1,2,3,5}', '{5}'], answer: 1, why: 'العنصران المشتركان هما 2 و3.' },
        { q: 'بسّط 6m−2m+4.', options: ['4m+4', '8m+4', '4m−4', '8m'], answer: 0, why: '6m−2m=4m، ويبقى الحد الثابت 4.' },
        { q: 'زاوية متكاملة مع زاوية قياسها 47° تساوي:', options: ['43°', '133°', '143°', '227°'], answer: 1, why: '180°−47°=133°.' },
        { q: 'في مستقيمين متوازيين، زاويتان متبادلتان داخلياً قياس إحداهما 109°. قياس الثانية:', options: ['71°', '90°', '109°', '180°'], answer: 2, why: 'الزاويتان المتبادلتان داخلياً متساويتان.' },
        { q: 'في مثلث متساوي الأضلاع، قياس كل زاوية داخلية:', options: ['45°', '60°', '90°', '120°'], answer: 1, why: 'الزوايا متساوية ومجموعها 180°؛ إذن كل زاوية 60°.' }
      ]
    }
  ];

  var exams = [
    {
      id: 'unit-one-exam', title: 'امتحان تدريبي 1 — النسب والتناسب والمجموعات',
      note: 'اختبار أصلي غير رسمي • 10 أسئلة • تصحيح فوري',
      questions: [
        { q: 'حل التناسب 3/4 = x/20.', options: ['12', '15', '16', '18'], answer: 1, why: '4x=60، إذن x=15.' },
        { q: 'مقياس 1:200,000. المسافة على الخريطة 3 سم. المسافة الحقيقية:', options: ['600 م', '6 كم', '60 كم', '600 كم'], answer: 1, why: '3×200,000=600,000 سم=6 كم.' },
        { q: 'وُزعت 540 بنسبة 2:1. ما نصيب الطرف صاحب الحد 2؟', options: ['180', '270', '360', '400'], answer: 2, why: 'مجموع الأجزاء 3؛ قيمة الجزء 180؛ النصيب 360.' },
        { q: 'ما قيمة 15% من 240؟', options: ['24', '30', '36', '48'], answer: 2, why: '240×15÷100=36.' },
        { q: 'سعر سلعة 500 جنيه، وخُفض 12%. ما السعر بعد الخصم؟', options: ['60', '440', '450', '560'], answer: 1, why: 'الخصم 60 جنيهاً؛ السعر بعده 500−60=440.' },
        { q: 'إذا كانت A={2,4,6}، فأي عبارة صحيحة؟', options: ['3∈A', '4∈A', '6∉A', '2∉A'], answer: 1, why: 'العدد 4 من عناصر المجموعة A.' },
        { q: 'إذا كان A={1,2,3} وB={3,4}، فما A∪B؟', options: ['{3}', '{1,2}', '{1,2,3,4}', '{4}'], answer: 2, why: 'الاتحاد يجمع عناصر المجموعتين دون تكرار.' },
        { q: 'إذا كان A={a,b,c} وB={b,c,d}، فإن A−B=', options: ['{a}', '{b,c}', '{d}', '{a,d}'], answer: 0, why: 'العنصر a وحده في A ولا يوجد في B.' },
        { q: 'أي نسبة تكافئ 9:12؟', options: ['2:3', '3:4', '4:3', '9:4'], answer: 1, why: 'نقسم الحدين على 3 فنحصل على 3:4.' },
        { q: 'ما قيمة 30% من 90؟', options: ['18', '27', '30', '60'], answer: 1, why: '90×30÷100=27.' }
      ]
    },
    {
      id: 'term-one-exam', title: 'امتحان تدريبي 2 — مراجعة شاملة للترم الأول',
      note: 'اختبار أصلي غير رسمي • 12 سؤالاً • زمن مقترح 35 دقيقة',
      questions: [
        { q: 'إذا كان 5/6=x/30، فإن x يساوي:', options: ['20', '24', '25', '36'], answer: 2, why: '6x=150، إذن x=25.' },
        { q: 'طول 5 سم على رسم مقياسه 1:100,000 يمثل:', options: ['500 م', '5 كم', '50 كم', '500 كم'], answer: 1, why: '5×100,000=500,000 سم=5 كم.' },
        { q: 'تقسيم 420 بنسبة 3:4 يعطي الطرف الثاني:', options: ['180', '210', '240', '280'], answer: 2, why: 'مجموع الأجزاء 7؛ الجزء 60؛ الطرف الثاني 4×60=240.' },
        { q: 'نسبة 45 من 180 مئوياً تساوي:', options: ['20%', '25%', '30%', '45%'], answer: 1, why: '45÷180×100=25%.' },
        { q: 'إذا كان A={1,3,5} وB={3,5,7}، فإن A∩B=', options: ['{1,7}', '{3,5}', '{1,3,5,7}', '{7}'], answer: 1, why: 'العنصران المشتركان هما 3 و5.' },
        { q: '«أربعة أمثال العدد n مضافاً إليه 2» تكتب:', options: ['4(n+2)', '4n+2', 'n+6', '2n+4'], answer: 1, why: 'أربعة أمثال n هي 4n، ثم نضيف 2.' },
        { q: 'إذا كان x=3، فما قيمة 2x²+1؟', options: ['7', '13', '19', '37'], answer: 2, why: '2×3²+1=2×9+1=19.' },
        { q: 'زاويتان متتامتان، قياس الأولى 56°. قياس الثانية:', options: ['34°', '44°', '124°', '146°'], answer: 0, why: '90°−56°=34°.' },
        { q: 'إذا كانت زاويتان متقابلتين بالرأس، وقياس إحداهما 81°، فالأخرى:', options: ['9°', '81°', '99°', '180°'], answer: 1, why: 'الزاويتان المتقابلتان بالرأس متساويتان.' },
        { q: 'زاوية متناظرة مع زاوية 117° بين مستقيمين متوازيين قياسها:', options: ['63°', '90°', '117°', '180°'], answer: 2, why: 'الزوايا المتناظرة متساوية.' },
        { q: 'مثلث زاويتاه 52° و61°. الزاوية الثالثة:', options: ['57°', '67°', '77°', '119°'], answer: 1, why: '180°−(52°+61°)=67°.' },
        { q: 'أي أطوال لا تكوّن مثلثاً؟', options: ['4، 5، 6', '3، 4، 6', '2، 3، 5', '5، 5، 8'], answer: 2, why: 'مجموع الطولين 2+3 يساوي 5 ولا يزيد عليه، فلا يتكون مثلث.' }
      ]
    }
  ];

  function norm(value) {
    return String(value || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim();
  }

  function isTarget(type) {
    var stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
    var grade = norm(typeof currentGrade === 'undefined' ? '' : currentGrade);
    var subject = norm(typeof currentSubject === 'undefined' ? '' : currentSubject);
    var term = typeof currentTerm === 'undefined' ? 1 : Number(currentTerm);
    return stage === 'prep' && /^ال?اول/.test(grade) && /رياض/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
  }

  function text(tag, value, className) {
    var element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function noticeBox() {
    var notice = document.createElement('div');
    notice.setAttribute('dir', 'rtl');
    notice.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.8;color:#594300;font-size:13px;';
    notice.textContent = 'تنبيه المنهج: ' + NOTICE;
    return notice;
  }

  function card(title, description, id, icon) {
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'content-item';
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', title);
    link.addEventListener('click', function (event) {
      event.preventDefault();
      window.openMathStudyItem(id);
    });
    var iconBox = text('div', icon, 'content-item-icon');
    var info = document.createElement('div');
    info.className = 'content-item-info';
    info.appendChild(text('div', title, 'content-item-title'));
    info.appendChild(text('div', description, 'content-item-sub'));
    link.appendChild(iconBox);
    link.appendChild(info);
    link.appendChild(text('div', '‹', 'content-item-arrow'));
    return link;
  }

  function questionsBox(questions, prefix) {
    var wrap = document.createElement('div');
    questions.forEach(function (question, index) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var title = text('div', (index + 1) + '. ' + question.q);
      title.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;';
      block.appendChild(title);
      var choices = document.createElement('div');
      question.options.forEach(function (choice, choiceIndex) {
        var label = document.createElement('label');
        label.style.cssText = 'display:flex;gap:8px;align-items:flex-start;padding:7px 3px;line-height:1.7;cursor:pointer;';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = prefix + '-' + index;
        input.value = String(choiceIndex);
        input.style.marginTop = '6px';
        label.appendChild(input);
        label.appendChild(text('span', choice));
        choices.appendChild(label);
      });
      block.appendChild(choices);
      var result = text('div', '');
      result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.7;';
      block.appendChild(result);
      block._mathQuestion = question;
      block._mathResult = result;
      wrap.appendChild(block);
    });
    var check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'تحقق من الإجابات';
    check.style.cssText = 'background:#2E7D32;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    check.addEventListener('click', function () {
      var score = 0;
      var total = 0;
      Array.prototype.forEach.call(wrap.children, function (block) {
        var question = block._mathQuestion;
        if (!question) return;
        total += 1;
        var selected = block.querySelector('input[type="radio"]:checked');
        var correct = !!selected && Number(selected.value) === question.answer;
        if (correct) score += 1;
        block._mathResult.style.display = 'block';
        block._mathResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        block._mathResult.textContent = (correct ? 'إجابة صحيحة. ' : 'ليست الإجابة الصحيحة. ') + question.why;
      });
      var scoreBox = wrap.querySelector('.math-score');
      if (scoreBox) scoreBox.textContent = 'نتيجتك: ' + score + ' من ' + total;
    });
    wrap.insertBefore(check, wrap.firstChild);
    var scoreBox = text('div', '', 'math-score');
    scoreBox.style.cssText = 'font-weight:700;color:#2E7D32;margin:6px 0 12px;';
    wrap.insertBefore(scoreBox, check.nextSibling);
    return wrap;
  }

  function findItem(id) {
    for (var unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
      var unit = units[unitIndex];
      for (var lessonIndex = 0; lessonIndex < unit.lessons.length; lessonIndex += 1) {
        if (unit.lessons[lessonIndex].id === id) return { kind: 'lesson', unit: unit, item: unit.lessons[lessonIndex] };
      }
      if (unit.id === id) return { kind: 'exercise', unit: unit, item: unit };
    }
    for (var examIndex = 0; examIndex < exams.length; examIndex += 1) {
      if (exams[examIndex].id === id) return { kind: 'exam', item: exams[examIndex] };
    }
    return null;
  }

  function openItem(id) {
    var found = findItem(id);
    if (!found) return;
    var body = document.getElementById('viewerBody');
    var title = document.getElementById('viewerTitle');
    if (!body || !title) return;
    body.textContent = '';
    body.setAttribute('dir', 'rtl');
    title.textContent = found.item.title;
    body.appendChild(noticeBox());
    if (found.kind === 'lesson') {
      body.appendChild(text('h2', found.unit.title, 'math-unit-title'));
      found.item.explain.forEach(function (paragraph) {
        var p = text('p', paragraph);
        p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;';
        body.appendChild(p);
      });
      var example = document.createElement('div');
      example.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      example.appendChild(text('strong', 'مثال محلول: '));
      example.appendChild(text('span', found.item.example));
      body.appendChild(example);
      var summary = document.createElement('div');
      summary.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      summary.appendChild(text('strong', 'خلاصة الدرس: '));
      summary.appendChild(text('span', found.item.key));
      body.appendChild(summary);
      body.appendChild(text('h3', 'تدريب فوري', 'math-section-title'));
      body.appendChild(questionsBox(found.item.questions, found.item.id));
    } else {
      var message = found.kind === 'exam' ? found.item.note : 'تدريبات متنوعة على دروس الوحدة مع تصحيح فوري وتفسير للإجابة.';
      body.appendChild(text('p', message, 'math-exam-note'));
      if (found.kind === 'exercise') body.appendChild(text('h3', found.unit.title, 'math-section-title'));
      body.appendChild(questionsBox(found.kind === 'exercise' ? found.item.exercises : found.item.questions, found.item.id));
    }
    screenHistory.push(currentScreen);
    showScreen('viewerScreen');
  }

  function appendContent(type) {
    var list = document.getElementById('contentList');
    if (!list) return;
    for (var index = list.children.length - 1; index >= 0; index -= 1) {
      if (String(list.children[index].className || '').split(/\s+/).indexOf('empty-state') >= 0) list.removeChild(list.children[index]);
    }
    var root = document.createElement('div');
    root.className = 'math-original-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
    if (type === 'lessons') {
      units.forEach(function (unit) {
        root.appendChild(text('h3', unit.title, 'math-unit-heading'));
        unit.lessons.forEach(function (lesson) {
          root.appendChild(card(lesson.title, lesson.explain[0], lesson.id, '📘'));
        });
      });
    } else if (type === 'exercises') {
      units.forEach(function (unit) {
        root.appendChild(card('تدريبات ' + unit.title, unit.exercises.length + ' أسئلة متنوعة مع تصحيح فوري', unit.id, '✏️'));
      });
    } else if (type === 'exams') {
      exams.forEach(function (exam) {
        root.appendChild(card(exam.title, exam.note, exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openMathStudyItem = openItem;
  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent === 'function' && !originalOpenContent.__mathContentWrapped) {
    var wrapped = async function (type, termNumber, termName) {
      var result = await originalOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrapped.__mathContentWrapped = true;
    window.openContent = wrapped;
  }
})();
