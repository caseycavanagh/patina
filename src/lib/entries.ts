export type EntryBase = {
  id: string;
  date: string; // ISO
  time?: string; // e.g. "12:17am"
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
    id: "2026-07-04-newport",
    date: "2026-07-04",
    time: "12:17am",
    kind: "text",
    body: "One special thing about Newport is that it doesn't feel like a concert. It feels like a community. And the bands are a part of it. There's no place on earth like it. There is magic in those walls. And we are just lucky to be there to witness some of it.",
  },
  {
    id: "2026-06-11-play",
    date: "2026-06-11",
    time: "11:14pm",
    kind: "text",
    body: 'Doing this actually just makes me feel like being a kid. Just playing around and not worried about making a fucking outcome or "deliverable" happen with it.',
  },
];
