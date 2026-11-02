import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { logAuditAction } from '../logger';

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
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, title, display_order, is_active, created_at FROM rti_sections ORDER BY display_order ASC, created_at DESC'
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching RTI sections:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, display_order = 0, is_active = true } = req.body || {};
      if (!title) return res.status(400).json({ message: 'Title is required' });

      const [orows] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS max_order FROM rti_sections');
      const nextOrder = (orows?.[0]?.max_order ?? -1) + 1;

      const [result] = await pool.query(
        'INSERT INTO rti_sections (title, display_order, is_active) VALUES (?, ?, ?)',
        [title, display_order || nextOrder, is_active !== false ? 1 : 0]
      );

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(
        req,
        userId,
        username,
        'RTI_SECTIONS',
        'CREATE',
        result.insertId,
        `Created RTI Section: "${title}" (ID: ${result.insertId})`
      );

      res.status(201).json({ id: result.insertId, message: 'Section created' });
    } catch (error) {
      console.error('Error creating RTI section:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}