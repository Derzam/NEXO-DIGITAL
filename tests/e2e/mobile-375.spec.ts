import { expect, test, type Locator } from "@playwright/test";

test("375 × 667: hero and mobile menu remain usable", async ({ page }, testInfo) => {
  await page.route("**/_vercel/insights/script.js", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator("main > div[data-proposal] > section").first();
  const title = hero.getByRole("heading", { level: 1 });
  const primary = hero.getByRole("link", { name: "Explorar servicios", exact: true });
  const secondary = hero.getByRole("link", { name: "Cotizar proyecto", exact: true });
  const menu = page.getByRole("button", { name: "Abrir menú" });
  const headerContact = page.getByRole("link", { name: "Escribir por WhatsApp" });
  const header = await page.locator("header").first().boundingBox();
  expect(header).not.toBeNull();

  async function withinViewport(element: Locator, minSize = 0) {
    await expect(element).toBeVisible();
    const box = await element.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(667);
    expect(box!.width).toBeGreaterThanOrEqual(minSize);
    expect(box!.height).toBeGreaterThanOrEqual(minSize);
    return box!;
  }

  const titleBox = await withinViewport(title);
  const primaryBox = await withinViewport(primary, 44);
  const secondaryBox = await withinViewport(secondary, 44);
  await withinViewport(menu, 44);
  await withinViewport(headerContact, 44);
  expect(titleBox.y).toBeGreaterThanOrEqual(header!.y + header!.height);
  expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(primaryBox.y);
  expect(primaryBox.y + primaryBox.height).toBeLessThanOrEqual(secondaryBox.y);
  for (const link of [primary, secondary]) {
    expect(await link.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return hit !== null && element.contains(hit);
    })).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await page.screenshot({ path: testInfo.outputPath("hero-375.png"), animations: "disabled" });

  const closingLine = hero.locator(".proposal-container > div:last-child p");
  const initialClosingBox = await closingLine.boundingBox();
  expect(initialClosingBox).not.toBeNull();
  await testInfo.attach("closing-line-position", { body: JSON.stringify({ top: initialClosingBox!.y, bottom: initialClosingBox!.y + initialClosingBox!.height, viewportHeight: 667 }), contentType: "application/json" });
  await closingLine.scrollIntoViewIfNeeded();
  const closingBox = await withinViewport(closingLine);
  expect(closingBox.y).toBeGreaterThanOrEqual(header!.height);

  await page.goto("/");
  await menu.tap();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await withinViewport(dialog.getByRole("button", { name: "Cerrar menú" }), 44);
  const links = dialog.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link");
  await expect(links).toHaveCount(7);
  let previousBottom = 0;
  for (let i = 0; i < 7; i++) {
    const box = await withinViewport(links.nth(i), 44);
    expect(box.y).toBeGreaterThanOrEqual(previousBottom);
    previousBottom = box.y + box.height;
  }
  const quote = await withinViewport(dialog.getByRole("link", { name: "Cotizar proyecto" }), 44);
  expect(quote.y).toBeGreaterThanOrEqual(previousBottom);
  expect(quote.y + quote.height).toBeLessThanOrEqual(667 - 16);
  await page.screenshot({ path: testInfo.outputPath("menu-375.png"), animations: "disabled" });
  await dialog.getByRole("button", { name: "Cerrar menú" }).tap();
  await expect(dialog).toBeHidden();
  await menu.tap();
  await expect(dialog).toBeVisible();
  await links.filter({ hasText: "Servicios" }).tap();
  await expect(page).toHaveURL(/\/servicios$/);
  await expect(dialog).toBeHidden();
});
