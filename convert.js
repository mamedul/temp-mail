// convert.js
// Convert Markdown files in ./docs into standalone HTML in ./dist

const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it")();

const inputDir = path.join(__dirname, "docs");
const outputDir = path.join(__dirname, "dist");

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Template wrapper (basic HTML page)
function wrapHTML(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.min.css">
  <style>
    body { max-width: 800px; margin: 40px auto; padding: 20px; }
  </style>
</head>
<body class="markdown-body">
${body}
</body>
</html>`;
}

// Convert all .md files in docs/
fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith(".md")) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.md$/, ".html"));

    const markdown = fs.readFileSync(inputPath, "utf8");
    const htmlContent = markdownIt.render(markdown);
    const wrapped = wrapHTML(file, htmlContent);

    fs.writeFileSync(outputPath, wrapped, "utf8");
    console.log(`✅ Converted ${file} → ${path.basename(outputPath)}`);
  }
});

console.log("🎉 All markdown files converted to HTML in dist/");
