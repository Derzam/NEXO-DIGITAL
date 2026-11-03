import { NextRequest, NextResponse } from "next/server";
import { signInAdmin } from "@/lib/supabase/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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

