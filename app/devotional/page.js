"use client";

import Link from "next/link";
import { useState } from "react";

export default function DevotionalPage() {
  const [topic, setTopic] = useState("peace");
  const [reply, setReply] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(e) {
    e.preventDefault();
    setError("");
    setReply(null);

    const t = topic.trim() || "faithfulness";
    const prompt = `Create a short daily devotional about "${t}".
Return: guidance, 5-8 scriptures, 3-5 practical_steps, 1 reflection question, and a short prayer.`;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data?.error || "Something went wrong.");
      else setReply(data);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="shell">
        <div className="topNav">
          <Link className="backLink" href="/">← Back</Link>
          <div className="crumb">Daily Devotional</div>
        </div>

        <form className="card card--glass" onSubmit={generate}>
          <label className="label">Devotional topic</label>
          <input
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="peace, anxiety, gratitude, patience…"
          />
          <button className="btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner" /> Generating…</span>
            ) : (
              "Generate Devotional"
            )}
          </button>
        </form>

        {error ? (
          <section className="card card--glass card--error reveal">
            <h2 className="h2">Error</h2>
            <p className="p">{error}</p>
          </section>
        ) : null}

        {loading ? <LoadingCard /> : null}

        {reply ? (
          <section className="card card--glass reveal">
            <h2 className="h2">Today</h2>
            <p className="p">{reply.guidance}</p>

            <h3 className="h3">Scripture</h3>
            <div className="scriptureGrid">
              {(reply.scripture || []).map((s, i) => (
                <article className="scriptureCard" key={i}>
                  <div className="scriptureRef">{s.reference}</div>
                  <div className="scriptureSummary">{s.summary}</div>
                </article>
              ))}
            </div>

            <h3 className="h3">Practice</h3>
            <ol className="list">
              {(reply.practical_steps || []).map((st, i) => <li key={i}>{st}</li>)}
            </ol>

            <h3 className="h3">Reflection</h3>
            <p className="p">{reply.reflection}</p>

            <h3 className="h3">Prayer</h3>
            <p className="p p--prayer">{reply.optional_prayer}</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function LoadingCard() {
  return (
    <section className="card card--glass reveal">
      <div className="skeletonLine w60" />
      <div className="skeletonLine w95" />
      <div className="skeletonLine w90" />
      <div className="skeletonLine w80" />
      <div className="skeletonBlock" />
    </section>
  );
}