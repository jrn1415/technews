import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '../stores/useStore';
import { fetchAllFeeds } from '../utils/rssParser';
import { storage } from '../utils/storage';

export function useFeeds() {
  const {
    articles,
    isLoading,
    error,
    lastUpdated,
    feeds,
    settings,
    setArticles,
    setLoading,
    setError,
    setLastUpdated,
    getEnabledFeeds
  } = useStore();

  const intervalRef = useRef(null);
  const previousArticleCount = useRef(0);

  // Fetch feeds function
  const fetchFeeds = useCallback(async (isAutoRefresh = false) => {
    // Don't show loading indicator for auto-refresh
    if (!isAutoRefresh) {
      setLoading(true);
    }
    setError(null);

    try {
      const enabledFeeds = getEnabledFeeds();

      if (enabledFeeds.length === 0) {
        setArticles([]);
        setLastUpdated(new Date().toISOString());
        return { newCount: 0 };
      }

      const fetchedArticles = await fetchAllFeeds(enabledFeeds);

      // Calculate new articles count for notifications
      const newCount = isAutoRefresh
        ? fetchedArticles.filter(
            (article) =>
              !articles.some((existing) => existing.link === article.link)
          ).length
        : 0;

      setArticles(fetchedArticles);
      setLastUpdated(new Date().toISOString());

      // Cache the articles
      storage.setCache(fetchedArticles);

      return { newCount };
    } catch (err) {
      console.error('Failed to fetch feeds:', err);
      setError(err.message || 'Failed to fetch feeds');

      // Try to load from cache on error
      const cachedArticles = storage.getCache();
      if (cachedArticles && cachedArticles.length > 0) {
        setArticles(cachedArticles);
      }

      return { newCount: 0 };
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  }, [articles, getEnabledFeeds, setArticles, setError, setLastUpdated, setLoading]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchFeeds(false);
  }, [fetchFeeds]);

  // Load cached articles on mount, then refresh in background
  useEffect(() => {
    // Skip if articles already loaded in store (e.g., returning from ReaderView)
    if (articles.length > 0) {
      return;
    }

    const cachedArticles = storage.getCache();
    const hasCache = cachedArticles && cachedArticles.length > 0;

    if (hasCache) {
      // Show cached content immediately (no loading state)
      setArticles(cachedArticles);
      previousArticleCount.current = cachedArticles.length;

      // Refresh in background (silent, no loading indicator)
      fetchFeeds(true);
    } else {
      // No cache: show loading and fetch
      fetchFeeds(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when enabled feeds change
  useEffect(() => {
    const enabledCount = feeds.filter((f) => f.enabled).length;
    // Only refetch if we have articles and enabled count changed
    if (articles.length > 0 && enabledCount > 0) {
      fetchFeeds(false);
    }
  }, [feeds.filter((f) => f.enabled).length]);

  // Auto-refresh based on settings
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set up new interval
    const intervalMs = settings.refreshInterval * 60 * 1000;

    intervalRef.current = setInterval(async () => {
      console.log('Auto-refreshing feeds...');
      const result = await fetchFeeds(true);

      // Show notification if enabled and new articles found
      if (settings.notifications && result.newCount > 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('TechNews', {
            body: `${result.newCount} new article${result.newCount > 1 ? 's' : ''} available`,
            icon: '/icons/icon-192x192.svg',
            tag: 'new-articles'
          });
        }
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.refreshInterval, settings.notifications, fetchFeeds]);

  return {
    articles,
    isLoading,
    error,
    lastUpdated,
    refresh
  };
}
