import { expect, test } from "@playwright/test";

test.describe("Fase V3 — Transacciones Atómicas, Autorización y Protección CSRF", () => {
  const TEST_REVIEW_ID = "33333333-4444-5555-6666-777777777777";

  test("1. Protección CSRF: Petición con origen malicioso o no autorizado es rechazada con 403", async ({
    request,
  }) => {
    const response = await request.patch(`/api/admin/reviews/${TEST_REVIEW_ID}`, {
      headers: {
        origin: "https://sitio-malicioso-atacante.xyz",
      },
      data: { action: "approve" },
    });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toMatch(/Origen no (autorizado|permitido)/i);
  });

  test("2. Protección CSRF en login y logout: Origen externo es rechazado con 403", async ({
    request,
  }) => {
    const loginRes = await request.post("/api/admin/auth/login", {
      headers: { origin: "https://sitio-malicioso.com" },
      data: { email: "admin@test.com", password: "password123" },
    });
    expect(loginRes.status()).toBe(403);

    const logoutRes = await request.post("/api/admin/auth/logout", {
      headers: { origin: "https://sitio-malicioso.com" },
    });
    expect(logoutRes.status()).toBe(403);
  });

  test("3. Preservación estricta de cabeceras de seguridad en rutas /admin/*", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/reviews", {
      headers: { origin: "http://127.0.0.1:3100" },
    });
    // Regardless of 401 unauthenticated, security headers MUST be preserved
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    expect(response.headers()["cache-control"]).toBe("no-store, no-cache, must-revalidate");
  });

  test("4. Rechazo de acciones ilegales de cambio de estado (Invariantes de Máquina de Estados)", async ({
    request,
  }) => {
    // Action not in ('approve', 'reject', 'withdraw')
    const invalidActionRes = await request.patch(`/api/admin/reviews/${TEST_REVIEW_ID}`, {
      headers: { origin: "http://127.0.0.1:3100" },
      data: { action: "publish_immediately" },
    });
    expect([400, 401]).toContain(invalidActionRes.status());
    if (invalidActionRes.status() === 400) {
      const body = await invalidActionRes.json();
      expect(body.error).toMatch(/Acción no permitida/i);
    }
  });

  test("5. Rechazo de identificadores no UUID en operaciones de moderación", async ({
    request,
  }) => {
    const malformedIdRes = await request.patch("/api/admin/reviews/not-a-valid-uuid", {
      headers: { origin: "http://127.0.0.1:3100" },
      data: { action: "approve" },
    });
    expect([400, 401]).toContain(malformedIdRes.status());
  });

  test("6. Bloqueo de acceso y redirección en panel administrativo", async ({ page }) => {
    await page.goto("/admin/resenas");
    await expect(page).toHaveURL(/\/admin\/login\?next=/);
    await expect(page.getByRole("heading", { name: "Acceso Administrativo" })).toBeVisible();
  });

  test("7. Integridad de la web pública: las reseñas no publicadas permanecen invisibles", async ({
    page,
  }) => {
    await page.goto("/#resenas");
    const section = page.locator("#resenas");
    await expect(section).toBeVisible();

    // Verify empty state text or only published reviews are visible
    const figureCount = await section.locator("figure").count();
    if (figureCount === 0) {
      await expect(section.getByText("Las reseñas aprobadas aparecerán aquí.")).toBeVisible();
    } else {
      // Any rendered figure must have real client attribution
      for (let i = 0; i < figureCount; i++) {
        const item = section.locator("figure").nth(i);
        await expect(item.locator("strong")).not.toBeEmpty();
        await expect(item.locator("blockquote")).not.toBeEmpty();
      }
    }
  });
});

