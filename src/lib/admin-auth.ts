import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COOKIE = "admin_session";
const LOGIN_TTL = 15 * 60;       // odkaz z e-mailu platí 15 minut
const SESSION_TTL = 7 * 24 * 3600; // přihlášení 7 dní

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET musí mít alespoň 32 znaků");
  return s;
}
const b64 = (s: string) => Buffer.from(s).toString("base64url");
function sign(kind: "login" | "session", email: string, ttl: number, now = Date.now()): string {
  const payload = b64(JSON.stringify({ k: kind, e: email, x: Math.floor(now / 1000) + ttl }));
  const mac = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}
function verify(kind: "login" | "session", token: string | undefined, now = Date.now()): string | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(mac), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (d.k !== kind || typeof d.e !== "string" || d.x < Math.floor(now / 1000)) return null;
    return isAllowed(d.e) ? d.e : null;
  } catch { return null; }
}
export function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}
export const isAllowed = (email: string) => allowedEmails().includes(email.trim().toLowerCase());
export const createLoginToken = (email: string, now?: number) => sign("login", email.trim().toLowerCase(), LOGIN_TTL, now);
export const verifyLoginToken = (t: string | undefined, now?: number) => verify("login", t, now);
export const createSessionToken = (email: string, now?: number) => sign("session", email.trim().toLowerCase(), SESSION_TTL, now);
export const verifySessionToken = (t: string | undefined, now?: number) => verify("session", t, now);
export const sessionMaxAge = SESSION_TTL;

/** Pro stránky a akce v adminu: vrátí e-mail přihlášeného, jinak přesměruje na přihlášení. */
export async function requireAdmin(): Promise<string> {
  let email: string | null = null;
  try { email = verifySessionToken((await cookies()).get(COOKIE)?.value); } catch { email = null; }
  if (!email) redirect("/admin/login");
  return email;
}
