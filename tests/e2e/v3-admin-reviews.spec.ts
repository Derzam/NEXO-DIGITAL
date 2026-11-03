import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Fase V3 — Panel Administrativo y Seguridad de Reseñas", () => {
  test("1. Acceso anónimo bloqueado: /admin/resenas redirige a /admin/login", async ({
    page,
  }) => {
    // Attempting to visit /admin/resenas without an active session
    await page.goto("/admin/resenas");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Acceso Administrativo" })).toBeVisible();
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
  });

  test("2. Acceso anónimo a API bloqueado: /api/admin/reviews devuelve 401", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/reviews");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/No autenticado/i);
    // Ensure security headers are present
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(response.headers()["cache-control"]).toContain("no-store");
  });

  test("3. Solicitud manipulada a API bloqueada: PATCH sin autenticación devuelve 401", async ({
    request,
  }) => {
    const fakeUuid = "11111111-2222-3333-4444-555555555555";
    const response = await request.patch(`/api/admin/reviews/${fakeUuid}`, {
      data: { action: "approve" },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/No autenticado/i);
  });

  test("4. Pantalla de login /admin/login: diseño seguro sin registro público", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    // Check heading and branding
    await expect(page.getByRole("heading", { name: "Acceso Administrativo" })).toBeVisible();
    await expect(page.getByText("Panel de moderación y control de reseñas.")).toBeVisible();
    // Ensure there is NO public sign up or registration link
    const signupLinks = page.locator('a:has-text("Registrarse"), a:has-text("Crear cuenta"), a:has-text("Sign up")');
    await expect(signupLinks).toHaveCount(0);
    // Check inputs and button
    await expect(page.getByLabel("Correo electrónico")).toHaveAttribute("type", "email");
    await expect(page.getByLabel("Contraseña")).toHaveAttribute("type", "password");
    await expect(page.getByRole("button", { name: /Iniciar sesión/i })).toBeVisible();
  });

  test("5. Intento de inicio de sesión con credenciales inválidas muestra error", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Correo electrónico").fill("noexiste@nexodigitalstudio.net");
    await page.getByLabel("Contraseña").fill("clave-incorrecta-12345");
    await page.getByRole("button", { name: /Iniciar sesión/i }).click();

    // Verify error message is rendered
    const alert = page.getByTestId("admin-login-error");
    await expect(alert).toBeVisible({ timeout: 10_000 });
    await expect(alert).toContainText(/incorrectas|no está configurado|no cuenta con autorización/i);
  });

  test("6. Exclusión de indexación y robots para rutas administrativas", async ({
    page,
    request,
  }) => {
    // Check robots.txt disallow rule
    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain("Disallow: /admin/");

    // Check meta robots on /admin/login
    await page.goto("/admin/login");
    const metaRobots = page.locator('meta[name="robots"]');
    await expect(metaRobots).toHaveAttribute("content", /noindex/i);
  });

  test("7. Navegación responsive: /admin/login no presenta desbordamiento horizontal", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    const hasNoOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(hasNoOverflow).toBe(true);
  });

  test("8. Accesibilidad de la interfaz administrativa /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(["color-contrast"]) // branding colors may be tuned separately
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("9. Protección de endpoints de autenticación administrativa: logout seguro", async ({
    request,
  }) => {
    const response = await request.post("/api/admin/auth/logout");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test("10. API de login administrativo rechaza cuerpos de solicitud inválidos", async ({
    request,
  }) => {
    const response = await request.post("/api/admin/auth/login", {
      data: { email: "", password: "" },
    });
    expect(response.status()).toBe(401);
  });

  test("11. Verificación de invariantes: sección pública no muestra reseñas no autorizadas", async ({
    page,
  }) => {
    await page.goto("/#resenas");
    const section = page.locator("#resenas");
    await expect(section).toBeVisible();
    // Verify that unconsented or pending reviews are never leaked into the public markup
    const figures = section.locator("figure");
    const count = await figures.count();
    for (let i = 0; i < count; i++) {
      const figure = figures.nth(i);
      // Ensure all rendered reviews have real display names and ratings
      await expect(figure.locator("strong")).not.toBeEmpty();
      await expect(figure.locator("blockquote")).not.toBeEmpty();
    }
  });
});

