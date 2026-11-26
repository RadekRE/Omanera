import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { chatConfig, PRICE_EUR_PER_MTOK } from "@/lib/chat-config";
import { buildSystemPrompt } from "@/lib/prompt";
import { addSpend, budgetExceeded, rateLimited } from "@/lib/ratelimit";
import { saveMessage } from "@/lib/store";

export const runtime = "nodejs";

const Body = z.object({
  sessionId: z.string().min(8).max(100),
  locale: z.enum(["cs", "de", "en", "pl"]),
  projectSlug: z.string().max(100).optional(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(chatConfig.maxInputChars) })).min(1).max(chatConfig.maxMessages)
});

const json = (status: number, code: string) => Response.json({ error: code }, { status });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, "bad_request");
  const { sessionId, locale, projectSlug, messages } = parsed.data;
  if (messages[messages.length - 1].role !== "user") return json(400, "bad_request");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`ip:${ip}`, chatConfig.rateLimitPer10Min) || rateLimited(`s:${sessionId}`, chatConfig.rateLimitPer10Min))
    return json(429, "rate_limited");
  if (budgetExceeded(chatConfig.dailyBudgetEur, chatConfig.monthlyBudgetEur)) return json(503, "budget_exceeded");
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(503, "not_configured");

  const client = new Anthropic({ apiKey });
  const system = buildSystemPrompt(locale, projectSlug);
  const last = messages[messages.length - 1].content;
  void saveMessage({ sessionId, locale, projectSlug, role: "user", content: last });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let full = "";
      try {
        const s = client.messages.stream({
          model: chatConfig.model,
          max_tokens: chatConfig.maxOutputTokens,
          system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
          messages
        });
        for await (const ev of s) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            full += ev.delta.text;
            controller.enqueue(encoder.encode(ev.delta.text));
          }
        }
        const final = await s.finalMessage();
        const tin = final.usage.input_tokens, tout = final.usage.output_tokens;
        addSpend((tin * PRICE_EUR_PER_MTOK.in + tout * PRICE_EUR_PER_MTOK.out) / 1_000_000);
        void saveMessage({ sessionId, locale, projectSlug, role: "assistant", content: full, tokensIn: tin, tokensOut: tout, model: chatConfig.model });
      } catch (e) {
        console.error("chat error", e);
        controller.enqueue(encoder.encode("\n[[error]]"));
      } finally { controller.close(); }
    }
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
