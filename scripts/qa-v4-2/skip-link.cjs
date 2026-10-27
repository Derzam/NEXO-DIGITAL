const fs = require('node:fs');
const path = require('node:path');
const { chromium, firefox, webkit } = require('@playwright/test');

const base = process.argv[2];
const output = process.argv[3];
if (!base || !output) throw new Error('Usage: node scripts/qa-v4-2/skip-link.cjs <base-url> <output-directory>');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const checks = [];
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch();
    try {
      for (const [width, height] of [[390, 844], [768, 1024], [1440, 900]]) {
        const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
        try {
          await page.goto(base, { waitUntil: 'networkidle' });
          await page.keyboard.press('Tab');
          const beforeEnter = await page.evaluate(() => {
            const link = document.querySelector('.skip-link');
            const rect = link.getBoundingClientRect();
            const style = getComputedStyle(link);
            return {
              tag: link.tagName, href: link.getAttribute('href'), tabIndex: link.tabIndex,
              focused: document.activeElement === link,
              visible: style.visibility === 'visible' && style.display !== 'none' && Number(style.opacity) > 0 && rect.top >= 0 && rect.left >= 0 && rect.bottom <= innerHeight && rect.right <= innerWidth,
              rect: { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right },
              transform: style.transform, outlineStyle: style.outlineStyle,
            };
          });
          if (name === 'webkit') await page.screenshot({ path: path.join(output, `webkit-focus-${width}.png`) });
          await page.keyboard.press('Enter');
          const afterEnter = await page.evaluate(() => ({ hash: location.hash, mainFocused: document.activeElement === document.querySelector('main#contenido') }));
          const pass = beforeEnter.tag === 'A' && beforeEnter.href === '#contenido' && beforeEnter.focused && beforeEnter.visible && afterEnter.hash === '#contenido' && afterEnter.mainFocused;
          checks.push({ engine: name, width, height, beforeEnter, afterEnter, pass });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  fs.writeFileSync(path.join(output, 'skip-link-results.json'), JSON.stringify(checks, null, 2));
  console.log(JSON.stringify(checks));
  if (checks.some(check => !check.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
