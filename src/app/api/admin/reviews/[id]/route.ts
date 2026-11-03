import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/supabase/auth";
import { approveReview, rejectReview, withdrawReview } from "@/lib/supabase/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidAdminOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Allow non-browser requests without origin header

  const allowed = new Set<string>();
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {}
  }
  if (process.env.VERCEL_URL) allowed.add("https://" + process.env.VERCEL_URL);
  allowed.add("http://localhost:3000");
  allowed.add("http://127.0.0.1:3000");
  allowed.add("http://127.0.0.1:3100");
  allowed.add("http://localhost:3100");

  return allowed.has(origin);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // CSRF Protection: check origin if present
  if (!isValidAdminOrigin(request)) {
    return NextResponse.json(
      { error: "Origen no autorizado para operaciones administrativas." },
      { status: 403, headers: noStoreHeaders }
    );
  }

  const auth = await getAuthenticatedAdminUser();
  if (auth.error || !auth.user || !auth.admin) {
    const status = auth.error === "FORBIDDEN" ? 403 : 401;
    const message =
      auth.error === "FORBIDDEN"
        ? "Acceso denegado: tu usuario no cuenta con autorización administrativa."
        : "No autenticado. Inicia sesión como administrador.";
    return NextResponse.json({ error: message }, { status, headers: noStoreHeaders });
  }

  const { id } = await params;
  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: "Identificador de reseña inválido." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  let body: { action?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const { action, notes } = body;
  if (action !== "approve" && action !== "reject" && action !== "withdraw") {
    return NextResponse.json(
      { error: "Acción no permitida. Valores aceptados: approve, reject, withdraw." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  let result: { success: boolean; error: string | null; data?: Record<string, unknown> };
  if (action === "approve") {
    result = await approveReview(id, notes);
  } else if (action === "reject") {
    result = await rejectReview(id, notes);
  } else {
    result = await withdrawReview(id, notes);
  }

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "No se pudo procesar la acción." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  return NextResponse.json(
    { success: true, action, reviewId: id, details: result.data },
    { headers: noStoreHeaders }
  );
}
