async function fetchMacroNews({ economy = "US", limit = 12 } = {}) {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error("Missing NEWS_API_KEY in backend/.env");

  const pageSize = Math.max(1, Math.min(Number(limit) || 12, 50));

  const qMap = {
    US: "(Federal Reserve OR Fed OR CPI OR inflation OR jobs OR unemployment OR Treasury OR USD)",
    EA: "(ECB OR eurozone OR inflation OR PMI OR EUR)",
    UK: "(Bank of England OR BoE OR inflation OR GDP OR GBP)",
    JP: "(Bank of Japan OR BoJ OR yen OR inflation OR JPY)",
  };
  const q = qMap[economy] || "(central bank OR inflation OR GDP OR jobs)";

  const url =
    `https://newsapi.org/v2/everything` +
    `?q=${encodeURIComponent(q)}` +
    `&language=en` +
    `&sortBy=publishedAt` +
    `&pageSize=${pageSize}`;

  const res = await fetch(url, { headers: { "X-Api-Key": key } });
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);

  const json = await res.json();
  const articles = Array.isArray(json?.articles) ? json.articles : [];

  return {
    meta: { economy, source: "NewsAPI", fetchedAt: new Date().toISOString() },
    items: articles.map((a) => ({
      title: a.title,
      source: a.source?.name || "",
      url: a.url,
      publishedAt: a.publishedAt,
      description: a.description,
      imageUrl: a.urlToImage,
    })),
  };
}

module.exports = { fetchMacroNews };
