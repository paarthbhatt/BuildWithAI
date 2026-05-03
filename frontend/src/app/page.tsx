import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, CircleGauge, MessageSquare, Radar, Activity, Users, Zap } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import TiltSurface from "@/components/TiltSurface";

const quickLinks = [
  { href: "/overview", label: "Command Overview", icon: Radar, description: "Stadium-wide situational view.", colSpan: "md:col-span-2" },
  { href: "/operations", label: "Gate Control", icon: CircleGauge, description: "Queue pressure in real time.", colSpan: "md:col-span-1" },
  { href: "/insights", label: "AI Vision", icon: Camera, description: "Crowd density advisories.", colSpan: "md:col-span-1" },
  { href: "/community", label: "Fan Pulse", icon: MessageSquare, description: "Live operational chatter.", colSpan: "md:col-span-2" },
];

const liveMetrics = [
  { label: "Gate pressure", value: "73.2", unit: "%", trend: "+2.4" },
  { label: "Queue depth", value: "4.7", unit: "min", trend: "-0.8" },
  { label: "Density zones", value: "6", unit: "/ 12", trend: "active" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-14 pt-6 md:px-8">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[72vh] overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#071223]/60 md:min-h-[80vh]">
        {/* Background layers */}
        <Image src="/cricket-stadium-big.png" alt="" fill sizes="100vw" className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_15%_15%,rgba(34,211,238,0.18),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061121]/95 via-[#061121]/75 to-[#061121]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent" />

        <div className="relative z-10 grid gap-6 px-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-16 lg:px-14">
          {/* Left content */}
          <div className="flex flex-col justify-center">
            <ScrollReveal>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-cyan-200 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </span>
                Live stadium intelligence
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h1 className="mt-5 max-w-[18ch] text-4xl font-semibold leading-[1.02] tracking-tighter text-white md:text-6xl lg:text-7xl">
                See crowd pressure{" "}
                <span className="gradient-text">before it breaks.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="mt-6 max-w-lg text-pretty text-[15px] leading-relaxed text-slate-400 md:text-base lg:text-lg">
                Matchday control surface with 3D telemetry, AI visual advisories, and real-time crowd conversation — all in one command view.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/overview"
                  className="group inline-flex items-center gap-0 rounded-full bg-cyan-500 px-5 py-3 text-sm font-medium text-[#050B14] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cyan-400 hover:shadow-[0_0_30px_-6px_rgba(34,211,238,0.4)] active:scale-[0.98]"
                >
                  Enter command view
                  <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
                <Link
                  href="/match-center"
                  className="group inline-flex items-center gap-0 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm text-slate-200 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/25 hover:bg-white/[0.08] active:scale-[0.98]"
                >
                  Live match center
                  <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Live metric strip */}
            <ScrollReveal delay={0.26}>
              <div className="mt-10 flex flex-wrap gap-6 md:gap-8">
                {liveMetrics.map((m) => (
                  <div key={m.label} className="group">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{m.label}</p>
                    <p className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-semibold tracking-tight text-slate-100">{m.value}</span>
                      <span className="text-xs text-slate-500">{m.unit}</span>
                      <span className="text-[10px] text-emerald-400">{m.trend}</span>
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right panel — animated status surface */}
          <ScrollReveal delay={0.12}>
            <TiltSurface className="h-full">
              <div className="relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-900/40 p-6 backdrop-blur-sm panel-edge">
                {/* Liquid glass inner highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />

                <div className="scan-ring mb-5" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Mission status</p>
                    <p className="mt-1 text-2xl font-semibold text-cyan-200">Operational</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10">
                    <Activity className="h-5 w-5 text-emerald-300" />
                  </div>
                </div>

                {/* Mini bento inside panel */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs">
                  <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-300/60" />
                      <span className="text-slate-400">Live attendance</span>
                    </div>
                    <p className="mt-1.5 text-xl font-semibold tracking-tight text-white">42,817</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <p className="text-slate-500">Telemetry</p>
                    <p className="mt-1 text-slate-200">Live + fallback</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <p className="text-slate-500">AI advisories</p>
                    <p className="mt-1 text-slate-200">Vision-assisted</p>
                  </div>
                </div>
              </div>
            </TiltSurface>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── BENTO QUICK LINKS ─── */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {quickLinks.map((item, index) => (
          <ScrollReveal key={item.href} delay={index * 0.06}>
            <Link
              href={item.href}
              className={`${item.colSpan} group relative block overflow-hidden rounded-[2rem] border border-white/[0.07] bg-slate-900/40 p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/15 hover:bg-slate-900/60 md:p-8`}
            >
              {/* Subtle inner highlight on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-cyan-300/30 group-hover:bg-cyan-500/10">
                  <item.icon className="h-5 w-5 text-cyan-300/70 transition-colors duration-300 group-hover:text-cyan-300" />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-white md:text-xl">{item.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200/80 transition-colors group-hover:text-cyan-200">
                  Open section
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </section>
    </main>
  );
}
