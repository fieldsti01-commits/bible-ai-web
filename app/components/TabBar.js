"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/guidance", label: "Guidance", icon: "🕊️" },
    { href: "/devotional", label: "Devotional", icon: "📖" },
    { href: "/prayer", label: "Prayer", icon: "🙏" },
  ];

  return (
    <nav className="tabbar" aria-label="Bottom navigation">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab ${active ? "tabActive" : ""}`}
          >
            <div className="tabIcon">{t.icon}</div>
            <div className="tabLabel">{t.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}