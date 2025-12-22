"use client";
import GlassCard from "@/components/GlassCard";
import React, { useMemo, useState } from "react";

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

function impactPillClass(impact: Impact) {
  // stronger visual separation than plain border-only
  if (impact === "High") return "bg-white/12 border-white/20 text-white/95";
  if (impact === "Medium") return "bg-white/9 border-white/18 text-white/90";
  return "bg-white/7 border-white/14 text-white/80";
}

function valuePillClass(value?: string) {
  if (!value) return "bg-white/6 border-white/10 text-white/70";
  // simple rule: negative => down, otherwise up
  const isNeg = value.trim().startsWith("-");
  return isNeg ? "arrow-down" : "arrow-up";
}

function Card({
  title,
  right,
  strong = false,
  children,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  strong?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={[strong ? "ui-card-strong" : "ui-card", className].join(" ")}>
      {(title || right) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="text-white/95 font-semibold">{title}</div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function IconButton({ children }: { children: React.ReactNode }) {
  return <button className="ui-btn">{children}</button>;
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
      {/* Header (News-like typography) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="page-title text-6xl text-white">Economic Calendar</h1>
          <p className="page-subtitle mt-2 max-w-xl">
            Track high-impact macro events across major economies.
          </p>
        </div>

        {/* Filters (use ui-tab style) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="ui-tab ui-tab-active">
            🌐
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

          <div className="ui-tab">
            ⚡
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

      {/* Action row */}
      <div className="flex flex-wrap gap-2">
        <IconButton>↻ Refresh</IconButton>
        <IconButton>◎ Competitors</IconButton>
        <IconButton>⤴ Share</IconButton>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: table */}
        <div className="col-span-12 xl:col-span-8">
          <Card
            title="Economic Events"
            right={<span className="text-xs text-white/55">Preview</span>}
            strong
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              
            </div>
          </Card>
        </div>

        {/* Right: cards */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <Card title="Major Impacts Today" strong>
            <div className="flex items-center justify-between gap-4">
              <div className="ui-card-strong w-28 h-28 grid place-items-center">
                <div className="text-2xl font-semibold text-white/95">42%</div>
                <div className="text-xs text-white/70 -mt-1">High impact</div>
              </div>

              <div className="space-y-2 text-sm text-white/75">
                <div className="flex items-center gap-2">
                  <span className="ui-chip">High</span>
                  <span className="text-white/85">42%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="ui-chip">Medium</span>
                  <span className="text-white/85">25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="ui-chip">Low</span>
                  <span className="text-white/85">33%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-white/70">
              Reflation typically favors cyclical assets as growth recovers while inflation stabilizes.
            </div>

            <div className="mt-5 space-y-3">
              {majorToday.map((e) => (
                <div key={e.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white/90">{e.event}</div>
                    <div className="text-xs text-white/55">
                      {e.country} • {e.time}
                    </div>
                  </div>
                  <div className="text-xs text-white/70">{impactStars(e.impact)}</div>
                </div>
              ))}
              {majorToday.length === 0 && (
                <div className="text-sm text-white/65">No high-impact items.</div>
              )}
            </div>
          </Card>

          <Card title="Top Impactful Releases">
            <div className="space-y-3">
              {majorToday.slice(0, 3).map((e) => (
                <div key={e.id} className="ui-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white/90">{e.event}</div>
                    <div className="text-xs text-white/70">{impactStars(e.impact)}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="ui-chip">{e.country}</span>
                    <span className="ui-chip">{e.time}</span>
                  </div>
                </div>
              ))}
              {majorToday.length === 0 && <div className="text-sm text-white/65">—</div>}
            </div>
          </Card>

          <Card title="Week Ahead">
            <div className="text-sm text-white/75">
              This can be fed by the same events list (grouped by day) once you plug real calendar data.
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {filtered.slice(0, 4).map((e) => (
                <div key={e.id} className="ui-card p-4 flex items-center justify-between">
                  <span className="text-white/85 truncate">
                    {e.date} — {e.event}
                  </span>
                  <span className="text-white/60 whitespace-nowrap">{e.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: Upcoming chart placeholder */}
      <Card title="Upcoming Impactful Releases" className="overflow-hidden">
        <div className="text-sm text-white/70">
          Chart placeholder (we can build a real bar chart once you decide the data source).
        </div>

        <div className="mt-5 grid grid-cols-6 gap-3 items-end">
          {[62, 80, 55, 45, 30, 50].map((h, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className="ui-card-strong w-full"
                style={{ height: `${h}px`, borderRadius: 14 }}
              />
              <div className="text-[11px] text-white/55">
                {["Fed", "Core", "Jobs", "Retail", "PMI", "GDP"][idx]}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-white/70">
          Practical takeaway: Risk-on bias; defensive positioning tends to underperform.
        </div>
      </Card>
    </div>
  );
}
