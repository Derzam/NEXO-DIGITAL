"use server";

import { signInAdmin, signOutAdmin, getAuthenticatedAdminUser } from "@/lib/supabase/auth";
import {
  fetchAdminReviews,
  approveReview,
  rejectReview,
  withdrawReview,
  type FetchAdminReviewsParams,
} from "@/lib/supabase/reviews";
import { redirect } from "next/navigation";

export async function loginAdminAction(formData: FormData) {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const next = (formData.get("next") as string) || "/admin/resenas";

  const result = await signInAdmin({ email, password });
  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Redirect to next or /admin/resenas
  const safeNext = next.startsWith("/admin") ? next : "/admin/resenas";
  redirect(safeNext);
}

export async function logoutAdminAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function getReviewsAction(params: FetchAdminReviewsParams = {}) {
  try {
    const data = await fetchAdminReviews(params);
    return { success: true, data, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al obtener las reseñas";
    return { success: false, data: null, error: message };
  }
}

export async function approveReviewAction(reviewId: string, notes?: string) {
  return await approveReview(reviewId, notes);
}

export async function rejectReviewAction(reviewId: string, notes?: string) {
  return await rejectReview(reviewId, notes);
}

export async function withdrawReviewAction(reviewId: string, notes?: string) {
  return await withdrawReview(reviewId, notes);
}

