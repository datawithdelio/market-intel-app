"use client";

import React from "react";

type Props = {
  value: number; // current
  min?: number;
  max?: number;
  label?: string; // e.g. "3.2%"
  sublabel?: string; // e.g. "↗ 3.5%"
};

export default function Gauge({
  value,
  min = 0,
  max = 6,
  label = "",
  sublabel = "",
}: Props) {
  const clamped = Math.max(min, Math.min(max, value));
  const pct = (clamped - min) / (max - min); // 0..1
  const angle = -180 + pct * 180; // -180..0

  return (
    <div style={{ position: "relative", width: 220, height: 120 }}>
      {/* arcs */}
      <svg width="220" height="120" viewBox="0 0 220 120">
        <path d="M 20 110 A 90 90 0 0 1 200 110" stroke="#f87171" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 40 110 A 70 70 0 0 1 180 110" stroke="#fbbf24" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 60 110 A 50 50 0 0 1 160 110" stroke="#34d399" strokeWidth="16" fill="none" strokeLinecap="round" />
      </svg>

      {/* needle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 10,
          width: 4,
          height: 70,
          background: "#111827",
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${angle}deg)`,
          borderRadius: 999,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 6,
          width: 18,
          height: 18,
          background: "#111827",
          borderRadius: 999,
          transform: "translateX(-50%)",
        }}
      />

      {/* text */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 38, textAlign: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#111827" }}>{label}</div>
        <div style={{ marginTop: 2, fontSize: 13, fontWeight: 800, color: "#6b7280" }}>{sublabel}</div>
      </div>
    </div>
  );
}
