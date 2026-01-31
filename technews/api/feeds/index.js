import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

// RSS Feed sources
const RSS_FEEDS = [
  {
    id: 'theverge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    icon: '🌐',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
    icon: '💻',
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'dev',
    icon: '🔶',
  },
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    icon: '🤖',
  },
  {
    id: 'krebs',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'security',
    icon: '🔒',
  },
  {
    id: 'schneier',
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/feed/',
    category: 'security',
    icon: '🛡️',
  },
  {
    id: 'aitimes',
    name: 'AI News - VentureBeat',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
    icon: '🧠',
  },
];

const CACHE_KEY = 'technews-feeds-v1';
const CACHE_TTL = 300; // 5 minutes in seconds
const MAX_ARTICLES_PER_FEED = 15;
const MAX_AGE_DAYS = 7;

export default async function handler(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse query params
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    const category = url.searchParams.get('category');

    // Try to get from cache (unless force refresh)
    if (!forceRefresh) {
      try {
        const cached = await kv.get(CACHE_KEY);
        if (cached) {
          let articles = cached.articles;

          // Filter by category if specified
          if (category && category !== 'all') {
            articles = articles.filter((a) => a.category === category);
          }

          return new Response(
            JSON.stringify({
              articles,
              source: 'cache',
              cachedAt: cached.timestamp,
              feedCount: RSS_FEEDS.length,
              totalArticles: cached.articles.length,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      } catch (kvError) {
        console.error('KV read error:', kvError);
        // Continue to fetch fresh data
      }
    }

    // Fetch all feeds concurrently
    const results = await Promise.allSettled(
      RSS_FEEDS.map((feed) => fetchAndParseFeed(feed))
    );

    const articles = [];
    const errors = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        articles.push(...result.value);
      } else {
        errors.push({
          feed: RSS_FEEDS[index].id,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });

    // Sort by date (newest first) and filter old articles
    const now = new Date();
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    const sortedArticles = articles
      .filter((article) => {
        const articleDate = new Date(article.pubDate);
        return now - articleDate < maxAge;
      })
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Remove duplicates by link
    const uniqueArticles = sortedArticles.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.link === article.link)
    );

    // Save to cache
    const cacheData = {
      articles: uniqueArticles,
      timestamp: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined,
    };

    try {
      await kv.set(CACHE_KEY, cacheData, { ex: CACHE_TTL });
    } catch (kvError) {
      console.error('KV write error:', kvError);
    }

    // Filter by category for response
    let responseArticles = uniqueArticles;
    if (category && category !== 'all') {
      responseArticles = uniqueArticles.filter((a) => a.category === category);
    }

    return new Response(
      JSON.stringify({
        articles: responseArticles,
        source: 'fresh',
        cachedAt: cacheData.timestamp,
        feedCount: RSS_FEEDS.length,
        totalArticles: uniqueArticles.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        articles: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Fetch and parse a single RSS feed
async function fetchAndParseFeed(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TechNews RSS Reader/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return parseRSS(xml, feed);
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// Parse RSS/Atom XML to articles
function parseRSS(xml, feedInfo) {
  const articles = [];

  // Try RSS format first
  let itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let items = xml.match(itemRegex);

  // Try Atom format if no RSS items found
  if (!items || items.length === 0) {
    itemRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    items = xml.match(itemRegex);
  }

  if (!items) return articles;

  for (const item of items.slice(0, MAX_ARTICLES_PER_FEED)) {
    const title = extractTag(item, 'title');
    const link = extractLink(item);
    const description = extractTag(item, 'description') || extractTag(item, 'summary');
    const pubDate =
      extractTag(item, 'pubDate') ||
      extractTag(item, 'published') ||
      extractTag(item, 'updated');
    const content =
      extractTag(item, 'content:encoded') ||
      extractTag(item, 'content') ||
      description;
    const author =
      extractTag(item, 'author') ||
      extractTag(item, 'dc:creator') ||
      feedInfo.name;

    if (title && link) {
      articles.push({
        id: generateId(),
        title: decodeHTMLEntities(title),
        link,
        excerpt: truncate(stripHtml(description || ''), 200),
        content: content || '',
        pubDate: pubDate || new Date().toISOString(),
        author: decodeHTMLEntities(author),
        source: {
          id: feedInfo.id,
          name: feedInfo.name,
          icon: feedInfo.icon,
        },
        category: feedInfo.category,
        readTime: calculateReadTime(content || description || ''),
      });
    }
  }

  return articles;
}

// Extract tag content (handles CDATA)
function extractTag(text, tag) {
  // Handle namespaced tags like content:encoded
  const escapedTag = tag.replace(':', '\\:');

  // Try CDATA first
  const cdataRegex = new RegExp(
    `<${escapedTag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapedTag}>`,
    'i'
  );
  const cdataMatch = text.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Try regular tag
  const regex = new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

// Extract link (handles both RSS and Atom formats)
function extractLink(item) {
  // RSS format: <link>url</link>
  const linkMatch = item.match(/<link[^>]*>([^<]+)<\/link>/i);
  if (linkMatch && linkMatch[1].trim().startsWith('http')) {
    return linkMatch[1].trim();
  }

  // Atom format: <link href="url" />
  const hrefMatch = item.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (hrefMatch) {
    return hrefMatch[1];
  }

  // Fallback: guid
  const guidMatch = item.match(/<guid[^>]*>([^<]+)<\/guid>/i);
  if (guidMatch && guidMatch[1].startsWith('http')) {
    return guidMatch[1].trim();
  }

  return '';
}

// Utility functions
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(str, len) {
  if (!str) return '';
  const stripped = str.trim();
  return stripped.length > len ? stripped.slice(0, len).trim() + '...' : stripped;
}

function decodeHTMLEntities(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'");
}

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

function calculateReadTime(content) {
  const text = stripHtml(content);
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  const minutes = Math.ceil(words / 200); // 200 words per minute
  return Math.max(1, minutes);
}
