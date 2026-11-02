import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Submission = Record<string, unknown>;
const json = (message: string, status: number) =>
  NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });

function isValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set<string>();
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try { allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin); } catch { return false; }
  }
  if (process.env.VERCEL_URL) allowed.add("https://" + process.env.VERCEL_URL);
  if (process.env.NODE_ENV === "development") allowed.add("http://localhost:3000");
  return allowed.has(origin);
}

export async function POST(request: NextRequest) {
  if (process.env.REVIEWS_SUBMISSION_ENABLED !== "true") {
    return json("El formulario de reseñas todavía no está habilitado.", 503);
  }
  if (!isValidOrigin(request)) return json("Origen no permitido.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json("Envía datos en formato JSON.", 415);
  }

  const dbUrl = process.env.NEXO_SUPABASE_URL;
  const dbKey = process.env.NEXO_SUPABASE_SERVICE_ROLE_KEY;
  const turnstileSecret = process.env.REVIEWS_TURNSTILE_SECRET;
  if (!dbUrl || !dbKey || !turnstileSecret ||
      !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(dbUrl)) {
    return json("El servicio no está configurado.", 503);
  }

  let payload: Submission;
  try {
    const body = await request.text();
    if (body.length > 5000) return json("La reseña excede el tamaño permitido.", 413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json("Datos inválidos.", 400);
    payload = parsed as Submission;
  } catch {
    return json("No se pudieron interpretar los datos.", 400);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const organization = typeof payload.organization === "string" ? payload.organization.trim() : "";
  const comment = typeof payload.comment === "string" ? payload.comment.trim() : "";
  const rating = payload.rating;
  const publicationConsent = payload.publicationConsent;
  const privacyConsent = payload.privacyConsent;
  const token = payload.turnstileToken;
  if (name.length < 2 || name.length > 90 ||
      organization.length > 100 || comment.length < 20 || comment.length > 700 ||
      typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5 ||
      typeof publicationConsent !== "boolean" || privacyConsent !== true ||
      typeof token !== "string" || token.length < 10 || token.length > 2048) {
    return json("Verifica nombre, puntuación, opinión, autorización y comprobación antispam.", 400);
  }
  // Honeypot: silent acceptance, never stores spam or exposes implementation.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ message: "Recibido para revisión." }, { status: 202 });
  }

  try {
    // Turnstile must be verified server-side; a browser-only widget is not security.
    const challenge = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: turnstileSecret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!challenge.ok) return json("No se pudo comprobar la solicitud. Intenta otra vez.", 503);
    const result = (await challenge.json()) as { success?: boolean; hostname?: string };
    const publicHost = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : "";
    const hosts = [publicHost, process.env.VERCEL_URL, ...(process.env.NODE_ENV === "development" ? ["localhost"] : [])].filter(Boolean);
    if (!result.success || !result.hostname || !hosts.includes(result.hostname)) {
      return json("La verificación antispam no fue válida. Recarga la página.", 400);
    }
    const database = await fetch(dbUrl + "/rest/v1/nexo_customer_reviews", {
      method: "POST",
      headers: {
        apikey: dbKey,
        Authorization: "Bearer " + dbKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        display_name: name,
        organization: organization || null,
        rating,
        comment,
        privacy_consent: true,
        publication_consent: publicationConsent,
        moderation_status: "pending",
        source: "website",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!database.ok) {
      console.error("Nexo reviews storage insert failed", database.status);
      return json("No pudimos registrar tu reseña. Inténtalo más tarde.", 503);
    }
    return NextResponse.json(
      { message: "Reseña recibida y almacenada para revisión. No se publica automáticamente." },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return json("El servicio de reseñas no está disponible temporalmente.", 503);
  }
}
