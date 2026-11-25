import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Valid id is required' });
  }

  try {
    if (req.method === 'POST' && req.body.action !== 'delete') {
      const { platform, post_url, display_order = 0, is_active = true } = req.body || {};
      if (!platform || !post_url) {
        return res.status(400).json({ message: 'platform and post_url are required' });
      }
      await pool.query(
        `UPDATE social_media_posts
         SET platform = ?, post_url = ?, display_order = ?, is_active = ?
         WHERE id = ?`,
        [platform, post_url, Number(display_order) || 0, !!is_active, Number(id)]
      );
      const [rows] = await pool.query(`SELECT * FROM social_media_posts WHERE id = ?`, [Number(id)]);
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'POST' && req.body.action === 'delete') {
      await pool.query(
        `UPDATE social_media_posts SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [Number(id)]
      );
      return res.status(200).json({ message: 'Social post deactivated successfully' });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error('Admin social-posts [id] error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
}
