const CATALOG_KEY = 'ta3lemy-library-catalog-v1';
const OWNER_EMAIL = 'rehanamohamedalasd1234@gmail.com';
const MAX_CATALOG_BYTES = 20 * 1024 * 1024;
const MAX_BODY_BYTES = MAX_CATALOG_BYTES + 4 * 1024 * 1024;
const MAX_BOOKS = 500;
const MAX_FOLDERS = 150;
const MAX_TEXT_LENGTH = 350_000;

const DEFAULT_FOLDERS = [
  'مراجع دراسية',
  'لغة وأدب',
  'علوم ورياضيات',
  'تاريخ وجغرافيا',
  'دين وثقافة',
  'تكنولوجيا',
  'صحة وحياة',
  'تنمية ومهارات',
  'أطفال وقصص',
  'متنوعات',
];

class LibraryError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function corsHeaders(origin, env) {
  const headers = new Headers({
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  });
  if (origin && origin === env.ALLOWED_ORIGIN) headers.set('Access-Control-Allow-Origin', origin);
  return headers;
}

function jsonResponse(payload, status, origin, env) {
  const headers = corsHeaders(origin, env);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(payload), { status: status || 200, headers });
}

function cleanString(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeCatalog(input) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.books) || !Array.isArray(input.folders)) {
    throw new LibraryError(400, 'صيغة فهرس المكتبة غير صحيحة');
  }
  if (input.books.length > MAX_BOOKS || input.folders.length > MAX_FOLDERS) {
    throw new LibraryError(413, 'تجاوزت المكتبة الحد المسموح للعناوين أو المجلدات');
  }

  const folderNames = new Set(DEFAULT_FOLDERS);
  for (const entry of input.folders) {
    const name = cleanString(typeof entry === 'string' ? entry : entry && entry.name, 80);
    if (name) folderNames.add(name);
  }

  const ids = new Set();
  const books = input.books.map((raw) => {
    if (!raw || typeof raw !== 'object') throw new LibraryError(400, 'يوجد سجل كتاب غير صالح');
    const title = cleanString(raw.title, 160);
    const author = cleanString(raw.author, 120);
    const folder = cleanString(raw.folder, 80) || 'متنوعات';
    const description = cleanString(raw.description, 1200);
    const license = cleanString(raw.license, 160);
    const rightsNote = cleanString(raw.rightsNote, 800);
    const format = raw.format === 'text' ? 'text' : 'pdf';
    const status = raw.status === 'draft' ? 'draft' : 'published';
    const rightsConfirmed = raw.rightsConfirmed === true;
    const id = cleanString(raw.id, 80) || crypto.randomUUID();

    if (!title || !author || !license) throw new LibraryError(400, 'العنوان واسم المؤلف وبيان الحقوق مطلوبة');
    if (!rightsConfirmed) throw new LibraryError(400, 'يجب تأكيد امتلاك حقوق النشر أو وجود ترخيص يسمح بالنشر');
    if (ids.has(id)) throw new LibraryError(400, 'معرّف كتاب مكرر');
    ids.add(id);
    folderNames.add(folder);

    let fileUrl = '';
    let textContent = '';
    if (format === 'pdf') {
      try {
        const parsed = new URL(raw.fileUrl);
        if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('invalid URL');
        fileUrl = parsed.toString();
      } catch (_) {
        throw new LibraryError(400, 'رابط ملف PDF يجب أن يكون رابط HTTPS صالحًا');
      }
    } else {
      textContent = String(raw.textContent || '');
      if (!textContent.trim() || textContent.length > MAX_TEXT_LENGTH) {
        throw new LibraryError(400, 'نص الكتاب فارغ أو أكبر من الحد المسموح');
      }
    }

    const now = new Date().toISOString();
    return {
      id,
      title,
      author,
      folder,
      description,
      license,
      rightsNote,
      rightsConfirmed,
      format,
      fileUrl,
      textContent,
      allowCopy: raw.allowCopy === true,
      allowDownload: raw.allowDownload === true,
      allowPrint: raw.allowPrint === true,
      status,
      createdAt: cleanString(raw.createdAt, 40) || now,
      updatedAt: now,
      createdBy: OWNER_EMAIL,
    };
  });

  return { version: 1, folders: Array.from(folderNames).sort((a, b) => a.localeCompare(b, 'ar')), books };
}

