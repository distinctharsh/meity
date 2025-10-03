import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { IncomingForm } from 'formidable';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

const unlink = promisify(fs.unlink);

function ensureUploadsDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isSafePath(targetPath, baseDir) {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(targetPath);
  return resolvedTarget.startsWith(resolvedBase);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const uploadBase = path.join(process.cwd(), 'public', 'uploads', 'slider');
  ensureUploadsDirSync(uploadBase);
  const tempBase = path.join(process.cwd(), 'tmp', 'formidable');
  ensureUploadsDirSync(tempBase);

  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    uploadDir: tempBase,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Upload parse error:', err);
      return res.status(400).json({ message: 'Invalid form data' });
    }

    // Accept any single file field name
    let file = files.file || files.image || files.upload;
    if (!file) {
      const values = Object.values(files || {});
      if (values.length > 0) file = values[0];
    }
    if (Array.isArray(file)) {
      file = file[0];
    }
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const originalName = Array.isArray(file.originalFilename) ? file.originalFilename[0] : file.originalFilename;
      const tempPath = Array.isArray(file.filepath) ? file.filepath[0] : file.filepath;
      if (!tempPath || !fs.existsSync(tempPath)) {
        return res.status(500).json({ message: 'Temporary file not found' });
      }
      const ext = path.extname(originalName || '').toLowerCase() || '.jpg';
      const baseName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
      const destPath = path.join(uploadBase, baseName);

      // Copy then remove temp to avoid cross-device rename issues
      await fs.promises.copyFile(tempPath, destPath);
      try { await unlink(tempPath); } catch (_) {}

      // Optionally delete old file if provided and safe
      const oldPathField = fields.old_path;
      if (oldPathField) {
        const oldPath = Array.isArray(oldPathField) ? oldPathField[0] : oldPathField;
        const absoluteOld = path.join(process.cwd(), oldPath.startsWith('/') ? oldPath.slice(1) : oldPath);
        if (isSafePath(absoluteOld, uploadBase) && fs.existsSync(absoluteOld)) {
          try { await unlink(absoluteOld); } catch (e) { /* ignore */ }
        }
      }

      const publicUrl = `/uploads/slider/${baseName}`;
      return res.status(200).json({ url: publicUrl, path: `public${publicUrl}` });
    } catch (e) {
      console.error('Upload save error:', e);
      return res.status(500).json({ message: 'Failed to save file' });
    }
  });
}
