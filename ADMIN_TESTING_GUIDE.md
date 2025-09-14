# Admin Panel Testing Guide

## Issues Fixed

### 1. Deactivate/Activate Functionality
**Problem**: Toggle active/deactivate button was not working
**Solution**: 
- Created dedicated API endpoint `/api/admin/announcements/toggle-status`
- Simplified the toggle logic to only update the `is_active` field
- Added proper error handling and success messages

### 2. Edit Functionality Internal Server Error
**Problem**: Edit announcements was showing "Internal server error"
**Solution**:
- Added proper validation in API route
- Improved error handling with detailed error messages
- Added debugging utilities for better troubleshooting

## Testing Steps

### Test 1: Create New Announcement
1. Go to `/admin/announcements`
2. Click "Add New Announcement"
3. Fill in required fields:
   - Title: "Test Announcement"
   - Content: "This is a test announcement"
4. Click "Create Announcement"
5. **Expected**: Success message and announcement appears in list

### Test 2: Edit Existing Announcement
1. Find an existing announcement in the list
2. Click "Edit" button
3. Modify the title or content
4. Click "Update Announcement"
5. **Expected**: Success message and changes reflected in list

### Test 3: Toggle Active/Deactivate
1. Find an active announcement (green "ACTIVE" badge)
2. Click "Deactivate" button
3. **Expected**: 
   - Success message: "Announcement deactivated successfully!"
   - Badge changes to gray "INACTIVE"
   - Button text changes to "Activate"
4. Click "Activate" button
5. **Expected**:
   - Success message: "Announcement activated successfully!"
   - Badge changes to green "ACTIVE"
   - Button text changes to "Deactivate"

### Test 4: Delete Announcement
1. Find an announcement to delete
2. Click "Delete" button
3. Confirm deletion in the popup
4. **Expected**: Announcement removed from list

### Test 5: Real-time Updates on Website
1. Create or edit an announcement in admin panel
2. Go to homepage (`/`)
3. **Expected**: Changes visible in announcement bar within 30 seconds

## Debugging Information

### Console Logs
When testing, check browser console for:
- Form data being submitted
- API request/response details
- Any error messages

### Common Issues and Solutions

#### Issue: "Internal server error" on edit
**Check**:
1. Database connection is working
2. All required fields are filled
3. Check browser console for detailed error

#### Issue: Toggle not working
**Check**:
1. API endpoint `/api/admin/announcements/toggle-status` is accessible
2. Check network tab in browser dev tools
3. Verify database has `updated_at` column

#### Issue: Changes not visible on website
**Check**:
1. Announcement is marked as "ACTIVE"
2. Check if auto-refresh is working (30-second interval)
3. Clear browser cache if needed

## API Endpoints

### GET `/api/admin/announcements`
- Fetches all announcements
- Returns array of announcement objects

### POST `/api/admin/announcements`
- Creates new announcement
- Requires: title, content
- Optional: link_url, link_text, is_urgent, is_active, start_date, end_date, display_order

### PUT `/api/admin/announcements/[id]`
- Updates existing announcement
- Requires: title, content
- Optional: all other fields

### PUT `/api/admin/announcements/toggle-status`
- Toggles announcement active status
- Requires: id, is_active (boolean)

### DELETE `/api/admin/announcements/[id]`
- Deletes announcement
- Requires: id

## Database Schema

```sql
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link_url VARCHAR(500),
    link_text VARCHAR(100),
    is_urgent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Success Criteria

✅ Create announcement works  
✅ Edit announcement works  
✅ Toggle active/deactivate works  
✅ Delete announcement works  
✅ Changes appear on website within 30 seconds  
✅ No "Internal server error" messages  
✅ Proper success/error messages shown to user  
