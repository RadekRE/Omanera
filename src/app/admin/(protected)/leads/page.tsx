import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";

async function update(formData: FormData) {
  "use server"; await requireAdmin();
  const status = String(formData.get("status"));
  if (!["new", "contacted", "closed"].includes(status)) return;
  await getDb()?.from("leads").update({ status, note: String(formData.get("note") ?? "").slice(0, 2000) }).eq("id", String(formData.get("id")));
  revalidatePath("/admin/leads");
}
async function remove(formData: FormData) {
  "use server"; await requireAdmin();
  await getDb()?.from("leads").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/leads");
}
export default async function Leads() {
  const db = getDb(); if (!db) return <><h1>Leady</h1><p>Supabase není nastaveno.</p></>;
  const { data } = await db.from("leads").select("*").order("created_at", { ascending: false }).limit(300);
  return (<><h1>Leady</h1><p><Link className="btn alt" href="/admin/leads/export">Export CSV</Link></p>
    {(data ?? []).map((l) => (<div className="card" key={l.id} style={{ marginBottom: 12 }}>
      <strong>{l.name}</strong> · <a href={`mailto:${l.email}`}>{l.email}</a> {l.phone && `· ${l.phone}`}
      <p className="muted">{new Date(l.created_at).toLocaleString("cs")} · {l.locale} · {l.project_slug ?? "bez projektu"} · zdroj {l.source}{l.notified_at ? "" : " · POZOR: e-mail Radkovi se nepodařilo odeslat"}{l.consent_marketing ? " · marketingový souhlas" : ""}</p>
      {l.message && <p style={{ whiteSpace: "pre-wrap" }}>{l.message}</p>}
      {l.conversation_id && <p><Link href={`/admin/conversations/${l.conversation_id}`}>Rozhovor</Link></p>}
      <form action={update} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><input type="hidden" name="id" value={l.id} />
        <select name="status" defaultValue={l.status}><option value="new">nový</option><option value="contacted">kontaktován</option><option value="closed">uzavřen</option></select>
        <input name="note" defaultValue={l.note ?? ""} placeholder="poznámka" style={{ flex: 1, minWidth: 160 }} /><button className="btn">Uložit</button></form>
      <form action={remove}><input type="hidden" name="id" value={l.id} /><button className="btn alt" style={{ marginTop: 8 }}>Smazat (GDPR)</button></form>
    </div>))}</>);
}
