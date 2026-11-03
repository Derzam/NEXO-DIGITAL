import { createSupabaseServerClient } from "./server";
import { createSupabaseAdminClient } from "./admin";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "admin" | "superadmin";

export type AdminRecord = {
  id: string;
  user_id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthAdminResult =
  | { user: User; admin: AdminRecord; error: null }
  | { user: User | null; admin: null; error: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_CONFIGURED" | "DATABASE_ERROR" };

/**
 * Validates the current session cryptographically with auth.getUser()
 * and enforces that the user has an active record in public.nexo_admin_users.
 */
export async function getAuthenticatedAdminUser(): Promise<AuthAdminResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { user: null, admin: null, error: "NOT_CONFIGURED" };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, admin: null, error: "UNAUTHENTICATED" };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { user: null, admin: null, error: "NOT_CONFIGURED" };
  }

  const { data: adminRecord, error: adminQueryError } = await adminClient
    .from("nexo_admin_users")
    .select("id, user_id, email, role, is_active, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (adminQueryError) {
    console.error("Error querying nexo_admin_users:", adminQueryError.message);
    return { user, admin: null, error: "DATABASE_ERROR" };
  }

  if (!adminRecord) {
    return { user, admin: null, error: "FORBIDDEN" };
  }

  return {
    user,
    admin: adminRecord as AdminRecord,
    error: null,
  };
}

export async function signInAdmin(formData: { email: string; password: string }) {
  const email = formData.email.trim().toLowerCase();
  const password = formData.password;

  if (!email || !password || email.length < 5 || password.length < 6) {
    return { success: false, error: "Introduce un correo y contraseña válidos." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: "El servicio de autenticación no está configurado." };
  }

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !data.user) {
    return { success: false, error: "Credenciales de acceso incorrectas." };
  }

  // Authorization check: User must be in nexo_admin_users and active
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    await supabase.auth.signOut();
    return { success: false, error: "El servicio no está configurado para autorizaciones." };
  }

  const { data: adminRecord, error: adminCheckError } = await adminClient
    .from("nexo_admin_users")
    .select("id, role, is_active")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (adminCheckError || !adminRecord) {
    // Revoke session immediately: Authenticated user has no administrative authorization
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Acceso denegado: tu usuario no cuenta con autorización administrativa.",
    };
  }

  return { success: true, error: null };
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return { success: true };
}

