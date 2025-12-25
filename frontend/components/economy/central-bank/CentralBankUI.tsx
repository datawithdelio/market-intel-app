"use client";

import React, { useEffect, useMemo, useState } from "react";

type CentralBankData = {
  policyRate: number;
  stance: string;
  asOfDate: string;
  fetchedAt: string;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function CentralBankUI() {
  const [data, setData] = useState<CentralBankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== API FETCH (keep this) =====
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BACKEND_URL}/api/economy/central-bank`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);

        const json = (await res.json()) as CentralBankData;
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load central bank data");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // ===== Derived UI values =====
  const ui = useMemo(() => {
    const rate = Number.isFinite(data?.policyRate) ? data!.policyRate : NaN;
    // Map stance to a "hawk-dove" score 0..100 for the gauge
    // (simple heuristic – you can improve later)
    let score = 50;
    if (data?.stance?.toLowerCase().includes("hawk")) score = 70;
    if (data?.stance?.toLowerCase().includes("dove")) score = 30;
    score = clamp(score, 0, 100);

    return {
      rate,
      score,
      stance: data?.stance ?? "—",
      asOfDate: data?.asOfDate ?? "—",
      fetchedAt: data?.fetchedAt ?? "—",
    };
  }, [data]);

  // ===== UI states =====
  if (loading) {
    return (
      <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
        Loading Central Bank data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
        <div className="font-bold">Could not load Central Bank data</div>
        <div className="opacity-80 mt-2">{error}</div>
        <div className="opacity-60 mt-2 text-sm">
          Backend expected at: <span className="opacity-90">{BACKEND_URL}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // ===== Restored "dashboard-style" layout (with buttons) =====
  return (
    <div className="space-y-5">
      {/* Top strip card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🇺🇸</div>
            <div>
              <div className="text-sm opacity-70 font-semibold">
                Federal Reserve <span className="opacity-50">(Fed)</span>
              </div>

              <div className="mt-1 flex items-end gap-2">
                <div className="text-4xl font-black">
                  {Number.isFinite(ui.rate) ? `${ui.rate.toFixed(2)}%` : "N/A"}
                </div>
                <div className="text-sm opacity-70 pb-1">Policy Rate</div>
              </div>

              <div className="mt-1 text-sm opacity-70">
                As of: <span className="opacity-90">{ui.asOfDate}</span> • Fetched:{" "}
                <span className="opacity-90">{ui.fetchedAt}</span>
              </div>
            </div>
          </div>

          {/* Gauge-ish stance */}
          <div className="w-full md:w-[380px]">
            <div className="text-sm font-semibold opacity-80">
              Policy Stance Score
              <div className="text-xs opacity-60">Hawk–Dove scale</div>
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold opacity-90">Hawkish</div>
                <div className="text-sm font-extrabold opacity-90">Dovish</div>
              </div>

              <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-white/40"
                  style={{ width: `${ui.score}%` }}
                />
              </div>

              <div className="mt-2 text-sm font-extrabold">
                {ui.stance}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid like your screenshot */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* AI Insight */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:col-span-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold opacity-90">
              AI-Generated Policy Insight
            </div>
            <div className="text-xs opacity-60">1</div>
          </div>

          <div className="mt-3 text-sm opacity-80 leading-relaxed">
            Current stance appears{" "}
            <span className="font-bold opacity-95">{ui.stance}</span>. Policy rate is{" "}
            <span className="font-bold opacity-95">
              {Number.isFinite(ui.rate) ? `${ui.rate.toFixed(2)}%` : "N/A"}
            </span>{" "}
            (as of {ui.asOfDate}).
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 rounded-2xl border border-white/15 bg-white/10 font-bold text-sm hover:bg-white/15 transition">
              View Details
            </button>
            <button className="px-4 py-2 rounded-2xl border border-white/15 bg-transparent font-bold text-sm hover:bg-white/10 transition">
              Refresh
            </button>
          </div>
        </div>

        {/* Mandate */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-extrabold opacity-90">Central Bank Mandate</div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs opacity-70">Inflation</div>
              <div className="mt-1 font-black">2%</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs opacity-70">Employment</div>
              <div className="mt-1 font-black">Max</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs opacity-70">Stability</div>
              <div className="mt-1 font-black">✓</div>
            </div>
          </div>

          <div className="mt-4">
            <button className="px-4 py-2 rounded-2xl border border-white/15 bg-white/10 font-bold text-sm hover:bg-white/15 transition">
              View Details
            </button>
          </div>
        </div>

        {/* Rate history (placeholder chart area) */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-extrabold opacity-90">Interest Rate History</div>
          <div className="mt-3 h-28 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-sm opacity-70">
            Chart placeholder (we’ll wire real series later)
          </div>
          <div className="mt-3 text-xs opacity-60">
            Currently showing latest:{" "}
            <span className="opacity-90 font-bold">
              {Number.isFinite(ui.rate) ? `${ui.rate.toFixed(2)}%` : "N/A"}
            </span>
          </div>
        </div>

        {/* Forecasts */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold opacity-90">Rate Forecasts</div>
            <div className="text-xs opacity-60">3</div>
          </div>

          <div className="mt-3 h-28 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-sm opacity-70">
            Forecast chart placeholder
          </div>

          <div className="mt-4">
            <button className="px-4 py-2 rounded-2xl border border-white/15 bg-white/10 font-bold text-sm hover:bg-white/15 transition">
              View Details
            </button>
          </div>
        </div>

        {/* Recent decisions */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:col-span-1">
          <div className="text-sm font-extrabold opacity-90">Recent Decisions</div>

          <div className="mt-3 space-y-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
              <div className="text-sm font-bold">Hold</div>
              <div className="text-sm font-black">
                {Number.isFinite(ui.rate) ? `${ui.rate.toFixed(2)}%` : "N/A"}
              </div>
              <div className="text-xs opacity-60">{ui.asOfDate}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
              <div className="text-sm font-bold">Bias</div>
              <div className="text-sm font-black">{ui.stance}</div>
              <div className="text-xs opacity-60">latest</div>
            </div>
          </div>

          <div className="mt-4">
            <button className="px-4 py-2 rounded-2xl border border-white/15 bg-white/10 font-bold text-sm hover:bg-white/15 transition">
              View Details
            </button>
          </div>
        </div>

        {/* News & speeches */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:col-span-1">
          <div className="text-sm font-extrabold opacity-90">
            Central Bank News & Speeches
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs opacity-70">CNBC</div>
              <div className="text-sm font-bold mt-1">
                Powell: policy remains data-dependent
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs opacity-70">Bloomberg</div>
              <div className="text-sm font-bold mt-1">
                Markets price fewer cuts next quarter
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button className="px-4 py-2 rounded-2xl border border-white/15 bg-white/10 font-bold text-sm hover:bg-white/15 transition">
              View All News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
