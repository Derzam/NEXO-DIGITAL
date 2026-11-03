import { NextRequest, NextResponse } from "next/server";
import { signOutAdmin } from "@/lib/supabase/auth";

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

  await signOutAdmin();
  return NextResponse.json(
    { success: true, message: "Sesión cerrada correctamente." },
    { headers: { "Cache-Control": "no-store" } }
  );
}
