import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { brand } from "@brand/brand.config";
import { createLoginToken, isAllowed } from "@/lib/admin-auth";
import { sendMail } from "@/lib/mail";
import { rateLimited } from "@/lib/ratelimit";

async function doRequest(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`login:${ip}`, 5) || rateLimited(`login:${email}`, 3)) return;
  if (!isAllowed(email)) return; // stejná odpověď pro všechny, nic neprozradíme
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${base}/admin/verify?token=${createLoginToken(email)}`;
  const r = await sendMail({ to: email, subject: `${brand.name} admin – přihlášení`, text: `Přihlášení do adminu (platí 15 minut):\n${link}` });
  if (!r.sent && process.env.NODE_ENV !== "production") console.log("[DEV] přihlašovací odkaz:", link, r.error);
}

async function requestLink(formData: FormData) {
  "use server";
  await doRequest(formData);
  redirect("/admin/login?sent=1");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <h1>{brand.name} – admin</h1>
      {sp.error && <p className="muted">Odkaz je neplatný nebo vypršel. Požádejte o nový.</p>}
      <form action={requestLink} className="card">
        <label>E-mail<br /><input name="email" type="email" required autoComplete="email" style={{ width: "100%", padding: 8 }} /></label>
        <p><button className="btn">Poslat přihlašovací odkaz</button></p>
        {sp.sent && <p className="muted">Pokud je e-mail povolený, poslali jsme na něj odkaz (platí 15 minut).</p>}
      </form>
    </main>
  );
}
