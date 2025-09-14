import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM site_settings ORDER BY setting_key'
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const settings = req.body;

      // Update or insert each setting
      for (const [key, value] of Object.entries(settings)) {
        await pool.query(
          'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP',
          [key, value]
        );
      }

      res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
