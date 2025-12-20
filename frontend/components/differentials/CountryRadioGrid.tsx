type Country = {
  code: string;
  name: string;
  flag: string; // emoji
};

type Props = {
  countries: Country[];
  a: string;
  b: string;
  onChangeA: (code: string) => void;
  onChangeB: (code: string) => void;
};

export default function CountryRadioGrid({ countries, a, b, onChangeA, onChangeB }: Props) {
  const colStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

  const row = (c: Country, which: "A" | "B") => {
    const selected = which === "A" ? a === c.code : b === c.code;
    const onChange = which === "A" ? onChangeA : onChangeB;

    return (
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input type="radio" checked={selected} onChange={() => onChange(c.code)} />
        <span style={{ fontSize: 18 }}>{c.flag}</span>
        <span style={{ fontWeight: 600 }}>{c.name}</span>
      </label>
    );
  };

  // 4 columns like your screenshot
  const cols = [countries.slice(0, 2), countries.slice(2, 4), countries.slice(4, 6), countries.slice(6, 8)];

  return (
    <div>
      <div style={{ fontWeight: 800, marginTop: 18 }}>Select Countries</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: 18, marginTop: 14 }}>
        {cols.map((group, i) => (
          <div key={i} style={colStyle}>
            {group.map((c) => (
              <div key={c.code} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {row(c, "A")}
                {row(c, "B")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
