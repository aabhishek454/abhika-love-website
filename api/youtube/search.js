import youTubeSearch from 'youtube-search-api';

export default async function handler(req, res) {
  // Add CORS headers for API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const results = await youTubeSearch.GetListByKeyword(query, false, 15);
    const formattedResults = results.items.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail?.thumbnails[0]?.url || '',
      channel: item.channelTitle || 'Unknown Artist',
      duration: item.length?.simpleText || ''
    }));

    res.status(200).json(formattedResults);
  } catch (err) {
    console.error('Vercel API Search error:', err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
}
