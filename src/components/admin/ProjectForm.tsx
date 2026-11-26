import { LOCALES } from "@/lib/blog";
import { unitsToText } from "@/lib/admin-parse";
import type { Project } from "@/lib/projects";

const empty: Project = {
  slug: "", status: "draft", developer: { name: "" }, location: "muscat", coordinates: { lat: 0, lng: 0 }, type: "apartment", stage: "planned",
  completion: "", currency: "OMR", units: [], estimate: { rental_yield_pct: null, source: "developer", as_of: "" }, images: [],
  i18n: Object.fromEntries(LOCALES.map((l) => [l, { title: "", summary: "", description: "", highlights: [] }])) as unknown as Project["i18n"]
};
const inp = { width: "100%", padding: 8, font: "inherit" } as const;

export default function ProjectForm({ project, action, isNew }: { project?: Project; action: (fd: FormData) => Promise<void>; isNew?: boolean }) {
  const p = project ?? empty;
  return (
    <form action={action} className="card" style={{ display: "grid", gap: 12 }}>
      <label>Slug (URL, nelze později měnit)<input style={inp} name="slug" defaultValue={p.slug} required pattern="[a-z0-9-]+" readOnly={!isNew} /></label>
      <label>Stav<select name="status" defaultValue={p.status} style={inp}><option value="draft">koncept (nezobrazuje se)</option><option value="published">publikováno (vyžaduje všechny jazyky)</option></select></label>
      <label><input type="checkbox" name="fictional" defaultChecked={p.fictional} /> Ukázková / fiktivní data</label>
      <label>Developer<input style={inp} name="developer" defaultValue={p.developer.name} required /></label>
      <label>Web developera<input style={inp} name="website" defaultValue={p.developer.website ?? ""} /></label>
      <label>Lokalita (slug lokality, např. muscat)<input style={inp} name="location" defaultValue={p.location} required /></label>
      <label>Šířka / délka<span style={{ display: "flex", gap: 8 }}><input style={inp} name="lat" defaultValue={p.coordinates.lat} /><input style={inp} name="lng" defaultValue={p.coordinates.lng} /></span></label>
      <label>Typ<select name="type" defaultValue={p.type} style={inp}><option value="apartment">apartmán</option><option value="villa">vila</option><option value="townhouse">řadový dům</option></select></label>
      <label>Fáze<select name="stage" defaultValue={p.stage} style={inp}><option value="planned">v plánu</option><option value="under_construction">ve výstavbě</option><option value="completed">dokončeno</option></select></label>
      <label>Dokončení (např. 2028-Q2)<input style={inp} name="completion" defaultValue={p.completion} required /></label>
      <label>Měna<input style={inp} name="currency" defaultValue={p.currency} /></label>
      <label>Jednotky – jeden řádek: název | plocha m² | cena od | dostupných<textarea style={inp} rows={4} name="units" defaultValue={unitsToText(p)} required /></label>
      <fieldset><legend>Odhad výnosu (pouze odhad developera, není záruka)</legend>
        <label>Výnos % (prázdné = neuvádět)<input style={inp} name="yield" defaultValue={p.estimate.rental_yield_pct ?? ""} /></label>
        <label>Zdroj<input style={inp} name="estimate_source" defaultValue={p.estimate.source} /></label>
        <label>K datu (RRRR-MM-DD)<input style={inp} name="estimate_as_of" defaultValue={p.estimate.as_of} required /></label></fieldset>
      <label>Obrázky – URL, jedna na řádek<textarea style={inp} rows={3} name="images" defaultValue={p.images.join("\n")} /></label>
      {LOCALES.map((l) => (<fieldset key={l}><legend>Jazyk {l.toUpperCase()}</legend>
        <label>Název<input style={inp} name={`title_${l}`} defaultValue={p.i18n[l].title} /></label>
        <label>Shrnutí<input style={inp} name={`summary_${l}`} defaultValue={p.i18n[l].summary} /></label>
        <label>Popis<textarea style={inp} rows={4} name={`description_${l}`} defaultValue={p.i18n[l].description} /></label>
        <label>Přednosti (jedna na řádek)<textarea style={inp} rows={3} name={`highlights_${l}`} defaultValue={p.i18n[l].highlights.join("\n")} /></label></fieldset>))}
      <p className="muted">Texty pro DE, PL a EN před publikací zkontroluje rodilý mluvčí. Výnosy jen jako odhad developera, žádné sliby.</p>
      <button className="btn">Uložit</button>
    </form>
  );
}
