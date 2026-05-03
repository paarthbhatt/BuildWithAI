"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Activity, CircleDot, Radio, Trophy, Users } from "lucide-react";
import TiltSurface from "@/components/TiltSurface";

type MatchState = {
  runs: number;
  wickets: number;
  balls: number;
  target: number;
  striker: string;
  nonStriker: string;
  bowler: string;
  strikerRuns: number;
  strikerBalls: number;
  nonStrikerRuns: number;
  nonStrikerBalls: number;
  bowlerFigures: string;
  events: string[];
};

const batters = ["R. Sharma", "V. Kohli", "S. Yadav", "R. Pant", "H. Pandya", "R. Jadeja"];
const bowlers = ["S. Rabada", "K. Yadav", "M. Siraj", "A. Nortje"];

function formatOver(balls: number) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initialMatchState(): MatchState {
  return {
    runs: 112,
    wickets: 3,
    balls: 82,
    target: 179,
    striker: "V. Kohli",
    nonStriker: "S. Yadav",
    bowler: "S. Rabada",
    strikerRuns: 44,
    strikerBalls: 31,
    nonStrikerRuns: 21,
    nonStrikerBalls: 16,
    bowlerFigures: "3.4-0-29-1",
    events: [
      "13.4 • Rabada to Kohli • FOUR through extra cover.",
      "13.3 • Rabada to Kohli • 1 run to deep mid-wicket.",
      "13.2 • Rabada to Yadav • dot ball.",
      "13.1 • Rabada to Yadav • 2 runs, quick between wickets.",
    ],
  };
}

