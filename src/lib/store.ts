import { getDb } from "./db";
// Best-effort ukládání konverzací. Bez SUPABASE_* env se nic neděje (lokální vývoj).
export async function saveMessage(m: { sessionId: string; locale: string; projectSlug?: string; role: "user" | "assistant"; content: string; tokensIn?: number; tokensOut?: number; model?: string }) {
  const db = getDb();
  if (!db) return;
  try {
    const { data: conv } = await db.from("conversations")
      .upsert({ session_id: m.sessionId, locale: m.locale, project_slug: m.projectSlug ?? null, consent_chat_storage: true, last_message_at: new Date().toISOString() }, { onConflict: "session_id" })
      .select("id").single();
    if (conv) await db.from("messages").insert({ conversation_id: conv.id, role: m.role, content: m.content, tokens_in: m.tokensIn, tokens_out: m.tokensOut, model: m.model });
  } catch (e) { console.error("saveMessage selhalo", e); }
}
