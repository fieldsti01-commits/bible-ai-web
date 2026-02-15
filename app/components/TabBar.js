"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/guidance", label: "Guidance", icon: "🧭" },
    { href: "/devotional", label: "Devotional", icon: "📖" },
    { href: "/prayer", label: "Prayer", icon: "🙏" },
  ];

  return (
    <nav className="bottomTab">
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tabItem ${active ? "active" : ""}`}
          >
            <span className="tabIcon">{tab.icon}</span>
            <span className="tabLabel">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}