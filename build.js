import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';

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

// HTML template that shows both raw markdown and converted HTML
const template = (rawMarkdown, htmlContent) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
</head>
<body>
<!-- Raw markdown for AI agents -->
<pre style="display: none;">${rawMarkdown}</pre>

<!-- Converted HTML for display -->
${htmlContent}
</body>
</html>`;

// Generate HTML files from markdown
for (const file of mdFiles) {
  const baseName = path.parse(file).name;
  const mdPath = path.join(dataDir, file);
  const mdContent = await fs.readFile(mdPath, 'utf-8');

  // Convert markdown to HTML for display
  const htmlContent = marked(mdContent);
  const html = template(mdContent, htmlContent);

  // Write the resulting HTML to docs folder
  const outPath = path.join(outDir, `${baseName}.html`);
  await fs.writeFile(outPath, html);
  console.log(`Generated ${baseName}.html`);
}

// Create index.html that links to all pages
let indexBody = '<h1>Pages</h1><ul>\n';
for (const file of mdFiles) {
  const baseName = path.parse(file).name;
  indexBody += `  <li><a href="${baseName}.html">${baseName}</a></li>\n`;
}
indexBody += '</ul>';

const indexHtml = template(indexBody, indexBody);
await fs.writeFile(path.join(outDir, 'index.html'), indexHtml);
console.log('Generated docs/index.html'); 