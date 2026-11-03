import { NextResponse } from "next/server";
import { signOutAdmin } from "@/lib/supabase/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await signOutAdmin();
  return NextResponse.json(
    { success: true, message: "Sesión cerrada correctamente." },
    { headers: { "Cache-Control": "no-store" } }
  );
}

