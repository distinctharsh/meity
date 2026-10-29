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

/**
 * Detect actual file type from file signature (magic bytes).
 * Do NOT rely only on extension or Content-Type.
 */
async function detectFileType(filePath) {
  const fd = await fs.promises.open(filePath, 'r');

  try {
    // Read enough bytes for the formats we support
    const buffer = Buffer.alloc(16);

    const { bytesRead } = await fd.read(
      buffer,
      0,
      buffer.length,
      0
    );

    const data = buffer.subarray(0, bytesRead);

    // ==========================================
    // PDF
    // Signature: %PDF-
    // ==========================================
    if (
      data.length >= 5 &&
      data.subarray(0, 5).toString() === '%PDF-'
    ) {
      return 'pdf';
    }

    // ==========================================
    // JPEG / JPG
    // Signature: FF D8 FF
    // ==========================================
    if (
      data.length >= 3 &&
      data[0] === 0xff &&
      data[1] === 0xd8 &&
      data[2] === 0xff
    ) {
      return 'jpeg';
    }

    // ==========================================
    // PNG
    // Signature:
    // 89 50 4E 47 0D 0A 1A 0A
    // ==========================================
    if (
      data.length >= 8 &&
      data.subarray(0, 8).equals(
        Buffer.from([
          0x89,
          0x50,
          0x4e,
          0x47,
          0x0d,
          0x0a,
          0x1a,
          0x0a,
        ])
      )
    ) {
      return 'png';
    }

    // ==========================================
    // WEBP
    // RIFF + WEBP
    // Bytes 0-3: RIFF
    // Bytes 8-11: WEBP
    // ==========================================
    if (
      data.length >= 12 &&
      data.subarray(0, 4).toString() === 'RIFF' &&
      data.subarray(8, 12).toString() === 'WEBP'
    ) {
      return 'webp';
    }

    return null;
  } finally {
    await fd.close();
  }
}

