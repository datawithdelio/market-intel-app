const { getIndicatorsData } = require("../services/economy/economy.service");

async function getIndicators(req, res) {
  try {
    const data = await getIndicatorsData();
    return res.json(data);
  } catch (err) {
    console.error("INDICATORS ERROR:\n", err?.stack || err);
    return res.status(500).json({
      error: "Failed to load indicators",
      details: err?.message || String(err),
    });
  }
}

module.exports = { getIndicators };
