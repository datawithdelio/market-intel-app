"use client";
import TopIndicator from "../../../components/economy/indicators/TopIndicator";
import IndicatorCard from "../../../components/economy/indicators/IndicatorCard";
import TrendsPanel from "../../../components/economy/indicators/TrendsPanel";
export default function Page() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgb(17,17,17)",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto", color: "#e5e7eb" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 42, margin: "0 0 6px" }}>Indicators</h1>
          <p style={{ color: "#9aa0a6", margin: 0 }}>
            Key macroeconomic indicators and signals across the economy
          </p>
        </div>

        {/* GRID placeholder */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
          }}
        >
          {/* LEFT COLUMN */}
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid #222",
              borderRadius: 16,
              padding: 20,
              minHeight: 220,
            }}
          >
            <div style={{ fontWeight : 800, marginBottom: 6 }}>
             <TopIndicator
               bankName="Federal Reserve (Fed)"
               rate="5.50%"
               changeText="↑ +0.1%"
               nextMeeting="June 12. 2024"
               gaugeValue={3.2}
               gaugeLabel="3.2%"
               gaugeSub="↗ 3.5%"
               />
               <div
               style={{
                 marginTop: 20,
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
            </div>
            <div style={{ color: "#9aa0a6" }}>
              Placeholder for Federal Reserve indicator
            </div>
          </div>

          {/* RIGHT COLUMN */}
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

        {/* LOWER GRID */}
<div
  style={{
    marginTop: 20,
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
</div>


  {/* BOTTOM GRID */}
<div
  style={{
    marginTop: 28,
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 20,
  }}
>
  {/* Latest Economic News */}
  <div
    style={{
      borderRadius: 18,
      padding: 18,
      border: "1px solid rgba(255,255,255,0.35)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.50))",
      boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
    }}
  >
    <div style={{ fontWeight: 900, color: "#111827", marginBottom: 12 }}>
      Latest Economic News
    </div>

    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      <li style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 800 }}>U.S. Retail Sales Rose 0.4%</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          Above expectations, signaling resilient consumer demand.
        </div>
      </li>
      <li style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 800 }}>Consumer Confidence Falls</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          Index drops to 97.3, missing forecasts.
        </div>
      </li>
      <li>
        <div style={{ fontWeight: 800 }}>Jobless Claims Increase</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          Claims rise to 244k, hinting labor market cooling.
        </div>
      </li>
    </ul>
  </div>

  {/* Key Upcoming Events */}
  <div
    style={{
      borderRadius: 18,
      padding: 18,
      border: "1px solid rgba(255,255,255,0.35)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.50))",
      boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
    }}
  >
    <div style={{ fontWeight: 900, color: "#111827", marginBottom: 12 }}>
      Key Upcoming Events
    </div>

    <div style={{ marginBottom: 10 }}>
      <div style={{ fontWeight: 800 }}>Inflation Rate</div>
      <div style={{ color: "#6b7280", fontSize: 13 }}>6:30 am · Forecast 3.1%</div>
    </div>

    <div style={{ marginBottom: 10 }}>
      <div style={{ fontWeight: 800 }}>FOMC Meeting Minutes</div>
      <div style={{ color: "#6b7280", fontSize: 13 }}>2:00 pm</div>
    </div>

    <div>
      <div style={{ fontWeight: 800 }}>GDP Growth Rate</div>
      <div style={{ color: "#6b7280", fontSize: 13 }}>8:30 am · +2.4%</div>
    </div>
  </div>

  {/* Global Heatmap Placeholder */}
  <div
    style={{
      borderRadius: 18,
      padding: 18,
      border: "1px solid rgba(255,255,255,0.35)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.50))",
      boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
      fontWeight: 800,
    }}
  >
    Global Heatmap
  </div>
</div>
      </div>
    </div>
  );
}
