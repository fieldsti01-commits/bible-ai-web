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
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`tabItem ${
            pathname === tab.href ? "active" : ""
          }`}
        >
          <div className="tabIcon">{tab.icon}</div>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}