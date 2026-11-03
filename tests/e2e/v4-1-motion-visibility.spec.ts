import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

const evidenceRoot = path.join(
  process.cwd(),
  "docs/evidence/v4-1-motion-enhancement/runtime",
);

async function saveEvidence(
  testInfo: { project: { name: string } },
  name: string,
  page: import("@playwright/test").Page,
  fullPage = false,
) {
  const directory = path.join(evidenceRoot, testInfo.project.name);
  await fs.mkdir(directory, { recursive: true });
  await page.screenshot({
    path: path.join(directory, name),
    fullPage,
    animations: "allow",
  });
}

test("hero shows observable initial, middle, and final motion frames", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "La evidencia principal del hero se captura en escritorio.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("main > div[data-proposal] > section").first();
  const title = page.locator(".motion-hero-title");
  await expect(title).toBeVisible();

  const setFrame = async (progress: number) => {
    return title.evaluate((element, value) => {
      const animation = element
        .getAnimations()
        .find(
          (candidate) =>
            candidate instanceof CSSAnimation &&
            candidate.animationName === "motion-hero-rise",
        ) as CSSAnimation | undefined;
      if (!animation) throw new Error("No se encontró la animación motion-hero-rise");
      const timing = animation.effect?.getTiming();
      if (typeof timing?.duration !== "number") throw new Error("Duración de hero inválida");
      animation.pause();
      animation.currentTime = (timing.delay as number) + timing.duration * value;
      const style = getComputedStyle(element);
      return {
        opacity: Number(style.opacity),
        transform: style.transform,
        y: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42,
      };
    }, progress);
  };

  const initial = await setFrame(0);
  await saveEvidence(testInfo, "hero-initial.png", page);
  const middle = await setFrame(0.5);
  await saveEvidence(testInfo, "hero-middle.png", page);
  const final = await setFrame(1);
  await saveEvidence(testInfo, "hero-final.png", page);

  expect(initial.opacity).toBeLessThan(0.05);
  expect(Math.abs(initial.y)).toBeGreaterThanOrEqual(30);
  expect(middle.opacity).toBeGreaterThan(initial.opacity);
  expect(Math.abs(middle.y - initial.y)).toBeGreaterThan(8);
  expect(final.opacity).toBeGreaterThan(0.99);
  expect(Math.abs(final.y)).toBeLessThan(0.1);
  await expect(hero.getByRole("link", { name: "Explorar servicios" })).toBeEnabled();
  await expect(hero.getByRole("link", { name: /Cotizar proyecto/ })).toBeEnabled();
  await hero.getByRole("link", { name: "Explorar servicios" }).click();
  await expect(page).toHaveURL(/\/servicios$/);
});

