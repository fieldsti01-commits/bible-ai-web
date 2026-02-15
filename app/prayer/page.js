"use client";

import Link from "next/link";
import { useState } from "react";

export default function PrayerPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [out, setOut] = useState(null);

  async function buildPrayer() {
    setErr("");
    setOut(null);

    const prompt = topic.trim();
    if (!prompt) {
      setErr("Please enter a prayer focus.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: "prayer",
          tone: "gentle-but-challenging",
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Request failed.");

      // Route returns JSON string -> parse it so it renders nicely
      const data = JSON.parse(text);
      setOut(data);
    } catch (e) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" className="backLink">
            ← Back
          </Link>
        </div>

        <header className="hero" style={{ marginTop: 10 }}>
          <h1 className="title">Prayer Builder</h1>
          <p className="subtitle">
            Guided prayer with Scripture and a clear next step.
          </p>
        </header>

        <section className="glass card">
          <div className="label">Prayer Focus</div>
          <div className="row">
            <input
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., my family, anxiety, temptation, gratitude…"
            />
            <button
              className="btn"
              onClick={buildPrayer}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Building…" : "Build Prayer"}
            </button>
          </div>
          <div className="helper">Tip: be specific (who/what/when).</div>
        </section>

        {err && (
          <section className="glass errorCard" style={{ marginTop: 14 }}>
            <div className="sectionTitle">Error</div>
            <p className="paragraph">{err}</p>
          </section>
        )}

        {out && (
          <section className="glass card" style={{ marginTop: 14 }}>
            <div className="sectionTitle">Your Prayer</div>

            {out.guidance && <p className="paragraph">{out.guidance}</p>}

            {Array.isArray(out.scripture) && out.scripture.length > 0 && (
              <>
                <h3 className="sectionTitle" style={{ marginTop: 18 }}>
                  Scripture
                </h3>
                {out.scripture.map((s, i) => (
                  <div key={i} style={{ marginTop: 12 }}>
                    <div className="gold" style={{ fontWeight: 800 }}>
                      {s.reference}
                    </div>
                    {s.short_excerpt && (
                      <p className="quote goldQuote">“{s.short_excerpt}”</p>
                    )}
                    {s.summary && <p className="paragraph">{s.summary}</p>}
                    {s.disciple_application && (
                      <p className="paragraph" style={{ opacity: 0.95 }}>
                        <strong>Application:</strong> {s.disciple_application}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}

            {out.disciple_application && (
              <>
                <h3 className="sectionTitle" style={{ marginTop: 18 }}>
                  Next Step
                </h3>
                <p className="paragraph">{out.disciple_application}</p>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}