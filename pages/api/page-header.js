import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const { path } = req.query;
  if (!path) return res.status(400).json({ message: 'path is required, e.g. /cabinet-secretariat/about' });
  try {
    const [navRows] = await pool.query(
      `
        SELECT id, link
        FROM navigation_items
        WHERE link = ? OR link = ?
        LIMIT 1
        `,
      [path, path.replace(/^\//, '')]
    );

    if (navRows.length > 0) {
      return res.status(200).json(null);
    }

    const pathSegments = path.split('/').filter(Boolean);
    const slugWithoutSlash = pathSegments.join('/');
    const slugWithSlash = '/' + slugWithoutSlash;
    const lastSegment = pathSegments[pathSegments.length - 1] || '';
    const [pageRows] = await pool.query(
      `
        SELECT 
            p.id,
            p.title,
            p.hero_title,
            p.hero_subtitle,
            p.hero_image_url AS background_url,
            p.navigation_item_id,
            ni.name AS parent_label,
            ni.link AS parent_href

        FROM pages p

        LEFT JOIN navigation_items ni
        ON ni.id = p.navigation_item_id

        WHERE (p.slug = ? OR p.slug = ? OR p.slug = ?) AND p.is_active = 1
        LIMIT 1
        `,
      [slugWithoutSlash, slugWithSlash, path]
    );

    if (pageRows.length > 0) {
      const page = pageRows[0];
      return res.status(200).json({
        id: page.id,
        page_path: path,
        heading: page.hero_title || page.title,
        subheading: page.hero_subtitle || '',
        background_url: page.background_url || null,
        parent_label: page.parent_label || null,
        parent_href: page.parent_href || null
      });
    }

    if (lastSegment && pathSegments.length > 1) {
      const [nestedPageRows] = await pool.query(
        `
          SELECT 
              p.id,
              p.title,
              p.hero_title,
              p.hero_subtitle,
              p.hero_image_url AS background_url,
              p.navigation_item_id,
              ni.name AS parent_label,
              ni.link AS parent_href

          FROM pages p

          LEFT JOIN navigation_items ni
          ON ni.id = p.navigation_item_id

          WHERE (p.slug = ? OR p.slug = ? OR p.slug = ?) AND p.is_active = 1
          LIMIT 1
          `,
        [lastSegment, '/' + lastSegment, path]
      );

      if (nestedPageRows.length > 0) {
        const page = nestedPageRows[0];
        return res.status(200).json({
          id: page.id,
          page_path: path,
          heading: page.hero_title || page.title,
          subheading: page.hero_subtitle || '',
          background_url: page.background_url || null,
          parent_label: page.parent_label || null,
          parent_href: page.parent_href || null
        });
      }
    }

    const [rows] = await pool.query(
      `
        SELECT 
            ph.id,
            ph.page_path,
            ph.background_url,
            ni.name AS parent_label,
            ni.link AS parent_href

        FROM page_headers ph

        LEFT JOIN navigation_items ni
        ON ni.link = SUBSTRING_INDEX(ph.page_path,'/',2)

        WHERE ph.page_path = ?
        LIMIT 1
        `,
      [path]
    );
    
    if (!rows.length) return res.status(200).json(null);
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Fetch page header error', err);
    return res.status(200).json(null);
  }
}