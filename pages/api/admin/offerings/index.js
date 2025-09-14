import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Disable caching for real-time updates
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      
      const [rows] = await pool.query(
        'SELECT * FROM offerings ORDER BY display_order ASC, created_at DESC'
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching offerings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, icon, link_url, category, display_order, is_active } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      const [result] = await pool.query(
        'INSERT INTO offerings (title, description, icon, link_url, category, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, icon, link_url, category, display_order || 0, is_active !== false]
      );

      res.status(201).json({ 
        message: 'Offering created successfully',
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating offering:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
