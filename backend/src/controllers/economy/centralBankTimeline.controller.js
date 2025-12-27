const { fetchUSCentralBankTimeline } = require("../../services/economy/centralBankTimeline.service.js");

async function getCentralBankTimeline(req, res) {
  try {
    const economy = String(req.query.economy || "US").toUpperCase();
    if (economy !== "US") return res.status(400).json({ error: "Only US supported for now" });

    const days = Number(req.query.days || 90);
    const payload = await fetchUSCentralBankTimeline({ days });
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Central bank timeline error" });
  }
}

module.exports = { getCentralBankTimeline };
