"use client";

import React from "react";

const glass: React.CSSProperties = {
    borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))",
  boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const glassStrong: React.CSSProperties = {
  ...glass,
  background: "linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.12))",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.85)",
  fontWeight: 800,
  fontSize: 12,
};

const rowItem: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
};

const rowMuted: React.CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontWeight: 650,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 900,
  color: "rgba(255,255,255,0.92)",
};


export default function Page() {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: -24,
        padding: 24,
        color: "rgba(255,255,255,0.92)",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 48, margin: "0 0 6px", letterSpacing: -0.5 }}>Macro Regime</h1>
            <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
              Regime overview, signals, and narrative — styled like Calendar/News.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button style={pill}>↻ Refresh</button>
              <button style={pill}>👥 Competitors</button>
              <button style={pill}>⤴ Share</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button style={pill}>🌐 All Economies ▾</button>
            <button style={pill}>⚡ All Signals ▾</button>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 18 }}>
          {/* LEFT: Main regime card */}
          <div style={{ ...glassStrong, padding: 18, minHeight: 360 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontWeight: 900, letterSpacing: -0.2 }}>Current Regime</div>
              <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 800 }}>Preview</div>
            </div>

           <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
    {[
      ["Reflation", "rgba(124,139,255,0.28)"],
      ["Expansion", "rgba(34,197,94,0.18)"],
      ["Stagflation", "rgba(251,191,36,0.18)"],
      ["Deflation", "rgba(239,68,68,0.18)"],
    ].map(([x, bg]) => (
      <span
        key={x}
        style={{
          padding: "8px 12px",
          borderRadius: 999,
          fontWeight: 900,
          fontSize: 12,
          border: "1px solid rgba(255,255,255,0.16)",
          background: bg as string,
          color: "rgba(255,255,255,0.90)",
        }}
      >
        {x}
      </span>
    ))}
  </div>

  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
    <span
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 900,
        fontSize: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      Confidence: Medium (68%)
    </span>

    <span
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        fontWeight: 900,
        fontSize: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      Reflation ▾
    </span>
  </div>
</div>


            {/* Chart placeholder (like the big panels in Calendar/News) */}
            <div
  style={{
    marginTop: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background:
      "radial-gradient(700px 260px at 30% 20%, rgba(124,139,255,0.22), transparent 60%)," +
      "radial-gradient(700px 260px at 80% 60%, rgba(183,162,255,0.16), transparent 60%)," +
      "rgba(255,255,255,0.06)",
    height: 210,
  }}
/>


            <div style={{ marginTop: 14, color: "rgba(255,255,255,0.70)", fontWeight: 650, lineHeight: 1.5 }}>
              <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.88)", marginBottom: 6 }}>
                Narrative (placeholder)
              </div>
              Regime commentary goes here. Keep it short, clear, “premium” like the News cards.
            </div>
          </div>

          {/* RIGHT: Side panels (same vibe as Calendar/News right column) */}
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ ...glass, padding: 16, minHeight: 200 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Today’s Regime Snapshot</div>

              <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                <div style={{ fontSize: 32, fontWeight: 1000 }}>42%</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>Confidence</div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {[
                  ["High", "42%"],
                  ["Medium", "25%"],
                  ["Low", "33%"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                    <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.70)" }}>{k}</span>
                    <span style={{ fontWeight: 900 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", fontWeight: 650, lineHeight: 1.4 }}>
                Short takeaway line, same style as the right panels in your reference.
              </div>
            </div>

            <div style={{ ...glass, padding: 16, minHeight: 250 }}>
              <div style={{ fontWeight: 900, marginBottom: 12 }}>Top Signals</div>

              <div style={{ display: "grid", gap: 10 }}>
                {[
                  ["Inflation surprise", "High"],
                  ["PMI trend", "Medium"],
                  ["Labor cooling", "High"],
                ].map(([title, tag]) => (
                  <div
                    key={title}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 900 }}>{title}</div>
                      <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.60)", marginTop: 2 }}>
                        Placeholder description
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 12,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row (like News lower panels) */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 18 }}>
          <div style={{ ...glass, padding: 16, minHeight: 200 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Recent Regime Changes</div>
            <div style={{ display: "grid", gap: 10 }}>
             {[
  ["Apr 2024", "Stagflation → Reflation"],
  ["Jul 2023", "Inflation peak → Reflation begins"],
  ["Feb 2023", "Stagflation begins"],
].map(([d, txt]) => (
  <div
    key={d}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.11)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      e.currentTarget.style.transform = "translateY(0px)";
    }}
    style={rowItem}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: "rgba(124,139,255,0.85)",
          boxShadow: "0 0 0 3px rgba(124,139,255,0.18)",
        }}
      />
      <div style={rowTitle}>{d}</div>
    </div>

    <div style={{ ...rowMuted, textAlign: "right" }}>{txt}</div>
  </div>
))}

            </div>
          </div>

          <div style={{ ...glass, padding: 16, minHeight: 200 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Macro Regime Stats</div>
            <div style={{ display: "grid", gap: 10 }}>
             {[
  ["Reflation", "10 months"],
  ["Expansion", "4.5 years"],
  ["Stagflation", "9 months"],
  ["Deflation", "3 months"],
].map(([k, v]) => (
  <div
    key={k}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.11)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      e.currentTarget.style.transform = "translateY(0px)";
    }}
    style={rowItem}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background:
            k === "Reflation"
              ? "rgba(124,139,255,0.9)"
              : k === "Expansion"
              ? "rgba(34,197,94,0.9)"
              : k === "Stagflation"
              ? "rgba(251,191,36,0.95)"
              : "rgba(239,68,68,0.9)",
          boxShadow: "0 0 0 3px rgba(255,255,255,0.10)",
        }}
      />
      <div style={rowTitle}>{k}</div>
    </div>

    <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.78)" }}>{v}</div>
  </div>
))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
