// Service Worker for the Hafez educational platform.
// Shell files are prefetched for offline launch; media is stored only when the user explicitly downloads it.
const CACHE_PREFIX = 'ta3lemy-shell-';
const CACHE_NAME = CACHE_PREFIX + '1.0.73';
const MEDIA_CACHE_NAME = 'ta3lemy-media-v1';
const APP_SHELL = [
  './', './index.html', './extras.js', './curriculum-display-fix.js', './offline-mode.js', './navigation-fix.js', './service-worker.js', './manifest.json', './version.json', './auth-init.js', './fix-canvas.css',
  './teacher-auth.js', './teacher.js', './owner-approvals.js', './teacher-workflow.js', './curriculum-links.js', './science-grade7-term1.js', './social-grade7-term1.js', './social-grade8-term1.js', './science-grade8-term1.js', './social-grade9-term1.js', './arabic-grade7-term1.js', './arabic-grade8-term1.js', './english-grade7-term1.js', './english-grade8-term1.js', './english-grade9-term1.js',
  './math-grade7-term1.js',
  './religion-grade7-term1.js', './computer-grade7-term1.js', './art-grade7-term1.js',
  './math-grade8-term1.js', './computer-grade8-term1.js', './religion-grade8-term1.js', './art-grade8-term1.js',
  './grade9-term1-content.js', './continuous-assessment.js', './primary-official-only.js', './grade1-math-expanded.js', './grade1-religion-official.js', './primary-grade2-data.js', './primary-grade2-structure.js', './primary-grade2-detailed-content.json', './primary-grade3-structure.js', './primary-grade3-detailed-content.json', './primary-grade4-structure.js', './primary-grades456-detailed-content.json', './primary-grade5-structure.js', './primary-grade6-structure.js',
  './secondary-grade1-content.js', './creativity-config.js', './creativity.js', './educational-games.js', './gemini-fix.js', './chat-config.js', './chat-system.js',
  './supabase-chat-config.js', './supabase-call-alerts.js', './supabase-private-chat.js',
  './admin-system.js', './kindergarten-languages.js', './kg1-arabic-structure.js', './kg1-arabic-2026-2027-t1.json', './kg1-english-structure.js', './kg1-english-2026-2027-t1.json', './icon-512.png'
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Serve app shell files from cache first, then update in background
  if (APP_SHELL.some(f => url.pathname.endsWith(f.replace('./', '')))) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
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

  // Network first for all other requests
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
