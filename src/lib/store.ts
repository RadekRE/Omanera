import { createClient } from "@supabase/supabase-js";
// Best-effort ukládání konverzací. Bez SUPABASE_* env se nic neděje (lokální vývoj).
export async function saveMessage(m: { sessionId: string; locale: string; projectSlug?: string; role: "user" | "assistant"; content: string; tokensIn?: number; tokensOut?: number; model?: string }) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    const db = createClient(url, key, { auth: { persistSession: false } });
    const { data: conv } = await db.from("conversations")
      .upsert({ session_id: m.sessionId, locale: m.locale, project_slug: m.projectSlug ?? null, last_message_at: new Date().toISOString() }, { onConflict: "session_id" })
      .select("id").single();
    if (conv) await db.from("messages").insert({ conversation_id: conv.id, role: m.role, content: m.content, tokens_in: m.tokensIn, tokens_out: m.tokensOut, model: m.model });
  } catch (e) { console.error("saveMessage selhalo", e); }
}
