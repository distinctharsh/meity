import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const [users] = await pool.query(
      'SELECT id, username, email, role, is_active FROM cms_users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const user = users[0];

    res.status(200).json({
      message: 'Token valid',
      user
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      console.error('Token verification error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
