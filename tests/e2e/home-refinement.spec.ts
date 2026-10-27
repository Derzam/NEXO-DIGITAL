import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("refined previews and solutions support pointer, keyboard and route discovery", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#servicios [data-ui]").first().click();
  await expect(page).toHaveURL("/servicios/sitios-corporativos");
  await page.goto("/");
  await expect(
    page.getByText("Interfaces demostrativas. Datos de ejemplo."),
  ).toBeVisible();
  await expect(
    page.getByText("Concepto de interfaz, sin datos de clientes."),
  ).toBeVisible();
  const tablist = page.getByRole("tablist", { name: "Soluciones por negocio" });
  const firstHeading = await page
    .getByRole("heading", { name: /Del catálogo/ })
    .boundingBox();
  for (const tab of await tablist.getByRole("tab").all()) {
    const box = await tab.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.y + box!.height).toBeLessThanOrEqual(firstHeading!.y);
  }
  const professional = page.getByRole("tab", {
    name: "Profesionales",
    exact: true,
  });
  await professional.click();
  await expect(professional).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: /De la consulta/ }),
  ).toBeVisible();
  await professional.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Equipos", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: /Menos pasos/ }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .getByRole("link", { name: "Explorar soluciones", exact: true })
    .click();
  await expect(page).toHaveURL("/soluciones");
});
