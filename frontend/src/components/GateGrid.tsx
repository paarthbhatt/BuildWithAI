"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, DoorOpen, Users } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import TiltSurface from "@/components/TiltSurface";
import {
  applyLiveStatuses,
  calculateGateSummary,
  gateFallbackData,
  GateOverview,
} from "@/lib/mockData";

function getStatusTheme(status: GateOverview["status"]) {
  if (status === "High") {
    return {
      card: "from-rose-500/25 via-rose-500/15 to-rose-900/15 border-rose-500/45 text-rose-100",
      chip: "bg-rose-500/20 text-rose-200 border-rose-400/40",
      bar: "bg-rose-300",
      glow: "shadow-[0_22px_50px_-26px_rgba(251,113,133,0.6)]",
    };
  }
  if (status === "Medium") {
    return {
      card: "from-amber-500/20 via-amber-500/10 to-amber-900/15 border-amber-500/35 text-amber-100",
      chip: "bg-amber-500/20 text-amber-200 border-amber-300/40",
      bar: "bg-amber-300",
      glow: "shadow-[0_20px_42px_-26px_rgba(251,191,36,0.55)]",
    };
  }
  return {
    card: "from-emerald-500/20 via-emerald-500/10 to-emerald-900/15 border-emerald-500/35 text-emerald-100",
    chip: "bg-emerald-500/20 text-emerald-200 border-emerald-300/40",
    bar: "bg-emerald-300",
    glow: "shadow-[0_20px_42px_-26px_rgba(52,211,153,0.55)]",
  };
}

function getTrendTone(trend: GateOverview["trend"]) {
  if (trend === "Rising") return "text-rose-300";
  if (trend === "Dropping") return "text-emerald-300";
  return "text-cyan-200";
}

export default function GateGrid() {
  const [gateData, setGateData] = useState<GateOverview[]>(gateFallbackData);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchGates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gates`);
        if (!response.ok) {
          throw new Error("Gate service unavailable");
        }
        const statuses = (await response.json()) as Record<string, string>;

        if (isActive) {
          setGateData((current) => applyLiveStatuses(current, statuses));
          setIsFallback(false);
        }
      } catch {
        if (isActive) {
          setGateData((current) => [...current]);
          setIsFallback(true);
        }
      }
    };

    void fetchGates();
    const interval = setInterval(() => {
      void fetchGates();
    }, 5000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  const summary = useMemo(() => calculateGateSummary(gateData), [gateData]);

  const metrics = [
    { label: "Total Gates", value: summary.total, icon: DoorOpen, tone: "text-cyan-300" },
    { label: "Critical Gates", value: summary.critical, icon: AlertTriangle, tone: "text-rose-300" },
    { label: "Moderate/Busy Gates", value: summary.moderate, icon: Activity, tone: "text-amber-300" },
    { label: "Clear Gates", value: summary.clear, icon: CheckCircle2, tone: "text-emerald-300" },
  ];

  return (
    <section className="glass-panel panel-edge p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
            <DoorOpen className="h-6 w-6 text-cyan-300" /> Gate operations overview
          </h2>
          <p className="mt-1 text-sm text-slate-300">Live overview for every gate with operational grading and queue load.</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${
            isFallback ? "border-amber-400/40 bg-amber-500/15 text-amber-200" : "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
          }`}
        >
          {isFallback ? "Fallback telemetry" : "Live telemetry"}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <metric.icon className={`mb-2 h-5 w-5 ${metric.tone}`} />
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{metric.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${metric.tone}`}>{metric.value}</p>
          </article>
        ))}
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="relative h-44">
          <Image src="/stadium_gates.png" alt="Stadium gates visual overview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061324]/95 via-[#061324]/75 to-[#061324]/35" />
          <div className="absolute inset-0 flex items-end p-5">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Matchday flow</p>
              <p className="mt-1 text-sm text-slate-100">
                Total queue load: <span className="font-semibold text-cyan-200">{summary.totalQueue}</span> supporters across all entry points.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {gateData.map((gate, index) => {
          const theme = getStatusTheme(gate.status);
          return (
            <TiltSurface key={gate.gate}>
              <motion.article
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 ${theme.card} ${theme.glow}`}
              >
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm uppercase tracking-[0.17em] text-slate-200/85">{gate.gate}</p>
                    <span className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${theme.chip}`}>
                      {gate.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-100/80">{gate.zone}</p>
                  <p className="mt-3 text-sm text-slate-100">{gate.advisory}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-100/90">
                    <span className="rounded-lg bg-black/20 px-2 py-1">Queue: {gate.queueSize}</span>
                    <span className="rounded-lg bg-black/20 px-2 py-1">{gate.throughputPerMin}/min</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-black/25">
                    <div
                      className={`h-full rounded-full ${theme.bar}`}
                      style={{ width: `${Math.min(100, Math.round((gate.queueSize / 90) * 100))}%` }}
                    />
                  </div>
                  <p className={`mt-2 text-[11px] uppercase tracking-[0.14em] ${getTrendTone(gate.trend)}`}>
                    {gate.trend} • Updated {gate.updatedAt}
                  </p>
                </div>
              </motion.article>
            </TiltSurface>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="border-b border-white/10 bg-slate-900/65 px-4 py-3">
          <p className="text-sm font-medium text-slate-100">Live gate-by-gate desk view</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-slate-900/50">
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-400">
                <th className="px-4 py-3">Gate</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Queue</th>
                <th className="px-4 py-3">Flow</th>
                <th className="px-4 py-3">Trend</th>
                <th className="px-4 py-3">Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {gateData.map((gate) => (
                <tr key={`${gate.gate}-row`} className="bg-slate-900/30 text-slate-200">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{gate.gate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md border px-2 py-1 text-xs ${
                        gate.status === "High"
                          ? "border-rose-400/45 bg-rose-500/15 text-rose-200"
                          : gate.status === "Medium"
                            ? "border-amber-400/45 bg-amber-500/15 text-amber-200"
                            : "border-emerald-400/45 bg-emerald-500/15 text-emerald-200"
                      }`}
                    >
                      {gate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" /> {gate.queueSize}
                    </span>
                  </td>
                  <td className="px-4 py-3">{gate.throughputPerMin}/min</td>
                  <td className={`px-4 py-3 ${getTrendTone(gate.trend)}`}>{gate.trend}</td>
                  <td className="px-4 py-3 text-slate-300">{gate.zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
