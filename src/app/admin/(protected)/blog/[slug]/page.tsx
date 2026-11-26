import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getAllPosts } from "@/lib/blog";
import { deletePostAction, savePostAction } from "../actions";
export const dynamic = "force-dynamic";
export default async function EditPost({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { slug } = await params; const sp = await searchParams;
  const posts = (await getAllPosts()).filter((p) => p.slug === slug); if (!posts.length) notFound();
  return (<><p><Link href="/admin/blog">← Blog</Link></p><h1>{(posts.find((p) => p.locale === "cs") ?? posts[0]).title}</h1>
    {sp.saved && <p className="card">Uloženo.</p>}<PostForm posts={posts} slug={slug} action={savePostAction} />
    <form action={deletePostAction}><input type="hidden" name="slug" value={slug} /><p><button className="btn alt">Smazat článek (všechny jazyky)</button></p></form></>);
}
