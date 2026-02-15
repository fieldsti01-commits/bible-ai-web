import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <h1 className="title">Worship Hub</h1>
          <p className="subtitle">
            Three tools for daily worship.
          </p>
        </header>

        <div className="grid">
          <Link href="/guidance" className="glass toolCard">
            <div className="toolTop">
              <div className="icon">🕊️</div>
              <div>
                <p className="toolName">Guidance</p>
                <p className="toolDesc">
                  Disciple-like counsel with Scripture and reflection.
                </p>
              </div>
            </div>
            <div className="cta">Enter →</div>
          </Link>

          <Link href="/devotional" className="glass toolCard">
            <div className="toolTop">
              <div className="icon">📖</div>
              <div>
                <p className="toolName">Daily Devotional</p>
                <p className="toolDesc">
                  Scripture + encouragement for today.
                </p>
              </div>
            </div>
            <div className="cta">Enter →</div>
          </Link>

          <Link href="/prayer" className="glass toolCard">
            <div className="toolTop">
              <div className="icon">🙏</div>
              <div>
                <p className="toolName">Prayer Builder</p>
                <p className="toolDesc">
                  Guided prayer for any focus.
                </p>
              </div>
            </div>
            <div className="cta">Enter →</div>
          </Link>
        </div>
      </div>
    </main>
  );
}