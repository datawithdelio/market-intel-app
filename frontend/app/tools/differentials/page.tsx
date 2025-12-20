"use client";

import { useMemo, useState } from "react";
import Disclaimer from "../../../components/legal/Disclaimer";
import RateTypeToggle from "../../../components/differentials/RateTypeToggle";
import CountryRadioGrid from "../../../components/differentials/CountryRadioGrid";
import RateCards from "../../../components/differentials/RateCards";
import DifferentialsChart from "../../../components/differentials/DifferentialsChart";

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "EA", name: "Euro Area", flag: "🇪🇺" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

const tfTabs = ["1M", "6M", "YTD", "1Y", "5Y"] as const;
type TF = (typeof tfTabs)[number];

const mockRates: Record<string, number> = {
  US: 3.75,
  EA: 2.15,
  UK: 4.25,
  JP: 0.25,
  CA: 3.25,
  AU: 4.10,
  NZ: 5.50,
  CH: 1.25,
};

// simple mock “history”
function makeSeries(tf: TF) {
  const n = tf === "1M" ? 8 : tf === "6M" ? 10 : tf === "YTD" ? 12 : tf === "1Y" ? 14 : 18;
  const labels = Array.from({ length: n }, (_, i) => `T${i + 1}`);
  return labels.map((label, i) => ({
    label,
    a: 0.5 + i * 0.35 + (i > n * 0.65 ? -(i - n * 0.65) * 0.25 : 0),
    b: 0.2 + i * 0.28 + (i > n * 0.6 ? -(i - n * 0.6) * 0.22 : 0),
  }));
}

export default function Page() {
  const [rateType, setRateType] = useState<"nominal" | "real">("nominal");
  const [tf, setTf] = useState<TF>("5Y");
  const [a, setA] = useState("US");
  const [b, setB] = useState("EA");

  const aMeta = countries.find((c) => c.code === a)!;
  const bMeta = countries.find((c) => c.code === b)!;

  const aRate = mockRates[a] ?? 0;
  const bRate = mockRates[b] ?? 0;

  const chartData = useMemo(() => makeSeries(tf), [tf]);

  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontSize: 42, margin: "0 0 8px" }}>Interest Rate Differentials</h1>
      <p style={{ color: "#6b7280", marginTop: 0 }}>
        Compare central bank interest rates and analyze their impact on currency markets
      </p>

      {/* CARD */}
      <div style={{ marginTop: 18, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900 }}>Interest Rates Comparison</div>
            <div style={{ color: "#6b7280", fontWeight: 600 }}>Historical interest rates across major economies (5Y)</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RateTypeToggle value={rateType} onChange={setRateType} />
            <div
              title="Info"
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                color: "#6b7280",
              }}
            >
              i
            </div>
          </div>
        </div>

        <CountryRadioGrid
          countries={countries}
          a={a}
          b={b}
          onChangeA={(v) => setA(v)}
          onChangeB={(v) => setB(v)}
        />

        <RateCards aName={aMeta.name} aRate={aRate} bName={bMeta.name} bRate={bRate} />

        {/* timeframe pills */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
          <div style={{ display: "inline-flex", gap: 8, padding: 6, background: "#f3f4f6", borderRadius: 999 }}>
            {tfTabs.map((t) => {
              const active = t === tf;
              return (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: "1px solid transparent",
                    background: active ? "#fff" : "transparent",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <DifferentialsChart data={chartData} />

        <div style={{ marginTop: 10, color: "#6b7280", fontWeight: 700 }}>
          Mode: {rateType === "nominal" ? "Nominal" : "Real"} • {aMeta.name} vs {bMeta.name}
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
