const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const [baseUrl, output] = process.argv.slice(2);
if (!baseUrl || !output) throw new Error('Usage: node scripts/qa-v4-1/capture.cjs baseUrl outputDirectory');
const target = path.resolve(output);
fs.mkdirSync(target, { recursive: true });
const routes = ['/', '/servicios', '/servicios/landing-pages', '/servicios/sistemas-web', '/servicios/aplicaciones-moviles', '/contacto', '/soluciones', '/portafolio'];

(async () => {
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [390, 768, 1440]) {
      // Keep screenshot emulation identical to the approved V4 capture baseline.
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : width === 768 ? 1024 : 900 }, reducedMotion: 'reduce' });
      for (const route of routes) {
        console.log(`Capturing ${route} at ${width}px`);
        const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          window.scrollTo(0, document.documentElement.scrollHeight);
          const images = [...document.images];
          images.forEach(image => { image.loading = 'eager'; });
          await Promise.all(images.map(image => image.decode().catch(() => {})));
          window.scrollTo(0, 0);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
        await page.screenshot({ path: path.join(target, `${name}-${width}-fold.png`) });
        const includeFull = route === '/' || route === '/contacto';
        if (includeFull) await page.screenshot({ path: path.join(target, `${name}-${width}-full.png`), fullPage: true });
        const state = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth > innerWidth, title: document.title }));
        results.push({ route, width, status: response.status(), ...state });
        if (response.status() !== 200 || state.overflow) throw new Error(`Capture check failed: ${route} at ${width}px`);
      }
      await page.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(target, 'capture-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ screenshots: fs.readdirSync(target).filter(name => name.endsWith('.png')).length, pages: results.length, noOverflow: results.every(result => !result.overflow) }));
})();
