export const chatConfig = {
  model: process.env.CHAT_MODEL ?? "claude-haiku-5-5",
  maxOutputTokens: Number(process.env.CHAT_MAX_OUTPUT_TOKENS ?? 700),
  maxMessages: Number(process.env.CHAT_MAX_MESSAGES ?? 30),
  maxInputChars: 2000,
  rateLimitPer10Min: Number(process.env.CHAT_RATE_LIMIT_PER_10MIN ?? 20),
  dailyBudgetEur: Number(process.env.DAILY_BUDGET_EUR ?? 5),
  monthlyBudgetEur: Number(process.env.MONTHLY_BUDGET_EUR ?? 100)
};
// Orientační ceny za 1M tokenů v EUR (upravit podle skutečného ceníku modelu).
export const PRICE_EUR_PER_MTOK = { in: 1, out: 5 };
