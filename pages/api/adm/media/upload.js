import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '@/lib/db';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'report_document');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow images, PDFs, and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed'));
    }
  }
});

// Accept both single and multiple files (fields 'file' or 'files')
const uploadAny = upload.any();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  uploadAny(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload error' });
    }

    try {
      // Normalize: if single file was sent as 'file', multer.any() still populates req.files
      const files = Array.isArray(req.files) ? req.files : [];
      if (!files.length) {
        return res.status(400).json({ message: 'No files uploaded. Use form field name "file" or "files" with multipart/form-data.' });
      }

      const uploadedFiles = [];

      // Resolve an uploader user id if possible
      let uploaderId = 1;
      try {
        const [urows] = await pool.query('SELECT id FROM cms_users ORDER BY id ASC LIMIT 1');
        if (urows && urows.length) uploaderId = urows[0].id;
      } catch {}

      for (const file of files) {
        const filePath = `/report_document/${file.filename}`;
        
        // Insert file info into database
        const [result] = await pool.query(
          'INSERT INTO media_library (filename, original_name, file_path, file_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
          [
            file.filename,
            file.originalname,
            filePath,
            file.mimetype,
            file.size,
            uploaderId
          ]
        );

        uploadedFiles.push({
          id: result.insertId,
          filename: file.filename,
          original_name: file.originalname,
          file_path: filePath,
          file_type: file.mimetype,
          file_size: file.size
        });
      }

      res.status(201).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Clean up uploaded files on error
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });

      // Helpful DB errors
      if (error && (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW')) {
        return res.status(500).json({ message: 'No admin user found for uploaded_by. Please create an admin user first and try again.' });
      }
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  });
}
