// JEDINÝ zdroj identity značky. Přejmenování = změna tohoto souboru + brand/tokens.json.
export const brand = {
  name: "Omanera", // pracovní název
  domain: "omanera.example", // placeholder, doplnit po registraci domény
  tagline: {
    cs: "Nemovitosti v Ománu, srozumitelně.",
    de: "Immobilien im Oman, verständlich.",
    en: "Oman property, made clear.",
    pl: "Nieruchomości w Omanie, w prosty sposób."
  },
  legal: {
    // TODO: doplnit po rozhodnutí o provozovateli (vztah k ZAYAR)
    companyName: "[DOPLNIT: obchodní firma]",
    registration: "[DOPLNIT: IČO / registrace]",
    address: "[DOPLNIT: adresa]",
    email: "[DOPLNIT: kontaktní e-mail]"
  },
  social: { instagram: { cs: "", de: "", en: "" } }
} as const;
export type Brand = typeof brand;
