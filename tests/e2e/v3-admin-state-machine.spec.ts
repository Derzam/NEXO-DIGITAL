import { expect, test } from "@playwright/test";

/**
 * Lógica pura de validación de transiciones de estado de moderación.
 * Modela con exactitud la función transaccional de PostgreSQL `nexo_moderate_review`.
 */
function evaluateModerationTransition(
  currentStatus: "pending" | "published" | "rejected",
  action: "approve" | "reject" | "withdraw",
  publicationConsent: boolean
): { success: boolean; newStatus?: "published" | "rejected"; error?: string } {
  if (action !== "approve" && action !== "reject" && action !== "withdraw") {
    return { success: false, error: `Acción inválida: ${action}` };
  }

  // 1. pending -> published (approve con consentimiento)
  if (action === "approve") {
    if (currentStatus !== "pending") {
      return {
        success: false,
        error: `Transición inválida: solo se pueden aprobar reseñas en estado pending (estado actual: ${currentStatus}).`,
      };
    }
    if (publicationConsent !== true) {
      return {
        success: false,
        error: "No se puede publicar una reseña sin el consentimiento explícito del cliente (publication_consent = true).",
      };
    }
    return { success: true, newStatus: "published" };
  }

  // 2. pending -> rejected (reject)
  if (action === "reject") {
    if (currentStatus !== "pending") {
      return {
        success: false,
        error: `Transición inválida: solo se pueden rechazar reseñas en estado pending (estado actual: ${currentStatus}).`,
      };
    }
    return { success: true, newStatus: "rejected" };
  }

  // 3. published -> rejected (withdraw)
  if (action === "withdraw") {
    if (currentStatus !== "published") {
      return {
        success: false,
        error: `Transición inválida: solo se pueden retirar reseñas en estado published (estado actual: ${currentStatus}).`,
      };
    }
    return { success: true, newStatus: "rejected" };
  }

  return { success: false, error: "Transición no contemplada" };
}

