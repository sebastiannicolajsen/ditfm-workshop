import { promises as fs } from 'fs';
import path from 'path';

// Directory containing markdown files
const dataDir = path.resolve('data');
// Output directory for GitHub Pages
const outDir = path.resolve('docs');

// Ensure the output directory exists
await fs.mkdir(outDir, { recursive: true });

// Read all files in the data directory
const files = await fs.readdir(dataDir);

// Filter markdown files
const mdFiles = files.filter((file) => file.endsWith('.md'));

if (mdFiles.length === 0) {
  console.warn(`No markdown files found in ${dataDir}.`);
}

// Copy markdown files to docs folder
for (const file of mdFiles) {
  const sourcePath = path.join(dataDir, file);
  const destPath = path.join(outDir, file);
  await fs.copyFile(sourcePath, destPath);
  console.log(`Copied ${file} to docs/`);
}

// Create a simple index.md that links to all pages
let indexContent = '# Pages\n\n';
for (const file of mdFiles) {
  const baseName = path.parse(file).name;
  indexContent += `- [${baseName}](${baseName}.html)\n`;
}

await fs.writeFile(path.join(outDir, 'index.md'), indexContent);
console.log('Generated docs/index.md'); 