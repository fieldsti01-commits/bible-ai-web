// app/page.js
"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !loading, [prompt, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setReply(null);

    const p = prompt.trim();
    if (!p) {
      setError("Please type a question first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
        return;
      }

      setReply(data);
    } catch (err) {
      setError(err?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <div className="bg" aria-hidden="true" />

      <section className="shell">
        <header className="header">
          <h1 className="title">Bible AI</h1>
          <p className="subtitle">
            Ask for biblical guidance (CEB-style). Gentle, disciple-like wisdom with Scripture.
          </p>
        </header>

        <form className="card card--glass" onSubmit={onSubmit}>
          <label className="label" htmlFor="prompt">
            Your question
          </label>

          <textarea
            id="prompt"
            className="input"
            placeholder="Example: Why do I struggle to trust God even when I say I believe?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />

          <div className="actions">
            <button className="btn" type="submit" disabled={!canSubmit}>
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Seeking wisdom…
                </>
              ) : (
                "Seek Wisdom"
              )}
            </button>
            <span className="hint">
              {loading ? "Generating guidance…" : "Tip: be honest + specific."}
            </span>
          </div>
        </form>

        {error ? (
          <section className="card card--glass card--error" role="alert">
            <h2 className="h2">Error</h2>
            <p className="p">{error}</p>
          </section>
        ) : null}

        {loading ? (
          <section className="stack">
            <SkeletonCard />
            <SkeletonCard />
          </section>
        ) : null}

        {reply ? (
          <section className="stack">
            <section className="card card--glass reveal">
              <h2 className="h2">Guidance</h2>
              <p className="p">{reply.guidance}</p>

              <h3 className="h3">Scripture</h3>
              <div className="scriptureGrid">
                {(Array.isArray(reply.scripture) ? reply.scripture : []).map((s, i) => (
                  <article className="scriptureCard" key={`${s.reference}-${i}`}>
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
                {(Array.isArray(reply.practical_steps) ? reply.practical_steps : []).map(
                  (step, i) => (
                    <li key={i}>{step}</li>
                  )
                )}
              </ol>

              <h3 className="h3">Reflection</h3>
              <p className="p">{reply.reflection}</p>

              <h3 className="h3">Optional Prayer</h3>
              <p className="p p--prayer">{reply.optional_prayer}</p>
            </section>
          </section>
        ) : null}

        <footer className="footer">
          <span className="muted">
            Note: Scripture is summarized for clarity and to avoid long quotes.
          </span>
        </footer>
      </section>
    </main>
  );
}

function SkeletonCard() {
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