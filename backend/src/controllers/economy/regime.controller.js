// backend/src/controllers/economy/regime.controller.js

const { buildUSRegime } = require("../../services/economy/regime.service");

async function getRegime(req, res) {
  try {
    const economy = (req.query.economy || "US").toUpperCase();

    if (economy !== "US") {
      return res.status(400).json({ error: "Only US supported for now" });
    }

    const payload = await buildUSRegime();
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Regime controller error",
    });
  }
}

module.exports = { getRegime };
