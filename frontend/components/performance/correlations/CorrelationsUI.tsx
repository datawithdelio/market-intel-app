"use client";

import React, { useMemo, useState } from "react";

/**
 * Pure frontend mock Correlations UI:
 * - Asset group tabs (FX / Rates / Commodities / Crypto / Equity)
 * - Multi-select assets (chips)
 * - Heatmap correlation matrix (click cell -> details)
 * - Legend & pinned pairs
 * No backend, no data fetching.
 */

type GroupKey = "FX" | "Rates" | "Commodities" | "Crypto" | "Equity";

type Timeframe = "1W" | "1M" | "3M" | "6M" | "1Y";
type Method = "Pearson" | "Spearman";

type PairKey = `${string}__${string}`;

const GROUPS: { key: GroupKey; label: string; assets: string[] }[] = [
  {
    key: "FX",
    label: "FX Majors",
    assets: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD"],
  },
  {
    key: "Rates",
    label: "Rates",
    assets: ["US10Y", "US2Y", "DE10Y", "JP10Y", "SOFR", "DXY"],
  },
  {
    key: "Commodities",
    label: "Commodities",
    assets: ["XAUUSD", "XAGUSD", "WTI", "BRENT", "NATGAS", "COPPER"],
  },
  {
    key: "Crypto",
    label: "Crypto",
    assets: ["BTC", "ETH", "SOL", "BNB", "XRP"],
  },
  {
    key: "Equity",
    label: "Equity",
    assets: ["SPX", "NDX", "RUT", "VIX", "DJI"],
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// deterministic pseudo-random in [-1, 1] based on string + knobs
function mockCorr(a: string, b: string, tf: Timeframe, method: Method): number {
  if (a === b) return 1;

  const seedStr = `${a}|${b}|${tf}|${method}`;
  let h = 2166136261; // FNV-ish
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  // map to [0,1)
  const u = (h >>> 0) / 4294967296;

  // shape a bit by timeframe/method so it "feels" different
  const tfBoost: Record<Timeframe, number> = { "1W": 0.25, "1M": 0.15, "3M": 0.05, "6M": -0.05, "1Y": -0.1 };
  const mBoost = method === "Spearman" ? 0.05 : 0;

  // center around 0 with moderate extremes
  const v = (u - 0.5) * 1.7 + tfBoost[tf] + mBoost;

  // make symmetric: corr(a,b) == corr(b,a)
  // (use ordered key)
  const ordered = [a, b].sort().join("|");
  let hs = 2166136261;
  for (let i = 0; i < ordered.length; i++) {
    hs ^= ordered.charCodeAt(i);
    hs = Math.imul(hs, 16777619);
  }
  const us = (hs >>> 0) / 4294967296;
  const sym = (us - 0.5) * 0.18;

  return clamp(v + sym, -0.98, 0.98);
}

// Convert correlation [-1..1] to a pleasant heatmap background.
// We keep it subtle, and readable on dark UI:
// - Negative => reddish tint
// - Positive => greenish tint
function corrToBg(c: number): string {
  const a = Math.abs(c);
  const alpha = 0.08 + a * 0.22; // 0.08..0.30
  if (c >= 0) return `rgba(34,197,94,${alpha})`; // green-ish
  return `rgba(239,68,68,${alpha})`; // red-ish
}

function corrToText(c: number): string {
  const a = Math.abs(c);
  if (a > 0.75) return "text-white";
  if (a > 0.35) return "text-white/90";
  return "text-white/70";
}

function formatCorr(c: number) {
  if (c === 1) return "1.00";
  const s = c.toFixed(2);
  return s;
}

function pairKey(a: string, b: string): PairKey {
  return `${a}__${b}`;
}

function splitPair(k: PairKey): [string, string] {
  const [a, b] = k.split("__");
  return [a, b];
}

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-sm transition",
        "border border-white/10",
        active ? "bg-white/15 text-white" : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function Card({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 shadow-sm",
        "backdrop-blur-md",
        className,
      ].join(" ")}
    >
      {(title || right) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="text-sm text-white/70">{right}</div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function MiniSparkline({ label }: { label: string }) {
  // simple inline SVG mock
  const points = useMemo(() => {
    const base = label.length * 37;
    const arr = new Array(28).fill(0).map((_, i) => {
      const v = Math.sin((i + 1) * 0.35 + base) * 0.35 + Math.cos((i + 1) * 0.13) * 0.22;
      return v;
    });
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map((v, i) => {
      const x = (i / (arr.length - 1)) * 100;
      const y = 80 - ((v - min) / (max - min || 1)) * 60;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
  }, [label]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-white/70 mb-2">{label}</div>
      <svg viewBox="0 0 100 100" className="h-14 w-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="text-white/80"
          points={points}
        />
        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function CorrelationsUI() {
  const [group, setGroup] = useState<GroupKey>("FX");
  const [timeframe, setTimeframe] = useState<Timeframe>("3M");
  const [method, setMethod] = useState<Method>("Pearson");
  const [selectedAssets, setSelectedAssets] = useState<string[]>(() => GROUPS.find(g => g.key === "FX")!.assets.slice(0, 6));
  const [activeCell, setActiveCell] = useState<PairKey>(() => pairKey("EURUSD", "GBPUSD"));
  const [pinned, setPinned] = useState<PairKey[]>([pairKey("EURUSD", "DXY"), pairKey("XAUUSD", "US10Y")]);

  const assetsInGroup = useMemo(() => GROUPS.find(g => g.key === group)!.assets, [group]);

  // keep selectedAssets valid when switching group
  React.useEffect(() => {
    setSelectedAssets((prev) => {
      const next = prev.filter(a => assetsInGroup.includes(a));
      if (next.length >= 3) return next;
      // default set
      return assetsInGroup.slice(0, Math.min(6, assetsInGroup.length));
    });
    // also reset active cell to a valid pair if needed
  }, [assetsInGroup]);

  const matrixAssets = selectedAssets;

  const activePair = useMemo(() => splitPair(activeCell), [activeCell]);
  const activeCorr = useMemo(() => mockCorr(activePair[0], activePair[1], timeframe, method), [activePair, timeframe, method]);

  function toggleAsset(a: string) {
    setSelectedAssets((prev) => {
      const exists = prev.includes(a);
      if (exists) {
        // enforce minimum 3 so the matrix stays meaningful
        if (prev.length <= 3) return prev;
        const next = prev.filter(x => x !== a);
        // if active cell becomes invalid, set a new one
        if (!next.includes(activePair[0]) || !next.includes(activePair[1])) {
          if (next.length >= 2) setActiveCell(pairKey(next[0], next[1]));
        }
        return next;
      } else {
        const next = [...prev, a];
        return next.slice(0, 10); // cap to keep UI clean
      }
    });
  }

  function pinActive() {
    setPinned((prev) => {
      if (prev.includes(activeCell)) return prev;
      return [activeCell, ...prev].slice(0, 6);
    });
  }

  function removePinned(k: PairKey) {
    setPinned((prev) => prev.filter(x => x !== k));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold text-white">Correlations</div>
          <div className="text-sm text-white/65">
            Explore relationships across markets with a clean heatmap + quick drilldowns (mock UI only).
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-white/10 bg-white/5 p-1">
            {(["1W", "1M", "3M", "6M", "1Y"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={[
                  "rounded-full px-3 py-1 text-sm transition",
                  timeframe === tf ? "bg-white/15 text-white" : "text-white/70 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 p-1">
            {(["Pearson", "Spearman"] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={[
                  "rounded-full px-3 py-1 text-sm transition",
                  method === m ? "bg-white/15 text-white" : "text-white/70 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <Pill
            key={g.key}
            active={group === g.key}
            onClick={() => {
              setGroup(g.key);
              // active cell reset will happen if needed by selection effect
            }}
          >
            {g.label}
          </Pill>
        ))}
      </div>

      {/* Asset selector */}
      <Card
        title="Select Assets"
        right={<span className="text-xs text-white/60">{selectedAssets.length} selected</span>}
      >
        <div className="flex flex-wrap gap-2">
          {assetsInGroup.map((a) => {
            const active = selectedAssets.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAsset(a)}
                className={[
                  "rounded-full px-3 py-1 text-sm transition border",
                  active
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {a}
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-white/55">
          Tip: keep 5–10 assets selected so the heatmap stays readable.
        </div>
      </Card>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Heatmap */}
        <Card
          className="lg:col-span-2"
          title="Correlation Heatmap"
          right={
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Legend</span>
              <div className="flex items-center gap-1">
                <div className="h-3 w-8 rounded-full" style={{ background: "rgba(239,68,68,0.28)" }} />
                <div className="h-3 w-8 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-3 w-8 rounded-full" style={{ background: "rgba(34,197,94,0.28)" }} />
              </div>
              <span className="text-xs text-white/60">-1</span>
              <span className="text-xs text-white/60">0</span>
              <span className="text-xs text-white/60">+1</span>
            </div>
          }
        >
          <div className="overflow-auto">
            <div
              className="min-w-[720px]"
              style={{
                display: "grid",
                gridTemplateColumns: `160px repeat(${matrixAssets.length}, 1fr)`,
                gap: 8,
                alignItems: "center",
              }}
            >
              {/* top-left spacer */}
              <div className="h-10" />

              {/* column headers */}
              {matrixAssets.map((col) => (
                <div
                  key={`col-${col}`}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 flex items-center justify-center text-xs text-white/75"
                >
                  {col}
                </div>
              ))}

              {/* rows */}
              {matrixAssets.map((row) => (
                <React.Fragment key={`row-${row}`}>
                  {/* row header */}
                  <div className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 flex items-center text-xs text-white/75">
                    {row}
                  </div>

                  {/* cells */}
                  {matrixAssets.map((col) => {
                    const c = mockCorr(row, col, timeframe, method);
                    const k = pairKey(row, col);
                    const isActive = activeCell === k;
                    const isDiag = row === col;

                    return (
                      <button
                        key={`${row}-${col}`}
                        type="button"
                        onClick={() => setActiveCell(k)}
                        className={[
                          "h-10 rounded-xl border text-xs font-medium transition",
                          "flex items-center justify-center",
                          isActive ? "border-white/30 ring-2 ring-white/20" : "border-white/10 hover:border-white/20",
                          isDiag ? "cursor-default" : "",
                        ].join(" ")}
                        style={{ background: corrToBg(c) }}
                        disabled={isDiag}
                        title={`${row} vs ${col}: ${formatCorr(c)}`}
                      >
                        <span className={corrToText(c)}>{formatCorr(c)}</span>
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-3 text-xs text-white/55">
            Click any cell to drill down. (This is mock UI — no data yet.)
          </div>
        </Card>

        {/* Details */}
        <div className="space-y-4">
          <Card title="Selected Pair">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-white">
                  {activePair[0]} <span className="text-white/50">vs</span> {activePair[1]}
                </div>
                <div className="mt-1 text-sm text-white/70">
                  {method} correlation over <span className="text-white/85">{timeframe}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={pinActive}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/75 hover:bg-white/10 hover:text-white transition"
              >
                Pin
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">Correlation</div>
                <div className="text-xs text-white/60">Range: -1 to +1</div>
              </div>

              <div className="mt-2 flex items-end justify-between">
                <div className="text-3xl font-semibold text-white">{formatCorr(activeCorr)}</div>
                <div className="text-xs text-white/60">
                  Interpretation:{" "}
                  <span className="text-white/80">
                    {Math.abs(activeCorr) > 0.7
                      ? "Strong"
                      : Math.abs(activeCorr) > 0.35
                        ? "Moderate"
                        : "Weak"}{" "}
                    {activeCorr >= 0 ? "positive" : "negative"}
                  </span>
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${((activeCorr + 1) / 2) * 100}%`,
                    background: activeCorr >= 0 ? "rgba(34,197,94,0.55)" : "rgba(239,68,68,0.55)",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <MiniSparkline label={`${activePair[0]} (mock)`} />
              <MiniSparkline label={`${activePair[1]} (mock)`} />
            </div>
          </Card>

          <Card title="Pinned Pairs" right={<span className="text-xs text-white/60">Quick access</span>}>
            <div className="space-y-2">
              {pinned.length === 0 && <div className="text-sm text-white/60">No pinned pairs yet.</div>}

              {pinned.map((k) => {
                const [a, b] = splitPair(k);
                const c = mockCorr(a, b, timeframe, method);
                const isActive = k === activeCell;

                return (
                  <div
                    key={k}
                    className={[
                      "flex items-center justify-between gap-2 rounded-xl border px-3 py-2",
                      isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCell(k)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm text-white/90">
                        {a} <span className="text-white/50">vs</span> {b}
                      </div>
                      <div className="text-xs text-white/60">{formatCorr(c)} ({timeframe})</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => removePinned(k)}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white transition"
                      aria-label="Remove pin"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
