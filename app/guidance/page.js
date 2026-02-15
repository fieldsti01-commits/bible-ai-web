"use client";

import { useState } from "react";
import Link from "next/link";

export default function GuidancePage() {
  const [question, setQuestion] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const q = (question || "").trim();
    if (!q) {
      setError("Please enter a question.");
      return;
    }

    setError("");
    setOut("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // send BOTH so route.js works no matter which key it expects
          prompt: q,
          input: q,
          mode: "guidance",
          tone: "gentle-but-challenging",
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      let payload;

      if (contentType.includes("application/json")) {
        payload = await res.json();
      } else {
        payload = await res.text();
      }

      if (!res.ok) {
        // show best possible error message
        const msg =
          typeof payload === "string"
            ? payload
            : payload?.error || payload?.message || "Request failed.";
        setError(msg);
        return;
      }

      // normalize output
      let text =
        typeof payload === "string"
          ? payload
          : payload?.text ||
            payload?.output ||
            payload?.result ||
            payload?.message ||
            payload?.content ||
            "";

      // if route returned { choices: ... } or something unexpected, last resort:
      if (!text && typeof payload === "object") {
        text = JSON.stringify(payload, null, 2);
      }

      if (!text || !text.trim()) {
        setError("No response returned. Check /api/chat response in Network/terminal.");
        return;
      }

      setOut(text);
    } catch (e) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="pageContent">
        <div style={{ marginBottom: 12 }}>
          <Link href="/" className="backLink">
            ← Back
          </Link>
        </div>

        <h1 className="pageTitle">Guidance</h1>
        <p className="pageSubtitle">
          Disciple-like counsel with Scripture, steps, reflection, and prayer.
        </p>

        <section className="glass card fadeIn" style={{ marginTop: 16 }}>
          <div className="sectionTitle">Your Question</div>

          <input
            className="input"
            placeholder="Ask honestly and specifically..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />

          <button className="primaryBtn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Seeking..." : "Seek Wisdom"}
          </button>

          <div className="muted" style={{ marginTop: 10 }}>
            Tip: be honest + specific.
          </div>
        </section>

        {error && (
          <section className="glass card fadeIn" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Error</div>
            <p className="paragraph">{error}</p>
          </section>
        )}

        {out && (
          <section className="glass card fadeIn" style={{ marginTop: 24 }}>
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