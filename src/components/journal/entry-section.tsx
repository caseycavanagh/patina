import { Entry } from "@/lib/entries";
import { duotoneFor } from "@/lib/duotones";
import { PhotoFrame } from "@/components/journal/photo-frame";
import { SongSketch } from "@/components/journal/song-sketch";
import { MicroSketch } from "@/components/journal/micro-sketch";

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
      className="journal-entry relative flex min-h-dvh w-full flex-col pt-24"
      style={{ color: duotone.ink }}
    >
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
        <p className="mt-5 font-mono text-xs tracking-widest uppercase opacity-70">
          {entry.time ? `${entry.time} · ${KIND_LABEL[entry.kind]}` : KIND_LABEL[entry.kind]}
        </p>
      </div>
    </section>
  );
}
