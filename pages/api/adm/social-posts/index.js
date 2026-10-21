import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query(
        `SELECT id, platform, post_url, display_order, is_active, created_at, updated_at
         FROM social_media_posts
         ORDER BY display_order ASC, id ASC`
      );
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { platform, post_url, display_order = 0, is_active = true } = req.body || {};
      if (!platform || !post_url) {
        return res.status(400).json({ message: 'platform and post_url are required' });
      }
      const [result] = await pool.query(
        `INSERT INTO social_media_posts (platform, post_url, display_order, is_active)
         VALUES (?, ?, ?, ?)` ,
        [platform, post_url, Number(display_order) || 0, !!is_active]
      );
      const [rows] = await pool.query(`SELECT * FROM social_media_posts WHERE id = ?`, [result.insertId]);
      return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error('Admin social-posts index error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
}
