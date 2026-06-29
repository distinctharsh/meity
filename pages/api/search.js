import pool from "@/lib/db";

export default async function handler(req, res) {
  try {

   const q = req.query.q || "";

if (!q.trim()) {
  return res.status(200).json([]);
}

const keyword = `%${q.trim()}%`;

      // REPORTS
      const [reportGroups] = await pool.query(
      `
      SELECT
        r.id,
        r.title,
        r.type,
        r.year,
        r.item_count,
        r.size AS file_size,
        r.file_url,
        r.created_at,
        (
          SELECT COUNT(*)
          FROM report_files rf
          WHERE rf.report_id = r.id
            AND rf.is_archived = FALSE
        ) AS files_count,

        'report_group' AS source
      FROM reports r
      WHERE
        r.title LIKE ?
        OR r.type LIKE ?

      ORDER BY r.year DESC, r.created_at DESC
      `,
      [keyword, keyword]
    );

    const [reportFiles] = await pool.query(
      `
      SELECT
        rf.id,
        rf.original_name AS title,
        rf.file_url,
        rf.is_archived,
        r.type,
        r.year,
        r.created_at,
        NULL AS files_count,
        'report_file' AS source
      FROM report_files rf
      INNER JOIN reports r
        ON r.id = rf.report_id
      WHERE
        rf.original_name LIKE ?
      ORDER BY r.year DESC, r.created_at DESC
      `,
      [keyword]
    );

    // VACANCIES / TENDERS
    const [vacancies] = await pool.query(
      `
      SELECT
        id,
        title,
        type,
        description,
        tender_id,
        published_date,
        due_date,
        file_name AS file_url,
        file_size,
        created_at,
        'vacancies_tenders' AS source
      FROM vacancies_tenders
      WHERE
        title LIKE ?
        OR description LIKE ?
        OR tender_id LIKE ?
      `,
      [keyword, keyword, keyword]
    );

    const finalData = [
      ...reportFiles,   // file matches first
      ...reportGroups,  // then groups
      ...vacancies
    ];

    return res.status(200).json(finalData);

  } catch (error) {

    console.error("SEARCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Search Failed",
      error: error.message
    });

  }
}