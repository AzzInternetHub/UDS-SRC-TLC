const CACHE_KEY_VERSION = 'uds-src-v2';
const STRATEGIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './news-config.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_KEY_VERSION).then((cache) => {
            return cache.addAll(STRATEGIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
    if (e.request.method === 'POST') return;

    e.respondWith(
        fetch(e.request)
            .then((res) => {
                if(res.status === 200) {
                    const duplication = res.clone();
                    caches.open(CACHE_KEY_VERSION).then(cache => cache.put(e.request, duplication));
                }
                return res;
            })
            .catch(() => caches.match(e.request).then(saved => saved))
    );
});
