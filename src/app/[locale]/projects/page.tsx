import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjects, minPrice } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
type L = "cs" | "de" | "en" | "pl";
export default async function Projects({ params, searchParams }: { params: Promise<{ locale: L }>; searchParams: Promise<{ location?: string; type?: string; sort?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams; const t = await getTranslations("nav"); const tp = await getTranslations("project");
  const all = await getProjects();
  let list = all.filter((p) => (!sp.location || p.location === sp.location) && (!sp.type || p.type === sp.type));
  if (sp.sort === "price") list = [...list].sort((a, b) => minPrice(a) - minPrice(b));
  const locs = [...new Set(all.map((p) => p.location))]; const types = [...new Set(all.map((p) => p.type))];
  return (<>
    <h1>{t("projects")}</h1>
    <div className="filters">
      <Link className={`chip${!sp.location && !sp.type ? " on" : ""}`} href="/projects">{tp("all")}</Link>
      {locs.map((l) => <Link key={l} className={`chip${sp.location === l ? " on" : ""}`} href={{ pathname: "/projects", query: { location: l } }}>{l}</Link>)}
      {types.map((x) => <Link key={x} className={`chip${sp.type === x ? " on" : ""}`} href={{ pathname: "/projects", query: { type: x } }}>{x}</Link>)}
      <Link className={`chip${sp.sort === "price" ? " on" : ""}`} href={{ pathname: "/projects", query: { ...sp, sort: "price" } }}>{tp("sortPrice")}</Link>
    </div>
    <div className="grid">{await Promise.all(list.map(async (p, i) => <Reveal key={p.slug} delay={i * 80}><ProjectCard p={p} locale={locale} /></Reveal>))}</div>
  </>);
}