test("scroll reveal records before, during, and after one real transition", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.locator("#preguntas");
  await expect(section).toHaveAttribute("data-motion", "pending");
  const before = await section.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      transform: style.transform,
      y: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42,
      opacity: style.opacity,
    };
  });
  expect(before.y).toBeGreaterThanOrEqual(30);
  await saveEvidence(testInfo, "reveal-before.png", page, true);

  await page.evaluate(() => {
    const target = document.querySelector<HTMLElement>("#preguntas");
    if (!target) throw new Error("No se encontró #preguntas");
    target.dataset.motionTestRuns = "0";
    target.addEventListener("transitionrun", (event) => {
      if (event.target === target && event.propertyName === "transform") {
        target.dataset.motionTestRuns = String(Number(target.dataset.motionTestRuns) + 1);
      }
    });
  });
  await page.evaluate(() => {
    const target = document.querySelector<HTMLElement>("#preguntas");
    if (!target) throw new Error("No se encontró #preguntas");
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4);
  });
  await expect(section).toHaveAttribute("data-motion", "visible");
  await expect(section).toHaveAttribute("data-motion-test-runs", "1");

  const transition = await section.evaluate((element) => {
    const animation = element
      .getAnimations()
      .find(
        (candidate) =>
          candidate instanceof CSSTransition &&
          candidate.transitionProperty === "transform",
      ) as CSSTransition | undefined;
    if (!animation) throw new Error("No se creó una transición CSS real para el reveal");
    const duration = Number(animation.effect?.getTiming().duration ?? 0);
    animation.pause();
    animation.currentTime = duration / 2;
    const transform = getComputedStyle(element).transform;
    return {
      duration,
      playState: animation.playState,
      transform,
      y: transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42,
    };
  });
  expect(transition.duration).toBeGreaterThanOrEqual(650);
  expect(transition.duration).toBeLessThanOrEqual(700);
  expect(Math.abs(transition.y)).toBeGreaterThan(2);
  expect(Math.abs(transition.y)).toBeLessThan(before.y);
  await saveEvidence(testInfo, "reveal-middle.png", page);

  const finishTransition = await section.evaluate((element) => {
    const animation = element
      .getAnimations()
      .find(
        (candidate) =>
          candidate instanceof CSSTransition &&
          candidate.transitionProperty === "transform",
      ) as CSSTransition | undefined;
    if (!animation) throw new Error("La transición de reveal se perdió antes del fotograma final");
    animation.currentTime = Number(animation.effect?.getTiming().duration ?? 0) + 1;
    const transform = getComputedStyle(element).transform;
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
  });
  expect(Math.abs(finishTransition)).toBeLessThan(0.1);
  await saveEvidence(testInfo, "reveal-final.png", page);

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  await section.scrollIntoViewIfNeeded();
  expect(await section.getAttribute("data-motion-test-runs")).toBe("1");

  if (testInfo.project.name === "desktop-1440") {
    const serviceSection = page.locator("#servicios");
    await page.evaluate(() => {
      const target = document.querySelector<HTMLElement>("#servicios");
      if (!target) throw new Error("No se encontró #servicios");
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4);
    });
    await expect(serviceSection).toHaveAttribute("data-motion", "visible");
    const card = serviceSection.locator(".proposal-grid-card").first();
    const stagger = await card.evaluate((element) => {
      const animation = element
        .getAnimations()
        .find(
          (candidate) =>
            candidate instanceof CSSTransition &&
            candidate.transitionProperty === "translate",
        ) as CSSTransition | undefined;
      return animation
        ? {
            duration: Number(animation.effect?.getTiming().duration ?? 0),
            delay: Number(animation.effect?.getTiming().delay ?? 0),
            translate: getComputedStyle(element).translate,
          }
        : null;
    });
    expect(stagger).not.toBeNull();
    expect(stagger?.duration).toBeGreaterThanOrEqual(500);
    expect(stagger?.duration).toBeLessThanOrEqual(650);
    expect(stagger?.translate).not.toBe("none");
  }
});

test("public service card gains depth on hover and returns at rest", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "El hover se mide solo con puntero fino de escritorio.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.locator("#servicios");
  await section.scrollIntoViewIfNeeded();
  const card = section.locator(".proposal-grid-card").first();
  await card.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const before = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      transform: style.transform,
      y: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42,
      borderColor: style.borderColor,
    };
  });
  await saveEvidence(testInfo, "card-rest.png", page);
  await card.hover();
  await page.waitForFunction(() => {
    const element = document.querySelector("#servicios .proposal-grid-card");
    if (!element) return false;
    const transform = getComputedStyle(element).transform;
    return (transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42) <= -5.5;
  });
  const hovered = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      transform: style.transform,
      y: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42,
      borderColor: style.borderColor,
      boxShadow: style.boxShadow,
    };
  });
  expect(hovered.y).toBeLessThanOrEqual(-5.5);
  expect(hovered.borderColor).not.toBe(before.borderColor);
  expect(hovered.boxShadow).not.toBe("none");
  await saveEvidence(testInfo, "card-hover.png", page);

  await page.mouse.move(0, 0);
  await page.waitForFunction(() => {
    const element = document.querySelector("#servicios .proposal-grid-card");
    if (!element) return false;
    const transform = getComputedStyle(element).transform;
    return Math.abs(transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42) < 0.1;
  });
  const restored = await card.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
  });
  expect(Math.abs(restored)).toBeLessThan(0.1);
});

