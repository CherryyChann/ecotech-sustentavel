const CACHE_NAME = 'ecotech-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando Novo Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Pré-cacheando App Shell com sucesso.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando Worker e limpando caches antigos...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('[Service Worker] Fornecendo recurso do cache:', event.request.url);
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        console.error('[Service Worker] Falha na rede e recurso indisponível no cache.');
      });
    })
  );
});

self.addEventListener('push', event => {
  console.log('[Service Worker] Evento de Push recebido.');
  let data = { title: 'Alerta EcoTech', body: 'Nova atualização de sustentabilidade!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  const options = {
    body: data.body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [100, 50, 100]
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});