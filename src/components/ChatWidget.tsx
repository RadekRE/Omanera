"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import ChatPanel, { type ChatProject } from "./ChatPanel";

export default function ChatWidget({ projects }: { projects: ChatProject[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("chat");
  const locale = useLocale();
  const path = usePathname();
  if (path === "/chat") return null;
  const slug = path.match(/^\/projects\/([a-z0-9-]+)/)?.[1];
  return (<>
    {open && <div className="widget"><ChatPanel locale={locale} projects={projects} projectSlug={slug} /></div>}
    <button className="btn fab" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "×" : `💬 ${t("open")}`}</button>
  </>);
}
