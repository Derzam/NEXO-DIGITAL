import { expect, test } from "@playwright/test";

const routes = ["/", "/servicios", "/soluciones", "/portafolio", "/nosotros", "/blog", "/contacto", ...["landing-pages", "sitios-corporativos", "sistemas-web", "aplicaciones-moviles", "inteligencia-artificial", "automatizacion", "auditoria-qa", "seo", "integraciones"].map(slug => `/servicios/${slug}`)];

test("both Search Console owners have exactly one verification tag", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  const tags = html.match(/<meta\b[^>]*\bname="google-site-verification"[^>]*>/g) ?? [];
  const values = tags.map((tag) => tag.match(/\bcontent="([^"]+)"/)?.[1]);
  expect(values).toHaveLength(2);
  expect(values).toEqual(expect.arrayContaining([
    "_giaGOSE7_ORb7c3inf8k_JPfYCygYD1uX8kLg30XA8",
    "HcvJGuq6e6odw_vwURl95lLfEy1EQnon-bd6v-TnYHI",
  ]));
  expect(new Set(values).size).toBe(2);
});

test("metadata and structured data identify each route", async ({ page, request }) => {
  await page.route("**/_vercel/insights/script.js", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    titles.add(title);
    descriptions.add(description!);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).pathname).toBe(route);
    expect(await page.locator('meta[property="og:title"]').getAttribute("content")).toBe(title);
    expect(await page.locator('meta[property="og:description"]').getAttribute("content")).toBe(description);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).pathname).toBe(route);
    expect(await page.locator('meta[name="twitter:card"]').getAttribute("content")).toBe("summary_large_image");
    expect(await page.locator('meta[name="twitter:title"]').getAttribute("content")).toBe(title);
    expect(await page.locator('meta[name="twitter:description"]').getAttribute("content")).toBe(description);
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toBe(["/blog", "/portafolio"].includes(route) ? "noindex, follow" : "index, follow");
    const image = new URL((await page.locator('meta[property="og:image"]').getAttribute("content"))!);
    expect((await request.get(image.pathname)).status()).toBe(200);
    expect(await page.locator('meta[name="twitter:image"]').getAttribute("content")).toBe(image.href);
    const items = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text => JSON.parse(text));
    const organizations = items.filter(item => item["@type"] === "Organization");
    expect(organizations).toHaveLength(1);
    expect(organizations[0].name).toBe("Nexo Digital Studio");
    expect(new URL(organizations[0].logo).pathname).toBe("/images/nexo-wordmark.webp");
    const breadcrumbs = items.filter(item => item["@type"] === "BreadcrumbList");
    if (route.startsWith("/servicios/")) {
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].itemListElement.map((item: { position: number }) => item.position)).toEqual([1, 2, 3]);
      expect(new URL(breadcrumbs[0].itemListElement[2].item).pathname).toBe(route);
    } else expect(breadcrumbs).toHaveLength(0);
  }
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const included = routes.filter(route => !["/blog", "/portafolio"].includes(route));
  expect(sitemap.match(/<loc>/g)).toHaveLength(14);
  for (const route of included) expect(sitemap).toContain(route === "/" ? "</loc>" : `${route}</loc>`);
  for (const route of ["/blog", "/portafolio"]) expect(sitemap).not.toContain(`${route}</loc>`);
  expect((await (await request.get("/robots.txt")).text())).toContain("sitemap.xml");
});


test("sitemap URLs and canonicals use the same public origin", async ({ request }) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const homeHtml = await home.text();
  const linkTag = homeHtml.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];
  const homeCanonical = linkTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  expect(homeCanonical, "Home must declare its absolute canonical URL").toBeTruthy();

  // SEO_EXPECTED_ORIGIN is an explicit release gate, not inferred from the build.
  // Example: SEO_EXPECTED_ORIGIN=https://nexodigitalstudio.net
  const expectedOrigin = (process.env.SEO_EXPECTED_ORIGIN || new URL(homeCanonical!).origin).replace(/\/$/, "");
  expect(new URL(homeCanonical!).href).toBe(`${expectedOrigin}/`);

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  expect(sitemapResponse.headers()["content-type"]).toMatch(/xml/i);
  const xml = await sitemapResponse.text();
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
  const publicPaths = routes.filter((route) => !["/blog", "/portafolio"].includes(route));
  const expectedUrls = publicPaths.map((path) => new URL(path, `${expectedOrigin}/`).toString());

  expect(locations).toHaveLength(14);
  expect(new Set(locations).size).toBe(locations.length);
  expect(new Set(locations)).toEqual(new Set(expectedUrls));
  for (const url of locations) {
    const parsed = new URL(url);
    expect(parsed.protocol).toBe(new URL(expectedOrigin).protocol);
    expect(parsed.origin).toBe(expectedOrigin);
    expect(parsed.search).toBe("");
    expect(parsed.hash).toBe("");
  }

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robotsText = await robotsResponse.text();
  expect(robotsText).toMatch(/User-agent:\s*\*/i);
  expect(robotsText).toContain(`Sitemap: ${expectedOrigin}/sitemap.xml`);

  for (const path of publicPaths) {
    const response = await request.get(path);
    expect(response.status(), `Public route: ${path}`).toBe(200);
    const html = await response.text();
    const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];
    const canonical = tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
    expect(canonical, `Canonical for ${path}`).toBe(new URL(path, `${expectedOrigin}/`).toString());
  }
});
