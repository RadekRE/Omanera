import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = ["", "/projects", "/locations", "/blog", "/about", "/chat", ...getProjects().map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((p) => routing.locales.map((l) => ({
    url: `${base}/${l}${p}`,
    alternates: { languages: Object.fromEntries(routing.locales.map((x) => [x, `${base}/${x}${p}`])) }
  })));
}
