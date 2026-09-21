const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd032d60-6291-4ab1-b6ec-2f23d3838190\\.user_uploaded\\media_1789977353689.jpg';
const outputPath = 'C:\\Users\\Admin\\OneDrive - Raibal (FPO)\\Desktop\\vini\\public\\images\\products\\aethelgard-ring-nobg.png';

async function processImage() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const alpha = new Uint8Array(width * height);

  // We sample background colors from top corners
  const bgSamples = [];
  const corners = [
    [5, 5], [width - 5, 5], [5, Math.floor(height * 0.2)], [width - 5, Math.floor(height * 0.2)]
  ];
  for (const [cx, cy] of corners) {
    const i = (cy * width + cx) * channels;
    bgSamples.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Calculate average background color
  const avgBg = [
    bgSamples.reduce((a, b) => a + b[0], 0) / bgSamples.length,
    bgSamples.reduce((a, b) => a + b[1], 0) / bgSamples.length,
    bgSamples.reduce((a, b) => a + b[2], 0) / bgSamples.length,
  ];

  // Flood fill from corners & edges to identify connected background
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Add top, left, right edge pixels to queue
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
    visited[x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
    visited[y * width] = 1;
    visited[y * width + (width - 1)] = 1;
  }

  let qHead = 0;

  function isBgColor(r, g, b) {
    // Distance to sampled bg
    const distSq = (r - avgBg[0]) ** 2 + (g - avgBg[1]) ** 2 + (b - avgBg[2]) ** 2;
    // Beige warm background condition
    const isWarm = (r > 100 && g > 80 && (r - b) > 18 && (g - b) > 8);
    const isShadow = (r > 40 && r < 140 && g > 30 && g < 120 && b < 100 && (r - b) > 15);
    
    // Check if it's metallic silver (very low color difference r~g~b and bright)
    const isSilver = (Math.abs(r - g) < 18 && Math.abs(g - b) < 18 && r > 65);
    const isBlackGem = (r < 35 && g < 35 && b < 35);

    if (isSilver || isBlackGem) return false;
    return distSq < 16000 || isWarm || isShadow;
  }

  while (qHead < queue.length) {
    const x = queue[qHead++];
    const y = queue[qHead++];
    const idx = y * width + x;

    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    if (isBgColor(r, g, b)) {
      alpha[idx] = 0; // Mark background transparent

      // 4-connected neighbors
      const neighbors = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
      ];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    } else {
      alpha[idx] = 255; // Keep foreground
    }
  }

  // Smooth & cleanup remaining non-connected background isolated specs
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!visited[idx]) {
        const pIdx = idx * channels;
        const r = data[pIdx];
        const g = data[pIdx + 1];
        const b = data[pIdx + 2];

        // Extra check for background residual pixels outside main ring area
        if (y < height * 0.22 || y > height * 0.82 || x < width * 0.08 || x > width * 0.92) {
          if (!((r < 40 && g < 40 && b < 40) || (Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 90))) {
            alpha[idx] = 0;
          } else {
            alpha[idx] = 255;
          }
        } else {
          alpha[idx] = 255;
        }
      }
    }
  }

  // Apply alpha mask to RGBA buffer
  const outBuffer = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    outBuffer[i * 4 + 3] = alpha[i];
  }

  await sharp(outBuffer, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 5 })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outputPath);

  console.log('Background removed cleanly. File created:', outputPath);
}

processImage().catch(console.error);
