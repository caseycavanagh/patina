export type Duotone = {
  name: string;
  bg: string;
  ink: string;
};

// Curated bg/ink pairs. Each ink color is chosen for contrast against its
// bg (WCAG AA 4.5:1 or better, verified at authoring time), so any pairing
// is safe to render body text with directly.
export const DUOTONES: Duotone[] = [
  { name: "lagoon", bg: "#0B3B36", ink: "#4DF7D0" },
  { name: "pine", bg: "#0B3D2E", ink: "#EFEEDF" },
  { name: "sky", bg: "#0E2A4A", ink: "#7FD4FF" },
  { name: "blush", bg: "#3B0F1F", ink: "#FF8FA3" },
  { name: "mustard", bg: "#2E2308", ink: "#FFD166" },
  { name: "lavender", bg: "#241B3D", ink: "#C9B6FF" },
  { name: "graphite", bg: "#1A1A1A", ink: "#F5E9C9" },
  { name: "coral", bg: "#2A1210", ink: "#FF7A59" },
  { name: "sage", bg: "#1C2A1A", ink: "#C8E6A0" },
  { name: "periwinkle", bg: "#171A3D", ink: "#A8B4F0" },
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
