"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function MacroForecastChart({ data }: { data: any[] }) {
  return (
    <div style={{ height: 320, width: "100%", minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          <Line dataKey="price" stroke="#2563eb" strokeWidth={3} dot={false} />
          <Line dataKey="forecast" stroke="#9333ea" strokeDasharray="6 6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
