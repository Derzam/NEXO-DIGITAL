import { expect, test } from "@playwright/test";

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
