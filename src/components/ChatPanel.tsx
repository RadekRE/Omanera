"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Msg = { role: "user" | "assistant"; content: string };
export type ChatProject = { slug: string; title: string; summary: string };

function useStored<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => { try { const s = sessionStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch {} }, [key]);
  useEffect(() => { try { sessionStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV] as const;
}

export default function ChatPanel({ locale, projects, projectSlug }: { locale: string; projects: ChatProject[]; projectSlug?: string }) {
  const t = useTranslations("chat");
  const [msgs, setMsgs] = useStored<Msg[]>("chat.msgs", []);
  const [sid] = useStored<string>("chat.sid", typeof crypto !== "undefined" ? crypto.randomUUID() : "session-" + Math.random().toString(36).slice(2));
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => { log.current?.scrollTo({ top: 1e9 }); }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs([...next, { role: "assistant", content: "" }]); setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, locale, projectSlug, messages: next }) });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
      }
    } catch { setMsgs([...next, { role: "assistant", content: t("unavailable") }]); }
    setBusy(false);
  }

  function render(content: string) {
    const parts = content.replace("[[error]]", t("unavailable")).split(/(\[\[project:[a-z0-9-]+\]\]|\[\[human\]\])/g);
    return parts.map((p, i) => {
      const m = p.match(/^\[\[project:([a-z0-9-]+)\]\]$/);
      if (m) { const pr = projects.find((x) => x.slug === m[1]); return pr ? (
        <div key={i} className="card" style={{ margin: "8px 0" }}><strong>{pr.title}</strong><div className="muted">{pr.summary}</div>
          <Link href={`/projects/${pr.slug}`}>→ {pr.title}</Link></div>) : null; }
      if (p === "[[human]]") return <div key={i}><Link className="btn alt" href="/about">{t("human")}</Link></div>;
      return <span key={i}>{p}</span>;
    });
  }

  return (
    <div className="chat">
      <div className="notice"><span className="tag">{t("ai")}</span>{t("aiNotice")}</div>
      <div className="log" ref={log} aria-live="polite">
        {msgs.map((m, i) => (<div key={i} className={`msg ${m.role}`}>{m.role === "assistant" && <span className="tag">{t("ai")}</span>}{render(m.content)}</div>))}
      </div>
      {msgs.length === 0 && (<div className="chips">{(t.raw("chips") as string[]).map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}
        <button onClick={() => send(t("human"))}>{t("human")}</button></div>)}
      <form onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("placeholder")} maxLength={2000} aria-label={t("placeholder")} />
        <button className="btn" disabled={busy}>{t("send")}</button>
      </form>
    </div>
  );
}
