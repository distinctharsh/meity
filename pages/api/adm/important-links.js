import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';
import { logAuditAction } from './logger';

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

async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Important Links API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM important_links 
      ORDER BY display_order ASC, created_at DESC
    `);
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching important links:', error);
    return res.status(500).json({ message: 'Failed to fetch important links' });
  }
}

async function handlePost(req, res) {
  try {
    const { action, id, title, url, file_path, link_type = 'url', is_active = 1 } = req.body;

    // Soft Delete
    if (action === 'delete') {
      if (!id) {
        return res.status(400).json({ message: 'Item ID is required' });
      }

      const [result] = await pool.query(
        'UPDATE important_links SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Important link not found' });
      }

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(req, userId, username, 'IMPORTANT_LINKS', 'DELETE', id,
        `Deactivated Important Link ID ${id}`);

      return res.status(200).json({ message: 'Important link deactivated successfully' });
    }

    // Toggle Status
    if (action === 'toggle') {
      const [result] = await pool.query(
        'UPDATE important_links SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [is_active ? 1 : 0, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Important link not found' });
      }

      return res.status(200).json({ message: 'Status updated successfully' });
    }

    // Update
    if (action === 'update') {
      if (!id) {
        return res.status(400).json({ message: 'Item ID is required' });
      }

      const updates = [];
      const values = [];

      if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
      }
      if (url !== undefined) {
        updates.push('url = ?');
        values.push(url);
      }
      if (file_path !== undefined) {
        updates.push('file_path = ?');
        values.push(file_path);
      }
      if (link_type !== undefined) {
        updates.push('link_type = ?');
        values.push(link_type);
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?');
        values.push(is_active);
      }

      if (!updates.length) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      values.push(id);

      const [result] = await pool.query(
        `UPDATE important_links SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Important link not found' });
      }

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(req, userId, username, 'IMPORTANT_LINKS', 'UPDATE', id,
        `Updated Important Link ID ${id}`);

      return res.status(200).json({ message: 'Important link updated successfully' });
    }

    // Create
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (link_type === 'url' && !url) {
      return res.status(400).json({ message: 'URL is required for external links' });
    }

    if (link_type === 'file' && !file_path) {
      return res.status(400).json({ message: 'File upload is required for file links' });
    }

    const [maxOrderResult] = await pool.query(
      'SELECT MAX(display_order) as max_order FROM important_links'
    );

    const newDisplayOrder = (maxOrderResult[0].max_order || 0) + 1;

    const [result] = await pool.query(
      'INSERT INTO important_links (title, url, file_path, link_type, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, url || null, file_path || null, link_type, newDisplayOrder, is_active]
    );

    const { userId, username } = getLoggedInUser(req);
    await logAuditAction(req, userId, username, 'IMPORTANT_LINKS', 'CREATE', result.insertId,
      `Created Important Link: "${title}" (ID: ${result.insertId})`);

    return res.status(201).json({
      message: 'Important link created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error processing important link:', error);
    return res.status(500).json({ message: 'Failed to process important link' });
  }
}

export default handler;