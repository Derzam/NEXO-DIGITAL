import { expect, test } from "@playwright/test";

test("customers can prepare a review but nothing is published or sent automatically", async ({ page }) => {
  await page.addInitScript(() => { window.open = () => null; });
  await page.goto("/");
  const section = page.locator("#resenas");
  await expect(section.getByRole("heading", { name: "Tu experiencia también cuenta." })).toBeVisible();
  await expect(section.getByRole("heading", { name: "Comparte tu opinión" })).toBeVisible();
  await expect(section.locator("figure")).toHaveCount(0);

  await section.getByLabel("Tu nombre").fill("Ana Prueba");
  await section.getByLabel("Empresa o proyecto").fill("Proyecto de prueba");
  await section.getByLabel("Cuéntanos tu experiencia").fill("La comunicación fue clara, aunque hay oportunidades de mejora.");

  await section.getByRole("button", { name: "Preparar reseña por WhatsApp" }).click();
  await expect(section.getByRole("alert")).toContainText("Selecciona una calificación");
  await section.getByRole("radio", { name: "4 estrellas" }).check();
  await section.getByRole("checkbox", { name: /Autorizo que Nexo publique/ }).check();
  await section.getByRole("button", { name: "Preparar reseña por WhatsApp" }).click();

  await expect(section.getByRole("status")).toContainText("pulsa enviar en WhatsApp");
  const href = await section.getByRole("link", { name: "Abrir mensaje en WhatsApp" }).getAttribute("href");
  const url = new URL(href!);
  expect(url.origin).toBe("https://wa.me");
  expect(url.pathname).toBe("/593984447960");
  const text = url.searchParams.get("text")!;
  expect(text).toContain("Nombre: Ana Prueba");
  expect(text).toContain("Empresa o proyecto: Proyecto de prueba");
  expect(text).toContain("Calificación: 4/5");
  expect(text).toContain("¿Autorizo publicar mi nombre, empresa si la indiqué, calificación y opinión?: Sí");

  // The consent is optional and an unapproved comment must not be listed publicly.
  await section.getByRole("checkbox", { name: /Autorizo que Nexo publique/ }).uncheck();
  await section.getByRole("button", { name: "Preparar reseña por WhatsApp" }).click();
  const privateHref = await section.getByRole("link", { name: "Abrir mensaje en WhatsApp" }).getAttribute("href");
  expect(new URL(privateHref!).searchParams.get("text")).toContain("opinión?: No");
  await expect(section.locator("figure")).toHaveCount(0);
});

test("reviews section is responsive and uses no invented testimonials", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#resenas")).toBeVisible();
  await expect(page.locator("#resenas figure")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
