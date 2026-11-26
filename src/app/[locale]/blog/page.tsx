import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPosts } from "@/lib/blog";
export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale); const t = await getTranslations("blog");
  return (<><h1>{t("title")}</h1>{getPosts(locale).map((p) => (
    <article className="card" key={p.slug} style={{ marginBottom: 16 }}><h3>{p.title}</h3><p className="muted">{p.date}</p><p>{p.excerpt}</p><Link href={`/blog/${p.slug}`}>{t("read")}</Link></article>))}</>);
}
