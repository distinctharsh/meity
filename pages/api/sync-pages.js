import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 3306
};

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Database ke 'pages' table se saare active pages fetch karein
    const [rows] = await connection.execute(
      'SELECT slug, title, json_content FROM pages WHERE is_active = 1'
    );

    // Slug ko key banakar ek clean JSON object taiyar karein
    const pagesMap = {};
    rows.forEach(row => {
      pagesMap[row.slug] = {
        title: row.title,
        content: row.json_content // Yahan HTML/JSON content hai jo admin panel se aata hai
      };
    });

    // File ko lib folder ke andar save kar dein
    const pagesJsonPath = path.join(process.cwd(), 'lib', 'pages-content.json');
    fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesMap, null, 2), 'utf8');

    return res.status(200).json({ 
      success: true, 
      message: "Successfully synced pages-content.json from database!" 
    });

  } catch (error) {
    console.error("Pages Sync error:", error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
}