"use client";
import { useEffect, useRef } from "react";
import Arch from "./Arch";
/** Oblouky se mírně posouvají se scrollem a za ukazatelem. Při prefers-reduced-motion stojí. */
export default function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current; const el = box?.querySelector("svg") as SVGElement | null; if (!box || !el) return; if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, px = 0, py = 0;
    const apply = () => { raf = 0; el.style.transform = `translate3d(${px * 14}px, ${window.scrollY * -0.06 + py * 10}px, 0)`; };
    const sched = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const move = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; sched(); };
    addEventListener("scroll", sched, { passive: true }); addEventListener("pointermove", move, { passive: true });
    return () => { removeEventListener("scroll", sched); removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div className="art" aria-hidden="true" ref={ref}><Arch rings={6} /></div>;
}
