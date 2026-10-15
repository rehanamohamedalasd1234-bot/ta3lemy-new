const CACHE = 'hafez-v4';

// ═══ Install — خزّن الملفات الأساسية ═══
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => 
      c.addAll([
        './',
        './index.html',
        './manifest.json',
        './extras.js',
        './offline-sw.js'
      ]).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

// ═══ Activate ═══
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => 
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ═══ Fetch — Cache First للملفات المحلية ═══
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  
  const url = new URL(req.url);
  
  // Firebase → نت مباشر
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.hostname.includes('gstatic')) {
    return;
  }
  
  // ملفات المنصة → Cache First
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(hit => {
        if (hit) return hit;
        return fetch(req).then(res => {
          if (res && res.ok && res.status === 200) {
            caches.open(CACHE).then(c => c.put(req, res.clone()));
          }
          return res;
        }).catch(() => {
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }
  
  // Fonts + Avatars
  if (url.hostname.includes('fonts') || url.hostname.includes('ui-avatars')) {
    e.respondWith(
      caches.match(req).then(hit => {
        if (hit) return hit;
        return fetch(req).then(res => {
          if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
          return res;
        }).catch(() => new Response('', {status: 503}));
      })
    );
    return;
  }
});
