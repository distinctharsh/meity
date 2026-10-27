import pool from "@/lib/db";

function safeParse(s) { 
  try { return s ? JSON.parse(s) : []; } catch { return []; } 
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM directory_entries WHERE is_active = 1 ORDER BY display_order ASC, id ASC"
    );
    
    const parsed = rows.map(r => ({
      ...r,
      tags: safeParse(r.tags_json),
      phones: safeParse(r.phones_json),
      emails: safeParse(r.emails_json),
    }));

    return res.status(200).json(parsed || []);
  } catch (error) {
    console.error("Directory public API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}