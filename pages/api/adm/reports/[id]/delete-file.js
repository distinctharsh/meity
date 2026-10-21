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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { file_url } = req.body || {};
    
    if (!file_url) {
      return res.status(400).json({ message: 'File URL is required' });
    }

    // Delete physical file
    let physicalFileDeleted = false;
    try {
      let rel = file_url.startsWith('/') ? file_url.slice(1) : file_url;
      const projectRoot = process.cwd();
      const localPath = path.join(projectRoot, 'public', rel);
      
      if (fs.existsSync(localPath)) {
        try {
          // Try standard unlink first
          try {
            fs.unlinkSync(localPath);
            physicalFileDeleted = true;
          } catch (unlinkError) {
            console.error('❌ fs.unlinkSync failed:', unlinkError);
            
            // Fallback to PowerShell for Windows
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
        }
      } else {
        const alternativePaths = [
          path.join(projectRoot, 'public', file_url), // with leading slash
          path.join(projectRoot, file_url), // directly from project root
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
    } catch (e) {
      console.error('❌ Failed to delete physical file:', e);
    }

    return res.status(200).json({ 
      message: 'File deleted successfully',
      physicalFileDeleted: physicalFileDeleted
    });
  } catch (e) {
    console.error('Delete file error', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}