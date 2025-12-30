"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

type Point = { m: string; pos: number; neg: number; avg5y: number };

function safeNum(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}`;
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

export default function SeasonalityChart({ data }: { data: Point[] }) {
  const hasAny = useMemo(() => Array.isArray(data) && data.length > 0, [data]);
  if (!hasAny) return <Empty label="No seasonality data yet." />;

  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="m" tickMargin={10} stroke="rgba(255,255,255,0.55)" />
          <YAxis tickMargin={10} stroke="rgba(255,255,255,0.55)" />
          <Tooltip
            cursor={{ opacity: 0.15 }}
            contentStyle={{
              background: "rgba(17, 24, 39, 0.92)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.92)",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.85)", fontWeight: 900 }}
            formatter={(value: any, name: any) => {
              const n = safeNum(value);
              if (n === null) return ["—", name];
              if (name === "avg5y") return [fmt(n), "5Y Avg"];
              if (name === "pos") return [fmt(n), "Positive"];
              if (name === "neg") return [fmt(n), "Negative"];
              return [String(value), name];
            }}
          />

          <ReferenceLine y={0} stroke="rgba(0,0,0,0.55)" strokeDasharray="4 4" />

          <Bar dataKey="pos" fill="#22c55e" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="neg" fill="#ef4444" radius={[0, 0, 6, 6]} isAnimationActive={false} />

          <Line
            type="monotone"
            dataKey="avg5y"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