async function readBody(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) throw new LibraryError(415, 'يُقبل محتوى JSON فقط');
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_BODY_BYTES) throw new LibraryError(413, 'حجم الطلب أكبر من الحد المسموح');
  if (!request.body) throw new LibraryError(400, 'الطلب فارغ');

  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new LibraryError(413, 'حجم الطلب أكبر من الحد المسموح');
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (_) {
    throw new LibraryError(400, 'تعذر قراءة بيانات المكتبة');
  }
}

async function requireOwner(request, env) {
  const header = request.headers.get('Authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new LibraryError(401, 'يلزم تسجيل دخول المالك الموثّق');
  }

  let response;
  try {
    response = await fetch(new URL('/auth/v1/user', env.SUPABASE_URL), {
      method: 'GET',
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: 'Bearer ' + match[1],
      },
    });
  } catch (_) {
    throw new LibraryError(503, 'تعذر التحقق من جلسة المالك مؤقتًا');
  }

  if (!response.ok) throw new LibraryError(401, 'انتهت جلسة المالك؛ سجّل الدخول مجددًا');
  let user;
  try { user = await response.json(); } catch (_) { throw new LibraryError(401, 'جلسة المالك غير صالحة'); }
  const email = String(user && user.email || '').trim().toLowerCase();
  if (email !== OWNER_EMAIL || user.is_anonymous === true || !user.email_confirmed_at) {
    throw new LibraryError(403, 'هذه العملية متاحة لحساب المالك الموثّق فقط');
  }
  return true;
}

async function loadCatalog(env) {
  if (!env.LIBRARY_KV) throw new LibraryError(503, 'تخزين المكتبة غير متاح');
  const existing = await env.LIBRARY_KV.get(CATALOG_KEY, 'json');
  if (existing && Array.isArray(existing.books) && Array.isArray(existing.folders)) return existing;
  return { version: 1, folders: DEFAULT_FOLDERS, books: [] };
}

async function saveCatalog(env, input) {
  const catalog = normalizeCatalog(input);
  const serialized = JSON.stringify(catalog);
  if (new TextEncoder().encode(serialized).byteLength > MAX_CATALOG_BYTES) {
    throw new LibraryError(413, 'حجم فهرس الكتب تجاوز الحد الآمن؛ قلّل النصوص المرفقة');
  }
  await env.LIBRARY_KV.put(CATALOG_KEY, serialized, { metadata: { version: 1, updatedAt: new Date().toISOString() } });
  return catalog;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin && origin !== env.ALLOWED_ORIGIN) {
      return new Response('Forbidden origin', { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }
    const headers = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    try {
      if (url.pathname === '/health' && request.method === 'GET') {
        return jsonResponse({ ok: true, storageReady: !!env.LIBRARY_KV }, env.LIBRARY_KV ? 200 : 503, origin, env);
      }

      if (url.pathname === '/catalog' && request.method === 'GET') {
        if (!env.LIBRARY_KV) throw new LibraryError(503, 'تخزين المكتبة غير متاح');
        const includeDrafts = url.searchParams.get('all') === '1';
        if (includeDrafts) await requireOwner(request, env);
        const catalog = await loadCatalog(env);
        if (includeDrafts) return jsonResponse(catalog, 200, origin, env);
        return jsonResponse({
          version: catalog.version || 1,
          folders: catalog.folders || DEFAULT_FOLDERS,
          books: (catalog.books || []).filter((book) => book.status === 'published'),
        }, 200, origin, env);
      }

      if (url.pathname === '/catalog' && request.method === 'PUT') {
        await requireOwner(request, env);
        const input = await readBody(request);
        const catalog = await saveCatalog(env, input);
        return jsonResponse({ ok: true, catalog }, 200, origin, env);
      }

      if (url.pathname === '/health' || url.pathname === '/catalog') {
        return jsonResponse({ error: 'الطريقة غير مسموح بها' }, 405, origin, env);
      }
      return jsonResponse({ error: 'المسار غير موجود' }, 404, origin, env);
    } catch (error) {
      if (error instanceof LibraryError) return jsonResponse({ error: error.message }, error.status, origin, env);
      console.error('[library-api] request failed:', error && error.message || 'unknown error');
      return jsonResponse({ error: 'تعذر إتمام العملية الآن' }, 500, origin, env);
    }
  },
};
