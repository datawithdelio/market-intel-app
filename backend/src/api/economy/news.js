const express = require("express");
const router = express.Router();
const { getNews } = require("../../controllers/economy/news.controller");

router.get("/", getNews);


// GET /api/economy/news?economy=US&limit=12
router.get("/", async (req, res) => {
  try {
    const key = process.env.NEWS_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing NEWS_API_KEY in backend/.env" });

    const economy = String(req.query.economy || "US").toUpperCase();
    const limit = Math.min(Number(req.query.limit || 12), 50);

    // Simple economy → keyword mapping (tune later)
    const qMap = {
      US: "(Federal Reserve OR Fed OR CPI OR inflation OR jobs OR unemployment OR Treasury OR USD)",
      EA: "(ECB OR eurozone OR Euro Area OR inflation OR PMI)",
      UK: "(Bank of England OR BoE OR inflation OR GDP)",
      JP: "(Bank of Japan OR BoJ OR yen OR inflation)",
    };
    const q = qMap[economy] || "(central bank OR inflation OR GDP OR jobs)";

    const url =
      `https://newsapi.org/v2/everything` +
      `?q=${encodeURIComponent(q)}` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=${limit}`;

    const r = await fetch(url, { headers: { "X-Api-Key": key } });
    if (!r.ok) throw new Error(`NewsAPI error: ${r.status}`);

    const json = await r.json();
    const articles = Array.isArray(json.articles) ? json.articles : [];

    return res.json({
      meta: { economy, fetchedAt: new Date().toISOString(), source: "NewsAPI" },
      items: articles.map((a) => ({
        title: a.title,
        source: a.source?.name || "",
        url: a.url,
        publishedAt: a.publishedAt,
        description: a.description,
        imageUrl: a.urlToImage,
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "News backend error" });
  }
});
router.get("/", getNews);

module.exports = router;
