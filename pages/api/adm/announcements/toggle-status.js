import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, is_active } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid announcement ID' });
  }

  if (typeof is_active !== 'boolean') {
    return res.status(400).json({ message: 'is_active must be a boolean value' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE announcements SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json({ 
      message: `Announcement ${is_active ? 'activated' : 'deactivated'} successfully`,
      is_active: is_active
    });
  } catch (error) {
    console.error('Error toggling announcement status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
