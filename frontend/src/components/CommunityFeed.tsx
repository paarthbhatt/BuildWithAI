"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";
import TiltSurface from "@/components/TiltSurface";
import { communityFeedFallback, FeedItem, getRandomCommunityUpdate } from "@/lib/mockData";

export default function CommunityFeed() {
  const [serverFeed, setServerFeed] = useState<FeedItem[]>(communityFeedFallback);
  const [generatedFeed, setGeneratedFeed] = useState<FeedItem[]>([]);
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("Fan");
  const [isPosting, setIsPosting] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  const feed = useMemo(() => {
    const combined = [...generatedFeed, ...serverFeed];
    const seen = new Set<string>();
    const deduped: FeedItem[] = [];

    for (const item of combined) {
      const key = `${item.author}|${item.message}|${item.timestamp}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
      if (deduped.length >= 36) break;
    }

    return deduped;
  }, [generatedFeed, serverFeed]);

  useEffect(() => {
    let isActive = true;
    let pulseTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchFeed = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/feed`);
        if (!response.ok) {
          throw new Error("Feed unavailable");
        }
        const data = (await response.json()) as FeedItem[];

        if (isActive) {
          setServerFeed(data.length > 0 ? data : communityFeedFallback);
          setFallbackMode(false);
        }
      } catch {
        if (isActive) {
          setFallbackMode(true);
          setServerFeed((current) => (current.length > 0 ? current : communityFeedFallback));
        }
      }
    };

    void fetchFeed();
    const poll = setInterval(() => {
      void fetchFeed();
    }, 4000);

    const runPseudoPulse = () => {
      if (!isActive) return;
      setGeneratedFeed((current) => [getRandomCommunityUpdate(), ...current].slice(0, 24));

      const nextDelay = 7000 + Math.floor(Math.random() * 8000);
      pulseTimer = setTimeout(runPseudoPulse, nextDelay);
    };

    pulseTimer = setTimeout(runPseudoPulse, 6000);

    return () => {
      isActive = false;
      clearInterval(poll);
      if (pulseTimer) {
        clearTimeout(pulseTimer);
      }
    };
  }, []);

  const totalMessages = useMemo(() => feed.length, [feed.length]);

  const postMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    setIsPosting(true);
    const optimisticPost: FeedItem = {
      author,
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/feed/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: optimisticPost.author, message: optimisticPost.message }),
      });

      if (!response.ok) {
        throw new Error("Unable to publish");
      }

      const refreshResponse = await fetch(`${API_BASE_URL}/api/feed`);
      if (!refreshResponse.ok) {
        throw new Error("Unable to refresh");
      }
      const refreshed = (await refreshResponse.json()) as FeedItem[];
      setServerFeed(refreshed.length > 0 ? refreshed : communityFeedFallback);
      setGeneratedFeed((current) => [optimisticPost, ...current].slice(0, 24));
      setFallbackMode(false);
      setMessage("");
    } catch {
      setGeneratedFeed((current) => [optimisticPost, ...current].slice(0, 24));
      setFallbackMode(true);
      setMessage("");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <section className="glass-panel panel-edge flex h-[880px] flex-col overflow-hidden">
      <div className="relative border-b border-white/10 p-6">
        <Image src="/stadium_crowd.png" alt="Live crowd chatter backdrop" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/95 via-[#071324]/80 to-[#071324]/60" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
              <MessageSquare className="h-5 w-5 text-cyan-300" /> Community feed
            </h2>
            <p className="mt-1 text-sm text-slate-300">{totalMessages} live updates this session</p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
              fallbackMode ? "border-amber-400/40 bg-amber-500/15 text-amber-200" : "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
            }`}
          >
            {fallbackMode ? "Pseudo stream" : "Live stream"}
          </span>
        </div>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-white/10 flex-1 space-y-4 overflow-y-auto p-6">
        <AnimatePresence>
          {feed.map((post, index) => {
            const isOfficial = post.author === "Organizer" || post.author === "AI Monitor";
            return (
              <motion.article
                key={`${post.timestamp}-${index}-${post.author}`}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                layout
                className={`rounded-2xl border p-4 ${
                  isOfficial
                    ? "border-cyan-400/30 bg-cyan-900/20 shadow-[0_16px_36px_-26px_rgba(34,211,238,0.9)]"
                    : "border-white/8 bg-slate-800/45"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-100">
                    {post.author}
                    {isOfficial && (
                      <span className="ml-2 rounded-md border border-cyan-300/30 bg-cyan-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-cyan-200">
                        Official
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{post.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{post.message}</p>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0 border-t border-white/10 bg-black/20 p-4">
        <TiltSurface maxTilt={5}>
          <form onSubmit={postMessage} className="grid grid-cols-1 gap-3 md:grid-cols-[170px_1fr]">
            <select
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors focus:border-cyan-400 focus:outline-none"
            >
              <option value="Fan">Post as Fan</option>
              <option value="Organizer">Post as Organizer</option>
            </select>
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Share a gate update..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-4 pr-12 text-sm text-slate-100 transition-colors placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                disabled={isPosting}
              />
              <button
                type="submit"
                disabled={isPosting || !message.trim()}
                className="absolute bottom-2 right-2 top-2 flex aspect-square items-center justify-center rounded-lg bg-cyan-600 text-white transition-colors hover:bg-cyan-500 disabled:bg-slate-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </TiltSurface>
      </div>
    </section>
  );
}
