import { entries } from "@/lib/entries";
import { EntrySection } from "@/components/journal/entry-section";
import { BottomNav } from "@/components/journal/bottom-nav";

const SCROLL_CONTAINER_ID = "journal-scroll";

export default function Home() {
  return (
    <>
      <main
        id={SCROLL_CONTAINER_ID}
        className="h-dvh w-full snap-y snap-mandatory overflow-y-auto overscroll-y-none"
      >
        {entries.map((entry) => (
          <EntrySection key={entry.id} entry={entry} />
        ))}
      </main>
      <BottomNav entries={entries} scrollContainerId={SCROLL_CONTAINER_ID} />
    </>
  );
}
