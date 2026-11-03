import { NextRequest, NextResponse } from "next/server";
import { signInAdmin } from "@/lib/supabase/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidAdminOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

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

export async function POST(request: NextRequest) {
  if (!isValidAdminOrigin(request)) {
    return NextResponse.json(
      { error: "Origen no permitido." },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Formato de datos inválido." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const email = body.email || "";
  const password = body.password || "";

  const result = await signInAdmin({ email, password });
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { success: true, message: "Inicio de sesión exitoso." },
    { headers: { "Cache-Control": "no-store" } }
  );
}
