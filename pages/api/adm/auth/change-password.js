import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { logAuditTrail } from '../logger';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get user ID and username from headers injected by proxy/session
  const userId = req.headers['x-auth-user-id'];
  const username = req.headers['x-auth-username'] || 'Admin';

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  try {
    // Fetch user from DB
    const [users] = await pool.query(
      'SELECT * FROM cms_users WHERE id = ? AND is_active = 1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      await logAuditTrail(req, user.id, user.username, 'FAILED_PASSWORD_CHANGE');
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update in database
    await pool.query(
      'UPDATE cms_users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );

    // Log audit trail
    await logAuditTrail(req, user.id, user.username, 'CHANGE_PASSWORD');

    return res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}