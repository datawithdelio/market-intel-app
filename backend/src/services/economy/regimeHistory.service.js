const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

async function fredSeries({ seriesId, apiKey, limit, frequency, units } = {}) {
  const url =
    `${FRED_BASE}?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(apiKey)}` +
    `&file_type=json` +
    `&sort_order=desc` +
    `&limit=${limit}` +
    (frequency ? `&frequency=${encodeURIComponent(frequency)}` : "") +
    (units ? `&units=${encodeURIComponent(units)}` : "");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED ${seriesId} error: ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.observations) ? json.observations : [];
}

function ascPoints(obsDesc) {
  return obsDesc
    .slice()
    .reverse()
    .map((o) => ({ date: o.date, v: num(o.value) }))
    .filter((p) => p.v != null);
}

function yoyFromLevelMonthly(pointsAsc) {
  const byDate = new Map(pointsAsc.map((p) => [p.date, p.v]));
  return pointsAsc
    .map((p) => {
      const d = new Date(p.date);
      d.setMonth(d.getMonth() - 12);
      const y = d.toISOString().slice(0, 10);
      const prev = byDate.get(y);
      if (prev == null || prev === 0) return null;
      return { date: p.date, v: ((p.v / prev) - 1) * 100 };
    })
    .filter(Boolean);
}

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function pickRegimeLite({ growth, infl, unDelta, curve10_2 }) {
  const g = growth == null ? 0 : growth >= 1.5 ? 1 : growth <= 0 ? -1 : 0;
  const i = infl == null ? 0 : infl >= 3 ? 1 : infl <= 1.5 ? -1 : 0;
  const l = unDelta == null ? 0 : unDelta < -0.1 ? 1 : unDelta > 0.1 ? -1 : 0;
  const c = curve10_2 == null ? 0 : curve10_2 < 0 ? -1 : curve10_2 > 0.5 ? 1 : 0;

  const growthUp = g + l + c >= 1;
  const growthDown = g + l + c <= -1;
  const inflUp = i >= 1;
  const inflDown = i <= -1;

  let label = "Reflation";
  if (growthUp && inflUp) label = "Reflation";
  else if (growthUp && !inflUp) label = "Expansion";
  else if (growthDown && inflUp) label = "Stagflation";
  else if (growthDown && inflDown) label = "Deflation";
  else label = growthUp ? "Expansion" : "Reflation";

  const strength = Math.abs(g) + Math.abs(i) + Math.abs(l) + Math.abs(c);
  const confidencePct = clamp(45 + strength * 10, 45, 85);

  return { label, confidencePct };
}

async function buildUSRegimeHistory({ months = 24 } = {}) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) throw new Error("Missing FRED_API_KEY in backend/.env");

  const m = clamp(Number(months) || 24, 6, 120);

  const cpiDesc = await fredSeries({ seriesId: "CPIAUCSL", apiKey, limit: m + 24, frequency: "m" });
  const cpiAsc = ascPoints(cpiDesc);
  const cpiYoY = yoyFromLevelMonthly(cpiAsc).slice(-m);

  const unDesc = await fredSeries({ seriesId: "UNRATE", apiKey, limit: m + 2, frequency: "m" });
  const unAsc = ascPoints(unDesc).slice(-(m + 1));
  const unSeries = unAsc.slice(-m);

  const spreadDesc = await fredSeries({ seriesId: "T10Y2Y", apiKey, limit: m, frequency: "m" });
  const spread = ascPoints(spreadDesc).slice(-m);

  const gdpDesc = await fredSeries({ seriesId: "GDPC1", apiKey, limit: 12, frequency: "q" });
  const gdpAsc = ascPoints(gdpDesc);
  const gdpQoQAnn = gdpAsc
    .slice(1)
    .map((p, i) => {
      const prev = gdpAsc[i]?.v;
      if (prev == null || prev === 0 || p.v == null) return null;
      return { date: p.date, v: (Math.pow(p.v / prev, 4) - 1) * 100 };
    })
    .filter(Boolean);

  const yoyMap = new Map(cpiYoY.map((p) => [p.date, p.v]));
  const unMap = new Map(unSeries.map((p) => [p.date, p.v]));
  const spMap = new Map(spread.map((p) => [p.date, p.v]));

  function gdpForMonth(monthISO) {
    const month = new Date(monthISO);
    let chosen = null;
    for (const q of gdpQoQAnn) {
      const qd = new Date(q.date);
      if (qd <= month) chosen = q.v;
    }
    return chosen;
  }

  function unDeltaForMonth(monthISO) {
    const idx = unSeries.findIndex((p) => p.date === monthISO);
    if (idx <= 0) return null;
    const cur = unSeries[idx]?.v;
    const prev = unSeries[idx - 1]?.v;
    if (cur == null || prev == null) return null;
    return cur - prev;
  }

  const dates = cpiYoY.map((p) => p.date);
  const points = dates.map((d) => {
    const infl = yoyMap.get(d) ?? null;
    const unrate = unMap.get(d) ?? null;
    const curve = spMap.get(d) ?? null;
    const growth = gdpForMonth(d);
    const unDelta = unDeltaForMonth(d);
    const regime = pickRegimeLite({ growth, infl, unDelta, curve10_2: curve });

    return { date: d, inflationYoY: infl, unemployment: unrate, curve10_2: curve, growthQoQAnn: growth, regime: regime.label, confidencePct: regime.confidencePct };
  });

  return { meta: { economy: "US", months: m, fetchedAt: new Date().toISOString(), source: "FRED" }, series: points };
}

module.exports = { buildUSRegimeHistory };
