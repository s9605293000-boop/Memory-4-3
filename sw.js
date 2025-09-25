// src/pwa/sw.js
const CACHE = 'memory-duel-v1';
const ASSETS = [
  '/', '/index.html', '/styles.css', '/manifest.json',
  '/src/main.js','/src/firebase.js',
  '/assets/cards/back.svg'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request))
  );
});
