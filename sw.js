const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
    '/',
    '/index.html',
    '/login.html',
    '/main.html',
    '/task.html',
    '/app.js',
    '/assets/img',
    '/assets/js/PWA-NotesList-calendar.js',
    '/assets/css/PWA-NotesList-calendar.css',
    'https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css',
    'https://code.jquery.com/jquery-3.4.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
    'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js',
    'https://cdn.3up.dk/bootstrap@4.1.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
    'https://cdn.3up.dk/mdi@2.2.43/css/materialdesignicons.min.css',
    '/assets/css/index1.css',
    '/assets/js/index1.js',
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
    );
});