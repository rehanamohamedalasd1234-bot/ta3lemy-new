const CACHE_NAME='hafez-v2';
const FIREBASE_CACHE='hafez-firebase-v2';
const QURAN_CACHE='hafez-quran-v2';
const CORE_ASSETS=['./','./index.html','./manifest.json','./sitemap.xml'];

self.addEventListener('install',e=>{
e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.all(CORE_ASSETS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>!k.includes('v2')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
const url=new URL(e.request.url);
if(e.request.method!=='GET')return;
if(!url.protocol.startsWith('http'))return;

if(url.hostname==='www.gstatic.com'||url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'||url.hostname==='ui-avatars.com'){
e.respondWith(caches.open(FIREBASE_CACHE).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res;}))));
return;
}

if(url.hostname.includes('firestore')||url.hostname.includes('firebase')){
e.respondWith(fetch(e.request).then(res=>{if(res.ok){const clone=res.clone();caches.open(FIREBASE_CACHE).then(c=>c.put(e.request,clone).catch(()=>{}));}return res;}).catch(()=>caches.match(e.request).then(hit=>hit||new Response('{"error":"offline"}',{status:503,headers:{'Content-Type':'application/json'}}))));
return;
}

if(url.hostname.includes('alquran.cloud')||url.hostname.includes('islamic.network')){
e.respondWith(caches.open(QURAN_CACHE).then(c=>fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res;}).catch(()=>c.match(e.request))));
return;
}

if(url.hostname.includes('cloudinary')){
e.respondWith(caches.open(CACHE_NAME).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res;}))));
return;
}

if(url.origin===self.location.origin){
e.respondWith(caches.match(e.request).then(hit=>{
if(hit)return hit;
return fetch(e.request).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));}return res;}).catch(()=>{if(e.request.mode==='navigate')return caches.match('./index.html');});
}));
return;
}

e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});

self.addEventListener('message',e=>{
if(e.data==='skipWaiting')self.skipWaiting();
if(e.data==='clearCache')caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k))));
});
