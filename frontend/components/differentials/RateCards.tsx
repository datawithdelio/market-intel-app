type Props = {
  aName: string;
  aRate: number;
  bName: string;
  bRate: number;
};

export default function RateCards({ aName, aRate, bName, bRate }: Props) {
  const card = (name: string, rate: number, borderColor: string) => (
    <div
      style={{
        border: `2px solid ${borderColor}`,
        borderRadius: 12,
        padding: 16,
        minWidth: 220,
      }}
    >
      <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{rate.toFixed(2)}%</div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
      {card(aName, aRate, "#2563eb")}
      {card(bName, bRate, "#ec4899")}
    </div>
  );
}
