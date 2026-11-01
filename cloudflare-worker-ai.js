// Ta3lemy AI artwork enhancement Worker
// Cloudflare Worker module. Keep GEMINI_API_KEY as a Worker Secret; never place it in browser code.

const ALLOWED_ORIGINS = new Set([
  "https://rehanamohamedalasd1234-bot.github.io"
]);

const MAX_BODY_BYTES = 7 * 1024 * 1024;
const MAX_IMAGE_BASE64_CHARS = 6_500_000;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function makeHeaders(origin) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin"
  });

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

function jsonResponse(request, status, data, extraHeaders = {}) {
  const headers = makeHeaders(request.headers.get("Origin"));
  for (const [name, value] of Object.entries(extraHeaders)) headers.set(name, value);
  return new Response(JSON.stringify(data), { status, headers });
}

function isAllowedOrigin(request) {
  return ALLOWED_ORIGINS.has(request.headers.get("Origin") || "");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (url.pathname === "/health" && request.method === "GET") {
      if (origin && !ALLOWED_ORIGINS.has(origin)) {
        return jsonResponse(request, 403, { error: "هذا المصدر غير مسموح." });
      }
      return jsonResponse(request, 200, {
        ok: true,
        service: "ta3lemy-ai-worker",
        configured: Boolean(env.GEMINI_API_KEY)
      });
    }

    if (url.pathname !== "/enhance") {
      return jsonResponse(request, 404, { error: "المسار غير موجود." });
    }

    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin(request)) {
        return jsonResponse(request, 403, { error: "هذا المصدر غير مسموح." });
      }
      return new Response(null, { status: 204, headers: makeHeaders(origin) });
    }

    if (request.method !== "POST") {
      return jsonResponse(request, 405, { error: "استخدمي طلب POST لتحسين الرسم." }, {
        "Allow": "POST, OPTIONS"
      });
    }

    // CORS is not authentication, but rejecting unknown origins prevents accidental browser use.
    if (!isAllowedOrigin(request)) {
      return jsonResponse(request, 403, { error: "هذا المصدر غير مسموح." });
    }

    if (!env.GEMINI_API_KEY) {
      return jsonResponse(request, 500, {
        error: "مفتاح Gemini غير مضبوط في Worker. أضيفي Secret باسم GEMINI_API_KEY."
      });
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonResponse(request, 415, { error: "يجب إرسال البيانات بصيغة JSON." });
    }

    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return jsonResponse(request, 413, { error: "حجم الصورة كبير؛ قللي حجم الرسم ثم أعيدي المحاولة." });
    }

    let rawBody;
    try {
      rawBody = await request.text();
    } catch (_) {
      return jsonResponse(request, 400, { error: "تعذر قراءة بيانات الرسم." });
    }

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse(request, 413, { error: "حجم الصورة كبير؛ قللي حجم الرسم ثم أعيدي المحاولة." });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (_) {
      return jsonResponse(request, 400, { error: "بيانات JSON غير صحيحة." });
    }

    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
    const mimeType = typeof body.mimeType === "string" ? body.mimeType.toLowerCase() : "";

    if (!imageBase64 || imageBase64.length > MAX_IMAGE_BASE64_CHARS) {
      return jsonResponse(request, 400, { error: "الصورة فارغة أو أكبر من الحد المسموح." });
    }
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return jsonResponse(request, 400, { error: "صيغة الصورة غير مدعومة. استخدمي PNG أو JPG أو WebP." });
    }
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(imageBase64)) {
      return jsonResponse(request, 400, { error: "بيانات الصورة ليست Base64 صحيحة." });
    }

    const model = env.GEMINI_IMAGE_MODEL || "gemini-nano-banana-2.1";
    if (!/^[A-Za-z0-9._-]+$/.test(model)) {
      return jsonResponse(request, 500, { error: "اسم نموذج Gemini في إعدادات Worker غير صالح." });
    }

    const prompt = [
      "حسّن هذا الرسم الذي رسمه طفل مع الحفاظ على الفكرة والعناصر الأساسية وتكوينها.",
      "حوّله إلى عمل فني ملون وواضح وجميل ومناسب للأطفال، مع ألوان لطيفة وخطوط نظيفة.",
      "لا تضف أي كتابة أو شعارات، ولا تغيّر موضوع الرسم إلى شيء مختلف. أعد صورة محسّنة فقط."
    ].join(" ");

    let geminiResponse;
    try {
      geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: imageBase64 } }
              ]
            }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
          })
        }
      );
    } catch (error) {
      console.error("Gemini network error:", error && error.message ? error.message : error);
      return jsonResponse(request, 502, { error: "تعذر الاتصال بخدمة Gemini. حاولي مرة أخرى بعد قليل." });
    }

    let result;
    try {
      result = await geminiResponse.json();
    } catch (_) {
      result = {};
    }

    if (!geminiResponse.ok) {
      const detail = result && result.error && result.error.message
        ? String(result.error.message).slice(0, 400)
        : "لم تقدم الخدمة تفاصيل إضافية.";
      console.error("Gemini API error:", geminiResponse.status, detail);
      const status = geminiResponse.status === 429 ? 429 : 502;
      return jsonResponse(request, status, {
        error: `تعذر تحسين الرسم (Gemini ${geminiResponse.status}): ${detail}`
      });
    }

    const parts = result && result.candidates && result.candidates[0]
      && result.candidates[0].content && result.candidates[0].content.parts
      ? result.candidates[0].content.parts
      : [];

    for (const part of parts) {
      const image = part.inlineData || part.inline_data;
      if (image && image.data) {
        return jsonResponse(request, 200, {
          imageBase64: image.data,
          mimeType: image.mimeType || image.mime_type || "image/png"
        });
      }
    }

    const textDetail = parts
      .filter(part => typeof part.text === "string")
      .map(part => part.text)
      .join(" ")
      .slice(0, 300);
    return jsonResponse(request, 502, {
      error: textDetail
        ? `لم ترجع Gemini صورة محسّنة. ${textDetail}`
        : "لم ترجع Gemini صورة محسّنة. جرّبي رسمًا آخر أو أعيدي المحاولة."
    });
  }
};
