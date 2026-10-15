import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'lib', 'nav-tree.json');

    if (!fs.existsSync(filePath)) {
      return res.status(200).json([]);
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const tree = JSON.parse(fileData);

    return res.status(200).json(tree);
  } catch (error) {
    console.error('Error reading navigation JSON:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}