"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="bg-glow" aria-hidden="true" />
      <section className="shell">
        <header className="hero">
          <h1 className="title">Worship Hub</h1>
          <p className="subtitle">
            Three simple tools for daily worship: Guidance, Devotional, and Prayer.
          </p>
        </header>

        <div className="grid">
          <Link className="toolCard" href="/guidance">
            <div className="toolIcon">🕊️</div>
            <div className="toolTitle">Guidance</div>
            <div className="toolDesc">
              Disciple-like counsel with Scripture, steps, reflection, and prayer.
            </div>
          </Link>

          <Link className="toolCard" href="/devotional">
            <div className="toolIcon">📖</div>
            <div className="toolTitle">Daily Devotional</div>
            <div className="toolDesc">
              A short devotional: Scripture theme, encouragement, and a prayer.
            </div>
          </Link>

          <Link className="toolCard" href="/prayer">
            <div className="toolIcon">🙏</div>
            <div className="toolTitle">Prayer Builder</div>
            <div className="toolDesc">
              Guided prayer in 4 parts: Adoration, Confession, Thanks, Requests.
            </div>
          </Link>
        </div>

        <footer className="footer">
          <span className="muted">CEB • Pastoral mentor tone • Built by you</span>
        </footer>
      </section>
    </main>
  );
}