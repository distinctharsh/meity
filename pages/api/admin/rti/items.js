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
  if (req.method === 'GET') {
    try {
      const { section_id } = req.query;
      let sql = 'SELECT id, section_id, title, file_url, file_size, file_type, display_order, is_active, created_at FROM rti_items';
      const params = [];
      if (section_id) {
        sql += ' WHERE section_id = ?';
        params.push(section_id);
      }
      sql += ' ORDER BY display_order ASC, created_at DESC';
      const [rows] = await pool.query(sql, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching RTI items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      let { section_id, title, file_url, file_size, file_type, display_order = 0, is_active = true } = req.body || {};
      if (!section_id) return res.status(400).json({ message: 'Section ID is required' });
      if (!title) return res.status(400).json({ message: 'Title is required' });

      if (!file_size && file_url) file_size = deriveSize(file_url);
      if (!file_type && file_url) file_type = deriveType(file_url);

      const [orows] = await pool.query(
        'SELECT COALESCE(MAX(display_order), -1) AS max_order FROM rti_items WHERE section_id = ?',
        [section_id]
      );
      const nextOrder = (orows?.[0]?.max_order ?? -1) + 1;

      const [result] = await pool.query(
        'INSERT INTO rti_items (section_id, title, file_url, file_size, file_type, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [section_id, title, file_url || null, file_size || null, file_type || null, display_order || nextOrder, is_active !== false ? 1 : 0]
      );
      res.status(201).json({ id: result.insertId, message: 'Item created' });
    } catch (error) {
      console.error('Error creating RTI item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
