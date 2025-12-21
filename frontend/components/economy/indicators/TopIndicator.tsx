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
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 20,
        border: "1px solid rgba(255,255,255,0.35)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.50))",
        boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 18 }}>{countryFlag}</div>
        <div style={{ fontWeight: 900, color: "#111827" }}>{bankName}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, marginTop: 12 }}>
        <div style={{ minWidth: 260 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontSize: 44, fontWeight: 1000, color: "#111827" }}>{rate}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#16a34a" }}>{changeText}</div>
          </div>
          <div style={{ marginTop: 6, color: "#6b7280", fontWeight: 700 }}>
            Next-Meeting - {nextMeeting}
          </div>
        </div>

        <Gauge value={gaugeValue} min={0} max={6} label={gaugeLabel} sublabel={gaugeSub} />
      </div>
    </div>
  );
}
