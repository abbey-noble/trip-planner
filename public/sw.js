/* Offline support. The trip data itself lives in localStorage; this only
   caches the app shell and any map tiles that have already been viewed. */

const SHELL = 'trip-shell-v1'
const TILES = 'trip-tiles-v1'
const TILE_LIMIT = 1200

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== TILES).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Map tiles: serve from cache first, they never change.
  if (/tile\.openstreetmap\.org$/.test(url.hostname)) {
    event.respondWith(cacheFirst(request, TILES, TILE_LIMIT))
    return
  }

  // Page loads: prefer the network so updates land, fall back to the shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          caches.open(SHELL).then(c => c.put('./', res.clone()))
          return res
        })
        .catch(() => caches.match('./').then(r => r || caches.match('./index.html')))
    )
    return
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, SHELL))
  }
})

async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  try {
    const res = await fetch(request)
    if (res.ok) {
      cache.put(request, res.clone())
      if (limit) trim(cache, limit)
    }
    return res
  } catch (e) {
    return hit || Response.error()
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  const network = fetch(request)
    .then(res => {
      if (res.ok) cache.put(request, res.clone())
      return res
    })
    .catch(() => hit)
  return hit || network
}

async function trim(cache, limit) {
  const keys = await cache.keys()
  if (keys.length <= limit) return
  for (const key of keys.slice(0, keys.length - limit)) {
    cache.delete(key)
  }
}
