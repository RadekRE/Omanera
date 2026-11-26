import { z } from "zod";
// KOSTRA: validace a kontrola souhlasu hotová; uložení do Supabase a e-mail přes Resend jsou TODO (týden 2).
const Lead = z.object({
  name: z.string().min(1).max(200), email: z.string().email(), phone: z.string().max(50).optional(),
  message: z.string().max(3000).optional(), projectSlug: z.string().optional(), locale: z.enum(["cs", "de", "en", "pl"]),
  consentPrivacy: z.literal(true), consentMarketing: z.boolean().default(false), website: z.string().max(0).optional() // honeypot
});
export async function POST(req: Request) {
  const p = Lead.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: "invalid" }, { status: 400 });
  return Response.json({ error: "not_implemented" }, { status: 501 });
}
