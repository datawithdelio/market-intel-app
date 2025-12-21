"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

type Point = { t: string; v: number };

export default function TrendsPanel({
  title = "Trends",
  name = "Unemployment Rate",
  value = "4.0%",
  delta = "↓ -0.1%",
  data,
}: {
  title?: string;
  name?: string;
  value?: string;
  delta?: string;
  data: Point[];
}) {
  const down = delta.includes("↓") || delta.includes("-");
  const deltaColor = down ? "#16a34a" : "#dc2626";

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
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, color: "#111827" }}>{title}</div>
        <div style={{ color: "#6b7280", fontWeight: 800, fontSize: 12 }}>Last 12M</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "#6b7280", fontWeight: 800, fontSize: 13 }}>{name}</div>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 6 }}>
          <div style={{ fontSize: 34, fontWeight: 1000, color: "#111827" }}>{value}</div>
          <div style={{ fontWeight: 900, color: deltaColor }}>{delta}</div>
        </div>
      </div>

      <div style={{ marginTop: 10, height: 220, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" tickMargin={8} />
            <YAxis tickMargin={8} domain={["auto", "auto"]} />
            <Tooltip />
            <ReferenceLine y={data[data.length - 1]?.v} stroke="#111827" strokeDasharray="4 4" />

            <Area
              type="monotone"
              dataKey="v"
              stroke="rgba(99,102,241,0.95)"
              strokeWidth={2.5}
              fill="rgba(99,102,241,0.20)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
