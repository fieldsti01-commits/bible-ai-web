"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(null);

  async function send() {
    setLoading(true);
    setReply(null);

    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText: input }),
    });

    setReply(await r.json());
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
      <h1>Bible AI</h1>

      <textarea
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: 12 }}
        placeholder="Ask a question or describe your situation..."
      />

      <button
        onClick={send}
        disabled={loading || !input.trim()}
        style={{ marginTop: 12 }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      <hr style={{ margin: "24px 0" }} />

      {reply?.error && <p style={{ color: "crimson" }}>Error: {reply.error}</p>}

      {reply?.summary && (
        <>
          <h3>Summary</h3>
          <p>{reply.summary}</p>
        </>
      )}

      {Array.isArray(reply?.scripture) && (
        <>
          <h3>Scripture</h3>
          <ul>
            {reply.scripture.map((s, i) => (
              <li key={i}>
                <strong>{s.reference}</strong>
                <div>{s.why_it_applies}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {Array.isArray(reply?.practical_steps) && (
  <>
    <h3>Practical steps</h3>
    <ol>
      {reply.practical_steps.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ol>
  </> 
)}
      {reply?.optional_prayer && (
        <>
          <h3>Optional prayer</h3>
          <p>{reply.optional_prayer}</p>
        </>
      )}

      {reply?.raw && (
        <>
          <h3>Raw output</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{reply.raw}</pre>
        </>
      )}
    </main>
  );
}
