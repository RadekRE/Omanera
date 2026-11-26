import { z } from "zod";
import { getDb } from "@/lib/db";
export const runtime = "nodejs";
// Právo na výmaz: smaže konverzaci (zprávy kaskádou) podle náhodného session id, které zná jen daný prohlížeč.
export async function POST(req: Request) {
  const p = z.object({ sessionId: z.string().min(8).max(100) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: "invalid" }, { status: 400 });
  await getDb()?.from("conversations").delete().eq("session_id", p.data.sessionId);
  return Response.json({ ok: true });
}
