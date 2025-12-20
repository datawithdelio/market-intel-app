type Row = {
  label: string;
  value: number; // percentage, e.g. -1.94 or 1.52
};

type Props = {
  data: Row[];
};

export default function CurrencyPerformanceChart({ data }: Props) {
  // find max absolute value to scale bars
  const maxAbs = Math.max(...data.map(d => Math.abs(d.value)), 0.01);

  const chartHeight = 260;
  const zeroLine = chartHeight / 2;

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
      {/* Chart area */}
      <div style={{ position: "relative", height: chartHeight }}>
        {/* zero line */}
        <div
          style={{
            position: "absolute",
            top: zeroLine,
            left: 0,
            right: 0,
            height: 1,
            background: "#2a2a2a",
          }}
        />

        {/* bars */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 14,
            height: chartHeight,
          }}
        >
          {data.map((row) => {
            const barHeight =
              (Math.abs(row.value) / maxAbs) * (chartHeight * 0.45);
            const isPositive = row.value >= 0;

            return (
              <div
                key={row.label}
                style={{ flex: 1, textAlign: "center" }}
              >
                {/* value label */}
                <div
                  style={{
                    height: chartHeight * 0.15,
                    fontWeight: 700,
                    color: "#cfd3d7",
                  }}
                >
                  {row.value > 0
                    ? `+${row.value.toFixed(2)}%`
                    : `${row.value.toFixed(2)}%`}
                </div>

                {/* bar container */}
                <div
                  style={{
                    position: "relative",
                    height: chartHeight * 0.7,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "20%",
                      right: "20%",
                      bottom: isPositive
                        ? zeroLine - chartHeight * 0.35
                        : zeroLine - chartHeight * 0.35 - barHeight,
                      height: barHeight,
                      borderRadius: 10,
                      background: isPositive ? "#12b981" : "#ef4444",
                    }}
                  />
                </div>

                {/* currency label */}
                <div
                  style={{
                    marginTop: 10,
                    fontWeight: 700,
                    color: "#9aa0a6",
                  }}
                >
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
