// API Proxy URLs for CORS (fallback only)
export const PROXY_URLS = {
  primary: 'https://api.allorigins.win/get?url=',
  fallback: 'https://corsproxy.io/?'
};

// Vercel Edge API endpoint
export const API_ENDPOINTS = {
  feeds: '/api/feeds'
};

// Use Edge API (set to false to use old proxy method)
export const USE_EDGE_API = true;

// Local Storage Keys
export const STORAGE_KEYS = {
  FEEDS: 'technews-feeds',
  SETTINGS: 'technews-settings',
  CACHE: 'technews-cache',
  BOOKMARKS: 'technews-bookmarks',
  INSTALL_BANNER_DISMISSED: 'technews-install-banner-dismissed'
};

// Cache duration in milliseconds (15 minutes)
export const CACHE_DURATION = 15 * 60 * 1000;

// Categories
export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📰' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'dev', label: 'Dev', icon: '💻' },
  { id: 'tech', label: 'Tech', icon: '🌐' }
];

// Default settings
export const DEFAULT_SETTINGS = {
  theme: 'system',
  fontSize: 'medium',
  notifications: false,
  refreshInterval: 15,
  language: 'th' // 'th' | 'en'
};

// Available languages
export const LANGUAGES = [
  { id: 'th', label: 'ไทย', flag: '🇹🇭' },
  { id: 'en', label: 'English', flag: '🇺🇸' }
];

// Font size mapping
export const FONT_SIZES = {
  small: {
    body: 'text-sm',
    title: 'text-base'
  },
  medium: {
    body: 'text-base',
    title: 'text-lg'
  },
  large: {
    body: 'text-lg',
    title: 'text-xl'
  }
};

// Refresh intervals in minutes
export const REFRESH_INTERVALS = [
  { value: 15, label: 'Every 15 minutes' },
  { value: 30, label: 'Every 30 minutes' },
  { value: 60, label: 'Every hour' }
];

// Debounce delay for search (in ms)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Feed limits - จำกัดจำนวนและอายุข่าว
export const FEED_LIMITS = {
  maxAgeDays: 7 // แสดงเฉพาะข่าวไม่เกิน 7 วัน
};
