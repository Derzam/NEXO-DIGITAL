import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/servicios", "/soluciones", "/portafolio", "/nosotros", "/blog", "/contacto"];
const slugs = ["landing-pages", "sitios-corporativos", "sistemas-web", "aplicaciones-moviles", "inteligencia-artificial", "automatizacion", "auditoria-qa", "seo", "integraciones"];
const routes = [...pages, ...slugs.map(slug => `/servicios/${slug}`)];

for (const route of routes) {
  test(`page, links, SEO, accessibility and overflow: ${route}`, async ({ page, request }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    expect(await page.title()).toContain("Nexo Digital Studio");
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).pathname).toBe(route);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /width=device-width/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const links = await page.locator("a[href]").evaluateAll(elements => elements.map(element => ({ href: element.getAttribute("href")!, target: element.getAttribute("target"), rel: element.getAttribute("rel") })));
    for (const link of links) {
      expect(link.href).not.toBe("#");
      if (link.href.startsWith("/") && !link.href.startsWith("//")) {
        expect(routes, `Unknown internal link on ${route}`).toContain(link.href.split("#")[0]);
      }
      if (link.href.startsWith("https://wa.me/")) {
        const url = new URL(link.href);
        expect(url.pathname).toBe("/593984447960");
        expect(url.searchParams.get("text")?.length).toBeGreaterThan(10);
        expect(link.target).toBe("_blank");
        expect(link.rel).toContain("noopener");
      }
    }
    if (testInfo.project.name === "desktop-1440") {
      for (const href of new Set(links.filter(link => link.href.startsWith("/")).map(link => link.href))) {
        expect((await request.get(href)).status(), href).toBe(200);
      }
    }
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    await testInfo.attach("accessibility", { body: JSON.stringify(accessibility.violations, null, 2), contentType: "application/json" });
    expect(accessibility.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
    expect(errors).toEqual([]);
    {
      await page.screenshot({ path: `qa-artifacts/${testInfo.project.name}-${route === "/" ? "inicio" : route.slice(1).replaceAll("/", "-")}.png`, fullPage: true });
    }
  });
}

test("main navigation and mobile keyboard dismissal", async ({ page }, testInfo) => {
  await page.goto("/");
  const mobile = testInfo.project.name !== "desktop-1440";
  if (mobile) {
    const toggle = page.getByRole("button", { name: /^(Abrir|Cerrar) menú$/ });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  }
  for (const [label, path] of [["Servicios", "/servicios"], ["Soluciones", "/soluciones"], ["Portafolio", "/portafolio"], ["Nosotros", "/nosotros"], ["Blog", "/blog"], ["Contacto", "/contacto"], ["Inicio", "/"]]) {
    if (mobile) await page.getByRole("button", { name: "Abrir menú" }).click();
    const nav = page.getByRole("navigation", { name: mobile ? "Navegación móvil" : "Navegación principal", exact: true });
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(path);
    if (mobile) await expect(page.getByRole("button", { name: "Abrir menú" })).toHaveAttribute("aria-expanded", "false");
  }
});

