"use client";
import { useRef, type ReactNode } from "react";
/** Světelná skvrna na kartě za ukazatelem (mikrointerakce). */
export default function Spotlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} style={{ display: "contents" }} onPointerMove={(e) => { const c = (e.currentTarget.firstElementChild as HTMLElement | null); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`); }}>{children}</div>;
}
