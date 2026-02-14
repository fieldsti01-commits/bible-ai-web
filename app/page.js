"use client";

import { useMemo, useState } from "react";

/**
 * Bible AI - page.js
 * Expects API route: POST /api/chat with JSON { input, tone? }
 * Returns: { summary: string } OR { error: string }
 */

export default function Home() {
  const [input, setInput] = useState(
    "Why do I struggle to trust God even when I say I believe?"
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [raw, setRaw] = useState(null);

  // Parsed view-model (what we render in that “Guidance / Scripture / etc” layout)
  const parsed = useMemo(() => {
    if (!raw?.summary) return null;
    return parseDiscipleResponse(raw.summary);
  }, [raw]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setRaw(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setErr("Please type a question first.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          tone:
            "Gentle, disciple-like wisdom. Challenge with love when needed. Deep discipleship.",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || "Something went wrong.");
        setRaw({ error: data?.error || "Request failed", debug: data });
        return;
      }

      if (!data?.summary) {
        setErr("No message provided.");
        setRaw({ error: "No message provided.", debug: data });
        return;
      }

      setRaw({ summary: data.summary, debug: data });
    } catch (e2) {
      setErr(e2?.message || "Network error");
      setRaw({ error: e2?.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      {/* Background glow */}
      <div className="bg-glow" aria-hidden="true" />

      <section className="shell">
        <header className="hero">
          <h1 className="title">Bible AI</h1>
          <p className="subtitle">
            Ask for biblical guidance (CEB). Gentle, disciple-like wisdom with
            Scripture.
          </p>
        </header>

        <form onSubmit={onSubmit} className="form">
          <textarea
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for biblical guidance..."
            rows={3}
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Seeking Wisdom…
              </span>
            ) : (
              "Seek Wisdom"
            )}
          </button>
        </form>

        {/* Error */}
        {err ? (
          <div className="card error-card">
            <h2 className="card-title">Error</h2>
            <p className="muted">{err}</p>
          </div>
        ) : null}

        {/* Loading skeleton */}
        {loading ? (
          <div className="card guidance-card fade-in">
            <div className="skeleton h24 w40" />
            <div className="skeleton h12 w95" />
            <div className="skeleton h12 w90" />
            <div className="skeleton h12 w85" />
            <div className="spacer" />
            <div className="skeleton h18 w30" />
            <div className="stack">
              <div className="skeleton h70 w100" />
              <div className="skeleton h70 w100" />
              <div className="skeleton h70 w100" />
            </div>
          </div>
        ) : null}

        {/* Result in the same layout as your screenshot */}
        {!loading && parsed ? (
          <div className="card guidance-card pop-in">
            <h2 className="card-title">Guidance</h2>
            <p className="body">{parsed.guidance}</p>

            <h3 className="section-title">Scripture</h3>

            <div className="stack">
              {parsed.scripture.map((s, idx) => (
                <div className="scripture-card" key={idx}>
                  <div className="scripture-ref">{s.reference}</div>
                  <div className="scripture-text">{s.text}</div>
                  {s.why ? <div className="scripture-why">{s.why}</div> : null}
                </div>
              ))}
            </div>

            {parsed.practicalSteps?.length ? (
              <>
                <h3 className="section-title">Practical Steps</h3>
                <ol className="list">
                  {parsed.practicalSteps.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </>
            ) : null}

            {parsed.reflection ? (
              <>
                <h3 className="section-title">Reflection</h3>
                <p className="body">{parsed.reflection}</p>
              </>
            ) : null}

            {parsed.optionalPrayer ? (
              <>
                <h3 className="section-title">Optional Prayer</h3>
                <p className="prayer">{parsed.optionalPrayer}</p>
              </>
            ) : null}

            {/* Tiny debug toggle (optional) */}
            {raw?.debug ? (
              <details className="debug">
                <summary>Debug (Raw API Response)</summary>
                <pre>{JSON.stringify(raw.debug, null, 2)}</pre>
              </details>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}

/**
 * Attempts to parse a plain-text disciple response into:
 * Guidance, Scripture cards, Practical Steps, Reflection, Optional Prayer.
 * Works even if the model returns simple paragraphs.
 */
function parseDiscipleResponse(text) {
  const cleaned = (text || "").trim();
  if (!cleaned) return null;

  // Split on common headings if present
  const sections = splitByHeadings(cleaned);

  const guidance =
    sections.guidance ||
    sections.intro ||
    firstParagraph(cleaned) ||
    cleaned;

  const scripture = parseScriptureBlocks(sections.scripture || cleaned);

  const practicalSteps = parseListItems(sections.practicalSteps || "");
  const reflection =
    sections.reflection ||
    findLastQuestion(cleaned) ||
    "What is one next step of trust you can take today?";
  const optionalPrayer = sections.optionalPrayer || "";

  return {
    guidance: guidance.trim(),
    scripture: scripture.length
      ? scripture
      : [
          {
            reference: "Mark 9:24",
            text: "“I do have faith; help my lack of faith!”",
            why: "",
          },
        ],
    practicalSteps,
    reflection: reflection.trim(),
    optionalPrayer: optionalPrayer.trim(),
  };
}

function splitByHeadings(text) {
  const out = {};
  const lines = text.split("\n");

  let current = "intro";
  out[current] = "";

  const mapHeading = (h) => {
    const x = h.toLowerCase().trim();
    if (x.includes("guidance")) return "guidance";
    if (x.includes("scripture")) return "scripture";
    if (x.includes("practical")) return "practicalSteps";
    if (x.includes("reflection")) return "reflection";
    if (x.includes("prayer")) return "optionalPrayer";
    return null;
  };

  for (const line of lines) {
    const heading = mapHeading(line.replace(/[:]/g, ""));
    if (heading) {
      current = heading;
      if (!out[current]) out[current] = "";
      continue;
    }
    out[current] += line + "\n";
  }

  return out;
}

function firstParagraph(text) {
  const parts = text.split("\n\n").map((p) => p.trim()).filter(Boolean);
  return parts[0] || "";
}

function findLastQuestion(text) {
  const qs = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.endsWith("?"));
  return qs[qs.length - 1] || "";
}

function parseListItems(block) {
  if (!block) return [];
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];
  for (const l of lines) {
    // Handles "1. ..." "- ..." "• ..."
    const m = l.match(/^(\d+\.)\s+(.*)$/);
    if (m) items.push(m[2].trim());
    else if (l.startsWith("- ")) items.push(l.slice(2).trim());
    else if (l.startsWith("• ")) items.push(l.slice(2).trim());
  }
  return items;
}

function parseScriptureBlocks(block) {
  if (!block) return [];

  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const results = [];
  let current = null;

  const looksLikeRef = (s) =>
    /^(?:[1-3]\s)?[A-Za-z]+\s+\d+:\d+/.test(s);

  for (const line of lines) {
    if (looksLikeRef(line)) {
      if (current) results.push(current);
      current = { reference: line, text: "", why: "" };
      continue;
    }
    if (!current) continue;

    // Heuristic: first sentence = verse text, rest = why it applies
    if (!current.text) current.text = line;
    else current.why += (current.why ? " " : "") + line;
  }

  if (current) results.push(current);

  // If the model wrote scripture in paragraphs instead of refs, keep it minimal
  return results.slice(0, 6);
}