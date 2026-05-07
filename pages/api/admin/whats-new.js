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
    console.error('What\'s New API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM whats_new 
      ORDER BY display_order ASC, created_at DESC
    `);
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching what\'s new items:', error);
    return res.status(500).json({ message: 'Failed to fetch what\'s new items' });
  }
}

async function handlePost(req, res) {
  try {
    const { 
      title, 
      type = 'link', 
      file_url, 
      external_url, 
      is_active = 1 
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (type === 'pdf' && !file_url) {
      return res.status(400).json({ message: 'File URL is required for PDF type' });
    }

    if (type === 'link' && !external_url) {
      return res.status(400).json({ message: 'External URL is required for link type' });
    }

    // Get the maximum display_order and increment by 1
    const [maxOrderResult] = await pool.query('SELECT MAX(display_order) as max_order FROM whats_new');
    const maxOrder = maxOrderResult[0].max_order || 0;
    const newDisplayOrder = maxOrder + 1;

    const [result] = await pool.query(
      'INSERT INTO whats_new (title, type, file_url, external_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, type, file_url, external_url, newDisplayOrder, is_active]
    );

    return res.status(201).json({ 
      message: 'What\'s New item created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating what\'s new item:', error);
    return res.status(500).json({ message: 'Failed to create what\'s new item' });
  }
}

async function handlePut(req, res) {
  try {
    const { id, title, type, file_url, external_url, is_active } = req.body;

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
    if (type !== undefined) {
      updates.push('type = ?');
      values.push(type);
    }
    if (file_url !== undefined) {
      updates.push('file_url = ?');
      values.push(file_url);
    }
    if (external_url !== undefined) {
      updates.push('external_url = ?');
      values.push(external_url);
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
      UPDATE whats_new 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'What\'s New item not found' });
    }

    return res.status(200).json({ message: 'What\'s New item updated successfully' });
  } catch (error) {
    console.error('Error updating what\'s new item:', error);
    return res.status(500).json({ message: 'Failed to update what\'s new item' });
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    const [result] = await pool.query('DELETE FROM whats_new WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'What\'s New item not found' });
    }

    return res.status(200).json({ message: 'What\'s New item deleted successfully' });
  } catch (error) {
    console.error('Error deleting what\'s new item:', error);
    return res.status(500).json({ message: 'Failed to delete what\'s new item' });
  }
}

export default handler;
