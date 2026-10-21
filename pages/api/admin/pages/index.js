import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function syncPagesContent() {
  try {
    const [pageRows] = await pool.query(
      `SELECT id, title, slug, content_json, hero_title, hero_subtitle, hero_image_url, is_active
       FROM pages
       WHERE is_active = 1
       ORDER BY display_order ASC, created_at DESC`
    );

    const pagesContent = {};

    for (const page of pageRows) {
      let contentObj = {};

      try {
        contentObj = page.content_json ? JSON.parse(page.content_json) : {};
      } catch (e) {
        console.error(`Error parsing content_json for page ${page.id}:`, e);
        contentObj = { html: '', css: '', js: '' };
      }

      pagesContent[page.slug] = {
        id: page.id,
        title: page.title,
        slug: page.slug,
        hero_title: page.hero_title,
        hero_subtitle: page.hero_subtitle,
        hero_image_url: page.hero_image_url,
        content: contentObj,
        is_active: page.is_active
      };
    }

    const pagesContentJsonPath = path.join(process.cwd(), 'lib', 'pages-content.json');
    fs.writeFileSync(pagesContentJsonPath, JSON.stringify(pagesContent, null, 2), 'utf8');
  } catch (error) {
    console.error('Sync pages content error:', error);
  }
}

export default async function handler(req, res) {

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT p.*
        FROM pages p
        ORDER BY p.created_at DESC
      `);

      return res.status(200).json(rows);

    } catch (err) {
      console.error('Fetch pages error', err);

      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  else if (req.method === 'POST') {

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
        is_active = true,
        display_order = 0
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({
          message: 'Title and slug are required'
        });
      }

      /*
        Content preparation
      */

      let contentObj = {
        html: '',
        css: '',
        js: '',
        no_scope: false
      };

      if (
        content_json &&
        typeof content_json === 'object'
      ) {

        contentObj.html = content_json.html || '';
        contentObj.css = content_json.css || '';
        contentObj.js = content_json.js || '';
        contentObj.no_scope =
          content_json.no_scope === true;

      } else {

        contentObj.html = content_html || '';
        contentObj.css = content_css || '';
        contentObj.js = content_js || '';
      }

      const contentJson = JSON.stringify(
        contentObj
      );

      /*
        STEP 1

        Create navigation record
      */

      const [navResult] = await conn.query(
        `
        INSERT INTO navigation_items
        (
          name,
          link,
          parent_id,
          display_order,
          is_active,
          is_show
        )
        VALUES
        (
          ?, ?, ?, ?, ?, ?
        )
        `,
        [
          title,
          slug,
          null,
          display_order,
          is_active ? 1 : 0,
          0
        ]
      );

      const navigationItemId =
        navResult.insertId;

      /*
        STEP 2

        Create page
      */

      const [pageResult] = await conn.query(
        `
        INSERT INTO pages
        (
          title,
          slug,
          parent_id,
          navigation_item_id,
          hero_title,
          hero_subtitle,
          hero_image_url,
          content_json,
          is_active,
          display_order
        )
        VALUES
        (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        [
          title,
          slug,
          parent_id || null,
          navigationItemId,
          hero_title || null,
          hero_subtitle || null,
          hero_image_url || null,
          contentJson,
          is_active ? 1 : 0,
          display_order
        ]
      );

      await conn.commit();

      await syncPagesContent();

      return res.status(201).json({
        id: pageResult.insertId,
        navigation_item_id: navigationItemId
      });

    } catch (err) {

      if (conn) {
        await conn.rollback();
      }

      console.error(
        'Create page error:',
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

  else {

    return res.status(405).json({
      message: 'Method not allowed'
    });
  }
}