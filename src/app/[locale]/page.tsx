import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/projects";
import CountUp from "@/components/CountUp";
import HeroArt from "@/components/HeroArt";
import HeroPrompt from "@/components/HeroPrompt";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
type L = "cs" | "de" | "en" | "pl";
export default async function Home({ params }: { params: Promise<{ locale: L }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations("home");
  const projects = (await getProjects()).slice(0, 4);
  const stats = t.raw("stats") as { n: number; suffix: string; l: string }[];
  const hrefs = ["/projects", "/blog", "/chat"] as const;
  const ticker = t("ticker");
  return (<>
    <section className="hero dark" style={{ marginInline: "calc(50% - 50vw)" }}>
      <div className="container">
        <div className="copy">
          <p className="eyebrow rise">{t("eyebrow")}</p>
          <h1 className="rise" style={{ animationDelay: "120ms" }}>{t("title")}</h1>
          <p className="lead rise" style={{ animationDelay: "260ms" }}>{t("lead")}</p>
          <div className="rise" style={{ animationDelay: "400ms" }}><HeroPrompt /></div>
          <div className="btn-row rise" style={{ animationDelay: "520ms" }}>
            <Link className="btn alt" href="/projects">{t("browse")}</Link>
          </div>
        </div>
        <HeroArt />
      </div>
    </section>

    <div className="ticker" aria-hidden="true" style={{ marginInline: "calc(50% - 50vw)" }}>
      <div className="track">{[0, 1, 2, 3].map((i) => <span key={i}>{ticker}</span>)}</div>
    </div>

    <section className="section">
      <div className="stats">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 110}>
            <div className="num"><CountUp to={s.n} suffix={s.suffix} /></div>
            <p>{s.l}</p>
          </Reveal>))}
      </div>
    </section>

    <section className="section tight">
      <Reveal><p className="eyebrow">{t("qTitle")}</p></Reveal>
      <div className="grid" style={{ marginTop: 24 }}>
        {(["q1", "q2", "q3"] as const).map((q, i) => (
          <Reveal key={q} delay={i * 110}>
            <article className="card" style={{ height: "100%" }}>
              <h3>{t(`${q}.h`)}</h3><p>{t(`${q}.p`)}</p>
              <Link href={hrefs[i]}>{t(`${q}.l`)}</Link>
            </article>
          </Reveal>))}
      </div>
    </section>

    <section className="section">
      <Reveal><h2>{t("featured")}</h2></Reveal>
      <div className="grid big" style={{ marginTop: 32 }}>
        {await Promise.all(projects.map(async (p, i) => <Reveal key={p.slug} delay={i * 110}><ProjectCard p={p} locale={locale} /></Reveal>))}
      </div>
      <Reveal><p style={{ marginTop: 32 }}><Link className="btn alt" href="/projects">{t("all")}</Link></p></Reveal>
    </section>

    <section className="section dark" style={{ marginInline: "calc(50% - 50vw)" }}>
      <div className="container sticky">
        <Reveal><p className="eyebrow">{t("howTitle")}</p><h2>{t("honestP")}</h2>
          <ul style={{ paddingLeft: "1.1em", color: "var(--color-mutedOnDark)" }}>{(t.raw("honest") as string[]).map((h) => <li key={h} style={{ marginBottom: 8 }}>{h}</li>)}</ul></Reveal>
        <div className="steps">
          {(["s1", "s2", "s3"] as const).map((s, i) => (
            <Reveal key={s} delay={i * 110}><div className="card"><h3>{t(`${s}.h`)}</h3><p className="muted" style={{ margin: 0 }}>{t(`${s}.p`)}</p></div></Reveal>))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="yield">
        <Reveal><p className="eyebrow">{t("yield.eyebrow")}</p><h2>{t("q3.h")}</h2><p className="lead">{t("q3.p")}</p></Reveal>
        <Reveal as="figure" className="viz" delay={120}>
          {([["gross", 100, ""], ["fees", 22, "cut"], ["vacancy", 14, "cut"], ["tax", 12, "cut"], ["net", 52, "net"]] as const).map(([k, w, c]) => (
            <div className="row" key={k}><span>{t(`yield.${k}`)}</span><div className={`bar ${c}`} style={{ ["--w" as string]: `${w}%` }} /></div>))}
          <figcaption>{t("yield.caption")}</figcaption>
        </Reveal>
      </div>
    </section>
  </>);
}
