"use client";

import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function SeasonalityChart({ data }: { data: any[] }) {
  return (
    <div style={{ height: 320, width: "100%", minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="m" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="pos" fill="#22c55e" />
          <Bar dataKey="neg" fill="#ef4444" />
          <Line dataKey="avg" stroke="#2563eb" strokeWidth={3} dot={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
