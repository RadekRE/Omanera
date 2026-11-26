"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
/** Chat-first vstup: otázka z úvodní stránky se rovnou odešle v chatu. */
export default function HeroPrompt() {
  const t = useTranslations("home.prompt"); const router = useRouter(); const [q, setQ] = useState("");
  const go = (text: string) => { if (text.trim()) router.push({ pathname: "/chat", query: { q: text.trim() } }); };
  return (
    <div className="prompt">
      <form onSubmit={(e) => { e.preventDefault(); go(q); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("placeholder")} aria-label={t("label")} maxLength={300} />
        <button className="btn">{t("send")}</button>
      </form>
      <div className="chips">{(t.raw("chips") as string[]).map((c) => <button key={c} type="button" onClick={() => go(c)}>{c}</button>)}</div>
    </div>
  );
}
