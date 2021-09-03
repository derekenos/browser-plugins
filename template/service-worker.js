
const CACHE_NAME = 'TEMPLATE_V0.1'

self.addEventListener('activate', function(event) {
  console.log('Claiming control')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', async e => {
  let response = await caches.match(e.request)
  if (response) {
    // Cache hit.
    console.debug('CACHE HIT')
    return e.respondWith(response)
  }
  // Cache miss.
  console.debug('CACHE MISS')
  response = await fetch(e.request)

  // Don't cache abnormal responses.
  if (!response || response.status !== 200 || response.type !== 'basic') {
    return response
  }

  // Clone the response to prevent consuming the original and add it
  // to the cache.
  await caches.open(CACHE_NAME).put(e.request, response.clone())

  return e.respondWith(response)
})
