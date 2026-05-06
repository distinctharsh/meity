import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function deriveType(url) {
  if (!url) return '';
  const ext = path.extname(url).toLowerCase().replace('.', '');
  if (!ext) return '';
  return ext.toUpperCase();
}

function deriveSize(url) {
  if (!url) return '';
  let rel = url.startsWith('/') ? url.slice(1) : url;
  const localPath = path.join(process.cwd(), 'public', rel);
  try {
    if (fs.existsSync(localPath)) {
      const st = fs.statSync(localPath);
      if (st.isFile()) return formatBytes(st.size);
    }
  } catch { }
  return '';
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid item ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, section_id, title, file_url, file_size, file_type, display_order, is_active, created_at FROM rti_items WHERE id = ?',
        [id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching RTI item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      let { section_id, title, file_url, file_size, file_type, display_order, is_active } = req.body || {};
      // Auto-derive size/type when file_url changes
      if (typeof file_url !== 'undefined' && !file_size) file_size = deriveSize(file_url);
      if (typeof file_url !== 'undefined' && !file_type) file_type = deriveType(file_url);
      const fields = [];
      const values = [];
      if (typeof section_id !== 'undefined') { fields.push('section_id = ?'); values.push(section_id); }
      if (typeof title !== 'undefined') { fields.push('title = ?'); values.push(title); }
      if (typeof file_url !== 'undefined') { fields.push('file_url = ?'); values.push(file_url || null); }
      if (typeof file_size !== 'undefined') { fields.push('file_size = ?'); values.push(file_size || null); }
      if (typeof file_type !== 'undefined') { fields.push('file_type = ?'); values.push(file_type || null); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); values.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(!!is_active ? 1 : 0); }
      if (!fields.length) return res.status(400).json({ message: 'No valid fields to update' });
      const sql = `UPDATE rti_items SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Updated' });
    } catch (error) {
      console.error('Error updating RTI item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM rti_items WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      console.error('Error deleting RTI item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
