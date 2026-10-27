const fs = require('node:fs');
const os = require('node:os');
const { chromium } = require('@playwright/test');

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw new Error('Usage: node scripts/qa-v4-1/performance.cjs versions.json output.json');
const versions = JSON.parse(fs.readFileSync(input, 'utf8'));
const settings = { cpuSlowdown: 4, latencyMs: 150, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750, cacheDisabled: true, repetitions: 5, settleMs: 1200, routes: ['/', '/contacto'], viewports: [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }] };
const report = { startedAt: new Date().toISOString(), completed: false, settings, versions, environment: { platform: os.platform(), arch: os.arch(), node: process.version, playwright: require('@playwright/test/package.json').version, cpuModel: os.cpus()[0].model, logicalCpus: os.cpus().length }, samples: [] };
const save = () => fs.writeFileSync(output, JSON.stringify(report, null, 2));
const timer = setTimeout(() => { report.error = '15-minute batch deadline'; save(); process.exit(1); }, 900000);

(async () => {
  const browser = await chromium.launch();
  report.environment.chromium = browser.version();
  try {
    for (const viewport of settings.viewports) for (const route of settings.routes) for (let repetition = 1; repetition <= settings.repetitions; repetition++) {
      const order = repetition % 2 ? versions : [...versions].reverse();
      for (const version of order) {
        const context = await browser.newContext({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width < 1440, serviceWorkers: 'block' });
        try {
          const page = await context.newPage();
          const session = await context.newCDPSession(page);
          await session.send('Network.enable');
          await session.send('Network.setCacheDisabled', { cacheDisabled: true });
          await session.send('Network.emulateNetworkConditions', { offline: false, latency: settings.latencyMs, downloadThroughput: settings.downloadBytesPerSecond, uploadThroughput: settings.uploadBytesPerSecond, connectionType: 'cellular4g' });
          await session.send('Emulation.setCPUThrottlingRate', { rate: settings.cpuSlowdown });
          await page.addInitScript(() => {
            const supported = PerformanceObserver.supportedEntryTypes;
            const metrics = { lcp: supported.includes('largest-contentful-paint') ? 0 : null, cls: supported.includes('layout-shift') ? 0 : null, supported };
            window.__preflightMetrics = metrics;
            if (metrics.lcp !== null) new PerformanceObserver(list => { for (const entry of list.getEntries()) metrics.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
            if (metrics.cls !== null) new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) metrics.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
          });
          const response = await page.goto(version.url + route, { waitUntil: 'networkidle', timeout: 45000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForFunction(() => window.__preflightMetrics.lcp === null || window.__preflightMetrics.lcp > 0);
          await page.waitForTimeout(settings.settleMs);
          const data = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const resources = performance.getEntriesByType('resource').map(r => ({ origin: new URL(r.name).origin, path: new URL(r.name).pathname, initiatorType: r.initiatorType, encodedBodySize: r.encodedBodySize, decodedBodySize: r.decodedBodySize, transferSize: r.transferSize, duration: r.duration }));
            const js = resources.filter(r => r.path.endsWith('.js'));
            return { ...window.__preflightMetrics, jsBytesAllInitiators: js.reduce((n, r) => n + r.encodedBodySize, 0), jsBytesLegacyScriptOnly: js.filter(r => r.initiatorType === 'script').reduce((n, r) => n + r.encodedBodySize, 0), jsByInitiator: js.reduce((a, r) => (a[r.initiatorType] = (a[r.initiatorType] || 0) + r.encodedBodySize, a), {}), ttfb: navigation.responseStart - navigation.requestStart, htmlBytes: navigation.encodedBodySize, externalFonts: resources.filter(r => /fonts\.(googleapis|gstatic)\.com/.test(r.origin)).length, resources };
          });
          report.samples.push({ version: version.name, sha: version.sha, route, viewport, repetition, status: response.status(), ...data });
          save();
          console.log(JSON.stringify({ version: version.name, route, width: viewport.width, repetition, lcp: data.lcp, cls: data.cls, jsBytes: data.jsBytesAllInitiators, legacyBytes: data.jsBytesLegacyScriptOnly }));
        } finally { await context.close(); }
      }
    }
    report.completed = true;
    report.finishedAt = new Date().toISOString();
  } catch (error) { report.error = error.message; process.exitCode = 1; }
  finally { await browser.close(); clearTimeout(timer); save(); }
})();
