import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { minPrice, type Project } from "@/lib/projects";
import Arch from "./Arch";
export default async function ProjectCard({ p, locale }: { p: Project; locale: "cs" | "de" | "en" | "pl" }) {
  const t = await getTranslations("project");
  const l = p.i18n[locale];
  return (
    <Link href={`/projects/${p.slug}`} className="card hover pcard">
      <div className="visual"><span className="badge">{t(`stage.${p.stage}`)}</span><Arch rings={4} /></div>
      <div className="body">
        <p className="muted">{p.location} · {t("completion")} {p.completion}</p>
        <h3>{l.title}</h3>
        <p>{l.summary}</p>
        <p className="price"><span className="muted">{t("from")}</span> {minPrice(p).toLocaleString(locale)} {p.currency}</p>
        {p.fictional && <p className="muted">Ukázková data / sample data</p>}
      </div>
    </Link>
  );
}
