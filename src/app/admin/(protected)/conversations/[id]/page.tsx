import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";

async function remove(id: string) {
  "use server"; await requireAdmin();
  const db = getDb(); if (!db) return;
  await db.from("conversations").delete().eq("id", id);
  redirect("/admin/conversations");
}
export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; await requireAdmin(); const db = getDb(); if (!db) notFound();
  const { data: c } = await db.from("conversations").select("*").eq("id", id).maybeSingle(); if (!c) notFound();
  const { data: msgs } = await db.from("messages").select("*").eq("conversation_id", id).order("created_at");
  const { data: leads } = await db.from("leads").select("id,name,email").eq("conversation_id", id);
  return (<><p><Link href="/admin/conversations">← Rozhovory</Link></p>
    <h1>Rozhovor</h1><p className="muted">{c.locale} · {c.project_slug ?? "bez projektu"} · {new Date(c.started_at).toLocaleString("cs")}</p>
    {(leads ?? []).map((l) => <p key={l.id} className="card">Lead: {l.name} ({l.email}) – <Link href="/admin/leads">leady</Link></p>)}
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{(msgs ?? []).map((m) => (
      <div key={m.id} className={`msg ${m.role}`}>{m.content}<div className="muted" style={{ fontSize: ".7rem" }}>{new Date(m.created_at).toLocaleTimeString("cs")}{m.tokens_out ? ` · ${m.tokens_in}/${m.tokens_out} tok` : ""}</div></div>))}</div>
    <form action={remove.bind(null, id)}><p><button className="btn alt">Smazat rozhovor</button></p></form></>);
}
