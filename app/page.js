// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <h1 className="title">Worship Hub</h1>
          <p className="subtitle">
            A simple place to seek biblical guidance, pray honestly, and stay rooted daily.
          </p>
        </header>

        {/* Daily focus card */}
        <section className="glass card fadeIn" style={{ marginBottom: 14 }}>
          <div className="sectionTitle">Today</div>
          <p className="paragraph">
            Take 60 seconds: ask, listen, and respond. One small step of obedience is powerful.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <Link className="button" href="/guidance" style={{ textDecoration: "none" }}>
              Seek Wisdom
            </Link>
            <Link className="button" href="/prayer" style={{ textDecoration: "none" }}>
              Build Prayer
            </Link>
          </div>
        </section>

        {/* Main tools */}
        <section className="grid3">
          <Link href="/guidance" className="toolCard">
            <div className="toolTop">
              <div className="toolTitle">Guidance</div>
              <div className="toolTag">Disciple-like counsel</div>
            </div>
            <div className="toolDesc">
              Scripture-rooted guidance with practical steps and reflection.
            </div>
          </Link>

          <Link href="/devotional" className="toolCard">
            <div className="toolTop">
              <div className="toolTitle">Daily Devotional</div>
              <div className="toolTag">Stay rooted</div>
            </div>
            <div className="toolDesc">
              A short devotional with Scripture and a prayer.
            </div>
          </Link>

          <Link href="/prayer" className="toolCard">
            <div className="toolTop">
              <div className="toolTitle">Prayer Builder</div>
              <div className="toolTag">Pray now</div>
            </div>
            <div className="toolDesc">
              A simple prayer you can pray out loud right away.
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}