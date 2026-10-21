import { NextApiRequest, NextApiResponse } from 'next';
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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'important-links');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Simple approach: use formidable-like parsing
    const chunks = [];
    let boundary = null;
    
    // Get boundary from content-type
    const contentType = req.headers['content-type'];
    if (contentType && contentType.includes('boundary=')) {
      boundary = contentType.split('boundary=')[1];
    }

    if (!boundary) {
      return res.status(400).json({ message: 'No boundary found in request' });
    }

    // Collect all data chunks
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const data = buffer.toString('binary');
    const parts = data.split(`--${boundary}`);

    let fileData = null;
    let fileName = null;
    let mimeType = null;

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data') && part.includes('name="file"')) {
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          fileName = filenameMatch[1];
        }

        // Extract content type
        const contentTypeMatch = part.match(/Content-Type:\s*(.+)/);
        if (contentTypeMatch) {
          mimeType = contentTypeMatch[1].trim();
        }

        // Find the start of file data (after \r\n\r\n)
        const dataIndex = part.indexOf('\r\n\r\n');
        if (dataIndex !== -1) {
          // Remove the trailing \r\n--boundary
          let fileContent = part.substring(dataIndex + 4);
          const endIndex = fileContent.lastIndexOf('\r\n');
          if (endIndex > 0) {
            fileContent = fileContent.substring(0, endIndex);
          }
          fileData = fileContent;
        }
        break;
      }
    }

    if (!fileData || !fileName) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({ message: 'Only PDF, DOC, and DOCX files are allowed' });
    }

    // Generate unique filename
    const fileExtension = path.extname(fileName);
    const uniqueId = randomBytes(16).toString('hex');
    const uniqueFileName = `${uniqueId}${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    const relativePath = `/uploads/important-links/${uniqueFileName}`;

    // Write file to disk
    await fs.writeFile(filePath, Buffer.from(fileData, 'binary'));


    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: relativePath,
      fileName: uniqueFileName,
      originalName: fileName
    });

  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({ 
      message: 'Failed to upload file',
      error: error.message 
    });
  }
}
