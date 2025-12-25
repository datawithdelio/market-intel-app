"use client";

import React, { useEffect, useState } from "react";

type CentralBankData = {
  policyRate: number;
  stance: string;
  asOfDate: string;
  fetchedAt: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function CentralBankUI() {
  const [data, setData] = useState<CentralBankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // ✅ Simple UI (you can plug into your fancy cards)
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
          Make sure backend is running on {BACKEND_URL}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
        <div className="opacity-70 text-sm">Policy Rate</div>
        <div className="text-4xl font-black mt-2">
          {Number.isFinite(data.policyRate) ? `${data.policyRate.toFixed(2)}%` : "N/A"}
        </div>
        <div className="opacity-70 text-sm mt-2">As of: {data.asOfDate}</div>
      </div>

      <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
        <div className="opacity-70 text-sm">Stance</div>
        <div className="text-2xl font-extrabold mt-2">{data.stance}</div>
        <div className="opacity-70 text-sm mt-2">Fetched: {data.fetchedAt}</div>
      </div>

      <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
        <div className="opacity-70 text-sm">API</div>
        <div className="font-bold mt-2">FRED (St. Louis Fed)</div>
        <div className="opacity-70 text-sm mt-2">
          Endpoint: <span className="opacity-90">/api/economy/central-bank</span>
        </div>
      </div>
    </div>
  );
}
