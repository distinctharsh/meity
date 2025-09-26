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

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  ensureDirSync(uploadDir);

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

    // In formidable v3, file.filepath and file.originalFilename
    const tempPath = f.filepath || f.path;
    const origName = f.originalFilename || f.name || 'upload';
    const ext = path.extname(origName) || '.bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const destPath = path.join(uploadDir, fileName);

    await fs.promises.copyFile(tempPath, destPath);

    const publicUrl = `/uploads/${fileName}`;

    // TinyMCE expects { location: 'url' }
    return res.status(200).json({ location: publicUrl, url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
