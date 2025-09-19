const CACHE_NAME = "rumi-pwa-v1";
const urlsToCache = [
  "/",
  "/inbox",
  "/connections",
  "/feed",
  "/events",
  "/profile",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error("[Service Worker] Caching failed:", err);
      })
  );
  self.skipWaiting();
  console.log("[Service Worker] Installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  clients.claim();
  console.log("[Service Worker] Activated");
});

// Network-first strategy for API calls, cache-first for static assets
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    // Network-first for API calls
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});

self.addEventListener("push", function (event) {
  let payload = {
    title: "RUMI",
    body: "You have a new notification",
    data: {},
  };
  try {
    payload = event.data ? event.data.json() : payload;
  } catch (e) {
    console.error("Error parsing push event data", e);
  }

  const options = {
    body: payload.body,
    data: payload.data || {},
    badge: "/placeholder.svg",
    icon: "/placeholder.svg",
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Get the URL from notification data, default to home
  const notificationData = event.notification.data || {};
  const urlToOpen = new URL(notificationData.url || "/", self.location.origin).href;

  console.log("[Service Worker] Notification clicked, opening:", urlToOpen);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // Check if there's any window open to the app
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            // Navigate the existing window to the target URL
            client.postMessage({
              type: 'NAVIGATE_TO',
              url: notificationData.url || "/"
            });
            return client.focus();
          }
        }

        // Open a new window if no app window is open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((err) => {
        console.error("[Service Worker] Error handling notification click:", err);
      }),
  );
});

// Listen for messages from the main thread
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Add background sync for offline notifications (future enhancement)
self.addEventListener("sync", function (event) {
  if (event.tag === "background-sync") {
    console.log("[Service Worker] Background sync triggered");
    // Could be used to sync pending notifications when back online
  }
});
