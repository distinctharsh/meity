import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '@/lib/db';
import { logAuditTrail } from '../logger';

const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_CRYPTO_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET || !PUBLIC_CRYPTO_KEY) {
  throw new Error('Security configuration missing.');
}

function decryptPassword(encryptedPassword) {
  try {
    if (typeof encryptedPassword !== 'string' || !encryptedPassword || encryptedPassword.length > 2048) {
      return null;
    }
    const encryptedBuffer = Buffer.from(encryptedPassword, 'base64');
    if (encryptedBuffer.length === 0 || encryptedBuffer.length % 16 !== 0) {
      return null;
    }

    const key = crypto.createHash('sha256').update(PUBLIC_CRYPTO_KEY, 'utf8').digest();
    const iv = crypto.createHash('sha256').update(PUBLIC_CRYPTO_KEY, 'utf8').digest().subarray(0, 16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, encryptedPassword } = req.body || {};

  if (!username || !encryptedPassword) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const password = decryptPassword(encryptedPassword);

    if (!password) {
      await logAuditTrail(req, null, username, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const [users] = await pool.query(
      `SELECT id, username, email, password_hash, role, is_active
       FROM cms_users WHERE username = ? AND is_active = 1 LIMIT 1`,
      [username.trim()]
    );

    if (users.length === 0) {
      await logAuditTrail(req, null, username, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      await logAuditTrail(req, user.id, user.username, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: String(user.id), username: user.username, role: user.role },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '30m', issuer: 'cabsec-cms', audience: 'cabsec-cms-api' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? 'Secure; ' : '';

    res.setHeader(
      'Set-Cookie',
      `cms_token=${token}; Path=/; HttpOnly; ${secureFlag}SameSite=Strict; Max-Age=1800`
    );

    await logAuditTrail(req, user.id, user.username, 'LOGIN');

    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}