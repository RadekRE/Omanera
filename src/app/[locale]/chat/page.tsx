import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/projects";
import ChatPanel from "@/components/ChatPanel";
export default async function ChatPage({ params, searchParams }: { params: Promise<{ locale: "cs" | "de" | "en" | "pl" }>; searchParams: Promise<{ project?: string; q?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const { project, q } = await searchParams; const t = await getTranslations("chat"); const tc = await getTranslations("chatpage");
  const projects = (await getProjects()).map((p) => ({ slug: p.slug, title: p.i18n[locale].title, summary: p.i18n[locale].summary }));
  return (<div className="chatpage">
    <aside><h1 style={{ fontSize: "clamp(2rem,3.4vw,2.8rem)" }}>{t("title")}</h1><p className="eyebrow" style={{ marginTop: 24 }}>{tc("topicsTitle")}</p>
      <ul>{(tc.raw("topics") as string[]).map((x) => <li key={x}>{x}</li>)}</ul></aside>
    <ChatPanel locale={locale} projects={projects} projectSlug={project} initialQuestion={q?.slice(0, 300)} />
  </div>);
}
