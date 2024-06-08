const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../images');
const outputDir = path.join(__dirname, '../');
const outputHtml = path.join(outputDir, 'index.html');

async function categorizeImages() {
  const files = fs.readdirSync(imagesDir);
  const horizontal = [];
  const vertical = [];

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const { width, height } = await sharp(filePath).metadata();
    
    if (width > height) {
      horizontal.push(file);
    } else {
      vertical.push(file);
    }
  }

  return { horizontal, vertical };
}

function generateHtmlContent(horizontal, vertical) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thomas's Pictures</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" href="icon.png">
</head>

<body>
  <div class="grid" id="imageGrid">
    ${horizontal.map(file => `
    <div class="image-container">
        <a href="images/${file}" target="_blank">
            <img src="images/${file}" class="image">
        </a>
    </div>`).join('')}
    ${vertical.map(file => `
    <div class="image-container">
        <a href="images/${file}" target="_blank">
            <img src="images/${file}" class="image">
        </a>
    </div>`).join('')}
  </div>
</body>
</html>`;
}

async function generateHtmlFile() {
  const { horizontal, vertical } = await categorizeImages();
  const htmlContent = generateHtmlContent(horizontal, vertical);
  
  fs.writeFileSync(outputHtml, htmlContent, 'utf8');
  console.log('index.html has been generated.');
}

generateHtmlFile();
