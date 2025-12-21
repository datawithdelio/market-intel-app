"use client";

import MacroForecastChart from "../../../components/analysis/MacroForecastChart";
import SeasonalityChart from "../../../components/analysis/SeasonalityChart";
import SentimentChart from "../../../components/analysis/SentimentChart";
import COTChart from "../../../components/analysis/COTChart";

const macro = [
  { t: "2024", price: 1.1 },
  { t: "2025", price: 1.15, forecast: 1.18 },
  { t: "2026", forecast: 1.22 },
];

const seasonality = [
  { m: "Jan", pos: 3, neg: -1, avg: 0.5 },
  { m: "Feb", pos: 1, neg: -2, avg: -0.3 },
];

const sentiment = [
  { t: "20 Nov", sentiment: -0.28 },
  { t: "24 Nov", sentiment: 0.25 },
  { t: "28 Nov", sentiment: 0.55 },
  { t: "02 Dec", sentiment: -1.00 },
  { t: "06 Dec", sentiment: 0.12 },
  { t: "10 Dec", sentiment: 0.58 },
  { t: "14 Dec", sentiment: 0.30 },
  { t: "18 Dec", sentiment: -0.20 },
];

const cot = [
  { t: "Dec", institutional: -6, retail: 14 },
  { t: "Jan", institutional: -4, retail: 18 },
  { t: "Feb", institutional: -2, retail: 22 },
  { t: "Mar", institutional: 5, retail: 28 },
  { t: "Apr", institutional: 6, retail: 40 },
  { t: "May", institutional: 7, retail: 38 },
  { t: "Jun", institutional: 8, retail: 43 },
  { t: "Jul", institutional: 8, retail: 36 },
  { t: "Aug", institutional: 8, retail: 37 },
  { t: "Sep", institutional: 7, retail: 35 },
  { t: "Oct", institutional: 6, retail: 33 },
  { t: "Nov", institutional: 5, retail: 26 },
  { t: "Dec", institutional: 8, retail: 35 },
];

export default function Page() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontSize: 42 }}>Currency Pair Analysis</h1>
      <p style={{ color: "#9aa0a6" }}>Technical, macro and positioning overview</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <div className="card">
          <h3>Macro Forecast</h3>
          <MacroForecastChart data={macro} />
        </div>

        <div className="card">
          <h3>Seasonality</h3>
          <SeasonalityChart data={seasonality} />
        </div>

        <div className="card">
          <h3>News Sentiment</h3>
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 12,
    marginBottom: 12,
  }}
>
  <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14 }}>
    <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
      Average
    </div>
    <div
      style={{
        marginTop: 6,
        fontWeight: 900,
        fontSize: 22,
        color: "#16a34a",
      }}
    >
      +0.209
    </div>
  </div>

  <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14 }}>
    <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
      Articles
    </div>
    <div
      style={{
        marginTop: 6,
        fontWeight: 900,
        fontSize: 22,
        color: "#111827",
      }}
    >
      508
    </div>
  </div>

  <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14 }}>
    <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
      Trend
    </div>
    <div
      style={{
        marginTop: 6,
        fontWeight: 900,
        fontSize: 22,
        color: "#16a34a",
      }}
    >
      ↗
    </div>
  </div>
</div>

          <SentimentChart data={sentiment} />
        </div>

        <div className="card">
          <h3>Commitment of Traders (COT)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 12, marginBottom: 12 }}>
  <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14 }}>
    <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>Institutional %</div>
    <div style={{ marginTop: 6, fontWeight: 900, fontSize: 22, color: "#f97316" }}>
      8% <span style={{ fontSize: 14, color: "#16a34a", marginLeft: 6 }}>+1%</span>
    </div>
  </div>

  <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14 }}>
    <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>Retail %</div>
    <div style={{ marginTop: 6, fontWeight: 900, fontSize: 22, color: "#a855f7" }}>35%</div>
  </div>
</div>

          <COTChart data={cot} />
        </div>
      </div>
    </div>
  );
}
