import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProject, getProjects } from "@/lib/projects";
type L = "cs" | "de" | "en" | "pl";
export const generateStaticParams = () => getProjects().flatMap((p) => ["cs", "de", "en", "pl"].map((locale) => ({ locale, slug: p.slug })));
export async function generateMetadata({ params }: { params: Promise<{ locale: L; slug: string }> }) {
  const { locale, slug } = await params; const p = getProject(slug); if (!p) return {};
  return { title: p.i18n[locale].title, description: p.i18n[locale].summary };
}
export default async function ProjectPage({ params }: { params: Promise<{ locale: L; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const p = getProject(slug); if (!p) notFound();
  const t = await getTranslations("project"); const l = p.i18n[locale];
  const ld = { "@context": "https://schema.org", "@type": "Product", name: l.title, description: l.summary, offers: { "@type": "Offer", priceCurrency: p.currency, price: Math.min(...p.units.map((u) => u.price_from)) } };
  return (<article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <h1>{l.title}</h1>
    {p.fictional && <p className="muted">Ukázková data / sample data – fiktivní projekt.</p>}
    <p>{l.description}</p>
    <ul>{l.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
    <p className="muted">{t("location")}: {p.location} · {t("developer")}: {p.developer.name} · {t(`stage.${p.stage}`)} · {t("completion")} {p.completion}</p>
    <h2>{t("units")}</h2>
    <table><thead><tr><th></th><th>{t("area")}</th><th>{t("from")}</th><th>{t("available")}</th></tr></thead>
      <tbody>{p.units.map((u) => <tr key={u.name}><td>{u.name}</td><td>{u.area_m2} m²</td><td>{u.price_from.toLocaleString(locale)} {p.currency}</td><td>{u.available}</td></tr>)}</tbody></table>
    {p.estimate.rental_yield_pct != null && <p className="card"><strong>{t("estimate")}:</strong> {p.estimate.rental_yield_pct} % ({p.estimate.source}, {p.estimate.as_of}). {(await getTranslations())("disclaimer")}</p>}
    <p><Link className="btn" href={{ pathname: "/chat", query: { project: p.slug } }}>{t("askAi")}</Link> <Link className="btn alt" href="/about">{t("inquiry")}</Link></p>
  </article>);
}
