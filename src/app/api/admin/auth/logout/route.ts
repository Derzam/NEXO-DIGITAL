import { NextRequest, NextResponse } from "next/server";
import { signOutAdmin } from "@/lib/supabase/auth";
import { isValidAdminOrigin } from "@/lib/supabase/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
