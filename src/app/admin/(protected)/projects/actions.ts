"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { parseProjectForm } from "@/lib/admin-parse";
import { deleteProject, saveProject } from "@/lib/projects";

export async function saveProjectAction(fd: FormData) {
  await requireAdmin();
  let slug: string;
  try { const p = parseProjectForm(fd); await saveProject(p); slug = p.slug; }
  catch (e) { redirect(`/admin/projects?error=${encodeURIComponent(e instanceof Error ? e.message.slice(0, 300) : "Chyba")}`); }
  revalidatePath("/", "layout");
  redirect(`/admin/projects/${slug}?saved=1`);
}
export async function deleteProjectAction(fd: FormData) {
  await requireAdmin();
  await deleteProject(String(fd.get("slug")));
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}
