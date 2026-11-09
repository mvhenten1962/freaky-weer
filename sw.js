const VERSION='marsie-shell-20261031-v1';
const SHELL=['/','/index.html','/motorrit/','/manifest.webmanifest','/marsie/icon-192.png','/marsie/icon-512.png','/marsie/portret.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('marsie-shell-')||key.startsWith('freaky-shell-'))&&key!==VERSION).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==location.origin||url.pathname==='/traffic.php')return;
 if(req.mode==='navigate'){event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(req,copy));}return response;}).catch(async()=>await caches.match(req)||await caches.match('/index.html')));return;}
 if(SHELL.includes(url.pathname)||url.pathname.startsWith('/marsie/'))event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(req,copy));}return response;})));
});