"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/guidance", label: "Guidance", icon: "🧭" },
  { href: "/devotional", label: "Devotional", icon: "📖" },
  { href: "/prayer", label: "Prayer", icon: "🙏" },
];

export default function BottomTabs() {
  const pathname = usePathname() || "/";

  return (
    <nav className="bottomTab" aria-label="Bottom navigation">
      {tabs.map((t) => {
        const active =
          t.href === "/"
            ? pathname === "/"
            : pathname === t.href || pathname.startsWith(t.href + "/");

        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tabItem ${active ? "active" : ""}`}
          >
            <span className="tabIcon" aria-hidden="true">
              {t.icon}
            </span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}