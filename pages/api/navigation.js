import pool from '@/lib/db';

function buildTree(items, parentId = null) {
  return items
    .filter((item) => item.parent_id === parentId && item.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((item) => ({
      id: item.id,
      text: item.name,
      href: normalizeHref(item.link, item.children_count),
      dropdown: true,
      display_order: item.display_order ?? 0,
      children: buildTree(items, item.id),
    }));
}

function isExternal(url) {
  return typeof url === 'string' && /^(?:[a-z]+:)?\/\//i.test(url);
}

function normalizeHref(link, childrenCount) {
  if (!link) return childrenCount > 0 ? '#' : '#';
  if (isExternal(link)) return link; // keep absolute/external as-is
  if (link.startsWith('/')) return `/p${link}`; // internal slug -> /p/slug
  return link; // fallback
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
