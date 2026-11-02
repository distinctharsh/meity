import jwt from 'jsonwebtoken';
import { logAuditTrail } from '../logger';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let userId = null;
    let username = 'Guest';

    const token = req.cookies?.cms_token;
    if (token && JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.sub || null;
        username = decoded.username || 'Admin User';
      } catch (err) {
      }
    }

    await logAuditTrail(req, userId, username, 'LOGOUT');

    res.setHeader(
      'Set-Cookie',
      'cms_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    );

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}