const DEFAULT_ALLOWED_ORIGINS = ['https://rehanamohamedalasd1234-bot.github.io'];
const MODEL = '@cf/google/gemma-4-26b-a4b-it';
const MAX_BODY_BYTES = 7000;
const MAX_QUESTION_CHARS = 1200;
const SYSTEM_PROMPT = [
  'أنت مساعد تعليمي عربي جاد ولطيف لطلاب منصة الأستاذ حافظ التعليمية في مصر.',
  'خاطب الطالب باللغة العربية الواضحة وبمستوى يناسب الصف والمرحلة والمادة التي أرسلها.',
  'ابدأ بالإجابة المباشرة، ثم اشرح الفكرة أو خطوات الحل حسب طريقة الشرح المطلوبة، وأضف مثالًا قصيرًا فقط إذا كان مفيدًا.',
  'في الرياضيات والعلوم اكتب الخطوات والوحدات بوضوح ولا تقفز إلى النتيجة. إن كان نص المسألة ناقصًا، اطلب الجزء الناقص بدل التخمين.',
  'لا تدّعِ أن إجابتك مطابقة حرفيًا لكتاب أو منهج رسمي، ولا تخترع أرقام صفحات أو مصادر. إذا لم تكن واثقًا فقل ذلك صراحة واقترح مراجعة الكتاب أو المعلم.',
  'في الأسئلة الدينية قدّم شرحًا تعليميًا عامًا منضبطًا، ولا تصدر فتوى شخصية؛ أحِل المسائل الخلافية أو الخاصة إلى معلم مؤهل.',
  'لا تطلب اسم الطالب أو عنوانه أو هاتفه أو أي بيانات شخصية، ولا تكرر بيانات شخصية إن ظهرت في السؤال. لا تشجع على مشاركة هذه البيانات.',
  'إذا لم يكن السؤال تعليميًا، أجب باختصار ثم وجّه الطالب إلى ما تستطيع مساعدته فيه دراسيًا. اجعل الإجابة آمنة ومناسبة للأطفال.',
  'أجب بالعربية دائمًا إلا إذا طلب الطالب شرحًا لغويًا بلغة أخرى.'
].join('\n');

function allowedOrigins(env) {
  const configured = typeof env.ALLOWED_ORIGINS === 'string'
    ? env.ALLOWED_ORIGINS.split(',').map((value) => value.trim()).filter(Boolean)
    : [];
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function response(request, status, body, env = {}) {
  const origin = request.headers.get('Origin') || '';
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin'
  });
  if (allowedOrigins(env).includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400');
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function cleanShort(value, max = 60) {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max) : '';
}

function containsContactDetails(value) {
  const normalized = value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
  const compact = normalized.replace(/[\s().-]/g, '');
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalized);
  const hasEgyptianMobile = /(?:\+?20)?0?1[0125]\d{8}/.test(compact);
  return hasEmail || hasEgyptianMobile;
}

async function readBodyLimited(request, maxBytes) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  const parts = [];
  let bytes = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxBytes) {
        try { await reader.cancel(); } catch (_) {}
        const error = new Error('request body too large');
        error.code = 'BODY_TOO_LARGE';
        throw error;
      }
      parts.push(decoder.decode(chunk.value, { stream: true }));
    }
    parts.push(decoder.decode());
    return parts.join('');
  } finally {
    try { reader.releaseLock(); } catch (_) {}
  }
}

function textFrom(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) {
    return value.map((part) => typeof part === 'string' ? part : part && typeof part.text === 'string' ? part.text : '').filter(Boolean).join('').trim();
  }
  if (value && typeof value === 'object') {
    if (typeof value.text === 'string') return value.text.trim();
    if (typeof value.content === 'string') return value.content.trim();
  }
  return '';
}

