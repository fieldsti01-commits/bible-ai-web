"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !loading, [prompt, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setReply(null);

    const p = prompt.trim();
    if (!p) {
      setError("Type a question first.");
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

      if (!data?.reply) {
        setError("No reply returned.");
        return;
      }

      setReply(data.reply);
    } catch (err) {
      setError(err?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="header">
          <h1 className="title">Bible AI</h1>
          <p className="subtitle">
            Ask for biblical guidance (CEB). Gentle, disciple-like wisdom with Scripture.
          </p>
        </header>

        <form className="form" onSubmit={onSubmit}>
          <textarea
            className="input"
            placeholder="Ask for biblical guidance..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />

          <button className={`btn ${loading ? "btnLoading" : ""}`} type="submit" disabled={!canSubmit}>
            {loading ? (
              <span className="dots" aria-label="Loading">
                <span>.</span><span>.</span><span>.</span>
              </span>
            ) : (
              "Seek Wisdom"
            )}
          </button>
        </form>

        {error ? (
          <section className="card cardError" role="alert">
            <h2 className="cardTitle">Error</h2>
            <p className="muted">{error}</p>
          </section>
        ) : null}

        {loading ? (
          <section className="card cardLoading" aria-live="polite">
            <h2 className="cardTitle">Listening…</h2>
            <p className="muted">Taking a moment to respond with Scripture and wisdom.</p>
            <div className="skeleton">
              <div className="skLine" />
              <div className="skLine" />
              <div className="skLine short" />
            </div>
          </section>
        ) : null}

        {reply ? (
          <section className="card">
            <h2 className="cardTitle">Guidance</h2>
            <p className="bodyText">{reply.guidance}</p>

            <h3 className="sectionTitle">Scripture</h3>
            <div className="stack">
              {Array.isArray(reply.scriptures) &&
                reply.scriptures.map((s, i) => (
                  <div className="scriptureBlock" key={i}>
                    <strong className="scriptureRef">{s.reference}</strong>
                    <div className="muted">{s.why_it_applies}</div>
                  </div>
                ))}
            </div>

            {Array.isArray(reply.practical_steps) && reply.practical_steps.length > 0 ? (
              <>
                <h3 className="sectionTitle">Practical Steps</h3>
                <ol className="list">
                  {reply.practical_steps.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </>
            ) : null}

            {reply.reflection ? (
              <>
                <h3 className="sectionTitle">Reflection</h3>
                <p className="bodyText">{reply.reflection}</p>
              </>
            ) : null}

            {reply.optional_prayer ? (
              <>
                <h3 className="sectionTitle">Optional Prayer</h3>
                <p className="prayer">{reply.optional_prayer}</p>
              </>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}