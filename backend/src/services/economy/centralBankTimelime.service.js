// backend/src/services/economy/centralBankTimeline.service.js

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

function addDaysISO(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return ymd(d);
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

// Official FOMC meeting schedule (two-day meetings)
const FOMC_SCHEDULE = [
  // 2026
  { start: "2026-01-27", sep: false },
  { start: "2026-03-17", sep: true },
  { start: "2026-04-28", sep: false },
  { start: "2026-06-16", sep: true },
  { start: "2026-07-28", sep: false },
  { start: "2026-09-15", sep: true },
  { start: "2026-10-27", sep: false },
  { start: "2026-12-08", sep: true },

  // 2027
  { start: "2027-01-26", sep: false },
  { start: "2027-03-16", sep: true },
  { start: "2027-04-27", sep: false },
  { start: "2027-06-08", sep: true },
  { start: "2027-07-27", sep: false },
  { start: "2027-09-14", sep: true },
  { start: "2027-10-26", sep: false },
  { start: "2027-12-07", sep: true },
];

function buildFomcTimelineItems(from, to) {
  const fromISO = ymd(from);
  const toISO = ymd(to);

  return FOMC_SCHEDULE
    .filter((m) => m.start >= fromISO && m.start <= toISO)
    .map((m) => {
      const end = addDaysISO(m.start, 1); // two-day meeting
      return {
        date: `${m.start}T14:00:00Z`, // placeholder time
        title: `FOMC Meeting (${m.start}–${end})${m.sep ? " + SEP" : ""}`,
        impact: "High",
        actual: null,
        forecast: null,
        previous: null,
        source: "Federal Reserve (FOMC calendar)",
        sourceURL: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        url: null,
      };
    });
}

async function fetchUSCentralBankTimeline({ days = 180 } = {}) {
  const creds = process.env.TE_CREDENTIALS || "guest:guest";

  const d = clamp(Number(days) || 180, 30, 365);

  // Pull BOTH past and future so the page always has "Recent Decisions"
  const from = new Date();
  from.setDate(from.getDate() - Math.floor(d / 2));

  const to = new Date();
  to.setDate(to.getDate() + Math.ceil(d / 2));

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
      e.includes("rate decision") ||
      e.includes("policy rate") ||
      e.includes("fomc") ||
      e.includes("fed") ||
      e.includes("powell") ||
      e.includes("monetary") ||
      e.includes("minutes") ||
      e.includes("press conference") ||
      e.includes("statement") ||
      (e.includes("rate") && (e.includes("decision") || e.includes("meeting") || e.includes("vote"))) ||
      c.includes("interest rate") ||
      c.includes("central bank") ||
      c.includes("rates") ||
      c.includes("money")
    );
  };

  const teTimeline = items
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
    }));

  const fed = await fetchLatestFedFundsRate();
  const fomcItems = buildFomcTimelineItems(from, to);

  const merged = [...timeline, ...fomcItems].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

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
    timeline: merged, 
  };
}

module.exports = { fetchUSCentralBankTimeline };