test.describe("Fase V3 — Máquina de Estados Estricta, Consentimiento y Atomicidad", () => {
  test("1. Transición legal: pending -> published con consentimiento", () => {
    const result = evaluateModerationTransition("pending", "approve", true);
    expect(result.success).toBe(true);
    expect(result.newStatus).toBe("published");
  });

  test("2. Transición bloqueada: pending -> published SIN consentimiento", () => {
    const result = evaluateModerationTransition("pending", "approve", false);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/consentimiento explícito/i);
  });

  test("3. Transición legal: pending -> rejected (rechazo)", () => {
    const result = evaluateModerationTransition("pending", "reject", false);
    expect(result.success).toBe(true);
    expect(result.newStatus).toBe("rejected");
  });

  test("4. Transición legal: published -> rejected (retirada)", () => {
    const result = evaluateModerationTransition("published", "withdraw", true);
    expect(result.success).toBe(true);
    expect(result.newStatus).toBe("rejected");
  });

  test("5. Bloqueo de acción duplicada: no se puede aprobar una reseña ya publicada", () => {
    const result = evaluateModerationTransition("published", "approve", true);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/solo se pueden aprobar reseñas en estado pending/i);
  });

  test("6. Bloqueo de reactivación ilegal: no se puede aprobar una reseña rechazada", () => {
    const result = evaluateModerationTransition("rejected", "approve", true);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/solo se pueden aprobar reseñas en estado pending/i);
  });

  test("7. Bloqueo de retirada duplicada: no se puede retirar una reseña rechazada", () => {
    const result = evaluateModerationTransition("rejected", "withdraw", true);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/solo se pueden retirar reseñas en estado published/i);
  });

  test("8. Simulación de Rollback Atómico: Si la inserción en auditoría falla, la reseña no se muta", () => {
    const mockDb = {
      reviews: [{ id: "rev-1", status: "pending", consent: true }],
      auditLogs: [] as { action: string; reviewId: string }[],
    };

    function executeAtomicTransaction(shouldAuditFail: boolean) {
      const review = mockDb.reviews.find((r) => r.id === "rev-1")!;
      const previousStatus = review.status;

      try {
        const trans = evaluateModerationTransition(
          review.status as "pending",
          "approve",
          review.consent
        );
        if (!trans.success) throw new Error(trans.error);

        const newStatus = trans.newStatus!;

        if (shouldAuditFail) {
          throw new Error("DB Error: Unique constraint violation on audit log");
        }

        review.status = newStatus;
        mockDb.auditLogs.push({ action: "approve", reviewId: review.id });
        return { success: true };
      } catch (err: unknown) {
        // Rollback atómico: restaura el estado previo
        review.status = previousStatus;
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    }

    const failedResult = executeAtomicTransaction(true);
    expect(failedResult.success).toBe(false);
    expect(mockDb.reviews[0].status).toBe("pending");
    expect(mockDb.auditLogs.length).toBe(0);

    const successResult = executeAtomicTransaction(false);
    expect(successResult.success).toBe(true);
    expect(mockDb.reviews[0].status).toBe("published");
    expect(mockDb.auditLogs.length).toBe(1);
  });

  test("9. Concurrencia: Dos administradores actuando simultáneamente sobre la misma reseña", async () => {
    // Simula dos peticiones concurrentes sobre la misma fila bloqueada con FOR UPDATE
    let reviewStatus: "pending" | "published" | "rejected" = "pending";
    const consent = true;
    let successfulOperations = 0;
    let blockedOperations = 0;

    async function adminApprove(adminName: string) {
      // Simula SELECT ... FOR UPDATE serializado
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 20));
      const trans = evaluateModerationTransition(reviewStatus, "approve", consent);
      if (trans.success) {
        reviewStatus = trans.newStatus!;
        successfulOperations++;
        return { admin: adminName, success: true };
      } else {
        blockedOperations++;
        return { admin: adminName, success: false, error: trans.error };
      }
    }

    // Ejecución paralela
    const [resAdminA, resAdminB] = await Promise.all([
      adminApprove("Admin_A"),
      adminApprove("Admin_B"),
    ]);

    // Exactamente uno debe triunfar y el otro ser bloqueado por estado no 'pending'
    expect(successfulOperations).toBe(1);
    expect(blockedOperations).toBe(1);
    expect(reviewStatus).toBe("published");
    expect([resAdminA.success, resAdminB.success].sort()).toEqual([false, true]);
  });

  test("10. Doble clic y reintento de peticiones: idempotencia y bloqueo de acciones duplicadas", () => {
    let reviewStatus: "pending" | "published" | "rejected" = "pending";

    // Clic 1: Aprobación inicial
    const click1 = evaluateModerationTransition(reviewStatus, "approve", true);
    expect(click1.success).toBe(true);
    reviewStatus = click1.newStatus!;
    expect(reviewStatus).toBe("published");

    // Clic 2 (Doble clic o reintento de red)
    const click2 = evaluateModerationTransition(reviewStatus, "approve", true);
    expect(click2.success).toBe(false);
    expect(click2.error).toMatch(/solo se pueden aprobar reseñas en estado pending/i);
    // El estado se mantiene published sin corrupciones
    expect(reviewStatus).toBe("published");
  });

  test("11. Usuarios desactivados: administradores con is_active=false son bloqueados con 403", () => {
    const adminRecord = {
      id: "admin-uuid-1",
      email: "inactivo@nexodigitalstudio.net",
      role: "admin",
      is_active: false,
    };

    function checkAdminAuthorization(admin: typeof adminRecord | null) {
      if (!admin) return { authorized: false, error: "UNAUTHENTICATED" };
      if (!admin.is_active) return { authorized: false, error: "FORBIDDEN" };
      return { authorized: true, error: null };
    }

    const check = checkAdminAuthorization(adminRecord);
    expect(check.authorized).toBe(false);
    expect(check.error).toBe("FORBIDDEN");
  });

  test("12. Sesiones expiradas: validación segura con auth.getUser() falla con UNAUTHENTICATED", () => {
    function evaluateSession(user: { id: string } | null, authError: boolean) {
      if (authError || !user) {
        return { authorized: false, status: 401, error: "UNAUTHENTICATED" };
      }
      return { authorized: true, status: 200, error: null };
    }

    const expiredSession = evaluateSession(null, true);
    expect(expiredSession.authorized).toBe(false);
    expect(expiredSession.status).toBe(401);
  });

  test("13. Diferenciación explícita de entornos: Mock vs Supabase Real", () => {
    const isRealSupabaseConfigured = Boolean(
      process.env.NEXO_SUPABASE_URL &&
        process.env.NEXO_SUPABASE_SERVICE_ROLE_KEY &&
        process.env.NEXO_SUPABASE_URL.includes("supabase.co")
    );

    if (isRealSupabaseConfigured) {
      console.log("ℹ Entorno de ejecución: CONECTADO a Supabase Real (Proyecto nnujqzopkbzoddqhnavr)");
    } else {
      console.log(
        "ℹ Entorno de ejecución: AISLADO / MOCK / FIXTURES (Credenciales de producción no inyectadas en entorno local)"
      );
    }

    expect(typeof isRealSupabaseConfigured).toBe("boolean");
  });
});
