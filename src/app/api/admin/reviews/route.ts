import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/supabase/auth";
import { fetchAdminReviews, ReviewModerationStatus } from "@/lib/supabase/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    const status = auth.error === "FORBIDDEN" ? 403 : 401;
    const message =
      auth.error === "FORBIDDEN"
        ? "Acceso denegado: tu usuario no cuenta con autorización administrativa."
        : "No autenticado. Inicia sesión como administrador.";
    return NextResponse.json({ error: message }, { status, headers: noStoreHeaders });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const validStatuses: (ReviewModerationStatus | "all")[] = ["all", "pending", "published", "rejected"];
  const status = validStatuses.includes(statusParam as ReviewModerationStatus)
    ? (statusParam as ReviewModerationStatus | "all")
    : "all";

  const search = searchParams.get("search") || undefined;
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const limit = parseInt(searchParams.get("limit") || "10", 10) || 10;

  try {
    const result = await fetchAdminReviews({
      status,
      search,
      sort,
      page,
      limit,
    });
    return NextResponse.json(result, { headers: noStoreHeaders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500, headers: noStoreHeaders });
  }
}

