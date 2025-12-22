"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItem = {
  label: string;
  href: string;
};

const platform: NavItem[] = [{ label: "Dashboard", href: "/" }];

const economy: NavItem[] = [
  { label: "Regime", href: "/economy/regime" },
  { label: "Indicators", href: "/economy/indicators" },
  { label: "Central Bank", href: "/economy/central-bank" }, // ✅ ADDED
  { label: "News", href: "/economy/news" },
  { label: "Calendar", href: "/economy/calendar" },
];

const tools: NavItem[] = [
  { label: "Performance", href: "/tools/performance" },
  { label: "Analysis", href: "/tools/analysis" },
  { label: "Differentials", href: "/tools/differentials" },
  { label: "Correlations", href: "/tools/correlations" },
  { label: "Tracker", href: "/tools/tracker" },
];

function Section({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 900,
          color: "rgba(233,233,242,0.65)",
          padding: "0 10px",
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 16,
                  fontWeight: active ? 900 : 800,
                  color: active
                    ? "rgba(20,20,37,0.95)"
                    : "rgba(233,233,242,0.92)",
                  background: active ? "rgba(255,255,255,0.82)" : "transparent",
                  border: active
                    ? "1px solid rgba(255,255,255,0.35)"
                    : "1px solid transparent",
                  boxShadow: active ? "0 12px 26px rgba(0,0,0,0.16)" : "none",
                  transition: "all 140ms ease",
                }}
                onMouseEnter={(e) => {
                  if (active) return;
                  e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.14)";
                }}
                onMouseLeave={(e) => {
                  if (active) return;
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                }}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="sidebar-soft"
      style={{
        width: 260,
        minWidth: 260,
        height: "100vh",
        position: "sticky",
        top: 0,

        padding: 18,
        borderRight: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "8px 10px 14px 10px" }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 950,
            letterSpacing: "-0.02em",
            color: "rgba(233,233,242,0.95)",
          }}
        >
          Market Intel
        </div>
        <div
          style={{
            marginTop: 6,
            color: "rgba(233,233,242,0.62)",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          Macro • FX • Regime • Calendar
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.12)",
          margin: "12px 8px",
        }}
      />

      {/* Sections */}
      <Section title="Platform" items={platform} />
      <Section title="Economy" items={economy} />
      <Section title="Tools" items={tools} />

      {/* Footer */}
      <div style={{ marginTop: 18, padding: "0 10px" }}>
        <div
          style={{
            marginTop: 16,
            padding: "10px 12px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(233,233,242,0.7)",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          Tip: Use the Calendar for high-impact events before London/NY open.
        </div>
      </div>
    </aside>
  );
}
