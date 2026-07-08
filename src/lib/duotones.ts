export type Duotone = {
  name: string;
  bg: string;
  ink: string;
};

// Curated bg/ink pairs. Bg and ink are chosen from contrasting hue
// families (not shades of the same color) for a bold, two-tone look, and
// each pair is verified at WCAG AA 4.5:1 or better so it's safe to render
// body text with directly.
export const DUOTONES: Duotone[] = [
  { name: "lagoon", bg: "#052220", ink: "#FF7A52" }, // teal / coral
  { name: "pine", bg: "#07220F", ink: "#FF3D94" }, // forest / hot pink
  { name: "sky", bg: "#0A1330", ink: "#FFC94D" }, // navy / gold
  { name: "blush", bg: "#2E0620", ink: "#8C7BFF" }, // magenta / indigo
  { name: "mustard", bg: "#241503", ink: "#3FCFFF" }, // amber-brown / electric blue
  { name: "lavender", bg: "#170B2E", ink: "#C6FF4D" }, // violet / chartreuse
  { name: "graphite", bg: "#0D0D0D", ink: "#F5E9C9" }, // near-black / warm cream
  { name: "coral", bg: "#240705", ink: "#4DFFE0" }, // rust / teal-cyan
  { name: "sage", bg: "#131905", ink: "#C77DFF" }, // olive / violet
  { name: "periwinkle", bg: "#100B33", ink: "#FF8A65" }, // blue-violet / coral-salmon
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
