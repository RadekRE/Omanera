import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { minPrice, type Project } from "@/lib/projects";
import Arch from "./Arch";
import Spotlight from "./Spotlight";
export default async function ProjectCard({ p, locale }: { p: Project; locale: "cs" | "de" | "en" | "pl" }) {
  const t = await getTranslations("project");
  const l = p.i18n[locale];
  const area = p.units.length ? `${Math.min(...p.units.map((u) => u.area_m2))} m²` : "";
  return (
    <Spotlight>
      <Link href={`/projects/${p.slug}`} className="card hover pcard">
        <div className="visual"><span className="badge">{t(`stage.${p.stage}`)}</span><Arch rings={5} /></div>
        <div className="body">
          <ul className="meta"><li>{p.location}</li><li>{t("completion")} {p.completion}</li>{area && <li>{t("area")} od {area}</li>}</ul>
          <h3>{l.title}</h3>
          <p>{l.summary}</p>
          <div className="foot">
            <p className="price" style={{ margin: 0 }}><span className="muted">{t("from")}</span> {minPrice(p).toLocaleString(locale)} {p.currency}</p>
            <span className="go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9h12M10 4l5 5-5 5" /></svg></span>
          </div>
          {p.fictional && <p className="muted" style={{ marginTop: 12 }}>Ukázková data / sample data</p>}
        </div>
      </Link>
    </Spotlight>
  );
}
