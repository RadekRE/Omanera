import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { setRequestLocale } from "next-intl/server";
import { getPost } from "@/lib/blog";
export default async function Post({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const p = await getPost(locale, slug); if (!p) notFound();
  return <article><h1>{p.title}</h1><p className="muted">{p.date}</p><MDXRemote source={p.body} /></article>;
}
