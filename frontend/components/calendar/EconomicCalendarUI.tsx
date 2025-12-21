"use client";

import React, { useMemo, useState } from "react";

type Impact = 1 | 2 | 3;

type Row = {
  date: string;
  time: string;
  country: "US" | "EU" | "CN" | "DE";
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  impact: Impact;
  delta?: "up" | "down" | "flat";
};

const SAMPLE: Row[] = [
  {
    date: "Mon, 6",
    time: "7:00 EST",
    country: "EU",
    event: "Eurozone Retail Sales YoY",
    actual: "0.9%",
    forecast: "0.3%",
    previous: "0.6%",
    impact: 3,
    delta: "up",
  },
  {
    date: "Mon, 7",
    time: "7:30 EST",
    country: "CN",
    event: "China Trade Balance",
    actual: "0.3%",
    forecast: "2.0%",
    previous: "5.0%",
    impact: 2,
    delta: "up",
  },
  {
    date: "Mon, 8",
    time: "5:30 EST",
    country: "DE",
    event: "Germany Industrial Prod MoM",
    actual: "-3.3%",
    forecast: "1.3%",
    previous: "2.8%",
    impact: 2,
    delta: "down",
  },
  {
    date: "Wed, 8",
    time: "5:00 AM",
    country: "US",
    event: "US ISM Services PMI",
    actual: "0.3%",
    forecast: "78%",
    previous: "3.1%",
    impact: 3,
    delta: "up",
  },
];

function Flag({ code }: { code: Row["country"] }) {
  const map: Record<Row["country"], string> = {
    US: "🇺🇸",
    EU: "🇪🇺",
    CN: "🇨🇳",
    DE: "🇩🇪",
  };
  return (
    <span aria-label={code} title={code} style={{ fontSize: 16, lineHeight: "16px" }}>
      {map[code]}
    </span>
  );
}

function ImpactDots({ n }: { n: Impact }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "flex-end" }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: i <= n ? "rgba(255,138,76,0.95)" : "rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}

function DeltaPill({ v, dir }: { v?: string; dir?: Row["delta"] }) {
  if (!v) return <span style={{ opacity: 0.6 }}>—</span>;
  const color =
    dir === "up" ? "rgba(20,160,95,1)" : dir === "down" ? "rgba(220,60,80,1)" : "rgba(20,20,37,0.65)";
  const icon = dir === "up" ? "▲" : dir === "down" ? "▼" : "•";
  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontWeight: 600, color }}>
      <span style={{ fontSize: 11, transform: "translateY(-0.5px)" }}>{icon}</span>
      {v}
    </span>
  );
}

function Donut({
  value,
  label,
}: {
  value: number; // 0..100
  label: string;
}) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="22" />
        {/* ✅ FIX #5: thicker stroke */}
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,138,76,0.95)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="rgba(20,20,37,0.95)">
          {Math.round(value)}%
        </text>
        <text x="60" y="78" textAnchor="middle" fontSize="12" fontWeight="600" fill="rgba(20,20,37,0.65)">
          {label}
        </text>
      </svg>
    </div>
  );
}

function SoftButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.65)",
        padding: "10px 14px",
        borderRadius: 16, // ✅ FIX #4
        fontWeight: 700,
        color: "rgba(20,20,37,0.85)",
        cursor: "pointer",
        boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </button>
  );
}

