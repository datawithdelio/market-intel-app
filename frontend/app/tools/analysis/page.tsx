"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import MacroForecastChart from "../../../components/analysis/MacroForecastChart";
import SeasonalityChart from "../../../components/analysis/SeasonalityChart";
import SentimentChart from "../../../components/analysis/SentimentChart";
import COTChart from "../../../components/analysis/COTChart";
import { copyToClipboard, downloadText, shareLink } from "@/lib/actions";

type MacroPoint = { t: string; hist: number | null; forecast: number | null };
type SeasonalityPoint = { m: string; pos: number; neg: number; avg5y: number };
type SentimentPoint = { t: string; sentiment: number };
type COTPoint = { t: string; institutional: number; retail: number };

type FxPoint = { date: string; rate: number };
type FxPayload = {
  meta: {
    pair: string;
    base: string;
    quote: string;
    source: string;
    from: string;
    to: string;
    fetchedAt: string;
  };
  points: FxPoint[];
};

type AnalysisPayload = {
  meta: {
    pair: string;
    updatedAt: string;
    source: string;
    mode: "demo" | "live";
  };
  headline: {
    current: number;
    forecast6m: number;
    bias: "Bullish" | "Bearish" | "Neutral";
  };
  macro: MacroPoint[];
  seasonality: SeasonalityPoint[];
  sentiment: SentimentPoint[];
  cot: COTPoint[];
};

const glass: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))",
  boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.85)",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
};

const card: React.CSSProperties = { ...glass, padding: 16 };

