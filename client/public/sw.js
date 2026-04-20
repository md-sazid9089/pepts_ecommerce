/**
 * Pepta Service Worker
 * Offline-first PWA with intelligent caching strategies
 * - Static assets: Cache-first (after SW update)
 * - API calls: Network-first with cache fallback
 * - Images: Cache-first with size limits
 * - HTML: Network-first with cache fallback
 */

const CACHE_PREFIX = 'pepta';
const CURRENT_VERSION = 'v2';
const CACHE_NAME = `${CACHE_PREFIX}-${CURRENT_VERSION}`;

// Cache configuration
const CACHES_CONFIG = {
  STATIC: `${CACHE_NAME}-static`,
  DYNAMIC: `${CACHE_NAME}-dynamic`,
  IMAGES: `${CACHE_NAME}-images`,
  API: `${CACHE_NAME}-api`,
};

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/_next/static/chunks/main.js',
];

const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const IMAGE_CACHE_MAX_SIZE = 50; // Maximum images in cache

/**
 * Install Event - Cache essential assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(CACHES_CONFIG.STATIC).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches not matching current version
          if (!cacheName.includes(CURRENT_VERSION)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all pages immediately
  self.clients.claim();
});

/**
 * Fetch Event - Intelligent routing based on request type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and non-http protocols
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // API calls - Network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, CACHES_CONFIG.API));
    return;
  }

  // Images - Cache-first with network fallback
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, CACHES_CONFIG.IMAGES, IMAGE_CACHE_MAX_SIZE));
    return;
  }

  // Static assets (_next) - Cache-first
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(cacheFirstStrategy(request, CACHES_CONFIG.STATIC));
    return;
  }

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
