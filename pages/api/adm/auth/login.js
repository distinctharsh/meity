import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '@/lib/db';
import { logAuditTrail } from '../logger';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Security configuration missing: JWT_SECRET is not set.');
}

// Function to securely encrypt the entire JWT token string using JWT_SECRET
function encryptTokenString(tokenStr) {
  try {
    const key = crypto.createHash('sha256').update(JWT_SECRET, 'utf8').digest();
    const iv = crypto.createHash('sha256').update(JWT_SECRET, 'utf8').digest().subarray(0, 16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(tokenStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Token encryption error:', error);
    return null;
  }
}

// Function to decrypt the incoming client-side password using JWT_SECRET
function decryptPassword(encryptedPassword) {
  try {
    if (typeof encryptedPassword !== 'string' || !encryptedPassword || encryptedPassword.length > 2048) {
      return null;
    }
    const encryptedBuffer = Buffer.from(encryptedPassword, 'base64');
    if (encryptedBuffer.length === 0 || encryptedBuffer.length % 16 !== 0) {
      return null;
    }

    const key = crypto.createHash('sha256').update(JWT_SECRET, 'utf8').digest();
    const iv = crypto.createHash('sha256').update(JWT_SECRET, 'utf8').digest().subarray(0, 16);

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

  const { username, password: encryptedPassword } = req.body || {};

  if (!username || !encryptedPassword) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const trimmedUsername = username.trim();

  try {
    // 1. STRICT LOCKOUT CHECK: If user has 5 or more failed attempts in the last 30 minutes,
    // block everything immediately (even if the 6th attempt has the correct password).
    const [failedAttempts] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM audit_trails 
       WHERE username = ? 
         AND action = 'FAILED_LOGIN' 
         AND created_at >= (NOW() - INTERVAL 30 MINUTE)`,
      [trimmedUsername]
    );

    if (failedAttempts[0].count >= 5) {
      return res.status(429).json({ 
        message: 'Your account has been locked. Please contact administrator.' 
      });
    }

    const decryptedCombined = decryptPassword(encryptedPassword);

    if (!decryptedCombined || decryptedCombined.length <= 5) {
      await logAuditTrail(req, null, trimmedUsername, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const password = decryptedCombined.slice(0, -5);

    const [users] = await pool.query(
      `SELECT id, username, email, password_hash, role, is_active
       FROM cms_users WHERE username = ? AND is_active = 1 LIMIT 1`,
      [trimmedUsername]
    );

    if (users.length === 0) {
      await logAuditTrail(req, null, trimmedUsername, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      await logAuditTrail(req, user.id, user.username, 'FAILED_LOGIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Generate standard signed JWT
    const rawToken = jwt.sign(
      { sub: String(user.id), username: user.username, role: user.role },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '30m', issuer: 'cabsec-cms', audience: 'cabsec-cms-api' }
    );

    // 3. Encrypt the entire token
    const encryptedToken = encryptTokenString(rawToken);

    if (!encryptedToken) {
      return res.status(500).json({ message: 'Token encryption failed' });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? 'Secure; ' : '';

    res.setHeader(
      'Set-Cookie',
      `cms_token=${encryptedToken}; Path=/; HttpOnly; ${secureFlag}SameSite=Strict; Max-Age=1800`
    );

    await logAuditTrail(req, user.id, user.username, 'LOGIN');

    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json({ 
      message: 'Login successful', 
      token: encryptedToken, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}