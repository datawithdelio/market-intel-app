"use client";

import TopIndicator from "../../../components/economy/indicators/TopIndicator";
import IndicatorCard from "../../../components/economy/indicators/IndicatorCard";
import TrendsPanel from "../../../components/economy/indicators/TrendsPanel";

export default function Page() {
  const textPrimary = "rgba(255,255,255,0.92)";
  const textMuted = "rgba(255,255,255,0.62)";
  const divider = "1px solid rgba(255,255,255,0.08)";
  const border = "1px solid rgba(255,255,255,0.10)";

  // Regime-style panel (same vibe)
  const panel: React.CSSProperties = {
    borderRadius: 16,
    border,
    background:
      "radial-gradient(900px 380px at 15% 0%, rgba(124,139,255,0.14), transparent 55%)," +
      "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 100%)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.50)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    overflow: "hidden",
  };

  // Slightly lighter inner card (for small blocks inside panels)
  const subPanel: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        padding: 24,
        color: textPrimary,
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 42, margin: "0 0 6px", fontWeight: 950, letterSpacing: -0.4 }}>
            Indicators
          </h1>
          <p style={{ color: textMuted, margin: 0, fontWeight: 650 }}>
            Key macroeconomic indicators and signals across the economy
          </p>
        </div>

        {/* TOP GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN (Regime-style big panel) */}
          <div style={{ ...panel }}>
            <div style={{ padding: 18, borderBottom: divider }}>
              <div style={{ fontWeight: 950, marginBottom: 10, color: textPrimary }}>
                Federal Reserve Overview
              </div>

              <TopIndicator
                bankName="Federal Reserve (Fed)"
                rate="5.50%"
                changeText="↑ +0.1%"
                nextMeeting="June 12. 2024"
                gaugeValue={3.2}
                gaugeLabel="3.2%"
                gaugeSub="↗ 3.5%"
              />
            </div>

            <div style={{ padding: 18 }}>
              {/* Cards grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}
              >
                <IndicatorCard
                  title="GDP Growth"
                  value="3.2%"
                  delta="↑ +0.2%"
                  subtitle="Year-over-Year"
                  data={[2.1, 2.3, 2.6, 2.4, 2.8, 3.2]}
                />
                <IndicatorCard
                  title="Inflation (YoY)"
                  value="3.2%"
                  delta="↑ +0.1%"
                  subtitle="Previous 3.1%"
                  data={[3.8, 3.6, 3.4, 3.3, 3.1, 3.2]}
                />
                <IndicatorCard
                  title="Unemployment Rate"
                  value="4.0%"
                  delta="↓ -0.1%"
                  subtitle="Last: 4.1%"
                  data={[4.8, 4.6, 4.4, 4.3, 4.1, 4.0]}
                />
                <IndicatorCard
                  title="PMI"
                  value="51.2"
                  delta="↑ +0.4"
                  subtitle="Expansion"
                  data={[49.5, 50.1, 50.6, 50.9, 51.0, 51.2]}
                />
                <IndicatorCard
                  title="Risk Sentiment"
                  value="4.0%"
                  delta="↑ +0.3%"
                  subtitle="Bullish bias"
                  data={[1.2, 1.8, 2.4, 2.9, 3.4, 4.0]}
                />
              </div>

              <div style={{ marginTop: 12, color: textMuted, fontWeight: 650 }}>
                Placeholder for Federal Reserve indicator
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (wrap TrendsPanel to force Regime vibe) */}
          <div style={{ ...panel }}>
            <div style={{ padding: 18, borderBottom: divider }}>
              <div style={{ fontWeight: 950, color: textPrimary }}>Trends</div>
              <div style={{ color: textMuted, fontWeight: 650, marginTop: 2 }}>Last 12M</div>
            </div>

            <div style={{ padding: 18 }}>
              <div style={{ ...subPanel, padding: 14 }}>
                <TrendsPanel
                  title="Trends"
                  name="Unemployment Rate"
                  value="4.0%"
                  delta="↓ -0.1%"
                  data={[
                    { t: "Jan", v: 4.8 },
                    { t: "Feb", v: 4.7 },
                    { t: "Mar", v: 4.6 },
                    { t: "Apr", v: 4.5 },
                    { t: "May", v: 4.4 },
                    { t: "Jun", v: 4.3 },
                    { t: "Jul", v: 4.3 },
                    { t: "Aug", v: 4.2 },
                    { t: "Sep", v: 4.1 },
                    { t: "Oct", v: 4.1 },
                    { t: "Nov", v: 4.0 },
                    { t: "Dec", v: 4.0 },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LOWER GRID */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          <div style={panel}>
            <div style={{ padding: 14, borderBottom: divider, fontWeight: 950 }}>GDP Growth</div>
            <div style={{ padding: 14 }}>
              <IndicatorCard
                title="GDP Growth"
                value="3.2%"
                delta="↑ +0.2%"
                subtitle="Year-over-Year"
                data={[2.1, 2.3, 2.6, 2.4, 2.8, 3.2]}
              />
            </div>
          </div>

          <div style={panel}>
            <div style={{ padding: 14, borderBottom: divider, fontWeight: 950 }}>Inflation (YoY)</div>
            <div style={{ padding: 14 }}>
              <IndicatorCard
                title="Inflation (YoY)"
                value="3.2%"
                delta="↑ +0.1%"
                subtitle="Previous 3.1%"
                data={[3.8, 3.6, 3.4, 3.3, 3.1, 3.2]}
              />
            </div>
          </div>

          <div style={panel}>
            <div style={{ padding: 14, borderBottom: divider, fontWeight: 950 }}>Unemployment Rate</div>
            <div style={{ padding: 14 }}>
              <IndicatorCard
                title="Unemployment Rate"
                value="4.0%"
                delta="↓ -0.1%"
                subtitle="Last: 4.1%"
                data={[4.8, 4.6, 4.4, 4.3, 4.1, 4.0]}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM GRID (convert light cards -> Regime dark panels) */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 20,
          }}
        >
          {/* Latest Economic News */}
          <div style={panel}>
            <div style={{ padding: 16, borderBottom: divider }}>
              <div style={{ fontWeight: 950, color: textPrimary }}>Latest Economic News</div>
              <div style={{ color: textMuted, fontWeight: 650, marginTop: 2 }}>
                Quick macro headlines (mock)
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "10px 0", borderBottom: divider }}>
                  <div style={{ fontWeight: 900 }}>U.S. Retail Sales Rose 0.4%</div>
                  <div style={{ color: textMuted, fontSize: 13, fontWeight: 650 }}>
                    Above expectations, signaling resilient consumer demand.
                  </div>
                </li>

                <li style={{ padding: "10px 0", borderBottom: divider }}>
                  <div style={{ fontWeight: 900 }}>Consumer Confidence Falls</div>
                  <div style={{ color: textMuted, fontSize: 13, fontWeight: 650 }}>
                    Index drops to 97.3, missing forecasts.
                  </div>
                </li>

                <li style={{ padding: "10px 0" }}>
                  <div style={{ fontWeight: 900 }}>Jobless Claims Increase</div>
                  <div style={{ color: textMuted, fontSize: 13, fontWeight: 650 }}>
                    Claims rise to 244k, hinting labor market cooling.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Key Upcoming Events */}
          <div style={panel}>
            <div style={{ padding: 16, borderBottom: divider }}>
              <div style={{ fontWeight: 950, color: textPrimary }}>Key Upcoming Events</div>
              <div style={{ color: textMuted, fontWeight: 650, marginTop: 2 }}>
                Today / next 24h (mock)
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <div style={{ padding: "10px 0", borderBottom: divider }}>
                <div style={{ fontWeight: 900 }}>Inflation Rate</div>
                <div style={{ color: textMuted, fontSize: 13, fontWeight: 650 }}>6:30 am · Forecast 3.1%</div>
              </div>

              <div style={{ padding: "10px 0", borderBottom: divider }}>
                <div style={{ fontWeight: 900 }}>FOMC Meeting Minutes</div>
                <div style={{ color: textMuted, fontSize: 13, fontWeight: 650 }}>2:00 pm</div>
              </div>

              <div style={{ padding: "10px 0" }}>
                <div style={{ fontWeight: 900 }}>GDP Growth Rate</div>
                <div style={{ color: textMuted, fontSize: 13, fontWeight: 650 }}>8:30 am · +2.4%</div>
              </div>
            </div>
          </div>

          {/* Global Heatmap Placeholder */}
          <div style={panel}>
            <div style={{ padding: 16, borderBottom: divider }}>
              <div style={{ fontWeight: 950, color: textPrimary }}>Global Heatmap</div>
              <div style={{ color: textMuted, fontWeight: 650, marginTop: 2 }}>
                Placeholder panel
              </div>
            </div>

            <div
              style={{
                padding: 16,
                height: 220,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                  display: "grid",
                  placeItems: "center",
                  color: textMuted,
                  fontWeight: 800,
                }}
              >
                Heatmap
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
