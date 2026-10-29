const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');
const packageJson = require('../node_modules/next/package.json');

const version = packageJson.version;

if (!version) {
  console.log('Next.js version not found.');
  process.exit(0);
}

console.log(`Sanitizing Next.js version: ${version}`);

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!entry.isFile()) continue;

    // Don't modify binary/compressed assets.
    const ext = path.extname(entry.name).toLowerCase();

    const binaryExtensions = new Set([
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.webp',
      '.ico',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot',
      '.otf',
      '.wasm',
      '.gz',
      '.br',
      '.zst',
      '.zip'
    ]);

    if (binaryExtensions.has(ext)) continue;

    try {
      const data = fs.readFileSync(fullPath);

      // Only process files that are valid UTF-8/text.
      const text = data.toString('utf8');

      if (!text.includes(version)) continue;

      const modified = text.split(version).join('');

      fs.writeFileSync(fullPath, modified);

      console.log(`Sanitized: ${path.relative(process.cwd(), fullPath)}`);
    } catch (err) {
      console.warn(
        `Skipped ${path.relative(process.cwd(), fullPath)}: ${err.message}`
      );
    }
  }
}

processDirectory(nextDir);

console.log('Next.js version sanitization completed.');