"use client";

import React, { useEffect, useState } from "react";

type CentralBankResponse = {
  policyRate: number;
  stance: string;
  asOfDate: string;   // date of the FRED observation
  fetchedAt: string; // date when backend fetched it
};

// IMPORTANT:
// - If your backend runs on 4000, keep 4000.
// - If your backend runs on 8000, change to 8000.
const BACKEND_URL = "http://localhost:4000";

export default function CentralBankUI() {
  const [data, setData] = useState<CentralBankResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);

        const res = await fetch(`${BACKEND_URL}/api/economy/central-bank`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as CentralBankResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to fetch");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rateText =
    data?.policyRate != null ? `${data.policyRate.toFixed(2)}%` : "—";

   const stanceText = data?.stance ?? "—";
   const asOfDateText = data?.asOfDate ?? "—";
    const fetchedAtText = data?.fetchedAt ?? "—";
    const lastUpdatedText = fetchedAtText;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* TOP SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 18,
        }}
      >
        {/* Rate */}
        <div className="glass-card" style={card}>
          <div style={{ fontWeight: 900, fontSize: 14, opacity: 0.7 }}>
            🇺🇸 Federal Reserve (Fed)
          </div>

          <div style={{ fontSize: 40, fontWeight: 950, marginTop: 8 }}>
            {rateText}
          </div>

          <div style={{ opacity: 0.65, fontWeight: 700 }}>
           As of (FRED): {asOfDateText} • Fetched: {fetchedAtText}
          </div>

          {error && (
            <div style={{ marginTop: 10, fontWeight: 800, opacity: 0.85 }}>
              Error: {error}
            </div>
          )}
        </div>

        {/* Stance */}
        <div className="glass-card" style={card}>
          <div style={{ fontWeight: 900, fontSize: 14, opacity: 0.7 }}>
            Policy Stance Score
          </div>

          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 10 }}>
            {stanceText}
          </div>

          {/* Gauge (still mock for now) */}
          <div
            style={{
              marginTop: 14,
              height: 10,
              borderRadius: 6,
              background: "linear-gradient(90deg,#d9534f,#f0ad4e,#5cb85c)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "68%",
                top: -6,
                width: 14,
                height: 22,
                borderRadius: 4,
                background: "#fff",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: 12,
              opacity: 0.6,
              fontWeight: 700,
            }}
          >
            <span>Hawkish</span>
            <span>Dovish</span>
          </div>
        </div>
      </div>

      {/* GRID SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {/* AI Insight */}
        <div className="glass-card" style={card}>
          <div style={badge}>AI-Generated Policy Insight</div>
          <p style={text}>
            Fed policy stance is to keep rates steady for now, balancing
            inflation progress with labor market resilience.
          </p>
          <span style={link}>View Details →</span>
        </div>

        {/* Mandate */}
        <div className="glass-card" style={card}>
          <div style={badge}>Central Bank Mandate</div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <Mandate label="Inflation" value="2.5%" />
            <Mandate label="Employment" />
            <Mandate label="Stability" />
          </div>
          <span style={link}>View Details →</span>
        </div>

        {/* Rate History */}
        <div className="glass-card" style={card}>
          <div style={badge}>Interest Rate History</div>
          <div style={mockChart} />
        </div>

        {/* Forecast */}
        <div className="glass-card" style={card}>
          <div style={badge}>Rate Forecasts</div>
          <div style={mockChart} />
          <div style={{ fontWeight: 800, marginTop: 6 }}>
            Rate-end: <strong>{rateText}</strong>
          </div>
          <span style={link}>View Details →</span>
        </div>

        {/* Decisions */}
        <div className="glass-card" style={card}>
          <div style={badge}>Recent Decisions</div>
          <Decision date="March 2024" />
          <Decision date="May 2024" />
          <Decision date="June 2024" />
          <span style={link}>View Details →</span>
        </div>

        {/* News */}
        <div className="glass-card" style={card}>
          <div style={badge}>Central Bank News & Speeches</div>
          <p style={text}>
            Powell: rate cuts unlikely until inflation is clearly curbed.
          </p>
          <p style={text}>
            Fed signals no hurry to cut interest rates in coming months.
          </p>
          <span style={link}>View All News →</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

const card: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
};

const badge: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  opacity: 0.75,
};

const text: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  opacity: 0.75,
  marginTop: 10,
};

const link: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  opacity: 0.8,
  marginTop: 12,
  display: "inline-block",
};

const mockChart: React.CSSProperties = {
  marginTop: 14,
  height: 90,
  borderRadius: 12,
  background: "rgba(255,255,255,0.15)",
};

function Mandate({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 900 }}>{value ?? "✔"}</div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
    </div>
  );
}

function Decision({ date }: { date: string }) {
  return (
    <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>
      Hold — {/** keep this mock for now */}5.50%{" "}
      <span style={{ opacity: 0.6 }}>{date}</span>
    </div>
  );
}
