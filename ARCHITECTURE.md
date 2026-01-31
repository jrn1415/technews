# ARCHITECTURE.md - TechNews Technical Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        TechNews PWA                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Views     │  │ Components  │  │   Hooks     │         │
│  │  (Screens)  │  │    (UI)     │  │  (Logic)    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│                   ┌──────▼──────┐                           │
│                   │   Zustand   │                           │
│                   │   Store     │                           │
│                   └──────┬──────┘                           │
│                          │                                  │
│         ┌────────────────┼────────────────┐                 │
│         │                │                │                 │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐         │
│  │ RSS Parser  │  │  Storage    │  │   Utils     │         │
│  │  (fetch)    │  │ (localStorage│  │ (helpers)   │         │
│  └──────┬──────┘  └─────────────┘  └─────────────┘         │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────┐     ┌─────────────────┐
│  CORS Proxy     │────▶│  RSS Feeds      │
│  (allorigins)   │     │  (external)     │
└─────────────────┘     └─────────────────┘
```

---

## 📁 Project Structure

```
technews/
├── public/
│   ├── favicon.ico
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
│
├── src/
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toggle.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── index.js             # Export all
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── PullToRefresh.jsx
│   │   │   └── index.js
│   │   │
│   │   └── features/                # Feature components
│   │       ├── ArticleCard.jsx
│   │       ├── ArticleList.jsx
│   │       ├── CategoryTabs.jsx
│   │       ├── SearchBar.jsx
│   │       ├── ReaderView.jsx
│   │       ├── SourceList.jsx
│   │       ├── SourceItem.jsx
│   │       ├── AddFeedModal.jsx
│   │       ├── SettingsPanel.jsx
│   │       ├── ThemeSelector.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ErrorState.jsx
│   │       └── index.js
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useFeeds.js              # Fetch & manage feeds
│   │   ├── usePullToRefresh.js      # Pull to refresh logic
│   │   ├── useTheme.js              # Theme management
│   │   ├── useNotifications.js      # Push notifications
│   │   └── index.js
│   │
│   ├── stores/                      # Zustand stores
│   │   └── useStore.js              # Main app store
│   │
│   ├── utils/                       # Utility functions
│   │   ├── rssParser.js             # Parse RSS feeds
│   │   ├── storage.js               # localStorage wrapper
│   │   ├── constants.js             # App constants
│   │   ├── helpers.js               # Helper functions
│   │   └── index.js
│   │
│   ├── data/                        # Static data
│   │   └── defaultFeeds.js          # Default RSS sources
│   │
│   ├── styles/
│   │   └── index.css                # Global styles + Tailwind
│   │
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # Entry point
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🗄️ State Management (Zustand)

### Store Structure

```javascript
// stores/useStore.js

const useStore = create((set, get) => ({
  // ===== Articles State =====
  articles: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  // ===== UI State =====
  activeTab: 'home',        // 'home' | 'sources' | 'settings'
  activeCategory: 'all',    // 'all' | 'ai' | 'security' | 'dev' | 'tech'
  searchQuery: '',
  selectedArticle: null,    // Article object or null
  
  // ===== Feeds State =====
  feeds: [],                // Combined default + custom feeds
  customFeeds: [],          // User-added feeds
  
  // ===== Settings State =====
  settings: {
    theme: 'system',        // 'light' | 'dark' | 'system'
    fontSize: 'medium',     // 'small' | 'medium' | 'large'
    notifications: false,
    refreshInterval: 15,    // minutes
  },
  
  // ===== Actions =====
  setArticles: (articles) => set({ articles }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setLastUpdated: (time) => set({ lastUpdated: time }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedArticle: (article) => set({ selectedArticle: article }),
  
  addCustomFeed: (feed) => set((state) => ({
    customFeeds: [...state.customFeeds, feed]
  })),
  removeCustomFeed: (feedId) => set((state) => ({
    customFeeds: state.customFeeds.filter(f => f.id !== feedId)
  })),
  toggleFeed: (feedId) => set((state) => ({
    feeds: state.feeds.map(f => 
      f.id === feedId ? { ...f, enabled: !f.enabled } : f
    )
  })),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  // ===== Computed =====
  getFilteredArticles: () => {
    const { articles, activeCategory, searchQuery } = get();
    return articles.filter(article => {
      const matchesCategory = activeCategory === 'all' || 
                              article.category === activeCategory;
      const matchesSearch = !searchQuery || 
                            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },
  
  getEnabledFeeds: () => {
    const { feeds } = get();
    return feeds.filter(f => f.enabled);
  },
}));
```

---

## 🔄 Data Flow

### 1. Fetching Articles

```
User opens app / Pull to refresh
         │
         ▼
┌─────────────────┐
│  useFeeds hook  │
│  fetchFeeds()   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Get enabled    │
│  feeds from     │
│  store          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  For each feed  │────▶│  CORS Proxy     │
│  fetch via      │     │  (allorigins)   │
│  rssParser      │     └────────┬────────┘
└─────────────────┘              │
                                 ▼
                    ┌─────────────────┐
                    │  External RSS   │
                    │  Feed Server    │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────┐     ┌─────────────────┐
│  Parse XML to   │◀────│  XML Response   │
│  Article[]      │     └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sort by date   │
│  Deduplicate    │
│  Store in       │
│  Zustand        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UI Re-renders  │
│  with new data  │
└─────────────────┘
```

### 2. Adding Custom Feed

```
User clicks "Add Feed"
         │
         ▼
┌─────────────────┐
│  Open Modal     │
│  AddFeedModal   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User enters:   │
│  - URL          │
│  - Category     │
│  - Name         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate URL   │
│  Test fetch     │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Valid?  │
    └────┬────┘
    Yes  │  No
    │    └──▶ Show error
    ▼
┌─────────────────┐
│  addCustomFeed  │
│  to store       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Save to        │
│  localStorage   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Close modal    │
│  Refresh feeds  │
└─────────────────┘
```

---

## 📦 Key Utilities

### rssParser.js

```javascript
// utils/rssParser.js

const PROXY_URL = 'https://api.allorigins.win/get?url=';

export async function fetchFeed(feedUrl) {
  const proxyUrl = `${PROXY_URL}${encodeURIComponent(feedUrl)}`;
  
  const response = await fetch(proxyUrl);
  const data = await response.json();
  
  if (!data.contents) {
    throw new Error('Failed to fetch feed');
  }
  
  return parseXML(data.contents);
}

function parseXML(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  
  // Handle both RSS and Atom formats
  const items = doc.querySelectorAll('item, entry');
  
  return Array.from(items).map(item => ({
    title: getTextContent(item, 'title'),
    link: getLink(item),
    excerpt: getExcerpt(item),
    content: getContent(item),
    pubDate: getTextContent(item, 'pubDate, published, updated'),
    author: getTextContent(item, 'author, dc\\:creator'),
  }));
}
```

### storage.js

```javascript
// utils/storage.js

const KEYS = {
  FEEDS: 'technews-feeds',
  SETTINGS: 'technews-settings',
  CACHE: 'technews-cache',
};

export const storage = {
  getFeeds: () => {
    const data = localStorage.getItem(KEYS.FEEDS);
    return data ? JSON.parse(data) : [];
  },
  
  setFeeds: (feeds) => {
    localStorage.setItem(KEYS.FEEDS, JSON.stringify(feeds));
  },
  
  getSettings: () => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },
  
  setSettings: (settings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  getCache: () => {
    const data = localStorage.getItem(KEYS.CACHE);
    if (!data) return null;
    
    const { articles, timestamp } = JSON.parse(data);
    const age = Date.now() - timestamp;
    const maxAge = 15 * 60 * 1000; // 15 minutes
    
    if (age > maxAge) {
      localStorage.removeItem(KEYS.CACHE);
      return null;
    }
    
    return articles;
  },
  
  setCache: (articles) => {
    localStorage.setItem(KEYS.CACHE, JSON.stringify({
      articles,
      timestamp: Date.now(),
    }));
  },
};
```

---

## 🔔 Push Notifications

### Service Worker (via vite-plugin-pwa)

```javascript
// Notification permission
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Show notification
function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
    });
  }
}

// Check for new articles (in background)
async function checkNewArticles(lastChecked) {
  const articles = await fetchAllFeeds();
  const newArticles = articles.filter(a => 
    new Date(a.pubDate) > lastChecked
  );
  
  if (newArticles.length > 0) {
    showNotification(
      'TechNews',
      `${newArticles.length} new articles available`
    );
  }
}
```

---

## 🎨 Theme System

### CSS Variables + Tailwind

```css
/* styles/index.css */

:root {
  --color-bg: theme('colors.background.light');
  --color-surface: theme('colors.surface.light');
  --color-primary: theme('colors.primary.light');
  --color-secondary: theme('colors.secondary.light');
  --color-accent: theme('colors.accent.light');
  --color-border: theme('colors.border.light');
}

.dark {
  --color-bg: theme('colors.background.dark');
  --color-surface: theme('colors.surface.dark');
  --color-primary: theme('colors.primary.dark');
  --color-secondary: theme('colors.secondary.dark');
  --color-accent: theme('colors.accent.dark');
  --color-border: theme('colors.border.dark');
}
```

### Theme Hook

```javascript
// hooks/useTheme.js

export function useTheme() {
  const { settings, updateSettings } = useStore();
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme]);
  
  const setTheme = (theme) => {
    updateSettings({ theme });
    storage.setSettings({ ...settings, theme });
  };
  
  return { theme: settings.theme, setTheme };
}
```

---

## 📱 PWA Configuration

### vite.config.js

```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'TechNews',
    short_name: 'TechNews',
    description: 'Your daily tech digest',
    theme_color: '#0A0A0A',
    background_color: '#FAFAFA',
    display: 'standalone',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ]
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.allorigins\.win\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'rss-feed-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 15
          }
        }
      }
    ]
  }
})
```

---

## 🚀 Performance Considerations

1. **Debounce search**: 300ms delay before filtering
2. **Memoize filtered articles**: useMemo for expensive computations
3. **Lazy load images**: Use loading="lazy" attribute
4. **Cache RSS responses**: localStorage + Service Worker
5. **Minimize re-renders**: Use React.memo where appropriate
6. **Code splitting**: Lazy load Reader view (optional)
