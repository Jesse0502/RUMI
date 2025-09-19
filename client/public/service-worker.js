self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("[Service Worker] Installed");
});

self.addEventListener("activate", (event) => {
  clients.claim();
  console.log("[Service Worker] Activated");
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
  const urlToOpen = "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client)
            return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen);
      }),
  );
});
