import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
type L = "cs" | "de" | "en" | "pl";
export default async function Home({ params }: { params: Promise<{ locale: L }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("home");
  return (<>
    <section className="hero"><h1>{t("title")}</h1><p>{t("lead")}</p>
      <p><Link className="btn" href="/chat">{t("cta")}</Link> <Link className="btn alt" href="/projects">{t("browse")}</Link></p></section>
    <h2>{t("reasons")}</h2>
    <ul><li>{t("r1")}</li><li>{t("r2")}</li><li>{t("r3")}</li></ul>
    <div className="grid">{await Promise.all(getProjects().map((p) => <ProjectCard key={p.slug} p={p} locale={locale} />))}</div>
  </>);
}
