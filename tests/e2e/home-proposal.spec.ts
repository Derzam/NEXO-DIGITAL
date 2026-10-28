import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("cinematic hero keeps enough image resolution for portrait crops", async ({
  page,
}) => {
  await page.goto("/");
  const scene = page.locator(".cinematic-scene img");
  await scene.evaluate((element) => (element as HTMLImageElement).decode());
  await expect(scene).toHaveAttribute("src", "/images/nexo-threshold.webp");
  expect(
    await scene.evaluate(
      (element) => (element as HTMLImageElement).naturalWidth,
    ),
  ).toBe(1600);
});

test("390px hero keeps both actions and its closing line within the first viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.goto("/");
  const hero = page.locator("main > div[data-proposal] > section").first();
  await expect(hero.getByRole("link", { name: "Explorar servicios" })).toBeVisible();
  await expect(hero.getByRole("link", { name: "Cotizar proyecto" })).toBeVisible();
  const layout = await hero.evaluate((section) => {
    const closingLine = section.querySelector(".proposal-container > div:last-child p")!;
    return {
      sectionHeight: section.getBoundingClientRect().height,
      closingLineBottom: closingLine.getBoundingClientRect().bottom,
      viewportHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });
  expect(layout.sectionHeight).toBeLessThan(800);
  expect(layout.closingLineBottom).toBeLessThanOrEqual(layout.viewportHeight);
  expect(layout.documentWidth).toBe(layout.viewportWidth);
});

test("service families support selection and keyboard", async ({ page }) => {
  await page.goto("/");
  const software = page.getByRole("tab", { name: "Sistemas", exact: true });
  await software.click();
  await expect(software).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: "Software que sigue tu ritmo." }),
  ).toBeVisible();
  await software.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "IA y flujos", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: "Más tiempo para lo importante." }),
  ).toBeVisible();
  await expect(
    page.locator('a[href="/servicios/automatizacion"]'),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("FAQ exposes answers and collapses with keyboard", async ({ page }) => {
  await page.goto("/");
  const question = page.getByRole("button", {
    name: "¿Cómo se define el precio?",
    exact: true,
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText(
      "Depende del alcance, las funciones, las integraciones y los materiales disponibles. La cotización se prepara después de revisar esos requisitos.",
    ),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  const focusableCount = await page.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
  for (let index = 0; index < focusableCount; index++) {
    if (await question.evaluate(element => element === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(question).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
});

test("portfolio area remains honest and links to the existing route", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Estamos preparando casos de estudio para compartir qué había que resolver, cómo lo abordamos y qué aprendimos.",
    ),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Conocer el portafolio", exact: true })
    .click();
  await expect(page).toHaveURL("/portafolio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Trabajo con propósito.",
  );
});
