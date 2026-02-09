const CACHE_NAME = 'ratery-v11';
const urlsToCache = [
  '/',
  '/favicon.svg'
];

// URLs that should NEVER be intercepted by the service worker
const BYPASS_PATTERNS = [
  'googleapis.com',
  'google.com',
  'gstatic.com',
  'firebaseapp.com',
  'firebaseio.com',
  'firebase.com',
  'firebaseinstallations.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'cdn.tailwindcss.com',
  'esm.sh',
  'sentry.io',
  'creem.io',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'grainy-gradients.vercel.app',
];

function shouldBypass(url) {
  return BYPASS_PATTERNS.some(pattern => url.includes(pattern));
}

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first for navigation, bypass external resources
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Never intercept external resources (Google Auth, CDN, APIs, etc.)
  if (shouldBypass(url)) {
    return;
  }

  // Navigation requests (page loads) — always network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .then((response) => response || caches.match('/'))
    );
    return;
  }

  // Same-origin static assets — cache-first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});
