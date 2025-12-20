import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Intel",
  description: "Market intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          backgroundColor: "#0b0b0b",
          color: "white",
          minHeight: "100vh",
        }}
      >
        {/* Top Header */}
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #222",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          Market Intel
        </header>

        {/* Page Content */}
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
