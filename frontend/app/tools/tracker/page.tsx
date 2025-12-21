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
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    gdp: 0.4,
    inflation: 3.8,
    unemployment: 4.3,
    bot: 4.4,
    ca: -16.6,
    rate: 3.6,
    decision: "Hold",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    gdp: 0.6,
    inflation: 2.2,
    unemployment: 6.5,
    bot: 0.1,
    ca: -9.7,
    rate: 2.25,
    decision: "Hold",
  },
  {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    gdp: -0.5,
    inflation: 0.0,
    unemployment: 2.9,
    bot: 3.0,
    ca: 15.4,
    rate: 0.0,
    decision: "Hold",
  },
  {
    code: "EA",
    name: "Euro Area",
    flag: "🇪🇺",
    gdp: 0.2,
    inflation: 2.2,
    unemployment: 6.4,
    bot: 18.4,
    ca: 32.0,
    rate: 2.15,
    decision: "Hold",
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    gdp: 0.1,
    inflation: 3.2,
    unemployment: 5.1,
    bot: -4.8,
    ca: -28.9,
    rate: 3.75,
    decision: "Cut",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    gdp: -0.4,
    inflation: 2.9,
    unemployment: 2.6,
    bot: 322.2,
    ca: 2834.0,
    rate: 0.75,
    decision: "Hike",
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    gdp: 1.1,
    inflation: 3.0,
    unemployment: 5.3,
    bot: -0.2,
    ca: -8.4,
    rate: 2.25,
    decision: "Cut",
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    gdp: 3.0,
    inflation: 2.6,
    unemployment: 4.6,
    bot: -52.8,
    ca: -251.3,
    rate: 3.75,
    decision: "Cut",
  },
];

function badgeStyle(decision: Row["decision"]): React.CSSProperties {
  if (decision === "Hold") {
    return {
      background: "rgba(59,130,246,0.15)",
      border: "1px solid rgba(59,130,246,0.45)",
      color: "#93c5fd",
    };
  }
  if (decision === "Hike") {
    return {
      background: "rgba(34,197,94,0.15)",
      border: "1px solid rgba(34,197,94,0.45)",
      color: "#86efac",
    };
  }
  return {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.45)",
    color: "#fca5a5",
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

  const thBtn = (label: string, key: SortKey, align: React.CSSProperties["textAlign"] = "left") => (
    <button
      onClick={() => toggleSort(key)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontWeight: 800,
        color: "#9aa0a6",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        fontSize: 12,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        width: "100%",
        padding: 0,
      }}
    >
      <span style={{ width: "100%", textAlign: align }}>{label}</span>
      <span style={{ opacity: sortKey === key ? 1 : 0.35 }}>
        {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgb(17,17,17)",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", color: "#e5e7eb" }}>
        <h1 style={{ fontSize: 44, margin: "0 0 8px" }}>Cross-Economy Indicators</h1>
        <p style={{ color: "#9aa0a6", marginTop: 0 }}>
          Compare key economic indicators across multiple economies side-by-side
        </p>

        <div
          style={{
            marginTop: 18,
            border: "1px solid #222",
            borderRadius: 14,
            background: "rgb(17,17,17)",
          }}
        >
          <div style={{ padding: 16, borderBottom: "1px solid #222" }}>
            <div style={{ fontWeight: 900, color: "#e5e7eb" }}>Cross-Economy Indicators</div>
            <div style={{ color: "#9aa0a6", fontWeight: 600, marginTop: 2 }}>
              Key economic indicators across all tracked economies
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: "rgb(17,17,17)" }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #222",
                      minWidth: 240,
                    }}
                  >
                    {thBtn("Economy", "name")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 120,
                    }}
                  >
                    {thBtn("GDP Growth", "gdp", "right")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 120,
                    }}
                  >
                    {thBtn("Inflation", "inflation", "right")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 140,
                    }}
                  >
                    {thBtn("Unemployment", "unemployment", "right")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 140,
                    }}
                  >
                    {thBtn("Balance of Trade", "bot", "right")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 140,
                    }}
                  >
                    {thBtn("Current Account", "ca", "right")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 120,
                    }}
                  >
                    {thBtn("Interest Rate", "rate", "right")}
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #222",
                      minWidth: 140,
                    }}
                  >
                    {thBtn("Last Decision", "decision", "right")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sorted.map((r, idx) => (
                  <tr
  key={r.code}
  onMouseEnter={(e) => {
    (e.currentTarget as HTMLTableRowElement).style.background = "#141414";
  }}
  onMouseLeave={(e) => {
    (e.currentTarget as HTMLTableRowElement).style.background =
      idx % 2 === 0 ? "rgb(17,17,17)" : "#0f0f0f";
  }}
  style={{
    background: idx % 2 === 0 ? "rgb(17,17,17)" : "#0f0f0f",
    transition: "background 120ms ease",
  }}
  >
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #222" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{r.flag}</span>
                        <span style={{ fontWeight: 900, fontSize: 15, color: "#e5e7eb" }}>
                          {r.name}
                        </span>
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        borderBottom: "1px solid #222",
                        fontWeight: 700,
                        color: "#e5e7eb",
                      }}
                    >
                      {fmtPct(r.gdp)}
                    </td>

                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        borderBottom: "1px solid #222",
                        fontWeight: 700,
                        color: "#e5e7eb",
                      }}
                    >
                      {fmtPct(r.inflation)}
                    </td>

                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        borderBottom: "1px solid #222",
                        fontWeight: 700,
                        color: "#e5e7eb",
                      }}
                    >
                      {fmtPct(r.unemployment)}
                    </td>

                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        borderBottom: "1px solid #222",
                        fontWeight: 700,
                        color: "#e5e7eb",
                      }}
                    >
                      {fmtB(r.bot)}
                    </td>

                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        borderBottom: "1px solid #222",
                        fontWeight: 700,
                        color: "#e5e7eb",
                      }}
                    >
                      {fmtB(r.ca)}
                    </td>

                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        borderBottom: "1px solid #222",
                        fontWeight: 700,
                        color: "#e5e7eb",
                      }}
                    >
                      {fmtPct(r.rate)}
                    </td>

                    <td style={{ padding: "14px 16px", textAlign: "right", borderBottom: "1px solid #222" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 70,
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontWeight: 900,
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
