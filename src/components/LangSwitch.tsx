"use client";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
export default function LangSwitch() {
  const cur = useLocale(); const path = usePathname();
  return <span className="langs">{routing.locales.map((l) => <Link key={l} href={path} locale={l} style={{ fontWeight: l === cur ? 700 : 400 }}>{l.toUpperCase()}</Link>)}</span>;
}
