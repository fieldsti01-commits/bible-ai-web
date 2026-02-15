"use client";

import { useState } from "react";
import Link from "next/link";

export default function PrayerPage() {
  const [topic, setTopic] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function buildPrayer() {
    setErr("");
    setOut("");

    if (!topic.trim()) {
      setErr("Please enter a prayer focus.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: topic.trim(),
          mode: "prayer",
        }),
      });

      const data = await res.text();

      if (!res.ok) throw new Error(text);

      setOut(data);
    } catch (e) {
      setErr("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">

        <Link href="/" className="backLink">← Back</Link>

        <h1 className="pageTitle">Prayer Builder</h1>
        <p className="pageSubtitle">
          A guided prayer using the ACTS pattern: Adoration, Confession, Thanksgiving, Supplication.
        </p>

        <div className="glass card">

          <label className="label">Prayer Focus</label>

          <div className="inputRow">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. my family, fear, direction..."
              className="input"
            />

            <button
              onClick={buildPrayer}
              disabled={loading}
              className="primaryButton"
            >
              {loading ? "Building..." : "Build Prayer"}
            </button>
          </div>

        </div>

        {err && (
          <div className="errorCard">
            {err}
          </div>
        )}

        {out && (
          <div className="glass card" style={{ marginTop: 20 }}>
            <div className="sectionTitle">Your Prayer</div>
            <p className="paragraph">{out}</p>
          </div>
        )}

      </div>
    </main>
  );
}