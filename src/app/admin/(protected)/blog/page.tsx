import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
export const dynamic = "force-dynamic";
export default async function Blog({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams; const all = await getAllPosts();
  const slugs = [...new Set(all.map((p) => p.slug))];
  return (<><h1>Blog</h1>{error && <p className="card">⚠ {error}</p>}<p><Link className="btn" href="/admin/blog/new">Nový článek</Link></p>
    <table><thead><tr><th>Název</th><th>Slug</th><th>Jazyky</th><th>Stav</th></tr></thead><tbody>
      {slugs.map((s) => { const ps = all.filter((p) => p.slug === s); const t = ps.find((p) => p.locale === "cs") ?? ps[0];
        return <tr key={s}><td><Link href={`/admin/blog/${s}`}>{t.title}</Link></td><td>{s}</td><td>{ps.map((p) => p.locale).join(", ")}</td><td>{t.status === "published" ? "publikováno" : "koncept"}</td></tr>; })}
    </tbody></table></>);
}
