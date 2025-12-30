"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from "recharts";

type Point = { t: string; institutional: number; retail: number };

function safeNum(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmtPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(0)}%`;
}

function computeDomain(data: Point[]): [number, number] | null {
  const vals: number[] = [];
  for (const p of data || []) {
    const a = safeNum(p.institutional);
    const b = safeNum(p.retail);
    if (a != null) vals.push(a);
    if (b != null) vals.push(b);
  }
  if (!vals.length) return null;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.12 || 5;

  const lo = Math.floor((min - pad) / 5) * 5;
  const hi = Math.ceil((max + pad) / 5) * 5;
  return [Math.min(lo, 0), Math.max(hi, 0)];
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

export default function COTChart({ data }: { data: Point[] }) {
  const hasAny = useMemo(() => Array.isArray(data) && data.length > 0, [data]);

  const domain = useMemo(() => computeDomain(data || []) ?? [-15, 55], [data]);

  if (!hasAny) return <Empty label="No COT data yet." />;

  const [yMin, yMax] = domain;

  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="t" tickMargin={10} stroke="rgba(255,255,255,0.55)" />
          <YAxis
            domain={domain as any}
            tickMargin={10}
            stroke="rgba(255,255,255,0.55)"
            tickFormatter={(v) => (Number.isFinite(Number(v)) ? fmtPct(Number(v)) : String(v))}
          />

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
              return [fmtPct(n), name];
            }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ color: "rgba(255,255,255,0.75)", fontWeight: 800 }}
          />

          <ReferenceArea y1={0} y2={yMax} fill="#22c55e" fillOpacity={0.12} />
          <ReferenceArea y1={yMin} y2={0} fill="#ef4444" fillOpacity={0.12} />

          <ReferenceLine y={0} stroke="rgba(0,0,0,0.55)" strokeDasharray="4 4" />

          <Line
            type="monotone"
            dataKey="institutional"
            name="Institutional"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="retail"
            name="Retail"
            stroke="#a855f7"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
