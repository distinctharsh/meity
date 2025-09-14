import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get counts for different content types
    const [
      heroSlides,
      announcements,
      offerings,
      documents,
      socialPosts,
      partners
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM hero_slides WHERE is_active = 1'),
      pool.query('SELECT COUNT(*) as count FROM announcements WHERE is_active = 1'),
      pool.query('SELECT COUNT(*) as count FROM offerings WHERE is_active = 1'),
      pool.query('SELECT COUNT(*) as count FROM recent_documents WHERE is_active = 1'),
      pool.query('SELECT COUNT(*) as count FROM social_media_posts WHERE is_active = 1'),
      pool.query('SELECT COUNT(*) as count FROM partner_logos WHERE is_active = 1')
    ]);

    res.status(200).json({
      heroSlides: heroSlides[0][0].count,
      announcements: announcements[0][0].count,
      offerings: offerings[0][0].count,
      documents: documents[0][0].count,
      socialPosts: socialPosts[0][0].count,
      partners: partners[0][0].count
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
