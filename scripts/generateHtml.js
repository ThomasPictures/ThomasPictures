const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../images');
const outputDir = path.join(__dirname, '../');
const outputHtml = path.join(outputDir, 'index.html');

async function categorizeImages(dirPath) {
  const files = fs.readdirSync(dirPath);
  const horizontal = [];
  const vertical = [];
  const directories = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      directories.push(file);
    } else {
      const { width, height } = await sharp(filePath).metadata();
      
      if (width > height) {
        horizontal.push(file);
      } else {
        vertical.push(file);
      }
    }
  }

  return { horizontal, vertical, directories };
}

function generateHtmlContent(horizontal, vertical, directories, currentPath, parentPath) {
  const relativePathToRoot = path.relative(path.join(outputDir, currentPath), outputDir);
  console.log("style", `${path.join(relativePathToRoot, 'style.css')}`)
  
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thomas's Pictures</title>
  <link rel="stylesheet" href="${path.join(relativePathToRoot, 'styles.css')}">
  <link rel="icon" href="${path.join(relativePathToRoot, 'icon.png')}">
</head>

<body>
  <div class="navigation">
    ${relativePathToRoot.toString() !== "" ? `<a class="backButton" href="${path.join(relativePathToRoot, "index.html")}"><h2>Back</h2></a>` : ''}
    <h1 class="title">${currentPath}</h1>
  </div>
  <div class="directories">
    ${directories.map(dir => `<div class="directory"><a href="${path.join(currentPath, dir, 'index.html')}"><div class="folderButton"><img class="image" src="folder.webp"/><h2 class="text">${dir}</h2></div></a></div>`).join('')}
  </div>
  <div class="grid" id="imageGrid">
    ${horizontal.map(file => `
    <div class="image-container">
        <a href="${path.join(relativePathToRoot, 'images', currentPath, file)}" target="_blank">
            <img src="${path.join(relativePathToRoot, 'images', currentPath, file)}" class="image">
        </a>
    </div>`).join('')}
    ${vertical.map(file => `
    <div class="image-container">
        <a href="${path.join(relativePathToRoot, 'images', currentPath, file)}" target="_blank">
            <img src="${path.join(relativePathToRoot, 'images', currentPath, file)}" class="image">
        </a>
    </div>`).join('')}
  </div>
</body>
</html>`;
}

function writeFileSyncRecursive(filename, content, charset) {
  // -- normalize path separator to '/' instead of path.sep, 
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g,'/');  

  // -- preparation to allow absolute paths as well
  let root = '';
  if (filepath[0] === '/') { 
    root = '/'; 
    filepath = filepath.slice(1);
  } 
  else if (filepath[1] === ':') { 
    root = filepath.slice(0,3);   // c:\
    filepath = filepath.slice(3); 
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1);  // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + '/';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath
    },
    root // first 'acc', important
  ); 
  
  // -- write file
  fs.writeFileSync(root + filepath, content, charset);
}

async function generateHtmlForDirectory(dirPath, relativePath) {
  const { horizontal, vertical, directories } = await categorizeImages(dirPath);
  const parentPath = relativePath.split(path.sep).slice(0, -1).join(path.sep) || null;
  const htmlContent = generateHtmlContent(horizontal, vertical, directories, relativePath, parentPath);
  console.log("parentPath", parentPath)
  console.log("relativePath", relativePath)
  
  const outputFilePath = path.join(outputDir, relativePath, 'index.html');
  console.log("outputFilePath", outputFilePath)
  // fs.writeFileSync(outputFilePath, htmlContent, {encoding: "utf8", flag: "w"});
  writeFileSyncRecursive(outputFilePath, htmlContent, "utf8")
  
  for (const directory of directories) {
    await generateHtmlForDirectory(path.join(dirPath, directory), path.join(relativePath, directory));
  }
}

async function generateHtmlFile() {
  await generateHtmlForDirectory(imagesDir, '');
  console.log('HTML files have been generated.');
}

generateHtmlFile();
