"use client";

import React from "react";

export default function Sparkline({
  data,
  height = 56,
}: {
  data: number[];
  height?: number;
}) {
  const w = 140;
  const h = height;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1e-9, max - min);

  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (w - 6) + 3;
      const y = h - ((v - min) / range) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke="rgba(99,102,241,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}
