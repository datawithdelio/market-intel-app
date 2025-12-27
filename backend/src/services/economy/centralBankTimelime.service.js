function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function iso(d) {
  return d.toISOString().slice(0, 10);
}
function impactFromImportance(importance) {
  const n = Number(importance);
  if (n >= 3) return "High";
  if (n === 2) return "Medium";
  return "Low";
}

async function fetchLatestFedFundsRate() {
  const key = process.env.FRED_API_KEY;
  if (!key) throw new Error("Missing FRED_API_KEY in backend/.env");

  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=FEDFUNDS&api_key=${encodeURIComponent(key)}` +
    `&file_type=json&sort_order=desc&limit=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED FEDFUNDS error: ${res.status}`);
  const json = await res.json();
  const obs = json?.observations?.[0];
  return {
    policyRate: obs?.value != null ? Number(obs.value) : null,
    asOfDate: obs?.date || null,
  };
}

async function fetchUSCentralBankTimeline({ days = 90 } = {}) {
  const creds = process.env.TE_CREDENTIALS || "guest:guest";

  const d = clamp(Number(days) || 90, 7, 365);
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + d);

  // TradingEconomics calendar (real); we’ll filter to US + rate/central-bank keywords
  const url =
    `https://api.tradingeconomics.com/calendar` +
    `?c=${encodeURIComponent(creds)}` +
    `&country=${encodeURIComponent("United States")}` +
    `&d1=${encodeURIComponent(iso(from))}` +
    `&d2=${encodeURIComponent(iso(to))}` +
    `&values=true&f=json`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TE calendar error: ${res.status} ${text}`.trim());
  }

  const json = await res.json();
  const items = Array.isArray(json) ? json : [];

  const isCB = (x) => {
    const e = String(x?.Event || "").toLowerCase();
    const c = String(x?.Category || "").toLowerCase();
    return (
      e.includes("interest rate") ||
      e.includes("fed") ||
      e.includes("fomc") ||
      e.includes("monetary") ||
      c.includes("interest rate") ||
      c.includes("central bank")
    );
  };

  const timeline = items
    .filter(isCB)
    .map((x) => ({
      date: x?.Date || null,
      title: x?.Event || x?.Category || "Central bank event",
      impact: impactFromImportance(x?.Importance),
      actual: x?.Actual ?? null,
      forecast: x?.Forecast ?? null,
      previous: x?.Previous ?? null,
      source: x?.Source ?? null,
      sourceURL: x?.SourceURL ?? null,
      url: x?.URL ?? null,
    }))
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  const fed = await fetchLatestFedFundsRate();

  return {
    meta: {
      economy: "US",
      source: "TradingEconomics + FRED",
      from: iso(from),
      to: iso(to),
      fetchedAt: new Date().toISOString(),
    },
    policyRate: fed.policyRate,
    policyRateAsOf: fed.asOfDate,
    timeline,
  };
}

module.exports = { fetchUSCentralBankTimeline };
