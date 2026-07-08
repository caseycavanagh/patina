export type Duotone = {
  name: string;
  bg: string;
  ink: string;
};

// Curated bg/ink pairs. Each ink color is chosen for contrast against its
// bg, so any pairing is safe to render body text with directly.
export const DUOTONES: Duotone[] = [
  { name: "lagoon", bg: "#7FE8D6", ink: "#B3261E" },
  { name: "pine", bg: "#0B3D2E", ink: "#EFEEDF" },
  { name: "sky", bg: "#8EC7F5", ink: "#0B3D2E" },
  { name: "blush", bg: "#F6C9CE", ink: "#6B1E3C" },
  { name: "mustard", bg: "#F2C14E", ink: "#3A2B1D" },
  { name: "lavender", bg: "#D8CBFA", ink: "#2E1A47" },
  { name: "graphite", bg: "#232323", ink: "#F5E9C9" },
  { name: "coral", bg: "#FF8A65", ink: "#241B2F" },
  { name: "sage", bg: "#C4D6B0", ink: "#2F3B2A" },
  { name: "periwinkle", bg: "#A8B4F0", ink: "#14143C" },
];

/** Deterministic hash so a given entry always renders the same duotone. */
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function duotoneFor(seed: string): Duotone {
  return DUOTONES[hash(seed) % DUOTONES.length];
}
