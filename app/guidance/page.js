"use client";

import Link from "next/link";
import { useState } from "react";

export default function GuidancePage() {
  const [question, setQuestion] = useState(
    ""
  );
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  async function seekWisdom() {
    setErr("");
    setOut("");

    const prompt = question.trim();
    if (!prompt) {
      setErr("Please enter a question.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt, // ✅ IMPORTANT
          mode: "guidance",
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
          <h1 className="title">Guidance</h1>
          <p className="subtitle">
            Disciple-like counsel with Scripture, steps, reflection, and prayer.
          </p>
        </header>

        <section className="glass card">
          <label className="label">Your question</label>

          <textarea
            className="textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask honestly and specifically…"
            rows={3}
          />

          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="button"
              onClick={seekWisdom}
              disabled={loading}
              type="button"
            >
              {loading ? "Seeking..." : "Seek Wisdom"}
            </button>

            <div className="hint" style={{ marginLeft: 12 }}>
              Tip: be honest + specific.
            </div>
          </div>
        </section>

        {err && (
          <section className="glass card errorCard" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Error</div>
            <p className="paragraph">{err}</p>
          </section>
        )}

        {loading && (
          <section className="glass card" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Preparing guidance…</div>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton short" />
          </section>
        )}

        {out && !loading && (
          <section className="glass card fadeIn" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Your Guidance</div>
            <p className="paragraph" style={{ whiteSpace: "pre-wrap" }}>
              {out}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}