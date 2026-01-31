import { useCallback } from 'react';
import { useStore } from '../stores/useStore';

export function useNotifications() {
  const { settings, updateSettings } = useStore();

  // Check if notifications are supported
  const isSupported = () => {
    return 'Notification' in window;
  };

  // Get current permission status
  const getPermission = () => {
    if (!isSupported()) return 'unsupported';
    return Notification.permission;
  };

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported()) {
      return false;
    }

    if (Notification.permission === 'granted') {
      updateSettings({ notifications: true });
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      updateSettings({ notifications: granted });
      return granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [updateSettings]);

  // Show a notification
  const showNotification = useCallback((title, options = {}) => {
    if (!isSupported() || Notification.permission !== 'granted') {
      return null;
    }

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options
    };

    try {
      return new Notification(title, defaultOptions);
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }, []);

  // Notify about new articles
  const notifyNewArticles = useCallback(
    (count) => {
      if (settings.notifications && count > 0) {
        showNotification('TechNews', {
          body: `${count} new article${count > 1 ? 's' : ''} available`,
          tag: 'new-articles'
        });
      }
    },
    [settings.notifications, showNotification]
  );

  // Toggle notifications
  const toggleNotifications = useCallback(async () => {
    if (settings.notifications) {
      updateSettings({ notifications: false });
      return false;
    } else {
      return await requestPermission();
    }
  }, [settings.notifications, requestPermission, updateSettings]);

  return {
    isSupported: isSupported(),
    isEnabled: settings.notifications,
    permission: getPermission(),
    requestPermission,
    showNotification,
    notifyNewArticles,
    toggleNotifications
  };
}
