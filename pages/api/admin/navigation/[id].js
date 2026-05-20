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

      if (!rows.length) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching navigation item:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const {
        name,
        link,
        parent_id,
        display_order,
        is_active,
        is_show
      } = req.body;

      await pool.query('START TRANSACTION');

      try {
        // Existing navigation data
        const [rows] = await pool.query(
          'SELECT * FROM navigation_items WHERE id = ?',
          [id]
        );

        if (!rows.length) {
          await pool.query('ROLLBACK');
          return res.status(404).json({
            message: 'Navigation item not found'
          });
        }

        const current = rows[0];

        const next = {
          name: name ?? current.name,
          link: link ?? current.link,
          parent_id: parent_id ?? current.parent_id,
          display_order: display_order ?? current.display_order,
          is_active: is_active ?? current.is_active,
          is_show: is_show ?? current.is_show,
        };

        // Update navigation table
        await pool.query(
          `
          UPDATE navigation_items
          SET
          name=?,
          link=?,
          parent_id=?,
          display_order=?,
          is_active=?,
          is_show=?,
          updated_at=CURRENT_TIMESTAMP
          WHERE id=?
          `,
          [
            next.name,
            next.link,
            next.parent_id,
            next.display_order,
            next.is_active,
            next.is_show,
            id
          ]
        );

        // Sync linked page automatically
        const [pages] = await pool.query(
          `
          SELECT id
          FROM pages
          WHERE navigation_item_id=?
          LIMIT 1
          `,
          [id]
        );

        if (pages.length) {
          await pool.query(
            `
            UPDATE pages
            SET
            title=?,
            slug=?,
            is_active=?,
            display_order=?,
            updated_at=CURRENT_TIMESTAMP
            WHERE navigation_item_id=?
            `,
            [
              next.name,
              next.link,
              next.is_active,
              next.display_order,
              id
            ]
          );
        }

        await pool.query('COMMIT');

        return res.status(200).json({
          message: 'Navigation updated successfully'
        });

      } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
      }

    } catch (error) {
      console.error('Error updating navigation:', error);

      if (error?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'Duplicate slug/link exists'
        });
      }

      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  else if (req.method === 'DELETE') {
    try {

      await pool.query('START TRANSACTION');

      try {

        // Delete linked page first
        await pool.query(
          `
          DELETE FROM pages
          WHERE navigation_item_id=?
          `,
          [id]
        );

        // Delete navigation
        const [result] = await pool.query(
          `
          DELETE FROM navigation_items
          WHERE id=?
          `,
          [id]
        );

        if (!result.affectedRows) {
          await pool.query('ROLLBACK');

          return res.status(404).json({
            message: 'Navigation item not found'
          });
        }

        await pool.query('COMMIT');

        return res.status(200).json({
          message: 'Navigation deleted successfully'
        });

      } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
      }

    } catch (error) {
      console.error('Error deleting navigation:', error);

      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  return res.status(405).json({
    message: 'Method not allowed'
  });
}