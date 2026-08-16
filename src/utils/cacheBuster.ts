/**
 * Cache buster utility to force clear stale PWA caches and load latest deployment.
 */

export async function forceReloadLatestVersion() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // 2. Clear all cache storage
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
  } catch {
    // Fail silently and still reload
  }

  // 3. Force reload ignoring cache
  const cleanUrl = window.location.origin + window.location.pathname + '?v=' + Date.now();
  window.location.replace(cleanUrl);
}
