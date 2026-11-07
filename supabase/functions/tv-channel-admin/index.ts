import { createClient } from "npm:@supabase/supabase-js@2";

const OWNER_EMAIL = "rehanamohamedalasd1234@gmail.com";
const ALLOWED_ORIGINS = new Set([
  "https://rehanamohamedalasd1234-bot.github.io",
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
]);
const CHANNEL_CATEGORIES = new Set(["sports", "education", "custom"]);
const CHANNEL_BEHAVIORS = new Set(["external", "youtube", "hls", "video"]);
const HEX = "0123456789abcdef";
const YOUTUBE_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

function headersFor(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function jsonResponse(status: number, body: Record<string, unknown>, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headersFor(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const secretMap = Deno.env.get("SUPABASE_SECRET_KEYS");
  let secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!secretKey && secretMap) {
    try { secretKey = String(JSON.parse(secretMap).default || ""); } catch (_) { /* checked below */ }
  }
  if (!url || !secretKey) throw new Error("Server configuration unavailable");
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function bearerToken(request: Request): string {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.slice(0, 7).toLowerCase() !== "bearer ") return "";
  return authorization.slice(7).trim();
}

async function verifyOwner(request: Request, admin: ReturnType<typeof getAdminClient>) {
  const token = bearerToken(request);
  if (!token) throw new Response("Unauthorized", { status: 401 });
  const { data, error } = await admin.auth.getUser(token);
  const user = data && data.user;
  if (error || !user) throw new Response("Unauthorized", { status: 401 });
  if (user.is_anonymous === true || !user.email_confirmed_at || String(user.email || "").trim().toLowerCase() !== OWNER_EMAIL) {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}

function safeHttpsUrl(value: unknown, required: boolean): string | null {
  const text = String(value == null ? "" : value).trim();
  if (!text && !required) return null;
  if (!text || text.length > 2048) throw new Response("Invalid URL", { status: 400 });
  let url: URL;
  try { url = new URL(text); } catch (_) { throw new Response("Invalid URL", { status: 400 }); }
  if (url.protocol !== "https:" || url.username || url.password) throw new Response("Only HTTPS URLs are allowed", { status: 400 });
  return url.href;
}

function validYouTubeId(id: string | null): boolean {
  return !!id && id.length === 11 && Array.from(id).every((character) => YOUTUBE_ID_CHARS.includes(character));
}

function isYouTubeVideoUrl(url: URL): boolean {
  let host = url.hostname.toLowerCase();
  if (host.startsWith("www.")) host = host.slice(4);
  if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "youtu.be") return false;
  const parts = url.pathname.split("/").filter(Boolean);
  let id = host === "youtu.be" ? parts[0] : url.searchParams.get("v") || undefined;
  if (!id && (parts[0] === "embed" || parts[0] === "live" || parts[0] === "shorts")) id = parts[1];
  return validYouTubeId(id || null);
}

function validateBehaviorUrl(behavior: string, value: string) {
  const url = new URL(value);
  const path = url.pathname.toLowerCase();
  if (behavior === "hls" && !path.endsWith(".m3u8")) throw new Response("HLS links must point to an .m3u8 playlist", { status: 400 });
  if (behavior === "video" && ![".mp4", ".m4v", ".webm", ".ogg"].some((extension) => path.endsWith(extension))) {
    throw new Response("Video link must be MP4, M4V, WEBM, or OGG", { status: 400 });
  }
  if (behavior === "youtube" && !isYouTubeVideoUrl(url)) throw new Response("YouTube link must identify one embeddable video", { status: 400 });
}

function cleanText(value: unknown): string {
  let cleaned = "";
  for (const character of String(value == null ? "" : value)) {
    const code = character.charCodeAt(0);
    cleaned += code <= 31 || code === 127 ? " " : character;
  }
  return cleaned.trim();
}

function validUuid(value: string): boolean {
  const parts = value.split("-");
  if (parts.length !== 5 || parts[0].length !== 8 || parts[1].length !== 4 || parts[2].length !== 4 || parts[3].length !== 4 || parts[4].length !== 12) return false;
  if (!parts.every((part) => Array.from(part.toLowerCase()).every((character) => HEX.includes(character)))) return false;
  const version = value[14];
  const variant = value[19].toLowerCase();
  return "12345".includes(version) && "89ab".includes(variant);
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) return jsonResponse(403, { error: "Origin not allowed" }, origin);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headersFor(origin) });
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed" }, origin);
  try {
    const text = await request.text();
    if (text.length > 12000) return jsonResponse(413, { error: "Request too large" }, origin);
    let input: Record<string, unknown>;
    try { input = JSON.parse(text); } catch (_) { return jsonResponse(400, { error: "Invalid JSON" }, origin); }
    const admin = getAdminClient();
    const owner = await verifyOwner(request, admin);
    const action = String(input.action || "");
    if (action === "add") {
      const name = cleanText(input.name);
      const description = cleanText(input.description);
      const category = String(input.category || "custom");
      const behavior = String(input.behavior || "external");
      if (name.length < 1 || name.length > 100 || description.length > 240 || !CHANNEL_CATEGORIES.has(category) || !CHANNEL_BEHAVIORS.has(behavior)) {
        return jsonResponse(400, { error: "الاسم أو التصنيف أو طريقة العرض غير صالحة." }, origin);
      }
      const watchUrl = safeHttpsUrl(input.watch_url, true)!;
      const logoUrl = safeHttpsUrl(input.logo_url, false);
      validateBehaviorUrl(behavior, watchUrl);
      const latest = await admin.from("tv_channels").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
      if (latest.error) throw latest.error;
      const sortOrder = Number(latest.data && latest.data.sort_order || 0) + 10;
      const inserted = await admin.from("tv_channels").insert({
        name, category, behavior, watch_url: watchUrl, logo_url: logoUrl,
        description, sort_order: sortOrder, is_active: true, created_by: owner.id,
      }).select("id,name,category,behavior,watch_url,logo_url,description,sort_order,is_active").single();
      if (inserted.error) {
        if (inserted.error.code === "23505") return jsonResponse(409, { error: "هذه القناة موجودة بالفعل." }, origin);
        console.error("TV channel insert failed", { code: inserted.error.code });
        return jsonResponse(400, { error: "تعذرت إضافة القناة." }, origin);
      }
      return jsonResponse(200, { ok: true, data: inserted.data }, origin);
    }
    if (action === "delete") {
      const id = String(input.id || "");
      if (!validUuid(id)) return jsonResponse(400, { error: "معرّف القناة غير صالح." }, origin);
      const deleted = await admin.from("tv_channels").delete().eq("id", id).select("id").maybeSingle();
      if (deleted.error) {
        console.error("TV channel delete failed", { code: deleted.error.code });
        return jsonResponse(400, { error: "تعذر حذف القناة." }, origin);
      }
      if (!deleted.data) return jsonResponse(404, { error: "القناة غير موجودة." }, origin);
      return jsonResponse(200, { ok: true, data: { id: deleted.data.id } }, origin);
    }
    if (action === "verify") return jsonResponse(200, { ok: true, data: { verified: true } }, origin);
    return jsonResponse(400, { error: "Unknown action" }, origin);
  } catch (error) {
    if (error instanceof Response) {
      const status = error.status;
      return jsonResponse(status, { error: status === 403 ? "هذا الحساب ليس بريد المالك المعتمد." : status === 401 ? "سجّلي الدخول ببريد المالك المعتمد." : "بيانات القناة أو الرابط غير صالحة." }, origin);
    }
    console.error("TV channel admin request failed", error instanceof Error ? error.message : "unknown error");
    return jsonResponse(500, { error: "تعذر الاتصال بخدمة إدارة القنوات." }, origin);
  }
});
