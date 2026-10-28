/*
 * محتوى الصف الأول الثانوي العام 2026/2027
 * طبقة محلية فعلية تعمل حتى عند عدم وجود سجلات في Firebase.
 * الشروح والتدريبات أصلية تعليمية، والكتب الرسمية مرتبطة من بوابة الوزارة.
 */
(function () {
  'use strict';

  var BOOKS_URL = 'https://ellibrary.moe.gov.eg/books/Books-sec/';
  var subjects = [
    { id: 'arabic', name: 'اللغة العربية', icon: '📖', color: '#C2185B', terms: [[
      ['مدخل إلى النحو: الكلام والجملة', 'الكلمة اسم أو فعل أو حرف، والجملة تركيب يفيد معنى تامًا. نميز الجملة الاسمية التي تبدأ باسم عن الجملة الفعلية التي تبدأ بفعل، ونحدد الوظيفة الإعرابية من موقع الكلمة والعامل المؤثر فيها. مثال: العلمُ نافعٌ جملة اسمية، ونجحَ الطالبُ جملة فعلية.'],
      ['علامات الاسم والفعل والحرف', 'من علامات الاسم الجر والتنوين ودخول أل والنداء، ومن علامات الفعل قبول تاء التأنيث أو تاء الفاعل أو السين وسوف بحسب نوعه. أما الحرف فلا تظهر له علامات الاسم أو الفعل ويؤدي معنى مع غيره.'],
      ['المبتدأ والخبر', 'المبتدأ اسم مرفوع غالبًا يقع في أول الجملة الاسمية، والخبر هو الجزء الذي يتمم المعنى. قد يكون الخبر مفردًا أو جملة أو شبه جملة، ويجب مطابقة المعنى والضمير عند تحليل الجملة.'],
      ['كان وأخواتها وإن وأخواتها', 'تدخل كان وأخواتها على الجملة الاسمية فترفع المبتدأ ويسمى اسمها وتنصب الخبر ويسمى خبرها. أما إن وأخواتها فتنصب المبتدأ وترفع الخبر. نحدد الناسخ ثم نعرب ما بعده وفق أثره.'],
      ['الفاعل ونائب الفاعل', 'الفاعل اسم مرفوع يدل على من قام بالفعل، ونائب الفاعل يحل محله عند بناء الفعل للمجهول. نبحث عن الفعل أولًا ثم نسأل: من الذي قام بالفعل؟ وننتبه إلى ضبط آخر الكلمة.']
    ], [
      ['المفعول به', 'المفعول به اسم منصوب يقع عليه فعل الفاعل. في جملة قرأ الطالبُ الكتابَ نسأل: ماذا قرأ الطالب؟ فنجد الكتابَ مفعولًا به، ونضبطه بالفتحة أو علامة النصب المناسبة.'],
      ['الحال', 'الحال وصف نكرة منصوب يبين هيئة صاحبه وقت وقوع الفعل، مثل عاد المسافرُ مسرورًا. نختبره بالسؤال: كيف حدث الفعل؟ وقد يأتي مفردًا أو جملة أو شبه جملة.'],
      ['التمييز', 'التمييز اسم نكرة يوضح إبهامًا في اسم أو نسبة، مثل اشتريتُ لترًا لبنًا وازداد الطالبُ علمًا. نفرق بينه وبين الحال بالسؤال عن الشيء المبهم أو الهيئة.'],
      ['الاستثناء', 'يتكون أسلوب الاستثناء من مستثنى منه وأداة استثناء ومستثنى. في الاستثناء التام المثبت بإلا يكون المستثنى منصوبًا، وتختلف الأحكام باختلاف نوع الجملة واتصالها بالنفي.'],
      ['أسلوب الشرط', 'يتكون الشرط من أداة وفعل شرط وجواب شرط. الأدوات الجازمة تربط بين فعلين، ونفهم العلاقة بين السبب والنتيجة قبل ضبط الفعلين أو تحديد علامة الجزم.']
    ]], video: 'شرح النحو والقراءة والبلاغة للصف الأول الثانوي' },
    { id: 'english', name: 'اللغة الأجنبية الأولى', icon: '🇬🇧', color: '#303F9F', terms: [[
      ['Personal identity and introductions', 'This lesson develops language for introducing yourself, asking about names, age, school and interests. Use the present simple for facts: I study at a secondary school. Practise short questions and complete answers.'],
      ['Daily routines and the present simple', 'The present simple describes habits and repeated actions. Add s or es with he, she and it, and use do or does in questions and negatives. Time expressions such as usually and every day help make meaning clear.'],
      ['The present continuous', 'Use the present continuous for an action happening now or around the present: She is reading now. Form it with am, is or are plus the -ing form, and avoid using it for permanent facts.'],
      ['Past events and sequencing', 'The past simple describes completed events. Regular verbs take -ed, while irregular verbs must be learned from context. Link events with first, then, after that and finally to write a clear paragraph.'],
      ['Reading for main ideas and details', 'Before reading, predict from the title. During reading, identify the topic sentence and supporting details. Do not translate every word; use nearby clues and the dictionary only when necessary.']
    ], [
      ['Future plans and predictions', 'Use be going to for plans and evidence-based predictions, and will for quick decisions or predictions. Context decides the best form: I am going to revise tonight; I think it will be useful.'],
      ['Modals for advice and obligation', 'Should gives advice, must expresses strong obligation, and have to describes an external rule. A negative changes the meaning, so distinguish mustn’t from don’t have to.'],
      ['Comparatives and superlatives', 'Use comparative adjectives to compare two things and superlatives for a group. Short adjectives often take -er and -est, while longer adjectives use more and most. Check irregular forms such as better and best.'],
      ['Writing an email and a paragraph', 'A good email has a clear greeting, purpose, organised details and an appropriate closing. A paragraph needs a topic sentence, supporting ideas and a final sentence connected with linking words.'],
      ['Vocabulary through context', 'Guess a new word by checking its part of speech, nearby examples, contrast words and the general topic. Then confirm the meaning and use the word in a new sentence.']
    ]], video: 'English first secondary grammar and reading' },
    { id: 'math', name: 'رياضيات', icon: '🔢', color: '#1976D2', terms: [[
      ['المجموعات والعمليات عليها', 'المجموعة تجمع محدد من العناصر. نستخدم الانتماء والاحتواء والاتحاد والتقاطع والفرق لتمثيل العلاقات، ويفيد مخطط فن في توضيح العناصر المشتركة والمختلفة.'],
      ['الأعداد الحقيقية والفترات', 'تشمل الأعداد الحقيقية النسبية وغير النسبية. نمثل الفترات على خط الأعداد، وننتبه إلى القوس المفتوح أو المغلق لأنه يوضح هل الطرف داخل الفترة أم خارجها.'],
      ['المعادلات والمتباينات', 'نحل المعادلة بإجراء عمليات متكافئة على الطرفين، أما عند ضرب أو قسمة المتباينة في عدد سالب فنعكس اتجاهها. نتحقق بالتعويض في الحل.'],
      ['الهندسة التحليلية والميل', 'الميل يساوي التغير الرأسي على التغير الأفقي. نستخدمه لمعرفة التوازي والتعامد وكتابة معادلة المستقيم من نقطة وميل أو من نقطتين.'],
      ['الإحصاء والتمثيل البياني', 'المتوسط والوسيط والمنوال مقاييس للنزعة المركزية، والمدى يقيس الانتشار البسيط. نختار الرسم المناسب ونقرأ البيانات قبل إصدار أي استنتاج.']
    ], [
      ['حساب المثلثات في المثلث القائم', 'نربط الزاوية الحادة بنسب الجيب وجيب التمام والظل. نحدد الضلع المقابل والمجاور والوتر قبل اختيار النسبة، ثم نتحقق من معقولية الناتج.'],
      ['المتتابعات الحسابية والهندسية', 'في المتتابعة الحسابية فرق ثابت، وفي الهندسية نسبة ثابتة. نستخدم الحد العام لحساب أي حد دون كتابة الحدود كلها، ونتأكد من نوع المتتابعة من أمثلة متتالية.'],
      ['الهندسة المستوية والتشابه', 'تتشابه الأشكال إذا تساوت الزوايا المتناظرة وتناسبت الأضلاع المناظرة. نرتب التناظر قبل كتابة التناسب ونستخدمه لإيجاد طول مجهول.'],
      ['المتجهات في المستوى', 'المتجه كمية لها مقدار واتجاه، ويمثل بمركبتين. جمع المتجهات يتم بجمع المركبات، ويمكن استخدام المقياس أو الرسم للتحقق من الاتجاه.'],
      ['الاحتمال', 'احتمال حدث يساوي عدد النواتج المواتية على عدد النواتج الممكنة عندما تكون متساوية الإمكان. يقع بين صفر وواحد، واحتمال المتمم يساوي واحدًا ناقص احتمال الحدث.']
    ]], video: 'رياضيات الصف الأول الثانوي شرح وتدريبات' },
    { id: 'history', name: 'التاريخ', icon: '📜', color: '#6D4C41', terms: [[
      ['الحضارة ومصادر دراسة التاريخ', 'الحضارة نتاج تفاعل الإنسان مع البيئة والمجتمع، وتشمل نظم الحكم والاقتصاد والعلم والفن. يعتمد المؤرخ على آثار مادية ووثائق مكتوبة وروايات مع نقد المصدر ومقارنة الأدلة.'],
      ['حضارات الشرق القديم', 'نشأت حضارات كبرى حول الأنهار مثل وادي النيل وبلاد الرافدين، إذ وفرت المياه والزراعة والاستقرار. اختلفت نظمها لكنها اشتركت في الكتابة والإدارة والتخصص والعمل الجماعي.'],
      ['مصر القديمة: الدولة والمجتمع', 'تطور الحكم في مصر القديمة مع الإدارة المركزية وتقسيم الوظائف. كان المجتمع متعدد الطبقات، وأسهم الفلاحون والحرفيون والكتبة والجنود في استمرار الدولة.'],
      ['مصر القديمة: العلم والفن', 'ارتبط العلم بالحاجة إلى الحساب والطب والفلك والهندسة، وعبّر الفن عن معتقدات المجتمع ونظامه. لا نقرأ الأثر منفصلًا عن وظيفته وسياقه التاريخي.'],
      ['التجارة والعلاقات بين الشعوب', 'ساعدت الأنهار والطرق والموانئ على تبادل السلع والأفكار. وقد تكون العلاقات سلمية أو تنافسية، لذلك نحلل دوافع الاتصال ونتائجه على كل طرف.']
    ], [
      ['الحضارة اليونانية', 'أسهمت المدن اليونانية في الفلسفة والفن والسياسة والعلوم، مع اختلاف نظم الحكم بين المدن. نميز بين الإنجاز الحضاري وسياقه الاجتماعي والسياسي.'],
      ['الحضارة الرومانية', 'بنت روما نظامًا إداريًا وقانونيًا وطرقًا واسعة، واتسعت إمبراطوريتها عبر مراحل. ندرس عوامل القوة ثم المشكلات الداخلية والاقتصادية التي أثرت في تراجعها.'],
      ['مصر في العصرين اليوناني والروماني', 'أصبحت مصر حلقة مهمة في الاقتصاد والثقافة المتوسطية، واحتفظت بتقاليد محلية مع تأثيرات جديدة. نستخدم الآثار والبرديات لفهم الحياة اليومية والإدارة.'],
      ['المسيحية في مصر', 'انتشرت المسيحية في مصر وظهرت مراكز دينية وثقافية مهمة. يدرس الطالب الحدث تاريخيًا باحترام للتنوع، مع التمييز بين الرواية الدينية والمعلومة التاريخية ومصدر كل منهما.'],
      ['مهارات قراءة الخريطة والخط الزمني', 'الخريطة تجيب عن أين، والخط الزمني يساعد في ترتيب متى. نقرأ العنوان والمفتاح والمقياس، ونضع الأحداث في تسلسل يوضح السبب والنتيجة.']
    ]], video: 'تاريخ الصف الأول الثانوي شرح المنهج' },
    { id: 'integrated-science', name: 'العلوم المتكاملة', icon: '🔬', color: '#388E3C', terms: [[
      ['النظام الأرضي وتدفق الطاقة', 'الأرض نظام مترابط تتفاعل فيه الغلافات الجوية والمائية والصخرية والحيوية. تنتقل الطاقة من الشمس إلى الأنظمة المختلفة، وتؤثر التغيرات في جزء على أجزاء أخرى.'],
      ['المادة وخواصها وتغيراتها', 'للمادة كتلة وتشغل حيزًا، وتختلف الخواص الفيزيائية عن الكيميائية. التغير الفيزيائي لا ينتج مادة جديدة، بينما التغير الكيميائي يعيد ترتيب الذرات وينتج مواد بخصائص جديدة.'],
      ['الطاقة وتحولاتها', 'لا تفنى الطاقة ولا تستحدث من عدم، لكنها تتحول بين صور مثل الحرارية والحركية والكهربائية. نحلل النظام ونحدد المدخلات والمخرجات وفقد الطاقة إلى البيئة.'],
      ['الماء والهواء والموارد', 'تدور المياه في دورة مستمرة، وتؤثر جودة الهواء والماء في صحة الإنسان والكائنات. تساعد المعالجة والترشيد وإعادة الاستخدام في حماية الموارد المحدودة.'],
      ['القياس والتجربة العلمية', 'تبدأ التجربة بسؤال وفرضية، ثم نحدد المتغير المستقل والتابع والثوابت، ونسجل البيانات بوحدات مناسبة. تكرار القياس ومناقشة مصادر الخطأ يزيدان الثقة في النتيجة.']
    ], [
      ['الأنظمة البيئية وتدفق المادة', 'يتكون النظام البيئي من كائنات حية وعوامل غير حية. تنتقل الطاقة عبر السلاسل الغذائية، بينما تدور العناصر مثل الكربون والماء بين الكائنات والبيئة.'],
      ['التنوع الحيوي والتوازن', 'التنوع الحيوي يزيد قدرة النظام على مواجهة التغيرات. يؤدي فقد موطن أو إدخال نوع غريب أو التلوث إلى اختلالات قد تمتد عبر شبكة الغذاء.'],
      ['المناخ والتغيرات العالمية', 'الطقس حالة قصيرة المدى، أما المناخ فمتوسط أنماط طويلة المدى. تؤثر الغازات الدفيئة والأنشطة البشرية في توازن الطاقة، ويحتاج تفسيرها إلى بيانات لا إلى الانطباع.'],
      ['التكنولوجيا وحل المشكلات البيئية', 'تساعد الطاقة المتجددة والاستشعار وإعادة التدوير في تقليل الأثر البيئي، لكنها ليست حلولًا منفردة. نقارن الفائدة والتكلفة والسلامة ودورة حياة المنتج.'],
      ['مشروع بحث علمي متكامل', 'يختار الطالب مشكلة قابلة للقياس، يجمع مصادر موثوقة، يقترح طريقة اختبار، يعرض البيانات، ثم يناقش حدود النتيجة. العمل الجماعي يحتاج توزيع أدوار وتوثيقًا واضحًا.']
    ]], video: 'العلوم المتكاملة الصف الأول الثانوي شرح' },
    { id: 'philosophy', name: 'الفلسفة والمنطق', icon: '💭', color: '#8E24AA', terms: [[
      ['التفكير الفلسفي والسؤال', 'الفلسفة تدريب على التساؤل المنظم والبحث عن الأسباب والمعاني، وليست حفظ آراء بلا فهم. يبدأ التفكير بسؤال واضح ثم فحص الافتراضات والأدلة والنتائج.'],
      ['مشكلة التفكير وعوائقه', 'قد تعوق التفكيرَ التحيزات والتسرع والخلط بين الرأي والحقيقة. نكشف العائق حين نطلب تعريفًا ومثالًا ودليلًا ونبحث عن تفسير بديل.'],
      ['المفهوم والقضية', 'المفهوم فكرة عامة نستخدمها في التفكير، والقضية جملة يمكن الحكم عليها بالصدق أو الكذب. دقة الألفاظ تمنع الخلافات الناتجة عن معنى غير محدد.'],
      ['الاستدلال والحجة', 'الحجة مجموعة مقدمات تدعم نتيجة. نقيمها بالسؤال عن صحة المقدمات وقوة الصلة بالنتيجة، ونميز بين الدليل والادعاء والتأثير العاطفي.'],
      ['القيم والحوار', 'القيم توجه الاختيار والسلوك، والحوار المنظم يتيح فهم الموقف المختلف دون إلغاء صاحبه. احترام الشخص لا يعني قبول كل حجة دون نقد.']
    ], [
      ['العلم والتفكير النقدي', 'يستخدم العلم ملاحظة وفرضية واختبارًا قابلًا للتكرار، بينما يحتاج التفكير النقدي إلى فحص مصدر المعلومة وحدود الدليل. لا تكفي الشهرة لإثبات صحة الادعاء.'],
      ['الاستقراء والاستنباط', 'الاستقراء ينتقل من أمثلة إلى تعميم محتمل، والاستنباط يطبق قاعدة على حالة للوصول إلى نتيجة تلزم إذا صحت المقدمات. معرفة الفرق تساعد في تقييم البراهين.'],
      ['الأخلاق والمسؤولية', 'الحكم الأخلاقي يراعي النية والفعل والنتائج وحقوق الآخرين. المسؤولية تعني أن يراجع الفرد أثر قراره ولا يختبئ خلف الجماعة أو الجهل المتعمد.'],
      ['المواطنة والاختلاف', 'المواطنة مشاركة واحترام للقانون والحقوق والواجبات. إدارة الاختلاف تحتاج معلومات وحوارًا وقبولًا بالتعدد دون تنمر أو إقصاء.'],
      ['الإعلام الرقمي واتخاذ القرار', 'قبل مشاركة خبر نتحقق من المصدر والتاريخ والعنوان والسياق ونبحث عن تأكيد مستقل. التفكير النقدي الرقمي يحمي الفرد من التضليل والاندفاع.']
    ]], video: 'فلسفة ومنطق الصف الأول الثانوي شرح' },
    { id: 'programming', name: 'البرمجة والذكاء الاصطناعي', icon: '💻', color: '#455A64', terms: [[
      ['المعلومات والوسائط الرقمية', 'المعلومة بيانات عولجت فأصبح لها معنى. نميز بين النص والصورة والصوت والفيديو، ونختار الوسيط وفق هدف التواصل وحجم الملف وحقوق الاستخدام.'],
      ['التفكير الحاسوبي والخوارزميات', 'نحل المشكلة بالتجزئة واكتشاف الأنماط والتجريد ثم تصميم خوارزمية. الخوارزمية خطوات مرتبة لها مدخلات ومخرجات ويمكن اختبارها بحالات مختلفة.'],
      ['أساسيات Python والمتغيرات', 'المتغير اسم يشير إلى قيمة، ويمكن أن تكون القيمة رقمًا أو نصًا أو قيمة منطقية. نستخدم print للإخراج وننتبه إلى نوع البيانات والتحويل بين الأنواع.'],
      ['الشروط والتكرار', 'تستخدم if لاتخاذ قرار، وتكرر for أو while خطوات وفق قاعدة. يجب تحديد حالة التوقف حتى لا تتكون حلقة لا نهائية، واختبار المسارات المختلفة.'],
      ['مقدمة في الذكاء الاصطناعي', 'يتعلم النظام من بيانات أو قواعد لينفذ مهمة، لكن النتيجة ليست حقيقة مطلقة. جودة البيانات والتحيز والاختبار والخصوصية عناصر أساسية عند تقييم أي نموذج.']
    ], [
      ['القوائم والدوال', 'القائمة تجمع عناصر مرتبة، والدالة كتلة قابلة لإعادة الاستخدام تستقبل معاملات وقد تعيد نتيجة. تقسيم البرنامج إلى دوال يسهل القراءة والاختبار والصيانة.'],
      ['البيانات وتمثيلها', 'نختار نوع البيانات وطريقة تمثيلها بحسب السؤال. الجداول والرسوم تساعد على اكتشاف الأنماط، لكن الرسم قد يضلل إذا بدأ المحور من قيمة غير مناسبة أو حُذفت بيانات مهمة.'],
      ['التعلم الآلي والتدريب', 'يتعلم النموذج نمطًا من بيانات تدريب ويُختبر على أمثلة جديدة. الإفراط في التوافق يحدث عندما يحفظ النموذج التدريب ولا يعمم، لذلك نحتاج بيانات تحقق وتقييمًا مناسبًا.'],
      ['الأمن السيبراني والخصوصية', 'نحمي الحسابات بكلمات مرور قوية ومصادقة متعددة ولا نشارك رموز التحقق. نتحقق من الروابط ونقلل البيانات الشخصية ونبلغ عن التنمر أو الابتزاز الرقمي.'],
      ['مشروع برمجي مسؤول', 'يحدد المشروع مشكلة مستخدم حقيقية، ثم يصمم واجهة وخوارزمية ويختبرها مع حالات صحيحة وخاطئة. يوثق الطالب المصادر ويذكر حدود الأداة ولا يجمع بيانات بلا ضرورة.']
    ]],
    video: 'البرمجة والذكاء الاصطناعي الصف الأول الثانوي شرح' }
  ];

  var localItems = [];
  var itemIndex = Object.create(null);
  var officialSubjects = subjects.map(function (s) { return { id: s.id, name: s.name, icon: s.icon, color: s.color }; });
  var booksNote = 'المحتوى التعليمي أصلي للمراجعة ومنظم وفق مواد الصف الأول الثانوي العام. راجع كتاب الوزارة وآخر تعليمات المدرسة قبل الامتحان.';

  function add(item) { item.id = 'g1sec-' + localItems.length; localItems.push(item); itemIndex[item.id] = item; }
  function makeItems(subject, term, topics, videoLabel) {
    topics.forEach(function (topic, i) {
      add({ stage: 'sec', grade: 'الأول', subject: subject.name, term: term, type: 'lessons', order: i + 1,
        title: (term === 1 ? 'الترم الأول' : 'الترم الثاني') + ' — شرح ' + (i + 1) + ': ' + topic[0],
        content: topic[1] + '\n\nأهداف الدرس:\n• أفهم الفكرة الأساسية وأربطها بمثال.\n• أطبق الخطوات على سؤال جديد.\n• أراجع المصطلحات وأتحقق من الإجابة.\n\nتدريب تمهيدي: اكتب تعريفًا مختصرًا للمفهوم، ثم اذكر مثالًا من حياتك أو من الكتاب.\n\nملاحظة: هذا شرح مراجعة أصلي، والمرجع الأساسي هو كتاب الوزارة.',
        question: 'ما الفكرة الأساسية في درس «' + topic[0] + '»؟ اشرحها في سطرين واذكر تطبيقًا.',
        answer: topic[1].split('. ')[0] + '. مثال تطبيقي: أستخدم الفكرة في حل سؤال جديد بعد تحديد المعطيات والخطوات.' });
      add({ stage: 'sec', grade: 'الأول', subject: subject.name, term: term, type: 'exercises', order: i + 1,
        title: 'تدريبات ' + (i + 1) + ': ' + topic[0],
        content: 'تدريب 1: عرّف المصطلح أو القاعدة الواردة في الدرس.\nتدريب 2: طبّقها على مثال من إنشائك.\nتدريب 3: اذكر خطأ شائعًا في هذا الموضوع وكيف تتجنبه.\nتدريب 4: قارن بين حالتين مرتبطتين بالدرس.',
        question: 'اذكر خطوتين صحيحتين لحل سؤال على موضوع «' + topic[0] + '».',
        answer: 'أحدد المطلوب والمعطيات أولًا، ثم أطبق القاعدة المناسبة وأراجع الناتج بالتعويض أو المقارنة.' });
    });
    add({ stage: 'sec', grade: 'الأول', subject: subject.name, term: term, type: 'exams', order: 1,
      title: 'امتحان قصير — ' + (term === 1 ? 'الترم الأول' : 'الترم الثاني'),
      content: 'نموذج امتحان تدريبي منظم على موضوعات الترم. أجب دون الرجوع إلى الشرح ثم راجع نموذج الإجابة.\n\nالسؤال الأول: اختر الإجابة الأدق للمفهوم الأساسي.\nالسؤال الثاني: علل أو فسّر نتيجة مرتبطة بالموضوع.\nالسؤال الثالث: طبّق القاعدة في مثال جديد.\nالسؤال الرابع: سؤال مقالي قصير يقيس الفهم والربط.',
      question: 'كيف تراجع إجابتك في هذا الامتحان؟', answer: 'أراجع فهم المطلوب، وأطابق خطوات الحل مع القاعدة، وأتأكد من الوحدات أو الصياغة ثم أصلح الخطأ مع معرفة سببه.' });
    add({ stage: 'sec', grade: 'الأول', subject: subject.name, term: term, type: 'exams', order: 2,
      title: 'امتحان شامل — ' + (term === 1 ? 'الترم الأول' : 'الترم الثاني'),
      content: 'امتحان شامل للمراجعة النهائية: أسئلة اختيار من متعدد، وأسئلة تطبيق، وسؤال يطلب تفسيرًا أو مقارنة. وزّع وقتك، واترك دقائق للمراجعة النهائية.',
      question: 'اكتب خطة زمنية مختصرة للإجابة عن امتحان شامل.', answer: 'أقرأ الورقة أولًا، أبدأ بالأسئلة الواضحة، أترك وقتًا للتطبيق والمقالي، ثم أراجع كل الإجابات قبل التسليم.' });
    for (var v = 1; v <= 3; v++) add({ stage: 'sec', grade: 'الأول', subject: subject.name, term: term, type: 'videos', order: v,
      title: 'فيديو شرح ' + v + ' — ' + videoLabel, content: 'مصدر فيديو مقترح للشرح والمراجعة. افتح الرابط في نافذة جديدة وتأكد من مطابقة الدرس لطبعة كتابك.', video_url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(videoLabel + ' الترم ' + (term === 1 ? 'الأول' : 'الثاني') + ' 2026 2027') });
  }
  subjects.forEach(function (s) { makeItems(s, 1, s.terms[0], s.video); makeItems(s, 2, s.terms[1], s.video); });

  function isTarget() { return String(window.currentStage || '') === 'sec' && String(window.currentGrade || '') === 'الأول'; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function openExternal(url) { window.open(url, '_blank', 'noopener,noreferrer'); }
  function renderSubjectCards() {
    var list = document.getElementById('subjectsList');
    if (!list) return;
    list.innerHTML = officialSubjects.map(function (s) { return '<div class="subject-card" onclick="openSubject(\'' + s.id + '\',\'' + s.name + '\')"><div class="subject-icon" style="background:' + s.color + '20;color:' + s.color + ';">' + s.icon + '</div><div class="subject-name">' + s.name + '</div><div style="font-size:11px;color:#607D8B;margin-top:5px;">ترمان • شرح وتدريب وامتحان</div></div>'; }).join('');
  }
  var oldOpenGrade = window.openGrade;
  window.openGrade = function (id, name) { if (id === 'sec' && name === 'الأول') { window.currentStage = id; window.currentGrade = name; document.getElementById('subjectsTitle').textContent = 'الصف الأول الثانوي العام'; renderSubjectCards(); if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); window.showScreen('subjectsScreen'); return; } return oldOpenGrade.apply(this, arguments); };

  function selected(subject, term, type) { return localItems.filter(function (x) { return x.subject === subject && Number(x.term) === Number(term) && x.type === type; }); }
  var oldOpenSubject = window.openSubject;
  window.openSubject = function (id, name) { if (isTarget()) { window.currentSubject = name; document.getElementById('termsTitle').textContent = name; document.getElementById('termsHeader').textContent = name + ' - الصف الأول الثانوي العام'; window.renderTerms(); if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); window.showScreen('termsScreen'); return; } return oldOpenSubject.apply(this, arguments); };
  var oldRenderTerms = window.renderTerms;
  window.renderTerms = function () { if (!isTarget()) return oldRenderTerms.apply(this, arguments); var list = document.getElementById('termsList'); list.innerHTML = [1, 2].map(function (term) { var total = selected(window.currentSubject, term, 'lessons').length; return '<div class="term-card ' + (term === 2 ? 'term-2' : '') + '"><div class="term-header"><div class="term-icon">' + (term === 1 ? '📘' : '📙') + '</div><div class="term-title">الترم ' + (term === 1 ? 'الأول' : 'الثاني') + '</div><div class="term-count">' + total + ' دروس فعلية</div></div><div class="term-sections"><div class="section-chip" onclick="openContent(\'lessons\',' + term + ',\'الترم\')">📄 الدروس (' + total + ')</div><div class="section-chip" onclick="openContent(\'exercises\',' + term + ',\'الترم\')">✏️ تدريبات (' + total + ')</div><div class="section-chip" onclick="openContent(\'exams\',' + term + ',\'الترم\')">📝 امتحانات (2)</div><div class="section-chip" onclick="openContent(\'videos\',' + term + ',\'الترم\')">🎥 فيديوهات (3)</div></div></div>'; }).join('') + '<div style="margin:12px 0;padding:12px;background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;line-height:1.8;font-size:13px;">' + booksNote + '<br><a href="' + BOOKS_URL + '" target="_blank" rel="noopener">📚 فتح كتب وزارة التربية والتعليم</a></div>'; };

  var oldOpenContent = window.openContent;
  window.openContent = async function (type, term, name) { if (!isTarget()) return oldOpenContent.apply(this, arguments); var title = ({ lessons: '📄 الدروس', exercises: '✏️ تدريبات', exams: '📝 امتحانات', videos: '🎥 فيديوهات' })[type] || 'المحتوى'; document.getElementById('contentTitle').textContent = title; document.getElementById('contentHeaderTitle').textContent = window.currentSubject + ' - الترم ' + (term === 1 ? 'الأول' : 'الثاني'); document.getElementById('contentHeaderSub').textContent = title; if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); window.showScreen('contentScreen'); var list = document.getElementById('contentList'); var items = selected(window.currentSubject, term, type); list.innerHTML = items.map(function (it) { var isVideo = type === 'videos'; return '<div class="content-item" role="button" tabindex="0" onclick="viewContent(\'' + it.id + '\')"><div class="content-item-icon">' + (isVideo ? '🎥' : type === 'exercises' ? '✏️' : type === 'exams' ? '📝' : '📄') + '</div><div class="content-item-info"><div class="content-item-title">' + esc(it.title) + '</div><div class="content-item-sub">' + esc(String(it.content).slice(0, 95)) + '…</div></div><div class="content-item-arrow">‹</div></div>'; }).join(''); };

  var oldViewContent = window.viewContent;
  window.viewContent = async function (id) { var it = itemIndex[id]; if (!it) return oldViewContent.apply(this, arguments); document.getElementById('viewerTitle').textContent = it.title; var h = '<article class="lesson-body" dir="rtl"><h2 style="color:#2E7D32;margin-bottom:16px;">' + esc(it.title) + '</h2><div style="line-height:2;font-size:15px;white-space:pre-wrap;">' + esc(it.content) + '</div>'; if (it.question) h += '<div style="margin-top:20px;background:#E8F5E9;border-radius:14px;padding:16px;"><div style="font-weight:bold;color:#2E7D32;margin-bottom:8px;">📝 سؤال للتقييم:</div><div style="line-height:1.8;white-space:pre-wrap;">' + esc(it.question) + '</div><button onclick="toggleAnswer(this)" style="background:#2E7D32;color:#fff;border:0;padding:10px 20px;border-radius:10px;font-family:inherit;font-weight:bold;margin-top:12px;cursor:pointer;">👁️ إظهار الإجابة</button><div class="answer-box"><div style="font-weight:bold;color:#2E7D32;margin-bottom:6px;">✅ الإجابة النموذجية:</div><div style="line-height:1.8;white-space:pre-wrap;">' + esc(it.answer || '') + '</div></div></div>'; if (it.video_url) h += '<button onclick="window.open(\'' + it.video_url + '\',\'_blank\')" style="margin-top:16px;background:#D32F2F;color:#fff;border:0;padding:12px 18px;border-radius:10px;font-family:inherit;font-weight:bold;cursor:pointer;">▶️ فتح فيديوهات الشرح</button>'; h += '<div style="margin-top:18px;padding:10px;background:#F5F5F5;border-radius:10px;font-size:12px;color:#607D8B;">المحتوى للمراجعة التعليمية. المرجع النهائي: كتاب الوزارة والمعلم.</div></article>'; document.getElementById('viewerBody').innerHTML = h; if (Array.isArray(window.screenHistory)) window.screenHistory.push(window.currentScreen); window.showScreen('viewerScreen'); };

  window.SECONDARY_GRADE1_CONTENT = { count: localItems.length, subjects: officialSubjects.map(function (s) { return s.name; }) };
  console.info('Loaded Grade 1 Secondary General content:', localItems.length, 'items');
})();
