// Service Worker for the Hafez educational platform.
// Network-first keeps published GitHub Pages updates visible in the APK/WebView;
// cached responses are only a fallback when the device is offline.
const CACHE_PREFIX = 'ta3lemy-shell-';
const CACHE_NAME = CACHE_PREFIX + '1.0.7';
const APP_SHELL_FALLBACK = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type !== 'opaque') {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const shell = await cache.match(APP_SHELL_FALLBACK);
        if (shell) return shell;
      }
      return new Response('غير متصل بالإنترنت', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
