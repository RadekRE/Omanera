import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const loc = z.object({ title: z.string(), summary: z.string(), description: z.string(), highlights: z.array(z.string()) });
export const ProjectSchema = z.object({
  slug: z.string(),
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

// Datová vrstva: dnes JSON v repu; později lze přepnout na Supabase beze změny UI.
export function getProjects(): Project[] {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))
    .map((f) => ProjectSchema.parse(JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))))
    .filter((p) => p.status === "published");
}
export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);
export const minPrice = (p: Project) => Math.min(...p.units.map((u) => u.price_from));

export const LocationSchema = z.object({ slug: z.string(), i18n: z.record(z.string(), z.object({ name: z.string(), description: z.string() })) });
export function getLocations() {
  const d = path.join(process.cwd(), "content/locations");
  return fs.readdirSync(d).map((f) => LocationSchema.parse(JSON.parse(fs.readFileSync(path.join(d, f), "utf8"))));
}
