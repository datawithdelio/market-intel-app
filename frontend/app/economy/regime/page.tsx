"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

type RegimePayload = {
  meta: {
    economy: string;
    fetchedAt: string;
    sources?: Record<string, any>;
  };
  current: {
    label: "Reflation" | "Expansion" | "Stagflation" | "Deflation" | string;
    confidencePct: number;
    options?: string[];
  };
  snapshot: {
    high: number;
    medium: number;
    low: number;
    takeaway?: string;
  };
  topSignals: Array<{
    id: string;
    title: string;
    value?: string;
    delta?: string;
    level?: "High" | "Medium" | "Low" | string;
    desc?: string;
  }>;
  narrative?: string;
  recentChanges?: Array<{ date: string; change: string }>;
  stats?: Array<{ label: string; duration: string }>;
};

const glass: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))",
  boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const glassStrong: React.CSSProperties = {
  ...glass,
  background: "linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.12))",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.85)",
  fontWeight: 800,
  fontSize: 12,
};

const rowItem: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
};

const rowMuted: React.CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontWeight: 650,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 900,
  color: "rgba(255,255,255,0.92)",
};

function confLabel(pct: number) {
  if (pct >= 75) return "High";
  if (pct >= 60) return "Medium";
  return "Low";
}

function stripMdBold(s: string) {
  // backend narrative has **bold** -> keep it simple for now
  return s.replaceAll("**", "");
}

