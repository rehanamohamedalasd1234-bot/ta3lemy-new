import { createClient } from "npm:@supabase/supabase-js@2";

const OWNER_EMAIL = "rehanamohamedalasd1234@gmail.com";
const ALLOWED_ORIGINS = new Set([
  "https://rehanamohamedalasd1234-bot.github.io",
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
]);

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

async function verifyOwnerToken(request: Request, admin: ReturnType<typeof getAdminClient>) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.slice(0, 7).toLowerCase() !== "bearer ") throw new Response("Unauthorized", { status: 401 });
  const token = authorization.slice(7).trim();
  if (!token) throw new Response("Unauthorized", { status: 401 });

  const { data, error } = await admin.auth.getUser(token);
  const user = data && data.user;
  if (error || !user) throw new Response("Unauthorized", { status: 401 });
  if (user.is_anonymous === true || !user.email_confirmed_at || String(user.email || "").trim().toLowerCase() !== OWNER_EMAIL) {
    throw new Response("Forbidden", { status: 403 });
  }
  return { id: user.id, email: OWNER_EMAIL };
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    const owner = await verifyOwnerToken(request, admin);
    const action = String(input.action || "");
    if (action === "verify") {
      return jsonResponse(200, { ok: true, data: { verified: true, owner_id: owner.id } }, origin);
    }

    let result;
    if (action === "list") {
      const status = input.status === "approved" ? "approved" : "pending";
      result = await admin.rpc("social_owner_list", { p_status: status });
    } else if (action === "stats") {
      result = await admin.rpc("social_owner_stats");
    } else if (action === "edit") {
      const postId = String(input.post_id || "");
      const content = typeof input.content === "string" ? input.content : null;
      if (!uuidPattern.test(postId) || content === null || content.length > 3000) {
        return jsonResponse(400, { error: "Invalid post data" }, origin);
      }
      result = await admin.rpc("social_owner_edit", { p_post_id: postId, p_content: content });
    } else if (action === "decide") {
      const postId = String(input.post_id || "");
      const decision = String(input.decision || "");
      if (!uuidPattern.test(postId) || !["approve", "reject", "delete"].includes(decision)) {
        return jsonResponse(400, { error: "Invalid moderation request" }, origin);
      }
      result = await admin.rpc("social_owner_decide", { p_post_id: postId, p_action: decision });
    } else if (action === "delete_comment") {
      const commentId = String(input.comment_id || "");
      if (!uuidPattern.test(commentId)) return jsonResponse(400, { error: "Invalid comment" }, origin);
      result = await admin.rpc("social_owner_delete_comment", { p_comment_id: commentId });
    } else {
      return jsonResponse(400, { error: "Unknown action" }, origin);
    }

    if (result.error) {
      console.error("Owner moderation RPC failed", { action, code: result.error.code });
      return jsonResponse(400, { error: "تعذر تنفيذ الإجراء. حدّثي الصفحة وحاولي مرة أخرى." }, origin);
    }
    return jsonResponse(200, { ok: true, data: result.data }, origin);
  } catch (error) {
    if (error instanceof Response) {
      const status = error.status;
      return jsonResponse(status, { error: status === 403 ? "هذا الحساب ليس حساب المالك المعتمد." : "جلسة الحساب غير صالحة؛ سجّلي الدخول مجددًا." }, origin);
    }
    console.error("Owner moderation request failed", error instanceof Error ? error.message : "unknown error");
    return jsonResponse(500, { error: "تعذر الاتصال بخدمة مراجعة المالك." }, origin);
  }
});
