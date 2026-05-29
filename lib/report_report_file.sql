USE db_cabsec;

Step 1: Create the report_files table

CREATE TABLE report_files (
  id INT NOT NULL AUTO_INCREMENT,
  report_id INT NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  file_url VARCHAR(1000) NOT NULL,
  file_type VARCHAR(100) DEFAULT NULL,
  file_size VARCHAR(225) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  publish_date DATE DEFAULT NULL,
  PRIMARY KEY (id)
);

Step 2: Insert data into report_files table

INSERT INTO db_cabsec.report_files
(
    report_id,
    original_name,
    file_url,
    file_type,
    file_size,
    created_at,
    publish_date
)
SELECT
    ncm.category_id AS report_id,
    -- File Name
    n.name AS original_name,
    -- Full Attachment Path
    CONCAT(
        '/report_document/',
        ncm.foldername,
        '/',
        n.attachment
    ) AS file_url,
    -- File Type
    'application/pdf' AS file_type,
    -- File Size (safe numeric conversion)
      n.filesize AS file_size,
    -- Created Time
    NOW() AS created_at,
    -- Publish Date
    n.activated_on AS publish_date
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
AND n.attachment <> '';

USE db_cabsec;

Step 3: Create the reports table

CREATE TABLE `reports` (
  `id` int DEFAULT NULL,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('pdf','group','link') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pdf',
  `year` int DEFAULT NULL,
  `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nav_item_id` int DEFAULT NULL,
  `item_count` int DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
);

Step 4: Insert data into reports table

INSERT INTO reports
(
    id,
    title,
    type,
    nav_item_id,
    item_count,
    display_order,
    is_active,
    is_archived,
    created_at,
    updated_at
)
SELECT DISTINCT
    dm.category_id AS id,
    dm.label AS title,
    'group' AS type,
    0 AS nav_item_id,
    0 AS item_count,
    0 AS display_order,
    1 AS is_active,
    0 AS is_archived,
    NOW() AS created_at,
    NOW() AS updated_at
FROM db_cabsec.dyn_menu dm
WHERE dm.link_url = 'page.php'
  AND dm.category_id IS NOT NULL
  AND dm.languages = 1
  AND NOT EXISTS (
        SELECT 1
        FROM reports r
        WHERE r.nav_item_id = dm.category_id
  );

 Step 5: Create the vacancies_tenders table

  CREATE TABLE `vacancies_tenders` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255),
    `description` TEXT,
    `tender_id` VARCHAR(50),
    `published_date` DATE,
    `due_date` DATE,
    `file_name` VARCHAR(255),
    `file_size` VARCHAR(255),
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_archived` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

Step 6: Insert data into reports table

INSERT INTO vacancies_tenders
(
    title,
    type,
    description,
    tender_id,
    published_date,
    due_date,
    file_name,
    file_size,
    is_active,
    is_archived,
    created_at,
    updated_at
)
SELECT
    n.name AS title,
    -- Type
    ncm.category_name AS type,
    -- Description
    n.description AS description,
    -- Tender ID
     ncm.category_id AS tender_id,
    -- Published Date
    DATE(n.activated_on) AS published_date,
    -- Due Date
    NULL AS due_date,
    -- File Name
       CONCAT(
            '/report_document/',
            ncm.foldername,
            '/',
            n.attachment
        ) AS  file_name,
    -- File Size
     n.filesize  AS file_size,
    -- Active Status
     ncm.active AS is_active,
    -- Archived Status
     1 AS is_archived,
    -- Created At
     NOW() AS created_at,
    -- Updated At
    NOW() AS updated_at
FROM db_cabsec.notifications n
JOIN db_cabsec.notifications_category_master ncm
    ON n.category = ncm.category_id
WHERE ncm.category_id IN (
    SELECT DISTINCT category_id
    FROM db_cabsec.dyn_menu
    WHERE category_id IN (22,26)
      AND languages = 1
)
AND n.active <> 0
AND n.attachment IS NOT NULL
AND n.attachment <> '';


Step 5: Create the rti_items table

CREATE TABLE rti_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    title VARCHAR(500),
    file_url VARCHAR(1000),
    file_size VARCHAR(50),
    file_type VARCHAR(100),
    display_order INT,
    is_active TINYINT(1),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


Step 6: Insert data into rti_items table

INSERT INTO rti_items
(
    title,
    section_id,
    file_url,
    file_size,
    file_type,
    display_order,
    is_active,
    created_at,
    updated_at
)
SELECT
    n.name AS title,

    -- section_id
    ncm.category_id AS section_id,

    -- File URL
    CONCAT(
        '/report_document/',
        ncm.foldername,
        '/',
        n.attachment
    ) AS file_url,

    -- File Size
    n.filesize AS file_size,

    -- File Type
    'PDF' AS file_type,

    -- Display Order
    0 AS display_order,

    -- Active Status
    1 AS is_active,

    -- Created At
    NOW() AS created_at,

    -- Updated At
    NOW() AS updated_at

FROM db_cabsec.notifications n

JOIN db_cabsec.notifications_category_master ncm
    ON n.category = ncm.category_id

WHERE ncm.category_id IN (
    SELECT DISTINCT category_id
    FROM db_cabsec.dyn_menu
    WHERE category_id IN (44,45,46,0,47,48,49,36,85,89,152)
      AND languages = 1
)

AND n.active <> 0
AND n.attachment IS NOT NULL
AND n.attachment <> '';