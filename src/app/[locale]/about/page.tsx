import { setRequestLocale } from "next-intl/server";
import { brand } from "@brand/brand.config";
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return (<><h1>{brand.name}</h1><p>{brand.tagline[locale as "cs"]}</p>
    <h2>Kontakt / Contact</h2><p>{brand.legal.companyName}<br />{brand.legal.registration}<br />{brand.legal.address}<br />{brand.legal.email}</p>
    <p className="muted">TODO týden 2: kontaktní formulář (lead) s GDPR souhlasem.</p></>);
}
