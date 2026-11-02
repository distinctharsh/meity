import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM audit_actions ORDER BY created_at DESC LIMIT 100'
    );
    return res.status(200).json(rows || []);
  } catch (error) {
    console.error('Error fetching audit actions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}