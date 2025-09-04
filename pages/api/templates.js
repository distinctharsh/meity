import pool from "@/lib/db";    

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const [rows] = await pool.query("SELECT * FROM templates");
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}