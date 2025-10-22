import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS directory_entries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      tags_json TEXT NULL,
      phones_json TEXT NULL,
      emails_json TEXT NULL,
      address TEXT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

function safeParse(s) { try { return s ? JSON.parse(s) : []; } catch { return []; } }
function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string") return v.split(",").map(x => x.trim()).filter(Boolean);
  return [];
}

export default async function handler(req, res) {
  try { await ensureTable(); } catch (e) { console.error("ensureTable directory", e); }

  if (req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM directory_entries ORDER BY display_order ASC, id ASC");
      const parsed = rows.map(r => ({
        ...r,
        tags: safeParse(r.tags_json),
        phones: safeParse(r.phones_json),
        emails: safeParse(r.emails_json),
      }));
      return res.status(200).json(parsed);
    } catch (e) {
      console.error("directory list error", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { role = "", name = "", tags = [], phones = [], emails = [], address = "", display_order, is_active = true } = req.body || {};
      if (!role || !name) return res.status(400).json({ message: "role and name are required" });

      let order = display_order;
      if (order == null || order === "") {
        const [r] = await pool.query("SELECT COALESCE(MAX(display_order), -1) AS maxo FROM directory_entries");
        order = (r?.[0]?.maxo ?? -1) + 1;
      }

      const [ins] = await pool.query(
        "INSERT INTO directory_entries (role, name, tags_json, phones_json, emails_json, address, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          role.trim(),
          name.trim(),
          JSON.stringify(toArray(tags)),
          JSON.stringify(toArray(phones)),
          JSON.stringify(toArray(emails)),
          address,
          order,
          !!is_active,
        ]
      );
      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error("directory create error", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
