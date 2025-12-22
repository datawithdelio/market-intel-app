"use client";

import React from "react";
import Sparkline from "./Sparkline";

export default function IndicatorCard({
  title,
  value,
  delta,
  subtitle,
  data,
}: {
  title: string;
  value: string;
  delta?: string;
  subtitle?: string;
  data: number[];
}) {
  const deltaUp = (delta ?? "").includes("↑") || (delta ?? "").includes("+");

  const textPrimary = "rgba(255,255,255,0.92)";
  const textMuted = "rgba(255,255,255,0.62)";
  const divider = "rgba(255,255,255,0.10)";

  // Regime-style mini card (dark glass)
  const card: React.CSSProperties = {
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflow: "hidden",
  };

  // Subtle delta chip (matches vibe, not neon)
  const deltaChip: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 999,
    border: `1px solid ${deltaUp ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.28)"}`,
    background: deltaUp ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
    color: deltaUp ? "rgba(187,247,208,0.92)" : "rgba(254,202,202,0.92)",
    fontWeight: 900,
    fontSize: 12,
    whiteSpace: "nowrap",
  };

  return (
    <div style={card}>
      <div
        style={{
          fontWeight: 900,
          color: textMuted,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          fontSize: 12,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
        <div style={{ fontSize: 34, fontWeight: 1000, color: textPrimary, letterSpacing: -0.3 }}>
          {value}
        </div>

        {delta ? <div style={deltaChip}>{delta}</div> : null}
      </div>

      {subtitle ? (
        <div style={{ marginTop: 6, color: textMuted, fontWeight: 700, fontSize: 13 }}>
          {subtitle}
        </div>
      ) : null}

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${divider}` }}>
        <Sparkline data={data} />
      </div>
    </div>
  );
}
