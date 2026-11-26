import { beforeAll, describe, expect, it } from "vitest";
import { createLoginToken, createSessionToken, isAllowed, verifyLoginToken, verifySessionToken } from "../src/lib/admin-auth";
import { parsePostForm, parseProjectForm, parseUnits } from "../src/lib/admin-parse";

beforeAll(() => { process.env.ADMIN_SESSION_SECRET = "x".repeat(40); process.env.ADMIN_EMAILS = "Radek@example.com, other@example.com"; });

describe("admin přihlášení", () => {
  it("povolí jen e-maily ze seznamu", () => { expect(isAllowed("radek@example.com")).toBe(true); expect(isAllowed("evil@example.com")).toBe(false); });
  it("platný token projde, cizí e-mail ne", () => {
    expect(verifyLoginToken(createLoginToken("radek@example.com"))).toBe("radek@example.com");
    process.env.ADMIN_EMAILS = "other@example.com";
    expect(verifyLoginToken(createLoginToken("radek@example.com"))).toBeNull();
    process.env.ADMIN_EMAILS = "radek@example.com";
  });
  it("vyprší a nejde zaměnit login a session", () => {
    const t = createLoginToken("radek@example.com", Date.now() - 16 * 60_000);
    expect(verifyLoginToken(t)).toBeNull();
    expect(verifySessionToken(createLoginToken("radek@example.com"))).toBeNull();
    expect(verifySessionToken(createSessionToken("radek@example.com"))).toBe("radek@example.com");
  });
  it("odmítne podvržený podpis", () => {
    const t = createSessionToken("radek@example.com");
    const [p] = t.split(".");
    expect(verifySessionToken(p + ".AAAA")).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
  });
});

describe("formuláře adminu", () => {
  it("parsuje jednotky a hlásí chybu", () => {
    expect(parseUnits("2+kk | 85 | 94000 | 12")).toEqual([{ name: "2+kk", area_m2: 85, price_from: 94000, available: 12 }]);
    expect(() => parseUnits("blbost")).toThrow();
  });
  const base = () => { const fd = new FormData(); const set = (k: string, v: string) => fd.set(k, v);
    set("slug", "test-proj"); set("status", "published"); set("developer", "D"); set("location", "muscat"); set("type", "villa"); set("stage", "planned"); set("completion", "2028");
    set("units", "A | 100 | 1000 | 1"); set("estimate_as_of", "2026-11-01");
    for (const l of ["cs", "de", "en", "pl"]) { set(`title_${l}`, "T"); set(`summary_${l}`, "S"); } return fd; };
  it("projekt: publikace vyžaduje všechny jazyky", () => {
    expect(parseProjectForm(base()).slug).toBe("test-proj");
    const fd = base(); fd.set("title_pl", ""); expect(() => parseProjectForm(fd)).toThrow(/PL/);
    fd.set("status", "draft"); expect(parseProjectForm(fd).status).toBe("draft");
  });
  it("projekt: špatný slug neprojde", () => { const fd = base(); fd.set("slug", "Špatný Slug"); expect(() => parseProjectForm(fd)).toThrow(); });
  it("blog: publikace vyžaduje názvy", () => {
    const fd = new FormData(); fd.set("slug", "a-b"); fd.set("status", "published"); fd.set("title_cs", "X");
    expect(() => parsePostForm(fd)).toThrow(/DE/);
    fd.set("status", "draft"); expect(parsePostForm(fd)).toHaveLength(1);
  });
});
