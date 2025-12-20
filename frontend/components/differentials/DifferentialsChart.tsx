"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Point = { label: string; a: number; b: number };

export default function DifferentialsChart({ data }: { data: Point[] }) {
  return (
    <div style={{ marginTop: 18, height: 340, width: "100%" }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="stepAfter" dataKey="a" strokeWidth={3} dot={false} />
          <Line type="stepAfter" dataKey="b" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
