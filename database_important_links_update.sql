-- Database schema update for important_links table to support file uploads
-- Run this query to add file support to your existing important_links table

-- Add file_path column to store uploaded file paths
ALTER TABLE `important_links` 
ADD COLUMN `file_path` VARCHAR(500) NULL AFTER `url`;

-- Add link_type column to distinguish between URL and file links
ALTER TABLE `important_links` 
ADD COLUMN `link_type` ENUM('url', 'file') NOT NULL DEFAULT 'url' AFTER `file_path`;

-- Update existing records to set link_type based on whether they have a URL
UPDATE `important_links` 
SET `link_type` = 'url' 
WHERE `url` IS NOT NULL AND `url` != '';

-- Make URL column nullable since we'll use either URL or file_path
ALTER TABLE `important_links` 
MODIFY COLUMN `url` VARCHAR(500) NULL;

-- Add index for better performance
ALTER TABLE `important_links` 
ADD INDEX `idx_link_type` (`link_type`);

-- Updated table structure will be:
CREATE TABLE `important_links` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`url` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`file_path` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`link_type` ENUM('url', 'file') NOT NULL DEFAULT 'url',
	`display_order` INT(11) NULL DEFAULT '0',
	`is_active` TINYINT(1) NULL DEFAULT '1',
	`created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`updated_at` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `idx_link_type` (`link_type`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;
