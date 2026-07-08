import { Entry } from "@/lib/entries";
import { duotoneForIndex } from "@/lib/duotones";
import { formatLongDate } from "@/lib/utils";
import { PhotoFrame } from "@/components/journal/photo-frame";
import { SongSketch } from "@/components/journal/song-sketch";
import { MicroSketch } from "@/components/journal/micro-sketch";
import { DateStamp } from "@/components/journal/date-stamp";

export function EntrySection({ entry, index }: { entry: Entry; index: number }) {
  const duotone = duotoneForIndex(index);

  return (
    <section
      id={entry.id}
      data-entry-id={entry.id}
      className="journal-entry relative flex min-h-dvh w-full snap-start snap-always flex-col justify-center gap-8 pt-24 pb-32"
      style={{ color: duotone.ink }}
    >
      {entry.kind !== "text" && (
        <div className="flex items-center justify-center px-6">
          {entry.kind === "photo" && (
            <PhotoFrame duotone={duotone} seed={entry.id} />
          )}
          {entry.kind === "song" && (
            <SongSketch notes={entry.notes} duotone={duotone} />
          )}
          {entry.kind === "sketch" && <MicroSketch duotone={duotone} />}
        </div>
      )}

      <div className="px-6">
        <div className="flex items-baseline gap-3">
          <time dateTime={entry.date} title={formatLongDate(entry.date)}>
            <DateStamp date={entry.date} color={duotone.ink} className="text-lg" />
          </time>
          {entry.time && (
            <span className="font-mono text-xs tracking-widest uppercase opacity-70">
              {entry.time}
            </span>
          )}
        </div>
        <p className="mt-3 max-w-[30ch] text-2xl leading-snug font-normal sm:text-3xl">
          {entry.kind === "text" ? entry.body : entry.caption}
        </p>
      </div>
    </section>
  );
}
