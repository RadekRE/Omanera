import { createClient, type SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | null | undefined;
/** Supabase klient se service role klíčem (jen server). Bez env vrací null => web běží ze souborů. */
export function getDb(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
