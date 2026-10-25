// Service Worker للمنصة: تحديث الشبكة أولًا، ثم الرجوع إلى النسخة المحفوظة دون إنترنت.
// لا نحذف الكاش القديم حتى لا تُفقد الدروس التي نزّلها الطلاب.
const CACHE = 'hafez-offline-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './extras.js',
  './extras-patch.js',
  './teacher.js',
  './chat.js',
  './private-chat.js',
  './creativity-config.js',
  './creativity.js',
  './broadcast.js',
  './vendor/livekit-client.umd.js',
  './fix-canvas.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL_FILES.map(async (file) => {
      try {
        const request = new Request(new URL(file, self.location.href), { cache: 'reload' });
        const response = await fetch(request);
        if (response && response.ok) await cache.put(request, response.clone());
      } catch (_) {
        // تثبيت العامل لا يفشل بالكامل إن تعذر تنزيل ملف مفرد.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch (_) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match(new URL('./index.html', self.location.href));
      if (shell) return shell;
    }
    return new Response('', { status: 503, statusText: 'Offline and not cached' });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (_) {
    return new Response('', { status: 503, statusText: 'Offline and not cached' });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // لا نخزن طلبات قاعدة البيانات أو المصادقة أو واجهات Google API.
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis.com')) return;

  if (url.origin === self.location.origin) {
    // Network-first يسمح بظهور تحديثات الواجهة تلقائيًا، مع كاش احتياطي للدروس والملفات.
    event.respondWith(networkFirst(request));
    return;
  }

  // ملفات Firebase SDK الثابتة اللازمة لفتح الواجهة المحفوظة دون اتصال.
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // الخطوط والصور الرمزية الثابتة.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'ui-avatars.com') {
    event.respondWith(cacheFirst(request));
  }
});
