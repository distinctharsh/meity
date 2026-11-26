import pool from '@/lib/db';

// 1. Log Login / Logout / Failed Login
export async function logAuditTrail(req, userId, username, action) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await pool.query(
      'INSERT INTO audit_trails (user_id, username, action, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId || null, username || 'Guest', action, ip, userAgent]
    );
  } catch (err) {
    console.error('Audit trail insert error:', err);
  }
}

// 2. Log CRUD Actions (Create, Update, Delete)
export async function logAuditAction(req, userId, username, module, actionType, recordId, description) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const [result] = await pool.query(
      `INSERT INTO audit_actions (user_id, username, module, action_type, record_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, username || 'System Admin', module, actionType, recordId || null, description, ip]
    );

   
    const [rows] = await pool.query(
      `SELECT created_at FROM audit_actions WHERE id = ?`,
      [result.insertId]
    );

    if (rows.length) {
      await pool.query(
        `UPDATE footer SET updated_at = ? WHERE type = 'main'`,
        [rows[0].created_at]
      );
    }

  } catch (err) {
    console.error('Audit action insert error:', err);
  }
}