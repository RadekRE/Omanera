import { COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
const q = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replaceAll('"', '""')}"`; }; // ochrana proti CSV injection
export async function GET() {
  let ok = false; try { ok = !!verifySessionToken((await cookies()).get(COOKIE)?.value); } catch {}
  if (!ok) return new Response("Unauthorized", { status: 401 });
  const db = getDb(); if (!db) return new Response("Supabase není nastaveno", { status: 503 });
  const { data } = await db.from("leads").select("*").order("created_at", { ascending: false });
  const cols = ["created_at", "name", "email", "phone", "locale", "project_slug", "source", "status", "consent_marketing", "message", "note"];
  const csv = [cols.join(","), ...(data ?? []).map((r) => cols.map((c) => q((r as Record<string, unknown>)[c])).join(","))].join("\n");
  return new Response("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="leads.csv"' } });
}
