"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
export default function ModeSwitch() {
  const t = useTranslations("nav"); const p = usePathname();
  const chat = p === "/chat";
  return <div className="switch"><Link href="/chat" className={chat ? "on" : ""}>{t("chat")}</Link><Link href="/projects" className={!chat ? "on" : ""}>{t("projects")}</Link></div>;
}
