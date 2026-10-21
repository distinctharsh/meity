import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid PM Quote ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, quote_text, author, image_url, event_url, quote_date, updated_at FROM pm_quotes WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'PM Quote not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { quote_text, author, image_url, event_url, quote_date } = req.body;
      if (!quote_text || quote_text.toString().trim() === '') {
        return res.status(400).json({ message: 'quote_text is required' });
      }
      const today = new Date().toISOString().slice(0, 10);
      const [result] = await pool.query(
        'UPDATE pm_quotes SET quote_text = ?, author = ?, image_url = ?, event_url = ?, quote_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [quote_text, author || 'Prime Minister', image_url || null, event_url || null, (quote_date && String(quote_date).trim() !== '' ? quote_date : today), id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'PM Quote not found' });
      res.status(200).json({ message: 'PM Quote updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    return res.status(405).json({ message: 'Delete is disabled for PM Quote' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
