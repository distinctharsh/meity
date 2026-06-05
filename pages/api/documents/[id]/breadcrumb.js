import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Get report title and nav_item_id from reports table
    const [reportRows] = await db.query('SELECT title, nav_item_id FROM reports WHERE id = ?', [id]);

    if (!reportRows || reportRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const report = reportRows[0];

    if (!report.nav_item_id) {
      return res.status(200).json({
        success: true,
        breadcrumb: [{ name: report.title || '', href: req.headers.referer || `/documents/report/${id}` }],
        reportTitle: report.title || ''
      });
    }

    // Get navigation item name and parent_id
    const [navRows] = await db.query('SELECT name, parent_id, link FROM navigation_items WHERE id = ?', [report.nav_item_id]);

    if (!navRows || navRows.length === 0) {
      return res.status(200).json({
        success: true,
        breadcrumb: [{ name: report.title || '', href: req.headers.referer || `/documents/report/${id}` }],
        reportTitle: report.title || ''
      });
    }

    const navItem = navRows[0];
    const breadcrumb = [
      {
        name: navItem.name || '',
        href: navItem.link || '/documents'
      }
    ];

    // If parent_id exists, get parent name
    if (navItem.parent_id) {
      const [parentRows] = await db.query(
        'SELECT name, link FROM navigation_items WHERE id = ?',
        [navItem.parent_id]
      );
      if (parentRows && parentRows.length > 0) {
        breadcrumb.unshift({
          name: parentRows[0].name || '',
          href: parentRows[0].link || '/'
        });
      }
    }

    // Add report title as last breadcrumb item
    breadcrumb.push({ name: report.title || '', href: req.headers.referer || `/documents/report/${id}` });
    

    return res.status(200).json({
      success: true,
      breadcrumb,
      reportTitle: report.title || ''
    });
  } catch (error) {
    console.error('Error fetching breadcrumb:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch breadcrumb' });
  }
}
