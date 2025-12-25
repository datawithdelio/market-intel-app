const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

// --- tiny in-memory cache (dev-friendly) ---
const cache = new Map();
function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}
function cacheSet(key, value, ttlMs) {
  cache.set(key, { value, exp: Date.now() + ttlMs });
}

// --- helpers ---
function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}
function pct(n) {
  return `${n.toFixed(2)}%`;
}

async function fredLatest(seriesId, limit = 24) {
  const key = process.env.FRED_API_KEY;
  if (!key) throw new Error("Missing FRED_API_KEY in backend/.env");

  const url =
    `${FRED_BASE}?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(key)}` +
    `&file_type=json&sort_order=desc&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED ${seriesId} error: ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.observations) ? json.observations : [];
}

// YoY from monthly series: (latest / value_12mo_ago - 1)*100
function computeYoYFromMonthly(obsDesc) {
  if (!Array.isArray(obsDesc) || obsDesc.length < 13) return null;
  const latest = num(obsDesc[0]?.value);
  const prev12 = num(obsDesc[12]?.value);
  if (latest == null || prev12 == null || prev12 === 0) return null;
  return ((latest / prev12) - 1) * 100;
}

// QoQ annualized from quarterly series: ((latest/prev)^4 -1)*100
function computeQoQAnnualizedFromQuarterly(obsDesc) {
  if (!Array.isArray(obsDesc) || obsDesc.length < 2) return null;
  const latest = num(obsDesc[0]?.value);
  const prev = num(obsDesc[1]?.value);
  if (latest == null || prev == null || prev === 0) return null;
  return (Math.pow(latest / prev, 4) - 1) * 100;
}

function trendDelta(latest, prev) {
  if (latest == null || prev == null) return null;
  return latest - prev;
}

function pickRegime({ growth, infl, inflDelta, unDelta, curve10_2 }) {
  const gScore = growth == null ? 0 : growth >= 1.5 ? 1 : growth <= 0 ? -1 : 0;

  let iScore = 0;
  if (infl != null) {
    if (infl >= 3.0) iScore += 1;
    if (infl <= 1.5) iScore -= 1;
  }
  if (inflDelta != null) {
    if (inflDelta > 0.05) iScore += 1;
    if (inflDelta < -0.05) iScore -= 1;
  }

  let lScore = 0;
  if (unDelta != null) {
    if (unDelta > 0.10) lScore -= 1;
    if (unDelta < -0.10) lScore += 1;
  }

  let cScore = 0;
  if (curve10_2 != null) {
    if (curve10_2 < 0) cScore -= 1;
    if (curve10_2 > 0.5) cScore += 1;
  }

  const growthUp = gScore + lScore + cScore >= 1;
  const growthDown = gScore + lScore + cScore <= -1;
  const inflUp = iScore >= 1;
  const inflDown = iScore <= -1;

  let label = "Reflation";
  if (growthUp && inflUp) label = "Reflation";
  else if (growthUp && !inflUp) label = "Expansion";
  else if (growthDown && inflUp) label = "Stagflation";
  else if (growthDown && inflDown) label = "Deflation";
  else label = growthUp ? "Expansion" : "Reflation";

  const raw = Math.abs(gScore) + Math.abs(iScore) + Math.abs(lScore) + Math.abs(cScore);
  const confidencePct = clamp(45 + raw * 10, 45, 85);

  return { label, confidencePct, scores: { gScore, iScore, lScore, cScore } };
}

function levelFromDelta(delta) {
  if (delta == null) return { text: "No change", level: "Low" };
  const abs = Math.abs(delta);
  let level = "Low";
  if (abs >= 0.25) level = "High";
  else if (abs >= 0.10) level = "Medium";
  const arrow = delta > 0 ? "↑" : "↓";
  return { text: `${arrow} ${delta.toFixed(2)}`, level };
}

// ✅ Real payload builder (US)
async function buildUSRegime() {
  const cacheKey = "us-regime";
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const cpiObs = await fredLatest("CPIAUCSL", 24);
  const inflYoY = computeYoYFromMonthly(cpiObs);
  const inflYoY_prev = cpiObs.length >= 14 ? computeYoYFromMonthly(cpiObs.slice(1)) : null;
  const inflDelta = trendDelta(inflYoY, inflYoY_prev);

  const gdpObs = await fredLatest("GDPC1", 8);
  const gdpQoQAnn = computeQoQAnnualizedFromQuarterly(gdpObs);

  const unObs = await fredLatest("UNRATE", 6);
  const unrate = num(unObs[0]?.value);
  const unratePrev = num(unObs[1]?.value);
  const unDelta = trendDelta(unrate, unratePrev);

  const y10Obs = await fredLatest("DGS10", 10);
  const y2Obs = await fredLatest("DGS2", 10);
  const y10 = num(y10Obs[0]?.value);
  const y2 = num(y2Obs[0]?.value);
  const curve10_2 = y10 != null && y2 != null ? y10 - y2 : null;

  const regime = pickRegime({
    growth: gdpQoQAnn,
    infl: inflYoY,
    inflDelta,
    unDelta,
    curve10_2,
  });

  const high = clamp(Math.round(regime.confidencePct * 0.6), 20, 70);
  const medium = clamp(Math.round((100 - high) * 0.45), 10, 50);
  const low = clamp(100 - high - medium, 5, 60);

  const signals = [
    {
      id: "inflation",
      title: "Inflation (CPI YoY)",
      value: inflYoY == null ? "N/A" : pct(inflYoY),
      delta:
        inflDelta == null
          ? "N/A"
          : `${inflDelta > 0 ? "↑" : "↓"} ${Math.abs(inflDelta).toFixed(2)}pp`,
      level: levelFromDelta(inflDelta).level,
      desc: "Derived from CPIAUCSL (FRED).",
    },
    {
      id: "growth",
      title: "Growth (Real GDP QoQ ann.)",
      value: gdpQoQAnn == null ? "N/A" : pct(gdpQoQAnn),
      delta: "N/A",
      level: gdpQoQAnn == null ? "Low" : gdpQoQAnn >= 2 ? "High" : gdpQoQAnn >= 1 ? "Medium" : "Low",
      desc: "Derived from GDPC1 (FRED).",
    },
    {
      id: "labor",
      title: "Labor (Unemployment)",
      value: unrate == null ? "N/A" : pct(unrate),
      delta:
        unDelta == null ? "N/A" : `${unDelta > 0 ? "↑" : "↓"} ${Math.abs(unDelta).toFixed(2)}pp`,
      level: levelFromDelta(unDelta).level,
      desc: "From UNRATE (FRED).",
    },
    {
      id: "curve",
      title: "Yield Curve (10Y–2Y)",
      value: curve10_2 == null ? "N/A" : `${curve10_2.toFixed(2)}pp`,
      delta: "N/A",
      level: curve10_2 == null ? "Low" : curve10_2 < 0 ? "High" : curve10_2 < 0.5 ? "Medium" : "Low",
      desc: "From DGS10 and DGS2 (FRED).",
    },
  ];

  const narrative = [
    `US regime reads as ${regime.label} with ${regime.confidencePct}% confidence.`,
    inflYoY != null
      ? `Inflation is ${pct(inflYoY)} YoY${inflDelta != null ? ` (${inflDelta > 0 ? "rising" : "easing"} vs prior).` : "."}`
      : "Inflation signal unavailable.",
    gdpQoQAnn != null ? `Growth prints ${pct(gdpQoQAnn)} QoQ annualized.` : "Growth signal unavailable.",
    curve10_2 != null ? `Curve spread is ${curve10_2.toFixed(2)}pp (${curve10_2 < 0 ? "inverted" : "positive"}).` : "Curve signal unavailable.",
  ].join(" ");

  const payload = {
    meta: {
      economy: "US",
      fetchedAt: new Date().toISOString(),
      sources: {
        inflation: "FRED:CPIAUCSL",
        gdp: "FRED:GDPC1",
        unemployment: "FRED:UNRATE",
        yields: ["FRED:DGS10", "FRED:DGS2"],
      },
    },
    current: {
      label: regime.label,
      confidencePct: regime.confidencePct,
      options: ["Reflation", "Expansion", "Stagflation", "Deflation"],
    },
    snapshot: {
      high,
      medium,
      low,
      takeaway: `Macro signals point to ${regime.label.toLowerCase()} with inflation/growth mix driving the read.`,
    },
    topSignals: signals,
    narrative,
    recentChanges: [],
    stats: [],
  };

  cacheSet(cacheKey, payload, 5 * 60 * 1000);
  return payload;
}

// ✅ Keep this for compatibility if your controller still calls buildRegimePayload()
async function buildRegimePayload({ economy = "US" } = {}) {
  if (economy === "US") return buildUSRegime();
  throw new Error(`Unsupported economy: ${economy}`);
}

module.exports = {
  buildRegimePayload,
  buildUSRegime,
};
