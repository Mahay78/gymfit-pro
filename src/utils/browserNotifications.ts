/**
 * Web Notifications API wrapper for background timers
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendBrowserNotification(title: string, body: string, icon = '/pwa-192x192.png') {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      vibrate: [200, 100, 200],
      tag: 'gymfit-timer',
      renotify: true,
    } as NotificationOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // Fallback if browser doesn't allow constructor
  }
}
