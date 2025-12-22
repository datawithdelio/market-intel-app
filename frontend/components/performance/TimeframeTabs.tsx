type Props = {
  value: string;
  onChange: (v: string) => void;
};

const tabs = ["1W", "1M", "3M", "6M", "YTD", "1Y"];

export default function TimeframeTabs({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 8,
        padding: 8,
        borderRadius: 12,
        background: "transparent",
        border: "1px solid #222",
        marginTop: 16,
      }}
    >
      {tabs.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #222",
              background: active ? "#fff" : "transparent",
              color: active ? "#000000" : "#cfd3d7",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
