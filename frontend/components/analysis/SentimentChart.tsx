"use client";

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

function fmt(n: number) {
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(3)}`;
}

export default function SentimentChart({ data }: { data: Point[] }) {
  // Split into positive/negative series for the red/green fill like your screenshot
  const chartData = data.map((d) => ({
    ...d,
    pos: d.sentiment >= 0 ? d.sentiment : 0,
    neg: d.sentiment < 0 ? d.sentiment : 0,
  }));

  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tickMargin={10} />
          <YAxis domain={[-1, 1]} tickMargin={10} />
          <Tooltip
            formatter={(v: any, name) =>
              name === "sentiment" ? [fmt(Number(v)), "sentiment"] : [v, name]
            }
          />
          <ReferenceLine y={0} stroke="#111827" strokeDasharray="4 4" />

          {/* Green area (>=0) */}
          <Area
            type="monotone"
            dataKey="pos"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="#22c55e"
            fillOpacity={0.18}
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* Red area (<0) */}
          <Area
            type="monotone"
            dataKey="neg"
            stroke="#ef4444"
            strokeWidth={2.5}
            fill="#ef4444"
            fillOpacity={0.18}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
