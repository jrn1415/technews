import { PROXY_URLS, FEED_LIMITS } from './constants';
import { generateId, calculateReadTime, stripHtml, truncateText } from './helpers';

// ตรวจสอบว่าข่าวเก่าเกินไปหรือไม่
function isArticleTooOld(pubDate) {
  const articleDate = new Date(pubDate);
  const now = new Date();
  const maxAge = FEED_LIMITS.maxAgeDays * 24 * 60 * 60 * 1000; // แปลงเป็น milliseconds
  return now - articleDate > maxAge;
}

// Timeout wrapper for fetch
const FETCH_TIMEOUT = 5000; // 5 seconds

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

// Fetch RSS feed via proxy
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

  // Check for parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse XML');
  }

  // Handle both RSS and Atom formats
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

// Get text content from element
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

// Get link from item (handles different formats)
function getLink(item) {
  // Try standard link element
  const linkEl = item.querySelector('link');
  if (linkEl) {
    // Atom format uses href attribute
    const href = linkEl.getAttribute('href');
    if (href) return href;

    // RSS format uses text content
    const text = linkEl.textContent?.trim();
    if (text) return text;
  }

  // Try guid as fallback
  const guid = item.querySelector('guid');
  if (guid && guid.textContent?.startsWith('http')) {
    return guid.textContent.trim();
  }

  return '';
}

// Get content from item
function getContent(item) {
  // Try content:encoded first (common in RSS)
  const contentEncoded = item.querySelector('content\\:encoded, encoded');
  if (contentEncoded) {
    return contentEncoded.textContent?.trim() || '';
  }

  // Try content element (Atom)
  const content = item.querySelector('content');
  if (content) {
    return content.textContent?.trim() || '';
  }

  // Fall back to description
  const description = item.querySelector('description');
  if (description) {
    return description.textContent?.trim() || '';
  }

  return '';
}

// Fetch all enabled feeds and combine articles
export async function fetchAllFeeds(feeds) {
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

  // Sort by date (newest first), filter old articles, and remove duplicates
  const uniqueArticles = articles
    .filter((article) => !isArticleTooOld(article.pubDate)) // กรองข่าวเก่าเกิน 7 วัน
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.link === article.link)
    );

  return uniqueArticles;
}

// Validate a feed URL by attempting to fetch it
export async function validateFeed(feedUrl) {
  try {
    const proxyUrl = `${PROXY_URLS.primary}${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.contents) {
      return { valid: false, error: 'No content received' };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return { valid: false, error: 'Invalid XML format' };
    }

    // Check for RSS/Atom items
    const items = doc.querySelectorAll('item, entry');
    if (items.length === 0) {
      return { valid: false, error: 'No articles found in feed' };
    }

    // Get feed title
    const feedTitle =
      doc.querySelector('channel > title, feed > title')?.textContent?.trim() ||
      'Unknown Feed';

    return { valid: true, title: feedTitle, itemCount: items.length };
  } catch (error) {
    return { valid: false, error: error.message || 'Failed to validate feed' };
  }
}
