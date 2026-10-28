import { expect, test } from "@playwright/test";

const routes = ["/", "/servicios", "/soluciones", "/portafolio", "/nosotros", "/blog", "/contacto", ...["landing-pages", "sitios-corporativos", "sistemas-web", "aplicaciones-moviles", "inteligencia-artificial", "automatizacion", "auditoria-qa", "seo", "integraciones"].map(slug => `/servicios/${slug}`)];

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
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toBe("index, follow");
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
  for (const route of routes) expect(sitemap).toContain(route === "/" ? "</loc>" : `${route}</loc>`);
  expect((await (await request.get("/robots.txt")).text())).toContain("sitemap.xml");
});
