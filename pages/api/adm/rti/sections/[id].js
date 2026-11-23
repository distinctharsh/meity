import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { logAuditAction } from '../../logger';

const JWT_SECRET = process.env.JWT_SECRET;

function getLoggedInUser(req) {
  const token = req.cookies?.cms_token;
  if (!token || !JWT_SECRET) return { userId: null, username: 'System Admin' };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.sub || null, username: decoded.username || 'Admin' };
  } catch (e) {
    return { userId: null, username: 'System Admin' };
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid section ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, title, display_order, is_active, created_at FROM rti_sections WHERE id = ?',
        [id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching RTI section:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { action, title, display_order, is_active } = req.body || {};

      if (action === 'delete') {
        const [result] = await pool.query(
          'UPDATE rti_sections SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });

        const { userId, username } = getLoggedInUser(req);
        await logAuditAction(req, userId, username, 'RTI_SECTIONS', 'DELETE', id,
          `Deactivated RTI Section ID ${id}`);

        return res.status(200).json({ message: 'Deleted' });
      }

      // update
      const fields = [];
      const values = [];
      if (typeof title !== 'undefined') { fields.push('title = ?'); values.push(title); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); values.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }
      if (!fields.length) return res.status(400).json({ message: 'No valid fields to update' });
      values.push(id);
      const [result] = await pool.query(
        `UPDATE rti_sections SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(
        req, 
        userId, 
        username, 
        'RTI_SECTIONS', 
        'UPDATE', 
        id,
        `Updated RTI Section ID ${id}`
      );

      res.status(200).json({ message: 'Updated' });
    } catch (error) {
      console.error('Error updating RTI section:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}