test("service discovery and quotation link", async ({ page, context }) => {
  await context.route("https://wa.me/**", route => route.fulfill({ status: 200, body: "WhatsApp handoff captured by QA" }));
  await page.goto("/");
  await page.getByRole("link", { name: "Explorar servicios", exact: true }).click();
  await expect(page).toHaveURL("/servicios");
  await expect(page.locator(".service-card")).toHaveCount(9);
  await page.locator('.service-card[href="/servicios/landing-pages"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Landing pages");
  const link = page.getByRole("link", { name: "Cotizar este servicio" });
  expect(new URL((await link.getAttribute("href"))!).searchParams.get("text")).toContain("Landing pages");
  const popupPromise = page.waitForEvent("popup");
  await link.click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(await link.getAttribute("href"));
  await popup.close();
  await page.getByRole("link", { name: "Todos los servicios", exact: true }).click();
  await expect(page).toHaveURL("/servicios");
});

test("quotation validation, encoding and blocked-popup fallback", async ({ page }) => {
  await page.goto("/contacto");
  // Capture only the browser handoff: never send personal data or a real WhatsApp message.
  await page.evaluate(() => {
    Object.assign(window, { openedUrls: [] });
    window.open = (url) => { (window as unknown as { openedUrls: string[] }).openedUrls.push(String(url)); return null; };
  });
  const submit = page.getByRole("button", { name: "Preparar solicitud por WhatsApp" });
  await submit.click();
  await expect(page.locator("#nombre:invalid")).toHaveCount(1);
  await page.getByLabel("Nombre completo").fill("   ");
  await page.getByLabel("Correo electrónico").fill("invalid");
  await page.getByLabel("Servicio que necesitas").selectOption({ label: "Landing pages" });
  await page.getByLabel("Cuéntanos sobre tu proyecto").fill("                ");
  await submit.click();
  await expect(page.locator("#correo:invalid")).toHaveCount(1);
  await page.getByLabel("Correo electrónico").fill("qa@example.com");
  await submit.click();
  await expect(page.locator("#nombre:invalid")).toHaveCount(1);
  await page.getByLabel("Nombre completo").fill(" Ana Ñ & Co ");
  await submit.click();
  await expect(page.locator("#proyecto:invalid")).toHaveCount(1);
  expect(await page.evaluate(() => (window as unknown as { openedUrls: string[] }).openedUrls)).toEqual([]);
  const project = "Necesito un sitio para café & té + reservas #2026.";
  await page.getByLabel("Cuéntanos sobre tu proyecto").fill(project);
  await page.getByLabel("Presupuesto estimado").selectOption("USD 500–1.500");
  await submit.click();
  const urls = await page.evaluate(() => (window as unknown as { openedUrls: string[] }).openedUrls);
  expect(urls).toHaveLength(1);
  const url = new URL(urls[0]);
  expect(url.origin + url.pathname).toBe("https://wa.me/593984447960");
  expect(url.searchParams.get("text")).toBe(["Hola, quisiera solicitar una cotización a Nexo Digital Studio.", "Nombre: Ana Ñ & Co", "Correo: qa@example.com", "Servicio: Landing pages", `Proyecto: ${project}`, "Presupuesto orientativo: USD 500–1.500"].join("\n"));
  await expect(page.getByRole("status")).toContainText("Solicitud preparada");
  await expect(page.getByRole("link", { name: "abrir la solicitud en WhatsApp" })).toHaveAttribute("href", urls[0]);
  await page.getByLabel("Nombre completo").fill("Otra persona");
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByLabel("Presupuesto estimado").selectOption("");
  await page.getByLabel("Servicio que necesitas").selectOption("No estoy seguro");
  await submit.click();
  const nextUrls = await page.evaluate(() => (window as unknown as { openedUrls: string[] }).openedUrls);
  const nextMessage = new URL(nextUrls[1]).searchParams.get("text");
  expect(nextMessage).toContain("Servicio: No estoy seguro");
  expect(nextMessage).not.toContain("Presupuesto orientativo:");
});

test("404 pages and return home", async ({ page }) => {
  for (const route of ["/no-existe", "/servicios/no-existe"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página no existe.");
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL("/");
  }
});

test("keyboard skip link and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});

test("robots and complete sitemap", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml.match(/<loc>/g)).toHaveLength(16);
  for (const route of routes.filter(route => route !== "/")) expect(xml).toContain(`${route}</loc>`);
});

for (const route of ["/", "/contacto"]) {
  test(`local performance evidence: ${route}`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      const metrics = { lcp: 0, cls: 0 };
      Object.assign(window, { qaPerformance: metrics });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!shift.hadRecentInput) metrics.cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      return {
        ...(window as unknown as { qaPerformance: { lcp: number; cls: number } }).qaPerformance,
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd,
        jsBytes: resources.filter(entry => entry.initiatorType === "script").reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        resourceCount: resources.length,
        externalFonts: resources.filter(entry => /fonts\.(googleapis|gstatic)\.com/.test(entry.name)).length,
        note: "Local production build; unthrottled Chromium. Not field Core Web Vitals or an INP measurement.",
      };
    });
    await testInfo.attach("performance", { body: JSON.stringify(metrics, null, 2), contentType: "application/json" });
    expect(metrics.externalFonts).toBe(0);
    expect(metrics.cls).toBeLessThanOrEqual(0.1);
    expect(metrics.jsBytes).toBeLessThan(350_000);
  });
}


test("premium methodology opens by pointer and keyboard", async ({ page }) => {
  await page.goto("/");
  if (page.viewportSize()!.width <= 1100) await expect(page.getByRole("link", { name: "Escribir por WhatsApp", exact: true })).toBeVisible();
  const development = page.locator(".method-step").filter({ has: page.getByRole("heading", { name: "Desarrollo", exact: true }) });
  await development.locator("summary").click();
  await expect(development.locator("p")).toBeVisible();
  const validation = page.locator(".method-step").filter({ has: page.getByRole("heading", { name: "Validación", exact: true }) });
  await validation.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(validation.locator("p")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.locator(".orbit-rings").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
});
