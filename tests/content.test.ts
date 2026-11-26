import { describe, expect, it } from "vitest";
import { getProjects } from "../src/lib/projects";
import { budgetExceeded, addSpend, rateLimited } from "../src/lib/ratelimit";
describe("obsah", () => { it("projekty projdou schématem (záloha ze souborů)", async () => { expect((await getProjects()).length).toBeGreaterThan(0); }); });
describe("limity", () => {
  it("rate limit blokuje po dosažení", () => { for (let i = 0; i < 3; i++) rateLimited("t", 3); expect(rateLimited("t", 3)).toBe(true); });
  it("rozpočet se překročí", () => { addSpend(10); expect(budgetExceeded(5, 100)).toBe(true); });
});
