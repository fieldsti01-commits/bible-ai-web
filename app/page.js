// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <h1 className="title">Worship Hub</h1>
          <p className="subtitle">
            Three tools for daily worship: Guidance, Devotional, and Prayer — gentle, disciple-like, with Scripture.
          </p>
          <div className="pill">CEB • Pastoral mentor tone • Built by you</div>
        </header>

        <section className="grid">
          <Link href="/" className="glass toolCard">
            <div className="toolTop">
              <div className="icon">🕊️</div>
              <div>
                <p className="toolName">Guidance</p>
                <p className="toolDesc">Disciple-like counsel with Scripture, steps, reflection, and prayer.</p>
              </div>
            </div>
            <div className="cta">
              Open <span style={{ opacity: 0.7 }}>→</span>
            </div>
          </Link>

          <Link href="/devotional" className="glass toolCard">
            <div className="toolTop">
              <div className="icon">📖</div>
              <div>
                <p className="toolName">Daily Devotional</p>
                <p className="toolDesc">A short devotional: theme, Scripture, encouragement, and a prayer.</p>
              </div>
            </div>
            <div className="cta">
              Open <span style={{ opacity: 0.7 }}>→</span>
            </div>
          </Link>

          <Link href="/prayer" className="glass toolCard">
            <div className="toolTop">
              <div className="icon">🙏</div>
              <div>
                <p className="toolName">Prayer Builder</p>
                <p className="toolDesc">Guided prayer in 4 parts: Adoration, Confession, Thanks, Requests.</p>
              </div>
            </div>
            <div className="cta">
              Open <span style={{ opacity: 0.7 }}>→</span>
            </div>
          </Link>
        </section>

        <div className="footer">
          Tip: Keep it simple first. Then we’ll add animations, transitions, and loading states per tool.
        </div>
      </div>
    </main>
  );
}