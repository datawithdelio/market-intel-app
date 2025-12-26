// backend/src/services/economy/calendar.service.js

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

async function fetchUSEconomicCalendar({ days = 7, minImpact = "Low" } = {}) {
  // TradingEconomics supports guest access (limited but real)
  const creds = process.env.TE_CREDENTIALS || "guest:guest";

  const d = clamp(Number(days) || 7, 1, 30);
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + d);

  const minImp =
    String(minImpact).toLowerCase() === "high" ? 3 :
    String(minImpact).toLowerCase() === "medium" ? 2 :
    1;

  const url =
    `https://api.tradingeconomics.com/calendar` +
    `?c=${encodeURIComponent(creds)}` +
    `&country=${encodeURIComponent("United States")}` +
    `&d1=${encodeURIComponent(iso(from))}` +
    `&d2=${encodeURIComponent(iso(to))}` +
    `&importance=${minImp}` +
    `&values=true&f=json`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TE calendar error: ${res.status} ${text}`.trim());
  }

  const json = await res.json();
  const items = Array.isArray(json) ? json : [];

  return {
    meta: {
      economy: "US",
      from: iso(from),
      to: iso(to),
      source: "TradingEconomics",
      fetchedAt: new Date().toISOString(),
    },
    items: items.map((x) => ({
      date: x?.Date || null,
      event: x?.Event || x?.Category || null,
      country: x?.Country || "United States",
      impact: impactFromImportance(x?.Importance),
      actual: x?.Actual ?? null,
      forecast: x?.Forecast ?? null,
      previous: x?.Previous ?? null,
      source: x?.Source ?? null,
      sourceURL: x?.SourceURL ?? null,
      url: x?.URL ?? null,
    })),
  };
}

module.exports = { fetchUSEconomicCalendar };
