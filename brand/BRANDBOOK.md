# Brand book (pracovní název značky, viz brand.config.ts)

**Směr:** klidný, věcný, důvěryhodný. Barvy z Ománu: moře, písek, pálená hlína a zlato olibanu.

## Barvy (zdroj: schválený vizuální směr)
| Název | Hex | Použití |
|---|---|---|
| Noc | #0F2E2C | pozadí tmavých sekcí, text |
| Moře | #2F7F7A | plochy, grafy, linky, oblouky |
| Písek | #F3EBDD | hlavní pozadí |
| Hlína | #A04E28 | akcent: tlačítka a velký text |
| Olibanum | #D3A74A | jen na tmavém pozadí |

Odvozené neutrální odstíny (surface, muted, border, surfaceDark, …) jsou v `tokens.json` a jsou navržené jako doplněk; po schválení lze upravit.
Pravidla kontrastu: hlína jen na velký text a tlačítka, zlatá jen na Noci, Moře ne pro malý text na Písku.

## Písmo
Fraunces (nadpisy), Inter (text). Balíčky `@fontsource-variable/*` (hostováno u nás, bez volání na Google).

## Tón a pravidla
Mluvíme věcně a bez nátlaku. Nikdy neslibujeme výnos. Každé číslo má zdroj nebo štítek „odhad". Žádné emoji, žádné stock fotky s bazénem. Pracujeme s typografií a obloukovým motivem.

## Pohyb
Jemný scroll reveal, plynulé přechody, mikrointerakce; vždy respektovat `prefers-reduced-motion`.

Vzhled se mění výhradně v `tokens.json` (po změně `npm run tokens`).
