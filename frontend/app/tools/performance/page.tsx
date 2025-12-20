"use client";

import { useMemo, useState } from "react";
import TimeframeTabs from "../../../components/performance/TimeframeTabs";
import CurrencyPerformanceChart from "../../../components/performance/CurrencyPerformanceChart";
import Disclaimer from "../../../components/legal/Disclaimer";

const demoByTf: Record<string, { label: string; value: number }[]> = {
  "1W": [
    { label: "USD", value: -1.94 },
    { label: "JPY", value: -0.76 },
    { label: "CHF", value: -0.33 },
    { label: "EUR", value: -0.11 },
    { label: "CAD", value: 0.34 },
    { label: "AUD", value: 0.41 },
    { label: "GBP", value: 0.86 },
    { label: "NZD", value: 1.52 },
  ],
  "1M": [
    { label: "USD", value: -0.62 },
    { label: "JPY", value: 0.25 },
    { label: "CHF", value: -0.1 },
    { label: "EUR", value: 0.12 },
    { label: "CAD", value: 0.44 },
    { label: "AUD", value: 0.73 },
    { label: "GBP", value: 0.18 },
    { label: "NZD", value: -0.05 },
  ],
  "3M": [
    { label: "USD", value: 0.15 },
    { label: "JPY", value: -0.42 },
    { label: "CHF", value: -0.08 },
    { label: "EUR", value: 0.21 },
    { label: "CAD", value: 0.33 },
    { label: "AUD", value: 0.51 },
    { label: "GBP", value: 0.12 },
    { label: "NZD", value: 0.05 },
  ],
  "6M": [
    { label: "USD", value: 0.41 },
    { label: "JPY", value: -0.18 },
    { label: "CHF", value: 0.09 },
    { label: "EUR", value: 0.28 },
    { label: "CAD", value: 0.14 },
    { label: "AUD", value: 0.22 },
    { label: "GBP", value: 0.31 },
    { label: "NZD", value: -0.07 },
  ],
  YTD: [
    { label: "USD", value: -0.22 },
    { label: "JPY", value: -0.65 },
    { label: "CHF", value: 0.18 },
    { label: "EUR", value: 0.37 },
    { label: "CAD", value: 0.12 },
    { label: "AUD", value: 0.26 },
    { label: "GBP", value: 0.44 },
    { label: "NZD", value: 0.09 },
  ],
  "1Y": [
    { label: "USD", value: 0.62 },
    { label: "JPY", value: -1.12 },
    { label: "CHF", value: 0.28 },
    { label: "EUR", value: 0.55 },
    { label: "CAD", value: 0.21 },
    { label: "AUD", value: 0.38 },
    { label: "GBP", value: 0.71 },
    { label: "NZD", value: 0.14 },
  ],
};

export default function Page() {
  const [tf, setTf] = useState("1W");

  const data = useMemo(() => demoByTf[tf] ?? demoByTf["1W"], [tf]);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontSize: 40, margin: "0 0 8px" }}>Currency Performance</h1>
      <p style={{ color: "#9aa0a6", marginTop: 0 }}>
        Track and analyze currency performance across different timeframes
      </p>

      <div
        style={{
          marginTop: 20,
          background: "#111",
          border: "1px solid #222",
          borderRadius: 14,
          padding: 18,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>Currency Performance</div>
        <div style={{ color: "#9aa0a6", marginTop: 6 }}>
          Track relative strength across major currencies
        </div>

        <TimeframeTabs value={tf} onChange={setTf} />
        <CurrencyPerformanceChart data={data} />
        <Disclaimer />
      </div>
    </div>
  );
}