function getAnswer(result) {
  if (typeof result === 'string') return result.trim();
  if (!result || typeof result !== 'object') return '';
  for (const candidate of [result.response, result.output_text, result.generated_text, result.text, result.content]) {
    const text = textFrom(candidate);
    if (text) return text;
  }
  if (Array.isArray(result.choices)) {
    for (const choice of result.choices) {
      const text = textFrom(choice && choice.message && choice.message.content) || textFrom(choice && choice.text);
      if (text) return text;
    }
  }
  if (result.result && result.result !== result) return getAnswer(result.result);
  return '';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const origins = allowedOrigins(env);

    if (url.pathname === '/health' && request.method === 'GET') {
      if (origin && !origins.includes(origin)) return response(request, 403, { error: 'هذا المصدر غير مسموح.' }, env);
      const ready = Boolean(env.AI && typeof env.AI.run === 'function' && env.ASK_RATE_LIMIT && typeof env.ASK_RATE_LIMIT.limit === 'function');
      return response(request, 200, { ok: true, service: 'ta3lemy-ask', ready }, env);
    }

    if (url.pathname !== '/ask') return response(request, 404, { error: 'المسار غير موجود.' }, env);
    if (request.method === 'OPTIONS') {
      if (!origins.includes(origin)) return response(request, 403, { error: 'هذا المصدر غير مسموح.' }, env);
      return new Response(null, { status: 204, headers: response(request, 200, {}, env).headers });
    }
    if (request.method !== 'POST') return response(request, 405, { error: 'استخدم طلب POST لإرسال السؤال.' }, env);
    if (!origins.includes(origin)) return response(request, 403, { error: 'هذا المصدر غير مسموح.' }, env);
    if (!env.AI || typeof env.AI.run !== 'function') return response(request, 503, { error: 'خدمة الإجابة لم تُجهّز بعد.' }, env);
    if (!env.ASK_RATE_LIMIT || typeof env.ASK_RATE_LIMIT.limit !== 'function') return response(request, 503, { error: 'خدمة تحديد الاستخدام غير مهيّأة؛ أُوقفت الإجابة لحماية الحصة.' }, env);

    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.toLowerCase().includes('application/json')) return response(request, 415, { error: 'يجب إرسال السؤال بصيغة JSON.' }, env);

    // CORS is only a browser policy, not authentication. Treat this as a public endpoint and limit before reading any body.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    try {
      const limit = await env.ASK_RATE_LIMIT.limit({ key: ip });
      if (!limit.success) return response(request, 429, { error: 'أرسلت أسئلة كثيرة في وقت قصير. انتظر دقيقة ثم أعد المحاولة.' }, env);
    } catch (_) {
      return response(request, 503, { error: 'تعذر التحقق من حد الاستخدام الآن. حاول لاحقًا.' }, env);
    }

    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > MAX_BODY_BYTES) return response(request, 413, { error: 'الطلب كبير جدًا.' }, env);

    let raw;
    try { raw = await readBodyLimited(request, MAX_BODY_BYTES); }
    catch (error) {
      if (error && error.code === 'BODY_TOO_LARGE') return response(request, 413, { error: 'الطلب كبير جدًا.' }, env);
      return response(request, 400, { error: 'تعذرت قراءة السؤال.' }, env);
    }

    let body;
    try { body = JSON.parse(raw); }
    catch (_) { return response(request, 400, { error: 'صيغة السؤال غير صحيحة.' }, env); }
    const question = cleanShort(body && body.question, MAX_QUESTION_CHARS);
    const stage = cleanShort(body && body.stage, 60) || 'التعليم العام';
    const grade = cleanShort(body && body.grade, 60) || 'غير محدد';
    const subject = cleanShort(body && body.subject, 60) || 'مادة أخرى';
    const style = ['simple', 'steps', 'short'].includes(body && body.style) ? body.style : 'simple';
    if (question.length < 3) return response(request, 400, { error: 'اكتب سؤالًا من ثلاثة أحرف على الأقل.' }, env);
    if (containsContactDetails(question)) return response(request, 400, { error: 'احذف رقم الهاتف أو البريد الإلكتروني من السؤال ثم أرسله مرة أخرى لحماية خصوصيتك.' }, env);

    const styleText = style === 'steps'
      ? 'اشرح الحل خطوة بخطوة.'
      : style === 'short' ? 'أجب بإيجاز شديد.' : 'اشرح ببساطة وباختصار مناسب.';
    const userPrompt = `المرحلة: ${stage}\nالصف: ${grade}\nالمادة: ${subject}\nطريقة الشرح: ${styleText}\n\nسؤال الطالب:\n${question}`;

    try {
      const result = await env.AI.run(MODEL, {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 550,
        temperature: 0.2,
        top_p: 0.85,
        chat_template_kwargs: { enable_thinking: false }
      });
      const answer = getAnswer(result);
      if (!answer) return response(request, 502, { error: 'لم يرجع المساعد إجابة نصية. أعد صياغة السؤال وجرب مرة أخرى.' }, env);
      return response(request, 200, { answer, model: 'مساعد دراسي عربي' }, env);
    } catch (_) {
      // Do not log question text or model payloads; protect student privacy.
      return response(request, 503, { error: 'توقفت خدمة الإجابة مؤقتًا أو وصلت إلى الحصة المجانية. جرّب لاحقًا.' }, env);
    }
  }
};
