import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/projects";
import ChatPanel from "@/components/ChatPanel";
export default async function ChatPage({ params, searchParams }: { params: Promise<{ locale: "cs" | "de" | "en" | "pl" }>; searchParams: Promise<{ project?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const { project } = await searchParams; const t = await getTranslations("chat");
  const projects = getProjects().map((p) => ({ slug: p.slug, title: p.i18n[locale].title, summary: p.i18n[locale].summary }));
  return <><h1>{t("title")}</h1><ChatPanel locale={locale} projects={projects} projectSlug={project} /></>;
}
