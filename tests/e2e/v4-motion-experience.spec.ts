import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes = [
  "/",
  "/servicios",
  "/servicios/sitios-corporativos",
  "/soluciones",
  "/portafolio",
  "/nosotros",
  "/blog",
  "/contacto",
];

test("hero, navigation and CTAs remain visible and usable", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("main > div[data-proposal] > section").first();
  await expect(hero.getByRole("heading", { level: 1, name: /Construye/ })).toBeVisible();
  await expect(hero.getByRole("link", { name: "Explorar servicios" })).toBeVisible();
  await expect(hero.getByRole("link", { name: /Cotizar proyecto/ })).toBeVisible();
  await hero.getByRole("link", { name: "Explorar servicios" }).click();
  await expect(page).toHaveURL(/\/servicios$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/");
  await page.getByRole("link", { name: "Explora Nexo" }).click();
  await expect(page).toHaveURL(/#servicios$/);
});

test("below-the-fold reveal completes and a keyboard focus reveals its section", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile-375", "Este viewport ejecuta toda la suite con reduced motion.");
  await page.goto("/");
  const scrollSection = page.locator("#preguntas");
  await expect(scrollSection).toHaveAttribute("data-motion", "pending");
  await scrollSection.scrollIntoViewIfNeeded();
  await expect(scrollSection).toHaveAttribute("data-motion", "visible");

  await page.goto("/");
  const keyboardSection = page.locator("#conversemos");
  await expect(keyboardSection).toHaveAttribute("data-motion", "pending");
  const focusable = keyboardSection.getByRole("link").first();
  await focusable.focus();
  await expect(keyboardSection).toHaveAttribute("data-motion", "visible");
  await expect(focusable).toBeFocused();
});

test("reduced motion disables motion and keeps all page content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main section[data-motion='pending']")).toHaveCount(0);
  const heroTitle = page.locator(".motion-hero-title");
  await expect(heroTitle).toBeVisible();
  expect(await heroTitle.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  expect(await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe("auto");
});

test("public routes have no horizontal overflow and no automated accessibility violations on home", async ({ page }) => {
  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth, `horizontal overflow at ${route}`).toBeLessThanOrEqual(dimensions.viewportWidth);
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("server-rendered content and CTA remain available when JavaScript is disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Construye/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explorar servicios" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lo que imaginas. Lo que hacemos." })).toBeVisible();
  await context.close();
});
