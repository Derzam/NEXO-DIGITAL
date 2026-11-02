import { expect, test } from "@playwright/test";

test("reviews UI is ready for persistent moderation without showing fabricated entries", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#resenas");
  await expect(section.getByRole("heading", { name: "Tu experiencia también cuenta." })).toBeVisible();
  await expect(section.getByRole("heading", { name: "Comparte tu opinión" })).toBeVisible();
  await expect(section.getByText("Las reseñas aprobadas aparecerán aquí.")).toBeVisible();
  await expect(section.locator("figure")).toHaveCount(0);
  await expect(section.getByRole("checkbox", { name: /almacenamiento y tratamiento/ })).toBeVisible();
  await expect(section.getByRole("checkbox", { name: /Autorizo que Nexo publique/ })).toBeVisible();
  await expect(section.getByRole("button", { name: "Enviar reseña para revisión" })).toBeDisabled();
  await expect(section.getByText(/preparando el envío directo/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("reviews API fails closed without Supabase, CAPTCHA and explicit activation", async ({ request }) => {
  const response = await request.post("/api/reviews", {
    headers: { origin: "http://localhost:3000" },
    data: {
      name: "Ana Prueba",
      rating: 5,
      comment: "La comunicación fue clara y la atención resultó satisfactoria.",
      publicationConsent: true,
      privacyConsent: true,
      turnstileToken: "not-a-real-token",
    },
  });
  expect(response.status()).toBe(503);
  expect((await response.json()).message).toMatch(/todavía no está habilitado/i);
});
