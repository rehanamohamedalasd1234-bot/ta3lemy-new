// Original supplementary content for English Prep 2, Term 1, Egypt (2026/2027).
// Current unit titles follow the 2026/2027 list; exact grammar details may differ from the available 2025/2026 MOE book.
(function () {
  'use strict';

  var NOTICE = 'أسماء الوحدات الست وفق قائمة منهج 2026/2027 المنشورة. كتاب الوزارة المتاح وبوابة دروس الوزارة يعرضان ترتيباً أقدم؛ لذلك بعض القواعد هنا تدريب مساند وليست ادعاءً بأنها الترتيب الرسمي الدقيق للطبعة الحالية. راجع كتاب مدرستك عند اختلاف المحتوى. النصوص والأسئلة والأنشطة هنا أصلية.';

  var units = [
    {
      id: 'grade8-eng-u1', title: 'Unit 1: Gen Alpha', grammar: 'Present Continuous + arrangements',
      lessons: [
        {
          id: 'grade8-eng-u1-l1', title: 'Meet Gen Alpha',
          passage: 'Gen Alpha is growing up in a world with smartphones, tablets and online learning. Many young people use digital tools to find information, share ideas and stay in touch with friends. They are also learning to balance screen time with sleep, exercise and family activities. Technology can be useful, but thoughtful choices help young people use it well.',
          summary: 'جيل ألفا ينشأ مع أدوات رقمية كثيرة، ويحتاج إلى الموازنة بين وقت الشاشة والأنشطة الأخرى.',
          dialogue: 'Mona: What are you doing on your tablet?\nSalma: I am watching a science lesson.\nMona: Are you using it for school?\nSalma: Yes. Later, I am meeting my cousin at the sports club.',
          vocabulary: 'generation = جيل؛ digital native = مولود في العصر الرقمي؛ trend = اتجاه شائع؛ emoji = رمز تعبيري؛ meme = صورة أو فكرة متداولة؛ screen time = وقت الشاشة؛ balance = توازن؛ limit = حد.',
          explain: ['يتناول النص جيلاً نشأ مع وسائل رقمية، لكنه لا يفترض أن كل فرد يستخدمها بالطريقة نفسها.', 'المضارع المستمر يتكون من am/is/are + فعل ing، ويصف ما يحدث الآن: They are learning.', 'يمكن استخدام المضارع المستمر لترتيب قريب ومحدد: I am meeting my cousin at four. وتساعد عبارة الوقت على توضيح أنه ترتيب.', 'التوازن الرقمي يعني تخصيص وقت مناسب للنوم والحركة والدراسة والتواصل المباشر، وليس منع التقنية كلياً.'],
          grammar: 'Now: I am reading a post. / She is sharing an idea. / They are learning online.\nArrangement: We are meeting at the library tomorrow.\nQuestion: What are you doing now? / Are they coming this afternoon?',
          writing: 'Write a short blog entry about a balanced day. Include two present continuous sentences and one time expression.',
          speaking: 'Describe what you and your friends are doing this week, including one planned arrangement.',
          key: 'Use the present continuous for actions happening now and for definite arrangements.'
        },
        {
          id: 'grade8-eng-u1-l2', title: 'A Balanced Digital Day',
          passage: 'After school, Adam is finishing his homework before he opens a game. At five o’clock, he is joining an online English club with his classmates. They are practising new words and sharing short recordings. At six, Adam is putting his phone away because he is going cycling with his brother. He enjoys technology and outdoor activities.',
          summary: 'ينظم آدم يومه بين الواجب والنشاط الرقمي وركوب الدراجة.',
          dialogue: 'Hala: Are you joining the English club today?\nAdam: Yes, I am joining at five.\nHala: What are you doing after that?\nAdam: I am going cycling with my brother.',
          vocabulary: 'online = عبر الإنترنت؛ activity = نشاط؛ recording = تسجيل؛ classmate = زميل دراسة؛ outdoor = خارجي؛ practise = يتدرب؛ schedule = جدول؛ device = جهاز.',
          explain: ['تصف الأفعال ذات الوقت المحدد ترتيباً مستقبلياً: He is joining at five. وجود وقت أو خطة متفق عليها يوضح هذا الاستخدام.', 'لإضافة ing نحذف e الصامتة غالباً: make → making. وإذا انتهى الفعل بحرف ساكن بعد حرف علة واحد قد يتضاعف الحرف: sit → sitting.', 'يجب مراعاة اختلاف الفعل be: I am، he/she/it is، we/you/they are.', 'خطة اليوم المفيدة تترك وقتاً للحركة والراحة، وتحترم مواعيد الدراسة والنوم.'],
          grammar: 'Positive: Adam is finishing his homework.\nNegative: He isn’t playing now. / They aren’t waiting.\nArranged future: We are meeting our teacher at 4 p.m.\nSpelling: write → writing; sit → sitting.',
          writing: 'Write four lines about your plans for tomorrow using am/is/are + verb-ing and time expressions.',
          speaking: 'Ask a partner about their plans for this afternoon: “What are you doing after school?”',
          key: 'Add a time expression to make a future arrangement clear.'
        }
      ],
      exercises: [
        { q: 'Look! The students ___ a digital poster.', options: ['make', 'are making', 'made', 'makes'], answer: 1, why: 'Look! تدل على حدث جارٍ: are + verb-ing.' },
        { q: 'We ___ our teacher at 3 p.m. tomorrow. It is arranged.', options: ['meet', 'are meeting', 'met', 'meets'], answer: 1, why: 'المضارع المستمر يصلح لترتيب مستقبلي محدد.' },
        { q: 'Choose the correct spelling.', options: ['runing', 'running', 'runingg', 'runsing'], answer: 1, why: 'يتضاعف n في running.' },
        { q: 'Which sentence describes an action happening now?', options: ['Adam cycles every week.', 'Adam is cycling now.', 'Adam cycled yesterday.', 'Adam will cycle next week.'], answer: 1, why: 'is cycling now تصف فعلاً جارياً.' },
        { q: 'Which is a balanced choice?', options: ['Use a screen all night', 'Take breaks and make time for sleep', 'Stop all outdoor activities', 'Share every private message'], answer: 1, why: 'الراحة والنشاط خارج الشاشة جزء من التوازن.' },
        { q: 'Correct: “She are watching a lesson.”', answerText: 'She is watching a lesson.', points: 2 },
        { q: 'Write one arranged plan using the present continuous and a time.', answerText: 'Example: I am meeting my friend at 4 p.m. Any correct arrangement is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade8-eng-u2', title: 'Unit 2: My Digital Footprint', grammar: 'Present Simple Passive + modal verbs',
      lessons: [
        {
          id: 'grade8-eng-u2-l1', title: 'What Is a Digital Footprint?',
          passage: 'A digital footprint is the information a person leaves online. Photos may be posted, comments are saved and some location data is collected by apps. A post can be copied or shared by other users. Before publishing, students should check their privacy settings and ask permission before sharing someone else’s picture.',
          summary: 'الأنشطة الرقمية قد تترك معلومات محفوظة أو منشورة، لذا ينبغي مراجعة الخصوصية واحترام الآخرين.',
          dialogue: 'Youssef: Is every online post private?\nNour: No. Some posts are shared with a wide audience.\nYoussef: What should I do before I post a photo?\nNour: Check who can see it and ask the people in it.',
          vocabulary: 'digital footprint = بصمة رقمية؛ privacy = خصوصية؛ secure = آمن؛ trace = أثر؛ setting = إعداد؛ update = يحدّث؛ data = بيانات؛ online identity = هوية رقمية.',
          explain: ['البصمة الرقمية هي آثار ومعلومات مرتبطة بالنشاط عبر الإنترنت، وقد تبقى بعض المنشورات متاحة بعد نشرها.', 'المبني للمجهول في المضارع البسيط: am/is/are + التصريف الثالث. نستخدمه عندما نهتم بالفعل أو الشيء المتأثر أكثر من الفاعل: Comments are saved.', 'تأتي الأفعال الناقصة مثل should وmust وcan قبل الفعل الأساسي: You should check the settings. ولا نضيف to بعد الفعل الناقص.', 'استخدم كلمة مرور قوية، وراجع إعدادات الخصوصية، ولا تشارك بياناتك أو صور الآخرين دون إذن.'],
          grammar: 'Active: Apps collect some data.\nPassive: Some data is collected by apps.\nPlural: Photos are shared. / A photo is shared.\nAdvice: You should check the settings. / You mustn’t share a password.',
          writing: 'Write three tips for protecting a digital footprint. Use should, must or mustn’t.',
          speaking: 'Discuss what information should stay private online and explain why.',
          key: 'Present simple passive = am/is/are + past participle. Use modal verbs + base verb for advice and rules.'
        },
        {
          id: 'grade8-eng-u2-l2', title: 'Protecting Your Privacy',
          passage: 'Before joining a new app, Reem reads its privacy information. Her account is protected with a strong password, and two-step verification is turned on. She does not accept messages from unknown accounts. If a strange link is sent to her, she asks a trusted adult before opening it. Careful habits make online activity safer.',
          summary: 'تستخدم ريم كلمات مرور قوية وتتحقق من الروابط وتطلب مساعدة شخص موثوق عند الشك.',
          dialogue: 'Reem: This message says I won a prize. Should I open the link?\nBrother: You shouldn’t open an unknown link.\nReem: What if I already clicked it?\nBrother: Tell a trusted adult and change your password if needed.',
          vocabulary: 'account = حساب؛ verification = تحقق؛ unknown = مجهول؛ accept = يقبل؛ link = رابط؛ permission = إذن؛ private = خاص؛ protect = يحمي.',
          explain: ['المبني للمجهول يركز على الإجراء: The account is protected. وقد نضيف by إذا كان الفاعل مهماً: The account is protected by a password.', 'في الجمل المنفية: is not shared، are not posted. نحافظ على فعل be ثم نضيف not والتصريف الثالث.', 'قدّم نصيحة بوضوح ولطف: You should tell an adult. وللمنع نقول: You mustn’t share the code.', 'إذا حدث خطأ رقمي، أخبر بالغاً موثوقاً ولا تحاول إخفاء المشكلة أو متابعة الرابط.'],
          grammar: 'Negative passive: Personal details are not shared.\nQuestion: Is the account protected? — Yes, it is.\nModal: You can block an unknown account. / You should report a harmful message.',
          writing: 'Write a short message to a friend explaining how to respond to a suspicious link.',
          speaking: 'Role-play asking a trusted adult for help with an online safety problem.',
          key: 'Pause before opening unfamiliar links and ask for help when something online feels unsafe.'
        }
      ],
      exercises: [
        { q: 'Choose the correct passive sentence.', options: ['Apps collect data.', 'Data is collected by apps.', 'Data are collect by apps.', 'Data collected apps.'], answer: 1, why: 'المفرد غير المعدود data هنا مع is + التصريف الثالث collected.' },
        { q: 'Photos ___ online every day.', options: ['is shared', 'are shared', 'are share', 'shares'], answer: 1, why: 'Photos جمع؛ نستخدم are + shared.' },
        { q: 'You ___ check privacy settings before posting.', options: ['should', 'should to', 'are', 'did'], answer: 0, why: 'بعد should يأتي الفعل الأساسي مباشرة.' },
        { q: 'Choose the correct negative passive.', options: ['The code is not shared.', 'The code not is shared.', 'The code does not shared.', 'The code is not share.'], answer: 0, why: 'النفي: is not + past participle.' },
        { q: 'What should you do with a suspicious link?', options: ['Open it immediately', 'Ask a trusted adult', 'Send your password', 'Share it with friends'], answer: 1, why: 'اطلب مساعدة شخص موثوق قبل فتح رابط مريب.' },
        { q: 'Change to passive: “People save the comments.”', answerText: 'The comments are saved.', points: 2 },
        { q: 'Write one online safety rule with “mustn’t”.', answerText: 'Example: You mustn’t share your password. Any correct rule is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade8-eng-u3', title: 'Unit 3: Facing Challenges', grammar: 'Past Simple + Past Continuous',
      lessons: [
        {
          id: 'grade8-eng-u3-l1', title: 'Overcoming a Challenge',
          passage: 'Last term, Salma found fractions difficult. While she was solving a worksheet, she noticed that she had made the same mistake twice. She felt discouraged, but she asked her teacher for help. The teacher showed her one step at a time. Salma practised for a short time every day and gradually improved. She learned that asking for help is a strength.',
          summary: 'تواجه سلمى صعوبة دراسية بالممارسة وطلب المساعدة، وتكتشف أن التحسن يحتاج إلى وقت.',
          dialogue: 'Salma: I was feeling stuck when I did the exercise.\nMina: What did you do?\nSalma: I asked the teacher, and she explained the first step.\nMina: Well done. You kept trying.',
          vocabulary: 'challenge = تحدٍّ؛ discouraged = محبط؛ determination = إصرار؛ obstacle = عقبة؛ courage = شجاعة؛ stressed = متوتر؛ improve = يتحسن؛ step by step = خطوة خطوة.',
          explain: ['يصف الماضي البسيط حدثاً انتهى: Salma asked for help. ويصف الماضي المستمر فعلاً كان جارياً في وقت ماضٍ: She was solving a worksheet.', 'يمكن الجمع بينهما: While + past continuous, past simple. مثال: While I was reading, the phone rang.', 'نستخدم when كثيراً قبل الحدث الذي وقع أثناء فعل مستمر: I was walking when it started to rain.', 'قسّم المشكلة إلى خطوة ممكنة، واستعن بمعلم أو شخص تثق به عند الحاجة.'],
          grammar: 'Past Simple: She asked her teacher. / He went home.\nPast Continuous: I was studying. / They were practising.\nWhile I was studying, my friend called.\nI was walking when it started to rain.',
          writing: 'Write a short story about a challenge. Use at least one Past Simple and one Past Continuous verb.',
          speaking: 'Describe a challenge and one action that helped someone continue.',
          key: 'Past continuous sets the scene; past simple often tells the shorter event that happened.'
        },
        {
          id: 'grade8-eng-u3-l2', title: 'Challenges in Our Community',
          passage: 'On Monday morning, cars were moving slowly near the school because the road was busy. While families were waiting, a school volunteer helped younger students cross at the crossing. The students arrived safely, so the head teacher thanked the volunteer. Although the traffic was stressful, everyone stayed patient and followed the safety signs.',
          summary: 'يقدم النص موقفاً مجتمعياً عن الازدحام وسلوك آمن، مع روابط السبب والنتيجة والتباين.',
          dialogue: 'Tarek: What happened while you were walking to school?\nLina: Cars were moving slowly, so I waited at the crossing.\nTarek: Did anyone help?\nLina: Yes, a volunteer was guiding the younger students.',
          vocabulary: 'traffic jam = ازدحام مروري؛ volunteer = متطوع؛ crossing = ممر عبور؛ patient = صبور؛ stress = ضغط؛ solution = حل؛ because = لأن؛ although = رغم أن.',
          explain: ['تربط because السبب بالنتيجة، وتقدم so نتيجةً لسبب سابق: The road was busy, so cars moved slowly.', 'تقدم although تبايناً بين فكرتين: Although it was busy, we stayed calm.', 'تأكد من استخدام أدوات عبور آمنة واتباع تعليمات المدرسة والبالغين.', 'لا يحتاج كل تحدٍّ إلى حل فردي؛ فقد يسهم التعاون وتغيير السلوك في تحسين الموقف.'],
          grammar: 'because + reason: We waited because the road was busy.\nso + result: The road was busy, so we waited.\nalthough + contrast: Although it was busy, we stayed calm.\nPast Continuous: Cars were moving slowly.',
          writing: 'Write four sentences about a community challenge. Use because, so or although and one past tense.',
          speaking: 'Discuss a safe solution to a problem students may meet on their way to school.',
          key: 'Use time expressions and connectors to explain what happened and why.'
        }
      ],
      exercises: [
        { q: 'While I ___ home, it started to rain.', options: ['walk', 'was walking', 'am walking', 'walked'], answer: 1, why: 'حدث المشي كان مستمراً عند بدء المطر.' },
        { q: 'The past form of “go” is:', options: ['goed', 'went', 'goes', 'going'], answer: 1, why: 'go فعل غير منتظم وماضيه went.' },
        { q: 'Choose the correct sentence.', options: ['They was waiting.', 'They were waiting.', 'They are waited.', 'They waiting.'], answer: 1, why: 'مع they نستخدم were + verb-ing.' },
        { q: 'We stayed inside ___ it was raining.', options: ['because', 'although', 'so', 'but'], answer: 0, why: 'because تذكر السبب.' },
        { q: '___ the task was difficult, Hany kept trying.', options: ['Because', 'Although', 'So', 'When'], answer: 1, why: 'although تربط فكرتين بينهما تباين.' },
        { q: 'Complete: “While she ___ (study), her friend called.”', answerText: 'While she was studying, her friend called.', points: 2 },
        { q: 'Write one sentence about a challenge using “so”.', answerText: 'Example: The task was difficult, so I asked for help. Any logical, correct sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade8-eng-u4', title: 'Unit 4: Art', grammar: 'Descriptive adjectives + connectors',
      lessons: [
        {
          id: 'grade8-eng-u4-l1', title: 'Art and Expression',
          passage: 'The school art club is preparing a small exhibition. One student is painting a bright mural of the Nile and green fields. Another is making a quiet, colourful collage from paper shapes. Each artwork expresses an idea in a different way. The exhibition is simple, but it helps students share feelings and notice details around them.',
          summary: 'يعرض الطلاب أعمالاً فنية متنوعة للتعبير عن أفكار ومشاعر وملاحظة البيئة المحيطة.',
          dialogue: 'Mona: What do you think of the mural?\nOmar: It is colourful and peaceful.\nMona: Why do you like it?\nOmar: Because the bright colours make the river look lively.',
          vocabulary: 'art = فن؛ artwork = عمل فني؛ creativity = إبداع؛ express = يعبّر؛ imagination = خيال؛ performance = عرض؛ gallery = معرض؛ sculpture = تمثال؛ emotion = شعور؛ message = رسالة.',
          explain: ['يمكن أن يظهر الفن في الرسم أو النحت أو الموسيقى أو الأداء، وقد يعبّر عن فكرة أو شعور دون كلمات كثيرة.', 'الصفة تصف اسماً: a bright mural، a quiet gallery. تأتي غالباً قبل الاسم أو بعد فعل be: The picture is colourful.', 'تربط because السبب بالنتيجة، وso النتيجة، وalthough التباين بين فكرتين.', 'عند وصف عمل فني، اذكر تفاصيل يمكن ملاحظتها مثل اللون أو الشكل، ثم أضف رأيك وسببه.'],
          grammar: 'Adjective + noun: a colourful picture; a quiet room.\nAfter be: The sculpture is impressive.\nbecause: I like it because it is creative.\nso: The colours are bright, so the room feels lively.\nalthough: Although it is simple, it is meaningful.',
          writing: 'Write an email describing a piece of art you like. Use three adjectives and one connector.',
          speaking: 'Describe an artwork using colour, shape and one feeling it gives you.',
          key: 'Use clear descriptive adjectives and give a reason for your opinion about art.'
        },
        {
          id: 'grade8-eng-u4-l2', title: 'How Art Helps Us Communicate',
          passage: 'A young sculptor visited the school and spoke about her work. She said that artists observe people and places carefully. A sculpture may be made from stone, wood or reused materials. Some artworks are funny, while others are serious. The students asked questions because they wanted to understand the artist’s message. They left the meeting feeling curious and inspired.',
          summary: 'يتعلم الطلاب أن الفن قد يستخدم مواد وأشكالاً مختلفة لنقل رسالة أو إثارة سؤال.',
          dialogue: 'Student: Is this sculpture made of stone?\nArtist: No, it is made from reused wood.\nStudent: It looks unusual but beautiful.\nArtist: Thank you. I wanted people to think about using materials again.',
          vocabulary: 'sculptor = نحات؛ sculpture = منحوتة؛ material = مادة؛ reuse = يعيد استخدام؛ observe = يلاحظ؛ serious = جاد؛ unusual = غير مألوف؛ inspired = مُلهَم.',
          explain: ['تساعد الصفات على توصيل انطباع محدد: unusual يصف شيئاً غير مألوف، وinspiring يصف ما يبعث الإلهام.', 'يصف المبني للمجهول مادة العمل: The sculpture is made from wood. ويظهر هذا التركيب في سياق الحديث عن صناعة الفن.', 'استمع إلى تفسير الفنان قبل إصدار حكم؛ فقد يكون للعمل معنى أو سياق لا يظهر من النظرة الأولى.', 'إعادة استخدام مواد مناسبة قد تقلل الهدر، مع ضرورة اختيار مواد آمنة وملائمة للنشاط.'],
          grammar: 'Passive description: The sculpture is made from wood.\nContrast: Some works are playful, while others are serious.\nOpinion + reason: I like the design because it is imaginative.',
          writing: 'Write a short description of a school exhibition. Include a contrast using “while” or “although”.',
          speaking: 'Ask an artist or classmate two questions about the material and message of an artwork.',
          key: 'Describe what you can observe, then explain the idea or feeling you connect with it.'
        }
      ],
      exercises: [
        { q: 'Choose the adjective in this phrase: “a colourful painting”.', options: ['a', 'colourful', 'painting', 'the'], answer: 1, why: 'colourful تصف الاسم painting.' },
        { q: 'The artwork is ___ because it uses bright colours.', options: ['colourful', 'colourfully', 'colour', 'colours'], answer: 0, why: 'نحتاج صفة بعد is.' },
        { q: 'I like the sculpture ___ it is creative.', options: ['because', 'although', 'so', 'while'], answer: 0, why: 'because تقدم سبب الرأي.' },
        { q: 'The picture is simple, ___ it has a strong message.', options: ['because', 'although', 'but', 'so'], answer: 2, why: 'but تربط فكرتين متباينتين.' },
        { q: 'Choose the correct phrase.', options: ['a beautifully painting', 'a beautiful painting', 'a beauty painting', 'a painting beautiful'], answer: 1, why: 'تأتي الصفة قبل الاسم في هذا التركيب.' },
        { q: 'Complete: “The sculpture ___ made from wood.”', answerText: 'The sculpture is made from wood.', points: 2 },
        { q: 'Write a sentence describing art with one adjective and a reason.', answerText: 'Example: I like the bright painting because it feels cheerful. Any correct description is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade8-eng-u5', title: 'Unit 5: Language Skills and Adjectives', grammar: 'Adjectives + comparative/superlative practice',
      lessons: [
        {
          id: 'grade8-eng-u5-l1', title: 'Describe, Compare and Explain',
          passage: 'Good language learners use different skills. They read short texts, listen for key information, speak with a partner and write clear notes. A useful dictionary is more helpful than guessing every new word. A short daily practice can be easier to manage than one very long study session. Students improve when they notice their progress and keep practising.',
          summary: 'تتطور مهارات اللغة بالتدرب المتوازن على القراءة والاستماع والمحادثة والكتابة.',
          dialogue: 'Laila: Which activity is more useful for you, reading or listening?\nHany: Listening is easier for me, but speaking is more challenging.\nLaila: What is the most helpful habit?\nHany: Short practice every day.',
          vocabulary: 'language skill = مهارة لغوية؛ adjective = صفة؛ clear = واضح؛ useful = مفيد؛ challenging = صعب؛ progress = تقدم؛ compare = يقارن؛ describe = يصف.',
          explain: ['تساعد الصفات في وصف الأشخاص والأشياء والأفكار، مثل a clear answer وa useful activity.', 'للمقارنة بين شيئين، نستخدم غالباً -er مع الصفات القصيرة أو more مع كثير من الصفات الأطول: faster، more useful.', 'للتفضيل داخل مجموعة نستخدم -est أو the most: the fastest، the most useful. توجد صيغ غير منتظمة مثل good → better → the best.', 'استخدم المقارنة بدقة: اذكر الشيئين اللذين تقارنهما، وحدد الصفة المناسبة، وتجنب المقارنة غير العادلة بين أشخاص مختلفين.'],
          grammar: 'Short adjective: fast → faster → the fastest.\nAdjective ending in -y: easy → easier → the easiest.\nLong adjective: useful → more useful → the most useful.\nIrregular: good → better → the best.\nA dictionary is more helpful than guessing.',
          writing: 'Write a short paragraph comparing two ways of learning English. Use “better than” and one superlative.',
          speaking: 'Compare two language activities and explain which one helps you most.',
          key: 'Use comparative forms for two items and superlative forms for one item in a group.'
        },
        {
          id: 'grade8-eng-u5-l2', title: 'Build Strong Language Habits',
          passage: 'Mazen keeps a small vocabulary notebook. He writes a new word, its meaning and one example sentence. This method is more organised than copying a long list without context. He also listens to a short English recording and repeats useful phrases. His sister says that regular practice is the best way to remember new language.',
          summary: 'ينظم مازن مفرداته في دفتر ويجمع بين الكتابة والاستماع والتكرار.',
          dialogue: 'Mazen: Is your notebook useful?\nSister: Yes. It is more helpful than a loose list.\nMazen: What is the best way to review?\nSister: Read the example sentences and use the words aloud.',
          vocabulary: 'notebook = دفتر؛ meaning = معنى؛ context = سياق؛ phrase = عبارة؛ organised = منظم؛ regular = منتظم؛ review = يراجع؛ method = طريقة.',
          explain: ['يساعد السياق على تذكر معنى الكلمة واستخدامها بصورة صحيحة.', 'عند إضافة -er أو -est لبعض الصفات القصيرة، نضاعف الحرف الأخير إذا انطبق النمط: big → bigger → biggest.', 'نستخدم more/most عادةً مع الصفات الأطول، ولا نجمع غالباً بين more وإضافة -er: more useful، وليس usefuller.', 'الاستماع للنطق ثم تكرار عبارة قصيرة يساعد على الربط بين شكل الكلمة وصوتها.'],
          grammar: 'big → bigger → the biggest.\ncareful → more careful → the most careful.\nThis method is easier than copying a list.\nA clear example is the most useful part of my note.',
          writing: 'Create a mini vocabulary entry with three words. Add a meaning, an example and one comparative sentence.',
          speaking: 'Explain which study habit is easier for you and which is the most useful.',
          key: 'Record new vocabulary in context, then reuse it in speaking and writing.'
        }
      ],
      exercises: [
        { q: 'The comparative form of “easy” is:', options: ['easyer', 'easier', 'more easyer', 'easiest'], answer: 1, why: 'تحذف y وتتحول إلى i قبل er: easier.' },
        { q: 'This is ___ useful dictionary than the old one.', options: ['more', 'most', 'the most', 'mucher'], answer: 0, why: 'للمقارنة بين شيئين نستخدم more useful.' },
        { q: 'The superlative of “good” is:', options: ['goodest', 'better', 'the best', 'more good'], answer: 2, why: 'الصيغة غير المنتظمة: good, better, the best.' },
        { q: 'Choose the correct sentence.', options: ['This is the most clear answer.', 'This is the clearest answer.', 'This is more clearest answer.', 'This is clearest than mine.'], answer: 1, why: 'clear صفة قصيرة؛ التفضيل the clearest.' },
        { q: 'Which sentence compares two study methods?', options: ['This method is useful.', 'This method is more useful than guessing.', 'This is the most useful method.', 'This method is usefully.'], answer: 1, why: 'more useful than تقارن بين طريقتين.' },
        { q: 'Complete: “A short review is ___ (easy) than a long list.”', answerText: 'A short review is easier than a long list.', points: 2 },
        { q: 'Write a sentence using “the most helpful”.', answerText: 'Example: A clear example is the most helpful part of my notes. Any grammatical sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade8-eng-u6', title: 'Unit 6: Conditionals and Review', grammar: 'First and Second Conditional + term review',
      lessons: [
        {
          id: 'grade8-eng-u6-l1', title: 'If We Make a Plan',
          passage: 'The English club is planning a language day. If students practise their lines, they will feel more confident on stage. If the group finishes its posters early, it will have time to check spelling. The members are sharing jobs and helping each other. Their plan combines digital tools, language practice and creative ideas.',
          summary: 'يخطط نادي الإنجليزية ليوم لغوي، ويتوقع نتائج ممكنة عند تنفيذ خطوات واضحة.',
          dialogue: 'Omar: What will happen if we finish the posters today?\nNadia: We will have time to check them.\nOmar: What if I feel nervous on stage?\nNadia: If you practise, you will feel more confident.',
          vocabulary: 'conditional = جملة شرطية؛ result = نتيجة؛ confident = واثق؛ practise = يتدرب؛ plan = خطة؛ stage = منصة؛ possibility = احتمال؛ review = مراجعة.',
          explain: ['تربط الجمل الشرطية بين شرط ونتيجة محتملة. في الشرط الأول نتحدث عن احتمال واقعي في المستقبل.', 'التركيب: If + المضارع البسيط، will + الفعل الأساسي: If we practise, we will improve.', 'لا نستخدم will عادةً داخل جملة If في الشرط الأول: If it rains, we will stay inside.', 'تنظم مراجعة الترم بموضوعات قصيرة: الحاضر المستمر، والمبني للمجهول، والماضي، والصفات، ثم حل أسئلة متنوعة.'],
          grammar: 'First Conditional: If + Present Simple, will + base verb.\nIf students practise, they will feel confident.\nQuestion: What will you do if it rains?\nIf it rains, we will stay inside.',
          writing: 'Write three conditional sentences about a school event or a study plan.',
          speaking: 'Ask and answer “What will you do if…?” with two realistic situations.',
          key: 'Use the first conditional for a real possible future result.'
        },
        {
          id: 'grade8-eng-u6-l2', title: 'Imagine a Better Idea',
          passage: 'The class is imagining a new reading corner. If the room were larger, the students would add a small art wall. If they had more books, they would make a weekly reading club. Their classroom is not large and the book collection is small now, but the students can still begin with a few donated books and a simple timetable.',
          summary: 'يتخيل الطلاب تحسينات ممكنة لو توفرت ظروف مختلفة، ثم يختارون خطوة قابلة للتنفيذ الآن.',
          dialogue: 'Mina: What would you do if you had a free afternoon?\nTarek: I would read and draw.\nMina: Would you join a book club?\nTarek: Yes, if we had one at school.',
          vocabulary: 'imagine = يتخيل؛ would = سوف في الافتراض؛ donate = يتبرع؛ collection = مجموعة؛ timetable = جدول؛ realistic = واقعي؛ possibility = احتمال؛ idea = فكرة.',
          explain: ['يستخدم الشرط الثاني للتحدث عن موقف افتراضي أو غير مرجح في الحاضر: If I had more time, I would read.', 'التركيب: If + الماضي البسيط، would + الفعل الأساسي. لا تعني صيغة الماضي هنا بالضرورة أن الحدث انتهى؛ إنها تبين الافتراض.', 'توجد صيغ شرطية أخرى، لذلك اتبع صيغة كتاب مدرستك في الاختبار إذا حددها المعلم.', 'يمكن تحويل بعض الأفكار الافتراضية إلى خطوات صغيرة واقعية؛ فالنادي قد يبدأ بكتابين وموعد أسبوعي.'],
          grammar: 'Second Conditional: If + Past Simple, would + base verb.\nIf I had more time, I would read.\nIf the room were larger, we would add more shelves.\nReview: Photos are shared (passive); She was reading (past continuous); useful → more useful.',
          writing: 'Write one imaginary conditional sentence and one realistic action the class can take now.',
          speaking: 'Complete: “If I could improve one thing at school, I would …” Then explain why.',
          key: 'Use the second conditional to imagine a different present situation and its possible result.'
        }
      ],
      exercises: [
        { q: 'If we ___ now, we will finish before lunch.', options: ['start', 'will start', 'started', 'starting'], answer: 0, why: 'في الشرط الأول نستخدم المضارع بعد If.' },
        { q: 'If you practise, you ___ more confident.', options: ['feel', 'felt', 'will feel', 'would felt'], answer: 2, why: 'نتيجة الشرط الأول: will + الفعل الأساسي.' },
        { q: 'If I had a free day, I ___ visit a museum.', options: ['will', 'would', 'am', 'did'], answer: 1, why: 'الشرط الثاني يستخدم would للنتيجة الافتراضية.' },
        { q: 'Choose the correct second conditional.', options: ['If she has time, she would read.', 'If she had time, she would read.', 'If she will have time, she reads.', 'If she had time, she will read yesterday.'], answer: 1, why: 'If + past simple, would + base verb.' },
        { q: 'Choose the correct review sentence.', options: ['The photos is shared.', 'The photos are shared.', 'The photos are share.', 'The photos shared by.'], answer: 1, why: 'جمع photos مع are + التصريف الثالث shared.' },
        { q: 'Complete: “If they practise, they ___ (improve).”', answerText: 'If they practise, they will improve.', points: 2 },
        { q: 'Write one second conditional sentence about an imagined school improvement.', answerText: 'Example: If our school had a bigger library, we would add more books. Any correct second conditional sentence is accepted.', points: 2 }
      ]
    }
  ];

  var exams = [
    {
      id: 'grade8-eng-exam-1', title: 'Term 1 Practice Exam 1 — Units 1–3',
      note: 'اختبار تدريبي أصلي • 12 سؤالاً • تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'Look! Mona ___ a new post.', options: ['writes', 'is writing', 'wrote', 'write'], answer: 1, why: 'Look! تدل على حدث يحدث الآن.' },
        { q: 'We ___ our teacher at 2 p.m. It is arranged.', options: ['are meeting', 'met', 'meet yesterday', 'meets'], answer: 0, why: 'الترتيب المستقبلي المحدد يمكن التعبير عنه بالمضارع المستمر.' },
        { q: 'Choose the correct passive form: “The photo ___ online.”', options: ['is posted', 'are posted', 'is post', 'posts'], answer: 0, why: 'photo مفرد؛ نستخدم is + posted.' },
        { q: 'Students ___ share passwords with strangers.', options: ['should', 'mustn’t', 'are', 'did'], answer: 1, why: 'mustn’t تعبر عن منع ومخالفة قاعدة السلامة.' },
        { q: 'While they ___, the teacher entered.', options: ['talk', 'were talking', 'are talking', 'talks'], answer: 1, why: 'كان الحديث مستمراً عند دخول المعلم.' },
        { q: 'The past form of “feel” is:', options: ['feeled', 'felt', 'feels', 'feeling'], answer: 1, why: 'feel فعل غير منتظم وماضيه felt.' },
        { q: 'We stayed home ___ the weather was bad.', options: ['because', 'although', 'so', 'while'], answer: 0, why: 'because تقدم السبب.' },
        { q: 'Choose the correct present passive sentence.', options: ['Messages are saved.', 'Messages is saved.', 'Messages are save.', 'Messages saved.'], answer: 0, why: 'Messages جمع، فنستخدم are saved.' },
        { q: 'Change to passive: “People collect some online data.”', answerText: 'Some online data is collected.', points: 2 },
        { q: 'Complete: “While I ___ (study), my friend called.”', answerText: 'While I was studying, my friend called.', points: 2 },
        { q: 'Write one piece of advice for a safe digital footprint.', answerText: 'Example: You should check your privacy settings. Any correct safety tip is accepted.', points: 2 },
        { q: 'Write one present continuous sentence about a definite arrangement.', answerText: 'Example: I am meeting my friend at the library at 4 p.m. Any correct arrangement is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade8-eng-exam-2', title: 'Term 1 Practice Exam 2 — Units 4–6',
      note: 'اختبار تدريبي أصلي • 12 سؤالاً • تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'The artwork is ___ and colourful.', options: ['imaginative', 'imaginatively', 'imagination', 'imagine'], answer: 0, why: 'نحتاج صفة لوصف العمل الفني.' },
        { q: 'I like the picture ___ it tells a clear story.', options: ['because', 'although', 'so', 'while'], answer: 0, why: 'because تقدم سبب الإعجاب.' },
        { q: 'The comparative form of “easy” is:', options: ['easyer', 'easier', 'more easyer', 'the easiest'], answer: 1, why: 'easy تصبح easier.' },
        { q: 'This is ___ helpful study tip in the list.', options: ['more', 'the most', 'most than', 'the more'], answer: 1, why: 'التفضيل: the most helpful.' },
        { q: 'If we plan carefully, we ___ finish on time.', options: ['would', 'will', 'are', 'did'], answer: 1, why: 'الشرط الأول: If + present, will + base verb.' },
        { q: 'If I had more time, I ___ join the club.', options: ['will', 'would', 'am', 'was'], answer: 1, why: 'الشرط الثاني يستخدم would.' },
        { q: 'Choose the correct form after “would”.', options: ['would joining', 'would joins', 'would join', 'would to join'], answer: 2, why: 'بعد would يأتي الفعل الأساسي.' },
        { q: 'Choose the correct sentence.', options: ['If she will practise, she improve.', 'If she practises, she will improve.', 'If she practised, she will improved.', 'If she practise, she would improved.'], answer: 1, why: 'الشرط الأول: present simple بعد If ثم will + base verb.' },
        { q: 'Complete: “This idea is ___ (creative) than the first one.”', answerText: 'This idea is more creative than the first one.', points: 2 },
        { q: 'Write one sentence describing an artwork with an adjective and a reason.', answerText: 'Example: The sculpture is unusual because it uses recycled materials. Any correct sentence is accepted.', points: 2 },
        { q: 'Complete a first conditional sentence: “If I review my notes, …”', answerText: 'Example: If I review my notes, I will remember the ideas better.', points: 2 },
        { q: 'Write one second conditional sentence about an imagined situation.', answerText: 'Example: If I lived near a museum, I would visit it every month.', points: 2 }
      ]
    }
  ];

  function normalize(value) {
    return String(value || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim().toLowerCase();
  }

  function isTarget(type) {
    var stage = typeof currentStage === 'undefined' ? '' : String(currentStage || '');
    var grade = normalize(typeof currentGrade === 'undefined' ? '' : currentGrade);
    var subject = normalize(typeof currentSubject === 'undefined' ? '' : currentSubject);
    var term = typeof currentTerm === 'undefined' ? 1 : Number(currentTerm);
    return stage === 'prep' && /^الثاني/.test(grade) && /(انجلي|english)/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
  }

  function el(tag, text, className) {
    var node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function noticeBox() {
    var box = document.createElement('div');
    box.setAttribute('dir', 'rtl');
    box.style.cssText = 'background:#FFF8E1;border-right:4px solid #F9A825;border-radius:12px;padding:12px 14px;margin:8px 0 14px;line-height:1.8;color:#594300;font-size:13px;';
    box.appendChild(el('div', 'تنبيه منهجي: ' + NOTICE));
    var links = document.createElement('div');
    links.style.marginTop = '6px';
    var current = el('a', 'قائمة وحدات 2026/2027');
    current.href = 'https://aladwaa.com/ar/543431/%d9%85%d9%86%d9%87%d8%ac-%d8%a7%d9%84%d9%84%d8%ba%d8%a9-%d8%a7%d9%84%d8%a5%d9%86%d8%ac%d9%84%d9%8a%d8%b2%d9%8a%d8%a9-%d8%a7%d9%84%d8%b5%d9%81-%d8%a7%d9%84%d8%ab%d8%a7%d9%86%d9%8a-%d8%a7%d9%84%d8%a5/';
    current.target = '_blank'; current.rel = 'noopener';
    var book = el('a', 'كتاب الوزارة المتاح');
    book.href = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026/Prepratory/Prepratory2/Term1/StudentBook/English_Prp2_Tr1.pdf';
    book.target = '_blank'; book.rel = 'noopener';
    var portal = el('a', 'فهرس الوزارة');
    portal.href = 'https://lessons.moe.gov.eg/g8/t1/s6/th0';
    portal.target = '_blank'; portal.rel = 'noopener';
    links.appendChild(current); links.appendChild(el('span', '  •  ')); links.appendChild(book); links.appendChild(el('span', '  •  ')); links.appendChild(portal);
    box.appendChild(links);
    return box;
  }

  function makeCard(title, description, id, icon) {
    var a = document.createElement('a');
    a.href = '#'; a.className = 'content-item'; a.setAttribute('role', 'button'); a.setAttribute('aria-label', title);
    a.addEventListener('click', function (event) { event.preventDefault(); window.openGrade8EnglishItem(id); });
    a.appendChild(el('div', icon, 'content-item-icon'));
    var info = document.createElement('div'); info.className = 'content-item-info';
    info.appendChild(el('div', title, 'content-item-title'));
    info.appendChild(el('div', description, 'content-item-sub'));
    a.appendChild(info); a.appendChild(el('div', '‹', 'content-item-arrow'));
    return a;
  }

  function buildQuestions(questions, prefix) {
    var wrap = document.createElement('div');
    questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.setAttribute('dir', 'ltr');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;text-align:left;';
      var title = el('div', (index + 1) + '. ' + q.q);
      title.style.cssText = 'font-weight:700;line-height:1.8;margin-bottom:10px;'; block.appendChild(title);
      if (q.options) {
        var choices = document.createElement('div');
        q.options.forEach(function (choice, choiceIndex) {
          var label = document.createElement('label');
          label.style.cssText = 'display:flex;gap:8px;align-items:flex-start;padding:7px 3px;line-height:1.7;cursor:pointer;';
          var radio = document.createElement('input'); radio.type = 'radio'; radio.name = prefix + '-' + index; radio.value = String(choiceIndex); radio.style.marginTop = '6px';
          label.appendChild(radio); label.appendChild(el('span', choice)); choices.appendChild(label);
        });
        block.appendChild(choices);
        var result = el('div', ''); result.setAttribute('dir', 'rtl'); result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.7;text-align:right;'; block.appendChild(result);
        block._grade8EnglishQuestion = q; block._grade8EnglishResult = result;
      } else {
        var details = document.createElement('details'); details.style.cssText = 'margin-top:10px;text-align:right;'; details.appendChild(el('summary', 'عرض إجابة نموذجية'));
        var answer = el('div', q.answerText || ''); answer.setAttribute('dir', 'ltr'); answer.style.cssText = 'padding:8px 2px;line-height:1.9;text-align:left;'; details.appendChild(answer); block.appendChild(details);
      }
      wrap.appendChild(block);
    });
    var gradeButton = el('button', 'Check multiple-choice answers'); gradeButton.type = 'button'; gradeButton.style.cssText = 'background:#2E7D32;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    var score = el('div', ''); score.style.cssText = 'font-weight:700;color:#2E7D32;margin:6px 0 12px;';
    gradeButton.addEventListener('click', function () {
      var points = 0, total = 0;
      Array.prototype.forEach.call(wrap.children, function (item) {
        var q = item._grade8EnglishQuestion; if (!q || !q.options) return;
        total += 1;
        var chosen = item.querySelector('input[type="radio"]:checked'); var correct = !!chosen && Number(chosen.value) === q.answer;
        if (correct) points += 1;
        item._grade8EnglishResult.style.display = 'block'; item._grade8EnglishResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        item._grade8EnglishResult.textContent = (correct ? 'إجابة صحيحة. ' : 'راجع الإجابة. ') + q.why;
      });
      score.textContent = 'درجتك في أسئلة الاختيار من متعدد: ' + points + ' من ' + total;
    });
    wrap.insertBefore(gradeButton, wrap.firstChild); wrap.insertBefore(score, gradeButton.nextSibling); return wrap;
  }

  function readAloud(text) {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    window.speechSynthesis.cancel(); var utterance = new window.SpeechSynthesisUtterance(text); utterance.lang = 'en-GB'; utterance.rate = 0.88; window.speechSynthesis.speak(utterance);
  }

  function findItem(id) {
    for (var u = 0; u < units.length; u += 1) {
      for (var l = 0; l < units[u].lessons.length; l += 1) if (units[u].lessons[l].id === id) return { kind: 'lesson', unit: units[u], item: units[u].lessons[l] };
      if (units[u].id === id) return { kind: 'exercise', unit: units[u], item: units[u] };
    }
    for (var e = 0; e < exams.length; e += 1) if (exams[e].id === id) return { kind: 'exam', item: exams[e] };
    return null;
  }

  function openItem(id) {
    var found = findItem(id); if (!found) return;
    var body = document.getElementById('viewerBody'); var title = document.getElementById('viewerTitle'); if (!body || !title) return;
    body.textContent = ''; body.setAttribute('dir', 'rtl'); title.textContent = found.item.title; body.appendChild(noticeBox());
    if (found.kind === 'lesson') {
      var unitHeading = el('div', found.unit.title, 'english-unit-heading'); unitHeading.setAttribute('dir', 'ltr'); body.appendChild(unitHeading);
      var passageBox = document.createElement('div'); passageBox.style.cssText = 'background:#F5F7FA;border-left:4px solid #2E7D32;border-radius:12px;padding:14px;margin:12px 0;line-height:1.9;';
      passageBox.appendChild(el('strong', 'Original practice text', 'english-section-label'));
      var passage = el('p', found.item.passage); passage.setAttribute('dir', 'ltr'); passage.style.cssText = 'text-align:left;font-size:17px;line-height:1.9;white-space:pre-line;margin:8px 0;'; passageBox.appendChild(passage);
      passageBox.appendChild(el('div', 'ملخص بالعربية: ' + found.item.summary));
      if ('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined') {
        var audioButton = el('button', 'Listen to the text'); audioButton.type = 'button'; audioButton.style.cssText = 'background:#1565C0;color:#fff;border:0;border-radius:8px;padding:8px 12px;margin-top:8px;cursor:pointer;';
        audioButton.addEventListener('click', function () { readAloud(found.item.passage); }); passageBox.appendChild(audioButton);
      }
      body.appendChild(passageBox);
      if (found.item.dialogue) {
        var dialogue = document.createElement('div'); dialogue.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:12px;margin:12px 0;'; dialogue.appendChild(el('strong', 'Listen / Read the dialogue'));
        var dialogueText = el('p', found.item.dialogue); dialogueText.setAttribute('dir', 'ltr'); dialogueText.style.cssText = 'text-align:left;line-height:1.9;white-space:pre-line;'; dialogue.appendChild(dialogueText); body.appendChild(dialogue);
      }
      body.appendChild(el('h3', 'شرح ومفردات'));
      found.item.explain.forEach(function (paragraph) { var p = el('p', paragraph); p.setAttribute('dir', 'rtl'); p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;'; body.appendChild(p); });
      var vocab = document.createElement('div'); vocab.setAttribute('dir', 'rtl'); vocab.style.cssText = 'background:#FFF8E1;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;'; vocab.appendChild(el('strong', 'مفردات أساسية: ')); vocab.appendChild(el('span', found.item.vocabulary)); body.appendChild(vocab);
      var grammar = document.createElement('div'); grammar.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;'; grammar.appendChild(el('strong', 'Grammar: ' + found.unit.grammar));
      var grammarText = el('div', found.item.grammar); grammarText.setAttribute('dir', 'ltr'); grammarText.style.cssText = 'text-align:left;white-space:pre-line;margin-top:8px;'; grammar.appendChild(grammarText); body.appendChild(grammar);
      var tasks = document.createElement('div'); tasks.setAttribute('dir', 'rtl'); tasks.style.cssText = 'background:#F3E5F5;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;'; tasks.appendChild(el('strong', 'Writing: ')); tasks.appendChild(el('span', found.item.writing)); tasks.appendChild(el('div', 'Speaking: ' + found.item.speaking)); body.appendChild(tasks);
      var key = document.createElement('div'); key.setAttribute('dir', 'ltr'); key.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;text-align:left;'; key.appendChild(el('strong', 'Key idea: ')); key.appendChild(el('span', found.item.key)); body.appendChild(key);
      body.appendChild(el('h3', 'Quick practice')); body.appendChild(buildQuestions(found.unit.exercises.slice(0, 3), found.item.id));
    } else {
      var note = el('p', found.item.note || 'أجب بالإنجليزية ثم اضغط التصحيح. الأسئلة المقالية تعرض نموذج إجابة للمراجعة.'); note.setAttribute('dir', 'rtl'); body.appendChild(note);
      if (found.kind === 'exercise' && found.unit) { var heading = el('div', found.unit.title + ' — ' + found.unit.grammar, 'english-unit-heading'); heading.setAttribute('dir', 'ltr'); body.appendChild(heading); }
      body.appendChild(buildQuestions(found.kind === 'exercise' ? found.item.exercises : found.item.questions, found.item.id));
    }
    screenHistory.push(currentScreen); showScreen('viewerScreen');
  }

  function appendContent(type) {
    var list = document.getElementById('contentList'); if (!list) return;
    for (var i = list.children.length - 1; i >= 0; i -= 1) { var existing = list.children[i]; if (String(existing.className || '').split(/\s+/).indexOf('empty-state') >= 0) list.removeChild(existing); }
    var root = document.createElement('div'); root.className = 'grade8-english-original-content'; root.setAttribute('dir', 'rtl'); root.appendChild(noticeBox());
    if (type === 'lessons') {
      units.forEach(function (unit) { var heading = el('h3', unit.title + ' — ' + unit.grammar); heading.setAttribute('dir', 'ltr'); root.appendChild(heading); unit.lessons.forEach(function (lesson) { root.appendChild(makeCard(lesson.title, lesson.summary, lesson.id, '📘')); }); });
      root.appendChild(el('div', 'تتضمن كل وحدة نصاً أصلياً ومفردات وشرحاً للقواعد وحواراً وأنشطة كتابة ومحادثة.'));
    } else if (type === 'exercises') {
      units.forEach(function (unit) { root.appendChild(makeCard(unit.title + ' — Interactive Practice', unit.exercises.length + ' أسئلة متنوعة مع تصحيح فوري', unit.id, '✏️')); });
    } else if (type === 'exams') {
      exams.forEach(function (exam) { root.appendChild(makeCard(exam.title, exam.note, exam.id, '📝')); });
    }
    list.appendChild(root);
  }

  window.openGrade8EnglishItem = openItem;
  var previousOpenContent = window.openContent;
  if (typeof previousOpenContent === 'function' && !previousOpenContent.__grade8EnglishWrapped) {
    var wrappedOpenContent = async function (type, termNumber, termName) {
      var result = await previousOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrappedOpenContent.__grade8EnglishWrapped = true; window.openContent = wrappedOpenContent;
  }
})();
