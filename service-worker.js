// Service Worker for the Hafez educational platform.
// Shell files are prefetched for offline launch; media is stored only when the user explicitly downloads it.
const CACHE_PREFIX = 'ta3lemy-shell-';
const CACHE_NAME = CACHE_PREFIX + '1.0.61';
const MEDIA_CACHE_NAME = 'ta3lemy-media-v1';
const APP_SHELL = [
  './', './index.html', './extras.js', './curriculum-display-fix.js', './offline-mode.js', './navigation-fix.js', './service-worker.js', './manifest.json', './version.json', './auth-init.js', './fix-canvas.css',
  './primary-official-only.js', './grade1-math-official.js', './grade1-religion-official.js', './primary-grade2-structure.js', './primary-grade3-structure.js', './primary-grade4-structure.js', './primary-grade5-structure.js', './primary-grade6-structure.js',
  './gemini-fix.js', './curriculum-links.js', './secondary-grade1-content.js', './grade9-term1-content.js', './continuous-assessment.js',
  './science-grade7-term1.js', './social-grade7-term1.js', './social-grade8-term1.js', './science-grade8-term1.js', './social-grade9-term1.js',
  './math-grade7-term1.js', './arabic-grade7-term1.js', './arabic-grade8-term1.js', './english-grade7-term1.js', './english-grade8-term1.js',
  './english-grade9-term1.js', './math-grade8-term1.js', './computer-grade8-term1.js', './religion-grade8-term1.js', './art-grade8-term1.js',
  './religion-grade7-term1.js', './computer-grade7-term1.js', './art-grade7-term1.js'
];

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

  // Media files: cache-first if downloaded, else network
  if (url.pathname.match(/\.(mp4|mp3|pdf|png|jpg|jpeg|svg|webp)$/i)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).catch(() => {
          return new Response('محتوى غير متوفر بدون إنترنت', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        });
      })
    );
    return;
  }

  // Network first for all other requests
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
