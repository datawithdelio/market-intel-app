const { getLatestValue, getSeriesWindow } = require("./fred.service");
const { pctChange, yoyFromIndex } = require("./calc.service");
const cache = require("./cache.service");

async function getIndicatorsData() {
  // cache for 5 minutes
  const cached = cache.get("indicators");
  if (cached) return cached;

  // SERIES (FRED)
  const SERIES = {
    fedFunds: "FEDFUNDS",
    inflationIndex: "CPIAUCSL",
    unemployment: "UNRATE",
    pmi: "NAPM", // <-- we'll fix this after we find the right series id
    gdpGrowth: "A191RL1Q225SBEA",
    vix: "VIXCLS",
  };

  // Run all calls; don't fail the whole endpoint if one series errors
  const results = await Promise.allSettled([
    getLatestValue(SERIES.fedFunds, 2),
    getLatestValue(SERIES.unemployment, 2),
    getLatestValue(SERIES.pmi, 2), // may fail
    getLatestValue(SERIES.gdpGrowth, 2),
    getLatestValue(SERIES.vix, 2),
    getSeriesWindow(SERIES.inflationIndex, 13),
  ]);

  function ok(i) {
    const r = results[i];
    return r.status === "fulfilled" ? r.value : null;
  }
  function errMsg(i) {
    const r = results[i];
    return r.status === "rejected" ? (r.reason?.message || String(r.reason)) : null;
  }

  const fedFundsLatest = ok(0);
  const unrateLatest = ok(1);
  const pmiLatest = ok(2);
  const gdpLatest = ok(3);
  const vixLatest = ok(4);
  const cpiWindow13 = ok(5);

  if (!fedFundsLatest || !unrateLatest || !gdpLatest || !vixLatest || !cpiWindow13) {
    throw new Error(
      [
        !fedFundsLatest ? `FEDFUNDS failed: ${errMsg(0)}` : null,
        !unrateLatest ? `UNRATE failed: ${errMsg(1)}` : null,
        !gdpLatest ? `GDP failed: ${errMsg(3)}` : null,
        !vixLatest ? `VIX failed: ${errMsg(4)}` : null,
        !cpiWindow13 ? `CPI window failed: ${errMsg(5)}` : null,
      ]
        .filter(Boolean)
        .join(" | ")
    );
  }

  const inflationYoY = yoyFromIndex(cpiWindow13); // { value, change, asOfDate }

  const data = {
    fetchedAt: new Date().toISOString(),

    fed: {
      policyRate: fedFundsLatest.value,
      change: pctChange(fedFundsLatest.prev, fedFundsLatest.value),
      asOfDate: fedFundsLatest.date,
    },

    indicators: {
      gdpGrowth: {
        value: gdpLatest.value,
        change: pctChange(gdpLatest.prev, gdpLatest.value),
        asOfDate: gdpLatest.date,
      },
      inflationYoY: {
        value: inflationYoY.value,
        change: inflationYoY.change,
        asOfDate: inflationYoY.asOfDate,
      },
      unemployment: {
        value: unrateLatest.value,
        change: pctChange(unrateLatest.prev, unrateLatest.value),
        asOfDate: unrateLatest.date,
      },

      // PMI is optional for now (because series id is failing)
      pmi: pmiLatest
        ? {
            value: pmiLatest.value,
            change: pctChange(pmiLatest.prev, pmiLatest.value),
            asOfDate: pmiLatest.date,
          }
        : null,

      riskSentiment: {
        value: vixLatest.value,
        change: pctChange(vixLatest.prev, vixLatest.value),
        asOfDate: vixLatest.date,
      },
    },
  };

  cache.set("indicators", data, 5 * 60 * 1000);
  return data;
}

module.exports = { getIndicatorsData };
