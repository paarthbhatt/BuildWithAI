"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/overview", label: "Overview" },
  { href: "/match-center", label: "Match Center" },
  { href: "/operations", label: "Gate Operations" },
  { href: "/insights", label: "AI Insights" },
  { href: "/community", label: "Community" },
];

function navClass(isActive: boolean) {
  return isActive
    ? "text-cyan-200"
    : "text-slate-300 transition-colors hover:text-cyan-200";
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image src="/cricket_stadium_background.png" alt="Stadium atmosphere backdrop" fill sizes="100vw" className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,19,0.76)_0%,rgba(2,8,19,0.93)_36%,rgba(2,8,19,1)_100%)]" />
        <div className="ambient-orb ambient-orb-cyan" />
        <div className="ambient-orb ambient-orb-indigo" />
        <div className="grain-layer" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030b18]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-cyan-300/30">
              <Image src="/cricket_pitch.png" alt="OverFlow logo mark" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">OverFlow</p>
              <p className="text-xs text-slate-400">Stadium Operations Console</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navClass(pathname === item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.15em] text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure Live
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-12 border-t border-white/10 bg-[#020914]/80">
        <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">OverFlow</p>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Built for professional crowd operations with graceful fallbacks and live communication.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Navigation</p>
            <div className="mt-2 flex flex-col gap-1 text-sm text-slate-400">
              {navItems.map((item) => (
                <Link key={`footer-${item.href}`} href={item.href} className="hover:text-cyan-200">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">System status</p>
            <p className="mt-2 text-sm text-slate-400">Live telemetry • AI advisory • Pseudo-data continuity</p>
          </div>
        </div>
      </footer>
    </>
  );
}
