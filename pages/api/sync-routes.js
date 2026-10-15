import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'cabsec_cms',
};

  function buildTree(items, parentId = null) {
    return items
      .filter((item) => {
        if (parentId === null) {
          return item.parent_id === null && item.is_active === 1 && item.is_show === 1;
        }
        return item.parent_id === parentId && item.is_active === 1 && item.is_show === 1;
      })
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => {
        const childItems = buildTree(items, item.id);
        return {
          id: item.id,
          text: item.name,
          href: item.link || '#',
          dropdown: childItems.length > 0,
          display_order: item.display_order ?? 0,
          items: childItems,
          children: childItems
        };
      });
  }

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // 1. Saare active links fetch karein
    const [linkRows] = await connection.execute(
      'SELECT link FROM navigation_items WHERE link IS NOT NULL AND link != "" AND is_active = 1'
    );
    const uniqueLinks = [...new Set(linkRows.map(row => row.link))];
    const routesJsonPath = path.join(process.cwd(), 'lib', 'routes.json');
    fs.writeFileSync(routesJsonPath, JSON.stringify(uniqueLinks, null, 2), 'utf8');

    const [treeRows] = await connection.execute(
      'SELECT * FROM navigation_items WHERE is_active = 1 ORDER BY display_order ASC'
    );

    let tree = buildTree(treeRows, null);

    const homeIndex = tree.findIndex((n) => n.text?.toLowerCase() === 'home');
    if (homeIndex > 0) {
      const [home] = tree.splice(homeIndex, 1);
      tree.unshift(home);
    }

    const navTreeJsonPath = path.join(process.cwd(), 'lib', 'nav-tree.json');
    fs.writeFileSync(navTreeJsonPath, JSON.stringify(tree, null, 2), 'utf8');

    return res.status(200).json({ 
      success: true, 
      message: "Successfully synced routes.json and nav-tree.json!" 
    });

  } catch (error) {
    console.error("Sync error:", error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
}