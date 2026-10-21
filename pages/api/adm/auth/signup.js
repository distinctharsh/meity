import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  try {
    // Check how many users exist
    const [countRows] = await pool.query('SELECT COUNT(*) as count FROM cms_users');
    const userCount = countRows[0]?.count || 0;

    // Only allow signup if no users exist yet (bootstrap first admin)
    // Allow opt-in override in non-production with env flag
    const allowOverride = process.env.ALLOW_SIGNUP === 'true' && process.env.NODE_ENV !== 'production';
    if (userCount > 0 && !allowOverride) {
      return res.status(403).json({ message: 'Signup disabled. Contact an admin.' });
    }

    // Enforce minimal password requirements
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user as super_admin and active
    const [result] = await pool.query(
      'INSERT INTO cms_users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
      [username, email, passwordHash, 'super_admin']
    );

    const userId = result.insertId;

    // Issue token similar to login
    const token = jwt.sign(
      {
        userId,
        username,
        role: 'super_admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: userId,
        username,
        email,
        role: 'super_admin',
        is_active: 1
      }
    });
  } catch (error) {
    // Handle unique constraint violations gracefully
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    console.error('Signup error:', error);
    let message = 'Internal server error';
    if (error && error.code === 'ER_NO_SUCH_TABLE') {
      message = 'Users table not found. Please run script.sql to create schema.';
    }
    if (error && error.code === 'ER_ACCESS_DENIED_ERROR') {
      message = 'Database access denied. Check MySQL credentials in lib/db.js';
    }
    return res.status(500).json({
      message,
      code: process.env.NODE_ENV !== 'production' ? error.code : undefined
    });
  }
}


