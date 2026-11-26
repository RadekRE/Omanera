import Link from "next/link";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Conversations({ searchParams }: { searchParams: Promise<{ leads?: string }> }) {
  const sp = await searchParams; const db = getDb();
  if (!db) return <><h1>Rozhovory</h1><p>Supabase není nastaveno.</p></>;
  const { data } = await db.from("conversations").select("id,session_id,locale,project_slug,started_at,last_message_at,leads(id),messages(count)").order("last_message_at", { ascending: false }).limit(200);
  const rows = (data ?? []).filter((r) => !sp.leads || (r.leads as unknown[]).length > 0);
  return (<><h1>Rozhovory</h1>
    <p><Link href="/admin/conversations">Všechny</Link> · <Link href="/admin/conversations?leads=1">Jen s leadem</Link></p>
    <table><thead><tr><th>Poslední zpráva</th><th>Jazyk</th><th>Projekt</th><th>Zpráv</th><th>Lead</th><th></th></tr></thead><tbody>
      {rows.map((r) => (<tr key={r.id}><td>{new Date(r.last_message_at).toLocaleString("cs")}</td><td>{r.locale}</td><td>{r.project_slug ?? "–"}</td>
        <td>{(r.messages as unknown as { count: number }[])[0]?.count ?? 0}</td><td>{(r.leads as unknown[]).length ? "ano" : ""}</td><td><Link href={`/admin/conversations/${r.id}`}>Detail</Link></td></tr>))}
    </tbody></table></>);
}
