import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Formidable v3 uses a factory function
  const form = formidable({
    multiples: true,
    uploadDir,
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
        const fp = (f as any).filepath || (f as any).path || (f as any).file?.filepath || (f as any).file?.path;
        let filename = '';
        if (fp) {
          filename = path.basename(fp);
        } else if ((f as any).newFilename) {
          filename = (f as any).newFilename;
        } else if ((f as any).originalFilename) {
          filename = (f as any).originalFilename;
        } else if ((f as any).originalname) {
          filename = (f as any).originalname;
        } else if ((f as any).name) {
          filename = String((f as any).name);
        } else {
          // fallback: generate a name
          filename = `upload-${Date.now()}`;
        }
        urls.push(`/uploads/${filename}`);
      } catch (e) {
        console.error('Error processing uploaded file entry', e, f);
      }
    }

    return res.status(200).json({ urls });
  });
}
