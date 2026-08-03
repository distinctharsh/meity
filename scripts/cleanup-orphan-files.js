// Script to clean up orphaned files in report_document folder
// Run this script to remove files that are no longer referenced in the database

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function cleanupOrphanFiles() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'cabsec_cms'
  });

  try {
    console.log('Starting orphan file cleanup...');

    // Get all file URLs from database
    const [files] = await connection.query('SELECT file_url FROM report_files');
    const dbFileUrls = new Set(files.map(f => f.file_url));

    console.log(`Found ${dbFileUrls.size} files in database`);

    // Scan report_document folder
    const reportDocPath = path.join(__dirname, '..', 'public', 'report_document');
    
    if (!fs.existsSync(reportDocPath)) {
      console.log('report_document folder not found');
      return;
    }

    const getAllFiles = (dir, fileList = []) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    };

    const allPhysicalFiles = getAllFiles(reportDocPath);
    console.log(`Found ${allPhysicalFiles.length} physical files in report_document`);

    let deletedCount = 0;
    let keptCount = 0;

    for (const physicalFile of allPhysicalFiles) {
      // Convert physical path to URL format
      const relativePath = path.relative(path.join(__dirname, '..', 'public'), physicalFile);
      const fileUrl = '/' + relativePath.replace(/\\/g, '/');
      
      // Check if this file exists in database
      if (!dbFileUrls.has(fileUrl)) {
        try {
          fs.unlinkSync(physicalFile);
          console.log(`Deleted orphan file: ${fileUrl}`);
          deletedCount++;
        } catch (e) {
          console.error(`Failed to delete ${fileUrl}:`, e.message);
        }
      } else {
        keptCount++;
      }
    }

    console.log(`\nCleanup complete:`);
    console.log(`- Deleted ${deletedCount} orphan files`);
    console.log(`- Kept ${keptCount} referenced files`);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await connection.end();
  }
}

cleanupOrphanFiles();