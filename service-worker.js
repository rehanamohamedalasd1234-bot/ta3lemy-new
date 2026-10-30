// Service Worker for the Hafez educational platform.
// Shell files are prefetched for offline launch; media is stored only when the user explicitly downloads it.
const CACHE_PREFIX = 'ta3lemy-shell-';
const CACHE_NAME = CACHE_PREFIX + '1.0.65';
const MEDIA_CACHE_NAME = 'ta3lemy-media-v1';
const APP_SHELL = [
  './', './index.html', './extras.js', './curriculum-display-fix.js', './offline-mode.js', './navigation-fix.js', './service-worker.js', './manifest.json', './version.json', './auth-init.js', './fix-canvas.css',
  './teacher-auth.js', './teacher.js', './owner-approvals.js', './teacher-workflow.js', './curriculum-links.js', './science-grade7-term1.js', './social-grade7-term1.js', './social-grade8-term1.js', './science-grade8-term1.js', './social-grade9-term1.js', './arabic-grade7-term1.js', './arabic-grade8-term1.js', './english-grade7-term1.js', './english-grade8-term1.js', './english-grade9-term1.js',
  './math-grade7-term1.js',
  './religion-grade7-term1.js', './computer-grade7-term1.js', './art-grade7-term1.js',
  './math-grade8-term1.js', './computer-grade8-term1.js', './religion-grade8-term1.js', './art-grade8-term1.js',
  './grade9-term1-content.js', './continuous-assessment.js', './primary-official-only.js', './grade1-math-expanded.js', './primary-grade2-structure.js', './primary-grade2-detailed-content.json', './primary-grade3-structure.js', './primary-grade3-detailed-content.json', './primary-grade4-structure.js', './primary-grades456-detailed-content.json', './primary-grade5-structure.js', './primary-grade6-structure.js',
  './creativity-config.js', './creativity.js', './gemini-fix.js', './chat-config.js', './chat-system.js',
  './supabase-chat-config.js', './supabase-call-alerts.js', './supabase-private-chat.js',
  './admin-system.js', './kindergarten-languages.js', './icon-512.png'
];
const EXTERNAL_SHELL = [
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-functions-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];
const APP_SHELL_FALLBACK = new URL('./index.html', self.registration.scope).href;

function isMediaRequest(request, url) {
  if (request.destination === 'audio' || request.destination === 'video' || request.destination === 'image') return true;
  return /\.(mp3|m4a|aac|wav|ogg|mp4|m4v|webm|mov|jpg|jpeg|png|gif|webp|avif|pdf)(?:$|[?#])/i.test(url.href);
}

async function withRangeSupport(response, request) {
  const range = request.headers.get('range');
  if (!range || response.type === 'opaque' || response.status === 206) return response;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range.trim());
  if (!match) return response;
  try {
    const body = await response.arrayBuffer();
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Math.min(Number(match[2]), body.byteLength - 1) : body.byteLength - 1;
    if (start > end || start >= body.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + body.byteLength } });
    const headers = new Headers(response.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + body.byteLength);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(body.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
  } catch (error) { return response; }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const path of APP_SHELL) {
      try {
        const url = new URL(path, self.registration.scope).href;
        const response = await fetch(url, { cache: 'reload' });
        if (response && response.ok && response.type !== 'opaque') await cache.put(url, response.clone());
      } catch (error) { /* An optional missing file must not prevent installation. */ }
    }
    for (const url of EXTERNAL_SHELL) {
      try {
        const response = await fetch(url, { mode: 'no-cors', cache: 'reload' });
        if (response) await cache.put(url, response.clone());
      } catch (error) { /* A CDN restriction must not prevent installation. */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Serve explicit Cloudinary/Quran/course downloads, including media range requests.
  if (isMediaRequest(request, url)) {
    event.respondWith((async () => {
      const mediaCache = await caches.open(MEDIA_CACHE_NAME);
      let cached = await mediaCache.match(request.url);
      const shellCache = await caches.open(CACHE_NAME);
      if (!cached && url.origin === self.location.origin) cached = await shellCache.match(request);
      if (cached) return withRangeSupport(cached, request);
      try {
        const response = await fetch(request);
        if (url.origin === self.location.origin && response && response.ok && response.type !== 'opaque') await shellCache.put(request, response.clone());
        return response;
      }
      catch (error) {
        return new Response('هذا الملف لم يُنزّل على الجهاز بعد', { status: 503, statusText: 'Offline Media Not Found', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) {
    const isFirebaseSdk = url.hostname === 'www.gstatic.com' && /firebasejs\/10\.12\.0\//.test(url.pathname);
    const isSupabaseSdk = url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@supabase/supabase-js@2');
    if (!isFirebaseSdk && !isSupabaseSdk) return;
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request.url);
      if (cached) return cached;
      try { return await fetch(request); }
      catch (error) { return new Response('', { status: 503, statusText: 'Offline SDK Not Found' }); }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type !== 'opaque') await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const shell = await cache.match(APP_SHELL_FALLBACK);
        if (shell) return shell;
      }
      return new Response('غير متصل بالإنترنت', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
