import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getDb } from "./db";

export const LOCALES = ["cs", "de", "en", "pl"] as const;
export type Loc = (typeof LOCALES)[number];
export type Post = { slug: string; locale: string; status: "draft" | "published"; title: string; date: string; excerpt: string; body: string };

function filePosts(locale: string): Post[] {
  const d = path.join(process.cwd(), "content/blog", locale);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".mdx")).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(d, f), "utf8"));
    return { slug: f.replace(/\.mdx$/, ""), locale, status: "published" as const, title: String(data.title), date: String(data.date), excerpt: String(data.excerpt ?? ""), body: content };
  });
}
/** Všechny články ve všech jazycích včetně konceptů (admin). */
export async function getAllPosts(): Promise<Post[]> {
  const db = getDb();
  if (!db) return LOCALES.flatMap(filePosts);
  const { data, error } = await db.from("blog_posts").select("*").order("date", { ascending: false });
  if (error) { console.error("blog", error); return LOCALES.flatMap(filePosts); }
  return (data ?? []).map((r) => ({ slug: r.slug, locale: r.locale, status: r.status, title: r.title, date: String(r.date), excerpt: r.excerpt, body: r.body }));
}
export async function getPosts(locale: string): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.locale === locale && p.status === "published").sort((a, b) => b.date.localeCompare(a.date));
}
export async function getPost(locale: string, slug: string) { return (await getPosts(locale)).find((p) => p.slug === slug); }

export async function savePost(p: Post) {
  const db = getDb(); if (!db) throw new Error("Supabase není nastaveno");
  const { error } = await db.from("blog_posts").upsert({ ...p, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
export async function deletePostAll(slug: string) {
  const db = getDb(); if (!db) throw new Error("Supabase není nastaveno");
  const { error } = await db.from("blog_posts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}