export default function Page() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [economy, setEconomy] = useState<"US">("US");
  const [signalsFilter, setSignalsFilter] = useState<"ALL">("ALL");

  const [data, setData] = useState<RegimePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchRegime = useCallback(async () => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);

    try {
      const url = `${API_BASE}/api/economy/regime?economy=${encodeURIComponent(economy)}`;
      const res = await fetch(url, { signal: ac.signal });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Regime fetch failed (${res.status}) ${text ? `- ${text}` : ""}`.trim());
      }

      const json = (await res.json()) as RegimePayload;
      setData(json);
    } catch (e: any) {
      if (e?.name !== "AbortError") setErr(e?.message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }

    return () => ac.abort();
  }, [API_BASE, economy]);

  useEffect(() => {
    fetchRegime();
  }, [fetchRegime]);

  const options = useMemo(
    () => data?.current?.options ?? ["Reflation", "Expansion", "Stagflation", "Deflation"],
    [data]
  );

  const currentLabel = data?.current?.label ?? "Reflation";
  const currentConf = data?.current?.confidencePct ?? 68;

  const snapshot = data?.snapshot ?? { high: 42, medium: 25, low: 33, takeaway: "" };
  const topSignals = data?.topSignals ?? [];

  const narrative = data?.narrative
    ? stripMdBold(data.narrative)
    : "Regime commentary goes here. Keep it short, clear, “premium” like the News cards.";

  const recentChanges =
    data?.recentChanges?.length
      ? data.recentChanges
      : [
          { date: "Apr 2024", change: "Stagflation → Reflation" },
          { date: "Jul 2023", change: "Inflation peak → Reflation begins" },
          { date: "Feb 2023", change: "Stagflation begins" },
        ];

  const stats =
    data?.stats?.length
      ? data.stats
      : [
          { label: "Reflation", duration: "10 months" },
          { label: "Expansion", duration: "4.5 years" },
          { label: "Stagflation", duration: "9 months" },
          { label: "Deflation", duration: "3 months" },
        ];

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: -24,
        padding: 24,
        color: "rgba(255,255,255,0.92)",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 48, margin: "0 0 6px", letterSpacing: -0.5 }}>Macro Regime</h1>
            <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
              Regime overview, signals, and narrative — styled like Calendar/News.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button style={pill} onClick={fetchRegime}>
                ↻ {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button style={pill} type="button">
                👥 Competitors
              </button>
              <button style={pill} type="button">
                ⤴ Share
              </button>

              {err ? (
                <span style={{ ...pill, borderColor: "rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.10)" }}>
                  ⚠ {err}
                </span>
              ) : null}
            </div>

            {data?.meta?.fetchedAt ? (
              <div style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 12 }}>
                Updated: {new Date(data.meta.fetchedAt).toLocaleString()}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* keep same “dropdown look” but functional later */}
            <button style={pill} type="button" onClick={() => setEconomy("US")}>
              🌐 {economy} ▾
            </button>
            <button style={pill} type="button" onClick={() => setSignalsFilter("ALL")}>
              ⚡ {signalsFilter} ▾
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 18 }}>
          {/* LEFT: Main regime card */}
          <div style={{ ...glassStrong, padding: 18, minHeight: 360 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontWeight: 900, letterSpacing: -0.2 }}>Current Regime</div>
              <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 800 }}>{loading ? "Loading…" : "Preview"}</div>
            </div>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {options.map((x) => {
                  const active = x === currentLabel;
                  const bg =
                    x === "Reflation"
                      ? "rgba(124,139,255,0.28)"
                      : x === "Expansion"
                      ? "rgba(34,197,94,0.18)"
                      : x === "Stagflation"
                      ? "rgba(251,191,36,0.18)"
                      : "rgba(239,68,68,0.18)";

                  return (
                    <span
                      key={x}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 12,
                        border: active ? "1px solid rgba(255,255,255,0.28)" : "1px solid rgba(255,255,255,0.16)",
                        background: bg,
                        color: "rgba(255,255,255,0.90)",
                        opacity: active ? 1 : 0.65,
                      }}
                    >
                      {x}
                    </span>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontWeight: 900,
                    fontSize: 12,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Confidence: {confLabel(currentConf)} ({currentConf}%)
                </span>

                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: 12,
                    fontWeight: 900,
                    fontSize: 12,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {currentLabel} ▾
                </span>
              </div>
            </div>

            {/* Chart placeholder (keep for now) */}
            <div
              style={{
                marginTop: 16,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background:
                  "radial-gradient(700px 260px at 30% 20%, rgba(124,139,255,0.22), transparent 60%)," +
                  "radial-gradient(700px 260px at 80% 60%, rgba(183,162,255,0.16), transparent 60%)," +
                  "rgba(255,255,255,0.06)",
                height: 210,
              }}
            />

            <div style={{ marginTop: 14, color: "rgba(255,255,255,0.70)", fontWeight: 650, lineHeight: 1.5 }}>
              <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.88)", marginBottom: 6 }}>Narrative</div>
              {narrative}
            </div>
          </div>

          {/* RIGHT: Side panels */}
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ ...glass, padding: 16, minHeight: 200 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Today’s Regime Snapshot</div>

              <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                <div style={{ fontSize: 32, fontWeight: 1000 }}>{snapshot.high}%</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>Confidence</div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {[
                  ["High", `${snapshot.high}%`],
                  ["Medium", `${snapshot.medium}%`],
                  ["Low", `${snapshot.low}%`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                    <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.70)" }}>{k}</span>
                    <span style={{ fontWeight: 900 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", fontWeight: 650, lineHeight: 1.4 }}>
                {snapshot.takeaway || "Short takeaway line, same style as the right panels in your reference."}
              </div>
            </div>

            <div style={{ ...glass, padding: 16, minHeight: 250 }}>
              <div style={{ fontWeight: 900, marginBottom: 12 }}>Top Signals</div>

              <div style={{ display: "grid", gap: 10 }}>
                {(topSignals.length ? topSignals : []).map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 900 }}>
                        {s.title}
                        {s.value ? <span style={{ opacity: 0.75, fontWeight: 850 }}> · {s.value}</span> : null}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.60)", marginTop: 2 }}>
                        {s.desc || "—"}
                        {s.delta && s.delta !== "N/A" ? ` · ${s.delta}` : ""}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 12,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.85)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.level || "—"}
                    </span>
                  </div>
                ))}

                {!topSignals.length ? (
                  <div style={{ ...rowMuted, padding: 12 }}>No signals yet (loading or backend returned none).</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 18 }}>
          <div style={{ ...glass, padding: 16, minHeight: 200 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Recent Regime Changes</div>
            <div style={{ display: "grid", gap: 10 }}>
              {recentChanges.map((x) => (
                <div
                  key={x.date}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.11)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.18)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
                  }}
                  style={rowItem}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: "rgba(124,139,255,0.85)",
                        boxShadow: "0 0 0 3px rgba(124,139,255,0.18)",
                      }}
                    />
                    <div style={rowTitle}>{x.date}</div>
                  </div>

                  <div style={{ ...rowMuted, textAlign: "right" }}>{x.change}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...glass, padding: 16, minHeight: 200 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Macro Regime Stats</div>
            <div style={{ display: "grid", gap: 10 }}>
              {stats.map((x) => (
                <div
                  key={x.label}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.11)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.18)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
                  }}
                  style={rowItem}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background:
                          x.label === "Reflation"
                            ? "rgba(124,139,255,0.9)"
                            : x.label === "Expansion"
                            ? "rgba(34,197,94,0.9)"
                            : x.label === "Stagflation"
                            ? "rgba(251,191,36,0.95)"
                            : "rgba(239,68,68,0.9)",
                        boxShadow: "0 0 0 3px rgba(255,255,255,0.10)",
                      }}
                    />
                    <div style={rowTitle}>{x.label}</div>
                  </div>

                  <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.78)" }}>{x.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* small footer debug */}
        {data?.meta?.sources ? (
          <div style={{ marginTop: 14, color: "rgba(255,255,255,0.45)", fontWeight: 700, fontSize: 12 }}>
            Sources: {Object.values(data.meta.sources).flat().join(", ")}
          </div>
        ) : null}
      </div>
    </div>
  );
}
