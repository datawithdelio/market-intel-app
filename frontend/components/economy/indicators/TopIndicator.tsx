"use client";

import React from "react";
import Gauge from "./Gauge";

type Props = {
  countryFlag?: string;
  bankName: string;
  rate: string;
  changeText: string;
  nextMeeting: string;
  gaugeValue: number;
  gaugeLabel: string;
  gaugeSub: string;
};

export default function TopIndicator({
  countryFlag = "🇺🇸",
  bankName,
  rate,
  changeText,
  nextMeeting,
  gaugeValue,
  gaugeLabel,
  gaugeSub,
}: Props) {
  const up = changeText.includes("↑") || changeText.includes("+");
  const down = changeText.includes("↓") || changeText.includes("-");

  const textPrimary = "rgba(255,255,255,0.92)";
  const textMuted = "rgba(255,255,255,0.62)";
  const border = "1px solid rgba(255,255,255,0.10)";

  const card: React.CSSProperties = {
    borderRadius: 16,
    padding: 18,
    border,
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflow: "hidden",
  };

  const changeChip: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    whiteSpace: "nowrap",
    border: up
      ? "1px solid rgba(34,197,94,0.28)"
      : down
      ? "1px solid rgba(239,68,68,0.28)"
      : "1px solid rgba(255,255,255,0.18)",
    background: up
      ? "rgba(34,197,94,0.10)"
      : down
      ? "rgba(239,68,68,0.10)"
      : "rgba(255,255,255,0.06)",
    color: up
      ? "rgba(187,247,208,0.92)"
      : down
      ? "rgba(254,202,202,0.92)"
      : "rgba(255,255,255,0.75)",
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 18, opacity: 0.95 }}>{countryFlag}</div>
        <div
          style={{
            fontWeight: 950,
            color: textPrimary,
            letterSpacing: -0.2,
          }}
        >
          {bankName}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 260 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 44, fontWeight: 1000, color: textPrimary, letterSpacing: -0.6 }}>
              {rate}
            </div>
            <div style={changeChip}>{changeText}</div>
          </div>

          <div style={{ marginTop: 6, color: textMuted, fontWeight: 700 }}>
            Next Meeting • {nextMeeting}
          </div>
        </div>

        <Gauge value={gaugeValue} min={0} max={6} label={gaugeLabel} sublabel={gaugeSub} />
      </div>
    </div>
  );
}
