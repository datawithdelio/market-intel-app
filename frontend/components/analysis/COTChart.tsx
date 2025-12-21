"use client";

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
} from "recharts";

type Point = { t: string; institutional: number; retail: number };

export default function COTChart({ data }: { data: Point[] }) {
  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tickMargin={10} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            domain={[-15, 55]}
            tickMargin={10}
          />
          <Tooltip formatter={(v: any) => [`${Number(v).toFixed(0)}%`, ""]} />

          {/* background zones */}
          <ReferenceArea y1={0} y2={55} fill="#22c55e" fillOpacity={0.12} />
          <ReferenceArea y1={-15} y2={0} fill="#ef4444" fillOpacity={0.12} />

          {/* zero line */}
          <ReferenceLine y={0} stroke="#111827" strokeDasharray="4 4" />

          {/* lines */}
          <Line type="monotone" dataKey="institutional" stroke="#f97316" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="retail" stroke="#a855f7" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
