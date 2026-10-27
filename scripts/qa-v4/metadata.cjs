const fs = require('node:fs');
const routes = ['/', '/servicios', '/soluciones', '/portafolio', '/nosotros', '/blog', '/contacto', ...['landing-pages', 'sitios-corporativos', 'sistemas-web', 'aplicaciones-moviles', 'inteligencia-artificial', 'automatizacion', 'auditoria-qa', 'seo', 'integraciones'].map(s => '/servicios/' + s)];
const base = 'http://127.0.0.1:3120';

(async () => {
  const pages = [];
  for (const route of [...routes, '/no-existe', '/servicios/no-existe']) {
    const response = await fetch(base + route);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map(m => m[1]);
    const is404 = route.endsWith('no-existe');
    const pass = is404 ? response.status === 404 && robots.some(r => r.includes('noindex')) : response.status === 200 && Boolean(title && description && canonical) && new URL(canonical).pathname === route;
    pages.push({ route, status: response.status, title, description, canonical, robots, pass });
  }
  const sitemapResponse = await fetch(base + '/sitemap.xml');
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const robotsResponse = await fetch(base + '/robots.txt');
  const robots = await robotsResponse.text();
  const pass = pages.every(p => p.pass) && sitemapResponse.status === 200 && locations.length === 16 && routes.every(r => locations.some(l => new URL(l).pathname === r)) && robotsResponse.status === 200 && robots.includes('Sitemap:');
  const result = { base, pages, sitemap: { status: sitemapResponse.status, locations }, robots: { status: robotsResponse.status, text: robots }, pass, note: 'Local canonical origin uses the existing localhost:3000 fallback. Set the approved NEXT_PUBLIC_SITE_URL before building a future hosted environment.' };
  fs.writeFileSync('docs/qa-v4/phase-6-final/metadata.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ pass, pages: pages.length, sitemapLocations: locations.length }));
  if (!pass) process.exitCode = 1;
})();
