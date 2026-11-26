import { NextResponse } from "next/server";
import { COOKIE, createSessionToken, sessionMaxAge, verifyLoginToken } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;
  const email = verifyLoginToken(url.searchParams.get("token") ?? undefined);
  if (!email) return NextResponse.redirect(new URL("/admin/login?error=1", base));
  const res = NextResponse.redirect(new URL("/admin", base));
  res.cookies.set(COOKIE, createSessionToken(email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge: sessionMaxAge });
  return res;
}
