import TabBar from "../components/TabBar";

"use client";

import Link from "next/link";
import { useState } from "react";

export default function PrayerPage() {
  const [topic, setTopic] = useState("family");
  const [reply, setReply] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function build(e) {
    e.preventDefault();
    setError("");
    setReply(null);

    const t = topic.trim() || "wisdom";
    const prompt = `Build a guided prayer about "${t}" using ACTS:
Adoration, Confession, Thanksgiving, Supplication.
Return: guidance (short intro), 5 scriptures, 3-5 practical steps, 1 reflection, and optional_prayer.
In optional_prayer, format with headings: Adoration:, Confession:, Thanksgiving:, Supplication:, Amen.`;

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
          <div className="crumb">Prayer Builder</div>
        </div>

        <form className="card card--glass" onSubmit={build}>
          <label className="label">Prayer focus</label>
          <input
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="family, anxiety, healing, courage…"
          />
          <button className="btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner" /> Building…</span>
            ) : (
              "Build Prayer"
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
            <h2 className="h2">Prayer Guide</h2>
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

            <h3 className="h3">Optional Prayer</h3>
            <pre className="prayerBlock">{reply.optional_prayer}</pre>

            <h3 className="h3">Reflection</h3>
            <p className="p">{reply.reflection}</p>
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
<TabBar />