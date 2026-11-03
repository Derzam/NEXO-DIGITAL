import { expect, test } from "@playwright/test";

test.describe("Fase V3 — Invariantes de Negocio y Validación del Backend", () => {
  test("1. Validación de identificador de reseña: UUID malformado es rechazado", async ({
    request,
  }) => {
    // Attempting to send an invalid UUID
    const response = await request.patch("/api/admin/reviews/not-a-valid-uuid", {
      data: { action: "approve" },
    });
    // Should be rejected with 401 (if unauthenticated) or 400 (if authenticated)
    expect([400, 401]).toContain(response.status());
  });

  test("2. Validación de acción de moderación: acciones arbitrarias son rechazadas", async ({
    request,
  }) => {
    const fakeUuid = "12345678-1234-4234-8234-123456789abc";
    const response = await request.patch(`/api/admin/reviews/${fakeUuid}`, {
      data: { action: "delete_table" },
    });
    expect([400, 401]).toContain(response.status());
  });

  test("3. Seguridad de cabeceras en rutas administrativas: noindex y no-store", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/reviews");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(response.headers()["cache-control"]).toContain("no-store");
  });

  test("4. Falla segura ante falta de configuración", async ({ request }) => {
    // When requesting without valid admin session, fails closed immediately
    const res = await request.get("/api/admin/reviews?status=pending");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
    // Verify no customer names, comments, or data are exposed
    expect(body.reviews).toBeUndefined();
    expect(body.stats).toBeUndefined();
  });
});

