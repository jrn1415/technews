export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const feedUrl = url.searchParams.get('url');

  if (!feedUrl) {
    return new Response(
      JSON.stringify({ valid: false, error: 'URL parameter is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate URL format
    new URL(feedUrl);
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid URL format' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TechNews RSS Reader/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ valid: false, error: `HTTP ${response.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xml = await response.text();

    // Check if it's valid RSS/Atom
    const isRSS = xml.includes('<rss') || xml.includes('<feed') || xml.includes('<channel');
    if (!isRSS) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Not a valid RSS/Atom feed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Count items
    const itemCount = (xml.match(/<item>/gi) || []).length + (xml.match(/<entry>/gi) || []).length;
    if (itemCount === 0) {
      return new Response(
        JSON.stringify({ valid: false, error: 'No articles found in feed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract title
    const titleMatch = xml.match(/<title[^>]*>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>/i);
    const feedTitle = titleMatch ? titleMatch[1].trim() : 'Unknown Feed';

    return new Response(
      JSON.stringify({ valid: true, title: feedTitle, itemCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error.name === 'AbortError'
      ? 'Request timeout'
      : error.message || 'Failed to fetch feed';

    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
