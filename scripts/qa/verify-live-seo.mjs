#!/usr/bin/env node
// Independent public-origin SEO check. Requires Node.js 18+ and a working DNS connection.
// Usage: node scripts/qa/verify-live-seo.mjs https://nexodigitalstudio.net
const origin = new URL(process.argv[2] || "https://nexodigitalstudio.net").origin;
if (new URL(origin).protocol !== "https:") {
  throw new Error("The public SEO verification target must use HTTPS");
}

const routes = [
  "/", "/servicios", "/soluciones", "/nosotros", "/contacto",
  "/servicios/landing-pages", "/servicios/sitios-corporativos",
  "/servicios/sistemas-web", "/servicios/aplicaciones-moviles",
  "/servicios/inteligencia-artificial", "/servicios/automatizacion",
  "/servicios/auditoria-qa", "/servicios/seo", "/servicios/integraciones",
];
const excluded = ["/blog", "/portafolio"];
const errors = [];

async function read(url, redirect = "follow") {
  const response = await fetch(url, {
    redirect,
    signal: AbortSignal.timeout(15000),
    headers: { "user-agent": "Nexo-SEO-Verification/1.0" },
  });
  const body = await response.text();
  return { response, body };
}

function canonicalFrom(html) {
  const links = html.match(/<link\b[^>]*>/gi) || [];
  const tag = links.find((link) => /\brel=["']canonical["']/i.test(link));
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1] || null;
}

function robotsMetaFrom(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((item) => /\bname=["']robots["']/i.test(item));
  return tag?.match(/\bcontent=["']([^"']+)["']/i)?.[1] || null;
}

function ensure(ok, label) {
  if (!ok) errors.push(label);
}

try {
  const [{ response: sitemapResponse, body: sitemap }, { response: robotsResponse, body: robots }] =
    await Promise.all([read(origin + "/sitemap.xml"), read(origin + "/robots.txt")]);

  ensure(sitemapResponse.status === 200, `sitemap.xml HTTP ${sitemapResponse.status} (expected 200)`);
  ensure(/xml/i.test(sitemapResponse.headers.get("content-type") || ""), "sitemap.xml must have XML content type");
  ensure(robotsResponse.status === 200, `robots.txt HTTP ${robotsResponse.status} (expected 200)`);

  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
  const expected = routes.map((path) => new URL(path, origin + "/").toString());
  ensure(locs.length === expected.length, `sitemap URL count: ${locs.length}; expected ${expected.length}`);
  ensure(new Set(locs).size === locs.length, "sitemap contains duplicate URLs");
  ensure(locs.every((url) => expected.includes(url)) && expected.every((url) => locs.includes(url)),
    "sitemap URLs do not match approved public routes on the canonical domain");
  ensure(!sitemap.includes("vercel.app"), "sitemap still contains a vercel.app domain");
  ensure(!excluded.some((route) => locs.includes(new URL(route, origin + "/").toString())),
    "sitemap includes a pending noindex route");
  ensure(new RegExp(`^Sitemap:\\s*${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml\\s*$`, "mi").test(robots),
    "robots.txt does not point to the canonical sitemap");

  const checked = await Promise.all([...routes, ...excluded].map(async (route) => {
    try {
      const { response, body } = await read(new URL(route, origin + "/").toString());
      if (response.status !== 200) return `${route}: HTTP ${response.status}`;
      const found = canonicalFrom(body);
      const expectedUrl = new URL(route, origin + "/").toString();
      if (found !== expectedUrl) return `${route}: canonical ${found || "(missing)"} != ${expectedUrl}`;
      const robotsTag = robotsMetaFrom(body)?.toLowerCase() || "";
      if (excluded.includes(route) && !robotsTag.includes("noindex")) return `${route}: missing noindex`;
      if (!excluded.includes(route) && robotsTag.includes("noindex")) return `${route}: unexpected noindex`;
      return null;
    } catch (error) {
      return `${route}: ${error.message}`;
    }
  }));
  errors.push(...checked.filter(Boolean));

  try {
    const { response } = await read("https://www.nexodigitalstudio.net/", "manual");
    ensure(response.status === 308, `www redirect status ${response.status} (expected 308)`);
    const location = response.headers.get("location");
    ensure(location && new URL(location, "https://www.nexodigitalstudio.net").href === origin + "/",
      "www must redirect directly to the apex domain");
  } catch (error) {
    errors.push(`www redirect: ${error.message}`);
  }

  console.log(`SEO public origin: ${origin}`);
  console.log(`Sitemap: ${locs.length} URLs (expected ${expected.length})`);
  console.log(`Routes checked: ${routes.length} indexable, ${excluded.length} noindex`);
  if (errors.length) {
    for (const error of errors) console.error("FAIL:", error);
    process.exitCode = 1;
  } else {
    console.log("PASS: sitemap, robots, canonicals, pending noindex routes and www redirect");
  }
} catch (error) {
  console.error("Unable to verify the public origin:", error.message);
  console.error("This can be a DNS/network issue. It is not evidence by itself that the sitemap is broken.");
  process.exitCode = 1;
}
