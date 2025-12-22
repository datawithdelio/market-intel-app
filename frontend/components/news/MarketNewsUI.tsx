"use client";

import React, { useMemo, useState } from "react";

type NewsItem = {
  id: string;
  country: "US" | "EU" | "JP" | "UK" | "CN";
  category: "CENTRAL BANK" | "MACRO" | "EARNINGS" | "GEOPOL";
  tag: "MACRO" | "RATES" | "RISK" | "FX";
  timeAgo: string;
  title: string;
  summary: string;
  pills: Array<{ label: string; dir?: "up" | "down"; tone?: "good" | "bad" | "muted" }>;
};

const MOCK: NewsItem[] = [
  {
    id: "1",
    country: "US",
    category: "CENTRAL BANK",
    tag: "MACRO",
    timeAgo: "2h ago",
    title: "Fed signals higher rates for longer",
    summary: "Powell warns rates may stay elevated; Treasury yields rise. Markets price another hike risk.",
    pills: [
      { label: "USD", dir: "up", tone: "good" },
      { label: "Yields", dir: "up", tone: "good" },
      { label: "Risk-off", tone: "muted" },
    ],
  },
  {
    id: "2",
    country: "US",
    category: "MACRO",
    tag: "MACRO",
    timeAgo: "3h ago",
    title: "US CPI surprises higher, yields jump",
    summary: "CPI beats expectations. USD firms; equities wobble as rate-cut bets fade.",
    pills: [
      { label: "USD", dir: "up", tone: "good" },
      { label: "SPX", dir: "down", tone: "bad" },
      { label: "10Y", dir: "up", tone: "good" },
    ],
  },
  {
    id: "3",
    country: "EU",
    category: "MACRO",
    tag: "FX",
    timeAgo: "4h ago",
    title: "ECB officials urge caution on cuts",
    summary: "Officials stress data-dependence as markets price earlier easing; EUR mixed into the close.",
    pills: [
      { label: "EUR", dir: "down", tone: "bad" },
      { label: "Rates", tone: "muted" },
      { label: "Risk-mixed", tone: "muted" },
    ],
  },
];

export default function MarketNewsUI() {
  const [asset, setAsset] = useState<"All" | "FX" | "Equities" | "Crypto">("All");
  const [region, setRegion] = useState<"Global" | "US" | "EU" | "JP">("Global");
  const [highImpactOnly, setHighImpactOnly] = useState(false);

  const items = useMemo(() => {
    // (mock filters — you can wire real data later)
    let x = [...MOCK];
    if (region !== "Global") x = x.filter((n) => n.country === region);
    if (asset === "Crypto") x = []; // none in mock
    return x;
  }, [asset, region, highImpactOnly]);

  return (
    <div className="news-shell">
      {/* Header */}
      <div className="news-top">
        <div>
          <h1 className="news-title">Market News</h1>
          <p className="news-subtitle">Daily market-moving news with macro and asset impact.</p>
        </div>

        <div className="news-filters">
          <div className="seg">
            <button className={asset === "All" ? "segBtn on" : "segBtn"} onClick={() => setAsset("All")}>All Assets</button>
            <button className={asset === "FX" ? "segBtn on" : "segBtn"} onClick={() => setAsset("FX")}>FX</button>
            <button className={asset === "Equities" ? "segBtn on" : "segBtn"} onClick={() => setAsset("Equities")}>Equities</button>
            <button className={asset === "Crypto" ? "segBtn on" : "segBtn"} onClick={() => setAsset("Crypto")}>Crypto</button>
          </div>

          <div className="row">
            <select className="select" value={region} onChange={(e) => setRegion(e.target.value as any)}>
              <option value="Global">Global</option>
              <option value="US">US</option>
              <option value="EU">EU</option>
              <option value="JP">JP</option>
            </select>

            <button
              className={highImpactOnly ? "toggle on" : "toggle"}
              onClick={() => setHighImpactOnly((v) => !v)}
              title="Filter high impact (mock)"
            >
              ⚡ High impact only
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="news-grid">
        {/* Left column: feed */}
        <div className="news-feed">
          {items.map((n) => (
            <article key={n.id} className="news-card glass">
              <div className="news-cardTop">
                <div className="chipRow">
                  <span className="chip">{flag(n.country)} {n.country}</span>
                  <span className="chip mutedChip">{n.category}</span>
                  <span className="chip mutedChip">{n.tag}</span>
                </div>
                <span className="time muted">{n.timeAgo}</span>
              </div>

              <h3 className="news-h">{n.title}</h3>
              <p className="news-p muted">{n.summary}</p>

              <div className="news-bottom">
                <div className="pillRow">
                  {n.pills.map((p, i) => (
                    <span key={i} className={pillClass(p)}>
                      {p.label} {p.dir === "up" ? "↑" : p.dir === "down" ? "↓" : ""}
                    </span>
                  ))}
                </div>

                <div className="actions">
                  <button className="iconBtn" title="Save (mock)">☆ Save</button>
                  <button className="iconBtn" title="Share (mock)">↗ Share</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right column: panels */}
        <div className="news-side">
          <section className="glass news-panel">
            <h4 className="panelTitle">Today’s Market Narrative</h4>
            <ul className="panelList muted">
              <li>Sticky inflation concerns driving USD strength</li>
              <li>Rates-sensitive FX under pressure; JPY weakens</li>
              <li>Risk appetite mixed ahead of key releases</li>
            </ul>
          </section>

          <section className="glass news-panel">
            <h4 className="panelTitle">Top Impacted Assets</h4>
            <div className="assetGrid">
              <div className="assetRow"><span className="chip">{flag("US")} USD</span><span className="pill good">↑↑</span></div>
              <div className="assetRow"><span className="chip">{flag("EU")} EUR</span><span className="pill bad">↓</span></div>
              <div className="assetRow"><span className="chip">SPX</span><span className="pill bad">↓</span></div>
              <div className="assetRow"><span className="chip">10Y</span><span className="pill good">↑</span></div>
            </div>
          </section>

          <section className="glass news-panel">
            <h4 className="panelTitle">What to Watch Next</h4>
            <div className="watchItem">
              <div className="chipRow">
                <span className="chip">{flag("US")} Fed Decision</span>
                <span className="muted">Wed · 8:30 EST</span>
              </div>
            </div>
            <div className="watchItem">
              <div className="chipRow">
                <span className="chip">{flag("EU")} ECB Speaker</span>
                <span className="muted">Thu · 9:00 CET</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function flag(c: NewsItem["country"] | "US" | "EU" | "JP" | "UK" | "CN") {
  return c === "US" ? "🇺🇸" : c === "EU" ? "🇪🇺" : c === "JP" ? "🇯🇵" : c === "UK" ? "🇬🇧" : "🇨🇳";
}

function pillClass(p: { tone?: "good" | "bad" | "muted" }) {
  if (p.tone === "good") return "pill good";
  if (p.tone === "bad") return "pill bad";
  return "pill";
}
