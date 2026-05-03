import Image from "next/image";
import { BellRing, Camera, CircleGauge } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import TiltSurface from "@/components/TiltSurface";

const highlights = [
  {
    title: "Gate telemetry layer",
    description: "Live status classes, queue pressure, and steward-ready recommendations per gate.",
    image: "/stadium_gates.png",
    icon: CircleGauge,
  },
  {
    title: "Visual crowd diagnostics",
    description: "Image-based density assessment with advisory generation and fallback continuity.",
    image: "/stadium_crowd.png",
    icon: Camera,
  },
  {
    title: "Command channel",
    description: "Operational broadcast stream for organizer directives and real-time fan notes.",
    image: "/ipl-gate.png",
    icon: BellRing,
  },
];

export default function OverviewPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-10 pt-10 md:px-8">
      <ScrollReveal>
        <section className="glass-panel panel-edge overflow-hidden rounded-3xl">
          <div className="grid items-stretch gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-7 md:p-10">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-500/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                Matchday live orchestration
              </p>
              <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.03em] text-white md:text-6xl">
                Professional live stadium control room
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
                Monitor every gate, react to crowd pressure with confidence, and keep communication clear between stewards, organizers, and fans.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <article className="rounded-xl border border-white/10 bg-slate-900/55 p-3 card-float">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Coverage</p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">8 gates</p>
                </article>
                <article className="rounded-xl border border-white/10 bg-slate-900/55 p-3 card-float">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Feed sync</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-200">Live + fallback</p>
                </article>
                <article className="rounded-xl border border-white/10 bg-slate-900/55 p-3 card-float">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Response mode</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-200">Operational</p>
                </article>
              </div>
            </div>
            <div className="relative min-h-[320px] lg:min-h-full">
              <Image src="/cricket-stadium-big.png" alt="Large stadium operations visual" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(3,10,20,0.65)_0%,rgba(3,10,20,0.2)_45%,rgba(3,10,20,0.86)_100%)] parallax-scan" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map((item, index) => (
          <ScrollReveal key={item.title} delay={index * 0.08}>
            <TiltSurface>
              <article className="glass-panel panel-edge overflow-hidden rounded-2xl border border-white/10">
                <div className="relative h-32">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041120] to-transparent" />
                </div>
                <div className="p-4">
                  <item.icon className="mb-2 h-5 w-5 text-cyan-300" />
                  <h2 className="text-base font-semibold text-slate-100">{item.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                </div>
              </article>
            </TiltSurface>
          </ScrollReveal>
        ))}
      </section>
    </main>
  );
}
