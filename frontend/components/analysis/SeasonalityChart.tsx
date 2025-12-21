"use client";

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

export default function SeasonalityChart({ data }: { data: Point[] }) {
  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="m" tickMargin={10} />
          <YAxis tickMargin={10} />
          <Tooltip />
          <ReferenceLine y={0} stroke="#111827" strokeDasharray="4 4" />

          <Bar dataKey="pos" fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="neg" fill="#ef4444" radius={[0, 0, 6, 6]} />
          <Line type="monotone" dataKey="avg5y" stroke="#2563eb" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
