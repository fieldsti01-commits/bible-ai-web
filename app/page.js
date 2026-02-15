"use client";

import { useEffect, useMemo, useState } from "react";

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  const day = useMemo(() => todayKey(), []);

  const verseKey = useMemo(() => `ai_verse_${day}`, [day]);
  const prayerKey = useMemo(() => `ai_prayer_${day}`, [day]);

  const [verseLoading, setVerseLoading] = useState(false);
  const [verseErr, setVerseErr] = useState("");
  const [verse, setVerse] = useState(null); // { reference, excerpt, reflection }

  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerErr, setPrayerErr] = useState("");
  const [prayer, setPrayer] = useState("");

  async function loadVerseOfDay(force = false) {
    setVerseErr("");
    setVerseLoading(true);

    try {
      if (!force) {
        const cached = localStorage.getItem(verseKey);
        if (cached) {
          setVerse(JSON.parse(cached));
          setVerseLoading(false);
          return;
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "verse",
          prompt: `
Create a Verse of the Day in this exact format:
REFERENCE: <book chapter:verse>
EXCERPT: <very short excerpt, max ~20 words>
REFLECTION: <one sentence reflection>

Notes:
- Use CEB-style reference formatting.
- Keep the excerpt short (no long Bible quotes).
`.trim(),
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Verse request failed.");

      // Parse the 3 lines reliably
      const ref = (text.match(/REFERENCE:\s*(.*)/i)?.[1] || "").trim();
      const excerpt = (text.match(/EXCERPT:\s*(.*)/i)?.[1] || "").trim();
      const reflection = (text.match(/REFLECTION:\s*(.*)/i)?.[1] || "").trim();

      const v = { reference: ref, excerpt, reflection };
      setVerse(v);
      localStorage.setItem(verseKey, JSON.stringify(v));
    } catch (e) {
      setVerseErr(e?.message || "Couldn’t load verse today.");
    } finally {
      setVerseLoading(false);
    }
  }

  async function loadDailyPrayer(force = false) {
    setPrayerErr("");
    setPrayerLoading(true);

    try {
      if (!force) {
        const cached = localStorage.getItem(prayerKey);
        if (cached) {
          setPrayer(cached);
          setPrayerLoading(false);
          return;
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "prayer",
          prompt: `
Write ONE cohesive daily prayer someone can pray today.
- Gentle, disciple-like tone (not cheesy)
- 180–260 words
- No headings, no bullet points
- End with "Amen."
`.trim(),
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Prayer request failed.");

      setPrayer(text);
      localStorage.setItem(prayerKey, text);
    } catch (e) {
      setPrayerErr(e?.message || "Couldn’t load prayer today.");
    } finally {
      setPrayerLoading(false);
    }
  }

  useEffect(() => {
    loadVerseOfDay(false);
    loadDailyPrayer(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <div className="pageContent">
        <header className="hero">
          <h1 className="title">Worship Hub</h1>
          <p className="subtitle">Daily verse + daily prayer (AI), refreshed every day.</p>
        </header>

        {/* Verse of the Day */}
        <section className="glass card fadeIn" style={{ marginTop: 16 }}>
          <div className="sectionTitle">Verse of the Day</div>

          {verseLoading && (
            <>
              <div className="skeleton" />
              <div className="skeleton short" />
            </>
          )}

          {!verseLoading && verseErr && (
            <p className="paragraph">{verseErr}</p>
          )}

          {!verseLoading && verse && (
            <>
              <div className="pill" style={{ display: "inline-flex", marginTop: 10 }}>
                {verse.reference || "—"}
              </div>
              <p className="paragraph" style={{ marginTop: 12 }}>
                <span className="gold">“{verse.excerpt || "—"}”</span>
              </p>
              <p className="muted" style={{ marginTop: 10 }}>
                {verse.reflection || ""}
              </p>
            </>
          )}

          <button
            className="secondaryBtn"
            style={{ marginTop: 14 }}
            onClick={() => loadVerseOfDay(true)}
            disabled={verseLoading}
            type="button"
          >
            {verseLoading ? "Refreshing…" : "Refresh Verse"}
          </button>
        </section>

        {/* Daily Prayer */}
        <section className="glass card fadeIn" style={{ marginTop: 16 }}>
          <div className="sectionTitle">Daily Prayer</div>

          {prayerLoading && (
            <>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton short" />
            </>
          )}

          {!prayerLoading && prayerErr && (
            <p className="paragraph">{prayerErr}</p>
          )}

          {!prayerLoading && prayer && (
            <p className="paragraph" style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>
              {prayer}
            </p>
          )}

          <button
            className="secondaryBtn"
            style={{ marginTop: 14 }}
            onClick={() => loadDailyPrayer(true)}
            disabled={prayerLoading}
            type="button"
          >
            {prayerLoading ? "Refreshing…" : "Refresh Prayer"}
          </button>
        </section>
      </div>
    </main>
  );
}