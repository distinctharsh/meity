import pool from '@/lib/db';

function buildTree(items, parentId = null) {
  return items
    .filter((item) => item.parent_id === parentId && item.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((item) => ({
      id: item.id,
      text: item.name,
      href: item.link || (item.children_count > 0 ? '#' : '#'),
      dropdown: true,
      display_order: item.display_order ?? 0,
      children: buildTree(items, item.id),
    }));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const [rows] = await pool.query(
      `SELECT ni.*, (
         SELECT COUNT(*) FROM navigation_items c WHERE c.parent_id = ni.id AND c.is_active = TRUE
       ) as children_count
       FROM navigation_items ni
       WHERE ni.is_active = TRUE
       ORDER BY ni.display_order ASC, ni.created_at DESC`
    );

    const tree = buildTree(rows, null);

    // Ensure Home item stays first if present
    const homeIndex = tree.findIndex((n) => n.text?.toLowerCase() === 'home');
    if (homeIndex > 0) {
      const [home] = tree.splice(homeIndex, 1);
      tree.unshift(home);
    }

    res.status(200).json(tree);
  } catch (error) {
    console.error('Error building navigation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
