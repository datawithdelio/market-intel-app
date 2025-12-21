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
  { t: "W1", sentiment: 0.2 },
  { t: "W2", sentiment: 0.4 },
  { t: "W3", sentiment: -0.1 },
];

const cot = [
  { t: "Jan", institutional: 5, retail: 20 },
  { t: "Feb", institutional: 8, retail: 30 },
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
          <SentimentChart data={sentiment} />
        </div>

        <div className="card">
          <h3>Commitment of Traders (COT)</h3>
          <COTChart data={cot} />
        </div>
      </div>
    </div>
  );
}
