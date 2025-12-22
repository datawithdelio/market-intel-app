"use client";

import React from "react";

export default function CentralBankUI() {
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
            5.50%
          </div>
          <div style={{ opacity: 0.65, fontWeight: 700 }}>
            Next Meeting: June 12, 2024
          </div>
        </div>

        {/* Stance */}
        <div className="glass-card" style={card}>
          <div style={{ fontWeight: 900, fontSize: 14, opacity: 0.7 }}>
            Policy Stance Score
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 10 }}>
            Mildly Hawkish
          </div>

          {/* Gauge */}
          <div
            style={{
              marginTop: 14,
              height: 10,
              borderRadius: 6,
              background:
                "linear-gradient(90deg,#d9534f,#f0ad4e,#5cb85c)",
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
            Rate-end: <strong>5.50%</strong>
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
      Hold — 5.50% <span style={{ opacity: 0.6 }}>{date}</span>
    </div>
  );
}
