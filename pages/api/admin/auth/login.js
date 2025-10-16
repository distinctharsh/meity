import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user in database
    const [users] = await pool.query(
      'SELECT * FROM cms_users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password) and token
    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    let message = 'Internal server error';
    if (error && error.code === 'ER_NO_SUCH_TABLE') {
      message = 'Users table not found. Please run script.sql to create schema.';
    } else if (error && error.code === 'ER_ACCESS_DENIED_ERROR') {
      message = 'Database access denied. Check MySQL credentials in lib/db.js';
    } else if (error && error.code === 'ER_BAD_DB_ERROR') {
      message = 'Database not found. Create cabsec_cms and run script.sql';
    }
    res.status(500).json({
      message,
      code: process.env.NODE_ENV !== 'production' ? error.code : undefined
    });
  }
}
