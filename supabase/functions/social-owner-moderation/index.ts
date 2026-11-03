import { createClient } from "npm:@supabase/supabase-js@2";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.10.0";

const FIREBASE_PROJECT_ID = "ta3lemt-hafez";
const OWNER_EMAIL = "hafezzaza98@gmail.com";
const ALLOWED_ORIGIN = "https://rehanamohamedalasd1234-bot.github.io";
const ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
};

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const secretMap = Deno.env.get("SUPABASE_SECRET_KEYS");
  let secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!secretKey && secretMap) {
    try { secretKey = String(JSON.parse(secretMap).default || ""); } catch (_) { /* handled below */ }
  }
  if (!url || !secretKey) throw new Error("Server configuration unavailable");
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function verifyOwnerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Response("Unauthorized", { status: 401 });

  let verified;
  try {
    verified = await jwtVerify(match[1], FIREBASE_JWKS, {
      issuer: ISSUER,
      audience: FIREBASE_PROJECT_ID,
      algorithms: ["RS256"],
    });
  } catch (_) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const { payload, protectedHeader } = verified;
  const firebaseClaims = payload.firebase && typeof payload.firebase === "object"
    ? payload.firebase as Record<string, unknown>
    : {};
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const authTime = Number(payload.auth_time || 0);
  const now = Math.floor(Date.now() / 1000);

  if (!protectedHeader.kid || typeof payload.sub !== "string" || !payload.sub || payload.sub.length > 128) {
    throw new Response("Unauthorized", { status: 401 });
  }
  if (email !== OWNER_EMAIL || payload.email_verified !== true || firebaseClaims.sign_in_provider !== "google.com") {
    throw new Response("Forbidden", { status: 403 });
  }
  if (!authTime || authTime > now + 30) throw new Response("Unauthorized", { status: 401 });
  return { uid: payload.sub, email };
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") {
    if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (origin !== ALLOWED_ORIGIN) return jsonResponse(403, { error: "Origin not allowed" });
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed" });

  try {
    const owner = await verifyOwnerToken(request);
    const text = await request.text();
    if (text.length > 12000) return jsonResponse(413, { error: "Request too large" });
    let input: Record<string, unknown>;
    try { input = JSON.parse(text); } catch (_) { return jsonResponse(400, { error: "Invalid JSON" }); }
    const action = String(input.action || "");
    if (action === "verify") {
      return jsonResponse(200, { ok: true, data: { email: owner.email } });
    }

    const admin = getAdminClient();
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
        return jsonResponse(400, { error: "Invalid post data" });
      }
      result = await admin.rpc("social_owner_edit", { p_post_id: postId, p_content: content });
    } else if (action === "decide") {
      const postId = String(input.post_id || "");
      const decision = String(input.decision || "");
      if (!uuidPattern.test(postId) || !["approve", "reject", "delete"].includes(decision)) {
        return jsonResponse(400, { error: "Invalid moderation request" });
      }
      result = await admin.rpc("social_owner_decide", { p_post_id: postId, p_action: decision });
    } else if (action === "delete_comment") {
      const commentId = String(input.comment_id || "");
      if (!uuidPattern.test(commentId)) return jsonResponse(400, { error: "Invalid comment" });
      result = await admin.rpc("social_owner_delete_comment", { p_comment_id: commentId });
    } else {
      return jsonResponse(400, { error: "Unknown action" });
    }

    if (result.error) {
      console.error("Owner moderation RPC failed", { action, code: result.error.code });
      return jsonResponse(400, { error: "تعذر تنفيذ الإجراء. حدّثي الصفحة وحاولي مرة أخرى." });
    }
    return jsonResponse(200, { ok: true, data: result.data });
  } catch (error) {
    if (error instanceof Response) {
      const status = error.status;
      return jsonResponse(status, { error: status === 403 ? "هذا الحساب غير مخوّل لإدارة المنشورات." : "جلسة Google غير صالحة؛ سجّلي الدخول مجددًا." });
    }
    console.error("Owner moderation request failed", error instanceof Error ? error.message : "unknown error");
    return jsonResponse(500, { error: "تعذر الاتصال بخدمة مراجعة المالك." });
  }
});
