import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      const [rows] = await pool.query('SELECT id, quote_text, author, image_url, event_url, quote_date, updated_at FROM pm_quotes ORDER BY updated_at DESC, created_at DESC LIMIT 1');
      res.status(200).json(rows[0] || null);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { quote_text, author, image_url, event_url, quote_date } = req.body;
      if (!quote_text || quote_text.toString().trim() === '') {
        return res.status(400).json({ message: 'quote_text is required' });
      }
      const today = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.query('SELECT id FROM pm_quotes ORDER BY updated_at DESC, created_at DESC LIMIT 1');
      if (rows.length > 0) {
        const id = rows[0].id;
        await pool.query(
          'UPDATE pm_quotes SET quote_text = ?, author = ?, image_url = ?, event_url = ?, quote_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [quote_text, author || 'Prime Minister', image_url || null, event_url || null, (quote_date && String(quote_date).trim() !== '' ? quote_date : today), id]
        );
        return res.status(200).json({ id, message: 'PM Quote updated' });
      } else {
        const [result] = await pool.query(
          'INSERT INTO pm_quotes (quote_text, author, image_url, event_url, quote_date) VALUES (?, ?, ?, ?, ?)',
          [quote_text, author || 'Prime Minister', image_url || null, event_url || null, (quote_date && String(quote_date).trim() !== '' ? quote_date : today)]
        );
        return res.status(201).json({ id: result.insertId, message: 'PM Quote created' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