test("reduced motion removes decorative animation and dynamically reveals pending content", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.locator("#preguntas");
  await expect(section).toHaveAttribute("data-motion", "pending");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("main section[data-motion='pending']")).toHaveCount(0);
  await expect(page.locator(".motion-hero-title")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explorar servicios" })).toBeVisible();
  const reduced = await page.evaluate(() => {
    const title = document.querySelector(".motion-hero-title");
    const ambient = document.querySelector(".cinematic-scene");
    const target = document.querySelector("#preguntas");
    return {
      heroAnimation: title ? getComputedStyle(title).animationName : null,
      ambientAnimation: ambient ? getComputedStyle(ambient, "::before").animationName : null,
      ambientOpacity: ambient ? getComputedStyle(ambient, "::before").opacity : null,
      pending: document.querySelectorAll("main section[data-motion='pending']").length,
      sectionTransform: target ? getComputedStyle(target).transform : null,
      sectionOpacity: target ? getComputedStyle(target).opacity : null,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  expect(reduced.heroAnimation).toBe("none");
  expect(reduced.ambientAnimation).toBe("none");
  expect(reduced.ambientOpacity).toBe("0");
  expect(reduced.pending).toBe(0);
  expect(reduced.sectionTransform).toBe("none");
  expect(reduced.sectionOpacity).toBe("1");
  expect(reduced.scrollBehavior).toBe("auto");
  await saveEvidence(testInfo, "reduced-motion.png", page);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("main section[data-motion='pending']")).toHaveCount(0);
  await expect(section).toHaveAttribute("data-motion", "visible");
});

test("public content and links remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "no-preference",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const route of ["/", "/servicios"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    const visibility = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll("main section"));
      return {
        hidden: sections.filter((section) => {
          const style = getComputedStyle(section);
          return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0;
        }).length,
        motionAttributes: document.querySelectorAll("main [data-motion]").length,
        links: Array.from(document.querySelectorAll("main a")).filter((link) =>
          getComputedStyle(link).visibility !== "hidden",
        ).length,
      };
    });
    expect(visibility.hidden, `hidden sections without JavaScript at ${route}`).toBe(0);
    expect(visibility.motionAttributes).toBe(0);
    expect(visibility.links).toBeGreaterThan(0);
  }
  await context.close();
});

test("Next.js Link navigation initializes one public observer and admin receives no enhancer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Explorar servicios" }).click();
  await expect(page).toHaveURL(/\/servicios$/);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("main section[data-motion='pending'], main section[data-motion='visible']").first()).toHaveCount(1);
  const servicePending = await page.locator("main section[data-motion='pending']").count();
  const serviceVisible = await page.locator("main section[data-motion='visible']").count();
  expect(servicePending + serviceVisible).toBeGreaterThan(0);
  await page.locator("main section[data-motion='pending']").first().scrollIntoViewIfNeeded();
  await expect(page.locator("main section[data-motion='visible']").first()).toBeVisible();

  await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Acceso Administrativo" })).toBeVisible();
  await expect(page.locator("[data-motion], .motion-hero-title")).toHaveCount(0);
});

test("desktop home retains automated WCAG 2.1 AA checks under reduced motion", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop-1440", "axe se ejecuta una vez en escritorio con movimiento reducido.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("record a short real-motion browser demonstration", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "El video de evidencia se graba una vez en escritorio.");
  const videoDirectory = path.join(evidenceRoot, "video");
  await fs.mkdir(videoDirectory, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
    recordVideo: { dir: videoDirectory, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".motion-hero-title")).toBeVisible();
  await page.locator(".motion-hero-title").evaluate(async (element) => {
    const animation = element
      .getAnimations()
      .find((candidate) => candidate instanceof CSSAnimation && candidate.animationName === "motion-hero-rise");
    if (animation) await animation.finished;
  });
  await page.locator("#servicios").scrollIntoViewIfNeeded();
  await expect(page.locator("#servicios")).toHaveAttribute("data-motion", "visible");
  const card = page.locator("#servicios .proposal-grid-card").first();
  await card.hover();
  await page.waitForFunction(() => {
    const element = document.querySelector("#servicios .proposal-grid-card");
    if (!element) return false;
    const transform = getComputedStyle(element).transform;
    return (transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42) <= -5.5;
  });
  const video = page.video();
  await context.close();
  if (video) {
    const source = await video.path();
    const destination = path.join(videoDirectory, "motion-demo.webm");
    await fs.rename(source, destination);
    expect((await fs.stat(destination)).size).toBeGreaterThan(10_000);
  } else {
    throw new Error("Playwright no generó el video de movimiento real");
  }
});
