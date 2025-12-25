const express = require("express");
const router = express.Router();

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

router.get("/central-bank", async (req, res) => {
  try {
    const FRED_API_KEY = process.env.FRED_API_KEY;

    if (!FRED_API_KEY) {
      return res
        .status(500)
        .json({ error: "Missing FRED_API_KEY in backend/.env" });
    }

    const seriesId = "FEDFUNDS";

    const url =
      `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=${seriesId}` +
      `&api_key=${FRED_API_KEY}` +
      `&file_type=json` +
      `&sort_order=desc` +
      `&limit=1`;

    const fredRes = await fetch(url);
    if (!fredRes.ok) throw new Error(`FRED error: ${fredRes.status}`);

    const fredJson = await fredRes.json();
    const obs = fredJson?.observations?.[0];

    const policyRate = Number(obs?.value);
    const asOfDate = obs?.date;
    const fetchedAt = todayISO();

    let stance = "Neutral";
    if (policyRate >= 5) stance = "Mildly Hawkish";
    if (policyRate <= 2) stance = "Mildly Dovish";

    return res.json({ policyRate, stance, asOfDate, fetchedAt });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Backend error" });
  }
});

module.exports = router;
