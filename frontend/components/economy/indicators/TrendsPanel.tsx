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
  const up = delta.includes("↑") || delta.includes("+");

  const textPrimary = "rgba(255,255,255,0.92)";
  const textMuted = "rgba(255,255,255,0.62)";
  const border = "1px solid rgba(255,255,255,0.10)";
  const divider = "1px solid rgba(255,255,255,0.08)";

  // Regime-style dark glass card
  const card: React.CSSProperties = {
    borderRadius: 16,
    padding: 16,
    border,
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflow: "hidden",
    height: "100%",
  };

  // Correlations-style “smoky” chart panel (transparent-gray)
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

  const deltaChip: React.CSSProperties = {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 950, color: textPrimary }}>{title}</div>
        <div style={{ color: textMuted, fontWeight: 800, fontSize: 12 }}>Last 12M</div>
      </div>

      <div style={{ marginTop: 12, paddingBottom: 12, borderBottom: divider }}>
        <div
          style={{
            color: textMuted,
            fontWeight: 800,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          {name}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 34, fontWeight: 1000, color: textPrimary, letterSpacing: -0.3 }}>
            {value}
          </div>
          <div style={deltaChip}>{delta}</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ marginTop: 12, height: 220, minWidth: 0, padding: 12, ...chartPanel }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 6 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
              tickMargin={8}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 700 }}
              axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.10)" }}
            />
            <YAxis
              tickMargin={8}
              domain={["auto", "auto"]}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 700 }}
              axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.10)" }}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(15,15,15,0.85)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                color: "rgba(255,255,255,0.9)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)", fontWeight: 800 }}
              itemStyle={{ color: "rgba(255,255,255,0.9)", fontWeight: 800 }}
              cursor={{ stroke: "rgba(255,255,255,0.10)" }}
            />

            <ReferenceLine
              y={data[data.length - 1]?.v}
              stroke="rgba(255,255,255,0.35)"
              strokeDasharray="4 4"
            />

            <Area
              type="monotone"
              dataKey="v"
              stroke="rgba(124,139,255,0.90)"
              strokeWidth={2.4}
              fill="rgba(124,139,255,0.18)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
