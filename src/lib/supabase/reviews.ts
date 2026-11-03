import { createSupabaseAdminClient } from "./admin";
import { getAuthenticatedAdminUser } from "./auth";
import { revalidatePath } from "next/cache";

export type ReviewModerationStatus = "pending" | "published" | "rejected";
export type ReviewSource = "website" | "manual_whatsapp";

export type AdminReview = {
  id: string;
  displayName: string;
  organization: string | null;
  rating: number;
  comment: string;
  privacyConsent: boolean;
  publicationConsent: boolean;
  moderationStatus: ReviewModerationStatus;
  source: ReviewSource;
  createdAt: string;
  publishedAt: string | null;
};

export type ReviewStats = {
  total: number;
  pending: number;
  published: number;
  rejected: number;
};

export type FetchAdminReviewsParams = {
  status?: "all" | ReviewModerationStatus;
  search?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
};

type DbReviewRow = {
  id: string;
  display_name: string;
  organization: string | null;
  rating: number;
  comment: string;
  privacy_consent: boolean;
  publication_consent: boolean;
  moderation_status: ReviewModerationStatus;
  source: ReviewSource;
  created_at: string;
  published_at: string | null;
};

function mapRowToAdminReview(row: DbReviewRow): AdminReview {
  return {
    id: row.id,
    displayName: row.display_name,
    organization: row.organization,
    rating: row.rating,
    comment: row.comment,
    privacyConsent: row.privacy_consent,
    publicationConsent: row.publication_consent,
    moderationStatus: row.moderation_status,
    source: row.source,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  };
}

export async function getAdminReviewStats(): Promise<ReviewStats> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { total: 0, pending: 0, published: 0, rejected: 0 };
  }

  const [totalRes, pendingRes, publishedRes, rejectedRes] = await Promise.all([
    adminClient.from("nexo_customer_reviews").select("id", { count: "exact", head: true }),
    adminClient.from("nexo_customer_reviews").select("id", { count: "exact", head: true }).eq("moderation_status", "pending"),
    adminClient.from("nexo_customer_reviews").select("id", { count: "exact", head: true }).eq("moderation_status", "published"),
    adminClient.from("nexo_customer_reviews").select("id", { count: "exact", head: true }).eq("moderation_status", "rejected"),
  ]);

  return {
    total: totalRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    published: publishedRes.count ?? 0,
    rejected: rejectedRes.count ?? 0,
  };
}

export async function fetchAdminReviews(params: FetchAdminReviewsParams = {}) {
  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    throw new Error(
      auth.error === "FORBIDDEN"
        ? "Acceso denegado: tu usuario no tiene permisos de administrador."
        : "No autenticado. Inicia sesión para continuar."
    );
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new Error("El servicio de base de datos no está configurado.");
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 10));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = adminClient
    .from("nexo_customer_reviews")
    .select(
      "id, display_name, organization, rating, comment, privacy_consent, publication_consent, moderation_status, source, created_at, published_at",
      { count: "exact" }
    );

  if (params.status && params.status !== "all") {
    query = query.eq("moderation_status", params.status);
  }

  if (params.search && params.search.trim()) {
    const cleanSearch = params.search.trim().replace(/[%_]/g, "");
    query = query.or(
      `display_name.ilike.%${cleanSearch}%,organization.ilike.%${cleanSearch}%,comment.ilike.%${cleanSearch}%`
    );
  }

  const ascending = params.sort === "oldest";
  query = query.order("created_at", { ascending }).range(from, to);

  const [reviewsResult, stats] = await Promise.all([
    query,
    getAdminReviewStats(),
  ]);

  if (reviewsResult.error) {
    console.error("Error fetching admin reviews:", reviewsResult.error.message);
    throw new Error("Error al consultar las reseñas en la base de datos.");
  }

  const rows = (reviewsResult.data as DbReviewRow[]) || [];
  const totalItems = reviewsResult.count ?? 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    reviews: rows.map(mapRowToAdminReview),
    stats,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
}

export type ModerateAction = "approve" | "reject" | "withdraw";

/**
 * Moderación atómica y segura mediante función transaccional de PostgreSQL (`nexo_moderate_review`).
 *
 * Invariantes y garantías:
 * 1. La actualización del estado y el registro de auditoría ocurren en una sola transacción.
 * 2. Si falla cualquiera de las operaciones, ninguna se confirma (rollback automático).
 * 3. Se bloquea la fila mediante SELECT ... FOR UPDATE para impedir condiciones de carrera y dobles clics.
 * 4. Transiciones estrictas permitidas:
 *    - pending -> published (solo mediante approve y con publication_consent = true)
 *    - pending -> rejected (solo mediante reject)
 *    - published -> rejected (solo mediante withdraw)
 * 5. Privilegios mínimos: la función está restringida exclusivamente a service_role.
 */
export async function moderateReviewAtomic(
  reviewId: string,
  action: ModerateAction,
  notes?: string
): Promise<{ success: boolean; error: string | null; data?: Record<string, unknown> }> {
  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    return {
      success: false,
      error: auth.error === "FORBIDDEN"
        ? "Acceso denegado: tu usuario no cuenta con autorización administrativa."
        : "No autenticado. Inicia sesión como administrador.",
    };
  }

  if (action !== "approve" && action !== "reject" && action !== "withdraw") {
    return {
      success: false,
      error: `Acción inválida (${action}). Solo se permite approve, reject o withdraw.`,
    };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { success: false, error: "El servicio de base de datos no está configurado." };
  }

  // Ejecución transaccional atómica en PostgreSQL
  const { data, error } = await adminClient.rpc("nexo_moderate_review", {
    p_review_id: reviewId,
    p_action: action,
    p_admin_id: auth.admin.user_id,
    p_admin_email: auth.admin.email,
    p_notes: notes?.trim() || null,
  });

  if (error) {
    console.error("Atomic moderation RPC failed:", error.message);
    return {
      success: false,
      error: error.message || "Error al procesar la moderación atómica.",
    };
  }

  // Purga inmediata de caché en la web pública y en el panel
  revalidatePath("/");
  revalidatePath("/admin/resenas");

  return { success: true, error: null, data: (data as Record<string, unknown>) || undefined };
}

export async function approveReview(reviewId: string, notes?: string) {
  return await moderateReviewAtomic(reviewId, "approve", notes);
}

export async function rejectReview(reviewId: string, notes?: string) {
  return await moderateReviewAtomic(reviewId, "reject", notes);
}

export async function withdrawReview(reviewId: string, notes?: string) {
  return await moderateReviewAtomic(reviewId, "withdraw", notes);
}
