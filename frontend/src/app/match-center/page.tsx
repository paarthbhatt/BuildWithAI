import LiveMatchCenter from "@/components/LiveMatchCenter";
import ScrollReveal from "@/components/ScrollReveal";

export default function MatchCenterPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-10 pt-10 md:px-8">
      <ScrollReveal>
        <LiveMatchCenter />
      </ScrollReveal>
    </main>
  );
}
