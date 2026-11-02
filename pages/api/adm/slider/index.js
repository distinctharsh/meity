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
      // Disable caching for real-time updates
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      
      const [rows] = await pool.query(
        'SELECT * FROM hero_slides ORDER BY display_order ASC, created_at DESC'
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching slides:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { image_url, link_url, display_order, is_active } = req.body;

      if (!image_url) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const [result] = await pool.query(
        'INSERT INTO hero_slides (image_url, link_url, display_order, is_active) VALUES (?, ?, ?, ?)',
        [image_url, link_url, display_order || 0, is_active !== false]
      );

      const { userId, username } = getLoggedInUser(req);
      await logAuditAction(
        req,
        userId,
        username,
        'HERO_SLIDER',
        'CREATE',
        result.insertId,
        `Created new hero slider with ID ${result.insertId}`
      );

      res.status(201).json({ 
        message: 'Slide created successfully',
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating slide:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}