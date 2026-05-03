import CommunityFeed from "@/components/CommunityFeed";
import ScrollReveal from "@/components/ScrollReveal";

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-10 pt-10 md:px-8">
      <ScrollReveal>
        <CommunityFeed />
      </ScrollReveal>
    </main>
  );
}
