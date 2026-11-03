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

export async function approveReview(reviewId: string, notes?: string) {
  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    return {
      success: false,
      error: auth.error === "FORBIDDEN" ? "No autorizado" : "No autenticado",
    };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { success: false, error: "Servicio no configurado" };
  }

  // 1. Fetch current review
  const { data: review, error: fetchError } = await adminClient
    .from("nexo_customer_reviews")
    .select("id, display_name, moderation_status, publication_consent")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return { success: false, error: "Reseña no encontrada." };
  }

  // 2. Strict invariant check: Must have publication_consent = true
  if (review.publication_consent !== true) {
    return {
      success: false,
      error: "No se puede publicar una reseña sin el consentimiento explícito del cliente para publicación.",
    };
  }

  const previousStatus = review.moderation_status;
  const publishedAt = new Date().toISOString();

  // 3. Update status
  const { error: updateError } = await adminClient
    .from("nexo_customer_reviews")
    .update({
      moderation_status: "published",
      published_at: publishedAt,
    })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Error approving review:", updateError.message);
    return { success: false, error: "No se pudo actualizar el estado de la reseña." };
  }

  // 4. Log moderation action
  await adminClient.from("nexo_review_moderation_logs").insert({
    review_id: reviewId,
    action: "approve",
    previous_status: previousStatus,
    new_status: "published",
    admin_id: auth.admin.user_id,
    admin_email: auth.admin.email,
    notes: notes?.trim() || null,
  });

  // 5. Invalidate cache on public site immediately
  revalidatePath("/");
  revalidatePath("/admin/resenas");

  return { success: true, error: null };
}

export async function rejectReview(reviewId: string, notes?: string) {
  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    return {
      success: false,
      error: auth.error === "FORBIDDEN" ? "No autorizado" : "No autenticado",
    };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { success: false, error: "Servicio no configurado" };
  }

  const { data: review, error: fetchError } = await adminClient
    .from("nexo_customer_reviews")
    .select("id, moderation_status")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return { success: false, error: "Reseña no encontrada." };
  }

  const previousStatus = review.moderation_status;

  const { error: updateError } = await adminClient
    .from("nexo_customer_reviews")
    .update({
      moderation_status: "rejected",
      published_at: null,
    })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Error rejecting review:", updateError.message);
    return { success: false, error: "No se pudo rechazar la reseña." };
  }

  await adminClient.from("nexo_review_moderation_logs").insert({
    review_id: reviewId,
    action: "reject",
    previous_status: previousStatus,
    new_status: "rejected",
    admin_id: auth.admin.user_id,
    admin_email: auth.admin.email,
    notes: notes?.trim() || null,
  });

  revalidatePath("/");
  revalidatePath("/admin/resenas");

  return { success: true, error: null };
}

export async function withdrawReview(reviewId: string, notes?: string) {
  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    return {
      success: false,
      error: auth.error === "FORBIDDEN" ? "No autorizado" : "No autenticado",
    };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { success: false, error: "Servicio no configurado" };
  }

  const { data: review, error: fetchError } = await adminClient
    .from("nexo_customer_reviews")
    .select("id, moderation_status")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return { success: false, error: "Reseña no encontrada." };
  }

  if (review.moderation_status !== "published") {
    return { success: false, error: "Solo es posible retirar reseñas que estén actualmente publicadas." };
  }

  const previousStatus = review.moderation_status;

  const { error: updateError } = await adminClient
    .from("nexo_customer_reviews")
    .update({
      moderation_status: "rejected",
      published_at: null,
    })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Error withdrawing review:", updateError.message);
    return { success: false, error: "No se pudo retirar la reseña." };
  }

  await adminClient.from("nexo_review_moderation_logs").insert({
    review_id: reviewId,
    action: "withdraw",
    previous_status: previousStatus,
    new_status: "rejected",
    admin_id: auth.admin.user_id,
    admin_email: auth.admin.email,
    notes: notes?.trim() || null,
  });

  revalidatePath("/");
  revalidatePath("/admin/resenas");

  return { success: true, error: null };
}

