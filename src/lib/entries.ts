export type EntryBase = {
  id: string;
  date: string; // ISO
};

export type TextEntry = EntryBase & {
  kind: "text";
  body: string;
};

export type PhotoEntry = EntryBase & {
  kind: "photo";
  caption: string;
};

export type SongEntry = EntryBase & {
  kind: "song";
  caption: string;
  /** semitone offsets from a root note, played in sequence */
  notes: number[];
};

export type SketchEntry = EntryBase & {
  kind: "sketch";
  caption: string;
};

export type Entry = TextEntry | PhotoEntry | SongEntry | SketchEntry;

export const entries: Entry[] = [
  {
    id: "2026-07-08-porch",
    date: "2026-07-08",
    kind: "text",
    body: "sat on the porch until the streetlights came on. didn't write anything down. that was the point.",
  },
  {
    id: "2026-07-05-negatives",
    date: "2026-07-05",
    kind: "photo",
    caption: "the light through the kitchen window, 7:14am. still haven't found a better reason to wake up early.",
  },
  {
    id: "2026-07-02-loop",
    date: "2026-07-02",
    kind: "song",
    caption: "four notes, looping. can't tell if it's a chorus or just a habit.",
    notes: [0, 3, 7, 5],
  },
  {
    id: "2026-06-29-drag",
    date: "2026-06-29",
    kind: "sketch",
    caption: "a little drag toy. built it instead of answering email. no regrets.",
  },
  {
    id: "2026-06-24-weight",
    date: "2026-06-24",
    kind: "text",
    body: "body and mind like two legs — fix both or you're still limping.",
  },
  {
    id: "2026-06-19-tape",
    date: "2026-06-19",
    kind: "photo",
    caption: "found the old cassette deck in a box marked 'misc.' pressed play out of habit.",
  },
];
