import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT 
          id,
          title,
          type,
          description,
          tender_id,
          published_date,
          due_date,
          file_name,
          file_size,
          is_active,
          is_archived,
          created_at,
          updated_at
        FROM vacancies_tenders 
        WHERE id = ? AND type = 'vacancy'
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Vacancy not found' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching vacancy:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, published_date, file_name, file_size, is_active, is_archived } = req.body;

      const [result] = await pool.query(`
        UPDATE vacancies_tenders 
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            published_date = COALESCE(?, published_date),
            file_name = COALESCE(?, file_name),
            file_size = COALESCE(?, file_size),
            is_active = COALESCE(?, is_active),
            is_archived = COALESCE(?, is_archived),
            updated_at = NOW()
        WHERE id = ? AND type = 'vacancy'
      `, [title, description, published_date, file_name, file_size, is_active, is_archived, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Vacancy not found' });
      }

      res.status(200).json({ message: 'Vacancy updated successfully' });
    } catch (error) {
      console.error('Error updating vacancy:', error);
      res.status(500).json({ message: 'Failed to update vacancy' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query(`
        DELETE FROM vacancies_tenders 
        WHERE id = ? AND type = 'vacancy'
      `, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Vacancy not found' });
      }

      res.status(200).json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      res.status(500).json({ message: 'Failed to delete vacancy' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
