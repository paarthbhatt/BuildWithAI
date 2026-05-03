import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, CircleGauge, MessageSquare, Radar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import TiltSurface from "@/components/TiltSurface";

const quickLinks = [
  { href: "/overview", label: "Overview", icon: Radar, description: "Stadium-wide command overview." },
  { href: "/operations", label: "Gate Operations", icon: CircleGauge, description: "Live gate pressure and queue control." },
  { href: "/insights", label: "AI Insights", icon: Camera, description: "Crowd analysis and advisory engine." },
  { href: "/community", label: "Community", icon: MessageSquare, description: "Operational feed with fan updates." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-10 pt-10 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071223]/70 p-8 md:p-12">
        <Image src="/cricket-stadium-big.png" alt="Hero stadium view" fill sizes="100vw" className="object-cover opacity-35" priority />
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_10%_10%,rgba(34,211,238,0.22),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061121]/92 via-[#061121]/72 to-[#061121]/45" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ScrollReveal>
            <div>
              <p className="mb-3 inline-flex rounded-full border border-cyan-300/35 bg-cyan-500/15 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                Live stadium intelligence
              </p>
              <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-6xl">
                See crowd pressure before it becomes chaos.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
                An out-of-the-box matchday control surface with 3D interactions, live telemetry, AI visual advisories, and real-time crowd conversation.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/overview"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-500"
                >
                  Enter command view <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/match-center"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-slate-100 transition-colors hover:bg-white/10"
                >
                  Open live match center
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <TiltSurface className="h-full">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-900/60 p-6">
                <div className="scan-ring mb-4" />
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Mission status</p>
                <p className="mt-1 text-3xl font-semibold text-cyan-200">Operational</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-slate-400">Telemetry</p>
                    <p className="mt-1 text-slate-100">Live + fallback</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-slate-400">Synchronization</p>
                    <p className="mt-1 text-slate-100">5s polling</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-slate-400">Match engine</p>
                    <p className="mt-1 text-slate-100">Real-time simulation</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-slate-400">AI advisories</p>
                    <p className="mt-1 text-slate-100">Vision-assisted</p>
                  </div>
                </div>
              </div>
            </TiltSurface>
          </ScrollReveal>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item, index) => (
          <ScrollReveal key={item.href} delay={index * 0.07}>
            <TiltSurface>
              <Link
                href={item.href}
                className="group block rounded-2xl border border-white/10 bg-slate-900/50 p-5 transition-colors hover:bg-slate-900/70"
              >
                <item.icon className="h-5 w-5 text-cyan-300" />
                <h2 className="mt-3 text-lg font-semibold text-white">{item.label}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-200">
                  Open section <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </TiltSurface>
          </ScrollReveal>
        ))}
      </section>
    </main>
  );
}
