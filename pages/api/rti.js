import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get page content
    const [contentRows] = await pool.query(
      'SELECT page_title, intro_heading, intro_bullets FROM rti_page_content WHERE is_active = 1 LIMIT 1'
    );

    // Get sections first
    const [sectionRows] = await pool.query(
      'SELECT id, title, display_order FROM rti_sections WHERE is_active = 1 ORDER BY display_order ASC'
    );

    // Get items for each section
    const sections = [];
    for (const section of sectionRows) {
      const [itemRows] = await pool.query(
        'SELECT id, title, file_url, file_size, file_type, display_order FROM rti_items WHERE section_id = ? AND is_active = 1 ORDER BY display_order ASC',
        [section.id]
      );
      
      sections.push({
        ...section,
        items: itemRows
      });
    }

    res.status(200).json({
      content: contentRows[0] || {
        page_title: 'RTI',
        intro_heading: 'Power and Duties of Officials',
        intro_bullets: '["To Provide Secretarial assistance to the Cabinet and Cabinet Committees.","To Frame Rules of Business."]'
      },
      sections
    });
  } catch (error) {
    console.error('Error fetching RTI data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
