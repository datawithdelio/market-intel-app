"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const tabs = ["1W", "1M", "3M", "6M", "YTD", "1Y"];

export default function TimeframeTabs({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 8,
        padding: 6,
        borderRadius: 999,
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        marginTop: 16,
      }}
    >
      {tabs.map((t) => {
        const active = t === value;

        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: active
                ? "1px solid rgba(255,255,255,0.22)"
                : "1px solid transparent",
              background: active ? "rgba(255,255,255,0.12)" : "transparent",
              color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 0.4,
              transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent";
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
