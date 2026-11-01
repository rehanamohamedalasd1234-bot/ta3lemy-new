// Original, provisional learning content for Grade 7 Computer Studies, Term 1 (Egypt 2026/2027).
// The Ministry's available computer-book page is historical (2017/2018); this file does not claim a current verified syllabus.
// Only the two recently circulated themes named below are covered. All explanations and questions are original.
(function () {
  'use strict';

  var NOTICE = 'تنبيه مهم: هذا محتوى استرشادي غير مثبت كمنهج وزارة 2026/2027، ولا يؤكد اكتمال مقرر الترم. الموضوعان مبنيان على موضوعات متداولة في مصدر تعليمي غير وزاري، وليس على كتاب وزاري حالي موثّق. راجع كتابك ومدرستك قبل اعتباره مقرراً.';

  var essayQuestions = [
    {
      id: 'computer-essay-green-01',
      q: 'اقترح ثلاث ممارسات للتكنولوجيا الخضراء في المدرسة وبيّن فائدة كل منها',
      answerText: 'يمكن إطفاء الإنارة والأجهزة غير المستخدمة لتقليل استهلاك الكهرباء، وإغلاق الصنبور وإصلاح التسرب لترشيد الماء، وفرز المخلفات الإلكترونية والعادية وفق نظام المدرسة لتقليل النفايات. نلاحظ استهلاك الكهرباء والماء أو نسجل كمياتهما قبل المبادرة وبعدها لقياس التغيير ومعرفة أثر الممارسات.',
      points: 4,
      rubric: [
        { criterion: 'اقتراح ممارسة مناسبة لترشيد الطاقة', points: 1 },
        { criterion: 'اقتراح ممارسة مناسبة لترشيد الماء', points: 1 },
        { criterion: 'اقتراح تقليل النفايات أو فرزها', points: 1 },
        { criterion: 'بيان أثر بيئي واضح أو طريقة لملاحظة التغيير', points: 1 }
      ]
    },
    {
      id: 'computer-essay-digital-safety-01',
      q: 'اكتب خطوات آمنة لاستخدام خدمة أو دفع رقمي',
      answerText: 'أفتح التطبيق أو الموقع الرسمي بنفسي، وأتحقق من الجهة واسمها قبل الاستخدام. أراجع المبلغ والتفاصيل والبيانات المطلوبة قبل التأكيد، ولا أشارك كلمة المرور أو رمز التحقق مع أي شخص. إذا ظهر طلب أو رابط مريب أوقف العملية ولا أتابعها، وأطلب مساعدة ولي الأمر أو أتحقق من الجهة عبر قناة رسمية.',
      points: 4,
      rubric: [
        { criterion: 'التحقق من مصدر الخدمة أو استخدام الموقع/التطبيق الرسمي', points: 1 },
        { criterion: 'مراجعة تفاصيل العملية والمبلغ والبيانات المطلوبة', points: 1 },
        { criterion: 'حماية كلمة المرور ورمز التحقق وعدم مشاركتهما', points: 1 },
        { criterion: 'إيقاف العملية المشبوهة وطلب مساعدة موثوقة', points: 1 }
      ]
    }
  ];

  var units = [
    {
      id: 'green-digital-living',
      title: 'وحدة استرشادية: التكنولوجيا الخضراء والتحول الرقمي',
      lessons: [
        {
          id: 'green-technology',
          title: '1. التكنولوجيا الخضراء وحماية البيئة',
          explain: [
            'التكنولوجيا الخضراء هي توظيف المعرفة والأدوات بطريقة تساعد على تقليل الضرر البيئي وحسن استخدام الموارد. ليست الفكرة شراء أجهزة جديدة فحسب؛ فقد يكون تغيير عادة يومية، مثل إطفاء شاشة لا نستخدمها، خطوة نافعة أيضاً.',
            'ترشيد الطاقة يعني تجنب الهدر مع استمرار أداء الحاجة. يمكن إطفاء المصابيح والأجهزة غير المستخدمة، وضبط إعدادات توفير الطاقة، واختيار إضاءة مناسبة. وتقلل الطاقة المتجددة، مثل طاقة الشمس والرياح، الاعتماد على مصادر تنفد أو تسبب انبعاثات أثناء تشغيلها، مع مراعاة ملاءمتها للمكان.',
            'الماء مورد مهم؛ ومن صور ترشيده إصلاح التسرب وإغلاق الصنبور عند عدم الحاجة واستخدامه بقدر الحاجة. أما إدارة النفايات فتبدأ بتقليل ما نستهلكه، ثم إعادة استخدام الأشياء الآمنة، وفرز ما يمكن تدويره وفق نظام المكان. إعادة استخدام جهاز صالح أو إصلاحه قد يؤخر تحوله إلى نفاية إلكترونية.',
            'يمكن استخدام حساسات بسيطة لرصد مؤشرات بيئية، مثل حساس يلتقط شدة الضوء أو درجة الحرارة أو وجود الرطوبة. الحساس يجمع قراءة تساعد على اتخاذ قرار، لكنه لا يحل المشكلة وحده؛ فالإنسان يفسر القراءة ويتصرف على أساسها. ينبغي أن تكون أدوات الرصد مناسبة وآمنة وألا تجمع بيانات شخصية بلا حاجة.',
            'للأجهزة الرقمية أثر بيئي طوال دورة حياتها: استخراج المواد وصناعة الجهاز ونقله واستهلاكه للكهرباء ثم التخلص منه. إطالة عمر الجهاز بالعناية والإصلاح، وفصل الشاحن عند عدم الحاجة، وتسليم الأجهزة التالفة إلى جهة جمع مناسبة، كلها ممارسات تقلل الهدر. لا تضع البطاريات أو الأجهزة الإلكترونية في النار أو في مسار النفايات العادية إذا توفر جمع مخصص.'
          ],
          applications: [
            'في فصل مضاء بالشمس: أطفئ المصابيح التي لا نحتاج إليها، مع إبقاء الإضاءة الكافية للقراءة.',
            'إذا أظهر حساس الرطوبة أن التربة رطبة، يمكن تأجيل ري النبات بدلاً من استخدام الماء بلا داعٍ.',
            'قبل التخلص من جهاز قديم، افحص إمكان إصلاحه أو إعادة استخدامه، ثم ابحث عن نقطة جمع للنفايات الإلكترونية.'
          ],
          example: 'مبادرة صفية: يسجل الطلاب لمدة أسبوع أوقات بقاء الأنوار مشتعلة في غرفة خالية، ثم يقترحون تذكيراً بإطفائها. يقارنون السجل قبل المبادرة وبعدها؛ فالقراءة أو الملاحظة تساعد في تقييم التغيير.',
          key: 'التكنولوجيا الخضراء تقلل الهدر والأثر البيئي: نرشد الطاقة والماء، نستفيد من الطاقة المتجددة، نقلل النفايات ونعيد الاستخدام، ونستخدم الحساسات للرصد الواعي، مع إطالة عمر الأجهزة والتخلص المسؤول منها.',
          questions: [
            { id: 'green-quiz-01', q: 'أي تصرف يحقق ترشيداً للطاقة من دون تعطيل الحاجة؟', options: ['ترك كل الشاشات تعمل طوال اليوم', 'إطفاء شاشة لا يستخدمها أحد', 'زيادة سطوع الشاشة إلى أقصى حد دائماً', 'تشغيل مصباح في غرفة خالية'], answer: 1, why: 'إطفاء الجهاز غير المستخدم يقلل استهلاك الكهرباء مع بقاء الأجهزة اللازمة متاحة.' },
            { id: 'green-quiz-02', q: 'ما الدور الأنسب لحساس الرطوبة في ري نبات؟', options: ['قياس رطوبة التربة للمساعدة في تحديد وقت الري', 'إنتاج الماء من تلقاء نفسه', 'استبدال النبات', 'ضمان نمو النبات بلا عناية'], answer: 0, why: 'الحساس يرصد قراءة، ويستخدمها الشخص لاتخاذ قرار مناسب؛ فهو لا ينتج الماء ولا يتخذ كل القرارات وحده.' },
            { id: 'green-quiz-03', q: 'أي خيار يساعد على تقليل النفايات الإلكترونية؟', options: ['رمي الجهاز في النار', 'تغيير جهاز صالح كل شهر', 'إصلاح جهاز صالح أو تسليمه لجهة جمع مناسبة عند تلفه', 'وضع البطارية في الماء'], answer: 2, why: 'الإصلاح وإطالة عمر الجهاز يقللان النفايات، والجمع المخصص يساعد على التعامل معها بأمان.' }
          ]
        },
        {
          id: 'digital-transformation',
          title: '2. التحول الرقمي وأهميته في حياتنا اليومية',
          explain: [
            'التحول الرقمي هو استخدام التقنيات والبيانات لتقديم الأعمال والخدمات أو تحسينها. ليس مجرد نقل ورقة إلى شاشة؛ فقد يعيد تنظيم خطوات الخدمة لتصبح أوضح وأسهل متابعة، مع بقاء الحاجة إلى مراجعة صحة المعلومات وجودة الخدمة.',
            'نقابل خدمات رقمية في مواقف يومية، مثل الاستعلام عن معلومة أو موعد عبر موقع رسمي، والتعلم والتواصل عن بعد، أو متابعة طلب إلكتروني. قد توفر الخدمة الرقمية وقت الانتقال وتيسر الاتصال، لكن نجاحها يعتمد على اتصال مناسب وتصميم مفهوم ودعم لمن يحتاج المساعدة.',
            'عند استخدام الدفع الرقمي، تعامل مع تطبيق أو موقع موثوق، وتحقق من اسم الجهة والمبلغ قبل التأكيد. لا تشارك الرقم السري أو رمز التحقق مع أي شخص، ولا تفتح رابط دفع مجهولاً. إذا وصل طلب مريب، أوقف العملية واسأل ولي الأمر أو الجهة الرسمية بدلاً من الاستعجال.',
            'البيانات الشخصية مثل الاسم الكامل والعنوان ورقم الهاتف والصور ومعلومات الحساب تحتاج إلى حماية. استخدم كلمة مرور طويلة يصعب تخمينها، ولا تعِد استخدامها في كل الحسابات، ولا ترسلها في رسالة. سجّل الخروج من جهاز مشترك، واطلب مساعدة شخص بالغ موثوق عند ظهور رسالة أو طلب غير مفهوم.',
            'ينبغي أن تراعي الخدمات الرقمية إمكانية الوصول: نص واضح، تباين مناسب، أزرار مفهومة، وبدائل تساعد ذوي الاحتياجات المختلفة. كما أن تقليل الخطوات والبيانات غير الضرورية، واستخدام الأجهزة باعتدال والمحافظة عليها، يدعمان تجربة أكثر شمولاً واستدامة.'
          ],
          applications: [
            'قبل إرسال نموذج إلكتروني، راجع الجهة المستقبلة والبيانات المطلوبة ولا تملأ حقولاً غير لازمة.',
            'قبل الدفع، تحقق من اسم الجهة والمبلغ، ولا تشارك كلمة المرور أو رمز التحقق؛ اطلب مساعدة ولي الأمر عند الشك.',
            'إذا تعذر على شخص قراءة زر في صفحة، اقترح تكبير النص وتحسين التباين وكتابة وصف واضح للزر.'
          ],
          example: 'عند متابعة موعد عبر خدمة موثوقة: افتح عنوان الجهة بنفسك، تحقق من تفاصيل الموعد، ولا تحفظ كلمة المرور على جهاز عام. إذا طلبت الصفحة رمز تحقق في رسالة غير متوقعة، لا تشاركه وتحقق من الجهة عبر قناة رسمية.',
          key: 'التحول الرقمي يحسن تقديم الخدمات والاتصال عند استخدامه بوعي. نتحقق من الجهات والمبالغ، نحمي البيانات وكلمات المرور، ونصمم خدمات واضحة ومتاحة ونستخدم الموارد باعتدال.',
          questions: [
            { id: 'digital-quiz-01', q: 'ما المقصود بالتحول الرقمي في هذا الدرس؟', options: ['استخدام التقنيات والبيانات لتحسين تقديم الأعمال والخدمات', 'شراء أحدث جهاز مهما كانت الحاجة', 'إلغاء كل أشكال التواصل', 'تحويل كل معلومة إلى صورة فقط'], answer: 0, why: 'التحول الرقمي يتعلق باستخدام التقنية والبيانات لتقديم الأعمال والخدمات أو تحسينها.' },
            { id: 'digital-quiz-02', q: 'ما التصرف الأكثر أماناً قبل تأكيد دفع رقمي؟', options: ['إرسال رمز التحقق لصديق', 'الضغط على أي رابط وصل برسالة', 'التحقق من الجهة والمبلغ وعدم مشاركة الرمز', 'استخدام كلمة المرور نفسها في كل مكان'], answer: 2, why: 'التحقق من الجهة والمبلغ وحماية رمز التحقق خطوات أساسية لتقليل مخاطر الاحتيال.' },
            { id: 'digital-quiz-03', q: 'أي تحسين يدعم إمكانية الوصول إلى خدمة رقمية؟', options: ['أزرار صغيرة بلا وصف', 'نص واضح وتباين مناسب وأزرار مفهومة', 'إخفاء تعليمات الاستخدام', 'إزالة كل وسائل المساعدة'], answer: 1, why: 'وضوح النص والتباين ووصف الأزرار يساعد أشخاصاً أكثر على فهم الخدمة واستخدامها.' }
          ]
        }
      ],
      exercises: [
        { id: 'computer-bank-01', q: 'ما المقصود بترشيد الطاقة؟', options: ['منع استخدام كل الأجهزة', 'تجنب الهدر مع استخدام ما نحتاج إليه', 'تشغيل الأجهزة في الغرف الخالية', 'زيادة الاستهلاك دون سبب'], answer: 1, why: 'الترشيد هو استخدام الطاقة بكفاءة وتجنب الهدر، وليس منع الحاجة الضرورية.' },
        { id: 'computer-bank-02', q: 'أي مما يأتي مثال على مصدر طاقة متجدد؟', options: ['ضوء الشمس', 'البلاستيك أحادي الاستخدام', 'بطارية مستهلكة', 'جهاز متروك يعمل'], answer: 0, why: 'الشمس مصدر متجدد للطاقة، بخلاف الوقود المحدود أو البطارية المستهلكة.' },
        { id: 'computer-bank-03', q: 'ما أفضل خطوة أولى لتقليل النفايات؟', options: ['شراء أشياء لا نحتاجها', 'تقليل الاستهلاك غير الضروري', 'حرق المخلفات', 'خلط كل المخلفات دائماً'], answer: 1, why: 'تقليل ما نستهلكه يمنع نشوء جزء من النفايات من البداية.' },
        { id: 'computer-bank-04', q: 'ما الذي يفعله الحساس البيئي عادة؟', options: ['يرصد مؤشراً مثل الضوء أو الرطوبة', 'يضمن اختفاء كل التلوث', 'يستبدل القرار البشري دائماً', 'يولد طاقة بلا مصدر'], answer: 0, why: 'الحساس يجمع قراءة لمؤشر بيئي؛ تفسيرها واتخاذ الإجراء يظلان مهمين.' },
        { id: 'computer-bank-05', q: 'أي ممارسة تطيل عمر جهاز رقمي صالح؟', options: ['إلقاؤه عند أول مشكلة بسيطة', 'العناية به وإصلاحه عند الإمكان', 'تعريضه للماء', 'تركه موصولاً بلا حاجة'], answer: 1, why: 'العناية والإصلاح قد يؤخران الاستبدال ويقللان النفايات واستهلاك الموارد.' },
        { id: 'computer-bank-06', q: 'أين يفضل تسليم جهاز إلكتروني تالف عندما تتوفر خدمة لذلك؟', options: ['نقطة جمع أو جهة مختصة', 'النار', 'مجرى الماء', 'أي مكان عام'], answer: 0, why: 'الجمع المخصص يساعد على التعامل مع مكونات الأجهزة بطريقة أكثر مسؤولية.' },
        { id: 'computer-bank-07', q: 'أي مثال يوضح خدمة رقمية يومية؟', options: ['متابعة موعد على موقع موثوق', 'ترك ورقة في الشارع', 'إطفاء شاشة غير مستخدمة', 'فرز عبوات فارغة'], answer: 0, why: 'متابعة موعد من خلال موقع خدمة مثال على الاستفادة من خدمة رقمية.' },
        { id: 'computer-bank-08', q: 'كيف تسهم الخدمة الرقمية في تيسير الخدمة؟', options: ['قد تتيح متابعة بعض الخطوات عن بعد', 'تضمن دائماً عدم حدوث أي خطأ', 'تلغي الحاجة إلى التحقق', 'تجعل كل مستخدم يشارك بياناته علناً'], answer: 0, why: 'إتاحة متابعة الخطوات عن بعد قد توفر وقتاً وتيسر الوصول، لكنها لا تلغي التحقق.' },
        { id: 'computer-bank-09', q: 'وصلتك رسالة تطلب رمز التحقق لإتمام دفع غير متوقع. ماذا تفعل؟', options: ['ترسله فوراً', 'توقف وتتحقق عبر قناة رسمية ولا تشاركه', 'تنشره في مجموعة الصف', 'تستخدمه في موقع آخر'], answer: 1, why: 'رمز التحقق سري؛ لا تشاركه، وتحقق من أي طلب غير متوقع عبر جهة موثوقة.' },
        { id: 'computer-bank-10', q: 'أي كلمة مرور أفضل من الخيارات؟', options: ['123456', 'اسمك فقط', 'عبارة طويلة وفريدة يصعب تخمينها', 'كلمة واحدة شائعة'], answer: 2, why: 'العبارة الطويلة والفريدة أصعب في التخمين، وينبغي ألا يعاد استخدامها في حسابات متعددة.' },
        { id: 'computer-bank-11', q: 'ما التصرف السليم عند استخدام جهاز مشترك؟', options: ['ترك الحساب مفتوحاً', 'تسجيل الخروج بعد الانتهاء', 'كتابة كلمة المرور على الشاشة', 'مشاركة الحساب مع الجميع'], answer: 1, why: 'تسجيل الخروج يقلل احتمال وصول مستخدم آخر إلى الحساب.' },
        { id: 'computer-bank-12', q: 'أي مما يأتي يعد بيانات شخصية تستحق الحماية؟', options: ['رقم هاتفك وعنوانك', 'لون السماء في صورة عامة', 'اسم مادة دراسية فقط', 'حالة الطقس المنشورة'], answer: 0, why: 'رقم الهاتف والعنوان قد يحددان الشخص أو مكانه، لذا لا يشاركان بلا حاجة.' },
        { id: 'computer-bank-13', q: 'أي تصميم يجعل الخدمة الرقمية أيسر وصولاً؟', options: ['تباين ضعيف وتعليمات غامضة', 'نص مقروء وأزرار ذات تسميات واضحة', 'الاعتماد على لون واحد دون أي إشارة', 'إخفاء طريقة طلب المساعدة'], answer: 1, why: 'النص المقروء والتسميات الواضحة تسهل الفهم والاستخدام لفئات أكثر.' },
        { id: 'computer-bank-14', q: 'كيف نجمع بين التحول الرقمي والاستدامة؟', options: ['نرسل بيانات أكثر مما تحتاج الخدمة', 'نستخدم التقنية باعتدال ونحافظ على الأجهزة', 'نستبدل جهازاً صالحاً بلا حاجة', 'نبقي كل الأجهزة تعمل دائماً'], answer: 1, why: 'الاستخدام المعتدل والعناية بالأجهزة يقللان الهدر والموارد المستهلكة.' },
        { id: 'computer-bank-15', q: 'قبل إرسال بيانات في نموذج إلكتروني، ما الخطوة المناسبة؟', options: ['التحقق من الجهة وطلب البيانات الضرورية فقط', 'إدخال كل بيانات الأسرة دائماً', 'إرسال كلمة المرور في خانة الملاحظات', 'إرسال النموذج إلى رابط مجهول'], answer: 0, why: 'التحقق من الجهة وتقليل البيانات إلى ما يلزم يحمي الخصوصية.' },
        { id: 'computer-bank-16', q: 'ما العبارة الأدق عن الحساس؟', options: ['يعطي قراءة قد تساعد على اتخاذ قرار', 'يفسر كل الظروف بلا خطأ', 'يحل المشكلة من دون أي إجراء', 'لا يحتاج إلى استخدام آمن للبيانات'], answer: 0, why: 'الحساس أداة رصد؛ تظل القراءة بحاجة إلى تفسير واستخدام مسؤول.' }
      ],
      writtenExercises: essayQuestions
    }
  ];

  var exams = [
    {
      id: 'computer-term1-final',
      title: 'امتحان ختامي استرشادي: التكنولوجيا الخضراء والتحول الرقمي',
      note: 'تدريب أصلي غير رسمي • 14 سؤال اختيار من متعدد • راجع التنبيه بشأن التحقق من المنهج',
      questions: [
        { id: 'computer-final-01', q: 'أي تصرف يقلل استهلاك الكهرباء عند عدم الحاجة؟', options: ['إبقاء شاشة الغرفة الخالية تعمل', 'إطفاء الجهاز غير المستخدم', 'رفع السطوع دائماً', 'تشغيل مصابيح إضافية بلا حاجة'], answer: 1, why: 'إطفاء جهاز لا يستخدمه أحد يقلل الهدر.' },
        { id: 'computer-final-02', q: 'أي مصدر من الآتي متجدد؟', options: ['الطاقة الشمسية', 'جهاز متروك يعمل', 'نفاية إلكترونية', 'شاحن تالف'], answer: 0, why: 'ضوء الشمس مصدر متجدد يمكن الاستفادة منه لإنتاج الطاقة.' },
        { id: 'computer-final-03', q: 'ما وسيلة تقلل استهلاك الماء لري نبات؟', options: ['ريه في كل ساعة مهما كانت حالته', 'استخدام قراءة حساس الرطوبة للمساعدة في توقيت الري', 'ترك الصنبور مفتوحاً', 'زيادة الماء دون ملاحظة التربة'], answer: 1, why: 'قراءة الرطوبة تساعد على معرفة حاجة التربة، ويقرر الشخص كمية الري المناسبة.' },
        { id: 'computer-final-04', q: 'ما التسلسل الأكثر مسؤولية للتعامل مع شيء لم نعد نحتاجه؟', options: ['تقليل الاستهلاك ثم إعادة الاستخدام أو الفرز المناسب', 'شراء بديل ثم حرق القديم', 'رميه في أي مكان', 'خلط البطاريات مع الطعام'], answer: 0, why: 'التقليل وإعادة الاستخدام والفرز خطوات تحد من النفايات، ويجب تجنب الحرق والرمي العشوائي.' },
        { id: 'computer-final-05', q: 'ما الذي يستطيع حساس الضوء فعله؟', options: ['رصد شدة الضوء', 'إصلاح كل الأجهزة', 'ضمان سلامة كل البيانات', 'منع استهلاك الطاقة وحده'], answer: 0, why: 'حساس الضوء يرصد مستوى الضوء؛ وقد تساعد قراءته في اتخاذ قرار.' },
        { id: 'computer-final-06', q: 'أي ممارسة تحد من الأثر البيئي للأجهزة الرقمية؟', options: ['العناية بالجهاز وإصلاحه عند الإمكان', 'استبدال الجهاز الصالح باستمرار', 'تركه موصولاً بلا حاجة', 'رمي البطارية في النار'], answer: 0, why: 'إطالة عمر الجهاز تقلل الحاجة إلى تصنيع بديل وتحد من النفايات.' },
        { id: 'computer-final-07', q: 'أي موقف يوضح خدمة رقمية؟', options: ['متابعة طلب عبر موقع الجهة الموثوق', 'فرز الورق في الفصل', 'إطفاء مصباح', 'إصلاح صنبور'], answer: 0, why: 'متابعة طلب عبر موقع جهة موثوق مثال على خدمة تقدم باستخدام التقنية.' },
        { id: 'computer-final-08', q: 'ما فائدة محتملة للتحول الرقمي؟', options: ['تيسير متابعة بعض الخدمات والاتصال', 'إلغاء كل الحاجة إلى الانتباه', 'ضمان صحة كل رابط', 'ضرورة نشر بيانات المستخدم'], answer: 0, why: 'قد ييسر التحول الرقمي الوصول والمتابعة، مع ضرورة التحقق وحماية البيانات.' },
        { id: 'computer-final-09', q: 'قبل إتمام دفع رقمي، ينبغي:', options: ['التحقق من الجهة والمبلغ', 'إرسال رمز التحقق لشخص مجهول', 'استخدام رابط وصل من مصدر غير معروف', 'تجاهل تفاصيل العملية'], answer: 0, why: 'مراجعة الجهة والمبلغ قبل التأكيد تساعد على تجنب الخطأ والاحتيال.' },
        { id: 'computer-final-10', q: 'أي سلوك يحمي كلمة المرور؟', options: ['استخدام كلمة فريدة طويلة وعدم مشاركتها', 'إرسالها برسالة لأي طالب', 'كتابتها على جهاز عام', 'اختيار 123456'], answer: 0, why: 'كلمة المرور الفريدة الطويلة وعدم مشاركتها يدعمان أمان الحساب.' },
        { id: 'computer-final-11', q: 'طلب موقع غير معروف عنوان المنزل ورمز تحقق. ما الأفضل؟', options: ['تقديمهما فوراً', 'عدم الإرسال والتحقق من الجهة مع شخص بالغ موثوق', 'نشرهما علناً', 'إعادة استخدامهما في كل المواقع'], answer: 1, why: 'لا ترسل بيانات حساسة إلى جهة غير موثوقة؛ تحقق واطلب مساعدة شخص بالغ.' },
        { id: 'computer-final-12', q: 'ما إجراء مناسب بعد استخدام حساب على جهاز عام؟', options: ['تسجيل الخروج', 'ترك الصفحة مفتوحة', 'حفظ كلمة المرور في المتصفح العام', 'إرسال الرابط للآخرين'], answer: 0, why: 'تسجيل الخروج يحمي الحساب من الاستخدام اللاحق على الجهاز المشترك.' },
        { id: 'computer-final-13', q: 'أي عنصر يساعد ذوي احتياجات مختلفة على استخدام خدمة رقمية؟', options: ['تعليمات واضحة وتباين مقروء', 'نص صغير جداً', 'أزرار بلا تسميات', 'إخفاء خيار المساعدة'], answer: 0, why: 'الوضوح والتباين الجيد والتسميات الوصفية تحسن إمكانية الوصول.' },
        { id: 'computer-final-14', q: 'أي عبارة تلخص الاستخدام المستدام للتقنية؟', options: ['نستخدم التقنية باعتدال ونحافظ على الأجهزة والموارد', 'نستهلك أكبر قدر ممكن من الطاقة', 'نستبدل كل جهاز صالح', 'نجمع بيانات أكثر من الحاجة'], answer: 0, why: 'الاستخدام المعتدل والعناية بالموارد والأجهزة ينسجم مع الاستدامة.' }
      ],
      writtenQuestions: essayQuestions
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
    return stage === 'prep' && /اول/.test(grade) && /(حاسب|كمبيوتر)/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
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
    notice.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.9;color:#594300;font-size:13px;';
    notice.textContent = NOTICE;
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
      openItem(id);
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

  function questionsBox(questions, prefix) {
    var wrap = document.createElement('div');
    var questionBlocks = [];
    questions.forEach(function (question, index) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var heading = text('div', (index + 1) + '. ' + question.q);
      heading.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;';
      block.appendChild(heading);
      var choices = document.createElement('div');
      shuffledIndices(question.options.length).forEach(function (choiceIndex) {
        var choice = question.options[choiceIndex];
        var label = document.createElement('label');
        label.style.cssText = 'display:flex;gap:8px;align-items:flex-start;padding:7px 3px;line-height:1.8;cursor:pointer;';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = prefix + '-' + question.id;
        input.value = String(choiceIndex);
        input.style.marginTop = '6px';
        input.addEventListener('change', function () {
          var result = block._result;
          var correct = Number(input.value) === question.answer;
          result.style.display = 'block';
          result.style.background = correct ? '#E8F5E9' : '#FFF3E0';
          result.textContent = (correct ? 'إجابة صحيحة. ' : 'ليست الإجابة الصحيحة. ') + question.why + (correct ? '' : ' الإجابة الصحيحة: ' + question.options[question.answer] + '.');
          updateScore();
        });
        label.appendChild(input);
        label.appendChild(text('span', choice));
        choices.appendChild(label);
      });
      block.appendChild(choices);
      var resultBox = text('div', '');
      resultBox.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.8;';
      block._result = resultBox;
      block._question = question;
      block.appendChild(resultBox);
      wrap.appendChild(block);
      questionBlocks.push(block);
    });
    var score = text('div', 'اختر إجابة لكل سؤال لتظهر النتيجة والتعليل مباشرة.');
    score.style.cssText = 'font-weight:700;color:#2E7D32;margin:8px 0 14px;line-height:1.8;';
    function updateScore() {
      var answered = 0;
      var correctCount = 0;
      questionBlocks.forEach(function (block) {
        var selected = block.querySelector('input[type="radio"]:checked');
        if (!selected) return;
        answered += 1;
        if (Number(selected.value) === block._question.answer) correctCount += 1;
      });
      score.textContent = 'النتيجة الحالية: ' + correctCount + ' من ' + answered + ' سؤال تمت الإجابة عنه (' + questionBlocks.length + ' أسئلة إجمالاً).';
    }
    wrap.insertBefore(score, wrap.firstChild);
    return wrap;
  }

  var ESSAY_SCORE_STORAGE_KEY = 'ta3lemy-computer-g7-t1-essay-scores-v1';

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

  function essayQuestionsBox(questions, sourceId, itemTitle) {
    var wrap = document.createElement('div');
    (questions || []).forEach(function (question, index) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #D9E2EC;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var heading = text('div', (index + 1) + '. ' + question.q);
      heading.style.cssText = 'font-weight:700;line-height:1.9;margin-bottom:10px;';
      block.appendChild(heading);
      block.appendChild(text('div', 'سؤال مقالي • الدرجة الكلية: ' + question.points + ' درجات'));
      var answerLabel = text('label', 'مساحة كتابة اختيارية (لا تُحفظ ولا تُرسل):');
      answerLabel.style.cssText = 'display:block;font-weight:700;margin:10px 0 6px;';
      var response = document.createElement('textarea');
      response.rows = 4;
      response.maxLength = 3000;
      response.placeholder = 'اكتب إجابتك هنا إن رغبت...';
      response.setAttribute('aria-label', 'مساحة اختيارية لإجابة السؤال المقالي');
      response.style.cssText = 'display:block;width:100%;min-height:100px;padding:10px;border:1px solid #bdbdbd;border-radius:10px;font:inherit;line-height:1.8;resize:vertical;';
      block.appendChild(answerLabel);
      block.appendChild(response);
      var details = document.createElement('details');
      details.style.cssText = 'margin-top:10px;background:#F5F9F5;border-radius:9px;padding:9px 12px;line-height:1.9;';
      details.appendChild(text('summary', 'اعرض الإجابة النموذجية ومعايير التقييم (' + question.points + ' درجات)'));
      details.appendChild(text('p', 'الإجابة النموذجية: ' + question.answerText));
      details.appendChild(text('strong', 'معايير التقييم:'));
      var rubricList = document.createElement('ul');
      rubricList.style.cssText = 'padding-right:22px;margin:6px 0;';
      question.rubric.forEach(function (criterion) {
        rubricList.appendChild(text('li', criterion.criterion + ' — ' + criterion.points + (criterion.points === 1 ? ' درجة' : ' درجات')));
      });
      details.appendChild(rubricList);
      block.appendChild(details);

      var scoreKey = String(sourceId) + '::' + question.id;
      var stored = readEssayScores()[scoreKey];
      var scorePanel = document.createElement('div');
      scorePanel.style.cssText = 'margin-top:12px;padding:11px;background:#F3F6FA;border-radius:10px;';
      var scoreLabel = text('label', 'درجتك بعد المراجعة الذاتية (من 0 إلى ' + question.points + '):');
      scoreLabel.style.cssText = 'display:block;font-weight:700;margin-bottom:6px;';
      var scoreInput = document.createElement('input');
      scoreInput.type = 'number';
      scoreInput.min = '0';
      scoreInput.max = String(question.points);
      scoreInput.step = '1';
      scoreInput.value = stored && Number.isInteger(Number(stored.score)) ? String(stored.score) : '';
      scoreInput.placeholder = 'أدخل الدرجة';
      scoreInput.setAttribute('aria-label', 'درجة ذاتية صحيحة من صفر إلى ' + question.points);
      scoreInput.style.cssText = 'width:120px;max-width:100%;padding:9px;border:1px solid #bdbdbd;border-radius:8px;font:inherit;';
      var saveButton = document.createElement('button');
      saveButton.type = 'button';
      saveButton.textContent = 'حفظ الدرجة';
      saveButton.style.cssText = 'margin:6px 8px;padding:9px 13px;background:#1565C0;color:white;border:0;border-radius:8px;font:inherit;font-weight:700;cursor:pointer;';
      var status = text('div', stored ? 'الدرجة المحفوظة حالياً: ' + stored.score + ' من ' + question.points : '');
      status.style.cssText = 'margin-top:6px;font-size:13px;line-height:1.7;';
      saveButton.addEventListener('click', function () {
        var rawScore = String(scoreInput.value || '').trim();
        var score = Number(rawScore);
        if (!rawScore || !Number.isInteger(score) || score < 0 || score > question.points) {
          status.style.color = '#B71C1C';
          status.textContent = 'أدخل عدداً صحيحاً من 0 إلى ' + question.points + '.';
          return;
        }
        var record = { sourceId: sourceId, itemTitle: itemTitle, questionId: question.id, question: question.q, score: score, points: question.points, updatedAt: new Date().toISOString() };
        if (!saveEssayScore(scoreKey, record)) {
          status.style.color = '#B71C1C';
          status.textContent = 'تعذر حفظ الدرجة على هذا الجهاز. تحقق من إعدادات التخزين.';
          return;
        }
        status.style.color = '#2E7D32';
        status.textContent = 'تم حفظ الدرجة ' + score + ' من ' + question.points + ' على هذا الجهاز فقط.';
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

  function openEssayScoreTracker() {
    var body = document.getElementById('viewerBody');
    var title = document.getElementById('viewerTitle');
    if (!body || !title) return;
    body.textContent = '';
    body.setAttribute('dir', 'rtl');
    title.textContent = 'متابعة درجات المراجعة الذاتية للأسئلة المقالية';
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
    summary.appendChild(text('h3', 'ملخص تقدمك في التقييم الذاتي'));
    summary.appendChild(text('p', 'مجموع الدرجات المحفوظة: ' + earned + ' من ' + possible + ' درجة (' + percentage + '%).'));
    summary.appendChild(text('p', 'عدد سجلات الدرجات المحفوظة: ' + entries.length + ' من ' + countEssayQuestions() + ' موضعاً مقالياً في التدريب والامتحان.'));
    summary.appendChild(text('p', 'تُحفظ الدرجات فقط على هذا الجهاز، ولا يُحفظ نص إجابتك المكتوبة ولا يُرسل إلى الخادم.'));
    body.appendChild(summary);
    if (!entries.length) {
      body.appendChild(text('p', 'لم تسجل درجات بعد. افتح تدريب الوحدة أو الامتحان، وحاول الإجابة ثم راجع النموذج والمعايير واضغط «حفظ الدرجة».'));
    } else {
      entries.sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
      entries.forEach(function (record) {
        var row = document.createElement('section');
        row.style.cssText = 'border:1px solid #e4e9e4;border-radius:11px;padding:12px;margin:10px 0;background:#fff;line-height:1.8;';
        row.appendChild(text('h4', record.itemTitle || 'تقييم مقالي'));
        row.appendChild(text('p', record.question || ''));
        row.appendChild(text('strong', 'تقييمك: ' + record.score + ' من ' + record.points));
        if (record.updatedAt) row.appendChild(text('div', 'آخر تحديث: ' + new Date(record.updatedAt).toLocaleString('ar-EG')));
        if (record.sourceId) {
          var reopen = document.createElement('button');
          reopen.type = 'button';
          reopen.textContent = 'إعادة فتح مصدر السؤال';
          reopen.style.cssText = 'margin-top:8px;padding:8px 12px;background:#1565C0;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer;';
          reopen.addEventListener('click', function () { openItem(record.sourceId); });
          row.appendChild(reopen);
        }
        body.appendChild(row);
      });
    }
    screenHistory.push(currentScreen);
    showScreen('viewerScreen');
  }

  function findItem(id) {
    for (var u = 0; u < units.length; u += 1) {
      for (var l = 0; l < units[u].lessons.length; l += 1) {
        if (units[u].lessons[l].id === id) return { kind: 'lesson', unit: units[u], item: units[u].lessons[l] };
      }
      if (units[u].id === id) return { kind: 'exercise', unit: units[u], item: units[u] };
    }
    for (var e = 0; e < exams.length; e += 1) {
      if (exams[e].id === id) return { kind: 'exam', item: exams[e] };
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
      body.appendChild(text('h2', found.unit.title, 'computer-unit-title'));
      found.item.explain.forEach(function (paragraph) {
        var p = text('p', paragraph);
        p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;';
        body.appendChild(p);
      });
      var applications = document.createElement('div');
      applications.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      applications.appendChild(text('strong', 'تطبيقات عملية:'));
      var applicationList = document.createElement('ul');
      applicationList.style.cssText = 'padding-right:22px;margin:8px 0;';
      found.item.applications.forEach(function (application) {
        var li = text('li', application);
        li.style.margin = '6px 0';
        applicationList.appendChild(li);
      });
      applications.appendChild(applicationList);
      body.appendChild(applications);
      var example = document.createElement('div');
      example.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      example.appendChild(text('strong', 'مثال وتطبيق: '));
      example.appendChild(text('span', found.item.example));
      body.appendChild(example);
      var key = document.createElement('div');
      key.style.cssText = 'background:#F3E5F5;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      key.appendChild(text('strong', 'خلاصة الدرس: '));
      key.appendChild(text('span', found.item.key));
      body.appendChild(key);
      body.appendChild(text('h3', 'تدريب تفاعلي: اختر إجابتك لتظهر النتيجة والتعليل فوراً'));
      body.appendChild(questionsBox(found.item.questions, found.item.id));
    } else {
      body.appendChild(text('p', found.item.note || 'بنك تدريبات أصلي للمراجعة. اختر إجابتك لتظهر النتيجة والتعليل فوراً.'));
      if (found.kind === 'exercise') body.appendChild(text('h3', found.unit.title));
      body.appendChild(questionsBox(found.kind === 'exercise' ? found.item.exercises : found.item.questions, found.item.id));
      var writtenQuestions = found.kind === 'exercise' ? found.item.writtenExercises : found.item.writtenQuestions;
      if (writtenQuestions && writtenQuestions.length) {
        body.appendChild(text('h3', 'أسئلة مقالية • حاول أولاً ثم افتح النموذج ومعايير التقييم'));
        body.appendChild(essayQuestionsBox(writtenQuestions, found.item.id, found.item.title));
      }
    }
    screenHistory.push(currentScreen);
    showScreen('viewerScreen');
  }

  function appendContent(type) {
    var list = document.getElementById('contentList');
    if (!list) return;
    for (var i = list.children.length - 1; i >= 0; i -= 1) {
      var existing = list.children[i];
      if (String(existing.className || '').split(/\s+/).indexOf('empty-state') >= 0) list.removeChild(existing);
    }
    var root = document.createElement('div');
    root.className = 'computer-original-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
    if (type === 'exercises' || type === 'exams') {
      root.appendChild(card('متابعة درجات المراجعة الذاتية للأسئلة المقالية', 'اعرض المجموع وسجل الدرجات المحفوظة، وأعد فتح مصدر السؤال.', 'essay-score-tracker', '📊'));
    }
    if (type === 'lessons') {
      units.forEach(function (unit) {
        root.appendChild(text('h3', unit.title, 'computer-unit-heading'));
        unit.lessons.forEach(function (lesson) {
          root.appendChild(card(lesson.title, lesson.explain[0], lesson.id, '📘'));
        });
      });
    } else if (type === 'exercises') {
      units.forEach(function (unit) {
        root.appendChild(card('بنك التدريبات — ' + unit.title, unit.exercises.length + ' سؤال اختيار من متعدد، وسؤالان مقاليان مع مراجعة ذاتية', unit.id, '✏️'));
      });
    } else if (type === 'exams') {
      exams.forEach(function (exam) {
        root.appendChild(card(exam.title, exam.note + ' • 14 سؤال اختيار من متعدد وسؤالان مقاليان', exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openComputerStudyItem = openItem;
  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent === 'function' && !originalOpenContent.__computerContentWrapped) {
    var wrapped = async function (type, termNumber, termName) {
      var result = await originalOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrapped.__computerContentWrapped = true;
    window.openContent = wrapped;
  }
})();
