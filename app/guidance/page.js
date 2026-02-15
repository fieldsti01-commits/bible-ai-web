"use client";

import { useState } from "react";

export default function GuidancePage() {
  const [question, setQuestion] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
  const q = question.trim();
  if (!q) {
    setErr("Please enter a question.");
    return;
  }

  setErr("");
  setOut("");
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // send BOTH so route.js works no matter which it expects
        prompt: q,
        input: q,
        mode: "guidance",
        tone: "gentle-but-challenging",
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      setErr(text || "Request failed.");
      return;
    }

    if (!text || !text.trim()) {
      setErr("No response returned. Check route.js prompt parsing.");
      return;
    }

    setOut(text);
  } catch (e) {
    setErr(e?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="page">
      <div className="pageContent">

        {/* Input Card */}
        <section className="glass card fadeIn">
          <div className="sectionTitle">Your Question</div>

          <input
            className="input"
            placeholder="Ask honestly and specifically..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="primaryBtn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Seeking..." : "Seek Wisdom"}
          </button>

          <div className="muted" style={{ marginTop: 10 }}>
            Tip: be honest + specific.
          </div>
        </section>

        {/* Error */}
        {error && (
          <section className="glass card" style={{ marginTop: 24 }}>
            <div className="sectionTitle">Error</div>
            <p className="paragraph">{error}</p>
          </section>
        )}

        {/* Output */}
        {out && !loading && (
          <section className="glass card fadeIn" style={{ marginTop: 24 }}>
            <div className="sectionTitle">Your Guidance</div>
            <p
              className="paragraph"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {out}
            </p>
          </section>
        )}

      </div>
    </main>
  );
}