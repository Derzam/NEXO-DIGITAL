import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("project references, images, quotation links and portfolio work", async ({ page, context }, testInfo) => {
  await context.route("https://wa.me/**", route => route.fulfill({ status: 200, contentType: "text/plain", body: "WhatsApp handoff captured by QA" }));
  await page.goto("/servicios");
  const section = page.locator("#proyectos-referencia");
  await expect(section.getByRole("heading", { name: "Sistemas web y aplicaciones a medida" })).toBeVisible();
  const cards = section.locator("article");
  await expect(cards).toHaveCount(2);
  const projects = [
    { name: "ORVENTI", cta: "Solicitar un sistema similar", message: "sistema web empresarial similar a ORVENTI" },
    { name: "LlevaKí", cta: "Solicitar una plataforma similar", message: "plataforma web y aplicaciones móviles similares a LlevaKí" },
  ];
  for (const project of projects) {
    const card = cards.filter({ has: page.getByRole("heading", { name: project.name, exact: true }) });
    await expect(card).toBeVisible();
    const image = card.locator("img");
    await expect(image).toBeVisible();
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const link = card.getByRole("link", { name: project.cta });
    const url = new URL((await link.getAttribute("href"))!);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/593984447960");
    expect(url.searchParams.get("text")).toContain(project.message);
    expect(await link.getAttribute("target")).toBe("_blank");
    expect(await link.getAttribute("rel")).toContain("noopener");
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    const popupPromise = page.waitForEvent("popup");
    await page.keyboard.press("Enter");
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toBe(url.href);
    await popup.close();
  }
  await expect(section.getByText("Captura de referencia; nombres y valoraciones de demostración.")).toBeVisible();
  const layout = await cards.evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, right: rect.right, y: rect.y, bottom: rect.bottom };
  }));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(layout.every(box => box.x >= 0 && box.right <= testInfo.project.use.viewport!.width)).toBe(true);
  if (testInfo.project.use.viewport!.width < 1024) expect(layout[1].y).toBeGreaterThanOrEqual(layout[0].bottom);
  else expect(Math.abs(layout[1].y - layout[0].y)).toBeLessThan(2);
  expect((await new AxeBuilder({ page }).include("#proyectos-referencia").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);

  await page.goto("/portafolio");
  await expect(page.getByRole("heading", { name: "Tecnología en contexto." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ORVENTI", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "LlevaKí", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Estudio conceptual." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Casos de estudio reales." })).toBeVisible();
  const references = page.locator('[aria-labelledby="portfolio-reference-title"]');
  for (const image of await references.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  expect((await new AxeBuilder({ page }).include('[aria-labelledby="portfolio-reference-title"]').withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "Ver referencias en servicios" }).first().click();
  await expect(page).toHaveURL(/\/servicios#proyectos-referencia$/);
});
