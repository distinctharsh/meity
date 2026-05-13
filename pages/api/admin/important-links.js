import pool from '../../../lib/db';

async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Important Links API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM important_links 
      ORDER BY display_order ASC, created_at DESC
    `);
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching important links:', error);
    return res.status(500).json({ message: 'Failed to fetch important links' });
  }
}

async function handlePost(req, res) {
  try {
    const { 
      title, 
      url, 
      file_path,
      link_type = 'url',
      is_active = 1 
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Validate based on link type
    if (link_type === 'url' && !url) {
      return res.status(400).json({ message: 'URL is required for external links' });
    }

    if (link_type === 'file' && !file_path) {
      return res.status(400).json({ message: 'File upload is required for file links' });
    }

    // Get the maximum display_order and increment by 1
    const [maxOrderResult] = await pool.query('SELECT MAX(display_order) as max_order FROM important_links');
    const maxOrder = maxOrderResult[0].max_order || 0;
    const newDisplayOrder = maxOrder + 1;

    const [result] = await pool.query(
      'INSERT INTO important_links (title, url, file_path, link_type, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, url || null, file_path || null, link_type, newDisplayOrder, is_active]
    );

    return res.status(201).json({ 
      message: 'Important link created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating important link:', error);
    return res.status(500).json({ message: 'Failed to create important link' });
  }
}

async function handlePut(req, res) {
  try {
    const { id, title, url, file_path, link_type, is_active } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (url !== undefined) {
      updates.push('url = ?');
      values.push(url);
    }
    if (file_path !== undefined) {
      updates.push('file_path = ?');
      values.push(file_path);
    }
    if (link_type !== undefined) {
      updates.push('link_type = ?');
      values.push(link_type);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);

    const [result] = await pool.query(`
      UPDATE important_links 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Important link not found' });
    }

    return res.status(200).json({ message: 'Important link updated successfully' });
  } catch (error) {
    console.error('Error updating important link:', error);
    return res.status(500).json({ message: 'Failed to update important link' });
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    const [result] = await pool.query('DELETE FROM important_links WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Important link not found' });
    }

    return res.status(200).json({ message: 'Important link deleted successfully' });
  } catch (error) {
    console.error('Error deleting important link:', error);
    return res.status(500).json({ message: 'Failed to delete important link' });
  }
}

export default handler;
