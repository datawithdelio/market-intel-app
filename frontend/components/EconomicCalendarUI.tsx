"use client";

import { useMemo, useState } from "react";

type Impact = "Low" | "Medium" | "High";

type CalendarEvent = {
  id: string;
  date: string;
  time: string;
  country: string; // US, EU, etc
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  impact: Impact;
};

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    date: "Mon, 6",
    time: "7:00 EST",
    country: "EU",
    event: "Eurozone Retail Sales YoY",
    actual: "0.9%",
    forecast: "0.3%",
    previous: "0.9%",
    impact: "High",
  },
  {
    id: "2",
    date: "Mon, 7",
    time: "7:30 EST",
    country: "CN",
    event: "China Trade Balance",
    actual: "0.3%",
    forecast: "2.0%",
    previous: "5.0%",
    impact: "Medium",
  },
  {
    id: "3",
    date: "Mon, 8",
    time: "5:30 EST",
    country: "DE",
    event: "Germany Industrial Production MoM",
    actual: "-3.3%",
    forecast: "1.3%",
    previous: "2.8%",
    impact: "High",
  },
  {
    id: "4",
    date: "Wed, 8",
    time: "6:00 AM",
    country: "US",
    event: "US ISM Services PMI",
    actual: "0.3%",
    forecast: "-0.8%",
    previous: "3.1%",
    impact: "High",
  },
];

function impactStars(impact: Impact) {
  if (impact === "High") return "★★★";
  if (impact === "Medium") return "★★";
  return "★";
}

function impactBadgeClass(impact: Impact) {
  // no explicit colors; just opacity + border so it stays clean
  if (impact === "High") return "border-white/25 text-white";
  if (impact === "Medium") return "border-white/20 text-white/90";
  return "border-white/15 text-white/80";
}

function GlassCard({
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
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-sm",
        className,
      ].join(" ")}
    >
      {(title || right) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="text-base font-semibold text-white/95">{title}</div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function SoftButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition">
      {children}
    </button>
  );
}

export default function EconomicCalendarUI() {
  const [country, setCountry] = useState<string>("ALL");
  const [impact, setImpact] = useState<Impact | "ALL">("ALL");

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const okCountry = country === "ALL" ? true : e.country === country;
      const okImpact = impact === "ALL" ? true : e.impact === impact;
      return okCountry && okImpact;
    });
  }, [country, impact]);

  const majorToday = filtered.filter((e) => e.impact === "High").slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Economic Calendar
          </h1>
          <p className="mt-1 text-sm text-white/60 max-w-xl">
            Track high-impact macro events across major economies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
            <span className="text-sm text-white/70">🌐</span>
            <select
              className="bg-transparent text-sm text-white/90 outline-none"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="ALL">All Countries</option>
              <option value="US">United States</option>
              <option value="EU">Eurozone</option>
              <option value="GB">United Kingdom</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              <option value="DE">Germany</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
            <span className="text-sm text-white/70">⚡</span>
            <select
              className="bg-transparent text-sm text-white/90 outline-none"
              value={impact}
              onChange={(e) => setImpact(e.target.value as any)}
            >
              <option value="ALL">All Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action row like your mock */}
      <div className="flex flex-wrap gap-2">
        <SoftButton>↻ Refresh</SoftButton>
        <SoftButton>◎ Competitors</SoftButton>
        <SoftButton>⤴ Share</SoftButton>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: table */}
        <div className="col-span-12 xl:col-span-8">
          <GlassCard
            title="Economic Events"
            right={<span className="text-xs text-white/50">Preview</span>}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/55">
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Time</th>
                    <th className="py-3 pr-4 font-medium">Event</th>
                    <th className="py-3 pr-4 font-medium">Actual</th>
                    <th className="py-3 pr-4 font-medium">Forecast</th>
                    <th className="py-3 pr-4 font-medium">Previous</th>
                    <th className="py-3 pr-0 font-medium">Impact</th>
                  </tr>
                </thead>

                <tbody className="text-white/90">
                  {filtered.map((e) => (
                    <tr key={e.id} className="border-t border-white/10">
                      <td className="py-4 pr-4 whitespace-nowrap text-white/80">
                        {e.date}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap text-white/80">
                        {e.time}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-medium text-white/95">
                          {e.event}
                        </div>
                        <div className="mt-1 text-xs text-white/50">
                          {e.country}
                        </div>
                      </td>
                      <td className="py-4 pr-4">{e.actual ?? "—"}</td>
                      <td className="py-4 pr-4 text-white/80">
                        {e.forecast ?? "—"}
                      </td>
                      <td className="py-4 pr-4 text-white/80">
                        {e.previous ?? "—"}
                      </td>
                      <td className="py-4 pr-0">
                        <span
                          className={[
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                            impactBadgeClass(e.impact),
                          ].join(" ")}
                        >
                          <span className="opacity-80">
                            {impactStars(e.impact)}
                          </span>
                          <span className="text-white/70">{e.impact}</span>
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr className="border-t border-white/10">
                      <td className="py-10 text-white/60" colSpan={7}>
                        No events match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right: cards */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <GlassCard title="Major Impacts Today">
            {/* Donut placeholder (clean aesthetic without hard colors) */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-28 h-28 rounded-full border border-white/15 bg-white/5 grid place-items-center text-xl font-semibold text-white/90">
                42%
              </div>
              <div className="space-y-1 text-sm text-white/70">
                <div>High impact share</div>
                <div className="text-xs text-white/45">
                  (Replace with real chart later)
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {majorToday.map((e) => (
                <div key={e.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      {e.event}
                    </div>
                    <div className="text-xs text-white/50">
                      {e.country} • {e.time}
                    </div>
                  </div>
                  <div className="text-xs text-white/60">
                    {impactStars(e.impact)}
                  </div>
                </div>
              ))}
              {majorToday.length === 0 && (
                <div className="text-sm text-white/60">No high-impact items.</div>
              )}
            </div>
          </GlassCard>

          <GlassCard title="Top Impactful Releases">
            <div className="space-y-3">
              {majorToday.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white/90">
                      {e.event}
                    </div>
                    <div className="text-xs text-white/60">
                      {impactStars(e.impact)}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {e.country} • {e.time}
                  </div>
                </div>
              ))}
              {majorToday.length === 0 && (
                <div className="text-sm text-white/60">—</div>
              )}
            </div>
          </GlassCard>

          <GlassCard title="Week Ahead">
            <div className="text-sm text-white/70">
              This section can be fed by the same events list (grouped by day) once
              you plug real calendar data.
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {filtered.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center justify-between text-white/80">
                  <span className="truncate">{e.date} — {e.event}</span>
                  <span className="text-white/50 whitespace-nowrap">{e.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom: Upcoming chart placeholder */}
      <GlassCard title="Upcoming Impactful Releases">
        <div className="text-sm text-white/60">
          Chart placeholder (we can build a real bar chart once you decide the data source).
        </div>

        <div className="mt-5 grid grid-cols-6 gap-3 items-end">
          {[62, 80, 55, 45, 30, 50].map((h, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-xl border border-white/10 bg-white/5"
                style={{ height: `${h}px` }}
              />
              <div className="text-[11px] text-white/45">
                {["Fed", "Core", "Jobs", "Retail", "PMI", "GDP"][idx]}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
