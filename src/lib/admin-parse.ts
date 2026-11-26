import { ProjectSchema, type Project } from "./projects";
import { LOCALES, type Post } from "./blog";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

/** Jednotky: jeden řádek = "název | plocha m² | cena od | dostupných" */
export function parseUnits(text: string) {
  return lines(text).map((l, i) => {
    const [name, area, price, avail] = l.split("|").map((x) => x.trim());
    const u = { name, area_m2: Number(area), price_from: Number(price), available: Number(avail) };
    if (!name || [u.area_m2, u.price_from, u.available].some((n) => !Number.isFinite(n))) throw new Error(`Jednotky, řádek ${i + 1}: očekávám "název | plocha | cena od | dostupných"`);
    return u;
  });
}
export const unitsToText = (p: Project) => p.units.map((u) => `${u.name} | ${u.area_m2} | ${u.price_from} | ${u.available}`).join("\n");

export function parseProjectForm(fd: FormData): Project {
  const yieldRaw = str(fd, "yield");
  const i18n = Object.fromEntries(LOCALES.map((l) => [l, {
    title: str(fd, `title_${l}`), summary: str(fd, `summary_${l}`), description: str(fd, `description_${l}`), highlights: lines(str(fd, `highlights_${l}`))
  }]));
  const raw = {
    slug: str(fd, "slug"), status: str(fd, "status") || "draft", fictional: fd.get("fictional") === "on",
    developer: { name: str(fd, "developer"), website: str(fd, "website") || undefined },
    location: str(fd, "location"), coordinates: { lat: Number(str(fd, "lat") || 0), lng: Number(str(fd, "lng") || 0) },
    type: str(fd, "type"), stage: str(fd, "stage"), completion: str(fd, "completion"), currency: str(fd, "currency") || "OMR",
    units: parseUnits(str(fd, "units")),
    estimate: { rental_yield_pct: yieldRaw === "" ? null : Number(yieldRaw), source: str(fd, "estimate_source") || "developer", as_of: str(fd, "estimate_as_of") },
    images: lines(str(fd, "images")), i18n
  };
  const p = ProjectSchema.parse(raw);
  if (p.status === "published") for (const l of LOCALES) if (!p.i18n[l].title || !p.i18n[l].summary) throw new Error(`Publikovat lze jen s názvem a shrnutím ve všech jazycích (chybí: ${l.toUpperCase()})`);
  return p;
}

export function parsePostForm(fd: FormData): Post[] {
  const slug = str(fd, "slug"); const status = str(fd, "status") === "published" ? "published" : "draft";
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Slug smí obsahovat jen malá písmena, čísla a pomlčky");
  const date = str(fd, "date") || new Date().toISOString().slice(0, 10);
  const posts = LOCALES.map((l) => ({ slug, locale: l as string, status: status as "draft" | "published", date, title: str(fd, `title_${l}`), excerpt: str(fd, `excerpt_${l}`), body: String(fd.get(`body_${l}`) ?? "") }));
  if (status === "published") for (const p of posts) if (!p.title) throw new Error(`Publikovat lze jen s názvem ve všech jazycích (chybí: ${p.locale.toUpperCase()})`);
  return posts.filter((p) => p.title);
}
