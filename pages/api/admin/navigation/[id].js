import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid navigation item ID' });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM navigation_items WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching navigation item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, link, parent_id, display_order, is_active } = req.body;

      // Fetch current row to support partial updates
      const [rows] = await pool.query('SELECT * FROM navigation_items WHERE id = ?', [id]);
      if (!rows.length) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }
      const current = rows[0];

      const next = {
        name: name !== undefined ? name : current.name,
        link: link !== undefined ? link : current.link,
        parent_id: parent_id !== undefined ? parent_id : current.parent_id,
        display_order: display_order !== undefined ? display_order : current.display_order,
        is_active: is_active !== undefined ? is_active : current.is_active,
      };

      const [result] = await pool.query(
        'UPDATE navigation_items SET name = ?, link = ?, parent_id = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [next.name, next.link, next.parent_id, next.display_order, next.is_active, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }

      // Auto-sync: if an internal navigation link changed, update matching CMS page slug
      const oldLink = current.link || '';
      const newLink = next.link || '';
      const isInternal = (url) => url && !/^https?:\/\//i.test(url);

      try {
        if (oldLink && newLink && oldLink !== newLink && isInternal(oldLink) && isInternal(newLink)) {
          // Find page with old slug
          const [pagesWithOld] = await pool.query('SELECT id FROM pages WHERE slug = ?', [oldLink]);
          if (pagesWithOld && pagesWithOld.length > 0) {
            const pageId = pagesWithOld[0].id;
            // Ensure there is no different page already using the new slug
            const [conflict] = await pool.query('SELECT id FROM pages WHERE slug = ? AND id <> ?', [newLink, pageId]);
            if (!conflict || conflict.length === 0) {
              await pool.query(
                'UPDATE pages SET slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [newLink, pageId]
              );
            }
          }
        }
      } catch (syncErr) {
        // Do not fail the main request if sync fails; just log for debugging
        console.error('Nav->Page slug sync failed:', syncErr);
      }

      res.status(200).json({ message: 'Navigation item updated successfully' });
    } catch (error) {
      console.error('Error updating navigation item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query(
        'DELETE FROM navigation_items WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }

      res.status(200).json({ message: 'Navigation item deleted successfully' });
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
