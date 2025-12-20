type Props = {
  value: "nominal" | "real";
  onChange: (v: "nominal" | "real") => void;
};

export default function RateTypeToggle({ value, onChange }: Props) {
  const btn = (label: string, v: "nominal" | "real") => {
    const active = value === v;
    return (
      <button
        onClick={() => onChange(v)}
        style={{
          padding: "8px 12px",
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          background: active ? "#fff" : "#f4f4f4",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "inline-flex", gap: 8, padding: 6, borderRadius: 14, background: "#f4f4f4" }}>
      {btn("Nominal Rates", "nominal")}
      {btn("Real Rates", "real")}
    </div>
  );
}
