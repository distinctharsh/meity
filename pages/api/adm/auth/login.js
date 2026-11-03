import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { logAuditTrail } from '../logger'; 

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
}

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
      await logAuditTrail(req, null, username, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      await logAuditTrail(req, user.id, user.username, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: String(user.id),
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '30m',
        issuer: 'cabsec-cms',
        audience: 'cabsec-cms-api'
      }
    );
    res.setHeader(
      'Set-Cookie',
      `cms_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`
    );

    await logAuditTrail(req, user.id, user.username, 'LOGIN');

    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}