function simulateBall(previous: MatchState): MatchState {
  if (previous.balls >= 120 || previous.wickets >= 10 || previous.runs >= previous.target) {
    return previous;
  }

  const roll = Math.random();
  const next = { ...previous };
  const nextBall = previous.balls + 1;
  let outcomeRuns = 0;
  let eventText = "dot ball";
  let wicketFell = false;

  if (roll < 0.06) {
    wicketFell = true;
    next.wickets += 1;
    eventText = "WICKET! caught at long-on";
    next.striker = batters[Math.min(next.wickets + 1, batters.length - 1)];
    next.strikerRuns = getRandomInt(0, 8);
    next.strikerBalls = getRandomInt(1, 8);
  } else if (roll < 0.15) {
    outcomeRuns = 0;
    eventText = "dot ball";
    next.strikerBalls += 1;
  } else if (roll < 0.5) {
    outcomeRuns = 1;
    eventText = "1 run";
    next.strikerRuns += 1;
    next.strikerBalls += 1;
    [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
    [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
    [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
  } else if (roll < 0.7) {
    outcomeRuns = 2;
    eventText = "2 runs";
    next.strikerRuns += 2;
    next.strikerBalls += 1;
  } else if (roll < 0.82) {
    outcomeRuns = 3;
    eventText = "3 runs, strong running";
    next.strikerRuns += 3;
    next.strikerBalls += 1;
    [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
    [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
    [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
  } else if (roll < 0.93) {
    outcomeRuns = 4;
    eventText = "FOUR past point";
    next.strikerRuns += 4;
    next.strikerBalls += 1;
  } else {
    outcomeRuns = 6;
    eventText = "SIX over deep square";
    next.strikerRuns += 6;
    next.strikerBalls += 1;
  }

  next.runs += outcomeRuns;
  next.balls = nextBall;

  if (!wicketFell && nextBall % 6 === 0) {
    [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
    [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
    [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
    next.bowler = bowlers[getRandomInt(0, bowlers.length - 1)];
  }

  const overLabel = formatOver(nextBall);
  const strikerName = wicketFell ? previous.striker : next.nonStriker;
  const event = `${overLabel} • ${previous.bowler} to ${strikerName} • ${eventText}.`;

  next.events = [event, ...previous.events].slice(0, 8);
  return next;
}

export default function LiveMatchCenter() {
  const [state, setState] = useState<MatchState>(() => initialMatchState());

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      if (!active) return;
      setState((current) => simulateBall(current));
      timer = setTimeout(tick, getRandomInt(3500, 7000));
    };

    timer = setTimeout(tick, 4000);
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const runRate = useMemo(() => {
    const overs = state.balls / 6 || 1;
    return (state.runs / overs).toFixed(2);
  }, [state.balls, state.runs]);

  const requiredRate = useMemo(() => {
    const ballsLeft = Math.max(1, 120 - state.balls);
    const runsLeft = Math.max(0, state.target - state.runs);
    return ((runsLeft * 6) / ballsLeft).toFixed(2);
  }, [state.balls, state.runs, state.target]);

  const playingXI = [
    "R. Sharma",
    "V. Kohli",
    "S. Yadav",
    "R. Pant",
    "H. Pandya",
    "R. Jadeja",
    "A. Patel",
    "J. Bumrah",
    "K. Yadav",
    "M. Siraj",
    "A. Singh",
  ];

  return (
    <section className="glass-panel panel-edge overflow-hidden p-6 md:p-8">
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10">
        <Image src="/ipl-match-stadium-pic.png" alt="Live match center visual" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071223]/95 via-[#071223]/80 to-[#071223]/55" />
        <div className="relative z-10 p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Real-time match center</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-red-200">
              <Radio className="h-3.5 w-3.5" /> Live
            </span>
          </div>
          <p className="text-sm text-slate-300">Delhi Titans vs Mumbai Kings • 2nd innings chase</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Score</p>
            <p className="mt-1 text-3xl font-semibold text-cyan-200">
              {state.runs}/{state.wickets}
            </p>
            <p className="mt-1 text-xs text-slate-400">Overs {formatOver(state.balls)}</p>
          </article>
        </TiltSurface>
        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Target</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-200">{state.target}</p>
            <p className="mt-1 text-xs text-slate-400">Need {Math.max(0, state.target - state.runs)} runs</p>
          </article>
        </TiltSurface>
        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Run rate</p>
            <p className="mt-1 text-3xl font-semibold text-amber-200">{runRate}</p>
            <p className="mt-1 text-xs text-slate-400">Required {requiredRate}</p>
          </article>
        </TiltSurface>
        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Match phase</p>
            <p className="mt-1 text-2xl font-semibold text-rose-200">Middle overs</p>
            <p className="mt-1 text-xs text-slate-400">Pressure building</p>
          </article>
        </TiltSurface>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-300" />
              <p className="text-sm font-medium text-slate-100">Batters at crease</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-3">
                <p className="text-slate-200">{state.striker}*</p>
                <p className="text-cyan-200">
                  {state.strikerRuns} ({state.strikerBalls})
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-3">
                <p className="text-slate-200">{state.nonStriker}</p>
                <p className="text-slate-300">
                  {state.nonStrikerRuns} ({state.nonStrikerBalls})
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-3">
                <p className="text-slate-300">Bowler: {state.bowler}</p>
                <p className="text-slate-400">{state.bowlerFigures}</p>
              </div>
            </div>
          </article>
        </TiltSurface>

        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-emerald-300" />
              <p className="text-sm font-medium text-slate-100">Recent balls</p>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              {state.events.slice(0, 6).map((event, index) => (
                <p key={`${event}-${index}`} className="rounded-lg border border-white/10 bg-slate-800/45 px-2 py-1.5">
                  {event}
                </p>
              ))}
            </div>
          </article>
        </TiltSurface>

        <TiltSurface>
          <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-300" />
              <p className="text-sm font-medium text-slate-100">Playing XI</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              {playingXI.map((player) => (
                <span key={player} className="rounded-lg border border-white/10 bg-slate-800/45 px-2 py-1.5">
                  {player}
                </span>
              ))}
            </div>
          </article>
        </TiltSurface>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-cyan-200">
        <Trophy className="h-3.5 w-3.5" /> Simulated real-time score engine
      </div>
    </section>
  );
}
