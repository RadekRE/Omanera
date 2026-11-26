import { getTranslations, setRequestLocale } from "next-intl/server";
import { brand } from "@brand/brand.config";
export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale); const t = await getTranslations("privacy");
  return (<article><h1>{t("title")}</h1><p className="muted">{t("draft")}</p>
    <p>{t("controller")}: {brand.legal.companyName}, {brand.legal.address}, {brand.legal.email}</p>
    {(t.raw("sections") as { h: string; p: string }[]).map((s) => <section key={s.h}><h2>{s.h}</h2><p>{s.p}</p></section>)}</article>);
}
