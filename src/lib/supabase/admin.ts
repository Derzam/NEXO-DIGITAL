import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createSupabaseAdminClient cannot be called from the browser.");
  }

  const url = process.env.NEXO_SUPABASE_URL;
  const serviceKey = process.env.NEXO_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

