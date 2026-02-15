"use client";

import { useEffect, useMemo, useState } from "react";

function todayKey() {
  // YYYY-MM-DD local time
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  const key = useMemo(() => `daily_prayer_${todayKey()}`, []);
  const [loading, setLoading] = useState(false);
  const [prayer, setPrayer] = useState("");
  const [err, setErr] = useState("");

  async function loadDailyPrayer() {
    setErr("");
    setLoading(true);

    try {
      // Cache check
      const cached = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      if (cached) {
        setPrayer(cached);
        setLoading(false);
        return;
      }

      const prompt = `
Write ONE cohesive daily prayer that someone can pray today.
Requirements:
- Warm, disciple-like tone (gentle, not cheesy).
- 180–260 words.
- No headings, no bullet points, no explanations.
- End with "Amen."
`.trim();

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
      if (!res.ok) throw new Error(text || "Request failed.");

      setPrayer(text);
      localStorage.setItem(key, text);
    } catch (e) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDailyPrayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <h1 className="title">Worship Hub</h1>
          <p className="subtitle">
            Daily prayer + tools for Guidance, Devotional, and Prayer.
          </p>
        </header>

        <section className="glass card fadeIn">
          <div className="sectionTitle">Daily Prayer</div>

          {loading && (
            <>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton short" />
            </>
          )}

          {err && !loading && (
            <p className="paragraph" style={{ opacity: 0.9 }}>
              Couldn’t load today’s prayer. Tap refresh.
            </p>
          )}

          {!loading && !err && prayer && (
            <p className="paragraph" style={{ whiteSpace: "pre-wrap" }}>
              {prayer}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button className="button" type="button" onClick={loadDailyPrayer} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </section>

        <div className="hint" style={{ marginTop: 14 }}>
          Use the tabs below to switch between tools.
        </div>
      </div>
    </main>
  );
}