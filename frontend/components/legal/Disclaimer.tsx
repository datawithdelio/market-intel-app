export default function Disclaimer() {
  return (
    <div
      style={{
        marginTop: 28,
        paddingTop: 20,
        borderTop: "1px solid #222",
        color: "#9aa0a6",
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <p>
        <strong>Disclaimer:</strong> The information provided on this platform is
        for educational and informational purposes only and does not constitute
        financial advice, investment advice, trading advice, or any other sort
        of advice. You should not treat any of the content as such. MarketContext
        does not recommend that any particular currency, security, or investment
        strategy is suitable for any specific person. Past performance is not
        indicative of future results. Trading forex involves substantial risk
        of loss and is not suitable for all investors.
      </p>

      <div style={{ marginTop: 12 }}>
        <a href="#" style={{ marginRight: 12 }}>Terms of Service</a>
        <a href="#" style={{ marginRight: 12 }}>Privacy Policy</a>
        <a href="#" style={{ marginRight: 12 }}>Cookie Policy</a>
        <a href="#">Manage Cookies</a>
      </div>

      <div style={{ marginTop: 10 }}>
        © 2025 MarketContext • Made in Belgium • All rights reserved.
      </div>
    </div>
  );
}
