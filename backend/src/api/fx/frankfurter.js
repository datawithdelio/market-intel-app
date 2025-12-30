const express = require("express");
const router = express.Router();

function clampDays(n, min, max) {
  n = Number(n);
  if (!Number.isFinite(n)) n = 30;
  return Math.max(min, Math.min(max, n));
}

// GET /api/fx/rates?pair=EURUSD&days=120
router.get("/rates", async (req, res) => {
  try {
    const pair = String(req.query.pair || "EURUSD").toUpperCase();
    const days = clampDays(req.query.days, 7, 365);

    if (!/^[A-Z]{6}$/.test(pair)) {
      return res.status(400).json({ error: "pair must look like EURUSD" });
    }

    const base = pair.slice(0, 3);
    const quote = pair.slice(3, 6);

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    const fromISO = from.toISOString().slice(0, 10);
    const toISO = to.toISOString().slice(0, 10);

    // Frankfurter timeseries
    const url =
      `https://api.frankfurter.dev/v1/${fromISO}..${toISO}` +
      `?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(quote)}`;

    const r = await fetch(url);
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return res.status(502).json({ error: `Frankfurter error ${r.status} ${text}`.trim() });
    }

    const json = await r.json();

    // Convert { rates: { "YYYY-MM-DD": { USD: 1.08 } } } into sorted points
    const points = Object.entries(json.rates || {})
      .map(([date, obj]) => ({
        date,
        value: obj?.[quote] ?? null,
      }))
      .filter((p) => typeof p.value === "number")
      .sort((a, b) => a.date.localeCompare(b.date));

    const latest = points.at(-1)?.value ?? null;

    res.json({
      meta: {
        pair,
        base,
        quote,
        from: fromISO,
        to: toISO,
        source: "Frankfurter",
        fetchedAt: new Date().toISOString(),
      },
      latest,
      points,
    });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

module.exports = router;
