const CACHE_VERSION = 'hafez-v7'; // تم تغيير رقم النسخة لإجبار التحديث
const CACHE = CACHE_VERSION;
const CORE_ASSETS = [
  './',
  './index.html',
  './extras.js',
  './extras-patch.js',
  './extras-v2.js',
  './manifest.json',
  './icon-512.png'
];

// تثبيت: تفعيل فوري وتخزين الأساسيات
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE_ASSETS).catch(() => {}))
  );
});

// تفعيل: مسح الكاش القديم فوراً
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

  // تجاهل Firebase و APIs الخارجية
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('gstatic') ||
      url.hostname.includes('cloudinary') ||
      url.hostname.includes('alquran.cloud') ||
      url.hostname.includes('islamic.network')) {
    return;
  }

  // استراتيجية Network-First للصفحات والملفات الأساسية
  // (عشان أي تحديث يظهر فوراً في التطبيق)
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

  // استراتيجية Cache-First لباقي الملفات (صور، أيقونات، إلخ)
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
