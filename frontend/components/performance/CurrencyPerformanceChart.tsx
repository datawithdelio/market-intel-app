type Row = {
  label: string;
  value: number; // percent, e.g. -1.94 or 1.52
};

type Props = {
  data: Row[];
};

export default function CurrencyPerformanceChart({ data }: Props) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 0.01);

  const chartHeight = 260;
  const half = chartHeight / 2;

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        background: "#0c0c0c",
        border: "1px solid #222",
      }}
    >
      <div style={{ position: "relative", height: chartHeight }}>
        {/* zero line */}
        <div
          style={{
            position: "absolute",
            top: half,
            left: 0,
            right: 0,
            height: 1,
            background: "#2a2a2a",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 14,
            height: chartHeight,
            alignItems: "stretch",
          }}
        >
          {data.map((row) => {
            const isPositive = row.value >= 0;
            const barHeight = (Math.abs(row.value) / maxAbs) * (half * 0.9);

            return (
              <div key={row.label} style={{ flex: 1, textAlign: "center" }}>
                {/* value label */}
                <div style={{ height: 30, fontWeight: 700, color: "#cfd3d7" }}>
                  {row.value > 0 ? `+${row.value.toFixed(2)}%` : `${row.value.toFixed(2)}%`}
                </div>

                {/* chart column */}
                <div style={{ height: chartHeight - 60, display: "flex", flexDirection: "column" }}>
                  {/* positive half */}
                  <div
                    style={{
                      height: half - 30,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    {isPositive && (
                      <div
                        style={{
                          width: "60%",
                          height: barHeight,
                          borderRadius: 10,
                          background: "#12b981",
                        }}
                      />
                    )}
                  </div>

                  {/* negative half */}
                  <div
                    style={{
                      height: half - 30,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    {!isPositive && (
                      <div
                        style={{
                          width: "60%",
                          height: barHeight,
                          borderRadius: 10,
                          background: "#ef4444",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* currency label */}
                <div style={{ marginTop: 14, paddingTop: 4, fontWeight: 700, color: "#9aa0a6" }}>
                  {row.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
