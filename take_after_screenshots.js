const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd032d60-6291-4ab1-b6ec-2f23d3838190\\screenshots\\after_light_redesign';

const widths = [1920, 1440, 768, 390];
const pagesToCapture = [
  { name: 'home', path: '/' },
  { name: 'gallery', path: '/gallery' },
  { name: 'product', path: '/product/aethelgard-hand-carved-sovereign-ring' },
  { name: 'checkout', path: '/checkout' },
];

(async () => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const pageInfo of pagesToCapture) {
    for (const w of widths) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });

      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem('vvv_intro_seen', 'true');
      });

      try {
        await page.goto(`http://localhost:3000${pageInfo.path}`, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 1200));
        const outFile = path.join(outDir, `after_${pageInfo.name}_${w}.png`);
        await page.screenshot({ path: outFile });
        console.log(`Saved screenshot: ${outFile} (${w}px)`);
      } catch (err) {
        console.error(`Failed ${pageInfo.name} at ${w}px:`, err.message);
      } finally {
        await page.close();
      }
    }
  }

  // Also capture cart drawer
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('vvv_intro_seen', 'true');
    });

    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1200));
      // Click on cart button
      const cartButton = await page.$('header button[aria-label="Open shopping cart"]');
      if (cartButton) {
        await cartButton.click();
        await new Promise(r => setTimeout(r, 800));
      }
      const outFile = path.join(outDir, `after_cart_drawer_${w}.png`);
      await page.screenshot({ path: outFile });
      console.log(`Saved screenshot: ${outFile} (${w}px)`);
    } catch (err) {
      console.error(`Failed cart_drawer at ${w}px:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('After screenshots complete!');
})();
