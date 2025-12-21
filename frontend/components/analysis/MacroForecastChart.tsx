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

type Point = { t: string; hist: number | null; forecast: number | null };

export default function MacroForecastChart({ data }: { data: Point[] }) {
  return (
    <div style={{ width: "100%", height: 360, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tickMargin={10} />
          <YAxis tickMargin={10} domain={["auto", "auto"]} />
          <Tooltip />

          {/* optional baseline */}
          <ReferenceLine y={0} stroke="#111827" strokeDasharray="4 4" />

          {/* historical (solid) */}
          <Area
            type="monotone"
            dataKey="hist"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="#2563eb"
            fillOpacity={0.14}
            dot={false}
          />

          {/* forecast (dashed) */}
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#9333ea"
            strokeWidth={2.5}
            strokeDasharray="6 6"
            fill="#9333ea"
            fillOpacity={0.08}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
