const fs = require('node:fs');
const os = require('node:os');
const { chromium } = require('./baseline/node_modules/@playwright/test');

const variants = [
  { name: 'baseline', url: 'http://127.0.0.1:3140/contacto' },
  { name: 'without-header-experimental', url: 'http://127.0.0.1:3141/contacto' },
  { name: 'without-form-experimental', url: 'http://127.0.0.1:3142/contacto' },
];
const settings = { viewport: { width: 390, height: 844 }, cpuSlowdown: 4, latencyMs: 150, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750, cacheDisabled: true, repetitions: 5, settleAfterNetworkIdleMs: 3500 };
const report = { completed: false, startedAt: new Date().toISOString(), baseSha: '08c3b1bc3bd54a2ce369366e45de302548441eb7', build: 'Next.js 16.4.3 next build --webpack in isolated copies sharing the same installed node_modules', settings, variants, environment: { node: process.version, platform: os.platform(), cpu: os.cpus()[0].model }, samples: [] };
const save = () => fs.writeFileSync('results.json', JSON.stringify(report, null, 2));
(async () => {
  const browser = await chromium.launch();
  report.environment.chromium = browser.version();
  try {
    for (let repetition = 0; repetition < settings.repetitions; repetition++) {
      const order = variants.slice(repetition % 3).concat(variants.slice(0, repetition % 3));
      for (const variant of order) {
        const context = await browser.newContext({ viewport: settings.viewport, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
        try {
          const page = await context.newPage();
          const session = await context.newCDPSession(page);
          await session.send('Network.enable');
          await session.send('Network.setCacheDisabled', { cacheDisabled: true });
          await session.send('Network.emulateNetworkConditions', { offline: false, latency: settings.latencyMs, downloadThroughput: settings.downloadBytesPerSecond, uploadThroughput: settings.uploadBytesPerSecond, connectionType: 'cellular4g' });
          await session.send('Emulation.setCPUThrottlingRate', { rate: settings.cpuSlowdown });
          await page.addInitScript(() => {
            window.__metrics = { lcp: 0, cls: 0 };
            new PerformanceObserver(list => { for (const e of list.getEntries()) window.__metrics.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__metrics.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
          });
          const response = await page.goto(variant.url, { waitUntil: 'networkidle', timeout: 60000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(settings.settleAfterNetworkIdleMs);
          const metrics = await page.evaluate(() => {
            const resources = performance.getEntriesByType('resource').filter(r => new URL(r.name).pathname.endsWith('.js')).map(r => ({ path: new URL(r.name).pathname, initiator: r.initiatorType, encodedBytes: r.encodedBodySize, transferBytes: r.transferSize }));
            return { ...window.__metrics, jsEncodedBytes: resources.reduce((n, r) => n + r.encodedBytes, 0), jsTransferBytes: resources.reduce((n, r) => n + r.transferBytes, 0), resources };
          });
          report.samples.push({ variant: variant.name, repetition: repetition + 1, status: response.status(), ...metrics });
          save();
          console.log(JSON.stringify({ variant: variant.name, repetition: repetition + 1, status: response.status(), lcp: metrics.lcp, cls: metrics.cls, jsEncodedBytes: metrics.jsEncodedBytes, jsTransferBytes: metrics.jsTransferBytes, resources: metrics.resources.length }));
        } finally { await context.close(); }
      }
    }
    report.completed = true;
    report.finishedAt = new Date().toISOString();
  } catch (error) { report.error = String(error); process.exitCode = 1; }
  finally { await browser.close(); save(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
