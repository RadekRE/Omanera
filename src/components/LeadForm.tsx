"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LeadForm({ projectSlug, source = "contact" }: { projectSlug?: string; source?: "contact" | "project" | "chat" }) {
  const t = useTranslations("lead"); const locale = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const f = new FormData(e.currentTarget);
    let sessionId: string | undefined; try { sessionId = JSON.parse(sessionStorage.getItem("chat.sid") ?? "null") ?? undefined; } catch {}
    const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: f.get("name"), email: f.get("email"), phone: f.get("phone") || undefined, message: f.get("message") || undefined,
      projectSlug, source, locale, sessionId: f.get("linkChat") ? sessionId : undefined,
      consentPrivacy: f.get("consentPrivacy") === "on", consentMarketing: f.get("consentMarketing") === "on", website: f.get("website") ?? ""
    }) }).catch(() => null);
    setState(res?.ok ? "ok" : "error");
  }
  if (state === "ok") return <p className="card" role="status">{t("ok")}</p>;
  return (
    <form onSubmit={submit} className="card form" id="inquiry">
      <h3>{t("title")}</h3>
      <label>{t("name")}<input name="name" required maxLength={200} autoComplete="name" /></label>
      <label>{t("email")}<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      <label>{t("phone")}<input name="phone" maxLength={50} autoComplete="tel" /></label>
      <label>{t("message")}<textarea name="message" rows={4} maxLength={3000} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      <label className="check"><input type="checkbox" name="linkChat" /> {t("linkChat")}</label>
      <label className="check"><input type="checkbox" name="consentPrivacy" required /> <span>{t("consent")} <Link href="/privacy">{t("privacyLink")}</Link></span></label>
      <label className="check"><input type="checkbox" name="consentMarketing" /> {t("marketing")}</label>
      {state === "error" && <p role="alert">{t("error")}</p>}
      <button className="btn" disabled={state === "sending"}>{t("send")}</button>
    </form>
  );
}
