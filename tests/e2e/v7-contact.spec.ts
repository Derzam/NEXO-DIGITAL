import { test, expect } from "@playwright/test";

test("budget choices have unambiguous boundaries and the handoff requires manual sending", async ({ page }) => {
  await page.addInitScript(() => { window.open = () => null; });
  await page.goto("/contacto");
  const budget = page.getByLabel("Presupuesto estimado");
  await expect(budget.locator("option")).toHaveText([
    "Prefiero conversar", "Menos de USD 500", "Desde USD 500 hasta menos de USD 1.500",
    "Desde USD 1.500 hasta menos de USD 5.000", "USD 5.000 o más",
  ]);
  await budget.selectOption("Desde USD 1.500 hasta menos de USD 5.000");
  await expect(page.locator("#presupuesto-seleccionado")).toHaveText("Presupuesto seleccionado: Desde USD 1.500 hasta menos de USD 5.000");
  await budget.selectOption("");
  await expect(page.locator("#presupuesto-seleccionado")).toHaveCount(0);
  await page.getByRole("button", { name: "Preparar solicitud por WhatsApp" }).click();
  await expect(page.locator("#nombre")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#nombre")).toHaveAttribute("aria-describedby", "nombre-error");
  await page.getByLabel("Nombre completo").fill("Ana Prueba");
  await page.getByLabel("Correo electrónico").fill("qa@example.com");
  await page.getByLabel("Servicio que necesitas").selectOption({ label: "Landing pages" });
  await page.getByLabel("Cuéntanos sobre tu proyecto").fill("Una descripción de proyecto de prueba.");
  await page.getByRole("button", { name: "Preparar solicitud por WhatsApp" }).click();
  await expect(page.getByRole("status")).toContainText("pulsa enviar en WhatsApp");
  const url = new URL((await page.getByRole("link", { name: "abrir la solicitud en WhatsApp" }).getAttribute("href"))!);
  expect(url.pathname).toBe("/593984447960");
  expect(url.searchParams.get("text")).not.toContain("Presupuesto orientativo:");
});
