"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitch from "./LangSwitch";
import ModeSwitch from "./ModeSwitch";

export default function SiteNav() {
  const t = useTranslations("nav"); const [open, setOpen] = useState(false); const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (<>
    <button className="burger" aria-expanded={open} aria-controls="mainnav" aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /></button>
    <nav id="mainnav" className={`main${open ? " open" : ""}`}>
      <Link href="/projects">{t("projects")}</Link><Link href="/locations">{t("locations")}</Link>
      <Link href="/blog">{t("blog")}</Link><Link href="/about">{t("about")}</Link>
      <ModeSwitch /><LangSwitch />
    </nav>
  </>);
}
