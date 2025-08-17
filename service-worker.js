const CACHE_NAME = 'temp-email-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/tailwindcss.min.css',
    './css/style.css',
    './js/script.js',
    './manifest.json',
    './libs/Mailjs/3.0.0/mailjs.min.js',
    './libs/Mailjs/3.0.0/eventsource.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    'https://www.googletagmanager.com/gtag/js?id=UA-52459272-3',
    './apple-touch-icon.png',
    './favicon-32x32.png',
    './favicon-16x16.png',
    './favicon.ico',
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                //return cache.addAll(urlsToCache);
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.error(`Failed to cache ${url}:`, err);
                        });
                    })
                );
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches
        .match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// PWA Version Check Logic
self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'CHECK_VERSION') {
        try {
            const currentManifest = await caches.match('./manifest.json').then(res => res.json());
            const newManifestRes = await fetch('./manifest.json');
            const newManifest = await newManifestRes.json();

            if (currentManifest && newManifest && currentManifest.version !== newManifest.version) {
                console.log('New PWA version detected. Notifying client.');
                event.source.postMessage({ type: 'UPDATE_AVAILABLE' });
            }
        } catch (error) {
            console.error('Failed to check for new version:', error);
        }
    }
});


self.addEventListener('notificationclick', event => {
    const messageId = (event.notification.data || {messageId: null}).messageId;
    event.notification.close();
    if(messageId){
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                for (const client of clientList) {
                    if ('focus' in client) {
                        client.postMessage({ type: 'OPEN_MESSAGE', messageId });
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    clients.openWindow('/').then(client => {
                        client.postMessage({ type: 'OPEN_MESSAGE', messageId });
                    });
                }
            })
        );
    }
});
