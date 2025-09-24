import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const navId = Number.parseInt(id, 10);
  if (!Number.isFinite(navId)) {
    return res.status(400).json({ message: 'Query param "id" (number) is required' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, name, link
       FROM navigation_items
       WHERE is_active = TRUE
         AND link IS NOT NULL
         AND parent_id = (
           SELECT parent_id
           FROM navigation_items
           WHERE id = ?
         )
       ORDER BY display_order ASC, id ASC`,
      [navId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error('navigation-siblings error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
