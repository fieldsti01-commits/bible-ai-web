"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!input) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setReply(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <main className="container">
      <h1 className="title">Bible AI</h1>

      <textarea
        className="input"
        placeholder="Ask for biblical guidance..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="button" onClick={handleSubmit}>
        {loading ? "Seeking wisdom..." : "Seek Wisdom"}
      </button>

      {reply && (
        <div className="card">
          {reply.summary && (
            <>
              <h2>Guidance</h2>
              <p>{reply.summary}</p>
            </>
          )}

          {Array.isArray(reply.scripture) && (
            <>
              <h3>Scripture</h3>
              {reply.scripture.map((s, i) => (
                <div key={i} className="scripture-block">
                  <strong>{s.reference}</strong>
                  <p>{s.why_it_applies}</p>
                </div>
              ))}
            </>
          )}

          {reply.practical_steps && (
            <>
              <h3>Practical Steps</h3>
              <ul>
                {reply.practical_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </>
          )}

          {reply.reflection_question && (
  <>
    <h3>Reflection</h3>
    <p>{reply.reflection_question}</p>
  </>
)}
          {reply.optional_prayer && (
            <>
              <h3>Optional Prayer</h3>
              <p>{reply.optional_prayer}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}