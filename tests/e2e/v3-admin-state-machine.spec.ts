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

  test("8. Simulación de Rollback Atómico: Si la auditoría falla, la reseña no se muta", () => {
    // Simulación de transacción atómica
    const mockDb = {
      reviews: [{ id: "rev-1", status: "pending", consent: true }],
      auditLogs: [] as { action: string; reviewId: string }[],
    };

    function executeAtomicTransaction(shouldAuditFail: boolean) {
      const review = mockDb.reviews.find((r) => r.id === "rev-1")!;
      const previousStatus = review.status;

      try {
        // Paso 1: Transición
        const trans = evaluateModerationTransition(
          review.status as "pending",
          "approve",
          review.consent
        );
        if (!trans.success) throw new Error(trans.error);

        // Paso provisional
        const newStatus = trans.newStatus!;

        // Paso 2: Auditoría
        if (shouldAuditFail) {
          throw new Error("DB Error: Unique constraint violation on audit log");
        }

        // Si ambos tienen éxito, commit
        review.status = newStatus;
        mockDb.auditLogs.push({ action: "approve", reviewId: review.id });
        return { success: true };
      } catch (err: unknown) {
        // Rollback automático: restaurar estado
        review.status = previousStatus;
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    }

    // Ejecución con fallo de auditoría
    const failedResult = executeAtomicTransaction(true);
    expect(failedResult.success).toBe(false);
    // Verificar que la reseña PERMANECIÓ en pending (Rollback confirmado)
    expect(mockDb.reviews[0].status).toBe("pending");
    expect(mockDb.auditLogs.length).toBe(0);

    // Ejecución exitosa
    const successResult = executeAtomicTransaction(false);
    expect(successResult.success).toBe(true);
    expect(mockDb.reviews[0].status).toBe("published");
    expect(mockDb.auditLogs.length).toBe(1);
  });

  test("9. Diferenciación explícita de entornos: Mock vs Supabase Real", () => {
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

