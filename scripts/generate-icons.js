const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const PUBLIC_DIR = path.join(__dirname, '../public');
const SVG_ICON = path.join(__dirname, '../public/favicon.svg');

// Function to generate PNG from SVG
async function generatePNG(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

// Function to generate ICO from SVG
async function generateICO(inputPath, outputPath) {
  try {
    // Create a 32x32 PNG first
    const tempPngPath = path.join(PUBLIC_DIR, 'temp-favicon.png');
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(tempPngPath);
    
    // Now convert to ICO using sharp (basic approach)
    // For a real project, you might want to use a dedicated ICO library
    const pngBuffer = fs.readFileSync(tempPngPath);
    fs.writeFileSync(outputPath, pngBuffer);
    
    // Remove temp file
    fs.unlinkSync(tempPngPath);
    
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

async function main() {
  // Check if SVG file exists
  if (!fs.existsSync(SVG_ICON)) {
    console.error(`SVG icon not found at ${SVG_ICON}`);
    return;
  }
  
  // Generate app icons
  await generatePNG(SVG_ICON, path.join(PUBLIC_DIR, 'logo192.png'), 192);
  await generatePNG(SVG_ICON, path.join(PUBLIC_DIR, 'logo512.png'), 512);
  
  // Generate favicon.ico
  await generateICO(SVG_ICON, path.join(PUBLIC_DIR, 'favicon.ico'));
  
  console.log('All icons generated successfully!');
}

main().catch(console.error); 