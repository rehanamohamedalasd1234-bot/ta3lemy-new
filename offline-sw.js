// offline-sw.js — Service Worker للعمل بدون إنترنت
const CACHE = 'hafez-offline-v2';

// ═══ Install ═══
self.addEventListener('install', e => {
  self.skipWaiting();
});

// ═══ Activate ═══
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// ═══ Fetch — Cache First للملفات الأساسية ═══
self.addEventListener('fetch', e => {
  const req = e.request;
  
  // تجاهل الطلبات غير GET
  if (req.method !== 'GET') return;
  
  const url = new URL(req.url);
  
  // تجاهل Firebase (لأنه بيتعامل معاه offline persistence)
  if (url.hostname.includes('firestore') || 
      url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis')) {
    return;
  }
  
  // الملفات الأساسية: Cache First
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req).then(hit => {
          if (hit) return hit;
          return fetch(req).then(res => {
            if (res && res.ok && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          }).catch(() => {
            // لو مفيش نت ومفيش كاش
            if (req.mode === 'navigate') {
              return cache.match('./index.html');
            }
            return new Response('', {status: 503});
          });
        })
      )
    );
    return;
  }
  
  // Fonts + UI Avatars: Cache First
  if (url.hostname === 'fonts.googleapis.com' || 
      url.hostname === 'fonts.gstatic.com' ||
      url.hostname === 'ui-avatars.com') {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req).then(hit => {
          if (hit) return hit;
          return fetch(req).then(res => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => new Response('', {status: 503}));
        })
      )
    );
    return;
  }
  
  // الباقي: من النت عادي
});

console.log('✅ offline-sw.js loaded');
