"use client";

import React, { useMemo } from "react";
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

type Point = { t: string; sentiment: number };

function safeNum(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number) {
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(3)}`;
}

function Empty({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: 360,
        minWidth: 0,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        display: "grid",
        placeItems: "center",
        color: "rgba(255,255,255,0.70)",
        fontWeight: 750,
        padding: 16,
        textAlign: "center",
      }}
    >
      {label}
    </div>
  );
}

export default function SentimentChart({ data }: { data: Point[] }) {
  const hasAny = useMemo(() => Array.isArray(data) && data.length > 0, [data]);
  if (!hasAny) return <Empty label="No sentiment data yet." />;

  const chartData = useMemo(
    () =>
      (data || []).map((d) => ({
        ...d,
        pos: d.sentiment >= 0 ? d.sentiment : 0,
        neg: d.sentiment < 0 ? d.sentiment : 0,
      })),
    [data]
  );

  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="t" tickMargin={10} stroke="rgba(255,255,255,0.55)" />
          <YAxis domain={[-1, 1]} tickMargin={10} stroke="rgba(255,255,255,0.55)" />

          <Tooltip
            cursor={{ opacity: 0.15 }}
            contentStyle={{
              background: "rgba(17, 24, 39, 0.92)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.92)",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.85)", fontWeight: 900 }}
            formatter={(v: any, name: any) => {
              const n = safeNum(v);
              if (n === null) return ["—", name];
              if (name === "pos" || name === "neg") return [fmt(n), "Sentiment"];
              return [String(v), name];
            }}
          />

          <ReferenceLine y={0} stroke="rgba(0,0,0,0.55)" strokeDasharray="4 4" />

          <Area
            type="monotone"
            dataKey="pos"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="#22c55e"
            fillOpacity={0.18}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="neg"
            stroke="#ef4444"
            strokeWidth={2.5}
            fill="#ef4444"
            fillOpacity={0.18}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
