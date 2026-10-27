const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const [base, output] = process.argv.slice(2);
if (!base || !output) throw new Error('Usage: node scripts/qa-v4-2/capture-home.cjs <base-url> <output-directory>');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  try {
    for (const [width, height] of [[390, 844], [768, 1024], [1440, 900]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      try {
        const response = await page.goto(base, { waitUntil: 'load' });
        if (response.status() !== 200) throw new Error(`Home returned ${response.status()} at ${width}px`);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          window.scrollTo(0, document.documentElement.scrollHeight);
          const images = [...document.images];
          images.forEach(image => { image.loading = 'eager'; });
          await Promise.all(images.map(image => image.decode().catch(() => {})));
          window.scrollTo(0, 0);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        await page.screenshot({ path: path.join(output, `home-${width}-fold.png`) });
        await page.screenshot({ path: path.join(output, `home-${width}-full.png`), fullPage: true });
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
