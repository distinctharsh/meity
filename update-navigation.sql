-- Update Navigation: Replace 'Schemes' with separate 'Vacancies' and 'Tenders'
-- This script updates the navigation_items table

-- Update the existing 'Schemes' navigation item to 'Vacancies'
UPDATE navigation_items 
SET name = 'Vacancies', 
    link = '/offerings/vacancies',
    updated_at = NOW()
WHERE id = 10 AND name = 'Schemes';

-- Add new 'Tenders' navigation item
INSERT INTO navigation_items (name, link, parent_id, display_order, is_active, created_at, updated_at)
VALUES ('Tenders', '/offerings/tenders', 3, 2, 1, NOW(), NOW());

-- Verify the updates
SELECT * FROM navigation_items WHERE id = 10 OR name = 'Tenders';
