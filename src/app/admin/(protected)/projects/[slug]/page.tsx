import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAnyProject } from "@/lib/projects";
import { deleteProjectAction, saveProjectAction } from "../actions";
export const dynamic = "force-dynamic";
export default async function EditProject({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { slug } = await params; const sp = await searchParams;
  const p = await getAnyProject(slug); if (!p) notFound();
  return (<><p><Link href="/admin/projects">Projekty</Link></p><h1>{p.i18n.cs.title || p.slug}</h1>
    {sp.saved && <p className="card">Uloženo.</p>}
    <ProjectForm project={p} action={saveProjectAction} />
    <form action={deleteProjectAction}><input type="hidden" name="slug" value={p.slug} /><p><button className="btn alt">Smazat projekt</button></p></form></>);
}
