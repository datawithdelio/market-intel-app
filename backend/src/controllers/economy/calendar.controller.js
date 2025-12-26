const { fetchUSEconomicCalendar } = require("../../services/economy/calendar.service");

async function getCalendar(req, res) {
  try {
    const economy = String(req.query.economy || "US").toUpperCase();
    if (economy !== "US") return res.status(400).json({ error: "Only US supported for now" });

    const days = Number(req.query.days || 7);
    const impact = String(req.query.impact || "Low"); // Low|Medium|High

    const payload = await fetchUSEconomicCalendar({ days, minImpact: impact });
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Calendar controller error" });
  }
}

module.exports = { getCalendar };
