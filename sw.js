const SHELL="cds-shell-v41",TILES="cds-tiles-v1";
const FILES=["./","index.html","app.js","meteo.js","aquarium.js","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","logo-round-256.png","logo-round-512.png","logo-full-512.png","logo-full-1024.png","fond-connexion.jpg","fond-bandeau.jpg","vendor/kaushan.woff2","vendor/leaflet.js","vendor/leaflet.css","vendor/supabase.js","vendor/591.supabase.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>![SHELL,TILES].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  // Fonds de carte : gardés en cache pour consulter les zones déjà vues sans réseau
  if(u.hostname==="data.geopf.fr"||u.hostname==="tile.openstreetmap.org"){
    e.respondWith(caches.open(TILES).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;
      try{const r=await fetch(e.request);if(r.ok||r.type==="opaque")c.put(e.request,r.clone());return r}catch(err){return hit||Response.error()}}));return;
  }
  if(u.origin===self.location.origin){
    // Réseau d'abord pour avoir la dernière version, cache si hors réseau
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open(SHELL).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
  }
});
