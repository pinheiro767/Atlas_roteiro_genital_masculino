const CACHE='anatomia-imm-genital-v1';
const STATIC=['./','./index.html','./data.js','./app.js','./pdf-export.js','./style.css','./manifest.webmanifest',
'./assets/capa.webp','./assets/icon-192.png','./assets/icon-512.png',
...['iniciar','pular','reduzir','acessivel'].flatMap(n=>['normal','ativo','desabilitado','icone'].map(t=>`./assets/${n}_${t}.webp`))];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return response})))
});
