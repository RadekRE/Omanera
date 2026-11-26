import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { getDb } from "./db";

const loc = z.object({ title: z.string(), summary: z.string(), description: z.string(), highlights: z.array(z.string()) });
export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published"]),
  fictional: z.boolean().optional(),
  developer: z.object({ name: z.string(), website: z.string().optional() }),
  location: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  type: z.enum(["apartment", "villa", "townhouse"]),
  stage: z.enum(["planned", "under_construction", "completed"]),
  completion: z.string(),
  currency: z.string(),
  units: z.array(z.object({ name: z.string(), area_m2: z.number(), price_from: z.number(), available: z.number() })),
  estimate: z.object({ rental_yield_pct: z.number().nullable(), source: z.string(), as_of: z.string() }),
  images: z.array(z.string()),
  i18n: z.object({ cs: loc, de: loc, en: loc, pl: loc })
});
export type Project = z.infer<typeof ProjectSchema>;

const DIR = path.join(process.cwd(), "content/projects");

function fileProjects(): Project[] {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))
    .map((f) => ProjectSchema.parse(JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))));
}

/** Všechny projekty včetně konceptů (admin). Zdroj: Supabase, jinak soubory v repu. */
export async function getAllProjects(): Promise<Project[]> {
  const db = getDb();
  if (!db) return fileProjects();
  const { data, error } = await db.from("projects").select("data").order("updated_at", { ascending: false });
  if (error) { console.error("projects", error); return fileProjects(); }
  const out: Project[] = [];
  for (const r of data ?? []) { const p = ProjectSchema.safeParse(r.data); if (p.success) out.push(p.data); }
  return out;
}
export async function getProjects(): Promise<Project[]> { return (await getAllProjects()).filter((p) => p.status === "published"); }
export async function getProject(slug: string) { return (await getProjects()).find((p) => p.slug === slug); }
export async function getAnyProject(slug: string) { return (await getAllProjects()).find((p) => p.slug === slug); }
export const minPrice = (p: Project) => Math.min(...p.units.map((u) => u.price_from));

export async function saveProject(p: Project) {
  const db = getDb(); if (!db) throw new Error("Supabase není nastaveno");
  const { error } = await db.from("projects").upsert({ slug: p.slug, status: p.status, data: p, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
export async function deleteProject(slug: string) {
  const db = getDb(); if (!db) throw new Error("Supabase není nastaveno");
  const { error } = await db.from("projects").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

export const LocationSchema = z.object({ slug: z.string(), i18n: z.record(z.string(), z.object({ name: z.string(), description: z.string() })) });
export function getLocations() {
  const d = path.join(process.cwd(), "content/locations");
  return fs.readdirSync(d).map((f) => LocationSchema.parse(JSON.parse(fs.readFileSync(path.join(d, f), "utf8"))));
}
