const CACHE = 'hafez-v5-clean';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) return;
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => {
        if (hit) return hit;
        return fetch(e.request).then(res => {
          if (res.ok && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        }).catch(() => { if (e.request.mode === 'navigate') return caches.match('./index.html'); });
      })
    );
  }
});
