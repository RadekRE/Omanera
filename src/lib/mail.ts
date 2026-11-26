// Odeslání e-mailu přes Resend REST API (bez SDK). Bez RESEND_API_KEY vrací { sent:false }.
export async function sendMail(m: { to: string; subject: string; text: string; replyTo?: string }): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, error: "RESEND_API_KEY není nastaven" };
  const from = process.env.RESEND_FROM;
  if (!from) return { sent: false, error: "RESEND_FROM není nastaven" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [m.to], subject: m.subject, text: m.text, reply_to: m.replyTo })
    });
    if (!r.ok) return { sent: false, error: `Resend ${r.status}` };
    return { sent: true };
  } catch (e) { return { sent: false, error: String(e) }; }
}
