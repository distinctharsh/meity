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
        'SELECT * FROM navigation_items ORDER BY display_order ASC, created_at DESC'
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching navigation:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, link, parent_id, display_order, is_active, is_show } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const [result] = await pool.query(
        'INSERT INTO navigation_items (name, link, parent_id, display_order, is_active, is_show) VALUES (?, ?, ?, ?, ?, ?)',
        [name, link, parent_id, display_order || 0, is_active !== false, is_show !== false]
      );

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(
        req,
        userId,
        username,
        'NAVIGATION',
        'CREATE',
        result.insertId,
        `Created Navigation Item: "${name}" (ID: ${result.insertId})`
      );

      res.status(201).json({ 
        message: 'Navigation item created successfully',
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating navigation item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}