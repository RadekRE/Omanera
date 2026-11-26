"use client";
import { useEffect, useRef } from "react";
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const f = () => { raf = 0; const h = document.documentElement.scrollHeight - innerHeight; ref.current?.style.setProperty("--p", String(h > 0 ? Math.min(1, scrollY / h) : 0)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(f); };
    addEventListener("scroll", on, { passive: true }); f(); return () => removeEventListener("scroll", on);
  }, []);
  return <div ref={ref} className="progress" aria-hidden="true" />;
}
