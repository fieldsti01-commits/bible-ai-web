import "./theme.css";
import BottomTabs from "./components/TabBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worship Hub",
  description: "Bible AI worship tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="appFrame">{children}</div>
        <BottomTabs />
      </body>
    </html>
  );
}