"use client";

import React, { useEffect, useMemo, useState } from "react";

type TimelineItem = {
  date: string | null;
  title: string | null;
  impact: string | null; // "High" | "Medium" | "Low"
  actual: string | number | null;
  forecast: string | number | null;
  previous: string | number | null;
  source?: string | null;
  sourceURL?: string | null;
  url?: string | null;
};

type Payload = {
  meta: {
    economy: string;
    source: string;
    from: string;
    to: string;
    fetchedAt: string;
  };
  policyRate: number | null;
  policyRateAsOf: string | null;
  timeline: TimelineItem[];
};

const glass: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))",
  boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
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
};

function apiBase() {
  // Recommended: frontend/.env.local -> NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

function normalizeImpact(x: string | null) {
  if (!x) return "Low";
  const v = x.toLowerCase();
  if (v.includes("high")) return "High";
  if (v.includes("med")) return "Medium";
  return "Low";
}
function stars(impact: string) {
  if (impact === "High") return "★★★";
  if (impact === "Medium") return "★★";
  return "★";
}
function valueOrDash(v: any) {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}
function fmtDateTime(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function stanceFromRate(r: number | null) {
  if (r == null) return { label: "Unknown", hint: "Rate unavailable" };
  if (r >= 5) return { label: "Hawkish", hint: "Tight policy stance" };
  if (r <= 2) return { label: "Dovish", hint: "Loose policy stance" };
  return { label: "Neutral", hint: "Mid-range policy stance" };
}

export default function Page() {
  const [days, setDays] = useState<number>(180);
  const [impactFilter, setImpactFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const url = `${apiBase()}/api/economy/central-bank/timeline?economy=US&days=${days}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || `Central bank fetch failed: ${res.status}`);
      setData(json);
    } catch (e: any) {
      setErr(e?.message || "Failed to load central bank timeline");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const filtered = useMemo(() => {
    const items = (data?.timeline || []).map((x) => ({ ...x, impactNorm: normalizeImpact(x.impact) }));
    const out =
      impactFilter === "All" ? items : items.filter((x) => x.impactNorm === impactFilter);

    out.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
    return out;
  }, [data, impactFilter]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return filtered.filter((x) => {
      const t = new Date((x.date || "").replace(" ", "T")).getTime();
      return Number.isFinite(t) && t >= now;
    }).slice(0, 12);
  }, [filtered]);

  const recent = useMemo(() => {
    const now = Date.now();
    const past = filtered.filter((x) => {
      const t = new Date((x.date || "").replace(" ", "T")).getTime();
      return Number.isFinite(t) && t < now;
    });
    return past.slice(-12).reverse();
  }, [filtered]);

  const stance = stanceFromRate(data?.policyRate ?? null);

  return (
    <div style={{ minHeight: "100vh", margin: -24, padding: 24, color: "rgba(255,255,255,0.92)" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 48, margin: "0 0 6px", letterSpacing: -0.5 }}>Central Bank</h1>
            <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
              Policy rate + upcoming decisions and rate-related events.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button style={pill} onClick={load} disabled={loading}>
                ↻ {loading ? "Loading..." : "Refresh"}
              </button>
              <button style={pill}>⤴ Share</button>
            </div>

            {err && (
              <div style={{ marginTop: 10, color: "rgba(255,120,120,0.95)", fontWeight: 800 }}>{err}</div>
            )}
            {!err && data?.meta?.fetchedAt && (
              <div style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 12 }}>
                Source: {data.meta.source} · Updated: {new Date(data.meta.fetchedAt).toLocaleString()}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <select
              value={String(days)}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ ...pill, appearance: "none", cursor: "pointer" }}
              title="How far ahead"
            >
              <option value="90">Next 90 days</option>
              <option value="180">Next 180 days</option>
              <option value="365">Next 365 days</option>
            </select>

            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value as any)}
              style={{ ...pill, appearance: "none", cursor: "pointer" }}
              title="Impact filter"
            >
              <option value="All">⚡ All Impact</option>
              <option value="High">⚡ High</option>
              <option value="Medium">⚡ Medium</option>
              <option value="Low">⚡ Low</option>
            </select>
          </div>
        </div>

        {/* Main */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 18 }}>
          {/* Policy card */}
          <div style={{ ...glass, padding: 16, minHeight: 220 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Policy Snapshot (US)</div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div style={{ fontSize: 42, fontWeight: 1000 }}>
                {data?.policyRate == null ? "—" : `${data.policyRate.toFixed(2)}%`}
              </div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>
                Fed Funds (latest)
              </div>
            </div>

            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.65)", fontWeight: 700 }}>
              As of: {data?.policyRateAsOf ? data.policyRateAsOf : "—"}
            </div>

            <div style={{ marginTop: 14, ...rowItem }}>
              <div>
                <div style={{ fontWeight: 1000 }}>{stance.label}</div>
                <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
                  {stance.hint}
                </div>
              </div>
              <div style={{ fontWeight: 900, opacity: 0.85 }}>🏦</div>
            </div>

            <div style={{ marginTop: 12, color: "rgba(255,255,255,0.55)", fontWeight: 650, fontSize: 12 }}>
              Tip: This page uses FRED for the policy rate and TradingEconomics for event timing.
            </div>
          </div>

          {/* Upcoming */}
          <div style={{ ...glass, padding: 16, minHeight: 220 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Upcoming Rate Events</div>

            <div style={{ display: "grid", gap: 10 }}>
              {loading && (
                <div style={{ ...rowItem, justifyContent: "flex-start", color: "rgba(255,255,255,0.70)" }}>
                  Loading…
                </div>
              )}

              {!loading && upcoming.length === 0 && (
                <div style={{ ...rowItem, justifyContent: "flex-start", color: "rgba(255,255,255,0.70)" }}>
                  No upcoming events found for this window/filter.
                </div>
              )}

              {!loading && upcoming.map((x, idx) => (
                <div key={`${x.date}-${idx}`} style={rowItem}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontWeight: 900 }}>{x.title || "Central bank event"}</div>
                    <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.65)" }}>
                      {fmtDateTime(x.date)} · Impact: <span style={{ fontWeight: 900 }}>{x.impactNorm}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.70)" }}>
                      Forecast: {valueOrDash(x.forecast)} · Previous: {valueOrDash(x.previous)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, opacity: 0.85 }}>{stars(x.impactNorm)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div style={{ ...glass, padding: 16, minHeight: 320, gridColumn: "1 / -1" }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Recent Decisions / Releases</div>

            <div style={{ display: "grid", gap: 10 }}>
              {!loading && recent.length === 0 && (
                <div style={{ ...rowItem, justifyContent: "flex-start", color: "rgba(255,255,255,0.70)" }}>
                  No recent events found for this window/filter.
                </div>
              )}

              {!loading && recent.map((x, idx) => (
                <div key={`${x.date}-${idx}`} style={rowItem}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontWeight: 900 }}>{x.title || "Central bank event"}</div>
                    <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.65)" }}>
                      {fmtDateTime(x.date)} · Impact: <span style={{ fontWeight: 900 }}>{x.impactNorm}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.70)" }}>
                      Actual: {valueOrDash(x.actual)} · Forecast: {valueOrDash(x.forecast)} · Previous: {valueOrDash(x.previous)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, opacity: 0.85 }}>{stars(x.impactNorm)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, color: "rgba(255,255,255,0.55)", fontWeight: 650, fontSize: 12 }}>
          If this fetch fails, confirm backend is reachable at <b>{apiBase()}</b> and CORS allows your frontend port.
        </div>
      </div>
    </div>
  );
}
