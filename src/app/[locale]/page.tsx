import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/projects";
import Arch from "@/components/Arch";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
type L = "cs" | "de" | "en" | "pl";
export default async function Home({ params }: { params: Promise<{ locale: L }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("home");
  const projects = (await getProjects()).slice(0, 3);
  const qs = ["q1", "q2", "q3"] as const;
  const hrefs = ["/projects", "/blog", "/chat"] as const;
  return (<>
    <section className="hero dark" style={{ marginInline: "calc(50% - 50vw)" }}>
      <Arch rings={5} />
      <div className="container">
        <p className="eyebrow rise">{t("eyebrow")}</p>
        <h1 className="rise" style={{ animationDelay: "120ms" }}>{t("title")}</h1>
        <p className="lead rise" style={{ animationDelay: "260ms" }}>{t("lead")}</p>
        <div className="btn-row rise" style={{ animationDelay: "400ms" }}>
          <Link className="btn" href="/chat">{t("cta")}</Link>
          <Link className="btn alt" href="/projects">{t("browse")}</Link>
        </div>
      </div>
    </section>

    <section className="section">
      <Reveal><h2>{t("qTitle")}</h2></Reveal>
      <div className="grid" style={{ marginTop: 32 }}>
        {qs.map((q, i) => (
          <Reveal key={q} delay={i * 110}>
            <article className="card" style={{ height: "100%" }}>
              <h3>{t(`${q}.h`)}</h3><p>{t(`${q}.p`)}</p>
              <Link href={hrefs[i]}>{t(`${q}.l`)}</Link>
            </article>
          </Reveal>))}
      </div>
    </section>

    <section className="section tight">
      <Reveal><h2>{t("featured")}</h2></Reveal>
      <div className="grid" style={{ marginTop: 32 }}>
        {await Promise.all(projects.map(async (p, i) => <Reveal key={p.slug} delay={i * 110}><ProjectCard p={p} locale={locale} /></Reveal>))}
      </div>
      <Reveal><p style={{ marginTop: 32 }}><Link className="btn alt" href="/projects">{t("all")}</Link></p></Reveal>
    </section>

    <section className="section dark" style={{ marginInline: "calc(50% - 50vw)", paddingInline: "calc(50vw - 50%)" }}>
      <div className="container">
        <Reveal><h2>{t("howTitle")}</h2></Reveal>
        <div className="steps" style={{ marginTop: 32 }}>
          {(["s1", "s2", "s3"] as const).map((s, i) => (
            <Reveal key={s} delay={i * 110}><div className="card" style={{ height: "100%" }}><h3>{t(`${s}.h`)}</h3><p className="muted">{t(`${s}.p`)}</p></div></Reveal>))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="split">
        <Reveal><p className="eyebrow">{t("honestTitle")}</p><h2>{t("honestP")}</h2></Reveal>
        <Reveal delay={120}>{(t.raw("honest") as string[]).map((h) => <div key={h} className="stat" style={{ marginBottom: 24 }}><p style={{ margin: 0, fontSize: "1.15rem" }}>{h}</p></div>)}</Reveal>
      </div>
    </section>
  </>);
}
