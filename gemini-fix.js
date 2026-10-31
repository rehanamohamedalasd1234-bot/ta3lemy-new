window.ENHANCE_WORKER_URL =
  window.ENHANCE_WORKER_URL ||
  "https://ta3lemy-enhance.ta3lemy-hafez-free.workers.dev/enhance";

var ENHANCE_WORKER_URL = window.ENHANCE_WORKER_URL;

window.enhanceArtwork = async function enhanceArtwork() {
  const canvas = document.getElementById("fullDrawingCanvas");

  if (!canvas) {
    if (typeof showToast === "function") {
      showToast("لم يتم العثور على لوحة الرسم.");
    }
    return;
  }

  if (typeof showToast === "function") {
    showToast("جارٍ تحسين الرسم...");
  }

  try {
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    const commaIndex = dataUrl.indexOf(",");

    if (commaIndex < 0) {
      throw new Error("تعذر تجهيز صورة الرسم.");
    }

    const imageBase64 = dataUrl.slice(commaIndex + 1);

    const response = await fetch(ENHANCE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageBase64,
        mimeType: "image/jpeg"
      })
    });

    const responseText = await response.text();
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch (_) {
      result = { error: responseText.slice(0, 300) || "استجابة غير مفهومة من الخادم." };
    }

    if (!response.ok) {
      throw new Error(result.error || `فشل الطلب (${response.status})`);
    }

    if (!result.imageBase64) {
      throw new Error("لم تصل صورة محسّنة من الخدمة.");
    }

    // اعرض النتيجة بجانب الرسم الأصلي حتى لا نفقده.
    let preview = document.getElementById("enhancedArtworkResult");

    if (!preview) {
      preview = document.createElement("section");
      preview.id = "enhancedArtworkResult";
      preview.style.cssText =
        "margin:16px 0;padding:12px;border:1px solid #ddd;border-radius:12px;";

      const heading = document.createElement("h3");
      heading.textContent = "الرسم بعد التحسين";

      const image = document.createElement("img");
      image.id = "enhancedArtworkImage";
      image.alt = "الرسم بعد تحسينه";
      image.style.cssText =
        "display:block;max-width:100%;height:auto;border-radius:8px;";

      const download = document.createElement("a");
      download.id = "enhancedArtworkDownload";
      download.textContent = "تنزيل الصورة المحسّنة";
      download.style.cssText = "display:inline-block;margin-top:10px;";

      preview.append(heading, image, download);
      canvas.insertAdjacentElement("afterend", preview);
    }

    const mimeType = ["image/png", "image/jpeg", "image/webp"].includes(
      result.mimeType
    )
      ? result.mimeType
      : "image/png";

    const imageUrl = `data:${mimeType};base64,${result.imageBase64}`;

    document.getElementById("enhancedArtworkImage").src = imageUrl;

    const extension = mimeType === "image/jpeg"
      ? "jpg"
      : mimeType.split("/")[1];

    const downloadLink =
      document.getElementById("enhancedArtworkDownload");

    downloadLink.href = imageUrl;
    downloadLink.download = `drawing-enhanced.${extension}`;

    if (typeof showToast === "function") {
      showToast("تم تحسين الرسم. يمكنكِ معاينته أو تنزيله.");
    }
  } catch (error) {
    console.error("Artwork enhancement error:", error);

    if (typeof showToast === "function") {
      const detail = error instanceof TypeError
        ? "تعذر الاتصال بخادم التحسين؛ تحققي من إعدادات CORS ورابط Worker."
        : (error.message || "خطأ غير معروف");
      showToast("تعذر تحسين الرسم: " + detail);
    }
  }
};
