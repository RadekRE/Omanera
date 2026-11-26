import fs from "node:fs";
import path from "node:path";
import { brand } from "@brand/brand.config";
import { getProjects, minPrice } from "./projects";

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

export function buildSystemPrompt(locale: string, projectSlug?: string) {
  const guardrails = read("chatbot/guardrails.md").replaceAll("{{BRAND}}", brand.name).replaceAll("{{LOCALE}}", locale);
  const kdir = path.join(process.cwd(), "chatbot/knowledge");
  const knowledge = fs.readdirSync(kdir).map((f) => read(`chatbot/knowledge/${f}`)).join("\n\n");
  const projects = getProjects().map((p) => {
    const t = p.i18n[locale as "cs"] ?? p.i18n.en;
    return `- slug=${p.slug}; ${t.title}; ${p.location}; ${p.type}; ${p.stage}; dokončení ${p.completion}; cena od ${minPrice(p)} ${p.currency}; odhad výnosu developera: ${p.estimate.rental_yield_pct ?? "neuveden"} % (zdroj ${p.estimate.source}, ${p.estimate.as_of})${p.fictional ? "; UKÁZKOVÁ DATA" : ""}. ${t.summary}`;
  }).join("\n");
  const focus = projectSlug ? `\nUživatel právě prohlíží projekt slug=${projectSlug}; odpovídej primárně k němu.` : "";
  return `${guardrails}\n\n## Znalostní báze\n${knowledge}\n\n## Dostupné projekty\n${projects}${focus}`;
}
