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
  AU: 4.1,
  NZ: 5.5,
  CH: 1.25,
};

function makeSeries(tf: TF) {
  const n =
    tf === "1M" ? 8 : tf === "6M" ? 10 : tf === "YTD" ? 12 : tf === "1Y" ? 14 : 18;
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

  // 👇 tonos “gris claro” para legibilidad con glass transparente
  const textPrimary = "rgba(255,255,255,0.92)";
  const textMuted = "rgba(255,255,255,0.65)";
  const textMuted2 = "rgba(255,255,255,0.58)";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background: "transparent",
        color: textPrimary,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, margin: "0 0 8px", fontWeight: 950 }}>
          Interest Rate Differentials
        </h1>
        <p style={{ color: textMuted, marginTop: 0, fontWeight: 650 }}>
          Compare central bank interest rates and analyze their impact on currency markets
        </p>

        {/* CARD (glass transparente via globals.css) */}
        <div
          className="glass"
          style={{
            marginTop: 18,
            padding: 18,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontWeight: 950, color: textPrimary }}>
                Interest Rates Comparison
              </div>
              <div style={{ color: textMuted2, fontWeight: 650 }}>
                Historical interest rates across major economies ({tf})
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* ✅ Rate toggle – transparent container */}
              <div
                style={{
                  padding: 6,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "transparent",
                }}
              >
                <RateTypeToggle value={rateType} onChange={setRateType} />
              </div>

              {/* info button */}
              <div
                title="Info"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "transparent",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  color: textMuted,
                  userSelect: "none",
                }}
              >
                i
              </div>
            </div>
          </div>

          {/* country selectors */}
          <div style={{ marginTop: 14, color: textMuted }}>
            <CountryRadioGrid
              countries={countries}
              a={a}
              b={b}
              onChangeA={(v) => setA(v)}
              onChangeB={(v) => setB(v)}
            />
          </div>

          <div style={{ marginTop: 14, color: textPrimary }}>
            <RateCards aName={aMeta.name} aRate={aRate} bName={bMeta.name} bRate={bRate} />
          </div>

          {/* timeframe pills – fully transparent */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <div
              style={{
                display: "inline-flex",
                gap: 8,
                padding: 6,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "transparent",
              }}
            >
              {tfTabs.map((t) => {
                const active = t === tf;

                return (
                  <button
                    key={t}
                    onClick={() => setTf(t)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: active
                        ? "1px solid rgba(255,255,255,0.28)"
                        : "1px solid transparent",
                      background: "transparent",
                      color: active ? textPrimary : textMuted,
                      fontWeight: 900,
                      cursor: "pointer",
                      transition: "background 120ms ease, border-color 120ms ease",
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
          </div>

          <div style={{ marginTop: 16 }}>
            <DifferentialsChart data={chartData} />
          </div>

          <div style={{ marginTop: 10, color: textMuted, fontWeight: 750 }}>
            Mode: {rateType === "nominal" ? "Nominal" : "Real"} • {aMeta.name} vs {bMeta.name}
          </div>

          <div style={{ marginTop: 12, color: textMuted }}>
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
