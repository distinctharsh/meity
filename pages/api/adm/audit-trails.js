import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM audit_trails 
       WHERE created_at >= NOW() - INTERVAL 1 MONTH 
       ORDER BY created_at DESC`
    );
    return res.status(200).json(rows || []);
  } catch (error) {
    console.error('Error fetching audit trails:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}