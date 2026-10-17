const CACHE_VERSION = 'hafez-v8'; // رفعنا رقم الإصدار عشان نجبر التحديث
const CACHE = CACHE_VERSION;

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // تجاهل الملفات الخارجية والخطوط والصور الشخصية
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('gstatic') ||
      url.hostname.includes('cloudinary') ||
      url.hostname.includes('alquran.cloud') ||
      url.hostname.includes('islamic.network') ||
      url.hostname.includes('ui-avatars.com')) {
    return;
  }

  // الشبكة أولاً للملفات الأساسية (عشان أي تعديل يظهر فوراً)
  if (req.mode === 'navigate' || 
      url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.json')) {
    
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // الكاش أولاً لباقي الملفات
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(hit => {
        const network = fetch(req).then(res => {
          if (res && res.ok && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
          }
          return res;
        }).catch(() => hit);
        return hit || network;
      })
    );
  }
});
