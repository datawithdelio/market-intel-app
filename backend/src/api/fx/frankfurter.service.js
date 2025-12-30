// backend/src/api/fx/frankfurter.service.js
const BASE = "https://api.frankfurter.dev/v1";

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "accept": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Frankfurter error ${res.status}${text ? `: ${text}` : ""}`);
  }
  return res.json();
}

// Pair example: "EURUSD" => base="EUR" quote="USD"
function splitPair(pair) {
  const p = String(pair || "").toUpperCase().trim();
  if (p.length !== 6) throw new Error(`Invalid pair "${pair}". Expected like EURUSD.`);
  return { base: p.slice(0, 3), quote: p.slice(3, 6) };
}

// Returns array like: [{ date: "2025-12-01", value: 1.0842 }, ...]
async function getTimeSeries({ pair = "EURUSD", days = 30 }) {
  const { base, quote } = splitPair(pair);

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - Math.max(1, Number(days) || 30));

  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);

  const url = `${BASE}/${from}..${to}?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(quote)}`;
  const json = await getJson(url);

  const rates = json?.rates || {};
  const out = Object.keys(rates)
    .sort()
    .map((date) => ({
      date,
      value: rates?.[date]?.[quote] ?? null,
    }))
    .filter((x) => typeof x.value === "number");

  return {
    meta: { pair, base, quote, from, to, source: "Frankfurter" },
    points: out,
  };
}

async function getLatest({ pair = "EURUSD" }) {
  const { base, quote } = splitPair(pair);
  const url = `${BASE}/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(quote)}`;
  const json = await getJson(url);
  const value = json?.rates?.[quote] ?? null;

  return {
    meta: { pair, base, quote, date: json?.date ?? null, source: "Frankfurter" },
    value,
  };
}

module.exports = {
  getTimeSeries,
  getLatest,
};
