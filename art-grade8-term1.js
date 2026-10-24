// Original, skill-oriented Art Education review for Grade 8 (second preparatory), Term 1.
// Advisory skill review only; not a verified Ministry syllabus or 2026/2027 unit index.
(function () {
  'use strict';

  var NOTICE = 'هذه مراجعة مهارية استرشادية للصف الثاني الإعدادي في التربية الفنية، وليست منهجاً وزارياً مؤكداً أو نقلاً عن فهرس رسمي للفصل الأول 2026/2027. لا يتوافر لنا فهرس رسمي خاص بهذا الصف والفصل للعام المذكور؛ والموضوعات هنا مقترحات عامة للتدرب على الملاحظة والتصميم والإنتاج الفني. تعرض وزارة التربية والتعليم دليلاً عاماً للتربية الفنية للمرحلة الإعدادية، ولا يعني ذلك تأكيد هذه المحاور ضمن فهرس مقرر بعينه: https://moe.gov.eg/ar/general-administration-of-art-education/educational-guides/ . الأعمال والأنشطة أصلية ومقترحة؛ لا تنسخ عملاً فنياً محمياً. استخدم ورقاً مستعملاً نظيفاً وأقلام رصاص أو تلوين متاحة فقط؛ لا مواد خطرة ولا أدوات حادة.';

  var units = [
    {
      id: 'art-g8t1-unit-elements',
      title: 'المحور الاسترشادي الأول: عناصر التصميم — الخط والشكل واللون والملمس',
      lessons: [
        {
          id: 'art-g8t1-lesson-line-shape',
          title: '1. الخط والشكل: كيف نبني صورة من عناصر بسيطة؟',
          explain: [
            'الخط أثر بصري مستقيم أو منحنٍ أو متقطع أو متعرج؛ قد يحدد حافة، أو يقود العين، أو يوحي بحركة وفق اتجاهه وتكراره. أما الشكل فهو مساحة لها حدود، وقد يكون هندسياً كالدائرة والمربع أو حراً مستلهماً من أشكال البيئة.',
            'اختلاف حجم الأشكال واتجاه الخطوط يساعد على إظهار العنصر الأهم. لا توجد دلالة واحدة ثابتة لكل خط أو شكل؛ فالمعنى يتأثر بالفكرة وبطريقة ترتيب العناصر.',
            'مثال: يمكن تكوين مشهد لساحة مدرسة من مستطيلات ونوافذ مربعة وخطوط مائلة توحي بظل أو حركة، مع اختيار عنصر واحد ليكون أوضح من البقية.',
            'نشاط اختياري آمن: على ورقة مستعملة نظيفة، ارسم بخطوط قليلة مشهداً من مكان مألوف، ثم كوّن ثلاثة أشياء من أشكال هندسية أو حرة. استخدم قلم رصاص أو تلويناً متاحاً فقط، ولا تستخدم أدوات حادة.'
          ],
          example: 'في رسم مقعد حديقة، قد تحدد الخطوط المستقيمة حوافه، بينما تصنع دائرة صغيرة وأشكال حرة حوله تفاصيل من اختيارك؛ هذه مجرد طريقة ممكنة وليست نموذجاً إلزامياً.',
          key: 'الخط يصف المسار والحافة، والشكل مساحة محددة؛ اختيار الأحجام والاتجاهات وترتيبها يخدم الفكرة.',
          questions: [
            { q: 'أي اختيار مثال على شكل هندسي محدد الحافة؟', options: ['دائرة مرسومة بوضوح', 'ظل غيمة متغير', 'أثر ماء غير منتظم', 'بقعة بلا حدود ظاهرة'], answer: 0, why: 'الدائرة شكل هندسي ذو حد واضح، بخلاف الظلال والآثار المتغيرة.' },
            { q: 'ما أثر تكرار خطوط منحنية متتابعة في رسم؟', options: ['قد يوحي بمسار متموج أو حركة', 'يثبت معنى واحداً لا يتغير', 'يلغي وجود أي شكل', 'يجعل الرسم صحيحاً بالضرورة'], answer: 0, why: 'قد توحي الانحناءات المتتابعة بالحركة، ويتوقف الانطباع على سياق العمل.' },
            { q: 'كيف يمكن إبراز عنصر رئيسي باستخدام الشكل؟', options: ['تغيير حجمه أو موضعه مقارنة بالعناصر الأخرى', 'جعل كل الأشكال متطابقة دائماً', 'إخفاء جميع الحدود', 'ملء الورقة بعناصر بلا ترتيب'], answer: 0, why: 'اختلاف الحجم أو الموضع قد يلفت النظر إلى عنصر، من دون أن يكون هناك حل بصري واحد.' }
          ]
        },
        {
          id: 'art-g8t1-lesson-color-texture',
          title: '2. اللون والملمس: وصف الانطباع دون قواعد جامدة',
          explain: [
            'نلاحظ اللون باسمه وبكونه فاتحاً أو داكناً وبعلاقته بالألوان المجاورة. يظهر التباين عندما يختلف عنصران بوضوح، مثل مساحة داكنة بجوار فاتحة، ويمكن أن يساعد على إبراز جزء من التصميم.',
            'الملمس هو ما يوحي به سطح ما من نعومة أو خشونة أو تكرار؛ ويمكن تمثيله بالرسم بخطوط ونقاط وأنماط، دون الحاجة إلى مواد أو أسطح خطرة. الانطباعات عن الألوان والملامس احتمالية وليست معاني ثابتة للجميع.',
            'مثال: يمكن تصوير ورقة نبات بخط خارجي واضح، ثم إضافة عروق بخطوط رفيعة ونقاط متباعدة، واختيار لونين أو حتى درجات قلم رصاص لإظهار الاختلاف.',
            'نشاط اختياري: قسّم ورقة إلى مساحتين وارسم في إحداهما خطوطاً متقاربة وفي الأخرى نقاطاً أو خطوطاً متباعدة لاقتراح ملمسين مختلفين. استخدم قلمك فقط، وقارن ما يلفت نظرك.'
          ],
          example: 'مساحة فاتحة ذات خطوط متكررة قد تبدو مختلفة عن مساحة داكنة منقطة؛ وصفك للانطباع الشخصي مقبول متى أشرت إلى ما تراه فعلاً.',
          key: 'اللون والملمس عنصران للتعبير؛ التباين قد يبرز، والانطباعات تتغير بالسياق وتقبل أكثر من قراءة.',
          questions: [
            { q: 'ما المقصود بالتباين في اللون؟', options: ['اختلاف بصري ملحوظ بين لونين أو درجتين', 'تطابق كل الدرجات دائماً', 'غياب اللون والشكل معاً', 'استخدام أكبر عدد من الألوان شرطاً'], answer: 0, why: 'التباين اختلاف واضح، مثل مجاورة الفاتح للداكن.' },
            { q: 'كيف نمثل ملمساً خشناً في رسم دون خامات خاصة؟', options: ['بخطوط أو نقاط متقاربة يختارها الرسام', 'باستخدام مادة مجهولة', 'بإلزام كل رسام بنمط واحد', 'بترك الورقة دون أي علامة'], answer: 0, why: 'يمكن للخطوط والنقاط أن تقترح ملمساً بصرياً، وتظل اختيارات الرسام متنوعة.' },
            { q: 'أي عبارة عن الألوان أدق؟', options: ['قد تتغير الانطباعات اللونية بحسب السياق والمشاهد', 'لكل لون معنى واحد ثابت عند الجميع', 'لا يمكن جمع لونين في عمل', 'اللون وحده يحدد جودة التصميم'], answer: 0, why: 'الألوان قد توحي بانطباعات مختلفة ولا تفرض معنى موحداً أو حكماً نهائياً.' }
          ]
        }
      ],
      exercises: [
        { q: 'أي مجموعة تضم عناصر بصرية يمكن أن يستخدمها المصمم؟', options: ['خط وشكل ولون وملمس مرسوم', 'عنوان الصفحة ووقت البدء فقط', 'اسم الطالب وحده', 'عدد الأوراق دون تكوين'], answer: 0, why: 'الخط والشكل واللون والملمس عناصر يمكن تنظيمها بصرياً.' },
        { q: 'لإبراز شكل صغير على الورقة يمكن للفنان أن...', options: ['يجرب لوناً أو حجماً مختلفاً حوله', 'يفترض أن كل المشاهدين سيفهمونه بالطريقة نفسها', 'يحذف بقية العناصر بلا تفكير', 'يستخدم خامة مجهولة'], answer: 0, why: 'تغيير اللون أو الحجم احتمال للتأكيد، ويمكن تجربة حلول أخرى ملائمة للفكرة.' },
        { q: 'أي طريقة مناسبة لاقتراح ملمس ناعم في رسم؟', options: ['خطوط خفيفة أو متباعدة بحسب الفكرة', 'التعامل مع سطح خطر', 'خلط مواد تنظيف', 'الحكم بأن له شكلاً واحداً فقط'], answer: 0, why: 'يمكن اقتراح الملمس بالرسم وحده وبأساليب مختلفة.' },
        { q: 'ما أفضل وصف لاختلاف الانطباع عن لون واحد؟', options: ['أحترم اختلاف الرأي وأربطه بتفصيل مرئي', 'أفرض معنى واحداً على الجميع', 'أعتبر رأيي حقيقة علمية', 'أمنع التجريب'], answer: 0, why: 'الانطباع الشخصي يقبل الاختلاف، وذكر الشاهد المرئي يجعل الرأي مفهوماً.' }
      ],
      writtenExercises: [{
        id: 'art-g8t1-open-elements',
        q: 'ابتكر وصفاً أو تخطيطاً قصيراً لصورة من البيئة المحيطة، واذكر كيف ستستخدم الخط والشكل واللون أو الملمس. ما العنصر الذي تريد أن يلاحظه المشاهد أولاً؟',
        answerText: 'إجابة ممكنة: أرسم شجرة بجوار مقعد باستخدام خطوط منحنية للجذع ومستطيل للمقعد وأشكال حرة للأوراق. أختار درجة أو لوناً أوضح للشجرة، وأمثل ملمس الأوراق بنقاط قليلة. أترك مساحة حول العناصر حتى تظهر الشجرة أولاً. تقبل بدائل أخرى إذا شرحت الفكرة والاختيارات؛ لا توجد صورة فنية وحيدة صحيحة.',
        rubric: [
          { criterion: 'وضوح الفكرة أو الشيء المراد تصويره', points: 1 },
          { criterion: 'اختيار عناصر مناسبة من الخط والشكل واللون والملمس', points: 1 },
          { criterion: 'تنظيم العناصر وإظهار موضع الاهتمام', points: 1 },
          { criterion: 'شرح الاختيارات بوضوح واحترام اختلاف الحلول الفنية', points: 1 }
        ],
        points: 4
      }]
    },
    {
      id: 'art-g8t1-unit-composition',
      title: 'المحور الاسترشادي الثاني: تنظيم التكوين — التوازن والإيقاع والوحدة والتباين',
      lessons: [
        {
          id: 'art-g8t1-lesson-balance-rhythm',
          title: '3. التوازن والإيقاع: توزيع وحركة بصرية',
          explain: [
            'التوازن إحساس باستقرار توزيع العناصر في مساحة العمل. قد يكون متماثلاً تقريباً، أو غير متماثل إذا تقابلت كتلة كبيرة مع مجموعة عناصر أصغر فأصبح التكوين مستقراً بصرياً.',
            'الإيقاع ينتج من تكرار عنصر أو تنويعه بطريقة منظمة. قد يكون التكرار متساوياً أو متدرجاً أو متغيراً؛ والمهم أن نلاحظ حركة العين التي يصنعها، لا أن نكرر آلياً.',
            'مثال: شكل كبير في ناحية قد يقابله عدد من الأشكال الصغيرة في الناحية الأخرى. تكرار شكل أو لون في أكثر من موضع قد يربط أجزاء الرسم ويقود النظر.',
            'نشاط اختياري: ارسم أشكالاً بسيطة على قصاصة ورق مستعملة، أو مزق قصاصات باليد، ثم رتبها دون لصق مرة بتوزيع متماثل ومرة بتوزيع مختلف. استخدم الورق والأقلام فقط، ولا تستخدم أدوات حادة.'
          ],
          example: 'قد يقابل شكل كبير ثلاث علامات صغيرة موزعة؛ إذا بدا التكوين مستقراً للرسام فذلك حل بصري محتمل، حتى لو لم يكن متماثلاً.',
          key: 'التوازن يتعلق بتوزيع بصري مستقر، والإيقاع بتكرار أو تنويع منظم؛ التجريب والمقارنة يكشفان أثر الترتيب.',
          questions: [
            { q: 'هل يشترط التماثل الكامل لتحقيق التوازن؟', options: ['لا، قد يتحقق بتوزيع غير متماثل مستقر', 'نعم في كل عمل', 'نعم مع لون واحد فقط', 'لا يمكن تحقيق توازن بصري'], answer: 0, why: 'قد يبدو توزيع غير متماثل متوازناً وفق أحجام العناصر ومواضعها.' },
            { q: 'ما الذي يصنع إيقاعاً بصرياً؟', options: ['تكرار أو تنويع منظم لعناصر', 'إلغاء كل الأشكال', 'كتابة عنوان فقط', 'ملء كل مساحة عشوائياً'], answer: 0, why: 'التكرار أو التنويع المنظم قد يقود حركة العين ويصنع إيقاعاً.' },
            { q: 'إذا بدا جانب الورقة أثقل بصرياً، فما تجربة مناسبة؟', options: ['تحريك عنصر أو تغيير حجمه ثم المقارنة', 'إعلان أن العمل فاشل', 'إضافة تفاصيل كثيرة دون ملاحظة', 'استخدام مادة مجهولة'], answer: 0, why: 'تغيير واحد ثم ملاحظة أثره طريقة عملية لاستكشاف التوازن.' }
          ]
        },
        {
          id: 'art-g8t1-lesson-unity-contrast',
          title: '4. الوحدة والتباين: ترابط مع اختلاف واضح',
          explain: [
            'الوحدة إحساس بأن الأجزاء تنتمي إلى تكوين واحد. قد تساعد على ذلك علاقة متكررة، مثل لون مشترك أو أشكال تنتمي إلى الفكرة نفسها، مع ترك مساحة كافية للتنفس البصري.',
            'التباين هو اختلاف لافت بين عناصر، مثل كبير وصغير أو فاتح وداكن أو مستقيم ومنحني. قد يبرز التباين نقطة مهمة، بينما تساعد الوحدة على ألا تبدو الأجزاء متفرقة.',
            'يمكن أن يجتمع المبدآن: تكرار لونين يربط الأجزاء، ويظل شكل واحد أكبر أو أكثر وضوحاً ليكون موضع اهتمام. لا توجد نسبة واحدة إلزامية بينهما.',
            'نشاط اختياري: ارسم تكويناً من ثلاثة أشكال مختلفة، ثم كرر لوناً أو نوع خط لربطها، واجعل أحد الأشكال مختلفاً قليلاً في الحجم أو الدرجة. راجع ما إذا كانت أجزاؤك مترابطة وما الذي يبرز.'
          ],
          example: 'في بطاقة مرسومة، قد يتكرر لون واحد في العنوان والزخرفة بينما يكون شكل مركزي أكبر؛ التكرار يوحد، والاختلاف يلفت النظر.',
          key: 'الوحدة تربط أجزاء العمل، والتباين يوضح الفروق أو يبرز عنصراً؛ ويمكن استخدامهما معاً بطرق متعددة.',
          questions: [
            { q: 'ما الذي يمكن أن يدعم وحدة التكوين؟', options: ['علاقة لونية أو شكلية تربط بعض الأجزاء', 'إضافة عناصر غير مرتبطة بلا قصد', 'ملء كل فراغ بالتفاصيل', 'منع التكرار دائماً'], answer: 0, why: 'العلاقات المتكررة قد تساعد الأجزاء على الظهور ككل، دون أن تكون الطريقة الوحيدة.' },
            { q: 'أي مثال يوضح التباين؟', options: ['شكل داكن بجوار مساحة فاتحة', 'عنصران متطابقان تماماً', 'ورقة بلا عناصر', 'عنوان مكتوب خارج التصميم'], answer: 0, why: 'اختلاف الدرجة بين الداكن والفاتح تباين بصري.' },
            { q: 'كيف يمكن الجمع بين الوحدة والتباين؟', options: ['تكرار لون يربط العمل مع جعل عنصر واحد أكبر', 'جعل كل الأجزاء متطابقة وإلغاء كل اختلاف', 'إضافة ألوان بلا علاقة', 'إخفاء جميع العناصر'], answer: 0, why: 'التكرار يدعم الترابط والاختلاف المقصود قد يبرز جزءاً في الوقت نفسه.' }
          ]
        }
      ],
      exercises: [
        { q: 'أي وصف يمثل توازناً غير متماثل؟', options: ['شكل كبير يقابله عدد من الأشكال الصغيرة', 'نصفان متطابقان فقط', 'كل العناصر في زاوية واحدة', 'اختفاء جميع الأشكال'], answer: 0, why: 'يمكن أن تتقابل كتل مختلفة الحجم دون تماثل كامل.' },
        { q: 'أي عنصر يربط الأجزاء ويدعم الوحدة؟', options: ['تكرار لون أو شكل مناسب للفكرة', 'إضافة تفاصيل لا صلة لها', 'إلغاء المساحات الفارغة كلها', 'تغيير كل عنصر بلا رابط'], answer: 0, why: 'علاقة متكررة قد تجعل الأجزاء تبدو مترابطة.' },
        { q: 'ما فائدة التباين؟', options: ['قد يبرز عنصراً أو فرقاً مهماً', 'يثبت جودة العمل وحده', 'يفرض معنى واحداً على كل مشاهد', 'يلغي الحاجة إلى تنظيم'], answer: 0, why: 'التباين أداة تنظيم وإبراز محتملة، وليس حكماً كاملاً على جودة العمل.' },
        { q: 'كيف تختبر أثراً بصرياً لترتيب ما؟', options: ['تجرب ترتيبين وتقارن ما تلاحظه', 'تفترض أن أول ترتيب لا يقبل التغيير', 'تنسخ عملاً محمياً كما هو', 'تضيف عناصر بلا ملاحظة'], answer: 0, why: 'المقارنة بين بدائل تساعد على فهم أثر الترتيب واختيار ما يخدم الفكرة.' }
      ],
      writtenExercises: [{
        id: 'art-g8t1-open-composition',
        q: 'صف تكويناً بسيطاً يحقق توازناً وإيقاعاً ووحدة، ويستخدم تبايناً واحداً لإبراز جزء. ما الترتيب الذي تختاره ولماذا؟',
        answerText: 'إجابة ممكنة: أضع شكلاً رئيسياً في جهة، وأقابله بأشكال أصغر في الجهة الأخرى. أكرر خطاً أو لوناً في أكثر من موضع لصنع إيقاع ورابط يوحد الأجزاء، وأجعل الشكل الرئيسي أكبر أو أغمق لإبرازه. يمكن اقتراح تكوينات مختلفة؛ يقيم الشرح مدى وضوح الفكرة وعلاقات العناصر، لا مطابقة رسم بعينه.',
        rubric: [
          { criterion: 'وضوح فكرة التكوين والعنصر المراد إبرازه', points: 1 },
          { criterion: 'استخدام مفهومين أو أكثر من مفاهيم التنظيم المذكورة', points: 1 },
          { criterion: 'تنظيم يوضح التوازن والإيقاع أو الوحدة والتباين', points: 1 },
          { criterion: 'شرح سبب الاختيارات بعبارات مفهومة', points: 1 }
        ],
        points: 4
      }]
    },
    {
      id: 'art-g8t1-unit-environment',
      title: 'المحور الاسترشادي الثالث: الاستلهام من البيئة والتراث وتصميم منتج أو ملصق مدرسي آمن',
      lessons: [
        {
          id: 'art-g8t1-lesson-environment-heritage',
          title: '5. ملاحظة البيئة والتراث بمقاربة أصلية ومحترمة',
          explain: [
            'يمكن أن يبدأ التصميم من ملاحظة شكل في البيئة القريبة، مثل نبات أو نافذة أو نمط بسيط في نسيج أو مبنى مألوف. ننقل الفكرة بأسلوبنا من الذاكرة أو الملاحظة، ولا ننسخ عملاً فنياً معاصراً محمياً أو ننسبه لأنفسنا.',
            'عند استلهام عنصر تراثي، نتعامل معه باحترام ونتجنب الادعاء بأن رسماً من صنعنا تمثيل دقيق لثقافة أو تقليد كامل. يمكن أن نذكر مصدر الإلهام العام، ونختار شكلاً هندسياً أو إيقاعاً من صنعنا دون نسخ تصميم بعينه.',
            'مثال: قد يلاحظ الطالب تكرار الأقواس أو الأشكال النباتية في محيطه، ثم يبتكر سلسلة من أشكال بسيطة مختلفة عنها في التفاصيل، مع شرح ما الذي ألهمه وكيف غيّر الفكرة.',
            'نشاط اختياري: اكتب ثلاث ملاحظات بصرية من مكان مألوف أو من ذكرى بيئية، ثم ابتكر رسماً صغيراً منها على ورق مستعمل بقلم رصاص. لا حاجة لالتقاط صورة أو مشاركة موقع أو بيانات شخصية.'
          ],
          example: 'إذا لفت انتباهك تكرار شكل ورقة في حديقة، ابتكر إيقاعاً من أوراق مبسطة بأحجام واتجاهات من اختيارك؛ الإلهام ملاحظة عامة وليس نسخاً لعمل جاهز.',
          key: 'نستمد أفكاراً من البيئة والتراث باحترام، ونحول الملاحظة إلى صياغة أصلية بدلاً من نسخ عمل محمي.',
          questions: [
            { q: 'أي ممارسة توضح استلهاماً أصلياً؟', options: ['ملاحظة شكل من البيئة ثم تبسيطه وتغييره بأسلوبي', 'نسخ لوحة معاصرة كاملة ونسبها لنفسي', 'ادعاء أن رسماً واحداً يمثل تراثاً كاملاً', 'إزالة اسم صاحب عمل منسوخ'], answer: 0, why: 'الملاحظة والتحوير الشخصي يحافظان على أصالة العمل واحترام حقوق الآخرين.' },
            { q: 'كيف نتحدث بحذر عن مصدر تراثي؟', options: ['أذكر أنه إلهام عام ولا أدعي تمثيل تقليد كامل', 'أقرر أن رسماً واحداً يشرح ثقافة كاملة', 'أنسب عملاً معروفاً لنفسي', 'أمنع أي تأويل آخر'], answer: 0, why: 'القول إنه إلهام عام يبتعد عن التعميم والادعاء غير المدعوم.' },
            { q: 'ما الخطوة الأولى المفيدة بعد ملاحظة شكل في البيئة؟', options: ['تدوين صفاته ثم ابتكار صياغة مختلفة', 'نسخ كل تفاصيل عمل منشور', 'شراء خامات خاصة فوراً', 'نشر بيانات المكان الشخصية'], answer: 0, why: 'تدوين الصفات ثم إعادة صياغتها يساعد على تحويل الملاحظة إلى عمل أصلي.' }
          ]
        },
        {
          id: 'art-g8t1-lesson-school-design',
          title: '6. تخطيط ملصق أو منتج ورقي مدرسي واضح وآمن',
          explain: [
            'يبدأ التصميم بتحديد رسالة وحاجة وجمهور: لمن نصمم؟ وما الفكرة التي نريد إيصالها؟ ثم نختار عنصراً بارزاً وكلمات قليلة وترتيباً يساعد على القراءة.',
            'يمكن تنفيذ منتج ورقي بسيط مثل بطاقة تذكير أو علامة قراءة، أو ملصق مدرسي عن المحافظة على الكتب أو ترتيب الفصل. نستخدم ورقاً مستعملاً نظيفاً وأقلام رصاص أو تلوين فقط، ولا نحتاج إلى مواد خطرة أو أدوات حادة.',
            'بعد التخطيط، راجع وضوح الفكرة، التوازن، التباين، ومكان العنوان. اسأل مشاهداً تثق به عمّا فهمه، ثم حسّن التصميم إذا احتاج. لا تضع أسماء كاملة أو أرقاماً أو معلومات شخصية على ملصق عام.',
            'نشاط اختياري: صمم تخطيطاً أولياً لملصق من كلماتك ورسمة بسيطة، أو بطاقة ورقية من دون قص. جرّب موضعين للعنوان وقارن أيهما أسهل قراءة. هذه مراجعة تصميم وليست تكليفاً بمنتج واحد.'
          ],
          example: 'ملصق بعنوان «نحافظ على كتبنا» قد يضم كتاباً مرسوماً بخط واضح وكلمتين قصيرتين ولوناً مميزاً للعنوان؛ ويمكن إنجاز الفكرة بقلم واحد أيضاً.',
          key: 'حدد الجمهور والرسالة، خطط بعناصر قليلة، استخدم خامات متاحة آمنة، ثم اختبر الوضوح وراجع التصميم.',
          questions: [
            { q: 'ما الذي يسبق اختيار الزخارف في الملصق؟', options: ['تحديد الرسالة والجمهور', 'إضافة أكبر عدد من الكلمات', 'اختيار مادة مجهولة', 'نسخ تصميم منشور'], answer: 0, why: 'الرسالة والجمهور يوجهان اختيار الكلمات والعناصر المناسبة.' },
            { q: 'أي خامة مناسبة لنشاط بسيط منخفض التكلفة؟', options: ['ورق مستعمل نظيف وقلم رصاص أو تلوين', 'مادة كيميائية مجهولة', 'زجاج مكسور', 'أداة حادة غير لازمة'], answer: 0, why: 'الورق النظيف والأقلام المعتادة يكفيان للتخطيط والرسم.' },
            { q: 'كيف نتحقق من وضوح الملصق؟', options: ['نسأل مشاهداً ماذا فهم ونراجع مكان العنوان', 'نخفي الرسالة في تفاصيل صغيرة', 'نفترض أن الفكرة وصلت بلا اختبار', 'نضيف معلومات شخصية كاملة'], answer: 0, why: 'سؤال المشاهد ومراجعة القراءة يساعدان على تحسين التواصل ويحفظان الخصوصية.' }
          ]
        }
      ],
      exercises: [
        { q: 'أي اختيار يحترم أصالة العمل وحقوق الآخرين؟', options: ['استلهام فكرة بيئية وإعادة صياغتها بأسلوبي', 'نسخ لوحة محمية ونسبها لنفسي', 'إخفاء مصدر صورة منسوخة', 'اعتبار كل الأنماط العامة ملكاً لي'], answer: 0, why: 'استلهام فكرة عامة مع ابتكار صياغة شخصية أكثر احتراماً للأصالة والحقوق.' },
        { q: 'ما ميزة عبارة قصيرة وواضحة على الملصق؟', options: ['تسهل القراءة وتساعد على تذكر الرسالة', 'تضمن رأياً واحداً لدى الجميع', 'تغني عن تنظيم العناصر', 'تتطلب خامة خاصة'], answer: 0, why: 'الإيجاز قد يساعد على وصول الرسالة، مع بقاء أهمية التنظيم والتجريب.' },
        { q: 'أي ممارسة تحفظ السلامة والخصوصية؟', options: ['ورق نظيف وأقلام مألوفة دون بيانات شخصية', 'مواد مجهولة وأداة حادة', 'تصوير أشخاص دون إذن ونشر صورهم', 'إضافة رقم هاتف على ملصق عام'], answer: 0, why: 'الخامات البسيطة المعروفة وتجنب البيانات الشخصية خياران أكثر أماناً.' },
        { q: 'ما فائدة سؤال مشاهد عما فهمه من التصميم؟', options: ['فحص وضوح الرسالة واكتشاف ما يمكن تحسينه', 'فرض ذوق واحد على كل الناس', 'إثبات أن العمل لا يقبل المراجعة', 'الحكم على الفنان بدلاً من التصميم'], answer: 0, why: 'استجابة المشاهد مؤشر للمراجعة وليست حكماً نهائياً على قيمة العمل.' }
      ],
      writtenExercises: [{
        id: 'art-g8t1-open-poster',
        q: 'خطط لملصق أو بطاقة مدرسية أصلية تساعد على العناية بالكتب أو ترتيب الفصل. اذكر الرسالة والجمهور والعناصر والتوزيع والخامات الآمنة، واشرح ما الذي قد تعدله بعد سماع رأي مشاهد.',
        answerText: 'إجابة ممكنة: أوجه ملصق «نحافظ على كتبنا» لزملائي. أرسم كتاباً مبسطاً من ابتكاري وأضع العبارة في أعلى الورقة بخط واضح، وأكرر لوناً واحداً لربط الرسم بالعنوان. أستخدم ورقاً مستعملاً نظيفاً وقلم تلوين متاحاً. أسأل زميلاً ماذا فهم؛ فإن لم يقرأ العنوان بسهولة أكبره أو أنقل موضعه. تقبل الأفكار والرسائل الأخرى المناسبة ما دامت أصلية وآمنة ومشروحة.',
        rubric: [
          { criterion: 'وضوح الفكرة أو الرسالة والجمهور المقصود', points: 1 },
          { criterion: 'اختيار عناصر بصرية ملائمة وأصلية', points: 1 },
          { criterion: 'تنظيم يراعي القراءة والتوازن أو التباين', points: 1 },
          { criterion: 'شرح الاختيارات والمراجعة مع ذكر خامات آمنة', points: 1 }
        ],
        points: 4
      }]
    }
  ];

  var exams = [
    {
      id: 'art-g8t1-comprehensive-exam',
      title: 'امتحان شامل استرشادي: مراجعة المحاور الثلاثة',
      note: 'اختيار من متعدد مع تصحيح فوري وسؤالان مفتوحان بنموذج وروبريك. هذا اختبار مراجعة مهارية غير رسمي، وليس امتحاناً وزارياً أو دليلاً على فهرس مقرر 2026/2027.',
      questions: [
        { q: 'أي عبارة تصف الخط وصفاً بصرياً؟', options: ['أثر قد يحدد حافة أو يوجه العين', 'معنى واحد ثابت لا يتغير', 'اسم الأداة فقط', 'مساحة بلا حدود'], answer: 0, why: 'الخط عنصر بصري يمكن أن يحدد حافة أو يوجه النظر بحسب استخدامه.' },
        { q: 'كيف يمكن تمثيل ملمس في رسم بسيط؟', options: ['بخطوط أو نقاط توحي بسطح ما', 'بمواد منزلية مجهولة', 'بأداة حادة', 'بنسخ عمل محمي'], answer: 0, why: 'يمكن اقتراح الملمس بالرسم فقط وبأساليب متعددة.' },
        { q: 'ماذا يصف التباين اللوني؟', options: ['اختلافاً واضحاً بين درجتين أو لونين', 'تطابقاً تاماً لا اختلاف فيه', 'عدداً إلزامياً من الألوان', 'معنى ثابتاً عند كل مشاهد'], answer: 0, why: 'التباين فرق بصري ملحوظ ولا يحدد وحده جودة العمل أو معناه.' },
        { q: 'هل يلزم أن يكون التوازن متماثلاً؟', options: ['لا، يمكن أن يكون غير متماثل', 'نعم في كل تصميم', 'نعم مع شكل واحد فقط', 'لا يوجد توازن في الصور'], answer: 0, why: 'قد يتحقق التوازن بتوزيع غير متماثل للأحجام والمواضع.' },
        { q: 'ما الذي يدعم الإيقاع البصري؟', options: ['تكرار أو تنويع منظم', 'حذف كل العناصر', 'إضافة كلمات عشوائية فقط', 'استخدام خامة مجهولة'], answer: 0, why: 'التكرار أو التنويع المنظم قد يصنع إيقاعاً.' },
        { q: 'كيف يمكن دعم وحدة عمل فني؟', options: ['تكرار علاقة تربط بعض أجزائه', 'إضافة تفاصيل لا علاقة لها بالفكرة', 'إلغاء كل الروابط', 'ملء كل الفراغ'], answer: 0, why: 'العلاقات المتكررة قد تربط أجزاء التكوين.' },
        { q: 'أي خيار يجمع الوحدة والتباين؟', options: ['لون متكرر مع شكل واحد أكثر بروزاً', 'جميع العناصر متطابقة ولا رابط بينها', 'تفاصيل كثيرة بلا ترتيب', 'إخفاء العنصر الرئيسي'], answer: 0, why: 'التكرار قد يربط الأجزاء والاختلاف قد يبرز عنصراً في آن واحد.' },
        { q: 'أي خطوة تساعد على تحويل ملاحظة بيئية إلى عمل أصلي؟', options: ['تدوين الصفات ثم ابتكار صياغة شخصية', 'نسخ لوحة كاملة ونسبها للنفس', 'إخفاء صاحب العمل المنسوخ', 'ادعاء تمثيل ثقافة كاملة برسم واحد'], answer: 0, why: 'إعادة الصياغة بأسلوب شخصي تحفظ الأصالة وتتجنب النسخ والادعاءات العامة.' },
        { q: 'ما الخطوة الأولى في تخطيط ملصق؟', options: ['تحديد الرسالة والجمهور', 'إضافة كل الزخارف الممكنة', 'اختيار خامة مجهولة', 'كتابة بيانات شخصية'], answer: 0, why: 'الهدف والجمهور يحددان العناصر المناسبة.' },
        { q: 'ما مثال الخامات الملائمة لنشاط آمن ومنخفض الكلفة؟', options: ['ورق مستعمل نظيف وأقلام متاحة', 'مواد كيميائية مجهولة', 'زجاج مكسور', 'أداة حادة غير لازمة'], answer: 0, why: 'يمكن إنجاز التخطيط والرسم على ورق نظيف بأقلام معتادة.' },
        { q: 'كيف نتحقق من أن الملصق مفهوم؟', options: ['نسأل مشاهداً ماذا فهم ونراجع الوضوح', 'نفترض نجاحه دون عرضه', 'نصغر العبارة قدر الإمكان', 'نمنع أي ملاحظة'], answer: 0, why: 'رأي المشاهد يساعد على مراجعة قابلية القراءة ووصول الفكرة.' },
        { q: 'هل نموذج الإجابة الفنية يعني وجود حل فني وحيد؟', options: ['لا، هو احتمال للتوضيح وتقبل البدائل المبررة', 'نعم، يجب نسخ الرسم نفسه', 'نعم، ويمنع التعبير الشخصي', 'لا يسمح بأي شرح للاختيارات'], answer: 0, why: 'الإجابة النموذجية مثال ممكن؛ تقبل الحلول الأخرى الواضحة والمبررة.' }
      ],
      writtenQuestions: [
        { id: 'art-g8t1-final-open-composition', q: 'ابتكر وصفاً لتكوين من عناصر بسيطة يحقق التوازن والإيقاع والوحدة، واذكر تبايناً واحداً يساعد على إبراز الفكرة.', answerText: 'إجابة ممكنة: أوزع شكلاً رئيسياً مع أشكال أصغر في الجهة المقابلة، وأكرر خطاً أو لوناً لصنع إيقاع وربط الأجزاء. أجعل الشكل الرئيسي أكبر أو أغمق ليظهر بوضوح. توجد حلول أخرى تحقق الفكرة؛ المهم شرح الاختيارات.', rubric: [{ criterion: 'وضوح الفكرة والعنصر المهم', points: 1 }, { criterion: 'استخدام عناصر مناسبة', points: 1 }, { criterion: 'تنظيم يوضح العلاقات المطلوبة', points: 1 }, { criterion: 'شرح الاختيارات بوضوح', points: 1 }], points: 4 },
        { id: 'art-g8t1-final-open-poster', q: 'خطط لملصق مدرسي أصلي من خامات متاحة، واشرح كيف ستجعل رسالته واضحة وآمنة.', answerText: 'إجابة ممكنة: أختار رسالة قصيرة مناسبة لزملائي، وأرسم رمزاً من ابتكاري على ورق مستعمل نظيف بقلم تلوين. أرتب العنوان في مكان بارز وأستخدم تبايناً بسيطاً، ثم أسأل مشاهداً عما فهمه وأعدل التصميم عند الحاجة. لا أضيف معلومات شخصية أو أنسخ عملاً جاهزاً.', rubric: [{ criterion: 'وضوح الفكرة والجمهور', points: 1 }, { criterion: 'عناصر مناسبة وأصلية', points: 1 }, { criterion: 'تنظيم وتباين يخدمان الرسالة', points: 1 }, { criterion: 'شرح وخامات آمنة وخطة مراجعة', points: 1 }], points: 4 }
      ]
    },
    {
      id: 'art-g8t1-portfolio',
      title: 'ملف إنجاز فني: فكرة، تجريب، مراجعة وتأمل',
      note: 'مهمة تطبيقية للتقييم الذاتي وليست امتحاناً وزارياً. أنجز عملاً أصلياً صغيراً حول شيء من البيئة أو المدرسة أو فكرة تراثية عامة، دون نسخ عمل فني محمي. يكفي تخطيط على ورق مستعمل نظيف بقلم رصاص أو تلوين. لا يلزم رفع صورة أو مشاركة اسم كامل أو بيانات شخصية؛ يمكن توثيق العمل بوصف مكتوب فقط.',
      questions: [],
      writtenQuestions: [
        { id: 'art-g8t1-portfolio-design', q: 'صف عملك أو خطتك الفنية: ما الفكرة؟ ما العناصر التي جربتها؟ كيف رتبتها؟ وما تعديل واحد أجريته بعد المراجعة؟', answerText: 'مثال ممكن: صممت بطاقة عن ترتيب الفصل برسم رف وكتب مبسطة، وجربت وضع العنوان أعلى البطاقة ثم بجوار الرسم. اخترت العنوان في الأعلى لأنه كان أوضح، وكررت لوناً في الكتاب والعنوان لربطهما. هذا نموذج واحد، ويمكن أن تختلف الفكرة والعناصر والترتيب.', rubric: [{ criterion: 'وضوح الفكرة أو الرسالة', points: 1 }, { criterion: 'استخدام عناصر بصرية مناسبة', points: 1 }, { criterion: 'تنظيم التكوين وإظهار موضع الاهتمام', points: 1 }, { criterion: 'شرح الاختيارات والتعديل بعد المراجعة', points: 1 }], points: 4 },
        { id: 'art-g8t1-portfolio-reflection', q: 'ما أكثر قرار فني تعتز به؟ اذكر دليلاً بصرياً من عملك، وشيئاً ستجربه في عمل لاحق.', answerText: 'إجابة ممكنة: أعتز بتكرار الخطوط حول النبات لأنها جعلت العين تنتقل بين الأوراق. في المرة التالية سأجرب تغيير المسافات لأرى أثرها في الإيقاع. تقبل أي إجابة شخصية تشير إلى تفصيل مرئي وتقدم فكرة تطوير.', rubric: [{ criterion: 'تحديد فكرة أو قرار فني واضح', points: 1 }, { criterion: 'الإشارة إلى عنصر أو تفصيل مستخدم', points: 1 }, { criterion: 'شرح تنظيم أو أثر ذلك القرار', points: 1 }, { criterion: 'تأمل تطويري واضح ومبرر', points: 1 }], points: 4 }
      ]
    }
  ];

  function addAnswerModelAliases(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach(addAnswerModelAliases); return; }
    if (typeof value.answerText === 'string' && typeof value.answerModel !== 'string') value.answerModel = value.answerText;
    Object.keys(value).forEach(function (key) { addAnswerModelAliases(value[key]); });
  }
  addAnswerModelAliases(units);
  addAnswerModelAliases(exams);

  function normalize(value) {
    return String(value || '')
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .trim();
  }

  function isTarget(type) {
    var stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
    var grade = normalize(typeof currentGrade === 'undefined' ? '' : currentGrade);
    var subject = normalize(typeof currentSubject === 'undefined' ? '' : currentSubject);
    var term = typeof currentTerm === 'undefined' ? 1 : Number(currentTerm);
    return stage === 'prep' && /ثاني/.test(grade) && /فن/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
  }

  function text(tag, value, className) {
    var element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function card(title, description, id, icon) {
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'content-item';
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', title);
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openItem(id);
    });
    var iconBox = document.createElement('div');
    iconBox.className = 'content-item-icon';
    iconBox.textContent = icon;
    var info = document.createElement('div');
    info.className = 'content-item-info';
    var heading = document.createElement('div');
    heading.className = 'content-item-title';
    heading.textContent = title;
    var subtitle = document.createElement('div');
    subtitle.className = 'content-item-sub';
    subtitle.textContent = description;
    var arrow = document.createElement('div');
    arrow.className = 'content-item-arrow';
    arrow.textContent = '‹';
    info.appendChild(heading);
    info.appendChild(subtitle);
    link.appendChild(iconBox);
    link.appendChild(info);
    link.appendChild(arrow);
    return link;
  }

  function noticeBox() {
    var notice = document.createElement('div');
    notice.setAttribute('dir', 'rtl');
    notice.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.9;color:#594300;font-size:13px;overflow-wrap:anywhere;';
    notice.textContent = 'تنبيه مهم: ' + NOTICE;
    return notice;
  }

  function shuffledIndices(length) {
    var order = [];
    for (var i = 0; i < length; i += 1) order.push(i);
    for (var j = order.length - 1; j > 0; j -= 1) {
      var swapIndex = Math.floor(Math.random() * (j + 1));
      var value = order[j];
      order[j] = order[swapIndex];
      order[swapIndex] = value;
    }
    return order;
  }

  var ESSAY_SCORE_STORAGE_KEY = 'ta3lemy-art-g8-t1-essay-scores-v1';

  function readEssayScores() {
    try {
      var raw = window.localStorage.getItem(ESSAY_SCORE_STORAGE_KEY);
      var scores = raw ? JSON.parse(raw) : {};
      return scores && typeof scores === 'object' && !Array.isArray(scores) ? scores : {};
    } catch (error) {
      return {};
    }
  }

  function saveEssayScore(key, record) {
    try {
      var scores = readEssayScores();
      scores[key] = record;
      window.localStorage.setItem(ESSAY_SCORE_STORAGE_KEY, JSON.stringify(scores));
      return true;
    } catch (error) {
      return false;
    }
  }

  function countEssayQuestions() {
    var practiceCount = units.reduce(function (total, unit) { return total + (unit.writtenExercises || []).length; }, 0);
    var examCount = exams.reduce(function (total, exam) { return total + (exam.writtenQuestions || []).length; }, 0);
    return practiceCount + examCount;
  }

  function essayQuestionBox(questions, sourceId, itemTitle) {
    var wrap = document.createElement('div');
    questions.forEach(function (question, questionIndex) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #d8e5df;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var heading = text('div', (questionIndex + 1) + '. ' + question.q);
      heading.style.cssText = 'font-weight:700;line-height:1.9;margin-bottom:10px;';
      block.appendChild(heading);
      var label = text('label', 'إجابة وصفية اختيارية (لا تُحفظ على الجهاز):');
      label.style.cssText = 'display:block;font-weight:700;margin:10px 0 6px;';
      var response = document.createElement('textarea');
      response.rows = 4;
      response.maxLength = 3000;
      response.placeholder = 'اكتب إجابتك هنا؛ لن يُحفظ نص الإجابة.';
      response.setAttribute('aria-label', 'إجابة وصفية اختيارية');
      response.style.cssText = 'display:block;width:100%;min-height:100px;padding:10px;border:1px solid #bdbdbd;border-radius:10px;font:inherit;line-height:1.8;resize:vertical;';
      block.appendChild(label);
      block.appendChild(response);

      var details = document.createElement('details');
      details.style.cssText = 'margin-top:10px;background:#F5F9F5;border-radius:9px;padding:9px 12px;line-height:1.9;';
      details.appendChild(text('summary', 'عرض نموذج الإجابة وروبريك التقييم (' + question.points + ' درجات)'));
      var model = text('p', 'نموذج إجابة: ' + question.answerText);
      model.style.margin = '8px 0';
      details.appendChild(model);
      details.appendChild(text('strong', 'توزيع الدرجات:'));
      var rubricList = document.createElement('ul');
      rubricList.style.margin = '6px 0';
      question.rubric.forEach(function (criterion) {
        rubricList.appendChild(text('li', criterion.criterion + ' — ' + criterion.points + ' درجة'));
      });
      details.appendChild(rubricList);
      block.appendChild(details);

      var scoreKey = String(sourceId || 'source') + '::' + question.id;
      var storedRecord = readEssayScores()[scoreKey];
      var scorePanel = document.createElement('div');
      scorePanel.style.cssText = 'margin-top:12px;padding:11px;background:#F3F6FA;border-radius:10px;';
      var scoreLabel = text('label', 'درجتك الذاتية (عدد صحيح من 0 إلى ' + question.points + '):');
      scoreLabel.style.cssText = 'display:block;font-weight:700;margin-bottom:6px;';
      var scoreInput = document.createElement('input');
      scoreInput.type = 'number';
      scoreInput.min = '0';
      scoreInput.max = String(question.points);
      scoreInput.step = '1';
      scoreInput.value = storedRecord && Number.isInteger(Number(storedRecord.score)) ? String(storedRecord.score) : '';
      scoreInput.placeholder = 'أدخل الدرجة';
      scoreInput.setAttribute('aria-label', 'درجتك الذاتية من صفر إلى ' + question.points);
      scoreInput.style.cssText = 'width:120px;max-width:100%;padding:9px;border:1px solid #bdbdbd;border-radius:8px;font:inherit;';
      var saveButton = document.createElement('button');
      saveButton.type = 'button';
      saveButton.textContent = 'حفظ الدرجة على هذا الجهاز';
      saveButton.style.cssText = 'margin:6px 8px;padding:9px 13px;background:#176B5B;color:white;border:0;border-radius:8px;font:inherit;font-weight:700;cursor:pointer;';
      var status = text('div', storedRecord ? 'الدرجة المحفوظة: ' + storedRecord.score + ' من ' + question.points : '');
      status.style.cssText = 'margin-top:6px;font-size:13px;line-height:1.7;';
      saveButton.addEventListener('click', function () {
        var rawScore = String(scoreInput.value || '').trim();
        var score = Number(rawScore);
        if (!rawScore || !Number.isInteger(score) || score < 0 || score > question.points) {
          status.style.color = '#B71C1C';
          status.textContent = 'أدخل عدداً صحيحاً من 0 إلى ' + question.points + '.';
          return;
        }
        var record = {
          sourceId: sourceId,
          itemTitle: itemTitle || sourceId,
          questionId: question.id,
          question: question.q,
          score: score,
          points: question.points,
          updatedAt: new Date().toISOString()
        };
        if (!saveEssayScore(scoreKey, record)) {
          status.style.color = '#B71C1C';
          status.textContent = 'تعذر حفظ الدرجة محلياً على هذا الجهاز.';
          return;
        }
        status.style.color = '#2E7D32';
        status.textContent = 'تم حفظ درجتك: ' + score + ' من ' + question.points + ' على هذا الجهاز فقط.';
      });
      scorePanel.appendChild(scoreLabel);
      scorePanel.appendChild(scoreInput);
      scorePanel.appendChild(saveButton);
      scorePanel.appendChild(status);
      block.appendChild(scorePanel);
      wrap.appendChild(block);
    });
    return wrap;
  }

  function questionBox(questions, prefix, writtenQuestions, itemTitle) {
    var wrap = document.createElement('div');
    wrap.setAttribute('dir', 'rtl');
    questions.forEach(function (question, questionIndex) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var title = text('div', (questionIndex + 1) + '. ' + question.q);
      title.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;';
      block.appendChild(title);
      var choices = document.createElement('div');
      shuffledIndices(question.options.length).forEach(function (choiceIndex) {
        var choice = question.options[choiceIndex];
        var label = document.createElement('label');
        label.style.cssText = 'display:flex;gap:8px;align-items:flex-start;padding:7px 3px;line-height:1.7;cursor:pointer;';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = prefix + '-q' + questionIndex;
        input.value = String(choiceIndex);
        input.style.marginTop = '6px';
        label.appendChild(input);
        label.appendChild(text('span', choice));
        choices.appendChild(label);
      });
      block.appendChild(choices);
      var result = text('div', '');
      result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.8;';
      block.appendChild(result);
      block._artQuestion = question;
      block._artResult = result;
      wrap.appendChild(block);
    });
    if (writtenQuestions && writtenQuestions.length) {
      var essayHeading = text('h3', 'أسئلة وصفية ومقالية للتقييم الذاتي');
      essayHeading.style.cssText = 'margin:18px 0 8px;';
      wrap.appendChild(essayHeading);
      wrap.appendChild(essayQuestionBox(writtenQuestions, prefix, itemTitle));
    }
    var check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'تحقق من الإجابات';
    check.style.cssText = 'background:#176B5B;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    check.addEventListener('click', function () {
      var score = 0;
      var total = 0;
      Array.prototype.forEach.call(wrap.children, function (block) {
        var question = block._artQuestion;
        if (!question) return;
        total += 1;
        var selected = block.querySelector('input[type="radio"]:checked');
        var correct = !!selected && Number(selected.value) === question.answer;
        if (correct) score += 1;
        block._artResult.style.display = 'block';
        block._artResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        block._artResult.textContent = (correct ? 'إجابة صحيحة. ' : 'راجع الاختيار. ') + question.why;
      });
      scoreBox.textContent = 'نتيجتك: ' + score + ' من ' + total;
    });
    var scoreBox = text('div', '');
    scoreBox.style.cssText = 'font-weight:700;color:#176B5B;margin:6px 0 12px;';
    wrap.appendChild(check);
    wrap.appendChild(scoreBox);
    return wrap;
  }

  function openEssayScoreTracker() {
    var body = document.getElementById('viewerBody');
    var title = document.getElementById('viewerTitle');
    if (!body || !title) return;
    body.textContent = '';
    body.setAttribute('dir', 'rtl');
    title.textContent = 'متابعة درجات المراجعة الذاتية للفنية';
    body.appendChild(noticeBox());
    var scores = readEssayScores();
    var entries = Object.keys(scores).map(function (key) { return scores[key]; }).filter(function (record) {
      return record && typeof record === 'object' && Number.isInteger(Number(record.score)) && Number.isInteger(Number(record.points));
    });
    var earned = entries.reduce(function (total, record) { return total + Number(record.score); }, 0);
    var possible = entries.reduce(function (total, record) { return total + Number(record.points); }, 0);
    var percentage = possible ? Math.round(earned / possible * 100) : 0;
    var summary = document.createElement('section');
    summary.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:14px;margin:12px 0;line-height:1.9;';
    summary.appendChild(text('h3', 'ملخص التقدم في التقييم الذاتي'));
    summary.appendChild(text('p', 'مجموع الدرجات المسجلة: ' + earned + ' من ' + possible + ' درجة (' + percentage + '%).'));
    summary.appendChild(text('p', 'عدد مرات تسجيل الدرجات: ' + entries.length + ' من ' + countEssayQuestions() + ' مواضع سؤال مقالي.'));
    summary.appendChild(text('p', 'تُحفظ الدرجات محلياً على هذا الجهاز فقط؛ لا يُحفظ نص الإجابة ولا يُرسل إلى الخادم.'));
    body.appendChild(summary);
    if (!entries.length) {
      body.appendChild(text('p', 'لم تُسجل درجات بعد. افتح تدريب الوحدة أو الامتحان الختامي، وراجع النموذج والروبريك ثم احفظ الدرجة.'));
    } else {
      entries.sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
      entries.forEach(function (record) {
        var row = document.createElement('section');
        row.style.cssText = 'border:1px solid #e4e9e4;border-radius:11px;padding:12px;margin:10px 0;background:#fff;line-height:1.8;';
        row.appendChild(text('h4', record.itemTitle || 'تقييم مقالي'));
        row.appendChild(text('p', record.question || ''));
        row.appendChild(text('strong', 'الدرجة: ' + record.score + ' من ' + record.points));
        if (record.updatedAt) row.appendChild(text('div', 'آخر تحديث: ' + new Date(record.updatedAt).toLocaleString('ar-EG')));
        if (record.sourceId) {
          var sourceButton = document.createElement('button');
          sourceButton.type = 'button';
          sourceButton.textContent = 'العودة إلى مصدر السؤال';
          sourceButton.style.cssText = 'margin-top:8px;padding:8px 12px;background:#176B5B;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer;';
          sourceButton.addEventListener('click', function () { openItem(record.sourceId); });
          row.appendChild(sourceButton);
        }
        body.appendChild(row);
      });
    }
    screenHistory.push(currentScreen);
    showScreen('viewerScreen');
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
    if (id === 'essay-score-tracker') {
      openEssayScoreTracker();
      return;
    }
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
      body.appendChild(text('h2', found.unit.title, 'art-unit-title'));
      found.item.explain.forEach(function (paragraph) {
        var p = text('p', paragraph);
        p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;';
        body.appendChild(p);
      });
      var example = document.createElement('div');
      example.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      example.appendChild(text('strong', 'مثال بصري: '));
      example.appendChild(text('span', found.item.example));
      body.appendChild(example);
      var key = document.createElement('div');
      key.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      key.appendChild(text('strong', 'خلاصة الدرس: '));
      key.appendChild(text('span', found.item.key));
      body.appendChild(key);
      body.appendChild(text('h3', 'تدريب قصير مع تصحيح فوري'));
      body.appendChild(questionBox(found.item.questions, found.item.id));
    } else {
      body.appendChild(text('p', found.kind === 'exam' ? found.item.note : 'بنك تدريبات استرشادي على المحور، مع تصحيح فوري وتعليل لكل سؤال.'));
      if (found.kind === 'exercise') body.appendChild(text('h3', found.unit.title));
      if (found.kind === 'exercise') {
        body.appendChild(questionBox(found.item.exercises, found.item.id, found.item.writtenExercises || [], found.item.title));
      } else {
        body.appendChild(questionBox(found.item.questions, found.item.id, found.item.writtenQuestions || [], found.item.title));
      }
    }
    if (typeof screenHistory !== 'undefined' && typeof currentScreen !== 'undefined' && typeof showScreen === 'function') {
      screenHistory.push(currentScreen);
      showScreen('viewerScreen');
    }
  }

  function appendContent(type) {
    var list = document.getElementById('contentList');
    if (!list) return;
    for (var index = list.children.length - 1; index >= 0; index -= 1) {
      var childClasses = String(list.children[index].className || '').split(/\s+/);
      if (childClasses.indexOf('empty-state') >= 0) list.removeChild(list.children[index]);
    }
    var root = document.createElement('div');
    root.className = 'art-original-content art-g8t1-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
    if (type === 'exercises' || type === 'exams') {
      root.appendChild(card('متابعة درجات المراجعة الذاتية', 'اعرض مجموع درجاتك المقالية وسجلها، ثم عُد إلى مصدر السؤال لتعديل أي درجة.', 'essay-score-tracker', '📊'));
    }
    if (type === 'lessons') {
      units.forEach(function (unit) {
        root.appendChild(text('h3', unit.title, 'art-unit-heading'));
        unit.lessons.forEach(function (lesson) {
          root.appendChild(card(lesson.title, lesson.explain[0], lesson.id, '🎨'));
        });
      });
    } else if (type === 'exercises') {
      units.forEach(function (unit) {
        var questionCount = unit.exercises.length + unit.lessons.reduce(function (total, lesson) { return total + lesson.questions.length; }, 0);
        var writtenCount = (unit.writtenExercises || []).length;
        root.appendChild(card('بنك تدريبات ' + unit.title, questionCount + ' سؤال اختيار من متعدد مع تصحيح فوري وتعليل، و' + writtenCount + ' سؤال مقالي بنموذج وروبريك • يتضمن تدريباً لكل درس', unit.id, '✏️'));
      });
    } else if (type === 'exams') {
      exams.forEach(function (exam) {
        root.appendChild(card(exam.title, exam.note, exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openArtGrade8Term1Item = openItem;
  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent === 'function' && !originalOpenContent.__artGrade8Term1Wrapped) {
    var wrapped = async function (type, termNumber, termName) {
      var result = await originalOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrapped.__artGrade8Term1Wrapped = true;
    window.openContent = wrapped;
  }
})();
