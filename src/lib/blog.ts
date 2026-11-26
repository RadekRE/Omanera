import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Post = { slug: string; title: string; date: string; excerpt: string; body: string };
export function getPosts(locale: string): Post[] {
  const d = path.join(process.cwd(), "content/blog", locale);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".mdx")).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(d, f), "utf8"));
    return { slug: f.replace(/\.mdx$/, ""), title: String(data.title), date: String(data.date), excerpt: String(data.excerpt ?? ""), body: content };
  }).sort((a, b) => b.date.localeCompare(a.date));
}
export const getPost = (locale: string, slug: string) => getPosts(locale).find((p) => p.slug === slug);
