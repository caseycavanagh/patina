import { entries } from "@/lib/entries";
import { EntrySection } from "@/components/journal/entry-section";
import { JournalChrome } from "@/components/journal/journal-chrome";

const SCROLL_CONTAINER_ID = "journal-scroll";

export default function Home() {
  return (
    <>
      <main
        id={SCROLL_CONTAINER_ID}
        className="relative h-dvh w-full overflow-y-auto overscroll-y-none"
      >
        {entries.map((entry) => (
          <EntrySection key={entry.id} entry={entry} />
        ))}
      </main>
      <JournalChrome entries={entries} scrollContainerId={SCROLL_CONTAINER_ID} />
    </>
  );
}
