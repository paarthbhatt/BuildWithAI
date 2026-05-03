import GateGrid from "@/components/GateGrid";
import ScrollReveal from "@/components/ScrollReveal";

export default function OperationsPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-10 pt-10 md:px-8">
      <ScrollReveal>
        <GateGrid />
      </ScrollReveal>
    </main>
  );
}
