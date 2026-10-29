import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed',
    });
  }

  let tempBuffer = null;

  try {
    // =====================================================
    // 1. UPLOAD DIRECTORY
    // =====================================================
    const uploadsDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'important-links'
    );

    await fs.mkdir(uploadsDir, {
      recursive: true,
    });

    // =====================================================
    // 2. GET MULTIPART BOUNDARY
    // =====================================================
    const contentType =
      req.headers['content-type'] || '';

    if (
      !contentType.toLowerCase().startsWith(
        'multipart/form-data'
      )
    ) {
      return res.status(400).json({
        message: 'Invalid content type',
      });
    }

    const boundaryMatch =
      contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

    const boundary =
      boundaryMatch?.[1] ||
      boundaryMatch?.[2];

    if (!boundary) {
      return res.status(400).json({
        message: 'No boundary found in request',
      });
    }

    // =====================================================
    // 3. COLLECT REQUEST BODY
    // =====================================================
    const chunks = [];

    let totalSize = 0;

    // Maximum upload size: 10 MB
    const MAX_FILE_SIZE =
      10 * 1024 * 1024;

    for await (const chunk of req) {
      totalSize += chunk.length;

      // Prevent excessively large requests
      if (totalSize > MAX_FILE_SIZE + 1024 * 1024) {
        return res.status(413).json({
          message:
            'File exceeds the maximum allowed size of 10 MB',
        });
      }

      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // =====================================================
    // 4. FIND FILE PART
    // =====================================================
    const boundaryBuffer = Buffer.from(
      `--${boundary}`
    );

    const parts = [];

    let start = 0;

    while (true) {
      const boundaryIndex =
        buffer.indexOf(
          boundaryBuffer,
          start
        );

      if (boundaryIndex === -1) {
        break;
      }

      if (start !== 0) {
        parts.push(
          buffer.subarray(
            start,
            boundaryIndex
          )
        );
      }

      start =
        boundaryIndex +
        boundaryBuffer.length;
    }

    let fileData = null;
    let fileName = null;
    let mimeType = null;

    // =====================================================
    // 5. FIND FILE FIELD
    // =====================================================
    for (const part of parts) {

      const headerEnd =
        part.indexOf(
          Buffer.from('\r\n\r\n')
        );

      if (headerEnd === -1) {
        continue;
      }

      const headers =
        part
          .subarray(0, headerEnd)
          .toString('utf8');

      if (
        !/Content-Disposition:\s*form-data/i.test(
          headers
        )
      ) {
        continue;
      }

      if (
        !/name="file"/i.test(headers)
      ) {
        continue;
      }

      // ===================================================
      // Extract original filename
      // ===================================================
      const filenameMatch =
        headers.match(
          /filename="([^"]*)"/i
        );

      if (filenameMatch) {
        fileName =
          filenameMatch[1];
      }

      // ===================================================
      // Extract client MIME type
      // NOTE: This is NOT trusted.
      // ===================================================
      const contentTypeMatch =
        headers.match(
          /Content-Type:\s*([^\r\n]+)/i
        );

      if (contentTypeMatch) {
        mimeType =
          contentTypeMatch[1]
            .trim()
            .toLowerCase();
      }

      // ===================================================
      // Actual file content
      // ===================================================
      let contentStart =
        headerEnd + 4;

      let contentEnd =
        part.length;

      // Remove trailing CRLF
      if (
        contentEnd >= 2 &&
        part[contentEnd - 2] === 0x0d &&
        part[contentEnd - 1] === 0x0a
      ) {
        contentEnd -= 2;
      }

      fileData =
        part.subarray(
          contentStart,
          contentEnd
        );

      break;
    }

    // =====================================================
    // 6. BASIC VALIDATION
    // =====================================================
    if (
      !fileData ||
      !fileName
    ) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    if (fileData.length === 0) {
      return res.status(400).json({
        message: 'Uploaded file is empty',
      });
    }

    if (
      fileData.length >
      MAX_FILE_SIZE
    ) {
      return res.status(413).json({
        message:
          'File exceeds the maximum allowed size of 10 MB',
      });
    }

    // =====================================================
    // 7. CHECK EXTENSION
    // =====================================================
    const originalExtension =
      path
        .extname(fileName)
        .toLowerCase();

    if (
      originalExtension !== '.pdf'
    ) {
      return res.status(400).json({
        message:
          'Only PDF files are allowed',
      });
    }

    // =====================================================
    // 8. CHECK ACTUAL FILE SIGNATURE
    //
    // PDF files begin with:
    //
    // %PDF-
    //
    // Hex:
    // 25 50 44 46 2D
    // =====================================================
    const isPdf =
      fileData.length >= 5 &&
      fileData
        .subarray(0, 5)
        .toString('ascii') ===
        '%PDF-';

    if (!isPdf) {
      return res.status(400).json({
        message:
          'Invalid PDF file. File content does not match PDF format.',
      });
    }

    // =====================================================
    // 9. OPTIONAL MIME CHECK
    //
    // Client MIME type is NOT trusted, but we can reject
    // an obvious mismatch.
    // =====================================================
    if (
      mimeType &&
      mimeType !== 'application/pdf'
    ) {
      return res.status(400).json({
        message:
          'Invalid MIME type. Only application/pdf is allowed.',
      });
    }

    // =====================================================
    // 10. GENERATE SERVER-SIDE FILENAME
    //
    // NEVER use the supplied filename.
    // =====================================================
    const uniqueId =
      randomBytes(32).toString('hex');

    const uniqueFileName =
      `${uniqueId}.pdf`;

    const filePath =
      path.join(
        uploadsDir,
        uniqueFileName
      );

    const relativePath =
      `/uploads/important-links/${uniqueFileName}`;

    // =====================================================
    // 11. WRITE ONLY AFTER VALIDATION
    // =====================================================
    await fs.writeFile(
      filePath,
      fileData,
      {
        flag: 'wx',
      }
    );

    // =====================================================
    // 12. RESPONSE
    // =====================================================
    return res.status(200).json({
      message:
        'File uploaded successfully',

      filePath:
        relativePath,

      fileName:
        uniqueFileName,

      originalName:
        fileName,
    });

  } catch (error) {

    console.error(
      'Upload error details:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to upload file',
    });
  }
}
