import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorker() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log('[SW] Service Worker registered:', swUrl);

      // Check for updates periodically (every 1 hour)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('[SW] Service Worker registration error:', error);
    },
    onNeedRefresh() {
      console.log('[SW] New content available, showing update prompt');
      setShowUpdatePrompt(true);

      // Send push notification if permission granted
      sendUpdateNotification();
    },
    onOfflineReady() {
      console.log('[SW] App ready to work offline');
    },
  });

  // Send push notification for update
  const sendUpdateNotification = useCallback(async () => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification('TechNews Update', {
          body: 'มีเวอร์ชันใหม่พร้อมใช้งาน กดเพื่ออัพเดท',
          icon: '/icons/icon-192x192.svg',
          badge: '/icons/icon-192x192.svg',
          tag: 'app-update',
          renotify: true,
          requireInteraction: true,
          data: {
            type: 'update',
            url: '/'
          },
          actions: [
            { action: 'update', title: 'อัพเดทเลย' },
            { action: 'dismiss', title: 'ไว้ทีหลัง' }
          ]
        });
      } catch (error) {
        console.error('[SW] Failed to send update notification:', error);
      }
    }
  }, []);

  // Update the app
  const doUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      await updateServiceWorker(true);
      // The page will reload automatically
    } catch (error) {
      console.error('[SW] Failed to update:', error);
      setIsUpdating(false);
    }
  }, [updateServiceWorker]);

  // Dismiss the update prompt
  const dismissUpdate = useCallback(() => {
    setShowUpdatePrompt(false);
    setNeedRefresh(false);
  }, [setNeedRefresh]);

  // Listen for notification click
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'UPDATE_CLICKED') {
          doUpdate();
        }
      });
    }
  }, [doUpdate]);

  return {
    showUpdatePrompt,
    isUpdating,
    needRefresh,
    doUpdate,
    dismissUpdate,
  };
}
