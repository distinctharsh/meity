import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Validate ID
  if (!id || id === null || id === undefined || id === '' || isNaN(Number(id))) {
    console.error('Invalid report ID:', id);
    return res.status(400).json({ message: 'Invalid report ID' });
  }

  if (req.method === 'GET') {
    try {
      // Get all files for this report
      const [rows] = await pool.query(
        'SELECT * FROM report_files WHERE report_id = ? ORDER BY created_at DESC',
        [id]
      );
      return res.status(200).json(rows);
    } catch (e) {
      console.error('Get report files error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { files } = req.body || {};
      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ message: 'No files provided' });
      }

      // Insert new files
      const insertPromises = files.map(file => {
        return pool.query(
          'INSERT INTO report_files (report_id, original_name, file_url, file_type, file_size, publish_date) VALUES (?, ?, ?, ?, ?, ?)',
          [id, file.original_name, file.file_url, file.file_type, file.file_size, file.publish_date || null]
        );
      });

      await Promise.all(insertPromises);
      
      // Update item_count in reports table
      const [countResult] = await pool.query('SELECT COUNT(*) as count FROM report_files WHERE report_id = ?', [id]);
      const newCount = countResult[0]?.count || 0;
      await pool.query('UPDATE reports SET item_count = ? WHERE id = ?', [newCount, id]);

      return res.status(201).json({ message: 'Files added successfully' });
    } catch (e) {
      console.error('Add report files error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { fileId } = req.body || {};
      
      if (!fileId) {
        console.error('File ID missing in request body');
        return res.status(400).json({ message: 'File ID required' });
      }

      // Verify file belongs to this report
      const [fileInfo] = await pool.query('SELECT file_url FROM report_files WHERE id = ? AND report_id = ?', [fileId, id]);
      if (!fileInfo.length) {
        console.error('File not found:', fileId, 'for report:', id);
        return res.status(404).json({ message: 'File not found' });
      }

      // Delete physical file FIRST (before database deletion)
      let physicalFileDeleted = false;
      try {
        const fileUrl = fileInfo[0].file_url;
        if (fileUrl) {
          let rel = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
          const projectRoot = process.cwd();
          const localPath = path.join(projectRoot, 'public', rel);
          
          if (fs.existsSync(localPath)) {
            try {
              // Check file permissions
              try {
                const stats = fs.statSync(localPath);
              } catch (statError) {
                console.error('Error getting file stats:', statError);
              }
              
              // Try standard unlink first
              try {
                fs.unlinkSync(localPath);
                physicalFileDeleted = true;
              } catch (unlinkError) {
                console.error('❌ fs.unlinkSync failed:', unlinkError);
                
                // Fallback to PowerShell/Command Prompt for Windows
                if (process.platform === 'win32') {
                  try {
                    execSync(`powershell -Command "Remove-Item -Path '${localPath}' -Force"`, { stdio: 'inherit' });
                    physicalFileDeleted = true;
                  } catch (cmdError) {
                    console.error('❌ PowerShell Remove-Item also failed:', cmdError);
                  }
                }
              }
            } catch (unlinkError) {
              console.error('❌ Error during file deletion:', unlinkError);
              console.error('Error code:', unlinkError.code);
              console.error('Error message:', unlinkError.message);
            }
          } else {
            const alternativePaths = [
              path.join(projectRoot, 'public', fileUrl), // with leading slash
              path.join(projectRoot, fileUrl), // directly from project root
              path.join(projectRoot, 'public', 'report_document', rel.split('report_document/')[1]), // extract after report_document
            ];
            
            for (const altPath of alternativePaths) {
              if (fs.existsSync(altPath)) {
                try {
                  fs.unlinkSync(altPath);
                  physicalFileDeleted = true;
                  break;
                } catch (unlinkError) {
                  console.error('❌ Error during alternative file unlink:', unlinkError);
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('❌ Failed to delete physical file:', e);
        // Continue with database deletion even if physical file deletion fails
      }

      // Now delete from database
      const [deleteResult] = await pool.query('DELETE FROM report_files WHERE id = ? AND report_id = ?', [fileId, id]);

      // Update item_count in reports table
      const [countResult] = await pool.query('SELECT COUNT(*) as count FROM report_files WHERE report_id = ?', [id]);
      const newCount = countResult[0]?.count || 0;
      await pool.query('UPDATE reports SET item_count = ? WHERE id = ?', [newCount, id]);

      return res.status(200).json({ 
        message: 'File deleted successfully',
        physicalFileDeleted: physicalFileDeleted,
        databaseDeleteSuccess: deleteResult.affectedRows > 0
      });
    } catch (e) {
      console.error('Delete report file error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}