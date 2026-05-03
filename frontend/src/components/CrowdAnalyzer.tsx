"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";
import TiltSurface from "@/components/TiltSurface";

export default function CrowdAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ level: string; advisory: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackResult, setIsFallbackResult] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setIsFallbackResult(false);
    }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze-crowd`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");
      setResult(data);
      setIsFallbackResult(false);
      
      // Auto-post to feed
      const feedRes = await fetch(`${API_BASE_URL}/api/feed/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "AI Monitor",
          message: `Update from Gate Cam: ${data.advisory}`
        })
      });
      if (!feedRes.ok) {
        throw new Error("Failed to publish advisory to the live feed");
      }
      
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setResult({
        level: "Medium",
        advisory: "Manual fallback: keep steward coverage at entry checkpoints and split arrivals between adjacent gates.",
      });
      setIsFallbackResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-panel panel-edge p-6 md:p-8">
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <Sparkles className="h-6 w-6 text-cyan-300" /> Vision control deck
      </h2>
      <p className="mb-6 text-sm text-slate-300">
        Upload crowd captures from gate cameras. If AI is unavailable, the system still returns a safe advisory fallback.
      </p>
      
      <div className="flex flex-col gap-6 md:flex-row">
        <TiltSurface className="flex-1">
          <label className="group relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800/50 transition-colors hover:border-cyan-400">
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                <div className="relative z-10 flex flex-col items-center rounded-lg bg-black/50 p-4 backdrop-blur-sm">
                  <UploadCloud className="mb-2 h-8 w-8 text-white" />
                  <span className="text-sm font-medium text-white">Change Image</span>
                </div>
              </>
            ) : (
              <div className="relative h-full w-full">
                <Image
                  src="/ipl-match-stadium-pic.png"
                  alt="Crowd analysis sample frame"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/55 to-transparent" />
                <div className="relative flex h-full flex-col items-center justify-center pb-6 pt-5">
                  <UploadCloud className="mb-3 h-10 w-10 text-slate-200" />
                  <p className="mb-2 text-sm text-slate-200">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-300">Crowd images (JPG, PNG)</p>
                </div>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
          </label>
          
          <button
            onClick={analyze}
            disabled={!file || loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-medium text-white transition-colors hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? "Analyzing via Gemini..." : "Analyze Density"}
          </button>
        </TiltSurface>

        <TiltSurface className="flex-1">
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/5 bg-slate-800/30 p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_20%,rgba(34,211,238,0.2),transparent)]" />
            <Image src="/stadium_crowd.png" alt="Stadium crowd texture" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#041120]/85" />
          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-900/20 p-6 text-center text-red-400 backdrop-blur-sm">
               <AlertCircle className="mb-2 h-8 w-8" />
               <p>{error}</p>
            </div>
          )}
          {!result && !error && !loading && (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm text-center">
              Upload an image of a gate to get an AI-generated advisory.
            </div>
          )}
          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-blue-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm animate-pulse">Gemini Vision is analyzing the crowd...</p>
            </div>
          )}
          
          <AnimatePresence>
            {result && !loading && !error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 h-full flex flex-col justify-center"
              >
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated Density</span>
                  <div className={`mt-1 text-2xl font-bold ${
                    result.level === "Low" ? "text-emerald-400" : 
                    result.level === "Medium" ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {result.level}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Advisory</span>
                  <p className="mt-2 border-l-2 border-cyan-500 bg-gradient-to-r from-cyan-500/10 to-transparent py-1 pl-4 text-lg font-light italic leading-relaxed text-slate-200">
                    {result.advisory}
                  </p>
                  {isFallbackResult && (
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-amber-200">
                      Fallback advisory mode active
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </TiltSurface>
      </div>
    </section>
  );
}
