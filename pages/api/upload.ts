import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Formidable v3 uses a factory function
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50 MB per file
  });

  form.parse(req, (err: unknown, fields: any, files: any) => {
    if (err) {
      console.error('Upload error', err);
      return res.status(500).json({ error: 'Error parsing files' });
    }

    const fileList: any[] = [];

    // files could be single or an object of arrays
    if (!files) return res.status(400).json({ error: 'No files uploaded' });

    const entries = Object.values(files) as any[];
    for (const entry of entries) {
      if (Array.isArray(entry)) {
        for (const f of entry) fileList.push(f);
      } else {
        fileList.push(entry);
      }
    }

    const urls: string[] = [];
    for (const f of fileList) {
      try {
        // Get file path from Formidable v3
        const filepath = (f as any).filepath || (f as any).path;
        if (!filepath) {
          console.error('No filepath found in file object');
          continue;
        }

        // Read file content
        const buffer = fs.readFileSync(filepath);
        const base64 = buffer.toString('base64');

        // Determine MIME type from extension or default to jpeg
        const originalFilename = (f as any).originalFilename || (f as any).newFilename || 'file.jpg';
        const ext = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
        const mimeType = MIME_TYPES[ext] || 'image/jpeg';

        // Create data URL with base64
        const dataUrl = `data:${mimeType};base64,${base64}`;
        urls.push(dataUrl);

        // Clean up temp file
        fs.unlinkSync(filepath);
      } catch (e) {
        console.error('Error processing uploaded file entry', e, f);
      }
    }

    return res.status(200).json({ urls });
  });
}
