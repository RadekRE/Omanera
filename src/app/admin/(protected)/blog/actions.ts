"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { parsePostForm } from "@/lib/admin-parse";
import { deletePostAll, savePost } from "@/lib/blog";

export async function savePostAction(fd: FormData) {
  await requireAdmin();
  let slug: string;
  try { const posts = parsePostForm(fd); for (const p of posts) await savePost(p); slug = String(fd.get("slug")); }
  catch (e) { redirect(`/admin/blog?error=${encodeURIComponent(e instanceof Error ? e.message.slice(0, 300) : "Chyba")}`); }
  revalidatePath("/", "layout");
  redirect(`/admin/blog/${slug}?saved=1`);
}
export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  await deletePostAll(String(fd.get("slug")));
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}
