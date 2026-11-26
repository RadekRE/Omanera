import { LOCALES, type Post } from "@/lib/blog";
const inp = { width: "100%", padding: 8, font: "inherit" } as const;
export default function PostForm({ posts, slug, action }: { posts: Post[]; slug?: string; action: (fd: FormData) => Promise<void> }) {
  const by = (l: string) => posts.find((p) => p.locale === l);
  const first = posts[0];
  return (
    <form action={action} className="card" style={{ display: "grid", gap: 12 }}>
      <label>Slug<input style={inp} name="slug" defaultValue={slug ?? ""} required pattern="[a-z0-9-]+" readOnly={!!slug} /></label>
      <label>Datum<input style={inp} type="date" name="date" defaultValue={first?.date?.slice(0, 10)} /></label>
      <label>Stav<select style={inp} name="status" defaultValue={first?.status ?? "draft"}><option value="draft">koncept</option><option value="published">publikováno (vyžaduje název ve všech jazycích)</option></select></label>
      {LOCALES.map((l) => (<fieldset key={l}><legend>Jazyk {l.toUpperCase()}</legend>
        <label>Název<input style={inp} name={`title_${l}`} defaultValue={by(l)?.title ?? ""} /></label>
        <label>Perex<textarea style={inp} rows={2} name={`excerpt_${l}`} defaultValue={by(l)?.excerpt ?? ""} /></label>
        <label>Text (Markdown)<textarea style={inp} rows={10} name={`body_${l}`} defaultValue={by(l)?.body ?? ""} /></label></fieldset>))}
      <button className="btn">Uložit</button>
    </form>
  );
}
