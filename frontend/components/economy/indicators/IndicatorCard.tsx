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

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(255,255,255,0.35)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.50))",
        boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}
    >
      <div style={{ fontWeight: 900, color: "#111827" }}>{title}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
        <div style={{ fontSize: 34, fontWeight: 1000, color: "#111827" }}>{value}</div>
        {delta ? (
          <div
            style={{
              fontWeight: 900,
              color: deltaUp ? "#16a34a" : "#dc2626",
              fontSize: 14,
            }}
          >
            {delta}
          </div>
        ) : null}
      </div>

      {subtitle ? (
        <div style={{ marginTop: 4, color: "#6b7280", fontWeight: 700 }}>
          {subtitle}
        </div>
      ) : null}

      <div style={{ marginTop: 10 }}>
        <Sparkline data={data} />
      </div>
    </div>
  );
}
