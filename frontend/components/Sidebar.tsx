import Link from "next/link";

const linkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "6px 8px",
  borderRadius: 8,
};

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        borderRight: "1px solid #222",
        padding: 16,
        height: "100%",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 16 }}>Platform</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Economy</div>
        <nav>
          <Link href="/economy" style={linkStyle}>Dashboard</Link>
          <Link href="/economy/regime" style={linkStyle}>Regime</Link>
          <Link href="/economy/indicators" style={linkStyle}>Indicators</Link>
          <Link href="/economy/news" style={linkStyle}>News</Link>
          <Link href="/economy/calendar" style={linkStyle}>Calendar</Link>
        </nav>
      </div>

      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Tools</div>
        <nav>
          <Link href="/tools/performance" style={linkStyle}>Performance</Link>
          <Link href="/tools/analysis" style={linkStyle}>Analysis</Link>
          <Link href="/tools/differentials" style={linkStyle}>Differentials</Link>
          <Link href="/tools/correlations" style={linkStyle}>Correlations</Link>
          <Link href="/tools/tracker" style={linkStyle}>Tracker</Link>
        </nav>
      </div>
    </aside>
  );
}