export default async function handler(req, res) {
  // ==========================================
  // ONLY POST
  // ==========================================
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  // ==========================================
  // FORMIDABLE
  // ==========================================
  const form = new IncomingForm({
    multiples: false,

    // Keep extension temporarily.
    // We still validate it ourselves below.
    keepExtensions: true,

    // Maximum upload size: 10 MB
    maxFileSize: 50 * 1024 * 1024,
  });

  let tempPath = null;

  try {
    const { fields, files } = await new Promise(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fields,
              files,
            });
          }
        });
      }
    );

    // ==========================================
    // GET UPLOADED FILE
    // ==========================================
    const file =
      files.file ||
      files.upload ||
      files.image ||
      null;

    if (!file) {
      return res.status(400).json({
        error: 'No file uploaded',
      });
    }

    const f = Array.isArray(file)
      ? file[0]
      : file;

    tempPath = f.filepath || f.path;

    if (!tempPath || !fs.existsSync(tempPath)) {
      return res.status(400).json({
        error: 'Uploaded file could not be found',
      });
    }

    // ==========================================
    // ORIGINAL FILENAME
    // ==========================================
    const origName =
      f.originalFilename ||
      f.name ||
      'upload';

    const ext = path
      .extname(origName)
      .toLowerCase();

    // ==========================================
    // ALLOWED EXTENSIONS
    // ==========================================
    const allowedExtensions = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
    ];

    if (!allowedExtensions.includes(ext)) {
      await fs.promises.unlink(tempPath).catch(() => {});

      return res.status(400).json({
        error:
          'Invalid file extension. Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.',
      });
    }

    // ==========================================
    // ALLOWED MIME TYPES
    // NOTE:
    // MIME TYPE IS NOT TRUSTED.
    // It is only an additional check.
    // ==========================================
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    const mimeType = f.mimetype
      ? f.mimetype.toLowerCase()
      : '';

    if (!allowedMimeTypes.includes(mimeType)) {
      await fs.promises.unlink(tempPath).catch(() => {});

      return res.status(400).json({
        error:
          'Invalid MIME type. Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.',
      });
    }

    // ==========================================
    // ACTUAL FILE CONTENT VALIDATION
    // MAGIC BYTES
    // ==========================================
    const detectedType =
      await detectFileType(tempPath);

    if (!detectedType) {
      await fs.promises.unlink(tempPath).catch(() => {});

      return res.status(400).json({
        error:
          'Invalid file content. Only valid PDF, JPG, JPEG, PNG, and WEBP files are allowed.',
      });
    }

    // ==========================================
    // ENSURE EXTENSION MATCHES ACTUAL CONTENT
    // ==========================================
    const extensionMatches =
      (detectedType === 'pdf' &&
        ext === '.pdf') ||

      (detectedType === 'jpeg' &&
        (ext === '.jpg' ||
          ext === '.jpeg')) ||

      (detectedType === 'png' &&
        ext === '.png') ||

      (detectedType === 'webp' &&
        ext === '.webp');

    if (!extensionMatches) {
      await fs.promises.unlink(tempPath).catch(() => {});

      return res.status(400).json({
        error:
          'File content does not match the file extension.',
      });
    }

    // ==========================================
    // ENSURE MIME TYPE MATCHES ACTUAL CONTENT
    // ==========================================
    const mimeMatches =
      (detectedType === 'pdf' &&
        mimeType === 'application/pdf') ||

      (detectedType === 'jpeg' &&
        (mimeType === 'image/jpeg' ||
          mimeType === 'image/jpg')) ||

      (detectedType === 'png' &&
        mimeType === 'image/png') ||

      (detectedType === 'webp' &&
        mimeType === 'image/webp');

    if (!mimeMatches) {
      await fs.promises.unlink(tempPath).catch(() => {});

      return res.status(400).json({
        error:
          'File content does not match the MIME type.',
      });
    }

    // ==========================================
    // TYPE DIRECTORY
    // ==========================================
    const type =
      Array.isArray(fields.type)
        ? fields.type[0]
        : fields.type || 'general';

    /*
     * IMPORTANT:
     * Do not allow arbitrary path characters from
     * the client to become part of uploadDir.
     *
     * Keep this allowlist synchronized with the
     * directories your application actually needs.
     */
    const safeType =
      String(type).replace(/[^a-zA-Z0-9_-]/g, '');

    if (!safeType) {
      await fs.promises.unlink(tempPath).catch(() => {});

      return res.status(400).json({
        error: 'Invalid upload type.',
      });
    }

    // ==========================================
    // CREATE UPLOAD DIRECTORY
    // ==========================================
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      safeType
    );

    ensureDirSync(uploadDir);

    // ==========================================
    // SERVER-GENERATED FILE NAME
    // NEVER TRUST ORIGINAL FILENAME
    // ==========================================
    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${ext}`;

    const destPath = path.join(
      uploadDir,
      fileName
    );

    // ==========================================
    // COPY ONLY AFTER ALL VALIDATION
    // ==========================================
    await fs.promises.copyFile(
      tempPath,
      destPath
    );

    // ==========================================
    // DELETE TEMPORARY FILE
    // ==========================================
    await fs.promises
      .unlink(tempPath)
      .catch(() => {});

    tempPath = null;

    // ==========================================
    // RESPONSE
    // ==========================================
    const publicUrl =
      `/uploads/${safeType}/${fileName}`;

    const fileSize = f.size || 0;

    const fileSizeKB =
      (fileSize / 1024).toFixed(1);

    const fileSizeDisplay =
      fileSizeKB < 1024
        ? `${fileSizeKB} KB`
        : `${(
            fileSizeKB / 1024
          ).toFixed(1)} MB`;

    return res.status(200).json({
      filePath: publicUrl,
      fileSize: fileSizeDisplay,
      location: publicUrl,
      url: publicUrl,
    });

  } catch (err) {

    console.error('Upload error:', err);

    // ==========================================
    // CLEAN TEMP FILE ON ERROR
    // ==========================================
    if (
      tempPath &&
      fs.existsSync(tempPath)
    ) {
      await fs.promises
        .unlink(tempPath)
        .catch(() => {});
    }

    // Formidable uses errors such as
    // maxFileSize exceeded.
    if (
      err &&
      (
        err.code === 'LIMIT_FILE_SIZE' ||
        err.httpCode === 413
      )
    ) {
      return res.status(413).json({
        error:
          'File exceeds the maximum allowed size of 10 MB.',
      });
    }

    return res.status(500).json({
      error: 'Upload failed',
    });
  }
}