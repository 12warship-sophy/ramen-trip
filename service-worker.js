const CACHE_NAME = 'travel-guidebook-v3';

const PRECACHE_URLS = [
  './',
  './index.html',
  './onboarding.html',
  './explore.html',
  './detail.html',
  './itinerary.html',
  './mypage.html',
  './favorites.html',
  './css/style.css',
  './js/app.js',
  './js/storage.js',
  './js/data.js',
  './js/filter.js',
  './js/scheduler.js',
  './js/export.js',
  './js/resolve.js',
  './js/cities-data.js',
  './js/ramen-data.js',
  './data/cities.json',
  './data/lodgings.json',
  './data/restaurants.json',
  './data/attractions.json',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
