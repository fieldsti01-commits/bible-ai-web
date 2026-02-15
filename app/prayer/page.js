"use client";

import Link from "next/link";
import { useState } from "react";

 export default function PrayerPage() {
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  async function buildPrayer() {
    setErr("");
    setOut("");

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
          tone: "gentle",
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Request failed.");
      }

      setOut(text);
    } catch (e) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <div style={{ marginBottom: 12 }}>
          <Link href="/" className="backLink">
            ← Back
          </Link>
        </div>

        <header className="hero">
          <h1 className="title">Prayer Builder</h1>
          <p className="subtitle">A simple prayer you can pray right now.</p>
        </header>

        <section className="glass card">
          <label className="label">Prayer Focus</label>

          <div className="row">
            <input
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., anxiety, family, temptation, guidance"
            />

            <button
              className="button"
              onClick={buildPrayer}
              disabled={loading}
              type="button"
            >
              {loading ? "Building..." : "Build Prayer"}
            </button>
          </div>

          <div className="hint">Keep it short and specific.</div>
        </section>

        {err && (
          <section className="glass card errorCard" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Error</div>
            <p className="paragraph">{err}</p>
          </section>
        )}

        {loading && (
          <section className="glass card" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Preparing your prayer…</div>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton short" />
          </section>
        )}

        {out && !loading && (
          <section className="glass card fadeIn" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Your Prayer</div>
            <p className="paragraph" style={{ whiteSpace: "pre-wrap" }}>
              {out}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}