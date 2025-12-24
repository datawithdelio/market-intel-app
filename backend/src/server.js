require("dotenv").config();
const express = require("express");
const cors = require("cors");

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const app = express();

// Allow your Next.js dev ports
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

const FRED_API_KEY = process.env.FRED_API_KEY;
const PORT = Number(process.env.PORT || 4000);

// ✅ optional: friendly root route
app.get("/", (req, res) => {
  res.send("OK ✅ Backend is running. Try /api/economy/central-bank");
});

app.get("/api/economy/central-bank", async (req, res) => {
  try {
    if (!FRED_API_KEY) {
      return res
        .status(500)
        .json({ error: "Missing FRED_API_KEY in backend/.env" });
    }

    // Fed Funds (monthly). Latest observation date may lag.
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
    const asOfDate = obs?.date;      // date of the last observation from FRED
    const fetchedAt = todayISO();    // today's date (when we fetched)

    let stance = "Neutral";
    if (policyRate >= 5) stance = "Mildly Hawkish";
    if (policyRate <= 2) stance = "Mildly Dovish";

    return res.json({ policyRate, stance, asOfDate, fetchedAt });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Backend error" });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
