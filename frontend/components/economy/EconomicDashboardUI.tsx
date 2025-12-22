"use client";

import Link from "next/link";
import React from "react";

type Trend = "up" | "down" | "flat";

type KPI = {
  title: string;
  value: string;
  delta?: string;
  trend?: Trend;
  pill?: string;
  subtitle?: string;
  href: string;
};

export default function EconomicDashboardUI() {
  const economy: KPI[] = [
    {
      title: "Regime",
      value: "Reflation",
      delta: "68%",
      trend: "up",
      pill: "Confidence",
      subtitle: "Macro regime + confidence",
      href: "/economy/regime",
    },
    {
      title: "Indicators",
      value: "Growth + Inflation",
      delta: "+0.2pp",
      trend: "up",
      pill: "Improving",
      subtitle: "Growth, inflation, employment, sentiment",
      href: "/economy/indicators",
    },
    {
      title: "Central Bank",
      value: "Fed: 5.50%",
      delta: "-25 bps",
      trend: "down",
      pill: "Cutting",
      subtitle: "Rates, inflation stance, decisions",
      href: "/economy/central-bank",
    },
    {
      title: "News",
      value: "Top headlines",
      delta: "5 items",
      trend: "flat",
      pill: "Updated",
      subtitle: "Macro headlines + market impact",
      href: "/economy/news",
    },
    {
      title: "Calendar",
      value: "This week",
      delta: "20 events",
      trend: "flat",
      pill: "High-impact",
      subtitle: "This week’s high-impact events",
      href: "/economy/calendar",
    },
  ];

  const tools: KPI[] = [
    {
      title: "Performance",
      value: "+4.2%",
      delta: "30D",
      trend: "up",
      pill: "Good",
      subtitle: "Track returns + risk",
      href: "/tools/performance",
    },
    {
      title: "Analysis",
      value: "Bias: Risk-on",
      delta: "3 signals",
      trend: "up",
      pill: "Bullish",
      subtitle: "Market breakdown + notes",
      href: "/tools/analysis",
    },
    {
      title: "Differentials",
      value: "US-EU: +165",
      delta: "bps",
      trend: "up",
      pill: "Widening",
      subtitle: "Rates/inflation spreads",
      href: "/tools/differentials",
    },
    {
      title: "Correlations",
      value: "DXY ↔ Yields",
      delta: "0.61",
      trend: "up",
      pill: "Strong",
      subtitle: "Cross-asset relationships",
      href: "/tools/correlations",
    },
    {
      title: "Tracker",
      value: "Watchlist",
      delta: "Coming",
      trend: "flat",
      pill: "Later",
      subtitle: "Watchlist + alerts (later)",
      href: "/tools/tracker",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <header style={{ paddingTop: 6 }}>
        <h1 style={{ fontSize: 44, fontWeight: 950, letterSpacing: -0.6, margin: 0 }}>
          Economic Dashboard
        </h1>
        <p style={{ marginTop: 8, opacity: 0.7, fontWeight: 700 }}>
          Quick access to your Economy + Tools pages.
        </p>
      </header>

      <Section title="Economy">
        <div style={grid}>
          {economy.map((k) => (
            <KPICard key={k.title} kpi={k} />
          ))}
        </div>
      </Section>

      <Section title="Tools">
        <div style={grid}>
          {tools.map((k) => (
            <KPICard key={k.title} kpi={k} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 950, opacity: 0.6, letterSpacing: 1.2 }}>
        {title.toUpperCase()}
      </div>
      {children}
    </section>
  );
}

function KPICard({ kpi }: { kpi: KPI }) {
  const tone = getTone(kpi.trend);

  return (
    <Link href={kpi.href} style={{ textDecoration: "none" }}>
      <div className="glass-card" style={{ ...card, cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 950, opacity: 0.92 }}>{kpi.title}</div>
            <div style={{ fontSize: 22, fontWeight: 950 }}>{kpi.value}</div>

            {kpi.subtitle && (
              <div style={{ fontSize: 13, fontWeight: 750, opacity: 0.65 }}>
                {kpi.subtitle}
              </div>
            )}
          </div>

          {(kpi.pill || kpi.delta) && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              {kpi.pill && <span style={{ ...pill, ...tone.pill }}>{kpi.pill}</span>}
              {kpi.delta && (
                <div style={{ ...delta, ...tone.delta }}>
                  {tone.icon} {kpi.delta}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...cta, ...tone.cta }}>Open {kpi.title} →</span>
        </div>
      </div>
    </Link>
  );
}

/* ---------------- styles ---------------- */

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
};

const pill: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 0.2,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  opacity: 0.95,
};

const delta: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  opacity: 0.9,
};

const cta: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 950,
  opacity: 0.85,
};

function getTone(trend?: Trend) {
  // No hard-coded colors required by your globals; this is just subtle.
  // If you want true red/green, I’ll swap to explicit hex values.
  if (trend === "up") {
    return {
      icon: "▲",
      pill: { opacity: 0.95 },
      delta: { opacity: 0.95 },
      cta: { opacity: 0.9 },
    };
  }
  if (trend === "down") {
    return {
      icon: "▼",
      pill: { opacity: 0.95 },
      delta: { opacity: 0.95 },
      cta: { opacity: 0.9 },
    };
  }
  return {
    icon: "•",
    pill: { opacity: 0.85 },
    delta: { opacity: 0.85 },
    cta: { opacity: 0.85 },
  };
}
