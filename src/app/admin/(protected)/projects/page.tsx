import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
export const dynamic = "force-dynamic";
export default async function Projects({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const list = await getAllProjects();
  return (<><h1>Projekty</h1>{error && <p className="card">⚠ {error}</p>}<p><Link className="btn" href="/admin/projects/new">Přidat projekt</Link></p>
    <table><thead><tr><th>Název</th><th>Slug</th><th>Lokalita</th><th>Stav</th></tr></thead><tbody>
      {list.map((p) => <tr key={p.slug}><td><Link href={`/admin/projects/${p.slug}`}>{p.i18n.cs.title || p.i18n.en.title || p.slug}</Link></td><td>{p.slug}</td><td>{p.location}</td><td>{p.status === "published" ? "publikováno" : "koncept"}</td></tr>)}
    </tbody></table></>);
}
