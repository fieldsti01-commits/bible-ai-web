"use client";

import Link from "next/link";
import { useState } from "react";

export default function DevotionalPage() {
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  async function buildDevotional() {
    setErr("");
    setOut("");

    const prompt = theme.trim();
    if (!prompt) {
      setErr("Please enter a devotional theme.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,            // ✅ IMPORTANT
          mode: "devotional",
          tone: "gentle",
        }),
      });

      const text = await res.text(); // ✅ IMPORTANT (API returns plain text)

      if (!res.ok) throw new Error(text || "Request failed.");

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
          <h1 className="title">Daily Devotional</h1>
          <p className="subtitle">
            A short devotional: theme, Scripture, encouragement, and a prayer.
          </p>
        </header>

        <section className="glass card">
          <label className="label">Devotional theme</label>

          <div className="row">
            <input
              className="input"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., anxiety, gratitude, faith, forgiveness"
            />

            <button
              className="button"
              onClick={buildDevotional}
              disabled={loading}
              type="button"
            >
              {loading ? "Building..." : "Build Devotional"}
            </button>
          </div>

          <div className="hint">Tip: keep it short + specific.</div>
        </section>

        {err && (
          <section className="glass card errorCard" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Error</div>
            <p className="paragraph">{err}</p>
          </section>
        )}

        {loading && (
          <section className="glass card" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Preparing your devotional…</div>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton short" />
          </section>
        )}

        {out && !loading && (
          <section className="glass card fadeIn" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Your Devotional</div>
            <p className="paragraph" style={{ whiteSpace: "pre-wrap" }}>
              {out}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}