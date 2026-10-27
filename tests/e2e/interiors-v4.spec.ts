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
  await expect(page.locator("figcaption")).toContainText("Demostración conceptual");
  await expect(page.getByText("Este espacio permanece en preparación", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: "Conversemos sobre tu proyecto" }).click();
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
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await testInfo.attach("accessibility", { body: JSON.stringify(accessibility.violations), contentType: "application/json" });
  expect(accessibility.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
