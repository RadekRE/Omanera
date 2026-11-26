import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { minPrice, type Project } from "@/lib/projects";
export default async function ProjectCard({ p, locale }: { p: Project; locale: "cs" | "de" | "en" | "pl" }) {
  const t = await getTranslations("project");
  const l = p.i18n[locale];
  return (<article className="card">
    <h3><Link href={`/projects/${p.slug}`}>{l.title}</Link></h3>
    <p>{l.summary}</p>
    <p className="muted">{t(`stage.${p.stage}`)} · {t("completion")} {p.completion}</p>
    <p><strong>{t("from")} {minPrice(p).toLocaleString(locale)} {p.currency}</strong></p>
    {p.fictional && <p className="muted">Ukázková data / sample data</p>}
  </article>);
}
