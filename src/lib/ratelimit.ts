// In-memory limiter pro kostru. TODO: přesunout do Supabase (tabulka rate_limits), protože serverless instance nesdílí paměť.
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max: number, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now); hits.set(key, arr); return false;
}
// Rozpočet: in-memory počítadlo. TODO: tabulka usage_daily v Supabase.
const spend = { day: "", eur: 0, month: "", monthEur: 0 };
export function budgetExceeded(dailyMax: number, monthlyMax: number): boolean {
  roll(); return spend.eur >= dailyMax || spend.monthEur >= monthlyMax;
}
export function addSpend(eur: number) { roll(); spend.eur += eur; spend.monthEur += eur; }
function roll() {
  const d = new Date().toISOString();
  if (spend.day !== d.slice(0, 10)) { spend.day = d.slice(0, 10); spend.eur = 0; }
  if (spend.month !== d.slice(0, 7)) { spend.month = d.slice(0, 7); spend.monthEur = 0; }
}
