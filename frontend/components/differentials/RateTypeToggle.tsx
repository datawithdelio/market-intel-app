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
          padding: "8px 14px",
          borderRadius: 999,
          border: "1px solid #222",
          background: active ? "#929292" : "transparent",
           color: active ? "#000000" : "#cfd3d7",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "inline-flex",
        gap: 6,
        padding: 6,
        borderRadius: 999,
        background: "transparent",
        border: "1px solid #222",
      }}
    >
      {btn("Nominal Rates", "nominal")}
      {btn("Real Rates", "real")}
    </div>
  );
}
