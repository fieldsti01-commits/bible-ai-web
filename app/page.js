"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(null);
  const [error, setError] = useState("");

  const canSend = useMemo(() => prompt.trim().length > 0 && !loading, [prompt, loading]);

  async function ask() {
    setError("");
    setReply(null);

    const userText = prompt.trim();
    if (!userText) {
      setError("Please type a question first.");
      return;
    }

    setLoading(true);

    try {
      // This "tone" string gets passed to your API route so the model stays consistent.
      // Your route.js should combine this with its system prompt.
      const discipleTone =
        "Respond like a mature disciple of Jesus: gentle, compassionate, and honest. " +
        "Encourage repentance and obedience when needed, without condemnation. " +
        "Give clear biblical wisdom using the CEB translation when quoting. " +
        "Include relevant Scripture references (book + chapter:verse). " +
        "End with one reflective question. Optional: include a short prayer if fitting.";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: userText,      // IMPORTANT: your API expects "input"
          tone: discipleTone,   // optional, but nice to pass through
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `Request failed (${res.status}). Check your API route and environment variables.`;
        throw new Error(msg);
      }

      // Your API seems to return an object with fields like:
      // summary / scripture (array) / practical_steps / reflection / optional_prayer / raw
      setReply(data);
    } catch (e) {
      setError(e?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    // Cmd+Enter on iPad keyboard / external keyboard
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (canSend) ask();
    }
  }

  return (
    <main>
      <h1>Bible AI</h1>
      <div className="subtitle">
        Ask for biblical guidance (CEB). Gentle, disciple-like wisdom with Scripture.
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask a question, describe a situation, or share a struggle…"
      />

      <button onClick={ask} disabled={!canSend}>
        {loading ? (
          <>
            <span className="spinner" />
            Seeking Wisdom...
          </>
        ) : (
          "Seek Wisdom"
        )}
      </button>

      {/* Loading shimmer */}
      {loading && (
        <div className="skeleton">
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="panel fade-in">
          <div className="panel-title">Error</div>
          <p>{error}</p>
        </div>
      )}

      {/* Response */}
      {reply && (
        <div className="panel fade-in">
          <div className="panel-title">Guidance</div>

          {reply.summary && <p>{reply.summary}</p>}

          {/* Scripture */}
          {Array.isArray(reply.scripture) && reply.scripture.length > 0 && (
            <>
              <div className="section-title">Scripture</div>
              {reply.scripture.map((s, i) => (
                <div className="scripture-block" key={i}>
                  <strong>{s.reference || "Scripture"}</strong>
                  <p>{s.why_it_applies || s.text || ""}</p>
                </div>
              ))}
            </>
          )}

          {/* Practical steps */}
          {Array.isArray(reply.practical_steps) && reply.practical_steps.length > 0 && (
            <>
              <div className="section-title">Practical Steps</div>
              <ol>
                {reply.practical_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </>
          )}

          {/* Reflection */}
          {reply.reflection && (
            <>
              <div className="section-title">Reflection</div>
              <p>{reply.reflection}</p>
            </>
          )}

          {/* Optional prayer */}
          {reply.optional_prayer && (
            <>
              <div className="section-title">Optional Prayer</div>
              <p>{reply.optional_prayer}</p>
            </>
          )}

          {/* Debug (optional) */}
          {reply.raw && (
            <>
              <div className="section-title">Debug</div>
              <pre style={{ whiteSpace: "pre-wrap", opacity: 0.75 }}>
                {typeof reply.raw === "string" ? reply.raw : JSON.stringify(reply.raw, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </main>
  );
}