# Omanera (pracovní název)

Web + AI chatbot pro nemovitosti v Ománu. Kompletní zadání: [SPEC.md](SPEC.md).

## Spuštění
```
npm install
cp .env.example .env.local   # doplnit ANTHROPIC_API_KEY (jen lokálně / ve Vercelu, NIKDY do gitu)
npm run dev                  # http://localhost:3000  (/ → /en, dále /cs /de /pl)
```
Kontroly: `npm run typecheck`, `npm test`, `npm run validate-content`, `npm run check-brand-leaks`, `npm run build`.

## Přejmenování značky
Změnit `brand/brand.config.ts` a `brand/tokens.json` (+ konstantu `NAME` v `scripts/check-brand-leaks.mjs`). `npm run tokens` přegeneruje CSS.

## Přidání projektu
Nový soubor `content/projects/<slug>.json` (schéma v `src/lib/projects.ts`), `npm run validate-content`.

## Stav
Kostra týdne 1. Co chybí, viz sekce „Stav kostry" v popisu pull requestu.