function SelectPill({
  value,
  onChange,
  options,
  leftIcon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  leftIcon?: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.65)",
        padding: "10px 14px",
        borderRadius: 16, // ✅ FIX #4
        boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
      }}
    >
      {leftIcon ? <span style={{ opacity: 0.85 }}>{leftIcon}</span> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontWeight: 800,
          color: "rgba(20,20,37,0.85)",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function EconomicCalendarUI() {
  const [country, setCountry] = useState("All Countries");
  const [horizon, setHorizon] = useState("3M");

  const majorValue = 42;

  const topReleases = useMemo(
    () => [
      { label: "ISM Services PMI", icon: "🇺🇸", impact: 3 as Impact },
      { label: "Retail Sales YoY", icon: "🇪🇺", impact: 3 as Impact },
      { label: "Trade Balance", icon: "🇨🇳", impact: 2 as Impact },
    ],
    []
  );

  const weekAhead = useMemo(
    () => [
      { date: "Wed, 8", title: "Fed Decision", time: "2:00 PM" },
      { date: "Thu, 9", title: "Core Inflation YoY", time: "9:00 AM" },
      { date: "Wed, 15", title: "Unc Inflation YoY", time: "3:05 PM" },
    ],
    []
  );

  const releaseBars = useMemo(
    () => [
      { label: "Fed Decision", value: 4.2 },
      { label: "Core Inflation", value: 5.8 },
      { label: "Unemployment Rate", value: 3.9 },
      { label: "Retail Sales", value: 3.1 },
      { label: "Manufacturing PMI", value: 2.2 },
      { label: "GDP Growth", value: 2.8 },
    ],
    []
  );

  return (
    <div style={{ padding: 28 }}>
      <div className="glass-strong" style={{ padding: 26 }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.02em", color: "rgba(20,20,37,0.92)" }}>
              Economic Calendar
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <SelectPill
              value={country}
              onChange={setCountry}
              options={["All Countries", "United States", "Eurozone", "China", "Germany"]}
              leftIcon="🌐"
            />
            <SoftButton onClick={() => {}}>Refresh</SoftButton>
            <SoftButton onClick={() => {}}>Competitors</SoftButton>
            <SoftButton onClick={() => {}}>Share</SoftButton>
            <SoftButton onClick={() => {}}>Aa</SoftButton>
          </div>
        </div>

        {/* Top grid: table + right card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.7fr 1fr",
            gap: 18,
            marginTop: 18,
          }}
        >
          {/* Table Card */}
          <div className="glass" style={{ padding: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "110px 110px 1fr 120px 110px 110px 90px",
                gap: 10,
                padding: "12px 16px",
                borderRadius: 14,
                fontWeight: 900,
                color: "rgba(20,20,37,0.6)",
                background: "rgba(255,255,255,0.6)", // ✅ FIX #3
              }}
            >
              <div>Date</div>
              <div>Time</div>
              <div>Event</div>
              <div>Actual</div>
              <div>Forecast</div>
              <div>Previous</div>
              <div style={{ textAlign: "right" }}>Impact</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {SAMPLE.map((r) => (
                <div
                  key={`${r.date}-${r.event}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 110px 1fr 120px 110px 110px 90px",
                    gap: 10,
                    padding: "16px 16px", // ✅ FIX #2
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "rgba(20,20,37,0.7)" }}>{r.date}</div>
                  <div style={{ fontWeight: 800, color: "rgba(20,20,37,0.7)" }}>{r.time}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
                    <Flag code={r.country} />
                    <span style={{ color: "rgba(20,20,37,0.9)" }}>{r.event}</span>
                  </div>

                  <div>
                    <DeltaPill v={r.actual} dir={r.delta} />
                  </div>
                  <div style={{ fontWeight: 800, color: "rgba(20,20,37,0.65)" }}>{r.forecast ?? "—"}</div>
                  <div style={{ fontWeight: 800, color: "rgba(20,20,37,0.65)" }}>{r.previous ?? "—"}</div>
                  <div style={{ textAlign: "right" }}>
                    <ImpactDots n={r.impact} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Major impacts card */}
          <div className="glass" style={{ padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "rgba(20,20,37,0.92)" }}>Major Impacts Today</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
              <div className="glass" style={{ padding: 12, display: "flex", justifyContent: "center" }}>
                <Donut value={majorValue} label="High impact" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "High", pct: 42 },
                  { label: "Medium", pct: 25 },
                  { label: "Low", pct: 33 },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="glass"
                    style={{
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: 16,
                    }}
                  >
                    <div style={{ fontWeight: 900, color: "rgba(20,20,37,0.7)" }}>{x.label}</div>
                    <div style={{ fontWeight: 900, color: "rgba(20,20,37,0.9)" }}>{x.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="muted" style={{ marginTop: 12, fontWeight: 700 }}>
              Reflation typically favors cyclical assets as growth recovers while inflation stabilizes.
            </div>
          </div>
        </div>

        {/* Middle grid: upcoming releases + right column */}
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, marginTop: 18 }}>
          {/* Upcoming Impactful Releases */}
          <div className="glass" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "rgba(20,20,37,0.92)" }}>
                Upcoming Impactful Releases
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="muted" style={{ fontWeight: 800 }}>
                  Horizon:
                </div>
                <SelectPill value={horizon} onChange={setHorizon} options={["3M", "6M", "12M"]} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              {releaseBars.map((b) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "220px 1fr 60px", gap: 12 }}>
                  <div style={{ fontWeight: 900, color: "rgba(20,20,37,0.75)" }}>{b.label}</div>

                  <div
                    style={{
                      height: 12,
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, (b.value / 6.0) * 100)}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, rgba(91,108,255,0.95), rgba(124,139,255,0.85))",
                      }}
                    />
                  </div>

                  <div style={{ fontWeight: 900, color: "rgba(20,20,37,0.7)", textAlign: "right" }}>
                    {b.value.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="muted" style={{ marginTop: 12, fontWeight: 800 }}>
              Practical takeaway: Risk-on bias; defensive positioning tends to underperform.
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="glass" style={{ padding: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "rgba(20,20,37,0.92)" }}>
                Top Impactful Releases
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                {topReleases.map((x) => (
                  <div
                    key={x.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 900 }}>
                      <span>{x.icon}</span>
                      <span style={{ color: "rgba(20,20,37,0.88)" }}>{x.label}</span>
                    </div>
                    <ImpactDots n={x.impact} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, fontWeight: 900, color: "rgba(20,20,37,0.65)" }}>
                Week Ahead: <span className="muted">Key Economic Events</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                {weekAhead.slice(0, 2).map((w) => (
                  <div
                    key={w.title}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      fontWeight: 900,
                      color: "rgba(20,20,37,0.78)",
                    }}
                  >
                    <div style={{ width: 80, color: "rgba(20,20,37,0.65)" }}>{w.date}</div>
                    <div style={{ flex: 1 }}>{w.title}</div>
                    <div style={{ width: 90, textAlign: "right" }}>{w.time}</div>
                  </div>
                ))}
              </div>

              <div className="muted" style={{ marginTop: 12, fontWeight: 800 }}>
                Historically stronger currencies during reflation over a 3–6 month horizon.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Week Ahead full-width */}
        <div className="glass" style={{ padding: 16, marginTop: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "rgba(20,20,37,0.92)" }}>
            Week Ahead: Key Economic Events
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {weekAhead.map((w) => (
              <div
                key={`${w.date}-${w.title}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  fontWeight: 900,
                  color: "rgba(20,20,37,0.78)",
                }}
              >
                <div style={{ width: 90, color: "rgba(20,20,37,0.65)" }}>{w.date}</div>
                <div style={{ flex: 1 }}>{w.title}</div>
                <div style={{ width: 110, textAlign: "right" }}>{w.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
