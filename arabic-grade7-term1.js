// Original supplementary Arabic learning content for Grade 7, Egypt, Term 1, 2026/2027.
// Unit headings follow the current Ministry lesson index; skill notes are supportive, not verbatim textbook content.
(function () {
  'use strict';

  var NOTICE = 'الفهرس الوزاري الظاهر حالياً يعرض وحدتي «هويتي» و«هواياتي» بستة دروس عامة. بعض الكورسات المنشورة لعام 2027 تعرض تفصيلاً مختلفاً؛ هذا شرح وتدريب أصلي مساند وليس نقلاً حرفياً أو بديلاً عن نص الكتاب. راجع النسخة المعتمدة في مدرستك.';

  var units = [
    {
      id: 'arabic-identity', title: 'الوحدة الأولى: هويتي',
      lessons: [
        {
          id: 'identity-influences', title: '1. الهوية ومؤثراتها',
          passage: 'لكل إنسان ملامح تميّزه، وتتكون هويته من عناصر كثيرة؛ منها اللغة التي يتعلم بها، والأسرة التي ينشأ فيها، والقيم التي يختارها، والذكريات والخبرات التي يمر بها. تمنحنا الهوية جذوراً نشعر معها بالانتماء، لكنها لا تمنعنا من التعلم من الآخرين. فالإنسان يعتز بلغته وثقافته، ويحترم في الوقت نفسه اختلاف الناس. وكلما عرف الفرد تاريخه وفهم واقعه، استطاع أن يشارك في بناء مستقبل أفضل.',
          explain: [
            'الهوية مجموعة السمات والقيم واللغة والخبرات التي تساعد الفرد أو الجماعة على معرفة الذات والشعور بالانتماء. وهي ليست شكلاً أو اسماً فقط، بل تتصل بما نتعلمه ونؤمن به ونمارسه.',
            'تؤثر في الهوية الأسرة والمدرسة واللغة والتاريخ والمكان والأصدقاء والإعلام. وقد يكتسب الإنسان خبرات جديدة مع الزمن، لذلك تتطور بعض جوانب هويته دون أن يفقد صلته بجذوره.',
            'الاعتزاز بالهوية لا يعني رفض الثقافات الأخرى. يستطيع الطالب أن يحافظ على لغته وقيمه، وأن يتعلم العلوم والفنون من شعوب مختلفة، وأن يميز بين ما ينفعه وما لا يناسبه.',
            'الفكرة الرئيسة للنص هي أن الهوية تنشأ من عوامل متعددة، وتمنح الإنسان انتماءً، مع بقائها قابلة للنمو بالتعلم والخبرة.'
          ], vocabulary: 'الانتماء: الشعور بالصلة بجماعة أو مكان. الجذور: الأصول والخبرات التي يرتبط بها الإنسان. تتطور: تنمو وتتغير إلى صورة أفضل.',
          language: 'مهارة لغوية مساندة: استخرج من جملة «يحترم الطالب اختلاف الناس» الفعل والفاعل والمفعول به. الفعل: يحترم، الفاعل: الطالب، المفعول به: اختلاف.',
          writing: 'اكتب فقرة من أربعة أسطر عن عاملين أسهما في تكوين شخصيتك، واذكر كيف تحترم ثقافة الآخرين.',
          key: 'تتكون الهوية من اللغة والقيم والأسرة والتاريخ والخبرات، وهي مصدر انتماء يمكن أن ينمو بالتعلم واحترام الاختلاف.'
        },
        {
          id: 'identity-personality', title: '2. الهوية وبناء الشخصية',
          passage: 'لا تُبنى الشخصية في يوم واحد. تبدأ بخطوات صغيرة: أن يعرف الإنسان ما يجيده وما يحتاج إلى تحسينه، وأن يختار هدفاً مناسباً، ثم يعمل له بصبر. وقد يغيّر رأيه عندما يتعلم معلومة جديدة، وهذا ليس ضعفاً؛ فالوعي أن نفكر ونسأل ونراجع أنفسنا. والشخصية القوية لا تفرض رأيها على الآخرين، بل تستمع إليهم وتتحمل مسؤولية قراراتها.',
          explain: [
            'الشخصية طريقة الفرد في التفكير والتصرف والتعامل مع المواقف. تتأثر بالأسرة والتعليم والخبرات والبيئة، كما تؤثر فيها القرارات التي يتخذها الإنسان والعادات التي يكررها.',
            'يساعد الوعي بالذات على معرفة نقاط القوة والجوانب التي تحتاج إلى تدريب. ومن المفيد وضع هدف واضح، وتقسيمه إلى خطوات صغيرة، ومراجعة التقدم من غير مقارنة ظالمة بالآخرين.',
            'من علامات الشخصية المتوازنة احترام الوقت، والصدق، والاستماع، والاعتراف بالخطأ، والقدرة على الاختلاف بأدب. ولا تعني القوة أن يرفض المرء النصيحة أو يسيطر على زملائه.',
            'عند كتابة فقرة عن هدف، اذكر الهدف أولاً، ثم سبب اختياره، وخطوات تحقيقه، وما ستفعله إذا واجهت صعوبة.'
          ], vocabulary: 'الوعي بالذات: معرفة الإنسان بقدراته ومشاعره. المثابرة: الاستمرار في العمل رغم الصعوبات. مسؤولية: التزام الفرد بنتائج اختياراته.',
          language: 'مهارة نحوية مساندة: في «الطالبُ مجتهدٌ» جملة اسمية بدأت بمبتدأ وخبر. وفي «يخطط الطالبُ لهدفه» جملة فعلية بدأت بالفعل يخطط، والطالب فاعل.',
          writing: 'اكتب خطة قصيرة لهدف دراسي: الهدف، ثلاث خطوات، وعادة واحدة ستلتزم بها هذا الأسبوع.',
          key: 'تُبنى الشخصية بالوعي بالذات والأهداف والعمل والمسؤولية واحترام الآخرين، لا بالمظاهر أو فرض الرأي.'
        },
        {
          id: 'friends', title: '3. أصدقائي',
          passage: 'الصديق الجيد لا يوافقك في كل شيء، لكنه يسمعك باهتمام ويقول رأيه باحترام. إذا أخطأ أحدكما، ساعده الآخر على إصلاح الخطأ بدلاً من السخرية منه. وتحتاج الصداقة إلى الوفاء وحفظ السر والاعتذار عند الإساءة. كما أن لكل إنسان مساحة خاصة؛ فالصديق يحترمها ولا يضغط على صاحبه ليكشف ما لا يريد قوله.',
          explain: [
            'تقوم الصداقة الصحية على الثقة والاحترام والتعاون، ولا تقوم على الخوف أو الإهانة أو إجبار الصديق على فعل ما لا يريد.',
            'يُظهر الصديق اهتمامه بالإنصات، وعدم مقاطعة المتحدث، واختيار كلمات مهذبة. وعند الخلاف يمكن وصف المشكلة بهدوء والبحث عن حل عادل للطرفين.',
            'حفظ الخصوصية جزء من الثقة، لكن طلب المساعدة من شخص بالغ موثوق ليس خيانة إذا تعرض صديق لخطر أو أذى. من المهم التفريق بين السر الآمن والسر الذي يهدد سلامة أحد.',
            'في الحوار نستخدم علامات الترقيم المناسبة: النقطتان قبل الكلام المنقول، والفاصلة بين الجمل القصيرة، وعلامة الاستفهام في نهاية السؤال.'
          ], vocabulary: 'الإنصات: الاستماع باهتمام. الوفاء: حفظ العهد ومراعاة الصداقة. الخصوصية: ما يخص الفرد ولا يرغب في نشره.',
          language: 'مهارة تعبير: حوّل اللوم إلى رسالة واضحة؛ بدلاً من «أنت لا تسمعني» قل «أشعر بالضيق عندما أقاطع حديثي، وأحب أن نتبادل الكلام».',
          writing: 'اكتب رسالة قصيرة لصديق تشكره فيها على موقف طيب، مستخدماً تحية وجملة سبب وخاتمة مناسبة.',
          key: 'الصداقة الجيدة تبنى على الثقة والاحترام والإنصات والتعاون، مع حماية الخصوصية وطلب المساعدة عند الخطر.'
        }
      ],
      exercises: [
        { q: 'أي مما يلي من العوامل التي تؤثر في الهوية؟', options: ['اللغة والأسرة والخبرات', 'لون الحقيبة فقط', 'رقم المقعد وحده', 'حالة الطقس في يوم واحد'], answer: 0, why: 'اللغة والأسرة والخبرات من العوامل التي تسهم في تكوين الهوية.' },
        { q: 'الاعتزاز بالهوية يعني:', options: ['التمسك بالقيم مع احترام ثقافات الآخرين', 'رفض كل تعلم جديد', 'السخرية من المختلف', 'الابتعاد عن اللغة'], answer: 0, why: 'يمكن الاعتزاز بالجذور والانفتاح على تعلم ما ينفع واحترام الاختلاف.' },
        { q: 'ما السلوك الذي يدل على شخصية متوازنة؟', options: ['الاعتراف بالخطأ والاستفادة من النصيحة', 'رفض كل رأي آخر', 'إلقاء اللوم دائماً', 'السخرية من الزملاء'], answer: 0, why: 'الشخص المتوازن يتحمل المسؤولية ويقبل النصيحة المناسبة.' },
        { q: 'أي صفة تدعم الصداقة الصحية؟', options: ['الإنصات والاحترام', 'الإجبار والتهديد', 'إفشاء الأسرار', 'المقاطعة المستمرة'], answer: 0, why: 'الإنصات والاحترام يعززان الثقة بين الأصدقاء.' },
        { q: 'في «يساعد الصديق صاحبه»، ما المفعول به؟', options: ['صاحبه', 'يساعد', 'الصديق', 'لا يوجد'], answer: 0, why: 'وقع فعل المساعدة على صاحبه، فهو المفعول به.' },
        { q: 'اذكر عاملين يسهمان في تكوين الهوية، ووضح أثر أحدهما.', answerText: 'مثل اللغة والأسرة والتاريخ والمدرسة والخبرات. فاللغة تساعد الإنسان على التواصل والتعبير عن ثقافته.', points: 2 },
        { q: 'اكتب نصيحة لصديق يختلف مع زميله، مستخدماً أسلوباً محترماً.', answerText: 'استمع إلى زميلك دون مقاطعة، ووضح رأيك بهدوء، وابحثا معاً عن حل يراعيكما.', points: 2 }
      ]
    },
    {
      id: 'arabic-hobbies', title: 'الوحدة الثانية: هواياتي',
      lessons: [
        {
          id: 'sports', title: '4. الرياضة',
          passage: 'بعد انتهاء الدروس، يذهب سليم إلى ملعب الحي ليتدرب مع زملائه. لا يهتم بالفوز وحده؛ فهو يحرص على الإحماء، ويشجع الفريقين، ويهنئ منافسه إذا أحسن اللعب. تعلمه الرياضة تنظيم الوقت والعمل مع الفريق. وإذا شعر بالتعب أخذ قسطاً من الراحة، لأن حماية الجسد أهم من الاستمرار بلا انتباه.',
          explain: [
            'تساعد الحركة المنتظمة على تنمية اللياقة والمهارات الحركية، كما تعلّم الصبر والانضباط والتعاون. ويختار الطالب نشاطاً مناسباً لعمره وصحته، ويزيده بالتدريج.',
            'تتطلب الممارسة الآمنة الإحماء، وشرب الماء، وارتداء ما يلائم النشاط، واتباع تعليمات المعلم أو المدرب. ينبغي التوقف وإخبار شخص بالغ عند الشعور بألم أو دوار.',
            'الروح الرياضية تعني احترام القواعد والحكم والمنافس، وتقبل الفوز والخسارة، وعدم إيذاء الآخرين. والرياضة الجماعية تدرب الفرد على توزيع الأدوار والتواصل.',
            'في الجملة الفعلية يأتي الفعل ثم الفاعل، وقد يأتي مفعول به إذا وقع الفعل على شيء. مثال: «ينظم اللاعبُ وقتَه»؛ وقتَه مفعول به.'
          ], vocabulary: 'اللياقة: القدرة على أداء الحركة بنشاط. الإحماء: حركات تمهيدية قبل التمرين. الروح الرياضية: احترام المنافس والقواعد.',
          language: 'مهارة نحوية مساندة: «يجري اللاعبُ» فعل لازم اكتفى بفاعله، و«يسدد اللاعبُ الكرةَ» فعل متعدٍ وصل إلى مفعول به.',
          writing: 'اكتب فقرة تصف فيها هواية رياضية، وفائدتها، ووسيلتين لممارستها بأمان.',
          key: 'تنفع الرياضة الجسم والعقل وتعلم التعاون، ويجب ممارستها بتدرج وأمان واحترام لقواعد اللعب.'
        },
        {
          id: 'poetry-feeling', title: '5. الشعر والشعور',
          passage: 'نص شعري أصلي للتدريب:\nأمضي وفي قلبي ضياءُ محبةٍ\nوأصونُ حلمي بالعملْ\nإن ضاق دربي قلت: سوف أتابعُ\nفالصبرُ يفتحُ للأملْ\n\nيستخدم الشاعر كلمات مثل «ضياء» و«الأمل» ليعبر عن التفاؤل، ويجعل من متابعة الطريق صورة للإصرار على بلوغ الهدف.',
          explain: [
            'يعبر الشعر عن فكرة أو تجربة أو شعور في صياغة إيقاعية. وقد يستخدم الشاعر صوراً وكلمات موحية تساعد القارئ على تخيل المعنى والشعور به.',
            'لفهم مقطع شعري، اقرأه مرة لفهم موضوعه، ثم لاحظ الكلمات المتكررة أو المتقابلة، وحدد الجو العام: أهو تفاؤل أم حزن أم اعتزاز؟ استشهد بكلمة تدعم إجابتك.',
            'في النص التدريبي يدل «ضياء» على الأمل والإشراق، ويعبر «أتابع» عن الإصرار. لا يلزم أن يكون لكل كلمة معنى واحد ثابت؛ فالسياق يساعد على فهمها.',
            'عند قراءة الشعر جهراً، انتبه إلى وضوح الحروف والوقف في نهاية المعنى، ولا تسرع بما يخل بالفهم.'
          ], vocabulary: 'موحية: تثير معنى أو شعوراً. الإصرار: مواصلة السعي. الجو العام: الشعور الغالب على النص.',
          language: 'مهارة بلاغية مساندة: في «ضياء المحبة» صورة توحي بأن المحبة تمنح النفس نوراً؛ وهي عبارة مجازية وليست ضوءاً مادياً.',
          writing: 'اكتب بيتين من إنشائك عن هواية تحبها. اختر كلمات تعبر عن شعورك، ثم اشرح معنى كلمة موحية استخدمتها.',
          key: 'يُفهم الشعر بجمع الفكرة والشعور والسياق، وتدعم الإجابة شواهد من ألفاظ النص.'
        },
        {
          id: 'literature-thought', title: '6. أدب وفكر',
          passage: 'القراءة نافذة يطل منها الإنسان على أفكار وتجارب لم يعشها بنفسه. وقد يقرأ الطالب خبراً أو قصة أو مقالة؛ ولكل نوع غرض وطريقة. لا يكتفي القارئ الواعي بترديد ما يقرأ، بل يسأل: من كتب هذا؟ ما الدليل؟ وهل يميز الكاتب بين الحقيقة والرأي؟ بهذه الأسئلة تصبح القراءة متعة وطريقاً إلى التفكير.',
          explain: [
            'الأدب يعبّر عن الإنسان وتجربته بلغة مؤثرة، أما النص المعلوماتي فيشرح فكرة أو يقدم حقائق. وقد يجمع نص واحد بين السرد والمعلومة والرأي.',
            'الفكرة الرئيسة هي المعنى الذي يدور حوله النص، وتساندها أفكار فرعية وأمثلة. يساعد عنوان النص وكلماته المتكررة والجمل الافتتاحية على اكتشافها.',
            'الحقيقة معلومة يمكن التحقق منها، أما الرأي فيعبر عن حكم أو تفضيل. يسأل القارئ الناقد عن مصدر المعلومة ودليلها، ويفرق بين الحجة والمبالغة.',
            'عند تلخيص فقرة، احتفظ بالفكرة الرئيسة وأهم دليل، واحذف التكرار والتفاصيل الثانوية، واكتب المعنى بأسلوبك من غير نسخ.'
          ], vocabulary: 'السرد: عرض أحداث أو تجربة. الفكرة الرئيسة: المعنى الأهم في النص. الحجة: سبب أو دليل يدعم رأياً.',
          language: 'مهارة إملائية مساندة: همزة القطع تُنطق في البدء والوصل وتكتب فوق الألف أو تحتها، مثل «أدب» و«إلى». وهمزة الوصل تسقط في درج الكلام، مثل «اكتب» و«استمع».',
          writing: 'اكتب ملخصاً من ثلاثة أسطر لنص قرأته، ثم اذكر حقيقة واحدة ورأياً واحداً فيه إن وُجدا.',
          key: 'القارئ الجيد يحدد الفكرة الرئيسة، ويفرق بين الحقيقة والرأي، ويتحقق من الدليل، ويلخص بألفاظه.'
        }
      ],
      exercises: [
        { q: 'ما الفائدة التي قد تمنحها الرياضة الجماعية؟', options: ['التعاون وتنظيم الأدوار', 'العزلة الدائمة', 'إهمال الوقت', 'إيذاء المنافس'], answer: 0, why: 'الرياضة الجماعية تدرب على التعاون والتواصل.' },
        { q: 'أي إجراء يدعم السلامة أثناء التمرين؟', options: ['الإحماء والتدرج وشرب الماء', 'متابعة اللعب رغم الدوار', 'تجاهل تعليمات المدرب', 'زيادة الحمل فجأة'], answer: 0, why: 'الإحماء والتدرج والانتباه لإشارات الجسم من أسس الممارسة الآمنة.' },
        { q: 'ما المقصود بالفكرة الرئيسة؟', options: ['المعنى الأساسي الذي يدور حوله النص', 'أطول كلمة في النص', 'اسم الكاتب فقط', 'آخر علامة ترقيم'], answer: 0, why: 'الفكرة الرئيسة هي المعنى الأهم الذي تتناوله الفقرة أو القطعة.' },
        { q: 'أي عبارة تدل على رأي؟', options: ['أرى أن القراءة أجمل الهوايات', 'بدأت المسابقة الساعة التاسعة وفق الجدول', 'عدد أعضاء الفريق خمسة', 'يقع الملعب بجوار المدرسة'], answer: 0, why: 'عبارة «أرى» تعبر عن تفضيل شخصي، فهي رأي.' },
        { q: 'في «يسدد اللاعب الكرة»، ما نوع الفعل من حيث حاجته إلى مفعول؟', options: ['متعدٍ', 'لازم', 'اسم', 'حرف'], answer: 0, why: 'وصل الفعل إلى المفعول به «الكرة».' },
        { q: 'اذكر قاعدتين للروح الرياضية أثناء المنافسة.', answerText: 'احترام القواعد والمنافس، تقبل النتيجة، تهنئة الفائز، وعدم إيذاء اللاعبين أو السخرية منهم.', points: 2 },
        { q: 'ما الفرق بين الحقيقة والرأي؟ اكتب مثالاً واحداً لكل منهما.', answerText: 'الحقيقة يمكن التحقق منها، مثل «يتكون الفريق من خمسة لاعبين» إذا أكد الجدول ذلك. والرأي حكم شخصي، مثل «هذه أفضل لعبة».', points: 2 }
      ]
    }
  ];

  var skillSets = [
    {
      id: 'arabic-grammar-practice', title: 'تطبيقات لغوية ونحوية مساندة',
      note: 'تدريبات عامة على الجملة والفعل والفاعل والمفعول، لا تغني عن ترتيب كتاب المدرسة.',
      questions: [
        { q: 'في «العلمُ نورٌ»، نوع الجملة:', options: ['اسمية', 'فعلية', 'استفهامية', 'تعجبية'], answer: 0, why: 'بدأت الجملة باسم، فهي جملة اسمية.' },
        { q: 'في «كتبَتْ مريمُ الرسالةَ»، الفاعل هو:', options: ['مريم', 'الرسالة', 'كتبت', 'لا يوجد'], answer: 0, why: 'مريم هي التي قامت بالكتابة، فهي الفاعل.' },
        { q: 'أي جملة تتضمن فعلاً لازماً؟', options: ['ابتسم الطفلُ', 'قرأ الطالب الكتاب', 'فتح الحارس الباب', 'رسمت سارة لوحة'], answer: 0, why: 'اكتفى الفعل «ابتسم» بفاعله ولم يتعد إلى مفعول به.' },
        { q: 'في «قرأ الطالبُ القصةَ»، المفعول به هو:', options: ['القصة', 'الطالب', 'قرأ', 'لا يوجد'], answer: 0, why: 'القصة هي ما قرأه الطالب.' },
        { q: 'أي فعل مزيد على أصل «خرج»؟', options: ['استخرج', 'كتب', 'جلس', 'خرج'], answer: 0, why: 'الفعل «استخرج» زيدت فيه أحرف على أصل «خرج».' },
        { q: 'أعرب الفاعل في جملة من إنشائك، أو اكتب جملة فعلية وحدد فعلها وفاعلها.', answerText: 'مثال: «يقرأ الطالبُ». يقرأ: فعل، والطالب: فاعل مرفوع. تقبل جملة صحيحة مشابهة.', points: 2 },
        { q: 'حوّل «الطالبةُ مجتهدةٌ» إلى جملة فعلية ذات معنى قريب.', answerText: 'مثال: «تجتهد الطالبةُ». الفعل تجتهد، والفاعل الطالبة.', points: 2 }
      ]
    },
    {
      id: 'arabic-spelling-expression', title: 'تطبيقات إملاء وتعبير وقراءة',
      note: 'مراجعة مهارية داعمة في الهمزة والكتابة وفهم المقروء.',
      questions: [
        { q: 'أي الكلمات تبدأ بهمزة قطع؟', options: ['أصدقاء', 'استمع', 'اكتب', 'استخرج'], answer: 0, why: 'تكتب «أصدقاء» بهمزة قطع فوق الألف.' },
        { q: 'أي الكلمات تبدأ بهمزة وصل؟', options: ['استمع', 'إيمان', 'أحمد', 'أصدقاء'], answer: 0, why: 'الفعل الماضي الخماسي «استمع» يبدأ بهمزة وصل.' },
        { q: 'علامة الترقيم المناسبة في نهاية السؤال هي:', options: ['؟', '،', '.', ':'], answer: 0, why: 'تستعمل علامة الاستفهام في نهاية السؤال.' },
        { q: 'عند تلخيص فقرة، الأفضل أن:', options: ['نكتب الفكرة الأساسية بأسلوبنا', 'ننسخ كل الجمل', 'نضيف معلومات غير موجودة', 'نحذف الفكرة الرئيسة'], answer: 0, why: 'الملخص الجيد يوجز المعنى الرئيس بلغة الطالب.' },
        { q: 'أي عبارة تمثل حقيقة قابلة للتحقق؟', options: ['تبدأ الحصة الساعة الثامنة حسب الجدول', 'الرياضة أجمل الهوايات', 'القصة ممتعة جداً', 'اللون الأزرق أفضل الألوان'], answer: 0, why: 'يمكن الرجوع إلى الجدول للتحقق من موعد الحصة.' },
        { q: 'اكتب فقرة من ثلاثة أسطر عن هواية تحبها، مع مقدمة وفكرة داعمة وخاتمة.', answerText: 'تقبل فقرة مترابطة تذكر الهواية وفائدتها ومثالاً على ممارستها، وتنتهي بخلاصة مناسبة.', points: 2 },
        { q: 'صحح كتابة الكلمتين الآتيتين: (الى المدرسة) و(اكرم صديقه).', answerText: 'إلى المدرسة، وأكرم صديقه. كتبت همزة «إلى» تحت الألف، وهمزة «أكرم» فوق الألف.', points: 2 }
      ]
    }
  ];

  var exams = [
    {
      id: 'arabic-grade7-exam-1', title: 'امتحان تدريبي 1 — الهوية والقراءة والنحو',
      note: 'امتحان أصلي غير رسمي • 12 سؤالاً مع تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'تتكون الهوية من عناصر متعددة، منها:', options: ['اللغة والقيم والخبرات', 'رقم المقعد فقط', 'لون الحذاء فقط', 'طقس يوم واحد'], answer: 0, why: 'تتأثر الهوية باللغة والقيم والأسرة والتاريخ والخبرات.' },
        { q: 'ما السلوك الذي يدعم بناء الشخصية؟', options: ['وضع هدف والعمل له ومراجعة التقدم', 'رفض النصيحة دائماً', 'إلقاء اللوم على الآخرين', 'التوقف عند أول صعوبة'], answer: 0, why: 'يساعد الهدف والخطوات والمثابرة على بناء الشخصية.' },
        { q: 'الصداقة الصحية تقوم على:', options: ['الثقة والاحترام', 'الإجبار والسخرية', 'إفشاء الخصوصية', 'المقاطعة'], answer: 0, why: 'الثقة والاحترام والإنصات من أساسيات الصداقة.' },
        { q: 'في «يساعد الصديق صاحبه»، الفاعل هو:', options: ['الصديق', 'صاحبه', 'يساعد', 'لا يوجد'], answer: 0, why: 'الصديق هو من قام بالفعل، فهو الفاعل.' },
        { q: 'في «الطالبةُ قارئةٌ»، نوع الجملة:', options: ['اسمية', 'فعلية', 'أمر', 'نداء'], answer: 0, why: 'بدأت الجملة باسم «الطالبة».' },
        { q: 'أي كلمة تبدأ بهمزة قطع؟', options: ['إلى', 'استمع', 'اكتب', 'استخرج'], answer: 0, why: 'تبدأ «إلى» بهمزة قطع تحت الألف.' },
        { q: 'اقرأ: «تؤثر الأسرة والمدرسة واللغة في خبرات الإنسان. ويتعلم الطالب احترام ثقافته وثقافة الآخرين». ما الفكرة الرئيسة؟', answerText: 'تؤثر الأسرة والمدرسة واللغة في خبرة الإنسان، ويمكنه الاعتزاز بثقافته واحترام ثقافات غيره.', points: 2 },
        { q: 'استخرج الفعل والفاعل من: «يختار الطالب هدفاً مناسباً».', answerText: 'الفعل: يختار. الفاعل: الطالب.', points: 2 },
        { q: 'اذكر طريقتين لحل خلاف بين صديقين.', answerText: 'الإنصات دون مقاطعة، وتوضيح الرأي بهدوء، والاعتذار عند الخطأ، والبحث عن حل عادل.', points: 2 },
        { q: 'اكتب جملة اسمية عن الهوية تتكون من مبتدأ وخبر.', answerText: 'مثال: «الهويةُ مصدرُ انتماءٍ» أو جملة اسمية صحيحة من إنشاء الطالب.', points: 2 },
        { q: 'اكتب هدفاً دراسياً وخطوتين لتحقيقه.', answerText: 'تقبل إجابة تحدد هدفاً واضحاً وخطوتين عمليتين مناسبتين.', points: 2 },
        { q: 'لماذا لا يعني الاعتزاز بالهوية رفض الثقافات الأخرى؟', answerText: 'لأن الإنسان يستطيع الحفاظ على لغته وقيمه، وفي الوقت نفسه التعلم من الآخرين واحترام اختلافهم.', points: 2 }
      ]
    },
    {
      id: 'arabic-grade7-exam-2', title: 'امتحان تدريبي 2 — الهوايات والنصوص والمهارات',
      note: 'امتحان أصلي غير رسمي • 12 سؤالاً مع تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'من قواعد ممارسة الرياضة بأمان:', options: ['الإحماء والتدرج', 'تجاهل الألم', 'التدرب بلا ماء', 'زيادة الجهد فجأة'], answer: 0, why: 'الإحماء والتدرج والانتباه للجسم يساعد على سلامة الممارسة.' },
        { q: 'ما الروح الرياضية؟', options: ['احترام القواعد والمنافس', 'رفض النتيجة', 'إيذاء الفريق الآخر', 'السخرية من الخاسر'], answer: 0, why: 'الروح الرياضية تعني احترام القواعد والمنافس وتقبل النتيجة.' },
        { q: 'الفكرة الرئيسة هي:', options: ['المعنى الأساسي للنص', 'اسم أطول شخصية', 'أول علامة ترقيم', 'كل كلمة صعبة'], answer: 0, why: 'الفكرة الرئيسة هي المعنى الأهم الذي تدور حوله الفقرة.' },
        { q: 'أي مما يأتي رأي؟', options: ['أرى أن القراءة هواية ممتعة', 'عدد صفحات الكتاب 80', 'بدأ التدريب الساعة 4', 'الفريق مكون من 6 لاعبين'], answer: 0, why: 'تعبير «أرى» يوضح حكماً شخصياً لا حقيقة مجردة.' },
        { q: 'في «ابتسم الطفل»، الفعل ابتسم:', options: ['لازم', 'متعدٍ لمفعولين', 'اسم', 'حرف جر'], answer: 0, why: 'اكتفى الفعل بفاعله ولم يحتج إلى مفعول به.' },
        { q: 'في «قرأ الطالب القصة»، كلمة «القصة» هي:', options: ['مفعول به', 'فاعل', 'فعل', 'مبتدأ'], answer: 0, why: 'وقع فعل القراءة على القصة، فهي المفعول به.' },
        { q: 'ما الشعور الغالب في نص يتحدث عن المثابرة والأمل؟ اذكر دليلاً لفظياً.', answerText: 'قد يكون التفاؤل أو الإصرار، ويذكر الطالب كلمة مناسبة من النص مثل «الأمل» أو «أتابع».', points: 2 },
        { q: 'اكتب فرقاً واحداً بين الحقيقة والرأي.', answerText: 'الحقيقة يمكن التحقق منها بدليل أو مصدر، أما الرأي فيعبر عن تفضيل أو حكم شخصي.', points: 2 },
        { q: 'صحح الكلمة: (اكرم) في جملة «اكرم صديقك».', answerText: 'أكرم صديقك. همزة «أكرم» همزة قطع فوق الألف.', points: 2 },
        { q: 'اكتب جملة فعلية من إنشائك، وحدد الفعل والفاعل.', answerText: 'مثال: «يمارسُ الطالبُ الرياضةَ». الفعل يمارس، والفاعل الطالب.', points: 2 },
        { q: 'اذكر فائدة للقراءة وطريقة للتحقق من معلومة.', answerText: 'توسع القراءة المعرفة أو تنمي اللغة، ويمكن التحقق بمراجعة مصدر موثوق أو مقارنة أكثر من مصدر.', points: 2 },
        { q: 'اكتب فقرة قصيرة عن هواية تحبها، وراع وضوح الفكرة وعلامات الترقيم.', answerText: 'تقبل فقرة مترابطة تعرف الهواية وتذكر سبب حبها وفائدة أو مثالاً عليها، مع علامات ترقيم مناسبة.', points: 2 }
      ]
    }
  ];

  function normalize(value) {
    return String(value || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim();
  }

  function isTarget(type) {
    var stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
    var grade = normalize(typeof currentGrade === 'undefined' ? '' : currentGrade);
    var subject = normalize(typeof currentSubject === 'undefined' ? '' : currentSubject);
    var term = typeof currentTerm === 'undefined' ? 1 : Number(currentTerm);
    return stage === 'prep' && /^الاول/.test(grade) && /(عرب|لغ)/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
  }

  function el(tag, content, className) {
    var node = document.createElement(tag);
    node.textContent = content;
    if (className) node.className = className;
    return node;
  }

  function noticeBox() {
    var box = document.createElement('div');
    box.setAttribute('dir', 'rtl');
    box.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.8;color:#594300;font-size:13px;';
    box.appendChild(el('div', 'تنبيه مهم: ' + NOTICE));
    var links = document.createElement('div');
    links.style.marginTop = '6px';
    var ministry = el('a', 'فهرس اللغة العربية في بوابة الوزارة');
    ministry.href = 'https://lessons.moe.gov.eg/g7/t1/s1/th0';
    ministry.target = '_blank';
    ministry.rel = 'noopener';
    var currentCourse = el('a', 'فهرس كورس عربي 2027 للمقارنة');
    currentCourse.href = 'https://hnzakrmiddle.com/courses/arabic-prep-1-term-1-2027';
    currentCourse.target = '_blank';
    currentCourse.rel = 'noopener';
    links.appendChild(ministry);
    links.appendChild(el('span', '  •  '));
    links.appendChild(currentCourse);
    box.appendChild(links);
    return box;
  }

  function makeCard(title, description, id, icon) {
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'content-item';
    a.setAttribute('role', 'button');
    a.setAttribute('aria-label', title);
    a.addEventListener('click', function (event) {
      event.preventDefault();
      window.openGrade7ArabicItem(id);
    });
    a.appendChild(el('div', icon, 'content-item-icon'));
    var info = document.createElement('div');
    info.className = 'content-item-info';
    info.appendChild(el('div', title, 'content-item-title'));
    info.appendChild(el('div', description, 'content-item-sub'));
    a.appendChild(info);
    a.appendChild(el('div', '‹', 'content-item-arrow'));
    return a;
  }

  function buildQuestions(questions, prefix) {
    var wrap = document.createElement('div');
    questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var title = el('div', (index + 1) + '. ' + q.q);
      title.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;';
      block.appendChild(title);
      if (q.options) {
        var choices = document.createElement('div');
        q.options.forEach(function (choice, choiceIndex) {
          var label = document.createElement('label');
          label.style.cssText = 'display:flex;gap:8px;align-items:flex-start;padding:7px 3px;line-height:1.7;cursor:pointer;';
          var radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = prefix + '-' + index;
          radio.value = String(choiceIndex);
          radio.style.marginTop = '6px';
          label.appendChild(radio);
          label.appendChild(el('span', choice));
          choices.appendChild(label);
        });
        block.appendChild(choices);
        var result = el('div', '');
        result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.7;';
        block.appendChild(result);
        block._grade7ArabicQuestion = q;
        block._grade7ArabicResult = result;
      } else {
        var details = document.createElement('details');
        details.style.marginTop = '10px';
        details.appendChild(el('summary', 'عرض إجابة نموذجية'));
        var answer = el('div', q.answerText || '');
        answer.style.cssText = 'padding:8px 2px;line-height:1.9;';
        details.appendChild(answer);
        block.appendChild(details);
      }
      wrap.appendChild(block);
    });
    var gradeButton = el('button', 'صحّح أسئلة الاختيار من متعدد');
    gradeButton.type = 'button';
    gradeButton.style.cssText = 'background:#2E7D32;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    var score = el('div', '');
    score.style.cssText = 'font-weight:700;color:#2E7D32;margin:6px 0 12px;';
    gradeButton.addEventListener('click', function () {
      var points = 0, total = 0;
      Array.prototype.forEach.call(wrap.children, function (item) {
        var q = item._grade7ArabicQuestion;
        if (!q || !q.options) return;
        total += 1;
        var chosen = item.querySelector('input[type="radio"]:checked');
        var correct = !!chosen && Number(chosen.value) === q.answer;
        if (correct) points += 1;
        item._grade7ArabicResult.style.display = 'block';
        item._grade7ArabicResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        item._grade7ArabicResult.textContent = (correct ? 'إجابة صحيحة. ' : 'راجع الإجابة. ') + q.why;
      });
      score.textContent = 'درجتك في أسئلة الاختيار من متعدد: ' + points + ' من ' + total;
    });
    wrap.insertBefore(gradeButton, wrap.firstChild);
    wrap.insertBefore(score, gradeButton.nextSibling);
    return wrap;
  }

  function findItem(id) {
    for (var u = 0; u < units.length; u += 1) {
      for (var l = 0; l < units[u].lessons.length; l += 1) {
        if (units[u].lessons[l].id === id) return { kind: 'lesson', unit: units[u], item: units[u].lessons[l] };
      }
      if (units[u].id === id) return { kind: 'exercise', unit: units[u], item: units[u] };
    }
    for (var s = 0; s < skillSets.length; s += 1) if (skillSets[s].id === id) return { kind: 'exercise', item: skillSets[s] };
    for (var e = 0; e < exams.length; e += 1) if (exams[e].id === id) return { kind: 'exam', item: exams[e] };
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
      body.appendChild(el('div', found.unit.title, 'arabic-unit-heading'));
      var passageBox = document.createElement('div');
      passageBox.style.cssText = 'background:#F5F7FA;border-right:4px solid #2E7D32;border-radius:12px;padding:14px;margin:12px 0;line-height:2;white-space:pre-line;';
      passageBox.appendChild(el('strong', 'نص تدريبي أصلي: '));
      passageBox.appendChild(el('span', found.item.passage));
      body.appendChild(passageBox);
      body.appendChild(el('h3', 'شرح الدرس'));
      found.item.explain.forEach(function (paragraph) {
        var p = el('p', paragraph);
        p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;';
        body.appendChild(p);
      });
      var vocab = document.createElement('div');
      vocab.style.cssText = 'background:#FFF8E1;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      vocab.appendChild(el('strong', 'مفردات: '));
      vocab.appendChild(el('span', found.item.vocabulary));
      body.appendChild(vocab);
      var language = document.createElement('div');
      language.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      language.appendChild(el('strong', 'مهارة لغوية: '));
      language.appendChild(el('span', found.item.language));
      body.appendChild(language);
      var writing = document.createElement('div');
      writing.style.cssText = 'background:#F3E5F5;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      writing.appendChild(el('strong', 'نشاط كتابة: '));
      writing.appendChild(el('span', found.item.writing));
      body.appendChild(writing);
      var key = document.createElement('div');
      key.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      key.appendChild(el('strong', 'خلاصة: '));
      key.appendChild(el('span', found.item.key));
      body.appendChild(key);
      body.appendChild(el('h3', 'اختبر فهمك'));
      body.appendChild(buildQuestions(found.unit.exercises.slice(0, 3), found.item.id));
    } else {
      body.appendChild(el('p', found.item.note || 'أجب ثم اضغط زر التصحيح. افتح الإجابات المقالية النموذجية للمراجعة.'));
      if (found.kind === 'exercise' && found.unit) body.appendChild(el('div', found.unit.title, 'arabic-unit-heading'));
      body.appendChild(buildQuestions(found.kind === 'exercise' ? (found.item.questions || found.item.exercises) : found.item.questions, found.item.id));
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
    root.className = 'grade7-arabic-original-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
    if (type === 'lessons') {
      units.forEach(function (unit) {
        root.appendChild(el('h3', unit.title));
        unit.lessons.forEach(function (lesson) {
          root.appendChild(makeCard(lesson.title, lesson.explain[0], lesson.id, '📖'));
        });
      });
      root.appendChild(el('div', 'وتشمل الأنشطة داخل الدروس القراءة والفهم والمفردات والنحو والإملاء والتعبير.'));
    } else if (type === 'exercises') {
      units.forEach(function (unit) {
        root.appendChild(makeCard('تدريبات ' + unit.title, unit.exercises.length + ' أسئلة متنوعة مع تصحيح فوري', unit.id, '✏️'));
      });
      skillSets.forEach(function (set) {
        root.appendChild(makeCard(set.title, set.questions.length + ' أسئلة في قواعد اللغة والكتابة', set.id, '🔤'));
      });
    } else if (type === 'exams') {
      exams.forEach(function (exam) {
        root.appendChild(makeCard(exam.title, exam.note, exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openGrade7ArabicItem = openItem;
  var previousOpenContent = window.openContent;
  if (typeof previousOpenContent === 'function' && !previousOpenContent.__grade7ArabicWrapped) {
    var wrappedOpenContent = async function (type, termNumber, termName) {
      var result = await previousOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrappedOpenContent.__grade7ArabicWrapped = true;
    window.openContent = wrappedOpenContent;
  }
})();
