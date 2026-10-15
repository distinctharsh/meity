import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cabinet_db',
};

export default async function handler(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Database se saare active/show links fetch karein
    const [rows] = await connection.execute(
      'SELECT link FROM navigation_items WHERE link IS NOT NULL AND link != "" AND is_active = 1'
    );

    // Links ki ek clean array banayein (aur duplicate hata dein)
    const links = [...new Set(rows.map(row => row.link))];

    // File path set karein (lib/routes.json)
    const filePath = path.join(process.cwd(), 'lib', 'routes.json');

    // JSON file ko update/write kar dein
    fs.writeFileSync(filePath, JSON.stringify(links, null, 2), 'utf8');

    return res.status(200).json({ 
      success: true, 
      message: `Successfully synced ${links.length} routes to lib/routes.json!` 
    });

  } catch (error) {
    console.error("Sync error:", error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
}