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
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
    >
      {/* subtle baseline */}
      <line
        x1="0"
        y1={h - 2}
        x2={w}
        y2={h - 2}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* glow */}
      <polyline
        fill="none"
        stroke="rgba(124,139,255,0.35)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />

      {/* main line */}
      <polyline
        fill="none"
        stroke="rgba(124,139,255,0.85)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}
