import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  let connection;
  try {
    // Pool se connection acquire karein
    connection = await pool.getConnection();

    // Fetch all active pages with their content_json
    const [pageRows] = await connection.execute(
      `SELECT id, title, slug, content_json, hero_title, hero_subtitle, hero_image_url, is_active
       FROM pages
       WHERE is_active = 1
       ORDER BY display_order ASC, created_at DESC`
    );

    // Build pages content object keyed by slug
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

    // Write to pages-content.json
    const pagesContentJsonPath = path.join(process.cwd(), 'lib', 'pages-content.json');
    fs.writeFileSync(pagesContentJsonPath, JSON.stringify(pagesContent, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      message: "Successfully synced pages-content.json!",
      total_pages: Object.keys(pagesContent).length
    });

  } catch (error) {
    console.error("Sync pages content error:", error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    // Pool connection ko wapas release karna zaroori hai
    if (connection) connection.release();
  }
}