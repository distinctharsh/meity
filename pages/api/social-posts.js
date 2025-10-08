import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const [rows] = await pool.query(
      `SELECT platform, content, image_url, post_url
       FROM social_media_posts
       WHERE is_active = TRUE
       ORDER BY display_order ASC, id ASC`
    );

    const result = {
      twitter: [],
      youtube: [],
      facebook: [],
      instagram: []
    };

    // Helper: normalize Twitter/X URLs to a canonical tweet URL
    const normalizeTwitterUrl = (url) => {
      if (!url) return '';
      try {
        const u = new URL(url);
        const host = u.hostname;
        // platform.twitter.com embed must have id
        if (host.includes('platform.twitter.com')) {
          const id = u.searchParams.get('id');
          return id ? `https://x.com/i/web/status/${id}` : '';
        }
        // twitter.com/x.com status URLs
        if (host.includes('twitter.com') || host.includes('x.com')) {
          const m = url.match(/status(?:es)?\/(\d+)/);
          const id = m ? m[1] : '';
          return id ? `https://x.com/i/web/status/${id}` : url;
        }
        return url;
      } catch {
        return url;
      }
    };

    for (const r of rows) {
      let platform = String(r.platform || '').toLowerCase();
      // Map 'x' platform to 'twitter'
      if (platform === 'x') platform = 'twitter';

      // Normalize post_url for twitter
      let post_url = r.post_url || '';
      if (platform === 'twitter') {
        post_url = normalizeTwitterUrl(post_url);
      }

      if (result[platform]) {
        result[platform].push({
          content: r.content || '',
          image_url: r.image_url || '',
          post_url
        });
      }
    }

    res.status(200).json(result);
  } catch (e) {
    console.error('GET /api/social-posts error:', e);
    res.status(500).json({ message: 'Failed to load social posts' });
  }
}
