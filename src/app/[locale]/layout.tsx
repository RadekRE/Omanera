import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { brand } from "@brand/brand.config";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/projects";
import ChatWidget from "@/components/ChatWidget";
import SiteNav from "@/components/SiteNav";
import PrivacyBanner from "@/components/PrivacyBanner";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "../tokens.css";
import "../globals.css";

export const revalidate = 60;
export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    title: { default: brand.name, template: `%s · ${brand.name}` },
    description: brand.tagline[locale as "cs"] ?? brand.tagline.en,
    metadataBase: new URL(base),
    alternates: { languages: Object.fromEntries([...routing.locales.map((l) => [l, `/${l}`]), ["x-default", "/en"]]) }
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const tf = await getTranslations();
  const projects = (await getProjects()).map((p) => ({ slug: p.slug, title: p.i18n[locale as "cs"].title, summary: p.i18n[locale as "cs"].summary }));
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <header className="site"><div className="container">
            <Link href="/" className="logo">{brand.name}</Link>
            <SiteNav />
          </div></header>
          <main className="container">{children}</main>
          <footer className="site"><div className="container"><p className="logo">{brand.name}</p>
            <p>{tf("disclaimer")}</p>
            <p><Link href="/privacy">{tf("footer.privacy")}</Link></p>
            <p>{tf("footer.legal")}: {brand.legal.companyName}, {brand.legal.registration}, {brand.legal.address}, {brand.legal.email}</p>
          </div></footer>
          <ChatWidget projects={projects} />
          <PrivacyBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