const kpiBox: React.CSSProperties = {
  background: "linear-gradient(rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.12))",
  borderRadius: 12,
  padding: 14,
  border: "1px solid rgba(255,255,255,0.12)",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toCSVRow(fields: (string | number)[]) {
  return fields
    .map((f) => {
      const s = String(f ?? "");
      const escaped = s.replaceAll('"', '""');
      return `"${escaped}"`;
    })
    .join(",");
}

function apiBase() {
  // frontend/.env.local -> NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

function fmtNum(n: number, digits = 3) {
  return Number(n.toFixed(digits));
}

function makeDemoExtras(): Pick<AnalysisPayload, "seasonality" | "sentiment" | "cot"> {
  const seasonality: SeasonalityPoint[] = [
    { m: "Jan", pos: 2, neg: -1, avg5y: 0.2 },
    { m: "Feb", pos: 1, neg: -2, avg5y: -0.1 },
    { m: "Mar", pos: 3, neg: -1, avg5y: 0.3 },
    { m: "Apr", pos: 4, neg: -1, avg5y: 0.5 },
    { m: "May", pos: 3, neg: -2, avg5y: 0.2 },
    { m: "Jun", pos: 2, neg: -1, avg5y: 0.1 },
    { m: "Jul", pos: 1, neg: -3, avg5y: -0.2 },
    { m: "Aug", pos: 2, neg: -2, avg5y: 0.0 },
    { m: "Sep", pos: 1, neg: -2, avg5y: -0.1 },
    { m: "Oct", pos: 2, neg: -1, avg5y: 0.1 },
    { m: "Nov", pos: 1, neg: -4, avg5y: -0.4 },
    { m: "Dec", pos: 3, neg: -1, avg5y: 0.4 },
  ];

  const sentiment: SentimentPoint[] = [
    { t: "20 Nov", sentiment: -0.28 },
    { t: "24 Nov", sentiment: 0.25 },
    { t: "28 Nov", sentiment: 0.55 },
    { t: "02 Dec", sentiment: -1.0 },
    { t: "06 Dec", sentiment: 0.12 },
    { t: "10 Dec", sentiment: 0.58 },
    { t: "14 Dec", sentiment: 0.3 },
    { t: "18 Dec", sentiment: -0.2 },
  ];

  const cot: COTPoint[] = [
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

  return { seasonality, sentiment, cot };
}

/**
 * Converts daily FX points into a compact “hist vs forecast” macro series.
 * - Hist: last ~5 monthly points
 * - Forecast: next ~4 months using a simple slope from the last 60 days
 */
function buildMacroFromFx(points: FxPoint[]): { current: number; forecast6m: number; bias: AnalysisPayload["headline"]["bias"]; macro: MacroPoint[] } {
  if (!points.length) {
    return { current: 0, forecast6m: 0, bias: "Neutral", macro: [] };
  }

  const last = points[points.length - 1];
  const current = last.rate;

  // slope from last 60 points (or fewer)
  const tail = points.slice(Math.max(0, points.length - 60));
  const firstTail = tail[0];
  const lastTail = tail[tail.length - 1];
  const slopePerDay = tail.length >= 2 ? (lastTail.rate - firstTail.rate) / (tail.length - 1) : 0;

  const forecast6m = clamp(current + slopePerDay * 180, 0.0001, 999999);

  const bias: AnalysisPayload["headline"]["bias"] =
    forecast6m > current * 1.01 ? "Bullish" : forecast6m < current * 0.99 ? "Bearish" : "Neutral";

  // pick ~one point per month for hist (last 5)
  const monthly: FxPoint[] = [];
  const seen = new Set<string>();
  for (let i = points.length - 1; i >= 0; i--) {
    const d = points[i].date; // YYYY-MM-DD
    const key = d.slice(0, 7); // YYYY-MM
    if (!seen.has(key)) {
      seen.add(key);
      monthly.push(points[i]);
    }
    if (monthly.length >= 5) break;
  }
  monthly.reverse();

  // Build labels like "Aug", "Sep"... from dates
  const monthLabel = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleString([], { month: "short" });

  const histSeries: MacroPoint[] = monthly.map((p) => ({ t: monthLabel(p.date), hist: fmtNum(p.rate, 4), forecast: null }));

  // Forecast next 4 months (roughly)
  const lastDate = new Date(last.date + "T00:00:00");
  const fc: MacroPoint[] = [];
  let baseRate = current;
  for (let k = 1; k <= 4; k++) {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + k);
    baseRate = baseRate + slopePerDay * 30; // approx month
    fc.push({ t: d.toLocaleString([], { month: "short" }), hist: null, forecast: fmtNum(baseRate, 4) });
  }

  return { current, forecast6m, bias, macro: [...histSeries, ...fc] };
}

export default function Page() {
  const pathname = usePathname();
  const [pair, setPair] = useState<string>("EURUSD");
  const [showExplain, setShowExplain] = useState(false);

  const [loadingFx, setLoadingFx] = useState(false);
  const [fxErr, setFxErr] = useState<string | null>(null);
  const [fx, setFx] = useState<FxPayload | null>(null);

  const [refreshNonce, setRefreshNonce] = useState(0);

  async function loadFx() {
    setLoadingFx(true);
    setFxErr(null);
    try {
      const url = `${apiBase()}/api/fx/frankfurter/timeseries?pair=${encodeURIComponent(pair)}&days=200`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || `FX fetch failed: ${res.status}`);
      setFx(json);
    } catch (e: any) {
      setFxErr(e?.message || "Failed to load FX series");
      setFx(null);
    } finally {
      setLoadingFx(false);
    }
  }

  useEffect(() => {
    void refreshNonce;
    loadFx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair, refreshNonce]);

  const extras = useMemo(() => makeDemoExtras(), []);

  const derived = useMemo(() => {
    const points = fx?.points || [];
    if (!points.length) return null;
    return buildMacroFromFx(points);
  }, [fx]);

  const data: AnalysisPayload = useMemo(() => {
    if (fx && derived) {
      return {
        meta: {
          pair,
          updatedAt: fx.meta.fetchedAt,
          source: fx.meta.source,
          mode: "live",
        },
        headline: {
          current: fmtNum(derived.current, 4),
          forecast6m: fmtNum(derived.forecast6m, 4),
          bias: derived.bias,
        },
        macro: derived.macro,
        ...extras,
      };
    }

    // fallback “demo mode” if FX fails
    const current = 1.084;
    const forecast6m = 1.12;
    const bias: AnalysisPayload["headline"]["bias"] =
      forecast6m > current + 0.01 ? "Bullish" : forecast6m < current - 0.01 ? "Bearish" : "Neutral";

    return {
      meta: {
        pair,
        updatedAt: new Date().toISOString(),
        source: "Demo fallback (FX endpoint not reachable yet)",
        mode: "demo",
      },
      headline: {
        current: fmtNum(current, 3),
        forecast6m: fmtNum(forecast6m, 3),
        bias,
      },
      macro: [
        { t: "Aug", hist: 1.06, forecast: null },
        { t: "Sep", hist: 1.07, forecast: null },
        { t: "Oct", hist: 1.09, forecast: null },
        { t: "Nov", hist: 1.05, forecast: null },
        { t: "Dec", hist: 1.08, forecast: null },
        { t: "Jan", hist: null, forecast: 1.09 },
        { t: "Feb", hist: null, forecast: 1.1 },
        { t: "Mar", hist: null, forecast: 1.11 },
        { t: "Apr", hist: null, forecast: 1.12 },
      ],
      ...extras,
    };
  }, [pair, fx, derived, extras]);

  const bestMonth = useMemo(() => {
    const best = [...data.seasonality].sort((a, b) => b.avg5y - a.avg5y)[0];
    return best?.m || "—";
  }, [data.seasonality]);

  const worstMonth = useMemo(() => {
    const worst = [...data.seasonality].sort((a, b) => a.avg5y - b.avg5y)[0];
    return worst?.m || "—";
  }, [data.seasonality]);

  const avgSentiment = useMemo(() => {
    const vals = data.sentiment.map((x) => x.sentiment);
    const avg = vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
    return Number(avg.toFixed(3));
  }, [data.sentiment]);

  const sentimentTrend = useMemo(() => {
    const last = data.sentiment.at(-1)?.sentiment ?? 0;
    const first = data.sentiment[0]?.sentiment ?? 0;
    return last >= first ? "↗" : "↘";
  }, [data.sentiment]);

  function refresh() {
    setRefreshNonce((x) => x + 1);
  }

  async function onShare() {
    const url = `${window.location.origin}${pathname}?pair=${encodeURIComponent(pair)}`;
    await shareLink(url, `Currency Pair Analysis — ${pair}`);
    alert("Link copied!");
  }

  async function copySummary() {
    const text = [
      `Currency Pair Analysis: ${data.meta.pair}`,
      `Mode: ${data.meta.mode.toUpperCase()}`,
      `Updated: ${new Date(data.meta.updatedAt).toLocaleString()}`,
      `Bias: ${data.headline.bias}`,
      `Current: ${data.headline.current}`,
      `6M Forecast: ${data.headline.forecast6m}`,
      `Best Month: ${bestMonth}`,
      `Worst Month: ${worstMonth}`,
      `Avg Sentiment: ${avgSentiment}`,
      `Source: ${data.meta.source}`,
    ].join("\n");

    await copyToClipboard(text);
    alert("Summary copied!");
  }

  function exportJSON() {
    downloadText(`analysis-${pair}.json`, JSON.stringify(data, null, 2), "application/json");
  }

  function exportCSV() {
    const lines: string[] = [];

    lines.push(toCSVRow(["meta.pair", data.meta.pair]));
    lines.push(toCSVRow(["meta.updatedAt", data.meta.updatedAt]));
    lines.push(toCSVRow(["meta.source", data.meta.source]));
    lines.push(toCSVRow(["meta.mode", data.meta.mode]));
    lines.push("");

    lines.push("HEADLINE");
    lines.push(toCSVRow(["current", data.headline.current]));
    lines.push(toCSVRow(["forecast6m", data.headline.forecast6m]));
    lines.push(toCSVRow(["bias", data.headline.bias]));
    lines.push("");

    lines.push("MACRO");
    lines.push(toCSVRow(["t", "hist", "forecast"]));
    data.macro.forEach((p) => lines.push(toCSVRow([p.t, p.hist ?? "", p.forecast ?? ""])));

    downloadText(`analysis-${pair}.csv`, lines.join("\n"), "text/csv");
  }

  function reset() {
    setPair("EURUSD");
    setShowExplain(false);
    setRefreshNonce((x) => x + 1);
  }

  const modeLabel = data.meta.mode === "live" ? "LIVE (Frankfurter)" : "DEMO (fallback)";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 42, margin: "0 0 6px" }}>Currency Pair Analysis</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontWeight: 650 }}>
            Technical, macro and positioning overview (FX is real data; other panels demo for now)
          </p>

          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.45)", fontWeight: 750, fontSize: 12 }}>
            Data mode: {modeLabel} {loadingFx ? "· loading…" : ""}
          </div>

          {fxErr && (
            <div style={{ marginTop: 8, color: "rgba(255,120,120,0.95)", fontWeight: 850 }}>
              ⚠ {fxErr}
            </div>
          )}

          <div style={{ marginTop: 10, color: "rgba(255,255,255,0.50)", fontWeight: 750, fontSize: 12 }}>
            Updated: {new Date(data.meta.updatedAt).toLocaleString()} · Source: {data.meta.source}
          </div>

          {/* Action bar */}
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button style={pill} onClick={refresh} disabled={loadingFx}>
              ↻ {loadingFx ? "Refreshing..." : "Refresh"}
            </button>
            <button style={pill} onClick={onShare}>
              ⤴ Share
            </button>
            <button style={pill} onClick={copySummary}>
              📋 Copy summary
            </button>
            <button style={pill} onClick={exportJSON}>
              ⬇ Export JSON
            </button>
            <button style={pill} onClick={exportCSV}>
              ⬇ Export CSV
            </button>
            <button style={pill} onClick={() => setShowExplain(true)}>
              ℹ Explain
            </button>
            <button style={pill} onClick={reset}>
              ⟲ Reset
            </button>
          </div>
        </div>

        {/* Pair selector */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            style={{ ...pill, appearance: "none" }}
            title="Select currency pair"
          >
            <option value="EURUSD">EURUSD</option>
            <option value="GBPUSD">GBPUSD</option>
            <option value="USDJPY">USDJPY</option>
            <option value="AUDUSD">AUDUSD</option>
            <option value="USDCAD">USDCAD</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Macro Forecast</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12, marginBottom: 12 }}>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Current</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{data.headline.current}</div>
            </div>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>6M Forecast</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{data.headline.forecast6m}</div>
            </div>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Bias</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>
                {data.headline.bias === "Bullish" ? "↗" : data.headline.bias === "Bearish" ? "↘" : "→"}
              </div>
            </div>
          </div>

          <MacroForecastChart data={data.macro} />
        </div>

        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Seasonality</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12, marginBottom: 12 }}>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Best Month</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{bestMonth}</div>
            </div>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Worst Month</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{worstMonth}</div>
            </div>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>5Y Avg</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>~</div>
            </div>
          </div>

          <SeasonalityChart data={data.seasonality} />
        </div>

        <div style={card}>
          <h3 style={{ marginTop: 0 }}>News Sentiment</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12, marginBottom: 12 }}>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Average</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{avgSentiment}</div>
            </div>

            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Points</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{data.sentiment.length}</div>
            </div>

            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Trend</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{sentimentTrend}</div>
            </div>
          </div>

          <SentimentChart data={data.sentiment} />
        </div>

        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Commitment of Traders (COT)</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 12, marginBottom: 12 }}>
            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Institutional %</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{data.cot.at(-1)?.institutional ?? "—"}%</div>
            </div>

            <div style={kpiBox}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 13 }}>Retail %</div>
              <div style={{ marginTop: 6, fontWeight: 1000, fontSize: 22 }}>{data.cot.at(-1)?.retail ?? "—"}%</div>
            </div>
          </div>

          <COTChart data={data.cot} />
        </div>
      </div>

      {/* Explain modal */}
      {showExplain && (
        <div
          onClick={() => setShowExplain(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 60,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ ...glass, padding: 16, width: "min(760px, 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 1000, fontSize: 18 }}>What does this page do?</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 750, marginTop: 4 }}>
                  Resume-ready “analysis dashboard” structure — now with real FX data.
                </div>
              </div>
              <button style={pill} onClick={() => setShowExplain(false)}>
                ✕ Close
              </button>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10, color: "rgba(255,255,255,0.80)", lineHeight: 1.55 }}>
              <div style={{ ...glass, padding: 12 }}>
                <div style={{ fontWeight: 950 }}>Macro Forecast (LIVE)</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  Uses Frankfurter time-series via your backend. Forecast is a simple slope-based extrapolation (upgradeable later).
                </div>
              </div>

              <div style={{ ...glass, padding: 12 }}>
                <div style={{ fontWeight: 950 }}>Export JSON / CSV</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  Downloads exactly what the dashboard is using (great for proving functionality in a portfolio).
                </div>
              </div>

              <div style={{ ...glass, padding: 12 }}>
                <div style={{ fontWeight: 950 }}>Next upgrades</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  Wire Seasonality/Sentiment/COT to real sources, add caching, add proper forecasting model.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button style={pill} onClick={() => setShowExplain(false)}>
                ✅ Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
