const fs = require('fs');
const path = require('path');

const fonts = [
  'Roboto-Italic.ttf',
  'Roboto-MediumItalic.ttf',
  'Roboto-Medium.ttf',
  'Roboto-Regular.ttf',
  'Amiri-Regular.ttf',
  'Amiri-Bold.ttf'
];

const sourceDir = path.join(__dirname, "..", 'assets', 'fonts');
const targetDir = path.join(__dirname, "..", 'node_modules', 'pdfmake', 'build', 'vfs_fonts');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fonts.forEach((font) => {
  const sourcePath = path.join(sourceDir, font);
  const targetPath = path.join(targetDir, font);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✔ Copied ${font}`);
  } else {
    console.warn(`⚠ Font not found: ${font}`);
  }
});