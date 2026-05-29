SELECT
    ncm.category_id AS report_id,
    -- Har report_id ke liye koi bhi ek naam (jaise sabse bada/latest naam) pick karne ke liye MAX use kiya hai
    MAX(n.name) AS original_name
FROM db_cabsec.notifications n
JOIN db_cabsec.notifications_category_master ncm
    ON n.category = ncm.category_id
WHERE ncm.category_id IN (
    SELECT DISTINCT category_id
    FROM db_cabsec.dyn_menu
    WHERE link_url = 'page.php'
      AND category_id IS NOT NULL
      AND languages = 1
)
AND n.active <> 0
AND n.attachment IS NOT NULL
AND n.attachment <> ''
-- Isse saare duplicate report_id merge ho jayenge aur ek hi bachega
GROUP BY ncm.category_id;