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
        'SELECT * FROM announcements ORDER BY display_order ASC, created_at DESC'
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { 
        title, 
        link_url, 
        link_text, 
        is_active, 
        start_date, 
        end_date, 
        display_order 
      } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const [result] = await pool.query(
        'INSERT INTO announcements (title, link_url, link_text, is_active, start_date, end_date, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          title, 
          link_url, 
          link_text, 
          is_active !== false, 
          start_date && start_date.toString().trim() !== '' ? start_date : null, 
          end_date && end_date.toString().trim() !== '' ? end_date : null, 
          display_order || 0
        ]
      );

      res.status(201).json({ 
        message: 'Announcement created successfully',
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
