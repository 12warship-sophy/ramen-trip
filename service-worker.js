const CACHE_NAME = 'travel-guidebook-v4';

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

// 네트워크를 먼저 시도하고(항상 최신 내용을 보여주기 위해), 실패했을 때만 캐시를 쓴다.
// ?trip=... 처럼 매번 달라지는 주소는 애초에 미리 저장해둘 수 없으므로,
// 캐시를 찾을 때는 물음표 뒤 쿼리스트링을 무시하고(ignoreSearch) 같은 페이지의
// 저장본이라도 찾아서 쓴다. 무엇을 하든 반드시 유효한 Response를 돌려줘서
// "아무 응답도 못 만드는" 상태(=브라우저의 ERR_FAILED)가 나오지 않게 한다.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        if (response && response.status === 200 && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        const cached = await caches.match(event.request, { ignoreSearch: true });
        if (cached) return cached;
        return new Response(
          '오프라인 상태이고, 저장된 페이지도 없어요. 인터넷 연결을 확인해주세요.',
          { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
      }
    })()
  );
});
