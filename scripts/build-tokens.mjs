import fs from "node:fs";
const t = JSON.parse(fs.readFileSync("brand/tokens.json", "utf8"));
let css = ":root{\n";
for (const [group, vals] of Object.entries(t))
  for (const [k, v] of Object.entries(vals)) css += `  --${group}-${k}: ${v};\n`;
css += "}\n";
fs.writeFileSync("src/app/tokens.css", "/* GENEROVÁNO z brand/tokens.json – needitovat */\n" + css);
console.log("tokens.css hotovo");
