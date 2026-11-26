import Link from "next/link";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const db = getDb();
  if (!db) return <><h1>Přehled</h1><p className="card">Supabase není nastaveno (chybí <code>SUPABASE_URL</code> a <code>SUPABASE_SERVICE_ROLE_KEY</code>). Rozhovory a leady se neukládají a projekty a blog se čtou ze souborů v repu; úpravy v adminu nejsou možné.</p></>;
  const since = new Date(Date.now() - 86400000).toISOString();
  const [c, l, n, m] = await Promise.all([
    db.from("conversations").select("id", { count: "exact", head: true }),
    db.from("leads").select("id", { count: "exact", head: true }),
    db.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    db.from("messages").select("tokens_in,tokens_out").gte("created_at", since)
  ]);
  const tin = (m.data ?? []).reduce((a, r) => a + (r.tokens_in ?? 0), 0), tout = (m.data ?? []).reduce((a, r) => a + (r.tokens_out ?? 0), 0);
  return (<><h1>Přehled</h1><div className="grid">
    <div className="card"><h3>Rozhovory</h3><p><strong>{c.count ?? 0}</strong></p><Link href="/admin/conversations">Zobrazit</Link></div>
    <div className="card"><h3>Leady</h3><p><strong>{l.count ?? 0}</strong> ({n.count ?? 0} nových)</p><Link href="/admin/leads">Zobrazit</Link></div>
    <div className="card"><h3>Tokeny za 24 h</h3><p>vstup {tin.toLocaleString("cs")} · výstup {tout.toLocaleString("cs")}</p><p className="muted">Rozpočtový limit se hlídá v API, tvrdý limit nastavte i v konzoli Anthropic.</p></div>
  </div></>);
}
