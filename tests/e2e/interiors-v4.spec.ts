import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("industry quotations preserve all six specific contexts", async ({ page }) => {
  await page.goto("/soluciones");
  const industries = ["Restaurantes y comercios", "Taxis y flotas", "Delivery y logística", "Profesionales", "Equipos empresariales", "Emprendedores"];
  const links = page.getByRole("link", { name: "Consultar solución", exact: true });
  await expect(links).toHaveCount(industries.length);
  for (let index = 0; index < industries.length; index++) {
    const article = page.getByRole("article").filter({ has: page.getByRole("heading", { name: industries[index], exact: true }) });
    const link = article.getByRole("link", { name: "Consultar solución", exact: true });
    const url = new URL((await link.getAttribute("href"))!);
    expect(url.origin + url.pathname).toBe("https://wa.me/593984447960");
    expect(url.searchParams.get("text")).toBe("Hola, me interesa una solución digital para " + industries[index] + ".");
    await link.focus();
    await expect(link).toBeFocused();
    await expect(article.locator("figcaption")).toContainText("Concepto de interfaz");
  }
  await page.goto("/portafolio");
  await expect(page.locator(".interior-portfolio-layout figcaption")).toContainText("Concepto de diseño y exploración");
  await expect(page.getByRole("heading", { name: "Casos de estudio reales." })).toBeVisible();
  await expect(page.getByText("Esta sección permanece en preparación", { exact: false })).toBeVisible();
  await page.locator(".interior-portfolio-layout").getByRole("link", { name: "Cotizar proyecto", exact: true }).click();
  await expect(page).toHaveURL("/contacto");
});

test("about methodology supports keyboard and blog preserves its empty state", async ({ page }, testInfo) => {
  await page.goto("/nosotros");
  const validation = page.getByRole("button", { name: "Validación", exact: true });
  await validation.focus();
  await page.keyboard.press("Enter");
  await expect(validation).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Probamos los recorridos principales antes de la entrega.")).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await testInfo.attach("accessibility", { body: JSON.stringify(accessibility.violations), contentType: "application/json" });
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press("Enter");
  await expect(validation).toHaveAttribute("aria-expanded", "false");
  await expect(validation).toBeFocused();
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: "Ideas en camino." })).toBeVisible();
  await expect(page.getByText("Contenido editorial en preparación.")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await page.getByRole("link", { name: "Explora nuestros servicios", exact: true }).click();
  await expect(page).toHaveURL("/servicios");
});

test("contact inline errors are announced and native fields keep keyboard order", async ({ page }, testInfo) => {
  await page.goto("/contacto");
  await page.getByRole("button", { name: "Preparar solicitud por WhatsApp" }).click();
  const name = page.getByLabel("Nombre completo");
  await expect(name).toBeFocused();
  await expect.poll(() => page.locator('label[for="nombre"]').evaluate(label => label.getBoundingClientRect().top - document.querySelector("header")!.getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(0);
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "nombre-error");
  await expect(page.locator("#nombre-error")).toHaveAttribute("role", "alert");
  await expect(page.locator("#nombre-error")).toHaveText("Completa este campo.");
  await name.fill("QA de prueba");
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Correo electrónico")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Servicio que necesitas")).toBeFocused();
  const fieldContrast = await name.evaluate(element => {
    const style = getComputedStyle(element);
    const surrounding = getComputedStyle(element.closest(".interior-form-panel")!);
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const border = luminance(style.borderTopColor);
    return Math.min(...[style.backgroundColor, surrounding.backgroundColor].map(color => {
      const background = luminance(color);
      return (Math.max(border, background) + 0.05) / (Math.min(border, background) + 0.05);
    }));
  });
  expect(fieldContrast).toBeGreaterThanOrEqual(3);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await testInfo.attach("accessibility", { body: JSON.stringify(accessibility.violations), contentType: "application/json" });
  expect(accessibility.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("premium shell, current navigation, menu accessibility and 404 are consistent", async ({ page }, testInfo) => {
  const mobile = testInfo.project.name !== "desktop-1440";
  for (const [route, label, current] of [["/servicios/landing-pages", "Servicios", "location"], ["/soluciones", "Soluciones", "page"], ["/blog", "Blog", "page"], ["/contacto", "Contacto", "page"]]) {
    await page.goto(route);
    await expect(page.locator("header")).toHaveClass(/proposal-shell/);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("header img")).toHaveAttribute("src", "/images/nexo-wordmark.webp");
    if (mobile) await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
    const nav = page.getByRole("navigation", { name: mobile ? "Navegación móvil" : "Navegación principal", exact: true });
    await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", current);
    if (mobile) {
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Abrir menú", exact: true })).toBeFocused();
    }
  }
  if (mobile) await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  const menuAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await testInfo.attach("accessibility-menu", { body: JSON.stringify(menuAxe.violations), contentType: "application/json" });
  expect(menuAxe.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await page.goto("/no-existe");
  expect(response?.status()).toBe(404);
  await expect(page.locator("header")).toHaveClass(/proposal-shell/);
  await expect(page.locator("footer")).toHaveClass(/proposal-shell/);
  const notFoundAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await testInfo.attach("accessibility-404", { body: JSON.stringify(notFoundAxe.violations), contentType: "application/json" });
  expect(notFoundAxe.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Volver al inicio" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/");
});

test("all nine services retain exact quotations and catalog discovery", async ({ page }) => {
  const services = [["landing-pages", "Landing pages"], ["sitios-corporativos", "Sitios web corporativos"], ["sistemas-web", "Sistemas web a medida"], ["aplicaciones-moviles", "Aplicaciones móviles"], ["inteligencia-artificial", "Inteligencia artificial"], ["automatizacion", "Automatización con n8n"], ["auditoria-qa", "Auditoría y QA de software"], ["seo", "SEO y optimización"], ["integraciones", "APIs e integraciones"]];
  for (const [slug, title] of services) {
    await page.goto("/servicios/" + slug);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    const link = page.getByRole("link", { name: "Cotizar este servicio", exact: true });
    const url = new URL((await link.getAttribute("href"))!);
    expect(url.origin + url.pathname).toBe("https://wa.me/593984447960");
    expect(url.searchParams.get("text")).toBe("Hola, quiero cotizar el servicio de " + title + " con Nexo Digital Studio.");
    await expect(page.getByRole("link", { name: "Todos los servicios", exact: true })).toHaveAttribute("href", "/servicios");
  }
});
