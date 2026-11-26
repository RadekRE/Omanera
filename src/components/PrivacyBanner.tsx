"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
// Informační lišta: web nepoužívá sledovací cookies. Ukládá se jen technické nastavení v prohlížeči (jazyk, rozmluva v rámci relace).
export default function PrivacyBanner() {
  const t = useTranslations("banner"); const [show, setShow] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem("privacy.ack")) setShow(true); } catch { setShow(true); } }, []);
  if (!show) return null;
  return (<div className="banner" role="region" aria-label={t("label")}><p>{t("text")} <Link href="/privacy">{t("more")}</Link></p>
    <button className="btn" onClick={() => { try { localStorage.setItem("privacy.ack", "1"); } catch {} setShow(false); }}>{t("ok")}</button></div>);
}
