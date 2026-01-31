import { STORAGE_KEYS, CACHE_DURATION } from './constants';

export const storage = {
  // Feeds management
  getFeeds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setFeeds: (feeds) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDS, JSON.stringify(feeds));
    } catch (error) {
      console.error('Failed to save feeds:', error);
    }
  },

  // Settings management
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Cache management
  getCache: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHE);
      if (!data) return null;

      const { articles, timestamp } = JSON.parse(data);
      const age = Date.now() - timestamp;

      // Return null if cache is expired
      if (age > CACHE_DURATION) {
        localStorage.removeItem(STORAGE_KEYS.CACHE);
        return null;
      }

      return articles;
    } catch {
      return null;
    }
  },

  setCache: (articles) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CACHE,
        JSON.stringify({
          articles,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  },

  clearCache: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CACHE);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },

  // Bookmarks management
  getBookmarks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setBookmarks: (bookmarks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }
};
