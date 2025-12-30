const express = require("express");
const router = express.Router();

const { getTimeSeries } = require("./frankfurter.service");

/**
 * GET /api/fx/frankfurter/timeseries
 * ?pair=EURUSD&days=30
 */
router.get("/frankfurter/timeseries", async (req, res) => {
  try {
    const pair = req.query.pair || "EURUSD";
    const days = Number(req.query.days || 30);

    const data = await getTimeSeries({ pair, days });

    res.json({
      pair,
      days,
      points: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Frankfurter fetch failed",
    });
  }
});

module.exports = router;
