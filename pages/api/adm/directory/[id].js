import pool from "@/lib/db";

function safeParse(s) { try { return s ? JSON.parse(s) : []; } catch { return []; } }
function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string") return v.split(",").map(x => x.trim()).filter(Boolean);
  return [];
}

export default async function handler(req, res) {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ message: "invalid id" });

  if (req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM directory_entries WHERE id = ?", [id]);
      const r = rows?.[0];
      if (!r) return res.status(404).json({ message: "not found" });
      return res.status(200).json({
        ...r,
        tags: safeParse(r.tags_json),
        phones: safeParse(r.phones_json),
        emails: safeParse(r.emails_json),
      });
    } catch (e) {
      console.error("directory get error", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { role, name, tags = [], phones = [], emails = [], address, display_order, is_active } = req.body || {};
      if (!role || !name) return res.status(400).json({ message: "role and name are required" });

      await pool.query(
        "UPDATE directory_entries SET role=?, name=?, tags_json=?, phones_json=?, emails_json=?, address=?, display_order=?, is_active=? WHERE id=?",
        [
          role.trim(),
          name.trim(),
          JSON.stringify(toArray(tags)),
          JSON.stringify(toArray(phones)),
          JSON.stringify(toArray(emails)),
          address ?? null,
          display_order == null || display_order === "" ? 0 : Number(display_order),
          is_active ? 1 : 0,
          id,
        ]
      );
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error("directory update error", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await pool.query("DELETE FROM directory_entries WHERE id = ?", [id]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error("directory delete error", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
