import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProject, getProjects } from "@/lib/projects";
import LeadForm from "@/components/LeadForm";
import Arch from "@/components/Arch";
import Reveal from "@/components/Reveal";
type L = "cs" | "de" | "en" | "pl";
export const revalidate = 60;
export const generateStaticParams = async () => (await getProjects()).flatMap((p) => ["cs", "de", "en", "pl"].map((locale) => ({ locale, slug: p.slug })));
export async function generateMetadata({ params }: { params: Promise<{ locale: L; slug: string }> }) {
  const { locale, slug } = await params; const p = await getProject(slug); if (!p) return {};
  return { title: p.i18n[locale].title, description: p.i18n[locale].summary };
}
export default async function ProjectPage({ params }: { params: Promise<{ locale: L; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const p = await getProject(slug); if (!p) notFound();
  const t = await getTranslations("project"); const l = p.i18n[locale];
  const ld = { "@context": "https://schema.org", "@type": "Product", name: l.title, description: l.summary, offers: { "@type": "Offer", priceCurrency: p.currency, price: Math.min(...p.units.map((u) => u.price_from)) } };
  return (<article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <header className="hero dark" style={{ marginInline: "calc(50% - 50vw)", paddingBlock: "clamp(56px,8vw,100px)" }}><Arch rings={4} /><div className="container"><p className="eyebrow rise">{p.location} · {t(`stage.${p.stage}`)}</p><h1 className="rise" style={{ animationDelay: "100ms", fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>{l.title}</h1><p className="lead rise" style={{ animationDelay: "220ms" }}>{l.summary}</p></div></header>
    <div className="section tight">
    {p.fictional && <p className="muted">Ukázková data / sample data – fiktivní projekt.</p>}
    <p>{l.description}</p>
    <ul>{l.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
    <p className="muted">{t("location")}: {p.location} · {t("developer")}: {p.developer.name} · {t(`stage.${p.stage}`)} · {t("completion")} {p.completion}</p>
    <h2>{t("units")}</h2>
    <table><thead><tr><th></th><th>{t("area")}</th><th>{t("from")}</th><th>{t("available")}</th></tr></thead>
      <tbody>{p.units.map((u) => <tr key={u.name}><td>{u.name}</td><td>{u.area_m2} m²</td><td>{u.price_from.toLocaleString(locale)} {p.currency}</td><td>{u.available}</td></tr>)}</tbody></table>
    {p.estimate.rental_yield_pct != null && <p className="card"><strong>{t("estimate")}:</strong> {p.estimate.rental_yield_pct} % ({p.estimate.source}, {p.estimate.as_of}). {(await getTranslations())("disclaimer")}</p>}
    <p><Link className="btn" href={{ pathname: "/chat", query: { project: p.slug } }}>{t("askAi")}</Link> <a className="btn alt" href="#inquiry">{t("inquiry")}</a></p>
    <LeadForm projectSlug={p.slug} source="project" />
    </div>
  </article>);
}
