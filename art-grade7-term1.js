// Original, skill-oriented Art Education review for Grade 7 (first preparatory), Term 1.
// This is not a verified Ministry syllabus or a confirmed 2026/2027 unit index.
(function () {
  'use strict';

  var NOTICE = 'مراجعة مهارية استرشادية وليست فهرساً وزارياً مؤكداً للعام 2026/2027. لم يتوفر كتاب طالب أو خطة وزارة مفتوحة تثبت فهرس التربية الفنية لهذا العام؛ لذلك لا تُعرض الموضوعات هنا بوصفها دروساً وزارية مقررة. صيغ المحتوى حول مجالات عامة للمادة: المعرفة والتذوق والإنتاج والتصميم. الفن المصري القديم يرد مثالاً بصرياً فقط، لا ادعاءً بأنه درس مقرر. مرجع الوزارة للمجال العام: https://moe.gov.eg/media/cwglpruk/art_education.pdf . أما صفحة مواصفات الامتحان ومرفق التربية الفنية فهما أقدم ولا يثبتان مقرر 2026/2027: https://moe.gov.eg/ar/examination-paper-for-general-education-middle-school/ وhttps://elearnningcontent.blob.core.windows.net/exampaperspecs/229.pdf .';

  var units = [
    {
      id: 'art-g7t1-unit-elements',
      title: 'المحور الاسترشادي الأول: ملاحظة العناصر البصرية',
      lessons: [
        {
          id: 'art-g7t1-lesson-line-shape',
          title: '1. الخط والشكل: بناء صورة بسيطة',
          explain: [
            'الخط أثر بصري يمكن أن يكون مستقيماً أو منحنياً أو متقطعاً أو متعرجاً. يوجه الخط عين المشاهد، ويصف الحافة أو يوحي بالحركة والهدوء بحسب مساره وتكراره.',
            'الشكل مساحة تحدها خطوط أو حواف؛ وقد يكون هندسياً منتظماً مثل الدائرة والمربع، أو حراً مستلهماً من الطبيعة. يساعد اختلاف الأشكال وأحجامها على إبراز المهم داخل الصورة.',
            'لتحليل صورة، لاحظ أولاً الخطوط والأشكال الظاهرة، ثم اسأل: أيها يجذب العين؟ وكيف تتعاون لتكوين معنى؟ لا يلزم أن تكون الصورة معقدة كي تحمل فكرة واضحة.',
            'تطبيق فني آمن وقليل التكلفة: على ورقة مستعملة من جهة واحدة، ارسم بخطوط قليلة مشهداً من حديقة أو ساحة، ثم كوّن شجرة أو بيتاً من أشكال هندسية وحرة. استخدم قلم رصاص أو قلم تلوين، ولا حاجة إلى أدوات حادة أو مواد خاصة.'
          ],
          example: 'قد توحي الخطوط المنحنية في غصن بالليونة، بينما تجعل الخطوط المتوازية المتكررة في نافذة الإحساس بالنظام أو السكون أوضح.',
          key: 'الخط يصف المسار والحافة وقد يوحي بالحركة؛ الشكل مساحة محددة؛ وضوح الفكرة يعتمد على اختيار العناصر وتنظيمها.',
          questions: [
            { q: 'أي اختيار يصف شكلاً هندسياً منتظماً؟', options: ['دائرة مرسومة بوضوح', 'أثر ماء عشوائي', 'ظل غيمة متغير', 'بقعة غير محددة'], answer: 0, why: 'الدائرة شكل هندسي محدد الحافة، بخلاف الأثر أو الظل غير المنتظم.' },
            { q: 'أي نوع من الخطوط قد يساعد على الإيحاء بحركة متموجة؟', options: ['خطوط منحنية متتابعة', 'خط واحد قصير ساكن فقط', 'مساحة خالية بلا خطوط', 'إطار مربع بلا أي تفاصيل'], answer: 0, why: 'تتابع الانحناءات قد يوحي بمسار متموج أو حركة، بحسب تنظيم الصورة.' },
            { q: 'ما أفضل بداية لملاحظة صورة فنية؟', options: ['وصف الخطوط والأشكال التي أراها', 'افتراض قصة لا تدعمها الصورة', 'الحكم بأنها جميلة أو قبيحة فقط', 'تجاهل ترتيب عناصرها'], answer: 0, why: 'وصف ما نراه أولاً يساعد على بناء تفسير يستند إلى شواهد بصرية.' }
          ]
        },
        {
          id: 'art-g7t1-lesson-color',
          title: '2. اللون والعلاقات اللونية',
          explain: [
            'اللون عنصر بصري يلفت الانتباه ويساعد على التعبير. يمكن وصفه باسمه، وملاحظة كونه فاتحاً أو داكناً، ومقارنته بالألوان المجاورة له.',
            'الألوان الدافئة مثل الأحمر والبرتقالي والأصفر قد تبدو نشيطة أو قريبة في بعض التكوينات، والباردة مثل الأزرق والأخضر قد توحي بالهدوء أو البعد. هذه انطباعات محتملة وليست قواعد ثابتة؛ فالسياق والثقافة وطريقة الاستخدام تؤثر في القراءة.',
            'يظهر التباين عندما تختلف العناصر بوضوح، مثل لون داكن بجوار مساحة فاتحة. أما اختيار مجموعة قليلة من الألوان المتوافقة فيساعد على ترابط العمل وعدم تشتيت المشاهد.',
            'تطبيق فني آمن: قسّم ورقة إلى ثلاث خانات، وجرّب في كل خانة ترتيباً مختلفاً من لونين أو ثلاثة باستخدام ألوان خشبية أو أقلام تلوين متاحة. اكتب كلمة قصيرة تصف إحساسك بكل ترتيب، وقارن الانطباعات دون اعتبارها إجابات وحيدة.'
          ],
          example: 'إذا أردنا إبراز شكل صغير، فقد نضعه بلون واضح فوق مساحة أهدأ أو أفتح، ثم نتحقق من أن بقية الألوان لا تزاحم موضع الاهتمام.',
          key: 'لاحظ اسم اللون وقيمته الفاتحة أو الداكنة وعلاقته بجواره؛ التباين يبرز، ومحدودية الألوان قد توحّد التكوين.',
          questions: [
            { q: 'ماذا نقصد بالتباين اللوني في صورة؟', options: ['اختلاف واضح بين لونين أو قيمتين', 'استخدام لون واحد بدرجة متطابقة فقط', 'حذف جميع المساحات الفاتحة', 'تكرار الشكل دون أي اختلاف'], answer: 0, why: 'التباين ينتج من اختلاف بصري ملحوظ، كالمجاورة بين لون فاتح وآخر داكن.' },
            { q: 'ما فائدة تجربة أكثر من ترتيب للألوان؟', options: ['مقارنة الانطباع واختيار الأنسب للفكرة', 'إثبات أن لكل لون معنى واحداً ثابتاً', 'منع ملاحظة العناصر الأخرى', 'جعل كل الأعمال متطابقة'], answer: 0, why: 'التجريب والمقارنة يساعدان على اختيار علاقة لونية ملائمة، مع بقاء الانطباع متأثراً بالسياق.' },
            { q: 'أي وصف أدق لعلاقة الألوان الدافئة والباردة؟', options: ['انطباعات شائعة تتأثر بالسياق وليست قانوناً ثابتاً', 'معانٍ إجبارية لا تتغير بين المشاهدين', 'ألوان لا يمكن جمعها في عمل واحد', 'تقسيم يحدد جودة العمل وحده'], answer: 0, why: 'قد ترتبط الألوان بانطباعات شائعة، لكنها ليست قاعدة قطعية مستقلة عن السياق.' }
          ]
        },
        {
          id: 'art-g7t1-lesson-observe',
          title: '3. ملاحظة العمل الفني والتذوق',
          explain: [
            'التذوق الفني ملاحظة واعية للعمل والتعبير عن استجابة مدعومة بما نراه. يمكن البدء بثلاثة أسئلة: ما العناصر الظاهرة؟ كيف رتبت؟ وما الانطباع الذي صنعته؟',
            'ميّز بين الملاحظة والتفسير والرأي: «أرى خطوطاً مائلة» وصف، و«قد توحي بالحركة» تفسير محتمل، و«أحب هذا الإيقاع» رأي شخصي. احترام اختلاف الآراء لا يمنع من الاستشهاد بتفاصيل مرئية.',
            'انظر إلى موضع الاهتمام، وحجم العناصر، واتجاه الخطوط، وعلاقات اللون والمساحة. ثم صغ جملة تشرح كيف ساعد عنصر أو ترتيب ما على إيصال إحساس أو فكرة.',
            'تطبيق فني بلا كلفة: اختر رسماً أو صورة مطبوعة متاحة أو رسماً من صنعك، وانظر إليها دقيقة. على قصاصة ورق، اكتب ملاحظتين بصريتين وانطباعاً واحداً وسبباً يشير إلى تفصيل حقيقي. لا تمزق كتباً ولا تنشر صورة شخصية أو خاصة.'
          ],
          example: '«ألاحظ تكرار أشكال صغيرة حول شكل أكبر؛ وقد يقود هذا الترتيب العين نحو المركز» يربط التفسير بشاهد يمكن الرجوع إليه.',
          key: 'صف ما تراه، ثم اقترح تفسيراً بصيغة منفتحة، واسند رأيك إلى تفصيل بصري واحترم اختلاف الاستجابات.',
          questions: [
            { q: 'أي عبارة تعد ملاحظة بصرية مباشرة؟', options: ['أرى خطين مائلين قرب أعلى الصورة', 'الفنان أراد بالتأكيد أن يخيفنا', 'الصورة لا تستحق النظر', 'كل شخص يجب أن يحبها'], answer: 0, why: 'العبارة الأولى تصف تفصيلاً ظاهراً دون ادعاء نية أو فرض رأي.' },
            { q: 'كيف ندعم تفسيرنا للعمل الفني؟', options: ['نذكر عنصراً أو ترتيباً نراه في العمل', 'نكرر رأينا دون سبب', 'نخمن سيرة الفنان', 'نقرر أن للتفصيل معنى واحداً دائماً'], answer: 0, why: 'الاستدلال بتفصيل مرئي يجعل التفسير قابلاً للفهم والمناقشة.' },
            { q: 'أي موقف أنسب عند اختلاف الانطباعات عن صورة؟', options: ['احترام الرأي وطلب شواهده البصرية', 'السخرية من الرأي الآخر', 'منع أي تفسير مختلف', 'اعتبار الانطباع حقيقة علمية'], answer: 0, why: 'التذوق يقبل اختلاف الاستجابات، مع تشجيع كل مشاهد على شرح ملاحظته باحترام.' }
          ]
        }
      ],
      exercises: [
        { q: 'أي عنصر يمكن تكراره لصنع إيقاع بصري؟', options: ['خط أو شكل أو لون', 'عنوان الدرس فقط', 'اسم الفنان دون عناصر', 'مساحة بيضاء بلا تنظيم'], answer: 0, why: 'الإيقاع ينتج من تكرار عنصر بصري أو تنويعه على نحو منظم.' },
        { q: 'لاحظت مربعاً كبيراً بلون داكن بين أشكال صغيرة فاتحة. ما الذي قد يلفت الانتباه؟', options: ['اختلاف الحجم والقيمة اللونية', 'غياب أي اختلاف', 'اسم الورقة', 'عدد الكلمات المكتوبة خارج الصورة'], answer: 0, why: 'اختلاف الحجم والتباين بين الداكن والفاتح يمكن أن يجعلا المربع أكثر بروزاً.' },
        { q: 'أي عبارة تمزج وصفاً وتفسيراً معقولاً؟', options: ['تتكرر دوائر صغيرة؛ وقد يصنع تكرارها إيقاعاً', 'هذه الدوائر تعني شيئاً واحداً للجميع', 'لا أرى أي عنصر مع أن الصورة أمامي', 'العمل صحيح فقط إذا وافق رأيي'], answer: 0, why: 'العبارة تصف ما يظهر ثم تعرض تفسيراً ممكناً مرتبطاً بالتكرار.' },
        { q: 'في نشاط اللون، ما الخيار الأفضل عند عدم توفر ألوان كثيرة؟', options: ['تجريب درجات قليلة بقلم متاح وملاحظة الفرق', 'شراء خامات خاصة قبل البدء', 'خلط مواد منزلية مجهولة', 'استخدام أداة حادة لتلوين الورق'], answer: 0, why: 'يمكن استكشاف العلاقات بقلم أو لون متاح؛ لا حاجة لمواد مجهولة أو أدوات غير آمنة.' },
        { q: 'إذا غلبت الأشكال المثلثة على عمل، فما خطوة تذوق مفيدة؟', options: ['ملاحظة اتجاهها وتكرارها وأثر ذلك في الصورة', 'افتراض أنها تعني معنى واحداً حتماً', 'تجاهلها لأنها أشكال بسيطة', 'الانتقال للحكم دون وصف'], answer: 0, why: 'وصف اتجاه العناصر وتكرارها يتيح فهماً أعمق من إطلاق حكم سريع.' },
        { q: 'ما الاستجابة الأنسب لرأي زميلك المختلف في العمل؟', options: ['أسأله عن التفصيل الذي بنى عليه رأيه', 'أخبره أن رأيه ممنوع', 'أنسخ تفسيره دون ملاحظة', 'أحذف العمل كي لا نختلف'], answer: 0, why: 'السؤال عن الشواهد يعزز الحوار والتذوق ويحترم اختلاف وجهات النظر.' }
      ]
    },
    {
      id: 'art-g7t1-unit-design',
      title: 'المحور الاسترشادي الثاني: تنظيم التكوين والإنتاج والتصميم',
      lessons: [
        {
          id: 'art-g7t1-lesson-balance',
          title: '4. التوازن والإيقاع والوحدة',
          explain: [
            'التوازن إحساس باستقرار توزيع العناصر في مساحة العمل. قد يتحقق بتقارب العناصر حول مركز أو محور، وقد يتحقق بتوزيع غير متماثل تتعادل فيه الأوزان البصرية تقريباً.',
            'الإيقاع ينتج من تكرار عنصر أو تنويعه على مسار؛ فالتكرار المنتظم قد يبدو هادئاً، والتغيير المتدرج قد يوجه النظر. الوحدة هي شعور بأن الأجزاء تنتمي إلى تكوين واحد، ويتحقق ذلك بعلاقات متناسقة بينها.',
            'هذه مبادئ للملاحظة والتجريب وليست وصفة واحدة. اسأل: هل يميل العمل إلى جهة؟ هل يوجد تكرار؟ وما الذي يربط الأجزاء؟ ثم غيّر عنصراً واحداً لترى أثره.',
            'تطبيق فني آمن: رتّب قصاصات ورق مستعمل (مربعات ودوائر مرسومة ومقصوصة مسبقاً بإشراف مناسب أو ممزقة باليد) على صفحة، وجرّب توزيعاً متماثلاً ثم غير متماثل. استخدم لصقاً مدرسياً عادياً إن توفر أو ضع القصاصات دون لصق، وتجنب الأدوات الحادة.'
          ],
          example: 'قد يقابل شكل كبير في يسار الصفحة مجموعة أشكال أصغر في يمينها؛ لا يلزم التماثل كي يبدو التكوين متوازناً إذا تقاربت الأوزان البصرية.',
          key: 'التوازن توزيع مستقر، والإيقاع تكرار أو تنويع منظم، والوحدة ترابط الأجزاء؛ ويمكن اختبارها بتحريك العناصر ومقارنة النتيجة.',
          questions: [
            { q: 'ما معنى الإيقاع في التكوين البصري؟', options: ['تكرار أو تنويع منظم لعناصر', 'تساوي كل المساحات في الحجم دائماً', 'استخدام لون واحد إلزامياً', 'إلغاء جميع الأشكال'], answer: 0, why: 'الإيقاع يعتمد على تكرار أو تنويع عنصر بطريقة تنظم حركة العين.' },
            { q: 'هل يشترط التماثل الكامل لتحقيق التوازن؟', options: ['لا، قد يتحقق بتوزيع غير متماثل متقارب الأوزان', 'نعم في كل عمل فني', 'نعم، مع استخدام لونين فقط', 'لا يمكن لأي صورة أن تتوازن'], answer: 0, why: 'يمكن تحقيق توازن بصري غير متماثل بتعادل الأحجام أو الألوان أو مواضع العناصر تقريباً.' },
            { q: 'أي تغيير يمكن أن يدعم وحدة تكوين؟', options: ['تكرار لون أو شكل يربط أجزاءه', 'إضافة تفاصيل متنافرة بلا قصد', 'إخفاء كل العلاقات بين العناصر', 'تغيير الورقة بعد انتهاء العمل'], answer: 0, why: 'عنصر متكرر أو علاقة مشتركة قد تساعد الأجزاء على الظهور ككل مترابط.' }
          ]
        },
        {
          id: 'art-g7t1-lesson-design',
          title: '5. التعبير والتصميم بخامات متاحة وآمنة',
          explain: [
            'التصميم يبدأ بفكرة أو حاجة، ثم اختيار عناصر وترتيبها لتوصيل رسالة. يمكن أن يكون التصميم ملصقاً بسيطاً للتذكير بالمحافظة على الماء أو بطاقة تحمل عبارة إيجابية؛ المهم أن يكون المقصود مقروءاً.',
            'قبل الإنتاج، حدد الرسالة والجمهور، وارسم تخطيطاً سريعاً، ثم اختر شكلاً أو لوناً بارزاً وكلمات قليلة. راجع وضوح القراءة والتوازن واترك مساحة كافية حول العناصر.',
            'الإنتاج الفني عملية فيها تجربة ومراجعة؛ يمكن تعديل موضع شكل أو اختصار عبارة بدلاً من البدء من جديد. استخدم خامات نظيفة ومعروفة ومتاحة، ولا تخلط مواد أو منظفات أو دهانات مجهولة، ولا تلمس مقابس أو أسلاكاً.',
            'تطبيق فني آمن وقليل التكلفة: صمم على ورقة مستعملة من جهة واحدة ملصقاً صغيراً من ثلاثة عناصر كحد أقصى ورسالة قصيرة من كلماتك. استخدم قلم رصاص أو ألواناً خشبية متاحة. اعرض العمل على شخص تثق به واسأله: ما الرسالة التي وصلتك؟ ثم حسّن وضوحها.'
          ],
          example: 'في بطاقة للتشجيع على إعادة استخدام الورق، قد تكفي عبارة موجزة، ورسم ورقة نبات، ولونان واضحان؛ البساطة تساعد الرسالة على الظهور.',
          key: 'حدد الرسالة والجمهور، خطط قبل الإنتاج، استخدم خامات آمنة متاحة، ثم راجع وضوح الفكرة وتماسك التصميم.',
          questions: [
            { q: 'ما أول خطوة نافعة قبل تصميم ملصق؟', options: ['تحديد الرسالة التي أريد إيصالها', 'إضافة أكبر عدد ممكن من الزخارف', 'اختيار خامة مجهولة', 'نسخ تصميم شخص آخر كما هو'], answer: 0, why: 'وضوح الهدف يساعد على اختيار العناصر والكلمات المناسبة للجمهور.' },
            { q: 'ما السلوك الآمن في نشاط فني منزلي أو مدرسي؟', options: ['استخدام أدوات رسم معروفة وتجنب خلط مواد مجهولة', 'خلط منظفات وألوان لمعرفة النتيجة', 'العمل قرب أسلاك مكشوفة', 'استعمال أداة حادة دون حاجة أو إشراف'], answer: 0, why: 'الخامات المعروفة وأدوات الرسم المعتادة أكثر أماناً، ويجب تجنب المواد المجهولة ومصادر الكهرباء والأدوات غير اللازمة.' },
            { q: 'كيف نتحقق مبدئياً من وضوح رسالة التصميم؟', options: ['نسأل مشاهداً ماذا فهم من العمل', 'نزيد التفاصيل دائماً', 'نخفي العبارة داخل الزخرفة', 'نمنع المشاهد من النظر'], answer: 0, why: 'ملاحظة فهم المشاهد تساعد على تقييم وصول الرسالة وإجراء تحسين مناسب.' }
          ]
        }
      ],
      exercises: [
        { q: 'أي وصف يميز الوحدة عن مجرد كثرة العناصر؟', options: ['وجود روابط تجعل الأجزاء تبدو تكويناً مترابطاً', 'وجود عناصر كثيرة ولو لم تتصل', 'ملء كل فراغ بالزخرفة', 'تكرار العبارة بلا غرض'], answer: 0, why: 'الوحدة إحساس بالترابط بين الأجزاء، لا بمجرد زيادة عدد العناصر.' },
        { q: 'كيف يمكن تجربة توازن غير متماثل على ورقة؟', options: ['مقابلة شكل كبير بمجموعة أشكال أصغر موزعة', 'وضع كل العناصر في صف واحد إلزاماً', 'استخدام شكل واحد فقط', 'عدم ملاحظة أحجام العناصر'], answer: 0, why: 'قد تتقابل كتلة كبيرة مع كتل أصغر بحيث تتقارب الأوزان البصرية دون تماثل.' },
        { q: 'في تصميم توعوي، لماذا قد تكون العبارة القصيرة مفيدة؟', options: ['تجعل الرسالة أسهل قراءة وتذكراً', 'تمنع استخدام العناصر البصرية', 'تضمن أن لكل شخص الرأي نفسه', 'تغني عن وضوح التكوين'], answer: 0, why: 'الإيجاز قد يساعد على إبراز الرسالة، مع ضرورة دعمها بتصميم مقروء.' },
        { q: 'أي اختيار يصف مراجعة جيدة للتصميم؟', options: ['أتحقق من وضوح العبارة ومكان العنصر الأبرز', 'أضيف تفاصيل دون النظر إلى النتيجة', 'أستخدم مادة مجهولة لتحسين اللون', 'أقرر أن التعديل ممنوع'], answer: 0, why: 'مراجعة القراءة والموضع تساعد على تحسين التصميم بصورة واعية وآمنة.' },
        { q: 'إذا بدا جانب من التكوين أثقل بصرياً، فما خطوة مناسبة؟', options: ['أجرب تحريك عنصر أو تغيير حجمه ثم أقارن', 'أمزق الورقة فوراً', 'أضيف ألواناً عشوائية كثيرة', 'أفترض أنه متوازن دون نظر'], answer: 0, why: 'تجريب تغيير محدد ومقارنة النتيجة طريقة عملية لفحص التوازن.' },
        { q: 'ما الخامة الأنسب لنشاط بسيط منخفض التكلفة؟', options: ['ورق مستعمل نظيف وقلم متاح', 'مادة كيميائية مجهولة', 'زجاج مكسور', 'سلك كهربائي'], answer: 0, why: 'الورق المستعمل النظيف وأدوات الرسم المعتادة متاحة وآمنة نسبياً عند استخدامها بالشكل المعتاد.' }
      ]
    }
  ];

  var exams = [
    {
      id: 'art-g7t1-final-exam',
      title: 'امتحان ختامي استرشادي: مراجعة مهارية',
      note: '14 سؤال اختيار من متعدد • تدريب غير رسمي بتصحيح فوري وتعليل. لا يمثل امتحاناً وزارياً أو فهرساً مقرراً للعام 2026/2027.',
      questions: [
        { q: 'أي عنصر بصري يمكن أن يصف حافة الشكل أو يوجه العين؟', options: ['الخط', 'عنوان الملف', 'زمن الرسم فقط', 'اسم الأداة'], answer: 0, why: 'الخط قد يحدد الحافة أو يوجه حركة العين داخل التكوين.' },
        { q: 'أي مثال يمثل شكلاً هندسياً محدد الحافة؟', options: ['مثلث مرسوم', 'بقعة ضبابية', 'ظل متغير', 'أثر عشوائي'], answer: 0, why: 'المثلث شكل هندسي ذو حدود واضحة.' },
        { q: 'ما فائدة ملاحظة اللون الفاتح والداكن؟', options: ['فهم التباين والبروز بين العناصر', 'تحديد عمر الفنان بدقة', 'إثبات معنى واحد للون', 'إلغاء أهمية ترتيب الأشكال'], answer: 0, why: 'مقارنة القيم الفاتحة والداكنة تكشف التباين الذي قد يبرز عناصر.' },
        { q: 'أي عبارة تفسيرية أكثر حذراً ودقة؟', options: ['قد توحي الخطوط المتكررة بالحركة', 'هذه الخطوط تعني الحركة لكل إنسان حتماً', 'الفنان قصد أمراً مؤكداً لا نعرفه', 'الخطوط لا يمكن ملاحظتها'], answer: 0, why: 'صيغة «قد توحي» تقدم تفسيراً ممكناً دون ادعاء معنى قطعي.' },
        { q: 'ما الإيقاع البصري؟', options: ['تكرار أو تنويع منظم لعناصر', 'غياب كل عنصر', 'كتابة اسم العمل فقط', 'تساوي الألوان في كل صورة'], answer: 0, why: 'التكرار أو التنويع المنظم يصنع إيقاعاً ويوجه النظر.' },
        { q: 'هل يتطلب التوازن أن يكون جانبا الصورة متماثلين تماماً؟', options: ['لا، قد يتحقق بتوزيع غير متماثل', 'نعم، في كل تصميم', 'نعم، بشرط لون واحد', 'لا يمكن وجود توازن بصري'], answer: 0, why: 'التوازن قد يكون متماثلاً أو غير متماثل بحسب توزيع الأوزان البصرية.' },
        { q: 'أي خطوة تساعد على الشعور بوحدة التصميم؟', options: ['تكرار علاقة لونية أو شكلية تربط الأجزاء', 'إضافة عناصر لا ترتبط بالفكرة', 'استخدام أكبر عدد ممكن من الألوان', 'إخفاء موضع الاهتمام'], answer: 0, why: 'العلاقات المتكررة قد تربط عناصر العمل في كل متماسك.' },
        { q: 'ما أفضل طريقة لبداية تذوق صورة؟', options: ['وصف عناصر مرئية قبل تفسيرها', 'تخمين نية الفنان فوراً', 'الحكم دون النظر', 'فرض رأي واحد على الآخرين'], answer: 0, why: 'الانتقال من الوصف إلى التفسير يربط الرأي بما يظهر في الصورة.' },
        { q: 'أي عبارة تستند إلى شاهد بصري؟', options: ['تتكرر الأشكال الصغيرة قرب المركز', 'الفنان شخصيته كذا بالتأكيد', 'كل الناس يرون الشيء نفسه', 'الصورة جميلة فقط'], answer: 0, why: 'العبارة الأولى تصف تفصيلاً قابلاً للملاحظة والمناقشة.' },
        { q: 'عند اختلاف رأيين حول عمل فني، ما الموقف الأفضل؟', options: ['احترام الرأي وطلب ملاحظاته الداعمة', 'السخرية من صاحبه', 'اعتبار رأي واحد قانوناً', 'إنهاء النقاش بمنع الملاحظة'], answer: 0, why: 'التذوق يسمح بتنوع الاستجابات ويستفيد من الشواهد والحوار المحترم.' },
        { q: 'ما الذي يسبق اختيار تفاصيل ملصق توعوي؟', options: ['تحديد الرسالة والجمهور', 'إضافة الزخارف بلا هدف', 'اختيار مادة غير معروفة', 'نسخ عمل آخر'], answer: 0, why: 'تحديد الرسالة والجمهور يوجه اختيار الكلمات والعناصر.' },
        { q: 'أي ممارسة آمنة ومنخفضة التكلفة لنشاط فني؟', options: ['رسم على ورق مستعمل نظيف بقلم متاح', 'خلط مواد تنظيف وألوان', 'العمل قرب سلك مكشوف', 'استخدام زجاج مكسور'], answer: 0, why: 'ورق نظيف وأداة رسم معروفة خيار عملي؛ يجب تجنب المواد المجهولة والمخاطر.' },
        { q: 'كيف نعرف إن كان ملصقنا يوصل رسالته؟', options: ['نسأل مشاهداً ماذا فهم ونراجع الوضوح', 'نضيف كلمات صغيرة لا تقرأ', 'نخفي الفكرة عن المشاهد', 'نفترض نجاحه بلا اختبار'], answer: 0, why: 'استجابة المشاهد تساعد على فحص وصول الرسالة وتحديد ما يحتاج إلى تعديل.' },
        { q: 'عند مشاهدة مثال لفن مصري قديم في هذا المحتوى، كيف ينبغي فهمه؟', options: ['مثال بصري للملاحظة لا إثبات لكونه درساً مقرراً', 'وحدة وزارية مؤكدة لعام 2026/2027', 'امتحان رسمي منشور', 'فهرس كامل للكتاب الجديد'], answer: 0, why: 'المثال البصري للتذوق لا يعني أن موضوع الفن المصري القديم مقرر في فهرس 2026/2027.' }
      ]
    }
  ];

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
    return stage === 'prep' && /اول/.test(grade) && /فن/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
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

  function questionBox(questions, prefix) {
    var wrap = document.createElement('div');
    wrap.setAttribute('dir', 'rtl');
    questions.forEach(function (question, questionIndex) {
      var block = document.createElement('section');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;';
      var title = text('div', (questionIndex + 1) + '. ' + question.q);
      title.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;';
      block.appendChild(title);
      var choices = document.createElement('div');
      question.options.forEach(function (choice, choiceIndex) {
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
      body.appendChild(questionBox(found.kind === 'exercise' ? found.item.exercises : found.item.questions, found.item.id));
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
    root.className = 'art-original-content art-g7t1-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
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
        root.appendChild(card('بنك تدريبات ' + unit.title, questionCount + ' سؤالاً مع تصحيح فوري وتعليل • يتضمن تدريباً لكل درس', unit.id, '✏️'));
      });
    } else if (type === 'exams') {
      exams.forEach(function (exam) {
        root.appendChild(card(exam.title, exam.note, exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openArtGrade7Term1Item = openItem;
  var originalOpenContent = window.openContent;
  if (typeof originalOpenContent === 'function' && !originalOpenContent.__artGrade7Term1Wrapped) {
    var wrapped = async function (type, termNumber, termName) {
      var result = await originalOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrapped.__artGrade7Term1Wrapped = true;
    window.openContent = wrapped;
  }
})();
