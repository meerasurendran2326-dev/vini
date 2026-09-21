const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd032d60-6291-4ab1-b6ec-2f23d3838190\\.user_uploaded\\media_1789977353689.jpg';
const outputPath = 'C:\\Users\\Admin\\OneDrive - Raibal (FPO)\\Desktop\\vini\\public\\images\\products\\aethelgard-ring-nobg.png';

async function processImage() {
  const meta = await sharp(inputPath).metadata();
  const width = meta.width;
  const height = meta.height;

  const { data } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const inRingBox = (x > 110 && x < 840 && y > 350 && y < 730);

      // Silver highlight check
      const isSilver = (Math.abs(r - g) < 22 && Math.abs(g - b) < 22 && r > 55);
      // Deep black gem & oxidized cuts check
      const isBlack = (r < 40 && g < 40 && b < 40);

      if (!inRingBox) {
        out[idx + 3] = 0;
      } else {
        // Table paper & table shadow removal
        const isTablePaper = (r > 130 && g > 100 && (r - b) > 22 && (g - b) > 10);
        const isTableShadow = (y > 620 && (r - b) > 15 && !isSilver && !isBlack);

        if ((isTablePaper || isTableShadow) && !isSilver && !isBlack) {
          out[idx + 3] = 0;
        } else {
          out[idx + 3] = 255;
        }
      }
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 5 })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outputPath);

  console.log('Studio cut transparent ring image created:', outputPath);
}

processImage().catch(console.error);
