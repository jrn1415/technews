import { PROXY_URLS, FEED_LIMITS, API_ENDPOINTS, USE_EDGE_API } from './constants';
import { generateId, calculateReadTime, stripHtml, truncateText } from './helpers';

// =====================================================
// NEW: Edge API Method (Recommended - Fast with Cache)
// =====================================================

/**
 * Fetch all feeds from Edge API with server-side caching
 * @param {Array} feeds - Array of feed objects (used for filtering by enabled)
 * @param {Object} options - Options { forceRefresh, category }
 * @returns {Promise<Array>} - Array of articles
 */
export async function fetchAllFeedsFromAPI(feeds, options = {}) {
  const { forceRefresh = false, category = null } = options;

  try {
    const params = new URLSearchParams();
    if (forceRefresh) params.append('refresh', 'true');
    if (category && category !== 'all') params.append('category', category);

    const url = `${API_ENDPOINTS.feeds}${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Log cache status for debugging
    if (import.meta.env.DEV) {
      console.log(`[RSS API] Source: ${data.source}, Articles: ${data.articles?.length}, Cached: ${data.cachedAt}`);
    }

    // Filter by enabled feeds (client-side)
    const enabledFeedIds = feeds.filter(f => f.enabled).map(f => f.id);
    const filteredArticles = data.articles.filter(
      article => enabledFeedIds.includes(article.source.id)
    );

    return filteredArticles;
  } catch (error) {
    console.error('Edge API fetch failed:', error);
    throw error;
  }
}

// =====================================================
// OLD: Proxy Method (Fallback)
// =====================================================

// ตรวจสอบว่าข่าวเก่าเกินไปหรือไม่
function isArticleTooOld(pubDate) {
  const articleDate = new Date(pubDate);
  const now = new Date();
  const maxAge = FEED_LIMITS.maxAgeDays * 24 * 60 * 60 * 1000;
  return now - articleDate > maxAge;
}

// Timeout wrapper for fetch
const FETCH_TIMEOUT = 5000;

async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Fetch RSS feed via proxy (old method)
export async function fetchFeed(feedUrl, feedInfo) {
  const proxyUrl = `${PROXY_URLS.primary}${encodeURIComponent(feedUrl)}`;

  try {
    const response = await fetchWithTimeout(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.contents) {
      throw new Error('No content received from feed');
    }

    return parseXML(data.contents, feedInfo);
  } catch (error) {
    // Try fallback proxy
    try {
      const fallbackUrl = `${PROXY_URLS.fallback}${encodeURIComponent(feedUrl)}`;
      const response = await fetchWithTimeout(fallbackUrl);

      if (!response.ok) {
        throw new Error(`Fallback HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return parseXML(text, feedInfo);
    } catch (fallbackError) {
      console.error(`Failed to fetch feed ${feedUrl}:`, fallbackError);
      throw fallbackError;
    }
  }
}

// Parse XML string to articles
function parseXML(xmlString, feedInfo) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse XML');
  }

  const items = doc.querySelectorAll('item, entry');

  return Array.from(items).map((item) => {
    const title = getTextContent(item, 'title');
    const link = getLink(item);
    const content = getContent(item);
    const excerpt = truncateText(stripHtml(content || getTextContent(item, 'description')), 200);
    const pubDate = getTextContent(item, 'pubDate, published, updated');
    const author = getTextContent(item, 'author, dc\\:creator') || feedInfo.name;

    return {
      id: generateId(),
      title: title || 'Untitled',
      link: link || '',
      excerpt: excerpt || '',
      content: content || '',
      author: author,
      pubDate: pubDate || new Date().toISOString(),
      source: {
        id: feedInfo.id,
        name: feedInfo.name,
        icon: feedInfo.icon
      },
      category: feedInfo.category,
      readTime: calculateReadTime(content || excerpt)
    };
  });
}

function getTextContent(parent, selectors) {
  const selectorList = selectors.split(', ');

  for (const selector of selectorList) {
    const element = parent.querySelector(selector);
    if (element) {
      return element.textContent?.trim() || '';
    }
  }

  return '';
}

function getLink(item) {
  const linkEl = item.querySelector('link');
  if (linkEl) {
    const href = linkEl.getAttribute('href');
    if (href) return href;

    const text = linkEl.textContent?.trim();
    if (text) return text;
  }

  const guid = item.querySelector('guid');
  if (guid && guid.textContent?.startsWith('http')) {
    return guid.textContent.trim();
  }

  return '';
}

function getContent(item) {
  const contentEncoded = item.querySelector('content\\:encoded, encoded');
  if (contentEncoded) {
    return contentEncoded.textContent?.trim() || '';
  }

  const content = item.querySelector('content');
  if (content) {
    return content.textContent?.trim() || '';
  }

  const description = item.querySelector('description');
  if (description) {
    return description.textContent?.trim() || '';
  }

  return '';
}

// Fetch all enabled feeds via proxy (old method)
export async function fetchAllFeedsViaProxy(feeds) {
  const enabledFeeds = feeds.filter((feed) => feed.enabled);

  const results = await Promise.allSettled(
    enabledFeeds.map((feed) => fetchFeed(feed.url, feed))
  );

  const articles = [];

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  });

  const uniqueArticles = articles
    .filter((article) => !isArticleTooOld(article.pubDate))
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.link === article.link)
    );

  return uniqueArticles;
}

// =====================================================
// MAIN: Export unified function
// =====================================================

/**
 * Fetch all feeds - automatically chooses best method
 * Uses Edge API by default, falls back to proxy on failure
 */
export async function fetchAllFeeds(feeds, options = {}) {
  if (USE_EDGE_API) {
    try {
      return await fetchAllFeedsFromAPI(feeds, options);
    } catch (apiError) {
      console.warn('Edge API failed, falling back to proxy:', apiError.message);
      // Fallback to proxy method
      return await fetchAllFeedsViaProxy(feeds);
    }
  }

  // Use old proxy method
  return await fetchAllFeedsViaProxy(feeds);
}

// Validate a feed URL using Edge API
export async function validateFeed(feedUrl) {
  try {
    // Use Edge API to validate (bypasses CORS issues)
    const response = await fetch(`/api/feeds/validate?url=${encodeURIComponent(feedUrl)}`);

    if (!response.ok) {
      // Fallback to proxy method if Edge API not available
      return await validateFeedViaProxy(feedUrl);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    // Fallback to proxy method
    return await validateFeedViaProxy(feedUrl);
  }
}

// Fallback: Validate via CORS proxy
async function validateFeedViaProxy(feedUrl) {
  try {
    const proxyUrl = `${PROXY_URLS.primary}${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.contents) {
      return { valid: false, error: 'No content received' };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return { valid: false, error: 'Invalid XML format' };
    }

    const items = doc.querySelectorAll('item, entry');
    if (items.length === 0) {
      return { valid: false, error: 'No articles found in feed' };
    }

    const feedTitle =
      doc.querySelector('channel > title, feed > title')?.textContent?.trim() ||
      'Unknown Feed';

    return { valid: true, title: feedTitle, itemCount: items.length };
  } catch (error) {
    return { valid: false, error: error.message || 'Failed to validate feed' };
  }
}
