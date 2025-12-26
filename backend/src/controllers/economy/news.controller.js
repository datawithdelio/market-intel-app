const { fetchMacroNews } = require("../../services/economy/news.service");

async function getNews(req, res) {
  try {
    const economy = String(req.query.economy || "US").toUpperCase();
    const limit = Math.min(Number(req.query.limit || 12), 50);

    const payload = await fetchMacroNews({ economy, limit });
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ error: err?.message || "News controller error" });
  }
}

module.exports = { getNews };
