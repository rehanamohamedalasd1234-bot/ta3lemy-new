// Service Worker — نسخة بسيطة
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// مش بنعمل أي fetch handling
// المنصة تشتغل زي ما هي بدون offline
