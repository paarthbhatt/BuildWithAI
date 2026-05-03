import CrowdAnalyzer from "@/components/CrowdAnalyzer";
import LiveMatchCenter from "@/components/LiveMatchCenter";
import ScrollReveal from "@/components/ScrollReveal";

export default function InsightsPage() {
  return (
    <main className="mx-auto max-w-[1320px] space-y-8 px-4 pb-10 pt-10 md:px-8">
      <ScrollReveal>
        <CrowdAnalyzer />
      </ScrollReveal>
      <ScrollReveal>
        <LiveMatchCenter />
      </ScrollReveal>
    </main>
  );
}
