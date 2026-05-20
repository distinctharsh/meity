import pool from '@/lib/db';

export default async function handler(req, res) {

  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: 'Invalid page ID'
    });
  }

  /*
    GET PAGE
  */

  if (req.method === 'GET') {

    try {

      const [rows] = await pool.query(
        `
        SELECT p.*
        FROM pages p
        WHERE p.id = ?
        `,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({
          message: 'Page not found'
        });
      }

      return res.status(200).json(rows[0]);

    } catch (err) {

      console.error('Get page error', err);

      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  /*
    UPDATE PAGE
  */

  else if (req.method === 'PUT') {

    let conn;

    try {

      conn = await pool.getConnection();

      await conn.beginTransaction();

      const {
        title,
        slug,
        parent_id,
        hero_title,
        hero_subtitle,
        hero_image_url,
        content_html,
        content_css,
        content_js,
        content_json,
        is_active,
        display_order
      } = req.body;

      /*
        Prepare content
      */

      let contentObj = {
        html: '',
        css: '',
        js: ''
      };

      if (
        content_json &&
        typeof content_json === 'object'
      ) {

        contentObj.html =
          content_json.html || '';

        contentObj.css =
          content_json.css || '';

        contentObj.js =
          content_json.js || '';

      } else {

        contentObj.html =
          content_html || '';

        contentObj.css =
          content_css || '';

        contentObj.js =
          content_js || '';
      }

      const contentJson =
        JSON.stringify(contentObj);

      /*
        Update page
      */

      const [pageResult] = await conn.query(
        `
        UPDATE pages
        SET
          title = ?,
          slug = ?,
          parent_id = ?,
          hero_title = ?,
          hero_subtitle = ?,
          hero_image_url = ?,
          tabs_json = ?,
          content_json = ?,
          is_active = ?,
          display_order = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          title,
          slug,
          parent_id || null,
          hero_title || null,
          hero_subtitle || null,
          hero_image_url || null,
          null,
          contentJson,
          is_active !== false ? 1 : 0,
          display_order ?? 0,
          id
        ]
      );

      if (!pageResult.affectedRows) {

        await conn.rollback();

        return res.status(404).json({
          message: 'Page not found'
        });
      }

      /*
        Fetch linked navigation item
      */

      const [pageRows] = await conn.query(
        `
        SELECT navigation_item_id
        FROM pages
        WHERE id = ?
        `,
        [id]
      );

      const navItemId =
        pageRows[0]?.navigation_item_id;

      /*
        Sync navigation table
      */

      if (navItemId) {

        await conn.query(
          `
          UPDATE navigation_items
          SET
            name = ?,
            link = ?,
            is_active = ?,
            display_order = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [
            title,
            slug,
            is_active !== false ? 1 : 0,
            display_order ?? 0,
            navItemId
          ]
        );
      }

      await conn.commit();

      return res.status(200).json({
        message: 'Page updated'
      });

    } catch (err) {

      if (conn) {
        await conn.rollback();
      }

      console.error(
        'Update page error',
        err
      );

      if (
        err &&
        err.code === 'ER_DUP_ENTRY'
      ) {

        return res.status(409).json({
          message: 'Slug already exists'
        });
      }

      return res.status(500).json({
        message: 'Internal server error'
      });

    } finally {

      if (conn) {
        conn.release();
      }
    }
  }

  /*
    DELETE PAGE
  */

  else if (req.method === 'DELETE') {

    let conn;

    try {

      conn = await pool.getConnection();

      await conn.beginTransaction();

      /*
        Get navigation_item_id first
      */

      const [pageRows] = await conn.query(
        `
        SELECT navigation_item_id
        FROM pages
        WHERE id = ?
        `,
        [id]
      );

      if (!pageRows.length) {

        await conn.rollback();

        return res.status(404).json({
          message: 'Page not found'
        });
      }

      const navItemId =
        pageRows[0].navigation_item_id;

      /*
        Delete page
      */

      await conn.query(
        `
        DELETE FROM pages
        WHERE id = ?
        `,
        [id]
      );

      /*
        Delete linked navigation item
      */

      if (navItemId) {

        await conn.query(
          `
          DELETE FROM navigation_items
          WHERE id = ?
          `,
          [navItemId]
        );
      }

      await conn.commit();

      return res.status(200).json({
        message: 'Page deleted'
      });

    } catch (err) {

      if (conn) {
        await conn.rollback();
      }

      console.error(
        'Delete page error',
        err
      );

      return res.status(500).json({
        message: 'Internal server error'
      });

    } finally {

      if (conn) {
        conn.release();
      }
    }
  }

  /*
    METHOD NOT ALLOWED
  */

  else {

    return res.status(405).json({
      message: 'Method not allowed'
    });
  }
}