"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { downloadText, shareLink, copyToClipboard } from "@/lib/actions";

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
  cursor: "pointer",
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
  return s.replaceAll("**", "");
}

function apiBase() {
  // match your other pages’ convention
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

function safeJoinSources(sources?: Record<string, any>) {
  try {
    if (!sources) return "";
    const values = Object.values(sources).flat();
    return values.map((x) => String(x)).join(", ");
  } catch {
    return "";
  }
}

export default function Page() {
  const pathname = usePathname();

  const [economy, setEconomy] = useState<"US">("US");
  const [signalsFilter, setSignalsFilter] = useState<"ALL" | "High" | "Medium" | "Low">("ALL");

  const [data, setData] = useState<RegimePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Modals
  const [showExplain, setShowExplain] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<RegimePayload["topSignals"][number] | null>(null);

  const fetchRegime = useCallback(async () => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);

    try {
      const url = `${apiBase()}/api/economy/regime?economy=${encodeURIComponent(economy)}`;
      const res = await fetch(url, { signal: ac.signal, cache: "no-store" });

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
  }, [economy]);

  useEffect(() => {
    let cleanup: undefined | (() => void);
    fetchRegime().then((c) => (cleanup = c));
    return () => cleanup?.();
  }, [fetchRegime]);

  const options = useMemo(
    () => data?.current?.options ?? ["Reflation", "Expansion", "Stagflation", "Deflation"],
    [data]
  );

  const currentLabel = data?.current?.label ?? "Reflation";
  const currentConf = data?.current?.confidencePct ?? 68;

  const snapshot = data?.snapshot ?? { high: 42, medium: 25, low: 33, takeaway: "" };
  const topSignalsRaw = data?.topSignals ?? [];

  const topSignals = useMemo(() => {
    const normalized = topSignalsRaw.map((s) => ({
      ...s,
      levelNorm: (s.level || "Low").toString(),
    }));
    if (signalsFilter === "ALL") return normalized;
    return normalized.filter((s) => s.levelNorm.toLowerCase().includes(signalsFilter.toLowerCase()));
  }, [topSignalsRaw, signalsFilter]);

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

  function onCompetitors() {
    window.location.href = "/tools/differentials";
  }

  async function onShare() {
    const url = `${window.location.origin}${pathname}`;
    await shareLink(url, "Macro Regime");
    alert("Link copied!");
  }

  function exportJSON() {
    if (!data) return alert("Nothing to export yet. Click Refresh first.");
    downloadText(`regime-${economy}.json`, JSON.stringify(data, null, 2), "application/json");
  }

  function resetAll() {
    setEconomy("US");
    setSignalsFilter("ALL");
    setShowExplain(false);
    setSelectedSignal(null);
  }

  async function copySignalDetails(s: RegimePayload["topSignals"][number]) {
    const text = [
      `Signal: ${s.title ?? "—"}`,
      `Level: ${s.level ?? "—"}`,
      `Value: ${s.value ?? "—"}`,
      `Delta: ${s.delta ?? "—"}`,
      `Description: ${s.desc ?? "—"}`,
    ].join("\n");

    await copyToClipboard(text);
    alert("Signal copied!");
  }

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
              <button style={pill} onClick={fetchRegime} disabled={loading}>
                ↻ {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button style={pill} onClick={exportJSON} disabled={!data || loading}>
                ⬇ Export JSON
              </button>

              <button style={pill} type="button" onClick={() => setShowExplain(true)}>
                ℹ Explain
              </button>

              <button style={pill} type="button" onClick={resetAll}>
                ⟲ Reset
              </button>

              <button style={pill} type="button" onClick={onCompetitors}>
                👥 Competitors
              </button>

              <button style={pill} type="button" onClick={onShare}>
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
            {/* Economy dropdown (US-only for now, but still “real”) */}
            <button style={pill} type="button" onClick={() => setEconomy("US")} title="US only for now">
              🌐 {economy} ▾
            </button>

            {/* Signals filter (now functional) */}
            <select
              value={signalsFilter}
              onChange={(e) => setSignalsFilter(e.target.value as any)}
              style={{ ...pill, appearance: "none" }}
              title="Filter top signals"
            >
              <option value="ALL">⚡ ALL signals</option>
              <option value="High">⚡ High only</option>
              <option value="Medium">⚡ Medium only</option>
              <option value="Low">⚡ Low only</option>
            </select>
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

            {/* Chart placeholder */}
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
                {topSignals.map((s) => (
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
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedSignal(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedSignal(s);
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

                {!topSignalsRaw.length ? (
                  <div style={{ ...rowMuted, padding: 12 }}>No signals yet (loading or backend returned none).</div>
                ) : null}

                {topSignalsRaw.length > 0 && topSignals.length === 0 ? (
                  <div style={{ ...rowMuted, padding: 12 }}>No signals match your filter.</div>
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

        {/* Footer debug */}
        {data?.meta?.sources ? (
          <div style={{ marginTop: 14, color: "rgba(255,255,255,0.45)", fontWeight: 700, fontSize: 12 }}>
            Sources: {safeJoinSources(data.meta.sources)}
          </div>
        ) : null}
      </div>

      {/* ✅ Explain modal */}
      {showExplain && (
        <div
          onClick={() => setShowExplain(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 60,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ ...glass, padding: 16, width: "min(760px, 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 1000, fontSize: 18 }}>What is “Macro Regime”?</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 750, marginTop: 4 }}>
                  A quick guide to reading this page.
                </div>
              </div>
              <button style={pill} onClick={() => setShowExplain(false)}>
                ✕ Close
              </button>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10, color: "rgba(255,255,255,0.80)", lineHeight: 1.55 }}>
              <div style={rowItem}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontWeight: 950 }}>Regime label</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    A human-readable macro state (ex: Reflation / Expansion / Stagflation / Deflation).
                  </div>
                </div>
              </div>

              <div style={rowItem}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontWeight: 950 }}>Confidence</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    A score showing how strongly the signals agree with the current regime.
                  </div>
                </div>
              </div>

              <div style={rowItem}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontWeight: 950 }}>Top Signals</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    The most important inputs driving the classification (click any signal for details).
                  </div>
                </div>
              </div>

              <div style={rowItem}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontWeight: 950 }}>Export JSON</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    Downloads the raw payload used by this page (helpful for debugging, sharing, and analysis).
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button style={pill} onClick={() => setShowExplain(false)}>
                ✅ Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Signal details modal */}
      {selectedSignal && (
        <div
          onClick={() => setSelectedSignal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 70,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ ...glass, padding: 16, width: "min(720px, 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 1000, fontSize: 18 }}>{selectedSignal.title || "Signal"}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 750, marginTop: 4 }}>
                  Level: <span style={{ fontWeight: 900 }}>{selectedSignal.level || "—"}</span>
                </div>
              </div>
              <button style={pill} onClick={() => setSelectedSignal(null)}>
                ✕ Close
              </button>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {[
                ["Value", selectedSignal.value ?? "—"],
                ["Delta", selectedSignal.delta ?? "—"],
                ["Description", selectedSignal.desc ?? "—"],
                ["ID", selectedSignal.id ?? "—"],
              ].map(([k, v]) => (
                <div key={k} style={{ ...rowItem, justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.70)", fontWeight: 800 }}>{k}</span>
                  <span style={{ fontWeight: 900, textAlign: "right" }}>{String(v)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button style={pill} onClick={() => copySignalDetails(selectedSignal)}>
                📋 Copy signal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
