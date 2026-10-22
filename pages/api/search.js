import pool from "@/lib/db";
const MAX_QUERY_LENGTH = 100;
const RESULT_LIMIT = 20;

function escapeLike(value) {
  return value.replace(/[!%_]/g, "!$&");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const rawQuery = req.query.q;

  if (typeof rawQuery !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid search query",
    });
  }

  const q = rawQuery.trim();

  if (!q) return res.status(200).json([]);

  if (
    q.length > MAX_QUERY_LENGTH ||
    /[\u0000-\u001F\u007F]/.test(q)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid search query",
    });
  }

  const keyword = `%${escapeLike(q)}%`;

  try {
    const [reportGroups, reportFiles, vacancies] =
      await Promise.all([
        pool.execute(
          `
          SELECT
            r.id, r.title, r.type, r.year,
            r.item_count, r.size AS file_size,
            r.file_url, r.created_at, r.is_active,
            (
              SELECT COUNT(*)
              FROM report_files rf
              WHERE rf.report_id = r.id
                AND rf.is_active != 0
            ) AS files_count,
            'report_group' AS source
          FROM reports r
          WHERE r.is_active != 0
            AND (
              r.title LIKE ? ESCAPE '!'
              OR r.type LIKE ? ESCAPE '!'
            )
          ORDER BY r.year DESC, r.created_at DESC
          LIMIT ${RESULT_LIMIT}
          `,
          [keyword, keyword]
        ),

        pool.execute(
          `
          SELECT
            rf.id,
            rf.original_name AS title,
            rf.file_url,
            rf.is_active,
            r.type, r.year, r.created_at,
            NULL AS files_count,
            'report_file' AS source
          FROM report_files rf
          INNER JOIN reports r ON r.id = rf.report_id
          WHERE rf.is_active != 0
            AND r.is_active != 0
            AND rf.original_name LIKE ? ESCAPE '!'
          ORDER BY r.year DESC, r.created_at DESC
          LIMIT ${RESULT_LIMIT}
          `,
          [keyword]
        ),

        pool.execute(
          `
          SELECT
            id, title, type, description, tender_id,
            published_date, due_date,
            file_name AS file_url, file_size, created_at,
            'vacancies_tenders' AS source
          FROM vacancies_tenders
          WHERE title LIKE ? ESCAPE '!'
            OR description LIKE ? ESCAPE '!'
            OR tender_id LIKE ? ESCAPE '!'
          ORDER BY created_at DESC
          LIMIT ${RESULT_LIMIT}
          `,
          [keyword, keyword, keyword]
        ),
      ]);

    const finalData = [
      ...reportFiles[0],
      ...reportGroups[0],
      ...vacancies[0],
    ];

    return res.status(200).json(finalData);

  } catch (error) {
    console.error("Search database error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed. Please try again later.",
    });
  }
}