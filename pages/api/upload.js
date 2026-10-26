import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file || files.upload || files.image || null;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const f = Array.isArray(file) ? file[0] : file;
    const tempPath = f.filepath || f.path;
    const origName = f.originalFilename || f.name || 'upload';
    
    // ==========================================
    // 1. FILE TYPE VALIDATION (PDF, JPG, JPEG, PNG, WEBP)
    // ==========================================
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(origName).toLowerCase();

    const isValidMime = f.mimetype && allowedMimeTypes.includes(f.mimetype);
    const isValidExt = allowedExtensions.includes(ext);

    if (!isValidMime || !isValidExt) {
      // Agar file invalid hai, toh formidable ki temporary file ko delete kar dein
      if (tempPath && fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath).catch(() => {});
      }
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.' 
      });
    }
    // ==========================================

    const type = fields.type ? fields.type[0] : 'general';

    // Create type-specific directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    ensureDirSync(uploadDir);

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const destPath = path.join(uploadDir, fileName);

    await fs.promises.copyFile(tempPath, destPath);

    // Optional: Clean up temp file after copying
    await fs.promises.unlink(tempPath).catch(() => {});

    const publicUrl = `/uploads/${type}/${fileName}`;
    const fileSize = f.size || 0;
    const fileSizeKB = (fileSize / 1024).toFixed(1);
    const fileSizeDisplay = fileSizeKB < 1024 ? `${fileSizeKB} KB` : `${(fileSizeKB / 1024).toFixed(1)} MB`;

    // Return proper format for our form
    return res.status(200).json({ 
      filePath: publicUrl, 
      fileSize: fileSizeDisplay,
      location: publicUrl, // For TinyMCE compatibility
      url: publicUrl 
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}