export type Duotone = {
  name: string;
  bg: string;
  ink: string;
};

// Curated bg/ink pairs. Each ink color is chosen for contrast against its
// bg (WCAG AA 4.5:1 or better, verified at authoring time), so any pairing
// is safe to render body text with directly.
export const DUOTONES: Duotone[] = [
  { name: "lagoon", bg: "#061F1B", ink: "#3FFFC9" },
  { name: "pine", bg: "#081F17", ink: "#EFEEDF" },
  { name: "sky", bg: "#050E1E", ink: "#5FE0FF" },
  { name: "blush", bg: "#1A0509", ink: "#FF6B92" },
  { name: "mustard", bg: "#140F02", ink: "#FFC94D" },
  { name: "lavender", bg: "#120C22", ink: "#BB8CFF" },
  { name: "graphite", bg: "#0D0D0D", ink: "#F5E9C9" },
  { name: "coral", bg: "#170908", ink: "#FF6A45" },
  { name: "sage", bg: "#0E160D", ink: "#B9E86B" },
  { name: "periwinkle", bg: "#0B0D22", ink: "#93A4FF" },
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
