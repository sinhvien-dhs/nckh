/* Physics Detective PWA Service Worker (Zero-Dependency Offline Cache) */
const CACHE_NAME = 'physics-detective-v10';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/audio-fx.js',
  './js/physics-engine.js',
  './js/vector-renderer.js',
  './js/cases-data.js',
  './js/investigation-engine.js',
  './js/pedagogy-analytics.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first: luôn lấy bản mới khi có mạng, chỉ dùng cache khi offline.
  // Tránh tình trạng sửa giao diện nhưng trình duyệt vẫn hiển thị bản cũ.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((cached) => {
          if (cached) return cached;
          if (e.request.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        })
      )
  );
});
