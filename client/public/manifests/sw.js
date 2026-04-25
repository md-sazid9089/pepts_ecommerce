/**
 * Pepta Service Worker
 * Offline-first PWA with intelligent caching strategies
 * - Static assets: Cache-first (after SW update)
 * - API calls: Network-first with cache fallback
 * - Images: Cache-first with size limits
 * - HTML: Network-first with cache fallback
 */

const CACHE_PREFIX = 'pepta';
const CURRENT_VERSION = 'v5'; // Bumped for optimized industry-standard strategy
const CACHE_NAME = `${CACHE_PREFIX}-${CURRENT_VERSION}`;

// Cache configuration
const CACHES_CONFIG = {
  STATIC: `${CACHE_NAME}-static`,
  DYNAMIC: `${CACHE_NAME}-dynamic`,
  IMAGES: `${CACHE_NAME}-images`,
  API: `${CACHE_NAME}-api`,
};

// Assets to cache on install (Only core UI assets, NOT the HTML itself)
const STATIC_ASSETS = [
  '/offline.html',
  '/images/products/logo.jpeg',
];

const API_CACHE_DURATION = 0; // Disable API caching in SW for e-commerce reliability
const IMAGE_CACHE_MAX_SIZE = 100;

/**
 * Install Event
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHES_CONFIG.STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/**
 * Activate Event
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CURRENT_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch Event - Industry Standard Strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. API Calls - ALWAYS Network Only for E-commerce
  // Ensures prices and stock are never stale.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => {
      // Optional: return cached data only if offline
      return caches.match(request);
    }));
    return;
  }

  // 2. Images - Cache First
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, CACHES_CONFIG.IMAGES, IMAGE_CACHE_MAX_SIZE));
    return;
  }

  // 3. Hashed Assets (Vite /assets/) - Cache First (Safe because filenames change)
  if (url.pathname.includes('/assets/')) {
    event.respondWith(cacheFirstStrategy(request, CACHES_CONFIG.STATIC));
    return;
  }

  // 4. Everything else (including HTML) - Network First
  // We don't cache the root '/' in static anymore to avoid "stuck" versions.
  event.respondWith(networkFirstStrategy(request, CACHES_CONFIG.DYNAMIC));
});

  // HTML pages - Network-first with cache fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request, CACHES_CONFIG.DYNAMIC));
    return;
  }

  // Default - Cache-first for everything else
  event.respondWith(cacheFirstStrategy(request, CACHES_CONFIG.DYNAMIC));
});

/**
 * Cache-First Strategy
 * Try cache first, fall back to network
 */
async function cacheFirstStrategy(request, cacheName, maxSize = 0) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);

      // Enforce cache size limits
      if (maxSize > 0) {
        trimCache(cacheName, maxSize);
      }
    }

    return response;
  } catch (error) {
    console.warn('[SW] Fetch failed:', request.url, error);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHES_CONFIG.STATIC);
      return cache.match('/offline.html');
    }

    throw error;
  }
}

/**
 * Network-First Strategy
 * Try network first, fall back to cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);
    }

    return response;
  } catch (error) {
    console.warn('[SW] Network request failed, trying cache:', request.url);

    // Try to use cached version
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const staticCache = await caches.open(CACHES_CONFIG.STATIC);
      return staticCache.match('/offline.html');
    }

    throw error;
  }
}

/**
 * Trim cache to maximum size (for images and dynamic content)
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }
}

/**
 * Check if request is for an image
 */
function isImageRequest(request) {
  const url = new URL(request.url);
  const destination = request.destination;

  return (
    destination === 'image' ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)
  );
}

/**
 * Handle messages from clients (for manual cache control)
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name)));
      });
      break;

    case 'CACHE_URLS':
      cacheUrls(payload.urls);
      break;

    default:
      break;
  }
});

/**
 * Pre-cache URLs sent from client
 */
async function cacheUrls(urls) {
  const cache = await caches.open(CACHES_CONFIG.DYNAMIC);
  try {
    await cache.addAll(urls);
    console.log('[SW] Cached URLs:', urls);
  } catch (error) {
    console.error('[SW] Failed to cache URLs:', error);
  }
}

/**
 * Background Sync for offline purchases
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-checkout') {
    event.waitUntil(syncCheckout());
  }
});

async function syncCheckout() {
  try {
    console.log('[SW] Syncing checkout...');
    const cache = await caches.open(CACHES_CONFIG.API);
    const requests = await cache.keys();

    for (const request of requests) {
      if (request.url.includes('/api/checkout')) {
        try {
          await fetch(request.clone());
          console.log('[SW] Checkout synced successfully');
        } catch (error) {
          console.error('[SW] Checkout sync failed:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Background sync error:', error);
    throw error;
  }
}

console.log('[SW] Service Worker loaded');
