"use client";

import Link from "next/link";
import { useState } from "react";

export default function GuidancePage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setReply(null);

    const p = prompt.trim();
    if (!p) return setError("Type a question first.");

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
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
          <div className="crumb">Guidance</div>
        </div>

        <form className="card card--glass" onSubmit={submit}>
          <label className="label">Your question</label>
          <textarea
            className="input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for biblical guidance..."
          />
          <button className="btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Seeking wisdom…
              </span>
            ) : (
              "Seek Wisdom"
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
            <h2 className="h2">Guidance</h2>
            <p className="p">{reply.guidance}</p>

            <h3 className="h3">Scripture</h3>
            <div className="scriptureGrid">
              {(reply.scripture || []).map((s, i) => (
                <article className="scriptureCard" key={i}>
                  <div className="scriptureRef">{s.reference}</div>
                  {s.short_excerpt?.trim() ? (
                    <div className="scriptureExcerpt">“{s.short_excerpt.trim()}”</div>
                  ) : null}
                  <div className="scriptureSummary">{s.summary}</div>
                  <div className="scriptureApply">
                    <strong>Disciple step:</strong> {s.disciple_application}
                  </div>
                </article>
              ))}
            </div>

            <h3 className="h3">Practical Steps</h3>
            <ol className="list">
              {(reply.practical_steps || []).map((st, i) => <li key={i}>{st}</li>)}
            </ol>

            <h3 className="h3">Reflection</h3>
            <p className="p">{reply.reflection}</p>

            <h3 className="h3">Optional Prayer</h3>
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