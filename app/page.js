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
  <main className="wrap">
    <div className="topbar">
      <div className="brand">
        <h1>Bible AI</h1>
        <p>Warm, Scripture-centered guidance for everyday life.</p>
      </div>
      <div className="badge">CEB • Neutral Christian</div>
    </div>

    <div className="grid">
      {/* Left: Input */}
      <div className="card">
        <div className="cardHeader">
          <h2>Ask</h2>
          <span className="small">Private link for friends</span>
        </div>
        <div className="cardBody">
          <p className="label">Invite code</p>
          <input
            className="input"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
          />

          <div className="section">
            <p className="label">Your question</p>
            <textarea
              className="textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or describe your situation..."
            />
          </div>

          <div className="actions">
            <button
              className="button primary"
              onClick={send}
              disabled={loading || !input.trim() || !inviteCode.trim()}
            >
              {loading ? "Thinking..." : "Send"}
            </button>

            <button
              className="button ghost"
              onClick={() => {
                setInput("");
                setReply(null);
              }}
              type="button"
            >
              Clear
            </button>
          </div>

          {reply?.error && <div className="notice">⚠️ {reply.error}</div>}
        </div>
      </div>

      {/* Right: Response */}
      <div className="card">
        <div className="cardHeader">
          <h2>Response</h2>
          <span className="small">Scripture + steps</span>
        </div>

        <div className="panel">
          {!reply && (
            <div className="block">
              <div className="small">
                Ask a question on the left. You’ll see a summary, relevant Scripture references,
                practical steps, and an optional prayer.
              </div>
            </div>
          )}

          {reply?.summary && (
            <div className="section">
              <div className="sectionTitle">Guidance</div>
              <div className="block">{reply.summary}</div>
            </div>
          )}

          {Array.isArray(reply?.scripture) && (
            <div className="section">
              <div className="sectionTitle">Related Scripture</div>
              <div className="block">
                <div className="quote">
                  {reply.scripture.map((s, i) => (
                    <div key={i} style={{ marginBottom: i === reply.scripture.length - 1 ? 0 : 14 }}>
                      <div className="ref">{s.reference}</div>
                      <div className="small">{s.why_it_applies}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {Array.isArray(reply?.practical_steps) && (
            <div className="section">
              <div className="sectionTitle">Next steps</div>
              <div className="block">
                <ol className="list">
                  {reply.practical_steps.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {reply?.optional_prayer && (
            <div className="section">
              <div className="sectionTitle">Optional prayer</div>
              <div className="block">{reply.optional_prayer}</div>
            </div>
          )}

          {reply?.raw && (
            <div className="section">
              <div className="sectionTitle">Raw output</div>
              <div className="block">
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{reply.raw}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </main>
);