"use client";

import React from "react";

type Row = {
  label: string;
  value: number; // percent, e.g. -1.94 or 1.52
};

type Props = {
  data: Row[];
};

export default function CurrencyPerformanceChart({ data }: Props) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 0.01);

  const CHART_H = 260;
  const LABEL_ZONE = 34; 
  const X_LABEL_ZONE = 34; 
  const PADDING = 16;

  const drawableH = CHART_H - LABEL_ZONE - X_LABEL_ZONE; // bar area total
  const half = drawableH / 2;
  const barMax = half * 0.9; // keep breathing room from the zero line

  const fmt = (v: number) => (v > 0 ? `+${v.toFixed(2)}%` : `${v.toFixed(2)}%`);

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        background: "transparent",
        border: "1px solid #fffefeff",
        overflow: "hidden", // ✅ hard clip if anything tries to escape
      }}
    >
      <div
        style={{
          position: "relative",
          height: CHART_H,
        }}
      >
        {/* ✅ Value labels row (always safe) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: PADDING,
            right: PADDING,
            height: LABEL_ZONE,
            display: "flex",
            gap: 14,
            alignItems: "center",
            zIndex: 2,
          }}
        >
          {data.map((row) => (
            <div
              key={`v-${row.label}`}
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: 800,
                fontSize: 13,
                color: "#cfd3d7",
                whiteSpace: "nowrap",
              }}
            >
              {fmt(row.value)}
            </div>
          ))}
        </div>

        {/* ✅ Bars + zero line area */}
        <div
          style={{
            position: "absolute",
            top: LABEL_ZONE,
            left: PADDING,
            right: PADDING,
            height: drawableH,
            display: "flex",
            gap: 14,
            alignItems: "stretch",
            zIndex: 1,
          }}
        >
          {/* zero line */}
          <div
            style={{
              position: "absolute",
              top: half,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(255,255,255,0.10)",
            }}
          />

          {data.map((row) => {
            const isPositive = row.value >= 0;

            // ✅ cap height to barMax so it never reaches the label zone
            const barH = Math.min(barMax, (Math.abs(row.value) / maxAbs) * barMax);

            return (
              <div key={row.label} style={{ flex: 1, textAlign: "center" }}>
                {/* bar column */}
                <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* positive half */}
                  <div
                    style={{
                      height: half,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    {isPositive && (
                      <div
                        style={{
                          width: "60%",
                          height: barH,
                          borderRadius: 10,
                          background: "#12b981",
                        }}
                      />
                    )}
                  </div>

                  {/* negative half */}
                  <div
                    style={{
                      height: half,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    {!isPositive && (
                      <div
                        style={{
                          width: "60%",
                          height: barH,
                          borderRadius: 10,
                          background: "#ef4444",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Currency labels row (bottom) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: PADDING,
            right: PADDING,
            height: X_LABEL_ZONE,
            display: "flex",
            gap: 14,
            alignItems: "flex-end",
            zIndex: 2,
          }}
        >
          {data.map((row) => (
            <div
              key={`x-${row.label}`}
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: 800,
                color: "#9aa0a6",
                paddingBottom: 2,
              }}
            >
              {row.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
