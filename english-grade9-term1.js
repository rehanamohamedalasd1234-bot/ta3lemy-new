// Original supplementary content for English Prep 3, Term 1, Egypt (2026/2027).
(function () {
  'use strict';

  var NOTICE = 'قائمة الوحدات الست مطابقة لمصدر مدرسي للعام 2026/2027. كتاب الوزارة المتاح يحمل تاريخ 2025، وبوابة دروس الوزارة تعرض فهرساً أقدم مختلفاً؛ لذلك استخدم القواعد هنا كمراجعة مساندة، وارجع إلى كتاب مدرستك إذا اختلفت تفاصيل طبعة 2026/2027. النصوص والأسئلة والأنشطة في هذه الإضافة أصلية.';

  var units = [
    {
      id: 'grade9-eng-u1', title: 'Unit 1: Personal Identity', grammar: 'Present Perfect Active/Passive + since/for',
      lessons: [
        {
          id: 'grade9-eng-u1-l1', title: 'What Makes Us Who We Are?',
          passage: 'A person’s identity includes values, interests, background and the choices they make. Since she joined the school art club, Mariam has learned to listen to different opinions. Her confidence has grown through practice, and her classmates have supported her ideas. Mariam says that respecting others does not mean hiding your own character. It means being thoughtful and fair.',
          summary: 'تتشكل الهوية من القيم والاهتمامات والخلفية والاختيارات، وتنمو الثقة بالتعلم واحترام الآخرين.',
          dialogue: 'Omar: How long have you been in the art club?\nMariam: I have been a member for two years.\nOmar: What have you learned?\nMariam: I have learned to share ideas and respect different views.',
          vocabulary: 'identity = هوية؛ personality = شخصية؛ values = قيم؛ background = خلفية؛ beliefs = معتقدات؛ character = طابع؛ confidence = ثقة؛ strength = نقطة قوة؛ self-respect = احترام الذات.',
          explain: ['تصف الهوية جوانب متعددة من الشخص، مثل القيم والاهتمامات والخبرات، ولا تختزل في مظهر واحد أو رأي الآخرين.', 'يتكون المضارع التام النشط من have/has + التصريف الثالث: She has learned. ونستخدمه لخبرة أو تغير له صلة بالحاضر.', 'المضارع التام للمجهول: have/has been + التصريف الثالث. مثال: Her ideas have been supported by her classmates.', 'تأتي since مع نقطة بداية: since 2022، وتأتي for مع مدة: for three years.'],
          grammar: 'Active: I have learned a new skill. / She has joined the club.\nPassive: The project has been completed. / The ideas have been shared.\nsince + starting point: since Monday / since 2023.\nfor + period: for a week / for three years.',
          writing: 'Write a short paragraph about a value or experience that has helped shape your identity. Use the present perfect.',
          speaking: 'Talk about something you have learned recently and how it has helped you.',
          key: 'Use the present perfect for experiences or changes connected with now; distinguish a time point (since) from a duration (for).'
        },
        {
          id: 'grade9-eng-u1-l2', title: 'Strengths and Personal Growth',
          passage: 'For the past year, Kareem has practised speaking in front of a small group. At first, he felt nervous, but his friends have encouraged him. His progress has been noticed by his teacher, who has given him helpful feedback. Kareem has not become confident in one day. He has built confidence by preparing carefully and trying again after mistakes.',
          summary: 'تحسن كريم تدريجياً بالممارسة والتغذية الراجعة، ولم تتكون ثقته في يوم واحد.',
          dialogue: 'Teacher: How long have you practised your speech?\nKareem: I have practised for three weeks.\nTeacher: Your effort has been noticed.\nKareem: Thank you. I have learned to prepare and keep trying.',
          vocabulary: 'self-awareness = وعي بالذات؛ effort = جهد؛ feedback = تغذية راجعة؛ progress = تقدم؛ weakness = نقطة تحتاج إلى تطوير؛ encourage = يشجع؛ respect = احترام؛ individual = فرد.',
          explain: ['يساعد التعرف إلى نقاط القوة والجوانب التي تحتاج إلى تطوير على وضع أهداف واقعية.', 'النفي في المضارع التام: have not/has not + التصريف الثالث. مثال: He has not stopped trying.', 'في صيغة المجهول نركز على ما وقع عليه الفعل: The learner has been encouraged.', 'نستخدم for مع مدة زمنية مثل for two months، وsince مع بداية محددة مثل since September.'],
          grammar: 'Negative: I have not finished. / She has not missed a lesson.\nQuestion: Have you tried the activity? — Yes, I have.\nPassive question: Has the work been checked?\nHe has been practising for a year. / She has been here since May.',
          writing: 'Write four sentences about progress you have made. Include one sentence with for or since.',
          speaking: 'Describe a personal strength and one skill you have developed through practice.',
          key: 'Personal growth takes practice. Choose language that describes experience without judging people unfairly.'
        }
      ],
      exercises: [
        { q: 'I have lived in this town ___ 2021.', options: ['for', 'since', 'during', 'from'], answer: 1, why: 'since تسبق نقطة بداية محددة.' },
        { q: 'Mona has studied English ___ three years.', options: ['since', 'for', 'at', 'by'], answer: 1, why: 'for تسبق مدة زمنية.' },
        { q: 'Choose the correct passive form: “The project ___ by the class.”', options: ['has completed', 'has been completed', 'have been completed', 'is been completed'], answer: 1, why: 'المضارع التام للمجهول: has been + التصريف الثالث.' },
        { q: 'We ___ two new skills this term.', options: ['have learned', 'has learned', 'have been learn', 'learned since'], answer: 0, why: 'مع we نستخدم have + التصريف الثالث.' },
        { q: 'Which sentence is in the present perfect passive?', options: ['They have shared the ideas.', 'The ideas have been shared.', 'The ideas are sharing.', 'The ideas shared yesterday.'], answer: 1, why: 'have been shared تركيب المضارع التام للمجهول.' },
        { q: 'Change to passive: “The team has finished the project.”', answerText: 'The project has been finished by the team.', points: 2 },
        { q: 'Write one true sentence using “for” or “since” with the present perfect.', answerText: 'Example: I have studied English for four years. Any grammatically correct true or practice sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade9-eng-u2', title: 'Unit 2: Communication with Family and Friends', grammar: 'Third Conditional',
      lessons: [
        {
          id: 'grade9-eng-u2-l1', title: 'Listen Before You Reply',
          passage: 'Nadine and her cousin misunderstood a short message in their family group. Nadine thought the meeting had been cancelled, so she did not arrive. Later, they spoke calmly and learned that the message was only about a change of time. If Nadine had asked a question, she would have understood the plan. They agreed to check unclear messages before reacting.',
          summary: 'يقلل الاستماع وطلب التوضيح من سوء فهم الرسائل بين الأسرة والأصدقاء.',
          dialogue: 'Nadine: I thought the meeting was cancelled.\nCousin: I meant that it would start later.\nNadine: If I had asked you, I would have understood.\nCousin: Yes. Let’s check next time instead of guessing.',
          vocabulary: 'communication = تواصل؛ connection = صلة؛ misunderstood = أسيء فهمه؛ respectful = محترم؛ supportive = مساند؛ bond = رابطة؛ resolve = يحل؛ distant = بعيد؛ gesture = إيماءة.',
          explain: ['يشير النص إلى أن الرسائل القصيرة قد تُفهم بطرق مختلفة؛ لذا اسأل عن المقصود قبل اتخاذ قرار.', 'نستخدم الشرط الثالث للتحدث عن موقف ماضٍ لم يحدث ونتيجة متخيلة له: If + past perfect, would have + past participle.', 'المثال: If Nadine had asked, she would have understood. لم تسأل في الواقع، ولم تفهم الخطة آنذاك.', 'يمكن استخدام could have أو might have بدلاً من would have للتعبير عن إمكانية أو احتمال، بحسب المعنى.'],
          grammar: 'If + past perfect, would have + past participle.\nIf I had listened, I would have understood.\nIf they had called earlier, we could have helped.\nThe if-clause may come second: I would have replied if I had seen your message.',
          writing: 'Write a short paragraph about a communication problem and one thing someone could have done differently. Use one third conditional sentence.',
          speaking: 'Role-play a respectful conversation to clarify a misunderstood message.',
          key: 'The third conditional looks back at an unreal past condition and imagines a different result.'
        },
        {
          id: 'grade9-eng-u2-l2', title: 'Repairing a Misunderstanding',
          passage: 'During a group project, Hany felt ignored because his suggestions were not discussed. His teammate noticed his reaction and asked him to explain. Hany described what he meant without blaming anyone. If the team had listened to every member, they might have noticed his useful idea earlier. They reviewed the plan together and shared the tasks fairly.',
          summary: 'يصلح الفريق سوء الفهم بالحوار الهادئ والاستماع وتوزيع العمل باحترام.',
          dialogue: 'Hany: I felt frustrated when my idea was skipped.\nTeammate: I’m sorry. If we had listened more carefully, we would have considered it.\nHany: Thanks. Let’s test the idea together.\nTeammate: Good plan.',
          vocabulary: 'sibling = أخ أو أخت؛ awkward = محرج؛ distraction = مشتت؛ frustrated = محبط؛ solution = حل؛ viewpoint = وجهة نظر؛ apologize = يعتذر؛ consider = ينظر في.',
          explain: ['تبدأ المحادثة الفعالة بوصف الموقف والشعور دون اتهام، ثم الاستماع إلى رد الطرف الآخر.', 'في الشرط الثالث نستخدم had + التصريف الثالث بعد if، ثم would have + التصريف الثالث في النتيجة.', 'يتغير ترتيب الجملتين دون تغيير المعنى الأساسي: If we had talked, we would have solved it. / We would have solved it if we had talked.', 'الاعتذار الصادق وتوزيع المسؤوليات بوضوح يساعدان على استعادة الثقة داخل الفريق.'],
          grammar: 'If they had shared their concerns, they would have found a solution.\nIf + subject + had + past participle, subject + would have + past participle.\nNegative: If he had not rushed, he would not have made the mistake.',
          writing: 'Write an opinion paragraph about respectful communication. Include a third conditional example.',
          speaking: 'Discuss how a group can make sure every member is heard.',
          key: 'Respectful communication includes listening, clarifying and sharing responsibility.'
        }
      ],
      exercises: [
        { q: 'If I ___ your message, I would have replied.', options: ['see', 'had seen', 'would see', 'have seen'], answer: 1, why: 'الشرط الثالث يستخدم past perfect بعد if.' },
        { q: 'If they had left earlier, they ___ the bus.', options: ['would catch', 'would have caught', 'will catch', 'had caught'], answer: 1, why: 'النتيجة: would have + التصريف الثالث.' },
        { q: 'Choose the correct third conditional.', options: ['If she had called, I would have answered.', 'If she called, I would have answer.', 'If she would call, I answered.', 'If she has called, I answer.'], answer: 0, why: 'التركيب الصحيح: If + past perfect, would have + past participle.' },
        { q: 'If we had listened carefully, we ___ the problem.', options: ['would solve', 'will solve', 'would have solved', 'had solve'], answer: 2, why: 'would have solved نتيجة متخيلة لموقف ماضٍ.' },
        { q: 'Which action may help prevent a misunderstanding?', options: ['Guess the meaning', 'Ask a clear question', 'Ignore the other person', 'Blame the whole group'], answer: 1, why: 'طلب التوضيح يساعد على معرفة المقصود.' },
        { q: 'Complete: “If he had prepared, he ___ (feel) more confident.”', answerText: 'If he had prepared, he would have felt more confident.', points: 2 },
        { q: 'Write one third conditional sentence about a past communication situation.', answerText: 'Example: If I had checked the time, I would have arrived earlier. Any correct third conditional sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade9-eng-u3', title: 'Unit 3: Artificial Intelligence', grammar: 'Future Simple Passive',
      lessons: [
        {
          id: 'grade9-eng-u3-l1', title: 'AI and Everyday Tools',
          passage: 'Artificial intelligence can help a computer identify patterns in information. It is not the same as a robot: a robot is a machine, while AI is a system that can process information and make predictions. In a school project, a digital assistant may suggest useful practice questions. The final work should still be checked by a student and teacher for accuracy.',
          summary: 'الذكاء الاصطناعي نظام يعالج المعلومات، ويمكن استخدامه للمساعدة مع مراجعة النتائج.',
          dialogue: 'Salma: Will AI replace every teacher?\nTeacher: No. AI will be used as a tool to support some tasks.\nSalma: Who will check the information?\nTeacher: A person should review it and decide whether it is reliable.',
          vocabulary: 'artificial intelligence = ذكاء اصطناعي؛ machine learning = تعلم آلي؛ robot = روبوت؛ smart = ذكي؛ innovation = ابتكار؛ customized = مخصص؛ instantly = فوراً؛ feedback = ملاحظات.',
          explain: ['قد يساعد الذكاء الاصطناعي في مهام مثل التصنيف أو اقتراح تدريبات، لكن مخرجاته تحتاج إلى مراجعة بشرية.', 'يتكون المستقبل البسيط للمجهول من will be + التصريف الثالث: The information will be checked.', 'لتحويل المعلوم إلى المجهول، نجعل المفعول به محور الجملة، ثم نستخدم will be + past participle. مثال: People will test the tool → The tool will be tested.', 'تميّز بين الروبوت، وهو آلة، والذكاء الاصطناعي، وهو تقنية يمكن أن تعمل داخل أدوات مختلفة.'],
          grammar: 'Active: Engineers will design a helpful tool.\nPassive: A helpful tool will be designed by engineers.\nFuture passive: will + be + past participle.\nNegative: The data will not be shared.\nQuestion: Will the system be tested?',
          writing: 'Write an email about one possible future use of AI. Include a future passive sentence.',
          speaking: 'Share one expected benefit of AI and one reason its results should be checked.',
          key: 'Use will be + past participle to describe a future action when the receiver of the action is the focus.'
        },
        {
          id: 'grade9-eng-u3-l2', title: 'Using AI Responsibly',
          passage: 'A science club is preparing a display about clean energy. The students use a digital tool to organise their questions, but they compare its suggestions with trusted books and reliable websites. Incorrect information will be corrected before the display is shared. The students will explain which ideas came from their research and which tools supported their work.',
          summary: 'يتحقق الطلاب من اقتراحات الأدوات الرقمية قبل نشر مشروعهم ويشرحون طريقة استخدامها.',
          dialogue: 'Omar: Will the presentation be prepared by the app?\nNour: No. The app may suggest an outline, but we will write and check it.\nOmar: Will the sources be included?\nNour: Yes, every source will be listed.',
          vocabulary: 'data = بيانات؛ process = يعالج؛ accurate = دقيق؛ reliable = موثوق؛ prediction = توقع؛ source = مصدر؛ review = يراجع؛ responsibility = مسؤولية.',
          explain: ['استخدم الأدوات الرقمية وفق تعليمات المدرسة، ولا تدخل بيانات خاصة في خدمة لا تعرف إعدادات الخصوصية فيها.', 'تأتي not بعد will: will not be used. والاختصار: won’t be used.', 'في السؤال نضع will قبل الفاعل: Will the results be checked?', 'اذكر المصدر وتحقق من المعلومات، ولا تنسب عملاً مولداً أو مقترحاً إلى بحثك دون توضيح.'],
          grammar: 'Positive: The results will be checked.\nNegative: Personal data will not be entered.\nQuestion: Will the ideas be reviewed?\nBy + agent: The report will be checked by the science team.',
          writing: 'Write three rules for responsible use of AI in a school project. Use one future passive form.',
          speaking: 'Explain how a student can check an AI-generated suggestion.',
          key: 'Treat generated suggestions as a starting point. Verify facts and protect personal information.'
        }
      ],
      exercises: [
        { q: 'The new tool ___ by the students next week.', options: ['will test', 'will be tested', 'is tested yesterday', 'will testing'], answer: 1, why: 'المستقبل للمجهول: will be + tested.' },
        { q: 'Choose the future passive form.', options: ['The answers will check.', 'The answers will be checked.', 'The answers are be checked.', 'The answers will checked.'], answer: 1, why: 'نستخدم will be + past participle.' },
        { q: 'The system ___ not be used for private information.', options: ['will', 'is', 'has', 'was'], answer: 0, why: 'النفي في المستقبل: will not be used.' },
        { q: 'Change to passive: “The team will review the results.”', options: ['The results will review.', 'The results will be reviewed.', 'The results are reviewed tomorrow.', 'The results will be reviewing.'], answer: 1, why: 'المفعول به يصبح فاعلاً نحوياً، ثم will be + reviewed.' },
        { q: 'What is a responsible way to use an AI suggestion?', options: ['Share it without checking', 'Check it against reliable sources', 'Enter private passwords', 'Remove every source'], answer: 1, why: 'تحقق من الدقة قبل استخدام أو نشر المعلومة.' },
        { q: 'Change to passive: “People will share the project tomorrow.”', answerText: 'The project will be shared tomorrow.', points: 2 },
        { q: 'Write one question in the future passive.', answerText: 'Example: Will the information be checked? Any correct future passive question is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade9-eng-u4', title: 'Unit 4: Screen Time', grammar: 'Modal verbs + connectors',
      lessons: [
        {
          id: 'grade9-eng-u4-l1', title: 'Finding a Healthy Screen Balance',
          passage: 'Screens help students read, learn and talk to friends, but long uninterrupted use can make it harder to focus on other activities. Youssef sets a time to put his phone away before bed. He takes short breaks while studying and keeps meals screen-free. Although online games are enjoyable, he makes room for sleep, exercise and face-to-face conversations.',
          summary: 'يمكن تنظيم وقت الشاشة بفواصل ووقت للنوم والحركة والتواصل المباشر.',
          dialogue: 'Youssef: I keep checking my phone while I study.\nFriend: You should put it away for a short study period.\nYoussef: Can I use it during the break?\nFriend: Yes, but you must stop when the break ends.',
          vocabulary: 'screen time = وقت الشاشة؛ entertainment = ترفيه؛ expert = خبير؛ balance = توازن؛ physical = بدني؛ focused = مركز؛ modern = حديث؛ distraction = مشتت؛ habit = عادة.',
          explain: ['يتعلق تنظيم وقت الشاشة بالهدف والتوقيت، وليس بعدد ثابت يناسب كل شخص. خذ فواصل مناسبة واتبع إرشادات الأسرة والمدرسة.', 'تستخدم must للالتزام، وshould للنصيحة، وcan للقدرة أو الإذن. يأتي الفعل الأساسي بعد الفعل الناقص دون to.', 'تستخدم can’t لعدم القدرة أو عدم السماح بحسب السياق، بينما mustn’t تعبر بوضوح عن المنع.', 'تربط although فكرتين متباينتين، وbecause السبب، وwhile حدثين متزامنين أو فكرتين متقابلتين.'],
          grammar: 'Obligation: You must follow the class rules.\nAdvice: You should take a break.\nPermission/ability: Can I use the tablet? — Yes, you can.\nProhibition: You mustn’t share a password.\nAlthough it is useful, I take regular breaks.',
          writing: 'Write a short blog post describing your screen-time habits and one goal for improving them. Use a modal verb and a connector.',
          speaking: 'Share one helpful screen habit and explain why it works for you.',
          key: 'Choose modal verbs that match the meaning: rule, advice, ability or permission.'
        },
        {
          id: 'grade9-eng-u4-l2', title: 'Smart Habits for a Smart Future',
          passage: 'A class discussed how technology may support learning and work in the future. Students agreed that devices can make information easier to reach, while too many alerts can interrupt concentration. They decided to silence notifications during group tasks. Although every student has different needs, the class can agree on respectful rules for using shared devices.',
          summary: 'قد تدعم الأجهزة التعلم، لكن تقليل التنبيهات واحترام قواعد المجموعة يحافظان على التركيز.',
          dialogue: 'Teacher: What should we do during group work?\nLina: We should silence unnecessary alerts.\nTeacher: Can we use a device to look up a word?\nLina: Yes, if it helps with the task and follows the class rule.',
          vocabulary: 'notification = تنبيه؛ concentration = تركيز؛ account = حساب؛ responsible = مسؤول؛ productive = منتج؛ device = جهاز؛ permission = إذن؛ rule = قاعدة.',
          explain: ['نستخدم should لتقديم اقتراح يمكن أن يتبعه المتحدث: Students should silence alerts.', 'نستخدم must أو mustn’t للتعبير عن قاعدة واضحة: You must follow the school policy.', 'تساعد while على المقارنة: A device can be useful, while an alert can distract.', 'تساعد although على تقديم تباين داخل الجملة: Although technology is useful, breaks are important.'],
          grammar: 'We should plan screen breaks.\nYou mustn’t use another person’s account.\nWhile the app is useful, it can distract us.\nAlthough the task was online, the team discussed it face to face.',
          writing: 'Write a short list of class rules for shared technology. Include must, mustn’t or should.',
          speaking: 'Discuss how students can use a device without distracting classmates.',
          key: 'Use connectors to make the relationship between your ideas clear.'
        }
      ],
      exercises: [
        { q: 'You ___ take a short break after a long study session.', options: ['should', 'mustn’t', 'can’t', 'are'], answer: 0, why: 'should تقدم نصيحة.' },
        { q: 'Students ___ share someone else’s password.', options: ['should', 'must', 'mustn’t', 'can'], answer: 2, why: 'mustn’t تعبر عن المنع.' },
        { q: 'Choose the correct sentence.', options: ['You should to rest.', 'You should rest.', 'You should resting.', 'You are should rest.'], answer: 1, why: 'بعد should يأتي الفعل الأساسي دون to.' },
        { q: '___ online games are fun, students need enough sleep.', options: ['Although', 'Because', 'So', 'During'], answer: 0, why: 'although تربط فكرتين متباينتين.' },
        { q: 'I silence my notifications ___ I am studying.', options: ['while', 'although', 'so', 'because of'], answer: 0, why: 'while تربط حدثين متزامنين.' },
        { q: 'Give advice using should: “You feel tired after using a screen.”', answerText: 'Example: You should take a break and rest your eyes. Any suitable advice is accepted.', points: 2 },
        { q: 'Write one sentence with “although” about technology.', answerText: 'Example: Although technology is useful, I take breaks from the screen. Any grammatical contrast is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade9-eng-u5', title: 'Unit 5: Design Thinking', grammar: 'Imperatives + connectors',
      lessons: [
        {
          id: 'grade9-eng-u5-l1', title: 'From a Problem to an Idea',
          passage: 'A school team noticed that some students could not find the right classroom quickly. First, they asked students what was confusing. Next, they drew a simple map and made a paper prototype with clear colours. They tested it with a small group and listened to feedback. Finally, they changed the labels. The team learned that a useful design begins with understanding people.',
          summary: 'يعالج التفكير التصميمي مشكلة حقيقية بفهم المستخدم ثم بناء نموذج وتجربته وتحسينه.',
          dialogue: 'Mina: What is our first step?\nOmar: Ask the students what they need.\nMina: Then what should we do?\nOmar: Build a simple prototype, test it and improve it.',
          vocabulary: 'design thinking = تفكير تصميمي؛ problem = مشكلة؛ solution = حل؛ prototype = نموذج أولي؛ test = يختبر؛ feedback = ملاحظات؛ brainstorm = يعصف ذهنياً؛ challenge = تحدٍّ؛ creativity = إبداع.',
          explain: ['ابدأ بفهم حاجة المستخدم قبل اختيار الحل؛ فقد لا تكون المشكلة كما تبدو أول مرة.', 'تُستخدم صيغة الأمر بالفعل الأساسي مباشرة لإعطاء خطوة أو توجيه: Ask the students. Draw a map.', 'للنهي نستخدم Don’t + الفعل الأساسي: Don’t ignore feedback.', 'توضح كلمات First وNext وThen وFinally ترتيب الخطوات، وتربط because السبب بالنتيجة.'],
          grammar: 'Imperatives: Define the problem. / Test your idea.\nNegative imperative: Don’t ignore feedback.\nSequence: First, observe. Next, brainstorm. Then, build a prototype. Finally, test it.\nbecause: We changed the sign because users were confused.',
          writing: 'Write a short review explaining four steps your team used to improve a school idea. Use sequence connectors and one imperative.',
          speaking: 'Present one simple solution to a school problem and explain how you would test it.',
          key: 'Understand the need, create a small prototype, test it with people and improve it using feedback.'
        },
        {
          id: 'grade9-eng-u5-l2', title: 'Test, Learn and Improve',
          passage: 'The garden club wanted to help volunteers water plants on time. They brainstormed several ideas and chose a paper schedule with colour-coded days. First, they asked the volunteers to try it for one week. Then they collected comments. Some labels were unclear, so they made them larger. The final schedule was easier to read because it used simple words and a clear layout.',
          summary: 'جرّب النادي جدولاً أولياً وجمع الملاحظات ثم حسّن الكلمات والتصميم.',
          dialogue: 'Volunteer: The blue label is hard to read.\nDesigner: Thank you for telling us. Let’s make it larger.\nVolunteer: That is clearer.\nDesigner: Great. Test the new version tomorrow.',
          vocabulary: 'brainstorm = يعصف ذهنياً؛ empathy = تعاطف وفهم احتياج الآخر؛ collaboration = تعاون؛ initiative = مبادرة؛ improve = يحسّن؛ layout = تخطيط؛ label = ملصق؛ user = مستخدم.',
          explain: ['يساعد اختبار النموذج الأولي على اكتشاف مشكلات لم تظهر أثناء التخطيط.', 'تبدأ التعليمات بأفعال أساسية مثل Ask، Draw، Compare، وShare.', 'يمكن ترتيب الخطوات بكلمات زمنية: First، after that، next، finally.', 'لا يعني نجاح النموذج الأولي أنه مثالي؛ فالملاحظات تساعد على تحسينه.'],
          grammar: 'Compare the two ideas.\nDon’t choose a solution before you understand the problem.\nFirst, make a simple model. After that, ask users to test it. Finally, improve the design.',
          writing: 'Describe a prototype you could create for a classroom need. Use “First”, “Next” and “Finally”.',
          speaking: 'Give two clear instructions for testing an idea safely.',
          key: 'Feedback is useful information. Treat it as a chance to improve the design.'
        }
      ],
      exercises: [
        { q: 'Choose the correct imperative.', options: ['You asking the users.', 'Ask the users about the problem.', 'Asked the users.', 'To ask the users.'], answer: 1, why: 'صيغة الأمر تبدأ بالفعل الأساسي.' },
        { q: 'Choose the correct negative imperative.', options: ['Don’t ignore feedback.', 'Doesn’t ignore feedback.', 'Not ignore feedback.', 'Don’t ignores feedback.'], answer: 0, why: 'النهي: Don’t + الفعل الأساسي.' },
        { q: 'Which connector usually introduces the final step?', options: ['Because', 'Although', 'Finally', 'While'], answer: 2, why: 'Finally تقدم الخطوة الأخيرة.' },
        { q: 'The team changed the label ___ users could not read it.', options: ['because', 'finally', 'next', 'although'], answer: 0, why: 'because تذكر السبب.' },
        { q: 'What is a prototype?', options: ['A first simple model of an idea', 'A final exam', 'A list of grades', 'A type of screen'], answer: 0, why: 'النموذج الأولي تمثيل مبسط لفكرة لاختبارها.' },
        { q: 'Put in order: test the model / understand the need / improve the design.', answerText: 'Understand the need → test the model → improve the design.', points: 2 },
        { q: 'Write one instruction for a design team using an imperative.', answerText: 'Example: Listen to the users. Any correct imperative is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade9-eng-u6', title: 'Unit 6: Why Do We Like Stories?', grammar: 'Reported Speech',
      lessons: [
        {
          id: 'grade9-eng-u6-l1', title: 'Stories, Viewpoints and Empathy',
          passage: 'Stories invite readers to see events through another person’s eyes. In a class discussion, Farida said that she enjoyed stories with brave characters. Her friend explained that a quiet character could also show courage. The students compared different viewpoints and noticed how a story can raise questions about fairness. They did not all agree, but they listened respectfully.',
          summary: 'تعرض القصص وجهات نظر مختلفة، وقد تساعد القارئ على فهم مشاعر الآخرين.',
          dialogue: 'Teacher: What did Farida say?\nStudent: She said that she enjoyed stories about brave characters.\nTeacher: And what did her friend explain?\nStudent: He explained that quiet characters could also be brave.',
          vocabulary: 'moral = مغزى أخلاقي؛ viewpoint = وجهة نظر؛ empathy = تعاطف؛ conflict = صراع؛ critically = بصورة نقدية؛ spark = يثير؛ aware = مدرك؛ various = متنوع؛ ambition = طموح.',
          explain: ['تتكون القصة عادةً من شخصيات ومكان وأحداث ومشكلة أو صراع، وقد تتغير وجهة النظر بين الشخصيات.', 'ننقل الكلام المباشر إلى غير مباشر بذكر المتحدث ثم that: “I like stories,” Sara said → Sara said that she liked stories.', 'عند نقل كلام في الماضي، يتغير المضارع البسيط غالباً إلى الماضي البسيط، وam/is إلى was، وwill إلى would.', 'قد تتغير الضمائر وكلمات الزمن بحسب سياق الحديث: “We are ready,” they said → They said that they were ready.'],
          grammar: 'Direct: “I enjoy reading,” Sara said.\nReported: Sara said that she enjoyed reading.\nDirect: “We are writing a story,” they said.\nReported: They said that they were writing a story.\nDirect: “I will help,” he said. → He said that he would help.',
          writing: 'Write a short review of a story you know. Include one sentence reporting what a character said.',
          speaking: 'Describe a character’s viewpoint and explain how it differs from another character’s.',
          key: 'Reported speech tells what someone said without repeating the exact original words.'
        },
        {
          id: 'grade9-eng-u6-l2', title: 'Sharing a Story Thoughtfully',
          passage: 'The reading club chose an original short story about a student who wanted to join a science team. One member said that the main character had worked hard for the opportunity. Another reader thought that the friend had helped by asking a useful question. The club discussed the story’s conflict and ending. Members supported their opinions with details instead of judging the characters quickly.',
          summary: 'يناقش نادي القراءة أحداث القصة ويدعم الآراء بتفاصيل بدلاً من الحكم السريع.',
          dialogue: 'Ali: “The ending is hopeful,” Dina said.\nTeacher: Can you report Dina’s words?\nAli: Dina said that the ending was hopeful.\nTeacher: Good. Remember to change the verb when the reporting verb is in the past.',
          vocabulary: 'story element = عنصر قصصي؛ plot = حبكة؛ character = شخصية؛ ending = نهاية؛ debate = نقاش؛ detail = تفصيل؛ support = يدعم؛ conclusion = خاتمة.',
          explain: ['لا يعني نقل الكلام أن المتحدث يوافق عليه؛ إنه ينقل ما قيل مع الحفاظ على المعنى.', 'في الجمل الخبرية يمكن استخدام said that. ونستخدم told مع مفعول به: She told us that she was ready.', 'يتحول will غالباً إلى would في الكلام غير المباشر عندما يكون فعل النقل في الماضي.', 'عند تلخيص قصة، اختر التفاصيل المهمة وميّز بين ما حدث وبين رأيك في الحدث.'],
          grammar: 'Direct: “The story is interesting,” he said.\nReported: He said that the story was interesting.\nDirect: “I will read it,” she said.\nReported: She said that she would read it.\nWith an object: He told us that he liked the ending.',
          writing: 'Write a brief report of a classmate’s opinion about a story. Use said that or told us that.',
          speaking: 'Summarise a story event and report one comment made by a reader.',
          key: 'Report ideas accurately, and separate a speaker’s words from your own opinion.'
        }
      ],
      exercises: [
        { q: '“I like this story,” Hala said. Choose the reported sentence.', options: ['Hala said that she liked that story.', 'Hala said that I like this story.', 'Hala says she liked this story yesterday.', 'Hala said she likes this story now.'], answer: 0, why: 'في النقل بالماضي يتغير الضمير وlike إلى liked.' },
        { q: '“We are reading,” they said. They said that they ___ reading.', options: ['are', 'were', 'will be', 'have been'], answer: 1, why: 'are reading تتحول إلى were reading في النقل بالماضي.' },
        { q: '“I will help,” Omar said. Omar said that he ___ help.', options: ['will', 'would', 'is', 'has'], answer: 1, why: 'will تتحول غالباً إلى would في الكلام المنقول بالماضي.' },
        { q: 'Choose the correct reporting form with an object.', options: ['She told us that she was ready.', 'She told that us she is ready.', 'She said us that she ready.', 'She told to us she was ready.'], answer: 0, why: 'نستخدم told + مفعول به + that-clause.' },
        { q: 'What is one useful way to discuss a story?', options: ['Judge characters without evidence', 'Support an opinion with story details', 'Ignore different viewpoints', 'Repeat every line'], answer: 1, why: 'تدعم التفاصيل الرأي وتوضح فهم القصة.' },
        { q: 'Report: “The ending is hopeful,” Dina said.', answerText: 'Dina said that the ending was hopeful.', points: 2 },
        { q: 'Report: “I will finish the story,” Tamer said.', answerText: 'Tamer said that he would finish the story.', points: 2 }
      ]
    }
  ];

  var exams = [
    {
      id: 'grade9-eng-exam-1', title: 'Term 1 Practice Exam 1 — Units 1–3',
      note: 'اختبار تدريبي أصلي • 12 سؤالاً • تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'I have known Sara ___ 2022.', options: ['for', 'since', 'during', 'at'], answer: 1, why: 'since تسبق نقطة بداية.' },
        { q: 'The classroom ___ by the students this week.', options: ['has decorated', 'has been decorated', 'have been decorated', 'is been decorated'], answer: 1, why: 'classroom مفرد، والمضارع التام للمجهول has been + decorated.' },
        { q: 'If we had checked the message, we ___ the change.', options: ['would notice', 'would have noticed', 'will notice', 'had noticed'], answer: 1, why: 'الشرط الثالث يستخدم would have + التصريف الثالث.' },
        { q: 'If she had asked, I ___ her.', options: ['would help', 'will help', 'would have helped', 'have helped'], answer: 2, why: 'would have helped نتيجة متخيلة لماضٍ.' },
        { q: 'The results ___ next week.', options: ['will announce', 'will be announced', 'are announce', 'will announced'], answer: 1, why: 'المستقبل للمجهول: will be + announced.' },
        { q: 'AI is best treated as:', options: ['a tool whose output should be checked', 'a guaranteed source of truth', 'a human teacher', 'a password'], answer: 0, why: 'تحقق من المعلومات ولا تفترض دقة كل مخرجات الأداة.' },
        { q: 'Choose the correct present perfect active sentence.', options: ['They has learned a lot.', 'They have learned a lot.', 'They have been learn a lot.', 'They learned since 2020.'], answer: 1, why: 'مع they نستخدم have + التصريف الثالث.' },
        { q: 'If the team had listened, it ___ the idea earlier.', options: ['would consider', 'will consider', 'would have considered', 'had considered'], answer: 2, why: 'التركيب الثالث: would have + past participle.' },
        { q: 'Change to passive: “The class has shared the ideas.”', answerText: 'The ideas have been shared by the class.', points: 2 },
        { q: 'Complete: “If I had seen the note, I ___ (reply).”', answerText: 'If I had seen the note, I would have replied.', points: 2 },
        { q: 'Change to future passive: “The students will test the tool.”', answerText: 'The tool will be tested by the students.', points: 2 },
        { q: 'Write one sentence using “for” or “since” with the present perfect.', answerText: 'Example: I have studied English for five years. Any grammatically correct sentence is accepted.', points: 2 }
      ]
    },
    {
      id: 'grade9-eng-exam-2', title: 'Term 1 Practice Exam 2 — Units 4–6',
      note: 'اختبار تدريبي أصلي • 12 سؤالاً • تصحيح فوري وإجابات نموذجية',
      questions: [
        { q: 'You ___ take breaks while studying for a long time.', options: ['should', 'mustn’t', 'can’t', 'are'], answer: 0, why: 'should تقدم نصيحة.' },
        { q: 'Choose the correct sentence.', options: ['Although the app is useful, I take breaks.', 'Although the app is useful, but I take breaks.', 'Although useful app I break.', 'The app although useful because break.'], answer: 0, why: 'لا نضيف but مع although في هذا التركيب.' },
        { q: '___, test the prototype with users.', options: ['Finally', 'Because', 'Although', 'Must'], answer: 0, why: 'Finally تقدم خطوة أخيرة.' },
        { q: '“I enjoy reading,” said Maha. Maha said that she ___ reading.', options: ['enjoys', 'enjoyed', 'will enjoy', 'is enjoying'], answer: 1, why: 'في النقل بالماضي يتحول enjoy إلى enjoyed.' },
        { q: '“We will try again,” they said. They said that they ___ try again.', options: ['will', 'would', 'are', 'had'], answer: 1, why: 'will تتحول إلى would في النقل بالماضي.' },
        { q: 'Choose the correct imperative.', options: ['Don’t ignore feedback.', 'Doesn’t ignore feedback.', 'Not ignores feedback.', 'You don’t to ignore feedback.'], answer: 0, why: 'النهي: Don’t + الفعل الأساسي.' },
        { q: 'Which word can introduce a contrast?', options: ['Although', 'Finally', 'First', 'Because of the'], answer: 0, why: 'although تقدم تبايناً.' },
        { q: 'Choose the correct reported speech.', options: ['He told us that he was ready.', 'He told that us he is ready.', 'He said us he ready.', 'He told to us that ready.'], answer: 0, why: 'told يتبعها مفعول به ثم that-clause.' },
        { q: 'Write one screen-time rule using “mustn’t”.', answerText: 'Example: You mustn’t share a password. Any suitable rule is accepted.', points: 2 },
        { q: 'Give one imperative instruction for a design team.', answerText: 'Example: Listen to the users. Any correct imperative is accepted.', points: 2 },
        { q: 'Report: “The story is interesting,” Ali said.', answerText: 'Ali said that the story was interesting.', points: 2 },
        { q: 'Write a sentence about a prototype using “First” and “Finally” to order steps.', answerText: 'Example: First, draw a prototype. Finally, test it with users. Any logical sequence is accepted.', points: 2 }
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
    return stage === 'prep' && /^الثالث/.test(grade) && /(انجلي|english)/.test(subject) && term === 1 && ['lessons', 'exercises', 'exams'].indexOf(type) >= 0;
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
    current.href = 'https://www.abatschool.com/bank/grade3/english.html';
    current.target = '_blank'; current.rel = 'noopener';
    var book = el('a', 'كتاب الوزارة المتاح');
    book.href = 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026/Prepratory/Prepratory3/Term1/StudentBook/English_Prp3_Tr1.pdf';
    book.target = '_blank'; book.rel = 'noopener';
    var portal = el('a', 'فهرس الوزارة');
    portal.href = 'https://lessons.moe.gov.eg/g9/t1/s6/th0';
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
        block._grade9EnglishQuestion = q; block._grade9EnglishResult = result;
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
        var q = item._grade9EnglishQuestion; if (!q || !q.options) return;
        total += 1;
        var chosen = item.querySelector('input[type="radio"]:checked'); var correct = !!chosen && Number(chosen.value) === q.answer;
        if (correct) points += 1;
        item._grade9EnglishResult.style.display = 'block'; item._grade9EnglishResult.style.background = correct ? '#E8F5E9' : '#FFF3E0';
        item._grade9EnglishResult.textContent = (correct ? 'إجابة صحيحة. ' : 'راجع الإجابة. ') + q.why;
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
    var root = document.createElement('div'); root.className = 'grade9-english-original-content'; root.setAttribute('dir', 'rtl'); root.appendChild(noticeBox());
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
  if (typeof previousOpenContent === 'function' && !previousOpenContent.__grade9EnglishWrapped) {
    var wrappedOpenContent = async function (type, termNumber, termName) {
      var result = await previousOpenContent.apply(this, arguments);
      if (isTarget(type)) appendContent(type);
      return result;
    };
    wrappedOpenContent.__grade9EnglishWrapped = true; window.openContent = wrappedOpenContent;
  }
})();
