
// Service worker disabled for native mobile build to prevent protocol errors
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', () => {
  return self.clients.claim();
});
