const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd032d60-6291-4ab1-b6ec-2f23d3838190\\screenshots';

const widths = [1920, 1440, 1024, 768, 390];
const prefix = process.argv[2] || 'before';

(async () => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    
    // Evaluate session storage before load
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('vvv_intro_seen', 'true');
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const outFile = path.join(outDir, `${prefix}_hero_${w}.png`);
    await page.screenshot({ path: outFile });
    console.log(`Saved screenshot: ${outFile} (${w}px)`);
    await page.close();
  }

  await browser.close();
  console.log(`All ${prefix} screenshots complete!`);
})();
