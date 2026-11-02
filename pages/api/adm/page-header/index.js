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
      const { page_path } = req.query;
      const sql = page_path
        ? 'SELECT id, page_path, background_url FROM page_headers WHERE page_path = ?'
        : 'SELECT id, page_path, background_url FROM page_headers ORDER BY page_path ASC';
      const params = page_path ? [page_path] : [];
      const [rows] = await pool.query(sql, params);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Admin page header list error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { page_path, background_url } = req.body;
      if (!page_path) {
        return res.status(400).json({ message: 'page_path is required' });
      }
      const bg = background_url ? String(background_url).trim() : null;
      const trimmedPath = String(page_path).trim();
      const [r] = await pool.query(
        'INSERT INTO page_headers (page_path, background_url) VALUES (?, ?)\n        ON DUPLICATE KEY UPDATE background_url = VALUES(background_url)',
        [trimmedPath, bg]
      );

      const insertId = r.insertId || null;

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(
        req,
        userId,
        username,
        'PAGE_HEADERS',
        'CREATE',
        insertId,
        `Upserted Page Header for path: "${trimmedPath}"`
      );

      res.status(201).json({ id: insertId, upserted: true });
    } catch (err) {
      console.error('Admin page header create error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}