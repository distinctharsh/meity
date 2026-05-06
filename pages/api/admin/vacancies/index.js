import pool from '@/lib/db';

export default async function handler(req, res) {
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
        WHERE type = 'vacancy'
        ORDER BY published_date DESC, created_at DESC
      `);

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, published_date, file_name, file_size, is_active } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const [result] = await pool.query(`
        INSERT INTO vacancies_tenders 
        (title, type, description, published_date, file_name, file_size, is_active)
        VALUES (?, 'vacancy', ?, ?, ?, ?, ?)
      `, [title, description, published_date, file_name, file_size, is_active !== undefined ? is_active : 1]);

      res.status(201).json({ id: result.insertId, message: 'Vacancy created successfully' });
    } catch (error) {
      console.error('Error creating vacancy:', error);
      res.status(500).json({ message: 'Failed to create vacancy' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
