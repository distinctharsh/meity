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
    console.error('Partner logos API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM partner_logos 
      ORDER BY display_order ASC, created_at ASC
    `);
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching partner logos:', error);
    return res.status(500).json({ message: 'Failed to fetch partner logos' });
  }
}

async function handlePost(req, res) {
  try {
    const { title, image_url, alt_text, display_order = 0, is_active = 1 } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO partner_logos (title, image_url, alt_text, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, image_url, alt_text, display_order, is_active]
    );

    return res.status(201).json({ 
      message: 'Partner logo created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating partner logo:', error);
    return res.status(500).json({ message: 'Failed to create partner logo' });
  }
}

async function handlePut(req, res) {
  try {
    const { id, title, image_url, alt_text, display_order, is_active } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Logo ID is required' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url);
    }
    if (alt_text !== undefined) {
      updates.push('alt_text = ?');
      values.push(alt_text);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
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
      UPDATE partner_logos 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Partner logo not found' });
    }

    return res.status(200).json({ message: 'Partner logo updated successfully' });
  } catch (error) {
    console.error('Error updating partner logo:', error);
    return res.status(500).json({ message: 'Failed to update partner logo' });
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Logo ID is required' });
    }

    const [result] = await pool.query('DELETE FROM partner_logos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Partner logo not found' });
    }

    return res.status(200).json({ message: 'Partner logo deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner logo:', error);
    return res.status(500).json({ message: 'Failed to delete partner logo' });
  }
}

export default handler;
