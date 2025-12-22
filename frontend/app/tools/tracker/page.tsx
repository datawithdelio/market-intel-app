"use client";

import React, { useMemo, useState } from "react";

type Row = {
  code: string;
  name: string;
  flag: string;
  gdp: number; // %
  inflation: number; // %
  unemployment: number; // %
  bot: number; // B
  ca: number; // B
  rate: number; // %
  decision: "Hold" | "Cut" | "Hike";
};

type SortKey = keyof Pick<
  Row,
  "name" | "gdp" | "inflation" | "unemployment" | "bot" | "ca" | "rate" | "decision"
>;

const rows: Row[] = [
  { code: "AU", name: "Australia", flag: "🇦🇺", gdp: 0.4, inflation: 3.8, unemployment: 4.3, bot: 4.4, ca: -16.6, rate: 3.6, decision: "Hold" },
  { code: "CA", name: "Canada", flag: "🇨🇦", gdp: 0.6, inflation: 2.2, unemployment: 6.5, bot: 0.1, ca: -9.7, rate: 2.25, decision: "Hold" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", gdp: -0.5, inflation: 0.0, unemployment: 2.9, bot: 3.0, ca: 15.4, rate: 0.0, decision: "Hold" },
  { code: "EA", name: "Euro Area", flag: "🇪🇺", gdp: 0.2, inflation: 2.2, unemployment: 6.4, bot: 18.4, ca: 32.0, rate: 2.15, decision: "Hold" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", gdp: 0.1, inflation: 3.2, unemployment: 5.1, bot: -4.8, ca: -28.9, rate: 3.75, decision: "Cut" },
  { code: "JP", name: "Japan", flag: "🇯🇵", gdp: -0.4, inflation: 2.9, unemployment: 2.6, bot: 322.2, ca: 2834.0, rate: 0.75, decision: "Hike" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", gdp: 1.1, inflation: 3.0, unemployment: 5.3, bot: -0.2, ca: -8.4, rate: 2.25, decision: "Cut" },
  { code: "US", name: "United States", flag: "🇺🇸", gdp: 3.0, inflation: 2.6, unemployment: 4.6, bot: -52.8, ca: -251.3, rate: 3.75, decision: "Cut" },
];

function badgeStyle(decision: Row["decision"]): React.CSSProperties {
  if (decision === "Hold") {
    return {
      background: "rgba(59,130,246,0.14)",
      border: "1px solid rgba(59,130,246,0.34)",
      color: "rgba(191,219,254,0.95)",
    };
  }
  if (decision === "Hike") {
    return {
      background: "rgba(34,197,94,0.14)",
      border: "1px solid rgba(34,197,94,0.34)",
      color: "rgba(187,247,208,0.95)",
    };
  }
  return {
    background: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.34)",
    color: "rgba(254,202,202,0.95)",
  };
}

const fmtPct = (x: number) => `${x.toFixed(2)}%`;
const fmtB = (x: number) => `${x < 0 ? "-" : ""}${Math.abs(x).toFixed(1)}B`;

export default function Page() {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;

      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return copy;
  }, [sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const thBtn = (
    label: string,
    key: SortKey,
    align: React.CSSProperties["textAlign"] = "left"
  ) => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontWeight: 900,
        color: "rgba(255,255,255,0.55)",
        textTransform: "uppercase",
        letterSpacing: 0.65,
        fontSize: 11,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        width: "100%",
        padding: 0,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: "100%", textAlign: align }}>{label}</span>
      <span style={{ opacity: sortKey === key ? 0.95 : 0.35, fontWeight: 900 }}>
        {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  );

  // Card container (keep your premium backdrop)
  const card: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "radial-gradient(900px 380px at 15% 0%, rgba(124,139,255,0.14), transparent 55%)," +
      "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 100%)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.50)",
    overflow: "hidden",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };

  // ✅ Correlations-style “smoky chart panel”
  const chartPanel: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    overflow: "hidden",
  };

  const tdBase: React.CSSProperties = {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.88)",
    fontWeight: 750,
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        padding: 28,
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, margin: "0 0 8px", letterSpacing: -0.4, fontWeight: 950 }}>
          Cross-Economy Indicators
        </h1>
        <p style={{ color: "rgba(255,255,255,0.60)", marginTop: 0, fontWeight: 650 }}>
          Compare key economic indicators across multiple economies side-by-side
        </p>

        <div style={card}>
          {/* Card header */}
          <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontWeight: 950, color: "rgba(255,255,255,0.92)" }}>
              Cross-Economy Indicators
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 650, marginTop: 2 }}>
              Key economic indicators across all tracked economies
            </div>
          </div>

          {/* ✅ Indicator Chart (now looks like Correlations panels) */}
          <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.88)" }}>
                  Indicator Trend (placeholder)
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 650, marginTop: 2 }}>
                  Same “smoky” panel style as Correlations
                </div>
              </div>

              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 12 }}>
                Range: 12M (mock)
              </div>
            </div>

            <div style={{ marginTop: 12, ...chartPanel, height: 140, padding: 14 }}>
              {/* Swap this placeholder with your real chart later */}
              <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
                <svg width="360" height="90" viewBox="0 0 360 90" fill="none" style={{ opacity: 0.9 }}>
                  <path
                    d="M10 60 C 40 25, 70 75, 100 45 C 130 15, 160 70, 190 42 C 220 18, 250 65, 280 40 C 305 22, 330 55, 350 30"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 60 C 40 25, 70 75, 100 45 C 130 15, 160 70, 190 42 C 220 18, 250 65, 280 40 C 305 22, 330 55, 350 30"
                    stroke="rgba(124,139,255,0.45)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.25"
                  />
                </svg>
                <div style={{ marginTop: 6, color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 12 }}>
                  Chart placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Economy", "name")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("GDP Growth", "gdp", "right")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Inflation", "inflation", "right")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Unemployment", "unemployment", "right")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Balance of Trade", "bot", "right")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Current Account", "ca", "right")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Interest Rate", "rate", "right")}
                  </th>
                  <th style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {thBtn("Last Decision", "decision", "right")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sorted.map((r, idx) => (
                  <tr
                    key={r.code}
                    style={{
                      background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      transition: "background 120ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent";
                    }}
                  >
                    <td style={{ ...tdBase, textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>{r.flag}</span>
                        <span style={{ fontWeight: 950, color: "rgba(255,255,255,0.92)" }}>{r.name}</span>
                      </div>
                    </td>

                    <td style={{ ...tdBase, textAlign: "right" }}>{fmtPct(r.gdp)}</td>
                    <td style={{ ...tdBase, textAlign: "right" }}>{fmtPct(r.inflation)}</td>
                    <td style={{ ...tdBase, textAlign: "right" }}>{fmtPct(r.unemployment)}</td>
                    <td style={{ ...tdBase, textAlign: "right" }}>{fmtB(r.bot)}</td>
                    <td style={{ ...tdBase, textAlign: "right" }}>{fmtB(r.ca)}</td>
                    <td style={{ ...tdBase, textAlign: "right" }}>{fmtPct(r.rate)}</td>

                    <td style={{ ...tdBase, textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 76,
                          padding: "6px 14px",
                          borderRadius: 999,
                          fontWeight: 950,
                          fontSize: 12,
                          ...badgeStyle(r.decision),
                        }}
                      >
                        {r.decision}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
