import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/ta3lemy-library/src/index.mjs';

const ORIGIN = 'https://rehanamohamedalasd1234-bot.github.io';

function makeEnv(initial) {
  const values = new Map();
  if (initial) values.set('ta3lemy-library-catalog-v1', JSON.stringify(initial));
  return {
    ALLOWED_ORIGIN: ORIGIN,
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
    LIBRARY_KV: {
      async get(key, type) {
        const value = values.get(key);
        return value === undefined ? null : type === 'json' ? JSON.parse(value) : value;
      },
      async put(key, value) { values.set(key, String(value)); },
    },
    values,
  };
}

function request(path, options = {}) {
  return new Request('https://library.test' + path, {
    headers: { Origin: ORIGIN, ...(options.headers || {}) },
    ...options,
  });
}

function setSupabaseUser(t, user = {
  email: 'rehanamohamedalasd1234@gmail.com',
  email_confirmed_at: '2026-01-01T00:00:00Z',
  is_anonymous: false,
}) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), 'https://example.supabase.co/auth/v1/user');
    assert.equal(options.headers.apikey, 'public-test-key');
    assert.equal(options.headers.Authorization, 'Bearer valid-owner-token');
    return new Response(JSON.stringify(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  t.after(() => { globalThis.fetch = originalFetch; });
}

const sampleBook = {
  id: 'book-1',
  title: 'كتاب تجريبي',
  author: 'مؤلف تجريبي',
  folder: 'علوم ورياضيات',
  description: 'وصف قصير',
  license: 'كتاب من تأليف المالك',
  rightsNote: 'أملك حقوق نشر هذا الكتاب',
  rightsConfirmed: true,
  format: 'text',
  textContent: 'محتوى كتاب تجريبي.',
  allowCopy: true,
  allowDownload: true,
  allowPrint: true,
  status: 'published',
};

 test('health endpoint reports whether storage is bound', async () => {
  const response = await worker.fetch(request('/health'), makeEnv());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, storageReady: true });
});

test('public catalog never returns drafts', async () => {
  const env = makeEnv({ version: 1, folders: ['علوم ورياضيات'], books: [sampleBook, { ...sampleBook, id: 'draft-1', status: 'draft' }] });
  const response = await worker.fetch(request('/catalog'), env);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body.books.map((book) => book.id), ['book-1']);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('draft catalog is protected by a verified owner session', async () => {
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog?all=1'), env);
  assert.equal(response.status, 401);
});

test('writes are protected by owner authentication', async () => {
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: [], books: [] }),
  }), env);
  assert.equal(response.status, 401);
  assert.equal(env.values.size, 0);
});

test('unapproved origins are rejected', async () => {
  const env = makeEnv();
  const response = await worker.fetch(new Request('https://library.test/catalog', { headers: { Origin: 'https://attacker.example' } }), env);
  assert.equal(response.status, 403);
});

test('preflight permits only the configured site origin and required headers', async () => {
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', { method: 'OPTIONS' }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.match(response.headers.get('Access-Control-Allow-Headers'), /Authorization/i);
});

test('verified owner can save a licensed book and public reads show it', async (t) => {
  setSupabaseUser(t);
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: ['علوم ورياضيات'], books: [sampleBook] }),
  }), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  const publicResponse = await worker.fetch(request('/catalog'), env);
  assert.deepEqual((await publicResponse.json()).books.map((book) => book.title), ['كتاب تجريبي']);
});

test('catalogs above the former 12 MiB request limit can still be saved within the catalog limit', async (t) => {
  setSupabaseUser(t);
  const env = makeEnv();
  const largeText = 'x'.repeat(340_000);
  const books = Array.from({ length: 40 }, (_, index) => ({
    ...sampleBook,
    id: 'large-' + index,
    title: 'كتاب ' + index,
    format: 'text',
    fileUrl: '',
    textContent: largeText,
  }));
  const body = JSON.stringify({ version: 1, folders: ['علوم ورياضيات'], books });
  assert.ok(Buffer.byteLength(body) > 12 * 1024 * 1024);
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body,
  }), env);
  assert.equal(response.status, 200);
});

test('another verified email cannot write to the library', async (t) => {
  setSupabaseUser(t, {
    email: 'not-the-owner@example.com',
    email_confirmed_at: '2026-01-01T00:00:00Z',
    is_anonymous: false,
  });
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: [], books: [] }),
  }), env);
  assert.equal(response.status, 403);
  assert.equal(env.values.size, 0);
});

test('unconfirmed owner email cannot write to the library', async (t) => {
  setSupabaseUser(t, {
    email: 'rehanamohamedalasd1234@gmail.com',
    email_confirmed_at: null,
    is_anonymous: false,
  });
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: [], books: [] }),
  }), env);
  assert.equal(response.status, 403);
  assert.equal(env.values.size, 0);
});

test('anonymous session cannot write to the library', async (t) => {
  setSupabaseUser(t, {
    email: 'rehanamohamedalasd1234@gmail.com',
    email_confirmed_at: '2026-01-01T00:00:00Z',
    is_anonymous: true,
  });
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: [], books: [] }),
  }), env);
  assert.equal(response.status, 403);
  assert.equal(env.values.size, 0);
});

test('books cannot be published without explicit rights confirmation', async (t) => {
  setSupabaseUser(t);
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: [], books: [{ ...sampleBook, rightsConfirmed: false }] }),
  }), env);
  assert.equal(response.status, 400);
  assert.equal(env.values.size, 0);
});

test('PDF catalog entries require a valid HTTPS URL', async (t) => {
  setSupabaseUser(t);
  const env = makeEnv();
  const response = await worker.fetch(request('/catalog', {
    method: 'PUT',
    headers: { Authorization: 'Bearer valid-owner-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, folders: [], books: [{ ...sampleBook, format: 'pdf', fileUrl: 'javascript:alert(1)' }] }),
  }), env);
  assert.equal(response.status, 400);
  assert.equal(env.values.size, 0);
});
