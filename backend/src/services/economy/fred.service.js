const FRED_API_KEY = process.env.FRED_API_KEY;

function assertKey() {
  if (!FRED_API_KEY) {
    throw new Error("Missing FRED_API_KEY in backend/.env");
  }
}

function buildUrl(seriesId, extraParams = "") {
  assertKey();
  return (
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(FRED_API_KEY)}` +
    `&file_type=json` +
    extraParams
  );
}

function parseObsValue(v) {
  if (v === "." || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// get latest + previous
async function getLatestValue(seriesId, limit = 2) {
  const url = buildUrl(seriesId, `&sort_order=desc&limit=${limit}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED error ${res.status} for ${seriesId}`);

  const json = await res.json();
  const obs = json?.observations ?? [];

  const latest = obs[0];
  const prev = obs[1];

  const latestVal = parseObsValue(latest?.value);
  const prevVal = parseObsValue(prev?.value);

  if (latestVal == null) throw new Error(`No latest value for ${seriesId}`);

  return {
    date: latest?.date ?? null,
    value: latestVal,
    prev: prevVal,
  };
}

// get N latest observations (for CPI YoY we need 13)
async function getSeriesWindow(seriesId, windowSize = 13) {
  const url = buildUrl(seriesId, `&sort_order=desc&limit=${windowSize}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED error ${res.status} for ${seriesId}`);

  const json = await res.json();
  const obs = json?.observations ?? [];

  return obs
    .map((o) => ({ date: o.date, value: parseObsValue(o.value) }))
    .filter((x) => x.value != null);
}

module.exports = { getLatestValue, getSeriesWindow };
