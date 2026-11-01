// Original, provisional learning content for Grade 7 Science, Term 1 (Egypt 2026/2027).
// Unit sequence is based on the 2026/2027 AlAdwaa overview, not a verified Ministry textbook.
// Keep the visible curriculum-verification notice. All wording/questions below are original.
(function () {
  'use strict';

  var NOTICE = 'محتوى تعليمي أصلي للمراجعة. ترتيب الوحدات مستند إلى مرجع تعليمي منشور لعام 2026/2027، ولم يُطابق بعد مع كتاب الوزارة بسبب تعذّر الوصول إلى المكتبة الرسمية (403). راجع فهرس كتابك المدرسي قبل الاعتماد النهائي.';
  var units = [
    {
      id: 'matter', title: 'الوحدة الأولى: المادة وتركيبها', lessons: [
        {
          id: 'matter-particles', title: '1. المادة والجسيمات',
          explain: [
            'المادة هي كل ما له كتلة ويشغل حيزاً من الفراغ. الهواء مادة رغم أننا لا نراه؛ لأنه يشغل حيزاً وله كتلة يمكن الاستدلال عليها.',
            'تتكون المواد من جسيمات دقيقة جداً. تختلف طريقة ترتيب الجسيمات وحركتها من مادة إلى أخرى، ولذلك تختلف خواص المواد وحالاتها.',
            'في الصلب تكون الجسيمات متقاربة وتهتز حول مواضعها. وفي السائل تبقى متقاربة لكنها تنزلق بعضها بجوار بعض. وفي الغاز تكون متباعدة وتتحرك بحرية أكبر.',
            'عند تسخين مادة تزداد حركة جسيماتها عادة، وعند تبريدها تقل حركتها. تغير الحالة مثل انصهار الثلج أو تبخر الماء تغير فيزيائي؛ فالمادة لا تتحول بذلك إلى نوع جديد.'
          ], example: 'رائحة العطر تنتشر في الغرفة لأن جسيمات الغاز تتحرك وتنتشر بين جسيمات الهواء.',
          key: 'المادة لها كتلة وحجم؛ المواد مكوّنة من جسيمات؛ حركة الجسيمات وترتيبها يساعدان على تفسير حالات المادة.'
        },
        {
          id: 'atom', title: '2. تركيب الذرة والعناصر',
          explain: [
            'الذرة وحدة صغيرة تكوّن العنصر. تتكون الذرة من نواة صغيرة كثيفة في مركزها، وتوجد حول النواة إلكترونات في مناطق أو مستويات طاقة.',
            'تحتوي النواة على بروتونات موجبة الشحنة ونيوترونات متعادلة الشحنة. الإلكترونات سالبة الشحنة. في الذرة المتعادلة يتساوى عدد البروتونات مع عدد الإلكترونات.',
            'العنصر مادة نقية تتكون من نوع واحد من الذرات. يحدد عدد البروتونات هوية العنصر؛ فالذرات التي لها العدد نفسه من البروتونات تنتمي إلى العنصر نفسه.',
            'العدد الذري هو عدد البروتونات في نواة الذرة. وفي الذرة المتعادلة يساوي أيضاً عدد الإلكترونات. لا تخلط بين العدد الذري والعدد الكتلي؛ فالعدد الكتلي يساوي مجموع البروتونات والنيوترونات.'
          ], example: 'ذرة متعادلة عددها الذري 8 بها 8 بروتونات و8 إلكترونات. وإذا كان بها 8 نيوترونات يكون عددها الكتلي 16.',
          key: 'البروتون موجب، النيوترون متعادل، الإلكترون سالب؛ العدد الذري = عدد البروتونات.'
        },
        {
          id: 'periodic-table', title: '3. تنظيم العناصر في الجدول الدوري',
          explain: [
            'الجدول الدوري ينظم العناصر في صفوف أفقية تسمى دورات وأعمدة رأسية تسمى مجموعات. تتشابه عناصر المجموعة الواحدة في عدد من خواصها العامة.',
            'يرتب الجدول الحديث العناصر تصاعدياً حسب العدد الذري. لذلك يساعد موقع العنصر على مقارنة خواصه بغيره وتوقع بعض سلوكه.',
            'تقع معظم الفلزات في يسار الجدول ووسطه. غالباً ما تكون لامعة وقابلة للطرق والسحب وموصلة للحرارة والكهرباء. تقع معظم اللافلزات في يمينه، وخواصها متنوعة وغالباً لا توصل الكهرباء جيداً.',
            'أشباه الفلزات لها بعض صفات الفلزات وبعض صفات اللافلزات. والسيليكون مثال مهم يستخدم في صناعة مكونات إلكترونية.'
          ], example: 'النحاس فلز يستخدم في الأسلاك لأنه يوصل الكهرباء جيداً، أما الكبريت فلا فلز هش في الحالة الصلبة.',
          key: 'الدورة صف أفقي، المجموعة عمود رأسي؛ ترتيب الجدول حسب العدد الذري؛ توجد فلزات ولافلزات وأشباه فلزات.'
        }
      ],
      exercises: [
        { q: 'أي عبارة تصف المادة؟', options: ['لها كتلة وتشغل حيزاً', 'تضيء دائماً', 'تتحرك بسرعة ثابتة', 'لا يمكن قياسها'], answer: 0, why: 'هذا هو التعريف العلمي للمادة.' },
        { q: 'ما الجسيم ذو الشحنة السالبة؟', options: ['البروتون', 'النيوترون', 'الإلكترون', 'النواة'], answer: 2, why: 'الإلكترون سالب الشحنة.' },
        { q: 'ذرة متعادلة عددها الذري 11؛ كم إلكتروناً فيها؟', options: ['1', '10', '11', '22'], answer: 2, why: 'في الذرة المتعادلة يتساوى عدد الإلكترونات والبروتونات.' },
        { q: 'ماذا تسمى الأعمدة الرأسية في الجدول الدوري؟', options: ['دورات', 'مجموعات', 'مستويات', 'مدارات'], answer: 1, why: 'الأعمدة الرأسية تسمى مجموعات.' },
        { q: 'لماذا ينتشر العطر في أرجاء الغرفة؟', options: ['لأن جسيماته تتحرك وتنتشر', 'لأن كتلته تختفي', 'لأنه يتحول إلى ضوء', 'لأن الهواء يتجمد'], answer: 0, why: 'جسيمات الغاز تتحرك بحرية وتنتشر بين جسيمات الهواء.' }
      ]
    },
    {
      id: 'forces', title: 'الوحدة الثانية: مجالات القوى', lessons: [
        {
          id: 'electric-force', title: '4. القوى الكهربية والشحنات',
          explain: [
            'القوة الكهربية قوة يمكن أن تؤثر بين أجسام مشحونة عن بُعد. توجد شحنات موجبة وشحنات سالبة، أما الجسم المتعادل فشحناته الموجبة والسالبة متوازنة.',
            'الشحنات المتشابهة تتنافر، والشحنات المختلفة تتجاذب. ويمكن شحن بعض الأجسام بالدلك نتيجة انتقال إلكترونات من جسم إلى آخر.',
            'القوة الكهربية من قوى المجال؛ أي يمكن أن تؤثر دون تلامس مباشر. وتختلف شدتها باختلاف مقدار الشحنات والمسافة بينها.',
            'تجربة آمنة: قرّب مسطرة بلاستيكية مدلوكة بقطعة صوف من قصاصات ورق خفيفة. قد تنجذب القصاصات بسبب إعادة توزيع الشحنات فيها. لا تستخدم مقبس الكهرباء أو بطاريات تالفة في التجربة.'
          ], example: 'عند دلك بالون بالشعر قد يلتصق البالون بالحائط بسبب قوى كهربية ساكنة.',
          key: 'المتشابه يتنافر والمختلف يتجاذب؛ القوة الكهربية قد تعمل عن بُعد؛ الدلك قد ينقل إلكترونات.'
        },
        {
          id: 'magnetic-force', title: '5. القوى المغناطيسية',
          explain: [
            'للمغناطيس قطبان: شمالي وجنوبي. إذا اقترب قطبان متماثلان حدث تنافر، وإذا اقترب قطبان مختلفان حدث تجاذب.',
            'تتركز قوة المغناطيس حول قطبيه، وتمتد في المنطقة المحيطة به التي تسمى المجال المغناطيسي. يمكن تمثيل المجال بخطوط توضح اتجاهه وشكله.',
            'يجذب المغناطيس مواد مثل الحديد والنيكل والكوبالت، لكنه لا يجذب كل المعادن. لذلك لا يصح القول إن كل جسم معدني ينجذب للمغناطيس.',
            'تستخدم البوصلة إبرة مغناطيسية صغيرة تصطف تقريباً مع المجال المغناطيسي للأرض؛ ويشير طرفها إلى اتجاه الشمال المغناطيسي تقريباً.'
          ], example: 'إذا قربت قطباً شمالياً من قطب شمالي لمغناطيس آخر فستشعر بتنافر، أما الشمالي والجنوبي فيتجاذبان.',
          key: 'المغناطيس له قطبان؛ المتماثلان يتنافران والمختلفان يتجاذبان؛ الحديد من المواد التي يجذبها المغناطيس.'
        },
        {
          id: 'gravity', title: '6. قوة الجاذبية',
          explain: [
            'الجاذبية قوة تجاذب بين الأجسام التي لها كتلة. تجذب الأرض الأجسام نحو مركزها، وهذا ما يجعل الأشياء تسقط إلى أسفل عند تركها.',
            'تؤثر الجاذبية عن بُعد، ولا تحتاج إلى تلامس مباشر. كما أن جاذبية الشمس تحفظ الكواكب في مداراتها حولها.',
            'الكتلة مقدار ما يحتويه الجسم من مادة وتقاس بالكيلوجرام. أما الوزن فهو قوة جذب الجاذبية للجسم ويقاس بالنيوتن. تتغير قيمة الوزن بتغير الجاذبية، بينما تبقى كتلة الجسم ثابتة تقريباً.',
            'كلما زادت كتلة الأجسام زادت قوة التجاذب بينها، وكلما زادت المسافة بينها ضعفت القوة. وفي المسائل البسيطة، الوزن على الأرض يقارب الكتلة مضروبة في 10 نيوتن لكل كيلوجرام.'
          ], example: 'كتلة جسم 3 كجم؛ وزنه التقريبي على الأرض = 3 × 10 = 30 نيوتن.',
          key: 'الجاذبية تجذب الأجسام ذات الكتلة؛ الكتلة بالكيلوجرام والوزن بالنيوتن؛ جاذبية الشمس تؤثر في حركة الكواكب.'
        }
      ],
      exercises: [
        { q: 'ماذا يحدث لشحنتين موجبتين متقاربتين؟', options: ['تتجاذبان', 'تتنافران', 'تتحولان إلى مغناطيس', 'لا تؤثر إحداهما في الأخرى مطلقاً'], answer: 1, why: 'الشحنات المتشابهة تتنافر.' },
        { q: 'أي زوج من أقطاب المغناطيس يتجاذب؟', options: ['شمالي وشمالي', 'جنوبي وجنوبي', 'شمالي وجنوبي', 'كل الأقطاب تتنافر'], answer: 2, why: 'القطبان المختلفان يتجاذبان.' },
        { q: 'أي المواد التالية ينجذب عادة إلى مغناطيس؟', options: ['الخشب', 'الزجاج', 'الحديد', 'الورق'], answer: 2, why: 'الحديد مادة مغناطيسية.' },
        { q: 'ما وحدة قياس الوزن؟', options: ['الكيلوجرام', 'النيوتن', 'المتر', 'اللتر'], answer: 1, why: 'الوزن قوة ويقاس بالنيوتن.' },
        { q: 'وزن جسم كتلته 5 كجم على الأرض يساوي تقريباً (اعتبر الجاذبية 10 نيوتن/كجم):', options: ['0.5 نيوتن', '5 نيوتن', '15 نيوتن', '50 نيوتن'], answer: 3, why: 'الوزن = الكتلة × شدة مجال الجاذبية = 5 × 10 = 50 نيوتن.' }
      ]
    },
    {
      id: 'living', title: 'الوحدة الثالثة: الكائنات الحية تركيبها وعملياتها', lessons: [
        {
          id: 'cell', title: '7. الخلية وحدة بناء الكائن الحي',
          explain: [
            'الخلية أصغر وحدة بنائية ووظيفية في الكائن الحي. بعض الكائنات يتكون من خلية واحدة، بينما يتكون جسم الإنسان والنباتات الكبيرة من خلايا كثيرة متخصصة.',
            'في الخلية النباتية غشاء يحيط بها وجدار خلوي يدعمها، وسيتوبلازم تحدث فيه عمليات كثيرة، ونواة تحتوي على المادة الوراثية. تحتوي الخلايا الخضراء غالباً على بلاستيدات خضراء تساعد النبات على صنع غذائه.',
            'الخلية الحيوانية لها غشاء وسيتوبلازم ونواة، لكنها لا تمتلك جداراً خلوياً أو بلاستيدات خضراء مثل الخلية النباتية.',
            'تتعاون الخلايا المتشابهة لتكوين نسيج، وتتعاون الأنسجة لتكوين عضو، وتعمل الأعضاء معاً ضمن جهاز. مثال: خلايا عضلية تكوّن نسيجاً عضلياً، وتشارك أنسجة وأعضاء متعددة في الحركة.'
          ], example: 'الجذر عضو نباتي يتكون من أنسجة وخلايا تساعد على تثبيت النبات وامتصاص الماء والأملاح.',
          key: 'الخلية وحدة البناء والوظيفة؛ النباتية لها جدار خلوي وبلاستيدات خضراء؛ خلية ← نسيج ← عضو ← جهاز.'
        },
        {
          id: 'life-processes', title: '8. صفات الكائنات الحية وعملياتها',
          explain: [
            'تظهر الكائنات الحية مجموعة من الصفات؛ فهي تتكون من خلية أو أكثر، وتحتاج إلى الطاقة، وتنمو، وتستجيب للمؤثرات، وتتخلص من الفضلات، ويمكنها التكاثر.',
            'التغذية توفر المواد والطاقة اللازمة للحياة. تصنع النباتات الخضراء غذاءها بعملية البناء الضوئي مستخدمة الضوء والماء وثاني أكسيد الكربون، وينتج الغذاء والأكسجين.',
            'التنفس الخلوي عملية تحرر الطاقة من الغذاء داخل الخلايا. لا يعني التنفس الخلوي مجرد دخول الهواء إلى الرئتين؛ فهو يحدث في خلايا الكائن الحي.',
            'تساعد أجهزة الجسم المختلفة على أداء الوظائف. يعمل الجهاز الهضمي على تفتيت الطعام وامتصاص المواد الغذائية، وينقل الدم الأكسجين والمواد إلى الخلايا.'
          ], example: 'ينمو النبات باتجاه الضوء؛ هذه استجابة لمؤثر، بينما يصنع غذاءه في الأوراق بوجود الضوء.',
          key: 'من صفات الحياة: النمو والتغذية والاستجابة والتكاثر والإخراج؛ البناء الضوئي يصنع الغذاء، والتنفس الخلوي يحرر الطاقة.'
        },
        {
          id: 'microbes', title: '9. الميكروبات: تنوعها وأثرها',
          explain: [
            'الميكروبات كائنات دقيقة لا ترى معظمها بالعين المجردة. منها بكتيريا وفطريات دقيقة وطلائعيات، والفيروسات جسيمات دقيقة لا تتكاثر إلا داخل خلايا كائن حي.',
            'ليست كل الميكروبات ضارة. تساعد بعض البكتيريا على صناعة الزبادي، وتعيد فطريات وبكتيريا محللة مواد غذائية إلى البيئة بتفكيك بقايا الكائنات.',
            'تسبب بعض الميكروبات أمراضاً، وقد تنتقل عبر الهواء أو الماء أو الطعام الملوث أو التلامس. غسل اليدين وطهي الطعام جيداً وتغطية الفم عند السعال يقلل انتقال كثير من الممرضات.',
            'لا تعالج العدوى الفيروسية بالمضادات الحيوية؛ فالمضاد الحيوي يستهدف أنواعاً من البكتيريا ويجب ألا يستخدم إلا بتوجيه طبي. اللقاحات تساعد جهاز المناعة على الاستعداد لمسببات أمراض معينة.'
          ], example: 'الخميرة فطر دقيق يستخدم في تخمير العجين، بينما قد تسبب بعض أنواع البكتيريا المرض.',
          key: 'الميكروبات متنوعة وليست كلها ضارة؛ النظافة تقلل انتقال الممرضات؛ المضادات الحيوية ليست علاجاً للفيروسات.'
        }
      ],
      exercises: [
        { q: 'ما أصغر وحدة بنائية ووظيفية في الكائن الحي؟', options: ['العضو', 'الجهاز', 'الخلية', 'النسيج'], answer: 2, why: 'الخلية هي وحدة البناء والوظيفة.' },
        { q: 'أي تركيب يوجد في الخلية النباتية ولا يوجد عادة في الخلية الحيوانية؟', options: ['الغشاء الخلوي', 'السيتوبلازم', 'النواة', 'الجدار الخلوي'], answer: 3, why: 'الخلية النباتية لها جدار خلوي.' },
        { q: 'ما العملية التي يصنع فيها النبات غذاءه مستخدماً الضوء؟', options: ['التنفس', 'البناء الضوئي', 'الإخراج', 'الهضم'], answer: 1, why: 'البناء الضوئي يصنع الغذاء في النباتات الخضراء.' },
        { q: 'أي عبارة صحيحة عن الميكروبات؟', options: ['كلها تسبب المرض', 'لا فائدة لأي منها', 'منها النافع ومنها الممرض', 'كلها ترى بالعين المجردة'], answer: 2, why: 'لبعضها فوائد بيئية وصناعية، وبعضها يسبب المرض.' },
        { q: 'لماذا لا تستخدم المضادات الحيوية لعلاج نزلة برد فيروسية من دون وصفة؟', options: ['لأنها تستهدف البكتيريا ولا تعالج الفيروسات', 'لأن الفيروسات أكبر من الخلايا', 'لأنها تزيد الأكسجين', 'لأنها توقف البناء الضوئي'], answer: 0, why: 'المضادات الحيوية ليست علاجاً للفيروسات، ويحدد الطبيب العلاج المناسب.' }
      ]
    },
    {
      id: 'earth-space', title: 'الوحدة الرابعة: نظام الأرض والشمس والقمر', lessons: [
        {
          id: 'solar-system', title: '10. الأرض والنظام الشمسي',
          explain: [
            'النظام الشمسي يتكون من الشمس وما يرتبط بها بفعل الجاذبية، مثل الكواكب وأقمارها وأجسام أصغر. الشمس نجم يضيء بذاته، أما الكواكب فتعكس ضوء الشمس.',
            'تدور الأرض حول محورها مرة كل نحو 24 ساعة، وينتج عن ذلك تعاقب الليل والنهار. وتدور حول الشمس في مدار، وتستغرق الدورة سنة تقريباً.',
            'القمر تابع طبيعي للأرض ويدور حولها. نرى أطواره المختلفة لأننا نشاهد أجزاء مختلفة من نصفه المضاء بالشمس أثناء دورانه حول الأرض.',
            'تسحب جاذبية الشمس الكواكب نحوها، بينما تساعد حركة الكواكب على استمرارها في مداراتها. الأرض كروية تقريباً وليست مسطحة.'
          ], example: 'حين يكون جزء من الأرض مواجهاً للشمس يكون نهاراً فيه، بينما يكون الجزء الآخر بعيداً عن أشعة الشمس فيكون ليلاً.',
          key: 'الشمس نجم؛ الكواكب تعكس ضوءها؛ دوران الأرض حول محورها يسبب الليل والنهار، وحول الشمس يستغرق سنة.'
        },
        {
          id: 'lunar-eclipse', title: '11. خسوف القمر',
          explain: [
            'يحدث خسوف القمر عندما تقع الأرض بين الشمس والقمر على استقامة تقريبية، فيدخل القمر في ظل الأرض أو شبه ظلها.',
            'يحدث الخسوف عند اكتمال القمر، لكنه لا يحدث كل شهر؛ لأن مدار القمر مائل قليلاً بالنسبة إلى مستوى مدار الأرض حول الشمس.',
            'في الخسوف الكلي يدخل قرص القمر كله في ظل الأرض، وفي الخسوف الجزئي يدخل جزء منه فقط. وقد يبدو القمر داكناً أو مائلاً إلى اللون الأحمر بسبب مرور بعض ضوء الشمس خلال الغلاف الجوي للأرض.',
            'خسوف القمر آمن للمشاهدة بالعين المجردة. لا تخلط بينه وبين كسوف الشمس، الذي يقع فيه القمر بين الأرض والشمس ولا ينبغي النظر إلى الشمس مباشرة.'
          ], example: 'ترتيب الأجرام عند خسوف القمر: الشمس ← الأرض ← القمر، ويقع القمر في ظل الأرض.',
          key: 'الخسوف: الأرض بين الشمس والقمر؛ يقع عند اكتمال القمر؛ مشاهدة خسوف القمر آمنة، أما النظر للشمس مباشرة فخطر.'
        }
      ],
      exercises: [
        { q: 'أي جسم في النظام الشمسي يضيء بذاته؟', options: ['الأرض', 'القمر', 'الشمس', 'المريخ'], answer: 2, why: 'الشمس نجم يصدر الضوء والحرارة.' },
        { q: 'ما سبب تعاقب الليل والنهار؟', options: ['دوران الأرض حول محورها', 'دوران القمر حول الأرض', 'خسوف القمر', 'تغير حجم الشمس'], answer: 0, why: 'دوران الأرض حول محورها يجعل المواقع تواجه الشمس ثم تبتعد عنها.' },
        { q: 'ما ترتيب الأجرام عند خسوف القمر؟', options: ['الشمس ثم القمر ثم الأرض', 'الأرض ثم الشمس ثم القمر', 'الشمس ثم الأرض ثم القمر', 'القمر ثم الأرض ثم الشمس'], answer: 2, why: 'تقع الأرض بين الشمس والقمر فيمر القمر في ظلها.' },
        { q: 'لماذا لا يحدث خسوف القمر كل شهر؟', options: ['لأن الشمس تنطفئ', 'لأن مدار القمر مائل بالنسبة إلى مدار الأرض', 'لأن القمر لا يدور', 'لأن الأرض لا ظل لها'], answer: 1, why: 'ميل مدار القمر يجعل الاصطفاف الدقيق غير متحقق كل دورة.' },
        { q: 'أي مشاهدة آمنة بالعين المجردة؟', options: ['النظر المباشر إلى الشمس', 'خسوف القمر', 'كسوف الشمس دون مرشح معتمد', 'النظر عبر عدسة مكبرة إلى الشمس'], answer: 1, why: 'مشاهدة خسوف القمر آمنة، لكن النظر إلى الشمس قد يضر العين.' }
      ]
    }
  ];

  var exams = [
    {
      id: 'midterm', title: 'امتحان تدريبي 1 — المادة والقوى',
      note: 'تدريب أصلي غير رسمي • 10 أسئلة • زمن مقترح 35 دقيقة',
      questions: [
        { q: 'أي مما يلي يعد مادة؟', options: ['الهواء', 'الظل', 'الضوء', 'الصوت'], answer: 0, why: 'الهواء له كتلة ويشغل حيزاً.' },
        { q: 'جسيم متعادل داخل نواة الذرة هو:', options: ['الإلكترون', 'البروتون', 'النيوترون', 'الأيون'], answer: 2, why: 'النيوترون متعادل الشحنة.' },
        { q: 'يتساوى عدد البروتونات مع عدد الإلكترونات في الذرة:', options: ['المتعادلة', 'الموجبة دائماً', 'المثارة فقط', 'المركبة'], answer: 0, why: 'تتوازن الشحنات في الذرة المتعادلة.' },
        { q: 'تسمى الصفوف الأفقية في الجدول الدوري:', options: ['مجموعات', 'دورات', 'خلايا', 'مستويات'], answer: 1, why: 'الصفوف الأفقية دورات.' },
        { q: 'الشحنات المختلفة:', options: ['تتجاذب', 'تتنافر', 'تتلاشى دائماً', 'تتحول إلى نيوترونات'], answer: 0, why: 'المختلف يتجاذب.' },
        { q: 'إذا قربنا قطبين جنوبيين لمغناطيسين فإنهما:', options: ['يتجاذبان', 'يتنافران', 'يفقدان كتلتهما', 'لا يتأثران أبداً'], answer: 1, why: 'الأقطاب المتماثلة تتنافر.' },
        { q: 'جسم كتلته 2 كجم؛ وزنه التقريبي على الأرض عند 10 نيوتن/كجم:', options: ['2 نيوتن', '10 نيوتن', '20 نيوتن', '200 نيوتن'], answer: 2, why: 'الوزن = 2 × 10 = 20 نيوتن.' },
        { q: 'فسر: ينتشر الغاز في الحيز المتاح له.', options: ['لأن جسيماته تتحرك بحرية ومتباعدة', 'لأن جسيماته ثابتة', 'لأن كتلته صفر', 'لأن جسيماته أكبر من الوعاء'], answer: 0, why: 'جسيمات الغاز متباعدة وتتحرك في اتجاهات متعددة.' },
        { q: 'قارن بين الكتلة والوزن من حيث المعنى ووحدة القياس.', answerText: 'الكتلة مقدار ما يحتويه الجسم من مادة وتقاس بالكيلوجرام. الوزن قوة جذب الجاذبية للجسم ويقاس بالنيوتن.', points: 2 },
        { q: 'صف تجربة آمنة بسيطة تكشف وجود قوة كهربية ساكنة.', answerText: 'أدلك مسطرة بلاستيكية بقطعة صوف ثم أقربها من قصاصات ورق صغيرة؛ انجذاب القصاصات يدل على تأثير الشحنات. لا أستخدم مصدر كهرباء منزلياً.', points: 2 }
      ]
    },
    {
      id: 'final', title: 'امتحان تدريبي 2 — نموذج شامل للترم الأول',
      note: 'تدريب أصلي غير رسمي • 12 سؤالاً • زمن مقترح 50 دقيقة',
      questions: [
        { q: 'العدد الذري للعنصر يساوي عدد:', options: ['النيوترونات', 'البروتونات', 'مستويات الطاقة', 'الجزيئات'], answer: 1, why: 'العدد الذري يحدد بعدد البروتونات.' },
        { q: 'أي مادة من الآتية ينجذب إليها المغناطيس عادة؟', options: ['الحديد', 'الزجاج', 'النحاس', 'الخشب'], answer: 0, why: 'الحديد مادة مغناطيسية.' },
        { q: 'الوحدة البنائية للكائنات الحية هي:', options: ['الخلية', 'النسيج', 'العضو', 'الجهاز'], answer: 0, why: 'الخلية أصغر وحدة بنائية ووظيفية.' },
        { q: 'تركيب يساعد الخلية النباتية على صنع الغذاء بوجود الضوء:', options: ['الجدار الخلوي', 'البلاستيدة الخضراء', 'الغشاء فقط', 'النواة فقط'], answer: 1, why: 'تحتوي البلاستيدات الخضراء على الكلوروفيل وتتم فيها عملية البناء الضوئي.' },
        { q: 'أي عبارة صحيحة عن الميكروبات؟', options: ['كلها ضارة', 'منها نافع ومنها ممرض', 'كلها نباتات', 'كلها ترى بالعين'], answer: 1, why: 'الميكروبات مجموعات متنوعة ولها آثار نافعة أو ضارة.' },
        { q: 'تحدث عملية البناء الضوئي في النبات لإنتاج:', options: ['الغذاء', 'التربة', 'المغناطيس', 'الضوء'], answer: 0, why: 'يستخدم النبات الضوء لصنع الغذاء من الماء وثاني أكسيد الكربون.' },
        { q: 'ينتج الليل والنهار عن دوران:', options: ['القمر حول الأرض', 'الأرض حول محورها', 'الشمس حول الأرض', 'الأرض حول القمر'], answer: 1, why: 'دوران الأرض حول محورها يسبب تعاقب الليل والنهار.' },
        { q: 'يحدث خسوف القمر عندما تقع ______ بين الشمس والقمر.', options: ['الأرض', 'المريخ', 'الزهرة', 'المشتري'], answer: 0, why: 'تقع الأرض بين الشمس والقمر فيمر القمر في ظلها.' },
        { q: 'كتلة جسم 4 كجم. احسب وزنه التقريبي على الأرض إذا كانت شدة مجال الجاذبية 10 نيوتن/كجم.', answerText: 'الوزن = الكتلة × شدة مجال الجاذبية = 4 × 10 = 40 نيوتن.', points: 2 },
        { q: 'اذكر فرقين بين الخلية النباتية والخلية الحيوانية.', answerText: 'للخلية النباتية جدار خلوي وبلاستيدات خضراء عادة، بينما لا توجد هذه التراكيب في الخلية الحيوانية. وكلتاهما تحتويان على غشاء وسيتوبلازم ونواة.', points: 2 },
        { q: 'ما ترتيب الشمس والأرض والقمر عند خسوف القمر؟ ولماذا لا يحدث كل شهر؟', answerText: 'الشمس ثم الأرض ثم القمر؛ لا يحدث كل شهر لأن مدار القمر مائل قليلاً بالنسبة إلى مستوى مدار الأرض، فلا تصطف الأجرام بدقة في كل دورة.', points: 2 },
        { q: 'اكتب إجراءين يقللان انتقال الميكروبات الممرضة.', answerText: 'من أمثلتها غسل اليدين بالماء والصابون، وطهي الطعام جيداً، وتغطية الفم والأنف عند السعال، واستخدام ماء آمن.', points: 2 }
      ]
    }
  ];

  function norm(s) {
    return String(s || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim();
  }

  function isTarget(type) {
    var stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
    var grade = norm(typeof currentGrade === 'undefined' ? '' : currentGrade);
    var subject = norm(typeof currentSubject === 'undefined' ? '' : currentSubject);
    var term = typeof currentTerm === 'undefined' ? 1 : Number(currentTerm);
    return stage === 'prep' && /^ال?اول/.test(grade) && /علوم/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
  }

  function card(title, description, id, icon) {
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'content-item';
    a.setAttribute('role', 'button');
    a.setAttribute('aria-label', title);
    a.addEventListener('click', function (event) {
      event.preventDefault();
      window.openScienceStudyItem(id);
    });
    var iconBox = document.createElement('div');
    iconBox.className = 'content-item-icon';
    iconBox.textContent = icon;
    var info = document.createElement('div');
    info.className = 'content-item-info';
    var heading = document.createElement('div');
    heading.className = 'content-item-title';
    heading.textContent = title;
    var sub = document.createElement('div');
    sub.className = 'content-item-sub';
    sub.textContent = description;
    var arrow = document.createElement('div');
    arrow.className = 'content-item-arrow';
    arrow.textContent = '‹';
    info.appendChild(heading);
    info.appendChild(sub);
    a.appendChild(iconBox);
    a.appendChild(info);
    a.appendChild(arrow);
    return a;
  }

  function text(tag, value, className) {
    var e = document.createElement(tag);
    e.textContent = value;
    if (className) e.className = className;
    return e;
  }

  function noticeBox() {
    var n = document.createElement('div');
    n.setAttribute('dir', 'rtl');
    n.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.8;color:#594300;font-size:13px;';
    n.textContent = 'تنبيه المنهج: ' + NOTICE;
    return n;
  }

  function questionsBox(questions, prefix) {
    var wrap = document.createElement('div');
    questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var questionTitle = text('div', (index + 1) + '. ' + q.q, 'science-question');
      questionTitle.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;';
      block.appendChild(questionTitle);
      if (q.options) {
        var choices = document.createElement('div');
        q.options.forEach(function (choice, choiceIndex) {
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
        var result = text('div', '', 'science-result');
        result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.7;';
        block.appendChild(result);
        block._scienceQuestion = q;
        block._scienceResult = result;
      } else {
        var answer = document.createElement('details');
        answer.style.marginTop = '10px';
        var answerLabel = text('summary', 'عرض إجابة نموذجية');
        var answerText = text('div', q.answerText || '', 'science-model-answer');
        answerText.style.cssText = 'padding:8px 2px;line-height:1.9;';
        answer.appendChild(answerLabel);
        answer.appendChild(answerText);
        block.appendChild(answer);
      }
      wrap.appendChild(block);
    });
    var check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'صحّح أسئلة الاختيار';
    check.style.cssText = 'background:#2E7D32;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    check.addEventListener('click', function () {
      var score = 0;
      var total = 0;
      Array.prototype.forEach.call(wrap.children, function (block) {
        var q = block._scienceQuestion;
        if (!q || !q.options) return;
        total += 1;
        var selected = block.querySelector('input[type="radio"]:checked');
        var correct = !!selected && Number(selected.value) === q.answer;
        if (correct) score += 1;
        var result = block._scienceResult;
        result.style.display = 'block';
        result.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        result.textContent = (correct ? 'إجابة صحيحة. ' : 'راجع الإجابة. ') + q.why;
      });
      var summary = document.getElementById('scienceScore');
      if (summary) summary.textContent = 'نتيجتك في الاختيار من متعدد: ' + score + ' من ' + total;
    });
    wrap.insertBefore(check, wrap.firstChild);
    var score = text('div', '', 'science-score');
    score.id = 'scienceScore';
    score.style.cssText = 'font-weight:700;color:#2E7D32;margin:6px 0 12px;';
    wrap.insertBefore(score, check.nextSibling);
    return wrap;
  }

  function findItem(id) {
    for (var u = 0; u < units.length; u += 1) {
      for (var l = 0; l < units[u].lessons.length; l += 1) {
        if (units[u].lessons[l].id === id) return { kind: 'lesson', unit: units[u], item: units[u].lessons[l] };
      }
      if (units[u].id === id) return { kind: 'exercise', unit: units[u], item: units[u] };
    }
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
      body.appendChild(text('h2', found.unit.title, 'science-unit-title'));
      found.item.explain.forEach(function (paragraph) {
        var p = text('p', paragraph);
        p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;';
        body.appendChild(p);
      });
      var example = document.createElement('div');
      example.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      example.appendChild(text('strong', 'مثال وتطبيق: '));
      example.appendChild(text('span', found.item.example));
      body.appendChild(example);
      var key = document.createElement('div');
      key.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:13px;margin:14px 0;line-height:1.9;';
      key.appendChild(text('strong', 'خلاصة الدرس: '));
      key.appendChild(text('span', found.item.key));
      body.appendChild(key);
      body.appendChild(text('h3', 'اختبر فهمك', 'science-section-title'));
      body.appendChild(questionsBox(found.unit.exercises.slice(0, 3), found.item.id));
    } else {
      body.appendChild(text('p', found.item.note || 'أسئلة تدريبية أصلية للمراجعة. اكتب إجابات الأسئلة المقالية في ورقتك ثم افتح الإجابة النموذجية.', 'science-exam-note'));
      if (found.kind === 'exercise') body.appendChild(text('h3', found.unit.title, 'science-section-title'));
      body.appendChild(questionsBox(found.kind === 'exercise' ? found.item.exercises : found.item.questions, found.item.id));
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
    root.className = 'science-original-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
    if (type === 'lessons') {
      units.forEach(function (unit) {
        root.appendChild(text('h3', unit.title, 'science-unit-heading'));
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
        root.appendChild(card(exam.title, exam.note + ' • اختيار من متعدد وأسئلة قصيرة', exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openScienceStudyItem = openItem;
  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent === 'function' && !originalOpenContent.__scienceContentWrapped) {
    var wrapped = async function (type, termNumber, termName) {
      var result = await originalOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrapped.__scienceContentWrapped = true;
    window.openContent = wrapped;
  }
})();
