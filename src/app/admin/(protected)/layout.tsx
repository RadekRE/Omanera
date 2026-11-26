import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { brand } from "@brand/brand.config";
import { COOKIE, requireAdmin } from "@/lib/admin-auth";

async function logout() { "use server"; (await cookies()).delete({ name: COOKIE, path: "/admin" }); redirect("/admin/login"); }

export default async function Protected({ children }: { children: ReactNode }) {
  const email = await requireAdmin();
  return (<>
    <header className="site"><div className="container">
      <Link href="/admin" className="logo">{brand.name} admin</Link>
      <nav className="main"><Link href="/admin/conversations">Rozhovory</Link><Link href="/admin/leads">Leady</Link>
        <Link href="/admin/projects">Projekty</Link><Link href="/admin/blog">Blog</Link>
        <span className="muted">{email}</span><form action={logout}><button className="btn alt">Odhlásit</button></form></nav>
    </div></header>
    <main className="container">{children}</main>
  </>);
}
