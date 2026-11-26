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

## Admin
`/admin`: přihlášení odkazem na e-mail (jen adresy v `ADMIN_EMAILS`, vyžaduje `ADMIN_SESSION_SECRET`, `RESEND_API_KEY`, `RESEND_FROM`). Lokálně bez Resend se odkaz vypíše do konzole serveru.
Rozhovory, leady, projekty a blog v adminu vyžadují Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) a migrace z `supabase/migrations`. Bez Supabase web čte projekty a blog ze složky `content/`.
Retence: naplánovat denně `select purge_old_data();`.

## Vzhled
Pouze `brand/tokens.json` (paleta, písma, pohyb). Po změně `npm run tokens`. Viz `brand/BRANDBOOK.md`.

## Stav
Kostra týdne 1. Co chybí, viz sekce „Stav kostry" v popisu pull requestu.
