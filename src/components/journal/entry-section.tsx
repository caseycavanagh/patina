import { Entry } from "@/lib/entries";
import { duotoneFor } from "@/lib/duotones";
import { formatShortDate, formatLongDate } from "@/lib/utils";
import { PhotoFrame } from "@/components/journal/photo-frame";
import { SongSketch } from "@/components/journal/song-sketch";
import { MicroSketch } from "@/components/journal/micro-sketch";
import { Avatar } from "@/components/ui/avatar";

const KIND_LABEL: Record<Entry["kind"], string> = {
  text: "entry",
  photo: "photo",
  song: "song sketch",
  sketch: "sandbox",
};

export function EntrySection({ entry }: { entry: Entry }) {
  const duotone = duotoneFor(entry.id);

  return (
    <section
      id={entry.id}
      data-entry-id={entry.id}
      className="journal-entry relative flex min-h-dvh w-full snap-start flex-col"
      style={{ background: duotone.bg, color: duotone.ink }}
    >
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <span className="text-base font-medium tracking-tight">patina.</span>
        <Avatar className="size-3.5" style={{ background: duotone.ink }} aria-hidden />
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {entry.kind === "photo" && (
          <PhotoFrame duotone={duotone} seed={entry.id} />
        )}
        {entry.kind === "song" && (
          <SongSketch notes={entry.notes} duotone={duotone} />
        )}
        {entry.kind === "sketch" && <MicroSketch duotone={duotone} />}
      </div>

      <div className="px-6 pb-32">
        <p className="max-w-[30ch] text-2xl leading-snug font-normal sm:text-3xl">
          {entry.kind === "text" ? entry.body : entry.caption}
        </p>
        <p className="mt-4 font-mono text-xs tracking-widest uppercase opacity-70">
          <time dateTime={entry.date} title={formatLongDate(entry.date)}>
            {formatShortDate(entry.date)}
          </time>
          {" · "}
          {KIND_LABEL[entry.kind]}
        </p>
      </div>
    </section>
  );
}
