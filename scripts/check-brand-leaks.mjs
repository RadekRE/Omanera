// Selže, pokud je mimo brand/ natvrdo název značky nebo hex barva.
import fs from "node:fs";
import path from "node:path";
const NAME = "Omanera";
const skip = ["node_modules", ".next", "brand", ".git", "messages", "content"];
const skipFiles = ["tokens.css", "SPEC.md", "package-lock.json", "README.md"];
let bad = 0;
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { if (!skip.includes(f.name)) walk(p); continue; }
    if (skipFiles.includes(f.name) || !/\.(ts|tsx|css|mjs|md)$/.test(f.name)) continue;
    if (p.startsWith("scripts/check-brand")) continue;
    const s = fs.readFileSync(p, "utf8");
    if (s.includes(NAME) || /#[0-9a-fA-F]{6}\b/.test(s)) { console.error("únik značky/barvy:", p); bad++; }
  }
}
walk(".");
process.exit(bad ? 1 : 0);
