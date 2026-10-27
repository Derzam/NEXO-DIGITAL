const fs = require('node:fs');
const { chromium, firefox, webkit } = require('@playwright/test');

const output = process.argv[2];
if (!output) throw new Error('Usage: node scripts/qa-v4-2/skip-minimal.cjs <output-json>');

(async () => {
  const observations = [];
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch();
    try {
      for (const explicitTabIndex of [false, true]) {
        for (const key of ['Tab', 'Alt+Tab']) {
          const page = await browser.newPage();
          try {
            const attribute = explicitTabIndex ? ' tabindex="0"' : '';
            await page.setContent(`<a href="#main"${attribute}>Skip</a><button>Next</button><main id="main" tabindex="-1">Main</main>`);
            await page.keyboard.press(key);
            observations.push({ engine: name, version: browser.version(), explicitTabIndex, key, activeElement: await page.evaluate(() => document.activeElement.outerHTML) });
          } finally { await page.close(); }
        }
      }
    } finally { await browser.close(); }
  }
  fs.writeFileSync(output, JSON.stringify(observations, null, 2));
  console.log(JSON.stringify(observations));
})().catch(error => { console.error(error); process.exitCode = 1; });
