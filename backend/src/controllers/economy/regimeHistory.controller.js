const { buildUSRegimeHistory } = require("../../services/economy/regimeHistory.service");

async function getRegimeHistory(req, res) {
  try {
    const economy = String(req.query.economy || "US").toUpperCase();
    if (economy !== "US") return res.status(400).json({ error: "Only US supported for now" });

    const months = Number(req.query.months || 24);
    const payload = await buildUSRegimeHistory({ months });
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Regime history error" });
  }
}

module.exports = { getRegimeHistory };
