import { z } from "zod";
import { CONSENT_TEXT_VERSION } from "@/lib/consent";
import { getDb } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { rateLimited } from "@/lib/ratelimit";

export const runtime = "nodejs";
const Lead = z.object({
  name: z.string().trim().min(1).max(200), email: z.string().trim().email().max(200), phone: z.string().trim().max(50).optional(),
  message: z.string().trim().max(3000).optional(), projectSlug: z.string().max(100).optional(),
  locale: z.enum(["cs", "de", "en", "pl"]), source: z.enum(["contact", "project", "chat"]).default("contact"),
  sessionId: z.string().max(100).optional(),
  consentPrivacy: z.literal(true), consentMarketing: z.boolean().default(false),
  website: z.string().max(0).optional() // honeypot: musí zůstat prázdné
});
const err = (status: number, code: string) => Response.json({ error: code }, { status });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (body && typeof body.website === "string" && body.website.length > 0) return Response.json({ ok: true }); // bot: tváříme se, že vše prošlo
  const p = Lead.safeParse(body);
  if (!p.success) return err(400, "invalid");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`lead:${ip}`, 5, 60 * 60_000)) return err(429, "rate_limited");
  const notify = process.env.LEAD_NOTIFY_EMAIL;
  const db = getDb();
  if (!db && !notify) return err(503, "not_configured");
  const d = p.data;

  let leadId: string | null = null;
  if (db) {
    let conversationId: string | null = null;
    if (d.sessionId) conversationId = (await db.from("conversations").select("id").eq("session_id", d.sessionId).maybeSingle()).data?.id ?? null;
    const { data, error } = await db.from("leads").insert({
      conversation_id: conversationId, name: d.name, email: d.email, phone: d.phone ?? null, message: d.message ?? null,
      project_slug: d.projectSlug ?? null, locale: d.locale, source: d.source,
      consent_privacy: true, consent_marketing: d.consentMarketing, consent_text_version: CONSENT_TEXT_VERSION
    }).select("id").single();
    if (error) { console.error("lead insert", error); if (!notify) return err(500, "save_failed"); }
    leadId = data?.id ?? null;
  }

  let notified = false;
  if (notify) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const r = await sendMail({
      to: notify, replyTo: d.email, subject: `Nová poptávka: ${d.name}${d.projectSlug ? ` (${d.projectSlug})` : ""}`,
      text: `Jméno: ${d.name}\nE-mail: ${d.email}\nTelefon: ${d.phone ?? "-"}\nJazyk: ${d.locale}\nProjekt: ${d.projectSlug ?? "-"}\nZdroj: ${d.source}\nMarketingový souhlas: ${d.consentMarketing ? "ano" : "ne"}\n\n${d.message ?? ""}\n\nAdmin: ${site}/admin/leads`
    });
    notified = r.sent;
    if (!r.sent) console.error("lead mail", r.error);
  }
  if (db && leadId && notified) await db.from("leads").update({ notified_at: new Date().toISOString() }).eq("id", leadId);
  // Neúspěšné odeslání e-mailu se ukáže v adminu (lead bez notified_at); zájemci chybu neukazujeme, pokud je lead uložen.
  if (!leadId && !notified) return err(502, "delivery_failed");
  return Response.json({ ok: true });
}
