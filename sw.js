const CACHE='docbook-nurse-v2';
const ASSETS=['./','./index.html','./manifest.json','./'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.open(CACHE).then(cache=>
      cache.match(e.request).then(hit=>{
        var fresh=fetch(e.request).then(r=>{
          if(r&&r.status===200)cache.put(e.request,r.clone());
          return r;
        }).catch(()=>hit);
        return hit||fresh;
      })
    )
  );
});
