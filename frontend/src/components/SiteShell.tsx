"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/overview", label: "Overview" },
  { href: "/match-center", label: "Match Center" },
  { href: "/operations", label: "Gate Ops" },
  { href: "/insights", label: "AI Insights" },
  { href: "/community", label: "Community" },
];

function navClass(isActive: boolean) {
  return isActive
    ? "text-cyan-200"
    : "text-slate-400 transition-colors duration-300 hover:text-cyan-200";
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image src="/cricket_stadium_background.png" alt="" fill sizes="100vw" className="object-cover opacity-15" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,19,0.8)_0%,rgba(2,8,19,0.95)_40%,rgba(2,8,19,1)_100%)]" />
        <div className="ambient-orb ambient-orb-cyan" />
        <div className="ambient-orb ambient-orb-indigo" />
        <div className="grain-layer" />
      </div>

      {/* Floating glass pill nav */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav className="pointer-events-auto flex w-full max-w-[1200px] items-center justify-between rounded-full border border-white/[0.08] bg-[#030b18]/75 px-4 py-2.5 backdrop-blur-xl md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-cyan-300/25">
              <Image src="/cricket_pitch.png" alt="" fill sizes="36px" className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/90">OverFlow</p>
              <p className="text-[10px] text-slate-500">Operations</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-xs ${navClass(pathname === item.href)}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-200 md:flex">
              <ShieldCheck className="h-3 w-3" /> Live
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:bg-white/5 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl md:hidden">
          <div className="flex h-full flex-col items-center justify-center gap-6">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`text-2xl font-medium tracking-tight text-slate-200 opacity-0 transition-all duration-500 hover:text-cyan-200 ${
                  pathname === item.href ? "text-cyan-200" : ""
                }`}
                style={{ animation: `fadeSlideUp 0.5s ${i * 80}ms forwards`, animationFillMode: "forwards" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer for floating nav */}
      <div className="h-[72px]" />

      {children}

      {/* Footer */}
      <footer className="mt-16 border-t border-white/[0.06] bg-[#020914]/60 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">OverFlow</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Built for professional crowd operations with graceful fallbacks and live communication.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Navigation</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
              {navItems.map((item) => (
                <Link key={`footer-${item.href}`} href={item.href} className="hover:text-cyan-200">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">System</p>
            <p className="mt-3 text-sm text-slate-500">Live telemetry / AI advisory / Real-time simulation</p>
          </div>
        </div>
      </footer>
    </>
  );
}
