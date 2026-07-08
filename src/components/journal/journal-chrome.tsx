"use client";

import { useEffect, useRef, useState } from "react";
import { Entry } from "@/lib/entries";
import { duotoneForIndex } from "@/lib/duotones";
import { lerpColor } from "@/lib/color";
import { Avatar } from "@/components/ui/avatar";
import { BottomNav } from "@/components/journal/bottom-nav";

export function JournalChrome({
  entries,
  scrollContainerId,
}: {
  entries: Entry[];
  scrollContainerId: string;
}) {
  const duotones = entries.map((_, i) => duotoneForIndex(i));
  const [bg, setBg] = useState(duotones[0]?.bg ?? "#000");
  const [activeIndex, setActiveIndex] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const root = document.getElementById(scrollContainerId);
    if (!root || entries.length === 0) return;

    function update() {
      frame.current = null;
      const el = root as HTMLElement;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const fraction = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      const continuous = fraction * (entries.length - 1);
      const i0 = Math.max(0, Math.min(entries.length - 1, Math.floor(continuous)));
      const i1 = Math.max(0, Math.min(entries.length - 1, i0 + 1));
      const t = continuous - i0;

      setBg(lerpColor(duotones[i0].bg, duotones[i1].bg, t));
      setActiveIndex(Math.max(0, Math.min(entries.length - 1, Math.round(continuous))));
    }

    function onScroll() {
      if (frame.current == null) {
        frame.current = requestAnimationFrame(update);
      }
    }

    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerId, entries.length]);

  const activeEntry = entries[activeIndex];
  const activeDuotone = duotones[activeIndex];

  if (!activeEntry) return null;

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: bg }}
      />

      <header
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-5"
        style={{
          background: `linear-gradient(to bottom, ${bg} 60%, ${bg}00 100%)`,
        }}
      >
        <span
          className="text-base font-medium tracking-tight transition-colors duration-500"
          style={{ color: activeDuotone.ink }}
        >
          patina.
        </span>
        <Avatar
          key={activeEntry.id}
          className="size-3.5 animate-[chrome-fade-in_0.5s_ease] transition-colors duration-500"
          style={{ background: activeDuotone.ink }}
          aria-hidden
        />
      </header>

      <BottomNav entries={entries} activeId={activeEntry.id} />
    </>
  );
}
