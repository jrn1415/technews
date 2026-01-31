import { create } from 'zustand';
import { DEFAULT_FEEDS } from '../data/defaultFeeds';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { storage } from '../utils/storage';

export const useStore = create((set, get) => ({
  // ===== Articles State =====
  articles: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  // ===== Bookmarks State =====
  bookmarks: storage.getBookmarks(),

  // ===== UI State =====
  activeTab: 'home', // 'home' | 'bookmarks' | 'sources' | 'settings'
  activeCategory: 'all', // 'all' | 'ai' | 'security' | 'dev' | 'tech'
  searchQuery: '',
  selectedArticle: null, // Article object or null

  // ===== Feeds State =====
  feeds: [...DEFAULT_FEEDS, ...storage.getFeeds()],
  customFeeds: storage.getFeeds(),

  // ===== Settings State =====
  settings: storage.getSettings() || DEFAULT_SETTINGS,

  // ===== Modal State =====
  isAddFeedModalOpen: false,

  // ===== Article Actions =====
  setArticles: (articles) => set({ articles }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setLastUpdated: (time) => set({ lastUpdated: time }),

  // ===== UI Actions =====
  setActiveTab: (tab) => set({ activeTab: tab, selectedArticle: null }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedArticle: (article) => set({ selectedArticle: article }),

  // ===== Modal Actions =====
  openAddFeedModal: () => set({ isAddFeedModalOpen: true }),
  closeAddFeedModal: () => set({ isAddFeedModalOpen: false }),

  // ===== Bookmark Actions =====
  toggleBookmark: (article) => {
    const bookmarks = get().bookmarks;
    const isBookmarked = bookmarks.some((b) => b.link === article.link);

    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((b) => b.link !== article.link);
    } else {
      updatedBookmarks = [
        { ...article, bookmarkedAt: new Date().toISOString() },
        ...bookmarks
      ];
    }

    storage.setBookmarks(updatedBookmarks);
    set({ bookmarks: updatedBookmarks });
  },

  isBookmarked: (articleLink) => {
    return get().bookmarks.some((b) => b.link === articleLink);
  },

  clearAllBookmarks: () => {
    storage.setBookmarks([]);
    set({ bookmarks: [] });
  },

  // ===== Feed Actions =====
  addCustomFeed: (feed) => {
    const newFeed = { ...feed, isDefault: false, enabled: true };
    const updatedCustomFeeds = [...get().customFeeds, newFeed];
    const updatedFeeds = [...DEFAULT_FEEDS, ...updatedCustomFeeds];

    storage.setFeeds(updatedCustomFeeds);

    set({
      customFeeds: updatedCustomFeeds,
      feeds: updatedFeeds
    });
  },

  removeCustomFeed: (feedId) => {
    const updatedCustomFeeds = get().customFeeds.filter((f) => f.id !== feedId);
    const updatedFeeds = [...DEFAULT_FEEDS, ...updatedCustomFeeds];

    storage.setFeeds(updatedCustomFeeds);

    set({
      customFeeds: updatedCustomFeeds,
      feeds: updatedFeeds
    });
  },

  toggleFeed: (feedId) => {
    const feeds = get().feeds.map((f) =>
      f.id === feedId ? { ...f, enabled: !f.enabled } : f
    );

    // Update custom feeds in storage if it's a custom feed
    const customFeeds = get().customFeeds.map((f) =>
      f.id === feedId ? { ...f, enabled: !f.enabled } : f
    );

    storage.setFeeds(customFeeds);

    set({ feeds, customFeeds });
  },

  // ===== Settings Actions =====
  updateSettings: (newSettings) => {
    const updatedSettings = { ...get().settings, ...newSettings };
    storage.setSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  // ===== Computed Getters =====
  getFilteredArticles: () => {
    const { articles, activeCategory, searchQuery } = get();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;

      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  },

  getEnabledFeeds: () => {
    const { feeds } = get();
    return feeds.filter((f) => f.enabled);
  },

  getDefaultFeeds: () => {
    return DEFAULT_FEEDS;
  },

  getCustomFeeds: () => {
    return get().customFeeds;
  }
}));
