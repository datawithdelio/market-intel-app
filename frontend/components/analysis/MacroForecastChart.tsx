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

type Point = { t: string; hist: number | null; forecast: number | null };

function safeNum(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number, digits = 3) {
  return n.toFixed(digits);
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

export default function MacroForecastChart({ data }: { data: Point[] }) {
  const hasAny = useMemo(() => Array.isArray(data) && data.length > 0, [data]);

  const domain = useMemo(() => {
    const vals: number[] = [];
    for (const p of data || []) {
      const a = safeNum(p.hist);
      const b = safeNum(p.forecast);
      if (a != null) vals.push(a);
      if (b != null) vals.push(b);
    }
    if (!vals.length) return ["auto", "auto"] as const;

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.12 || 0.01;

    return [min - pad, max + pad] as const;
  }, [data]);

  if (!hasAny) return <Empty label="No macro data yet." />;

  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="t" tickMargin={10} stroke="rgba(255,255,255,0.55)" />
          <YAxis tickMargin={10} stroke="rgba(255,255,255,0.55)" domain={domain as any} />
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
              return [fmt(n), name === "hist" ? "Historical" : "Forecast"];
            }}
          />

          <ReferenceLine y={0} stroke="rgba(0,0,0,0.55)" strokeDasharray="4 4" />

          <Area
            type="monotone"
            dataKey="hist"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="#2563eb"
            fillOpacity={0.14}
            dot={false}
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#9333ea"
            strokeWidth={2.5}
            strokeDasharray="6 6"
            fill="#9333ea"
            fillOpacity={0.08}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
