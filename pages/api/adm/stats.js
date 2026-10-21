import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify admin token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Get counts for different content types with error handling for each query
    const getCount = async (query, defaultValue = 0) => {
      try {
        const [result] = await pool.query(query);
        return result?.[0]?.count || defaultValue;
      } catch (error) {
        // extract table name for clearer messages
        const m = query.match(/FROM\s+([\w\.]+)/i);
        const tableName = (m && m[1]) ? m[1] : (query.split(' ')[3] || query);
        if (error && error.code === 'ER_NO_SUCH_TABLE') {
          console.warn(`Stats: table not found (${tableName}) — returning default ${defaultValue}`);
        } else {
          console.error(`Error in stats query for ${tableName}:`, error?.message || error);
        }
        return defaultValue;
      }
    };

    const [
      heroSlides,
      announcements,
      offerings,
      documents,
      socialPosts,
      partners
    ] = await Promise.all([
      getCount('SELECT COUNT(*) as count FROM hero_slides WHERE is_active = 1'),
      getCount('SELECT COUNT(*) as count FROM announcements WHERE is_active = 1'),
      getCount('SELECT COUNT(*) as count FROM offerings WHERE is_active = 1'),
      getCount('SELECT COUNT(*) as count FROM recent_documents WHERE is_active = 1'),
      getCount('SELECT COUNT(*) as count FROM social_media_posts WHERE is_active = 1'),
      getCount('SELECT COUNT(*) as count FROM partner_logos WHERE is_active = 1')
    ]);

    res.status(200).json({
      heroSlides,
      announcements,
      offerings,
      documents,
      socialPosts,
      partners
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
