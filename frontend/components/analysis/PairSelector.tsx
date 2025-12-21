type Props = {
  base: string;
  quote: string;
  onPick: (code: string) => void;
};

const codes = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"];

export default function PairSelector({ base, quote, onPick }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={{ fontWeight: 800 }}>Select Pair:</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {codes.map((c) => {
          const active = c === base || c === quote;
          return (
            <button
              key={c}
              onClick={() => onPick(c)}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: active ? "1px solid #60a5fa" : "1px solid #e5e7eb",
                background: active ? "#eaf2ff" : "#f8fafc",
                color: active ? "#1d4ed8" : "#6b7280",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div style={{ color: "#6b7280", fontWeight: 700 }}>(2/2 selected)</div>
    </div>
  );
}
