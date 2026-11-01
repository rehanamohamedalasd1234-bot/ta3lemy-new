// Original supplementary content for English Prep 1, Term 1, Egypt.
// Unit names and grammar scope follow the available Ministry student-book scope and the 2026/2027 unit list.
(function () {
  'use strict';

  var NOTICE = 'عناوين الوحدات الست هنا تطابق قائمة منهج 2026/2027 المنشورة، كما تظهر في كتاب الوزارة المتاح للترم الأول. صفحة دروس الوزارة قد تعرض فهرساً أقدم مختلفاً؛ راجع طبعة كتاب مدرستك عند أي اختلاف. النصوص والأنشطة في هذه الإضافة أصلية ومساندة وليست نقلاً من الكتاب.';

  var units = [
    {
      id: 'grade7-eng-u1', title: 'Unit 1: Life in a Digital World', grammar: 'Present Simple + adverbs of frequency',
      lessons: [
        {
          id: 'grade7-eng-u1-l1', title: 'A Day in My Digital Life',
          passage: 'Mariam uses technology for learning and communication. She usually checks her school website in the morning. She sometimes reads an e-book on her tablet, but she never shares her password. In the evening, she puts her laptop away and talks with her family. Technology helps Mariam, but she also makes time for sleep, sport and friends.',
          summary: 'تستخدم مريم التكنولوجيا للتعلم والتواصل، وتحافظ على كلمة مرورها، وتوازن بين وقت الشاشة والراحة والأسرة.',
          dialogue: 'Omar: How often do you use your tablet for school?\nMariam: I usually use it after lunch. I sometimes download an e-book.\nOmar: Do you share your password?\nMariam: No, I never share it.',
          vocabulary: 'technology = التكنولوجيا؛ digital = رقمي؛ website = موقع إلكتروني؛ e-book = كتاب إلكتروني؛ tablet = جهاز لوحي؛ download = يحمّل؛ password = كلمة مرور؛ screen = شاشة.',
          explain: ['النص يصف عادات يومية في استخدام الأجهزة، ويميّز بين الاستخدام المفيد والإفراط في مشاركة المعلومات.', 'تُستخدم كلمات التكرار لوصف العادات: always دائماً، usually عادةً، often غالباً، sometimes أحياناً، never أبداً. تأتي غالباً قبل الفعل الرئيسي، وبعد فعل be.', 'المضارع البسيط يصف العادات والحقائق. مع he أو she أو it نضيف غالباً s للفعل: She checks. ومع I أو you أو we أو they نستخدم الفعل دون s: They check.', 'احمِ بياناتك: لا تشارك كلمة المرور، واستخدم مواقع موثوقة، وخذ استراحة من الشاشة.'],
          grammar: 'Present Simple: I use a tablet every day. / She uses a tablet every day.\nFrequency adverb: I often read online. / He is usually careful.\nفي السؤال نستخدم Do مع I/you/we/they، وDoes مع he/she/it: Does she use an e-book?',
          writing: 'Write five sentences about your digital routine. Use two frequency adverbs and one online-safety rule.',
          speaking: 'Tell a partner which device you use for learning and how often you use it.',
          key: 'Use the present simple for routines. Place frequency adverbs before most main verbs, and use technology safely.'
        },
        {
          id: 'grade7-eng-u1-l2', title: 'How We Use Technology',
          passage: 'Our class uses a smartboard to study maps and pictures. We search for information on trusted websites and send an email when we need to ask a teacher a question. At home, I read on my laptop in night mode. I do not believe every message I see on social media. I check the source before I share a post.',
          summary: 'يوضح النص أدوات التقنية في التعلم، ويؤكد التحقق من مصدر الرسائل قبل مشاركتها.',
          dialogue: 'Nadia: I found a science page online.\nYoussef: Is it from a trusted website?\nNadia: Yes. I checked the name of the source before I shared it.',
          vocabulary: 'smartboard = سبورة ذكية؛ online = متصل بالإنترنت؛ email = بريد إلكتروني؛ search = يبحث؛ social media = وسائل التواصل الاجتماعي؛ trusted = موثوق؛ source = مصدر؛ night mode = الوضع الليلي.',
          explain: ['تساعد الأجهزة الرقمية في البحث والقراءة والتواصل، لكن المستخدم مسؤول عن اختيار المصادر وحماية خصوصيته.', 'في الكتابة الوظيفية، يتضمن البريد الإلكتروني تحية قصيرة، وسبب الرسالة، وطلباً واضحاً، وخاتمة مهذبة.', 'قبل مشاركة خبر أو صورة، تحقق من الجهة الناشرة والتاريخ، ولا تنشر بيانات أو صور الآخرين دون إذن.', 'يمكن أن تكون جملة العادة مثبتة أو منفية: We use the smartboard. / We do not share passwords.'],
          grammar: 'Negative Present Simple: I/you/we/they do not (don’t) + base verb. He/she/it does not (doesn’t) + base verb: He doesn’t share his password.\nQuestion: Do you use email? / Does she read online?',
          writing: 'Write a short email to a classmate. Tell them how you use technology for school and give one safety tip.',
          speaking: 'Ask and answer: “How do you check if an online source is trusted?”',
          key: 'Technology can support learning when we choose reliable sources and communicate politely.'
        }
      ],
      exercises: [
        { q: 'Mariam ___ an e-book after school.', options: ['read', 'reads', 'reading', 'is read'], answer: 1, why: 'مع she نضيف s للفعل في المضارع البسيط.' },
        { q: 'Which word means “sometimes, but not always”?', options: ['never', 'usually', 'sometimes', 'always'], answer: 2, why: 'sometimes تعني أحياناً.' },
        { q: 'Choose the correct sentence.', options: ['He usually checks the website.', 'He usually check the website.', 'He checks usually the website always.', 'He is usually check the website.'], answer: 0, why: 'الصياغة الصحيحة: He + adverb + verb-s.' },
        { q: '___ you use a tablet for school?', options: ['Does', 'Do', 'Are', 'Is'], answer: 1, why: 'نستخدم Do مع you.' },
        { q: 'Choose a safe online action.', options: ['Share your password', 'Check the source before sharing', 'Open every link', 'Post a friend’s photo without asking'], answer: 1, why: 'التحقق من المصدر قبل المشاركة سلوك آمن.' },
        { q: 'Rewrite: “She share her password.” Use the correct present simple form.', answerText: 'She shares her password.', points: 2 },
        { q: 'Write one sentence about a device you use, with an adverb of frequency.', answerText: 'Example: I often use a tablet for reading. Any correct sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade7-eng-u2', title: 'Unit 2: Learning to Learn', grammar: 'Present Continuous + can / can’t',
      lessons: [
        {
          id: 'grade7-eng-u2-l1', title: 'My Learning Journey',
          passage: 'Salma is learning how to study in a new way. She is making a mind map for her science lesson. Her friend is reading the notes aloud, and another student is doing a small experiment. Salma can remember ideas when she connects them with pictures. She can explain her plan to the group, but she cannot finish every task in one day.',
          summary: 'تجرب سلمى أكثر من طريقة للتعلم، وتستخدم خريطة ذهنية وتعمل ضمن مجموعة.',
          dialogue: 'Hany: What are you doing, Salma?\nSalma: I am making a mind map. It helps me see the main ideas.\nHany: Can you show me how to start?\nSalma: Yes, I can.',
          vocabulary: 'learning = تعلّم؛ mind map = خريطة ذهنية؛ visual = بصري؛ auditory = سمعي؛ experiment = تجربة؛ explain = يشرح؛ remember = يتذكر؛ plan = خطة.',
          explain: ['تختلف طرائق التعلم؛ فقد يستفيد الطالب من الصور أو الاستماع أو الحركة والتجربة. ويمكن الجمع بين أكثر من طريقة.', 'المضارع المستمر يصف ما يحدث الآن أو في هذه الفترة. يتكون من am/is/are + فعل ينتهي بـ ing.', 'نستخدم can للقدرة، وبعدها الفعل في صورته الأساسية دون to: She can explain. ونستخدم can’t لعدم القدرة.', 'خريطة الأفكار ترتب الفكرة الرئيسة والأفكار المرتبطة بها، والتجربة تساعد على ملاحظة النتيجة عملياً.'],
          grammar: 'Present Continuous: I am reading. / She is reading. / They are reading.\nCan / can’t + base verb: I can draw a mind map. / He can’t hear the audio.\nالسؤال: What are you doing? / Can you help me?',
          writing: 'Write four sentences about what you are doing to study today. Add one thing you can do well.',
          speaking: 'Describe a study method that helps you remember new information.',
          key: 'Use am/is/are + verb-ing for actions happening now. Use can/can’t + base verb for ability.'
        },
        {
          id: 'grade7-eng-u2-l2', title: 'Learning Challenges and Solutions',
          passage: 'The students are preparing for a short science quiz. Ali is finding the new words difficult, so he is writing each word on a card. Huda is studying with a partner and asking questions. They can help each other, but they cannot learn well when they are tired. They are taking a short break and then they are continuing their revision.',
          summary: 'يتعامل الطلاب مع صعوبة المفردات بخطة عملية، ويعرفون متى يحتاجون إلى استراحة.',
          dialogue: 'Ali: I can’t remember these words.\nHuda: Let’s make word cards. I am writing the first word now.\nAli: Great. Can you test me after the break?\nHuda: Of course.',
          vocabulary: 'challenge = تحدٍّ؛ solution = حل؛ card = بطاقة؛ partner = زميل؛ question = سؤال؛ break = استراحة؛ revise = يراجع؛ continue = يستمر.',
          explain: ['عند مواجهة صعوبة، حدد ما لا تفهمه، ثم اختر خطوة صغيرة مثل تقسيم الكلمات أو طلب شرح أو التدريب مع زميل.', 'الجملة “Ali is finding the words difficult” تصف وضعاً جارياً. والفعل find أضيفت إليه ing بعد is.', 'لا تعني الاستقلالية أن يتعلم الطالب وحده دائماً؛ فالسؤال والتعاون من وسائل التعلم.', 'الاستراحة القصيرة المنظمة تساعد على استعادة التركيز، مع العودة إلى الخطة بعد انتهائها.'],
          grammar: 'النفي في المضارع المستمر: am not / isn’t / aren’t + verb-ing.\nQuestion: Are they revising? — Yes, they are. / No, they aren’t.\nCan I ask a question? — Yes, you can.',
          writing: 'Write a short learning plan for one school subject. Include a challenge and a solution.',
          speaking: 'Role-play: tell a friend about a learning challenge and suggest one helpful solution.',
          key: 'Name a learning challenge and choose a practical solution. Ask for help and plan short study steps.'
        }
      ],
      exercises: [
        { q: 'Look! The students ___ an experiment.', options: ['do', 'does', 'are doing', 'did'], answer: 2, why: 'Look! تدل على حدث جارٍ؛ نستخدم are + verb-ing.' },
        { q: 'Mona ___ draw a mind map, but she can’t use the printer.', options: ['can', 'is', 'does', 'did'], answer: 0, why: 'بعد can نستخدم الفعل الأساسي draw.' },
        { q: 'Choose the correct form.', options: ['He is make cards.', 'He making cards.', 'He is making cards.', 'He are making cards.'], answer: 2, why: 'مع he نستخدم is + الفعل مع ing.' },
        { q: 'Which sentence describes something happening now?', options: ['They study every day.', 'They are studying now.', 'They studied yesterday.', 'They will study tomorrow.'], answer: 1, why: 'are studying now تصف حدثاً جارياً.' },
        { q: 'Complete: “I can ___ the main idea.”', options: ['explains', 'explaining', 'explain', 'to explain'], answer: 2, why: 'يأتي الفعل الأساسي بعد can.' },
        { q: 'Correct the sentence: “She are reading her notes.”', answerText: 'She is reading her notes.', points: 2 },
        { q: 'Write one sentence about what your class is doing now.', answerText: 'Example: Our class is learning English now. Any correct present continuous sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade7-eng-u3', title: 'Unit 3: Role Models', grammar: 'Past Simple: regular and irregular verbs',
      lessons: [
        {
          id: 'grade7-eng-u3-l1', title: 'An Egyptian Role Model',
          passage: 'Ahmed Zewail was an Egyptian scientist. He studied chemistry and worked with great curiosity. His research helped people understand very fast chemical reactions. In 1999, he won the Nobel Prize in Chemistry for his work in femtochemistry. His story reminds students that careful study and determination can lead to important achievements.',
          summary: 'نبذة أصلية موجزة عن العالم المصري أحمد زويل، تركز على الاجتهاد والفضول العلمي.',
          dialogue: 'Laila: Who is a role model you admire?\nKarim: I admire Ahmed Zewail. He studied chemistry and won the Nobel Prize in 1999.\nLaila: What can students learn from his story?\nKarim: They can be curious and work hard.',
          vocabulary: 'role model = قدوة؛ scientist = عالم؛ research = بحث؛ curiosity = فضول معرفي؛ achievement = إنجاز؛ determined = مثابر؛ award = جائزة؛ inspire = يُلهم.',
          explain: ['القدوة شخص نتعلم من صفاته أو أفعاله النافعة، مثل الأمانة والمثابرة وخدمة الآخرين.', 'يستخدم النص الماضي البسيط للحديث عن أحداث انتهت. الأفعال المنتظمة تأخذ غالباً ed: study → studied, work → worked.', 'بعض الأفعال غير منتظمة: win → won, go → went, meet → met. ينبغي تعلمها من خلال أمثلة ومراجعة.', 'تأكد من صحة الحقائق عند كتابة نبذة عن شخصية حقيقية، ولا تضف إنجازاً أو تاريخاً غير موثق.'],
          grammar: 'Past Simple: He worked hard. / He studied chemistry.\nIrregular verbs: win → won; go → went; meet → met.\nNegative: He didn’t win a prize. (بعد didn’t نستخدم الفعل الأساسي.)\nQuestion: Did he study science? — Yes, he did.',
          writing: 'Write a short biography of a person you admire. Include two past simple verbs and one quality.',
          speaking: 'Talk about a role model and name one quality you would like to learn from them.',
          key: 'Use past simple for finished events. Check facts when writing about a real person.'
        },
        {
          id: 'grade7-eng-u3-l2', title: 'People Who Make a Difference',
          passage: 'A good role model does not need to be famous. Last year, Mr Samir, a school volunteer, started a small reading club. He invited students to choose books and share ideas. Many students joined the club and helped younger learners. Mr Samir listened carefully and encouraged everyone. His kind actions made the school community stronger.',
          summary: 'قد يكون القدوة شخصاً في المجتمع المحلي؛ المثال يصف متطوعاً أنشأ نادياً للقراءة.',
          dialogue: 'Mona: What did Mr Samir start last year?\nTarek: He started a reading club.\nMona: Did students help younger learners?\nTarek: Yes, they did.',
          vocabulary: 'volunteer = متطوع؛ community = مجتمع؛ invite = يدعو؛ join = ينضم؛ encourage = يشجع؛ younger = أصغر سناً؛ kind = لطيف؛ brave = شجاع.',
          explain: ['تظهر القيادة في الإصغاء وتشجيع المشاركة وتحمل المسؤولية، وليس في إعطاء الأوامر فقط.', 'في السؤال بالماضي نستخدم Did + الفاعل + الفعل الأساسي: Did they join? وفي النفي نستخدم didn’t + الفعل الأساسي.', 'من صفات القدوة: الصدق، والشجاعة، واللطف، والعناية بالآخرين. اختر صفة وادعمها بمثال.', 'يمكن أن يكون للعمل الصغير أثر متكرر؛ فنادي القراءة مثلاً يساعد على تبادل المعرفة وبناء الثقة.'],
          grammar: 'Past questions: Did she invite the students? — Yes, she did.\nPast negative: They didn’t join at first.\nBe in the past: He was kind. / They were helpful.',
          writing: 'Write a paragraph about someone in your community who helps others. Say what they did.',
          speaking: 'In pairs, ask: “What did this person do?” and “How did the community benefit?”',
          key: 'Actions such as helping, listening and encouraging others can make someone a role model.'
        }
      ],
      exercises: [
        { q: 'Yesterday, Nada ___ her friend with a project.', options: ['help', 'helps', 'helped', 'is helping'], answer: 2, why: 'Yesterday تدل على الماضي؛ help فعل منتظم يصبح helped.' },
        { q: 'The past form of “go” is:', options: ['goed', 'went', 'goes', 'going'], answer: 1, why: 'go فعل غير منتظم وماضيه went.' },
        { q: 'Ahmed Zewail ___ the Nobel Prize in Chemistry in 1999.', options: ['wins', 'won', 'is winning', 'win'], answer: 1, why: 'الحدث وقع في الماضي؛ الماضي من win هو won.' },
        { q: 'Choose the correct question.', options: ['Did they joined the club?', 'Did they join the club?', 'Do they joined the club?', 'Were they join the club?'], answer: 1, why: 'بعد Did نستخدم الفعل الأساسي join.' },
        { q: 'Choose the correct negative sentence.', options: ['She didn’t helped me.', 'She don’t help me.', 'She didn’t help me.', 'She not helped me.'], answer: 2, why: 'بعد didn’t يأتي الفعل الأساسي دون ed.' },
        { q: 'Write the past form: “study”.', answerText: 'studied', points: 2 },
        { q: 'Write one sentence about something a helpful person did.', answerText: 'Example: My teacher helped me with a difficult lesson. Any correct past simple sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade7-eng-u4', title: 'Unit 4: Smart Choices', grammar: 'First Conditional + should / shouldn’t',
      lessons: [
        {
          id: 'grade7-eng-u4-l1', title: 'Think Before You Choose',
          passage: 'Nour received a message with a link to a prize. She did not click it at once. She checked the sender and asked her older sister for advice. The message was not from a trusted website, so Nour deleted it. If you think before you act, you will avoid many online risks. A wise choice protects you and other people.',
          summary: 'تفكر نور قبل فتح رابط مجهول، وتطلب النصيحة وتختار التصرف الآمن.',
          dialogue: 'Nour: Should I open this link?\nSister: You shouldn’t open links from unknown senders.\nNour: What should I do?\nSister: Check the source and delete the message if it is unsafe.',
          vocabulary: 'choice = اختيار؛ decision = قرار؛ risk = خطر؛ wise = حكيم؛ careless = مهمل؛ sender = مُرسِل؛ consequence = نتيجة؛ responsible = مسؤول.',
          explain: ['يساعد التوقف قبل التصرف على ملاحظة الخيارات والنتائج والمخاطر. اسأل: ما الدليل؟ ومن قد يتأثر بقراري؟', 'تستخدم should للنصيحة، وبعدها الفعل الأساسي: You should ask. وتستخدم shouldn’t للنصيحة بعدم فعل شيء.', 'في الشرط الأول نستخدم If + المضارع البسيط، ثم will + الفعل الأساسي للنتيجة المتوقعة: If you check, you will feel safer.', 'القرار المسؤول يوازن بين الفائدة والضرر، ويطلب المساعدة عند الحاجة.'],
          grammar: 'First Conditional: If + Present Simple, will + base verb.\nIf you check the link, you will make a safer choice.\nAdvice: You should ask an adult. / You shouldn’t share private information.',
          writing: 'Write three pieces of advice for a friend who receives a suspicious online message.',
          speaking: 'Discuss a choice: What may happen if someone shares a password?',
          key: 'Use should/shouldn’t for advice and the first conditional for a possible future result.'
        },
        {
          id: 'grade7-eng-u4-l2', title: 'Decisions and Consequences',
          passage: 'The class wanted to buy new plants for its room. The students had two choices: spend all their money on large plants or buy smaller plants and keep some money for soil. They discussed the cost and asked the science teacher for advice. If they choose the second plan, they will have enough money to care for the plants. They made a fair decision together.',
          summary: 'يقارن الطلاب بين بدائل ونتائجها قبل اتخاذ قرار جماعي.',
          dialogue: 'Omar: We should compare the cost first.\nSalma: Good idea. If we keep some money, we will buy soil too.\nOmar: Then the plants will grow well.\nSalma: Let’s agree on the plan.',
          vocabulary: 'compare = يقارن؛ cost = تكلفة؛ fair = عادل؛ improve = يحسن؛ outcome = نتيجة؛ promise = وعد؛ agree = يوافق؛ consequence = عاقبة أو نتيجة.',
          explain: ['تؤثر القرارات في أشخاص وموارد، لذلك من المفيد جمع المعلومات ثم مقارنة البدائل.', 'تُستخدم جملة الشرط الأول للتوقع: If we save money, we will buy soil. لا نضع will عادةً بعد If في هذا التركيب.', 'عند الاختلاف، اشرح سبب اختيارك واستمع إلى الآخرين. القرار العادل لا يتجاهل احتياجات المشاركين.', 'بعد القرار نتحمل مسؤوليته ونراجع النتيجة لنتعلم منها.'],
          grammar: 'If + present: If the students choose this plan, ...\nResult with will: ... they will have enough money.\nShould + base verb: We should compare the prices.\nShouldn’t + base verb: We shouldn’t waste the budget.',
          writing: 'Describe a small decision you made. Write one possible consequence using “If …, … will …”.',
          speaking: 'Role-play a short conversation: suggest two choices and agree on one.',
          key: 'Compare options, consider consequences and explain your reasons respectfully.'
        }
      ],
      exercises: [
        { q: 'If you ___ the source, you will make a safer choice.', options: ['check', 'checks', 'checked', 'will check'], answer: 0, why: 'في الشرط الأول يأتي المضارع البسيط بعد If.' },
        { q: 'You ___ share your password with strangers.', options: ['should', 'shouldn’t', 'are', 'did'], answer: 1, why: 'shouldn’t تقدم نصيحة بعدم مشاركة كلمة المرور.' },
        { q: 'Choose the correct sentence.', options: ['If it rains, we will stay inside.', 'If it will rain, we stay inside.', 'If it rains, we stayed inside.', 'If rain, we will staying inside.'], answer: 0, why: 'If + مضارع بسيط، ثم will + فعل أساسي.' },
        { q: 'What should you do with an unknown link?', options: ['Open it quickly', 'Check the sender first', 'Send your password', 'Share it with everyone'], answer: 1, why: 'تحقق من المرسل والمصدر قبل التعامل مع الرابط.' },
        { q: 'Which is good advice?', options: ['You should compare the choices.', 'You should to compare choices.', 'You shouldn’t to ask.', 'You should compares choices.'], answer: 0, why: 'بعد should نستخدم الفعل الأساسي مباشرة.' },
        { q: 'Complete: “If I study tonight, I ___ (feel) ready tomorrow.”', answerText: 'If I study tonight, I will feel ready tomorrow.', points: 2 },
        { q: 'Write one piece of advice using “shouldn’t”.', answerText: 'Example: You shouldn’t share private information online. Any grammatically correct piece of advice is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade7-eng-u5', title: 'Unit 5: Future Dreams', grammar: 'Going to for plans and intentions',
      lessons: [
        {
          id: 'grade7-eng-u5-l1', title: 'Discover Your Future',
          passage: 'Yassin enjoys solving problems and building models. He is going to learn more about engineering. This year, he is going to join the school science club and practise using simple design tools. His sister is going to explore jobs in medicine because she enjoys helping people. They know that a dream needs a plan, useful skills and steady effort.',
          summary: 'يكتشف ياسين اهتماماته ويضع خطوات لتعلم مهارات مرتبطة بمهنته المستقبلية.',
          dialogue: 'Teacher: What are you going to do this year?\nYassin: I am going to join the science club.\nTeacher: Why?\nYassin: I want to develop my problem-solving skills.',
          vocabulary: 'future = مستقبل؛ dream = حلم؛ goal = هدف؛ ambition = طموح؛ skill = مهارة؛ profession = مهنة؛ explore = يستكشف؛ develop = يطوّر؛ opportunity = فرصة.',
          explain: ['يساعد التعرف إلى الاهتمامات والمهارات على استكشاف مسارات مهنية متعددة، ولا يلزم أن يختار الطالب مهنة نهائية في هذا العمر.', 'نستخدم be going to للتعبير عن خطة أو نية مستقبلية. يتغير فعل be بحسب الفاعل: I am, he/she is, we/they are.', 'بعد going to نستخدم الفعل الأساسي: She is going to explore science. لا نضيف s أو ing إلى الفعل بعد to.', 'الهدف الجيد يمكن تقسيمه إلى خطوات قصيرة، مثل القراءة عن مجال، ثم تجربة نشاط مناسب، ثم مراجعة التقدم.'],
          grammar: 'Be going to + base verb: I am going to practise. / He is going to learn. / They are going to explore.\nQuestion: What are you going to do?\nNegative: She isn’t going to stop learning.',
          writing: 'Write a paragraph about one skill you are going to develop and three steps you will take.',
          speaking: 'Tell your partner about a future job you want to explore and why it interests you.',
          key: 'Use am/is/are going to + base verb for plans and intentions.'
        },
        {
          id: 'grade7-eng-u5-l2', title: 'My Plan for a Future Career',
          passage: 'Farida wants to work with animals in the future. She is going to read about veterinarians and ask a family friend about the job. She is also going to improve her science and communication skills. Farida knows that plans may change as people learn more. For now, she is choosing a clear next step: she is going to care for the school garden and observe the insects there.',
          summary: 'تربط فريدة بين اهتمامها بالحيوانات وخطوات واقعية للتعلم والاستكشاف.',
          dialogue: 'Farida: Are you going to choose a career now?\nMina: I am going to explore two or three jobs first.\nFarida: That sounds useful.\nMina: Yes, I am going to ask questions and learn about the skills each job needs.',
          vocabulary: 'career = مسار مهني؛ veterinarian = طبيب بيطري؛ talent = موهبة؛ passion = شغف؛ training = تدريب؛ achieve = يحقق؛ participate = يشارك؛ path = مسار.',
          explain: ['تتضمن الخطة خطوة قابلة للتنفيذ ووقتاً مناسباً ووسيلة لملاحظة التقدم.', 'يمكن للطالب أن يستكشف أكثر من مهنة من خلال القراءة أو سؤال أصحاب الخبرة أو المشاركة في نشاط مدرسي آمن.', 'قد تتغير الأهداف عندما يكتسب الإنسان معرفة جديدة؛ تغيير الخطة بعد التفكير ليس فشلاً.', 'تستخدم الأسئلة المهذبة لجمع المعلومات: What skills does this job need? / How can I learn more?'],
          grammar: 'Questions with going to: Is she going to read about the job? — Yes, she is.\nAre they going to join the club? — No, they aren’t.\nShort answers keep the be verb: Yes, I am. / No, I’m not.',
          writing: 'Write a simple career mind map: interest, one possible job, two useful skills and one next step.',
          speaking: 'Interview a partner about a goal. Ask what they are going to learn or practise.',
          key: 'Explore interests and turn a future goal into a flexible, practical plan.'
        }
      ],
      exercises: [
        { q: 'I ___ going to join the school club.', options: ['am', 'is', 'are', 'be'], answer: 0, why: 'نستخدم am مع I.' },
        { q: 'They are going to ___ a new skill.', options: ['practise', 'practises', 'practising', 'practised'], answer: 0, why: 'بعد going to يأتي الفعل الأساسي.' },
        { q: 'Choose the correct question.', options: ['What you are going to learn?', 'What are you going to learn?', 'What are going learn you?', 'What do you going to learn?'], answer: 1, why: 'الترتيب: What + are + you + going to + verb.' },
        { q: 'Mona ___ going to read about medicine.', options: ['am', 'is', 'are', 'do'], answer: 1, why: 'نستخدم is مع Mona/she.' },
        { q: 'Which is a useful first step for a future goal?', options: ['Choose a skill to practise', 'Wait without a plan', 'Stop asking questions', 'Assume plans never change'], answer: 0, why: 'تقسيم الهدف إلى خطوة عملية يساعد على البدء.' },
        { q: 'Complete: “We ___ going to ___ (visit) the science club.”', answerText: 'We are going to visit the science club.', points: 2 },
        { q: 'Write one future plan with “going to”.', answerText: 'Example: I am going to practise English this week. Any correct “be going to” sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade7-eng-u6', title: 'Unit 6: Global Citizens', grammar: 'must / mustn’t + review of term grammar',
      lessons: [
        {
          id: 'grade7-eng-u6-l1', title: 'Being a Global Citizen',
          passage: 'Students in one school can help their local community and care about the wider world. They must respect different cultures and listen to one another. They must protect shared places, such as parks and beaches. They mustn’t leave litter or waste water. Small actions matter when many people work together and take responsibility.',
          summary: 'يربط النص بين احترام الثقافات والعناية بالمكان والمسؤولية الفردية والجماعية.',
          dialogue: 'Maha: What must we do to keep the park clean?\nAdel: We must use the bins. We mustn’t leave plastic on the grass.\nMaha: Can we invite other students to help?\nAdel: Yes. We can make a simple poster.',
          vocabulary: 'global citizen = مواطن عالمي؛ culture = ثقافة؛ diversity = تنوع؛ respect = يحترم؛ rights = حقوق؛ duties = واجبات؛ volunteer = متطوع؛ environment = بيئة؛ responsibility = مسؤولية.',
          explain: ['المواطنة العالمية تعني إدراك أن الأفعال المحلية قد تؤثر في الناس والبيئة، مع احترام حقوق الآخرين وثقافاتهم.', 'نستخدم must للتعبير عن واجب أو ضرورة، وبعدها الفعل الأساسي: We must protect nature.', 'نستخدم mustn’t للتحذير من فعل ممنوع أو ضار: You mustn’t drop litter. وهي أقوى من مجرد عدم الحاجة إلى الفعل.', 'راجع الأزمنة من موضوعات الترم: المضارع البسيط للعادات، والمضارع المستمر لما يحدث الآن، والماضي البسيط للأحداث المنتهية، وgoing to للخطط.'],
          grammar: 'Obligation: We must respect people.\nProhibition: We mustn’t waste water.\nAfter must / mustn’t, use the base verb: must help, mustn’t throw.\nTense review: She uses (routine); She is using (now); She used (past); She is going to use (plan).',
          writing: 'Write a short message about being a responsible citizen. Include two rules with must or mustn’t.',
          speaking: 'Suggest two actions students can take to improve their school or local environment.',
          key: 'Use must for obligations and mustn’t for prohibited actions. Respect, participation and care for the environment are shared responsibilities.'
        },
        {
          id: 'grade7-eng-u6-l2', title: 'Let’s Make a Difference',
          passage: 'Our school is planning a community day. Some students are going to clean the garden, and others are going to make signs about saving water. A volunteer is going to explain how to sort paper and plastic. Everyone must work safely and respect the school rules. Students mustn’t touch tools without an adult. The class hopes its project will encourage more people to participate.',
          summary: 'يخطط الطلاب لمبادرة مدرسية بأدوار واضحة وقواعد تحافظ على السلامة.',
          dialogue: 'Teacher: What are you going to do on community day?\nStudent: I am going to make a water-saving poster.\nTeacher: What must you remember?\nStudent: We must follow safety rules and mustn’t use tools without permission.',
          vocabulary: 'community = مجتمع؛ participate = يشارك؛ improve = يحسّن؛ encourage = يشجع؛ sort = يفرز؛ save = يوفر؛ safely = بأمان؛ shared = مشترك.',
          explain: ['تبدأ المبادرة من حاجة واضحة، ثم توزع الأدوار وتحدد المواد والقواعد وطريقة معرفة أثر العمل.', 'الجملة “Students are going to clean” تتحدث عن خطة، أما “Students must work safely” فتذكر واجباً.', 'استخدم mustn’t مع الفعل الأساسي دون to أو s: mustn’t touch، وليس mustn’t touches.', 'عند العمل التطوعي، احترم حقوق الناس، وخذ موافقة المسؤول، واتبع قواعد السلامة.'],
          grammar: 'Plans: They are going to make signs.\nRules: They must follow instructions. / They mustn’t touch the tools.\nRoutine: The club meets every week.\nPast: Last year, students planted trees.',
          writing: 'Write a short plan for a school volunteer activity. Say what students are going to do and list two safety rules.',
          speaking: 'In pairs, design a small project and agree on its roles and safety rules.',
          key: 'Use future plans to explain what you intend to do and must/mustn’t to state safety rules.'
        }
      ],
      exercises: [
        { q: 'We ___ respect other people’s cultures.', options: ['must', 'mustn’t', 'are', 'did'], answer: 0, why: 'must تعبر عن واجب.' },
        { q: 'You ___ leave litter in the park.', options: ['must', 'mustn’t', 'can', 'are'], answer: 1, why: 'mustn’t تستخدم لمنع سلوك ضار.' },
        { q: 'Choose the correct sentence.', options: ['She musts help.', 'She must to help.', 'She must help.', 'She must helping.'], answer: 2, why: 'بعد must يأتي الفعل الأساسي دون s أو to.' },
        { q: '“They are going to make a poster” describes:', options: ['a past event', 'a future plan', 'a daily routine', 'an ability'], answer: 1, why: 'be going to تعبر عن خطة مستقبلية.' },
        { q: '“Last year, our class planted flowers” uses:', options: ['Present Continuous', 'Past Simple', 'First Conditional', 'must'], answer: 1, why: 'Last year يدل على الماضي البسيط.' },
        { q: 'Correct the sentence: “People mustn’t wastes water.”', answerText: 'People mustn’t waste water.', points: 2 },
        { q: 'Write one rule for a responsible global citizen using “must”.', answerText: 'Example: A responsible citizen must respect other people. Any correct rule is accepted.', points: 2 }
      ]
    }
  ];

  var exams = [
    {
      id: 'grade7-eng-exam-1', title: 'Term 1 Practice Exam 1 — Units 1–3',
      note: 'اختبار تدريبي أصلي • 12 سؤالاً • تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'Nadia ___ her school email every morning.', options: ['check', 'checks', 'checking', 'is check'], answer: 1, why: 'مع Nadia/she نضيف s في المضارع البسيط.' },
        { q: 'Which adverb means “not at any time”?', options: ['often', 'sometimes', 'usually', 'never'], answer: 3, why: 'never تعني أبداً.' },
        { q: '___ they use the smartboard in class?', options: ['Does', 'Do', 'Are', 'Did'], answer: 1, why: 'نستخدم Do مع they.' },
        { q: 'The students ___ a mind map now.', options: ['make', 'makes', 'are making', 'made'], answer: 2, why: 'now تعني أن الفعل جارٍ.' },
        { q: 'I can ___ the new words.', options: ['remember', 'remembers', 'remembering', 'to remember'], answer: 0, why: 'بعد can نستخدم الفعل الأساسي.' },
        { q: 'Last week, we ___ a reading club.', options: ['start', 'starts', 'started', 'are starting'], answer: 2, why: 'Last week يدل على الماضي، وstart فعل منتظم.' },
        { q: 'The past form of “win” is:', options: ['winned', 'won', 'wins', 'winning'], answer: 1, why: 'الماضي غير المنتظم من win هو won.' },
        { q: 'Choose the correct question.', options: ['Did she helped the team?', 'Does she helped the team?', 'Did she help the team?', 'Was she help the team?'], answer: 2, why: 'بعد Did نستخدم الفعل الأساسي help.' },
        { q: 'Correct: “He usually use a laptop for homework.”', answerText: 'He usually uses a laptop for homework.', points: 2 },
        { q: 'Write a sentence about what you are doing now using the present continuous.', answerText: 'Example: I am studying English now. Any grammatically correct present continuous sentence is accepted.', points: 2 },
        { q: 'Write one past simple sentence about a helpful person.', answerText: 'Example: My friend helped me with my homework yesterday. Any correct past simple sentence is accepted.', points: 2 },
        { q: 'Give one online safety rule in English.', answerText: 'Example: Never share your password. / Check the source before you share a post.', points: 2 }
      ]
    },
    {
      id: 'grade7-eng-exam-2', title: 'Term 1 Practice Exam 2 — Units 4–6',
      note: 'اختبار تدريبي أصلي • 12 سؤالاً • تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'If you ___ carefully, you will make a better choice.', options: ['think', 'thinks', 'will think', 'thought'], answer: 0, why: 'في الشرط الأول يأتي المضارع البسيط بعد If.' },
        { q: 'You ___ ask a teacher for advice.', options: ['should', 'shouldn’t to', 'are', 'did'], answer: 0, why: 'بعد should يأتي الفعل الأساسي.' },
        { q: 'If it is sunny, we ___ the school garden.', options: ['visit', 'visited', 'will visit', 'are visit'], answer: 2, why: 'نتيجة الشرط الأول تأتي مع will + الفعل الأساسي.' },
        { q: 'Mona ___ going to explore different jobs.', options: ['am', 'is', 'are', 'do'], answer: 1, why: 'نستخدم is مع Mona/she.' },
        { q: 'They are going to ___ a new skill.', options: ['learn', 'learns', 'learning', 'learned'], answer: 0, why: 'بعد going to يأتي الفعل الأساسي.' },
        { q: 'Students ___ respect different cultures.', options: ['must', 'mustn’t', 'does', 'were'], answer: 0, why: 'must تعبر عن واجب.' },
        { q: 'We ___ throw plastic into the river.', options: ['must', 'mustn’t', 'are', 'did'], answer: 1, why: 'mustn’t تمنع فعلاً ضاراً.' },
        { q: 'Which sentence is correct?', options: ['He mustn’t drops litter.', 'He mustn’t drop litter.', 'He mustn’t to drop litter.', 'He mustn’t dropping litter.'], answer: 1, why: 'بعد mustn’t نستخدم الفعل الأساسي.' },
        { q: 'Complete: “If we save water, we ___ (help) the environment.”', answerText: 'If we save water, we will help the environment.', points: 2 },
        { q: 'Write one plan using “going to”.', answerText: 'Example: I am going to join the school science club. Any correct “going to” sentence is accepted.', points: 2 },
        { q: 'Write one rule using “mustn’t” for a school project.', answerText: 'Example: We mustn’t use tools without an adult. Any correct safety rule is accepted.', points: 2 },
        { q: 'Write two sentences about a responsible global citizen.', answerText: 'Example: A global citizen respects different cultures. They must protect shared places. Any relevant, correct sentences are accepted.', points: 2 }
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
    return stage === 'prep' && /^الاول/.test(grade) && /(انجلي|english)/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
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
    var book = el('a', 'كتاب الوزارة المتاح للإنجليزية');
    book.href = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026/Prepratory/Prepratory1/Term1/StudentBook/English_Prp1_Tr1.pdf';
    book.target = '_blank';
    book.rel = 'noopener';
    var curriculum = el('a', 'قائمة وحدات 2026/2027');
    curriculum.href = 'https://aladwaa.com/543245/%D8%A7%D9%84%D9%84%D8%BA%D8%A9-%D8%A7%D9%84%D8%A7%D9%86%D8%AC%D9%84%D9%8A%D8%B2%D9%8A%D8%A9-%D8%A7%D9%84%D8%B5%D9%81-%D8%A7%D9%84%D8%A3%D9%88%D9%84-%D8%A7%D9%84%D8%A3%D8%B9%D8%AF%D8%A7%D8%AF%D9%8A/';
    curriculum.target = '_blank';
    curriculum.rel = 'noopener';
    var portal = el('a', 'فهرس بوابة الوزارة');
    portal.href = 'https://lessons.moe.gov.eg/g7/t1/s6/th0';
    portal.target = '_blank';
    portal.rel = 'noopener';
    links.appendChild(book);
    links.appendChild(el('span', '  •  '));
    links.appendChild(curriculum);
    links.appendChild(el('span', '  •  '));
    links.appendChild(portal);
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
      window.openGrade7EnglishItem(id);
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
      block.setAttribute('dir', 'ltr');
      block.style.cssText = 'border:1px solid #e4e9e4;border-radius:12px;padding:14px;margin:12px 0;background:#fff;text-align:left;';
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
        result.setAttribute('dir', 'rtl');
        result.style.cssText = 'display:none;margin-top:9px;padding:9px;border-radius:8px;line-height:1.7;text-align:right;';
        block.appendChild(result);
        block._grade7EnglishQuestion = q;
        block._grade7EnglishResult = result;
      } else {
        var details = document.createElement('details');
        details.style.cssText = 'margin-top:10px;text-align:right;';
        details.appendChild(el('summary', 'عرض إجابة نموذجية'));
        var answer = el('div', q.answerText || '');
        answer.setAttribute('dir', 'ltr');
        answer.style.cssText = 'padding:8px 2px;line-height:1.9;text-align:left;';
        details.appendChild(answer);
        block.appendChild(details);
      }
      wrap.appendChild(block);
    });
    var gradeButton = el('button', 'Check multiple-choice answers');
    gradeButton.type = 'button';
    gradeButton.style.cssText = 'background:#2E7D32;color:white;border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:700;margin:8px 0 16px;cursor:pointer;';
    var score = el('div', '');
    score.style.cssText = 'font-weight:700;color:#2E7D32;margin:6px 0 12px;';
    gradeButton.addEventListener('click', function () {
      var points = 0, total = 0;
      Array.prototype.forEach.call(wrap.children, function (item) {
        var q = item._grade7EnglishQuestion;
        if (!q || !q.options) return;
        total += 1;
        var chosen = item.querySelector('input[type="radio"]:checked');
        var correct = !!chosen && Number(chosen.value) === q.answer;
        if (correct) points += 1;
        item._grade7EnglishResult.style.display = 'block';
        item._grade7EnglishResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        item._grade7EnglishResult.textContent = (correct ? 'إجابة صحيحة. ' : 'راجع الإجابة. ') + q.why;
      });
      score.textContent = 'درجتك في أسئلة الاختيار من متعدد: ' + points + ' من ' + total;
    });
    wrap.insertBefore(gradeButton, wrap.firstChild);
    wrap.insertBefore(score, gradeButton.nextSibling);
    return wrap;
  }

  function readAloud(text) {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    window.speechSynthesis.cancel();
    var utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
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
      var unitHeading = el('div', found.unit.title, 'english-unit-heading');
      unitHeading.setAttribute('dir', 'ltr');
      body.appendChild(unitHeading);
      var passageBox = document.createElement('div');
      passageBox.style.cssText = 'background:#F5F7FA;border-left:4px solid #2E7D32;border-radius:12px;padding:14px;margin:12px 0;line-height:1.9;';
      passageBox.appendChild(el('strong', 'Original practice text', 'english-section-label'));
      var passage = el('p', found.item.passage);
      passage.setAttribute('dir', 'ltr');
      passage.style.cssText = 'text-align:left;font-size:17px;line-height:1.9;white-space:pre-line;margin:8px 0;';
      passageBox.appendChild(passage);
      passageBox.appendChild(el('div', 'ملخص بالعربية: ' + found.item.summary));
      if ('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined') {
        var audioButton = el('button', 'Listen to the text');
        audioButton.type = 'button';
        audioButton.style.cssText = 'background:#1565C0;color:#fff;border:0;border-radius:8px;padding:8px 12px;margin-top:8px;cursor:pointer;';
        audioButton.addEventListener('click', function () { readAloud(found.item.passage); });
        passageBox.appendChild(audioButton);
      }
      body.appendChild(passageBox);
      if (found.item.dialogue) {
        var dialogue = document.createElement('div');
        dialogue.style.cssText = 'background:#E3F2FD;border-radius:12px;padding:12px;margin:12px 0;';
        dialogue.appendChild(el('strong', 'Listen / Read the dialogue'));
        var dialogueText = el('p', found.item.dialogue);
        dialogueText.setAttribute('dir', 'ltr');
        dialogueText.style.cssText = 'text-align:left;line-height:1.9;white-space:pre-line;';
        dialogue.appendChild(dialogueText);
        body.appendChild(dialogue);
      }
      body.appendChild(el('h3', 'شرح ومفردات'));
      found.item.explain.forEach(function (paragraph) {
        var p = el('p', paragraph);
        p.setAttribute('dir', 'rtl');
        p.style.cssText = 'line-height:2;font-size:16px;margin:10px 0;';
        body.appendChild(p);
      });
      var vocab = document.createElement('div');
      vocab.setAttribute('dir', 'rtl');
      vocab.style.cssText = 'background:#FFF8E1;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      vocab.appendChild(el('strong', 'مفردات أساسية: '));
      vocab.appendChild(el('span', found.item.vocabulary));
      body.appendChild(vocab);
      var grammar = document.createElement('div');
      grammar.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      grammar.appendChild(el('strong', 'Grammar: ' + found.unit.grammar));
      var grammarText = el('div', found.item.grammar);
      grammarText.setAttribute('dir', 'ltr');
      grammarText.style.cssText = 'text-align:left;white-space:pre-line;margin-top:8px;';
      grammar.appendChild(grammarText);
      body.appendChild(grammar);
      var tasks = document.createElement('div');
      tasks.setAttribute('dir', 'rtl');
      tasks.style.cssText = 'background:#F3E5F5;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;';
      tasks.appendChild(el('strong', 'Writing: '));
      tasks.appendChild(el('span', found.item.writing));
      tasks.appendChild(el('div', 'Speaking: ' + found.item.speaking));
      body.appendChild(tasks);
      var key = document.createElement('div');
      key.setAttribute('dir', 'ltr');
      key.style.cssText = 'background:#E8F5E9;border-radius:12px;padding:12px;margin:12px 0;line-height:1.9;text-align:left;';
      key.appendChild(el('strong', 'Key idea: '));
      key.appendChild(el('span', found.item.key));
      body.appendChild(key);
      body.appendChild(el('h3', 'Quick practice'));
      body.appendChild(buildQuestions(found.unit.exercises.slice(0, 3), found.item.id));
    } else {
      var note = el('p', found.item.note || 'أجب بالإنجليزية ثم اضغط التصحيح. الأسئلة المقالية تعرض نموذج إجابة للمراجعة.');
      note.setAttribute('dir', 'rtl');
      body.appendChild(note);
      if (found.kind === 'exercise' && found.unit) {
        var heading = el('div', found.unit.title + ' — ' + found.unit.grammar, 'english-unit-heading');
        heading.setAttribute('dir', 'ltr');
        body.appendChild(heading);
      }
      body.appendChild(buildQuestions(found.kind === 'exercise' ? found.item.exercises : found.item.questions, found.item.id));
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
    root.className = 'grade7-english-original-content';
    root.setAttribute('dir', 'rtl');
    root.appendChild(noticeBox());
    if (type === 'lessons') {
      units.forEach(function (unit) {
        var heading = el('h3', unit.title + ' — ' + unit.grammar);
        heading.setAttribute('dir', 'ltr');
        root.appendChild(heading);
        unit.lessons.forEach(function (lesson) {
          root.appendChild(makeCard(lesson.title, lesson.summary, lesson.id, '📘'));
        });
      });
      root.appendChild(el('div', 'تتضمن كل وحدة مفردات وشرح قاعدة ونصاً أصلياً وحواراً وأنشطة قراءة وكتابة ومحادثة.'));
    } else if (type === 'exercises') {
      units.forEach(function (unit) {
        root.appendChild(makeCard(unit.title + ' — Interactive Practice', unit.exercises.length + ' أسئلة متنوعة مع تصحيح فوري', unit.id, '✏️'));
      });
    } else if (type === 'exams') {
      exams.forEach(function (exam) {
        root.appendChild(makeCard(exam.title, exam.note, exam.id, '📝'));
      });
    }
    list.appendChild(root);
  }

  window.openGrade7EnglishItem = openItem;
  var previousOpenContent = window.openContent;
  if (typeof previousOpenContent === 'function' && !previousOpenContent.__grade7EnglishWrapped) {
    var wrappedOpenContent = async function (type, termNumber, termName) {
      var result = await previousOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrappedOpenContent.__grade7EnglishWrapped = true;
    window.openContent = wrappedOpenContent;
  }
})();
