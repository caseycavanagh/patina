"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Entry } from "@/lib/entries";
import { formatShortDate } from "@/lib/utils";

export function BottomNav({
  entries,
  scrollContainerId,
}: {
  entries: Entry[];
  scrollContainerId: string;
}) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.getElementById(scrollContainerId);
    if (!root) return;

    const observer = new IntersectionObserver(
      (visibleEntries) => {
        const mostVisible = visibleEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = mostVisible?.target.getAttribute("data-entry-id");
        if (id) setActiveId(id);
      },
      { root, threshold: [0.5, 0.75] }
    );

    root.querySelectorAll("[data-entry-id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scrollContainerId]);

  useEffect(() => {
    navRef.current
      ?.querySelector(`[data-nav-id="${activeId}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex items-center gap-1">
        <div
          ref={navRef}
          className="flex max-w-[min(78vw,20rem)] items-center gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {entries.map((entry) => (
            <button
              key={entry.id}
              data-nav-id={entry.id}
              onClick={() => scrollTo(entry.id)}
              className="shrink-0 font-mono text-xs tracking-widest text-white mix-blend-difference transition-opacity"
              style={{ opacity: activeId === entry.id ? 1 : 0.45 }}
            >
              {formatShortDate(entry.date)}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo(entries[0].id)}
          aria-label="Jump to latest entry"
          className="-mt-6 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-white text-white mix-blend-difference"
        >
          <ArrowUp className="size-5" />
        </button>
      </div>
    </div>
  );
}
