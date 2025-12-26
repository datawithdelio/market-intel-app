"use client";

import React, { useEffect, useMemo, useState } from "react";

type CalendarItem = {
  date: string | null;      // e.g. "2025-12-26 08:30:00" or ISO-ish
  event: string | null;
  country: string | null;   // "US"
  impact: string | null;    // "High" | "Medium" | "Low" (varies by provider)
  actual: string | number | null;
  forecast: string | number | null;
  previous: string | number | null;
};

type CalendarPayload = {
  meta: {
    economy: string;
    from: string;
    to: string;
    source: string;
    fetchedAt: string;
  };
  items: CalendarItem[];
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
  // Optional: set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 in frontend/.env.local
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

function toDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

function normalizeImpact(x: string | null) {
  if (!x) return "Low";
  const v = x.toLowerCase();
  if (v.includes("high")) return "High";
  if (v.includes("med")) return "Medium";
  if (v.includes("low")) return "Low";
  // sometimes providers use numeric/other labels
  return "Low";
}

function stars(impact: string) {
  if (impact === "High") return "★★★";
  if (impact === "Medium") return "★★";
  return "★";
}

function formatTime(dateStr: string | null) {
  if (!dateStr) return "";
  // handles "YYYY-MM-DD HH:mm:ss" or ISO
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDay(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function valueOrDash(v: any) {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

export default function Page() {
  const [economy, setEconomy] = useState<"US">("US");
  const [impactFilter, setImpactFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [days, setDays] = useState<number>(7);

  const [data, setData] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const url = `${apiBase()}/api/economy/calendar?economy=${economy}&days=${days}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || `Calendar fetch failed: ${res.status}`);
      setData(json);
    } catch (e: any) {
      setErr(e?.message || "Failed to load calendar");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [economy, days]);

  const items = useMemo(() => {
    const raw = data?.items || [];
    const mapped = raw.map((x) => ({
      ...x,
      impactNorm: normalizeImpact(x.impact),
    }));

    const filtered =
      impactFilter === "All"
        ? mapped
        : mapped.filter((x) => x.impactNorm === impactFilter);

    // Sort by datetime ascending
    filtered.sort((a, b) => {
      const da = new Date((a.date || "").replace(" ", "T")).getTime();
      const db = new Date((b.date || "").replace(" ", "T")).getTime();
      return (Number.isFinite(da) ? da : 0) - (Number.isFinite(db) ? db : 0);
    });

    return filtered;
  }, [data, impactFilter]);

  const todayStats = useMemo(() => {
    const today = toDateOnly(new Date());

    const todayItems = (data?.items || []).map((x) => ({
      ...x,
      impactNorm: normalizeImpact(x.impact),
      day: (x.date ? x.date.slice(0, 10) : ""),
    })).filter((x) => x.day === today);

    const high = todayItems.filter((x) => x.impactNorm === "High").length;
    const medium = todayItems.filter((x) => x.impactNorm === "Medium").length;
    const low = todayItems.filter((x) => x.impactNorm === "Low").length;

    const total = high + medium + low || 1;
    const highPct = Math.round((high / total) * 100);
    const mediumPct = Math.round((medium / total) * 100);
    const lowPct = Math.max(0, 100 - highPct - mediumPct);

    // “Confidence” proxy: more High-impact events today => higher
    const confidence = Math.min(85, Math.max(35, 35 + high * 12 + medium * 6));

    return {
      todayItems,
      highPct,
      mediumPct,
      lowPct,
      confidence,
    };
  }, [data]);

  const topImpact = useMemo(() => {
    const raw = (data?.items || []).map((x) => ({ ...x, impactNorm: normalizeImpact(x.impact) }));
    const sorted = raw
      .slice()
      .sort((a, b) => {
        const w = (z: any) => (z.impactNorm === "High" ? 3 : z.impactNorm === "Medium" ? 2 : 1);
        return w(b) - w(a);
      })
      .slice(0, 8);

    return sorted;
  }, [data]);

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
            <h1 style={{ fontSize: 48, margin: "0 0 6px", letterSpacing: -0.5 }}>Economic Calendar</h1>
            <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
              Track high-impact macro events across major economies.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button style={pill} onClick={load} disabled={loading}>
                ↻ {loading ? "Loading..." : "Refresh"}
              </button>
              <button style={pill}>👥 Competitors</button>
              <button style={pill}>⤴ Share</button>
            </div>

            {err && (
              <div style={{ marginTop: 10, color: "rgba(255,120,120,0.95)", fontWeight: 800 }}>
                {err}
              </div>
            )}
            {!err && data?.meta?.fetchedAt && (
              <div style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 12 }}>
                Source: {data.meta.source} · Updated: {new Date(data.meta.fetchedAt).toLocaleString()}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Economy dropdown (US only for now) */}
            <button style={pill} title="US only for now">
              🌐 {economy} ▾
            </button>

            {/* Impact filter */}
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value as any)}
              style={{
                ...pill,
                appearance: "none",
                cursor: "pointer",
              }}
            >
              <option value="All">⚡ All Impact</option>
              <option value="High">⚡ High</option>
              <option value="Medium">⚡ Medium</option>
              <option value="Low">⚡ Low</option>
            </select>

            {/* Days */}
            <select
              value={String(days)}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ ...pill, appearance: "none", cursor: "pointer" }}
              title="How many days ahead"
            >
              <option value="3">Next 3 days</option>
              <option value="7">Next 7 days</option>
              <option value="14">Next 14 days</option>
              <option value="30">Next 30 days</option>
            </select>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 18 }}>
          {/* LEFT */}
          <div style={{ ...glass, padding: 16, minHeight: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontWeight: 900 }}>Economic Events</div>
              <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 800 }}>Live</div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {loading && (
                <div style={{ ...rowItem, justifyContent: "flex-start", color: "rgba(255,255,255,0.70)" }}>
                  Loading events…
                </div>
              )}

              {!loading && items.length === 0 && (
                <div style={{ ...rowItem, justifyContent: "flex-start", color: "rgba(255,255,255,0.70)" }}>
                  No events found for this window/filter.
                </div>
              )}

              {!loading &&
                items.map((x, idx) => (
                  <div key={`${x.date}-${x.event}-${idx}`} style={rowItem}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontWeight: 900 }}>
                        {x.event || "Untitled event"}{" "}
                        <span style={{ opacity: 0.7, fontWeight: 800, fontSize: 12 }}>
                          ({x.country || economy})
                        </span>
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.65)" }}>
                        {formatDay(x.date)} · {formatTime(x.date)} · Impact:{" "}
                        <span style={{ fontWeight: 900 }}>{normalizeImpact(x.impact)}</span>
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.70)" }}>
                        Actual: {valueOrDash(x.actual)} · Forecast: {valueOrDash(x.forecast)} · Previous:{" "}
                        {valueOrDash(x.previous)}
                      </div>
                    </div>

                    <div style={{ fontWeight: 900, opacity: 0.85 }}>{stars(normalizeImpact(x.impact))}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: "grid", gap: 16 }}>
            {/* Major Impacts Today */}
            <div style={{ ...glass, padding: 16, minHeight: 220 }}>
              <div style={{ fontWeight: 900, marginBottom: 12 }}>Major Impacts Today</div>

              <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                <div style={{ fontSize: 32, fontWeight: 1000 }}>{todayStats.confidence}%</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>High impact</div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {[
                  ["High", `${todayStats.highPct}%`],
                  ["Medium", `${todayStats.mediumPct}%`],
                  ["Low", `${todayStats.lowPct}%`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                    <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.70)" }}>{k}</span>
                    <span style={{ fontWeight: 900 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", fontWeight: 650, lineHeight: 1.4 }}>
                {todayStats.todayItems.length
                  ? `You have ${todayStats.todayItems.length} scheduled release(s) today.`
                  : "No releases scheduled for today in this window."}
              </div>

              {/* Today list (top 3) */}
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {todayStats.todayItems.slice(0, 3).map((x, i) => (
                  <div key={`today-${i}`} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 900 }}>{x.event || "Untitled event"}</div>
                      <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.60)", marginTop: 2 }}>
                        {x.country || economy} · {formatTime(x.date)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, opacity: 0.85 }}>{stars(x.impactNorm)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Impactful Releases */}
            <div style={{ ...glass, padding: 16, minHeight: 240 }}>
              <div style={{ fontWeight: 900, marginBottom: 12 }}>Top Impactful Releases</div>

              <div style={{ display: "grid", gap: 12 }}>
                {topImpact.slice(0, 6).map((x, i) => (
                  <div
                    key={`top-${i}`}
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
                      <div style={{ fontWeight: 900 }}>{x.event || "Untitled event"}</div>
                      <div style={{ fontSize: 12, fontWeight: 750, color: "rgba(255,255,255,0.60)", marginTop: 2 }}>
                        {x.country || economy} · {formatDay(x.date)} · {formatTime(x.date)}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div style={{ fontWeight: 900, opacity: 0.85 }}>{stars(x.impactNorm)}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.65)" }}>
                        {x.impactNorm}
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && topImpact.length === 0 && (
                  <div style={{ color: "rgba(255,255,255,0.70)", fontWeight: 700 }}>
                    No releases found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Small note */}
        <div style={{ marginTop: 14, color: "rgba(255,255,255,0.55)", fontWeight: 650, fontSize: 12 }}>
          Tip: If this fetch fails, confirm backend is reachable at <b>{apiBase()}</b> and your CORS allows your frontend port.
        </div>
      </div>
    </div>
  );
}
