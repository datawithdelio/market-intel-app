import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Market Intel",
  description: "Macro • FX • Regime • Calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />

          <main style={{ flex: 1, padding: 18 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
