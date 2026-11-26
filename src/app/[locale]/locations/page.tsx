import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocations, getProjects } from "@/lib/projects";
export default async function Locations({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale); const t = await getTranslations("nav");
  return (<><h1>{t("locations")}</h1><div className="grid">{getLocations().map((l) => (
    <div className="card" key={l.slug}><h3>{l.i18n[locale].name}</h3><p>{l.i18n[locale].description}</p>
      <ul>{getProjects().filter((p) => p.location === l.slug).map((p) => <li key={p.slug}><Link href={`/projects/${p.slug}`}>{(p.i18n as Record<string, { title: string }>)[locale].title}</Link></li>)}</ul></div>))}</div></>);
}
